#!/bin/bash
cd backend
composer install --no-dev
php artisan migrate --force
cd ../frontend
npm install
npm run build
cd ../backend
php artisan serve --host=0.0.0.0 --port=$PORT