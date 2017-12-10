lagom
=====

A robot that really listens what you have to say (in English).

Requirements
------------

- Erlang/OTP 19 or higher
- [rebar3](https://github.com/erlang/rebar3)
- [ffmpeg](https://www.ffmpeg.org/) (run-time only)

Build
-----

To build the application run:

    $ make

Run
---

Execute the following command in the shell:

    $ rebar3 clojerl repl --apps lagom --sname lagom-app

and then visit [https://localhost:8443](https://localhost:8443).
The application will only work if you have [ffmpeg](https://www.ffmpeg.org/)
installed and in the `PATH`.

Website
-----

There is a running version of the latest tag of the application
[here](https://lagom.facorro.com/).

Dockerize
-----

It is possible to create a docker image that contains the release and
all dependencies by running:

    $ make docker

The last two lines after this command is done should look something like this.

    ...
    Successfully built 2d8805c2146c
    Successfully tagged jfacorro/lagom:0.1.1-4-g7b207d6

You can start the docker container by running the following command,
with the version of the docker image replaced to what your output
shows.

    $ docker run -p 8443:8443 -it jfacorro/lagom:0.1.1-4-g7b207d6

Once the image started visit [https://localhost:8443](https://localhost:8443)
and you'll see the application running.

If you don't want to build the image yourself you can run the `latest`
published image with the following command:

    $ docker run -p 8443:8443 -it jfacorro/lagom:latest

The Story
-----

The original goal was to build something in the likes of a personal
voice assisant. It turned out to be a little too ambitious, especially
since the client side audio recording took a lot of time to get right.

Ideally, our assistant would receive voice commands and ask for more input
when needed, maybe sometimes respond something clever. Right now it can
only speak its own language, an unknown dialect of Swedish that only
includes the word `lagom` (like
[`Hodor`](http://gameofthrones.wikia.com/wiki/Hodor) but without the
tragic background story).
