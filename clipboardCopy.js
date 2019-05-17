/*
  호출코드
  clipboardCopy({
    textareaHidden: true/false(default),          // textarea 숨김(동적으로 생성 및 삭제) 여부, true: 숨김(동적생성) / false: 노출(마크업되어있음)
    textarea: dom object,                         // clipboard로 복사할 텍스트가 담긴 영역, input[type=text]/textarea 등 javascript 객체로
    readonly: true/false,                         // true: value값이 고정되어 복사됨 / false: textarea에 입력한 값이 복사됨
    value: string,                                // copy할 value 값
    btnCopy: dom object,                          // copy 버튼 객체
    callback: function(){}                        // copy 되면 실행할 콜백
  });

 */

var browserDetect = (function() {
    var ua;

    var init = function() {
        var browser = {};

        ua = navigator.userAgent;
        browser['browser'] = checkBrowser();
        browser['phone'] = checkPhone();

        return browser;
    };

    // browser detect
    var checkBrowser = function() {
        var sBrowser, sUsrAg = navigator.userAgent;

        if (sUsrAg.indexOf("Firefox") > -1) {
            sBrowser = "Firefox";
        } else if (sUsrAg.indexOf("Opera") > -1 || sUsrAg.indexOf("OPR") > -1) {
            sBrowser = "Opera";
        } else if (sUsrAg.indexOf("Trident") > -1 || sUsrAg.indexOf("Edge") > -1) {
            //sBrowser = "IE";
            sBrowser = checkIEVersion();
        } else if (sUsrAg.indexOf("Chrome") > -1) {
            sBrowser = "Chrome";
        } else if (sUsrAg.indexOf("Chrome") > -1 && sUsrAg.indexOf("Safari") > -1) {
            sBrowser = "Chrome";
        } else if (sUsrAg.indexOf("Safari") > -1 && sUsrAg.indexOf("Chrome") === -1) {
            sBrowser = "Safari";
        } else {
            sBrowser = "unknown";
        }

        return sBrowser;
    };

    // phone 기종 체크
    var checkPhone = function() {
        var phone, ua = navigator.userAgent;
        if (ua.indexOf("iPhone") > -1) {
            phone = "iPhone";
        } else if (ua.indexOf("iPad") > -1) {
            phone = "iPad";
        } else if (ua.indexOf("Android") > -1) {
            phone = "Android";
        } else { phone = ""; }

        return phone;
    };

    // IE version check
    var checkIEVersion = function() {
        if (location.pathname === "/browser") return; // 크롬 설치 페이지로 오면 동작 안하도록

        var bro;
        var version = "N/A";

        var agent = navigator.userAgent.toLowerCase();
        var name = navigator.appName;

        // IE old version ( IE 10 or Lower ) 
        if (name == "Microsoft Internet Explorer") {
          var reg = new RegExp("msie " + "([0-9]{1,})(\\.{0,}[0-9]{0,1})" ); 
           if (  reg.exec( agent ) != null  ) version = RegExp.$1 + RegExp.$2; 

          var numVer = Number(version);
          if(typeof(numVer) === "number" && numVer === 10) bro = 'IE_Y';
          else bro = 'IE_O';
        } else {
            bro = 'IE_Y';
        }

        return bro;
    };

    return {
        init: init
    }
})();


var clipboardCopy = (function() {
    var browserObj;

    browserObj = browserDetect.init();

    var CC = function(opt) {
        this.textareaHidden = opt.textareaHidden ? opt.textareaHidden : false; // textarea 숨김(동적으로 생성 및 삭제) 여부, true: 숨김(동적생성) / false: 노출(마크업되어있음)
        this.textarea = this.textareaHidden === false ? opt.textarea : undefined; // clipboard로 복사할 텍스트가 담긴 영역, input[type=text]/textarea 등 javascript 객체로
        this.readonly = this.textareaHidden === false ? opt.readonly : true; // true: value값이 고정되어 복사됨 / false: textarea에 입력한 값이 복사됨
        this.value = opt.value ? opt.value : ''; // copy할 value 값
        this.btnCopy = opt.btnCopy; // copy 버튼 객체
        this.callback = opt.callback; // copy 되면 실행할 콜백
    };

    var Fn = CC.prototype;

    Fn.init = function(opt) {
        var cc;

        cc = new CC(opt);
        cc.copy();
    };

    Fn.copy = function() {
        var self = this;
        var textareaHidden = self.textareaHidden,
            textarea = self.textarea,
            readonly = self.readonly,
            value = self.value,
            btnCopy = self.btnCopy,
            callback = self.callback;

        if(btnCopy === undefined) return;
        if(!textareaHidden && readonly) textarea.readOnly = true;
        if(!textareaHidden && value !== undefined) textarea.value = value;

        btnCopy.addEventListener('click', function(e) {
          e.preventDefault();

          if(textareaHidden === true) { 
            textarea = self.textarea = btnCopy.parentElement.appendChild(document.createElement('textarea'));
            textarea.value = value;
          }
          
          copyFunc(textarea);
          if(textareaHidden === true) textarea.parentNode.removeChild(textarea);
          if(callback !== undefined) callback();
        });
    };

    function copyFunc(ta){
      var isIEO, isIOS;

      isIEO = browserObj['browser'].match(/IE_O/i);
      isIOS = browserObj['phone'].match(/iPad|iPhone/i);

      if(isIOS !== null){           // ios 일 때
        var range, selection;
        range = document.createRange();
        range.selectNodeContents(ta);
        selection = window.getSelection();
        selection.addRange(range);
        ta.setSelectionRange(0, 9999999);
        document.execCommand('copy');
      }else{
        ta.select();
        if(isIEO !== null){
          if(window.clipboardData && window.clipboardData.setData){
            clipboardData.setData('Text', ta.value);
          }
        }else{
          document.execCommand('copy');
        }
      }
    }

    return Fn.init;
})();