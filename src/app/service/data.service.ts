import {Injectable} from '@angular/core';
import {ResourceService} from "./resource.service";
import {ContactsStt, Contrat, Site, SocieteStt} from "../model/referenciel";
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
    ReferencielService,
    SiteService,
    SocieteSttService
} from "./datas.service";


@Injectable()
export class DataService {
    constructor(private numAtgService: NumAtgService,
                private referencielService: ReferencielService,
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
        } else if (object.constructor.name == "Mission") {

            console.log("Mission match");
            return this.missionService;
        } else if (object.constructor.name == "Collaborateur") {

            console.log("Collaborateur match");
            return this.collaborateurService;
        } else if (object.constructor.name == "ContactsStt") {

            console.log("ContactsStt match");
            return this.contactsSttService;
        } else if (object.constructor.name == "Contrat") {

            console.log("Contrat match");
            return this.contratService;
        } else if (object.constructor.name == "Equipe") {

            console.log("Departement match");
            return this.equipeService;
        } else if (object.constructor.name == "Categorie") {

            console.log("Domaine match");
            return this.categorieService;
        } else if (object.constructor.name == "DonneurOrdre") {

            console.log("Pole match");
            return this.donneurOrdreService;
        }else if (object.constructor.name == "CommercialOpen") {

            console.log("Pole match");
            return this.commercialOpenService;
        } else if (object.constructor.name == "Prestation") {

            console.log("Prestation match");
            return this.prestationService;
        } else if (object.constructor.name == "Site") {

            console.log("Site match");
            return this.siteService;
        } else if (object.constructor.name == "SocieteStt") {

            console.log("SocieteStt match");
            return this.societeSttService;
        }else if (object.constructor.name == "Referenciel") {

            console.log("Referenciel match");
            return this.referencielService;
        }

    }

}
