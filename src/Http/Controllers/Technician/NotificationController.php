<?php

namespace App\Http\Controllers\Technician;

use App\Http\Controllers\Controller;
use App\Models\Technician;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        $data = $this->user()->notifications()->paginate(15);

        return $this->render('technician/resources/notification/index', compact('data'));
    }

    public function show(string $id)
    {
        $notification = $this->user()->notifications()->where('id', $id)->first();

        if ($notification && $notification->read_at === null) {
            $notification->markAsRead();
        }
        if (isset($notification['data']['url'])) {
            return redirect()->to($notification['data']['url']);
        }

        return redirect()->back();
    }

    protected function user(): Technician
    {
        /** @var Technician $user */
        $user = Auth::guard('technician')->user();

        return $user;
    }
}
