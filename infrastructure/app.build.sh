VERSION=0.0.1
IMAGE_TAG=1
IMAGE_REPOSITORY=1

for COMMAND in "$@"
do
    case "${COMMAND}"
        in
        "prod")
            VERSION=0.0.1
            IMAGE_TAG=oraichain/foundation-orderbook_explorer
            IMAGE_REPOSITORY=$IMAGE_TAG:$VERSION
            echo BUILD IMAGE: $IMAGE_REPOSITORY
            docker build -f ./Dockerfile -t $IMAGE_REPOSITORY ../
        ;;
        "staging")
            VERSION=0.0.2
            IMAGE_TAG=oraichain/foundation-orderbook_explorer-stg
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
