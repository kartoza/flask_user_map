# coding=utf-8
"""Views to handle url requests. Flask main entry point is also defined here.
:copyright: (c) 2013 by Tim Sutton
:license: GPLv3, see LICENSE for more details.
"""
import os
import sqlite3

from flask import render_template, Response  # request, jsonify, abort
# App declared directly in __init__ as per
# http://flask.pocoo.org/docs/patterns/packages/#larger-applications
from . import APP


@APP.route('/')
def map_view():
    """Default view - shows a map with users."""
    context = dict(
        current_tag_name='None',
        error='None',
    )
    #pylint: disable=W0142
    return render_template('base.html', **context)


@APP.route('/users.json')
def users_view():
    """Return a json document of users who have registered themselves."""

    db_file = os.path.abspath(
        os.path.join(os.path.dirname(__file__), os.path.pardir, 'users.db'))
    table_needed = False
    if not os.path.exists(db_file):
        table_needed = True
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()
    if table_needed:
        # create a table
        cursor.execute(
            'CREATE TABLE user (name TEXT, email TEXT, date_added TEXT, '
            'latitude FLOAT, longitude TEXT)')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM user')
    json = (
        '{'
        '  "type": "FeatureCollection",'
        '  "features": [')

    for user in cursor.fetchall():
        json += (
            '    {'
            '      "type": "Feature",'
            '      "properties": {'
            '        "name": "%s" '
            '      },'
            '      "geometry": {'
            '      "type": "Point",'
            '      "coordinates": ['
            '        %s,'
            '        %s'
            '      ]'
            '      }'
            '    }' % (user[0], user[4], user[3]))
    json += '  ]}'

    return Response(
        json, mimetype='application/json')


@APP.route('/add_user')
def add_user():
    """View to add a user.

    handle post request via ajax
    add the user to the user.db
    return a new json doc as in users.json
    js on client must update the map on ajax completion callback
    """
    pass
