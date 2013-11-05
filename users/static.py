# coding=utf-8
"""Helper module for serving static files when running in dev mode.
:copyright: (c) 2013 by Tim Sutton
:license: GPLv3, see LICENSE for more details.
"""
import os
from flask import abort, Response

#
# These are only used to serve static files when testing
#
FILE_SUFFIX_MIMETYPES = {
    '.css': 'text/css',
    '.jpg': 'image/jpeg',
    '.html': 'text/html',
    '.ico': 'image/x-icon',
    '.png': 'image/png',
    '.js': 'application/javascript',
    '.eot': 'application/vnd.ms-fontobject',
    '.svg': 'image/svg+xml',
    '.ttf': 'font/ttf',
    '.woff': 'application/font-woff'
}


def static_file(path):
    """Flask static file hander used for local testing.

    :param path: Path for the static resource to be served.
    :type path: str

    :returns: An http Response of the correct mime type for the resource
        requested.
    :rtype: HttpResponse
    """
    try:
        path = os.path.join(os.path.dirname(__file__), os.path.pardir, path)
        static_resource = open(path)
    except IOError:
        abort(404)
        return
    _, ext = os.path.splitext(path)
    if ext in FILE_SUFFIX_MIMETYPES:
        return Response(
            static_resource.read(), mimetype=FILE_SUFFIX_MIMETYPES[ext])
    return static_resource.read()
