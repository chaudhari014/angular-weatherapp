import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-weather-dashboard',
  templateUrl: './weather-dashboard.component.html',
  styleUrls: ['./weather-dashboard.component.css'],
})
export class WeatherDashboardComponent implements OnInit {
  location: string = 'surat';
  weatherData: any;
  newdata: any = {};
  errorMessage: string = ''; // Add an error message property

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((params) => {
      const city = params['city'];
      // Fetch weather data for the city
      this.location = city;
    });
  }

  ngOnInit() {
    this.fetchData();
  }
  private displayErrorAlert(error: any) {
    alert(error);
  }
  ngDoCheck(): void {
    if (this.location !== '') {
      console.log('location', 'inside');
      this.fetchData();
      // alert('show first');
      this.location = '';
      console.log(this.location, 'ngDoCheck');
    }
  }
  private fetchData() {
    const apiKey = 'b8d39e93f210454e111dbd445f44fd1f';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${
      this.location ? this.location : 'surat'
    }&appid=${apiKey}`;
    this.http
      .get(apiUrl)
      .pipe(
        catchError((error) => {
          this.errorMessage = 'An error occurred while fetching weather data.';
          this.displayErrorAlert(error.error.message);
          return throwError(error);
        })
      )
      .subscribe((data: any) => {
        console.log('API Response:', data);
        this.weatherData = data;
        this.errorMessage = ''; // Clear any previous error message
        // Process the response data and update your component's data accordingly
      });
    console.log('ngOnInit: Fetching weather data for the default location.');
  }

  sendLocation(city: string) {
    // Trigger ngDoCheck by changing 'location'
    this.location = city;
    //this.fetchData();
    this.router.navigate(['weather', city]);
    console.log(this.location, 'hello');
  }
}
