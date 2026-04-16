<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Newsletter;

class NewsletterController extends Controller
{
    public function index()
    {
        $data = Newsletter::latest()->get();

        return $this->render('admin/resources/newsletter/index', compact('data'));
    }
}
