"""
AI Provider Proxy Endpoint

Proxies requests to various AI providers to avoid CORS issues
Supports function calling for GitHub operations
"""
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
import httpx
import json
import base64
from typing import Literal, Optional, List, Any

router = APIRouter()

# GitHub configuration
GITHUB_OWNER = "renduples"
GITHUB_REPO = "afpip"
GITHUB_API = "https://api.github.com"


async def get_github_token() -> str:
    """Get GitHub token from Secret Manager"""
    import os
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        return token
    
    try:
        from google.cloud import secretmanager
        client = secretmanager.SecretManagerServiceClient()
        name = f"projects/afpi-production/secrets/github-token/versions/latest"
        response = client.access_secret_version(request={"name": name})
        return response.payload.data.decode("UTF-8")
    except Exception as e:
        raise Exception(f"Failed to get GitHub token: {str(e)}")


# GitHub tool definitions for function calling
GITHUB_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "read_file",
            "description": "Read a file from the GitHub repository. Use this to view current code before making changes.",
            "parameters": {
                "type": "object",
                "properties": {
                    "path": {
                        "type": "string",
                        "description": "The file path relative to repository root, e.g., 'frontend/src/app/page.tsx'"
                    },
                    "branch": {
                        "type": "string",
                        "description": "The branch to read from. Default is 'main'",
                        "default": "main"
                    }
                },
                "required": ["path"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "list_directory",
            "description": "List files and folders in a directory of the repository",
            "parameters": {
                "type": "object",
                "properties": {
                    "path": {
                        "type": "string",
                        "description": "The directory path relative to repository root, e.g., 'frontend/src/components'",
                        "default": ""
                    },
                    "branch": {
                        "type": "string",
                        "description": "The branch to list from. Default is 'main'",
                        "default": "main"
                    }
                },
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "create_or_update_file",
            "description": "Create a new file or update an existing file in the repository. This will create a new branch and commit the changes.",
            "parameters": {
                "type": "object",
                "properties": {
                    "path": {
                        "type": "string",
                        "description": "The file path relative to repository root"
                    },
                    "content": {
                        "type": "string",
                        "description": "The complete file content to write"
                    },
                    "commit_message": {
                        "type": "string",
                        "description": "A descriptive commit message"
                    },
                    "branch": {
                        "type": "string",
                        "description": "The branch name to create/update. Use a descriptive name like 'ai/add-dark-mode'"
                    }
                },
                "required": ["path", "content", "commit_message", "branch"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "create_pull_request",
            "description": "Create a pull request to merge changes from a feature branch into main",
            "parameters": {
                "type": "object",
                "properties": {
                    "title": {
                        "type": "string",
                        "description": "The PR title"
                    },
                    "body": {
                        "type": "string",
                        "description": "The PR description explaining the changes"
                    },
                    "head_branch": {
                        "type": "string",
                        "description": "The branch containing the changes"
                    },
                    "base_branch": {
                        "type": "string",
                        "description": "The branch to merge into. Default is 'main'",
                        "default": "main"
                    }
                },
                "required": ["title", "body", "head_branch"]
            }
        }
    }
]


async def execute_github_tool(tool_name: str, arguments: dict) -> str:
    """Execute a GitHub tool and return the result"""
    token = await get_github_token()
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        headers = {
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github.v3+json",
        }
        
        if tool_name == "read_file":
            path = arguments["path"]
            branch = arguments.get("branch", "main")
            
            response = await client.get(
                f"{GITHUB_API}/repos/{GITHUB_OWNER}/{GITHUB_REPO}/contents/{path}",
                headers=headers,
                params={"ref": branch}
            )
            
            if response.status_code == 404:
                return f"Error: File not found: {path}"
            response.raise_for_status()
            
            data = response.json()
            if data.get("type") != "file":
                return f"Error: Path is a directory, not a file: {path}"
            
            content = base64.b64decode(data["content"]).decode("utf-8")
            return f"File: {path}\n\n```\n{content}\n```"
        
        elif tool_name == "list_directory":
            path = arguments.get("path", "")
            branch = arguments.get("branch", "main")
            
            response = await client.get(
                f"{GITHUB_API}/repos/{GITHUB_OWNER}/{GITHUB_REPO}/contents/{path}",
                headers=headers,
                params={"ref": branch}
            )
            
            if response.status_code == 404:
                return f"Error: Directory not found: {path or '/'}"
            response.raise_for_status()
            
            data = response.json()
            if not isinstance(data, list):
                return f"Error: Path is a file, not a directory: {path}"
            
            items = []
            for item in data:
                icon = "📁" if item["type"] == "dir" else "📄"
                items.append(f"{icon} {item['name']}")
            
            return f"Contents of {path or '/'}:\n" + "\n".join(items)
        
        elif tool_name == "create_or_update_file":
            path = arguments["path"]
            content = arguments["content"]
            message = arguments["commit_message"]
            branch = arguments["branch"]
            
            # Get main branch SHA to create new branch from
            ref_response = await client.get(
                f"{GITHUB_API}/repos/{GITHUB_OWNER}/{GITHUB_REPO}/git/ref/heads/main",
                headers=headers
            )
            ref_response.raise_for_status()
            main_sha = ref_response.json()["object"]["sha"]
            
            # Try to create the branch (ignore if exists)
            await client.post(
                f"{GITHUB_API}/repos/{GITHUB_OWNER}/{GITHUB_REPO}/git/refs",
                headers=headers,
                json={"ref": f"refs/heads/{branch}", "sha": main_sha}
            )
            
            # Check if file exists on the branch
            existing_sha = None
            existing_response = await client.get(
                f"{GITHUB_API}/repos/{GITHUB_OWNER}/{GITHUB_REPO}/contents/{path}",
                headers=headers,
                params={"ref": branch}
            )
            if existing_response.status_code == 200:
                existing_sha = existing_response.json().get("sha")
            
            # Create/update file
            content_b64 = base64.b64encode(content.encode("utf-8")).decode("utf-8")
            payload = {
                "message": message,
                "content": content_b64,
                "branch": branch,
            }
            if existing_sha:
                payload["sha"] = existing_sha
            
            response = await client.put(
                f"{GITHUB_API}/repos/{GITHUB_OWNER}/{GITHUB_REPO}/contents/{path}",
                headers=headers,
                json=payload
            )
            response.raise_for_status()
            
            data = response.json()
            return f"✅ File {'updated' if existing_sha else 'created'}: {path}\nBranch: {branch}\nCommit: {data['commit']['html_url']}"
        
        elif tool_name == "create_pull_request":
            title = arguments["title"]
            body = arguments["body"]
            head = arguments["head_branch"]
            base = arguments.get("base_branch", "main")
            
            response = await client.post(
                f"{GITHUB_API}/repos/{GITHUB_OWNER}/{GITHUB_REPO}/pulls",
                headers=headers,
                json={
                    "title": title,
                    "body": body,
                    "head": head,
                    "base": base,
                }
            )
            
            if response.status_code == 422:
                error_data = response.json()
                return f"Error creating PR: {error_data.get('message', 'Unknown error')}"
            
            response.raise_for_status()
            data = response.json()
            
            return f"✅ Pull Request created!\nPR #{data['number']}: {title}\nURL: {data['html_url']}"
        
        else:
            return f"Error: Unknown tool: {tool_name}"


# Read-only tools for Project Assistant
GITHUB_TOOLS_READONLY = [
    {
        "type": "function",
        "function": {
            "name": "read_file",
            "description": "Read a file from the GitHub repository. Use this to view current code.",
            "parameters": {
                "type": "object",
                "properties": {
                    "path": {
                        "type": "string",
                        "description": "The file path relative to repository root, e.g., 'frontend/src/app/page.tsx'"
                    },
                    "branch": {
                        "type": "string",
                        "description": "The branch to read from. Default is 'main'",
                        "default": "main"
                    }
                },
                "required": ["path"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "list_directory",
            "description": "List files and folders in a directory of the repository",
            "parameters": {
                "type": "object",
                "properties": {
                    "path": {
                        "type": "string",
                        "description": "The directory path relative to repository root, e.g., 'frontend/src/components'",
                        "default": ""
                    },
                    "branch": {
                        "type": "string",
                        "description": "The branch to list from. Default is 'main'",
                        "default": "main"
                    }
                },
                "required": []
            }
        }
    }
]


class AIRequest(BaseModel):
    provider: Literal["xai", "openai", "anthropic", "google"]
    api_key: str
    message: str
    system_prompt: str
    context: str = ""
    model: str | None = None
    enable_tools: bool = True  # Enable GitHub tools by default
    role: str = "researcher"  # researcher (read-only) or developer (full access)


class AIResponse(BaseModel):
    content: str
    provider: str
    tool_calls: Optional[List[dict]] = None


@router.post("/chat", response_model=AIResponse)
async def proxy_ai_chat(request: AIRequest):
    """
    Proxy AI chat requests to avoid CORS issues.
    Supports function calling for GitHub operations.
    Developer mode has full access, Project Assistant is read-only.
    """
    try:
        # Determine if write access is allowed based on role
        allow_write = request.role == "developer"
        
        # Use tool-enabled version for xai and openai
        if request.provider == "xai" and request.enable_tools:
            content = await call_xai_with_tools(
                request.message,
                request.system_prompt,
                request.context,
                request.api_key,
                request.model or "grok-3",
                allow_write=allow_write
            )
        elif request.provider == "xai":
            content = await call_xai(
                request.message,
                request.system_prompt,
                request.context,
                request.api_key,
                request.model or "grok-3"
            )
        elif request.provider == "openai" and request.enable_tools:
            content = await call_openai_with_tools(
                request.message,
                request.system_prompt,
                request.context,
                request.api_key,
                request.model or "gpt-4",
                allow_write=allow_write
            )
        elif request.provider == "openai":
            content = await call_openai(
                request.message,
                request.system_prompt,
                request.context,
                request.api_key,
                request.model or "gpt-4"
            )
        elif request.provider == "anthropic":
            content = await call_anthropic(
                request.message,
                request.system_prompt,
                request.context,
                request.api_key,
                request.model or "claude-3-sonnet-20240229"
            )
        elif request.provider == "google":
            content = await call_google(
                request.message,
                request.system_prompt,
                request.context,
                request.api_key,
                request.model or "gemini-pro"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported provider: {request.provider}"
            )

        return AIResponse(content=content, provider=request.provider)

    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AI provider error: {e.response.status_code} - {e.response.text}"
        )
    except httpx.TimeoutException as e:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="AI provider request timed out. Try a shorter message or try again."
        )
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Network error calling AI provider: {type(e).__name__}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error calling AI provider: {type(e).__name__}: {str(e)}"
        )


async def call_xai_with_tools(message: str, system_prompt: str, context: str, api_key: str, model: str, allow_write: bool = False) -> str:
    """Call X.AI (Grok) API with function calling support"""
    
    # Select tools based on access level
    tools = GITHUB_TOOLS if allow_write else GITHUB_TOOLS_READONLY
    
    if allow_write:
        access_description = """You have access to GitHub tools to read and modify the codebase. When asked to make changes:
1. First read the relevant files to understand the current code
2. Create or update files on a new branch (use branch names like 'ai/feature-name')
3. Create a pull request for the changes

Always use tools when making actual code changes. Do not just provide code snippets."""
    else:
        access_description = """You have READ-ONLY access to the GitHub repository. You can:
- Read any file from the codebase
- List directory contents
- Explore the project structure

You CANNOT make changes to files. If asked to make changes, explain that you can only view files 
and provide code suggestions. Tell the user to switch to Developer Mode to make actual changes to the repository."""

    enhanced_system_prompt = f"""{system_prompt}

{context}

{access_description}"""
    
    messages = [
        {"role": "system", "content": enhanced_system_prompt},
        {"role": "user", "content": message},
    ]
    
    max_iterations = 10  # Prevent infinite loops
    
    async with httpx.AsyncClient(timeout=180.0) as client:
        for _ in range(max_iterations):
            response = await client.post(
                "https://api.x.ai/v1/chat/completions",
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {api_key}",
                },
                json={
                    "model": model,
                    "messages": messages,
                    "tools": tools,
                    "tool_choice": "auto",
                    "temperature": 0.7,
                    "max_tokens": 4096,
                },
            )
            response.raise_for_status()
            data = response.json()
            
            assistant_message = data["choices"][0]["message"]
            messages.append(assistant_message)
            
            # Check if there are tool calls
            if assistant_message.get("tool_calls"):
                for tool_call in assistant_message["tool_calls"]:
                    tool_name = tool_call["function"]["name"]
                    arguments = json.loads(tool_call["function"]["arguments"])
                    
                    # Block write operations if not allowed
                    if not allow_write and tool_name in ["create_or_update_file", "create_pull_request"]:
                        result = "Error: Write access denied. You have read-only access. Switch to Developer Mode to make changes."
                    else:
                        try:
                            result = await execute_github_tool(tool_name, arguments)
                        except Exception as e:
                            result = f"Error executing {tool_name}: {str(e)}"
                    
                    # Add tool result to messages
                    messages.append({
                        "role": "tool",
                        "tool_call_id": tool_call["id"],
                        "content": result
                    })
            else:
                # No more tool calls, return the final response
                return assistant_message.get("content", "")
        
        # If we hit max iterations, return what we have
        return messages[-1].get("content", "Maximum iterations reached")


