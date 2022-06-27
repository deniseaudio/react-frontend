export class EventEmitter {
  private target: EventTarget;

  constructor() {
    this.target = new EventTarget();
  }

  public on(eventName: string, listener: EventListener) {
    return this.target.addEventListener(eventName, listener);
  }

  public once(eventName: string, listener: EventListener) {
    return this.target.addEventListener(eventName, listener, { once: true });
  }

  public off(eventName: string, listener: EventListener) {
    return this.target.removeEventListener(eventName, listener);
  }

  public emit<T>(eventName: string, detail: T) {
    return this.target.dispatchEvent(
      new CustomEvent(eventName, { detail, cancelable: true })
    );
  }
}
