<?php

namespace App\Services;

use App\Enums\PaymentStatus;
use App\Models\Admin;
use App\Models\DealerOrder;
use App\Models\DealerOrderPayment;
use App\Models\Distributor;
use App\Models\DistributorOrder;
use App\Models\DistributorOrderPayment;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class B2BPaymentService
{
    /**
     * Compute and return the PaymentStatus string for an order
     * given its total_amount and the running amount_paid.
     */
    public function computePaymentStatus(float $totalAmount, float $amountPaid): string
    {
        if ($amountPaid <= 0) {
            return PaymentStatus::Unpaid->value;
        }

        if ($amountPaid >= $totalAmount) {
            return PaymentStatus::Paid->value;
        }

        return PaymentStatus::Partial->value;
    }

    /**
     * Record a payment against a DistributorOrder.
     * Wraps everything in a DB transaction.
     * Returns the created DistributorOrderPayment.
     *
     * @param  array{amount: numeric, payment_method: string, note: string|null, payment_proof: UploadedFile|null}  $validated
     *
     * @throws ValidationException
     */
    public function recordDistributorOrderPayment(
        DistributorOrder $order,
        array $validated,
        Admin $recordedBy,
    ): DistributorOrderPayment {
        if ($order->payment_status === PaymentStatus::Paid->value) {
            throw ValidationException::withMessages([
                'amount' => 'This order is already fully paid.',
            ]);
        }

        $remainingBalance = $order->total_amount - $order->amount_paid;

        if ((float) $validated['amount'] > $remainingBalance) {
            throw ValidationException::withMessages([
                'amount' => "The amount cannot exceed the remaining balance of {$remainingBalance}.",
            ]);
        }

        return DB::transaction(function () use ($order, $validated, $recordedBy): DistributorOrderPayment {
            /** @var DistributorOrderPayment $payment */
            $payment = DistributorOrderPayment::create([
                'distributor_order_id' => $order->id,
                'amount' => $validated['amount'],
                'payment_method' => $validated['payment_method'],
                'note' => $validated['note'] ?? null,
                'recorded_by_admin_id' => $recordedBy->id,
            ]);

            if (! empty($validated['payment_proof'])) {
                $payment->addMedia($validated['payment_proof'])
                    ->toMediaCollection('payment_proof');
            }

            $newAmountPaid = $order->amount_paid + (float) $validated['amount'];
            $newPaymentStatus = $this->computePaymentStatus($order->total_amount, $newAmountPaid);

            // Use the query builder directly to avoid Eloquent casting the DB::raw expression.
            DB::table('distributor_orders')
                ->where('id', $order->id)
                ->update([
                    'amount_paid' => DB::raw('amount_paid + '.(float) $validated['amount']),
                    'payment_status' => $newPaymentStatus,
                    'updated_at' => now(),
                ]);

            $order->refresh();

            return $payment;
        });
    }

    /**
     * Record a payment against a DealerOrder.
     * Wraps everything in a DB transaction.
     * Returns the created DealerOrderPayment.
     *
     * @param  array{amount: numeric, payment_method: string, note: string|null, payment_proof: UploadedFile|null}  $validated
     *
     * @throws ValidationException
     */
    public function recordDealerOrderPayment(
        DealerOrder $order,
        array $validated,
        Distributor $recordedBy,
    ): DealerOrderPayment {
        if ($order->payment_status === PaymentStatus::Paid->value) {
            throw ValidationException::withMessages([
                'amount' => 'This order is already fully paid.',
            ]);
        }

        $remainingBalance = $order->total_amount - $order->amount_paid;

        if ((float) $validated['amount'] > $remainingBalance) {
            throw ValidationException::withMessages([
                'amount' => "The amount cannot exceed the remaining balance of {$remainingBalance}.",
            ]);
        }

        return DB::transaction(function () use ($order, $validated, $recordedBy): DealerOrderPayment {
            /** @var DealerOrderPayment $payment */
            $payment = DealerOrderPayment::create([
                'dealer_order_id' => $order->id,
                'amount' => $validated['amount'],
                'payment_method' => $validated['payment_method'],
                'note' => $validated['note'] ?? null,
                'recorded_by_distributor_id' => $recordedBy->id,
            ]);

            if (! empty($validated['payment_proof'])) {
                $payment->addMedia($validated['payment_proof'])
                    ->toMediaCollection('payment_proof');
            }

            $newAmountPaid = $order->amount_paid + (float) $validated['amount'];
            $newPaymentStatus = $this->computePaymentStatus($order->total_amount, $newAmountPaid);

            // Use the query builder directly to avoid Eloquent casting the DB::raw expression.
            DB::table('dealer_orders')
                ->where('id', $order->id)
                ->update([
                    'amount_paid' => DB::raw('amount_paid + '.(float) $validated['amount']),
                    'payment_status' => $newPaymentStatus,
                    'updated_at' => now(),
                ]);

            $order->refresh();

            return $payment;
        });
    }
}
