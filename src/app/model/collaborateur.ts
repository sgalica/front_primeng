import {Prestation} from "./prestation";

export class Collaborateur {
     id                  : any;
     trigramme           : any;
     nom                 : any;
     prenom              : any;
     telPerso            : any;
     telPro              : any;
     mailOpen            : any;
     mailSG              : any;
     categorisation      : any;
     sT                  : any;
     statutCollab        : any;
     versionCollab       : any;
     societeSTT          : any;
     preEmbauche         : any;
     dateEmbaucheOPEN    : any;

     prestations         : Prestation[];

     createdAt           : any;
     createdBy           : any;
     updatedAt           : any;
     updatedBy           : any;
}
