import {Collaborateur} from "./collaborateur";

export class Prestation {

    prestId: number; // réf. unique
    prestIdFirst : number; // Réf. de la mission (l'enregistrement de l'historique de la mission avec n° version 1)
    prestVersionActuelle : string; // A=Actuelle, H=Historique
    prestIdMission : number;
    prestContrat : string ;
    prestIdPilote : string ;
    prestDepartement : string;
    prestPole : string;
    prestDomaine : string;
    prestATG : string ;
    prestDateDebut : any;
    prestDateFin : any ;
    prestPU : string;
    prestSite : string;
    prestRespPoleSG : string;
    prestDonneurOrdreSG : string;
    prestCommercialOPEN : string;
    prestType : string;
    prestStatut : string;
    prestVersion : number;

    collaborateur : Collaborateur;

    prestDateCreation  : any;
    prestUserCreation : string ;
    prestDateMaj : any;
    prestUserMaj : string ;
}
