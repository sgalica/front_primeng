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

    datefmtCalendarInput = "dd/mm/yy";
    datefmt = "dd/MM/yyyy";


    constructor() {  }

    orderSelectItems(a, b)      { var fld="value"; return (a[fld] > b[fld]) ? 1 : (a[fld] < b[fld]) ? -1 : 0; }
    orderSelectItemsLabel(a, b) { var fld="label"; return (a[fld] > b[fld]) ? 1 : (a[fld] < b[fld]) ? -1 : 0; }

    convertMapToArray(map : {}) : any[] {
        var list=[];
        for (var key in map ) {
            list.push(key);
        }
        return list;
    }

    // Return list of SelectItems based on array et labels (if present)
    createSelectItemsFromArray(array, labels ) : any[] {
        var list=[];
        for (var key in array) {
            var label = (array[key] == "") ? " [ Vide ]" : (labels.length > 0) ? labels[array[key]] : array[key];
            list.push({label: label, value: array[key]});
        }
        return list;
    }


    // Return list of SelectItems based on table filtered on coltst
    filterTableSelectItems (tableIn:{}, coltst:string, labelfld:string) : any[] {

        var list = [];
        for( var key in tableIn) {
            if (tableIn[key][coltst])
                list.push({header: tableIn[key][labelfld], field: key});
        }
        return list;
    }

    // Return list of Selectitems based on table filtered by values in array
    filterSelectItems(tableIn:{}, arrayCheck: any[]) : any[]  {

        var list = [];
        for (var key in tableIn) {
            if (arrayCheck.indexOf(key) == -1)
                list.push({label: tableIn[key], value: key});
        }
        return list;
    }

    clearTableCol(table, col, coltst, type, valistype, othervalue) {
        for( var column in table) {
            table[column][col] = (table[column][coltst] == type) ? valistype : othervalue;
        }
    }


}
