<?php

namespace App\Providers;

use App\Contracts\SerialNumberMovementServiceInterface;
use App\Contracts\StolenSerialAlertServiceInterface;
use App\Services\SerialNumberMovementService;
use App\Services\StolenSerialAlertService;
use Illuminate\Support\ServiceProvider;

class StockServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(SerialNumberMovementServiceInterface::class, SerialNumberMovementService::class);
        $this->app->bind(StolenSerialAlertServiceInterface::class, StolenSerialAlertService::class);
    }

    public function boot(): void {}
}
