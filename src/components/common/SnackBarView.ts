import { html } from "../../lib/html";
import { View } from "../../lib/View";
import { StateStore } from "../../lib/StateStore";

interface SnackBarData {
  message : string,
  switch : boolean
}

export class SnackBarView extends View<null> {
  #stateStore;

  constructor() {
    super(null);
    this.#stateStore = StateStore.getInstance();
    this.#stateStore.subscribe('snack', this);
  }

  protected onRender(): void {
    const snackBarElement = this._element;
    if (snackBarElement) {
      snackBarElement.classList.add("show");

      setTimeout(() => {
          snackBarElement.classList.remove("show");
      }, 1000);
    }
  }

  override template() {
    const data = (this.#stateStore.getState('snack') as SnackBarData);
    if (!data.message) return html`<div></div>`;

    return html`
    <div id="snackbar">${data.message}</div>
    `;
  }
}