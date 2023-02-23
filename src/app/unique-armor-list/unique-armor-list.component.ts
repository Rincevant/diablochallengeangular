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
        propertiesListTranslate.push(this.translateProperties(propriete))
      });

      return propertiesListTranslate
  }

  translateProperties(propriete : string) : string {
    let newPropertie = propriete.toLowerCase();

    // FROZEN
    if (newPropertie.includes("cannot be frozen")) {
      return "Ne peut pas être immobilisé"
    }

    // ATTACKER TAKE DOMMAGE
    if (newPropertie.includes("attacker takes damage of")) {
      return "l'adversaire subit des dégâts de " + newPropertie.split("attacker takes damage of")[1]
    }

    // HIT RECOVERY
    if (newPropertie.includes("faster hit recovery")) {
      return "récupération très rapide après un coup " + newPropertie.split("faster hit recovery")[0]
    }

    // PATCH
    if (newPropertie.includes("only spawns in patch")) {
      return "(Disponible uniquement dans le patch 1.10 ou plus récent)"
    }

    // REQUIRED
    if (newPropertie.includes("required")) {
      return this.requiredTranslate(newPropertie);
    }

    // CLASS
    if (newPropertie.includes("amazon") || newPropertie.includes("barbarian") || newPropertie.includes("paladin") || newPropertie.includes("necromancer") || newPropertie.includes("sorceress") || newPropertie.includes("assassin") || newPropertie.includes("druid")) {
      return this.classPropertiesTranslate(newPropertie);
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

    // FASTER CAST RATE
    if (newPropertie.includes("faster cast rate")) {
      return "vitesse de sort très rapide " + newPropertie.split("faster cast rate")[0]
    }

    // REGENERATE MANA
    if (newPropertie.includes("regenerate mana")) {
      return newPropertie.split("regenerate mana")[1] + " à la régénération du mana" 
    }

    // RESIST
    if (newPropertie.includes("resist")) {
      return this.resistancesTranslate(newPropertie)
    }

    return "NULL"
  }

  toSomethingTranslate(newPropertie : string) : string {
    // RESIST MAX
    if (newPropertie.includes("to maximum poison resist")) {
      return newPropertie.split("to maximum poison resist")[0] + "aux max. de résistance au poison"
    }

    if (newPropertie.includes("to maximum fire resist")) {
      return newPropertie.split("to maximum fire resist")[0] + "aux max. de résistance au feu"
    }

    if (newPropertie.includes("to maximum cold resist")) {
      return newPropertie.split("to maximum cold resist")[0] + "aux max. de résistance au froid"
    }

    if (newPropertie.includes("to maximum lightning resist")) {
      return newPropertie.split("to maximum lightning resist")[0] + "aux max. de résistance à la foudre"
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

    // COLD SKILL DAMAGE
    if (newPropertie.includes("to cold skill damage")) {      
      return newPropertie.split("to cold skill damage")[0] + "aux dégâts des compétences de froid"
    }

    // FIRE SKILL DAMAGE
    if (newPropertie.includes("to fire skill damage")) {      
      return newPropertie.split("to fire skill damage")[0] + "aux dégâts des compétences de feu"
    }
    
    // LIGHTNING SKILL DAMAGE
    if (newPropertie.includes("to lightning skill damage")) {      
      return newPropertie.split("to lightning skill damage")[0] + "aux dégâts des compétences de foudre"
    }

    return "TO PROPERTIE NULL"
  }

  resistancesTranslate(newPropertie : string) : string {
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

      return "RESIST NULL"
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

    return "DEFENSE NULL"
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

    return "REQUIRED NULL"
  }

  classPropertiesTranslate(newPropertie : string) : string {

    // SORCERESS
    if (newPropertie.includes("bonus to a random sorceress skill")) {
      return newPropertie.split("bonus to a random sorceress skill")[0] + "à l'une des compétences de la sorcière (aléatoire)"
    }

    return "SKILL NULL"
  }
  
}
