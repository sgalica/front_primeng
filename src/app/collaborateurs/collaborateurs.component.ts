import { Component, OnInit } from '@angular/core';
import {Car} from '../demo/domain/car';
import {SelectItem} from 'primeng/api';
import {CarService} from '../demo/service/carservice';
import {first} from 'rxjs/operators';
import {CollaborateurService} from '../demo/service/collaborateur.service';
import {User} from '../demo/service/user';
import {Collaborateur} from '../demo/service/collaborateur';

@Component({
  selector: 'app-collaborateurs',
  templateUrl: './collaborateurs.component.html',
  styleUrls: ['./collaborateurs.component.css']
})
export class CollaborateursComponent implements OnInit {

    cars: Car[];

    selectedCar: Car;

    displayDialog: boolean;

    sortOptions: SelectItem[];

    sortKey: string;

    sortField: string;

    sortOrder: number;

    collaborateurs: Collaborateur[] = [];

    constructor(private carService: CarService, private collaborateurService: CollaborateurService) { }

    ngOnInit() {
        this.carService.getCarsLarge().then(cars => this.cars = cars);

        this.sortOptions = [
            {label: 'Newest First', value: '!year'},
            {label: 'Oldest First', value: 'year'},
            {label: 'Brand', value: 'brand'}
        ];


            this.loadAllCollaborateurs();
    }

    selectCar(event: Event, car: Car) {
        this.selectedCar = car;
        this.displayDialog = true;
        event.preventDefault();
    }

    onSortChange(event) {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            this.sortOrder = -1;
            this.sortField = value.substring(1, value.length);
        } else {
            this.sortOrder = 1;
            this.sortField = value;
        }
    }

    onDialogHide() {
        this.selectedCar = null;
    }

    loadAllCollaborateurs() {
        this.collaborateurService.getAll().pipe(first()).subscribe(collaborateurs => {
            this.collaborateurs = collaborateurs;
        });
    }
}
