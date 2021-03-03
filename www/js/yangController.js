app.controller('yangController', function ($scope, $http, $resource, $translate, $stateParams, $ionicTabsDelegate, $rootScope,
    $state, ionicDatePicker, $filter, locals, $cordovaCamera, $cordovaImagePicker, $ionicPlatform, Popup, Popup2,$ionicLoading) {

    //监听页面动作
    $rootScope.$on('$ionicView.beforeEnter', function () {
        var statename = $state.current.name;
        // console.log('yangController: ' + statename);
        if (statename === 'tab.yang-detail') {
            $ionicTabsDelegate.showBar(false); //当前页面隐藏tab
        } else {
            $ionicTabsDelegate.showBar(true);
        }

        var yy = locals.get("lang"); //字符串缓存;
        var datePicker_lang = 'en';
        if (yy == "zh-cn") {
            datePicker_lang = 'zh';
        }

        var week = new Date().getDay();
        var minDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
        var _maxDate = null;
        if (week == 0) {//今天是周末
            _maxDate = new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 28));
        } else {//今天是周一至周六
            var nowDate = new Date();
            nowDate.setDate(nowDate.getDate() - nowDate.getDay() + 1);
            nowDate.setDate(nowDate.getDate() + 6);
            _maxDate = new Date(new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate()).getTime() + (1000 * 60 * 60 * 24 * 21));
        }
        var maxDate = new Date(_maxDate.getFullYear(), _maxDate.getMonth(), _maxDate.getDate());

        /* 时间控件初始化 */
        var currYear = (new Date()).getFullYear();
        var opt = {};
        opt.date = { preset: 'date' };
        opt.datetime = { preset: 'datetime' };
        opt.time = { preset: 'time' };
        opt.default = {
            theme: 'android-ics light', //皮肤样式
            display: 'modal', //显示方式 
            mode: 'scroller', //日期选择模式
            dateFormat: 'yy-mm-dd',
            lang: datePicker_lang,//en zh
            showNow: true,
            startYear: currYear - 10, //开始年份
            endYear: currYear + 10, //结束年份
            minDate: minDate,
            maxDate: maxDate
        };
        $("#_dateTimePicker").mobiscroll($.extend(opt['date'], opt['default']));


        //单项内容选择
        $('#singlePicker').mobiscroll().select({
            theme: 'android-ics light',
            mode: 'scroller',
            display: 'modal',
            lang: datePicker_lang,//en zh
            // cancelText: null,
            // headerText: '选择车辆',
            onSelect: function (value) {
                //点击确定触发事件12 
            }
        });


        $("#treelist").mobiscroll().treelist({
            theme: "android-ics light",
            lang: "zh",
            defaultValue: [Math.floor($('#treelist li').length / 2)],
            cancelText: null,
            headerText: function (valueText) { return "选择班级"; }
        });

        $('#singlePicker_dummy').attr('style', 'border: none;background-color: #fff;width:30px;');
    });
    //计算当前日期是星期几
    $scope.getWeek = function (value) {
        var weekEnArry = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];
        var arys1 = new Array();
        arys1 = value.split('-'); //日期为输入日期，格式为 2013-3-10
        var ssdate = new Date(arys1[0], parseInt(arys1[1] - 1), arys1[2]);
        var week = ""; //就是你要的星期几
        if (locals.get('lang') == "us-en") {
            var week1 = String(ssdate.getDay()).replace("0", weekEnArry[0]).replace("1", weekEnArry[1]).replace("2", weekEnArry[2]).replace("3", weekEnArry[3]).replace("4", weekEnArry[4]).replace("5", weekEnArry[5]).replace("6", weekEnArry[6]) //就是你要的星期几
            week = "（" + week1 + "）"; //就是你要的星期几
        } else {
            var week1 = String(ssdate.getDay()).replace("0", "日").replace("1", "一").replace("2", "二").replace("3", "三").replace("4", "四").replace("5", "五").replace("6", "六") //就是你要的星期几
            week = "（周" + week1 + "）"; //就是你要的星期几
        }
        return week;
    }

    $scope.toGZList=function(){

        location.href='/#/tab/trackList';
    }
    $scope.httpTest4 = function () {
        var authorization = getAuthorization();

        //可用
        // var fd = new FormData(); //初始化一个FormData实例
        // fd.append('portCode',  'usnwk');
        // $http.get('https://365edi.cn/schedules/port/getPortLocation?portCode=usnwk', {
        //     headers: { 'Authorization': authorization, 'Content-Type': undefined },
        //     timeout: timeOut
        // }).success(function(data) {
        //     console.log('---------------------------'.data);
        // }).error(function(result) {
        //     $ionicLoading.hide();
        // });

        //可用
        $.ajax({
            type: "get",
            url: 'https://365edi.cn/schedules/port/getPortLocation?portCode=usnwk',
            timeout: 10000,
            async: false,
            headers: { 'Authorization': authorization },
            success: function (result) {
                console.log(result);//{"status":1,"content":{"LON":-74.150000,"LAT":40.700000},"message":"SUCCESS"}
            },
            error: function (xhr, textStatus, errorThrown) {

            }
        });
    }

    // $scope.timeTest = function () {
    //     var zm_str = '2020-04-05';
    //     var zm_date = new Date(zm_str);

    //     var dt_now = new Date();
    //     var week = new Date().getDay();
    //     var p0, p1, p2, p3;
    //     if (week == 0) {//当前时间是周末

    //         var t0 = dt_now;
    //         var t0_end = new Date(zm_date.getTime() + (1000 * 60 * 60 * 24 * 7));
    //         p0 = String(t0.getMonth() + 1) + '/' + t0.getDate() + '-' + String(t0_end.getMonth() + 1) + '/' + t0_end.getDate();
    //         //console.log(p0);

    //         var t1 = new Date(zm_date.getTime() + (1000 * 60 * 60 * 24 * 8));
    //         var t1_end = new Date(zm_date.getTime() + (1000 * 60 * 60 * 24 * 14));
    //         p1 = String(t1.getMonth() + 1) + '/' + t1.getDate() + '-' + String(t1_end.getMonth() + 1) + '/' + t1_end.getDate();
    //         //console.log(p1);

    //         var t2 = new Date(zm_date.getTime() + (1000 * 60 * 60 * 24 * 15));
    //         var t2_end = new Date(zm_date.getTime() + (1000 * 60 * 60 * 24 * 21));
    //         p2 = String(t2.getMonth() + 1) + '/' + t2.getDate() + '-' + String(t2_end.getMonth() + 1) + '/' + t2_end.getDate()
    //         //console.log(p2);

    //         var t3 = new Date(zm_date.getTime() + (1000 * 60 * 60 * 24 * 22));
    //         var t3_end = new Date(zm_date.getTime() + (1000 * 60 * 60 * 24 * 28));
    //         p3 = String(t3.getMonth() + 1) + '/' + t3.getDate() + '-' + String(t3_end.getMonth() + 1) + '/' + t3_end.getDate()
    //         console.log(p3);
    //     } else {

    //         var t0 = dt_now;
    //         var t0_end = new Date(zm_date.getTime());
    //         p0 = String(t0.getMonth() + 1) + '/' + t0.getDate() + '-' + String(t0_end.getMonth() + 1) + '/' + t0_end.getDate();
    //         //console.log(p0);

    //         var t1 = new Date(zm_date.getTime() + (1000 * 60 * 60 * 24 * 1));
    //         var t1_end = new Date(zm_date.getTime() + (1000 * 60 * 60 * 24 * 7));
    //         p1 = String(t1.getMonth() + 1) + '/' + t1.getDate() + '-' + String(t1_end.getMonth() + 1) + '/' + t1_end.getDate();
    //         //console.log(p1);

    //         var t2 = new Date(zm_date.getTime() + (1000 * 60 * 60 * 24 * 8));
    //         var t2_end = new Date(zm_date.getTime() + (1000 * 60 * 60 * 24 * 14));
    //         p2 = String(t2.getMonth() + 1) + '/' + t2.getDate() + '-' + String(t2_end.getMonth() + 1) + '/' + t2_end.getDate()
    //         //console.log(p2);

    //         var t3 = new Date(zm_date.getTime() + (1000 * 60 * 60 * 24 * 15));
    //         var t3_end = new Date(zm_date.getTime() + (1000 * 60 * 60 * 24 * 21));
    //         p3 = String(t3.getMonth() + 1) + '/' + t3.getDate() + '-' + String(t3_end.getMonth() + 1) + '/' + t3_end.getDate()
    //         console.log(p3);
    //     }
    //     console.log(p0, p1, p2);
    // }

    $scope.goto_ZM_Test = function () {

        Popup2.showAlert($translate.instant('sjcq_czcc'), '/#/tab/trackList');
    }
    $scope.goto_ZC_Test = function () {
        location.href = '/#/tab/register/perfection/+86/13804098545/558155';
    }

    $scope.GetTab = function (NowZhouriString) {
        let Todaydate = new Date(); //当前时间

        if (NowZhouriString == $filter("date")(Todaydate, "yyyy-MM-dd")) {
            $scope.model.Tab = $filter("date")(Todaydate, "MM/dd") + "-" + $filter("date")($scope.getNewData(NowZhouriString, 7), "MM/dd");
            $scope.model.OneTab = $filter("date")($scope.getNewData(NowZhouriString, 8), "MM/dd") + "-" + $filter("date")($scope.getNewData(NowZhouriString, 14), "MM/dd");
            $scope.model.TwoTab = $filter("date")($scope.getNewData(NowZhouriString, 15), "MM/dd") + "-" + $filter("date")($scope.getNewData(NowZhouriString, 21), "MM/dd");
            $scope.model.ThreeTab = $filter("date")($scope.getNewData(NowZhouriString, 22), "MM/dd") + "-" + $filter("date")($scope.getNewData(NowZhouriString, 28), "MM/dd");
        } else {
            $scope.model.Tab = $filter("date")(Todaydate, "MM/dd") + "-" + $filter("date")(NowZhouriString, "MM/dd");
            $scope.model.OneTab = $filter("date")($scope.getNewData(NowZhouriString, 1), "MM/dd") + "-" + $filter("date")($scope.getNewData(NowZhouriString, 7), "MM/dd");
            $scope.model.TwoTab = $filter("date")($scope.getNewData(NowZhouriString, 8), "MM/dd") + "-" + $filter("date")($scope.getNewData(NowZhouriString, 14), "MM/dd");
            $scope.model.ThreeTab = $filter("date")($scope.getNewData(NowZhouriString, 15), "MM/dd") + "-" + $filter("date")($scope.getNewData(NowZhouriString, 21), "MM/dd");
        }
    }

    function compare(property) {
        return (firstobj, secondobj) => {
            const firstValue = firstobj[property];
            const secondValue = secondobj[property];
            return firstValue - secondValue; //升序
        };
    }

    $scope.zhaominTest1 = function () {
        var user1 = { name: 'lucy', age: 12 };
        var user2 = { name: 'lisi', age: 13 };
        var user3 = { name: 'zhangsan', age: 14 };
        var user6 = { name: 'lisi', age: 15 };
        var user5 = { name: 'zhangsan', age: 16 };

        var user = new Array();
        user.push(user1);
        user.push(user2);
        user.push(user3);
        user.push(user5);
        user.push(user6);

        $scope.model2 = user;

        var user2 = $scope.model2;

        var newData = new Array();
        var oldData = user2.sort(function (a, b) { if (a.name < b.name) { return -1 }; if (a.name > b.name) { return 1 }; });

        var i = 0;
        while (i < oldData.length) {
            var t1, t2;

            t1 = oldData[i];

            if (i + 1 < oldData.length) {
                t2 = oldData[i + 1];
            }
            console.log(t1, t2);
            if (t2 == null || t2 == undefined || t1.name != t2.name) {
                i = i + 1;
                newData.push(t1);
            } else {
                i = i + 2;
                if (t1.age > t2.age) {
                    newData.push(t1);
                } else {
                    newData.push(t2);
                }
            }
        }

        console.log(oldData, newData);
    }

    $scope.vipDetailInit = function () {

        console.log('vipDetailInit');
    }

    $scope.clickFunction = function (id) {

        location.href = '#/tab/yang/' + id;
    }
    $scope.clickVipFunction = function (item) {
        location.href = '#/tab/yang-vip/' + item.title + '_' + item.type;
    }
    $scope.paramId = $stateParams.id;

    $scope.tasks = [
        { title: '孙策', id: 4 },
        { title: '孙二娘', id: 5, type: 'vip' },
        { title: '张无良', id: 6 },
        { title: '司马空', id: 7, type: 'vip' }
    ];
    $scope.model = {};
    $.cookie('lang', 'zh-cn', { expires: 365, path: "/" });

    var lang = $.cookie('lang');

    // //在此作用域下绑定监听ionic视图在离开之前的事件  
    // $scope.$on('$ionicView.beforeLeave', function () {
    //     //打开tab选项卡      
    //     $ionicTabsDelegate.showBar(true);
    // });

    $scope.loadingTest = function () {

        $ionicLoading.show({
            template: $translate.instant('sjcq_jzz')
        });

        setTimeout(function () {
            $ionicLoading.hide(); //加载动画隐藏
        }, 2000);
    }

    $scope.init = function () {

        // $scope.$on('$ionicView.beforeEnter', function () {
        //     //关闭tab选项卡      
        //     $ionicTabsDelegate.showBar(false);
        // });


        //console.log('in init function');
        var apiUrl_GetTest = 'https://wxservice.jctrans.com/WXAPI/GZ2019/GetTest?Name=lucy';
        var apiUrl_PostTest = 'https://wxservice.jctrans.com/WXAPI/GZ2019/PostTest?Name=lucy';

        $scope.loginUserInfo = {};
        $http.post(apiUrl_PostTest)
            .success(function (data) {
                //console.log(data);
                //console.log(data.code);
            });

        $http.get(apiUrl_GetTest)
            .success(function (data) {
                //alert(data.code);
                $scope.loginUserInfo = data;
            });

    }


    //提交登录
    $scope.submitLogin = function () {

        var loginInfo = '帐号：' + $scope.userName + '，密码：' + $scope.passWord
        alert(loginInfo);

        var login_userinfo_msg = $.cookie('login_userinfo_msg');
        if (login_userinfo_msg == undefined || login_userinfo_msg == null) {

            var expiresDate = new Date();
            var minutes = 60;
            expiresDate.setTime(expiresDate.getTime() + (minutes * 60 * 1000));

            $.cookie('login_userinfo_msg', loginInfo, { expires: expiresDate, path: "/" });
        } else {
            alert("登录信息（cookie）：" + login_userinfo_msg);
            $.removeCookie('login_userinfo_msg', { path: '/' });
        }

        //alert($scope.passWord);
        //alert($('#passWord').val());

    }

    $scope.sign = true;
    $scope.switchlang = function () {
        // if ($scope.sign) {
        //     $translate.use('en');
        //     $scope.sign = false;
        // } else {
        //     $translate.use('zh');
        //     $scope.sign = true;
        // }

        // console.log($translate.use());
        // console.log($translate.instant('sskj_yiyue'));

        var yy = locals.get("lang"); //字符串缓存;
        if (yy == "zh-cn") {
            $translate.use('en');
            locals.set("lang", "us-en"); //字符串缓存
        } else {
            $translate.use('zh');
            locals.set("lang", "zh-cn"); //字符串缓存
        }
    }

    // $scope.GetDateDiff = function (startDate, endDate) {
    //     var startTime = new Date(Date.parse(startDate)).getTime();
    //     var endTime = new Date(Date.parse(endDate)).getTime();
    //     var dates = Math.abs((startTime - endTime)) / (1000 * 60 * 60 * 24);
    //     return dates;
    // }


    //页面显示日期
    $scope.validedTime = new Date().getTime();
    //$scope.validedEndTime = $scope.endDate;  //日历结束日

    //日期控件-双语资源（如果切换语言以后显示有问题，则将datePickerObj放置在$rootScope.$on('$ionicView.beforeEnter', function () {}中即可）
    var Jan = $translate.instant('sskj_yiyue');
    var Today = $translate.instant('sskj_dangtian');

    //日期控件-初始化
    var datePickerObj = {
        //选择日期后的回调
        callback: function (val) {
            if (typeof (val) === 'undefined') { } else {
                $scope.validedTime = $filter('date')(new Date(val), 'yyyy-MM-dd');
                datePickerObj.inputDate = new Date(val); //更新日期弹框上的日期  
            }
        },
        // disabledDates: [
        //     new Date(2016, 2, 16),
        //     new Date(2015, 3, 16),
        //     new Date(2015, 4, 16),
        //     new Date(2015, 5, 16),
        //     new Date('Wednesday, August 12, 2015'),
        //     new Date("2016-08-16"),
        //     new Date(1439676000000)
        // ],
        // from: $scope.validedTime,
        // to: $scope.validedEndTime,
        // inputDate: new Date($scope.validedTime),
        // mondayFirst: true,
        // disableWeekdays: [], //设置不能选中
        // closeOnSelect: false,
        // dateFormat: 'yyyy-MM-dd',
        // templateType: 'popup',
        inputDate: new Date(),
        setLabel: 'Set',
        todayLabel: Today,
        closeLabel: 'Close',
        mondayFirst: false, //默认值为false，它将在周日显示为一周的第一天。
        weeksList: ["S", "M", "T", "W", "T", "F", "S"],
        monthsList: [Jan, "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
        templateType: 'popup',
        from: new Date(2018, 1, 31),
        to: new Date(2025, 12, 31),
        showTodayButton: false,
        dateFormat: 'yyyy-MM-dd',
        closeOnSelect: true
    };
    //打开日期选择框
    $scope.openDatePicker = function () {
        ionicDatePicker.openDatePicker(datePickerObj);
    };


    //本地缓存机制测试
    $scope.userModel = {};
    $scope.userModel.name = "Lucy";
    $scope.userModel.age = 32
    $scope.locationTest = function () {
        //存
        //locals.set("firstpos", firstpos);//字符串
        locals.setObject("user_info", $scope.userModel);//对象

        //取
        //locals.get("firstpos");
        var user = locals.getObject("user_info");
        console.log(user);

        $scope.userModel = user;

        $scope.userModel.age = $scope.userModel.age * 1 + 1;
        locals.setObject("user_info", $scope.userModel);//对象        
    }

    $scope.httpgetTest2 = function () {
        var authUrl = 'https://wxservice.jctrans.com/WXAPI/GZ2019/GetTest?Name=lucy';
        var authorization = '';
        try {
            $.ajax({
                type: "GET",
                url: authUrl,
                async: false,
                success: function (result) {
                    //console.log('------getAuthorization------');
                    //console.log(result);
                    authorization = result;
                }
            });
        } catch (er) {
            alert(er);
        }
        alert(authorization);
    }

    $scope.httpgetTest = function () {

        // $http.get(url, {
        //     headers: { 'Authorization': authorization }
        // }).success(function (results) {
        //     console.log(results);
        // });

        // $http.get(baseUrl + '/auth/token?username=Jason&password=360fob')
        //     .success(function (data) {
        //         $scope.setHead(data.content);
        //     });
        var authUrl = baseUrl + '/auth/token?username=Jason&password=360fob';
        var authorization = '';
        try {
            $.ajax({
                type: "GET",
                url: authUrl,
                async: false,
                success: function (result) {
                    //console.log('------getAuthorization------');
                    console.log(authUrl);
                    console.log(result);
                    authorization = 'Bearer ' + result.content;
                }
            });
        } catch (er) {
            alert('getAuthorization error:' + er);
        }
        alert('getAuthorization:' + authorization);
    }

    $scope.dongtai = function () {

        $scope.Id = 12;

        var user1 = { 'name': 'Lucy' };
        var userInfoArry = new Array();
        userInfoArry.push(user1);

        $scope.UserInfo = userInfoArry;

        $scope.UserInfo[$scope.Id] = $scope.UserInfo;


        console.log($scope.UserInfo);

    }
    $scope.openQQ = function () {
        //跳转到QQ:
        // cordova.InAppBrowser.open('mqqwpa://im/chat?chat_type=wpa&uin=' + baseQQ + '&version=1&src_type=web&web_src=oicqzone.com ', '_system', 'location=no')
        contactCustomer()
    }

    $scope.setHead = function (authorization) {
        var url = baseUrl + '/schedules/web/queryCity';
        $http.get(url, {
            headers: { 'Authorization': 'Bearer ' + authorization }
        }).success(function (results) {
            console.log(results);
        });

        // $http.post(url , { id:21 } , {
        //     headers : {'Authorization' : auth}
        //   }).success(function(data, status, headers, config) {
        //     console.log(data);
        //     //...
        //   }).error(function(data, status, headers, config ) {
        //     //...
        //     console.log(data);
        //   });

        // $.ajax({
        //     type: "GET",
        //     url: url,
        //     beforeSend: function(request) {
        //        request.setRequestHeader("Authorization",auth);
        //     },
        //     success: function(result) {
        //         console(result);
        //     }
        // });

        // $.ajax({
        //     type: "POST",
        //     url: url,
        //     beforeSend: null,
        //     complete: function (XMLHttpRequest, textStatus) {
        //         console.log(XMLHttpRequest.responseText);
        //     }
        // });


    }

    // alert（警告） 对话框，弹窗
    $scope.showAlert = function () {

        Popup.showAlert('起始港不能为空');
        // var alertPopup = $ionicPopup.alert({
        //     title: 'Prompt Message',
        //     template: 'It might taste good'
        // });
        // alertPopup.then(function (res) {
        //     console.log('Thank you for not eating my delicious ice cream cone');
        // });
        // $timeout(function() {
        //     alertPopup.close(); // 3秒后关闭弹窗
        //  }, 3000);
    };


    /*********************调用相机********************/

    document.addEventListener("deviceready", function () {

        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };

        $scope.openCamera = function () {
            $cordovaCamera.getPicture(options).then(function (imageData) {
                var image = document.getElementById('imageFile');
                image.src = "data:image/jpeg;base64," + imageData;
            }, function (err) {
                // error
            });

        }, false;



        /* ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ 方法2 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ */
        $scope.getCamera = function () {
            if ($scope.data.y_image.length < 9) {
                var options = {
                    quality: 70,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    //allowEdit: true,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 480,
                    targetHeight: 720,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false
                };
                $cordovaCamera.getPicture(options).then(function (imageData) {
                    var imagedata = imageData;
                    $scope.data.isimage = true;
                    $ionicLoading.show({
                        template: '图片上传中...'
                    });
                    client.UpdateImage(imagedata, function (result) {
                        $ionicLoading.hide();
                        $scope.data.y_image.push({ 'src': "data:image/jpeg;base64," + imageData, 'val': '/Yuonhtt_FileUpload/img/' + result });
                        $scope.$digest();
                    }, function (name, err) {
                        alert(err);
                    });
                }, function (err) {
                    console.log(err);
                });
            } else {
                var confirmPopup = $ionicPopup.alert({
                    title: '提醒',
                    template: '上传图片超过9张!',
                    okText: '确 认',
                    okType: 'button-assertive'
                });
                confirmPopup.then(function (res) {
                });
            }

        };

        /* ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ 方法3 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ */
        // 上传文件
        $scope.postUploadFile = function () {
            $ionicActionSheet.show({
                buttons: [
                    {
                        text: '相机'
                    },
                    {
                        text: '图库'
                    }
                ],
                cancelText: '关闭',
                cancel: function () {
                    return true;
                },
                buttonClicked: function (index) {
                    switch (index) {
                        case 0:
                            $scope.pickImage(1); // 相机
                            break;
                        case 1:
                            $scope.pickImage(0); // 相册
                            break;
                        default:
                            break;
                    }
                    return true;
                }
            });
        }

        // 调用 相机 相册
        $scope.pickImage = function (type) {
            var options = {
                //这些参数可能要配合着使用，比如选择了sourcetype是0，destinationtype要相应的设置
                quality: 100, //相片质量0-100
                destinationType: 0, //返回类型：DATA_URL= 0，返回作为 base64 編碼字串。 FILE_URI=1，返回影像档的 URI。NATIVE_URI=2，返回图像本机URI (例如，資產庫)
                sourceType: 0, //从哪里选择图片：PHOTOLIBRARY=0，相机拍照=1，SAVEDPHOTOALBUM=2。0和1其实都是本地图库
                allowEdit: false, //在选择之前允许修改截图
                encodingType: 0, //保存的图片格式： JPEG = 0, PNG = 1
                targetWidth: 800, //照片宽度
                targetHeight: 800, //照片高度
                mediaType: 2, //可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
                cameraDirection: 0, //枪后摄像头类型：Back= 0,Front-facing = 1
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: true //保存进手机相册
            };
            $cordovaCamera.getPicture(options).then(function (data) {
                $scope.uploadFile(data); //图片上传
            }, function (err) {
                // console.log(err);
            });
        };

        //图片上传
        $scope.isUpLoad = false;
        $scope.Jh2Host = '';
        $scope.uploadFile = function (data) {
            var fileUrl = data.split("/0/").pop();
            var filename = data.split("/").pop();
            var targetPath = cordova.file.externalRootDirectory + fileUrl; //APP下载存放的路径，可以使用cordova file插件进行相关配置
            console.log(targetPath);
            $scope.upInfo = '准备上传';
            $scope.isUpLoad = true;
            $scope.buttonFlag = true;
            var url = encodeURI(Jh2Host + "/Admin/postUploadFile");
            var trustHosts = true;
            var options = {
                fileName: filename,
            };
            $cordovaFileTransfer.upload(url, targetPath, options, trustHosts).then(function (result) {
                console.log(result);
                var res = JSON.parse(result.response);
                if (!res.IsErr) {
                    $scope.uploadFileName = res.Data;
                    $scope.upInfo = '上传成功';
                    $scope.buttonFlag = false;
                    $timeout(function () {
                        $scope.isUpLoad = false;
                    }, 1500)
                } else {
                    $cordovaToast.showShortBottom('上传失败');
                }

            }, function (err) {
                console.log(err);
                // $ionicLoading.hide();
            }, function (progress) {
                var downloadProgress = (progress.loaded / progress.total) * 100;
                $scope.upInfo = '已上传' + Math.floor(downloadProgress) + '%';
            });
        };

        /* ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ 方法4 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ */

        $scope.takePhoto = function () {
            var options = {
                //这些参数可能要配合着使用，比如选择了sourcetype是0，destinationtype要相应的设置
                quality: 100,                                            //相片质量0-100
                destinationType: Camera.DestinationType.FILE_URI,        //返回类型：DATA_URL= 0，返回作为 base64 編碼字串。 FILE_URI=1，返回影像档的 URI。NATIVE_URI=2，返回图像本机URI (例如，資產庫)
                sourceType: Camera.PictureSourceType.CAMERA,             //从哪里选择图片：PHOTOLIBRARY=0，相机拍照=1，SAVEDPHOTOALBUM=2。0和1其实都是本地图库
                allowEdit: false,                                        //在选择之前允许修改截图
                encodingType: Camera.EncodingType.JPEG,                   //保存的图片格式： JPEG = 0, PNG = 1
                targetWidth: 200,                                        //照片宽度
                targetHeight: 200,                                       //照片高度
                mediaType: 0,                                             //可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
                cameraDirection: 0,                                       //枪后摄像头类型：Back= 0,Front-facing = 1
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: true                                   //保存进手机相册
            };

            $cordovaCamera.getPicture(options).then(function (imageData) {
                CommonJs.AlertPopup(imageData);
                var image = document.getElementById('myImage');
                image.src = imageData;
                //image.src = "data:image/jpeg;base64," + imageData;
            }, function (err) {
                // error
                CommonJs.AlertPopup(err.message);
            });

        };

    });

    /*********************调用相册********************/
    "use strict";

    $scope.imgList = [];
    $scope.permissions = 'ready';
    $scope.permissions2 = '未打开相册';
    $scope.openImagePicker = () => {
        const options = {
            maximumImagesCount: 1, // 允许一次选中的最多照片数量
            width: 800,    // 筛选宽度
            height: 600,    //筛选高度
            quality: 100    //图像质量的大小，默认为100
        };
        $cordovaImagePicker.getPictures(options)
            .then(function (results) {
                //q.resolve(results[0]);
                //$scope.uploadFile2(results[0]);
                if (results.length != 0 && results != null) {
                    $scope.uploadFile3(results[0]);
                }
            }, function (error) {
                // error getting photos
            });
    };


    $scope.getPermissions = function () {
        checkPermissions();
        // $scope.permissions2 = '打开相册';
    }

    function checkPermissions() {
        const permissions = cordova.plugins.permissions,
            permissionList = [permissions.CAMERA, permissions.WRITE_EXTERNAL_STORAGE];
        function errorCallback() {
            console.warn("permissions is not turned on");
        }
        function checkPermissionCallback(status) {
            if (!status.hasPermission) {
                permissions.requestPermissions(
                    permissionList,

                    status => {
                        if (!status.hasPermission) {
                            errorCallback();
                            $scope.permissions = 'no1';
                        } else {
                            $scope.permissions = 'yes1';
                            $scope.openImagePicker();
                        }
                    }
                    , errorCallback);
            } else {
                $scope.permissions = 'yes2';
                $scope.openImagePicker();
            }
        }
        permissions.hasPermission(permissionList, checkPermissionCallback, null);
    }


    //   ionic.Platform.ready(() => {
    //     try {
    //       $ionicPlatform.is("Android") && checkPermissions();
    //     } catch (e) {
    //       console.warn("Application is running in browser causes inspection failed.");
    //     }
    //   }); 

    /*
       获取读取内存权限，获取成功后打开相册并上传照片
       杨卿林
       2020-03-17
   */
    $scope.getPermissions_2 = function () {
        checkPermissions2();
    }

    //验证内存读取权限
    function checkPermissions2() {
        var permissions = cordova.plugins.permissions;
        permissions.hasPermission(permissions.READ_EXTERNAL_STORAGE, checkPermissionCallback, null);
        function checkPermissionCallback(status) {
            if (!status.hasPermission) {
                var errorCallback = function () {
                    alert('请在设置中打开对应权限，否则无法修改图像！');
                }
                permissions.requestPermission(
                    permissions.READ_EXTERNAL_STORAGE,
                    function (status) {
                        if (!status.hasPermission) {
                            errorCallback();
                        } else {
                            $scope.openImagePicker();
                        }
                    },
                    errorCallback);
            } else {
                $scope.openImagePicker();
            }
        }
    }

    var uploadUrl = 'https://wxservice.jctrans.com/wxapi/user/UploadHeadPortrait';
    $scope.uploadFile2 = function (data) {
        var fileUrl = data.split("/0/").pop();
        var filename = data.split("/").pop();
        alert(fileUrl);
        alert(filename);
        var targetPath = cordova.file.externalRootDirectory + fileUrl; //APP下载存放的路径，可以使用cordova file插件进行相关配置
        alert(targetPath);
        $scope.upInfo = '准备上传';
        $scope.isUpLoad = true;
        $scope.buttonFlag = true;
        var url = encodeURI(uploadUrl);
        var trustHosts = true;
        var options = {
            fileName: filename,
        };
        $cordovaFileTransfer.upload(url, targetPath, options, trustHosts).then(function (result) {
            console.log(result);
            var res = JSON.parse(result);
            // if (!res.IsErr) {
            //     $scope.uploadFileName = res.Data;
            //     $scope.upInfo = '上传成功';
            //     $scope.buttonFlag = false;
            //     alert('上传成功');
            //     $timeout(function () {
            //         $scope.isUpLoad = false;
            //     }, 1500)
            // } else {
            //     alert('上传失败');
            // }
            alert(result);

        }, function (err) {
            alert(err);
            // $ionicLoading.hide();
        }, function (progress) {
            var downloadProgress = (progress.loaded / progress.total) * 100;
            $scope.upInfo = '已上传' + Math.floor(downloadProgress) + '%';
        });
    };


    $scope.uploadFile3 = function (data) {
        try {
            var filename = data.split("/").pop();

            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = filename;
            options.mimeType = "image/jpeg";
            options.headers = { "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA==" };

            var fobj = new FileTransfer();
            fobj.onprogress = function (progressEvent) {
                //上传中
                // $ionicLoading.show({
                //     template: '上传中,请等待...'
                // })
            };
            fobj.upload(data, encodeURI(uploadUrl),
                function (re) {
                    alert(re.responseCode);//200 成功
                    var _response = JSON.parse(re.response);
                    var code = _response.CODE;//_response（接口返回json） -> {"MSG":"","CODE":"001","PicUrl":""}
                    alert(re.response);
                    alert('上传成功：' + code);
                }, function (e) {
                    alert('上传异常');
                    console.log(JSON.stringify(e));
                }, options);
        } catch (e) {
            alert(e);
        }

    }

    $scope.viewTitle = '开始';
    $scope.switchTitle = function () {
        $scope.viewTitle = '标题更换';
    }

    /**↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓地图相关↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/

    $scope.tidanhaoTest = function () {
        var authorization = getAuthorization();


        // $http.get(apiUrlGet, {
        //     headers: { 'Authorization': authorization }
        // }).success(function (results) {
        //  console.log(results);       
        // });

        //var url ='http://47.75.188.10:9000/schedules/web/convert?id=0143a539adbd0020d90cd60b779a1e2d&referenceno=1&userId=2&historyId=4926';
        var url = 'http://47.75.188.10:9000/schedules/map/getMapParams?pathId=abfaf65a14bdd8a80601f0f6349d4a3a';
        $http.get(url, {
            headers: { 'Authorization': authorization }
        }).success(function (results) {
            console.log(results);
        });

        // $http.get(url, {
        //     headers: { 'Authorization': 'Bearer ' + authorization }
        // }).success(function (results) {
        //     console.log(results);
        // }).error(function (result) {
        //     console.log(result);
        // });

        // $.ajax({
        //     type: "GET",
        //     url: url,
        //     async: false,
        //     success: function (result) {
        //         console.log(result);
        //     }
        // });

        // $.ajax({
        //     type: "GET",
        //     url: url,
        //     beforeSend: function(request) {
        //        request.setRequestHeader("Authorization",authorization);
        //     },
        //     success: function(result) {
        //         console(result);
        //     }
        // });

    }

    $scope.mapTest1 = function () {
        var baseUrl = 'http://api.shipdt.com/DataApiServer/apicall';
        var url = '/GetSingleVesselShip';

        var fd = new FormData(); //初始化一个FormData实例
        fd.append('k', 'bb5bfb4d105646dd8b84589ae8e08455');
        fd.append('id', 'abfaf65a14bdd8a80601f0f6349d4a3a');

        var apiUrlPost = baseUrl + url;
        $http.post(apiUrlPost, fd, {
            headers: { 'Content-Type': undefined }
        }).success(function (data) {
            console.log(data);

        }).error(function (result) {
            console.log(result);
        });
    }

    $scope.routeInfo = {};
    $scope.getRouteInfo = function () {
        /**
         * 849006b79edf08f5c977d8880fbd1830
            159b2066054dc365aab38f20d535d63d
            594119212edb22e48753f1d4a2181430
            a6778ca40f37b47702b16b886f6a978c
            d2ef5178503806eaf346a33ca3db2cb0
         */
        var authorization = getAuthorization();
        var url = baseUrl + '/schedules/map/getMapParams?pathId=159b2066054dc365aab38f20d535d63d';
        $http.get(url, {
            headers: { 'Authorization': authorization }
        }).success(function (results) {
            //console.log(results);
            $scope.routeInfo = results.content[0];
            console.log($scope.routeInfo);
        });

    }

    var shipdtAjax_url = 'http://api.shipdt.com/DataApiServer/apicall';
    var shipdtAjax_key = 'bb5bfb4d105646dd8b84589ae8e08455';

    // 是否已发船
    $scope.alreadyStart = function (routeInfo) {
        if (routeInfo != null) {
            return new Date(routeInfo.etd).getTime() <= new Date().getTime();
        }
        return false;
    }
    $scope.getShipInfo = function () {

        if ($scope.routeInfo != null && $scope.routeInfo.ships && $scope.routeInfo.ships.length > 0) {
            const vm = this
            // 航线码头汇总
            const wharfs = []
            for (var i = 0; i < $scope.routeInfo.ships.length; i++) {
                var ship = $scope.routeInfo.ships[i];

                console.log(ship, 'ship');
                $scope.shipInfo = ship;
                //console.log(ship, 'shipshipInfo')
                //const shipInfo = { ...ship }
                //console.log(shipInfo, "shipInfo")
                //vm.$set(vm.shipsInfo, ship.shipId, shipInfo)

                // 获取船舶详细信息               
                var getSingleVesselShip_url = shipdtAjax_url + '/GetSingleVesselShip?id=' + ship.mmsi + '&k=' + shipdtAjax_key;
                $http.get(getSingleVesselShip_url).success(function (result) {
                    console.log(result, 'GetSingleVesselShip');
                    $scope.result = result.data[0];
                    $scope.result.lat = formatCoordinate($scope.result.lat);
                    $scope.result.lon = formatCoordinate($scope.result.lon);
                    console.log($scope.result, 'GetSingleVesselShip');

                    var data = result.data[0];
                    $scope.shipInfo.detail = {
                        data: data,
                        updateTime: !isEmpty(data.lasttime) ? parseTime(data.lasttime) : null,
                        latlng: transferLatlngs([data.lat, data.lon])
                    }
                    console.log($scope.shipInfo, '$scope.shipInfo');
                });

                // 记录码头信息
                console.log($scope.shipInfo.ports, '$scope.shipInfo.ports');

                if ($scope.shipInfo.ports != null && $scope.shipInfo.ports.length > 0) {
                    ///console.log(shipInfo.ports, "shipInfo.ports")
                    $scope.wharfs = $scope.shipInfo.ports;
                    //wharfs.push(...ship.ports)
                    // 获取船舶最近靠港记录
                    var begin = new Date();
                    var end = new Date();
                    begin.setMonth(new Date().getMonth() - 6);
                    var _begin = parseInt(begin.getTime() / 1000);
                    var _end = parseInt(end.getTime() / 1000);
                    console.log($scope.shipInfo.mmsi, _begin, _end);
                    var getPortOfCallByShip_url = shipdtAjax_url + '/GetPortOfCallByShip?mmsi=' + $scope.shipInfo.mmsi + '&k=' + shipdtAjax_key + '&begin=' + _begin + '&end=' + _begin;
                    $http.get(getPortOfCallByShip_url).success(function (result) {
                        console.log(result, 'GetPortOfCallByShip');
                        if (result != null && (result.status === 0 || data.status === '0') && result.records != null && result.records.length > 0) {
                            $scope.shipInfo.portRecord = result.records;

                            // 与航线靠港码头对比，如果有历史时间，不做处理
                            $scope.shipInfo.historyPorts = $scope.getHistoryPortRecord(shipInfo.ports, res);
                            if ($scope.shipInfo.historyPorts != null) {
                                console.log($scope.shipInfo, "getShipPathByPortRecord")
                                getShipPathByPortRecord($scope.shipInfo.mmsi, $scope.shipInfo.historyPorts)
                            }

                            var _alreadyStart = $scope.alreadyStart($scope.routeInfo);
                            if ($scope.shipInfo.shipId === $scope.routeInfo.ships[0].shipId && !_alreadyStart) {
                                getToStartPortShipPath($scope.shipInfo.shipId)
                            }
                        }
                    });
                    return;

                    vm.getPortByShip(shipInfo.mmsi).then(res => {
                        console.log(res, "我是船舶信息")
                        if (res && res.length > 0) {
                            vm.$set(shipInfo, 'portRecord', res)
                            // 与航线靠港码头对比，如果有历史时间，不做处理
                            vm.$set(shipInfo, 'historyPorts', vm.getHistoryPortRecord(shipInfo.ports, res))
                            if (shipInfo.historyPorts != null) {
                                console.log(shipInfo, "getShipPathByPortRecord")
                                vm.getShipPathByPortRecord(shipInfo.mmsi, shipInfo.historyPorts)
                            }
                            if (shipInfo.shipId === vm.routeInfo.ships[0].shipId && !vm.alreadyStart) {
                                vm.getToStartPortShipPath(shipInfo.shipId)
                            }
                        }
                    })
                }
            }
            console.log(wharfs, 'wharfs')
            vm.wharfs = wharfs
        }
    }

    /**
     * 获取船舶到达出发港口历史轨迹
     * @param shipId 船舶ID
     */
    $scope.getToStartPortShipPath = function (shipId) {
        const shipInfo = this.shipsInfo[shipId]
        if (this.routeInfo.polCode != null && shipInfo.portRecord != null) {
            let start = null
            let end = null
            let routePort = {
                portCode: this.routeInfo.polCode,
                portName: this.routeInfo.pol
            }
            for (const port of shipInfo.portRecord) {
                if (end != null) {
                    start = port
                    break
                } else if (this.comparePort(port, routePort)) {
                    end = port
                }
            }
            if (start != null && end != null) {
                // 最近两个港口轨迹
                api.getShipVesselTrack(shipId, start.atd, end.ata).then(res => {
                    this.toPolPath = res
                }).catch(err => {
                    console.error(err)
                })
                // 船舶从上个港口出发后的实际轨迹
                api.getShipVesselTrack(shipId, start.atd, this.currentShip.detail.updateTime).then(res => {
                    this.realTimePath = res
                }).catch(err => {
                    console.error(err)
                })
            }
        }
    };
});

//对数组进行排序
function compare(property) {
    return (firstobj, secondobj) => {
        const firstValue = firstobj[property];
        const secondValue = secondobj[property];
        return firstValue - secondValue; //升序
    };
}
