# coding=utf-8
"""Views to handle url requests. Flask main entry point is also defined here.
:copyright: (c) 2013 by Tim Sutton
:license: GPLv3, see LICENSE for more details.
"""
import os
import sqlite3
import json
from datetime import datetime

from flask import render_template, Response, request  #,jsonify # abort
from werkzeug.exceptions import default_exceptions
# App declared directly in __init__ as per
# http://flask.pocoo.org/docs/patterns/packages/#larger-applications
from . import APP
from . import LOGGER
from helpers import make_json_error
from validator import is_email_address_valid, is_required_valid, is_boolean

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
            'CREATE TABLE user ('
            'name TEXT, email TEXT, is_developer BOOL,  '
            'wants_update BOOL, date_added TEXT, '
            'latitude FLOAT, longitude FLOAT)')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM user')
    json = (
        '{'
        '  "type": "FeatureCollection",'
        '  "features": [')
    first_rec = True
    for user in cursor.fetchall():
        if not first_rec:
            json += ','
        first_rec = False
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
            '    }' % (user[0], user[6], user[5]))

    json += '  ]}'
    return Response(
        json, mimetype='application/json')


@APP.route('/add_user', methods=['POST'])
def add_user():
    """View to add a user.

    handle post request via ajax
    add the user to the user.db
    return a new json doc as in users.json
    js on client must update the map on ajax completion callback
    """
    """Return a json document of users who have registered themselves."""

    # return any errors as json - see http://flask.pocoo.org/snippets/83/
    for code in default_exceptions.iterkeys():
        APP.error_handler_spec[None][code] = make_json_error

    # Go on to load / make our db as needed
    db_file = os.path.abspath(
        os.path.join(os.path.dirname(__file__), os.path.pardir, 'users.db'))
    table_needed = False
    if not os.path.exists(db_file):
        table_needed = True
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()
    if table_needed:
        path = os.path.abspath(
            os.path.join(
                os.path.dirname(__file__), 'resources', 'create_table.sql')
        )
        sql_file = open(path, 'rt')
        sql = sql_file.read()
        # create a table
        cursor.execute(sql)

    name = str(request.form['name']).strip()
    email = str(request.form['email']).strip()
    role = str(request.form['role']).strip()
    notification = str(request.form['notification'])
    latitude = str(request.form['latitude'])
    longitude = str(request.form['longitude'])
    date_now = datetime.now().strftime('%Y-%m-%d')

    # Validate the input:
    message_error = ""
    if not is_required_valid(name):
        message_error = "Name is required"
    elif not is_required_valid(email):
        message_error = "Email is required"
    elif not is_email_address_valid(email):
        message_error = "Email address is not valid"
    elif not is_boolean(role):
        message_error = "Role must be checked"
    elif not is_boolean(notification):
        message_error = "Notification must be boolean"

    if message_error != "":
        x = 2  # FIXME
    else:
        add_user_sql = (
            'INSERT INTO user VALUES("%s", "%s", "%s", "%s", "%s", "%s", '
            '"%s");') % (
                name,
                email,
                role,
                notification,
                date_now,
                latitude,
                longitude)

        cursor.execute(add_user_sql)
        conn.commit()

    #Just Test this function can be called from js
    #test = {
    #    'name': name,
    #    'email': email,
    #    'role': role,
    #    'notification': notification,
    #    'latitude': latitude,
    #    'longitude': longitude
    #}
    #test = json.dumps(test)
    #return Response(
    #    test, mimetype='application/json')

    context = {
        'name': name,
        'longitude': longitude,
        'latitude': latitude}

    page = render_template('added_user.json', **context)
    return Response(page, mimetype='application/json')


