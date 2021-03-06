# 채팅 어플리케이션 - 김동희

- 클라이언트: React
- 서버: Node.js, [Socket.io](https://socket.io)
- 테스트: [Jest](https://jestjs.io), [react-testing-library](https://github.com/kentcdodds/react-testing-library)

## [Live App](https://kakao-chat.surge.sh)

https://kakao-chat.surge.sh

위의 주소로 접속해서 앱을 바로 실행해볼 수 있습니다.
(백엔드 앱의 경우 [Heroku](https://www.heroku.com) 무료 계정으로 배포해서 처음 접속할 때 시간이 조금 걸릴 수 있습니다.)

## 사용방법

첫 화면에서 ID를 입력하여 접속합니다.

다른 사용자가 현재 사용 중인 ID는 사용할 수 없습니다. 사용자가 접속을 종료하면 다시 해당 ID를 사용할 수 있습니다.

입장가능한 6개의 채팅방이 있습니다.

자신의 메시지는 오른쪽, 타인의 메시지는 왼쪽에 표시됩니다.

텍스트 입력창 왼쪽에 있는 버튼을 이용해서 텍스트와 함께 이미지를 전송할 수 있습니다.

왼쪽 상단 화살표 버튼을 눌러 채팅방 목록으로 나갈 수 있습니다.

오른쪽 상단 더하기 버튼을 눌러 다른 사용자를 현 채팅방으로 초대할 수 있습니다.

초대장은 오른쪽 상단에 표시되며 수락 혹은 거절할 수 있습니다.

수락하면 해당 채팅방으로 입장하며, 거절하면 아무 일도 일어나지 않습니다.

## 프로젝트 설명

- 프론트엔드 코드 위치: `src/`
- 백엔드 코드 위치: `server/`

### 프론트엔드

URL 라우팅은 따로 적용하지 않고, 앱의 상태(state)에 따라 세 개의 화면 중 하나를 보여주도록 하였습니다. ID 입력/접속 이전에는 랜딩 화면, 접속 이후에는 채팅방 선택 여부에 따라 채팅과 관련된 2개의 화면 중 하나를 표시합니다. 선택된 채팅방이 있으면 해당 채팅방을, 그렇지 않으면 채팅방 목록을 표시합니다.

소스 코드의 배치도 이 아이디어를 따라 비슷한 구조로 구성하였습니다.

채팅과 관련된 기능 중 채팅방 입장, 퇴장, 메시지 수신, 초대 수신 등 서버가 보내는 이벤트를 받아서 처리합니다. 입장, 퇴장, 메시지 수신은 채팅 화면에 적절한 형태로 출력하도록 했으며, 초대장은 사용자 입력을 받기 위해 모달 형태로 화면에 출력하도록 하였습니다.

스타일링은 컴포넌트별로 스코프를 갖도록 하기 위해 [CSS 모듈](https://github.com/css-modules/css-modules)을 이용헀습니다.

[Animated](https://github.com/animatedjs/animated#readme)를 이용해 애니메이션을 처리했습니다.

### 백엔드

Socket 방식으로 클라이언트와 통신하도록 하였고, 구체적으로 Socket.io를 사용하였습니다. 클라이언트에서 오는 이벤트를 받아 다시 여러 소켓을 통해 뿌려주는 것이 주요 역할이며, 사용자 구분을 위해 기억할 필요가 있는 정보들은 DB 없이 메모리에 저장하였습니다.

## 실행 방법 (development 모드)

1. 클론

    ```sh
    $ git clone git@github.com:kimdhoe/chekhov.git`
    ```

2. 패키지 설치

    ```sh
    $ yarn install
    ```

3. 백엔드 서버 실행

    ```sh
    $ yarn dev-server
    ```

4. 프론트엔드 서버 실행

    ```sh
    $ yarn start
    ```

5. localhost:3000 접속

## 테스트

- 프론트엔드 코드 테스트

    ```sh
    $ yarn test
    ```

- 백엔드 코드 테스트

    ```sh
    $ yarn test:server
    ```

## 빌드 방법

1. 클론 및 패키지 설치

2. 프론트엔드 앱 빌드

    ```sh
    $ yarn build
    ```

3. 빌드 결과물은 `build/` 디렉토리에서 찾을 수 있고, 테스트용 서버 등으로 실행하실 수 있습니다.
    - e.g. [http-server](https://github.com/indexzero/http-server)
    - 백엔드 앱은 빌드 없이 바로 실행가능합니다.