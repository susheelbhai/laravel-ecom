<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateRecommendationConfigRequest;
use App\Models\RecommendationConfig;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

class RecommendationConfigController extends Controller
{
    /**
     * Display recommendation configuration page.
     */
    public function index(): Response
    {
        $configs = RecommendationConfig::query()
            ->orderBy('display_order')
            ->get();

        return $this->render('admin/resources/recommendation-config/index', [
            'configs' => $configs,
        ]);
    }

    /**
     * Update recommendation configuration.
     */
    public function update(UpdateRecommendationConfigRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        foreach ($validated['configs'] as $configData) {
            RecommendationConfig::where('id', $configData['id'])
                ->update([
                    'is_enabled' => $configData['is_enabled'],
                    'display_order' => $configData['display_order'],
                ]);
        }

        return redirect()
            ->route('admin.recommendation-config.index')
            ->with('success', 'Recommendation configuration updated successfully.');
    }
}
