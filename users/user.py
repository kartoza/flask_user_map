# coding=utf-8
"""User CRUD routines."""

import uuid

# Use jinja directly as we dont have guarantee of app context
# see http://stackoverflow.com/questions/17206728/
# attributeerror-nonetype-object-has-no-attribute-app
from jinja2 import Environment, PackageLoader
from users.utilities.db import get_conn, query_db
from users import APP


def add_user(
        name,
        email,
        latitude,
        longitude,
        role=0,
        email_updates=False):
    """Add a user to the database.

    :param name: Name of user.
    :type name: str

    :param email: Email of user.
    :type email: str

    :param latitude: latitude of this user
    :type latitude: float

    :param longitude: longitude of this uer
    :type longitude: float

    :param role: 0 if user , 1 if trainer, 2 if developer
    :type role: int

    :param email_updates: True if user wants email updates about project
        related activities. False if not.
    :type email_updates: bool

    :returns: Globally unique identifier for the added user.
    :rtype: str
    """
    conn = get_conn(APP.config['DATABASE'])
    guid = uuid.uuid4()

    if email_updates:
        email_updates = 1
    else:
        email_updates = 0

    env = Environment(
        loader=PackageLoader('users', 'templates'))
    template = env.get_template('add_user.sql')
    sql = template.render(
        guid=guid,
        name=name,
        email=email,
        role=role,
        email_updates=email_updates,
        longitude=longitude,
        latitude=latitude
    )
    conn.execute(sql)
    conn.commit()
    conn.close()
    return guid


def get_user(guid):
    """Get a user given their GUID.

    :param guid: Globally unique identifier for the requested user.
    :type guid: str

    :returns: A user expressed as a dictionary of key value pairs or None if
        the given GUID does not exist.
    :rtype: dict
    """
    conn = get_conn(APP.config['DATABASE'])
    sql = 'SELECT * FROM user WHERE guid="%s"' % guid
    users = query_db(conn, sql)
    if len(users) == 0:
        return None
    else:
        return users[0]


def get_all_users(role=0):
    """Get all users from database.

    :param role: Whether to fetch users, trainers, or developers. Default of
        0 will fetch users only.
    :type role: int

    :returns: A list of user objects.
    :rtype: list
    """
    conn = get_conn(APP.config['DATABASE'])

    sql = 'SELECT * FROM user WHERE role= %i' % role

    all_users = query_db(conn, sql)
    return all_users
