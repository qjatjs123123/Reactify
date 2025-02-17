import { html } from "../../../lib/html";
import { View } from "../../../lib/View";
import { axios } from "../../../util/api";
import { StateStore } from "../../../lib/StateStore";
import { ArrowBtnView } from "../../common/ArrowBtnView";
import { SearchService } from '../business/SearchService';

interface Ticket {
  id: number;
  name: string;
  travelType: string;
  ticketDate: string;
  departureDate: string;
  canceled: boolean;
}

interface ArrowBtnData {
  className: string;
  content: string;
  func : Function;
}

export class SearchPageView extends View<null> {
  public stateStore = StateStore.getInstance();
  private searchService : SearchService = SearchService.getInstance();
  private arrowPrevBtnView : ArrowBtnView;
  private arrowNextBntView : ArrowBtnView;

  constructor() {
    super(null);
    this.stateStore.subscribe('ticket', this);
    this.stateStore.subscribe('page', this);
    this.arrowPrevBtnView = new ArrowBtnView({content: "&#8592;", className: "arrow-prev", func: () => this.prevCallback.bind(this)});
    this.arrowNextBntView = new ArrowBtnView({content: "&#8594;", className: "arrow-next", func: () => this.nextCallback.bind(this)})
    this.searchService.getTicketAPI();
  }



  private pageCallback(page: number) {

    const pageData = (this.stateStore.getState('page') as any).page;
    this.stateStore.setState('page', {page: {...pageData, currentPage: Number(page)} });
    this.searchService.getTicketAPI();
  }

  private prevCallback() {
    const pageData = (this.stateStore.getState('page') as any).page;
    if (pageData.currentPage == 1) return;
    
    this.stateStore.setState('page', {page: {...pageData, currentPage: pageData.currentPage - 1} });
    this.searchService.getTicketAPI();
  }

  private nextCallback() {
    const pageData = (this.stateStore.getState('page') as any).page;
    if (pageData.currentPage === pageData.totalPages) return;

    this.stateStore.setState('page', {page: {...pageData, currentPage: pageData.currentPage + 1} });
    this.searchService.getTicketAPI();
  }

  protected onRender(): void {
    this.removeArray();
  }

  private pageNumbers() {
    const data = (this.stateStore.getState('page') as any).page;
    const cur_page = data.currentPage;
    const max_page = data.totalPages;

    const pageNumbers = [];
  
    const start = Math.max(1, cur_page - 2);
    const end = Math.min(max_page, cur_page + 2);
    
    for (let i = start; i <= end; i++) pageNumbers.push(i);
    
    return pageNumbers;
  }

  override template() {
    const data = (this.stateStore.getState('page') as any).page;
    const cur_page = data.currentPage;

    return html`
    <div class="pagination">
      ${this.arrowPrevBtnView}
      <div>
        ${this.pageNumbers().map(
          (page) => html`
            <button click=${() => this.pageCallback(page)} class="page-button ${cur_page === page ? "active" : ""}">
              ${page}
            </button>
          `
        )}
      </div>
      ${this.arrowNextBntView}
    </div>
  `;
  }
}
