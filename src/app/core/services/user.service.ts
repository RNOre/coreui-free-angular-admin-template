import {Injectable, signal} from '@angular/core';
import {UserData} from "../../interfaces/global";
import {HttpClient} from "@angular/common/http";
import {isAdmin} from "../global";
import {env} from "../../../../env";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user = signal<UserData | null>(null)

  constructor(private $http: HttpClient) {
  }

  getUserData() {
    this.$http.get<{ data: UserData }>(isAdmin() ? 'user/me' : (env.host + 'user/me'))
      .subscribe((res) => this.user.set(res.data))
  }

  updateUser(user: UserData) {
    this.user.set(user);
  }
}
