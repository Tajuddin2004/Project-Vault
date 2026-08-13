# Controlled template: used by the sandbox worker, never supplied by a student.
FROM nginxinc/nginx-unprivileged:alpine
COPY --chown=101:101 . /usr/share/nginx/html
EXPOSE 8080
