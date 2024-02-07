import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { LatLng, LatLngExpression, LatLngTuple, LeafletMouseEvent, Map, Marker, icon, map, marker, tileLayer } from 'leaflet';
import { LocationService } from 'src/app/services/location.service';
import { Order } from 'src/app/shared/models/Orders';

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnChanges, OnInit {

  // Input property to receive the order information
  @Input()
  order!: Order;

  // Input property to determine if the map is in readonly mode
  @Input()
  readonly = false;

  // Constants for marker settings
  private readonly MARKER_ZOOM_LEVEL = 16;
  private readonly MARKER_ICON = icon({
    iconUrl: 'https://res.cloudinary.com/foodmine/image/upload/v1638842791/map/marker_kbua9q.png',
    iconSize: [42, 42],
    iconAnchor: [21, 42],
  });
  private readonly DEFAULT_LAT_LNG: LatLngTuple = [13.75, 21.62];

  // ViewChild to get a reference to the map div
  @ViewChild('map', { static: true })
  mapRef!: ElementRef;

  // Leaflet map instance
  map!: Map;

  // Current marker on the map
  currentMarker!: Marker;

  constructor(private locationService: LocationService) { }

  // Lifecycle hook: ngOnChanges
  ngOnChanges(): void {
    // Check if the order is provided
    if (!this.order) return;

    // Initialize the map
    this.initializeMap();

    // If in readonly mode and addressLatLng is available, show location
    if (this.readonly && this.addressLatLng) {
      this.showLocationOnReadonlyMode();
    }
  }

  // Show location on the map in readonly mode
  showLocationOnReadonlyMode(): void {
    const m = this.map;

    // Set marker and view based on the addressLatLng
    this.setMarker(this.addressLatLng);
    m.setView(this.addressLatLng, this.MARKER_ZOOM_LEVEL);

    // Disable map interactions
    m.dragging.disable();
    m.touchZoom.disable();
    m.doubleClickZoom.disable();
    m.scrollWheelZoom.disable();
    m.boxZoom.disable();
    m.keyboard.disable();
    m.off('click');
    m.tap?.disable();

    // Disable dragging for the currentMarker
    this.currentMarker.dragging?.disable();
  }

  // Initialize the Leaflet map
  initializeMap(): void {
    // If the map is already initialized, return
    if (this.map) return;

    // Create a Leaflet map and set it to the mapRef element
    this.map = map(this.mapRef.nativeElement, {
      attributionControl: false
    }).setView(this.DEFAULT_LAT_LNG, 1);

    // Add a tile layer to the map
    tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(this.map);

    // Attach a click event listener to set markers on map clicks
    this.map.on('click', (e: LeafletMouseEvent) => {
      this.setMarker(e.latlng);
    });
  }

  // Find and set the user's current location on the map
  findMyLocation(): void {
    this.locationService.getCurrentLocation().subscribe({
      next: (latlng) => {
        this.map.setView(latlng, this.MARKER_ZOOM_LEVEL);
        this.setMarker(latlng);
      }
    });
  }

  // Set the marker on the map at the specified LatLngExpression
  setMarker(latlng: LatLngExpression): void {
    // Set the addressLatLng property
    this.addressLatLng = latlng as LatLng;

    // If the currentMarker already exists, update its position
    if (this.currentMarker) {
      this.currentMarker.setLatLng(latlng);
      return;
    }

    // Otherwise, create a new marker and add it to the map
    this.currentMarker = marker(latlng, {
      draggable: true,
      icon: this.MARKER_ICON
    }).addTo(this.map);

    // Attach a dragend event listener to update addressLatLng on marker drag
    this.currentMarker.on('dragend', () => {
      this.addressLatLng = this.currentMarker.getLatLng();
    });
  }

  // Setter for the addressLatLng property
  set addressLatLng(latlng: LatLng) {
    // Check if lat and lng have toFixed method before using it
    if (!latlng.lat.toFixed) return;

    // Round the lat and lng to 8 decimal places
    latlng.lat = parseFloat(latlng.lat.toFixed(8));
    latlng.lng = parseFloat(latlng.lng.toFixed(8));

    // Update the order's addressLatLng property
    this.order.addressLatLng = latlng;
  }

  // Getter for the addressLatLng property
  get addressLatLng(): LatLng {
    return this.order.addressLatLng!;
  }

  // Lifecycle hook: ngOnInit
  ngOnInit(): void {
    // Call ngOnChanges to initialize the map when the component is initialized
    this.ngOnChanges();
  }
}
