import { View } from "../../lib/View";
import { html } from "../../lib/html";



export class MemoTestView extends View<null> {


  constructor() {
    super(null);
  }

  protected onRender(): void {
    this.viewStore.setViewMemo(this, this._element!);
  }
  
  override template() {


    return html`
      <div class="memo-test-view">
        
      </div>
    `;
  }
}