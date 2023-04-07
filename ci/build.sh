#!/bin/sh

set -ex

echo $IVERSION
echo $ITAG
echo $INAME

echo $DOCKER_TOKEN | docker login -u $DOCKER_USER --password-stdin

docker build -t ${INAME} -f ./infrastructure/Dockerfile .
docker push ${INAME}