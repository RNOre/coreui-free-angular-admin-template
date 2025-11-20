import {Component, effect, OnInit} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {FormControlDirective} from "@coreui/angular";
import {HttpClient} from "@angular/common/http";
import {env} from "../../../../env";
import {ToastService} from "../../core/services/toast.service";
import {UserData} from "../../interfaces/global";
import {UserService} from "../../core/services/user.service";
import {isAdmin} from "../../core/global";
import {JsonPipe, NgTemplateOutlet} from "@angular/common";

@Component({
  selector: 'app-settings',
  imports: [
    FormControlDirective,
    ReactiveFormsModule,
    NgTemplateOutlet,
    JsonPipe
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {

  email = new FormControl('', [Validators.email, Validators.required, Validators.minLength(3)]);
  name = new FormControl('', [Validators.required, Validators.minLength(3)]);
  username = new FormControl('', [Validators.required, Validators.minLength(3)]);

  password = new FormControl('', [Validators.required, Validators.minLength(3)]);
  password_confirmation = new FormControl('', [Validators.required, Validators.minLength(3), this.passwordMatchValidator.bind(this)]);

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
          if (isAdmin()) {
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

    this.email.setValue(this.storageData?.email || '');
    this.name.setValue(this.storageData?.name || '');
    this.username.setValue(this.storageData?.username || '');
  }

  getErrorMessage(errors: {[key: string]: any | null}) {
    if(!errors)
      return '';
    if (errors['required']) {
      return 'Обязательно для заполнения';
    } else if (errors['email']) {
      return 'Некорректный email адрес';
    } else if (errors['minlength']) {
      return `Минимальная длина: ${errors['minlength'].requiredLength} символов`;
    } else if (errors['passwordMismatch']) {
      return 'Пароли не совпадают'
    }
    return '';
  }

  passwordMatchValidator(): {[key: string]: any} | null {
    const password = this.password?.value;
    const confirmPassword = this.password_confirmation?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { 'passwordMismatch': true };
    }
    return null;
  }
}
