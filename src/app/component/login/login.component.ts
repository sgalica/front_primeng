import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService } from '../../service/alert.service';
import {  AuthenticationService } from '../../service/authentication.service';
import {AuthService} from "../../service/auth.service";

@Component({templateUrl: 'login.component.html'})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    dialogVisible: boolean;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthService,
        private alertService: AlertService) { console.log('[login.component.ts]'); }

    ngOnInit() {
        console.log('LoginComponent init');

        this.dialogVisible = true;
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
        this.returnUrl = '/accueil';

        // reset login status
        this.authenticationService.logout();

        // get return url from route parameters or default to '/'
        // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        console.log('LoginComponent onSubmit() ');


        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    console.log(data, 'données retournées');

                    this.router.navigate([this.returnUrl]);
                    console.log( 'appel de la route /Accueil');
                    console.log('Login successful');

                },
                error => {
                    console.log('Login error');

                    this.alertService.error(error);
                    this.loading = false;
                });

    }
}