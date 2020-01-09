import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ResultsTabComponent} from './results-tab/results-tab.component';
import {FavoritesTabComponent} from './favorites-tab/favorites-tab.component';


const routes: Routes = [
  { path: 'current', component: ResultsTabComponent },
  { path: 'favorites', component: FavoritesTabComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
