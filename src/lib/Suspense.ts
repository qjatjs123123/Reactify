import { html } from "./html";
import { View } from "./View";
import BrowserRoute from "../pages/BrowserRoute";
import { TicketView } from "../components/ticket/TicketView";

export default class Suspense extends View<null> {
  BrowserRoute: any;
  constructor(browserRoute) {
    super(null);
    this.BrowserRoute = browserRoute;
    this.setState("state", "pending");
    this.setState("view", html` <div>pending...</div> `);

    try {
      this.BrowserRoute();
    } catch (promise) {
      promise.then((module) => {
        this.setState("state", "fullfilled");
        const { SearchView, TicketView } = module;

        if (SearchView) this.setState("view", new SearchView());
        else this.setState("view", new TicketView());
      });
    }
  }

  override template() {
    const state = this.getState("state");
    const view = this.getState("view");

    switch (state) {
      case "pending":
        return html`${view}`;
      case "fullfilled":
        return html`${view}`;
      default:
        return html`<div>error</div>`;
    }
  }
}
