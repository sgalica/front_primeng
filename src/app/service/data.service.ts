///<reference path="collaborateur2.service.ts"/>
import {Injectable} from '@angular/core';
import {MissionService} from "./mission.service";
import {ResourceService} from "./resource.service";
import {NumAtgService} from "./numatg.service";


class Resource {
    id: number
}

@Injectable()
export class DataService  {
    constructor(
        private numAtgService: NumAtgService,
        private missionService: MissionService ) { }

    public serviceMatch(object : any) : ResourceService<Resource>{
        var service;

        if (object.constructor.name === "NumAtg") {
            console.log("NumAtg match");
            return this.numAtgService;
        } else if (object.constructor.name == "Mission") {

            console.log("Mission match");
            return this.missionService;
        }

    }


}

