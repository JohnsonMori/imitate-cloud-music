import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import { Banner } from 'src/app/services/data-types/common.typs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  banners: Banner[]

  constructor(private homeserve: HomeService) {
    this.homeserve.getBanners().subscribe(banners => {
      this.banners = banners
    })
   }

  ngOnInit(): void {
  }

}
