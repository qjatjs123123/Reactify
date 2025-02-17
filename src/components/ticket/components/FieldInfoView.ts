import { html } from "../../../lib/html";
import { StateStore } from "../../../lib/StateStore";
import { View } from "../../../lib/View";

interface fromData {
  name: string;
  tripType: string;
  departureDate: {
    date: string;
  };
  passengerCnt: number;
  special: string | null;
}

export class FieldInfoView extends View<null> {
  #stateStore: StateStore;

  constructor() {
    super(null);
    this.#stateStore = StateStore.getInstance();
  }

  protected onRender(): void {
    this.removeArray()
  }

  override template() {
    const formData = this.#stateStore.getState("form") as fromData;

    const fields = [
      { label: "이름", value: formData.name },
      { label: "여행 타입", value: formData.tripType },
      { label: "출발일", value: formData.departureDate.date },
      { label: "승객 수", value: formData.passengerCnt }
    ];

    return html`
      <div class="fieldinfo-container">
        ${fields.map(
          (field) => html`
            <div class="label-container">
              <label>${field.label}</label>
              ${field.value}
            </div>
          `
        )}
      </div>
    `;
  }
}
