app.controller('loginController', function($scope, $http, $resource, $filter, $stateParams, $rootScope,
    $state, $ionicTabsDelegate, $ionicLoading, $translate, Popup, locals) {
    $scope.model = {};
    $scope.codemodel = {};
    $scope.item = {};
    //监听页面动作
    $rootScope.$on('$ionicView.beforeEnter', function() {
        var statename = $state.current.name;
        if (statename === 'tab.login' || statename === 'tab.login-phpne' || statename === 'tab.login-getcode') {
            $ionicTabsDelegate.showBar(false); //当前页面隐藏tab

        } else {
            $ionicTabsDelegate.showBar(true);
        }
        if (statename === 'tab.login' || statename === 'tab.login-phpne') {
            clearInterval(timer); //停止这个读秒
        }
        var yy = locals.get("lang"); //字符串缓存;
        var datePicker_lang = 'en';
        if (yy == "zh-cn") {
            datePicker_lang = 'zh';
        }
        //单项内容选择
        $('#singlePicker_login').mobiscroll().select({
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
        $('#singlePicker_login_dummy').attr('style', 'border: none;background-color: #fff;width:56px;');
    });
    var yy = locals.get("lang"); //字符串缓存;
    if (yy == "zh-cn") {
        $translate.use('zh');
    } else if (yy == "us-en") {
        $translate.use('en');
    }

    $scope.gotoHome = function() {
        location.href = '#/tab/sailSchedule';
    }
    $scope.goBack = function() {
        // window.history.back();  //返回上一页
        location.href = '#/tab/login' //返回登录页面
    }



    //提交登录
    $scope.submitLogin = function() {
            var userName = $scope.model.userName;
            var passWord = $scope.model.passWord;

            if (userName == undefined || userName == "" || userName == null) {
                Popup.showAlert($translate.instant('dlzc_qsrsjhm'));
                return false;
            }
            if (passWord == undefined || passWord == "" || passWord == null) {
                Popup.showAlert($translate.instant('dlzc_qsrmm'));
                return false;
            }
            //加载动画显示
            $ionicLoading.show({
                template: $translate.instant('dlzc_dlz')
            });
            var passwordstr = hex_md5(passWord + "NJXngVrIvOkReOolu2MZRl6dJvF8i3Sl") //MD5加密
            var loginInfo = '帐号：' + userName + '，密码：' + passWord
            var fd = new FormData() //初始化一个FormData实例
            fd.append('userMobile', userName)
            fd.append('password', passWord)
            fd.append('isRemeber', 0)
            var queryToken = {
                username: userName,
                password: passWord,
                isRemeber: '',
                grant_type: 'password'
            }
            var authUrl = tokenUrl
            var auth = tokenAuth
            $.ajax({
                type: "POST",
                url: authUrl,
                timeout: timeOut,
                headers: {
                    Authorization: auth
                },
                data: queryToken,        
                success: function(data) {
                    if (data.access_token) { //成功
                        locals.set("login_content", data.userId); //字符串缓存
                        location.href = "#/tab/my"
                        localStorage.setItem('gateway_token',"Bearer " + data.access_token)
                        localStorage.setItem('storedInfor',JSON.stringify(queryToken))
                        $ionicLoading.hide()
                    } else if (data.status == 500) {
                        $ionicLoading.hide();
                        Popup.showAlert($translate.instant('dlzc_sjhwzcqqwzc')); //手机号未注册，请前往注册"
                        return false;
                    } else if (data.status == 4) {
                        $ionicLoading.hide();
                        Popup.showAlert($translate.instant('dlzc_zhhmmcw')); //账号或密码错误！
                        return false;
                    }
                },
                error: function(xhr, textStatus, errorThrown) {　　
                    $ionicLoading.hide();　
                    Popup.showAlert($translate.instant('ts_qjcwl')); //请检查网络！
                }
            });
        }
    //注册验证码更改方法
    $scope.checkcode = function(id) {

        if ($("#code" + id).val() != undefined && $("#code" + id).val() != "" && $("#code" + id).val() != null) {
            var id = ++id;
            $("#code" + id).focus();
        }
        $scope.model.phonecode = $stateParams.phonecode;
        $scope.model.phone = $stateParams.phone;
        $scope.model.code = $stateParams.code;
        var code1 = $scope.model.code1;
        var code2 = $scope.model.code2;
        var code3 = $scope.model.code3;
        var code4 = $scope.model.code4;
        var code5 = $scope.model.code5;
        var code6 = $scope.model.code6;
        var codestr = "" + code1 + code2 + code3 + code4 + code5 + code6;
        var captchaCode = locals.get("captcha");
        if (code1 != undefined && code2 != undefined && code3 != undefined && code4 != undefined && code5 != undefined && code6 != undefined) {
            //加载动画显示
            $ionicLoading.show({
                template: $translate.instant('sjcq_jzz')
            });
            var fd = new FormData(); //初始化一个FormData实例
            // fd.append('userMobile', $stateParams.phone);
            // fd.append('verificationCode', codestr);
            // var apiUrlPost = baseUrl + "/schedules/web/phoneLogin";
            fd.append('mobile', $stateParams.phone);
            fd.append('code', codestr);
            var apiUrlPost = baseUrl + "/auth/login/mobile";
            var authorization = getTokenInfor()
            $http.post(apiUrlPost, fd, {
                headers: { 'Authorization': authorization, 'Content-Type': undefined },
                timeout: timeOut
            }).success(function(data) {
                if (data.status == 1) { //成功 
                    localStorage.setItem('gateway_token',"Bearer " + data.content.value)
                    $ionicLoading.hide();
                    locals.set("login_content", data.content.additionalInformation.userId); //字符串缓存
                    location.href = "#/tab/my";
                } else if (data.status == 3) {
                    $ionicLoading.hide();
                    Popup.showAlert($translate.instant('dlzc_sjhwzcqqwzc')); //"手机号未注册，请前往注册"
                    $scope.model = null;
                    return false;
                }  else if (data.status == 4) {
                    $ionicLoading.hide();
                    Popup.showAlert($translate.instant('dlzc_zhhmmcw')); //账号或密码错误！
                    $scope.model = null;
                    return false;
                }else if (data.status == 6) {
                    $ionicLoading.hide();
                    Popup.showAlert($translate.instant('dlzc_yzmsrcwhdhsr')); //"验证码未输入，请输入验证码"
                    $scope.model = null;
                    return false;
                } else if (data.status == 7) {
                    $ionicLoading.hide();
                    Popup.showAlert($translate.instant('dlzc_yzmsrcwhdhsr'));
                    $scope.model = null;
                    return false;
                } else if (data.status == 8) {
                    $ionicLoading.hide();
                    Popup.showAlert($translate.instant('dlzc_yzmygqqcxfs')); //"验证码不存在或已过期，请重新发送"
                    $scope.model = null;
                    return false;
                } else if (data.status == 9) {
                    $ionicLoading.hide();
                    Popup.showAlert($translate.instant('dlzc_yzzhbty')); //"验证码不存在或已过期，请重新发送"
                    $scope.model = null;
                    return false;
                } else if (data.status == 10) {
                    $ionicLoading.hide();
                    Popup.showAlert($translate.instant('dlzc_yzmmbaq')); //"验证码不存在或已过期，请重新发送"
                    $scope.model = null;
                    location.href = "#/tab/forgetpassword/forgetpasswordphone"
                }
            }).error(function(result) {
                $ionicLoading.hide();
                Popup.showAlert($translate.instant('ts_qjcwl')); //请检查网络！
            })
        }

    }

    $scope.cancel = function() {
        $scope.model.phone = "";
    }
    $scope.canceluserName = function() {
        $scope.model.userName = "";
    }

    //获取验证码
    $scope.getcode = function(id) {
            var phonecode = "";
            var phone = "";
            if (id == 1) { //第一次获取验证码
                phonecode = $("#singlePicker_login_dummy").val();
                phone = $scope.model.phone;
            } else if (id == 2) { //验证码过期获取
                phonecode = $stateParams.phonecode;
                phone = $stateParams.phone;
            }
            if (phone == undefined || phone == "" || phone == null) {
                Popup.showAlert($translate.instant('dlzc_qsrndsjhm')); //请输入您的手机号码
                return false;
            }
            //加载动画显示
            $ionicLoading.show({
                template: $translate.instant('sjcq_jzz')
            });
            var dataList = {
                mobile: phonecode.substring(1) + phone,
                type: 2,
            }
            var apiUrlPost = baseUrl + "/message/sendCode";
    
            var authorization = getTokenInfor()
            console.log(authorization,'authorizationauthorization')
            $http.post(apiUrlPost, JSON.stringify(dataList), {
                headers: { 'Authorization': authorization, 'Content-Type': 'application/json;charset=UTF-8' },
                timeout: timeOut
            }).success(function(data) {
                if (data.status == 1) { //成功
                    if(id == 2){
                        $("#timing").show()
                        $("#codebutton").hide();
                        $scope.time(); //读秒
                    }

                    $ionicLoading.hide();
                    locals.set("captcha", data.content.captcha); //字符串缓存
                    location.href = "#/tab/login/logingetcode/" + phonecode + "/" + phone + "/" + data.content.captcha;
                }else{
                    $ionicLoading.hide();
                    Popup.showAlert($translate.instant('ts_qjcwl')); //请检查网络！
                }
            }).error(function(result) {
                $ionicLoading.hide();
                Popup.showAlert($translate.instant('ts_qjcwl')); //请检查网络！
            });
                
        }
    //初始化读秒
    $scope.logingetCodeInit = function() {
        $scope.item.phonecode = $stateParams.phonecode;
        $scope.item.phone = $stateParams.phone;
        $("#codebutton").hide();
        $scope.time(); //读秒
    }

    //读秒
    var timer;
    $scope.time = function() {
        var wait = $("#codeTime").val();
        $('#miao').html(wait);
        timer = setInterval(function() {
            if (wait == 0) {
                clearInterval(timer); //停止这个读秒
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