#!/bin/bash

input="$1"
if [ "$input" == "psql" ]
then
    psql postgres://ihkdbchtyerhyc:22de2543c710ba18177160a98fe3a36cf56ccb9c1a60e4da586179661966c651@ec2-174-129-33-30.compute-1.amazonaws.com:5432/d4n75pprkrhv8p
elif [ "$input" == "deployserver" ] 
then
    git subtree push --prefix server heroku-server master
elif [ "$input" == "deployclient" ] 
then
    git subtree push --prefix client heroku-client master
fi