"""
GitHub Operations API for AI Assistant
Allows AI to read files, create branches, make commits, and open PRs
"""
import base64
import os
from typing import Optional, List
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx

router = APIRouter()

# GitHub configuration
GITHUB_OWNER = "renduples"
GITHUB_REPO = "afpip"
GITHUB_API = "https://api.github.com"


async def get_github_token() -> str:
    """Get GitHub token from Secret Manager or environment"""
    # Try environment first (for local dev)
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        return token
    
    # Try Secret Manager
    try:
        from google.cloud import secretmanager
        client = secretmanager.SecretManagerServiceClient()
        name = f"projects/afpi-production/secrets/github-token/versions/latest"
        response = client.access_secret_version(request={"name": name})
        return response.payload.data.decode("UTF-8")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get GitHub token: {str(e)}")


class FileReadRequest(BaseModel):
    path: str
    branch: str = "main"


class FileReadResponse(BaseModel):
    path: str
    content: str
    sha: str
    size: int


class FileWriteRequest(BaseModel):
    path: str
    content: str
    message: str
    branch: str = "main"
    create_branch: bool = False
    base_branch: str = "main"


class FileWriteResponse(BaseModel):
    path: str
    sha: str
    branch: str
    commit_url: str


class PRCreateRequest(BaseModel):
    title: str
    body: str
    head_branch: str
    base_branch: str = "main"


class PRCreateResponse(BaseModel):
    number: int
    url: str
    html_url: str
    title: str


class DirectoryListRequest(BaseModel):
    path: str = ""
    branch: str = "main"


class DirectoryItem(BaseModel):
    name: str
    path: str
    type: str  # "file" or "dir"
    size: Optional[int] = None


class DirectoryListResponse(BaseModel):
    path: str
    items: List[DirectoryItem]


@router.post("/read-file", response_model=FileReadResponse)
async def read_file(request: FileReadRequest):
    """Read a file from the repository"""
    token = await get_github_token()
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(
            f"{GITHUB_API}/repos/{GITHUB_OWNER}/{GITHUB_REPO}/contents/{request.path}",
            headers={
                "Authorization": f"Bearer {token}",
                "Accept": "application/vnd.github.v3+json",
            },
            params={"ref": request.branch}
        )
        
        if response.status_code == 404:
            raise HTTPException(status_code=404, detail=f"File not found: {request.path}")
        response.raise_for_status()
        
        data = response.json()
        
        if data.get("type") != "file":
            raise HTTPException(status_code=400, detail=f"Path is not a file: {request.path}")
        
        content = base64.b64decode(data["content"]).decode("utf-8")
        
        return FileReadResponse(
            path=data["path"],
            content=content,
            sha=data["sha"],
            size=data["size"]
        )


@router.post("/list-directory", response_model=DirectoryListResponse)
async def list_directory(request: DirectoryListRequest):
    """List contents of a directory in the repository"""
    token = await get_github_token()
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        url = f"{GITHUB_API}/repos/{GITHUB_OWNER}/{GITHUB_REPO}/contents/{request.path}"
        response = await client.get(
            url,
            headers={
                "Authorization": f"Bearer {token}",
                "Accept": "application/vnd.github.v3+json",
            },
            params={"ref": request.branch}
        )
        
        if response.status_code == 404:
            raise HTTPException(status_code=404, detail=f"Directory not found: {request.path}")
        response.raise_for_status()
        
        data = response.json()
        
        if not isinstance(data, list):
            raise HTTPException(status_code=400, detail=f"Path is not a directory: {request.path}")
        
        items = [
            DirectoryItem(
                name=item["name"],
                path=item["path"],
                type=item["type"],
                size=item.get("size")
            )
            for item in data
        ]
        
        return DirectoryListResponse(path=request.path or "/", items=items)


