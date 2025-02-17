import { html } from "../../lib/html";
import { View } from "../../lib/View";

interface DatePickerData {
  func: Function;
  pickedDate: pickedDateData;
}

interface pickedDateData {
  date : string
}

export class DatePicker extends View<DatePickerData> {
  arr_calendar : string[];

  constructor(public props : DatePickerData) {
    super(props);
    this.arr_calendar= [];
    
    this.setState("year",  (new Date()).getFullYear());
    this.setState('month', (new Date()).getMonth() + 1);
    this.setState("toggle", false);

    this.changeYearMonth((new Date()).getFullYear(), (new Date()).getMonth() + 1);
  }

  private checkLeapYear(): boolean {
    const year = this.getState('year');
    return (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0);
  }

  private getFirstDayOfWeek(year : number, month: number) {
    let str = "" 
    if(month < 10) str = "0" + month;

    return (new Date(year + "-" + str + "-01")).getDay();
  }

  private changeYearMonth(year : number, month: number) {
    let month_day = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    this.arr_calendar = [];

    //윤년이면 2월 29일
    if (month === 2 && this.checkLeapYear()) month_day[1] = 29; 

    // 첫 번째 요일 기준으로 빈 날짜 추가
    let first_day_of_week = this.getFirstDayOfWeek(year, month);
    for (let i = 0; i < first_day_of_week; i++) this.arr_calendar.push("");
    
    // 날짜 추가
    for(let i = 1; i <= month_day[month - 1]; i++) 
      this.arr_calendar.push(String(i));
    
    // 나머지 빈 날짜 추가
    let remain_day = 7 - (this.arr_calendar.length % 7);
    if (remain_day < 7) {
      for(let i = 0; i < remain_day; i++) 
        this.arr_calendar.push("");
    }
  }

  changeMonth(diff : number | null) {
    let month = this.getState('month');
    let year = this.getState('year');

    month = diff === null ? parseInt((document.getElementById('month')as HTMLSelectElement).value) : month + diff;

    if (month < 1) {
      month = 12;
      year -= 1;
    } else if (month > 12) {
      month = 1;
      year += 1;
    }
    
    this.changeYearMonth(year, month);
    this.setState("year",  year);
    this.setState('month', month);
  }

   toggleSwitch() {
    let toggle = this.getState('toggle');
    this.setState('toggle', !toggle);
  }

  renderCalendar() {
    let h = ['<tr>'];  
  
    this.arr_calendar.forEach((day, index) => {
      if (index && index % 7 === 0) h.push('</tr><tr>');
  
      h.push(`<td class="calendar-day" data-day="${day}">${day}</td>`);
    });
  
    h.push('</tr>'); 
    return h.join('');
  }

  private getTodayDate(day: string): string {
    return `${this.getState('year')}-${String(this.getState('month')).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  protected onRender(): void {
    this.renderCalendarContent();

    const dayElements = this._element!.querySelectorAll('.calendar-day');
    dayElements.forEach((dayEl) => {
      dayEl.addEventListener('click', () => this.addDayElEvent(event));
    });

  }

  private renderCalendarContent() {
    const newHtml = this.renderCalendar();
    
    const element = this._element!.querySelector('#tb_body') as HTMLElement;
    const yearEl = this._element!.querySelector('#year') as HTMLInputElement;
    const monthEl = this._element!.querySelector('#month') as HTMLSelectElement;
    const inputDateEl = this._element!.querySelector('#input-date') as HTMLInputElement;

    element.innerHTML = newHtml;
    yearEl.value = this.getState('year');
    monthEl.value = this.getState('month');
    inputDateEl.value = this.props.pickedDate?.date;
  }

  addDayElEvent(event: any) {
    const day = (event.target as HTMLElement).textContent; 
    if(!day) return;

    const inputDateEl = this._element!.querySelector('#input-date') as HTMLInputElement;
    inputDateEl.value = this.getTodayDate(day);

    this.toggleSwitch();
    this.props.func(this.getTodayDate(day)); 
  }


  override template() {
    let toggle = this.getState('toggle');
    
    return html`
    <div class="input-container">
        <input click=${() => this.toggleSwitch()} type="text" id="input-date" placeholder="날짜를 선택하세요..." readonly/>
          <div class="table-picker-container" style="visibility:${toggle ? "visible" : 'hidden'}"> 
            <div class="table-picker-header">
              <button id="button-date-prev" click=${() => this.changeMonth(-1)}>
                &#8592;
              </button>
              <input type="number" id = "year" style="width:80px;display:initial;", class="form-control" />
              <select id="month" class="form-control" style="width:80px;display:initial;" change=${() => this.changeMonth(null)}>
                <option value="1">1월</option>
                <option value="2">2월</option>
                <option value="3">3월</option>
                <option value="4">4월</option>
                <option value="5">5월</option>
                <option value="6">6월</option>
                <option value="7">7월</option>
                <option value="8">8월</option>
                <option value="9">9월</option>
                <option value="10">10월</option>
                <option value="11">11월</option>
                <option value="12">12월</option>
              </select>
              <button id="button-date-next" click=${() => this.changeMonth(+1)}>
                &#8594;
              </button>
            </div>
          <table> 
            <thead>
              <tr>
                <th>일</th>
                <th>월</th>
                <th>화</th>
                <th>수</th>
                <th>목</th>
                <th>금</th>
                <th>토</th>
              </tr>
            </thead>
            <tbody id="tb_body">
            </tbody>
          </table>
        </div>
    </div>
    `;
  }
}