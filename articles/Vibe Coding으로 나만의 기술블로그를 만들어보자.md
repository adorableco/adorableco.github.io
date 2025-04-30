---
layout: post
title: "Vibe Coding으로 나만의 기술블로그를 만들어보자 🌊"
tags: etc
lastmod: 2025-04-30
sitemap:
  changefreq: daily
  priority: 0.8
---


![](https://velog.velcdn.com/images/adorableco/post/b8f9b42e-190a-44b3-a8c0-98191ea45b1d/image.png)

`Vibe Coding`의 시대가 도래했습니다...

### 🌊 Vibe Coding 이란?

> OpenAI의 공동창립자이자 테슬라 전 AI리더인 **안드레이 카르파티(Andrej Karpathy)** 가 2025년 2월에 제시한 따끈따끈한 용어입니다.
> 한마디로 정의하자면, 개발자가 직접 코드를 짜면서 개발하는 것이 아니라 자연어를 통해 코드를 생성하는 것입니다.
> 안드레이 카르파티는 본인 X 계정에 **"There's a new kind of coding I call "vibe coding", where you fully give in to the vibes, embrace exponentials, and forget that the code even exists."** 라고 글을 올렸습니다. 코드가 존재한다는 것조차 까먹는 느낌의 코딩이라.. 개발자로서는 섬뜩하기도 하네요 😨

제가 프로그래밍이라는 것을 알게된지 얼마되지 않았던 어린이 시절에, 웹사이트를 만들려면 원하는 요소들을 이리저리 배치하는 건줄 알았던 때가 있는데요... 이 어린이조차도 미래에 자연어만으로 개발이 가능할 줄은 몰랐을 것 같네요... ㅋ ㅋ

최근 **Cursor ai**, **Deepsite** 등 개발에 집중한 AI 툴들이 등장하면서 앞으로 `Vibe Coding` 이 더 쉬워질 것 같습니다.

아무튼, 저도 `Vibe Coding` 을 이용해서 나만의 기술블로그를 한번 만들어보겠습니다!

저는 **Deepsite** 를 베이스로 먼저 틀을 갖춘 다음에, 더 추가하고 싶거나 고치고 싶은 부분을 **Cursor ai**와 **ChatGPT**를 이용하여 다듬었습니다. 여기에 favicon 등 필요한 이미지는 **ChatGPT**로 생성하기도 했습니다. 순서대로 함께 가보시죠..

---

> 결과물은 아래 링크에서 확인하실 수 있습니다.
> DevLog: http://127.0.0.1:5500/index.html#
> GitHub: https://github.com/adorableco/adorableco.github.io

## 1. Deepsite로 원하는 틀 잡기 🖼️

https://enzostvs-deepsite.hf.space/

Deepsite는 Deepseek V3 기반의 웹사이트 생성 플랫폼입니다. 바로 보시죠!

![](https://velog.velcdn.com/images/adorableco/post/979a8848-7a0b-45ea-88f9-a6c7a584fd73/image.png)

사실 설명할 것도 없습니다. 이미지에 보이는 **Ask AI anything...** 에 원하는 웹사이트에 대한 설명을 작성하면 정말 그대로 만들어줍니다. 참고로 HuggingFace 계정이 있어야 계속 기능을 이용할 수 있습니다.

오른쪽 상단의 핑크색 `Deploy to Space` 버튼을 누르면 HuggingFace space를 이용해서 바로 배포도 가능합니다. 저는 추후에 백엔드 API 연결을 고려하고 있기도 하고 조금 더 보충해서 완성하고 싶었기에 코드 카피 후에 GitHub Page로 배포했습니다.

저는

> 포트폴리오 용으로도 사용 가능한 나만의 기술 블로그를 만들어줘.

라고 요청했고 아래처럼 근사하게 완성해주었습니다.

![](https://velog.velcdn.com/images/adorableco/post/5c1876ff-4657-4056-a519-a7933d7959c1/image.png)

한가지 아쉬운 점은 쌩 html 파일로만 만들어주는 것 같더라구요. (아마도)
참고로 위 이미지는 처음 만들었을 당시에 캡처해두지 않아서 방금 새로 요청한 후에 캡처한 것입니다.그래서 아래에 나올 웹페이지 UI와 다른 부분이 있을 수 있습니다!

## 2. Cursor ai 에디터를 활용해서 보완하기 👩‍🔧

https://www.cursor.com/
Cursor ai는 VSCode 기반의 AI 코드 편집기입니다. 설치하고 처음 열었을 때 VSCode와 거의 똑같아서 신기했습니다.

![](https://velog.velcdn.com/images/adorableco/post/65735e04-2c51-4ff9-9771-5508b1e87141/image.png)
그냥 냅다 Chat 에서 구현을 요청해도 되구요,

![](https://velog.velcdn.com/images/adorableco/post/3cd0ba6a-a72e-44a3-ae66-ef334b166d6d/image.png)
이렇게 변경하길 원하는 코드를 드래그하여 `Add to Chat` 하면 해당 코드에 대한 요청을 할 수도 있습니다.

아래는 완성된 메인페이지입니다. 내용만 고쳤지 UI쪽으로는 거의 건든게 없답니다..!!!

![](https://velog.velcdn.com/images/adorableco/post/dee9d38a-6eab-437f-a04a-11b250c5f027/image.png)

ChatGPT로 생성한 대문 이미지와 함께...
근데 마음에 안들어서 계속 이미지를 고치고 있어요.. 😳

![](https://velog.velcdn.com/images/adorableco/post/f5ff57c9-9c66-4ac1-973f-3eaa858c817e/image.png)

![](https://velog.velcdn.com/images/adorableco/post/3fdd7b10-1d60-4142-a8b1-c041c68e0c78/image.png)

포트폴리오 소개 페이지는 제가 만들어뒀던 포트폴리오 내용을 그대로 DeepSite에게 보내주면서 이러이러한 내용들을 담을 페이지를 만들어달라고 요청했고, 그 결과물과 기술블로그 페이지를 연결지었습니다.

---

개인적으로 블로그 페이지가 가장 마음에 드는데요,
(이것도 Deepsite에서 추가로 요청해서 만든 페이지입니다.)
![](https://velog.velcdn.com/images/adorableco/post/7106e80f-a054-459e-8201-aa5a1ee4a3d4/image.png)

Medium 과 같은 외국 블로그에서 볼 수 있는 '읽기 시간' 도 알아서 넣어줬구요. 아주 깔끔하게 잘 만들었습니다.

![](https://velog.velcdn.com/images/adorableco/post/aeb78988-36b3-454e-971f-dd7708a137d7/image.png)

다만 저는 제가 쓴 글을 위 이미지와 같이 마크다운 형식으로 관리하고 싶어서 이 마크다운을 블로그 페이지에서 표현하고 카테고리로 분류하는 기능들을 `cursor ai` 를 이용해서 잘 구현했습니다.

> 참고로 위 이미지의 1~9 번 줄의 메타데이터는 검색엔진에 노출되도록 sitemap.xml 를 설정하기 위해 추가한 것들입니다. 이와 관련한 내용은 다른 글로 자세히... 다루고자 합니다.

---

## 마무리

글을 다 쓰고보니 정말 자연어로만 코드를 짜서 완성했네요. 다 완성하는데 2시간 정도밖에 안걸린 것 같습니다. (근데 검색엔진 노출 설정하느라 시간을 추가적으로 쓰긴 했습니다😅)
앞으로 코딩 장벽이 더더욱 낮아질 듯합니다. 개발자로서 어떻게 준비를 해야할지... 고민을 많이 해봐야겠습니다!
예전부터 나만의 기술블로그를 만들어보고 싶었는데 `Vibe Coding` 으로 잘 완성했습니다~~~~ 굿!

다음에는 완성 후 배포 파이프라인 구축과 검색엔진 노출 설정에 대한 글을 작성해보겠습니다.
