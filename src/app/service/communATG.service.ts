import {Injectable} from '@angular/core';

@Injectable()
export class CommunATGService {

    // Intl
    fr = {
        firstDayOfWeek: 1,
        dayNames: [ "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi" ],
        dayNamesShort: [ "Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam" ],
        dayNamesMin: [ "di", "Lu", "Ma", "Me", "Je", "Ve", "Sa" ],
        monthNames: [ "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre" ],
        monthNamesShort: [ "Jan", "Fév", "Mar", "Avr", "Mai", "Jui", "Jui", "Aoû", "Sep", "Oct", "Nov", "Déc" ],
        today: 'Aujourd\'hui',
        clear: 'Effacer'
    };

    datefmt = "dd/mm/yy";
    datefmtCalendarInput = "dd/MM/yyyy";


    constructor() {
    }

    success() {
    }

}
