<?php

namespace App\Actions;

use App\Models\SerialNumber;

/**
 * Centralised authorization logic for serial number stolen/damaged actions.
 *
 * Hierarchy (high → low): Admin > Distributor > Dealer > Customer
 *
 * Mark as Stolen:
 *   - Admin: always allowed
 *   - Distributor: allowed if current location is distributor, dealer, or customer
 *   - Dealer: allowed if current location is dealer or customer
 *   - Customer: allowed if current location is customer
 *
 * Mark as Damaged:
 *   - Only the party currently holding the unit may mark it damaged.
 *   - Admin: only if current location is admin (or no movements yet)
 *   - Distributor: only if current location is distributor
 *   - Dealer: only if current location is dealer
 *   - Customer: only if current location is customer
 */
class SerialNumberAuthorization
{
    /**
     * Resolve the current location string from the latest movement's to_party.
     * Returns null if no movements exist (unit is at admin, never moved).
     */
    public function currentLocation(SerialNumber $serialNumber): ?string
    {
        return $serialNumber->movements()
            ->orderBy('occurred_at', 'desc')
            ->value('to_party');
    }

    /**
     * Whether the given guard/actor may mark this serial as stolen.
     *
     * @param  string  $guard  One of: admin, distributor, dealer, customer
     */
    public function canMarkStolen(SerialNumber $serialNumber, string $guard): bool
    {
        $location = strtolower($this->currentLocation($serialNumber) ?? 'admin');

        return match ($guard) {
            'admin' => true,
            'distributor' => ! str_contains($location, 'admin'),
            'dealer' => str_contains($location, 'dealer') || str_contains($location, 'customer'),
            'customer' => str_contains($location, 'customer'),
            default => false,
        };
    }

    /**
     * Whether the given guard/actor may mark this serial as damaged.
     * Only the current holder may mark damaged.
     *
     * @param  string  $guard  One of: admin, distributor, dealer, customer
     */
    public function canMarkDamaged(SerialNumber $serialNumber, string $guard): bool
    {
        $location = strtolower($this->currentLocation($serialNumber) ?? 'admin');

        return match ($guard) {
            'admin' => str_contains($location, 'admin'),
            'distributor' => str_contains($location, 'distributor'),
            'dealer' => str_contains($location, 'dealer'),
            'customer' => str_contains($location, 'customer'),
            default => false,
        };
    }

    /**
     * Abort with 403 if the actor cannot mark stolen.
     */
    public function authorizeMarkStolen(SerialNumber $serialNumber, string $guard): void
    {
        abort_unless(
            $this->canMarkStolen($serialNumber, $guard),
            403,
            $this->stolenDeniedMessage($serialNumber, $guard)
        );
    }

    /**
     * Abort with 403 if the actor cannot mark damaged.
     */
    public function authorizeMarkDamaged(SerialNumber $serialNumber, string $guard): void
    {
        abort_unless(
            $this->canMarkDamaged($serialNumber, $guard),
            403,
            $this->damagedDeniedMessage($serialNumber, $guard)
        );
    }

    private function stolenDeniedMessage(SerialNumber $serialNumber, string $guard): string
    {
        $location = $this->currentLocation($serialNumber) ?? 'Admin';

        return "You cannot mark this serial as stolen. It is currently at \"{$location}\" and your role ({$guard}) does not have permission.";
    }

    private function damagedDeniedMessage(SerialNumber $serialNumber, string $guard): string
    {
        $location = $this->currentLocation($serialNumber) ?? 'Admin';

        return "Only the current holder can mark a serial as damaged. This unit is at \"{$location}\".";
    }
}
