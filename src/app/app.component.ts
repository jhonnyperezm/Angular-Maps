import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title: string = 'Busqueda por direccion';
  title2: string = "Busqueda por ruta";
  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;
  public fullscreenControl: boolean;


  //Control para tutas 
  public renderOptions = {
    suppressMarkers: true,
  }

  public markerOptions = {
    origin: {
      icon: 'assets/img/pin-ubicacion.png',
      draggable: true,
    },
    destination: {
      icon: 'assets/img/marcador.png',
      // label: 'MARKER LABEL',
      // opacity: 0.8,
    },
  }

  lat: Number = 4.708361958009934
  lng: Number = -74.07567600290946

  origin = { lat: 4.708361958009934, lng: -74.07567600290946 };
  destination = { lat: 4.708233646429467, lng: -74.06347731630973 };

  // Fin control para rutas



  @ViewChild("search", { static: true })
  public searchElementRef: ElementRef;

  constructor(private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) {

  }
  values = '';

  ngOnInit() {
    // set google maps defaults

    this.zoom = 16;
    this.latitude = 39.8282;
    this.longitude = -98.5795;
    this.fullscreenControl = true;

    console.log("sin enter", this.searchElementRef.nativeElement);

    // create search FormControl
    this.searchControl = new FormControl();

    // set current position
    this.setCurrentPosition();

    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ['address']
        // types: ['(cities)']
      });
      console.log("Como sale direccion", autocomplete);

      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          console.log("que llega en place", place);


          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          // set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 16;
        });
      });
    });
    console.log("sin final", this.searchElementRef.nativeElement);

  }

  private setCurrentPosition() {
    console.log("sin final2", this.searchElementRef.nativeElement);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }

  expression(event) {
    this.latitude = event.coords.lat;
    this.longitude = event.coords.lng;
    console.log(event);
  }

  keyDownFunction(event) {
    console.log("sin final3", this.searchElementRef.nativeElement);
    this.values = event.target.value;
    console.log("value", this.values);


  }
}
