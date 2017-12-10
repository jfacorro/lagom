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

If you don't want to build the image yourself you can run the `latest`
published image with the following command:

    $ docker run -p 8443:8443 -it jfacorro/lagom:latest

and then visit [https://localhost:8443](https://localhost:8443).

The Story
-----

The original goal was to build something in the likes of a personal
voice assisant. It turned out to be a little too ambitious, especially
since the client side audio recording took a lot of time to get right.

Ideally, our assisant would receive voice commands and ask for more input
when needed, maybe sometimes respond something clever. Right now it can
only speak its own language, an unknown dialect of Swedish that only
includes the word `lagom` (like
[`Hodor`](http://gameofthrones.wikia.com/wiki/Hodor) but without the
tragic background story).
