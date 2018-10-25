/*
///<reference path="collaborateur2.service.ts"/>
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Data} from '../model/data';
import {CollaborateurService} from "./collaborateur2.service";
import {UserService} from "./user.service";


@Injectable()
export class DataService {
    constructor(
        private collaborateurService: CollaborateurService,
    ) { }

    saveCollaborateur() {
        return this.collaborateurService;
    }


}
/!**!/*/
