# coding=utf-8
"""Test for event model module."""
__author__ = 'Akbar Gumbira (akbargumbira@gmail.com)'

from unittest import TestCase

import os
from users import APP
from users.event import add_event, get_event, get_all_events


class TestEvent(TestCase):
    """Test User Model."""
    #noinspection PyPep8Naming
    def setUp(self):
        """Constructor."""
        self.db_path = os.path.abspath(os.path.join(
            os.path.dirname(__file__),
            os.pardir,
            os.pardir,
            'test_users.db'))
        APP.config['DATABASE'] = self.db_path
        APP.config['TESTING'] = True
        self.app = APP.test_client()
        self.event_to_add = dict(
            event_type=0,
            name='InaSAFE 2.0 Release',
            organizer='AIFDR',
            presenter_name='Tim Sutton',
            contact_email='tim@linfiniti.com',
            date='2014-04-07',
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

    def test_get_event(self):
        """Test for get event function."""
        guid = add_event(**self.event_to_add)
        self.assertIsNotNone(guid)
        event = get_event(None)
        assert event is None
        event = get_event(guid)
        self.assertEqual('InaSAFE 2.0 Release', event['name'])

    def test_get_all_events(self):
        """Test for retrieving all events function."""

        events = get_all_events()
        # Test if all the attribute exist
        for event in events:
            self.assertEqual(len(event), 12)
