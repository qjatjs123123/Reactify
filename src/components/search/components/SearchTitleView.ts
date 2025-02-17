import { html } from "../../../lib/html";
import { View } from "../../../lib/View";
import { TimerView } from "../../common/TimerView";


export class SearchTitleView extends View<null> {
  private timerView: TimerView;
  
  constructor() {
    super(null);
    this.timerView  = new TimerView();
  }

  override template() {
    return html`
    <div class="time-container">      
      ${this.timerView}
    </div>  
    `;
  }
}