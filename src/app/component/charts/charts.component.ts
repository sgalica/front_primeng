import {Component, OnInit} from '@angular/core';
import {first} from "rxjs/operators";
import {PrestationService} from "../../service/datas.service";
import {Router} from "@angular/router";
import {AlertService} from "../../service/alert.service";
import {Prestation} from "../../model/referenciel";
import {BehaviorSubject} from "rxjs";

export class ChartLine {

    constructor(departement: any, tauxStt: any, nombreColl: any, dateRef: any) {
        this.departement = departement;
        this.tauxStt = tauxStt;
        this.nombreColl = nombreColl;
        this.dateRef = dateRef;
    }

    departement: any = 0;
    tauxStt: any = 0;
    nombreColl: any = 0;
    dateRef: any = 0;
}

@Component({
    selector: 'app-charts',
    templateUrl: './charts.component.html',
    styleUrls: [ './charts.component.css' ]
})
export class ChartsComponent implements OnInit {

    lineData: any;

    barData: any;

    allchartsSub = new BehaviorSubject<ChartLine[]>(null);

    allcharts = [];


    monthList = [];


    pieData: any;

    polarData: any;

    radarData: any;
    private prestations: Prestation[];

    constructor(private prestationService: PrestationService,
                private router: Router,
                private alertService: AlertService) {
        this.loadAllPrestations();

    }


    ngOnInit() {

        var formatter = new Intl.DateTimeFormat("fr", {month: "short"});

        // console.log("calc",JSON.stringify(this.allcharts));
        let labelList = [];
        let dataList = [];
        this.allchartsSub.subscribe(x => {
            console.log("zzzzzzzzzzzzz-----------------------------------------------zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz", x);

            console.log("", JSON.stringify(x));
            if (x != null || x != undefined && JSON.stringify(x) != "[[],[],[],[],[],[]]") {
                x.forEach(y => {
                    console.log("courbe", y);
                    Object.values(y[ 0 ]).filter((a, b) => b == 3).forEach(z => labelList.push(formatter.format(z as Date)));
                    let stt = [];
                    Object.values(y).forEach((curr) => stt.push(curr[ 'tauxStt' ] / curr[ 'nombreColl' ] * 100));
                    console.log("stt", stt);
                    dataList.push({
                        label: y[ 'departement' ],
                        data: stt,
                        fill: false,
                        borderColor: '#03A9F4'
                    })


                })
            }
            console.log("labellist =", labelList);
            console.log("datalist =", dataList);


            this.lineData = {
                labels: labelList,
                datasets: dataList
            };
        });


        this.pieData = {
            labels: [ 'A', 'B', 'C' ],
            datasets: [
                {
                    data: [ 300, 50, 100 ],
                    backgroundColor: [
                        '#FFC107',
                        '#03A9F4',
                        '#4CAF50'
                    ],
                    hoverBackgroundColor: [
                        '#FFE082',
                        '#81D4FA',
                        '#A5D6A7'
                    ]
                } ]
        };


    }


    loadAllPrestations() {

        this.prestationService.list()
            .pipe(first())
            .subscribe(
                prestations => {

                    console.log("data returned = ", prestations);

                    this.calculeTauxStt(new Date, prestations);

                    this.prestations = prestations;

                    //this.prestations.filter( x => x.dateDebutPrestation<monthDiff && x.dateFinPrestation>monthDiff).map()

                    prestations.filter((a, b) => a)
                },
                error => {
                    console.log("data returned = ", error);

                    this.alertService.error(error);
                });
    }


