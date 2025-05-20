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


<br />



## 기술 블로그

  - [타입스크립트로 프레임워크 만들기 - 컴포넌트 편](https://qjatjs123123.tistory.com/18)
  - [타입스크립트로 프레임워크 만들기 - 상태관리 편](https://qjatjs123123.tistory.com/19)
  - [타입스크립트로 프레임워크 만들기 - 기타 편](https://qjatjs123123.tistory.com/20)


