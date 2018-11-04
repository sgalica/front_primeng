///<reference path="collaborateur.service.ts"/>
import {Injectable} from '@angular/core';
import {ResourceService} from "./resource.service";
import {CollaborateurService} from "./collaborateur.service";
import {ContactsStt, Contrat, Departement, Domaine, Pole, Site, SocieteStt} from "../model/referenciel";
import {Prestation} from "../model/_prtation";
import {
    ContactsSttService,
    ContratService,
    DepartementService,
    DomaineService,
    MissionService,
    NumAtgService,
    PoleService,
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
                private poleService: PoleService,
                private domaineService: DomaineService,
                private contratService: ContratService,
                private departementService: DepartementService,
                private societeSttService: SocieteSttService,
                private prestationService: PrestationService,
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
        } else if (object.constructor.name == "Departement") {

            console.log("Departement match");
            return this.departementService;
        } else if (object.constructor.name == "Domaine") {

            console.log("Domaine match");
            return this.domaineService;
        } else if (object.constructor.name == "Pole") {

            console.log("Pole match");
            return this.poleService;
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
