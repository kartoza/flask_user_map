# coding=utf-8
"""Views to handle url requests. Flask main entry point is also defined here.
:copyright: (c) 2013 by Tim Sutton
:license: GPLv3, see LICENSE for more details.
"""
import json

from flask import render_template, Response, request, url_for
from werkzeug.exceptions import default_exceptions

# App declared directly in __init__ as per
# http://flask.pocoo.org/docs/patterns/packages/#larger-applications
from . import APP
from users.utilities.helpers import make_json_error, send_mail
from users.utilities.validator import (
    is_email_address_valid,
    is_required_valid,
    is_boolean)
from users.user import (add_user,
                        edit_user,
                        delete_user,
                        get_user,
                        get_user_by_email,
                        get_all_users)
from config import MAIL_ADMIN


@APP.route('/')
def map_view():
    """Default view - shows a map with users."""
    context = dict(
        current_tag_name='None',
        error='None'
    )
    #pylint: disable=W0142
    return render_template('index.html', **context)


@APP.route('/users.json', methods=['POST'])
def users_view():
    """Return a json document of users with given role who have registered."""
    # Get data:
    user_role = int(request.form['user_role'])

    # Create model user
    all_users = get_all_users(role=user_role)
    json_users = render_template('users.json', users=all_users)

    users_json = (
        '{'
        ' "users": %s'
        '}' % json_users
    )
    # Return Response
    return Response(users_json, mimetype='application/json')


@APP.route('/add_user', methods=['POST'])
def add_user_view():
    """Controller to add a user.

    Handle post request via ajax and add the user to the user.db

    :returns: A new json response as in users.json.
    :rtype: HttpResponse

    .. note:: JavaScript on client must update the map on ajax completion
        callback.
    """
    # return any errors as json - see http://flask.pocoo.org/snippets/83/
    for code in default_exceptions.iterkeys():
        APP.error_handler_spec[None][code] = make_json_error

    # Get data from form
    name = str(request.form['name']).strip()
    email = str(request.form['email']).strip()
    website = str(request.form['website'])
    role = int(request.form['role'])
    email_updates = str(request.form['email_updates'])
    latitude = str(request.form['latitude'])
    longitude = str(request.form['longitude'])

    # Validate the data:
    message = {}
    if not is_required_valid(name):
        message['name'] = 'Name is required'
    if not is_email_address_valid(email):
        message['email'] = 'Email address is not valid'
    if not is_required_valid(email):
        message['email'] = 'Email is required'
    if role not in [0, 1, 2]:
        message['role'] = 'Role must be checked'
    elif not is_boolean(email_updates):
        message['email_updates'] = 'Notification must be checked'

    # Check if the email has been registered by other user:
    user = get_user_by_email(email)
    if user is not None:
        message['email'] = 'Email has been registered by other user.'

    # Process data
    if len(message) != 0:
        message['type'] = 'Error'
        return Response(json.dumps(message), mimetype='application/json')
    else:
        # Modify the data:
        if email_updates == 'true':
            email_updates = True
        else:
            email_updates = False

        if len(website.strip()) != 0 and 'http' not in website:
            website = 'http://' + website

        # Create model for user and add user
        guid = add_user(
            name=name,
            email=email,
            website=website,
            role=int(role),
            email_updates=bool(email_updates),
            latitude=float(latitude),
            longitude=float(longitude))

    # Prepare json for added user
    added_user = get_user(guid)

    # Send Email Confirmation:
    subject = 'User Map Registration'
    body = render_template('add_confirmation_email.txt',
                           url=url_for('map_view', _external=True),
                           user=added_user)
    recipient = added_user['email']
    send_mail(sender=MAIL_ADMIN, recipients=[recipient], subject=subject,
              text_body=body, html_body='')

    added_user_json = render_template('users.json', users=[added_user])
    # Return Response
    return Response(added_user_json, mimetype='application/json')


