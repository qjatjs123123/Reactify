export const funcMap = new Map();
let id = 1;
// 2. 이벤트 등록
export function registerHandler(id ,handler) {
  funcMap.set(id, handler);
}

export const getFuncId = () => id++;

export function eventBind() {

  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const handlerInfo = funcMap.get(target);
   
    if (handlerInfo) {
      handlerInfo(event);
    }
  });

}