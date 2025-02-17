import { View } from "../../lib/View";
import { html } from "../../lib/html";
import { StateStore } from "../../lib/StateStore";
import { MemoTestView } from "./MemoTestView";

interface ProfileData {
  name: string;
  id: string;
  picture: string;
}

export class MemberInfoView extends View<null> {
  #stateStore;
  private memoTestView : MemoTestView;


  constructor() {
    super(null);
    this.#stateStore = StateStore.getInstance();
    this.memoTestView = new MemoTestView();

  }

  override template() {
    const picture = (this.#stateStore.getState('profile') as ProfileData).picture;
    const id = (this.#stateStore.getState('profile') as ProfileData).id;
    const name = (this.#stateStore.getState('profile') as ProfileData).name;
    
    return html`
      <aside class="member-container">
        <img class="profile-img" alt="유저 프로필 이미지" src=${picture.endsWith('/') ? picture.slice(0, -1) : picture} />
        <div class="member-info">
          <span>${name}</span>
          <span>${id}</span>
        </div>  
        
        ${this.memoTestView}
      </aside>
    `;
  }
}