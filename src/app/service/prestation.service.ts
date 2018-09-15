import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Prestation } from '../model/prestation';



@Injectable()
export class PrestationService {
    constructor(private http: HttpClient) { }

    getAll() {

        return this.http.get<Prestation[]>(`http://localhost:9090/api/prestations/`);
    }

    getById(id: number) {
        return this.http.get(`http://localhost:9090/prestations/` + id);
    }

    register(prestation: Prestation) {
        return this.http.post(`http://localhost:9090/prestations/register`, prestation);
    }

    update(prestation: Prestation) {
        return this.http.put(`http://localhost:9090/prestations/` + prestation.id_prestation, prestation);
    }

    delete(id: number) {
        return this.http.delete(`http://localhost:9090/prestations/` + id);
    }
}
