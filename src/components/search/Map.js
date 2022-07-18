// import React from "react";
// import { Fragment, useEffect, useState, useRef } from "react";
// import { useGoogleMaps } from "react-hook-google-maps";

// const Map = () => {
//   const prevMarkersRef = useRef([]);

//   // incoming location to set
//   let point = {
//     lat: 35,
//     lng: -100,
//   };

//   let dest = {
//     lat: 34.99,
//     lng: -100.1,
//   };

//   // Map options
//   const { ref, map, google } = useGoogleMaps(
//     "AIzaSyBtA6Bp6uh23blw06svnnkO_5rP13ucb7A",
//     {
//       zoom: 6,
//       center: point,
//     }
//   );
//   useEffect(() => {
//     if (map) {
//       // ADD MARKER
//       const m = addMarker();
//       clearMarkers(prevMarkersRef.current); //clear prev markers
//       prevMarkersRef.current.push(m);
//       map.setCenter(point);
//       //Add Directions
//       let directionsService = new google.maps.DirectionsService();
//       let directionsRenderer = new google.maps.DirectionsRenderer();
//       directionsRenderer.setMap(map);
//       calcRoute(directionsService, directionsRenderer);
//     }
//   }, [point]);

//   // SIDE FUNCTIONS
//   function addMarker() {
//     return new window.google.maps.Marker({
//       position: point,
//       map: map,
//     });
//   }
//   function clearMarkers(markers) {
//     for (let m of markers) {
//       m.setMap(null);
//     }
//   }

//   function calcRoute(directionsService, directionsRenderer) {
//     let request = {
//       origin: point,
//       destination: dest,
//       travelMode: "DRIVING",
//     };
//     directionsService.route(request, function (result, status) {
//       if (status == "OK") {
//         directionsRenderer.setDirections(result);
//       }
//     });
//   }

//   return (
//     <div>
//       <h1>How I can add directions too?</h1>
//       <p>
//         IN ORDER TO OPEN MAP PROPERLY, ADD YOUR GOOGLE API CREDIENTIALS THIS:
//         https://react-yec7wj.stackblitz.io , *.react-yec7wj.stackblitz.io
//       </p>
//       <div ref={ref} style={{ width: 400, height: 300 }} />
//       <small>Thanks for your advice and answer</small>
//     </div>
//   );
// };

// export default Map;
