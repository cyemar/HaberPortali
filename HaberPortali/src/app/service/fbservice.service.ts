import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { User } from '../model/User';
import { Auth, authState, signInWithEmailAndPassword } from '@angular/fire/auth';
import { from, Observable, of, switchMap } from 'rxjs';
import { docData } from '@angular/fire/firestore';
import { doc, Firestore } from 'firebase/firestore';


@Injectable({
  providedIn: 'root'
})
export class FbserviceService {
  constructor(public db: AngularFireDatabase) { }
  loggedIn(activeUser: boolean) {
    localStorage.setItem("activeUser", "true")
  }
  returnPerm() {
    var auc = localStorage.getItem("activeUser");
    var auc2: boolean
    if (auc == "true")
      auc2 = true
    else
      auc2 = false
    return auc2
  }

  logOut() {
    localStorage.setItem("activeUser", "false")
    localStorage.setItem("isAdmin", "false");
    localStorage.setItem("authid", "");
  }
  isAdmin() {
    var isAdminVar = localStorage.getItem("isAdmin");
    var isAdminBool: boolean
    if (isAdminVar == "true")
      isAdminBool = true
    else
      isAdminBool = false
    return isAdminBool
  }
  CheckAdmin(uidCompare: number) {
    var adminFound = false;
    this.db.database.ref('users/').once('value').then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const key = childSnapshot.key;
        const val = childSnapshot.val();
        var compare = { key, ...val };
        if (uidCompare == compare.uid && compare.admin == 1) {
          localStorage.setItem("isAdmin", "true");
          adminFound = true;
        }
      });
    });
    if (!adminFound) {
      localStorage.setItem("isAdmin", "false");
    }
  }
}
