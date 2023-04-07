#!/bin/sh
set -ex

IMAGE_TAG=oraichain/foundation-orderbook_explorer

for COMMAND in "$@"
do
    case "${COMMAND}"
        in
        "prod")
            VERSION=$(git tag --points-at HEAD)
            IMAGE_REPOSITORY=$IMAGE_TAG:$VERSION
            echo BUILD IMAGE: $IMAGE_REPOSITORY
            docker build -f ./Dockerfile -t $IMAGE_REPOSITORY ../
        ;;
        "staging")
            VERSION=$(git rev-parse --short HEAD)
            IMAGE_REPOSITORY=$IMAGE_TAG:$VERSION
            echo BUILD IMAGE: $IMAGE_REPOSITORY
            docker build -f ./Dockerfile -t $IMAGE_REPOSITORY ../
        ;;
        "push")
            docker push $IMAGE_REPOSITORY
        ;;
    esac
done
echo DONE AND DONE
