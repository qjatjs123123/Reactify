import { View } from "./View";

export class StateStore {
  #state!: Record<string, unknown>;  
  #subscribers!: Record<string, Set<View<any>>>;
  static #instance : StateStore | null = null;

  constructor() {
    if (StateStore.#instance) {
      return StateStore.#instance;
    }

    this.#state = {};
    this.#subscribers = {};

    StateStore.#instance = this;
  }

  static getInstance() {
    if (!StateStore.#instance) {
      StateStore.#instance = new StateStore();
    }
    return StateStore.#instance;
  }

  enroll<T>(key: string, state: T): void {
    this.#state[key] = state;
  }

  subscribe(key: string, component: View<any>) {
    if (!this.#subscribers[key]) {
      this.#subscribers[key] = new Set();
    }
    this.#subscribers[key].add(component);
  }

  #notify(key : string) { 
    if (this.#subscribers[key]) {
      this.#subscribers[key].forEach((component) => {
        component._element?.replaceWith(component.render()!);
      });
    }
  }

  setState(key: string, newValue: unknown) {
    const currentValue = this.#state[key];

    if (JSON.stringify(currentValue) === JSON.stringify(newValue)) return;
    this.#state[key] = newValue;
    this.#notify(key);
  }

  getState(key : string) {
    return this.#state[key];
  }
}
