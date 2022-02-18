<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointments;
use App\Models\Tracking;
use App\Models\Transfers;
use Carbon\Carbon;

class ReportController extends Controller
{
    public static function AppointmentIndicators($dataRange, $hmis)
    {
        try {
            if ($dataRange==1) {
                //start_week
                $start_week = Carbon::now()->format('Y-m-d');

                //end_week
                $end_week = Carbon::now()->format('Y-m-d');
                $period        = Appointments::whereBetween('due_date', [$start_week,$end_week])->where('institutionid', $hmis);
                $appointments  = $period->where('appointment_type', 1);
               
                $track_period  = Tracking::join('appointments', 'tracking.appointment_id', '=', 'appointments.id')->whereBetween('appointments.created_at', [$start_week,$end_week])->where('institutionid', $hmis);
                ;
                //scheduled
                $scheduled = $appointments->count();
                //reminded
                $reminded  = $appointments->where('reminded', 'Yes')->count();
                //missed
                $period        = Appointments::whereBetween('due_date', [$start_week,$end_week])->where('institutionid', $hmis);
                ;
                $appointments  = $period->where('appointment_type', 1);
                //tracking
                $missed    = $appointments->whereRaw('datediff(CURDATE(),due_date) > 0 ')->where('status', 0)->count();
                //retuned
                $period        = Appointments::whereBetween('due_date', [$start_week,$end_week])->where('institutionid', $hmis);
                ;
                $appointments  = $period->where('appointment_type', 1);
                //tracking
                $returned = $appointments->whereRaw('datediff(updated_at,due_date) > 0')->where('status', 1)->count();
                //tracked
                $tracked  = $track_period->count();
                $data   = array(
                    "scheduled" => $scheduled,
                    "reminded" => $reminded,
                    "missed" => $missed,
                    "returned" => $returned,
                    "tracked" => $tracked,
                    "nottracked" => intval($missed-$tracked),
                    // "pending" => $pending,
                );
            } elseif ($dataRange==2) {
                //appointments
                $todays_date   =  date('Y-m-d');
                $week_number   = Carbon::parse($todays_date)->weekOfYear;
                $start_week    = Carbon::parse($todays_date)->startOfWeek();
                $end_week      = Carbon::parse($todays_date)->endOfWeek();
                $period        = Appointments::whereBetween('due_date', [$start_week,$end_week])->where('institutionid', $hmis);
                $appointments  = $period->where('appointment_type', 1);
               
                $track_period  = Tracking::join('appointments', 'tracking.appointment_id', '=', 'appointments.id')->whereBetween('appointments.created_at', [$start_week,$end_week])->where('institutionid', $hmis);
                ;
                //scheduled
                $scheduled = $appointments->count();
                //reminded
                $reminded  = $appointments->where('reminded', 'Yes')->count();
                //missed
                $period        = Appointments::whereBetween('due_date', [$start_week,$end_week])->where('institutionid', $hmis);
                ;
                $appointments  = $period->where('appointment_type', 1);
                //tracking
                $missed    = $appointments->whereRaw('datediff(CURDATE(),due_date) > 0 ')->where('status', 0)->count();
                //retuned
                $period        = Appointments::whereBetween('due_date', [$start_week,$end_week])->where('institutionid', $hmis);
                ;
                $appointments  = $period->where('appointment_type', 1);
                //tracking
                $returned = $appointments->whereRaw('datediff(updated_at,due_date) > 0')->where('status', 1)->count();
                //tracked
                $tracked  = $track_period->count();
                $data   = array(
                    "scheduled" => $scheduled,
                    "reminded" => $reminded,
                    "missed" => $missed,
                    "returned" => $returned,
                    "tracked" => $tracked,
                    "nottracked" => intval($missed-$tracked),
                    // "pending" => $pending,
                );
            }
        
            
            
            //return
            return response()->json([$data]);
        } catch (\Exception $e) {
            return response()->json(['message'=>$e->getMessage()]);
        }
    }
    public function WeeklyEventsIndicators($hmis)
    {
        try {
            $todays_date   =  date('Y-m-d');
            $week_number   = Carbon::parse($todays_date)->weekOfYear;
            $start_week    = Carbon::parse($todays_date)->startOfWeek();
            $end_week      = Carbon::parse($todays_date)->endOfWeek();

            $period        = Appointments::whereBetween('due_date', [$start_week,$end_week])->where('institutionid', $hmis);
            $appointments  = $period->where('appointment_type', 1);

            $treatmentStops = $appointments->whereRaw('datediff(CURDATE(),due_date) > 28')->where('status', 0)->count();

            //Reactivations
            $period        = Appointments::whereBetween('updated_at', [$start_week,$end_week])->where('institutionid', $hmis);
            $appointments  = $period->where('appointment_type', 1)->where('status', 1)->whereRaw('datediff(updated_at,due_date) > 28');
            $reactivations = $appointments->count();

            //transfer out
            $period        = Transfers::whereBetween('created_at', [$start_week,$end_week])->where('from_', $hmis);
            $to = $period->count();
            //transferin
            $period        = Transfers::whereBetween('created_at', [$start_week,$end_week])->where('to_', $hmis);
            $ti  = $period->count();

            $data   = array(
            "treatment" => $treatmentStops,
            "reactivations" => $reactivations,
            "transferout" => $to,
            "transferin" => $ti,
            // "pending" => $pending,
           );

            //return
            return response()->json([$data]);
        } catch (\Exception $e) {
            return response()->json(['message'=> $e->getMessage()]);
        }
    }
}
