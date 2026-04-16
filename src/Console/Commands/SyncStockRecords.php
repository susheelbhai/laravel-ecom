<?php

namespace App\Console\Commands;

use App\Models\StockRecord;
use Illuminate\Console\Command;

class SyncStockRecords extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'stock:sync';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync all stock records quantities with stock movements';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Syncing stock records with movements...');

        $records = StockRecord::all();
        $bar = $this->output->createProgressBar($records->count());
        $bar->start();

        foreach ($records as $record) {
            $record->recalculateQuantity();
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info('Stock records synced successfully!');

        return Command::SUCCESS;
    }
}
