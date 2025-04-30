---
layout: post
title: "PR마다 리뷰 달기 귀찮다면? Gemini에게 맡겨보세요 - PR 리뷰 자동화 with Gemini + GitHubAction"
tags: etc
lastmod: 2025-03-26
sitemap:
  changefreq: daily
  priority: 0.8
---

챗지피티에게 추천받은 제목과 함께 시작합니다.. ㅋㅋ

&nbsp;

코드 리뷰 자동화 시스템을 만들기 시작한 건, 리뷰 요청이 PR 생성 후 꽤 오래 지나도록 반응이 없는 경우가 반복됐기 때문입니다.

사실 처음에는 [coderabbitai🐰](https://www.coderabbit.ai/) 라는 코드 리뷰 서비스를 통해 PR 리뷰 자동화를 시도했습니다. 몇 줄의 설정만으로 자동 리뷰가 붙는 점이 매우 편리했지만, 어느 시점부터 GitHub Actions에서 요청한 PR에 대해서는 bot이 단 코멘트에는 답장을 남길 수 없습니다라는 오류 메시지와 함께 리뷰가 등록되지 않는 문제가 반복됐습니다. 따라서 생성형 AI이 Gemini를 활용해 직접 AI 리뷰를 구현하게 되었습니다.

> `coderabbitai` 의 코드 리뷰는 아주 만족스럽습니다! 다만 원하는 스케줄에 맞게 코드 리뷰를 받지 못하고, PR 등록되는 즉시 or 사용자가 PR 코멘트로 `@coderabbitai review` 라고 남겼을 때만 코드 리뷰를 받을 수 있습니다. 🥲
> 저처럼 특정 시간이 경과한 뒤에 코드 리뷰를 받기를 원하는 상황이 아니라면 상당히 좋은 선택지라고 생각합니다.

이번 글에서는 GitHub PR을 감지하고, 리뷰가 없으면 AI가 리뷰를 생성하고, 라벨까지 자동으로 붙여주는 시스템을 어떻게 설계하고 구현했는지 공유하려고 합니다. 🤖

---

## 시스템 구성 개요

시스템은 크게 네 단계로 구성되어 있습니다:

> 1 **. PR 모니터링**: 생성된 지 1시간이 지난 PR만 필터링 2. ** 리뷰 유무 판단**: 리뷰가 하나도 없다면 AI 리뷰 생성 3. **리뷰 생성 및 등록**: LLM(Gemini)을 호출해 리뷰 코멘트를 생성하고 GitHub에 등록 4. **라벨링 처리**: 리뷰가 완료된 PR에는 자동으로 'AI REVIEW' 라벨을 추가

기술 구성은 다음과 같습니다:

> 1. Node.js + Typescript
> 2. GitHub Actions
> 3. Gemini

---

## ⚙️ GitHub Actions로 스케줄링하기

구현 상세 내용을 확인하기 전에 먼저 workflow를 소개하겠습니다.
직접 구현을 원치 않는다면 이 workflow 만 프로젝트에 추가하셔도 ai 리뷰 자동화 프로세스를 이용하실 수 있습니다.

- `adorableco/Fit_Friends@ai-review-automation` 는 Node.js와 Typescript 로 구현한 **PR 체크 & 리뷰 생성 및 코멘트 게시** 프로세스입니다.
  - 상세 내용은 아래에서 확인하실 수 있습니다 ✨

매시간마다 PR을 체크해야 하므로 GitHub Actions의 `cron` 기능을 활용해 위 프로세스를 **1시간마다 자동으로 실행**합니다.

workflow:

```yaml
name: AI Review Automation
on:
  schedule:
    - cron: "0 * * * *" # 1시간마다 실행

jobs:
  ai-review:
    runs-on: [ubuntu-latest]
    steps:
      - name: Review
        uses: adorableco/Fit_Friends@ai-review-automation
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
        env:
          GEMINI_KEY: ${{ secrets.GEMINI_KEY }}

      - name: Check Directory
        run: |
          echo "Current directory:"
          pwd
          echo "Files:"
          ls -R

      - name: Upload logs
        uses: actions/upload-artifact@v4
        with:
          name: review-log
          path: logs
```

### Review

실질적으로 코드 리뷰 프로세스를 담당하는 step입니다.

- `secrets.GITHUB_TOKEN` : workflow가 실행될 때 GitHub에서 자동으로 생성하는 토큰값입니다.
- `secrets.GEMINI_KEY` : google ai studio 에서 발급받아야 하는 api key입니다. 아래와 같이 Repository secrets에 직접 저장해둬야 하는 값입니다.

![](https://velog.velcdn.com/images/adorableco/post/d3020a03-a010-46a6-9b35-bc7dcbac5545/image.png)

### Check Directory & Upload logs

실행로그 분석을 위해 추가한 step들입니다. 추후에 새로운 글로 자세히 설명해보도록 하겠습니다!

---

## 구현 방식 상세

- 여러 ts 파일들이 있지만 구현 상세 부분인 `index.ts` 와 `GeminiClient.ts` 위주로 설명드리겠습니다.
- 전체 코드는 아래 GitHub 레포지토리에서 확인하실 수 있습니다 🤩
  - https://github.com/adorableco/Fit_Friends/tree/ai-review-automation

&nbsp;

### 🐱 GitHub 관련 부분 (index.ts)

GitHub에서 PR을 주기적으로 조회하고, 그 중 생성된 지 1시간이 지난 PR만 필터링합니다. 이유는 일단 팀원 간 코드 리뷰를 최우선시 하기 위해 팀원 간의 코드 리뷰를 할 수 있는 시간을 확보해두고 싶었기 때문입니다.

```ts
const now = new Date();
const createdAt = new Date(pull.created_at);
const diffInHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

if (diffInHours >= 1) {
  // 리뷰 여부 확인 및 리뷰 생성
}
```

&nbsp;

그 다음 리뷰가 존재하는지 확인합니다:

```ts
const { data: reviews } = await octokit.rest.pulls.listReviews({
  owner,
  repo,
  pull_number: pull.number,
});

if (reviews.length === 0) {
  // AI 리뷰 생성
}
```

- 등록된 리뷰가 1건도 없다면, AI 리뷰를 시작합니다 ! 🏃‍♀️

&nbsp;

변경된 파일의 내용을 `octokit`을 통해 가져오고, base64로 인코딩된 blob을 디코딩하여 Gemini로 전달합니다:

> - octokit 에는 기능이 매우~~~ 많습니다. docs를 참고하시면 더 다양한 기능을 구현해보실 수 있을 것 같습니다.
> - octokit 링크: https://octokit.github.io/rest.js/v21/

```ts
const changedFiles = await octokit.rest.pulls.listFiles({
  owner,
  repo,
  pull_number: pull.number,
});

const blobContentPromises = changedFiles.data.map(
  async (file) =>
    await octokit.rest.git
      .getBlob({ owner, repo, file_sha: file.sha })
      .then((blob) => blob.data.content),
);

const blobContents = await Promise.all(blobContentPromises);
```

&nbsp;

AI 리뷰는 다음처럼 생성되고 바로 등록됩니다:

- `generateReviewByGemini` 메서드는 아래에서 살펴보겠습니다!

```ts
const reviews = await generateReviewByGemini(blobContents);

for (const review of reviews) {
  await octokit.rest.pulls.createReview({
    owner,
    repo,
    pull_number: pull.number,
    event: "COMMENT",
    body: review,
  });
}
```

&nbsp;

등록 후에는 PR에 라벨을 추가합니다. 이건 별도 모듈로 분리했습니다:

```ts
const updateLabel = async (number: number): Promise<boolean> => {
  return addLabels(number)
    .then(() => true)
    .catch((error) => {
      throw error;
    });
};
```

&nbsp;

### 🦾 Gemini 코드 리뷰 생성 부분 (GeminiClient.ts)

- `blobContents`는 PR에서 변경된 각 파일의 내용입니다.
- 각 파일별로 별도의 리뷰를 생성하며, 응답은 `.response.text()`로 텍스트만 추출하여 리스트에 담습니다.

```ts
const { GoogleGenerativeAI } = require("@google/generative-ai");

export const generateReviewByGemini = async (blobContents: string[]): Promise<string[]> => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    var reviews = [];

    for (const content of blobContents) {
        const prompt =
        \`
            You are a senior developer. Please review the following code and provide your feedback in Korean.
            Use Markdown formatting.
            Be concise and to the point.
            Use emojis if helpful.
            Include code examples if possible.

            Here is the code:
            \${content}
        \`
        const result = await model.generateContent(prompt);
        console.log(result.response.text());
        reviews.push(result.response.text());
    }

    return reviews;
```

---

## 데이터 분석 결과

시스템이 동작한 뒤, 로그 데이터를 수집하고 시각화하여 흐름을 분석했습니다.
(이제라도 로그 분석을 제대로 해보려고 합니다...🤧)

### PR 번호별 이벤트 매트릭스

한 PR에서 리뷰, 라벨 추가, 중복 리뷰 감지 등이 어떤 패턴으로 발생했는지를 확인할 수 있습니다.

![](https://velog.velcdn.com/images/adorableco/post/34c5d432-4d11-4a81-890b-c84012437593/image.png)

### 이벤트 종류별 빈도

가장 많이 발생한 이벤트는 **"Duplicate review"** 로, 이미 리뷰가 제출된 상태에서 중복 검사를 반복하는 로그입니다. 개선해야할 포인트로 생각하고 있습니다.

![](https://velog.velcdn.com/images/adorableco/post/71f03c25-1ac2-4082-8764-ccddc1c3e5eb/image.png)

---

## 개선하고 싶은 부분들 ✍️

### 변경된 '라인'만 리뷰하기

- 현재 구현이 지니고 있는 가장 큰 문제는 변경된 '파일'을 기준으로 리뷰를 진행하고 있기 때문에 한 파일 내에서 변경이 되지 않는 코드 라인들도 다 리뷰가 되고 있는 것입니다.
- GitHub로부터 파일 정보를 불러올 때 변경 된 라인에 대한 정보인 `patch` 필드도 함께 받고 있기 때문에 이를 활용해서 변경된 코드 '라인'만 리뷰할 수 있도록 개선할 예정입니다.

### 중복 로깅 줄이기

- 이미 리뷰된 PR에 대해서는 더 이상 중복 로그가 찍히지 않도록 캐싱 또는 상태 저장 고려

### 리뷰 → 머지 시간 측정

- 리뷰가 올라간 후 얼마나 빠르게 머지가 일어나는지, 리뷰가 얼마나 기여했는지 정량적으로 분석하고 싶습니다

### 리뷰 품질 피드백 수집

- thumbs up/down, 댓글 등을 통해 LLM 리뷰가 실제로 도움이 됐는지 평가

### Slack 알림 연동

- 리뷰 자동 생성 시 팀 슬랙 채널에 알림 발송

---

## 마무리하며

수동 리뷰를 완전히 대체하기보다는, 리뷰를 **보완**하고 누락을 **방지**하는 하나의 툴로 자리 잡는 것이 목표였습니다.

보완해야할 점이 아직 많지만 계속 개선해나가고 싶습니다 🚀
