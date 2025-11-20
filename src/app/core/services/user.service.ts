import {Injectable, signal} from '@angular/core';
import {UserData} from "../../interfaces/global";
import {HttpClient} from "@angular/common/http";
import {isAdmin} from "../global";
import {env} from "../../../../env";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user = signal<UserData | null>(null)

  constructor(private $http: HttpClient) {
  }

  getUserData() {
    this.$http.get<{ data: UserData }>(isAdmin() ? 'me' : (env.host + 'user/me'))
      .pipe(
        map(res => {
          if (isAdmin()) {
            return {...res.data, photo_link: res.data.photo_id || ''}
          }
          return res.data;
        }),
      )
      .subscribe((res) => {
        this.user.set(res)
      })
  }

  updateUser(user: UserData) {
    if (isAdmin()) {
      this.user.set({...user, photo_link: user.photo_id || ''})
    } else
      this.user.set(user);
  }
}
