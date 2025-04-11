import { View } from "./View";
import { registerHandler, getFuncId } from "../util/eventBind";

type nodeListType = Map<number, HTMLElement>;
type funcListType = [Function, number, string] | [];
interface stringifyParams {
  value: unknown;
  funcList: funcListType[];
  nodeList: nodeListType;  
  str: string;
}

class Tmpl {
  constructor(
    private strings: TemplateStringsArray,
    private values: unknown[]
  ) {}

  private _parseValue(value: unknown) : HTMLElement | unknown {
    
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

  private _mergeArray (value: unknown[]) : HTMLElement {
    const divEl = document.createElement('div');
    divEl.classList.add('isArray');

    value.forEach(item => {
      const htmlElement = this._parseValue(item);

      if (htmlElement instanceof HTMLElement) divEl.appendChild(htmlElement); 
    });
    return divEl;
  };

  toHtml(): HTMLElement {
    const [wrapEl, nodeList, funcList] = this.buildHTMLContent();
    this.replaceNode(wrapEl, nodeList);
    this.eventBind(wrapEl, funcList)
    
    const firstChild = wrapEl.firstElementChild;

    if (firstChild instanceof HTMLElement) return firstChild;
    return document.createElement('div');
  }

  private eventBind(wrapEl: HTMLElement, funcList: funcListType[]) {
    funcList.forEach(([func, funcId, eventType]) => {
      
      const funcEl = wrapEl.querySelector(`[data-func-id="${funcId}"]`);
      registerHandler(funcId, func);

      // funcEl.addEventListener(eventType, (event) => {
      //   func(event);  
      // });
      // funcEl.removeAttribute("data-func-id");
    });
  }
  

  private replaceNode(wrapEl: HTMLElement, nodeList: nodeListType) {
    nodeList.forEach((node, id) => {
      wrapEl.querySelector(`#custom-id-${id}`)?.replaceWith(node);
    });
  }

  private _stringifyValue({ value, funcList, nodeList, str } : stringifyParams): string {
    if (value instanceof Function) {
      return this._handleFunction({value, funcList, str});
    } else if (value instanceof HTMLElement) {
      return this._handleHTMLElement({value, nodeList, str});
    } else {
      return str + value;
    }
  }
  
  private _handleFunction({value, funcList, str} : Partial<stringifyParams>): string {
    if (!(value instanceof Function)) return '';

    const funcId = getFuncId();
    const arr = str.split(" ");
    const eventType = arr.pop()?.split("=")[0];
    str = arr.join(" ");
    funcList.push([value, funcId, eventType]);
    return str + ` data-func-id=${funcId}`;
  }
  
  private _handleHTMLElement({value, nodeList, str} : Partial<stringifyParams>): string {
    if (!(value instanceof HTMLElement)) return '';

    const nodeId = nodeList.size;
    nodeList.set(nodeId, value);
    return str + `<div id="custom-id-${nodeId}"></div>`;
  }

  private buildHTMLContent(): [HTMLElement, nodeListType, funcListType[]] {
    const wrapEl = document.createElement("div");
    const nodeList: nodeListType = new Map();
    const funcList: funcListType = []

    let template = "";
    [...this.strings].forEach((str, i) => {
      const value = this._parseValue(this.values[i] ?? "");
      template += this._stringifyValue({value, funcList, nodeList, str});
    });

    wrapEl.innerHTML = template;
    return [wrapEl, nodeList, funcList];
  }
}

   
export const html = (strings: TemplateStringsArray, ...values: unknown[]) =>
  new Tmpl(strings, values);

export const htmlAsync = (strings: TemplateStringsArray, ...values: unknown[]) => {
  return new Promise<Tmpl>((resolve) => {
    setTimeout(() => {    
      const tmpl = new Tmpl(strings, values);
      resolve(tmpl);  
    }, 0);  
  });
};
