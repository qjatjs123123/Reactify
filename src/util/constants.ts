let UNIQUE_KEY = 0;

const DROPBOX_ITEM = [
  { name: '발권 조회', location: '/' },
  { name: '발권 하기', location: '/ticket' }
];

export const TRAVEL_TYPE = [
  '지구 저궤도 여행',
  '달 여행',
  '화성 여행'
]

export const SPEICAL_EARTH_TYPE = [
  '우주 유영',
  '우주 정거장 방문',
  '무중력 체험'
]


export function getUniqueKey() {
  return UNIQUE_KEY;
}

export function incrementUniqueKey() {
  return UNIQUE_KEY++;
}

export const ERROR_MESSAGE = {
  cancel : "출발 일주일 내에는 취소가 불가능합니다.",
  nameInput : "영어와 한글로 된 이름을 입력해주세요.",
  dateInput: "날짜를 선택하세요.",
  passCntInput: "1이상 숫자만 입력하세요.",
  tripTypeInput : '여행 타입을 선택하세요.',
  specialInput: '특별 타입을 선택해주세요.',
  specialMars: '1부터 10사이 숫자만 입력하세요.',
  specialMoon: '0부터 5사이 숫자만 입력하세요.'
}

export const NAME_EXG = /^(?!\s*$)[a-zA-Zㄱ-ㅎ가-힣\s]+$/
export const DATE_EXG = /^\d{4}-\d{2}-\d{2}$/;

export default DROPBOX_ITEM;