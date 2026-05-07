<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class AdvanceSettingController extends Controller
{
    public $settings;

    public function __construct()
    {
        $this->settings = Setting::where('id', '=', 1)->first();
        if ($this->settings == null) {
            Setting::create(['id' => 1]);
            $this->settings = Setting::where('id', '=', 1)->first();
        }
    }


    public function trustBadgesSettings()
    {
        $setting = $this->settings;
        $trustBadges = $setting->trust_badges ?? $this->getDefaultTrustBadges();

        return $this->render('admin/resources/settings/trust-badges', compact('setting', 'trustBadges'));
    }

    public function trustBadgesUpdate(Request $req)
    {
        $req->validate([
            'trust_badges' => 'required|array|min:1|max:6',
            'trust_badges.*.icon' => 'required|string',
            'trust_badges.*.title' => 'required|string|max:100',
            'trust_badges.*.description' => 'required|string|max:200',
        ]);

        $setting = Setting::find(1);
        $setting->trust_badges = $req->trust_badges;
        $setting->save();

        return redirect()->back()->with('success', 'Trust badges updated successfully');
    }

    protected function getDefaultTrustBadges(): array
    {
        return [
            [
                'icon' => 'Truck',
                'title' => 'Free Shipping',
                'description' => 'On orders over ₹500',
            ],
            [
                'icon' => 'ShieldCheck',
                'title' => 'Secure Payment',
                'description' => '100% protected',
            ],
            [
                'icon' => 'CreditCard',
                'title' => 'Easy Returns',
                'description' => '30-day return policy',
            ],
            [
                'icon' => 'Headphones',
                'title' => '24/7 Support',
                'description' => 'Dedicated support',
            ],
        ];
    }

}
