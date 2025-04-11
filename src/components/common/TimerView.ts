import { html } from "../../lib/html";
import { View } from "../../lib/View";
import { StateStore } from "../../lib/StateStore";
import getCurrentTime from '../../util/timer';


interface timerData {
  time: string
}

export class TimerView extends View<null> {
  #stateStore;
  public timer: any = null;
  public _viewId;

  constructor(id) {
    super(null);
    this.#stateStore = StateStore.getInstance();
    this.#stateStore.subscribe('timer', this);
    this._viewId = id;
  }

  private calCurrentTime() {
    this.#stateStore.setState('timer', {time: `${getCurrentTime()}`});
  }

  private startTimer() {
    if (this.timer) return; 

    this.timer = setInterval(() => {
      console.log("1")
      this.calCurrentTime();
    }, 1000);
  }

  protected onRender(): void {
    this.viewStore.setViewMap(this._viewId, this);
    
    this.startTimer();
  }

  protected onUnmount(): void {
    if (!this.viewStore.getViewMap(this._viewId)) return;

    const prev_view = this.viewStore.getViewMap(this._viewId)
    if (prev_view) {
      clearInterval(prev_view.timer);
      prev_view.timer = null;
    }
  }


  override template() {
    const time = (this.#stateStore.getState('timer') as timerData).time;

    return html`
    <div class="timer-container">
      ${time}
    </div>
    `;
  }
}