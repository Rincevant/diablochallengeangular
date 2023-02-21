import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UniqueItem } from '../models/uniqueItem.model';

@Component({
  selector: 'app-unique-armor-list',
  templateUrl: './unique-armor-list.component.html',
  styleUrls: ['./unique-armor-list.component.css']
})
export class UniqueArmorListComponent implements OnInit  {

  listUniqueItems : UniqueItem[] = []
  
  constructor(private http: HttpClient) { }
  
  ngOnInit(): void {
    this.http.get<UniqueItem[]>('assets/data/armors/uarmor_elite.json').subscribe(data => {
      this.listUniqueItems = data;

      for (let index = 0; index < this.listUniqueItems.length; index++) {
        console.log(this.listUniqueItems[index])        
      }
    });
  }

  obtain(value : string ){

  }
}
