"""Tests for emailcheck.validator (DNS mocked)."""

from __future__ import annotations

import unittest.mock as mock

import dns.resolver
import pytest

from emailcheck.validator import validate_email_address


def test_empty() -> None:
    r = validate_email_address("", check_mx=False)
    assert not r.valid
    assert r.reason == "empty"


def test_invalid_format() -> None:
    r = validate_email_address("not-an-email", check_mx=False)
    assert not r.valid
    assert r.reason == "invalid_format"


def test_disposable_domain() -> None:
    r = validate_email_address("foo@mailinator.com", check_mx=False)
    assert not r.valid
    assert r.reason == "disposable_domain"


@mock.patch("emailcheck.validator.dns.resolver.resolve")
def test_mx_success(mock_resolve: mock.MagicMock) -> None:
    mock_resolve.return_value = [object()]
    r = validate_email_address("user@gmail.com", check_disposable=False)
    assert r.valid


@mock.patch("emailcheck.validator.dns.resolver.resolve")
def test_mx_nxdomain(mock_resolve: mock.MagicMock) -> None:
    mock_resolve.side_effect = dns.resolver.NXDOMAIN()
    r = validate_email_address("a@totallymissingdomain.invalidxyz", check_disposable=False)
    assert not r.valid
    assert r.reason == "dns_failed"


@mock.patch("emailcheck.validator.dns.resolver.resolve")
def test_mx_no_answer(mock_resolve: mock.MagicMock) -> None:
    mock_resolve.side_effect = dns.resolver.NoAnswer()
    r = validate_email_address("a@example.com", check_disposable=False)
    assert not r.valid
    assert r.reason == "no_mx"
