import {Injectable} from '@angular/core';
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
    constructor(httpClient: HttpClient) {
        super(
            httpClient,
            'api',
            'commercialopens');
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
    constructor(httpClient: HttpClient) {
        super(
            httpClient,
            'api',
            'missions');
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
    constructor(httpClient: HttpClient) {
        super(
            httpClient,
            'api',
            'contrats');
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




