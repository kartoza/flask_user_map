# coding=utf-8
"""Tests for the application web urls.
:copyright: (c) 2013 by Tim Sutton
:license: GPLv3, see LICENSE for more details.
"""
import os

from users.views import APP
from users.test.logged_unittest import LoggedTestCase
from users import LOGGER
from users.user import add_user, get_user


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
        self.correct_user_data = dict(
            name='Akbar',
            email='test@gmail.com',
            website='http://www.ac.com',
            role=1,
            email_updates='true',
            latitude=12.32,
            longitude=-13.03)
        self.wrong_user_data = dict(
            name='',
            email='testgmaicom',
            website='http://www.ac.com',
            role=1,
            email_updates='true',
            latitude=12.32,
            longitude=-13.03)
        self.edited_user_data = dict(
            name='Akbar Gumbira',
            email='test@gmail.com',
            website='http://www.ac.com',
            role=1,
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
        guid = add_user(**self.correct_user_data)
        if guid is not None:
            try:
                result = self.app.post(
                    '/users.json',
                    data=dict(user_role=1),
                    follow_redirects=True)
                data = result.__getattribute__('data')
                self.assertTrue('Akbar' in data)
            except Exception, e:
                LOGGER.exception('Basic front page load failed.')
                raise e

    def test_add_user_view(self):
        """Test the user added json response works."""
        # Test correct data
        try:
            result = self.app.post(
                '/add_user',
                data=self.correct_user_data,
                follow_redirects=True)
            data = result.__getattribute__('data')
            self.assertTrue('Akbar' in data)
        except Exception, e:
            LOGGER.exception('Page load failed.')
            raise e

        # Test wrong data
        try:
            result = self.app.post(
                '/add_user', data=self.wrong_user_data, follow_redirects=True)
            data = result.__getattribute__('data')
            self.assertTrue('Error' in data)
        except Exception, e:
            LOGGER.exception('Page load failed.')
            raise e

    def test_edit_user_view(self):
        """Test the edit_user_view function.
        """
        guid = add_user(**self.correct_user_data)
        url = '/edit/%s' % guid
        try:
            return self.app.get(url, data=dict(), follow_redirects=True)
        except Exception, e:
            LOGGER.exception('Basic front page load failed.')
            raise e

    def test_edit_user_controller(self):
        """Test the edit_user_view function.
        """
        guid = add_user(**self.correct_user_data)
        self.edited_user_data['guid'] = guid
        url = '/edit_user'
        try:
            result = self.app.post(
                url,
                data=self.edited_user_data,
                follow_redirects=True)
            data = result.__getattribute__('data')
            self.assertTrue('Akbar Gumbira' in data)
        except Exception, e:
            LOGGER.exception('Basic front page load failed.')
            raise e

    def test_delete_user_view(self):
        """Test the delete_user_view function.
        """
        guid = add_user(**self.correct_user_data)
        url = '/delete/%s' % guid
        try:
            self.app.post(
                url,
                data=dict(),
                follow_redirects=True)
            user = get_user(guid)
            self.assertIsNone(user)

        except Exception, e:
            LOGGER.exception('Basic front page load failed.')
            raise e

    def test_download_view(self):
        """Test the download_view function.
        """
        url = '/download'
        try:
            return self.app.get(url, data=dict(), follow_redirects=True)
        except Exception, e:
            LOGGER.exception('Basic front page load failed.')
            raise e

    def test_reminder_view(self):
        """Test the download_view function.
            """
        url = '/reminder'

        # Test OK
        guid = add_user(**self.correct_user_data)
        if guid is not None:
            email = self.correct_user_data['email']
            try:
                result = self.app.post(
                    url, data=dict(email=email), follow_redirects=True)
                data = result.__getattribute__('data')
                self.assertTrue('Success' in data)
            except Exception, e:
                LOGGER.exception('Basic front page load failed.')
                raise e

        # Test Error
        try:
            result = self.app.post(
                url,
                data=dict(
                    email='notok@email.com'),
                follow_redirects=True)
            data = result.__getattribute__('data')
            self.assertTrue('Error' in data)
        except Exception, e:
            LOGGER.exception('Basic front page load failed.')
            raise e
