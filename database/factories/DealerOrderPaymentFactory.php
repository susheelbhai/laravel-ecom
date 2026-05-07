<?php

namespace Database\Factories;

use App\Enums\PaymentMethod;
use App\Models\DealerOrder;
use App\Models\DealerOrderPayment;
use App\Models\Distributor;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DealerOrderPayment>
 */
class DealerOrderPaymentFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'dealer_order_id' => DealerOrder::factory(),
            'amount' => fake()->randomFloat(2, 1, 5000),
            'payment_method' => fake()->randomElement(PaymentMethod::values()),
            'note' => fake()->optional()->sentence(),
            'recorded_by_distributor_id' => Distributor::factory(),
        ];
    }
}
