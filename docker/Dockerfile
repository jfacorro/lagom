FROM alpine:3.6

COPY _build/prod/rel/lagom /opt/lagom

RUN apk add --update ncurses openssl ffmpeg \
    && adduser -D -S -u 1000 lagom \
    && mkdir -p /var/log/lagom \
    && chown -R lagom /opt/lagom \
    && chown -R lagom /var/log/lagom

USER lagom

ENTRYPOINT /opt/lagom/bin/lagom foreground
