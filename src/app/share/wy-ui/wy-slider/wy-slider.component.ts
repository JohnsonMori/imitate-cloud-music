import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ElementRef, ViewChild, Input, Inject } from '@angular/core';
import { fromEvent, merge, Observable } from 'rxjs';
import { tap, pluck, map, distinctUntilChanged, takeUntil, filter } from 'rxjs/internal/operators';
import { SliderEventObserverConfig } from './wy-slider-typs';
import { DOCUMENT } from '@angular/common';
import { sliderEvent } from './wy-slider-helper';

@Component({
  selector: 'app-wy-slider',
  templateUrl: './wy-slider.component.html',
  styleUrls: ['./wy-slider.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WySliderComponent implements OnInit {
  @Input() wyVertical = false;

  private sliderDom: HTMLDivElement;

  @ViewChild('wySlider', { static: true }) private wySlider: ElementRef;

  private dragStart$: Observable<number>;
  private dragMove$: Observable<number>;
  private dragEnd$: Observable<Event>;

  constructor(@Inject(DOCUMENT) private doc: Document) { }

  ngOnInit(): void {
    this.sliderDom = this.wySlider.nativeElement
    this.createDraggingObservables();
  }

  private createDraggingObservables() {
    const orientField = this.wyVertical ? 'pageY' : 'pageX';
    const mouse: SliderEventObserverConfig = {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup',
      filter: (e: MouseEvent) => e instanceof MouseEvent,
      pluckKey: [orientField]
    };

    const touch: SliderEventObserverConfig = {
      start: 'touchstart',
      move: 'touchmove',
      end: 'touchend',
      filter: (e: TouchEvent) => e instanceof TouchEvent,
      pluckKey: ['touches', '0', orientField]
    };

    [mouse, touch].forEach(source => {
      const { start, move, end, filter: filterFunc, pluckKey } = source

      source.startPlucked$ = fromEvent(this.sliderDom, start).pipe(
        filter(filterFunc),
        tap(sliderEvent),
        pluck(...pluckKey),
        map((positon: number) => this.findClosestValue(positon))
      );

      source.end$ = fromEvent(this.doc, end);
      source.moveResolved$ = fromEvent(this.sliderDom, move).pipe(
        filter(filterFunc),
        tap(sliderEvent),
        pluck(...pluckKey),
        distinctUntilChanged(),
        map((positon: number) => this.findClosestValue(positon)),
        takeUntil(source.end$)
      );
    });

    this.dragStart$ = merge(mouse.startPlucked$, touch.startPlucked$);
    this.dragMove$ = merge(mouse.moveResolved$, touch.moveResolved$);
    this.dragEnd$ = merge(mouse.end$, touch.end$);
  }

}
