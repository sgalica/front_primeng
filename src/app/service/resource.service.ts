import {Observable} from "rxjs/Rx";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";


class Resource {
    id: number
}

@Injectable()
export class ResourceService<T extends Resource> {
    constructor(
        private http: HttpClient,
        private url: string ,
        private endpoint: string) {}

    public create(item: T) {
        return this.http
            .post(`${this.url}/${this.endpoint}/1`, item)
            .map(data => data as T);
    }

    public createList(items: T[]){
        debugger
        return this.http
            .post(`${this.url}/${this.endpoint}/`, items)

    }

    public update(item: T): Observable<T> {
        return this.http
            .put<T>(`${this.url}/${this.endpoint}/${item.id}`,  item)
            .map(data => data as T);
    }

    read(id: number): Observable<T> {
        return this.http
            .get(`${this.url}/${this.endpoint}/${id}`)
            .map((data: any) => data as T);
    }

    list(): Observable<T[]> {
        return this.http
            .get(`${this.url}/${this.endpoint}`)
            .map((data: any) => this.convertData(data.items));
    }

    delete(id: number) {
        return this.http
            .delete(`${this.url}/${this.endpoint}/${id}`);
    }

    private convertData(data: any): T[] {
        return data.map(item => item);
    }
}
