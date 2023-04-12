#!/bin/sh

set -ex

echo $INAME
regex='v[0-9].[0-9]+.[0-9]+$'

if [[ ${IVERSION} =~ ${regex} ]]; then
    gh release create ${IVERSION} --title ${IVERSION}
    # login with docker
    echo $DOCKER_TOKEN | docker login -u $DOCKER_USER --password-stdin
    # build and push docker image to repository
    docker build -t ${INAME} -f ./infrastructure/Dockerfile .
    docker push ${INAME}
else
    gh release create ${IVERSION} --title ${IVERSION} --prerelease
fi