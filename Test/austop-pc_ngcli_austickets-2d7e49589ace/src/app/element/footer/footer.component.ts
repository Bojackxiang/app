import {Component} from '@angular/core';

import {CommonService} from '../../service/common.service';
import {Setting} from '../../setting/setting';


@Component({
  selector: 'footer-section',
  styleUrls: ['./footer.component.css'],
  templateUrl: './footer.component.html',
})

export class FooterComponent {
  version = Setting.VERSION;

  constructor(public commonService: CommonService) {
  }
}
