<?php

namespace Susheelbhai\Ecom\Commands\Helper;

use App\Providers\InertiaSsrGuardServiceProvider;
use App\Providers\ReviewAggregatesServiceProvider;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class RegisterEcomBootstrapProviders
{
    /**
     * @var list<class-string>
     */
    private const ECOM_PROVIDERS = [
        InertiaSsrGuardServiceProvider::class,
        ReviewAggregatesServiceProvider::class,
    ];

    public static function register(?Command $command = null): bool
    {
        $path = base_path('bootstrap/providers.php');
        if (! is_file($path)) {
            $command?->error("bootstrap/providers.php not found at [{$path}].");

            return false;
        }

        /** @var list<class-string> $existing */
        $existing = require $path;
        $merged = self::mergePreservingOrder($existing, self::ECOM_PROVIDERS);

        if ($merged === $existing) {
            $command?->info('E-commerce bootstrap providers are already registered.');

            return true;
        }

        File::put($path, self::formatProvidersFile($merged));
        $command?->info('Registered e-commerce providers in bootstrap/providers.php.');

        return true;
    }

    /**
     * @param  list<class-string>  $existing
     * @param  list<class-string>  $additional
     * @return list<class-string>
     */
    private static function mergePreservingOrder(array $existing, array $additional): array
    {
        $out = $existing;
        foreach ($additional as $class) {
            if (! in_array($class, $out, true)) {
                $out[] = $class;
            }
        }

        return $out;
    }

    /**
     * @param  list<class-string>  $providers
     */
    private static function formatProvidersFile(array $providers): string
    {
        $useLines = collect($providers)
            ->map(fn (string $fqcn): string => 'use '.$fqcn.';')
            ->sort()
            ->values()
            ->all();

        $entries = collect($providers)
            ->map(fn (string $fqcn): string => '    '.class_basename($fqcn).'::class,')
            ->implode("\n");

        return "<?php\n\n"
            .implode("\n", $useLines)
            ."\n\nreturn [\n"
            .$entries
            ."\n];\n";
    }
}
