import { Injectable } from '@angular/core';
import { LatLngLiteral } from 'leaflet';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() { }

  // Method to fetch the current geolocation of the user
  getCurrentLocation(): Observable<LatLngLiteral> {
    return new Observable((observer) => {
      // Check if the browser supports geolocation
      if (!navigator.geolocation) return;

      // Attempt to get the current position
      return navigator.geolocation.getCurrentPosition(
        // If successful, notify the observer with the coordinates
        (pos) => {
          observer.next({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        // If an error occurs, notify the observer with the error
        (error) => {
          observer.error(error);
        }
      );
    });
  }
}
