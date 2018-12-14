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

    // SelectItems
    orderSelectItems(a, b)      { var fld="value"; return (a[fld] > b[fld]) ? 1 : (a[fld] < b[fld]) ? -1 : 0; }
    orderSelectItemsLabel(a, b) { var fld="label"; return (a[fld] > b[fld]) ? 1 : (a[fld] < b[fld]) ? -1 : 0; }

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

    // Array
    convertMapToArray(map : {}) : any[] {
        var list=[];
        for (var key in map ) { list.push(key); }
        return list;
    }

    // TABLE

    // Initialise la propriété de la colonne selon son type (valistype si type, othervalue otherwise)
    clearTableCol(table, col, coltst, type, valistype, othervalue) {
        for( var column in table) {
            var typevalue = (table[column][coltst] == type) ? typeof valistype : typeof othervalue;
            if ( typevalue == "string")
                table[column][col]="";
            else
                table[column][col]=[];
        }
    }

    // Récupère une liste dans la forme (key-value) de la table (pour combos)
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

    // Enregistre les valeurs des colonnes d'une ligne comme clés
    // Les valeurs undefined, null, espace comme "", Les valeurs sont débarassées de leur espaces sauf si clé.
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


    // ELEMENTS
    // Rajoute les valeurs des autres colonnes comme complément d'info à la colonne dans la forme : colonne (autres colonnes)
    setLabel(labels, element, column, addlabelfields: string[] ) {

        if (element != undefined) {
            labels[ element[ column ] ] = element[ column ] ;

            var label="";
            var first=true;
            addlabelfields.forEach(fld =>  {
                if (!first) label += " ";
                label += element[fld];
                first=false;
            });
            if (label!="") label = " (" + label + ")";

            labels[ element[ column ] ] += label;
        }
    }

    setObjectValues(obj, property, newvalues) {
        for (var key in newvalues ) {
            if (property==null)
                obj[key] = newvalues[key]
            else
                obj[key][property] = newvalues[key]
        }
    }


    // DATE
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

    // Retourne la date si plus récente (null autrement)
    getDateIfMoreRecent(datestr, lastDate ) {
        var dateTst = this.convertStrToDate(datestr);
        return ( dateTst > (this.convertStrToDate(lastDate)) ) ? dateTst : null;
    }

    convertStrToDate(datestr) {
        if (datestr) {
            if (typeof datestr=="string") {
                var dateArr = datestr.split("/"); //dd/mm/yyyy
                return new Date(Number(dateArr[2]), Number(dateArr[1]) - 1, Number(dateArr[0]));
            }
            else
             return datestr;
        }
        else
            return new Date(0);
    }

    addToDate(date, datearr) { // [d,m,y]
        var newDate = new Date(date);
        if (datearr[0] > 0)  // days
            newDate = new Date (newDate.valueOf() + (86400000 * datearr[0]) )

        if (datearr[1] > 0) { // months
            var nmonths = newDate.getMonth() + datearr[1];
            newDate = new Date (newDate.getFullYear() + (nmonths / 12), nmonths%12, newDate.getDate()  )
        }
        if (datearr[2] > 0)  // years
            newDate = new Date (newDate.getFullYear() + datearr[2], newDate.getMonth(), newDate.getDate()  )

        return newDate;
    }

    // Transforms object {cond:"gte/lte", value} => {cond:"gt/lt", value}
    convertDateGteLteToGtLt(pCondition) {

        var condition = {cond:"gt", value:0};

        if (pCondition.value != null) {
            condition.value = pCondition.value.valueOf(); //valuedate = event.valueOf().toString();
            if      (pCondition.cond=="gte") { condition.cond="gt"; condition.value -= 86400000; } // 86400000 = 1 jour en millis
            else if (pCondition.cond=="lte") { condition.cond="lt"; condition.value += 86400000; }
        }
        return condition;
    }

}
