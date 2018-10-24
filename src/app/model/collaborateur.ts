import {Prestation} from "./prestation";

export class Collaborateur {
     id                   : any;
     trigOpen            : any;
     nom                  : any;
     prenom               : any;
     telPerso            : any;
     telPro              : any;
     mailOpen            : any;
     mailSg              : any;
     codeCategorisation  : any;
     topStatut           : any;
     statutCollab        : any;
     versionCollab       : any;
     societeStt          : any;
     pre_embauche         : any;
     date_embauche        : any;

     prestations          : Prestation[];

     created_at           : any;
     created_by           : any;
     updated_at           : any;
     updated_by           : any;
}
