# coding=utf-8
"""Test for user model module."""
__author__ = 'akbar'

from unittest import TestCase

import os
from users import APP
from users.user import (add_user,
                        edit_user,
                        delete_user,
                        get_user,
                        get_user_by_email,
                        get_all_users,
                        get_role_name)


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
            email='test@gmail.com',
            website='http://www.ac.com',
            role=0,
            email_updates='true',
            latitude=12.32,
            longitude=-13.03)

    def test_add_user(self):
        """Test for add user function."""
        number_of_users_before = len(get_all_users())
        guid = add_user(**self.user_to_add)
        self.assertIsNotNone(guid)
        number_of_users_after = len(get_all_users())
        self.assertEqual(number_of_users_before+1, number_of_users_after)

    def test_edit_user(self):
        """Test for edit user function."""
        guid = add_user(**self.user_to_add)
        edited_data = dict(
            name='Akbar Gumbira',
            email='gumbira@gmail.com',
            website='http://www.akbargumbira.com',
            role=2,
            email_updates='true',
            latitude=-6.32,
            longitude=102.03)
        guid = edit_user(guid, **edited_data)
        user = get_user(guid)
        for key in edited_data:
            if key != 'email_updates':
                self.assertEqual(edited_data[key], user[key])
        self.assertEqual(user['email_updates'], 1)

    def test_delete_user(self):
        """Test for delete user function."""
        guid = add_user(**self.user_to_add)
        self.assertIsNotNone(guid)
        delete_user(guid)
        user = get_user(guid)
        self.assertEqual(user, None)

    def test_get_user(self):
        """Test for getting user function."""
        guid = add_user(**self.user_to_add)
        self.assertIsNotNone(guid)
        user = get_user(None)
        assert user is None
        user = get_user(guid)
        self.assertEqual('Akbar', user['name'])

    def test_get_user_by_email(self):
        """Test for getting user function."""
        guid = add_user(**self.user_to_add)
        self.assertIsNotNone(guid)
        user = get_user_by_email(self.user_to_add['email'])
        self.assertEqual('Akbar', user['name'])

    def test_get_all_users(self):
        """Test for retrieving all user function."""
        users = get_all_users()
        # Test if all the attribute exist
        for user in users:
            self.assertEqual(len(user), 10)

    def test_get_role_name(self):
        """Test for getting the role name of a role number."""
        role = 1
        role_name = get_role_name(role)
        self.assertEqual(role_name, 'Trainer')

        role = 4
        with self.assertRaises(BaseException):
            get_role_name(role)
