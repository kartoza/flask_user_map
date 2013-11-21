#!/bin/bash

# Jenkins script to run tests under CI
#
# Tim Sutton, November 2013

export USER_MAP_LOGFILE='/tmp/user_map-jenkins.log'
rm -rf venv
virtualenv venv
source venv/bin/activate
venv/bin/pip install -r requirements.txt
venv/bin/pip install pep8 pylint nose nosexcover
if [ -f users.db ];
then
  rm users.db
fi
if [ -f test_users.db ];
then
  rm test_users.db
fi
export PYTHONPATH=`pwd`/users:`pwd`:`pwd`/venv/lib/python2.7/site-packages/
nosetests -v --with-id --with-xcoverage --with-xunit --verbose --cover-package=users users
#rm -f pylint.log
# We do || exit 0 to prevent the build failing even for small jenkins warnings
# see http://stackoverflow.com/questions/7347233/jenkins-with-pylint-gives-build-failure
pylint --output-format=parseable --reports=y --rcfile=pylintrc users > pylint.log || exit 0
pep8 --repeat --ignore W391 --exclude venv,none.py . > pep8.log
deactivate
