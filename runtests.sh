#!/bin/bash
source venv/bin/activate
nosetests -v --with-id  users
deactivate
