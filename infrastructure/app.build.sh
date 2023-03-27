VERSION=1.0.0-dev
IMAGE_TAG=ABCD
IMAGE_REPOSITORY=ABCDE

for COMMAND in "$@"
do
    case "${COMMAND}"
        in
        "prod")
            VERSION=0.0.1
            IMAGE_TAG=devorai/orderbook
            IMAGE_REPOSITORY=$IMAGE_TAG:$VERSION
        ;;
        "staging")
            VERSION=0.0.4
            IMAGE_TAG=devorai/fd-orderbook-explorer-stg
            IMAGE_REPOSITORY=$IMAGE_TAG:$VERSION
        ;;
        "push")
            docker push $IMAGE_REPOSITORY
        ;;
    esac
done
echo DONE AND DONE
