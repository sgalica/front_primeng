import {ResourceService} from "./resource.service";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Mission} from "../model/mission";

@Injectable()
export class MissionService extends ResourceService<Mission> {
    constructor(httpClient: HttpClient) {
        super(
            httpClient,
            'api',
            'missions');
    }
}
