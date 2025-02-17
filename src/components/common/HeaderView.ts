import { html } from "../../lib/html";
import { View } from "../../lib/View";
import { ProfileView } from "./ProfileView";

export class HeaderView extends View<null> {
  private profileView: ProfileView;

  constructor() {
    super(null);
    this.profileView = new ProfileView(); 
  }

  override template() {
    return html`
      <header class="header-container">
        <img class="logo-img" src="logo.png" alt="유저 프로필 이미지"/>
        <div>${this.profileView}</div>
      </header>
    `;
  }
}