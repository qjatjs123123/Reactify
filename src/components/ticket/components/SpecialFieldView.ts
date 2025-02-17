import { html } from "../../../lib/html";
import { View } from "../../../lib/View";
import { EarthFieldView } from "./EarthFieldView";
import { MarsFieldView } from "./MarsFieldView";
import { MoonFieldView } from "./MoonFieldView";
import { StateStore } from "../../../lib/StateStore";
import { FieldInfoView } from "./FieldInfoView";
import { BarView } from '../../common/BarView';

interface fromData {
  name: string;
  tripType: string;
  departureDate: {
    date: string;
  };
  passengerCnt: number;
  special: string | null; 
}

interface SpecialFieldViewData {
  func : Function
}

export class SpecialFieldView extends View<SpecialFieldViewData> {
  #stateStore;
  private earthFieldView : EarthFieldView;
  private marsFieldView : MarsFieldView;
  private moonFieldView : MoonFieldView;
  private fieldInfoView : FieldInfoView;
  private barView : BarView

  constructor(props : SpecialFieldViewData) {
    super(props);
    this.#stateStore = StateStore.getInstance();
    this.earthFieldView = new EarthFieldView({func: () => this.props.func()});
    this.marsFieldView = new MarsFieldView({func: () => this.props.func()});
    this.moonFieldView = new MoonFieldView({func: () => this.props.func()});
    this.fieldInfoView = new FieldInfoView();
    this.barView = new BarView({marginTop: '40px', marginBottom: '40px'});
  }

  override template() {
    const tripType = (this.#stateStore.getState('form') as fromData).tripType;
    return html`
      <div class="form-container">
        ${this.fieldInfoView}
        ${this.barView}
        ${tripType === '지구 저궤도 여행' 
          ? this.earthFieldView 
          : tripType === '달 여행' 
          ? this.moonFieldView 
          : this.marsFieldView}
            
      </div>
    `;
  }
}