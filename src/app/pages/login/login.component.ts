import { GeneralService } from './../../services/general.service';
import { AuthGuard } from './../../services/auth/auth.guard';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
const { Storage } = Plugins;


const TOKEN_KEY = 'myNollyApp-Admin-Token';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  error = '';
  loading = false
  checked = true

  constructor(private router: Router, private auth: AuthGuard, private formBuilder: FormBuilder, private general: GeneralService) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      checked: [false]
    });
  }

  ngOnInit(): void {
    Storage.get({ key: TOKEN_KEY }).then((res: any) => {
      if(res.value){
        res = JSON.parse(res.value);
        this.loginForm.setValue({
          email: res.email,
          password: res.password,
          checked: true
        })
      }
    })
  }

  async authenticate (): Promise<void> {
    this.loading = true;
    this.setError('')
    const { email, password, checked } = this.loginForm.value;
    if(email && password) {
      try{
        await this.general.login(email, password).then(() => {
          setTimeout(() => {
            this.general.getUserProfile().then((data) => {
              if (data.isAdmin) {              
                if(checked){
                  const obj = {
                    email,
                    password
                  };
                  Storage.set({key: TOKEN_KEY, value: JSON.stringify(obj)});
                }
                this.auth.authenticated = true;
                this.router.navigateByUrl('dashboard')
              } else {              
                this.auth.authenticated = false;
                this.setError('Invalid Email or Password')
              }
            })
          }, 500);
        })
      }
      catch (err: any) {
        this.auth.authenticated = false;
        this.setError('An Error Occurred, please try again')
      }
      finally{    
        this.loading = false;
      }
    } else {
      this.setError('Email and password is required')
      this.loading = false;
    }
  }

  setError(value: string) {
    this.error = value;
  }
}
