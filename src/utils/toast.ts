import EventManager from '../lib/EventManager';

export type toastType = 'default' | 'success' | 'danger';

export interface ToastPayload {
  type?: toastType;
  text: string;
  duration?: number;
}

export const toastEventManager = new EventManager<ToastPayload>();

export function toast(payload: ToastPayload) {
  toastEventManager.emit('addtoast', payload);
}
