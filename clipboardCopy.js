/*var clipboardCopy = (function(){
  var $copyArea, $hiddenUrl;
  var url;

  init = function(){
    url = window.location.href;
    $copyArea = $(".copy_area");
    $hiddenUrl = document.createElement("input");
    $hiddenUrl.id = "hidden_url";
    $hiddenUrl.readonly = true;
    $hiddenUrl.value = decodeURI(url);

    $(".btn_copy").click(function(e){
      e.preventDefault();

      var copy = $(this).attr("data-copy");
      if(copy === "false"){
        $copyArea.append($hiddenUrl);
        $hiddenUrl.select();
        document.execCommand("copy");
        $copyArea[0].removeChild($hiddenUrl);

        var text = "주소가 복사되었습니다.<br>원하는 곳에 붙여넣기 (Ctrl+V) 해주세요.";
        $(this).html(text);
        $(this).attr("data-copy", "true");
      }
    });
  };

  return {
    init:init
  }
})();*/

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

        //browser = browserDetect.init();
        cc = new CC(opt);
        cc.copy();
    };

    Fn.copy = function() {
        var self = this;
        var textareaHidden = self.textareaHidden,
            textarea = self.textarea,
            value = self.value,
            btnCopy = self.btnCopy,
            callback = self.callback;

        if (btnCopy === undefined) return;

        btnCopy.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('click');

            if (textareaHidden === true && textarea === undefined) { // select 후에 지워줘야 함
              textarea = self.textarea = btnCopy.parentElement.appendChild(document.createElement('textarea'));
              textarea.value = value;
            }
            selectFunc(textarea);
            if (callback !== undefined) callback();
        });
    };

    function selectFunc(ta){
      var browser, phone;

      browser = browserObj['browser'];
      phone = browserObj['browser'];

      

      if(browser === 'IE_O'){
        ta.select();
        if(window.clipboardData && window.clipboardData.setData){
          console.log('IE', 'copy');
          return clipboardData.setData('Text', ta.value);
        }
      }else if(browser === 'Safari'){

      }else{
        ta.select();
        document.execCommand('copy');
        console.log(browser, 'copy')
      }
    }

    return Fn.init;
})();