import { Component, OnInit } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Database, ref, set, update } from '@angular/fire/database';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { onValue } from 'firebase/database';
import { collection, where } from 'firebase/firestore';
import { FbserviceService } from './../../service/fbservice.service';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/User';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  public activeUser: boolean;
  constructor(public router: Router, public fbServis: FbserviceService, public auth: Auth, private database: Database, private firebase: AngularFirestore, private firebaseAuth: AngularFireAuth) {

  }

  ngOnInit(): void {
  }
  authC: string;

  logIn(mail: string, password: string) {
    signInWithEmailAndPassword(this.auth, mail, password)
      .then((userCredential) => {
        const user = userCredential.user;
        var jsn = JSON.parse(JSON.stringify(user))
        console.log(JSON.stringify(user))
        this.fbServis.loggedIn(this.activeUser)
        this.fbServis.CheckAdmin(jsn.uid)
        localStorage.setItem("authid", jsn.uid)
        this.router.navigate([''])

      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        alert(errorMessage)
      })
  }



}

