app.controller('registerController', function($scope, $http, $resource, $translate, $stateParams,
    $rootScope, $state, $ionicTabsDelegate, $translate, Popup, locals, $ionicLoading) {
    $scope.model = {};
    $scope.codemodel = {};
    $scope.item = {};
    //监听页面动作
    $rootScope.$on('$ionicView.beforeEnter', function() {
        var statename = $state.current.name;
        $ionicTabsDelegate.showBar(false); //当前页面隐藏tab
        if (statename === 'tab.register-phone' || statename === 'tab.register-perfection') {
            clearInterval(timer); //停止这个读秒
        }
        var yy = locals.get("lang"); //字符串缓存;
        var datePicker_lang = 'en';
        if (yy == "zh-cn") {
            datePicker_lang = 'zh';
        }
        //单项内容选择
        $('#singlePicker_register').mobiscroll().select({
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
        $('#singlePicker_register_dummy').prop('style', 'border: none;background-color: #fff;width:56px;');

    })
    var yy = locals.get("lang"); //字符串缓存;
    if (yy == "zh-cn") {
        $translate.use('zh');
    } else if (yy == "us-en") {
        $translate.use('en');
    }
    $scope.cancel = function() {
        $scope.model = null;
    }


    $scope.goxy = function() {
        location.href = "/#/tab/register/agreement";
    }

    // //协议
    // $scope.agreementinit = function() {
    //     if (yy == "zh-cn") {
    //         $("#zh_cn_li").attr("class", "on");
    //         $("#zh_cn_showhide").show();

    //         $("#us_en_li").attr("class", "");
    //         $("#us_en_showhide").hide();
    //     } else if (yy == "us-en") {
    //         $("#us_en_li").attr("class", "on");
    //         $("#us_en_showhide").show();

    //         $("#zh_cn_li").attr("class", "");
    //         $("#zh_cn_showhide").hide();
    //     } else {
    //         $("#zh_cn_li").attr("class", "on");
    //         $("#zh_cn_showhide").show();

    //         $("#us_en_li").attr("class", "");
    //         $("#us_en_showhide").hide();
    //     }
    // }
    ////协议语言切换
    // $scope.ch_zn_go = function() {
    //     $("#zh_cn_li").attr("class", "on");
    //     $("#zh_cn_showhide").show();

    //     $("#us_en_li").attr("class", "");
    //     $("#us_en_showhide").hide();
    // }
    // $scope.us_en_go = function() {
    //     $("#us_en_li").attr("class", "on");
    //     $("#us_en_showhide").show();

    //     $("#zh_cn_li").attr("class", "");
    //     $("#zh_cn_showhide").hide();
    // }
    $scope.goBack = function() {
        // window.history.back();  //返回上一页
        location.href = '#/tab/login' //返回登录页面
    }
    $scope.Register = function() {
        location.href = '#/tab/login' //返回登录页面
    }

    //发送验证码
    $scope.getcode = function(id) {
        var phonecode = "";
        var phone = "";
        if (id == 1) {
            phonecode = $("#singlePicker_register_dummy").val();
            phone = $scope.model.phone;
        } else if (id == 2) {
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
        var fd2 = new FormData(); //初始化一个FormData实例
        fd2.append('userMobile', phone);
        var apiUrlPost2 = baseUrl + "/schedules/web/selectUserByUserMobile";
        var authorization2 = getTokenInfor()
        $http.post(apiUrlPost2, fd2, {
            headers: { 'Authorization': authorization2, 'Content-Type': undefined },
            timeout: timeOut
        }).success(function(data) {
            if (data.status == 2) { //已注册
                $ionicLoading.hide();
                Popup.showAlert($translate.instant('dlzc_sjhyzcqqwdl')); //手机号已注册，请前往登录
                return false;
            } else {
                var dataList = {
                    mobile: phonecode.substring(1) + phone,
                    type: 0,
                }
                var apiUrlPost = baseUrl + "/message/sendCode";
                var authorization = getTokenInfor()
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
                        location.href = "#/tab/register/registergetcode/" + phonecode + "/" + phone + "/" + data.content.captcha;
                    }
                }).error(function(result) {
                    $ionicLoading.hide();
                    Popup.showAlert($translate.instant('ts_qjcwl')); //请检查网络！
                });
            }
        }).error(function(result) {
            $ionicLoading.hide();
            Popup.showAlert($translate.instant('ts_qjcwl')); //请检查网络！
        });
    }

    //获得验证码初始化
    $scope.registergetCodeInit = function() {
        $scope.item.phonecode = $stateParams.phonecode;
        $scope.item.phone = $stateParams.phone;
        $("#codebutton").hide();
        $scope.time(); //读秒
    }

    //注册验证码检验方法
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
        var timestr = $("#miao").html();
        var captchaCode = locals.get("captcha");
        if (code1 != undefined && code2 != undefined && code3 != undefined && code4 != undefined && code5 != undefined && code6 != undefined) {
            //加载动画显示
            $ionicLoading.show({
                template: $translate.instant('sjcq_jzz')
            });
            //手机的验证码和输入的是否一致
            var apiUrlPost = baseUrl + `/schedules/web/validCode?mobile=${$stateParams.phone}&code=${codestr}`;
            var authorization = getTokenInfor()
            $http.get(apiUrlPost, {
                headers: { 'Authorization': authorization, 'Content-Type': undefined },
                timeout: timeOut
            }).success(function(data) {
                if (data.status == 1) { //成功 
                    $codestr = codestr
                    $ionicLoading.hide();
                    location.href = "#/tab/register/perfection/" + $stateParams.phonecode + "/" + $stateParams.phone + "/" + codestr;
                } else{
                    $ionicLoading.hide();
                    Popup.showAlert($translate.instant('dlzc_yzmygqqcxfs')); //"验证码不存在或已过期，请重新发送"
                    $scope.model = null;
                    return false;
                }
            }).error(function(result) {
                $ionicLoading.hide();
                Popup.showAlert($translate.instant('ts_qjcwl')); //请检查网络！
            });
            // if (captchaCode != codestr) {
            //     Popup.showAlert($translate.instant('dlzc_yzmsrcwhdhsr')); //'验证码输入错误，请核对后输入'
            //     $scope.model = null;
            //     return false;
            // } else if (timestr == "60") {
            //     Popup.showAlert($translate.instant('dlzc_yzmygqqcxfs')); //"验证码不存在或已过期，请重新发送"
            //     $scope.model = null;
            //     return false;
            // } else {
            //     location.href = "#/tab/register/perfection/" + $stateParams.phonecode + "/" + $stateParams.phone + "/" + codestr;
            // }
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
    $scope.cancelinviteCode = function() {
        $scope.model.inviteCode = "";
    }

    //注册提交
    $scope.registerSubmit = function() {
        var name = $scope.model.Name;
        var Pass = $scope.model.Pass;
        var Company = $scope.model.Company;
        var Position = $scope.model.Position;
        var inviteCode = $scope.model.inviteCode ? $scope.model.inviteCode : ''
        $scope.model.phonecode = $stateParams.phonecode;
        $scope.model.phone = $stateParams.phone;
        $scope.model.code = $stateParams.code;
        // var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/;
        if (name == null || name == undefined || name == "") {
            Popup.showAlert($translate.instant('dlzc_qsrzsxm')); //请输入真实姓名',
            return false;
        }
        if (Pass == null || Pass == undefined || Pass == "") {
            Popup.showAlert($translate.instant('dlzc_qsrmm')); //请输入密码

            return false;
        } else if (Pass.length < 6) {
            Popup.showAlert($translate.instant('dlzc_mmlwzmsz')); //"设置密码，不低于6位"
            return false;
        }
        if (Company == null || Company == undefined || Company == "") {
            Popup.showAlert($translate.instant('dlzc_qsrgsmc')); //请输入公司名称',
            return false;
        }
        if (Position == null || Position == undefined || Position == "") {
            Popup.showAlert($translate.instant('dlzc_qsrgszw')); //请输入公司职位
            return false;
        }
        // if (inviteCode == null || inviteCode == undefined || inviteCode == "") {
        //     Popup.showAlert($translate.instant('dlzc_qsryqm')); //请输入邀请码
        //     return false;
        // }
        //加载动画显示
        $ionicLoading.show({
            template: $translate.instant('sjcq_jzz')
        });

        var passwordstr = hex_md5(Pass + "NJXngVrIvOkReOolu2MZRl6dJvF8i3Sl"); //MD5加密 
        var fd = new FormData(); //初始化一个FormData实例
        fd.append('userMobile', $scope.model.phone);
        fd.append('password', Pass);
        fd.append('inviteCode', inviteCode);
        fd.append('userName', name);
        fd.append('companyName', Company);
        fd.append('companyPosition', Position);
        fd.append('code', $scope.model.code);

        var apiUrlPost = baseUrl + "/schedules/web/regist";
        var authorization = getTokenInfor()
        $http.post(apiUrlPost, fd, {
            headers: { 'Authorization': authorization, 'Content-Type': undefined },
            timeout: timeOut
        }).success(function(data) {
            if (data.status == 1) { //成功
                $ionicLoading.hide();
                //Popup.showAlert("注册成功");
                location.href = "#/tab/login";
            } else if (data.status == 3) {
                $ionicLoading.hide();
                Popup.showAlert($translate.instant('dlzc_sjhyzcqqwdl')); //手机号已注册，请前往登录
                return false;
            } else if (data.status == 4) {
                $ionicLoading.hide();
                Popup.showAlert($translate.instant('dlzc_yqmcwhdhsr')); //"邀请码不正确"
                return false;
            }
        }).error(function(result) {
            $ionicLoading.hide();
            Popup.showAlert($translate.instant('ts_qjcwl')); //请检查网络！
        });
    }

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