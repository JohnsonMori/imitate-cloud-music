import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Store, select, MemoizedSelector } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import { getSongList, getPlayList, getCurrentIndex, getPlayer, getPlayMode, getCurrentSong } from 'src/app/store/selectors/player.selector';
import { Song } from 'src/app/services/data-types/common.typs';
import { PlayState } from 'src/app/store/reducers/player.reducer';
import { PlayMode } from './player-type';

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less']
})
export class WyPlayerComponent implements OnInit {
  sliderValue = 35;
  wyOffset = 70;

  songList: Song[];
  playList: Song[];
  currentIndex: number;
  currentSong: Song;

  duration: number;
  currentTime: number;

  @ViewChild('audio', { static: true }) private audio: ElementRef;
  private audioEl: HTMLAudioElement;

  constructor(
    private store$: Store<AppStoreModule>
  ) {
    type StateItem = {
      type: MemoizedSelector<PlayState, any>,
      cb: (param: Song[] | number | PlayMode | Song) => void
    };
    const appStore$ = this.store$.pipe(select(getPlayer));

    const stateArr: StateItem[] = [{
      type: getSongList,
      cb: (list: Song[]) => this.watchList(list, 'songList')
    }, {
      type: getPlayList,
      cb: (list: Song[]) => this.watchList(list, 'playList')
    }, {
      type: getCurrentIndex,
      cb: (index: number) => this.watchCurrentIndex(index)
    }, {
      type: getPlayMode,
      cb: (mode: PlayMode) => this.watchPlayMode(mode)
    }, {
      type: getCurrentSong,
      cb: (song: Song) => this.watchCurrentSong(song)
    }];

    stateArr.forEach(item => {
      appStore$.pipe(select(item.type)).subscribe(item.cb);
    });
  }

  ngOnInit(): void {
    this.audioEl = this.audio.nativeElement;
  }

  private watchList(list: Song[], type: string) {
    this[type] = list;
  }

  private watchCurrentIndex(index: number) {
    this.currentIndex = index;
  }

  private watchPlayMode(mode: PlayMode) {
    console.log('mode: ', mode);
  }

  private watchCurrentSong(song: Song) {
    if (song) {
      this.currentSong = song;
      this.duration = song.dt / 1000;
      console.log('song: ', song);
    }
  }

  onCanplay() {
    this.play();
  }

  onTimeUpdate(e: Event) {
    this.currentTime = (<HTMLAudioElement>e.target).currentTime;
  }

  private play() {
    this.audioEl.play();
  }

  getPicUrl(): string {
    return this.currentSong? this.currentSong.al.picUrl : '//s4.music.126.net/style/web2/img/default/default_album.jpg';
  }

}
