import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GetLocationService} from './get-location.service';
import {CityAutocompleteService} from './city-autocomplete.service';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private fb: FormBuilder,
              private httpClient: HttpClient,
              private router: Router,
              private cityAutocompleteService: CityAutocompleteService,
              private getLocationService: GetLocationService) {
  }

  isFavorite: boolean;
  hasSubmitted = false;
  validAddress = true;
  userForm: FormGroup;
  cityOptions = [];
  stateOptions = [
    {Abbreviation: 'AL', State: 'Alabama'},
    {Abbreviation: 'AK', State: 'Alaska'},
    {Abbreviation: 'AZ', State: 'Arizona'},
    {Abbreviation: 'AR', State: 'Arkansas'},
    {Abbreviation: 'CA', State: 'California'},
    {Abbreviation: 'CO', State: 'Colorado'},
    {Abbreviation: 'CT', State: 'Connecticut'},
    {Abbreviation: 'DE', State: 'Delaware'},
    {Abbreviation: 'DC', State: 'District Of Columbia'},
    {Abbreviation: 'FL', State: 'Florida'},
    {Abbreviation: 'GA', State: 'Georgia'},
    {Abbreviation: 'HI', State: 'Hawaii'},
    {Abbreviation: 'ID', State: 'Idaho'},
    {Abbreviation: 'IL', State: 'Illinois'},
    {Abbreviation: 'IN', State: 'Indiana'},
    {Abbreviation: 'IA', State: 'Iowa'},
    {Abbreviation: 'KS', State: 'Kansas'},
    {Abbreviation: 'KY', State: 'Kentucky'},
    {Abbreviation: 'LA', State: 'Louisiana'},
    {Abbreviation: 'ME', State: 'Maine'},
    {Abbreviation: 'MD', State: 'Maryland'},
    {Abbreviation: 'MA', State: 'Massachusetts'},
    {Abbreviation: 'MI', State: 'Michigan'},
    {Abbreviation: 'MN', State: 'Minnesota'},
    {Abbreviation: 'MS', State: 'Mississippi'},
    {Abbreviation: 'MO', State: 'Missouri'},
    {Abbreviation: 'MT', State: 'Montana'},
    {Abbreviation: 'NE', State: 'Nebraska'},
    {Abbreviation: 'NV', State: 'Nevada'},
    {Abbreviation: 'NH', State: 'New Hampshire'},
    {Abbreviation: 'NJ', State: 'New Jersey'},
    {Abbreviation: 'NM', State: 'New Mexico'},
    {Abbreviation: 'NY', State: 'New York'},
    {Abbreviation: 'NC', State: 'North Carolina'},
    {Abbreviation: 'ND', State: 'North Dakota'},
    {Abbreviation: 'OH', State: 'Ohio'},
    {Abbreviation: 'OK', State: 'Oklahoma'},
    {Abbreviation: 'OR', State: 'Oregon'},
    {Abbreviation: 'PA', State: 'Pennsylvania'},
    {Abbreviation: 'RI', State: 'Rhode Island'},
    {Abbreviation: 'SC', State: 'South Carolina'},
    {Abbreviation: 'SD', State: 'South Dakota'},
    {Abbreviation: 'TN', State: 'Tennessee'},
    {Abbreviation: 'TX', State: 'Texas'},
    {Abbreviation: 'UT', State: 'Utah'},
    {Abbreviation: 'VT', State: 'Vermont'},
    {Abbreviation: 'VA', State: 'Virginia'},
    {Abbreviation: 'WA', State: 'Washington'},
    {Abbreviation: 'WV', State: 'West Virginia'},
    {Abbreviation: 'WI', State: 'Wisconsin'},
    {Abbreviation: 'WY', State: 'Wyoming'}
  ];


  ngOnInit(): void {
    this.validAddress = true;
    this.hasSubmitted = false;
    this.isFavorite = false;
    this.userForm = this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      currentLocation: [false]
    });

    this.userForm.get('currentLocation').valueChanges
      .subscribe(checkedValue => {
        if (checkedValue) {
          this.userForm.get('street').reset();
          this.userForm.get('street').disable();
          this.userForm.get('city').reset();
          this.userForm.get('city').disable();
          this.userForm.get('state').reset();
          this.userForm.get('state').disable();
        } else {
          this.userForm.get('street').enable();
          this.userForm.get('city').enable();
          this.userForm.get('state').enable();
        }
      });

    this.userForm.get('city').valueChanges
      .pipe(switchMap(value => this.cityAutocompleteService.getCityAutocomplete(value)))
      .subscribe(value => {
        const obj = JSON.parse(JSON.stringify(value));
        this.cityOptions = obj.city;
        if (this.userForm.get('city').invalid || this.userForm.get('city') === null) {
          this.cityOptions = [];
        }
      });
  }

  onSubmit() {
    this.hasSubmitted = true;
    if (this.userForm.value.currentLocation === true) {
      this.validAddress = true;
      this.httpClient.get('http://ip-api.com/json')
        .subscribe(
          data => {
            const obj = JSON.parse(JSON.stringify(data));
            let stateName = '';
            for (const op of this.stateOptions) {
              if (obj.regionName === op.State) {
                stateName = op.Abbreviation;
              }
            }
            this.router.navigate(['/current'], {
              queryParams: {
                city: obj.city,
                state: stateName,
                longitude: obj.lon,
                latitude: obj.lat
              }
            });
          },
          error => console.log(error)
        );
    } else {
      this.getLocationService.getLocation(this.userForm.get('street').value,
        this.userForm.get('city').value, this.userForm.get('state').value)
        .subscribe(
          data => {
            this.validAddress = true;
            const obj = JSON.parse(JSON.stringify(data));
            this.router.navigate(['/current'], {
              queryParams: {
                city: this.userForm.get('city').value,
                state: this.userForm.get('state').value,
                longitude: obj.longitude,
                latitude: obj.latitude
              }
            });
          },
          error => {
            console.log('error!', error);
            this.validAddress = false;
            this.router.navigate(['/']);
          }
        );
    }
  }

  showResult() {
    if (this.hasSubmitted === false || !this.userForm.valid) {
      this.router.navigate(['/']);
    } else {
      this.onSubmit();
    }
  }

  clear() {
    this.userForm.get('street').reset();
    this.userForm.get('city').reset();
    this.userForm.get('state').reset();
    this.userForm.get('street').enable();
    this.userForm.get('city').enable();
    this.userForm.get('state').enable();
    this.userForm.get('currentLocation').setValue(false);
    this.router.navigate(['/']);
  }

}
