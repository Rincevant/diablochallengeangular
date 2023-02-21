import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UniqueItem } from '../models/uniqueItem.model';

@Component({
  selector: 'app-unique-armor-list',
  templateUrl: './unique-armor-list.component.html',
  styleUrls: ['./unique-armor-list.component.css']
})
export class UniqueArmorListComponent implements OnInit  {

  listType : string[] = [ "elite", "exceptional", "normal"]
  listArmorName : string[] = [ "armor", 'belts', "boots", "gloves", "helms", "shields"]

  listUniqueItems : UniqueItem[] = []

  traductionFr = true
  
  constructor(private http: HttpClient) { }
  
  ngOnInit(): void {
    this.listType.forEach(type => {      
        this.listArmorName.forEach(armorName => {          
            this.http.get<UniqueItem[]>('assets/data/armors/u'+armorName+'_'+type+'.json').subscribe(data => {
              // Initialisation des items
              data.forEach(item => {
                item.propertiesList = item.properties?.split("\n")
                if (this.traductionFr) {
                  item.propertiesList = this.traductionFrancais(item.propertiesList);
                }
                this.listUniqueItems.push(item)
              });      
            });
        });

    });    
  }

  /**
   * Retourne la couleur de la propriete
   * @param propertie La propriete de l'objet
   * @returns La couleur à afficher
   */
  getColorPropertie(propertie : string) {
    if (propertie.includes(':')) {
      return "white";
    } else {
      return "blue";
    }
  }


  traductionFrancais(propertiesList : string[] | undefined) {
      let propertiesListTranslate : string[] = []

      propertiesList?.forEach(element => {
        element = "test"
        propertiesListTranslate.push(element)
      });

      return propertiesListTranslate
  }
  
}