async def call_openai_with_tools(message: str, system_prompt: str, context: str, api_key: str, model: str, allow_write: bool = False) -> str:
    """Call OpenAI API with function calling support"""
    
    # Select tools based on access level
    tools = GITHUB_TOOLS if allow_write else GITHUB_TOOLS_READONLY
    
    if allow_write:
        access_description = """You have access to GitHub tools to read and modify the codebase. When asked to make changes:
1. First read the relevant files to understand the current code
2. Create or update files on a new branch (use branch names like 'ai/feature-name')
3. Create a pull request for the changes

Always use tools when making actual code changes. Do not just provide code snippets."""
    else:
        access_description = """You have READ-ONLY access to the GitHub repository. You can:
- Read any file from the codebase
- List directory contents
- Explore the project structure

You CANNOT make changes to files. If asked to make changes, explain that you can only view files 
and provide code suggestions. Tell the user to switch to Developer Mode to make actual changes to the repository."""

    enhanced_system_prompt = f"""{system_prompt}

{context}

{access_description}"""
    
    messages = [
        {"role": "system", "content": enhanced_system_prompt},
        {"role": "user", "content": message},
    ]
    
    max_iterations = 10
    
    async with httpx.AsyncClient(timeout=180.0) as client:
        for _ in range(max_iterations):
            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {api_key}",
                },
                json={
                    "model": model,
                    "messages": messages,
                    "tools": tools,
                    "tool_choice": "auto",
                    "temperature": 0.7,
                    "max_tokens": 4096,
                },
            )
            response.raise_for_status()
            data = response.json()
            
            assistant_message = data["choices"][0]["message"]
            messages.append(assistant_message)
            
            if assistant_message.get("tool_calls"):
                for tool_call in assistant_message["tool_calls"]:
                    tool_name = tool_call["function"]["name"]
                    arguments = json.loads(tool_call["function"]["arguments"])
                    
                    # Block write operations if not allowed
                    if not allow_write and tool_name in ["create_or_update_file", "create_pull_request"]:
                        result = "Error: Write access denied. You have read-only access. Switch to Developer Mode to make changes."
                    else:
                        try:
                            result = await execute_github_tool(tool_name, arguments)
                        except Exception as e:
                            result = f"Error executing {tool_name}: {str(e)}"
                    
                    messages.append({
                        "role": "tool",
                        "tool_call_id": tool_call["id"],
                        "content": result
                    })
            else:
                return assistant_message.get("content", "")
        
        return messages[-1].get("content", "Maximum iterations reached")


