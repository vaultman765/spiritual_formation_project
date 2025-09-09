# Copilot Agent Instructions: Spiritual Formation Project

## Repository Overview
This is a **Catholic mental prayer journey platform** with structured meditation arcs and reading plans. It's a full-stack application with Django backend, React frontend, and YAML-based content management system.

**Core Components:**
- **Backend:** Django 4.2/5.1 with PostgreSQL database and REST API
- **Frontend:** React 19 with TypeScript, Vite build system, TailwindCSS
- **Content System:** YAML-based meditation metadata and arc management
- **Scripts:** Python utilities for content validation and processing

**Repository Structure:**
- `/config/` - Django settings and configuration
- `/frontend/` - React TypeScript application
- `/scripts/` - Python validation and import utilities
- `/metadata/` - YAML content schemas and data
- `/tests/` - Python test suite
- `/.github/workflows/` - CI/CD automation

## Environment Setup & Build Instructions

### Essential Prerequisites
- **Python 3.12** (exact version required)
- **Node.js 20+** and **npm 10+**
- **PostgreSQL** database (for Django)
- **pipenv** for Python dependency management

### Backend Setup (CRITICAL: Always do this first)
```bash
# Install and setup Python environment
pip install --upgrade pip && pip install pipenv
pipenv install --dev && pipenv sync

# Set required environment variables (Django will fail without these)
export SECRET_KEY="your-secret-key-here"
export DB_NAME="your_db_name"
export DB_USER="your_db_user" 
export DB_PASSWORD="your_db_password"
export DB_HOST="localhost"
export DB_PORT="5432"

# Validate Django setup
pipenv run python manage.py check --deploy
```

### Frontend Setup (CRITICAL: Use legacy peer deps)
```bash
cd frontend
# React 19 has peer dependency conflicts - ALWAYS use --legacy-peer-deps
npm install --legacy-peer-deps
```

### Linting & Validation
```bash
# Python linting (must pass for CI)
pipenv run flake8 scripts/

# YAML linting (must pass for CI) 
yamllint .

# Frontend linting (has known issues - see Common Issues)
cd frontend && npm run lint

# Metadata validation (runs as module)
pipenv run python -m scripts.validate_metadata
```

### Testing
```bash
# Python tests (2 tests fail due to mock issues - this is expected)
pipenv run python -m pytest tests/ -v

# Frontend tests (some fail due to TypeScript config - this is expected)
cd frontend && npm run test
```

### Building for Production (LONG-RUNNING COMMANDS)
```bash
# Frontend build (can take 3-5 minutes due to image generation)
cd frontend && npm run build

# Django collectstatic (if needed)
pipenv run python manage.py collectstatic --noinput
```

### Running the Application
```bash
# Django development server (requires env vars set)
pipenv run python manage.py runserver

# Frontend development server
cd frontend && npm run dev
```

## Common Issues & Workarounds

### Environment Variable Errors
**Problem:** Django fails with "ImproperlyConfigured: Set the SECRET_KEY environment variable"
**Solution:** Always export all required environment variables before running Django commands.

### Frontend Dependency Conflicts
**Problem:** `npm install` fails with React peer dependency errors
**Solution:** Always use `npm install --legacy-peer-deps` due to React 19 compatibility issues.

### Test Failures (Expected)
- **Python:** 2/14 tests fail due to mock file path issues (not functionality bugs)
- **Frontend:** Some tests fail due to import.meta TypeScript configuration (not functionality bugs)

### Linting Issues (Expected)
- **Frontend ESLint:** 29 warnings/errors exist (mainly TypeScript any types, unused vars)
- These do not block functionality but should be addressed in PRs when possible

## CI/CD Workflows

The repository has automated GitHub Actions that **will fail your PR** if not followed:

1. **python-lint.yml** - Runs `flake8 scripts/` (must pass)
2. **yaml-lint.yml** - Runs `yamllint .` (must pass)  
3. **metadata-validate.yml** - Validates YAML metadata schemas
4. **frontend-deploy.yml** - Builds frontend for deployment
5. **app-backend-build.yml** - Builds Django backend

**Critical:** Always run linting commands locally before committing to avoid CI failures.

## Project Architecture & Key Files

### Django Backend (`/config/`)
- `settings.py` - Main Django configuration (requires env vars)
- `urls.py` - URL routing
- `manage.py` - Django CLI entry point

### Metadata System (`/metadata/`)
- `tag_bank.yaml` - Master tag definitions
- `arc_metadata.yaml` - Arc definitions and metadata  
- `schemas/` - JSON schemas for validation
- `meditations/` - Individual meditation day files

### Validation Scripts (`/scripts/`)
- `validate_metadata.py` - Main validation entry point
- `utils/` - Shared utilities (io.py, paths.py, constants.py, log.py)
- All scripts follow flake8 standards and have comprehensive logging

### Frontend (`/frontend/`)
- `src/` - React TypeScript source code
- `package.json` - Contains all build scripts
- Uses Vite for build/dev server, TailwindCSS for styling
- ESLint/TypeScript configured but has known issues

## Makefile Shortcuts
```bash
make shell      # Setup pipenv environment
make update     # Update dependencies  
make lint       # Python linting
make runserver  # Start Django server
make npm-dev    # Start frontend dev server
```

## Configuration Files
- `.flake8` - Python linting configuration (max line length 140)
- `.yamllint.yaml` - YAML linting rules  
- `Pipfile` - Python dependencies (uses Python 3.12)
- `frontend/package.json` - Frontend dependencies and scripts
- `frontend/tsconfig.json` - TypeScript configuration

## Development Workflow Recommendations

1. **Always set environment variables first** before any Django commands
2. **Use pipenv for Python** and **npm --legacy-peer-deps for frontend**
3. **Run linting locally** before committing to avoid CI failures
4. **Expected test failures are documented above** - don't spend time fixing them
5. **Focus on functionality over fixing existing lint warnings** unless directly related to your changes

## Quick Reference for Common Tasks

### Finding Code Patterns
- **Django models:** Look in individual app directories, not a centralized models.py
- **API endpoints:** Check `config/urls.py` for main routing
- **React components:** `frontend/src/components/` and `frontend/src/pages/`
- **YAML schemas:** `metadata/schemas/` directory
- **Python utilities:** `scripts/utils/` for reusable functions

### Meditation Content Structure
- **Arc definitions:** `metadata/arc_metadata.yaml`
- **Tags system:** `metadata/tag_bank.yaml` 
- **Individual days:** `metadata/meditations/` directory
- **Validation schemas:** `metadata/schemas/` for structure definitions

### Key Environment Variables for Different Modes
```bash
# Minimal development setup
export SECRET_KEY="dev-key-at-least-50-chars-long-with-special-symbols"
export DB_NAME="spiritual_formation_dev"
export DB_USER="postgres"
export DB_PASSWORD="password"
export DB_HOST="localhost" 
export DEBUG="True"

# For production-like testing
export DEBUG="False"
export SECURE_SSL_REDIRECT="True"
```

## Trust These Instructions
These instructions are comprehensive and tested. Only search/explore further if:
- Commands documented here don't work as described
- You need to understand code beyond what's documented
- Instructions appear incomplete or incorrect for your specific task

**Always validate your changes don't break the documented build process before committing.**