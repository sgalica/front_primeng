import {Injectable} from '@angular/core';
import {ResourceService} from "./resource.service";
import {ContactsStt, Contrat, Site, SocieteStt} from "../model/referentiel";
import {
    CategorieService,
    CollaborateurService,
    CommercialOpenService,
    ContactsSttService,
    ContratService,
    DonneurOrdreService,
    EquipeService,
    MissionService,
    NumAtgService,
    PrestationService,
    ReferentielService,
    SiteService,
    SocieteSttService
} from "./datas.service";


@Injectable()
export class DataService {
    constructor(private numAtgService: NumAtgService,
                private referentielService: ReferentielService,
                private collaborateurService: CollaborateurService,
                private contactsSttService: ContactsSttService,
                private contratService: ContratService,
                private societeSttService: SocieteSttService,
                private prestationService: PrestationService,
                private equipeService: EquipeService,
                private donneurOrdreService: DonneurOrdreService,
                private commercialOpenService: CommercialOpenService,
                private categorieService: CategorieService,
                private siteService: SiteService,

                private missionService: MissionService) {
    }

    public getServiceMatch(object: any): ResourceService<any> {

        if (object.constructor.name === "NumAtg") {
            console.log("NumAtg match");
            return this.numAtgService;
        }

        else if (object.constructor.name == "Mission") {
            console.log("Mission match");
            return this.missionService;
        }

        else if (object.constructor.name == "Collaborateur") {
            console.log("Collaborateur match");
            return this.collaborateurService;
        }

        else if (object.constructor.name == "ContactsStt") {
            console.log("ContactsStt match");
            return this.contactsSttService;
        }

        else if (object.constructor.name == "Contrat") {
            console.log("Contrat match");
            return this.contratService;
        }

        else if (object.constructor.name == "Equipe") {
            console.log("Equipe match");
            return this.equipeService;
        }

        else if (object.constructor.name == "Categorie") {

            console.log("Categorie match");
            return this.categorieService;
        }

        else if (object.constructor.name == "DonneurOrdre") {

            console.log("DonneurOrdre match");
            return this.donneurOrdreService;
        }

        else if (object.constructor.name == "CommercialOpen") {
            console.log("CommercialOpen match");
            return this.commercialOpenService;
        }
        else if (object.constructor.name == "Prestation") {
            console.log("Prestation match");
            return this.prestationService;
        }

        else if (object.constructor.name == "Site") {
            console.log("Site match");
            return this.siteService;
        }

        else if (object.constructor.name == "SocieteStt") {
            console.log("SocieteStt match");
            return this.societeSttService;
        }

        else if (object.constructor.name == "Referentiel") {
            console.log("Referentiel match");
            return this.referentielService;
        }

    }

}
