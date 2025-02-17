import { html } from "../../lib/html";
import { View } from "../../lib/View";


export class LoadingView extends View<null> {

  constructor() {
    super(null);
  }

  override template() {
    return html`
    <div class="loading-spinner"></div>
    `;
  }
}