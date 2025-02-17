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


describe("페이징 처리 로직 테스트", () => {
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
      
      stateStore = StateStore.getInstance();
      searchEl = new SearchView();
      searchService = SearchService.getInstance();
      
     
      document.body.appendChild(searchEl.render()!);
    });
    

    test("데이터가 24개일 때, 페이징 버튼은 총 3개(1, 2, 3) 된다.", async () => {
       // Given: Mock 데이터를 불러온다.
      await searchService.getTicketAPI();
      
      // When: 렌더링된 페이징 버튼을 가져온다.
      const pageButtons = document.querySelectorAll('.page-button') as NodeListOf<HTMLButtonElement>;

      const values = Array.from(pageButtons).map(button => button.textContent?.trim());


      // 개수, 내용을 비교한다.
      expect(values).toEqual(['1', '2', '3']);
      expect(pageButtons.length).toBe(3);
    });

    test("현재 1페이지에서 이전 버튼을 눌러도 1페이지가 된다.", async () => {
      //Given : Mock 데이터를 불러온다.
      await searchService.getTicketAPI();
      const beforeCurPage = (stateStore.getState("page") as any).page.currentPage;

     // When: 렌더링된 페이징 버튼을 가져온다.
     const pageButton = document.querySelector('.arrow-prev') as HTMLButtonElement;
     fireEvent.click(pageButton);
     const afterCurPage = (stateStore.getState("page") as any).page.currentPage;
 

     // Then: 1페이지인 건 변함이 없다.
     expect(beforeCurPage).toBe(afterCurPage);
   });
    
   test("현재 1페이지에서 다음 버튼을 누르면 2페이지가 된다.", async () => {
    //Given : Mock 데이터를 불러온다.
    await searchService.getTicketAPI();
    const beforeCurPage = (stateStore.getState("page") as any).page.currentPage;

   // When: 렌더링된 페이징 버튼을 가져온다.
   const pageButton = document.querySelector('.arrow-next') as HTMLButtonElement;
   fireEvent.click(pageButton);
   const afterCurPage = (stateStore.getState("page") as any).page.currentPage;


   // Then: 2페이지가 된다.
   expect(2).toBe(afterCurPage);
 });

  test("마지막 페이지 3에서 다음 버튼을 누르면 마지막 페이지 3이 된다.", async () => {
    //Given : Mock 데이터를 불러온다. 2번을 클릭하여 마지막 페이지로 간다.
    await searchService.getTicketAPI();
    const pageButton = document.querySelector('.arrow-next') as HTMLButtonElement;
    fireEvent.click(pageButton);
    fireEvent.click(pageButton);

  // When: 마지막 페이지에서 한번 더 누른다.
    fireEvent.click(pageButton);
    const afterCurPage = (stateStore.getState("page") as any).page.currentPage;

    // Then: 3페이지가 된다. 기존 그대로다.
    expect(3).toBe(afterCurPage);
  });

  test("현재 페이지에서 이전 버튼을 누르면 현재 페이지 - 1이 된다.", async () => {
    //Given : Mock 데이터를 불러온다. 2번을 클릭하여 3페이지로 이동한다.
    await searchService.getTicketAPI();
    const nextButton = document.querySelector('.arrow-next') as HTMLButtonElement;
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    const beforePage = (stateStore.getState("page") as any).page.currentPage;

  // When: 이전 페이지를 누른다.
    const prevButton = document.querySelector('.arrow-prev') as HTMLButtonElement;
    fireEvent.click(prevButton);

    const afterPage = (stateStore.getState("page") as any).page.currentPage;

    // Then: 현재 페이지 - 1이 된다. 즉 2페이지가 된다.
    expect(beforePage - 1).toBe(afterPage);
    expect(afterPage).toBe(2);
  });

  test("현재 페이지에서 이전 버튼을 누르면 현재 페이지 - 1이 된다.", async () => {
    //Given : Mock 데이터를 불러온다. 2번을 클릭하여 3페이지로 이동한다.
    await searchService.getTicketAPI();
    const nextButton = document.querySelector('.arrow-next') as HTMLButtonElement;
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    const beforePage = (stateStore.getState("page") as any).page.currentPage;

  // When: 이전 페이지를 누른다.
    const prevButton = document.querySelector('.arrow-prev') as HTMLButtonElement;
    fireEvent.click(prevButton);

    const afterPage = (stateStore.getState("page") as any).page.currentPage;

    // Then: 현재 페이지 - 1이 된다. 즉 2페이지가 된다.
    expect(beforePage - 1).toBe(afterPage);
    expect(afterPage).toBe(2);
  });

  test("2 페이지 버튼을 누르면 현재 페이지가 2가 된다.", async () => {
    //Given : Mock 데이터를 불러온다
    await searchService.getTicketAPI();
    const pageButtons = document.querySelectorAll('.page-button') as NodeListOf<HTMLButtonElement>;


  // When: 2 페이지 버튼을 누른다.
    fireEvent.click(pageButtons[1]);
    const afterPage = (stateStore.getState("page") as any).page.currentPage;
  

    // Then: 현재 페이지가 2페이지가 된다.
    expect(afterPage).toBe(2);
  });

  test("3 페이지 버튼을 누르면 현재 페이지가 3가 된다.", async () => {
    //Given : Mock 데이터를 불러온다
    await searchService.getTicketAPI();
    const pageButtons = document.querySelectorAll('.page-button') as NodeListOf<HTMLButtonElement>;


  // When: 2 페이지 버튼을 누른다.
    fireEvent.click(pageButtons[2]);
    const afterPage = (stateStore.getState("page") as any).page.currentPage;
  

    // Then: 현재 페이지가 3페이지가 된다.
    expect(afterPage).toBe(3);
  });
})