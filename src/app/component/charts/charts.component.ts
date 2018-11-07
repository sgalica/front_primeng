import {Component, OnInit} from '@angular/core';
import {first} from "rxjs/operators";
import {PrestationService} from "../../service/datas.service";
import {Router} from "@angular/router";
import {AlertService} from "../../service/alert.service";
import {Prestation} from "../../model/referenciel";

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {

    lineData: any;

    barData: any;

    pieData: any;

    polarData: any;

    radarData: any;
    private prestations: Prestation[];

    constructor(private prestationService: PrestationService,
                private router: Router,
                private alertService: AlertService) {
    }


    ngOnInit() {

        this.loadAllPrestations();

        this.lineData = {
            labels: [ 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [ 59, 80, 81, 56, 55, 40],
                    fill: false,
                    borderColor: '#03A9F4'
                },
                {
                    label: 'Second Dataset',
                    data: [ 48, 40, 19, 86, 27, 90],
                    fill: false,
                    borderColor: '#FFC107'
                }
            ]
        };

        this.barData = {
            labels: [ 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'My First dataset',
                    backgroundColor: '#03A9F4',
                    borderColor: '#03A9F4',
                    data: [ 59, 80, 81, 56, 55, 40]
                },
                {
                    label: 'My Second dataset',
                    backgroundColor: '#FFC107',
                    borderColor: '#FFC107',
                    data: [ 48, 40, 19, 86, 27, 90]
                }
            ]
        };

        this.pieData = {
            labels: ['A', 'B', 'C'],
            datasets: [
                {
                    data: [300, 50, 100],
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
                }]
        };

        this.polarData = {
            datasets: [{
                data: [
                    11,
                    16,
                    7,
                    3,
                    14
                ],
                backgroundColor: [
                    '#FFC107',
                    '#03A9F4',
                    '#4CAF50',
                    '#E91E63',
                    '#9C27B0'
                ],
                label: 'My dataset'
            }],
            labels: [
                'Red',
                'Green',
                'Yellow',
                'Grey',
                'Blue'
            ]
        };

        this.radarData = {
            labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
            datasets: [
                {
                    label: 'My First dataset',
                    backgroundColor: 'rgba(179,181,198,0.2)',
                    borderColor: 'rgba(179,181,198,1)',
                    pointBackgroundColor: 'rgba(179,181,198,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(179,181,198,1)',
                    data: [65, 59, 90, 81, 56, 55, 40]
                },
                {
                    label: 'My Second dataset',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    pointBackgroundColor: 'rgba(255,99,132,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(255,99,132,1)',
                    data: [28, 48, 40, 19, 96, 27, 100]
                }
            ]
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

                    prestations.filter((a,b)=> a)
                },
                error => {
                    console.log("data returned = ", error);

                    this.alertService.error(error);
                });
    }


    private calculeTauxStt(date:any,prestations : any) {
        let currentMonth= date.getUTCMonth();
        var firstDayOfMonth = new Date(date.getFullYear(),date.getUTCMonth(),1);

        var nbreStt = 0;
        var nbreTotal = prestations.filter( x => x.dateDebutPrestation<firstDayOfMonth && x.dateFinPrestation>firstDayOfMonth).reduce((accumulator, currentValue) => {
            accumulator++;
            if (currentValue.collaborateurs['Stt'] =='Oui'){nbreStt++}
            return accumulator


        }, 0);

        console.log("Etude pour le mois :", firstDayOfMonth);
        console.log("Le nombre de sous traitant =", nbreStt);
        console.log("Le nombre de total de collaborateurs =", nbreTotal);
        console.log("Le taux de soustraitance est =", nbreStt/nbreTotal);
    }
}
