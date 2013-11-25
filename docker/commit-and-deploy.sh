#!/bin/bash
# Commit and redeploy the user map container
# 
if [ $# -ne 1 ]; then
    echo "Commit and then redeploy the user_map container."
    echo "Usage:"
    echo "$0 <version>"
    echo "e.g.:"
    echo "$0 1.6"
    echo "Will commit the current state of the container as version 1.6"
    echo "and then redeploy it."
    exit 1
fi
VERSION=$1
IDFILE=/home/timlinux/usermap-current-container.id
ID=`cat $IDFILE`
docker commit $ID linfiniti/user_map $VERSION
docker kill $ID
rm $IDFILE
docker run -cidfile="$IDFILE" -d -p 8099:80 -p 2099:22 -t linfiniti/user_map:$VERSION supervisord -n
NEWID=`cat $IDFILE`
echo "User map has been committed as $1 and redeployed as $NEWID"
docker ps -a | grep $NEWID


