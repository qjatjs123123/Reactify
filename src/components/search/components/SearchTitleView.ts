import { html } from "../../../lib/html";
import { View } from "../../../lib/View";
import { TimerView } from "../../common/TimerView";


export class SearchTitleView extends View<null> {
  private timerView: TimerView;
  
  constructor() {
    super(null);

  }

  override template() {
    return html`
    <div class="time-container">      

    </div>  
    `;
  }
}