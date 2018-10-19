import {Collaborateur} from "./collaborateur";

export class Prestation {

    prestId: number;
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
    prestVersion : number;
    prestStatut : string;

    collaborateur : Collaborateur;

    prestDateCreation  : any;
    prestUserCreation : string ;
    prestDateMaj : any;
    prestUserMaj : string ;
}
