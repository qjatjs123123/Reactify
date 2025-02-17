import { StateStore } from '../../../lib/StateStore';
import { axios } from '../../../util/api';

export class SearchService {
  private static instance: SearchService | null = null;
  #stateStore: StateStore;

  private constructor() {
    this.#stateStore = StateStore.getInstance();
  }

  public static getInstance(): SearchService {
    if (!this.instance) {
      this.instance = new SearchService();
    }
    return this.instance;
  }

  public async deleteTicketAPI(id : string | null) {
    await axios('DELETE', `http://localhost:3000/tickets/${id}`, "");
  }

  public async getTicketAPI() {
    const currentPage = (this.#stateStore.getState('page') as any).page.currentPage;
    const date = ( this.#stateStore.getState('pickedDate') as any).date;
    this.#stateStore.setState('loading', true);
    const data: any = await axios('GET', `http://localhost:3000/tickets/홍범선/${date}?page=${currentPage}`, '');

    const delayTime = 500; // 1초 (1000ms)
    await new Promise(resolve => setTimeout(resolve, delayTime));
    
    this.#stateStore.setState('loading', false);
    this.#stateStore.setState('ticket', { data: data.results });
    this.#stateStore.setState('page', {
      page: {
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalResults: data.totalResults,
      },
    });
  
  }
}
