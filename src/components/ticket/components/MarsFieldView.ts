import { html } from "../../../lib/html";
import { StateStore } from "../../../lib/StateStore";
import { View } from "../../../lib/View";
import { ERROR_MESSAGE } from "../../../util/constants";
import { SearchService } from "../../search/business/SearchService";
import { TicketService } from "../business/TicketService";

interface fromData {
  name: string;
  tripType: string;
  departureDate: {
    date: string;
  };
  passengerCnt: number;
  special: any | null; 
}

interface FieldViewData {
  func : Function
}

export class MarsFieldView extends View<FieldViewData> {
  #stateStore : StateStore;
  #ticketService : TicketService;
  #searchService : SearchService;

  constructor(props : FieldViewData) {
    super(props);
    this.#stateStore = StateStore.getInstance();
    this.#ticketService = TicketService.getInstance();
    this.#searchService  = SearchService.getInstance();
  }

  changeCheckBox(e : Event) {
    const target = e.target as HTMLInputElement;
  
    this.#stateStore.setState('form', {
      ...this.#stateStore.getState('form') as fromData,
      special : {
        ...(this.#stateStore.getState('form') as fromData).special ?? null,
        marsCheck : target.checked
      },
    })

  }

  changeTimeEvent(e : Event) {
    const target = e.target as HTMLInputElement;
  
    this.#stateStore.setState('form', {
      ...this.#stateStore.getState('form') as fromData,
      special : {
        ...(this.#stateStore.getState('form') as fromData).special ?? null,
        time : target.value
      },
    })
  }

  protected onRender(): void {
    const checkBoxEl = this._element!.querySelector('#surface-exploration') as HTMLInputElement;
    const timeEl = this._element!.querySelector('#passenger-count') as HTMLInputElement;
    checkBoxEl.checked = (this.#stateStore.getState('form') as fromData).special?.marsCheck ?? false;
    timeEl.value = (this.#stateStore.getState('form') as fromData).special?.time ?? ''
  }

  async submit() {
    const selectedValue = (this.#stateStore.getState('form') as fromData).special?.time;

    if (!this.#ticketService.isValidTime(selectedValue)) {
      this.#ticketService.showSnackBar(ERROR_MESSAGE.specialMars);
      return;
    }

    await this.#ticketService.postTicketAPI();
    this.props.func();
    this.#ticketService.init();
    this.#searchService.getTicketAPI();
  }

  override template() {
    return html`
    <div >
      <div class="form-group">
        <label for="surface-exploration">
         왕복
        </label>
        <input change=${(e: Event) => this.changeCheckBox(e)} type="checkbox" id="surface-exploration" name="surface-exploration" />
      </div>

      <div class="form-group">
        <label for="passenger-count">기간</label>
        <input change=${(e: Event) => this.changeTimeEvent(e)} type="number" id="passenger-count" name="passenger-count" min="1" max="10" required>
      </div>

      <div class="button-container">
        <button click=${() => this.props.func()} class="submit-btn">뒤로가기</button>
        <button click=${() => this.submit()} class="submit-btn">발권하기</button>
      </div>
    </div>
    `;
  }
}