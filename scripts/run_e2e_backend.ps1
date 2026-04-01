$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$e2eRoot = Join-Path $root ".e2e"
$dbPath = Join-Path $e2eRoot "eldas-e2e.db"
$storagePath = Join-Path $e2eRoot "storage"
$pythonExe = Join-Path $root "venv\Scripts\python.exe"

New-Item -ItemType Directory -Force -Path $e2eRoot | Out-Null

$normalizedDbPath = $dbPath -replace "\\", "/"
$normalizedStoragePath = $storagePath -replace "\\", "/"

$env:ENVIRONMENT = "e2e"
$env:SECRET_KEY = "eldas-e2e-secret"
$env:DATABASE_URL = "sqlite:///$normalizedDbPath"
$env:ALLOWED_ORIGINS = '["http://127.0.0.1:4173","http://localhost:4173"]'
$env:LOCAL_STORAGE_PATH = $normalizedStoragePath
$env:OPENAI_API_KEY = ""
$env:OCR_PROVIDER = "tesseract"
$env:PYTHONPATH = $root

if (-not (Test-Path $pythonExe)) {
    throw "Expected Python 3.11 interpreter was not found at $pythonExe"
}

Push-Location $root
try {
    & $pythonExe "$PSScriptRoot\prepare_e2e_db.py"
    & $pythonExe -m uvicorn app.main:app --host 127.0.0.1 --port 8001
}
finally {
    Pop-Location
}
