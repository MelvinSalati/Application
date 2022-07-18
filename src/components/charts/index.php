<?php

namespace App\Http\Controllers;

use App\Models\Appointments;
use App\Models\Message;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AppointmentController extends Controller
{
    public function Reminders()
    {
        try {
            $appointments = Appointments::where('due_date', Carbon::tomorrow()->format('Y-m-d'))
                             ->where('appointment_type', 1)->whereRaw('Length(mobile_phone_number) > 8')
                             ->where('status', 0)
                             ->get(['institutionid','due_date','mobile_phone_number', 'time_booked','first_name','recipient_uuid','id','sent_sms']);


            return $appointments;
        } catch (\Exception $e) {
            return  response()->json(['message'=> $e->getMessage()]);
        }
    }

    public function facilityReminders(Request $request)
    {
        $facilityID      = $request->hmis;
        $clients         = Appointments::where('appointment_type', 1)->where('status', 0)
                           ->whereRaw('Length(mobile_phone_number) > 8')
                           ->get([
                               'institutionid',
                               'due_date',
                               'mobile_phone_number',
                               'time_booked','first_name',
                               'recipient_uuid',
                               'id',
                               'sent_sms'
                        ]);
    }

    public function MissedOneDay()
    {
        try {
            $appointments   = Appointments::whereRaw('datediff(CURDATE(),due_date) = 1')
                             ->where('appointment_type', 1)->whereRaw('Length(mobile_phone_number) > 8')
                             ->where('status', 0)
                             ->get(['institutionid','due_date','mobile_phone_number', 'time_booked','first_name','recipient_uuid','id','sent_sms']);


            return $appointments;
        } catch (\Exception $e) {
            return  response()->json(['message'=> $e->getMessage()]);
        }
    }
    public function missedToday()
    {
        try {
            $today          = Carbon::now()->format('Y-m-d');
            $appointments   = Appointments::where('due_date', $today)
                             -> where('appointment_type', 1)
                             ->where('status', 0)
                             ->get(
                                 [
                                     'mobile_phone_number',
                                     'first_name',
                                     'institutionid',
                                     'due_date',
                                     'id'
                                 ]
                             );


            return $appointments;
        } catch (\Exception $e) {
            return  response()->json(['message'=> $e->getMessage()]);
        }
    }
    public function Update($appointmentID)
    {
        try {
            $id     = Appointments::where('id', $appointmentID);
            $update = $id->update(['reminded'=>"Yes","sent_sms"=>1]);
            return  $update;
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage]);
        }
    }
}
