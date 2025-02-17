import { html } from "../../lib/html";
import { View } from "../../lib/View";
import { StateStore } from "../../lib/StateStore";
import getCurrentTime from '../../util/timer';


interface timerData {
  time: string
}

export class TimerView extends View<null> {
  #stateStore;
  private timer: any = null;

  constructor() {
    super(null);
    this.#stateStore = StateStore.getInstance();
    this.#stateStore.subscribe('timer', this);
    this.startTimer();
  }

  private calCurrentTime() {
    this.#stateStore.setState('timer', {time: `${getCurrentTime()}`});
  }

  private startTimer() {
    if (this.timer) return; 

    this.timer = setInterval(() => {
      this.calCurrentTime();
    }, 1000);
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