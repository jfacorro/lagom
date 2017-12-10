lagom
=====

A robot that really listens what you have to say (in English).

Build
-----

    $ make

Dockerize
-----

It is possible to create a docker image that contains the release and
all dependencies by running:

    $ make docker

If you don't want to build the image yourself you can run the latest
image publish with the following command:

    $ docker run -p 8080:8080 -it jfacorro/lagom:latest
