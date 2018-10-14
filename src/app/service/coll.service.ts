import {ResourceService} from "./resource.service";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Collaborateur} from "../model/collaborateur";

@Injectable()
export class CollService extends ResourceService<Collaborateur> {
    constructor(http: HttpClient) {
        super(
            http,
            'api',
            'collaborateurs');
    }
}
