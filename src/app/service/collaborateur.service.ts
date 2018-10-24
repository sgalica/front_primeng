import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Collaborateur} from '../model/collaborateur';


@Injectable()
export class CollaborateurService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Collaborateur[]>(`/api/collaborateurs/`);
    }

    getById(id: number) {
        return this.http.get<Collaborateur>(`/api/collaborateurs/` + id);
    }

    registerList(collaborateurList: Array<Collaborateur>) {
        console.log("appel POST", collaborateurList);
        return this.http.post(`/api/collaborateurs/register/import`, collaborateurList);
    }

    register(collaborateur: Collaborateur) {
        return this.http.post(`/api/collaborateurs/register/1`, collaborateur);
    }

    update(collaborateur: Collaborateur) {
        return this.http.put(`/api/collaborateurs/` , collaborateur);
    }

    delete(id: number) {
        return this.http.delete(`/api/collaborateurs/` + id);
    }
}
