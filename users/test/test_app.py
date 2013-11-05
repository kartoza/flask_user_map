# coding=utf-8
"""Tests for the application web urls.
:copyright: (c) 2013 by Tim Sutton
:license: GPLv3, see LICENSE for more details.
"""
import os

from users.views import APP
from users.test.logged_unittest import LoggedTestCase
from users import LOGGER
from users.utilities.db import get_conn


class AppTestCase(LoggedTestCase):
    """Test the application."""
    #noinspection PyPep8Naming
    def setUp(self):
        """Constructor."""
        self.db_path = os.path.abspath(os.path.join(
            os.path.dirname(__file__),
            os.pardir,
            os.pardir,
            os.pardir,
            'test_users.db'))

        if os.path.exists(self.db_path):
            os.remove(self.db_path)

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

    #noinspection PyPep8Naming
    def tearDown(self):
        """Destructor."""
        pass

    def test_home(self):
        """Test the home page works."""
        try:
            return self.app.post('/', data=dict(), follow_redirects=True)
        except Exception, e:
            LOGGER.exception('Basic front page load failed.')
            raise e

    def test_users_view(self):
        """Test the users json response works."""
        conn = get_conn(self.db_path)
        sql = (
            'INSERT INTO user VALUES('
            '1, "12212", "Akbar", "akbargum@gmail.com", "http://www.ac.com",'
            '1, 1, "2013-10-16", 75.672197, -42.187500);')
        conn.execute(sql)
        conn.commit()
        conn.close()

        try:
            result = self.app.post(
                '/users.json', data=dict(user_type=1), follow_redirects=True)
            self.assertTrue('Akbar' in result.data)
        except Exception, e:
            LOGGER.exception('Basic front page load failed.')
            raise e

    def test_add_user_view(self):
        """Test the user added json response works."""
        try:
            result = self.app.post(
                '/add_user', data=self.user_to_add, follow_redirects=True)
            self.assertTrue('Akbar' in result.data)
        except Exception, e:
            LOGGER.exception('Page load failed.')
            raise e

        try:
            result = self.app.post(
                '/add_user', data=dict(
                    name='Akbar',
                    email='testgmail.com',
                    website='http://www.ac.com',
                    role=1,
                    email_updates='true',
                    latitude='12',
                    longitude='31'
                ), follow_redirects=True)
            self.assertTrue('Error' in result.data)
        except Exception, e:
            LOGGER.exception('Page load failed.')
            raise e
