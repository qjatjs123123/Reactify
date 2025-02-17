import { View } from "./View";
import { html } from "./html";
import { StateStore } from "./StateStore";
import DROPBOX_ITEM from "../util/constants";

export default class Route {
  private static instance: Route;
  private root: View<null>;
  routes:{[key:string]: View<null>} = {};
  #stateStore: StateStore;

  private constructor(root : View<null>) {
    this.root = root;
    this.#stateStore = new StateStore();
    this.init();
  }


  public static getInstance(root : View<null> | null): Route {
    if (!Route.instance && root) {
      Route.instance = new Route(root);
    }
    return Route.instance;
  }

  navigate(url: string) {
    history.pushState({}, "", url);
    this.root._element?.replaceWith(this.root.render() as HTMLElement);
  }

  init() {
    DROPBOX_ITEM.forEach(({name, location}) => {
      if (location === window.location.pathname )
         this.#stateStore.setState('nav', {nav: name});
    })
  }

  browserRouter(...args: { [key: string]: View<null> }[]) {
    for (const arg of args) {
      if (arg[window.location.pathname]) {
        return arg[window.location.pathname];
      }
    }
    return html`<div></div>`;
  }
}
