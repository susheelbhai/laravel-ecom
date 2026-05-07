<?php

namespace Susheelbhai\Ecom;

use Illuminate\Support\Facades\File;
use Illuminate\Support\ServiceProvider;
use Susheelbhai\Ecom\Commands\EcomInitialSettingsCommand;
use Susheelbhai\Ecom\Commands\InstallEcomPackageCommand;
use Susheelbhai\Ecom\Commands\RecomputeProductRatingsCommand;

class EcomServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__.'/../config/ecom.php', 'ecom');

        $this->loadViewsFrom(__DIR__.'/../resources/views', 'ecom');
    }

    public function boot(): void
    {
        $this->registerPublishable();
        $this->ensurePublicNoImagePlaceholder();

        if ($this->app->runningInConsole()) {
            $this->commands([
                InstallEcomPackageCommand::class,
                EcomInitialSettingsCommand::class,
                RecomputeProductRatingsCommand::class,
            ]);
        }
    }

    public function registerPublishable(): void
    {
        $publishables = [
            __DIR__.'/Actions' => app_path('Actions'),
            __DIR__.'/Concerns' => app_path('Concerns'),
            __DIR__.'/Console' => app_path('Console'),
            __DIR__.'/Contracts' => app_path('Contracts'),
            __DIR__.'/Http' => app_path('Http'),
            __DIR__.'/Providers' => app_path('Providers'),
            __DIR__.'/Models' => app_path('Models'),
            __DIR__.'/Policies' => app_path('Policies'),
            __DIR__.'/Services' => app_path('Services'),
            __DIR__.'/Strategies' => app_path('Strategies'),
            __DIR__.'/Support' => app_path('Support'),
            __DIR__.'/Traits' => app_path('Traits'),
            __DIR__.'/Notifications' => app_path('Notifications'),
            __DIR__.'/Helpers' => app_path('Helpers'),
            __DIR__.'/Events' => app_path('Events'),
            __DIR__.'/Enums' => app_path('Enums'),
            __DIR__.'/Listeners' => app_path('Listeners'),
            __DIR__.'/Livewire' => app_path('Livewire'),
            __DIR__.'/View' => app_path('View'),
            __DIR__.'/../database' => database_path('/'),
            __DIR__.'/../config' => config_path('/'),
            __DIR__.'/../routes' => base_path('routes'),
            __DIR__.'/../resources/views' => base_path('resources/views'),
            __DIR__.'/../resources/css' => base_path('resources/css'),
            __DIR__.'/../resources/js' => base_path('resources/js'),
            __DIR__.'/../resources/react_views' => base_path('resources/views'),
            __DIR__.'/../resources/mail_views' => base_path('resources/views'),
            __DIR__.'/../resources/data' => base_path('resources/data'),

            __DIR__.'/../assets/storage_public/media' => storage_path('app/public'),
            __DIR__.'/../assets/storage_public/.gitignore' => storage_path('app/public/.gitignore'),
            __DIR__.'/../assets/storage_public/.sync-exclude.lst' => storage_path('.sync-exclude.lst'),
            __DIR__.'/../assets/storage' => storage_path('/'),

            __DIR__.'/../assets/public/css' => public_path('css'),
            __DIR__.'/../assets/public/themes/ck_editor' => public_path('themes/ck_editor'),
            __DIR__.'/../assets/public/themes/tinymce' => public_path('themes/tinymce'),
            __DIR__.'/../tests' => base_path('tests'),
        ];

        $bootstrapPath = __DIR__.'/../bootstrap';
        if ($this->publishSourceHasFiles($bootstrapPath)) {
            $publishables[$bootstrapPath] = base_path('bootstrap');
        }

        $this->publishes($publishables, 'ecom');

        $this->publishes($publishables, 'blade_ecom');
        $this->publishes($publishables, 'react_ecom');

        $rootAssets = __DIR__.'/../assets/root';
        if ($this->publishSourceHasFiles($rootAssets)) {
            $this->publishes([
                $rootAssets => base_path('/'),
            ], 'react_ecom_for_non_react_project');
        }

        $this->publishes([
            __DIR__.'/../assets/public' => public_path(''),
        ], 'ecom_themes');
    }

    /**
     * Copy the default product placeholder into public/ so `/images/no-image.svg`
     * works without running `vendor:publish` (avoids 404 + broken-image retry loops).
     */
    protected function ensurePublicNoImagePlaceholder(): void
    {
        $source = __DIR__.'/../assets/public/images/no-image.svg';
        if (! is_file($source)) {
            return;
        }

        $destDir = public_path('images');
        $dest = $destDir.'/no-image.svg';

        if (is_file($dest)) {
            return;
        }

        File::ensureDirectoryExists($destDir);
        @copy($source, $dest);
    }

    protected function publishSourceHasFiles(string $path): bool
    {
        if (! is_dir($path)) {
            return false;
        }

        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($path, \FilesystemIterator::SKIP_DOTS)
        );

        foreach ($iterator as $file) {
            if ($file->isFile()) {
                return true;
            }
        }

        return false;
    }
}
