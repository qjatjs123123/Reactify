import { View } from "../../../lib/View";
import { html } from "../../../lib/html";

export class MemberSkeletonView extends View<null> {
  constructor() {
    super(null);

  }

  override template() {
    return html`
      <div class="member-container">
        <div class="skeleton profile-img"></div>
        <div class="member-info">
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text"></div>
        </div>
      </div>
    `;
  }
}