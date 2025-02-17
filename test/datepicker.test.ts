import { DatePicker } from '../src/components/common/DatePicker';
import { fireEvent } from '@testing-library/dom';

// flushPromises 함수 정의
const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

describe(('datePicker 로직 테스트'), () => {
  let datePickerEl: DatePicker;

  beforeAll(() => {
    datePickerEl = new DatePicker({
      func: (newDate: string) => () => {},
      pickedDate: { date: "" },
    });
    document.body.appendChild(datePickerEl.render()!);
  });

  test('datePicker Input 태그를 클릭하면 toggle 상태가 반대가 된다.', async () => {
    // Given: 상태를 확인할 준비를 한다.
    const inputElement = document.querySelector('#input-date') as HTMLInputElement;
    const beforeToggle = datePickerEl.getState('toggle');

    // When: Input 태그를 클릭한다.
    fireEvent.click(inputElement);
    await flushPromises();

    // Then: toggle 상태가 반전되었는지 확인
    const afterToggle = datePickerEl.getState('toggle');
    expect(afterToggle).toBe(!beforeToggle);
  });

  test('toggle이 true일 때, visible 되고 DatePicker UI보인다.', async () => {
    // Given: 현재 토글 상태를 가져온다. && datePicker visibility 속성을 가져온다.
    const inputElement = document.querySelector('#input-date') as HTMLInputElement;
    const toggle = datePickerEl.getState('toggle');

    const tablePickerElement = document.querySelector('.table-picker-container') as HTMLElement;
    const visibility = getComputedStyle(tablePickerElement).visibility;

    // Then : toggle이 true이고 visible인지 확인
    expect(toggle).toBe(true);
    expect(visibility).toBe('visible');
  });

  test('toggle이 false일 때, hidden 되고 DatePicker UI 안 보인다.', async () => {
    // Given: 현재 토글 상태를 가져온다. && datePicker visibility 속성을 가져온다.
    const inputElement = document.querySelector('#input-date') as HTMLInputElement;

    // When: Input 태그를 클릭한다.
    fireEvent.click(inputElement);
    await flushPromises(); 

    const tablePickerElement = document.querySelector('.table-picker-container') as HTMLElement;
    const visibility = getComputedStyle(tablePickerElement).visibility;
    const toggle = datePickerEl.getState('toggle');

    // Then : toggle이 false이고 hidden인지 확인
    expect(toggle).toBe(false);
    expect(visibility).toBe('hidden');
  });

  test('<- 버튼을 클릭하면 월이 하나씩 감소하고, 1월에서는 12월로 돌아간다.', async () => {
    // Given: 시작 월을 설정
    const btnElement = document.querySelector('#button-date-prev') as HTMLButtonElement;
    const expectedMonths = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];  

    for (let month = 1; month <= 12; month++) {
        datePickerEl.setState("month", month);  
        await flushPromises();  

        // When: prev 버튼을 클릭
        fireEvent.click(btnElement);
        await flushPromises();  

        // Then: 정답 배열 맞는지 확인
        const newMonth = datePickerEl.getState("month");
        expect(newMonth).toBe(expectedMonths[month - 1]);
    }
  });

  test('-> 버튼을 클릭하면 월이 하나씩 증가하고, 12월에서는 1월로 돌아간다.', async () => {
    // Given: 시작 월을 설정
    const btnElement = document.querySelector('#button-date-next') as HTMLButtonElement;
    const expectedMonths = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1];  

    for (let month = 1; month <= 12; month++) {
        datePickerEl.setState("month", month);  
        await flushPromises();  

        // When: prev 버튼을 클릭
        fireEvent.click(btnElement);
        await flushPromises();  

        // Then: 정답 배열 맞는지 확인
        const newMonth = datePickerEl.getState("month");
        expect(newMonth).toBe(expectedMonths[month - 1]);
    }
  });

  test('<- 버튼을 클릭하면 1월에서 감소할 때, 연도는 1년 감소한다.', async () => {
    // Given: 시작 월을 설정
    const btnElement = document.querySelector('#button-date-prev') as HTMLButtonElement;
    datePickerEl.setState("month", 1);  
    const beforeYear = datePickerEl.getState('year');
    await flushPromises();  

    // When: prev 버튼을 클릭
    fireEvent.click(btnElement);
    await flushPromises();  

    // Then: 정답 배열 맞는지 확인
    const afterYear = datePickerEl.getState('year');
    expect(beforeYear - 1).toBe(afterYear);
  });

  test('-> 버튼을 클릭하면 12월에서 증가할 때, 연도는 1년 증가한다.', async () => {
    // Given: 시작 월을 설정
    const btnElement = document.querySelector('#button-date-next') as HTMLButtonElement;
    datePickerEl.setState("month", 12);  
    const beforeYear = datePickerEl.getState('year');
    await flushPromises();  

    // When: prev 버튼을 클릭
    fireEvent.click(btnElement);
    await flushPromises();  

    // Then: 정답 배열 맞는지 확인
    const afterYear = datePickerEl.getState('year');
    expect(beforeYear + 1).toBe(afterYear);
  });

  test('-> 날짜 버튼을 클릭하면 input태그에 yyyy-mm-dd로 표시한다.', async () => {
    // Given: 시작 월을 설정
    datePickerEl.setState("year", 2025); 
    datePickerEl.setState("month", 12); 
    await flushPromises();  
    const testCase = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // When: prev 버튼을 클릭
    testCase.forEach(async (day) => {
      const dayButton = document.querySelector(`[data-day="${day}"]`) as HTMLElement;
      fireEvent.click(dayButton);
      await flushPromises(); 

      // Then: 정답 배열 맞는지 확인
      const inputData = (document!.querySelector('#input-date') as HTMLInputElement).value;
      const expectData =  `2025-11-${day}`
      expect(inputData).toBe(expectData);
    })
    
  });

  
});
