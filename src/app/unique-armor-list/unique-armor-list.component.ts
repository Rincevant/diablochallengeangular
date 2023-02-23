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

  traductionFr = false
  
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
        propertiesListTranslate.push(this.translateProperties(propriete))
      });

      return propertiesListTranslate
  }

  translateProperties(propriete : string) : string {
    let newPropertie = propriete.toLowerCase();

    // REQUIRED
    if (newPropertie.includes("required")) {
      return this.requiredTranslate(newPropertie);
    }

    // DURABILITY
    if (newPropertie.includes("durability")) {
      return "résistance " + newPropertie.split("durability")[1]
    }

    // DEFENSE
    if (newPropertie.includes("defense")) {
      return this.defenseTranslate(newPropertie);
    }

    // TO SOMETHING
    if (newPropertie.includes("to")) {
      return this.toSomethingTranslate(newPropertie);
    }

    // MAX STAMINA
    if (newPropertie.includes("max stamina")) {
      return newPropertie.split("max stamina")[0] + "d'endurance maximale"
    }

    // FASTER RUN WALK
    if (newPropertie.includes("faster run/walk")) {
      return newPropertie.split("faster run/walk")[0] + "à la marche/course"
    }

    // RESIST
    if (newPropertie.includes("resist")) {
      return this.resistancesTranslate(newPropertie)
    }

    return "NULL"
  }

  toSomethingTranslate(newPropertie : string) : string {
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

    return "NULL"
  }

  resistancesTranslate(newPropertie : string) : string {
      // RESIST MAX
      if (newPropertie.includes("to max poison resist")) {
        return newPropertie.split("to max poison resist")[0] + "à la résistance max. au poison"
      }

      if (newPropertie.includes("to max fire resist")) {
        return newPropertie.split("to max fire resist")[0] + "à la résistance max. au feu"
      }

      if (newPropertie.includes("to max cold resist")) {
        return newPropertie.split("to max cold resist")[0] + "à la résistance max. au froid"
      }

      if (newPropertie.includes("to max lightning resist")) {
        return newPropertie.split("to max lightning resist")[0] + "à la résistance max. à la foudre"
      }

      // RESIST GLOBAL
      if (newPropertie.includes("poison resist")) {
        return "résistance au poison " + newPropertie.split("poison resist")[1]
      }

      if (newPropertie.includes("fire resist")) {
        return "résistance au feu " + newPropertie.split("fire resist")[1]
      }

      if (newPropertie.includes("cold resist")) {
        return "résistance au froid " + newPropertie.split("cold resist")[1]
      }

      if (newPropertie.includes("lightning resist")) {
        return "résistance à la foudre " + newPropertie.split("lightning resist")[1]
      }

      return "NULL"
  }

  defenseTranslate(newPropertie : string) : string {

    // BASE DEFENSE
    if (newPropertie.includes("defense:")) {
      newPropertie = newPropertie.replace("defense", "défense")
      newPropertie = newPropertie.replace("varies", "variation")
      newPropertie = newPropertie.replace("base defense", "défense de base")
      return newPropertie
    }

    // BASE DEFENSE
    if (newPropertie.includes("enhanced defense")) {
      return "défense augmentée de " + newPropertie.split("enhanced defense")[0] 
    }

    // BASE DEFENSE
    if (!newPropertie.includes("base") && !newPropertie.includes("enhanced")) {
      return newPropertie.split("defense")[0] + "à la défense"
    }

    return "NULL"
  }

  requiredTranslate(newPropertie : string) : string {
    // REQUIRED LEVEL
    if (newPropertie.includes("required level")) {
      return "niveau requis " + newPropertie.split("required level")[1]
    } 

    // REQUIRED STRENGTH
    if (newPropertie.includes("required strength")) {
      return "force nécessaire " + newPropertie.split("required strength")[1]
    }

    // REQUIRED DEXTERITY
    if (newPropertie.includes("required dexterity")) {
      return "dextérité nécessaire " + newPropertie.split("required dexterity")[1]
    }

    return "NULL"
  }
  
}
