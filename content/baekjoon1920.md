Title: 백준 1920번: 수 찾기 (python)
Date: 2023-11-20 23:26
Category: Algorithm
Tags: Algorithm, Python, Baekjoon
Authors: adorableco
Summary: 백준 1920번: 수 찾기 해결 방법

## 1920번: 수찾기

- 정렬된 list 에서 이진탐색을 이용함
- **bisect_left(list, num)**
  <br/>
  -> list 내에서 num 이 들어갈 수 있는 가장 왼쪽의 index를 반환
- **bisect_right(list, num)** <br/>
  -> list 내에서 num 이 들어갈 수 있는 가장 오른쪽의 index를 반환 <br/><br/>
  **ex)** `[1,2,2,4,5]` 리스트에서 `2`라는 숫자가 들어갈 수 있는 가장 왼쪽 index는 `1`, 가장 오른쪽 index는 `3`<br/><br/>
- num이 list에 존재한다면 _삽입할 같은 숫자의 num은 list에 존재하는 num의 앞뒤로 모두 들어갈 수 있을 것이므로_ `bisect_left(list,num)-bisect_right(list,num)` 은 `1` 이상일 것
- 반대로 num이 list에 존재하지 않는다면 _어느 숫자들 사이에 한군데만 들어갈 수 있으므로_ `bisect_left(list,num)-bisect_right(list,num)` 은 0일 것

---

### 참고사항

```python
if num in list:
```

이런 식으로 list내에서 num 을 찾으려고 하면 시간초과가 뜸.
