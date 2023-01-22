import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { News } from 'src/app/model/News';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  
  constructor(public db: AngularFireDatabase) { }


  ngOnInit(): void {
    this.getNews();
  }
  

  news: News[] = [];
  getNews(){
    this.news = [];
    this.db.database.ref('news/').once('value').then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const key = childSnapshot.key;
        const val = childSnapshot.val();
        this.news.push({key, ...val});
      });
    });
  }
}
