import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetLocationService {

  constructor(private httpClient: HttpClient) { }

  getLocation(street: string, city: string, state: string) {
    const params = new HttpParams()
      .set('street', street)
      .set('city', city)
      .set('state', state);
    return this.httpClient.get('http://nodejsapp-cshi5131.us-west-1.elasticbeanstalk.com/getLocation', { params });
  }
}
