import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments';
import { Content, Detail } from '../model';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  constructor(private http: HttpClient) { }

  getAllContent() {
    return this.http.get<Content[]>(`${environment.apiUrl}/content`);
  }

  getDetail(id: number){
    return this.http.get<Detail[]>(`${environment.apiUrl}/detail/${id}`);
  }

  getAllContentbyId(id: number) {
    return this.http.get<Content[]>(`${environment.apiUrl}/content/${id}`);
  }

  getContentBeginner() {
    return this.http.get<Content[]>(`${environment.apiUrl}/content-beginner`);
  }

  getContentIntermediet() {
    return this.http.get<Content[]>(`${environment.apiUrl}/content-intermediet`);
  }

  getContentAdvance() {
    return this.http.get<Content[]>(`${environment.apiUrl}/content-advance`);
  }

  getContentByIdinstructor(id: number) {
    return this.http.get<Content>(`${environment.apiUrl}/content/${id}`);
  }
}
