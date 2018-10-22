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
        return this.http.get<Prestation>(`/api/prestations/` + id);
    }

    getPrestationsCollab(idcollab: number) {
        return this.http.get<Prestation[]>(`/api/prestations/collab/` + idcollab);
        //return this.http.get<Prestation[]>(`/api/collaborateurs/` + idcollab+ '/prestations');
    }

    save(prestation: Prestation) {
        return (prestation.prestId==undefined || prestation.prestId==null) ? this.register(prestation) : this.update(prestation);
    }

    register(prestation: Prestation) {
        return this.http.post(`/api/prestations/register`, prestation);
    }

    update(prestation: Prestation) {
        return this.http.put(`/api/prestations/` + prestation.prestId, prestation);
    }

    delete(id: number) {
        return this.http.delete(`/api/prestations/` + id);
    }
}
