# Apps in Toss MVP policy notes

- Checked: 2026-08-16
- This is an implementation checklist, not legal advice.

## Customer support and footer

- Apps console에 고객센터 이메일, 연락처 또는 상담 channel을 등록한다.
- 등록한 정보는 Apps in Toss 공통 navigation bar의 고객센터 경로에서 노출된다.
- 개인 이메일을 app source/footer에 직접 넣지 않는다. 출시 전에 service 전용 alias를 만들고 console에 등록한다.
- app 내부의 `© 2026 어텐션! · v1.0.0` footer는 product convention이다. 공식 심사 필수 표시로 가정하지 않는다.
- 공통 navigation과 겹치는 별도 customer-center header를 만들지 않는다.

## Ads and monetization

- Apps channel은 Apps in Toss 공식 통합 광고와 WebView banner API를 사용한다. 통합 SDK가 Toss Ads와 AdMob 중 적합한 network를 자동 선택한다.
- 앱이 외부 AdMob 또는 원티드 광고 SDK/script를 직접 삽입하는 방식은 공식 지원이 확인되지 않았으므로 후보에서 제외한다.
- 광고 그룹 category는 app category에서 자동 설정되며 console에서 group 단위로 변경할 수 있다. 이는 특정 입시·이직 광고 소재의 노출 보장이 아니다.
- WebView banner는 Toss App 5.241.0 이상, 통합 전면형·보상형은 5.247.0 이상을 기준으로 `isSupported()` fallback이 필요하다.
- Sandbox는 인앱 광고를 지원하지 않으므로 test ID와 console QR을 이용한 Toss App 실기기 검증이 필요하다.
- v1.0.0은 `VITE_ADS_ENABLED=false`이며 SDK, placement ID, network request가 없다.
- 인앱 광고를 켜려면 사업자 정보와 정산 정보를 등록하고 검토를 받아야 한다.
- 공식 서비스 오픈 정책은 자격 조건이 없는 수익형 교육 서비스의 출시를 제한한다고 명시한다. 이 앱의 category와 자격 적용 여부를 console/review 담당자에게 확인하기 전에는 광고를 켜지 않는다.

## Review gates

- console appName/displayName/icon/primary color/customer center 확정
- Sandbox App 확인
- Toss app에서 최소 1회 test
- iOS/Android WebView load, memory, offline/storage, share 확인
- live HTTPS/CORS 차이 확인
- `.ait` uncompressed limit와 current bundle budget 확인
- 오류·성능 monitoring과 rollback owner 확인

## Sources

- [Service development policy](https://developers-apps-in-toss.toss.im/intro/guide.html)
- [Ads development guide](https://developers-apps-in-toss.toss.im/ads/develop.html)
- [Integrated full-screen ads](https://developers-apps-in-toss.toss.im/bedrock/reference/framework/%EA%B4%91%EA%B3%A0/IntegratedAd.html)
- [WebView banner ads](https://developers-apps-in-toss.toss.im/bedrock/reference/framework/%EA%B4%91%EA%B3%A0/BannerAd.html)
- [Business registration](https://developers-apps-in-toss.toss.im/prepare/register-business.html)
- [Console and workspace](https://developers-apps-in-toss.toss.im/prepare/console-workspace.html)
- [Navigation bar](https://developers-apps-in-toss.toss.im/bedrock/reference/framework/UI/NavigationBar.html)
- [Sandbox testing](https://developers-apps-in-toss.toss.im/development/test/sandbox.html)
- [Toss app testing](https://developers-apps-in-toss.toss.im/development/test/toss.html)
- [Release guide](https://developers-apps-in-toss.toss.im/development/deploy.html)
- [Copyright checklist](https://developers-apps-in-toss.toss.im/checklist/copyright.html)
