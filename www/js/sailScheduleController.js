app.controller('sailScheduleController', function($scope, $http, $resource, $translate, ionicDatePicker, $filter, $ionicTabsDelegate, $rootScope, $state, locals, Popup, Popup2) {
    //监听页面动作
    $rootScope.$on('$ionicView.beforeEnter', function() {
        $scope.getsreachLog(); //获取搜索缓存
        var statename = $state.current.name;
        if (statename === 'tab.sailSchedule') {
            $ionicTabsDelegate.showBar(true);
        }

        //刷新页面语言不变
        var lan = locals.get('lang');
        var datePicker_lang = 'zh';
        if (lan == "zh-cn") {
            $translate.use('zh');
            datePicker_lang = 'zh';


        } else if (lan == "us-en") {
            $translate.use('en');
            datePicker_lang = 'en';
        }

        var week = new Date().getDay();
        var minDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
        var _maxDate = null;
        if (week == 0) { //今天是周末
            _maxDate = new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 28));
        } else { //今天是周一至周六
            var nowDate = new Date();
            nowDate.setDate(nowDate.getDate() - nowDate.getDay() + 1);
            nowDate.setDate(nowDate.getDate() + 6);
            _maxDate = new Date(new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate()).getTime() + (1000 * 60 * 60 * 24 * 21));
        }
        var maxDate = new Date(_maxDate.getFullYear(), _maxDate.getMonth(), _maxDate.getDate());

        /**时间控件初始化 */
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
            lang: datePicker_lang, //en zh
            showNow: true,
            startYear: currYear - 10, //开始年份
            endYear: currYear + 10, //结束年份
            minDate: minDate,
            maxDate: maxDate,
            onSelect: function(value) {
                $('#sailScheduleDateTimePicker').val(value + $scope.getWeek(value));
            }
        };
        $("#DateTimePicker").mobiscroll($.extend(opt['date'], opt['default']));

        var dt1 = $("#sailScheduleDateTimePicker").val();
        if (dt1 == null || dt1 == undefined || dt1 == '') {
            $scope.validedTime = new Date().getTime(); //初始化日期
            var validedTime = $filter("date")(new Date().getTime(), "yyyy-MM-dd");
            $('#sailScheduleDateTimePicker').val(validedTime + $scope.getWeek(validedTime));
        } else {
            var index1 = dt1.indexOf('(');
            var TimeValue = dt1.substr(0, index1);
            $('#sailScheduleDateTimePicker').val(TimeValue + $scope.getWeek(TimeValue));
        }


        //当前登录人ID
        $scope.model.userId = locals.get("login_content") == undefined ? "" : locals.get("login_content");


        //如果用户未登录，取用户IP（随机数并存入缓存）
        if ($scope.model.userId == "") {
            //获取ip缓存，如果为空将ip存入缓存，
            var ipIsHave = locals.getObject("useripLog") == undefined ? "" : locals.getObject("useripLog");
            if (ipIsHave == null || ipIsHave == undefined || ipIsHave == "" || ipIsHave == '[object Object]') {
                $scope.useripLog = $scope.createRandomId(); //用户IP(随机数)
                locals.setObject("useripLog", $scope.useripLog); //存入缓存
            }
        }
        //如果当前登录人ID等于0，表示是游客
        if ($scope.model.userId == "") {
            $scope.model.userType = 1; //游客
            $scope.model.userIp = locals.getObject("useripLog") == undefined ? "" : locals.getObject("useripLog"); //从缓存取ip(随机数)
            $("#LogShow").hide(); //缓存列表隐藏
        } else {
            $scope.model.userType = 0; //登录用户
            $scope.model.userIp = ''; //游客ip
            $("#LogShow").show(); //缓存列表显示
        }
    })

    //计算当前日期是星期几
    $scope.getWeek = function(value) {
        var weekEnArry = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];
        var arys1 = new Array();
        arys1 = value.split('-'); //日期为输入日期，格式为 2013-3-10
        var ssdate = new Date(arys1[0], parseInt(arys1[1] - 1), arys1[2]);
        var week = ""; //就是你要的星期几
        if (locals.get('lang') == "us-en") {
            var week1 = String(ssdate.getDay()).replace("0", weekEnArry[0]).replace("1", weekEnArry[1]).replace("2", weekEnArry[2]).replace("3", weekEnArry[3]).replace("4", weekEnArry[4]).replace("5", weekEnArry[5]).replace("6", weekEnArry[6]) //就是你要的星期几
            week = "(" + week1 + ")"; //就是你要的星期几
        } else {
            var week1 = String(ssdate.getDay()).replace("0", "日").replace("1", "一").replace("2", "二").replace("3", "三").replace("4", "四").replace("5", "五").replace("6", "六") //就是你要的星期几
            week = "(周" + week1 + ")"; //就是你要的星期几
        }
        return week;
    }

    //初始化
    $scope.model = {};
    var datePickerObj = {};
    $scope.model.dateType = 1; //初始化默认离港
    // $scope.validedTime = new Date().getTime(); //初始化日期
    // var validedTime = $filter("date")(new Date().getTime(), "yyyy-MM-dd");
    // $scope.validedTime = validedTime + $scope.getWeek(validedTime);

    $scope.sailModel = []; //缓存数组
    var sailTrueOrFalse = false; //判断缓存是否输入重复
    var sailIndexOf = 0;

    /**
     * 船期搜索初始化
     */
    $scope.init = function() {
        $scope.fromPortToPortClick('FromPortID'); //离港到港点击事件


        //是否显示 历史记录
        $scope.ishistory = false
        var login_userId = locals.get('login_content'); //用户id
        //看用户是否登录
        if (login_userId == null || login_userId == "" || login_userId == undefined || login_userId == '[object Object]') {
            $scope.ishistory = false
        }else{
            $scope.ishistory = true
        }
    }

    /**
     * 接收上一页面返回参数
     */
    $rootScope.$on("select-city", function(e, m, n) {
        if (n == 'start') {
            $scope.model.pol = m.portCn;
            $scope.model.polId = m.portCode;
            $scope.model.polEN = m.portEn;
            $scope.model.polAndPolEN =  $scope.model.polEN + '(' + $scope.model.pol + ')'; //起始港绑定数据  
        } else {
            $scope.model.pod = m.portCn;
            $scope.model.podId = m.portCode;
            $scope.model.podEN = m.portEn;
            $scope.model.podAndPodEN = $scope.model.podEN + '(' + $scope.model.pod + ')'; //目的港绑定数据
        }
    })

    /**
     * 选择起始港
     */
    $scope.startportSearch = function() {
        var start = $scope.model.pol == undefined ? "" : $scope.model.pol; //目的港
        var startEN = $scope.model.polEN == undefined ? "" : $scope.model.polEN; //目的港英文
        var title = startEN == "" ? "" : startEN + '(' + start + ')';
        location.href = "#/tab/portSearch/start/" + title;
    }

    /**
     * 选择目的港
     */
    $scope.endportSearch = function() {

        var end = $scope.model.pod == undefined ? "" : $scope.model.pod; //目的港
        var endEN = $scope.model.podEN == undefined ? "" : $scope.model.podEN; //目的港英文
        var title = endEN == "" ? "" : endEN + '(' + end + ')';
        location.href = "#/tab/portSearch/end/" + title;
    }

    /**
     * 查询
     */
    $scope.sailScheduleQuery = function() {
        var polId = $scope.model.polId; //起始港id
        var podId = $scope.model.podId; //目的港id
        var dateType = $scope.model.dateType; //离港/到岗

        var dt1 = $("#sailScheduleDateTimePicker").val()
        var index1 = dt1.indexOf('(');
        var TimeValue = dt1.substr(0, index1);

        if (polId == undefined || polId == "" || polId == null) {
            Popup.showAlert($translate.instant('sjcq_qsrqsg'));
            return false;
        }
        if (podId == undefined || podId == "" || podId == null) {
            Popup.showAlert($translate.instant('sjcq_qsrmdg'));
            return false;
        }
        if (dateType == undefined || dateType == "" || dateType == null) {
            Popup.showAlert('离港/到岗不能为空');
            return false;
        }
        if (TimeValue == undefined || TimeValue == "" || TimeValue == null) {
            Popup.showAlert('日期不能为空');
            return false;
        }
        var login_userId = (locals.get("login_content") == undefined || locals.get("login_content") == '[object Object]') ? "" : locals.get('login_content'); //用户id
        
        var title = $scope.model.polEN + ' — ' + $scope.model.podEN; //列表页标题
        if (login_userId != null && login_userId != "") {
            //存入缓存
            let logValue = $scope.model.polEN + ' — ' + $scope.model.podEN;
            let value = $scope.model.pol + '(' + $scope.model.polEN + ')' + $scope.model.podEN + '(' + $scope.model.pod + ')';
            let selectValue = polId + ',' + podId + ',' + dateType + ',' + TimeValue + ',' + title; //查询时用

            var sail = locals.getObject("sailSreachLog"); //获取缓存
            if (sail.length != 0 && sail.length != null && sail.length != '') {
                for (i = 0; i < sail.length; i++) {
                    if (sail[i].value == value) {
                        sailTrueOrFalse = true;
                        sailIndexOf = [i];
                        break;
                    }
                }

                if (sailTrueOrFalse == true) { //输入重复
                    $scope.sailModel.splice(sailIndexOf, 1);
                    locals.setObject("sailSreachLog", $scope.sailModel); //存入缓存
                }
            } else {
                $scope.sailModel = []; //获取缓存
            }

            let str = {
                value: value,
                logValue: logValue,
                selectValue: selectValue
            }

            $scope.sailModel.push(str) // 存入数组
            if ($scope.sailModel.length > 4) { // 如果大于4 
                $scope.sailModel.splice(0, 1) // 移除一个元素
                locals.setObject("sailSreachLog", $scope.sailModel); //存入缓存
            }

            locals.setObject("sailSreachLog", $scope.sailModel); //存入缓存
            sailTrueOrFalse = false;
            sailIndexOf = 0;
        }
        //判断为登陆查询几次

        //如果用户未登录
        if ($scope.model.userId == "") {
            //获取查询次数缓存，如果为空将存入1次，
            var selectCount = locals.getObject("selectCount") == undefined ? "" : locals.getObject("selectCount");
            if (selectCount == null || selectCount == undefined || selectCount == "" || selectCount == '[object Object]') {
                $scope.selectCount = 1; //查询次数
                locals.setObject("selectCount", $scope.selectCount); //存入缓存
                //跳转到列表页
                location.href = "#/tab/sailScheduleList/" + polId + "/" + podId + "/" + dateType + "/" + TimeValue + "/" + $scope.model.userType + "/" + $scope.model.userId + "/" + $scope.model.userIp + "/" + title;

            } else {
                if ((selectCount * 1) >= 3) {
                    //查询次数超过3次,不可查询
                    Popup2.showAlert($translate.instant('sjcq_ykcx'), "/#/tab/login");
                    return false;
                } else {
                    locals.setObject("selectCount", (selectCount * 1) + 1); //存入缓存
                    //跳转到列表页
                    location.href = "#/tab/sailScheduleList/" + polId + "/" + podId + "/" + dateType + "/" + TimeValue + "/" + $scope.model.userType + "/" + $scope.model.userId + "/" + $scope.model.userIp + "/" + title;
                }
            }
        } else {
            //跳转到列表页 起始港ID/目的港ID/离港到港1或2/起始时间/截止时间/用户类型0登录用户1游客/用户ID/用户IP
            location.href = "#/tab/sailScheduleList/" + polId + "/" + podId + "/" + dateType + "/" + TimeValue + "/" + $scope.model.userType + "/" + $scope.model.userId + "/" + $scope.model.userIp + "/" + title;
        }
    }

    /**
     * 离港到港点击事件
     */
    $scope.fromPortToPortClick = function(DateType) {
        var DateTypeValue = $("#" + DateType).attr('value');
        if (DateType == "ToPortID") {
            $("#" + DateType).find('span').addClass('sf-radio-selected');
            $("#FromPortID").find('span').removeClass('sf-radio-selected');
        } else {
            $("#" + DateType).find('span').addClass('sf-radio-selected');
            $("#ToPortID").find('span').removeClass('sf-radio-selected');
        }
        $scope.model.dateType = DateTypeValue;
    }

    //打开日期选择框
    $scope.openDatePicker = function() {
        ionicDatePicker.openDatePicker(datePickerObj);
    };

    /**
     * 判断起始港目的港是否填完的方法,用来设置保存按钮和（起始港目的港边框变红？）
     */
    $scope.checkMustWrite = function() {
        var start = $scope.model.start;
        var end = $scope.model.end;
        if ((start != '' && start != '起始港' && start != null && start != 'Input POL' && start != '请输入起始港') ||
            (end != '' && end != '目的港' && end != null && end != 'Input POD' && end != '请输入目的港')) {
            //搜索按钮不可点击
        } else {
            //搜索按钮可点击
        }
    }

    /**
     * 取-历史搜索缓存
     */
    $scope.getsreachLog = function() {
        var sail = locals.getObject("sailSreachLog"); //获取缓存
        if (sail.length != 0 && sail.length != null && sail.length != '') {
            //取出数组
            $scope.sailModel = sail;
        }
    }

    //历史搜索缓存-删除方法
    $scope.delete = function(index) {
        $scope.sailModel = $scope.sailModel.slice().reverse();
        $scope.sailModel.splice(index, 1);
        $scope.sailModel = $scope.sailModel.slice().reverse();
        locals.setObject("sailSreachLog", $scope.sailModel); //存入缓存

    }

    //历史搜索缓存-点击跳转列表页方法
    $scope.select = function(selectValue) {

        if (selectValue != null && selectValue != "" && selectValue != undefined) {
            var polId = selectValue.split(',')[0];
            var podId = selectValue.split(',')[1]
            var dateType = selectValue.split(',')[2]
            var TimeValue = selectValue.split(',')[3]
            var title = selectValue.split(',')[4]

            //跳转到列表页 起始港ID/目的港ID/离港到港1或2/起始时间/截止时间/用户类型0登录用户1游客/用户ID/用户IP
            location.href = "#/tab/sailScheduleList/" + polId + "/" + podId + "/" + dateType + "/" + TimeValue + "/" + $scope.model.userType + "/" + $scope.model.userId + "/" + $scope.model.userIp + "/" + title;

        } else {
            Popup.showAlert('查询失败,请刷新重试');
            return false;
        }
    }

    //生成随机数
    $scope.createRandomId = function() {
        return (Math.random() * 10000000).toString(16).substr(0, 4) + '_' + (new Date()).getTime() + '_' + Math.random().toString().substr(2, 5);
    }
    $scope.deleteTest = function() {
        locals.setObject("useripLog", ""); //存入缓存
    }
});