import { View } from "../lib/View";
import {  htmlAsync } from "../lib/html";
import Route from '../lib/Route';


export default class BrowserRoute extends View<null> {
  private searchView;
  private ticketView;
  private route: Route;

  constructor() {
    super(null);
    this.route = Route.getInstance(this);
    this.searchView = null;
    this.ticketView = null;
  }

  async render() : Promise<HTMLElement>{
    if (this.viewStore.isValidMemo(this)) return this.viewStore.getViewMemo(this);

    const wrapEl = document.createElement('div');
    wrapEl.classList.add('isArray');

    wrapEl.append(( await this.template()).toHtml());
    
    const firstChild = wrapEl.children[0];
    
    if (firstChild instanceof HTMLElement) this._element = firstChild ;

    this.onRender();
    document.querySelector(".section_responsive")?.appendChild(this._element);
    
    return this._element;

  }
  

   async template() {

    const h =  await htmlAsync`
      <section>
        ${ await this.route.browserRouter()}
      </section>
    `;

    return h;
  }
}
