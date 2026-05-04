"""
HTTP API for the Vite app.

  cd python_email_check
  python -m venv .venv
  .venv\\Scripts\\pip install -r requirements.txt
  .venv\\Scripts\\python -m uvicorn emailcheck.api:app --reload --port 8765

Frontend .env: VITE_EMAIL_VALIDATION_URL=http://127.0.0.1:8765
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from emailcheck.validator import validate_email_address

app = FastAPI(title="Email validation", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ValidateIn(BaseModel):
    email: str = Field(..., min_length=1, max_length=320)


class ValidateOut(BaseModel):
    valid: bool
    reason: str | None = None
    detail: str | None = None


@app.get("/health")
def health() -> dict:
    return {"ok": True}


@app.post("/validate", response_model=ValidateOut)
def validate(body: ValidateIn) -> ValidateOut:
    r = validate_email_address(body.email)
    return ValidateOut(valid=r.valid, reason=r.reason, detail=r.detail)
