<?php

namespace Susheelbhai\Ecom\Commands;

use Illuminate\Console\Command;
use Susheelbhai\Ecom\Commands\Helper\EcomInstallPackages;

class InstallEcomPackageCommand extends Command
{
    protected $signature = 'ecom:install_package';

    protected $description = 'Install Composer and NPM dependencies for the e-commerce stack (runs basekit installs, then Wayfinder and Larapay).';

    public function handle(): int
    {
        (new EcomInstallPackages)->installAll($this);

        $this->newLine();
        $this->info('Next steps (see package README for full order):');
        $this->line('  php artisan vendor:publish --tag=ecom --force');
        $this->line('  php artisan ecom:initial_settings');

        return self::SUCCESS;
    }
}
