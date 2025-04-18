import { html } from "./html";
import ViewStore from "./ViewStore";
import { funcMap } from "../util/eventBind";

type stateType = { [key: string]: any }

export abstract class View<T> {
  private state: stateType; 
  protected viewStore;
  private queue: [string, unknown][];
  private isBatching:boolean = false;
  private key = 0;
  public _element: HTMLElement | null = null;

  constructor(public props: T) {
    this.state = {};  
    this.key = 0;
    this.viewStore = ViewStore.getInstance();
    this.queue = [];
    
  }

  setState(key: string, value: unknown) {
    if (Object.is(this.state[key], value)) return;
    // this.flush();
    this.queue.push([key, value]);
    if (!this.isBatching) {
      this.isBatching = true;



      Promise.resolve().then(() => {
        this.flush();
      })
    }
  }

  private flush() {
    while (this.queue.length > 0) {
      const [key, value] = this.queue.shift();

      this.state[key] = value;
    }
    this.isBatching = false;

    this._element?.replaceWith(this.render()!);
  }


  getState<K extends keyof stateType>(key: K): stateType[K]  {
    return this.state[key];
  }

  template() : any {
    return html``;
  }



  render() : any{
    if (this.viewStore.isValidMemo(this)) return this.viewStore.getViewMemo(this);
    this._onUnmount()
    this.onUnmount();

    const wrapEl = document.createElement('div');
    wrapEl.classList.add('isArray');
    wrapEl.append(this.template().toHtml());
    
    const firstChild = wrapEl.children[0];
    
    if (firstChild instanceof HTMLElement) this._element = firstChild ;
  
    this.onRender();

    return this._element;

  }

  _onUnmount() {
    if (!this._element) return;

    const elements = this._element.querySelectorAll('[data-func-id]');
    elements.forEach(element => {
      funcMap.delete(element);
    });
    console.log(funcMap)
  }

  removeArray():void {
    this._element?.querySelectorAll('.isArray').forEach(isArray => {
      const dropdownContainer = isArray.parentNode;
        
      if (!dropdownContainer || !(dropdownContainer instanceof HTMLElement)) return;
  
      
      Array.from(isArray.children).forEach(child => dropdownContainer.appendChild(child));
  
      dropdownContainer.appendChild(isArray);
      isArray.remove();
    });
  }
  

  protected onRender() {}

  protected onUnmount() {}
}