import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-slide-show',
  templateUrl: './slide-show.component.html',
  styleUrls: ['./slide-show.component.css']
})
export class SlideShowComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  }

  banner = [
    '../../../assets/banners/banner1.jpg',
    '../../../assets/banners/banner3.jpg',
    '../../../assets/banners/banner2.jpg',
  ]

  number = 0;
  showNum = this.banner[0];

  change(event){
    console.log(this.selectPair(event.target.value););
  }

}
