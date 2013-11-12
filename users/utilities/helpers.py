# coding=utf-8
"""Helper methods."""
from threading import Thread

from flask import jsonify
from werkzeug.exceptions import HTTPException
from flask.ext.mail import Message

from users import mail

def make_json_error(ex):
    """Return errors as json.

    See http://flask.pocoo.org/snippets/83/

    :param ex: An exception.
    :return:  HttpResponse
    """
    response = jsonify(message=str(ex))
    response.status_code = (
        ex.code
        if isinstance(ex, HTTPException)
        else 500)
    return response


def send_async_email(message):
    """Function to send email by message. This function will be called by a
    thread on send_mail function.
    :param message: The message that will be sent.
    :type message: Message
    """
    mail.send(message)


def send_mail(sender, recipients, subject, text_body, html_body):
    """To send a single email from sender to receiver
    :param sender: Sender of the email.
    :type sender: str
    :param recipients: Recipients email address.
    :type recipients: list
    :param subject: Subject of the email.
    :type subject: str
    :param text_body: Text of the body.
    :type text_body: str
    :param html_body: HTML of the body.
    :type html_body: str
    """
    # Get mail server configuration
    message = Message(subject=subject, sender=sender, recipients=recipients)
    message.body = text_body
    message.html = html_body
    thread = Thread(target=send_async_email, args=[message])
    thread.start()

