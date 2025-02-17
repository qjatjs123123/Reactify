import { View } from "../lib/View";
import { html } from "../lib/html";
import Route from '../lib/Route';
import { SearchView } from "../components/search/SearchView";
import { TicketView } from "../components/ticket/TicketView";

export default class BrowserRoute extends View<null> {
  private searchView;
  private ticketView;
  private route : Route;
  
  constructor() {
    super(null);
    this.route = Route.getInstance(this);
    this.searchView = new SearchView();
    this.ticketView = new TicketView();
  }

  override template() {
    
    return html`
    <section>
      ${this.route.browserRouter(
        {'/' : this.searchView},
        {'/ticket' : this.ticketView}
      )}
    </section>
    `;
  }
}