"""Email checks: format (RFC-style), disposable domains, MX DNS records."""

from emailcheck.validator import EmailCheckResult, validate_email_address

__all__ = ["EmailCheckResult", "validate_email_address"]
