<?php
namespace App\Jobs;

use App\Mail\AppointmentCancelledMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendAppointmentCancellationEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $appointment;
    public $email;

    public function __construct($appointment, $email)
    {
        $this->appointment = $appointment;
        $this->email = $email;
    }

    public function handle()
    {
        Mail::to($this->email)
            ->send(new AppointmentCancelledMail($this->appointment));
    }
}
