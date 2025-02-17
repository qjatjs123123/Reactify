import { View } from "./View";

class Tmpl {
  constructor(
    private strings: TemplateStringsArray,
    private values: unknown[]
  ) {}

  private _parseValue(value: unknown) {
    
    switch (true) {
      case value instanceof View:
        return (value as View<any>).render();
      case value instanceof Tmpl:
        return (value as Tmpl).toHtml();
      case Array.isArray(value):
        return this._mergeArray(value).toHtml();
      default:
        return value;
    }
  }

  private _mergeArray = (value: unknown) =>
    Array.isArray(value)
      ? value.reduce(
          (a, b) =>
            html`<div class="isArray">
              ${a}
              <div class="isArray">${b}</div>
            </div>`,
          html`<div class="isArray"></div>`
        )
      : value;

  toHtml(): HTMLElement {
    const [wrapEl, nodeList, funcList] = this.find();
    this.replace(wrapEl, nodeList);
    this.eventBind(wrapEl, funcList)
    
    return wrapEl.firstElementChild as HTMLElement;
  }

  private eventBind(wrapEl: HTMLElement, funcList: [Function, number, string][]) {
    funcList.forEach(([func, funcId, eventType]) => {
      
      const funcEl = wrapEl.querySelector(`[data-func-id="${funcId}"]`) as HTMLElement;
      // console.log(funcEl, eventType, func);
      funcEl.addEventListener(eventType, (event) => {
        func(event);  
      });
      funcEl.removeAttribute("data-func-id");
    });
  }
  

  private replace(wrapEl: HTMLElement, nodeList: Map<number, HTMLElement>) {
    nodeList.forEach((node, id) => {
      wrapEl.querySelector(`#custom-id-${id}`)?.replaceWith(node);
    });
  }

  private find(): [HTMLElement, Map<number, HTMLElement>, any[]] {
    const wrapEl = document.createElement("div");
    const nodeList: Map<number, HTMLElement> = new Map();
    const funcList: any = []

    let template = "";
    [...this.strings].forEach((str, i) => {
      const newValue = this._parseValue(this.values[i] ?? "");
      

      if (newValue instanceof Function) {
        const funcId = funcList.length
        let arr = str.split(" ");
        const eventType = arr.pop()?.split("=")[0];
        str = arr.join(" ");
        
        funcList.push([newValue, funcId, eventType]);
        template += str +  ` data-func-id=${funcId}`;
      } else if (newValue instanceof HTMLElement) {
        const nodeId = nodeList.size;
        nodeList.set(nodeId, newValue);
        template += str + `<div id="custom-id-${nodeId}"></div>`;
      } else {
        template += str + newValue; 
      }

    });

    wrapEl.innerHTML = template;
    return [wrapEl, nodeList, funcList];
  }
}

   
export const html = (strings: TemplateStringsArray, ...values: unknown[]) =>
  new Tmpl(strings, values);
