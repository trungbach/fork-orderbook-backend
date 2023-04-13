#!/bin/bash

set -ex

echo $INAME
echo $CURRENT_ENV

regex='v[0-9].[0-9]+.[0-9]+$'
echo $DOCKER_TOKEN | docker login -u $DOCKER_USER --password-stdin

build_prod() {
    if [[ ${IVERSION} =~ ${regex} ]]; then
        gh release create ${IVERSION} --title ${IVERSION}
        # login with docker
        # build and push docker image to repository
        docker build -t ${INAME} -f ./infrastructure/Dockerfile .
        docker push ${INAME}
    else
        gh release create ${IVERSION} --title ${IVERSION} --prerelease
    fi
}

build_dev() {
    docker build -t ${INAME} -f ./infrastructure/Dockerfile .
    docker push ${INAME}
}

case "${CURRENT_ENV}" in
    "PROD") 
        build_prod 
    ;;
    "DEV") 
        build_dev 
    ;;
esac
