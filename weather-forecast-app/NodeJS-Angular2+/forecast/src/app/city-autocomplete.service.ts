import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CityAutocompleteService {

  constructor(private httpClient: HttpClient) { }

  getCityAutocomplete(input: string) {
    const params = new HttpParams().set('input', input);
    return this.httpClient.get<any>('http://nodejsapp-cshi5131.us-west-1.elasticbeanstalk.com/autocompleteCities', { params });
  }
}
