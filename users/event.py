# coding=utf-8
"""Event CRUD routines."""

import uuid

# Use jinja directly as we dont have guarantee of app context
# see http://stackoverflow.com/questions/17206728/
# attributeerror-nonetype-object-has-no-attribute-app
from jinja2 import Environment, PackageLoader
from users.utilities.db import get_conn, query_db
from users import APP


def add_event(
        event_type,
        name,
        organizer,
        presenter_name,
        contact_email,
        date,
        description,
        number_participant,
        latitude,
        longitude):
    """Add an event to event table on database.

    :param event_type: Type of the event. It could be 0 (Presentation),
        1 (Training), 2 (Workshop), or 3 (Booth).
    :type event_type: int

    :param name: Event name.
    :type name: str

    :param organizer: The organizer of the event.
    :type organizer: str

    :param presenter_name: The name of the presenter.
    :type presenter_name: str

    :param contact_email: Email of the contact for the event.
    :type contact_email: str

    :param date: The date of the event.
    :type date: str

    :param description: The description of the event.
    :type description: str

    :param number_participant: The number of participant
    :type number_participant: int

    :param latitude: The latitude of the event.
    :type latitude: float

    :param longitude: The longitude of the event.
    :type longitude: float

    :returns: Globally unique identifier for the added event.
    :rtype: str
    """
    conn = get_conn(APP.config['DATABASE'])
    guid = uuid.uuid4()

    env = Environment(
        loader=PackageLoader('users', 'templates'))
    template = env.get_template('sql/add_event.sql')
    sql = template.render(
        guid=guid,
        event_type=event_type,
        name=name,
        organizer=organizer,
        presenter_name=presenter_name,
        contact_email=contact_email,
        date=date,
        description=description,
        number_participant=number_participant,
        longitude=longitude,
        latitude=latitude
    )
    conn.execute(sql)
    conn.commit()
    conn.close()
    return guid


def get_all_events():
    """Get all events from table event from database.

    :returns: A list of event objects.
    :rtype: list
    """
    conn = get_conn(APP.config['DATABASE'])

    sql = 'SELECT * FROM event'

    all_events = query_db(conn, sql)
    return all_events
