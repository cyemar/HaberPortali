import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { FormControl, FormGroup } from '@angular/forms';
import { collection } from 'firebase/firestore';
import { User } from 'src/app/model/User';
import { map } from 'rxjs'
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AdminmessageComponent } from '../adminmessage/adminmessage.component';
import { Message } from 'src/app/model/Message';
import { ConversationService } from 'src/app/service/conversation.service';

@Component({
  selector: 'app-uye',
  templateUrl: './uye.component.html',
  styleUrls: ['./uye.component.scss']
})
export class UyeComponent implements OnInit {
  bulkMessage: string;
  users: User[] = [];
  selUser!: User;
  bulkMsg: FormGroup = new FormGroup({
    bulkM: new FormControl()
  })
  frm: FormGroup = new FormGroup({
    uid: new FormControl(),
    username: new FormControl(),
    mail: new FormControl(),
    password: new FormControl(),
    admin: new FormControl()
  });

  constructor(public db: AngularFireDatabase, private router: Router, public cs: ConversationService) { }

  ngOnInit(): void {
    this.getData()
  }

  getData() {
    this.users = [];
    this.db.database.ref('users/').once('value').then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const key = childSnapshot.key;
        const val = childSnapshot.val();
        this.users.push({ key, ...val });
      });
    });
  }

  userEdit(user: User, el: HTMLElement) {
    this.frm.patchValue(user)
  }
  userEditAdd() {
    var user: User = this.frm.value
    this.db.database.ref('users').child(user.uid.toString()).update(user);
  }
  userRemove(user: User) {
    try {
      this.db.database.ref('users').child(user.uid.toString()).remove();
      this.getData()
    } catch (e) {
      alert("Kullanıcıyı silerken hata ile karşılaştım " + e);
    }
  }
  userAdd() {
    var user: User = this.frm.value;
    this.db.database.ref('users').push(user).then((data) => {
      var date = new Date()
      var dateTime = date.getDate() + "/" + (date.getMonth() + 1) + "/" + (date.getFullYear());
      var cdate = dateTime
      user.cdate = cdate;
      user.uid = data.key;
      this.db.database.ref('users/' + data.key).set(user);
    });
    this.getData()
  }
  userRedirect(user: string) {
    //this.amsg.getDmById(user)
    localStorage.setItem("targetId", user)
    this.router.navigate(['/adminmessage'])
  }
  returnUID() {
    var i = localStorage.getItem("authid");
    return i;
  }
  sendBulk() {
    var bulkMessage = this.bulkMsg.getRawValue().bulkM;

    console.log(bulkMessage)
    var userId = "Admin";
    var createdMessage = new Message;
    createdMessage.content = bulkMessage;
    createdMessage.senderId = userId;
    createdMessage.receiverId = "EVERYONE";
    var date = new Date()
    createdMessage.sorttimestamp = date.getTime();
    var dateTime = date.getHours() + "." + date.getMinutes() + "\n, " + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    createdMessage.timestamp = dateTime;
    this.addMessage(createdMessage)
  }
  addMessage(messageInstance: Message) {
    var uid = "Admin";
    this.cs.addMessage(uid, messageInstance);
  }
}
