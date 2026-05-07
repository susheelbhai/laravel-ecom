<?php

namespace Database\Factories;

use App\Enums\PaymentMethod;
use App\Models\Admin;
use App\Models\DistributorOrder;
use App\Models\DistributorOrderPayment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DistributorOrderPayment>
 */
class DistributorOrderPaymentFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'distributor_order_id' => DistributorOrder::factory(),
            'amount' => fake()->randomFloat(2, 1, 5000),
            'payment_method' => fake()->randomElement(PaymentMethod::values()),
            'note' => fake()->optional()->sentence(),
            'recorded_by_admin_id' => Admin::factory(),
        ];
    }
}
