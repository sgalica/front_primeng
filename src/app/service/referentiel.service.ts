import {ResourceService} from "./resource.service";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Referentiel} from "../model/referentiel";

@Injectable()
export class ReferentielService extends ResourceService<Referentiel> {
    constructor(httpClient: HttpClient) {
        super(
            httpClient,
            'api',
            'referentiel');
    }
}
