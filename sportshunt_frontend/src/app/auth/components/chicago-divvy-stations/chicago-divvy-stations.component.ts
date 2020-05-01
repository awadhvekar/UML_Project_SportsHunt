import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'ngx-alerts';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chicago-divvy-stations',
  templateUrl: './chicago-divvy-stations.component.html',
  styleUrls: ['./chicago-divvy-stations.component.css']
})
export class ChicagoDivvyStationsComponent implements OnInit {
  stadiumName:any;
  lat:Number;
  lng:Number;
  placeSelected: Place;
  divvyStations: Station[];

  icon = {
    url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
    scaledSize: {
      width: 60,
      height: 60
    }
  }

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }

  constructor(private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    public progressBar: ProgressBarService,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.stadiumName = this.activatedRoute.snapshot.paramMap.get('stadiumName');
    this.lat = Number(this.activatedRoute.snapshot.paramMap.get('lat'));
    this.lng = Number(this.activatedRoute.snapshot.paramMap.get('long'));
    console.log("URL Parameters: " + this.stadiumName + ", " + this.lat + ", " + this.lng);

    this.placeSelected = {latitude: this.lat, longitude: this.lng, name: this.stadiumName, zoom: 13};
    this.getNearByDivvyDockingStations(this.lat, this.lng);

  }

  getNearByDivvyDockingStations(placeLat, placeLong){
    this.progressBar.startLoading();
    let apiRequest= {location_lat: placeLat, location_lng: placeLong};
    return this.http.post("http://localhost:8000/getDivvyDockingStationsInfo", apiRequest).subscribe(response => {
      this.progressBar.setProgressBarSuccess();
      if(response['message'] == "Stations Listed")
      {
        this.divvyStations = response['response'];
      }
      this.progressBar.completeLoading();
      this.alertService.success('Divvy Docking Stations plotted on Map.');
    },
    error => {
      this.progressBar.setProgressBarFailure();
      console.log(error);
      this.progressBar.completeLoading();
      this.alertService.danger('Sorry! We are unable to fetch divvy stations.');
    });
  }
}

interface Place {
  name: String;
  latitude: Number;    
  longitude: Number;
  zoom: Number;
}

interface Station {
  altitude: Number;
  availablebikes: Number;
  availabledocks: Number;
  city: any;
  id: Number;
  is_renting: any;
  kiosktype:any;
  landmark: any;
  lastcommunicationtime: String;
  latitude:Number;
  longitude: Number;
  location: any;
  postalcode: Number;
  staddress1: any;
  staddress2: any;
  stationname: String;
  status: String;
  statuskey: any;
  statusvalue: any;
  teststation: any;
  totaldocks: any;
  where_is: any;
}