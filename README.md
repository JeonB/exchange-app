# Exchange App

실시간 환율 정보를 확인하고 간편하게 환전할 수 있는 웹 애플리케이션입니다.

## 프로젝트 실행 방법

### 필수 요구사항

- Node.js 18 이상
- pnpm (권장) 또는 npm, yarn

### 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev
```

### 배포

<https://exchange-app-gamma.vercel.app/>

## 구현한 기능

### 1. 인증 시스템

- **이메일 기반 로그인**: 간단한 이메일 입력으로 로그인
- **자동 인증 만료 처리**: 토큰 만료 시 자동 로그아웃 및 리다이렉트
- **보안 처리**: 서버 액션을 통한 안전한 인증 처리

### 2. 환율 정보 조회

- **실시간 환율 표시**: 최신 환율 정보를 실시간으로 조회
- **환율 변화율 표시**: 전일 대비 변화율을 퍼센트로 표시
- **다중 통화 지원**: USD, JPY 등 다양한 통화 지원

### 3. 환전 기능

- **양방향 환전**: 원화 ↔ 외화 양방향 환전 지원
- **실시간 견적 조회**: 환전 금액 입력 시 실시간으로 환전 결과 조회
- **환율 적용**: 최신 환율을 적용한 정확한 환전 금액 계산
- **지갑 잔액 확인**: 환전 전 지갑 잔액 확인 및 검증

### 4. 지갑 관리

- **다중 통화 잔액 표시**: 원화 및 외화 잔액을 한눈에 확인
- **실시간 잔액 업데이트**: 환전 후 즉시 잔액 업데이트
- **잔액 포맷팅**: 천 단위 구분 기호를 사용한 가독성 높은 표시

### 5. 환전 내역 조회

- **주문 내역 목록**: 모든 환전 주문 내역을 시간순으로 표시
- **상세 정보 표시**: 환전 통화, 금액, 적용 환율, 주문 시간 등 상세 정보 제공
- **로딩 상태 관리**: Suspense를 활용한 부드러운 로딩 경험

### 6. 반응형 디자인

- **모바일/태블릿/데스크톱 최적화**: 모든 화면 크기에 최적화된 레이아웃
- **그리드 레이아웃**: 데스크톱에서는 2열 그리드, 모바일에서는 1열 스택 레이아웃
- **반응형 타이포그래피**: 화면 크기에 따라 조절되는 텍스트 크기

### 7. 사용자 경험 최적화

- **Toast 알림 시스템**: 성공/실패/정보 메시지를 사용자 친화적으로 표시
- **로딩 상태 표시**: 비동기 작업 중 명확한 로딩 피드백
- **에러 처리**: 사용자 친화적인 에러 메시지 및 처리
- **폼 유효성 검사**: Zod 스키마를 활용한 타입 안전한 폼 검증

## 기술 스택

| 분류            | 기술                        |
| --------------- | --------------------------- |
| Framework       | Next.js 16.1.1 (App Router) |
| UI Library      | React 19.2.3                |
| Language        | TypeScript 5                |
| Styling         | Tailwind CSS 4              |
| Server State    | TanStack Query 5            |
| Form Validation | Zod 4.3.5                   |
| UI Components   | shadcn/ui (커스텀 컴포넌트) |
| Font            | Pretendard Variable         |
| Package Manager | pnpm                        |

## 기술적 의사결정 및 이유

### 1. Next.js 16 App Router

**선택 이유**: 최신 Next.js 기능 활용 및 서버 컴포넌트 지원

**장점**:

- 서버 컴포넌트로 초기 로딩 성능 향상
- 파일 기반 라우팅으로 직관적인 구조
- Server Actions를 통한 타입 안전한 서버 통신
- 내장 폰트 최적화 (`next/font`)

### 2. TanStack Query 5

**선택 이유**: 서버 상태 관리 및 캐싱 최적화

**장점**:

- 자동 캐싱 및 리페칭으로 불필요한 API 호출 감소
- 로딩/에러 상태를 자동으로 관리
- 낙관적 업데이트 지원
- TypeScript 지원 우수

### 3. Server Actions

**선택 이유**: 타입 안전한 서버 통신 및 간편한 에러 처리

**장점**:

- 클라이언트와 서버 간 타입 안전성 보장
- 별도의 API 라우트 파일 불필요
- 자동 에러 처리 및 리다이렉트 지원
- React 19와 완벽한 통합

### 4. Zod 스키마 검증

**선택 이유**: 런타임 타입 검증 및 폼 유효성 검사

**장점**:

- TypeScript 타입과 런타임 검증의 일관성
- 사용자 친화적인 에러 메시지 생성
- 서버/클라이언트 양쪽에서 동일한 검증 로직 사용

### 5. Tailwind CSS 4

**선택 이유**: 빠른 개발과 일관된 디자인 시스템

**장점**:

- 유틸리티 우선 접근으로 빠른 스타일링
- Typography 컴포넌트로 텍스트 스타일 중앙 관리
- 반응형 디자인 구현 용이
- 작은 번들 크기

### 6. React Compiler

**선택 이유**: 자동 최적화 및 성능 향상

**장점**:

- 자동 메모이제이션으로 불필요한 재렌더링 방지
- 개발자가 수동으로 최적화할 필요 감소

## 프로젝트 구조

```bash
exchange-app/
├── app/                         # Next.js App Router
│   ├── page.tsx                # 홈 페이지 (환전)
│   ├── history/
│   │   └── page.tsx            # 환전 내역 페이지
│   ├── login/
│   │   └── page.tsx            # 로그인 페이지 (서버 컴포넌트)
│   ├── layout.tsx              # 루트 레이아웃
│   ├── globals.css             # 전역 스타일
│   └── fonts/                  # 폰트 파일
│       └── PretendardVariable.woff2
│
├── components/
│   ├── exchange/               # 환전 관련 컴포넌트
│   │   ├── exchange-form.tsx   # 환전 폼
│   │   ├── exchange-rates.tsx  # 환율 정보
│   │   └── wallet-balance.tsx  # 지갑 잔액
│   ├── history/                # 내역 관련 컴포넌트
│   │   ├── history-header.tsx  # 내역 헤더
│   │   └── order-list.tsx     # 주문 목록
│   ├── layout/                 # 레이아웃 컴포넌트
│   │   └── navigation.tsx     # 네비게이션
│   ├── login/                  # 로그인 관련 컴포넌트
│   │   └── login-form.tsx      # 로그인 폼 (클라이언트 컴포넌트)
│   ├── ui/                     # 재사용 UI 컴포넌트
│   │   ├── button.tsx          # 버튼
│   │   ├── card.tsx            # 카드
│   │   ├── input.tsx           # 입력 필드
│   │   ├── toast.tsx           # 토스트 알림
│   │   └── typography.tsx      # 타이포그래피 시스템
│   └── providers/              # Context Providers
│       ├── query-provider.tsx  # TanStack Query
│       └── toast-provider.tsx  # Toast 알림
│
├── lib/
│   ├── actions/                # Server Actions
│   │   ├── auth.ts            # 인증 액션
│   │   ├── exchange.ts         # 환전 액션
│   │   ├── orders.ts           # 주문 조회 액션
│   │   └── wallet.ts           # 지갑 조회 액션
│   ├── hooks/                  # Custom Hooks
│   │   ├── use-exchange-form.ts    # 환전 폼 훅
│   │   ├── use-exchange-rates.ts   # 환율 조회 훅
│   │   ├── use-orders.ts           # 주문 조회 훅
│   │   └── use-wallet.ts           # 지갑 조회 훅
│   ├── constants/             # 상수
│   │   └── api.ts              # API 설정
│   ├── schemas/                # Zod 스키마
│   │   ├── auth.schemas.ts     # 인증 스키마
│   │   └── exchange.schemas.ts # 환전 스키마
│   ├── types/                  # TypeScript 타입
│   │   ├── api.types.ts        # API 공통 타입
│   │   ├── auth.types.ts       # 인증 타입
│   │   ├── errors.types.ts     # 에러 타입
│   │   ├── exchange.types.ts   # 환전 타입
│   │   └── wallet.types.ts     # 지갑 타입
│   ├── utils/                  # 유틸리티 함수
│   │   ├── api-client.ts       # API 클라이언트
│   │   ├── cn.ts               # 클래스 병합 유틸
│   │   ├── format.ts           # 포맷팅 유틸
│   │   └── wallet.ts           # 지갑 유틸
│   └── http.ts                 # HTTP 유틸리티
│
├── proxy.ts                    # 개발 프록시 설정
├── next.config.ts              # Next.js 설정
├── postcss.config.mjs          # PostCSS 설정
├── tsconfig.json               # TypeScript 설정
├── pnpm-workspace.yaml         # pnpm 워크스페이스 설정
└── package.json                # 프로젝트 의존성
```

## 아키텍처 특징

### 서버/클라이언트 컴포넌트 분리

- **서버 컴포넌트 우선**: 기본적으로 서버 컴포넌트로 구현
- **클라이언트 컴포넌트 분리**: 상호작용이 필요한 경우에만 클라이언트 컴포넌트로 분리
  - 예: `LoginForm`은 클라이언트 컴포넌트, `LoginPage`는 서버 컴포넌트
- **Suspense 경계**: `useSearchParams()` 등 클라이언트 전용 훅 사용 시 Suspense로 감싸기

### 타입 안전성

- **엄격한 TypeScript**: `any` 타입 사용 금지
- **Zod 스키마**: 런타임 타입 검증
- **Server Actions**: 타입 안전한 서버 통신

## 주요 컴포넌트 설명

### 상태 관리 흐름

```text
사용자 액션 → useMutation/useQuery (TanStack Query)
             ↓
         Server Action (lib/actions/)
             ↓
         API 호출 (lib/utils/api-client.ts)
             ↓
         타입 안전한 응답 처리
             ↓
         UI 자동 업데이트
```

### 인증 흐름

```text
로그인 요청 → Server Action (auth.ts)
             ↓
         API 인증
             ↓
         쿠키에 토큰 저장
             ↓
         보호된 페이지로 리다이렉트
```

### 환전 흐름

```text
환전 금액 입력 → 실시간 견적 조회 (useExchangeForm)
             ↓
         환전 실행 → Server Action (exchange.ts)
             ↓
         주문 생성 및 지갑 업데이트
             ↓
         성공 알림 및 잔액 갱신
```
