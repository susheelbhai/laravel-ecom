<?php

namespace Susheelbhai\Ecom\Commands\Helper;

use Illuminate\Console\Command;
use Susheelbhai\Basekit\Commands\Helper\InstallPackages;
use Symfony\Component\Process\Process;

class EcomInstallPackages
{
    private const WINDOWS_COMPOSER_RETRIES = 3;

    private const WINDOWS_RETRY_DELAY_MICROSECONDS = 2_000_000;

    /**
     * Run base kit Composer/NPM installs, then add packages needed for the e-commerce stack.
     */
    public function installAll(Command $command): void
    {
        (new InstallPackages)->installAll($command);
        $this->composer($command);
        $this->npm($command);
    }

    public function composer(Command $command): void
    {
        $command->info('Installing e-commerce Composer packages...');
        $packages = [
            'laravel/wayfinder',
            'susheelbhai/larapay',
        ];
        $this->installComposerPackages($command, $packages);
    }

    public function npm(Command $command): void
    {
        $command->info('Installing e-commerce NPM packages...');
        $packages = [
            '@laravel/vite-plugin-wayfinder@^0.1.3',
        ];
        $this->installNpmPackages($command, $packages);
    }

    private function installComposerPackages(Command $command, array $packageNames): void
    {
        $toInstall = [];
        foreach ($packageNames as $pkg) {
            $name = $this->normalizeComposerPackageName($pkg);
            if ($this->composerPackageInstalled($name)) {
                $command->info("Composer package \"{$name}\" is already installed, skipping.");

                continue;
            }
            $toInstall[] = $pkg;
        }

        if ($toInstall === []) {
            return;
        }

        // One `composer require` reduces Windows file-lock races vs many sequential installs.
        $args = array_merge(
            ['composer', 'require', '--no-interaction', '--no-ansi'],
            $toInstall,
        );
        $label = 'Composer packages: '.implode(', ', $toInstall);
        $this->installPackage($command, $args, $label);
    }

    private function installNpmPackages(Command $command, array $packageNames): void
    {
        foreach ($packageNames as $pkg) {
            if ($this->npmPackageInstalled($pkg)) {
                $displayName = $this->normalizeNpmPackageName($pkg);
                $command->info("NPM package \"{$displayName}\" is already installed, skipping.");

                continue;
            }
            $this->installPackage($command, ['npm', 'install', $pkg], "NPM package: $pkg");
        }
    }

    private function normalizeComposerPackageName(string $spec): string
    {
        return explode(':', $spec, 2)[0];
    }

    private function composerPackageInstalled(string $packageName): bool
    {
        $process = new Process(['composer', 'show', $packageName, '--no-ansi', '--quiet'], base_path());
        $process->run();

        return $process->isSuccessful();
    }

    private function normalizeNpmPackageName(string $spec): string
    {
        $spec = trim($spec);
        if ($spec === '') {
            return '';
        }
        if (str_starts_with($spec, '@')) {
            if (preg_match('#^(@[^/]+/[^@]+)(?:@.+)?$#', $spec, $m)) {
                return $m[1];
            }
        }
        if (preg_match('#^([^@]+)(?:@.+)?$#', $spec, $m)) {
            return $m[1];
        }

        return $spec;
    }

    private function npmPackageInstalled(string $packageSpec): bool
    {
        $path = base_path('package.json');
        if (! is_readable($path)) {
            return false;
        }

        $json = json_decode((string) file_get_contents($path), true);
        if (! is_array($json)) {
            return false;
        }

        $name = $this->normalizeNpmPackageName($packageSpec);
        if ($name === '') {
            return false;
        }

        $deps = array_merge(
            $json['dependencies'] ?? [],
            $json['devDependencies'] ?? [],
            $json['peerDependencies'] ?? [],
        );

        return array_key_exists($name, $deps);
    }

    private function installPackage(Command $command, array $cmd, string $label): void
    {
        $command->line("📦 Installing {$label} ...");
        $this->runCommand($command, $cmd, $label);
        $command->info("✅ Finished installing {$label}");
        $command->line('');
        $command->line('');
    }

    private function runCommand(Command $command, array $cmd, string $label, ?string $workingDir = null): void
    {
        $workingDir ??= base_path();
        $attempt = 0;
        $lastOutput = '';
        $isComposer = ($cmd[0] ?? '') === 'composer';

        while ($attempt < self::WINDOWS_COMPOSER_RETRIES) {
            $attempt++;
            $process = new Process($cmd, $workingDir);
            $process->setTimeout(null);

            $process->run(function ($type, $buffer) use ($command, $label) {
                $command->line("[{$label}] {$buffer}");
            });

            if ($process->isSuccessful()) {
                return;
            }

            $lastOutput = $process->getErrorOutput().$process->getOutput();

            if (
                PHP_OS_FAMILY === 'Windows'
                && $attempt < self::WINDOWS_COMPOSER_RETRIES
                && $this->isLikelyWindowsFileLockFailure($lastOutput)
            ) {
                $command->warn(sprintf(
                    '%s hit a Windows file lock (attempt %d/%d). Retrying in 2s…',
                    $isComposer ? 'Composer' : 'The installer',
                    $attempt,
                    self::WINDOWS_COMPOSER_RETRIES,
                ));
                usleep(self::WINDOWS_RETRY_DELAY_MICROSECONDS);

                continue;
            }

            break;
        }

        $this->throwInstallFailure($command, $label, $lastOutput, $isComposer);
    }

    private function isLikelyWindowsFileLockFailure(string $output): bool
    {
        $needles = [
            'Could not delete',
            'antivirus',
            'Search Indexer',
            'locking the file',
            'being used by another process',
            'Access is denied',
            'Permission denied',
        ];

        foreach ($needles as $needle) {
            if (stripos($output, $needle) !== false) {
                return true;
            }
        }

        return false;
    }

    private function throwInstallFailure(Command $command, string $label, string $output, bool $composerContext = true): never
    {
        $hint = '';
        if (PHP_OS_FAMILY === 'Windows' && $composerContext) {
            $hint = <<<'TEXT'


Windows tip: Composer often fails here when antivirus or Windows Search Indexer locks files under `vendor/composer`.
Try: close IDEs/watchers on the project, pause real-time scanning for this folder, add an exclusion for the project (or at least `vendor/`), then run:
  composer clear-cache
  composer require <packages> --no-interaction
Or run the same `ecom:install_package` again after a few seconds.
TEXT;
        }

        $command->error(trim($output) !== '' ? $output : 'Command failed with no output.');

        throw new \RuntimeException("Installing {$label} failed.{$hint}");
    }
}
