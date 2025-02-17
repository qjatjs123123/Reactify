import { html } from "../../../lib/html";
import { View } from "../../../lib/View";
import { DatePicker } from "../../common/DatePicker";
import { StateStore } from "../../../lib/StateStore";
import { TicketService } from "../business/TicketService";
import { ERROR_MESSAGE } from "../../../util/constants";

interface fromData {
  name: string;
  tripType: string;
  departureDate: {
    date: string;
  };
  passengerCnt: number;
  special: string | null; 
}

interface CommonFieldViewData {
  func : Function
}

export class CommonFieldView extends View<CommonFieldViewData> {
  #stateStore : StateStore;
  #ticketSerivce : TicketService;

  constructor(props : CommonFieldViewData) {
    super(props);
    this.#stateStore = StateStore.getInstance();
    this.#ticketSerivce = TicketService.getInstance();
    this.#stateStore.subscribe('form', this);

  }

  departureDateEvent(newDate : any) {
    
    this.#stateStore.setState('form', {
      ...this.#stateStore.getState('form') as any,
      departureDate: {
        date: newDate
      },
    })
    
  }

  nameEvent(e : Event) {
    const newValue = (e.target as HTMLInputElement).value;

    this.#stateStore.setState('form', {
      ...this.#stateStore.getState('form') as fromData,
      name : newValue,
    })
  }

  passengerCountEvent(e : Event) {
    const newValue = Number((e.target as HTMLInputElement).value);
    
    this.#stateStore.setState('form', {
      ...this.#stateStore.getState('form') as fromData,
      passengerCnt : newValue,
    })
    
  }  

  tripTypeEvent() {
    const selectedValue = (this._element!.querySelector('#travel-type') as HTMLSelectElement).value;
  
    this.#stateStore.setState('form', {
      ...this.#stateStore.getState('form') as fromData,
      tripType : selectedValue,
    })
  }

  protected onRender(): void {
    const passengerCntEl = this._element!.querySelector('#passenger-count') as HTMLInputElement;
    const nameEl = this._element!.querySelector('#name') as HTMLInputElement;
    const selectedEl = this._element!.querySelector('#travel-type') as HTMLSelectElement;

    passengerCntEl.value = String((this.#stateStore.getState('form') as fromData).passengerCnt);
    nameEl.value = (this.#stateStore.getState('form') as fromData).name;
    selectedEl.value = (this.#stateStore.getState('form') as fromData).tripType;
  }


  nextBtnEvent(e : Event) {
    e.preventDefault();
    const { name, tripType, departureDate, passengerCnt } = (this.#stateStore.getState('form') as fromData);
    const date = departureDate.date;
  
    if (!this.#ticketSerivce.isValidName(name)) {
      this.#ticketSerivce.showSnackBar(ERROR_MESSAGE.nameInput);
      return;
    } 
    
    if (!this.#ticketSerivce.isValidTravelType(tripType)) {
      this.#ticketSerivce.showSnackBar(ERROR_MESSAGE.tripTypeInput);
      return;
    }

    if (!this.#ticketSerivce.isValidDate(date)) {
      this.#ticketSerivce.showSnackBar(ERROR_MESSAGE.dateInput);
      return;
    } 
    
    if (!this.#ticketSerivce.isValidPassengerCount(passengerCnt)) {
      this.#ticketSerivce.showSnackBar(ERROR_MESSAGE.passCntInput);
      return;
    }

    this.props.func();
  } 

  override template() {
    return html`
    <div class="form-container">
      
        <div class="form-group">
          <label for="name">이름</label>
          <input change=${(e: Event) => this.nameEvent(e)} type="text" id="name" name="name" placeholder="이름을 입력하세요" required>
        </div>

        <div class="form-group">
          <label for="travel-type">여행 타입</label>
          <select change=${() => this.tripTypeEvent()} id="travel-type" name="travel-type" required>
            <option value="지구 저궤도 여행">지구 저궤도 여행</option>
            <option value="달 여행">달 여행</option>
            <option value="화성 여행">화성 여행</option>
          </select>
        </div>

        <div class="form-group">
          <label for="departure-date">출발 날짜</label>
          ${new DatePicker({
            func: (newDate: string) => this.departureDateEvent(newDate),
            pickedDate: (this.#stateStore.getState('form') as any).departureDate
          })}
        </div>

        <div class="form-group">
          <label for="passenger-count">승객 수</label>
          <input change=${(e: Event) => this.passengerCountEvent(e)} type="number" id="passenger-count" name="passenger-count" min="1" required>
        </div>

        <button click=${(e : Event) => this.nextBtnEvent(e)} class="submit-btn">다음</button>
      
    </div>
    `;
  }
}