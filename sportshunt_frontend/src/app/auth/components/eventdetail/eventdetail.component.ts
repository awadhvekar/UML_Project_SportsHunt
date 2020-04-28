import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertService } from 'ngx-alerts';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-eventdetail',
  templateUrl: './eventdetail.component.html',
  styleUrls: ['./eventdetail.component.css']
})
export class EventdetailComponent implements OnInit, AfterViewInit {
  // google: any;
  eventId: any;
  apiUrl: any;
  apiResponseData: any;
  sportsEvent: any;
  venueName: any;
  venueAddress: any;
  ticketPrice: any;
  numberOfTicket: any;
  totalTicketPrice: any;
  eventCityName: any;
  eventDateTime: any;
  eventSportsTypeName: any;
  eventReviews: any;
  @ViewChild('mapContainer', {static: false}) gmap:ElementRef;
  map: google.maps.Map;
  lat = 41.8308761;
  lng = -87.635195;
  // lat: any;
  // lng: any;
  coordinates = new google.maps.LatLng(this.lat, this.lng);
  mapOptions: google.maps.MapOptions = {
    center: this.coordinates,
    zoom: 13,
  };
  marker = new google.maps.Marker({
    position: this.coordinates,
    map: this.map,
  });

  constructor(private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    public progressBar: ProgressBarService,
    private alertService: AlertService,
    private router: Router,
    private authService: AuthService) { }
  ngAfterViewInit(): void {
    this.mapInitializer();
  }

  ngOnInit(): void {
    this.getEventDetailApi();
    this.getEventReviewsApi();
  }

  onSubmit(f: NgForm) {
    this.progressBar.startLoading();
    
    const addOrderMakePaymentApiObserver = {
      next: x => {
        this.progressBar.setProgressBarSuccess();
        console.log('Payment Successful');
        this.progressBar.completeLoading();
        this.alertService.success('Payment Successful!');
        // this.router.navigate(['/login']);

      },
      error: err => {
        this.progressBar.setProgressBarFailure();
        console.log('Error in Payment: ' + JSON.stringify(err));
        this.progressBar.completeLoading();
        this.alertService.danger('Payment not done. Please try again.');
        this.alertService.danger(err.error.response.detail);
      },
    };
    this.authService.addOrderMakePaymentApi(f.value).subscribe(addOrderMakePaymentApiObserver);
  }

  mapInitializer() {
    this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);
    this.marker.setMap(this.map);

   }

  getEventReviewsApi(){
    this.eventReviews = [];
    this.eventId = this.activatedRoute.snapshot.paramMap.get('eventId');
    this.progressBar.startLoading();
    let apiRequest= {ticketMasterEventId: this.eventId};
    return this.http.post("http://localhost:8000/viewEventReview", apiRequest).subscribe(response => {
      // console.log("Reviews: " + response['response']);
      let reviewsArray = response['response'];
      // console.log(reviewsArray);
      for(var i = 0; i < reviewsArray.length; i++)
      {
        //console.log("Event Id: " + reviewsArray[i]['_source'].ticketmaster_event_id);
        // console.log("Event Id: " + reviewsArray[i]['_source']);
        this.eventReviews.push(reviewsArray[i]['_source']);
      }
      console.log("eventReviews Array: " + JSON.stringify(this.eventReviews));
      this.progressBar.setProgressBarSuccess();
      this.progressBar.completeLoading();
      this.alertService.success('Event Reviews fetched.');
    }, error=> {
      console.log(error);
      this.progressBar.setProgressBarFailure();
      this.progressBar.completeLoading();
      this.alertService.danger('Sorry! We are unable to fetch reviews for this Event.');
    });
  }

  getEventDetailApi(){
    this.eventId = this.activatedRoute.snapshot.paramMap.get('eventId');
    this.apiUrl = `https://app.ticketmaster.com/discovery/v2/events/${this.eventId}.json?apikey=bDUhXHdIL0p7OSyxZwsJ6LxLsrAhnIAH`;
    //console.log("Event Id: " + this.eventId);

    this.progressBar.startLoading();
    return this.http.get(this.apiUrl).subscribe(response => {
      // console.log(response);
      // this.apiResponseData = response;
      this.sportsEvent = response;
      
      if(this.sportsEvent.classifications[0].subGenre.name == "NFL"){
        this.sportsEvent['img'] = "/assets/images/NFL_logo.png";
      }
      else if(this.sportsEvent.classifications[0].subGenre.name == "NHL"){
        this.sportsEvent['img'] = "/assets/images/NHL_logo.png";
      }
      else if(this.sportsEvent.classifications[0].subGenre.name == "NBA"){
        this.sportsEvent['img'] = "/assets/images/NBA_logo.png";
      }
      else if(this.sportsEvent.classifications[0].subGenre.name == "MLB"){
        this.sportsEvent['img'] = "/assets/images/MLB_logo.png";
      }
      else{
        this.sportsEvent['img'] = "/assets/images/default_logo.png";
      }

      // console.log("sportsEvent: " + this.sportsEvent.img);
      // console.log("Sub Genre: " + this.sportsEvent.classifications[0].subGenre.name);
      // console.log("Lat: " + this.sportsEvent['_embedded'].venues[0].location.latitude);
      this.lat = this.sportsEvent['_embedded'].venues[0].location.latitude;
      this.lng = this.sportsEvent['_embedded'].venues[0].location.longitude;
      this.eventCityName = this.sportsEvent['_embedded'].venues[0].city.name;
      this.eventSportsTypeName = this.sportsEvent.classifications[0].genre.name;
      this.eventDateTime = this.sportsEvent.dates.start.dateTime;

      this.venueName = this.sportsEvent['_embedded'].venues[0].name;
      this.venueAddress = this.sportsEvent['_embedded'].venues[0].address.line1 + ", " + this.sportsEvent['_embedded'].venues[0].city.name + ", " + this.sportsEvent['_embedded'].venues[0].state.stateCode + ", " + this.sportsEvent['_embedded'].venues[0].postalCode;

      this.sportsEvent['venueName'] = this.venueName;
      this.sportsEvent['venueAddress'] = this.venueAddress;

      if(this.sportsEvent == null)
      {
        this.progressBar.setProgressBarFailure();
        this.progressBar.completeLoading();
        this.alertService.warning('covid-19 causes sports cancellations.');
      }
      else
      {
        this.progressBar.setProgressBarSuccess();
        this.progressBar.completeLoading();
        this.alertService.success('Event Details Listed.');
      }
    },
    error => {
      console.log(error);
      this.progressBar.setProgressBarFailure();
      this.progressBar.completeLoading();
      this.alertService.danger('Sorry! We are unable to fetch details for this Event.');
    });
    
  }

  /*
  calculateTotalPrice(event){
    // ticketPrice = $("#selectTicketPrice").val();
    // numberOfTicket = $("#selectNumberOfTicket").val();
    var target = event.target || event.srcElement || event.currentTarget;
    this.ticketPrice = target.attributes.id.nodeValue;
    this.numberOfTicket = target.attributes.id.nodeValue;
    console.log("Ticket Price: " + this.ticketPrice);
    console.log("Number of Tickets: " + this.numberOfTicket);
  }
  */

 calculateTotalPrice(ticketPrice, numberOfTicket){
   this.ticketPrice = ticketPrice;
   this.numberOfTicket = numberOfTicket;
   this.totalTicketPrice = this.ticketPrice * this.numberOfTicket;
 }
}
