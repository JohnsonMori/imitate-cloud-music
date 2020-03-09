import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HomeService } from 'src/app/services/home.service';
import { SingerService } from 'src/app/services/singer.service';
import { Banner, HotTag, SongSheet, Singer } from 'src/app/services/data-types/common.typs';
import { Observable, forkJoin } from 'rxjs';
import { first } from 'rxjs/internal/operators';

type HomeDataType = [Banner[], HotTag[], SongSheet[], Singer[]]

@Injectable()
export class HomeResolverService implements Resolve<HomeDataType> {
  constructor(private homeServe: HomeService, private singerServe: SingerService) {}

    resolve(): Observable<HomeDataType> {
        return forkJoin([
            this.homeServe.getBanners(),
            this.homeServe.getHotTags(),
            this.homeServe.getPersonalSheetList(),
            this.singerServe.getEnterSingers()
        ]).pipe(first())
  }
}