<div align="center">
<img src="https://github.com/user-attachments/assets/4fefd1cc-a423-43b8-97ec-74a181629c5d" width="600"/>
  <br/>

  
### 나만의 자바스크립트 프레임워크 🖍️

[<img src="https://img.shields.io/badge/release-v0.0.0-ㅎㄱㄷ두?style=flat&logo=google-chrome&logoColor=white" />]() 
<br/> [<img src="https://img.shields.io/badge/프로젝트 기간-2025.02.14 ~ 현재-fab2ac?style=flat&logo=&logoColor=white" />]() <br/>

</div> 



## 📝 목차
- [1. 프로젝트 개요](#1-프로젝트-개요)
- [2. 프로젝트 화면 구성](#2-프로젝트-화면-구성)
- [3. 내가 사용한 기술 스택](#4-사용한-기술-스택)
- [4. 기술적 이슈와 해결 과정](#5-기술적-이슈와-해결-과정)

다음과 같은 목차로 구성되어 있습니다.


<br />

## 🚀 프로젝트 개요
리액트로 웹 개발을 하기 위해선 Recoil, Zustand, Redux와 같은 전역 상태 라이브러리를 학습하고, 다양한 라이브러리를 설치해야 합니다. <br/>
또한, 이러한 라이브러리의 별도의 번들 크기를 추가하기 때문에, 결국 최종 어플리케이션 용량이 커진다는 문제를 느꼈습니다.

이 과정이 번거롭고 불편하게 느껴졌고, **사용자들이 보다 쉽고 빠르게 개발할 수 있도록 리액트의 철학을 담은 프레임워크**를 만들고자 했습니다.

이 철학을 바탕으로 자바스크립트 프레임워크를 개발했고, 이 프레임워크로 직접 웹 개발을 진행했습니다.

<br />

## 🖥️ 직접 만든 프레임워크로 개발한 화면
| **조회 페이지** | **등록 페이지** | 
|:---:|:---:|
| <img src="https://github.com/user-attachments/assets/384f77b5-03be-4645-b3d5-968f8544d44f" width="250" height="250"/> | <img src="https://github.com/user-attachments/assets/fd39d163-5c7b-4920-9f81-ee8faee6bf30" width="250" height="250"/> |

<br />

## ⚙ 내가 사용한 기술 스택
<div>
  <img src="https://img.shields.io/badge/TypeScript-%233178C6.svg?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" />
</div>

<br />

## 🤔 기술적 이슈와 해결 과정
#### 1)  사용자가 편리하게 개발할 수 있는 컴포넌트 기반 프레임워크는 어떻게 만들어야 할까?
<details>
  <summary>📌 펼쳐보기 </summary>  
  <br />
  
  <strong>💡 가장 중점은 사용자가 편하게 개발할 수 있는 컴포넌트 구조를 만드는 것이며, 그 결과 React를 참고했습니다.  </strong>

  - 컴포넌트 내 `Array`를 조작합니다. 

    ```javascript
    // Array를 map을 통해 조작할 수 있습니다.
    
    ${DROPBOX_ITEM.map((item, index) => html`
      <div  class="nav-item ${item.name === activeNav ? 'active' : ''}" key=${index}>
        <span href="${item.location}">${item.name}</span>
      </div>
    `)} 
    ```
 - 컴포넌트 내 `Event`를 간편하게 바인딩합니다. 

    ```javascript
    // click 핸들러를 props로 전달하면, 해당 함수가 자동으로 바인딩됩니다.
    
    <div class="button-container">
      <button click=${() => this.props.func()} class="submit-btn">뒤로가기</button>
      <button click=${() => this.submit()} class="submit-btn">발권하기</button>
    </div>
    ```
- 컴포넌트를 재사용할 수 있습니다.

    ```javascript
    // 컴포넌트를 재사용할 수 있습니다.
    
    <header class="header-container">
      <img class="logo-img" src="logo.png" alt="유저 프로필 이미지"/>
      <div>${this.profileView}</div> // profileView 컴포넌트
    </header>
    ```

- React의 JSX 문법처럼 손쉽게 컴포넌트를 개발할 수 있도록 설계했습니다.
  
- 자세한 구현 사항은 **기술 블로그** 참고 부탁드립니다.

<br />

 📌 [태그 리터럴을 활용한 JSX 유사 컴포넌트](https://qjatjs123123.tistory.com/18)
 
</details>


#### 2) DOM 조작의 수를 최소화하기 위한 방법
<details>
  <summary>📌 펼쳐보기 </summary>  
  <br />
  
  <strong>💡불필요한 렌더링을 방지하고, 캐싱된 결과값을 재사용하며, DOM 조작은 배치 처리로 묶어 한 번에 수행한다.  </strong>

  - Object.is로 참조값을 비교해 상태 변화를 감지합니다.
    > 객체는 Immutable 해야 합니다. 그 이유는 깊은 객체 비교 비용이 많이 들기 때문입니다.
    
    > 상태 변경이 없으면 불필요한 렌더링이 발생하지 않습니다.
    
    ```javascript
    setState(key: string, value: unknown) {
      if (Object.is(this.state[key], value)) return;
      ...
    }
    ```

  - 계산된 DOM Element를 캐싱하여 재사용합니다.
    > React에서 React.Memo와 유사한 기능입니다.
    
    > 부모 컴포넌트가 렌더링되면, 하위 모든 컴포넌트들도 함께 렌더링됩니다. <br>
    이 때, 하위 컴포넌트 변경 여부에 따라서 캐싱된 DOM Element를 반환합니다.

    ```javascript
    render() : any{
      if (this.viewStore.isValidMemo(this)) return this.viewStore.getViewMemo(this);
      ...
    }
    ```

  - 자동으로 상태 변경을 배치 처리로 묶어 한 번에 수행합니다.
    > 이벤트 핸들러 내부에 비동기 함수가 포함될 때, 배치처리가 안되는 문제를 해결합니다.
    
    > 배치처리가 진행되는 시점은 콜스택이 비워지는 시점입니다.
    > 
    > <img src="https://github.com/user-attachments/assets/bb7383f3-7d8a-4b93-88ac-e1dda90cb5f7" width="300" />
    
    > 콜스택 범위에서 발생되는 상태 변경을 묶어 처리합니다.
    ```javascript
    setState(key: string, value: unknown) {
      ...
      this.queue.push([key, value]);
      if (!this.isBatching) {
        this.isBatching = true;
    
        Promise.resolve().then(() => {
          this.flush();
        })
      }
    }

    private flush() {
      while (this.queue.length > 0) {
        const [key, value] = this.queue.shift();
        this.state[key] = value;
      }
      // render 
    }
    ```
  - 자세한 구현 사항은 **기술 블로그** 참고 부탁드립니다.
<br />

 📌 [Auto Batching, 전역 상태 관리](https://qjatjs123123.tistory.com/19)
 
</details>

#### 3)  보일러플레이트 없이 간편하게 사용할 수 있는 전역 상태 관리
<details>
  <summary>📌 펼쳐보기 </summary>  
  <br />
  
  <strong>💡 보일러플레이트가 적고, Recoil처럼 프레임워크간 자연스럽게 어울리는 방식을 만들어야 한다.  </strong>

  - 옵저버 패턴
    
    > 상태가 변경되면, 옵저버 패턴을 통해 구독 중인 컴포넌트들이 자동으로 다시 렌더링되도록 했습니다.
    > <img src="https://github.com/user-attachments/assets/872bbede-847f-485d-9fd7-8567f77322b0" width="600" />
      ```javascript
      enroll<T>(key: string, state: T): void {
        this.#state[key] = state;
      }
  
    subscribe(key: string, component: View<unknown>) {
        if (!this.#subscribers[key]) {
          this.#subscribers[key] = new Set();
        }
        this.#subscribers[key].add(component);
      }
  
    #notify<K extends keyof subscribeType>(key : K) { 
        if (this.#subscribers[key]) {
          this.#subscribers[key].forEach((component) => {
            component._element?.replaceWith(component.render()!);
          });
        }
      }
      ```
    >
  - 싱글톤 패턴
    
    > 애플리케이션 전역에서 하나의 인스턴스만 존재해야 하며, 모든 컴포넌트에서 접근할 수 있어야 합니다.
      ```javascript
      constructor() {
        if (StateStore.#instance) return StateStore.#instance;      
        StateStore.#instance = this;
      }
    
      static getInstance() {
        if (!StateStore.#instance) StateStore.#instance = new StateStore();
        return StateStore.#instance;
      }
      ```

 - 자세한 구현 사항은 **기술 블로그** 참고 부탁드립니다.
 
 <br />
 
  📌 [전역 상태 관리](https://qjatjs123123.tistory.com/19)
 
</details>

#### 4)  메모리 누수 문제를 어떻게 개선할 것인가?
<details>
  <summary>📌 펼쳐보기 </summary>  
  <br />
  
  <strong>💡 사용자가 타이머와 같은 이벤트 함수를 쉽게 등록하고 정리할 수 있어야 하며, 내부적으로 메모리도 효율적으로 관리되어야 한다.  </strong>

  - mount 시점에 이벤트를 등록할 수 있습니다.
    
    > 컴포넌트가 마운트될 때, 사용자가 onRender 함수를 오버라이드함으로써 원하는 로직을 실행할 수 있습니다.
    
    > 마운트 시점은 replaceWith가 호출된 직후 시점입니다.
    
    > replaceWith는 새로운 DOM 요소를 기존 DOM 요소 교체합니다.
    >
    > <img src="https://github.com/user-attachments/assets/24a77790-37ed-4735-b960-05e9a54a1570" width="400" />
      ```javascript  
      protected onRender(): void {
        this.timer = setInterval(() => {
          // 타이머 함수 로직
        }, 1000);
      }
      ```
    >
  - unmount 시점에 등록한 이벤트를 정리할 수 있습니다.
    
    > 컴포넌트가 언마운트될 때, 사용자가 onUnmount 함수를 오버라이드함으로써 원하는 로직을 실행할 수 있습니다.
    
    > 언마운트 시점은 replaceWith가 호출되기 직전 시점입니다.
    
    > replaceWith를 하게 되면 기존 DOM 요소는 없어지기 때문입니다.
    >
    > <img src="https://github.com/user-attachments/assets/c488f10f-f29e-400f-91b6-350dcb7768ac" width="400" />  
      ```javascript
      protected onUnmount(): void {
        // 해당 컴포넌트를 캐싱해야지 기존 DOM에 등록된 이벤트 함수를 해제할 수 있다.
        const prev_view = this.viewStore.getViewMap(this._viewId) 
      
        if (prev_view) {
          clearInterval(prev_view.timer);
          prev_view.timer = null;
        }
      }
      ```
  - 이벤트 위임을 내부적으로 적용하여 메모리 최적화를 진행합니다.

    > document 요소에 이벤트 리스너가 등록함으로써 불필요한 리스너 메모리를 줄일 수 있습니다.

    > 왜냐하면, 각 요소마다 이벤트 리스너를 등록하는 것이 아니라 이벤트 버블링 트릭을 사용하여 이벤트 리스너를 하나만 등록할 수 있기 때문입니다.
    > <img src="https://github.com/user-attachments/assets/36217dee-7873-44e3-9f15-eda89c6c06d1" width="500" />  
      ```javascript
     export const funcMap = new Map();
    
      export function registerHandler(id ,handler) {
        funcMap.set(id, handler);
      }
      
      export function eventBind() {
        document.addEventListener('click', (event) => {
          const target = event.target as HTMLElement;
          const handlerInfo = funcMap.get(target);
         
          if (handlerInfo) handlerInfo(event);      
        });
      }
      ``` 

 - 자세한 구현 사항은 **기술 블로그** 참고 부탁드립니다.
 
 <br />
 
  📌 [이벤트 위임, 메모리 누수 해제](https://qjatjs123123.tistory.com/58)
 
</details>

#### 5)  Dynamic Import + Suspense를 이용한 컴포넌트 지연 로딩
<details>
  <summary>📌 펼쳐보기 </summary>  
  <br />
  
  <strong>💡 필요할 때 컴포넌트를 동적으로 Import 할 수 있어야 하며, 그 과정에서 fallback UI를 보여주어야 한다.  </strong>

  - 동적으로 컴포넌트를 Import 할 수 있습니다.

    > 다이나믹 임포트를 하게 되면 Promise 객체를 반환합니다. <br />
    > Promise 결과를 처리하는 Suspense 클래스로 throw 해줍니다.
    ```javascript
    browserRouter() {
      const path = window.location.pathname;
  
      if (path === "/") {
        throw import("../components/search/SearchView");
      } else if (path === "/ticket") {
        throw import("../components/ticket/TicketView");
      }
    }
    ```
 - Suspense 클래스를 통해 로딩하는 동안 fallback UI를 보여줍니다.

   > try - catch문으로 throw한 Promise를 처리합니다.
   
   > pending 상태, fallback UI로 초기화가 되지만, 결과를 받으면 fullfilled 상태, 결과를 받은 컴포넌트 UI를 저장합니다. 

   > 상태에 따라 UI를 보여줍니다.
    ```javascript
      export default class Suspense extends View<null> {
      BrowserRoute: any;
      constructor(browserRoute) {
        // 초기에 pending 상태, fallback UI를 설정합니다.
        this.setState("state", "pending");
        this.setState("view", html` <div>pending...</div> `);
    
        try {
          this.BrowserRoute();
        } catch (promise) {
          promise.then((module) => {
            // 결과를 받으면 fullfilled 상태, 기존 UI를 보여줍니다.
            this.setState("state", "fullfilled");
            const { SearchView, TicketView } = module;
    
            if (SearchView) this.setState("view", new SearchView());
            else this.setState("view", new TicketView());
          });
        }
      }
    
      override template() {
        const state = this.getState("state");
        const view = this.getState("view");
    
        switch (state) {
          case "pending":
            return html`${view}`;
          case "fullfilled":
            return html`${view}`;
          default:
            return html`<div>error</div>`;
        }
      }
    }
    ```
  
- 자세한 구현 사항은 **기술 블로그** 참고 부탁드립니다.

<br />

 📌 [Suspense를 이용한 Dynamic Import](https://qjatjs123123.tistory.com/37)
 
</details>
<br />


## 기술 블로그

  - [타입스크립트로 프레임워크 만들기 - 컴포넌트 편](https://qjatjs123123.tistory.com/18)
  - [타입스크립트로 프레임워크 만들기 - 상태관리 편](https://qjatjs123123.tistory.com/19)
  - [타입스크립트로 프레임워크 만들기 - 기타 편](https://qjatjs123123.tistory.com/20)


