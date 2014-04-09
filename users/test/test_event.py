# coding=utf-8
"""Test for event model module."""
__author__ = 'Akbar Gumbira (akbargumbira@gmail.com)'

from unittest import TestCase

import os
import datetime
from users import APP
from users.event import (
    add_event,
    edit_event,
    delete_event,
    get_event,
    get_all_events,
    get_past_events,
    publish_event)


class TestEvent(TestCase):
    """Test User Model."""
    #noinspection PyPep8Naming
    def setUp(self):
        """Runs before each test"""
        self.db_path = os.path.abspath(os.path.join(
            os.path.dirname(__file__),
            os.pardir,
            os.pardir,
            'test_users.db'))
        # Delete db_path first if exist
        if os.path.exists(self.db_path):
            os.remove(self.db_path)

        APP.config['DATABASE'] = self.db_path
        APP.config['TESTING'] = True
        self.app = APP.test_client()
        self.event_to_add = dict(
            event_type=0,
            name='InaSAFE 2.0 Release',
            organizer='Linfiniti',
            presenter_name='Tim Sutton',
            contact_email='tim@linfiniti.com',
            date='2014-04-01',
            description='InaSAFE will be released at this event.',
            number_participant=100,
            latitude=12.32,
            longitude=-13.03)

    def test_add_event(self):
        """Test for add user function."""
        number_of_events_before = len(get_all_events())
        guid = add_event(**self.event_to_add)
        self.assertIsNotNone(guid)
        number_of_events_after = len(get_all_events())
        self.assertEqual(number_of_events_before + 1, number_of_events_after)

    def test_edit_event(self):
        """Test for edit user function."""
        guid = add_event(**self.event_to_add)
        edited_data = dict(
            event_type=1,
            name='AIFDR',
            organizer='AIFDR',
            presenter_name='Akbar Gumbira',
            contact_email='akbargumbira@gmail.com',
            date='2014-04-09',
            description='New description',
            number_participant=120,
            latitude=-6.32,
            longitude=102.03,
            publish_status=1)
        guid = edit_event(guid, **edited_data)
        event = get_event(guid)
        for key in edited_data:
            self.assertEqual(edited_data[key], event[key])

    def test_delete_event(self):
        """Test for delete event function."""
        guid = add_event(**self.event_to_add)
        self.assertIsNotNone(guid)
        delete_event(guid)
        event = get_event(guid)
        self.assertEqual(event, None)

    def test_get_event(self):
        """Test for get event function."""
        guid = add_event(**self.event_to_add)
        self.assertIsNotNone(guid)
        event = get_event('')
        assert event is None
        event = get_event(guid)
        self.assertEqual('InaSAFE 2.0 Release', event['name'])

    def test_get_all_events(self):
        """Test for retrieving all events function."""
        events = get_all_events()
        # Test if all the attribute exist
        for event in events:
            self.assertEqual(len(event), 12)

    def test_get_past_events(self):
        """Test for retrieving all events function."""
        today = datetime.date.today()
        today_event = dict(
            event_type=0,
            name='InaSAFE 2.0 Release',
            organizer='AIFDR',
            presenter_name='Tim Sutton',
            contact_email='tim@linfiniti.com',
            date=today.isoformat(),
            description='InaSAFE will be released at this event.',
            number_participant=100,
            latitude=12.32,
            longitude=-13.03)
        # Add today event
        guid = add_event(**today_event)
        self.assertIsNotNone(guid)

        # Get all events
        all_events = get_all_events()

        # Get all past events from now
        past_events = get_past_events()
        # Test if all the attribute exist
        self.assertEqual(len(past_events) + 1, len(all_events))

    def test_publish_event(self):
        """Test for publish_event function."""
        guid = add_event(**self.event_to_add)
        publish_event(guid)
        event = get_event(guid)
        self.assertEqual(event['publish_status'], 1)
