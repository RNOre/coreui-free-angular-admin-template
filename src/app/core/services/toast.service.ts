import {Injectable, signal, WritableSignal} from '@angular/core';
import {BehaviorSubject} from "rxjs";

export interface ToastInterface {
  show: boolean
  title?: string,
  text?: string,
  class?: string,
  duration?: number
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  $toast: WritableSignal<ToastInterface> = signal({show: false})
  private toastSubject = new BehaviorSubject<{message: string, type: 'success' | 'danger' | 'warning' | 'info'} | null>(null);
  toast$ = this.toastSubject.asObservable();
  setToast(data: ToastInterface) {
    console.log('show');
    this.$toast.set(data);
  }

  showToast() {
    this.$toast.set({...this.$toast(), show: true})
  }

  hideToast() {
    this.$toast.set({...this.$toast(), show: false})
  }
  show(message: string, type: 'success' | 'danger' | 'warning' | 'info' = 'danger') {
    this.toastSubject.next({ message, type });
  }
}
