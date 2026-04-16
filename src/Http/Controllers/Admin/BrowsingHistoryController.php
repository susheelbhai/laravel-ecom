<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBrowsingHistoryRequest;
use App\Http\Requests\UpdateBrowsingHistoryRequest;
use App\Models\BrowsingHistory;

class BrowsingHistoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBrowsingHistoryRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(BrowsingHistory $browsingHistory)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BrowsingHistory $browsingHistory)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBrowsingHistoryRequest $request, BrowsingHistory $browsingHistory)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BrowsingHistory $browsingHistory)
    {
        //
    }
}
