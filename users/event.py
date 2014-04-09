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
        longitude,
        publish_status=0):
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

    :param publish_status: The publish status of the event. 0 =
        unpublished, 1 = published. Default to unpublished.
    :type publish_status: int

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
        latitude=latitude,
        publish_status=publish_status
    )
    conn.execute(sql)
    conn.commit()
    conn.close()
    return guid


def edit_event(
        guid,
        event_type,
        name,
        organizer,
        presenter_name,
        contact_email,
        date,
        description,
        number_participant,
        latitude,
        longitude,
        publish_status):
    """Edit an event with given guid with all new attribute value.

    :param guid: Guid of event.
    :type guid: str

    :param event_type: The new type of the event.
    :type event_type: int

    :param name: The new name of the event.
    :type name: str

    :param organizer: The new organizer of the event.
    :type organizer: str

    :param presenter_name: The new presenter name of the event.
    :type presenter_name: str

    :param contact_email: The new contact email of the event.
    :type contact_email: str

    :param date: The new date of the event.
    :type date: str

    :param description: The new description of the event.
    :type description: str

    :param number_participant: The new number participant of the event.
    :type number_participant: int

    :param latitude: The new latitude of the event.
    :type latitude: float

    :param longitude: The new longitude of the event.
    :type longitude: float

    :param publish_status: The new publish status of the event. 0 =
        unpublished, 1 = published.
    :type publish_status: int

    :returns: Globally unique identifier for the edited event.
    :rtype: str
    """
    conn = get_conn(APP.config['DATABASE'])

    env = Environment(
        loader=PackageLoader('users', 'templates'))
    template = env.get_template('sql/update_event.sql')
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
        latitude=latitude,
        longitude=longitude,
        publish_status=publish_status
    )
    conn.execute(sql)
    conn.commit()
    conn.close()
    return guid


def delete_event(guid):
    """Delete an event with given guid

    :param guid: Guid of the event.
    :type guid: str
    """
    conn = get_conn(APP.config['DATABASE'])
    env = Environment(
        loader=PackageLoader('users', 'templates'))
    template = env.get_template('sql/delete_event.sql')
    sql = template.render(guid=guid)
    conn.execute(sql)
    conn.commit()
    conn.close()


def get_event(guid):
    """Get an event given its GUID.

    :param guid: Globally unique identifier for the requested event.
    :type guid: str

    :returns: An event expressed as a dictionary of key value pairs or None if
        the given GUID does not exist.
    :rtype: dict
    """
    conn = get_conn(APP.config['DATABASE'])
    sql = 'SELECT * FROM event WHERE guid="%s"' % guid
    events = query_db(conn, sql)
    if len(events) == 0:
        return None
    else:
        return events[0]


def get_all_events():
    """Get all events from table event from database.

    :returns: A list of event objects.
    :rtype: list
    """
    conn = get_conn(APP.config['DATABASE'])

    sql = 'SELECT * FROM event'

    all_events = query_db(conn, sql)
    return all_events


def get_past_events(from_date='now'):
    """Get all past events from database.

    :param from_date: The reference date. All event happens before this date
        would be categorised as past events. Default to now
    :type from_date: str

    :returns: A list of all past event objects.
    :rtype: list
    """
    conn = get_conn(APP.config['DATABASE'])
    sql = 'SELECT * from event WHERE date(date) < date("%s")' % from_date
    past_events = query_db(conn, sql)
    return past_events


def get_next_events(from_date='now'):
    """Get all next events from database.

    :param from_date: The reference date. All event happens at or after this
        date would be categorised as next events. Default to now
    :type from_date: str

    :returns: A list of all next event objects.
    :rtype: list
    """
    conn = get_conn(APP.config['DATABASE'])
    sql = 'SELECT * from event WHERE date(date) >= date("%s")' % from_date
    next_events = query_db(conn, sql)
    return next_events


def publish_event(guid):
    """Publish an event with given guid.

    :param guid: The guid of the event.
    :type guid: str
    """
    conn = get_conn(APP.config['DATABASE'])
    sql = 'UPDATE event SET publish_status=1 WHERE guid="%s"' % guid
    conn.execute(sql)
    conn.commit()
    conn.close()
