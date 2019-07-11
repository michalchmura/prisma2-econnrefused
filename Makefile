TAG=latest
IMAGE_NAME=workbench/workbench-prisma2-helloworld

DOCKER_IMAGE=${IMAGE_NAME}:${TAG}

.PHONY: build

build:
	docker build . -t ${DOCKER_IMAGE}
