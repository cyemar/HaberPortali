import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { News } from 'src/app/model/News';

@Component({
  selector: 'app-siyaset',
  templateUrl: './siyaset.component.html',
  styleUrls: ['./siyaset.component.scss']
})
export class SiyasetComponent implements OnInit {

  constructor(public db: AngularFireDatabase) { }

  ngOnInit(): void {
    this.getSportNews()
  }
  news: News[] = [];
  getSportNews(){
    this.db.database.ref('news').once('value').then(snapshot => {
      const allNews = snapshot.val();
      Object.keys(allNews).forEach(key => {
        if (allNews[key].newsCategory === 'Siyaset') {
          this.news.push(allNews[key]);
        }
      });
    });
  }
}
