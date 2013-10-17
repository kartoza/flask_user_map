# coding=utf-8
"""Blueprint for user."""
__author__ = 'akbar'

from users.utilities.db_handler import get_conn, query_db
from users import APP


class User():
    """Implementation for User Model class.
    """
    def __init__(self):
        """Constructor."""
        # Initialize attribute
        self.table_name = 'user'

    def add_user(self, name='', email='', is_developer='', wants_update='',
                 date_added='', latitude='', longitude=''):
        """Add a to database.
        :param name: name of user
        :param email: email of user
        :param is_developer: true if developer, false if user
        :param wants_update: true if user wants update, false if not
        :param date_added: the date this user is added
        :param latitude: latitude of this user
        :param longitude: longitude of this uer
        """
        conn = get_conn(APP.config['DATABASE'])
        add_user_sql = ('INSERT '
                        'INTO %s '
                        'VALUES("%s", "%s", "%s", "%s","%s", "%s", "%s");') % \
                       (self.table_name,
                        name,
                        email,
                        is_developer,
                        wants_update,
                        date_added,
                        latitude,
                        longitude)

        conn.execute(add_user_sql)
        conn.commit()
        conn.close()

    def get_all_users(self):
        """Get All of users from database."""
        conn = get_conn(APP.config['DATABASE'])
        sql_users = 'SELECT * FROM %s' % self.table_name
        all_users = query_db(conn, sql_users)

        return all_users
