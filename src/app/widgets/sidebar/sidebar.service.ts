import {Injectable, signal} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  isOpen = signal(false);

  toggle(): void {
    this.isOpen.update((value)=>!value);
  }

  setIsOpen(value: boolean): void {
    this.isOpen.set(value)
  }
}
