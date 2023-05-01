import { useState } from "react";
import { useEffect } from "react";
import axios from "../requestHandler";

export default function useJsCache(http) {
  // check if browser supports js cache

  const api = "https://apps.v1.smart-umodzi.com:443/public";
  const resource = api + http;

  const [response, setResponse] = useState("");

  useEffect(() => {
    if (!localStorage.getItem(resource)) {
      //save
      async function storeCache() {
        const request = await axios.get(http);
        console.log(request.data);
        // localStorage.setItem(resource, JSON.stringify(request));
      }
      storeCache();
    } else {
      //load
      setResponse(localStorage.getItem(resource));
    }
  }, [resource]);
  return response;
}
