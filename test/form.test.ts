import { TicketView } from "../src/components/ticket/TicketView"
import { StateStore } from "../src/lib/StateStore";
import { fireEvent } from '@testing-library/dom';
import { enrollState } from "../src/main";
import { TicketService } from '../src/components/ticket/business/TicketService';

describe("티켓 발급 form 테스트", () => {
  let ticketView: TicketView;
  let stateStore : StateStore;
  let ticketService : TicketService;

  beforeAll(() => {
    ticketView = new TicketView();
    stateStore = StateStore.getInstance();
    ticketService = TicketService.getInstance();
    enrollState();
    
    document.body.appendChild(ticketView.render()!);
    jest.spyOn(ticketView, 'setSpecialField').mockReturnValue(undefined);
  })

  test("이름 Input은 공백이거나, 숫자, 특수문자 포함되면 안된다.", () => {
    const testCases = ['', '1홍', '!홍',];

    testCases.forEach((testcase) => {
      expect(ticketService.isValidName(testcase)).toBe(false);
    })
  })

  test("이름 Input은 영어, 한글이여야 한다.", () => {
    const testCases = ['홍범선', 'abc', '홍 abc',];

    testCases.forEach((testcase) => {
      expect(ticketService.isValidName(testcase)).toBe(true);
    })
  })

  test("승객수는 0이하면 안된다.", () => {
    const testCases = [0, -1, -5];

    testCases.forEach((testcase) => {
      expect(ticketService.isValidPassengerCount(testcase)).toBe(false);
    })
  })

  test("승객수는 1이상이여야 한다.", () => {
    const testCases = [1, 5, 65];

    testCases.forEach((testcase) => {
      expect(ticketService.isValidPassengerCount(testcase)).toBe(true);
    })
  })

  test("출발 날짜는 yyyy-mm-dd 형식이 아니면 안된다.", () => {
    const testCases = ["", '201-55-1', '2022-1-1', '2022-011-02', '2022-01-011'];

    testCases.forEach((testcase) => {
      expect(ticketService.isValidDate(testcase)).toBe(false);
    })
  })

  // m 12 넘어가거나, dd 31 넘어갈 때 유효성검사 필요
  test("출발 날짜는 yyyy-mm-dd 형식이다.", () => {
    const testCases = ["2222-11-55", '2012-55-11'];

    testCases.forEach((testcase) => {
      expect(ticketService.isValidDate(testcase)).toBe(true);
    })
  })

  test("출발 날짜는 yyyy-mm-dd 형식이다.", () => {
    const testCases = ["2222-11-55", '2012-55-11'];

    testCases.forEach((testcase) => {
      expect(ticketService.isValidDate(testcase)).toBe(true);
    })
  })

  test("여행 타입은 특정 값 이여야 한다.", () => {
    const testCases = [
      '지구 저궤도 여행',
      '달 여행',
      '화성 여행'
    ]

    testCases.forEach((testcase) => {
      expect(ticketService.isValidTravelType(testcase)).toBe(true);
    })
  })

  test("여행 타입은 특정 값이 아니면 안된다.", () => {
    const testCases = [
      '지구 저궤도 여행1',
      '달 여행1',
      '화성 여행1'
    ]

    testCases.forEach((testcase) => {
      expect(ticketService.isValidTravelType(testcase)).toBe(false);
    })
  })

  test("기간은 1부터 10 사이여야 한다.", () => {
    const testCases = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10
    ];
  
    testCases.forEach((testCase : any) => {
      expect(ticketService.isValidTime(testCase)).toBe(true); // boolean 값 비교
    });
  });

  test("기간은 음수, 10 이상, 0, 문자면 안된다.", () => {
    const testCases = [
      -1, 11,12, 0, '', 'a', 'b'
    ];
  
    testCases.forEach((testCase : any) => {
      expect(ticketService.isValidTime(testCase)).toBe(false); // boolean 값 비교
    });
  });

  test("로봇 대여는 0 이상 5사이 수여야 한다..", () => {
    const testCases = [
      0, 1, 2, 3, 4, 5
    ];
  
    testCases.forEach((testCase : any) => {
      expect(ticketService.isValidMoon(testCase)).toBe(true); // boolean 값 비교
    });
  });
  
  test("로봇 대여는 음수, 영어, 한글, 특수문자면 안된다.", () => {
    const testCases = [
      -1, 6, 7, 'a', "홍", "!", ""
    ];
  
    testCases.forEach((testCase : any) => {
      expect(ticketService.isValidMoon(testCase)).toBe(false); // boolean 값 비교
    });
  });
})