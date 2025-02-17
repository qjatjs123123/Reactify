import { View } from "../../lib/View";
import { html } from "../../lib/html";
import { StateStore } from "../../lib/StateStore";
import { MemberSkeletonView } from './skeleton/MemberSkeletonView';
import { MemberInfoView } from './MemberInfoView';

interface ProfileData {
  name: string;
  id: string;
  picture: string;
}

export class MemberView extends View<null> {
  #stateStore;

  private memberSkeletonView : MemberSkeletonView;
  private memberInfoView : MemberInfoView

  constructor() {
    super(null);
    this.#stateStore = StateStore.getInstance();
    this.#stateStore.subscribe('profile', this);
    this.memberSkeletonView = new MemberSkeletonView();
    this.memberInfoView = new MemberInfoView();
    this.#stateStore.subscribe('dropBox-on', this);
  }

  override template() {
    const id = (this.#stateStore.getState('profile') as ProfileData).id;
    
    if (!id) 
      return html`
        ${this.memberSkeletonView}
      `;
    
    return html`
      ${this.memberInfoView}
    `;
  }
}