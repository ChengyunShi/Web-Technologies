import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material';

const MaterialComponents = [
  MatAutocompleteModule
];

@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents]
})
export class MaterialModule { }
