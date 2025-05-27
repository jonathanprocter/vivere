#!/bin/bash

# Vercel Deployment Automation Script
# This script automates the deployment of a Next.js app to Vercel

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to prompt for user input
prompt_user() {
    local prompt="$1"
    local var_name="$2"
    local default_value="$3"
    
    if [ -n "$default_value" ]; then
        read -p "$prompt [$default_value]: " input
        eval "$var_name=\${input:-$default_value}"
    else
        read -p "$prompt: " input
        eval "$var_name=\"$input\""
    fi
}

print_status "🚀 Starting Vercel Deployment Automation"
echo

# Check if we're in a Git repository
if [ ! -d ".git" ]; then
    print_error "This doesn't appear to be a Git repository. Please run this script from your project root."
    exit 1
fi

# Check if this is a Next.js project
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from your Next.js project root."
    exit 1
fi

if ! grep -q "next" package.json; then
    print_warning "This doesn't appear to be a Next.js project (no 'next' found in package.json)"
    read -p "Continue anyway? (y/n): " continue_anyway
    if [[ $continue_anyway != "y" && $continue_anyway != "Y" ]]; then
        print_status "Deployment cancelled."
        exit 0
    fi
fi

print_success "✅ Project validation passed"
echo

# Step 1: Install Vercel CLI if not already installed
print_status "📦 Checking Vercel CLI installation..."

if ! command_exists vercel; then
    print_status "Installing Vercel CLI..."
    if command_exists npm; then
        npm install -g vercel
    elif command_exists yarn; then
        yarn global add vercel
    else
        print_error "Neither npm nor yarn found. Please install Node.js and npm first."
        exit 1
    fi
    print_success "Vercel CLI installed successfully"
else
    print_success "Vercel CLI already installed"
fi

echo

# Step 2: Login to Vercel (if not already logged in)
print_status "🔐 Checking Vercel authentication..."

if ! vercel whoami >/dev/null 2>&1; then
    print_status "You need to login to Vercel. This will open your browser..."
    vercel login
    print_success "Logged in to Vercel successfully"
else
    current_user=$(vercel whoami)
    print_success "Already logged in as: $current_user"
fi

echo

# Step 3: Collect environment variables
print_status "🔧 Setting up environment variables..."

# Check if .env.local exists and read OPENAI_API_KEY from it
if [ -f ".env.local" ]; then
    source .env.local
    if [ -n "$OPENAI_API_KEY" ]; then
        print_success "Found OPENAI_API_KEY in .env.local"
        use_existing_key="y"
    else
        use_existing_key="n"
    fi
else
    use_existing_key="n"
fi

if [[ $use_existing_key != "y" ]]; then
    echo "Please enter your OpenAI API Key (required for emotion analysis features):"
    prompt_user "OpenAI API Key" OPENAI_API_KEY
    
    if [ -z "$OPENAI_API_KEY" ]; then
        print_warning "No OpenAI API Key provided. The emotion analysis features won't work."
        read -p "Continue without API key? (y/n): " continue_without_key
        if [[ $continue_without_key != "y" && $continue_without_key != "Y" ]]; then
            print_status "Deployment cancelled."
            exit 0
        fi
    fi
fi

echo

# Step 4: Ensure code is committed and pushed
print_status "📤 Checking Git status..."

if [ -n "$(git status --porcelain)" ]; then
    print_warning "You have uncommitted changes."
    read -p "Commit and push changes automatically? (y/n): " auto_commit
    
    if [[ $auto_commit == "y" || $auto_commit == "Y" ]]; then
        prompt_user "Commit message" commit_message "Deploy to Vercel"
        
        git add .
        git commit -m "$commit_message"
        
        # Try to push to current branch
        current_branch=$(git branch --show-current)
        print_status "Pushing to branch: $current_branch"
        git push origin "$current_branch"
        
        print_success "Code committed and pushed"
    else
        print_status "Please commit and push your changes manually, then run this script again."
        exit 0
    fi
else
    print_success "Working directory is clean"
fi

echo

# Step 5: Deploy to Vercel
print_status "🚀 Deploying to Vercel..."

# Create vercel.json if it doesn't exist (optional configuration)
if [ ! -f "vercel.json" ]; then
    cat > vercel.json << EOF
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next"
}
EOF
    print_status "Created vercel.json configuration file"
fi

# Deploy the project
if vercel --prod --confirm; then
    print_success "🎉 Deployment successful!"
    
    # Get the deployment URL
    deployment_url=$(vercel --prod --confirm 2>/dev/null | grep -E 'https://.*\.vercel\.app' | tail -1)
    
    if [ -n "$deployment_url" ]; then
        print_success "🌐 Your app is live at: $deployment_url"
        
        # Try to open in browser (optional)
        read -p "Open in browser? (y/n): " open_browser
        if [[ $open_browser == "y" || $open_browser == "Y" ]]; then
            if command_exists open; then
                open "$deployment_url"
            elif command_exists xdg-open; then
                xdg-open "$deployment_url"
            elif command_exists start; then
                start "$deployment_url"
            else
                print_status "Please open $deployment_url manually in your browser"
            fi
        fi
    fi
else
    print_error "Deployment failed. Check the output above for details."
    exit 1
fi

echo

# Step 6: Set environment variables on Vercel
if [ -n "$OPENAI_API_KEY" ]; then
    print_status "🔐 Setting environment variables on Vercel..."
    
    # Get project name/id
    project_name=$(basename $(pwd))
    
    if vercel env add OPENAI_API_KEY production <<< "$OPENAI_API_KEY" >/dev/null 2>&1; then
        print_success "Environment variable OPENAI_API_KEY set for production"
    else
        print_warning "Could not set environment variable automatically."
        print_status "Please set OPENAI_API_KEY manually in Vercel dashboard:"
        print_status "1. Go to vercel.com/dashboard"
        print_status "2. Select your project"
        print_status "3. Go to Settings > Environment Variables"
        print_status "4. Add OPENAI_API_KEY with your API key"
    fi
fi

echo

# Step 7: Final summary
print_success "🎊 Deployment Complete!"
echo
print_status "Summary:"
print_status "✅ Code deployed to Vercel"
print_status "✅ Production URL generated"
if [ -n "$OPENAI_API_KEY" ]; then
    print_status "✅ Environment variables configured"
fi
echo
print_status "Next steps:"
print_status "1. Test your application at the provided URL"
print_status "2. Future deployments will happen automatically when you push to your main branch"
print_status "3. Monitor your app at vercel.com/dashboard"
echo
print_success "🚀 Happy deploying!"

# Create a deployment log
deployment_log="deployment-log-$(date +%Y%m%d-%H%M%S).txt"
{
    echo "Deployment completed at: $(date)"
    echo "Project: $(basename $(pwd))"
    echo "Branch: $(git branch --show-current)"
    echo "Commit: $(git rev-parse HEAD)"
    if [ -n "$deployment_url" ]; then
        echo "URL: $deployment_url"
    fi
} > "$deployment_log"

print_status "📝 Deployment log saved to: $deployment_log"