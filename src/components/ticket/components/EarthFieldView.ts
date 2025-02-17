import { html } from "../../../lib/html";
import { StateStore } from "../../../lib/StateStore";
import { View } from "../../../lib/View";
import { ERROR_MESSAGE } from "../../../util/constants";
import { TicketService } from "../business/TicketService";
import { SearchService } from "../../search/business/SearchService";

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

export class EarthFieldView extends View<FieldViewData> {
  #stateStore : StateStore;
  #ticketService : TicketService;
  #searchService : SearchService;

  constructor(props : FieldViewData) {
    super(props);
    this.#stateStore = StateStore.getInstance();
    this.#ticketService = TicketService.getInstance();
    this.#searchService  = SearchService.getInstance();
  }

  changeEarthType() {
    const selectedValue = (this._element!.querySelector('#travel-type') as HTMLSelectElement).value;
  
    this.#stateStore.setState('form', {
      ...this.#stateStore.getState('form') as fromData,
      special : {type : selectedValue},
    })
  }

  async submit() {
    const selectedValue = (this.#stateStore.getState('form') as fromData).special?.type;

    if (!this.#ticketService.isValidEarthType(selectedValue)) {
      this.#ticketService.showSnackBar(ERROR_MESSAGE.specialInput);
      return;
    }

    await this.#ticketService.postTicketAPI();
    this.props.func();
    this.#ticketService.init();
    this.#searchService.getTicketAPI();
  }

  protected onRender(): void {
    const selectedEl = this._element!.querySelector('#travel-type') as HTMLSelectElement;
    selectedEl.value = (this.#stateStore.getState('form') as fromData).special?.type;
  }


  override template() {
    return html`
    <div >
      <div class="form-group">
        <label for="travel-type">지구 저궤도 여행</label>
        <select change=${() => this.changeEarthType()} id="travel-type" name="travel-type" required>
          <option value="우주 유영">우주 유영</option>
          <option value="우주 정거장 방문">우주 정거장 방문</option>
          <option value="무중력 체험">무중력 체험</option>
        </select>
      </div>  

      <div class="button-container">
        <button click=${() => this.props.func()} class="submit-btn">뒤로가기</button>
        <button click=${() => this.submit()} class="submit-btn">발권하기</button>
      </div>
    </div>
    `;
  }
}