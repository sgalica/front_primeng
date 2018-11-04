///<reference path="collaborateur.service.ts"/>
import {Injectable} from '@angular/core';
import {ResourceService} from "./resource.service";
import {
    ContactsStt,
    Contrat,
    Departement,
    Domaine,
    NumAtg,
    Pole,
    Referenciel,
    Site,
    SocieteStt
} from "../model/referenciel";
import {HttpClient} from "@angular/common/http";
import {Prestation} from "../model/_prtation";
import {Mission} from "../model/mission";

@Injectable()
export class ContactsSttService extends ResourceService<ContactsStt> {
    constructor(httpClient: HttpClient) {
        super(
            httpClient,
            'api',
            'contactsstts');
    }
}

@Injectable()
export class ReferencielService extends ResourceService<Referenciel> {
    constructor(httpClient: HttpClient) {
        super(
            httpClient,
            'api',
            'referenciels');
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
export class PoleService extends ResourceService<Pole> {
    constructor(httpClient: HttpClient) {
        super(
            httpClient,
            'api',
            'poles');
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
export class DomaineService extends ResourceService<Domaine> {
    constructor(httpClient: HttpClient) {
        super(
            httpClient,
            'api',
            'domaines');
    }
}
@Injectable()
export class DepartementService extends ResourceService<Departement> {
    constructor(httpClient: HttpClient) {
        super(
            httpClient,
            'api',
            'departements');
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




