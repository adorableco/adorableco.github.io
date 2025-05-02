---
layout: post
title: "디자인 패턴 탐구 - 싱글톤(Singleton)"
tags: Design Pattern
lastmod: 2025-05-02
sitemap:
  changefreq: daily
  priority: 0.8
---

예전부터 디자인 패턴 공부를 얕게 오래오래 해왔는데, 뭔가 머리 속에 잘 안남아있는 것 같아서 이번에는 제대로 기록해두면서 확실하게 공부해보려 합니다.

![](https://velog.velcdn.com/images/adorableco/post/f7900c88-8aee-44d6-a7bb-89f62ab0ef89/image.png)

그 첫번째 주인공은 싱글톤(Singleton) 패턴이십니다 ~ 🎊👏

## 싱글톤 패턴이란?

> 하나의 클래스에 오직 하나의 인스턴스만 가지는 패턴

## 구현 방법 (Java)

&nbsp;

### 1. 기본적인 구현 방식 (Lazy Initialization)

가장 직관적인 구현입니다.

```Java
public class Singleton {
    private static Singleton instance;

    private Singleton() {}

    public static Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}
```

`getInstance()` 로만 객체를 생성할 수 있게 합니다. 해당 메서드 내부에서는 `instance` 존재 여부를 확인하고, 없는 경우에만 `new Singleton()` 을 만들죠. 이미 존재한다면 그 객체를 반환해주기만 하면 됩니다 ~!

이때 기본생성자는 private 로 지정하여 외부에서 객체 생성을 방지합니다.

하지만 이 방식은 멀티스레드 환경에서

### 2. Bill Pugh Solution

![](https://www.cs.umd.edu/~pugh/bill.jpg)

이 분이 만드셨다고 하네요 붐업! 👍

이 방법은 `static inner class` 를 사용해서 싱글톤 패턴을 구현합니다.

```Java
public class Singleton {
    private Singleton() {}

    private static class Holder {
        private static final Singleton INSTANCE = new Singleton();
    }

    public static Singleton getInstance() {
        return Holder.INSTANCE;
    }
}
```

마찬가지로 외부에서 객체를 생성하지 못하도록 생성자는 private 으로 막아뒀구요, 객체 생성에는 `getInstance()` 메서드가 사용됩니다.

처음으로 `getInstance()` 메서드를 호출한 순간에 정적 내부 클래스인 `Holder` 가 처음 로드되고, 이때 객체(`INSTANCE`)가 생성됩니다. 여기에서 `INSTANCE` 는 static final 변수이기 때문에 처음 한 번만 초기화가 되고 다시 재할당이 불가능합니다. 따라서 이후에 `getInstance()` 를 여러 번 호출하더라도 동일한 객체만 반환되는 것이죠 ~!

이 구현 방식은 여러 장점이 있어서 현재 가장 권장되는 싱글톤 구현법입니다. 그럼 장점을 알아보겠습니다. 🏃‍♀️🏃‍♀️

### Bill Pugh Solution 의 장점

&nbsp;

#### 1. Thread-safe 가 보장됨

이는 **JVM의 클래스 로더 매커니즘** 덕분입니다. 위 예시코드에서 정적 내부 클래스인 `Holder` 는 `getInstance()` 가 처음 호출되기 전까지 로드되지 않습니다. (지연 초기화가 이루어지기 때문에 자원 사용 측면에서도 효율적이죠!)  
그리고 이 클래스가 로드되는 시점에 **JVM이 클래스를 동기화**하여 딱 한 번만 수행하도록 보장해줍니다.

> #### 그럼 JVM 클래스 로더 매커니즘으로 동기화하는 것과 `synchronized` 키워드로 처리하는 동기화하는 것에 차이가 있는건가요?
>
> `synchronized` 키워드로 처리하는 동기화는 코드 블록이나 메서드 단위로 동기화가 적용됩니다. 즉, (위 코드에서) `getInstance()` 를 호출할 때마다 동기화 처리가 일어나고 락을 획득하고 해제하는 과정을 거쳐야하는 것이죠. 반면에 JVM 클래스 로더 동기화는 클래스 로딩 및 초기화 시점에만 발생하고, 이후에는 락 경쟁없이 빠르게 접근할 수 있습니다. 그런데 한 번 로드할 때 동기화 비용은 더 크다고는 하네요!

#### 2. 코드 구성이 깔끔해짐

![](https://cdn.pixabay.com/photo/2017/09/29/15/42/cleanliness-2799475_1280.jpg)
첫번째 장점과 같이 **JVM** 에서 처리해주는 부분들이 있기 때문에 개발자가 synchronized 와 같은 동기화 키워드를 사용할 필요가 없습니다. 따라서 코드 가독성도 좋아집니다.

## 사용 예시

&nbsp;

### 데이터베이스 연결

보통 데이터베이스 연결에서 주로 사용합니다. 데이터베이스 연결 객체를 생성하는 비용이 크기 때문에 하나의 연결을 통해 여러 곳에서 공유할 수 있도록 구성하면 메모리 같은 자원을 절약할 수 있습니다.

### 스프링

스프링 컨테이너에서는 빈(Bean) 을 싱글톤으로 관리합니다. 이 또한 마찬가지로 불필요한 객체 생성을 방지하여 자원 낭비를 줄이기 위해서입니다. 특히 스프링으로 구축한 웹 서버 환경은 많은 요청이 들어오는데요, 요청이 들어올 때마다 매번 객체를 생성하면 부하가 굉장할 것입니다. 이런 이유에서 싱글톤 패턴을 사용하는 것입니다.

## 단점?

&nbsp;

### 단위테스트에서의 문제

![](https://cdn.pixabay.com/photo/2017/06/28/10/53/board-2450236_1280.jpg)
단위 테스트는 순서에 상관없이 실행할 수 있도록 독립적이어야 합니다. 하지만 싱글톤 패턴은 한 객체를 공유하여 사용하는 것이므로 '독립적' 이라는 요건을 만족하지 못합니다. 예를 들어 이커머스 서비스에서 **상품의 가격 정보를 변경하는 테스트**와 **상품을 구매하는 테스트** 를 수행한다면, 테스트를 수행하는 순서에 따라 테스트 성공 여부가 달라질 수 있는 것입니다.

### 해결방법 - 의존성 주입 (Dependency Injection)

싱글톤객체를 직접 참조하지 않고, 인터페이스나 추상 클래스를 통해 의존성을 주입받도록 설계합니다. 이렇게 구현하면 테스트를 할 때는 실제 싱글톤 객체 대신 Mock 객체를 사용할 수 있기 때문에 테스트가 용이해지고 각 테스트를 독립적으로 수행할 수 있습니다.
이는 테스트 뿐만 아니라 실제 구현에서도 모듈들을 쉽게 교체할 수 있으므로 좋습니다. 즉 의존성이 떨어지는 것이죠!

---

이번 글에서는 이미지를 풍부하게 넣어보고 싶어서 무료 이미지를 많이 추가해보았는데요.... 너무 양산형 블로그 글 같기도 하네요 ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ
