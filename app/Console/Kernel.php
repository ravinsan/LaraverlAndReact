<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Jobs\SendAppointmentReminder;
use App\Models\AppoinmentBooking;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->call(function () {
            $appointments = AppoinmentBooking::whereDate('bdate', now()->addDay()->toDateString())->get();
            
            foreach ($appointments as $appointment) {
                dispatch(new SendAppointmentReminder($appointment));
            }
        })->dailyAt('08:00');
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
