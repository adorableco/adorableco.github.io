---
layout: post
title: "백준 2671 잠수함식별 DFA로 풀기 (Java)"
tags: Algorithm
lastmod: 2025-04-17
sitemap:
  changefreq: daily
  priority: 0.8
---

알고리즘 문제 풀이는 블로그에 안올린지 꽤 오래됐지만... 재밌는 문제를 풀어서 오랜만에 올려봅니다.

컴파일러 수업 시간에 오토마타 이론을 복기하면서 교수님께서 이 문제를 추천해주셔서 풀어보았는데, DFA를 그대로 적용해볼 수 있어서 재밌었습니다.

## 백준 2671. 잠수함 식별

https://www.acmicpc.net/problem/2671
(처음에 문제를 대강 읽었다가 주어진 예시 5개를 모두 만족하는 DFA를 만드는 실수를 했습니다... 😳)

문제 문항이 길어서 따로 가져오진 않겠습니다. 간단하게 요약하면 주어지는 문자열이 `(100~1~|01)~` 패턴과 일치하면 `SUBMIRINE`을, 일치하지 않으면 `NOISE` 를 출력하면 됩니다.

`(100~1~|01)~` 패턴을 Regular Expression 으로 변환해보면 다음과 같습니다.

```
(10(0)⁺(1)⁺|01)⁺
```

`~`를 `+` 윗첨자로 변형하기만 하면 되죠! 저는 헷갈리지 않도록 괄호도 추가했습니다.

이 Regular Expression에 해당하는 문자열은 아래와 같은 것들이 있습니다.

- 1001
- 10000001
- 01
- 01100001
- 100101
- 100011000101
  등등...

바로 DFA로 그려보았습니다.
![](https://velog.velcdn.com/images/adorableco/post/525f7852-bfa7-4362-9eea-73759d5f7b91/image.png)

$\sum =\{0, 1\}$
$S = \{S1, S2, S3, S5, S6, S7, S8, S9, S10\}$
$F = \{S5, S6, S8, S10\}$
$I = \{S1\}$
($\delta$ (transition function)는 diagram으로 확인 가능하므로 패스하겠습니다 ㅎ ㅎ)

손으로 그렸을 땐 몰랐는데 draw .io로 그리고 보니 뭔가 되게 복잡하네요 state 개수를 더 줄일 수 있을까요..?! 🧐

일단 저 DFA대로 코드를 작성해주기만 하면 끝!입니다. 그럼 본격적으로 코드를 살펴보겠습니다.

## Java Code

저는 `HashMap` 에 key는 state 번호, value는 `State` 객체를 담도록 구성했습니다.

```java
private static HashMap<Integer, State> stateMap = new HashMap<>();

    private static class State {
        int nextZero;
        int nextOne;
        boolean isTerminal;

        public State(int nextZero, int nextOne, boolean isTerminal) {
            this.nextZero = nextZero;
            this.nextOne = nextOne;
            this.isTerminal = isTerminal;
        }
    }
```

`State` 객체에는 현재 state에서 0이 들어올 경우 이동하는 다음 state 번호를 `nextZero`에, 1이 들어올 경우 이동하는 다음 state 번호를 `nextOne`에 담도록 구성했습니다.

> 특정 symbol에 대해서 처리할 수 없는 경우는 `-1`를 담습니다.

또한 `isTerminal` 은 해당 state가 _**terminal state**_ 인지 여부를 저장해둘 수 있도록 했습니다.

각 state를 DFA에 맞게 초기화하는 코드는 다음과 같습니다.

```java
private static void initState(){
        stateMap.put(1, new State(7,2, false));
        stateMap.put(2, new State(3,-1, false));
        stateMap.put(3, new State(4,-1, false));
        stateMap.put(4, new State(4,5, false));
        stateMap.put(5, new State(7,6, true));
        stateMap.put(6, new State(9,6, true));
        stateMap.put(7, new State(-1,8, false));
        stateMap.put(8, new State(7,2, true));
        stateMap.put(9, new State(4,10, false));
        stateMap.put(10, new State(7,2, true));
    }
```

예시로 **S4 state**를 살펴보겠습니다.
![](https://velog.velcdn.com/images/adorableco/post/b1f1aa96-df71-42df-8b4a-3b8dd2aaf636/image.png)

`S4`에서 0이 들어오면 `S4`로, 1이 들어오면 `S5`로 이동합니다. 그리고 `S4`는 **terminal state**가 아니기 때문에 아래와 같이 초기화를 해주는 것입니다.✨

```java
stateMap.put(4, new State(4,5, false));
```

이제 제시된 문자열이 이 DFA의 흐름을 타도록 나머지 코드를 작성해보겠습니다.

```java
    private static String solution(String string){
        int curState = 1;

        for(int i = 0; i < string.length(); i++){
            char c = string.charAt(i);
            int parsedInt = Integer.parseInt(String.valueOf(c));

            if (parsedInt == 0){
                curState = stateMap.get(curState).nextZero;
            } else {
                curState = stateMap.get(curState).nextOne;
            }

            if(curState == -1) return "NOISE";
        }

        if (stateMap.get(curState).isTerminal){
            return "SUBMARINE";
        }
        return "NOISE";
    }
```

_**initial state**_ 는 `S1`이므로 `curState`도 1로 시작합니다.
순서대로 들어오는 문자열의 문자를 정수로 변환해주고, 이 값이 0 이면 현재 state의 `nextZero` 가 가리키는 state로, 1이면 `nextOne`이 가리키는 state로 이동합니다.

정말 간단하죠 ~~ 🤓🤓

이때 이동한 state가 -1 일때, 즉 이동이 불가능하다면 Regular expression에 맞지 않는 문자열이므로 `"NOISE"` 로 처리하면 됩니다.

반복문을 마친 후에 현재 위치한 state가 _**terminal state**_ 라면 `"SUBMARINE"`, 아니라면 `"NOISE"` 가 됩니다.

## 느낀점

사실 Java 뿐만 아니라 여러 언어들이 Regular Expression을 체크하는 라이브러리를 표준으로 제공합니다.
Java에서는 `java.util.regex.Pattern`, `java.util.regex.Matcher` 와 같은 라이브러리를 통해 regular expression과 매치되는지를 바로 확인할 수 있습니다.  
간단하게만 나타내보면

```java
Pattern pattern = Pattern.compile("(10(0)+(1)+|01)+");
boolean b = pattern.matcher(string).matches();
```

이런 식으로 구성할 수 있겠죠. (테스트케이스만 실행해보고 백준에 제출해보지는 않았습니다! 참고만 해주세요🙀)

그치만! 이렇게 DFA를 직접 구성해보면서, 전공으로 배웠던 오토마타를 실제로 어떻게 이용할 수 있을지에 대해 생각해볼 수 있는 계기가 되어서 좋았습니다.
그리고 오토마타적으로(?) 사고를 하니 뭔가 컴퓨터에 자아의탁한 기분도 들었구요.. ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ 시간이 된다면 현재 DFA를 간략화할 방법도 찾아봐야겠습니다.
