import { html } from "../../../lib/html";
import { StateStore } from "../../../lib/StateStore";
import { View } from "../../../lib/View";
import { DatePicker } from "../../common/DatePicker";
import { SearchService } from "../business/SearchService";

export class SearchPickerView extends View<null> {
  #stateStore;
  searchService = SearchService.getInstance();

  constructor() {
    super(null);
    this.#stateStore = StateStore.getInstance();
    this.setState("pickedDate", {date: ''});
  }

  async closeEvent() {
    if (!this.getState('pickedDate').date) return;
    
    this.#stateStore.setState('pickedDate', {date: ''})
    this.setState('pickedDate', {date: ''});
    await this.searchService.getTicketAPI();
  }

  async setPickedDateCallback(newDate : any) {
    this.setState('pickedDate', {date: newDate});
    this.#stateStore.setState('pickedDate', {date: newDate})
    this.#stateStore.setState('page', {
      page: {
        currentPage: 1,
        totalPages:1,
        totalResults: 1,
      },
    });
    await this.searchService.getTicketAPI();
  }
 
  override template() {
    return html`
    <div class="close-container" >
      <button class="close-btn" click=${()=>this.closeEvent()}>X</button>
      ${new DatePicker({
        func: (newDate: string) => this.setPickedDateCallback(newDate),
        pickedDate: this.getState('pickedDate')
      })}
    <div>
    `;
  }
}