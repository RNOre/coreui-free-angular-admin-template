import {Component, effect, OnInit} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {FormControlDirective} from "@coreui/angular";
import {HttpClient} from "@angular/common/http";
import {env} from "../../../../env";
import {ToastService} from "../../core/services/toast.service";
import {UserData} from "../../interfaces/global";
import {UserService} from "../../core/services/user.service";
import {isAdmin} from "../../core/global";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-settings',
  imports: [
    FormControlDirective,
    ReactiveFormsModule,
    JsonPipe
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {

  email = new FormControl('', [Validators.email]);
  name = new FormControl('');
  username = new FormControl('');

  password = new FormControl('');
  password_confirmation = new FormControl('');

  storageData!: UserData;

  user = this.userService.user;

  constructor(private $http: HttpClient,
              private $toast: ToastService,
              private userService: UserService,
  ) {
    effect(() => {
      this.setData()
    });
  }

  ngOnInit(): void {
    this.email.disable();
    this.name.disable();
    this.username.disable();
    this.password.disable();

  }

  updateData(type: string) {
    let body = {};
    switch (type) {
      case 'email':
        body = {email: this.email.value};
        break;
      case 'name':
        body = {name: this.name.value};
        break;
      case 'username':
        body = {username: this.username.value};
        break;
      case 'password':
        body = {password: this.password.value};
        break;
    }

    this.$http.patch<{ data: UserData }>(isAdmin() ? 'me' : env.host + 'user/me', body)
      .subscribe({
        next: (res) => {
          this.userService.updateUser(res.data);
          this.$toast.setToast({
            show: true,
            title: 'Успешно',
            text: 'Данные сохранены'
          })
        },
        error: () => {
          this.$toast.setToast({
            show: true,
            title: 'Ошибка',
            text: 'Не удалось сохранить данные'
          })

          this.setData();
        }
      })
  }


  uploadAvatar(file: any) {
    const image: File = file?.target.files[0];

    if (image) {
      const formData = new FormData();
      formData.append('file', image);
      formData.append('user_id', this.user()?.id!);
      formData.append('type', 'avatar');

      this.$http
        .post<{ data: UserData }>(isAdmin() ? 'photo' : env.host + 'user/photo', formData)
        .subscribe((res) => {
          let userData = res.data;
          if(isAdmin()){
            userData = {...userData, photo_link: userData.photo_id || ''}
          }
          this.userService.updateUser(userData);
          this.$toast.setToast({
            show: true,
            title: 'Успешно',
            text: 'Фото обновлено'
          })
        });
    }
  }

  setData() {
    if (this.user() !== null) this.storageData = this.user()!;

    this.email.setValue(this.storageData.email || '');
    this.name.setValue(this.storageData.name || '');
    this.username.setValue(this.storageData.username || '');
  }
}
