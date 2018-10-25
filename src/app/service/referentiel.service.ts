import {Referentiel} from "../model/data";
import {ResourceService} from "./resource.service";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable()
export class ReferentielService extends ResourceService<Referentiel> {
    constructor(httpClient: HttpClient) {
        super(
            httpClient,
            'api',
            'referentiel');
    }
}
