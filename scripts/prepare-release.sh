#!/bin/bash

# AI Cost Optimizer Core Release Preparation Script
# This script helps prepare a new release by updating version and creating a tag

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 AI Cost Optimizer Core Release Preparation${NC}"
echo "================================================"

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo -e "${GREEN}Current version: ${CURRENT_VERSION}${NC}"

# Ask for new version
read -p "Enter new version (e.g., 1.4.4): " NEW_VERSION

if [ -z "$NEW_VERSION" ]; then
    echo -e "${RED}No version provided. Exiting.${NC}"
    exit 1
fi

# Validate version format
if ! [[ $NEW_VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo -e "${RED}Invalid version format. Use semantic versioning (e.g., 1.4.4)${NC}"
    exit 1
fi

echo -e "${YELLOW}Preparing release ${NEW_VERSION}...${NC}"

# Update package.json version
npm version $NEW_VERSION --no-git-tag-version
echo "Updated package.json version to $NEW_VERSION"

# Run tests
echo -e "${YELLOW}Running tests...${NC}"
npm test

# Run linting
echo -e "${YELLOW}Running linting...${NC}"
npm run lint

# Build package
echo -e "${YELLOW}Building package...${NC}"
npm run build

# Check package
echo -e "${YELLOW}Checking package...${NC}"
npm pack --dry-run

# Create git tag
echo -e "${YELLOW}Creating git tag...${NC}"
git add package.json
git commit -m "Bump version to $NEW_VERSION"
git tag -a "v$NEW_VERSION" -m "Release version $NEW_VERSION"

echo -e "${GREEN}✅ Release preparation complete!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Review changes: git diff HEAD~1"
echo "2. Push changes: git push origin main"
echo "3. Push tag: git push origin v$NEW_VERSION"
echo "4. Check GitHub Actions for automated publishing"
echo ""
echo -e "${YELLOW}Or manually publish to npm:${NC}"
echo "npm publish --access public" 