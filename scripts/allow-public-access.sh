#!/bin/bash
# Script to allow public access to Cloud Run services
# This removes the organization policy constraint at the project level

set -e

PROJECT_ID="afpi-production"

echo "Enabling public access for Cloud Run services in project: $PROJECT_ID"
echo ""

# Create a policy YAML to allow allUsers/allAuthenticatedUsers
cat > /tmp/public-access-policy.yaml <<EOF
name: projects/${PROJECT_ID}/policies/iam.allowedPolicyMemberDomains
spec:
  rules:
  - allowAll: true
EOF

echo "Step 1: Setting organization policy to allow public members..."
gcloud org-policies set-policy /tmp/public-access-policy.yaml

echo ""
echo "Step 2: Adding public IAM bindings to Cloud Run services..."

# Add public access to backend
echo "  - Adding public access to afpi-backend..."
gcloud run services add-iam-policy-binding afpi-backend \
  --region=us-central1 \
  --member=allUsers \
  --role=roles/run.invoker

# Add public access to frontend
echo "  - Adding public access to afpi-frontend..."
gcloud run services add-iam-policy-binding afpi-frontend \
  --region=us-central1 \
  --member=allUsers \
  --role=roles/run.invoker

echo ""
echo "✅ Public access enabled!"
echo ""
echo "Backend URL:  https://afpi-backend-lxs3uhyr5q-uc.a.run.app"
echo "Frontend URL: https://afpi-frontend-43847292060.us-central1.run.app"
echo ""
echo "Test with: curl https://afpi-backend-lxs3uhyr5q-uc.a.run.app/health"

# Cleanup
rm /tmp/public-access-policy.yaml
