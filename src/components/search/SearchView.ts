import { html } from "../../lib/html";
import { View } from "../../lib/View";
import { SearchPickerView } from './components/SearchPickerView';
import { SearchTableView } from './components/SearchTableView';
import { SearchPageView } from './components/SearchPageView';
import { LoadingView } from "../common/LoadingView";
import { TimerView } from '../common/TimerView';

export class SearchView extends View<null> {
  private searchDateView : SearchPickerView;
  private searchTableView : SearchTableView;
  private searchPageView : SearchPageView;
  private loadingView : LoadingView;
  private timerView : TimerView

  constructor() {
    super(null);
    this.searchDateView = new SearchPickerView();
    this.searchTableView = new SearchTableView();
    this.searchPageView = new SearchPageView();
    this.loadingView = new LoadingView();
  }

  override template() {
    return html`
      <div>
        ${this.searchDateView}
        ${this.searchTableView}
        ${this.searchPageView}
      </div>
    `;
  }
}