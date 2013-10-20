# coding=utf-8
"""Test for user model module."""
__author__ = 'akbar'

from unittest import TestCase

import os
from users import APP
from users.user import add_user, get_all_users, get_user


class TestUser(TestCase):
    """Test User Model."""
    #noinspection PyPep8Naming
    def setUp(self):
        """Constructor."""
        self.db_path = os.path.abspath(os.path.join(
            os.path.dirname(__file__),
            os.pardir,
            os.pardir,
            os.pardir,
            'test_users.db'))
        APP.config['DATABASE'] = self.db_path
        APP.config['TESTING'] = True
        self.app = APP.test_client()
        self.user_to_add = dict(
            name='Akbar',
            email='akbargumbira@gmail.com',
            is_developer='false',
            email_updates='true',
            latitude=12.32,
            longitude=-13.03)

    def test_add_user(self):
        """Test for adding user function."""
        number_of_users_before = len(get_all_users(True))
        guid = add_user(**self.user_to_add)
        self.assertIsNotNone(guid)
        number_of_users_after = len(get_all_users(True))
        self.assertEqual(number_of_users_before+1, number_of_users_after)

    def test_get_user(self):
        """Test for getting user function."""
        guid = add_user(**self.user_to_add)
        self.assertIsNotNone(guid)
        user = get_user(None)
        assert user is None
        user = get_user(guid)
        self.assertEqual('Akbar', user['name'])

    def test_get_all_users(self):
        """Test for retrieving all user function."""
        users = get_all_users()
        for user in users:
            self.assertEqual(len(user), 7)
