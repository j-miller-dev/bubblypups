#!/bin/bash
set -e

echo "==> Caching Laravel config..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

echo "==> Running migrations..."
php artisan migrate --force

echo "==> Setting permissions..."
chown -R www-data:www-data /app/storage /app/bootstrap/cache
usermod -aG www-data root

echo "==> Starting services..."
exec supervisord -c /app/supervisord.conf
