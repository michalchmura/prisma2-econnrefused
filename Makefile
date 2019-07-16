TAG=latest
IMAGE_NAME=workbench/workbench-prisma2-helloworld

DOCKER_IMAGE=${IMAGE_NAME}:${TAG}

.PHONY: build

build:
	docker build . -t ${DOCKER_IMAGE} --no-cache

run:
	docker run -it -p 8080:8080 -p 8081:8081 ${DOCKER_IMAGE}
