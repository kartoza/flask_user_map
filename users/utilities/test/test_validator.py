# coding=utf-8
"""Tests for the validator module."""
from unittest import TestCase

from users.utilities.validator import (
    is_email_address_valid,
    is_required_valid,
    is_boolean)


class TestValidators(TestCase):
    """Test the form validator functions."""
    def test_is_email_address_valid(self):
        """Test email address validator."""
        phrase = 'tim$linfiniti.com'
        self.assertFalse(is_email_address_valid(phrase))
        phrase = 'linfiniti.com'
        self.assertFalse(is_email_address_valid(phrase))
        phrase = 'tim@linfiniticom'
        self.assertFalse(is_email_address_valid(phrase))
        phrase = 'tim@linfiniti.com.'
        self.assertFalse(is_email_address_valid(phrase))
        phrase = 'akbargumbira@gmail.com'
        self.assertTrue(is_email_address_valid(phrase))
        phrase = 'tim@linfiniti.com'
        self.assertTrue(is_email_address_valid(phrase))

    def test_is_required_valid(self):
        """Test that is required option parses correctly."""
        phrase = ''
        self.assertFalse(is_required_valid(phrase))
        phrase = '    '
        self.assertFalse(is_required_valid(phrase))
        phrase = 'foo'
        self.assertTrue(is_required_valid(phrase))

    def test_is_boolean_valid(self):
        """Test that is_boolean parses correctly."""
        phrase = ''
        self.assertFalse(is_boolean(phrase))
        phrase = 'terre'
        self.assertFalse(is_boolean(phrase))
        phrase = 'False'
        self.assertTrue(is_boolean(phrase))
        phrase = 'True'
        self.assertTrue(is_boolean(phrase))
        phrase = 'false'
        self.assertTrue(is_boolean(phrase))
        phrase = 'true'
        self.assertTrue(is_boolean(phrase))
