export default class EventManager<P> {
  private listeners: Map<string, Array<(payload: P) => void>>;

  constructor() {
    this.listeners = new Map();
  }

  on(event: string, listener: (payload: P) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }

    this.listeners.get(event)?.push(listener);
  }

  removeListener(event: string, listenerToRemove: (payload: P) => void) {
    if (!this.listeners.has(event)) {
      return;
    }

    const updatedListeners = this.listeners.get(event)?.filter(
      (listener) => listener !== listenerToRemove,
    ) || [];

    this.listeners.set(event, updatedListeners);
  }

  emit(event: string, payload: P) {
    if (!this.listeners.has(event)) {
      return;
    }

    this.listeners.get(event)?.forEach((listener) => {
      listener(payload);
    });
  }
}
