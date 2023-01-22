import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/User';
import { Database } from '@angular/fire/database';
import { ref, set, get, getDatabase, onValue } from 'firebase/database';
import { createUserWithEmailAndPassword, Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit {
  user: User;
  
  constructor(private database: Database, private auth: Auth) {}
  ngOnInit() {
  }

  registerUser(username:string, mail:string, password:string){
    createUserWithEmailAndPassword(this.auth, mail, password)
      .then((userCredential)=>{
        const user = userCredential.user;
        var date = new Date()
        var dateTime = date.getDate() + "/" + (date.getMonth() + 1) + "/" + (date.getFullYear());
        var cdate = dateTime
        set(ref(this.database, 'users/' + user.uid), {
          uid : user.uid,
          username: username,
          admin: 0,
          mail: mail,
          password: password,
          cdate
        });
        alert("kayıt oluşturuldu" + cdate)
      })
      .catch((error)=>{
        const errorCode = error.code
        const errorMessage = error.message
        alert(errorMessage)
      });
    }

      
  }
 // getUser(){
  //  var user = "emre"
  //  const starCountRef = ref(this.database, 'users/' + user);
   // onValue(starCountRef, (snapshot)=>{
   //   const data = snapshot.val();
     // alert(data.mail)
  //  })
 // }
//}
