import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {Message} from "primeng/api";

@Injectable()
export class AlertService {
    private subject = new Subject<any>();
    private subject2 = new Subject<any>();
    private keepAfterNavigationChange = false;
    msgs: Message[] = [];


    constructor(private router: Router) {
    }

    success(message: string) {

        this.subject.next({ type: 'success', text: message });
        this.msgs = [];
        console.log("LOGGGGGGGGGGGGGGGGG",message);
        this.msgs.push({severity:'success', summary:'Message de succès', detail: message});
        this.subject2.next(this.msgs);

    }

    error(message: string) {
        this.subject.next({ type: 'error', text: message });
        this.msgs = [];
        this.msgs.push({severity:'error', summary:'Message d\'erreur', detail:message});
        this.subject2.next(this.msgs);

    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
    getMessage2(): Observable<any> {
        return this.subject2.asObservable();
    }


}
