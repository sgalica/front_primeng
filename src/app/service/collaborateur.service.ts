import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Collaborateur} from '../model/collaborateur';
import {ResourceService} from "./resource.service";


@Injectable()
export class CollaborateurService  extends ResourceService<Collaborateur> {
    constructor(httpClient: HttpClient) {
        super(
            httpClient,
            'api',
            'collaborateurs');
    }
}
