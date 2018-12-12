import {Injectable} from '@angular/core';
import {first} from "rxjs/operators";
import {DatePipe} from "@angular/common";

import {Collaborateur} from "../model/referentiel";
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
    datetimefmt = "dd/MM/yyyy hh:mm:SS";


    constructor( private datePipe:DatePipe  ){}

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
        var label="";
        for (var key in array) {
            if (array[key] == "")
                label = " [ Vide ]";
            else {
                var labelfld = labels[ array[key]];
                label = (labelfld) ? labelfld : array[key] ;
            }
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

    
    loadTableKeyValues(flds, tableService, itemsarray, uniquevalues, addEmptyValue=false) {

        tableService.list()
            .pipe(first())
            .subscribe( rows => {

                    flds.forEach( fld => {

                            itemsarray[fld.ref]=[];
                            if (addEmptyValue)
                                itemsarray[fld.ref].push({value: "", label: "[Vide]"});

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

    setKeys(coldefs, row) {

        for (var column in coldefs) {

            if (coldefs[column].filtertype == "date" ) {}
            else if (row[ column ] == undefined || row[ column ] == null )
                row[ column ] = "";
            else if (coldefs[column].keycol) {
                var valuetrim = row[ column ].trim();
                if (valuetrim=="") row[ column ] = "";
            }
            else {
                if (typeof row[column]== "string")
                    row[column] = row[column].trim();
            }

            coldefs[column].keys[ row[ column ] ] = "";
        }
    }


    setLabel(labels, element, column, addlabelfields: string[] ) {

        if (element!=undefined) {
            labels[ element[ column ] ] = element[ column ] ;

            var label="";
            var first=true;
            addlabelfields.forEach(fld =>  {
                if (!first)
                    label += " ";
                label += element[fld];
                first=false;
            });
            if (label!="") label = " (" + label + ")";

            labels[ element[ column ] ] += label;
        }
    }

    /*** Fonctions Date ***/
    dateStr(pDate) {
        if (pDate != undefined && pDate!=null && typeof pDate.getMonth === "function")
            return this.datePipe.transform(pDate, this.datefmt);
        return pDate;
    }

    dateTimeStr(pDate) {
        if (pDate != undefined && pDate!=null && typeof pDate.getMonth === "function")
            return this.datePipe.transform(pDate, this.datetimefmt);
        return pDate;
    }


    setTimeStamp(obj) {

        var currentUser = JSON.parse(localStorage.getItem('currentUser'));

        // Created if new
        if (obj.createdAt == 0 ) {
            obj.createdBy = currentUser.id;
            obj.createdAt = this.dateTimeStr(new Date());
        }

        // Update
        obj.updatedBy = currentUser.id;
        obj.updatedAt = this.dateTimeStr(new Date());

    }

}
