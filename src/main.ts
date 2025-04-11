import { App } from './pages/App';
import { StateStore } from './lib/StateStore';
import getCurrentTime from './util/timer';
import { eventBind } from './util/eventBind';

const stateStore = StateStore.getInstance();
const $app = document.getElementById('app');

if ($app) {
  enrollState();
  eventBind();
  const app = new App();
  $app.append(app.render()!);
  
}

// recoil 변수 등록
export function enrollState() {
  stateStore.enroll('profile', {
    name : '',
    id: '',
    picture: ''
  });

  stateStore.enroll('dropBox-on', {
    switch: false
  });

  stateStore.enroll('timer', {
    time: getCurrentTime()
  })

  stateStore.enroll('nav', {
    nav : '발권 조회'
  })

  stateStore.enroll('ticket', {
    data : []
  })

  stateStore.enroll('page', {
    page : {
      currentPage: 1,
      totalPages: 1,
      totalResults: 1,
    }
  })

  stateStore.enroll('loading', {
    loading: true
  })

  stateStore.enroll('pickedDate', {
    date: ''
  })

  stateStore.enroll('snack', {
    message: '',
    switch: false,
  })

  stateStore.enroll('form', {
    name: '',
    tripType: '지구 저궤도 여행',
    departureDate: {
      date: ''
    },
    passengerCnt: 1,
    special: null
  })
}

