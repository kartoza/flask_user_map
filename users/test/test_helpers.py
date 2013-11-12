# coding=utf-8
"""Test for helpers module."""
__author__ = 'akbar'

from unittest import TestCase
from users.utilities.helpers import send_mail
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
            assert len(outbox) == 1
            assert outbox[0].sender == self.mail['sender']
            assert outbox[0].recipients == self.mail['recipients']
            assert outbox[0].subject == self.mail['subject']
            assert outbox[0].text_body == self.mail['text_body']
            assert outbox[0].html_body == self.mail['html_body']
