import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AlertService} from '../../service/alert.service';
import {AuthService} from '../../service/auth.service';
import {ApiResponse} from "../../model/apiresponse";

@Component({templateUrl: 'login.component.html'})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    dialogVisible: boolean;
    private apiresponse: ApiResponse;


    constructor(private formBuilder: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthService,
                private alertService: AlertService) {

    }

    ngOnInit() {
        // this.dialogVisible = true;
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
    get f() {
        return this.loginForm.controls;
    }

    onSubmit() {
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
                    console.log("data returned = ", data);

                    this.alertService.success(data.message);
                    this.router.navigate([this.returnUrl]);
                    this.dialogVisible = false ;
                    this.loading = false;

                },
                error => {
                    console.log("data returned = ", error);

                    this.alertService.error(error);
                    this.loading = false;
                });

    }
}
