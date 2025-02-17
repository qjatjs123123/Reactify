import { html } from "../../lib/html";
import { View } from "../../lib/View";
import { StateStore } from "../../lib/StateStore";
import { incrementUniqueKey } from "../../util/constants";
import Route from "../../lib/Route";

interface DropboxItem {
  name: string;
  location: string;
}

interface stateData {
  switch: boolean
}

export class DropBoxView extends View<DropboxItem[]> {
  #stateStore;

  constructor($parent : any) {
    super($parent);
    this.#stateStore = StateStore.getInstance();
    // this.#stateStore.subscribe('dropBox-on', this);
  }

  protected onRender(): void {
    this.removeArray();
  }

  private test(href : string, name : string) {
    history.pushState({ page: 2 }, "title 2", href);
    this.#stateStore.setState('nav', {nav: name});
    Route.getInstance(null).navigate(href);
  }

  override template() {
    this.key = incrementUniqueKey();
    const active = (this.#stateStore.getState('dropBox-on') as stateData).switch;

    return html`
    <div data-id=${this.key} class="dropdown-container ${active ? 'active' : 'inactive'}" >
      ${this.props.map((item, index) => html`
        <div click=${() => this.test(item.location, item.name)} class="dropdown-item" key=${index}>
          <span href="${item.location}">${item.name}</span>
        </div>
      `)}
    </div>
    `;
  }
}