async def call_xai(message: str, system_prompt: str, context: str, api_key: str, model: str) -> str:
    """Call X.AI (Grok) API"""
    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(
            "https://api.x.ai/v1/chat/completions",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {api_key}",
            },
            json={
                "model": model,
                "messages": [
                    {"role": "system", "content": f"{system_prompt}\n\n{context}"},
                    {"role": "user", "content": message},
                ],
                "temperature": 0.7,
                "max_tokens": 4096,
            },
        )
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"]


async def call_openai(message: str, system_prompt: str, context: str, api_key: str, model: str) -> str:
    """Call OpenAI API"""
    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {api_key}",
            },
            json={
                "model": model,
                "messages": [
                    {"role": "system", "content": f"{system_prompt}\n\n{context}"},
                    {"role": "user", "content": message},
                ],
                "temperature": 0.7,
                "max_tokens": 4096,
            },
        )
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"]


async def call_anthropic(message: str, system_prompt: str, context: str, api_key: str, model: str) -> str:
    """Call Anthropic (Claude) API"""
    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "Content-Type": "application/json",
                "x-api-key": api_key,
                "anthropic-version": "2023-06-01",
            },
            json={
                "model": model,
                "max_tokens": 4096,
                "system": f"{system_prompt}\n\n{context}",
                "messages": [
                    {"role": "user", "content": message},
                ],
            },
        )
        response.raise_for_status()
        data = response.json()
        return data["content"][0]["text"]


async def call_google(message: str, system_prompt: str, context: str, api_key: str, model: str) -> str:
    """Call Google (Gemini) API"""
    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(
            f"https://generativelanguage.googleapis.com/v1/models/{model}:generateContent?key={api_key}",
            headers={
                "Content-Type": "application/json",
            },
            json={
                "contents": [{
                    "parts": [{
                        "text": f"{system_prompt}\n\n{context}\n\nUser: {message}"
                    }]
                }],
            },
        )
        response.raise_for_status()
        data = response.json()
        return data["candidates"][0]["content"]["parts"][0]["text"]
