import Route from "../../../lib/Route";
import { StateStore } from "../../../lib/StateStore";
import { axios } from "../../../util/api";
import { NAME_EXG, DATE_EXG, TRAVEL_TYPE } from "../../../util/constants";



interface fromData {
  name: string;
  tripType: string;
  departureDate: {
    date: string;
  };
  passengerCnt: number;
  special: string | null; 
}

export class TicketService {
  private static instance : TicketService | null = null;
  #stateStore: StateStore;
  
  private constructor() {
    this.#stateStore = StateStore.getInstance();
  }

  public static getInstance(): TicketService {
    if (!this.instance) {
      this.instance = new TicketService();
    }
    return this.instance;
  }

  async postTicketAPI() {
    const formData = (this.#stateStore.getState('form') as fromData);

    const requestData = {
      name: formData.name,
      travelType: formData.tripType,
      ticketDate: this.getTodayDate(),  
      departureDate: formData.departureDate.date, 
    };

    const response = await axios('POST', 'http://localhost:3000/tickets', requestData);
    
    if (response) {
      Route.getInstance(null).navigate('/');
    }
  }

  getTodayDate() {
    const today = new Date();
    const ticketDate = today.toISOString().split('T')[0];
    return ticketDate
  }

  isValidName(value: string) {
    return NAME_EXG.test(value);
  }

  isValidPassengerCount(value : number) {
    return Number(value) >= 1;
  }

  isValidDate(value: any) {
    return DATE_EXG.test(value);
  }

  isValidTravelType(value : string) {
    return TRAVEL_TYPE.includes(value);
  }

  isValidEarthType(value : string) {
    return value;
  }

  isValidTime(value: string) {
    const numValue = Number(value);
    return !isNaN(numValue) && numValue >= 1 && numValue <= 10;
  }

  isValidMoon(value: string) {
    const numValue = Number(value);
    return value !== "" && numValue >= 0 && numValue <= 5 && !isNaN(numValue);
  }

  showSnackBar(message : string) {
    this.#stateStore.setState('snack', {
      message,
      switch: !(this.#stateStore.getState('snack') as any).switch
    })
  }

  init() {
    this.#stateStore.setState('nav', {nav: '발권 조회'});
    this.#stateStore.setState('form', {
      name: '',
      tripType: '지구 저궤도 여행',
      departureDate: {
        date: ''
      },
      passengerCnt: 1,
      special: null
    });
  }
}