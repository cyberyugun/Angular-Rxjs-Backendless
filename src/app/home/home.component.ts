import { Component, OnInit } from '@angular/core';
import { AuthenticationService, UserService } from '../service';
import { first } from 'rxjs/operators';
import { User, Content, Detail } from '../model';
import { ContentService } from '../service/content.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  loading = false;
  currentUser: User;
  userFromApi: User;
  contents: Content[] = [];
  detail: Detail[] = [];
  test:any;
  cdetail=false;
  a;
  b;
  c;
  d;
  math;

  constructor(
    private contentService: ContentService,
    private authenticationService: AuthenticationService,
    private userService:UserService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
    this.math = Math;
  }

  ngOnInit() {
    this.loading = true;
    this.contentService.getAllContent().pipe(first()).subscribe(contents => {
      this.loading = false;
      this.contents = contents;
    });
  }

  Detail(id){
    this.contentService.getDetail(id).pipe(first()).subscribe(detail => {
      this.loading = false;
      this.detail = detail;
      this.cdetail=true;
      this.a = this.detail.every(a=> (a.timer / 60) < 10);
      this.b = this.detail.every(a => (a.timer % 60) < 10);
      (this.a)?this.c='0':this.c='';
      (this.b) ? this.d = '0' : this.d = '';
    });
  }

  allContent(){
    this.contentService.getAllContent().pipe(first()).subscribe(contents => {
      this.loading = false;
      this.contents = contents;
      this.cdetail = false;
    });
  }

  ContentBeginner(){
    this.contentService.getContentBeginner().pipe(first()).subscribe(contents => {
      this.loading = false;
      this.contents = contents;
      this.cdetail = false;
    });
  }

  ContentIntermediet(){
    this.contentService.getContentIntermediet().pipe(first()).subscribe(contents => {
      this.loading = false;
      this.contents = contents;
      this.cdetail = false;
    });
  }

  ContentAdvance() {
    this.contentService.getContentAdvance().pipe(first()).subscribe(contents => {
      this.loading = false;
      this.contents = contents;
      this.cdetail = false;
    });
  }
}
