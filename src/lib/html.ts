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
        return this._mergeArray(value);
      default:
        return value;
    }
  }

  private _mergeArray = (value: unknown) => {
    if (Array.isArray(value)) {
      const divEl = document.createElement('div') as HTMLDivElement;
      divEl.classList.add('isArray');

      value.forEach(item => {
        const htmlElement = this._parseValue(item);
        divEl.appendChild(htmlElement); 
      });
  
      return divEl;
    }
  
    return value;
  };

  toHtml(): HTMLElement {
    const [wrapEl, nodeList, funcList] = this.buildHTMLContent();
    this.replaceNode(wrapEl, nodeList);
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
  

  private replaceNode(wrapEl: HTMLElement, nodeList: Map<number, HTMLElement>) {
    nodeList.forEach((node, id) => {
      wrapEl.querySelector(`#custom-id-${id}`)?.replaceWith(node);
    });
  }

  private _stringifyValue(value: unknown, funcList, nodeList, str: string): string {
    if (value instanceof Function) {
      return this._handleFunction(value, funcList, str);
    } else if (value instanceof HTMLElement) {
      return this._handleHTMLElement(value, nodeList, str);
    } else {
      return str + value;
    }
  }
  
  private _handleFunction(value: Function, funcList: any[], str: string): string {
    const funcId = funcList.length;
    const arr = str.split(" ");
    const eventType = arr.pop()?.split("=")[0];
    str = arr.join(" ");
  
    funcList.push([value, funcId, eventType]);
    return str + ` data-func-id=${funcId}`;
  }
  
  private _handleHTMLElement(value: HTMLElement, nodeList: Map<number, HTMLElement>, str: string): string {
    const nodeId = nodeList.size;
    nodeList.set(nodeId, value);
    return str + `<div id="custom-id-${nodeId}"></div>`;
  }

  private buildHTMLContent(): [HTMLElement, Map<number, HTMLElement>, any[]] {
    const wrapEl = document.createElement("div");
    const nodeList: Map<number, HTMLElement> = new Map();
    const funcList: any = []

    let template = "";
    [...this.strings].forEach((str, i) => {
      const newValue = this._parseValue(this.values[i] ?? "");
      template += this._stringifyValue(newValue, funcList, nodeList, str);
    });

    wrapEl.innerHTML = template;
    return [wrapEl, nodeList, funcList];
  }
}

   
export const html = (strings: TemplateStringsArray, ...values: unknown[]) =>
  new Tmpl(strings, values);
