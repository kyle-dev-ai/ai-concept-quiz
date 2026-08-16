# Versioning policy

## Source of truth

`package.json`의 `version`이 앱 버전의 단일 기준이다. Vite가 `__APP_VERSION__`으로 주입해 UI와 오류 문맥에서도 같은 값을 사용한다.

## Semantic Versioning

- Major (`2.0.0`): 저장 데이터 migration이 자동 호환되지 않거나 핵심 학습 흐름·공개 API가 깨지는 변경
- Minor (`1.1.0`): 새 콘텐츠 팩, 목표, 화면, provider처럼 하위 호환되는 기능 추가
- Patch (`1.0.1`): 콘텐츠 오탈자, UI·접근성·성능·오류 수정

출시 전 개발 변경은 `Unreleased` 아래 기록하고, 공개 시 날짜와 버전 섹션으로 옮긴다.

## Release identity

한 릴리스에서 다음 값이 일치해야 한다.

```text
package.json version
CHANGELOG version
Git tag v<version>
verification packet version
Apps in Toss 업로드 메모
```

Git tag, 원격 push, Apps in Toss 업로드·배포는 명시적 승인 뒤 실행한다.

## Storage migrations

기기 데이터는 각 payload의 `version` 필드로 별도 versioning한다. 앱 SemVer를 저장 schema version으로 재사용하지 않는다. 알 수 없는 schema는 crash 대신 안전한 초기값으로 복구하고 migration 회귀 테스트를 추가한다.
