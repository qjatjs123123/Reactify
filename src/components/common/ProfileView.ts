import { html } from "../../lib/html";
import { View } from "../../lib/View";
import { axios } from "../../util/api";
import { StateStore } from "../../lib/StateStore";
import { incrementUniqueKey } from "../../util/constants";
import DROPBOX_ITEM from '../../util/constants';
import { DropBoxView } from "./DropBoxView";

interface ProfileData {
  name: string;
  id: string;
  picture: string;
}

interface DropboxItem {
  name: string;
  location: string;
}
interface stateData {
  switch: boolean
}

export class ProfileView extends View<null> {
  private dropBoxView: DropBoxView;
  #stateStore;
  
  constructor() {
    super(null);
    this.login();
    this.#stateStore = StateStore.getInstance();
    this.#stateStore.subscribe('profile', this);
    this.#stateStore.subscribe('dropBox-on', this);
    this.dropBoxView  = new DropBoxView(DROPBOX_ITEM);
  }

  // login 했다고 가정, recoil에서 관리
  // 에러처리 해야함
  async login() {
    
    const data = await axios('GET', 'http://localhost:3000/members/user001',"");
    const delayTime = 500; // 1초 (1000ms)
    await new Promise(resolve => setTimeout(resolve, delayTime));
    this.#stateStore.setState('profile', data);
  }

  dropBoxClick() {
    const active = (this.#stateStore.getState('dropBox-on') as stateData).switch;
    this.#stateStore.setState('dropBox-on', {switch: !active});
  }

  protected onRender() {
    this._element?.addEventListener('click', () => this.dropBoxClick());
  }

  override template () {
    this.key = incrementUniqueKey();
    let picture = (this.#stateStore.getState('profile') as ProfileData).picture ;
    picture = picture==='' ? '/login.png' : picture;

    return html`
      <div data-id=${this.key} class="profile-container">
        <img class="profile-img" src=${picture.endsWith('/') ? picture.slice(0, -1) : picture} alt="유저 프로필 이미지"/>
        <svg  stroke-width="0" viewBox="0 0 24 24" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"></path></svg>

        ${this.dropBoxView}
      </div>
    `;
  }
}