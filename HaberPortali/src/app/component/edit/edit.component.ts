import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { FormControl, FormGroup } from '@angular/forms';
import { News } from 'src/app/model/News';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  constructor(public db: AngularFireDatabase) { }
  news: News[] = [];
  frm: FormGroup = new FormGroup({
    newsId: new FormControl(),
    newsTitle: new FormControl(),
    newsContent: new FormControl(),
    newsImg: new FormControl(),
    newsCategory: new FormControl()
  });

  ngOnInit(): void {
    this.getNews()
  }
  newsEdit(news:News, el:HTMLElement){
    this.frm.patchValue(news)
    this.getNews()
  }
  newsAdd(){
    var news: News = this.frm.value;
    this.db.database.ref('news').push(news).then( (data) => {
      var date = new Date()
      var dateTime = date.getDate() + "/" + (date.getMonth() + 1) + "/" + (date.getFullYear());
      var cdate = dateTime
      news.newsCdate = cdate;
      news.newsId = data.key;
      this.db.database.ref('news/' + data.key).set(news);
      
  });
  this.getNews()
  }
  newsRemove(news:News){
    try{
      this.db.database.ref('news').child(news.newsId.toString()).remove();
      this.getNews()
      }catch(e){
        alert("Kullanıcıyı silerken hata ile karşılaştım " + e);
      }
  }
  newsEditAdd(){
    var news: News = this.frm.value
    this.db.database.ref('news').child(news.newsId.toString()).update(news);
    this.getNews()
  }
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
