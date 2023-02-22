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


  /*************** TRADUCTION *****************/
  traductionFrancais(propertiesList : string[] | undefined) {
      let propertiesListTranslate : string[] = []

      propertiesList?.forEach(propriete => {
        propertiesListTranslate.push(this.toSomething(propriete))
      });

      return propertiesListTranslate
  }

  toSomething(propriete : string) : string {
    let newPropertie = propriete.toLowerCase();

    if (newPropertie.includes("required level")) {
      return "Niveau requis" + newPropertie.split("required level")[1]
    } 

    // FORCE
    if (newPropertie.includes("to strength")) {
      return newPropertie.split("to strength")[0] + "à la force"
    }
    
    // ENERGY
    if (newPropertie.includes("to energy")) {
      return newPropertie.split("to energy")[0] + "à l'énergie"
    }

    // DEXTERITY
    if (newPropertie.includes("to dexterity")) {
      return newPropertie.split("to dexterity")[0] + "à la dextérité"
    }

    // VITALITY
    if (newPropertie.includes("to vitality")) {
      return newPropertie.split("to vitality")[0] + "à la vitalité"
    }

    // LIFE
    if (newPropertie.includes("to life")) {
      return newPropertie.split("to life")[0] + "aux points de vies"
    }

    // MANA
    if (newPropertie.includes("to mana")) {
      return newPropertie.split("to mana")[0] + "au mana"
    }

    if (newPropertie.includes("max stamina")) {
      return newPropertie.split("max stamina")[0] + "à l'endurance max"
    }



    return "NULL"
  }
  
}