@router.post("/write-file", response_model=FileWriteResponse)
async def write_file(request: FileWriteRequest):
    """Create or update a file in the repository"""
    token = await get_github_token()
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        # If creating a new branch, do that first
        if request.create_branch:
            # Get the SHA of the base branch
            ref_response = await client.get(
                f"{GITHUB_API}/repos/{GITHUB_OWNER}/{GITHUB_REPO}/git/ref/heads/{request.base_branch}",
                headers={
                    "Authorization": f"Bearer {token}",
                    "Accept": "application/vnd.github.v3+json",
                }
            )
            ref_response.raise_for_status()
            base_sha = ref_response.json()["object"]["sha"]
            
            # Create the new branch
            create_ref_response = await client.post(
                f"{GITHUB_API}/repos/{GITHUB_OWNER}/{GITHUB_REPO}/git/refs",
                headers={
                    "Authorization": f"Bearer {token}",
                    "Accept": "application/vnd.github.v3+json",
                },
                json={
                    "ref": f"refs/heads/{request.branch}",
                    "sha": base_sha
                }
            )
            if create_ref_response.status_code not in [201, 422]:  # 422 = already exists
                create_ref_response.raise_for_status()
        
        # Check if file exists to get its SHA
        existing_sha = None
        try:
            existing_response = await client.get(
                f"{GITHUB_API}/repos/{GITHUB_OWNER}/{GITHUB_REPO}/contents/{request.path}",
                headers={
                    "Authorization": f"Bearer {token}",
                    "Accept": "application/vnd.github.v3+json",
                },
                params={"ref": request.branch}
            )
            if existing_response.status_code == 200:
                existing_sha = existing_response.json().get("sha")
        except:
            pass
        
        # Create or update the file
        content_base64 = base64.b64encode(request.content.encode("utf-8")).decode("utf-8")
        
        payload = {
            "message": request.message,
            "content": content_base64,
            "branch": request.branch,
        }
        if existing_sha:
            payload["sha"] = existing_sha
        
        response = await client.put(
            f"{GITHUB_API}/repos/{GITHUB_OWNER}/{GITHUB_REPO}/contents/{request.path}",
            headers={
                "Authorization": f"Bearer {token}",
                "Accept": "application/vnd.github.v3+json",
            },
            json=payload
        )
        response.raise_for_status()
        
        data = response.json()
        
        return FileWriteResponse(
            path=data["content"]["path"],
            sha=data["content"]["sha"],
            branch=request.branch,
            commit_url=data["commit"]["html_url"]
        )


@router.post("/create-pr", response_model=PRCreateResponse)
async def create_pull_request(request: PRCreateRequest):
    """Create a pull request"""
    token = await get_github_token()
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            f"{GITHUB_API}/repos/{GITHUB_OWNER}/{GITHUB_REPO}/pulls",
            headers={
                "Authorization": f"Bearer {token}",
                "Accept": "application/vnd.github.v3+json",
            },
            json={
                "title": request.title,
                "body": request.body,
                "head": request.head_branch,
                "base": request.base_branch,
            }
        )
        
        if response.status_code == 422:
            # PR might already exist
            error_data = response.json()
            raise HTTPException(status_code=422, detail=error_data.get("message", "PR creation failed"))
        
        response.raise_for_status()
        data = response.json()
        
        return PRCreateResponse(
            number=data["number"],
            url=data["url"],
            html_url=data["html_url"],
            title=data["title"]
        )


@router.get("/branches")
async def list_branches():
    """List all branches in the repository"""
    token = await get_github_token()
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(
            f"{GITHUB_API}/repos/{GITHUB_OWNER}/{GITHUB_REPO}/branches",
            headers={
                "Authorization": f"Bearer {token}",
                "Accept": "application/vnd.github.v3+json",
            }
        )
        response.raise_for_status()
        
        branches = [{"name": b["name"], "protected": b.get("protected", False)} for b in response.json()]
        return {"branches": branches}


@router.get("/recent-commits")
async def recent_commits(branch: str = "main", limit: int = 10):
    """Get recent commits on a branch"""
    token = await get_github_token()
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(
            f"{GITHUB_API}/repos/{GITHUB_OWNER}/{GITHUB_REPO}/commits",
            headers={
                "Authorization": f"Bearer {token}",
                "Accept": "application/vnd.github.v3+json",
            },
            params={"sha": branch, "per_page": limit}
        )
        response.raise_for_status()
        
        commits = [
            {
                "sha": c["sha"][:7],
                "message": c["commit"]["message"].split("\n")[0],
                "author": c["commit"]["author"]["name"],
                "date": c["commit"]["author"]["date"],
            }
            for c in response.json()
        ]
        return {"commits": commits}
