import {ResourceService} from "./resource.service";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {NumAtg} from "../model/data";

@Injectable()
export class NumAtgService extends ResourceService<NumAtg> {
    constructor(httpClient: HttpClient) {
        super(
            httpClient,
            'api',
            'numatgs');
    }
}
