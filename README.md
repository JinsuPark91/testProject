본 저장소는 TeeSpace Platform 에 대한 저장소 입니다.

## 초기 설정

VSCode 기준으로 다음과 같은 Extension 을 설치 합니다.

- prettier - Code formatter
- ESLint

nodejs와 yarn 패키지를 설치합니다. 다음과 같이 의존 라이브러리를 설치합니다.

```
$ yarn install
```

## 사용 가능한 명령어

### `yarn start`

리액트 앱을 개발모드로 실행합니다. <br />
화면을 보기 위해서는 [http://localhost:3000](http://localhost:3000) 주소를 브라우저에서 접속하시면 됩니다.

코드를 수정하면 자동으로 화면을 다시 그립니다. 또한, 콘솔에서 코드 컨벤션 오류를 확인할 수 있습니다.

### `yarn test`

테스트 러너를 실행합니다.<br />
테스트 하는 방법은 [running tests](https://facebook.github.io/create-react-app/docs/running-tests) 을 참고하세요.

### `yarn build`

리액트 프로젝트를 운영환경으로 빌드 합니다. 최고의 성능을 낼 수 있도록 코드를 최적화 합니다.

배포에 대한 자세한 내용은 [deployment](https://facebook.github.io/create-react-app/docs/deployment) 을 참고하세요.

## 기여 방법

### git commit 메세지 컨벤션

git commit 메세지 컨벤션은 [본 문서](https://www.conventionalcommits.org/ko/v1.0.0/)를 기반으로 작성될 예정입니다.

- feat(module): Message
- refactor(module): Message
- fix(module): Message
- fix(module): #IMS-Number Message
- docs: Message

### Merge Request

작성 예정

### Code Review

작성 예정

## 주의

- 깨진 코드 (빌드 되지 않거나 동작하지 않는 코드)를 develop 브랜치에 머지 되면 안됩니다.
- pull 받으실 때는 꼭 rebase pull 을 사용하세요. (git pull --rebase origin)
