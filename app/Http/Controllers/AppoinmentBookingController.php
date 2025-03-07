<?php

namespace App\Http\Controllers;

use App\Jobs\SendAppointmentCancellationEmail;
use Illuminate\Support\Facades\Log;
use App\Models\AppoinmentBooking;
use Illuminate\Http\Request;
use App\Mail\SendMail;
use App\Jobs\SendEmail;
use Inertia\Inertia;
use Mail;
use Auth;

class AppoinmentBookingController extends Controller
{
    public function index(Request $request)
    {
        Log::info('Fetching appointment bookings for user: ' . Auth::id());

        $query = AppoinmentBooking::where('user_id', Auth::id());

        if ($request->filled('title')) {
            $query->where('title', 'like', '%' . $request->title . '%');
        }

        if ($request->filled('bdate')) {
            $query->whereDate('bdate', $request->bdate);
        }

        $records = $query->orderBy('id', 'desc')->paginate(5)->withQueryString();

        return Inertia::render('Booking/Index', compact('records'));
    }

    public function create()
    {
        return Inertia::render('Booking/Create');
    }

    public function store(Request $request)
    {
        Log::info('Storing new appointment', ['user_id' => Auth::id(), 'data' => $request->all()]);
        
        $this->validate($request, [
            'title'=> 'required',
            'description'=> 'required',
            'bdate'=> 'required',
        ]);
        
        try {
            $existingAppointment = AppoinmentBooking::where('bdate', $request->bdate)->first();

            if ($existingAppointment) {
                Log::warning('Duplicate appointment attempt', ['bdate' => $request->bdate]);
                return redirect()->back()->with('error', 'This slot is already booked. Please choose a different time.');
            }

            $data = $request->all();
            $data['user_id'] = Auth::user()->id;
            AppoinmentBooking::create($data);
            $data['name'] = Auth::user()->name;
            Log::info('Appointment booked successfully', ['appointment' => $data]);
            
            dispatch(new SendEmail($data, Auth::user()->email));
            return redirect('appointments')->with('success', 'Appointment Booked Successfully');
        } catch (\Throwable $th) {
            Log::error('Error booking appointment', ['error' => $th->getMessage()]);
            throw $th;
        }
    }

    public function edit($id)
    {
        $appointment = AppoinmentBooking::findOrFail($id);
        return Inertia::render('Booking/edit', compact('appointment'));
    }
    
    public function update(Request $request, $id)
    {
        Log::info('Updating appointment', ['id' => $id, 'data' => $request->all()]);

        $this->validate($request, [
            'title' => 'required',
            'description' => 'required',
            'bdate' => 'required',
        ]);

        try {
            $data = $request->all();
            $data['user_id'] = Auth::user()->id;
            AppoinmentBooking::where('id', $id)->update($data);

            Log::info('Appointment updated successfully', ['id' => $id]);
            return redirect('appointments')->with('success', 'Appointment Updated Successfully');
        } catch (\Throwable $th) {
            Log::error('Error updating appointment', ['id' => $id, 'error' => $th->getMessage()]);
            return redirect()->back()->with('error', 'Something went wrong!');
        }
    }

    public function destroy($id)
    {
        Log::info('Deleting appointment', ['id' => $id]);
        
        try {
            AppoinmentBooking::where('id', $id)->delete();
            Log::info('Appointment deleted successfully', ['id' => $id]);
            return redirect()->back()->with('success', 'Appointment Deleted Successfully');
        } catch (\Throwable $th) {
            Log::error('Error deleting appointment', ['id' => $id, 'error' => $th->getMessage()]);
            return redirect()->back()->with('error', 'Something went wrong!');
        }
    }

    public function appointmentCancel($id)
    {
        Log::info('Cancelling appointment', ['id' => $id, 'user_id' => Auth::id()]);
        
        try {
            $appointment = AppoinmentBooking::findOrFail($id);
            $appointment->status = 0;
            $appointment->save();
            $appointment->name = Auth::user()->name;
            
            dispatch(new SendAppointmentCancellationEmail($appointment->toArray(), Auth::user()->email));
            
            Log::info('Appointment cancelled successfully', ['id' => $id]);
            return redirect()->route('appointments.index')->with('success', 'Appointment cancelled successfully');
        } catch (\Exception $e) {
            Log::error('Error cancelling appointment', ['id' => $id, 'error' => $e->getMessage()]);
            return redirect()->route('appointments.index')->with('error', 'Failed to cancel appointment. Try again.');
        }
    }
}
