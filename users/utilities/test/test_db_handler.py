# coding=utf-8
"""Test for DB Handler module."""
import os
from unittest import TestCase
from users.utilities.db import get_conn, query_db


class TestDbHandler(TestCase):
    """Test db_handler module."""
    #noinspection PyPep8Naming
    def setUp(self):
        """Set up things before debugging."""
        #noinspection PyUnresolvedReferences
        self.db_path = os.path.abspath(os.path.join(
            os.path.dirname(__file__),
            os.pardir,
            os.pardir,
            os.pardir,
            'test_users.db'))
        if os.path.exists(self.db_path):
            os.remove(self.db_path)
        self.conn = get_conn(self.db_path)

    #noinspection PyPep8Naming
    def tearDown(self):
        """Setup things after debugging."""
        pass

    def test_get_db(self):
        """Test get_db works correctly."""
        assert self.conn is not None

    def test_query_db(self):
        """Test query_db works correctly."""
        sql = (
            'INSERT INTO user VALUES('
            '1, "feefifofum", "Akbar", "akbarm@gmail.com", "http:www.ac.com",'
            '"true", "true", "2013-10-16", "75.672197", "-42.187500");')
        self.conn.execute(sql)
        self.conn.commit()
        sql = 'SELECT * from user;'
        result = query_db(self.conn, sql)
        self.assertTrue(len(result) == 1)
