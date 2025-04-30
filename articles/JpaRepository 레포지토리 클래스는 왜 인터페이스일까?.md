---
layout: post
title: "JpaRepository 레포지토리 클래스는 왜 인터페이스일까?"
tags: Backend
lastmod: 2025-01-22
sitemap:
  changefreq: daily
  priority: 0.8
---

인터페이스와 구현체와의 관계에 대해 공부하면서 구현체가 2개 이상인 경우에는 인터페이스를 두고 이를 상속받아 구현하는 것이 합리적으로 이해가 되었는데, 구현체가 단 1개인 경우에는 왜 인터페이스를 둬야하는지에 대해 의문이 생겼습니다.

이에 대해서는 **'Unit Testing'** 책을 학습하면서 궁금했던 걸 해소했는데요! 구현이 하나뿐인 인터페이스를 사용하는 것이 타당한 경우는, **테스트를 할 때 목을 사용하기 위한 것뿐**이라는 것을 알게 됐습니다.

여기서 또 다른 의문이 생겼습니다. 🤨

일반적으로 웹 서버 개발을 할 때 인터페이스를 주로 사용하는 경우가 `JpaRepository`를 상속받아 레포지토리 클래스를 만드는 경우인데요. 이는 Spring에서 자동으로 생성해주는 구현체도 하나뿐이며 **데이터베이스는 관리 의존성에 해당**하기 때문에 테스트에서도 (목으로 대체하지 않고) 실제 인스턴스를 사용해야 합니다. 그렇다면 남은 이유는 `Spring Data JPA` 의존성의 내부 구현에 의해서 인터페이스 클래스로 작성을 해야"**만**" 하기 때문인 것으로 추측하였습니다. 따라서 `Spring Data JPA` 에서 레포지토리 클래스의 구현체를 만드는 방식을 찾아보겠습니다.⛳️

---

## 🌳JPA Repository 들 찾기

- Spring 은 런타임에 모든 클래스와 인터페이스를 스캔합니다.
  - 참고로 `@Repository` 애노테이션이 이 스캔 과정에서 요구되는건 아니라고 합니다.
  - JPARepository를 상속하는 인터페이스는 Spring 이 자동으로 레포지토리 컴포넌트로 인식합니다.

> 🧩 그럼 `@Repository` 의 용도는 뭔가요?
> **- 컴포넌트 스캔**: `@Component` 의 특수화된 형태로, Spring이 자동으로 빈으로 등록할 수 있게 합니다.
> **- 예외 변환**: Spring의 DataAccessException 계층으로 예외를 자동 변환하는 기능이 있습니다.
> **- AOP 적용 대상**

- **Spring 은 모든 레포지토리 클래스를 스캔한 후에, 이에 부합하는 Proxy 클래스를 생성합니다.**
  - 이 프록시 클래스는 요청을 올바른 레포지토리 메서드로 라우팅하는 역할을 가지고 있습니다.

Proxy 클래스는 뭐냐... 저도 몰라서 Proxy 디자인 패턴부터 짚고 다음 단계로 넘어가보겠습니다.

## 🌳 프록시 디자인 패턴이란?

프록시 패턴은 다른 객체에 대한 대리자 또는 자리표시자 역할을 하는 객체를 제공합니다. 프록시는 원래 객체에 대한 접근을 제어하며, 원본 객체에 요청이 전달되기 전이나 후에 추가적인 작업을 수행할 수 있습니다.

### 사용 예시

- 접근 제어
  - e.g.) 서드파티 라이브러리의 메서드에 대해서 지정한 권한을 가진 사용자만 호출할 수 있도록
- 로깅 또는 모니터링
- 캐싱
- 지연 로딩 (lazy loading)

## 🌳 프록시 클래스가 어떻게 작동할까?

![](https://velog.velcdn.com/images/adorableco/post/bbcea511-de1f-48b3-825c-c33230315dd7/image.png)

- `CustomJpaRepository` 는 개발자가 작성한 레포지토리 클래스

&nbsp;

#### SimpleJpaRepository

- `Spring Data JPA` 에서 나온 클래스입니다.
- 데이터베이스와의 상호작용을 위해 `EntityManager` 를 사용합니다.
- `JpaRepository` 의 구현체입니다.
- ✏️ 상세 구현 코드를 확인해보면 `@Repository` 애노테이션이 달려있습니다.

&nbsp;

#### CustomJpaRepositoryProxy

- Spring 에서 자동 생성하는 프록시 클래스
- `CustomJpaRepository` (개발자가 만든 레포지토리 클래스) 에 method 요청이 들어오면 인터셉트 후 `SimpleJpaRepository` 로 리디렉트합니다.
- ✅✅ 이 프록시 클래스도 결국에는 기존(?) 클래스를 구현하는 형태이기 때문에 기존 클래스인 `CustomJpaRepository` 클래스가 인터페이스여야 하는 것입니다!!

&nbsp;

#### JpaRespository

- Spring Data JPA에서 제공하는 인터페이스입니다.
- CRUD 작업, 페이징, 정렬 등의 기본적인 데이터 액세스 기능을 정의합니다.

---

## 🥧 결론

"**JPARepository 를 상속받아 만드는 레포지토리 클래스는 왜 인터페이스일까?**" 라는 질문의 답은..

JPARepository가 내부적으로 프록시 클래스를 자동으로 생성하여, 이를 통해 올바른 (query) method 로 요청을 리디렉트시키는 구조이기 때문이었습니다!

&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;

참고 사이트: https://levelup.gitconnected.com/jparepository-how-is-it-implemented-2afc6751b47e
