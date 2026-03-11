FROM php:8.3-fpm

RUN apt-get update && apt-get install -y \
        libsqlite3-dev \
        unzip \
        git \
    && docker-php-ext-install pdo_sqlite \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html
COPY . .

RUN mkdir -p /var/www/html/data /var/www/html/uploads \
    && chown -R www-data:www-data /var/www/html/data /var/www/html/uploads

# Entrypoint: fix permissions on mounted volumes, then start services
RUN printf '#!/bin/sh\nmkdir -p /var/www/html/data /var/www/html/uploads\nchown -R www-data:www-data /var/www/html/data /var/www/html/uploads\nchmod 777 /var/www/html/data /var/www/html/uploads\nexec php-fpm\n' > /entrypoint.sh \
    && chmod +x /entrypoint.sh

EXPOSE 9000
CMD ["/entrypoint.sh"]
