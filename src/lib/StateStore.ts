import { View } from "./View";

type stateType = Record<string, unknown>
type subscribeType = Record<string, Set<View<any>>>;

export class StateStore {
  #state!: stateType;  
  #subscribers!: subscribeType;
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

  subscribe(key: string, component: View<unknown>) {
    if (!this.#subscribers[key]) {
      this.#subscribers[key] = new Set();
    }
    this.#subscribers[key].add(component);
  }

  #notify<K extends keyof subscribeType>(key : K) { 
    if (this.#subscribers[key]) {
      this.#subscribers[key].forEach((component) => {
        component._element?.replaceWith(component.render()!);
      });
    }
  }

  setState<K extends keyof stateType>(key: K, newValue: unknown) {
    const currentValue = this.#state[key];

    if (JSON.stringify(currentValue) === JSON.stringify(newValue)) return;
    this.#state[key] = newValue;
    this.#notify(key);
  }

  getState<K extends keyof stateType>(key : K) {
    return this.#state[key];
  }
}
