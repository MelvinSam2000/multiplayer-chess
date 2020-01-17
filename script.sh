#!/bin/bash

input="$1"
if [ "$input" == "psql" ]
then
    psql $(grep -oP '(?<=DATABASE_URL=).*' server/.env)
elif [ "$input" == "deployserver" ] 
then
    git subtree push --prefix server heroku-server master
elif [ "$input" == "deployclient" ] 
then
    git subtree push --prefix client heroku-client master
else
    echo "Usage: ./script.sh <argument> "
fi