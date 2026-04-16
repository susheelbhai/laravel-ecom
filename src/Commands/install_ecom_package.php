<?php

namespace Susheelbhai\Ecom\Commands;

use Illuminate\Console\Command;
use Susheelbhai\Ecom\Commands\Helper\EcomInstallPackages;

class install_ecom_package extends Command
{
    protected $signature = 'ecom:install_package';

    protected $description = 'Install Composer and NPM dependencies for the e-commerce stack (runs basekit installs, then Wayfinder and Larapay).';

    public function handle(): int
    {
        (new EcomInstallPackages())->installAll($this);

        return self::SUCCESS;
    }
}
