import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {Data } from '../model/data';



@Injectable()
export class DataService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Data[]>(`/api/datas/`);
    }

    getById(id: number) {
        return this.http.get(`/api/datas/` + id);
    }

    registerList(dataList: Array<Data>) {
        console.log("appel POST", dataList);
        return this.http.post(`/api/datas/register/import`, dataList);
    }

    register(data: Data) {
        return this.http.post(`/api/datas/register/1`, data);
    }

    update(data: Data) {
        return this.http.put(`/api/datas/` , data);
    }

    delete(id: number) {
        return this.http.delete(`/api/datas/` + id);
    }
}
