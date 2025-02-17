import { html } from "../../lib/html";
import { View } from "../../lib/View";
import DROPBOX_ITEM from "../../util/constants";
import { StateStore } from "../../lib/StateStore";
import Route from "../../lib/Route";

interface NavData {
  nav: string;
  
}

export class NavView extends View<null> {
  #stateStore;

  constructor() {
    super(null);
    this.#stateStore = StateStore.getInstance();
    this.#stateStore.subscribe('nav', this);
    
  }

  navItemClick(curNav: string, hrefValue: string) {
    const active = (this.#stateStore.getState('nav') as NavData).nav;
    this.#stateStore.setState('nav', {nav: curNav});
    Route.getInstance(null).navigate(hrefValue);
  }


  protected onRender(): void {
    this.removeArray();
    const navItems = this._element?.querySelectorAll('.nav-item');

    navItems?.forEach((navItem, idx) => {
      const curNav = navItem.children[0].textContent || '';
      const hrefValue = navItem.children[0].getAttribute('href') || '';
      navItem.addEventListener('click', () => this.navItemClick(curNav, hrefValue));
    });

  }
  

  override template() {
    const activeNav = (this.#stateStore.getState('nav') as NavData).nav;
    
    return html`
      <nav class="nav-container"> 
        ${DROPBOX_ITEM.map((item, index) => html`
          <div  class="nav-item ${item.name === activeNav ? 'active' : ''}" key=${index}>
            <span href="${item.location}">${item.name}</span>
          </div>
        `)} 
      </nav> 
    `;
  }
}