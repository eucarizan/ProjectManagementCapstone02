import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  paginatedResult: PaginatedResult<Member[]> = new PaginatedResult<Member[]>();
  // public totalCount: any;
  user: User;

  constructor(private http: HttpClient) {
    
   }

  getMembers(username: string, page?: number, itemsPerPage?: number) {
    let params = new HttpParams();

    if (page !== null && itemsPerPage !== null) {
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString());
    }

    params = params.append('currentUserName', username);

    // if (this.members.length > 0) return of(this.members);
    return this.http.get<Member[]>(this.baseUrl + 'users', {observe: 'response', params}).pipe(
      map(response => {
        this.paginatedResult.result = response.body;
        if (response.headers.get('Pagination') !== null) {
          this.paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        // console.log(this.members);
        return this.paginatedResult;
      })

      
      // map(members => {
      //   this.members = members;
      //   return members;
      // })
    );
  }

  getMember(username: string) {
    const member = this.members.find(x => x.username === username);
    if (member !== undefined) return of(member);
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(username: string, user: User) {
    return this.http.put(this.baseUrl + 'users/update/' + username, user);
  }

  addMember(user: User) {
    return this.http.post(this.baseUrl + 'users/add', user);
  }

  deleteUser(username: string) {
    return this.http.delete(this.baseUrl + 'users/delete/' + username);
  }

  getMemberList() {
    return this.http.get<Member[]>(this.baseUrl + 'users/list');
  }
}
