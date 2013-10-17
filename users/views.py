# coding=utf-8
"""Views to handle url requests. Flask main entry point is also defined here.
:copyright: (c) 2013 by Tim Sutton
:license: GPLv3, see LICENSE for more details.
"""
from datetime import datetime
import json
from flask import render_template, Response, request
from werkzeug.exceptions import default_exceptions

# App declared directly in __init__ as per
# http://flask.pocoo.org/docs/patterns/packages/#larger-applications
from . import APP
from users.utilities.helpers import make_json_error
from users.utilities.validator import (
    is_email_address_valid,
    is_required_valid,
    is_boolean)
from users.utilities.db_handler import get_conn, query_db


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
    # Get DB Connection and make a query to it
    conn = get_conn(APP.config['DATABASE'])
    sql_users = 'SELECT * FROM user'
    rows = query_db(conn, sql_users)

    # Form JSON from the rows
    json = (
        '{'
        '  "type": "FeatureCollection",'
        '  "features": [')
    first_rec = True
    for user in rows:
        if not first_rec:
            json += ','
        first_rec = False
        json += (
            '    {'
            '      "type": "Feature",'
            '      "properties": {'
            '        "name": "%s", '
            '        "popupContent": "%s"'
            '      },'
            '      "geometry": {'
            '      "type": "Point",'
            '      "coordinates": ['
            '        %s,'
            '        %s'
            '      ]'
            '      }'
            '    }' % (user['name'],
                       user['name'],
                       user['longitude'],
                       user['latitude']))

    json += '  ]}'

    # Return Response
    return Response(json, mimetype='application/json')


@APP.route('/add_user', methods=['POST'])
def add_user_view():
    """View to add a user.

    handle post request via ajax
    add the user to the user.db
    return a new json doc as in users.json
    js on client must update the map on ajax completion callback
    """
    # return any errors as json - see http://flask.pocoo.org/snippets/83/
    for code in default_exceptions.iterkeys():
        APP.error_handler_spec[None][code] = make_json_error

    # Get data from form
    name = str(request.form['name']).strip()
    email = str(request.form['email']).strip()
    role = str(request.form['role']).strip()
    notification = str(request.form['notification'])
    latitude = str(request.form['latitude'])
    longitude = str(request.form['longitude'])
    date_now = datetime.now().strftime('%Y-%m-%d')

    # Validate the data:
    message = {}
    if not is_required_valid(name):
        message['name'] = 'Name is required'
    if not is_required_valid(email):
        message['email'] = 'Email is required'
    if not is_email_address_valid(email):
        message['email'] = 'Email address is not valid'
    if not is_boolean(role):
        message['role'] = 'Role must be checked'
    elif not is_boolean(notification):
        message['notification'] = 'Notification must be boolean'

    if len(message) != 0:
        message['type'] = 'Error'
        return Response(json.dumps(message), mimetype='application/json')
    else:
        # Get DB Connection and insert data to database using that connection
        conn = get_conn(APP.config['DATABASE'])
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

        conn.execute(add_user_sql)
        conn.commit()

    # Prepare json for added user
    data = {
        'name': name,
        'longitude': longitude,
        'latitude': latitude}
    added_user = render_template('added_user.json', **data)

    # Return Response
    return Response(added_user, mimetype='application/json')


