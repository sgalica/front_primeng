import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Prestation } from '../model/prestation';



@Injectable()
export class PrestationService {
    constructor(private http: HttpClient) { }

    getAll() {

        return this.http.get<Prestation[]>(`/api/prestations/`);
    }

    getById(id: number) {
        return this.http.get(`/api/prestations/` + id);
    }

    register(prestation: Prestation) {
        return this.http.post(`/api/prestations/register`, prestation);
    }

    update(prestation: Prestation) {
        return this.http.put(`/api/prestations/` + prestation.id_prestation, prestation);
    }

    delete(id: number) {
        return this.http.delete(`/api/prestations/` + id);
    }
}
