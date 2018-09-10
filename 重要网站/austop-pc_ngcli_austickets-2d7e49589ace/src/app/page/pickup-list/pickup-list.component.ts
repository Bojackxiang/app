import {Component, OnInit} from '@angular/core';

import {PickupData} from '../../data/pickup.data';
import {NoticeService} from '../../service/notice.service';

import {RestResponse} from '../../object/rest-response';
import {Lang} from '../../setting/lang';

@Component({
  selector: 'app-pickup-list',
  templateUrl: './pickup-list.component.html',
  styleUrls: ['./pickup-list.component.css']
})

export class PickupListComponent implements OnInit {
  pickups: Object;
  pickupState = 'NSW';
  pickupStates = [];

  constructor(private pickupData: PickupData,
              private noticeService: NoticeService) {
  }

  ngOnInit() {
    this.pickupData.listPickups()
      .subscribe(
        response => this.handleListPickupResponse(response),
        err => this.noticeService.setNotice(Lang.CN.SystemError, [{
            id: 'notice-refresh'
          }]
        ));
  }

  private handleListPickupResponse(response: RestResponse): void {
    if (response.code === 2000) {
      const data = response.data;
      this.pickups = {};
      data.forEach(pickup => {
        if (!this.pickups[pickup.pointState]) {
          this.pickups[pickup.pointState] = [];
        }
        this.pickups[pickup.pointState].push(pickup);
      });
      this.pickupStates = Object.keys(this.pickups);
    } else {
      console.error(response);
      this.noticeService.setNotice(Lang.CN.SystemError, [{id: 'notice-refresh'}]);
    }
  }
}
