import {EventEmitter, Injectable} from '@angular/core';
import {ResourceService} from "./resource.service";
import {
    Categorie,
    Collaborateur,
    CommercialOpen,
    ContactsStt,
    Contrat,
    DonneurOrdre,
    Equipe,
    Mission,
    NumAtg,
    Prestation,
    Referentiel,
    Site,
    SocieteStt
} from "../model/referentiel";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CommunATGService} from "./communATG.service"
import {first} from "rxjs/operators";

@Injectable()
export class ContactsSttService extends ResourceService<ContactsStt> {
    constructor(httpClient: HttpClient) {
        super(
            httpClient,
            'api',
            'contactsstts');
    }
}@Injectable()
export class DonneurOrdreService extends ResourceService<DonneurOrdre> {
    constructor(httpClient: HttpClient) {
        super(
            httpClient,
            'api',
            'donneurordres');
    }
}@Injectable()
export class CommercialOpenService extends ResourceService<CommercialOpen> {

    httpClient : HttpClient;

    constructor(httpClient: HttpClient) {
        super(
            httpClient,
            'api',
            'commercialopens');
        this.httpClient = httpClient;
    }

    findByName(name : string): Observable<CommercialOpen> {
        return this.httpClient
            .get(`api/commercialopens/name/${name}`)
            .map((data: any) => data as CommercialOpen);
    }
}

@Injectable()
export class CollaborateurService extends ResourceService<Collaborateur> {

    httpClient : HttpClient;

    constructor(httpClient: HttpClient) {
        super(
            httpClient,
            'api',
            'collaborateurs');

        this.httpClient = httpClient;
    }

    findByTrigramme(trigr : string): Observable<Collaborateur> {
        return this.httpClient
            .get(`api/collaborateurs/trigr/${trigr}`)
            .map((data: any) => data as Collaborateur);
    }

}

@Injectable()
export class ReferentielService extends ResourceService<Referentiel> {
    constructor(httpClient: HttpClient) {
        super(
            httpClient,
            'api',
            'referentiels');
    }
}

@Injectable()
export class SiteService extends ResourceService<Site> {
    constructor(httpClient: HttpClient) {
        super(
            httpClient,
            'api',
            'sites');
    }
}

@Injectable()
export class MissionService extends ResourceService<Mission> {

    communServ : CommunATGService;
    httpClient : HttpClient;
    public missionAdded$ : EventEmitter<Mission> ;

    constructor(httpClient: HttpClient, private communATGService : CommunATGService) {

        super(  httpClient, 'api', 'missions');

        this.communServ = communATGService;
        this.httpClient = httpClient;

        this.missionAdded$ = new EventEmitter();
    }

    getMission(id: string): Observable<Mission[]> {
        return this.httpClient
            .get(`api/missions/id/${id}`)
            .map((data: any) => data as Mission[]);
    }

    getMissionsCollab(collab: string): Observable<Mission[]> {
        return this.httpClient
            .get(`api/missions/collab/${collab}`)
            .map((data: any) => data as Mission[]);
    }

    updateMission(entity: string, action : string, item : Mission, dbService : MissionService, clear : boolean = false) {

        if (item==undefined || item==null) return;
        let dateFields =  ["dateDebutMission" , "dateFinSg", "dateA3Ans"];

        // Old value
        var dbold = new Mission(item); this.communServ.setObjectValues(dbold, null, { statutMission : "A"} );
        this.communServ.datePropsToStr(dbold, dateFields );
        if (dbold["collaborateur"] != undefined ) dbold["collaborateur"]=null; // Don't save related items

        // New value
        var dbnew = new Mission(item); this.communServ.setObjectValues(dbnew, null, { statutMission : action,  // "T"
            versionMission : Number(dbnew.versionMission) + 1 });
        this.communServ.datePropsToStr(dbnew, dateFields );
        if (dbnew["collaborateur"] != undefined ) dbnew["collaborateur"]=null; // Don't save related items

        var dbupd  = dbold; var upd = new Mission(item);
        var dbadd  = dbnew; var add = item; // Keep last value in memory

        // Save & Clear value
        this.communServ.updateWithBackup(entity, upd, dbupd, add, dbadd, dbService, clear);
    }

    addMission(mission : Mission, dateDeb : any, prestation : Prestation) {

        // Create a new one
        // identifiant collab, dates de début, fin et à 3 ans, dérogation et statut pré-remplit.
        if (!mission) {

            let newMission = new Mission();
            let date3ans = this.communServ.addToDate(dateDeb,[0,0,3]);
            this.communServ.setObjectValues( newMission, null, {
                id                : 0,
                identifiantMission: "IDMI",
                identifiantPilote : prestation.trigramme,
                dateDebutMission  : dateDeb,
                dateFinSg         : date3ans,
                dateA3Ans         : date3ans,
                derogation        : "Non", // Todo : Ajouter durée dérogation
                statutMission     : "E", versionMission : 1
            });
            let itemfordb = new Mission(newMission);
            this.communServ.datePropsToStr(itemfordb, ["dateDebutMission", "dateFinSg", "dateA3Ans"] );
            this.communServ.setTimeStamp(itemfordb);
            this.create(itemfordb).pipe(first()).subscribe(data => {

                let entity = "Mission";

                // Update item on success
                this.communServ.updateVersion(entity, newMission, data);

                this.missionAdded$.emit(newMission);

            });
        }
    }

}


@Injectable()
export class NumAtgService extends ResourceService<NumAtg> {
    constructor(httpClient: HttpClient) {
        super(
            httpClient,
            'api',
            'numatgs');
    }
}

@Injectable()
export class EquipeService extends ResourceService<Equipe> {
    constructor(httpClient: HttpClient) {
        super(
            httpClient,
            'api',
            'equipes');
    }
}

@Injectable()
export class PrestationService extends ResourceService<Prestation> {
    constructor(httpClient: HttpClient) {
        super(
            httpClient,
            'api',
            'prestations');
    }
}

@Injectable()
export class ContratService extends ResourceService<Contrat> {

    httpClient : HttpClient;

    constructor(httpClient: HttpClient) {
        super(httpClient, 'api','contrats');
        this.httpClient = httpClient;
    }

    findByContrat(contrat : string): Observable<Contrat> {
        return this.httpClient
            .get(`api/contrats/contrat/${contrat}`)
            .map((data: any) => data as Contrat);
    }

}
@Injectable()
export class CategorieService extends ResourceService<Categorie> {
    constructor(httpClient: HttpClient) {
        super(
            httpClient,
            'api',
            'categories');
    }
}

@Injectable()
export class SocieteSttService extends ResourceService<SocieteStt> {
    constructor(httpClient: HttpClient) {
        super(
            httpClient,
            'api',
            'societestts');
    }
}




