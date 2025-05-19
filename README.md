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

<br />



## 기술 블로그

  - [타입스크립트로 프레임워크 만들기 - 컴포넌트 편](https://qjatjs123123.tistory.com/18)
  - [타입스크립트로 프레임워크 만들기 - 상태관리 편](https://qjatjs123123.tistory.com/19)
  - [타입스크립트로 프레임워크 만들기 - 기타 편](https://qjatjs123123.tistory.com/20)


