import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { AlertService } from 'ngx-alerts';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-searchsportsevent',
  templateUrl: './searchsportsevent.component.html',
  styleUrls: ['./searchsportsevent.component.css']
})
export class SearchsportseventComponent implements OnInit {

  apiResponseData: any;
  sportsEvents: any;

  constructor(private http: HttpClient,
    public progressBar: ProgressBarService,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.getTickeMasterSportsEvents();
  }

  onSubmit(f: NgForm) {
    /*
    console.log(f.value.cityName);
    console.log(f.value.dateRange);
    console.log(f.value.sportsName);
    */

    if(f.value.sportsName == null || f.value.sportsName == "")
    {
      f.value.sportsName = "sports";
    }
   this.progressBar.startLoading();
   return this.http.get("https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US"
   + "&classificationName=" + f.value.sportsName
   + "&city=" + f.value.cityName 
   // + "&startDateTime=2020-06-01T00:00:00Z" 
   // + "&endDateTime=2020-07-31T00:00:00Z" 
   + "&sort=date,asc" 
   + "&apikey=bDUhXHdIL0p7OSyxZwsJ6LxLsrAhnIAH").subscribe(response => {
     //console.log(response["_embedded"].events);
     this.apiResponseData = response;
     if(response.hasOwnProperty("_embedded"))
     {
       this.sportsEvents = response["_embedded"].events;
     }
     else
     {
       this.sportsEvents = null;
     }
     console.log(this.sportsEvents);

     if(this.sportsEvents == null)
     {
       this.progressBar.setProgressBarFailure();
       this.progressBar.completeLoading();
       this.alertService.danger('Sorry! There is no Sports Event for selected city, dates.');
     }
     else
     {
       this.progressBar.setProgressBarSuccess();
       this.progressBar.completeLoading();
       this.alertService.success('Congrats! We have listed some Sports Events for you.');
     }
   },
   error => {
     console.log(error);
     this.progressBar.setProgressBarFailure();
     this.progressBar.completeLoading();
     this.alertService.danger('Sorry! There is no Sports Event for selected city, dates.');
   }
   );

  }

  getTickeMasterSportsEvents(){
    this.progressBar.startLoading();
    return this.http.get("https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US"
    + "&classificationName=baseball"
    // + "&city=Chicago" 
    // + "&startDateTime=2020-06-01T00:00:00Z" 
    // + "&endDateTime=2020-07-31T00:00:00Z" 
    + "&sort=date,asc" 
    + "&apikey=bDUhXHdIL0p7OSyxZwsJ6LxLsrAhnIAH").subscribe(response => {
      //console.log(response["_embedded"].events);
      this.apiResponseData = response;
      if(response.hasOwnProperty("_embedded"))
      {
        this.sportsEvents = response["_embedded"].events;
      }
      else
      {
        this.sportsEvents = null;
      }
      console.log(this.sportsEvents);

      if(this.sportsEvents == null)
      {
        this.progressBar.setProgressBarFailure();
        this.progressBar.completeLoading();
        this.alertService.warning('covid-19 causes sports cancellations.');
      }
      else
      {
        this.progressBar.setProgressBarSuccess();
        this.progressBar.completeLoading();
        this.alertService.warning('covid-19 causes sports cancellations.');
      }
    },
    error => {
      console.log(error);
      this.progressBar.setProgressBarFailure();
      this.progressBar.completeLoading();
      this.alertService.danger('Sorry! There is no Sports Event for selected city, dates.');
    }
    );
  }

}
