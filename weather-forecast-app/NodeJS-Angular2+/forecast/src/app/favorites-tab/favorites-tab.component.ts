import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-favorites-tab',
  templateUrl: './favorites-tab.component.html',
  styleUrls: ['./favorites-tab.component.css']
})
export class FavoritesTabComponent implements OnInit {

  favorites = [];

  constructor() { }

  ngOnInit() {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const data = localStorage.getItem(key);
      this.favorites.push(JSON.parse(data));
    }
  }
  delete(index: number) {
    localStorage.removeItem(this.favorites[index].city);
    this.favorites.splice(index, 1);
  }

}
