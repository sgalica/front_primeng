///<reference path="collaborateur.service.ts"/>
import {Injectable} from '@angular/core';
import {MissionService} from "./mission.service";
import {ResourceService} from "./resource.service";
import {NumAtgService} from "./numatg.service";


@Injectable()
export class DataService  {
    constructor(
        private numAtgService: NumAtgService,
        private missionService: MissionService ) { }

    public serviceMatch(object : any) : ResourceService<any>{

        if (object.constructor.name === "NumAtg") {
            console.log("NumAtg match");
            return this.numAtgService;
        } else if (object.constructor.name == "Mission") {
            debugger;
            console.log("Mission match");
            return this.missionService;
        }

    }


}

