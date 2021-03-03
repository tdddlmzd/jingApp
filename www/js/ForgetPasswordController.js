app.controller('forgetpasswordController', function($scope, $http, $resource, $filter, $stateParams, $rootScope,
    $state, $ionicTabsDelegate, $translate, Popup, locals, $ionicLoading) {
    $scope.model = {};
    $scope.codemodel = {};
    $scope.item = {};

    //监听页面动作
    $rootScope.$on('$ionicView.beforeEnter', function() {
        var statename = $state.current.name;
        $ionicTabsDelegate.showBar(false); //当前页面隐藏tab
        if (statename == 'tab.forgetpassword-phone' || statename == 'tab.forgetpassword-reset') {
            clearInterval(timer); //停止这个读秒
        }
        var yy = locals.get("lang"); //字符串缓存;
        var datePicker_lang = 'en';
        if (yy == "zh-cn") {
            datePicker_lang = 'zh';
        }

        //单项内容选择
        $('#singlePicker_forget').mobiscroll().select({
            theme: 'android-ics light',
            mode: 'scroller',
            display: 'modal',
            lang: datePicker_lang, //en zh
            // cancelText: null,
            // headerText: '选择车辆',
            onSelect: function(value) {
                //点击确定触发事件12 
            }
        });
        $('#singlePicker_forget_dummy').attr('style', 'border: none;background-color: #fff;width:56px;');

    })
    var yy = locals.get("lang"); //字符串缓存;
    if (yy == "zh-cn") {
        $translate.use('zh');
    } else if (yy == "us-en") {
        $translate.use('en');
    }

    $scope.cancelPhone = function() {
        $scope.model.phone = null;
    }
    //获得验证码初始化 或者 刚进页面的初始化
    $scope.fpgetCodeInit = function() {
        $scope.item.phonecode = $stateParams.phonecode;
        $scope.item.phone = $stateParams.phone;
        $("#codebutton").hide();
        $scope.time(); //读秒

    }

    //发送验证码 或者是获取验证码
    $scope.getcode = function(id) {
        var phonecode = "";
        var phone = "";
        if (id == 1) { //第一次输入手机号
            //判断当前手机号是否是合法的
            phonecode = $("#singlePicker_forget_dummy").val();
            phone = $scope.model.phone;
        } else if (id == 2) { //验证码过期 重新获取
            phonecode = $stateParams.phonecode;
            phone = $stateParams.phone;
        }

        var ret = /^1\d{10}$/
        if (phone == undefined || phone == "" || phone == null) {
            Popup.showAlert($translate.instant('dlzc_qsrndsjhm')); //请输入您的手机号码
            return false;
        }else if(!ret.test(phone)){
            Popup.showAlert($translate.instant('dlzc_sjhssz')); //
            return false;
        }
        //加载动画显示
        $ionicLoading.show({
            template: $translate.instant('sjcq_jzz')
        });
        var dataList = {
            mobile: phonecode.substring(1) + phone,
            type: 1,
        }

        var apiUrlPost = baseUrl + "/message/sendCode";
        var authorization = getTokenInfor()
        $http.post(apiUrlPost, JSON.stringify(dataList), {
            headers: { 'Authorization': authorization, 'Content-Type': 'application/json;charset=UTF-8' },
            timeout: timeOut
        }).success(function(data) {
            if (data.status == 1) { //成功
                $ionicLoading.hide();
                if(id == 2){
                    $("#timing").show()
                    $("#codebutton").hide();
                    $scope.time(); //读秒
                }
                $scope.codemodel.code = data.content.captcha; //获得的验证码
                locals.set("captcha", data.content.captcha); //字符串缓存
                location.href = "#/tab/forgetpassword/forgetpasswordgetcode/" + phonecode + "/" + phone + "/" + data.content.captcha
            }else{
                $ionicLoading.hide();
                Popup.showAlert($translate.instant('ts_qjcwl')); //请检查网络！
            }
        }).error(function(result) {
            $ionicLoading.hide();
            Popup.showAlert($translate.instant('ts_qjcwl')); //请检查网络！
        });
    }

    //检验用户输入的验证码是否正确
    $scope.checkcode = function(id) {
        if ($("#code" + id).val() != undefined && $("#code" + id).val() != "" && $("#code" + id).val() != null) {
            var id = ++id;
            $("#code" + id).focus();
        }
        var code1 = $scope.model.code1;
        var code2 = $scope.model.code2;
        var code3 = $scope.model.code3;
        var code4 = $scope.model.code4;
        var code5 = $scope.model.code5;
        var code6 = $scope.model.code6;
        var codestr = "" + code1 + code2 + code3 + code4 + code5 + code6;
        $codestr = codestr
        var timestr = $("#miao").html();
        var captchaCode = locals.get("captcha");
        if (code1 != undefined && code2 != undefined && code3 != undefined && code4 != undefined && code5 != undefined && code6 != undefined) {
            //加载动画显示
            $ionicLoading.show({
                template: $translate.instant('sjcq_jzz')
            });
            var apiUrlPost = baseUrl + `/schedules/web/validCode?mobile=` + $stateParams.phone + `&code=` +  codestr;
            var authorization = getTokenInfor()
            $http.get(apiUrlPost, {
                headers: { 'Authorization': authorization, 'Content-Type': 'application/json;charset=UTF-8' },
                timeout: timeOut
            }).success(function(data) {
                if (data.status == 1) { //成功 
                    $codestr = codestr
                    $ionicLoading.hide();
                    location.href = "#/tab/forgetpassword/reset/" + $stateParams.phonecode + "/" + $stateParams.phone;
                }else if (data.status == 6) {
                    $ionicLoading.hide();
                    Popup.showAlert($translate.instant('dlzc_yzmsrcwhdhsr')); //"验证码未输入，请输入验证码"
                    $scope.model = null;
                    return false;
                } else if (data.status == 7) {
                    $ionicLoading.hide();
                    Popup.showAlert($translate.instant('dlzc_yzmsrcwhdhsr')); //"验证码未输入，请输入验证码"
                    $scope.model = null;
                    return false;
                } else if (data.status == 8) {
                    $ionicLoading.hide();
                    Popup.showAlert($translate.instant('dlzc_yzmygqqcxfs')); //"验证码不存在或已过期，请重新发送"
                    $scope.model = null;
                    return false;
                }
            }).error(function(result) {
                $ionicLoading.hide();
                Popup.showAlert($translate.instant('ts_qjcwl')); //请检查网络！
            });
        }
    }

    //清除
    $scope.cancelName = function() {
        $scope.model.Name = "";
    }
    $scope.cancelPass = function() {
        $scope.model.Pass = "";
    }
    $scope.cancelCompany = function() {
        $scope.model.Company = "";
    }
    $scope.cancelPosition = function() {
        $scope.model.Position = "";
    }

    //密码显示
    $scope.showPsw = function() {
        $("#pass1").hide();
        $("#pass2").show();

    }

    //密码隐藏
    $scope.hidePsw = function() {
        $("#pass1").show();
        $("#pass2").hide();
    }

    //密码修改重置
    $scope.resetSubmit = function() {
        $scope.model.phonecode = $stateParams.phonecode;
        $scope.model.phone = $stateParams.phone;
        var Pass = $scope.model.password;
        var passwordstr = hex_md5(Pass + "NJXngVrIvOkReOolu2MZRl6dJvF8i3Sl"); //MD5加密 

        // var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/;
        if (Pass == null || Pass == undefined || Pass == "") {
            Popup.showAlert($translate.instant('dlzc_qsrmm')); //请输入密码
            return false;
        } else if (Pass.length < 6) {
            Popup.showAlert($translate.instant('dlzc_mmlwzmsz'));
            return false;
        }
        //加载动画显示
        $ionicLoading.show({
            template: $translate.instant('sjcq_jzz')
        });

        var fd = new FormData(); //初始化一个FormData实例
        fd.append('userMobile', $stateParams.phone);
        fd.append('password', Pass);
        fd.append('code', $codestr);

        var apiUrlPost = baseUrl + "/schedules/web/resetPassword";

        var authorization = getTokenInfor()
        $http.post(apiUrlPost, fd, {
            headers: { 'Authorization': authorization, 'Content-Type': undefined },
            timeout: timeOut
        }).success(function(data) {
            if (data.status == 1) { //成功
                $ionicLoading.hide();
                // Popup.showAlert("重置成功");
                location.href = "#/tab/login";
            } else if (data.status == 3) {
                $ionicLoading.hide();
                Popup.showAlert($translate.instant('dlzc_sjhwzcqqwzc')); //"手机号未注册，请前往注册"
                return false;
            }
        }).error(function(result) {
            $ionicLoading.hide();
            Popup.showAlert($translate.instant('ts_qjcwl')); //请检查网络！
        });
    }

    //返回到忘记密码的页面
    $scope.ForgetPassword = function(){
        location.href = "#/tab/login"
    }
    $scope.goBack = function() {
        // window.history.back();  //返回上一页
        location.href = '#/tab/login' //返回登录页面
    }

    //输入验证码时的计时器
    var timer;
    $scope.time = function() {
        var wait = $("#codeTime").val();
        $('#miao').html(wait);
        timer = setInterval(function() {
            if (wait == 0) {
                clearInterval(timer);
                $("#codebutton").show();
                $('#miao').html(wait);
                $("#timing").hide()

            } else {
                $('#miao').html(wait);
                $("#codebutton").hide();
                wait--;
            }
        }, 1000);
    }
});


