# Eldas Backend

FastAPI backend for the Eldas classroom, assessment, and cognitive evaluation platform.

## Quick start

1. Create a virtual environment.
2. Install dependencies:

```bash
pip install -e .
```

3. Copy environment variables:

```bash
cp .env.example .env
# PowerShell: Copy-Item .env.example .env
```

4. Run migrations:

```bash
alembic upgrade head
```

5. Start the API:

```bash
uvicorn app.main:app --reload
```
