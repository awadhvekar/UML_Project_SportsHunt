import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { AlertService } from 'ngx-alerts';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-weatherchart',
  templateUrl: './weatherchart.component.html',
  styleUrls: ['./weatherchart.component.css']
})
export class WeatherchartComponent implements OnInit {

  chart = [];

  constructor(private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private _http: HttpClient,
    public progressBar: ProgressBarService,
    private alertService: AlertService) { }

  ngOnInit(): void {
    let cityName = this.activatedRoute.snapshot.paramMap.get('cityName');
    this.authService.dailyForecast(cityName).subscribe(response =>{
      // console.log(response);
      let temp_max = response['list'].map(response => response.main.temp_max);
      let temp_min = response['list'].map(response => response.main.temp_min);
      let temp = response['list'].map(response => response.main.temp);
      let temp_real_feel = response['list'].map(response => response.main.feels_like);
      let allDates = response['list'].map(response => response.dt);

      let weatherDates = [];
      allDates.forEach(element => {
        let jsDate = new Date(element * 1000);
        weatherDates.push(jsDate.toLocaleTimeString('en', {year: 'numeric', month: 'short', day: 'numeric'}));
      });
      // console.log(weatherDates);
      this.chart = new Chart('mycanvas', {
        type: 'line',
        data: {
          labels: weatherDates,
          datasets: [
            {
              data: temp_max,
              borderColor: '#FF0000',
              fill: false,
              label: 'Maximum Temperature'
            },
            {
              data: temp_min,
              borderColor: '#00FF00',
              fill: false,
              label: 'Minimum Temperature'
            },
            {
              data: temp,
              borderColor: '#0000FF',
              fill: false,
              label: 'Average Temperature'
            },
            {
              data: temp_real_feel,
              borderColor: '#00FFFF',
              fill: false,
              label: 'Feels Like'
            },
          ]
        },
        options: {
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              display: true
            }],
            yAxes: [{
              display: true
            }]
          }
        }
      });
    },
    error=>{
      console.log(error);
    });
  }

  // dailyForecast(){
  //   return this.http.get("http://api.openweathermap.org/data/2.5/forecast?q=Chicago&appid=70a5d26982ce6a2f955b54272bdbae4d").subscribe(response=>{
  //     console.log(response);
  //   },
  //   error=>{
  //     console.log(error);
  //   });
  // }

  // dailyForecast() {
  //   return this._http.get("http://api.openweathermap.org/data/2.5/forecast?q=San%20Diego&appid=70a5d26982ce6a2f955b54272bdbae4d").pipe(map(result => result)).subscribe(response=>{
  //     console.log(response);
  //   },
  //   error=>{

  //   });
  // }

}
