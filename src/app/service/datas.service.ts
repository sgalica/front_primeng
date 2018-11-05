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
    Referenciel,
    Site,
    SocieteStt
} from "../model/referenciel";
import {HttpClient} from "@angular/common/http";

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
    constructor(httpClient: HttpClient) {
        super(
            httpClient,
            'api',
            'collaborateurs');
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




