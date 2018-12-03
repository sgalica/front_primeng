import {Injectable} from '@angular/core';
import {first} from "rxjs/operators";
//import {AlertService} from "../service/alert.service";

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


    constructor( 
        //private alertService: AlertService,
    ){}

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

    // Return list of Selectitems based on table filtered by values in map
    filterSelectItems( tableIn:{}, arrayCheck: {} ) : any[]  {

        var list = [];
        for (var key in tableIn) {
            if ( arrayCheck[key] != undefined )
                list.push({label: tableIn[key], value: key});
        }
        return list;
    }

    clearTableCol(table, col, coltst, type, valistype, othervalue) {
        for( var column in table) {
            var typevalue = (table[column][coltst] == type) ? typeof valistype : typeof othervalue;
            if ( typevalue == "string")
                table[column][col]="";
            else
                table[column][col]=[];
        }
    }

    
    loadTableKeyValues(flds, tableService, itemsarray, uniquevalues) {

        tableService.list()
            .pipe(first())
            .subscribe( rows => {

                    flds.forEach( fld => {

                            itemsarray[fld.ref]=[];

                            if (uniquevalues) {

                                // Unique values
                                var keys = {};
                                rows.forEach(row => {
                                    row[fld.key] = (row[fld.key] == undefined || row[fld.key] == null) ? "" : row[fld.key].trim();
                                    keys[row[fld.key]] = row[fld.label];
                                });
                                // Lists for combos
                                for (var item in keys) {
                                    itemsarray[fld.ref].push({value: item, label: keys[item]});
                                }
                            }
                            else {
                                var label = "";
                                rows.forEach(row => {
                                    label = row[fld.label];
                                    label += (fld.labelbis) ? " (" + row[fld.labelbis] + ")" : "";

                                    itemsarray[fld.ref].push({value: row[fld.key], label: label});
                                });
                            }

                            // Sort
                            itemsarray[fld.ref].sort(this.orderSelectItems);
                        }
                    );
                },
                error => {              //this.alertService.error(error);
                }
            );
    }
    

}
