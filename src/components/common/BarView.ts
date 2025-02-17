import { html } from "../../lib/html";
import { View } from "../../lib/View";

interface barData {
  marginTop: string;
  marginBottom: string;
}


export class BarView extends View<barData> {

  constructor(props : barData) {
    super(props);
  }

  override template() {
    return html`
    <div class="bar-container" style="margin-top: ${this.props.marginTop}; margin-bottom: ${this.props.marginBottom};">
    </div>
    `;
  }
}