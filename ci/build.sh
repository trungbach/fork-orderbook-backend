#!/bin/bash

set -ex

echo $INAME
echo $PROD

regex='v[0-9].[0-9]+.[0-9]+$'
echo $DOCKER_TOKEN | docker login -u $DOCKER_USER --password-stdin

if [[ ${PROD} -n ]]; then
    if [[ ${IVERSION} =~ ${regex} ]]; then
        gh release create ${IVERSION} --title ${IVERSION}
        # login with docker
        # build and push docker image to repository
        docker build -t ${INAME} -f ./infrastructure/Dockerfile .
        docker push ${INAME}
    else
        gh release create ${IVERSION} --title ${IVERSION} --prerelease
    fi
else
    docker build -t ${INAME} -f ./infrastructure/Dockerfile .
    docker push ${INAME}
fi