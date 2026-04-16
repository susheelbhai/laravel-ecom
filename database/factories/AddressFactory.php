<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Address>
 */
class AddressFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'type' => fake()->randomElement(['shipping', 'billing', 'both']),
            'full_name' => fake()->name(),
            'phone' => fake()->numerify('##########'),
            'alternate_phone' => fake()->optional()->numerify('##########'),
            'address_line1' => fake()->streetAddress(),
            'address_line2' => fake()->optional()->secondaryAddress(),
            'city' => fake()->city(),
            'state' => fake()->state(),
            'country' => 'India',
            'pincode' => fake()->numerify('######'),
            'landmark' => fake()->optional()->streetName(),
            'is_default' => false,
        ];
    }

    /**
     * Indicate that the address is the default address.
     */
    public function isDefault(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_default' => true,
        ]);
    }
}
