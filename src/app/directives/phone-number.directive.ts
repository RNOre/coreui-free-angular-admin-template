import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appPhoneNumber]'
})
export class PhoneNumberDirective {

  constructor(private el: ElementRef) { }
  @HostListener('input', ['$event']) onInput(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Удаляем все нецифры

    // Форматируем номер: +7 (XXX) XXX-XX-XX
    if (value.length > 0) {
      let formattedValue = '+7 ';

      if (value.length > 1) {
        const rest = value.substring(1); // Убираем первую 7 (т.к. уже добавили +7)

        if (rest.length > 0) {
          formattedValue += '(' + rest.substring(0, 3);
        }
        if (rest.length > 3) {
          formattedValue += ') ' + rest.substring(3, 6);
        }
        if (rest.length > 6) {
          formattedValue += '-' + rest.substring(6, 8);
        }
        if (rest.length > 8) {
          formattedValue += '-' + rest.substring(8, 10);
        }
      }

      input.value = formattedValue;
    }
  }

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    // Разрешаем Backspace, Tab, стрелки и цифры
    if (
      ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(event.key) ||
      (event.key >= '0' && event.key <= '9')
    ) {
      return; // Разрешаем
    }
    event.preventDefault(); // Блокируем остальные символы
  }
}
