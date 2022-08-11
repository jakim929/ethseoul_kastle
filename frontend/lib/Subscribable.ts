type Subscriber<T> = (state: T) => void;

export abstract class Subscribable<T> {
  private _subscribers: Subscriber<T>[] = [];

  subscribe(subscriber: Subscriber<T>) {
    this._subscribers.push(subscriber);
    return () => this.unsubscribe(subscriber);
  }

  unsubscribe(subscriber: Subscriber<T>) {
    this._subscribers = this._subscribers.filter((s) => s !== subscriber);
  }

  notify() {
    this._subscribers.forEach((s) => s(this.getState()));
  }

  abstract getState(): T;
}
