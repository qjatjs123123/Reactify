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

export class MoonFieldView extends View<FieldViewData> {
  #stateStore : StateStore;
  #ticketService : TicketService;
  #searchService : SearchService;

  constructor(props : FieldViewData) {
    super(props);
    this.#stateStore = StateStore.getInstance();
    this.#ticketService = TicketService.getInstance();
    this.#searchService = SearchService.getInstance();
  }

  changeCheckBox(e : Event) {
    const target = e.target as HTMLInputElement;
  
    this.#stateStore.setState('form', {
      ...this.#stateStore.getState('form') as fromData,
      special : {
        ...(this.#stateStore.getState('form') as fromData).special ?? null,
        moonCheck : target.checked
      },
    })

  }

  changeBorrowRobotEvent(e : Event) {
    const target = e.target as HTMLInputElement;
  
    this.#stateStore.setState('form', {
      ...this.#stateStore.getState('form') as fromData,
      special : {
        ...(this.#stateStore.getState('form') as fromData).special ?? null,
        robotCnt : target.value
      },
    })
  }

  protected onRender(): void {
    const checkBoxEl = this._element!.querySelector('#surface-exploration') as HTMLInputElement;
    const robotCntEl = this._element!.querySelector('#passenger-count') as HTMLInputElement;
    checkBoxEl.checked = (this.#stateStore.getState('form') as fromData).special?.moonCheck ?? false;
    robotCntEl.value = (this.#stateStore.getState('form') as fromData).special?.robotCnt ?? ''
  }

  async submit() {
    const selectedValue = (this.#stateStore.getState('form') as fromData).special?.robotCnt;
    
    if (!this.#ticketService.isValidMoon(selectedValue)) {
      this.#ticketService.showSnackBar(ERROR_MESSAGE.specialMoon)
      return; 
    }
    await this.#ticketService.postTicketAPI();
    this.props.func()
    this.#ticketService.init();
    this.#searchService.getTicketAPI();
  }

  override template() {
    return html`
    <div>
      <div class="form-group">
        <label for="surface-exploration">
         표면 탐사
        </label>
        <input change=${(e: Event) => this.changeCheckBox(e)} type="checkbox" id="surface-exploration" name="surface-exploration" />
      </div>

      <div class="form-group">
        <label for="passenger-count">동반 로봇 대여</label>
        <input change=${(e: Event) => this.changeBorrowRobotEvent(e)} type="number" id="passenger-count" name="passenger-count" min="0" max="5" required>
      </div>

      <div class="button-container">
        <button click=${() => this.props.func()} class="submit-btn">뒤로가기</button>
        <button click=${() => this.submit()} class="submit-btn">발권하기</button>
      </div>
    </div>
    `;
  }
}