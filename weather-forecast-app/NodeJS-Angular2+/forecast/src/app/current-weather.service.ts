import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CurrentWeatherService {

  constructor(private httpClient: HttpClient) {
  }

  getCurrentWeatherResults(city: string, latitude: string, longitude: string) {
    const params = new HttpParams()
      .set('city', city)
      .set('latitude', latitude)
      .set('longitude', longitude);
    return this.httpClient.get('http://nodejsapp-cshi5131.us-west-1.elasticbeanstalk.com/currentWeather', {params});
  }
}
