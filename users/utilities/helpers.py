# coding=utf-8
"""Helper methods."""
from flask import jsonify
from werkzeug.exceptions import HTTPException


def make_json_error(ex):
    """Return errors as json.

    See http://flask.pocoo.org/snippets/83/

    :param ex: An exception.
    :return:  HttpResponse
    """
    response = jsonify(message=str(ex))
    response.status_code = (
        ex.code
        if isinstance(ex, HTTPException)
        else 500)
    return response
