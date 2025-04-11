const funcMap = new Map();
let id = 1;
// 2. 이벤트 등록
export function registerHandler(id ,handler) {
  funcMap.set(id, handler);
}

export const getFuncId = () => id++;

export function eventBind() {

  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const matchedEl = target.closest('[data-func-id]') as HTMLElement | null;
    if (!matchedEl) return;

    const funcId = Number(matchedEl.getAttribute('data-func-id'));
    const handlerInfo = funcId && funcMap.get(funcId);
    
    if (handlerInfo) {
      handlerInfo(event);
      // console.log("!23")
      //matchedEl.removeAttribute('data-func-id');
    }
  });

}