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
    } else if (propertie.includes('NULL')) {
      return "empty";
    } else {
      return "blue"
    }
    return ""
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
    newPropertie = newPropertie.replace("varies", "variation")
    newPropertie = newPropertie.replace("per character level", "par niv. du perso.")

    // SPAWNS IN ANY PATCH
    if (newPropertie.includes("spawns in any patch")) {
      return newPropertie.replace("spawns in any patch", "disponible dans tous les patch")
    }

    // EXTRA GOLD
    if (newPropertie.includes("extra gold from monsters")) {
      return newPropertie.split("extra gold from monsters")[0] + "d'or récupéré sur les monstres"
    }

    // MAGIC FIND
    if (newPropertie.includes("better chance of getting magic items")) {
      return newPropertie.split("better chance of getting magic items")[0] + "de chance de trouver un objet magique"
    }

    // STAMINA DRAIN
    if (newPropertie.includes("slower stamina drain")) {
      return "l'endurance diminue plus lentement de " + newPropertie.split("slower stamina drain")[0]
    }

    // OPEN WOUNDS
    if (newPropertie.includes("chance of open wounds")) {
      return newPropertie.split("chance of open wounds")[0] + "de chance de faire des blessures ouvertes"
    }

    // LIFE AFTER EACH DEATH
    if (newPropertie.includes("life after each kill")) {
      return newPropertie.split("life after each kill")[0] + "en vie après chaque monstre tué"
    }

    // REPLENISH LIFE
    if (newPropertie.includes("replenish life")) {
      newPropertie = newPropertie.replace("varies", "variation")
      return newPropertie.split("replenish life")[1] + " à la régénération de la vie"
    }

    // ATTACK SPEED
    if (newPropertie.includes("increased attack speed")) {
      return newPropertie.split("increased attack speed")[0] + "en vitesse d'attaque"
    }

    // LIFE STOLEN    
    if (newPropertie.includes("life stolen per hit")) {
      return newPropertie.split("life stolen per hit")[0] + "de vie volée par coup"
    }

    // CHARGES
    if (newPropertie.includes("level") && newPropertie.includes("charges")) {
      return this.charges(newPropertie)
    }
    
    // INCREASES MAX MANA
    if (newPropertie.includes("increases maximum mana ")) {
      return "+" + newPropertie.split("increases maximum mana ")[1] + " au maximum de mana"
    }

    // SLOW TARGET
    if (newPropertie.includes("slows target by")) {
      return "ralenti la cible de " + newPropertie.split("slows target by")[1]
    }

    // LADDER ONLY
    if (newPropertie.includes("ladder only")) {
      return newPropertie.replace("ladder only", "ladder seulement")
    }

    // INDESTRUCTIBLE
    if (newPropertie.includes("indestructible")) {
      return "indestructible"
    }

    // DAMAGE REDUCE
    if (newPropertie.includes("damage reduced by")) {
      newPropertie = newPropertie.replace("varies", "variation");
      if (newPropertie.includes("magic")) {
        return "dégâts magique réduits de " + newPropertie.split("magic damage reduced by")[1]
      }
      return "dégâts réduits de " + newPropertie.split("damage reduced by")[1]
    }

    // POISON LENGTH
    if (newPropertie.includes("poison length reduced by")) {
      return "durée du poison réduit de " + newPropertie.split("poison length reduced by")[1]
    }

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
    if (newPropertie.includes("require")) {
      return this.requiredTranslate(newPropertie);
    }

    // CLASS
    if (newPropertie.includes("amazon") || newPropertie.includes("barbarian") || newPropertie.includes("paladin") || newPropertie.includes("necromancer") || newPropertie.includes("sorceress") || newPropertie.includes("assassin") || newPropertie.includes("druid")) {
      return this.classPropertiesTranslate(newPropertie);
    }

    // DURABILITY
    if (newPropertie.includes("durability")) {
      if (newPropertie.includes("repairs")) {
        let parseRepair = newPropertie.split(" ");
        return "répare " + parseRepair[1] + " de durabilité toutes les " + parseRepair[4] + " secondes"
      }
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

    // MAXIMUM STAMINA
    if (newPropertie.includes("maximum stamina")) {
      return newPropertie.split("maximum stamina")[0] + "à l'endurance maximum"
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
      newPropertie = newPropertie.split("regenerate mana")[1] + " à la régénération du mana" 
      newPropertie = newPropertie.replace("varies", "variation")
      return newPropertie
    }

    // RESIST
    if (newPropertie.includes("resist")) {
      return this.resistancesTranslate(newPropertie)
    }

    // POTION BOXES
    if (newPropertie.includes("boxes")) {
      return "taille de la ceinture +" + newPropertie.split("boxes")[0] + " emplacements"
    }

    if (newPropertie.includes("slain monster")) {
      return "Slain Monster Rest in Peace (les monstres tués ne peuvent pas être ressuscités)"
    }

    return newPropertie
  }

  toSomethingTranslate(newPropertie : string) : string { 
    // TO LIGHT RADIUS
    if (newPropertie.includes("to light radius")) {
      return newPropertie.split("to light radius")[0] + "à la portée lumineuse"
    }

    // TO DEMONS
    if (newPropertie.includes("damage to demons")) {
      return newPropertie.split("damage to demons")[0] + "de dégâts contre les démons"
    }

    // TO CAST
    if (newPropertie.includes("to cast")) {
      return this.toCast(newPropertie)
    }

    // ALL SKILL To All Skills
    if (newPropertie.includes("to all skill")) {
      if (newPropertie.includes("skills"))
        return newPropertie.split("to all skills")[0] + "à toutes les compétences"
      else 
        return newPropertie.split("to all skill")[0] + "à toutes les compétences"
    }

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
      newPropertie = newPropertie.replace("per character level", "par niv. du perso.")
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

      // FIRE RESIST
      if (newPropertie.includes("fire resist")) {
        return "résistance au feu " + newPropertie.split("fire resist")[1]
      }

      // COLD RESIST
      if (newPropertie.includes("cold resist")) {
        return "résistance au froid " + newPropertie.split("cold resist")[1]
      }

      // RESIST LIGHTINING
      if (newPropertie.includes("lightning resist")) {
        return "résistance à la foudre " + newPropertie.split("lightning resist")[1]
      }

      // ALL RESISTANCE
      if (newPropertie.includes("all resistances")) {
        newPropertie = newPropertie.replace("varies", "variation")
        return newPropertie.split("all resistances")[1] + " à toutes les résistances"
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

    // PER CHARACTER LEVEL
    if (newPropertie.includes("per character level")) {
      return "+" + newPropertie.split(" ")[5] + " à la défense (selon niv. du perso.)"
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

    // REQUIREMENTS
    if (newPropertie.includes("requirements")) {
      return "conditions requises " + newPropertie.split("requirements")[1]
    }


    return "REQUIRED NULL"
  }

  classPropertiesTranslate(newPropertie : string) : string {

    // SORCERESS SKILL
    if (newPropertie.includes("sorceress")) {
      if (newPropertie.includes("bonus to a random sorceress skill")) {
        return newPropertie.split("bonus to a random sorceress skill")[0] + "à l'une des compétences de la sorcière (aléatoire)"
      }
    }

    // PALADIN
    if (newPropertie.includes("paladin")) {
      if (newPropertie.includes("to offensive auras")) {
        return newPropertie.split("to offensive auras")[0] + " aux auras offensives (Paladin seulement)" 
      }
    } 
    
    // ASSASSIN
    if (newPropertie.includes("assassin")) {
      if (newPropertie.includes("assassin kick damage")) {
        return "Dégâts Kick de l'assassin " + newPropertie.split("assassin kick damage")[1] 
      }
    }


    return "SKILL NULL"
  }

  toCast(newPropertie : string) : string {
    // TO CAST
    let parseToCast = newPropertie.split(" ")

    if (newPropertie.includes("iron maiden")) {
      return parseToCast[0] + " de chances de lancer Dame de fer - niv. " + parseToCast[5] + " en étant touché"  
    }

    if (newPropertie.includes("life tap")) {
      return parseToCast[0] + " de chances de lancer un sort Balance de vie de niv. " + parseToCast[5] + " en frappant"  
    }

    return "TO CAST NULL"
  } 

  charges(newPropertie : string) : string {

    // VENOM
    if (newPropertie.includes("venom")) {
      let level = newPropertie.split(" ")[1]
      let chargesValue = newPropertie.split(" ")[3].split("(")[1]
      return chargesValue + " charges du sort Venin de niveau " + level
    }

    return "CHARGES NULL"
  }
  
}
