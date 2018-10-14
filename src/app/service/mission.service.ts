import {ResourceService} from "./resource.service";
import {Mission} from "../model/data";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable()
export class MissionService extends ResourceService<Mission> {
    constructor(httpClient: HttpClient) {
        super(
            httpClient,
            '/api',
            'mission');
    }
}
