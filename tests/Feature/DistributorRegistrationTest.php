<?php

use App\Models\Admin;
use App\Models\Distributor;
use App\Notifications\DistributorApplicationApprovedNotification;
use App\Notifications\DistributorApplicationRejectedNotification;
use App\Notifications\DistributorRegisteredNotificationForAdmin;
use Illuminate\Support\Facades\Notification;

function validDistributorRegistrationPayload(array $overrides = []): array
{
    return array_merge([
        'name' => 'Dist One',
        'email' => 'dist.register@example.com',
        'phone' => '9876543210',
        'password' => 'Password1!',
        'password_confirmation' => 'Password1!',
        'legal_business_name' => 'Acme Distribution Pvt Ltd',
        'trade_name' => '',
        'business_constitution' => 'private_limited',
        'authorized_signatory_designation' => 'Director',
        'kyc_id_type' => 'aadhaar',
        'kyc_id_number' => '123456789012',
        'dob' => '',
        'address' => '12 MG Road, Bengaluru',
        'city' => 'Bengaluru',
        'state' => 'Karnataka',
        'pincode' => '560001',
        'warehouse_address' => '',
        'pan_number' => 'ABCDE1234F',
        'gstin' => '22ABCDE1234F1Z5',
        'tan_number' => '',
        'msme_udyam_number' => '',
        'nature_of_business' => 'Electronics and home appliances distribution.',
        'years_in_business' => '',
        'expected_monthly_purchase_band' => '',
        'referral_source' => '',
        'bank_account_holder_name' => 'Acme Distribution Pvt Ltd',
        'bank_name' => 'HDFC Bank',
        'bank_branch' => 'MG Road',
        'bank_account_number' => '50123456789',
        'bank_ifsc' => 'HDFC0000123',
    ], $overrides);
}

test('distributor can submit registration and is pending', function () {
    Notification::fake();
    $admin = Admin::factory()->create();

    $response = $this->post(
        route('distributor.register'),
        validDistributorRegistrationPayload([
            'email' => 'dist.register@example.com',
        ])
    );

    $response->assertRedirect(route('distributor.login'));

    $distributor = Distributor::where('email', 'dist.register@example.com')->first();

    expect($distributor)->not->toBeNull()
        ->and($distributor->application_status)->toBe(Distributor::STATUS_PENDING)
        ->and($distributor->gstin)->toBe('22ABCDE1234F1Z5')
        ->and($distributor->legal_business_name)->toBe('Acme Distribution Pvt Ltd');

    Notification::assertSentTo($admin, DistributorRegisteredNotificationForAdmin::class);
});

test('pending distributor cannot log in', function () {
    $distributor = Distributor::factory()->pending()->create([
        'email' => 'dist.pending@example.com',
        'password' => 'password',
    ]);

    $response = $this->post(route('distributor.login'), [
        'email' => $distributor->email,
        'password' => 'password',
    ]);

    $response->assertSessionHasErrors('email');
});

test('rejected distributor cannot log in', function () {
    $distributor = Distributor::factory()->rejected()->create([
        'email' => 'dist.rejected@example.com',
        'password' => 'password',
    ]);

    $response = $this->post(route('distributor.login'), [
        'email' => $distributor->email,
        'password' => 'password',
    ]);

    $response->assertSessionHasErrors('email');
});

test('approved distributor can log in', function () {
    $distributor = Distributor::factory()->create([
        'email' => 'dist.ok@example.com',
        'password' => 'password',
    ]);

    $response = $this->post(route('distributor.login'), [
        'email' => $distributor->email,
        'password' => 'password',
    ]);

    $response->assertRedirect(route('distributor.dashboard', absolute: false));
    $this->assertAuthenticatedAs($distributor, 'distributor');
});

test('admin can approve a pending distributor', function () {
    Notification::fake();
    $admin = Admin::factory()->create();
    $distributor = Distributor::factory()->pending()->create([
        'email' => 'dist.approve@example.com',
        'password' => 'password',
    ]);

    $this->actingAs($admin, 'admin')
        ->patch(route('admin.distributor.approve', $distributor))
        ->assertRedirect();

    expect($distributor->fresh()->application_status)->toBe(Distributor::STATUS_APPROVED)
        ->and($distributor->fresh()->approved_by)->toBe($admin->id);

    Notification::assertSentTo($distributor, DistributorApplicationApprovedNotification::class);
});

test('admin can reject a pending distributor', function () {
    Notification::fake();
    $admin = Admin::factory()->create();
    $distributor = Distributor::factory()->pending()->create([
        'email' => 'dist.reject@example.com',
        'password' => 'password',
    ]);

    $this->actingAs($admin, 'admin')
        ->patch(route('admin.distributor.reject', $distributor), [
            'rejection_note' => 'Incomplete details',
        ])
        ->assertRedirect();

    $distributor->refresh();

    expect($distributor->application_status)->toBe(Distributor::STATUS_REJECTED)
        ->and($distributor->rejection_note)->toBe('Incomplete details');

    Notification::assertSentTo($distributor, DistributorApplicationRejectedNotification::class);
});

test('admin can view distributor applications index', function () {
    $admin = Admin::factory()->create();

    $this->actingAs($admin, 'admin')
        ->get(route('admin.distributor.index'))
        ->assertOk();
});
