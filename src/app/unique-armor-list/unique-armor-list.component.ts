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

      data.forEach(item => {
        this.listUniqueItems.push(item)
      });

      this.toolTipSetItem();
    });
  }

  obtain(value : string ){

  }

  toolTipSetItem() {
    let docs = document.getElementsByClassName('tooltiptext');
    console.log(docs)
    document.addEventListener('DOMContentLoaded', () => {
      const docs: HTMLCollectionOf<Element> = document.getElementsByClassName('tooltiptext');
      const elementsArray = Array.from(docs);
      console.log(elementsArray);
    });
    
  }
}