@APP.route('/edit/<guid>')
def edit_user_view(guid):
    """View to edit a user with given guid.

    :param guid: The unique identifier of a user.
    :type guid: str
    :returns: Page where user can edit his/her data
    :rtype: HttpResponse
    """
    user = get_user(guid)

    user_json = render_template('user.json', user=user)
    context = dict(
        current_tag_name='None',
        error='None',
        user=user_json
    )
    #pylint: disable=W0142
    return render_template('edit.html', **context)


@APP.route('/edit_user', methods=['POST'])
def edit_user_controller():
    """Controller to edit a user.

    Handle post request via ajax and edit the user to the user.db

    :returns: A new json response containing status of editing
    :rtype: HttpResponse
    """
    # return any errors as json - see http://flask.pocoo.org/snippets/83/
    for code in default_exceptions.iterkeys():
        APP.error_handler_spec[None][code] = make_json_error

    # Get data from form
    guid = str(request.form['guid'])
    name = str(request.form['name']).strip()
    email = str(request.form['email']).strip()
    website = str(request.form['website'])
    role = int(request.form['role'])
    email_updates = str(request.form['email_updates'])
    latitude = str(request.form['latitude'])
    longitude = str(request.form['longitude'])

    # Validate the data:
    message = {}
    if not is_required_valid(name):
        message['name'] = 'Name is required'
    if not is_email_address_valid(email):
        message['email'] = 'Email address is not valid'
    if not is_required_valid(email):
        message['email'] = 'Email is required'
    if role not in [0, 1, 2]:
        message['role'] = 'Role must be checked'
    elif not is_boolean(email_updates):
        message['email_updates'] = 'Notification must be checked'

    # Modify the data:
    if email_updates == 'true':
        email_updates = True
    else:
        email_updates = False

    if len(website.strip()) != 0 and 'http' not in website:
        website = 'http://'+website

    # Process data
    if len(message) != 0:
        message['type'] = 'Error'
        return Response(json.dumps(message), mimetype='application/json')
    else:
        # Edit User
        guid = edit_user(
            guid=guid,
            name=name,
            email=email,
            website=website,
            role=int(role),
            email_updates=bool(email_updates),
            latitude=float(latitude),
            longitude=float(longitude))

    edited_user = get_user(guid)
    edited_user_json = render_template('user.json', user=edited_user)
    # Return Response
    return Response(edited_user_json, mimetype='application/json')


@APP.route('/delete/<guid>', methods=['POST'])
def delete_user_view(guid):
    """View to delete a user with given guid.

    :param guid: The unique identifier of a user.
    :type guid: str
    :returns: index page
    :rtype: HttpResponse
    """
    # Delete User
    delete_user(guid)
    return url_for('map_view')


@APP.route('/download')
def download_view():
    """View to download users.

    Handle post request via ajax and return file to browser

    :returns: A csv file containing all users
    :rtype: HttpResponse
    """
    csv_users = "ID|NAME|WEBSITE|ROLE|LONGITUDE|LATITUDE"
    all_user_role = (0, 1, 2)
    i = 0
    for user_role in all_user_role:
        users = get_all_users(user_role)
        for user in users:
            i += 1
            csv_users += ('\n%i|%s|%s|%i|%s|%s') % (
                i,
                user['name'],
                user['website'],
                user['role'],
                user['longitude'],
                user['latitude'])

    return Response(
        csv_users,
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment;filename='users.csv'"})


@APP.route('/reminder', methods=['POST'])
def reminder_view():
    """View to send reminder email to user.

    :returns: JSON Response containing status of the process
    :rtype: JSONResponse
    """
    message = dict()

    email = str(request.form['email']).strip()
    user = get_user_by_email(email)

    if user is None:
        message['type'] = 'Error'
        message['email'] = 'Email is not registered in our database.'
        return Response(json.dumps(message), mimetype='application/json')

    # Send Email Confirmation:
    subject = 'User Map Edit Link'
    body = render_template('add_confirmation_email.txt',
                           url=url_for('map_view', _external=True),
                           user=user)
    send_mail(sender=MAIL_ADMIN, recipients=[email], subject=subject,
              text_body=body, html_body='')

    message['type'] = 'Success'
    return Response(json.dumps(message), mimetype='application/json')
