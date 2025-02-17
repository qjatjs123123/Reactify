import { html } from "../../../lib/html";
import { View } from "../../../lib/View";
import { SearchService } from "../business/SearchService";
import { StateStore } from "../../../lib/StateStore";
import { SearchTableSkeletonView } from "../../common/skeleton/SearchTableSkeletonView";
import { ERROR_MESSAGE } from "../../../util/constants";

interface Ticket {
  id: number;
  name: string;
  travelType: string;
  ticketDate: string;
  departureDate: string;
  canceled: boolean;
}

export class SearchTableView extends View<null> {
  #stateStore;
  #searchService;
  #searchTableSkeletonView;

  constructor() {
    super(null);
    this.#stateStore = StateStore.getInstance();
    this.#searchService = SearchService.getInstance();
    this.#stateStore.subscribe('ticket', this);
    this.#stateStore.subscribe('loading', this);
    this.#searchTableSkeletonView = new SearchTableSkeletonView();
  }

  protected onRender(): void {
    this.removeArray();  
    this.addCancelBtnEvent();
  }

  private addCancelBtnEvent() {
    const cancelButtons = this._element!.querySelectorAll('.cancel-btn');

    cancelButtons.forEach(button => {
      button.addEventListener('click', async (e) => { 
        if (!this.isValidDeleteTicket(button)) {
          this.#stateStore.setState('snack', {
            message: ERROR_MESSAGE.cancel,
            switch: !(this.#stateStore.getState('snack') as any).switch
          })
          return;
        }
        const id = button.getAttribute('data-id');
        await this.#searchService.deleteTicketAPI(id);
        await this.#searchService.getTicketAPI();
      })
    })
  }

  private isValidDeleteTicket(button : any) {
    const date = button.getAttribute('data-date');

    const ticketDate = new Date(date);
    const today = new Date();

    ticketDate.setDate(ticketDate.getDate() - 7);
    
    return ticketDate >= today;
  }

  override template() {
    const data = (this.#stateStore.getState('ticket') as { data: Ticket[] }).data;
    
    if (this.#stateStore.getState('loading')) return html`${this.#searchTableSkeletonView}`;
    
    let newHtml = `
      <table class="ticket-table">
        <thead>
          <tr>
            <th>고객 이름</th>
            <th>여행 타입</th>
            <th>발권 날짜</th>
            <th>출발 날짜</th>
            <th>취소 버튼</th>
          </tr>
        </thead>
        <tbody>
        `
    
        data.forEach(({id, name, travelType, ticketDate, departureDate}) =>
          newHtml += `
          <tr>
            <td>${name}</td>
            <td>${travelType}</td>
            <td>${ticketDate}</td>
            <td>${departureDate}</td>
            <td><button class="cancel-btn" data-id=${id} data-date=${departureDate}>취소</button></td>
          </tr>
        `
        )
        
        newHtml += '</tbody></table>';
    return html`
        ${newHtml}
    `;
  }
}
