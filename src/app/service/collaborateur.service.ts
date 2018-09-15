import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Collaborateur } from '../model/collaborateur';



@Injectable()
export class CollaborateurService {
    constructor(private http: HttpClient) { }

    getAll() {

        return this.http.get<Collaborateur[]>(`http://localhost:9090/api/collaborateurs/`);
    }

    getById(id: number) {
        return this.http.get(`http://localhost:9090/collaborateurs/` + id);
    }

    register(collaborateur: Collaborateur) {
        return this.http.post(`http://localhost:9090/collaborateurs/register`, collaborateur);
    }

    update(collaborateur: Collaborateur) {
        return this.http.put(`http://localhost:9090/collaborateurs/` , collaborateur);
    }

    delete(id: number) {
        return this.http.delete(`http://localhost:9090/collaborateurs/` + id);
    }
}
