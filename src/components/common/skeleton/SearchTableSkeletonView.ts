import { View } from "../../../lib/View";
import { html } from "../../../lib/html";
import { LoadingView } from "../LoadingView";

export class SearchTableSkeletonView extends View<null> {
  private loadingView : LoadingView;

  constructor() {
    super(null);
    this.loadingView = new LoadingView();
  }

  override template() {
    const emptyArray = new Array(10).fill(null);
    let newHtml = `
      <table class="ticket-table">
        <thead>
          <tr>
            <th>고객 이름</th>
            <th>여행 타입</th>
            <th>발권 날짜</th>
            <th>출발 날짜</th>
            <th>취소 버튼</th>
          </tr>
        </thead>
        <tbody>
    `;

    emptyArray.forEach(() =>
      newHtml += `
        <tr>
          <td ></td>
          <td ></td>
          <td style="display: flex; justify-content: center; align-items: center;">
            <div class="loading-spinner"></div>
          </td>
          <td ></td>
          <td>
          <button class="cancel-btn" style="visibility: hidden; pointer-events: none;">취소</button>
        </td>
        </tr>
      `
    );

    newHtml += '</tbody></table>';

    return html`
      ${newHtml}
    `;
      }
}