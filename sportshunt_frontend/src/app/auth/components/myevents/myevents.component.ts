import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertService } from 'ngx-alerts';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';

@Component({
  selector: 'app-myevents',
  templateUrl: './myevents.component.html',
  styleUrls: ['./myevents.component.css']
})
export class MyeventsComponent implements OnInit {
  userEventsArray: any;
  dtOptions: DataTables.Settings = {};
  sportsEvents: any;
  apiResponseData:any;

  constructor(private http: HttpClient,
    public progressBar: ProgressBarService,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.getUserEventsApi();
    this.getRecommendedSportsAndCityApi();
    this.dtOptions = {
      pagingType: 'full_numbers',
      "lengthMenu": [[5], [5]]
    };
    $(".eventsContent").hide();
    $("#myEventsTable").hide();
  }

  getUserEventsApi(){
    this.progressBar.startLoading();
    this.userEventsArray = [];
    return this.http.get("http://localhost:8000/getUserEvents").subscribe(response => {
      if(response['message'] == "All User Events")
      {
        let tempUserEventsArray = response['response'];
        for(var i = 0; i < tempUserEventsArray.length; i++)
        {
          this.userEventsArray.push(tempUserEventsArray[i]);
        }
        this.progressBar.setProgressBarSuccess();
        this.progressBar.completeLoading();
        this.alertService.success('All Events fetched!');
        $("#myEventsTable").show();
      }
      else
      {
        this.progressBar.setProgressBarSuccess();
        // this.userEventsArray.push({"event_name": "No Events present in your profile.","number_of_tickets": "-","total_price": "-", "order_sports_name": "-","order_city": "-","ticketmaster_event_id": null});
        this.progressBar.completeLoading();
        this.alertService.warning('No Events present!');
        $("#myEventsTable").show();
      }
    },
    error => {
      this.progressBar.setProgressBarFailure();
      this.userEventsArray.push({"event_name": "No Events present in your profile.","number_of_tickets": "-","total_price": "-", "order_sports_name": "-","order_city": "-","ticketmaster_event_id": null});
      this.progressBar.completeLoading();
      this.alertService.danger('Sorry! We are unable to fetch events. Please try again after some time.');
      $("#myEventsTable").show();
    })
  }

  getRecommendedSportsAndCityApi()
  {
    return this.http.get("http://localhost:8000/getRecommendedCityAndSports").subscribe(recomendedResponse => {
      let recommendedSportsName = recomendedResponse["response"][0].recomendedSports;
      let recommendedCityName = recomendedResponse["response"][1].recomendedCity;
      this.getTickeMasterSportsEvents(recommendedSportsName, recommendedCityName);
    },
    recomendedError => {
      console.log(recomendedError);
    });
  }

  getTickeMasterSportsEvents(sportsName, cityName){
    this.progressBar.startLoading();
    return this.http.get("https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US"
    + "&classificationName=" + sportsName
    + "&city=" + cityName
    // + "&startDateTime=2020-06-01T00:00:00Z" 
    // + "&endDateTime=2020-07-31T00:00:00Z" 
    + "&sort=date,asc" 
    + "&apikey=bDUhXHdIL0p7OSyxZwsJ6LxLsrAhnIAH").subscribe(response => {
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
        $(".eventsContent").hide();
      }
      else
      {
        this.progressBar.setProgressBarSuccess();
        this.progressBar.completeLoading();
        $(".eventsContent").show();
      }
    },
    error => {
      console.log(error);
      this.progressBar.setProgressBarFailure();
      this.progressBar.completeLoading();
      this.alertService.danger('Sorry! There is no Sports Event for selected city, dates.');
      $(".eventsContent").hide();
    }
    );
  }

}
