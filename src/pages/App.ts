import { View } from "../lib/View";
import { html } from "../lib/html";
import { HeaderView } from "../components/common/HeaderView";
import { MemberView } from "../components/common/MemberView";
import { BarView } from "../components/common/BarView";
import { TimerView } from "../components/common/TimerView";
import { NavView } from "../components/common/NavView";
import { SnackBarView } from "../components/common/SnackBarView";
import BrowserRoute from "./BrowserRoute";

export class App extends View<null> {
  private headerView : HeaderView; // ✅ 클래스 필드로 선언
  private memberView : MemberView;
  private timerView : TimerView;
  private barView : BarView;
  private navView : NavView;
  private snackBarView : SnackBarView;
  private browserRoute : BrowserRoute;

  constructor() {
    super(null);
    this.headerView = new HeaderView(); 
    this.memberView = new MemberView();
    this.timerView = new TimerView("TimerView_1");
    this.navView = new NavView();
    this.snackBarView = new SnackBarView();
    this.browserRoute = new BrowserRoute();
    this.barView = new BarView({marginTop: '32px', marginBottom: '26px'});
  }
  
  protected onRender(): void {
    this.removeArray();
  }


  override template() {
   

    return html`
    
      <div class="responsive_mainResponsive">
        ${this.headerView}
        <main class="section_responsive"> 
          ${this.memberView}
          ${this.barView}
          ${this.timerView} 
          ${this.navView}  
          ${this.browserRoute}
        </main>
        ${this.snackBarView}
      </div>
      
    `;
  }
}