<?php

namespace Susheelbhai\Ecom\Commands\Helper;

use Illuminate\Console\Command;
use Susheelbhai\Basekit\Commands\Helper\InstallPackages;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;

class EcomInstallPackages
{
    /**
     * Run base kit Composer/NPM installs, then add packages needed for the e-commerce stack.
     */
    public function installAll(Command $command): void
    {
        (new InstallPackages())->installAll($command);
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
        foreach ($packageNames as $pkg) {
            $name = $this->normalizeComposerPackageName($pkg);
            if ($this->composerPackageInstalled($name)) {
                $command->info("Composer package \"{$name}\" is already installed, skipping.");

                continue;
            }
            $this->installPackage($command, ['composer', 'require', $pkg], "Composer package: $pkg");
        }
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
        $process = new Process($cmd, $workingDir ?? base_path());
        $process->setTimeout(null);

        $process->run(function ($type, $buffer) use ($command, $label) {
            $command->line("[{$label}] {$buffer}");
        });

        if (! $process->isSuccessful()) {
            throw new ProcessFailedException($process);
        }
    }
}
