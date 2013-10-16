# coding=utf-8
"""Form Validator Function."""

import re


def is_required_valid(req_input):
    """Validate input that required
    :param req_input: input that neeeds to be validated
    :type req_input: str
    """
    req_input = req_input.strip()
    if len(req_input) != 0:
        return True

    return False


def is_email_address_valid(email):
    """Validate the email address using a regex.
    :param email: email input
    :type email: str`
    """
    if not re.match(
            "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.["
            "a-zA-Z0-9-]+)*$", email):
        return False
    return True


def is_boolean(param_input):
    """Check if param_input string is boolean 'type's
    :param param_input: input that need to be checked
    :type param_input: str
    """
    if param_input.lower() not in ['true', 'false']:
        return False
    return True
