import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';

import {Observable} from 'rxjs/Observable';

import {SlideData} from '../../data/slide.data';

import {RestResponse} from '../../object/rest-response';
import {Slide} from '../../object/slide';

import {Setting} from '../../setting/setting';

@Component({
  selector: 'slide',
  styleUrls: ['./slide.component.css'],
  templateUrl: './slide.component.html',
})
export class SlideComponent implements OnInit, OnDestroy {
  slides: Slide[];
  currentSlide: Slide;
  moveX = 0;
  currentX = 0;
  width: number;
  domSlideFrame;
  domSlideWrap;
  cssSlideWidth;
  slideMove$$;
  slideClick$$;
  slideAutoInit$$;
  slideAutoContinue$$;
  slideResize$$;
  slideBanClick$$;

  constructor(private router: Router,
              private slideData: SlideData,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.slideData.getSlides('home/slides')
      .subscribe(response => this.handleGetSlides(response),
        err => {
        });
  }

  ngOnDestroy(): void {
    if (this.slideMove$$) {
      this.slideMove$$.unsubscribe();
    }
    if (this.slideClick$$) {
      this.slideClick$$.unsubscribe();
    }
    if (this.slideAutoInit$$) {
      this.slideAutoInit$$.unsubscribe();
    }
    if (this.slideAutoContinue$$) {
      this.slideAutoContinue$$.unsubscribe();
    }
    if (this.slideResize$$) {
      this.slideResize$$.unsubscribe();
    }
    if (this.slideBanClick$$) {
      this.slideBanClick$$.unsubscribe();
    }
  }

  handleGetSlides(response: RestResponse): void {
    switch (response.code) {
      case 2000:
        this.slides = response.data;
        this.domSlideFrame = <HTMLElement>document.querySelector('.m-slide');
        // 确认Slide所属DOM
        this.domSlideWrap = <HTMLElement>document.querySelector('.m-slide-img-ul');
        this.domSlideWrap.style.display = 'block';
        this.width = this.domSlideWrap.parentNode.clientWidth;
        this.currentSlide = this.slides[0];
        // 设置初始宽度
        this.domSlideWrap.style.width = this.width * this.slides.length + 'px';
        this.cssSlideWidth = this.sanitizer.bypassSecurityTrustStyle(this.width + 'px');
        // 设置Slide图    如何获取ngFor生成的dom???
        for (let i = 0; i < this.slides.length; i++) {
          this.slides[i].cssBackgroundImage = this.sanitizer.bypassSecurityTrustStyle('url(' + this.slides[i].slideImgUrl + ')');
        }

        // 监听窗口resize
        this.slideResize$$ = Observable
          .fromEvent(window, 'resize')
          .debounceTime(100)
          .subscribe(e => {
            // set currentX as current slide NO.
            this.currentX = this.currentX / this.width;
            // reset window width
            this.width = this.domSlideWrap.parentNode.clientWidth;
            // remove transition animation
            this.domSlideWrap.style['transition-duration'] = '0';
            // reset width of slides
            this.domSlideWrap.style.width = this.width * this.slides.length + 'px';
            this.cssSlideWidth = this.sanitizer.bypassSecurityTrustStyle(this.width + 'px');
            // set currentX based on new width
            this.currentX = this.currentX * this.width;
            // move slide to new position
            this.domSlideWrap.style.transform = 'translate3d(' + this.currentX + 'px,0,0)';
          });

        // 防止点击slide直接跳转超链接
        this.slideBanClick$$ = Observable
          .fromEvent(this.domSlideWrap, 'click')
          .subscribe((e: any) => e.preventDefault());
        // 如何让类型错误消失???


        // 监听文档的鼠标放开操作
        const docMouseUp$ = Observable.fromEvent(document, 'mouseup');
        // 监听文档的鼠标移动操作
        const docMouseMove$ = Observable.fromEvent(document, 'mousemove');
        // 监听Slide的鼠标按下操作
        const slideMouseDown$ = Observable.fromEvent(this.domSlideWrap, 'mousedown');
        // 监听Slide的鼠标按下移动操作
        const slideMouseDrag$ = slideMouseDown$.flatMap((smd: any) => {
          smd.preventDefault();
          return docMouseMove$.map((mm: any) => {
            return {
              moveX: mm.clientX - smd.clientX
            };
          }).takeUntil(docMouseUp$);
        });
        // 监听Slide的鼠标按下放开操作
        const slideMouseRelease$ = slideMouseDown$.flatMap(smd => {
          return docMouseUp$.take(1);
        });

        this.slideMove$$ = slideMouseDrag$.subscribe(smd => {
          this.domSlideWrap.style['transition-duration'] = '0';
          if ((smd.moveX + this.currentX) < this.width * 0.10
            && (smd.moveX + this.currentX) > -1 * this.width * (this.slides.length - 0.9)) {
            this.domSlideWrap.style.transform = 'translate3d(' + (smd.moveX + this.currentX) + 'px,0,0)';
            this.moveX = smd.moveX;
          }
        });

        this.slideClick$$ = slideMouseRelease$.subscribe(smd => {
          if (Math.abs(this.moveX) >= (this.width * 0.20)) {
            // moveX >= 20% width
            if (this.moveX > 0) {
              // drag from left to right
              this.currentX += this.width;
            } else {
              // drag from right to left
              this.currentX -= this.width;
            }
          }
          this.transformSlide();

          // 移动距离很小则作为点击
          if (Math.abs(this.moveX) < (this.width * 0.03)) {
            const url = this.slides[-1 * this.currentX / this.width].slideClickUrl;
            if (url) {
              if (url.indexOf(Setting.HOST) >= 0) {
                this.router.navigate([url.substr(url.indexOf(Setting.HOST) + Setting.HOST.length)]);
              } else {
                window.open(this.slides[-1 * this.currentX / this.width].slideClickUrl);
              }
            }
          }

          this.moveX = 0;
        });

        // 监听Slide的鼠标经过操作
        const slideMouseOver$ = Observable.fromEvent(this.domSlideFrame, 'mouseover');
        // 监听Slide的鼠标移出操作
        const slideMouseOut$ = Observable.fromEvent(this.domSlideFrame, 'mouseout');
        // Slide循环播放并在鼠标悬停时停止
        const slideLoop$ = Observable
          .interval(3000)
          .takeUntil(slideMouseOver$);

        this.slideAutoInit$$ = slideLoop$.subscribe(e => {
          this.nextSlide();
        });

        this.slideAutoContinue$$ = slideMouseOut$.flatMap(e => {
          return slideLoop$;
        }).subscribe(e => {
          this.nextSlide();
        });
        break;
    }
  }

  chooseSlide(i: number): void {
    this.currentX = -1 * i * this.width;
    this.transformSlide();
  }

  nextSlide(): void {
    if (this.currentX === -1 * (this.slides.length - 1) * this.width) {
      this.currentX = 0;
    } else {
      this.currentX -= this.width;
    }
    this.transformSlide();
  }

  transformSlide(): void {
    this.domSlideWrap.style['transition-duration'] = '0.5s';
    this.domSlideWrap.style.transform = 'translate3d(' + this.currentX + 'px,0,0)';
    this.currentSlide = this.slides[-1 * (this.currentX / this.width)];
  }
}
