import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from '../service/content.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
id;
  detail: any = {};
  hour;
  second;
  math;
  minutes;
  constructor(private activatedRoute: ActivatedRoute,
    private contentService: ContentService,
    private router:Router) { 
    if (activatedRoute.snapshot.url[1]) {
      this.id = activatedRoute.snapshot.url[1]["path"];
      this.math = Math;
    }
  }

  ngOnInit() {
    this.contentService.getContentDetail(this.id).pipe(first()).subscribe(detail => {
      // this.loading = false;
      this.detail = detail[0];
      console.log(this.detail);
      this.hour = this.detail["timer"] * 60;
      this.second = 60;
      window.setInterval(() => {
        this.hour -= 1;
        // this.minutes -= 1;
        this.second -= 1
        if (this.hour <= 0) {
          this.router.navigate(["/"]);
        }
        if (this.second < 0) {
          this.second = 59;
        }
      }, 1000);
    });
  }

}
