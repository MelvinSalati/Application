<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\IsAuthenticatedController as Authenticated;
use App\Http\Controllers\MortallityController;
use App\Http\Controllers\AppointmentController as Appointment;
use App\Http\Controllers\SenderController;
use App\Http\Controllers\FacilityController;
use App\Http\Controllers\ContactManagerController;
use Seshac\Otp\Otp;
use App\Models\Appointments;
use App\Models\Registry;
use Illuminate\Support\Str;
use App\Http\Controllers\SearchController as Search;
use App\Http\Controllers\SendOtpController as Send;
use Illuminate\Support\Facades\Cache;

class RegistryController extends Controller
{
    public function search(Request $request)
    {
        $searchType   = $request->type;
        $param        = $request->param;
        $localised    = $request->hmis;

        if ($searchType == 1) {
            if (is_numeric($param)) {
                $results[] = array(
                    'status' => 404,
                    'message' => 'Using numbers to search for client names!'
                );
                return response()->json(["results"=>$results]);
            }
            $results   =  Search::searchByNames($param, $localised, $searchType);
        } elseif ($searchType == 2) {
            $results   = Search::searchByBarcode($param, $localised, $searchType);
        } elseif ($searchType == 3) {
            if (!is_numeric($request->param)) {
                $results [] = array(
                     'status' => 404,
                     'message' => "invalid phone number!"
                );
            } else {
                $verify = Send::verifyClientPhone($param);
                if ($verify) {
                    $results[] = array(
                        'status' => 201,
                        'message' =>'verification OTP sent!'
                    );
                }
            }

        // $results   = Search::searchByPhone($param, $localised, $searchType);
        } elseif ($searchType==5) {
            //send otp
            $token       = $request->otp;
            if (!is_numeric(intval($request->param))) {
                $results [] = array(
                     'status' => 404,
                     'message' => "invalid phone number!"
                );
                return $results;
            }
            if ($request->otp) {
                $identifier = $request->phone;
                $verify = Otp::setAllowedAttempts(10)->validate($identifier, $token);
                $otp  = json_decode(json_encode($verify), true);

                if ($otp['status']==true) {
                    $results = Search::searchByPhone($request->phone, $request->hmis, $request->type);
                } elseif ($otp['status']==false) {
                    $results [] = array(
                        'status' => 404,
                        'message' => $otp['message']
                    );
                }
            } else {
                $results = [
                    'status' =>404
                ];
            }
        } elseif ($searchType==4) {
            $results = Search::searchByRecipientID($request->param, $request->hmis, $request->type);
        }

        return response()->json(["results"=>$results]);
    }

    //update

    public function update(Request $request)
    {
        if (!empty($request->gpslat) && empty(!$request->gpslon)) {
            //store gps
        }

        $data  = request()->except(['id']);
        $client  = array_filter($data);

        //update

        $update  = Registry::where('client_uuid', 'like', '%'.$request->id.'%')->update($client);

        if (!$update) {
            return response()->json([
                'message' => "Record not updated!",
                'status'  => 401,
            ]);
        }

        return response()->json([
            'message'=>"Records updated successfully!",
            'status'=>200
        ]);
    }


    public function status($id)
    {
        // Mortallity
        $mortallity = new MortallityController();

        if ($mortallity->isDead($id) > 0) {
            //stop tracking
            $tracking  = new Appointment();

            $tracking = $tracking->stop($id);

            return response()->json([
               'status'=>"Reported Dead",
                "code"  => 3
             ]);
        }

        // Lost to follow up
        $collection  =  Appointments::where("recipient_uuid", "like", $id)->
        whereRaw('datediff(CURDATE(),due_date) > 28')->where('status', 0)->count();

        if ($collection > 0) {
            return response()->json([
                'status'=>"Dropped",
                 "code"  => 2
              ]);
        }

        return response()->json([
            'status'=>"Active",
            "code"  => 1
        ]);
    }

    public function register($art, $nupn, $fname, $lname, $dob, $gender, $nrc, $phone, $email, $add, $hmis)
    {
        //new client
        if (!empty($phone)) {
            $isNumberValid = strlen($phone);

            if ($isNumberValid >=10 && $isNumberValid < 13) {
                //generate token
                $identifier = time();
                $otp =  Otp::generate($identifier);

                $otp =  json_decode(json_encode($otp), true);

                $token = $otp['token'];

                //send generated

                //facility
                $facility  =  FacilityController::name($hmis);
                $sender    =  FacilityController::sender($hmis);
                $message = "Hello $fname , welcome to $facility. We are here to provide quality care. confirming phone number your OTP :".$token;

                $authenticationMsg  = SenderController::Send($phone, $message, $sender);
            } else {
                return response()->json(['message'=>"Please check phone number","status"=>401]);
            }
        }
        $uuid       = Str::uuid()->toString();

        $collection = Registry::create([
                "client_uuid"=> $uuid,
                "art_number" => $art,
                "patient_nupn"=> $nupn,
                "first_name" => $fname,
                "surname"  => $lname,
                "date_of_birth" => $dob,
                "mobile_phone_number"  => $phone,
                "email" => $email,
                "address" => $add,
                "nrc_of_client" =>$nrc,
                "client_status" => 1,
                "sex" => $gender,
                "registration_facility" => $hmis,
                "current_facility"  => $hmis
            ]);

        if ($collection) {
            if ($authenticationMsg) {
                if (!$authenticationMsg) {
                    $response  = response()->json(['message'=>'Verification process failed. Kindly check your connectivity!','status'=>401]);
                } else {
                    $response  = response()->json(['message'=>'Client successfully registered. Verify Otp!','status'=>201]);
                }
            } else {
                $response  = response()->json(['message'=>'Client successfully registered!','status'=>200]);
            }

            return $response;
        }
        $response  = response()->json(['message'=>'Client registration failed!','status'=>401]);
        return $response;
    }

    public static function changeFacility($id, $hmis)
    {
        $change   = Registry::where('client_uuid', $id)->update(['current_facility'=>$hmis]);
        if ($change) {
            return false;
        }
    }

    public static function getArtNumber($id)
    {
        $recipient   = Registry::where('client_uuid', $id)->get(['art_number']);

        if (!$recipient->count()==0) {
            $art_number = json_decode($recipient, true);

            return $art_number[0]['art_number'];
        }
    }

    public static function PhoneNumber($id)
    {
        $recipient  = Registry::where('client_uuid', $id)->get(['mobile_phone_number']);
        if (!$recipient->count()==0) {
            $art_number = json_decode($recipient, true);

            return $art_number[0]['mobile_phone_number'];
        } else {
            return "No phone";
        }
    }
    public function clientsDetails($id)
    {
        // get first name, last name
        return Cache::get($id);

        if(!Cache::has($id)) {
            Cache::put($id, json_decode(Registry::where('client_uuid', $id)->get(['first_name','surname','mobile_phone_number','art_number','sex','date_of_birth','patient_nupn']), true), now()->addMinutes(262800));
            $client = Cache::get($id);
        } else {
            $client = Cache::get($id);
        }
        return $client;


    }
}
