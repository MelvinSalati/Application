<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class cacheController extends Controller
{
    public function createCacheItem($key, $data)
    {
        return Cache::put($key, $data, now()->addMinutes(262800));
    }
    public function isKey($key)
    {
        if(Cache::has($key)) {
            return true;
        } else {
            return false;
        }
    }

    public function getCacheKey($key)
    {
        return Cache::get($key);
    }
}
