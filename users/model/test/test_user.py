# coding=utf-8
"""Test for user model module."""
__author__ = 'akbar'

import os
from unittest import TestCase

from users import APP
from users.model.user import User


class TestUser(TestCase):
    """Test User Model."""
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

    def test_add_user(self):
        """Test for adding user function."""
        user = User()
        number_of_users_before = len(user.get_all_users())
        user_to_add = dict(
            name='Akbar',
            email='akbargumbira@gmail.com',
            is_developer='false',
            wants_update='true',
            date_added='2012-12-10',
            latitude='12',
            longitude='31')
        user.add_user(user_to_add)
        number_of_users_after = len(user.get_all_users())
        self.assertEqual(number_of_users_before+1, number_of_users_after)

    def test_get_all_users(self):
        """Test for retrieving all user function."""
        user = User()
        users = user.get_all_users()
        for a_user in users:
            self.assertEqual(len(a_user), 7)