    private calculeTauxStt(date: any, prestations: any) {
        let currentMonth = date.getUTCMonth();
        for (let i = 0; i < 6; i++) {
            this.monthList.push(new Date(date.getFullYear(), currentMonth - i, 1));
        }
        const nbreStt = 0;
        console.log("on parcours ", this.monthList);

        this.monthList.forEach(month => {
            console.log("=========================================================================== ");
            console.log("================================== le moi ========================== ", month.getUTCMonth());
            console.log("=========================================================================== ");
            let chartsLines = [];

            const nbreTotal = prestations.forEach((prestation, i) => {

                var temp;
                console.log(chartsLines);

                /*                chartsLines.forEach(line => {
                                    if (line.departement == prestation.departement &&
                                        new Date(prestation.dateDebutPrestation) < month &&
                                        new Date(prestation.dateFinPrestation) > month) {

                                        console.log("*****<<", i, ">>********************************* ON A MET A JOUR CE DEPARTEMENT **********************************************", prestation.departement);

                                        debugger
                                        if (prestation.collaborateur['stt'] == 'Oui') line.tauxStt++;
                                        line.nombreColl++;
                                        temp = chartsLines;
                                    }
                                    else if (line => line.departement != prestation.departement) {
                                        temp = chartsLines;

                                        console.log("*****<<", i, ">>********************************* ON A TROUVE UN NOUVEAU DEPARTEMENT **********************************************", prestation.departement);

                                        debugger
                                        temp.push(new ChartLine(prestation.departement, 1, 1, month));
                                        if (prestation.collaborateur['stt'] == 'Oui') line.tauxStt++;
                                        line.nombreColl++;
                                    }


                                });*/

                chartsLines
                    .filter(line =>
                        line.departement == prestation.departement &&
                        new Date(prestation.dateDebutPrestation) < month &&
                        new Date(prestation.dateFinPrestation) > month)
                    .map(d => {
                        console.log("*****<<", i, ">>********************************* ON A MET A JOUR CE DEPARTEMENT **********************************************", prestation.departement);

                        if (prestation.collaborateur[ 'stt' ] == 'Oui') d.tauxStt++;
                        d.nombreColl++;
                        temp = chartsLines;

                    });
                if (chartsLines.every(line => line.departement != prestation.departement)) {

                    console.log("*****<<", i, ">>********************************* ON A TROUVE UN NOUVEAU DEPARTEMENT **********************************************", prestation.departement);
                    temp = chartsLines;

                    let tauxStt = (prestation.collaborateur[ 'stt' ] == 'Oui') ? 1 : 0;

                    temp.push(new ChartLine(prestation.departement, tauxStt, 1, month));
                }


                if (chartsLines.length == 0) {
                    console.log("******<<", i, ">>******************************** ON A PAS ENCORE TROUVE DE DEPARTEMENT : INIT PREMIER **********************************************", prestation.departement);

                    temp = chartsLines;
                    let tauxStt = (prestation.collaborateur[ 'stt' ] == 'Oui') ? 1 : 0;

                    temp.push(new ChartLine(prestation.departement, tauxStt, 1, month));
                }
                if (temp) chartsLines = temp;
            });
            this.allcharts.push(chartsLines);
        });

        let charts = [];
        let chartList = [];
        let allch = [];
        let i = 0;
        this.allcharts.forEach(x => {


            Object.values(x).forEach(y => {
                charts.push(y)
            })

        });

        console.log("vvvvvvvvvvvvvvvvvvvvvvvvv charts = ", charts);

        charts.forEach(line => {
            if (allch.length == 0) {
                chartList.push(line);
                allch.push(chartList);
            }
            else if (allch.every(x => Object.values(x).every(y => y[ 'departement' ] != line.departement))) {
                console.log("vvvvvvvvvvvvvvvvvvvvvvvvv Line = ", line.departement);

                var temp = [];
                temp.push(line);
                allch.push(temp);
            }
            else allch
                    .forEach((x, k) => {
                        var temp2 = [];

                        Object.values(x).forEach((y, j) => {
                            debugger
                            if (y[ 'departement' ] == line.departement && y[ 'dateRef' ] !== line.dateRef) {
                                console.log("line.departement = ", line);
                                console.log("y ['departement'] = ", y);
                                console.log("j = ", j);
                                //console.log("recap ", x);

                                temp2.push(line);
                                console.log("temp2 recap= ", temp2);

                            }

                        });
                        console.log("temp2 = ", temp2);

                        temp2.forEach(r=> x.push(r))
                    })


        });


        console.log("XXXXXXXXXXXXXXX Toutes les courbes de soutraitance XXXXXXXXXXXXXXXXXXX ", allch);
        console.log("Toutes les courbes de soutraitance", this.allcharts);

        /*   //chartLine.push({"mois": firstDayOfMonth.getMonth(), "taux de Stt": nbreStt / nbreTotal * 100});
           //console.log("Etude pour le mois :", firstDayOfMonth.getMonth());
           console.log("Le nombre de sous traitant =", nbreStt);
           console.log("Le nombre de total de collaborateurs =", nbreTotal);
           console.log("Le taux de soustraitance est =", nbreStt / nbreTotal * 100);*/
        return this.allchartsSub.next(this.allcharts);
    }
}
