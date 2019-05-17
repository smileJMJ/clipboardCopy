# clipboardCopy
clipboard 복사 기능 개발 [2019]

# 설명
clipboard 복사 기능을 구현할 때 IE 9 이하 및 iOS 분기처리가 필요함을 알게 되었고,  
네이버와 타 사이트를 보면서 textarea 필드가 노출/비노출 된 복사 기능들을 보면서  
다양한 형태의 clipboard 복사를 간편하게 구현할 수 있도록 만들었습니다.

# 호출 코드
```
clipboardCopy({
  textareaHidden: true/false(default),          
  textarea: dom object,                         
  readonly: true/false,                         
  value: string,                                
  btnCopy: dom object,                          
  callback: function(){}                        
});
```
- textareaHidden: textarea 숨김(동적으로 생성 및 삭제) 여부, true: 숨김(동적생성) / false: 노출(마크업되어있음)
- textarea: clipboard로 복사할 텍스트가 담긴 영역, input[type=text]/textarea 등 dom 객체
- readonly: true: value값이 고정되어 복사됨 / false: textarea에 입력한 값이 복사됨,
- value: copy할 value 값
- btnCopy: copy 버튼 객체,
- callback: copy 되면 실행할 콜백

# 데모
