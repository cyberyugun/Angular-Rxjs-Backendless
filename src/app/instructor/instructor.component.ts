import { Component, OnInit } from '@angular/core';
import { UserService, AuthenticationService } from '../service';
import { User, Content, Detail } from '../model';
import { first } from 'rxjs/operators';
import { ContentService } from '../service/content.service';

@Component({
  selector: 'app-instructor',
  templateUrl: './instructor.component.html',
  styleUrls: ['./instructor.component.css']
})
export class InstructorComponent implements OnInit {

  loading = false;
  contents: Content[] = [];
  currentUser: User;
  userFromApi: User;
  detail: Detail[] = [];
  test: any;
  cdetail = false;
  a;
  b;
  c;
  d;
  math;
  constructor(private authenticationService: AuthenticationService,
    private contentService: ContentService) {
    this.currentUser = this.authenticationService.currentUserValue;
    this.math = Math;
   }

  ngOnInit() {
    this.loading = true;
    // this.contentService.getById(this.currentUser.id).pipe(first()).subscribe(user => {
    //   this.loading = false;
    //   this.userFromApi = user;
    // });
    this.contentService.getAllContentbyId(this.currentUser.id).pipe(first()).subscribe(contents => {
      this.loading = false;
      this.contents = contents;
    });
  }

  Detail(id) {
    this.contentService.getDetail(id).pipe(first()).subscribe(detail => {
      this.loading = false;
      this.detail = detail;
      this.cdetail = true;
      this.a = this.detail.every(a => (a.timer / 60) < 10);
      this.b = this.detail.every(a => (a.timer % 60) < 10);
      (this.a) ? this.c = '0' : this.c = '';
      (this.b) ? this.d = '0' : this.d = '';
    });
  }

}
