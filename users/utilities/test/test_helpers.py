# coding=utf-8
"""Test for helpers module."""
__author__ = 'akbar'

from unittest import TestCase
from users.utilities.helpers import send_mail, send_async_mail
from users import mail


class TestHelpers(TestCase):
    """Test Helpers Module."""
    #noinspection PyPep8Naming
    def setUp(self):
        """Constructor."""
        self.mail = dict(
            sender='sender@gmail.com',
            recipients=['recipient@gmail.com'],
            subject='Testing send mail',
            text_body='Testing',
            html_body='<p>Testing</p>')

    def test_send_mail(self):
        """Test for send_mail function."""
        with mail.record_messages() as outbox:
            send_mail(**self.mail)
            self.assertEqual(len(outbox), 1)
            self.assertEqual(outbox[0].sender, self.mail['sender'])
            self.assertEqual(outbox[0].recipients, self.mail['recipients'])
            self.assertEqual(outbox[0].subject, self.mail['subject'])
            self.assertEqual(outbox[0].body, self.mail['text_body'])
            self.assertEqual(outbox[0].html, self.mail['html_body'])

    def test_send_async_mail(self):
        """Test for send_async_mail function."""
        with mail.record_messages() as outbox:
            sender_thread = send_async_mail(**self.mail)
            sender_thread.join()
            self.assertEqual(len(outbox), 1)
            self.assertEqual(outbox[0].sender, self.mail['sender'])
            self.assertEqual(outbox[0].recipients, self.mail['recipients'])
            self.assertEqual(outbox[0].subject, self.mail['subject'])
            self.assertEqual(outbox[0].body, self.mail['text_body'])
            self.assertEqual(outbox[0].html, self.mail['html_body'])
