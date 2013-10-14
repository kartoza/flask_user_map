# coding=utf-8
"""Views to handle url requests. Flask main entry point is also defined here.
:copyright: (c) 2013 by Tim Sutton
:license: GPLv3, see LICENSE for more details.
"""

from flask import request, jsonify, render_template, Response, abort
# App declared directly in __init__ as per
# http://flask.pocoo.org/docs/patterns/packages/#larger-applications
from . import app


@app.route('/')
def hello_world():
    """Default view - shows a map with users."""
    context = dict(
        current_tag_name='None',
        error='None',
    )
    return render_template('base.html', **context)


@app.route('/users')
def users():
    """Return a json document of users who have registered themselves."""
    return (
        '{'
        '  "type": "FeatureCollection",'
        '  "features": ['
        '    {'
        '      "type": "Feature",'
        '      "properties": {'
        '        "name": "Tim Sutton"'
        '      },'
        '      "geometry": {'
        '      "type": "Point",'
        '      "coordinates": ['
        '        22.5,'
        '        -30.44867367928756'
        '      ]'
        '      }'
        '    }'
        '  ]'
        '}')


