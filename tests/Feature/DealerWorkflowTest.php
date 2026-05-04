<?php

use App\Models\Admin;
use App\Models\Dealer;
use App\Models\Distributor;
use App\Notifications\DealerApplicationApprovedNotification;
use App\Notifications\DealerApplicationApprovedNotificationForDistributor;
use App\Notifications\DealerApplicationRejectedNotification;
use App\Notifications\DealerApplicationRejectedNotificationForDistributor;
use App\Notifications\DealerPendingApprovalNotificationForAdmin;
use Illuminate\Support\Facades\Notification;

test('distributor can create a pending dealer', function () {
    Notification::fake();
    $admin = Admin::factory()->create();
    $distributor = Distributor::factory()->create([
        'email' => 'dist.dealer.create@example.com',
        'password' => 'password',
    ]);

    $response = $this->actingAs($distributor, 'distributor')->post(
        route('distributor.dealer.store'),
        [
            'name' => 'Dealer One',
            'email' => 'dealer.pending@example.com',
            'phone' => '9123456789',
            'password' => 'Password1!',
            'password_confirmation' => 'Password1!',
        ]
    );

    $response->assertRedirect(route('distributor.dealer.index'));

    $dealer = Dealer::where('email', 'dealer.pending@example.com')->first();

    expect($dealer)->not->toBeNull()
        ->and($dealer->distributor_id)->toBe($distributor->id)
        ->and($dealer->application_status)->toBe(Dealer::STATUS_PENDING);

    Notification::assertSentTo($admin, DealerPendingApprovalNotificationForAdmin::class);
});

test('distributor only sees own dealers', function () {
    $d1 = Distributor::factory()->create();
    $d2 = Distributor::factory()->create();

    Dealer::factory()->pending()->create([
        'distributor_id' => $d1->id,
        'email' => 'dealer.d1@example.com',
    ]);
    Dealer::factory()->pending()->create([
        'distributor_id' => $d2->id,
        'email' => 'dealer.d2@example.com',
    ]);

    $response = $this->actingAs($d1, 'distributor')
        ->get(route('distributor.dealer.index'));

    $response->assertOk();
    $page = $response->viewData('page');
    $props = $page['props'] ?? $page->toArray()['props'] ?? [];
    $data = $props['data'] ?? null;
    expect($data)->not->toBeNull();
    $emails = collect($data['data'])->pluck('email')->all();
    expect($emails)->toContain('dealer.d1@example.com')
        ->not->toContain('dealer.d2@example.com');
});

test('pending dealer cannot log in', function () {
    $dealer = Dealer::factory()->pending()->create([
        'email' => 'dealer.login.pending@example.com',
        'password' => 'password',
    ]);

    $this->post(route('dealer.login'), [
        'email' => $dealer->email,
        'password' => 'password',
    ])->assertSessionHasErrors('email');
});

test('admin can approve dealer then dealer can log in', function () {
    Notification::fake();
    $admin = Admin::factory()->create();
    $distributor = Distributor::factory()->create();
    $dealer = Dealer::factory()->pending()->create([
        'distributor_id' => $distributor->id,
        'email' => 'dealer.approve@example.com',
        'password' => 'password',
    ]);

    $this->actingAs($admin, 'admin')
        ->patch(route('admin.dealer.approve', $dealer))
        ->assertRedirect();

    expect($dealer->fresh()->application_status)->toBe(Dealer::STATUS_APPROVED);

    Notification::assertSentTo($dealer, DealerApplicationApprovedNotification::class);
    Notification::assertSentTo($distributor, DealerApplicationApprovedNotificationForDistributor::class);

    $this->post(route('dealer.login'), [
        'email' => $dealer->email,
        'password' => 'password',
    ])->assertRedirect(route('dealer.dashboard', absolute: false));
});

test('admin can reject a pending dealer and notifies dealer and distributor', function () {
    Notification::fake();
    $admin = Admin::factory()->create();
    $distributor = Distributor::factory()->create();
    $dealer = Dealer::factory()->pending()->create([
        'distributor_id' => $distributor->id,
        'email' => 'dealer.reject@example.com',
        'password' => 'password',
    ]);

    $this->actingAs($admin, 'admin')
        ->patch(route('admin.dealer.reject', $dealer), [
            'rejection_note' => 'Does not meet criteria',
        ])
        ->assertRedirect();

    expect($dealer->fresh()->application_status)->toBe(Dealer::STATUS_REJECTED)
        ->and($dealer->fresh()->rejection_note)->toBe('Does not meet criteria');

    Notification::assertSentTo($dealer, DealerApplicationRejectedNotification::class);
    Notification::assertSentTo($distributor, DealerApplicationRejectedNotificationForDistributor::class);
});

test('admin can view dealer index', function () {
    $admin = Admin::factory()->create();

    $this->actingAs($admin, 'admin')
        ->get(route('admin.dealer.index'))
        ->assertOk();
});
