# coding=utf-8
"""Module to handle database connection using sqlite3."""
__author__ = 'Akbar Gumbira (akbargumbira@gmail.com)'

import os
import sqlite3
from flask import g
from users import APP


def get_conn(db_path):
    """Get current database connection.

    Will create the database if needed.

    :param db_path: Path to the sqlite file.
    :type db_path: str

    """
    table_needed = True
    if os.path.exists(db_path):
        table_needed = False

    # connect to the db, creating it if needed
    conn = sqlite3.connect(db_path)

    # if its a new db we also need to create the schema
    if table_needed:
        schema_path = os.path.abspath(os.path.join(
            os.path.dirname(__file__),
            os.pardir,
            'resources',
            'create_table.sql'))
        # create the users table
        with APP.app_context():
            sql = file(schema_path, mode='r').read()
            conn.cursor().executescript(sql)
            conn.commit()

    conn.row_factory = sqlite3.Row
    return conn


def close_connection(conn):
    """Close database connection.

    :param conn: An open database connection.
    """
    conn.close()


def query_db(conn, query, args=(), one=False):
    """Query database, execute, fetch, and close connection.

    :param conn: An open database connection.
    :type conn: sqlite.connection

    :param query: SQLite Query

    :param args: Parameter to pass

    :param one: Fetch one if True

    :return: one row if one = True, all if False, None if no rows returned

    USAGE:
    1.  for user in query_db('select * from users'):
        print user['username'], 'has the id', user['user_id']

    2.  user = query_db('select * from users where username = ?',
                [the_username], one=True)
        if user is None:
            print 'No such user'
        else:
            print the_username, 'has the id', user['user_id']
    """
    cur = conn.execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv
