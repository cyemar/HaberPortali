import { Component } from '@angular/core';
import { User } from './model/User';
import { FbserviceService } from './service/fbservice.service';
import { Route, Router } from '@angular/router';
import { LoginComponent } from './component/login/login.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'HaberPortali';
  constructor(
    public fbServis: FbserviceService,
    public router: Router
  ) {

  }
}
