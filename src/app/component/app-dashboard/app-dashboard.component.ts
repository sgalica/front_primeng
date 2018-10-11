import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {BehaviorSubject} from "../../../../node_modules/rxjs/Rx";

@Component({
    selector: 'app-dashboard',
    templateUrl: './app-dashboard.component.html',
    styleUrls: ['./app-dashboard.component.scss']
})
export class AppDashboardComponent implements OnInit {


    at_date : String = new Date().toJSON().slice(0,10).split('-').reverse().join('/');
    fr: any;
    isAdmin$ = new BehaviorSubject<boolean>(false); // {1}

    constructor( private authService: AuthService) {
    }

    ngOnInit(): void {

        this.fr = {
            firstDayOfWeek: 1,
            dayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
            dayNamesShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
            dayNamesMin: ["Di","Lu","Ma","Me","Je","Ve","Sa"],
            monthNames: [ "Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre" ],
            monthNamesShort: [ "Jan", "Fév", "Mar", "Avr", "Mai", "Jui","Jui", "Aoû", "Sep", "Oct", "Nov", "Déc" ],
            today: "Aujourd'hui",
            clear: 'Effacer'
        };

        if (localStorage.getItem('currentUser')) {
            this.authService.isAdmin.subscribe((value) => {
                this.isAdmin$.next(value);
            });
        }

    }

}
