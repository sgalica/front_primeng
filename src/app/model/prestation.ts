import {Collaborateur} from "./collaborateur";

export class Prestation {

    prestIdKey: number; // réf. unique
    prestId : number; // Réf. de la prestation
    prestIdMission : number;
    prestContrat : string ;
    prestIdPilote : string ; // Filled from collaborateur
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
