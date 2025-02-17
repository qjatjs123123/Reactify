import { html } from "../../lib/html";
import { View } from "../../lib/View";
import { CommonFieldView } from "./components/CommonFieldView";
import { SpecialFieldView } from './components/SpecialFieldView';

export class TicketView extends View<null> {
  private commonFieldView : CommonFieldView;
  private specialFieldView : SpecialFieldView;

  constructor() {
    super(null);
    this.commonFieldView = new CommonFieldView({func: () => this.setSpecialField()});
    this.specialFieldView = new SpecialFieldView({func: () => this.setSpecialField()});
    this.setState("isSpecialField", false);
  }

  setSpecialField() {
    this.setState('isSpecialField', !this.getState('isSpecialField'));
  }
  
  override template() {
    return html`
    <div>
      ${this.getState("isSpecialField")
        ? html`${this.specialFieldView}`
        : html`${this.commonFieldView}`}
    </div>
    `
  }
}