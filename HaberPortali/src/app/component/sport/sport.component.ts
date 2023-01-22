import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { News } from 'src/app/model/News';

@Component({
  selector: 'app-sport',
  templateUrl: './sport.component.html',
  styleUrls: ['./sport.component.scss']
})
export class SportComponent implements OnInit {

  constructor(public db: AngularFireDatabase) { }

  ngOnInit(): void {
    this.getSportNews()
  }
  news: News[] = [];
  getSportNews(){
    this.db.database.ref('news').once('value').then(snapshot => {
      const allNews = snapshot.val();
      Object.keys(allNews).forEach(key => {
        if (allNews[key].newsCategory === 'Spor') {
          this.news.push(allNews[key]);
        }
      });
    });
  }
}
