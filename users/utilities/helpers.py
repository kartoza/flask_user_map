# coding=utf-8
"""Helper methods."""
import smtplib
from email.mime.text import MIMEText

from flask import jsonify
from werkzeug.exceptions import HTTPException

from users import APP


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


def send_mail(sender, recipient, subject, email_content):
    """To send a single email from sender to receiver
    :param sender: Sender email address.
    :type sender: str
    :param recipient: Recipient email address
    :type recipient: str
    :param subject: Subject of the email.
    :type subject: str
    :param email_content: Content of the email.
    :type email_content: str
    """
    # Get mail server configuration
    mail_server = APP.config['mail_server']
    # Create text/plain message
    message = MIMEText(email_content)

    # Prepare the message
    message['From'] = sender
    message['To'] = recipient
    message['Subject'] = subject

    # Send the message
    smtp_server = smtplib.SMTP(
        mail_server['SERVER'],
        mail_server['PORT'])
    smtp_server.ehlo()
    smtp_server.starttls()
    smtp_server.ehlo()
    smtp_server.login(
        mail_server['USERNAME'],
        mail_server['PASSWORD'])
    smtp_server.sendmail(sender, recipient, message.as_string())
    smtp_server.quit()

