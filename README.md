# Laravel Ecom

Full-stack e-commerce layer for Laravel (Inertia + React + Fortify + Spatie Permission/Media + Larapay).

> **Important**: Install this **after** `susheelbhai/laravel-basekit` is installed and you have completed the Basekit setup flow.

## Requirements

- PHP ^8.2
- Laravel 12 or 13
- `susheelbhai/laravel-basekit` already installed and configured
- Node.js 20+ (frontend toolchain)

## Installation

### Laravel

Require this package in your app and update Composer.

```
composer require susheelbhai/laravel-ecom
```

## Configuration

### Required command order

Run these commands in order.

Installs the required **Composer** and **NPM** packages into **your app** (already-installed packages are skipped).

```
php artisan ecom:install_package
```

What it installs:
- Uses Basekit’s installer helper (Fortify, Inertia, Spatie Permission/Media, Socialite providers, Ziggy, etc.)
- Adds e-commerce extras: `laravel/wayfinder`, `susheelbhai/larapay`, and the `@laravel/vite-plugin-wayfinder` NPM package

Publishes the e-commerce application files (controllers, models, routes, views, migrations, seeders, assets, etc.) into your app.

```
php artisan vendor:publish --tag=ecom --force
```

Registers the e-commerce **service providers** in `bootstrap/providers.php` (Inertia SSR guard during Vite HMR, review aggregate observer). Run this **after** `vendor:publish` so the provider classes already exist under `app/Providers/`. **With no flags**, only `bootstrap/providers.php` is updated (safe and idempotent; Basekit is not run).

```
php artisan ecom:initial_settings
```

If you have **not** run Basekit’s environment wizard yet and want it in the same session, use:

```
php artisan ecom:initial_settings --with-basekit
```

You should still publish e-com assets when needed; provider files under `app/Providers/` must exist before the app boots.

### Database

Refresh the database and seed:

```
php artisan migrate:fresh --seed
```

Adjust seeders to match your environment.

### Frontend (Vite, Wayfinder, React)

After publishing, merge/replace your app’s root `package.json` and `vite.config.ts` with the versions provided by this package under `assets/root/` (or publish with `react_ecom_for_non_react_project` and reconcile conflicts).

Then install/build and generate Wayfinder routes:

```
npm install
npm run build
php artisan wayfinder:generate --no-interaction
```

Use `npm run dev` during development.

### Environment / config

- Copy/merge required `.env` keys for payments (`config/payment.php`), mail, and third-party APIs from your reference project.
- `config/ecom.php` is merged by the package provider; publish config if you need to override defaults.

## Installation with single action

From a fresh Laravel app (after Basekit is completed), run:

```
composer require susheelbhai/laravel-ecom

php artisan ecom:install_package
php artisan vendor:publish --tag=ecom --force
php artisan ecom:initial_settings
php artisan migrate:fresh --seed
npm install
npm run build
php artisan wayfinder:generate --no-interaction
npm run dev

```

## License

MIT
