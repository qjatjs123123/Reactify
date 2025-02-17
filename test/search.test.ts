import { fireEvent } from '@testing-library/dom';
import { SearchView } from '../src/components/search/SearchView';
import { SearchTableView } from '../src/components/search/components/SearchTableView';
import { enrollState } from '../src/main';
import { StateStore } from '../src/lib/StateStore';
import { SearchService } from '../src/components/search/business/SearchService';
import { ticketData } from './mock/data';

const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

interface Ticket {
  id: number;
  name: string;
  travelType: string;
  ticketDate: string;
  departureDate: string;
  canceled: boolean;
}

describe("search 로직 테스트", () => {
  let searchEl: SearchView;
  let stateStore : StateStore;
  let searchService : SearchService

  beforeAll(async () => {
    enrollState();
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,            // HTTP 요청이 성공했음을 표시
        status: 200,         // HTTP 상태 코드 추가
        json: () => (ticketData),
      })
    ) as jest.Mock;
    
    searchService = SearchService.getInstance();
    jest.spyOn(searchService, 'deleteTicketAPI').mockResolvedValue(undefined);

    searchEl = new SearchView();
    stateStore = StateStore.getInstance();
    searchService = SearchService.getInstance();
    
    
    document.body.appendChild(searchEl.render()!);
  });

  test("오늘 날짜와 출발 날짜가 7일 이내일 경우, 취소할 수 없다.", async () => {
    // Given: Mock 데이터를 불러온다.
    await searchService.getTicketAPI();
    
    // When: 렌더링된 페이징 버튼을 가져온다.
    const pageButtons = document.querySelectorAll('.cancel-btn') as NodeListOf<HTMLButtonElement>;
    fireEvent.click(pageButtons[0]);


    // Then: 취소 api가 호출되지 않는다.
    expect(searchService.deleteTicketAPI).not.toHaveBeenCalled();
  })

  test("오늘 날짜와 출발 날짜가 7일 이상일 경우, 취소할 수 있다.", async () => {
    // Given: Mock 데이터를 불러온다.
    await searchService.getTicketAPI();
    
    // When: 렌더링된 페이징 버튼을 가져온다.
    const pageButtons = document.querySelectorAll('.cancel-btn') as NodeListOf<HTMLButtonElement>;
    fireEvent.click(pageButtons[1]);

    // Then: 취소 api가 호출된다.
    expect(searchService.deleteTicketAPI).toHaveBeenCalled();
  })

  test("X 버튼을 클릭하면 현재  날짜 필터링이 제거된다.", async () => {
    // Given: Mock 데이터를 불러온다. 
    await searchService.getTicketAPI();
    // Given: datepicker UI를 visible로 바꾼다.
    const inputElement = document.querySelector('#input-date') as HTMLInputElement;
    fireEvent.click(inputElement);
    // Given: 1일을 클릭한다.
    const dayButton = document.querySelector(`[data-day="1"]`) as HTMLElement;
    fireEvent.click(dayButton);
    const beforeDate = (stateStore.getState('pickedDate') as any).date;

    await flushPromises();

    // When : X 버튼을 클릭한다.
    const pageButton = document.querySelector('.close-btn') as HTMLButtonElement;
    fireEvent.click(pageButton);
    

    // Then : after ''이 된다. before는 yyyy-mm-dd형식이다.
    const afterDate = (stateStore.getState('pickedDate') as any).date;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    expect(beforeDate).toMatch(dateRegex);
    expect(afterDate).toBe('');
  })
})