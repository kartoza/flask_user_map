# coding=utf-8
"""Blueprint for user."""
__author__ = 'akbar'

from users.utilities.db_handler import get_conn, query_db
from users import APP


class User(object):
    """Implementation for User Model class.
    """
    def __init__(self):
        """Constructor."""
        # Initialize attribute
        self.table_name = 'user'
        self.column_name = {
            'name': 'name',
            'email': 'email',
            'is_developer': 'is_developer',
            'wants_update': 'wants_update',
            'date_added': 'date_added',
            'latitude': 'latitude',
            'longitude': 'longitude'
        }

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

    def get_all_users(self, is_developer=False):
        """Get All of users from database.

        :param is_developer: is_developer role.
        Fetch all users who have role user if is_developer=False. Fetch all
        users who have role developer if is_developer=Trues
        """
        sql_users = ''

        if is_developer:
            print 'dor'
            sql_users += 'SELECT * FROM %s WHERE "%s"="%s" ' % (
                self.table_name,
                self.column_name['is_developer'],
                'true'
            )
        else:
            print 'teng'
            sql_users += 'SELECT * FROM %s WHERE "%s"="%s" ' % (
                self.table_name,
                self.column_name['is_developer'],
                'false'
            )
        conn = get_conn(APP.config['DATABASE'])
        all_users = query_db(conn, sql_users)
        return all_users


user = User()
res = user.get_all_users(is_developer=True)

