<?php

namespace Susheelbhai\Ecom\Commands;

use Illuminate\Console\Command;
use Susheelbhai\Basekit\Commands\initial_settings;
use Susheelbhai\Ecom\Commands\Helper\RegisterEcomBootstrapProviders;

class EcomInitialSettingsCommand extends Command
{
    protected $signature = 'ecom:initial_settings
                            {--with-basekit : Run basekit:initial_settings first, then merge e-commerce providers}';

    protected $description = 'Merge e-commerce service providers into bootstrap/providers.php (idempotent; run after vendor:publish). Use --with-basekit to run the Basekit wizard in the same session first.';

    public function handle(): int
    {
        if ($this->option('with-basekit')) {
            if (! class_exists(initial_settings::class)) {
                $this->error('susheelbhai/laravel-basekit is required to use --with-basekit. Run `php artisan basekit:initial_settings` separately, or install basekit.');

                return self::FAILURE;
            }

            $exitCode = $this->call('basekit:initial_settings');
            if ($exitCode !== 0) {
                return $exitCode;
            }
        }

        RegisterEcomBootstrapProviders::register($this);

        return self::SUCCESS;
    }
}
