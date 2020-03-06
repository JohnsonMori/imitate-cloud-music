import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  constructor(private homeserve: HomeService) {
    this.homeserve.getBanners().subscribe(banners => {
      console.log('banners :', banners)
    })
   }

  ngOnInit(): void {
  }

}
