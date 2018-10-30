import {Prestation} from "./prestation";

export class Collaborateur {
     id                   : any = 0;
     trigOpen            : any = 0;
     nom                  : any = 0;
     prenom               : any = 0;
     telPerso            : any = 0;
     telPro              : any = 0;
     mailOpen            : any = 0;
     mailSg              : any = 0;
     codeCategorisation  : any = 0;
     topStatut           : any = 0;
     statutCollab        : any = 0;
     versionCollab       : any = 0;
     societeStt          : any = 0;
     pre_embauche         : any = 0;
     date_embauche        : any = 0;

     prestations          : Prestation[];

     created_at           : any = 0;
     created_by           : any = 0;
     updated_at           : any = 0;
     updated_by           : any = 0;
}
