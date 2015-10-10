FROM golang

MAINTAINER Phillip Couto phillip@couto.in
RUN mkdir /go/src/app
WORKDIR /go/src/app
ADD . /go/src/app/
RUN go get github.com/tools/godep
RUN godep go build
EXPOSE 80
EXPOSE 443
