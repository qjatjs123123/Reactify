import { html } from "./html";
import ViewStore from "./ViewStore";

export abstract class View<T> {
  state: { [key: string]: any }; 
  protected viewStore;
  key = 0;
  _element: HTMLElement | null = null;
  queue: any[];
  isBatching:boolean = false;

  constructor(public props: T) {
    this.state = {};  
    this.key = 0;
    this.viewStore = ViewStore.getInstance();
    this.queue = [];
    
  }

  setState(key: string, value: any) {
    if (JSON.stringify(this.state[key]) === JSON.stringify(value)) return;

    this.queue.push([key, value]);
    if (!this.isBatching) {
      this.isBatching = true;

      Promise.resolve().then(() => {
        this.flush();
      })
    }

    // console.log(key, value,"out");
    // if (JSON.stringify(this.state[key]) === JSON.stringify(value)) return;
    // console.log(key, value,"in");
    // this.state[key] = value;
    // this._element?.replaceWith(this.render()!);
  }

  private flush() {
    while (this.queue.length > 0) {
      const [key, value] = this.queue.shift();

      this.state[key] = value;
    }
    this.isBatching = false;
    // console.log(this.render()!);
    this._element?.replaceWith(this.render()!);
  }

  getState(key: string): any {
    return this.state[key];
  }

  template() {
    return html``;
  }


  render() {
    if (this.viewStore.isValidMemo(this)) return this.viewStore.getViewMemo(this);

    const wrapEl = document.createElement('div');
    wrapEl.classList.add('isArray');
    wrapEl.append(this.template().toHtml());
    
    this._element = wrapEl.children[0] as HTMLElement;
    
    this.onRender();

    return this._element;

  }



  removeArray() {
    this._element?.querySelectorAll('.isArray').forEach(isArray => {
      const dropdownContainer = isArray.parentNode as HTMLElement | null;
        
      if (!dropdownContainer) return;
  
      
      Array.from(isArray.children).forEach(child => dropdownContainer.appendChild(child));
  
      dropdownContainer.appendChild(isArray);
      isArray.remove();
    });
  }
  

  protected onRender() {}

  
}