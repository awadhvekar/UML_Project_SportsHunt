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

  minDate: Date;
  maxDate: Date;
  minDateEnd: Date;
  maxDateEnd: Date;
  apiResponseData: any;
  sportsEvents: any;

  constructor(private http: HttpClient,
    public progressBar: ProgressBarService,
    private alertService: AlertService) { 
      this.minDate = new Date();
      this.minDateEnd = new Date();
      
      /*
      this.maxDate = new Date(2020, 3, 16);
      
      this.maxDate = new Date();
      this.maxDate.setDate(this.maxDate.getDate() + 1);

      this.minDateEnd = this.maxDateEnd = new Date();
      this.minDateEnd.setDate(this.maxDate.getDate() + 1);
      this.maxDateEnd.setDate(this.maxDate.getDate() + 2);
      */
     }

  /*
  changeMinMaxEnd(): void {
    alert("Changed!");
    this.minDateEnd = this.maxDateEnd = new Date();
    this.minDateEnd.setDate(this.maxDate.getDate() + 1);
    this.maxDateEnd.setDate(this.maxDate.getDate() + 2);
  }
  */

  ngOnInit(): void {
    this.getTickeMasterSportsEvents();
  }

  onSubmit(f: NgForm) {
    /*
    console.log(f.value.cityName);
    console.log(f.value.dateRange);
    console.log(f.value.sportsName);
    console.log("DateRangeToIsoString: " + f.value.dateRange.toISOString());
    console.log("DateRangeToIsoString: " + f.value.dateRangeEnd.toISOString());
    */

    let newFormattedStartDate, newFormattedEndDate;

    if( f.value.dateRange == null || f.value.dateRange == ""){
      newFormattedStartDate = "";
    }
    else{
      newFormattedStartDate = f.value.dateRange.toISOString();
      newFormattedStartDate = newFormattedStartDate.substring(0, 19) + newFormattedStartDate.substring(23);
      console.log(`Date Range Start: ${newFormattedStartDate}`);
    }

    if(f.value.dateRangeEnd == null || f.value.dateRangeEnd == ""){
      newFormattedEndDate = "";
    }
    else{
      newFormattedEndDate = f.value.dateRangeEnd.toISOString();
      newFormattedEndDate = newFormattedEndDate.substring(0, 19) + newFormattedEndDate.substring(23);
      console.log(`Date Range End: ${newFormattedEndDate}`);
    }

    if(f.value.sportsName == null || f.value.sportsName == "")
    {
      f.value.sportsName = "sports";
    }
   this.progressBar.startLoading();
   return this.http.get("https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US"
   + "&classificationName=" + f.value.sportsName
   + "&city=" + f.value.cityName 
   + "&startDateTime=" + newFormattedStartDate // 2020-06-01T00:00:00Z 
   + "&endDateTime=" + newFormattedEndDate // 2020-07-31T00:00:00Z  
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
    + "&classificationName=sports"
    // + "&city=Chicago" 
    + "&startDateTime=2020-06-01T00:00:00Z"
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
