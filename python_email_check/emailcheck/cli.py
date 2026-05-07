"""CLI: python -m emailcheck.cli you@example.com"""

from __future__ import annotations

import json
import sys

from emailcheck.validator import validate_email_address


def main() -> None:
    if len(sys.argv) != 2:
        print("Usage: python -m emailcheck.cli <email>", file=sys.stderr)
        sys.exit(2)
    r = validate_email_address(sys.argv[1])
    print(json.dumps({"valid": r.valid, "reason": r.reason, "detail": r.detail}, indent=2))
    sys.exit(0 if r.valid else 1)


if __name__ == "__main__":
    main()
