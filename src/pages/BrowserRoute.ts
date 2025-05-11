import { View } from "../lib/View";
import { html, htmlAsync } from "../lib/html";
import Route from "../lib/Route";
import Suspense from "../lib/Suspense";

export default class BrowserRoute extends View<null> {
  private searchView;
  private ticketView;
  private route: Route;
  private suspense: Suspense;

  constructor() {
    super(null);
    this.route = Route.getInstance(this);
    this.searchView = null;
    this.ticketView = null;
  }

  override template() {
    return html`<div>${new Suspense(this.route.browserRouter)}</div>`;
  }
}
