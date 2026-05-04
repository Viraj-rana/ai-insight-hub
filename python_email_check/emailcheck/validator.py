from __future__ import annotations

from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
from typing import Optional

import dns.exception
import dns.resolver
from email_validator import EmailNotValidError, validate_email as validate_email_rfc

PACKAGE_DIR = Path(__file__).resolve().parent


@dataclass
class EmailCheckResult:
    """Result of validate_email_address."""

    valid: bool
    reason: Optional[str] = None
    detail: Optional[str] = None


@lru_cache
def _disposable_domains() -> frozenset[str]:
    path = PACKAGE_DIR / "disposable_domains.txt"
    if not path.is_file():
        return frozenset()
    out: set[str] = set()
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip().lower()
        if not line or line.startswith("#"):
            continue
        out.add(line)
    return frozenset(out)


def validate_email_address(
    raw: str,
    *,
    check_mx: bool = True,
    check_disposable: bool = True,
) -> EmailCheckResult:
    """
    Validate email for signup: syntax, disposable blocklist, MX DNS.

    Does not verify that a mailbox exists (needs SMTP or a third-party API).
    """
    text = (raw or "").strip()
    if not text:
        return EmailCheckResult(False, "empty", "Email is empty")

    try:
        info = validate_email_rfc(text, check_deliverability=False)
        domain = info.domain.lower()
        normalized = info.normalized
    except EmailNotValidError as e:
        return EmailCheckResult(False, "invalid_format", str(e))

    if check_disposable:
        if domain in _disposable_domains():
            return EmailCheckResult(
                False,
                "disposable_domain",
                f"Temporary or disposable email domains are not allowed ({domain}).",
            )

    if check_mx:
        try:
            answers = dns.resolver.resolve(domain, "MX", lifetime=5.0)
            if len(answers) == 0:
                return EmailCheckResult(False, "no_mx", "Domain has no MX records; it may not receive mail.")
        except dns.resolver.NXDOMAIN:
            return EmailCheckResult(False, "dns_failed", "Domain does not exist (DNS).")
        except dns.resolver.NoAnswer:
            return EmailCheckResult(False, "no_mx", "Domain has no MX records; it may not receive mail.")
        except dns.resolver.NoNameservers:
            return EmailCheckResult(False, "dns_error", "Could not reach DNS for this domain.")
        except dns.exception.Timeout:
            return EmailCheckResult(False, "dns_timeout", "DNS lookup timed out; try again.")
        except dns.exception.DNSException as e:
            return EmailCheckResult(False, "dns_error", str(e))

    return EmailCheckResult(True, None, normalized)
