import { html } from "../../lib/html";
import { View } from "../../lib/View";

interface ArrowBtnData {
  className: string;
  content: string;
  func : Function;
}


export class ArrowBtnView extends View<ArrowBtnData> {

  constructor(props : ArrowBtnData) {
    super(props);
    
  }

  protected onRender(): void {
    const prevButton = this._element! as HTMLElement;   
    this.viewStore.setViewMemo(this, prevButton);
  }

  override template() {
    return html`
      <button class=${this.props.className} click=${this.props.func()}>
        ${this.props.content}
      </button>
    `;
  }
}