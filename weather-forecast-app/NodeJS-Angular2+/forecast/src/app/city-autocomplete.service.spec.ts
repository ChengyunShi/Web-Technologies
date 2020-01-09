import { TestBed } from '@angular/core/testing';

import { CityAutocompleteService } from './city-autocomplete.service';

describe('CityAutocompleteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CityAutocompleteService = TestBed.get(CityAutocompleteService);
    expect(service).toBeTruthy();
  });
});
