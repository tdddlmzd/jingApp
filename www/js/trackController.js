app.controller('trackController', function($scope, $ionicScrollDelegate, $http, $resource, $stateParams,$ionicModal,
    $ionicTabsDelegate, $rootScope, $state, $translate, ionicDatePicker, $filter, locals, Popup, $ionicLoading, $ionicHistory, Popup2) {

    //刷新页面语言不变
    var lan = locals.get('lang');
    if (lan == "zh-cn") {
        $translate.use('zh');

    } else if (lan == "us-en") {
        $translate.use('en');
    }

    $scope.lan = locals.get('lang') == undefined ? "zh-cn" : locals.get('lang');
    //刷新页面语言不变   
    $scope.model = {};
    var datePickerObj = {};
    var currentNode_ctype = ['BKCF',
        'EPRL',
        'STSP',
        'FCGI',
        'CGGI',
        'CLOD',
        'CYTC',
        'GITM',
        'CUIP',
        'PASS',
        'TMPS',
        'PRLD',//配载
        'LOBD',
        'DLPT',
        'TSBA',
        'TSDC',
        'TSLB',
        'TSDP',
        'BDAR',
        'DSCH',
        'STCS',
        'IRAR',
        'RCVE',
        'SUOT',
        // 'CUIP':'22',
    ];
    var currentNode_ctype_ZD = ['BKCF',
    'EPRL',
    'STSP',
    'FCGI',
    'CGGI',
    'CLOD',
    'CYTC',
    'GITM',
    'CUIP',
    'PASS',
    'TMPS',//码放
    'PRLD',//配载
    'LOBD',//装船
    'DLPT',
    'BDAR',
    'DSCH',
    'STCS',
    'IRAR',
    'RCVE',
    'SUOT',
    // 'CUIP':'22',
    ];
    if(localStorage.getItem('clickHeader')){ //说明之前存储过header
        $scope.clickHeaderIndex = localStorage.getItem("clickHeader")
    }else{
        $scope.clickHeaderIndex = 2
    }

    $scope.model.pol_track = "SHANGHAI";
    $scope.model.polId_track = "上海";
    $scope.model.portCode = "CNSHA";
    $scope.model.polAndPolEN_track = "SHANGHAI(上海)"; //起始港绑定数据   

    //地图的宽度
    $scope.mapHeight = {
        "height" : (screen.height / 2) + 10 + 'px',
    }

    //地图下面高度
    $scope.topHeight = {
        "top" : (screen.height / 2) + 4 + 'px',
    }
    //监听页面动作
    $rootScope.$on('$ionicView.beforeEnter', function() {
        var lan = locals.get('lang');
        var dateLan = "zh";
        if (lan == "zh-cn") {
            $translate.use('zh');
            dateLan = "zh";

        } else if (lan == "us-en") {
            $translate.use('en');
            dateLan = "en";

        }
        $scope.model.userId = (locals.get("login_content") == undefined || locals.get("login_content") == '[object Object]') ? "" : locals.get("login_content");
        var statename = $state.current.name;
        //console.log('current state name is: ' + statename);

        if (statename === 'tab.CarrierSearch' || statename === 'tab.track-detail') {
            $ionicTabsDelegate.showBar(false); //当前页面隐藏tab
        } else {
            $ionicTabsDelegate.showBar(true);
        }
        if ($scope.model.userId != "") {
            $scope.getsreachLog();
        }

        /**时间控件初始化 */
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
            lang: dateLan, //en zh
            showNow: true,
            startYear: currYear - 10, //开始年份
            endYear: currYear + 10, //结束年份
            minDate: minDate,
            maxDate: maxDate,
            onSelect: function(value) {
                $('#dateTimePicker').val(value + $scope.getWeek(value));
            }
        };
        $("#dateTimePicker").mobiscroll($.extend(opt['date'], opt['default']));
        var dt1 = $("#dateTimePicker").val();
        if (dt1 == null || dt1 == undefined || dt1 == '') {
            $scope.validedTime = new Date().getTime(); //初始化日期
            var validedTime = $filter("date")(new Date().getTime(), "yyyy-MM-dd");
            $('#dateTimePicker').val(validedTime + $scope.getWeek(validedTime));
        } else {
            var index1 = dt1.indexOf('（');
            var TimeValue = dt1.substr(0, index1);
            $('#dateTimePicker').val(TimeValue + $scope.getWeek(TimeValue));
        }


        //如果用户未登录，取用户IP（随机数并存入缓存）
        if ($scope.model.userId == "") {
            //获取ip缓存，如果为空将ip存入缓存，
            var ipIsHave = (locals.getObject("useripLog") == undefined || locals.get("login_content") == '[object Object]') ? "" : locals.getObject("useripLog");
            if (ipIsHave == null || ipIsHave == undefined || ipIsHave == "") {
                $scope.useripLog = $scope.createRandomId(); //用户IP(随机数)
                locals.setObject("useripLog", $scope.useripLog); //存入缓存
            }
        }
        $scope.CalculateOverflowDivHeight('下滑');      
    });

    //计算当前日期是星期几
    $scope.getWeek = function(value) {
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
        ///////////////////////////////////////////////////////货箱跟踪页面//////////
        //接收上一页面返回参数
    $rootScope.$on("select-city-track", function(e, m, n) {
        if (n == 'start-track') { //跟踪页面用
            $scope.model.pol_track = m.nameEn;
            $scope.model.polId_track = m.nameCn;
            $scope.model.portCode = m.portCode;
            $scope.model.polAndPolEN_track = m.value; //起始港绑定数据  
        } else if (n == 'start') { //船舶查询页面用
            $scope.model.pol_cb = m.value;
            $scope.model.polId_cb = m.id;
            $scope.model.portCode_cb = m.countryCode;
            $scope.model.polAndPolEN_cb = $scope.model.pol_cb; //起始港绑定数据  
        } else if (n == 'Carrier') {
            $scope.model.carriercd = m.code;
            $scope.model.carriercdEn = m.nameScn; //船公司
            $scope.model.carriercdCn = m.nameCn; //船公司
        } else {
            $scope.model.pod_cb = m.cityCn;
            $scope.model.podId_cb = m.id;
            $scope.model.podEN_cb = m.cityEn;
            $scope.model.podAndPolEN_cb = $scope.model.podEN_cb + '(' + $scope.model.pod_cb + ')'; //目的港绑定数据
        }
    });

    
    $scope.sailModel_track = []; //缓存数组
    var sailTrueOrFalse_track = false;
    var sailIndexOf_track = 0;
    $scope.pageType = 0; //判断页面显示为货箱0 船舶1
    $scope.trackListAll = {}; //跟踪列表
    // $scope.shipLogoUrl = shipLogoUrl; //旗帜
    var auth = null;

    //添加跟踪页面 货箱 获取船公司
    $scope.shipTouch = function() {
        var referenceno = $scope.model.referenceno;
        var carriercd = $scope.model.carriercdEn;
        if (referenceno == undefined) {
            referenceno = "";
        }
        if (carriercd == undefined) {
            carriercd = "";
        }
        location.href = "#/tab/CarrierSearch/" + referenceno + "_" + carriercd;
    }

    //添加跟踪
    $scope.addFunction = function(param) {
        var login_content = locals.get('login_content'); //用户id
        var userId = login_content;
        var reg=/^[0-9a-zA-Z]+$/;
        if (userId == null || userId == "" || userId == undefined || userId == '[object Object]') {
            //Popup.showAlert($translate.instant('sjgz_qxdl'));
            Popup2.showAlert($translate.instant('sjgz_qxdl'), '/#/tab/login');
        }
        var pol_track = $scope.model.pol_track;
        var portCode = $scope.model.portCode; //起始港五字码
        var referenceno = $scope.model.referenceno; //提单号
        var carriercd = $scope.model.carriercd; //船公司code

        if (pol_track == undefined || pol_track == "") {
            Popup.showAlert($translate.instant('gz_qxzqyg'));
            return false;
        }
        if (referenceno == undefined || referenceno == "") {
            Popup.showAlert($translate.instant('gz_qlrdchtdhxh'));
            return false;
        }
        if(!reg.test(referenceno)){
            Popup.showAlert($translate.instant('gz_onlyNumber'));
            return false;
        }
        if (carriercd == undefined || carriercd == "") {
            // carriercd="";
            Popup.showAlert($translate.instant('gz_qxzcgs'));
            return false;
        }

        //加载动画显示
        $ionicLoading.show({
            template: $translate.instant('sjcq_jzz')
        });

        var apiUrlGet = 
        baseUrl + 
        "/trace/fore/upload?pol=" + 
        portCode + 
        "&referenceno=" + 
        referenceno + 
        "&carriercd=" + 
        carriercd + 
        "&userId=" + 
        userId;
        var authorization = getTokenInfor()
        $http.get(apiUrlGet, {
                headers: { 'Authorization': authorization },
                timeout: timeOut
            }).success(function(results) { //跳到详情页   
                // $ionicLoading.hide(); //加载动画隐藏  
                if(results.status == 1){
                    var downUrl = 
                    baseUrl + 
                    "/trace/fore/download?pol=" + 
                    portCode + 
                    "&referenceno=" + 
                    referenceno + 
                    "&carriercd=" + 
                    carriercd + 
                    "&userId=" + 
                    userId;
                    $http.get(downUrl, { //货物跟踪下载接口
                        headers: { 'Authorization': authorization },
                        timeout: timeOut
                    }).success(function(results) {  
                        $ionicLoading.hide(); //加载动画隐藏
                        $scope.doYourStuff();
                    }).error(function(result) {
                        console.log(result, '错误信息')  
                    });
                } else if (results.status == 4) { // 自动更正起始港
                    // var downUrl = 
                    // baseUrl + 
                    // "/trace/fore/download?pol=" + 
                    // results.content + 
                    // "&referenceno=" + 
                    // referenceno + 
                    // "&carriercd=" + 
                    // carriercd + 
                    // "&userId=" + 
                    // userId;
                    // $http.get(downUrl, { //货物跟踪下载接口
                    //     headers: { 'Authorization': authorization },
                    //     timeout: timeOut
                    // }).success(function(results) {  
                    //     $scope.doYourStuff();
                    // }).error(function(result) {
                    //     console.log(result, '错误信息') 
                    // });

                    //代表订阅失败
                    //正则匹配看返回信息是否含有 字母
                    if(/[a-zA-Z]/.test(results.content)){
                        //说明含有英文
                        var content = '“' + results.content + '”' + '已有数据,订阅失败!'
                    }else{
                        var content = results.content
                    }
                    Popup.showAlert(content)
                    $ionicLoading.hide()
                } else {
                    Popup.showAlert($translate.instant('gz_bqmyztgzxx'));     
                }
            })
            .error(function(result) {
                $ionicLoading.hide(); //加载动画隐藏
                Popup.showAlert($translate.instant('ts_qjcwl'));
            });
    }

    //获取船公司数据
    $scope.getCarrier = function() {
        var ref = $scope.model.referenceno; //获取输入框值
        var authorization = getTokenInfor()
        var apiUrl = baseUrl + "/trace/fore/getShipping?ref="+ref+"&nameCn=";
        $scope.carrierList={};
        $http.get(apiUrl, {
            headers: { 'Authorization': authorization },
            timeout: timeOut
        }).success(function(data) {
            if (data.status == 1) { //成功
                if(data.content.length==1){
                    $scope.model.carriercd = data.content[0].code;
                    $scope.model.carriercdEn = data.content[0].nameScn; //船公司
                    $scope.model.carriercdCn = data.content[0].nameCn; //船公司
                    //$scope.model.nameEn=
                }else{
                $scope.model.carriercd="";
                $scope.model.carriercdEn = ""; //船公司
                $scope.model.carriercdCn = ""; //船公司
                }
            }
        }).error(function(result) {
        // Popup.showAlert($translate.instant('ts_qjcwl'));      
        });
     }
    ////////////////////////////////////////////////////////////////////
    /////////////////////////////船舶页面///////////////////////////////
    $scope.model.dateType = 1;
    $scope.searchInit = function() {
        $scope.pageType = 1;
        //$scope.startTime = new Date().getTime();       
    }

    /**
     * 选择起始港货箱跟踪
     */
    $scope.startportSearch_ = function() {

        if ($scope.pageType == 0) {
            var title = $scope.model.polAndPolEN_track == undefined ? "" : $scope.model.polAndPolEN_track; //起始港      
            location.href = "#/tab/track-portSearch/start-track/" + title;
        } else {
            var title = $scope.model.polAndPolEN_cb == undefined ? "" : $scope.model.polAndPolEN_cb; //起始港
            location.href = "#/tab/track-portSearch/start/" + title;
        }

    }

    /**
     * 选择目的港
     */
    $scope.endportSearch = function() {

            var podAndPolEN_cb = $scope.model.podAndPolEN_cb == undefined ? "" : $scope.model.podAndPolEN_cb; //目的港        
            location.href = "#/tab/track-portSearch/end/" + podAndPolEN_cb;
        }
        //选择 到港/离港
    $scope.PortCheck = function(objId) {
            var objValue = $("#" + objId).attr('value');
            if (objId == "daogang") {
                $("#" + objId).find('span').addClass('sf-radio-selected');
                $("#ligang").find('span').removeClass('sf-radio-selected');
            } else {
                $("#" + objId).find('span').addClass('sf-radio-selected');
                $("#daogang").find('span').removeClass('sf-radio-selected');
            }
            $scope.model.dateType = objValue;
        }
        //查询
    $scope.CB_search = function() {
        var pol = $scope.model.polAndPolEN_cb;
        var pod = $scope.model.podAndPolEN_cb;
        var polId = $scope.model.polId_cb;
        var podId = $scope.model.podId_cb;
        var dateType = $scope.model.dateType;
        var dateTimePicker = $("#dateTimePicker").val()
        var index1 = dateTimePicker.indexOf('（');
        var startTime = dateTimePicker.substr(0, index1);


        //var startTime=$filter("date")($("#dateTimePicker").val(), "yyyy-MM-dd");
        var login_userId = (locals.get("login_content") == undefined || locals.get("login_content") == '[object Object]') ? "" : locals.get('login_content'); //用户id
        var title = pol + '-' + pod; //列表页标题
        $scope.model.userIp = (locals.getObject("useripLog") == undefined || locals.getObject("useripLog") == '[object Object]') ? "" : locals.getObject("useripLog"); //从缓存取ip(随机数)
        var userType = login_userId == "" ? 1 : 0;
        if (pol == undefined || pol == "") {
            Popup.showAlert($translate.instant('gz_qxzqyg'));
            return false;
        }
        if (pod == undefined || pod == "") {
            Popup.showAlert($translate.instant('gz_qxzmdg'));
            return false;
        }
        if (login_userId != null && login_userId != "") {
            //存入缓存
            let value = pol + '/' + pod;
            let valuelog = polId + "/" + podId;
            let selectValue = polId + '/' + podId + '/' + dateType + '/' + startTime + "/" + userType + "/" + login_userId + "/" + $scope.model.userIp + '/' + title; //查询时用

            var sail = locals.getObject("trackSreachLog" + login_userId); //获取缓存
            if (sail.length != 0 && sail.length != null && sail.length != '') {
                for (i = 0; i < sail.length; i++) {
                    if (sail[i].value == value) {
                        sailTrueOrFalse_track = true;
                        sailIndexOf_track = [i];
                        break;
                    }
                }

                if (sailTrueOrFalse_track == true) { //输入重复
                    $scope.sailModel_track.splice(sailIndexOf_track, 1);
                    locals.setObject("trackSreachLog" + login_userId, $scope.sailModel_track); //存入缓存
                }
            } else {
                $scope.sailModel_track = [];
            }
            let str = {
                value: value,
                valuelog: valuelog,
                selectValue: selectValue
            }

            $scope.sailModel_track.push(str);


            if ($scope.sailModel_track.length > 4) { // 如果大于4 
                $scope.sailModel_track.splice(0, 1) // 移除一个元素
                locals.setObject("trackSreachLog" + login_userId, $scope.sailModel_track); //存入缓存
            }

            locals.setObject("trackSreachLog" + login_userId, $scope.sailModel_track); //存入缓存

            sailTrueOrFalse_track = false;
            sailIndexOf_track = 0;
        }

        //跳转到列表页 起始港ID/目的港ID/离港到港1或2/起始时间/截止时间/用户类型0登录用户1游客/用户ID/用户IP
        location.href = "#/tab/sailScheduleList_track/" + polId + "/" + podId + "/" + dateType + "/" + startTime + "/" + userType + "/" + login_userId + "/" + $scope.model.userIp + "/" + title;
    }

    //历史搜索缓存-点击跳转列表页方法
    $scope.historyselect = function(selectValue) {

        if (selectValue != null && selectValue != "" && selectValue != undefined) {
            //跳转到列表页 起始港ID/目的港ID/离港到港1或2/起始时间/截止时间/用户类型0登录用户1游客/用户ID/用户IP
            location.href = "#/tab/sailScheduleList_track/" + selectValue;

        } else {
            Popup.showAlert($translate.instant('gz_wsj'));
        }
    }

    /**
     * 取-历史搜索缓存
     */
    $scope.getsreachLog = function() {
        var login_userId = locals.get('login_content'); //用户id
        var sail = locals.getObject("trackSreachLog" + login_userId); //获取缓存
        if (sail.length != 0) {
            //取出数组
            $scope.sailModel_track = sail;

        }
    }

    //删除方法
    $scope.delete = function(index) {
            var login_userId = locals.get('login_content'); //用户id
            $scope.sailModel_track = $scope.sailModel_track.slice().reverse();
            $scope.sailModel_track.splice(index, 1);
            $scope.sailModel_track = $scope.sailModel_track.slice().reverse();

            locals.setObject("trackSreachLog" + login_userId, $scope.sailModel_track); //存入缓存
            $scope.getsreachLog();
    }
    //跳转船舶页
    $scope.TotrackSearch = function() {
        location.href = "#/tab/trackSearch";
    }

    //////////////////////////////////////跟踪列表/////////////////
    //跟踪列表初始化
    $scope.initList = function() {
        //默认都为hide
        $("#lb").hide()
        $("#lb_jh").hide()
        $("#tj").hide()
        var login_userId = locals.get('login_content'); //用户id
        //看用户是否登录
        if (login_userId == null || login_userId == "" || login_userId == undefined || login_userId == '[object Object]') {
            $scope.sjgz_wdgz = ''
            $("#tj").show()
            $scope.isShowNav = false

            //之前保存的 stroge删除
            locals.set("login_content", ""); //字符串缓存 //用户id
            locals.set("Namenc", ""); //字符串缓存
            locals.set("Company", ""); //字符串
            locals.set("Position", ""); //字符串
            locals.set("Phone", ""); //字符串
            locals.set("Tel", ""); //
            locals.set("Email", ""); //字符串
            locals.set("uploadimage", ""); //字符串
            locals.set("sex", ""); //字符串
            localStorage.removeItem('storedInfor')
            localStorage.removeItem('gateway_token')
            return
        }
        //加载动画显示
        $ionicLoading.show({
            template: $translate.instant('sjcq_jzz')
        });
        $scope.trackListAll = []
        $scope.trackList = []
        $scope.all_number = 0
        $scope.lgq_number = 0
        $scope.zt_number = 0
        $scope.dg_number = 0
        $scope.wc_number = 0
        $scope.YC_number = 0
        $scope.CX_number = 0
        var params = "";
        var searchStr = "";
        var apiUrlGet = baseUrl + "/trace/fore/getSearchRecord?params=&searchStr=&userId=" + login_userId;
        var authorization = getTokenInfor()
        $http.get(apiUrlGet, {
            headers: { 'Authorization': authorization },
            timeout: timeOut
        }).success(function(results) {
            $ionicLoading.hide()
            if (results.status == "1") {
                $scope.BeforeDeparture = [] //离港前
                $scope.InTransit = [] //在途
                $scope.destination = [] //到港
                $scope.emptyArray = [] //完成
                $scope.noData = [] //异常
                var lgq_number = 0; //离港前
                var zt_number = 0; //在途
                var dg_number = 0; //到港
                var wc_number = 0; //完成
                var YC_number = 0; //异常
                var CX_number = 0; //查询中
                for(k in results.content){
                    if(results.content[k].length > 0){
                        var allDate = []
                        for (let i = 0; i < results.content[k].length; i++) {
                            var e = results.content[k][i]
                            if(e.datatype == 0){
                                e.searchTime1 = e.searchTime?new Date(e.searchTime.replace(/-/g,  "/")).getTime():0
                                e.dlpttime1 = e.dlpttime?new Date(e.dlpttime.split(' ')[0].replace(/-/g,  "/")).getTime():0
                                e.vslname1 = e.vslname?e.vslname.split(' ')[0]:'ZZZZ'
                                allDate.push(e)
                            }
                            
                        }
                    }
                    if(k == 0){ //全部
                        $scope.trackListAll = results.content[k]
                    }
                    if(k == 1){ //离港前
                        $scope.BeforeDeparture = results.content[k]
                        lgq_number = $scope.BeforeDeparture.length
                    }
                    if(k == 2){ //在途
                        $scope.InTransit = results.content[k]
                        zt_number = $scope.InTransit.length
                    }
                    if(k == 3){ // 到港后
                        $scope.destination = results.content[k]
                        dg_number = $scope.destination.length
                    }
                    if(k == 4){ //已完成
                        $scope.emptyArray = results.content[k]
                        wc_number = $scope.emptyArray.length
                    }
                    if(k == 5){ //异常
                        $scope.noData = results.content[k]
                        YC_number = $scope.noData.length
                    }
                    if(k == 6){ //查询中
                        $scope.searchQuery = results.content[k]
                        CX_number = $scope.searchQuery.length
                    }
            }
                    // if (results.content.length > 0) {
                    // $scope.trackList.forEach(e => {
                    //     if (e.currentnode === 'STSP' || e.currentnode === 'FCGI' || e.currentnode === 'CGGI' || e.currentnode === 'CLOD' || e.currentnode === 'CYTC' || e.currentnode === 'GITM' || e.currentnode === 'PASS' || e.currentnode === 'TMPS' || e.currentnode === 'PRLD' || e.currentnode === 'LOBD') { //离港前
                    //         lgq_number++
                    //         $scope.BeforeDeparture.push(e)
                    //     }

                    //     if (e.currentnode === 'DLPT' || e.currentnode === 'TSDP' || e.currentnode === 'TSLB' || e.currentnode === 'TSBA' || e.currentnode === 'TSDC') { //在途
                    //         zt_number++
                    //         $scope.InTransit.push(e)
                    //     }
        
                    //     if (e.currentnode === 'BDAR' || e.currentnode === 'DSCH' || e.currentnode === 'STCS') { //到港
                    //         dg_number++
                    //         $scope.destination.push(e)
                    //     }
                    //     if(e.currentnode == 'RCVE') { //完成
                    //         wc_number++
                    //         $scope.emptyArray.push(e)
                    //     }    
        
                    //     if (e.resultState == 1000 || e.resultState == 1005 || e.resultState == 1) { //异常
                    //         YC_number++
                    //         $scope.noData.push(e)
                    //     }
                    //     e.searchTime1 = e.searchTime?new Date(e.searchTime.replace(/-/g,  "/")).getTime():0
                    //     e.dlpttime1 = e.dlpttime?new Date(e.dlpttime.split(' ')[0].replace(/-/g,  "/")).getTime():0
                    //     e.vslname1 = e.vslname?e.vslname.split(' ')[0]:'ZZZZ'
                    // });
                    if($scope.clickHeaderIndex == 1){ //全部
                        $scope.trackList = $scope.trackListAll
                    }else if($scope.clickHeaderIndex == 2){ //离港前
                        $scope.trackList = $scope.BeforeDeparture
                    }else if($scope.clickHeaderIndex == 3){ //在途
                        $scope.trackList = $scope.InTransit
                    }else if($scope.clickHeaderIndex == 4){ //到港
                        $scope.trackList = $scope.destination
                    }else if($scope.clickHeaderIndex == 5){ //完成
                        $scope.trackList = $scope.emptyArray
                    }else if($scope.clickHeaderIndex == 6){ //异常
                        $scope.trackList = $scope.noData
                    }
                    $scope.trackTypeClick('searchTime1', 'vslname1') // 默认按新增日排序
                    $scope.all_number = $scope.trackListAll.length;
                    $scope.lgq_number = lgq_number;
                    $scope.zt_number = zt_number;
                    $scope.dg_number = dg_number;
                    $scope.wc_number = wc_number;
                    $scope.YC_number = YC_number;
                    $scope.CX_number = CX_number;
                    $scope.sjgz_wdgz = $translate.instant('sjgz_wdgz')
                    $scope.isShowNav = true
                    setTimeout(()=>{
                        $("#lb").show()
                        $("#lb_jh").show()
                    },100)
                    // } else {
                //     $("#lb").hide();
                //     $scope.sjgz_wdgz = ''
                //     $("#tj").show();
                //     $scope.isShowNav = false
                //     $("#lb_jh").hide();
                // }
            }
        }).error(function(result) {
            $scope.isShowNav = true
            $scope.sjgz_wdgz = $translate.instant('sjgz_wdgz')
            $ionicLoading.hide(); //加载动画隐藏
            Popup.showAlert($translate.instant('ts_qjcwl'));
        });
    }
    
    /**
     * 按新增日，按离港日点击事件
     */
    $scope.trackTypeClick = function(column, name) {
        // 按新增日
        if (column == 'searchTime1') {
            $scope.trackType = 'searchTime1'
            if(document.getElementById("searchTime")){
                document.getElementById("searchTime").classList.add("on");
            }
            if(document.getElementById("dlpttime")){
                document.getElementById("dlpttime").classList.remove("on");
            }
            $scope.trackList.sort($scope.by(column, name))
        }
        // 按离港日
        if (column == 'dlpttime1') {
            $scope.trackType = 'dlpttime1'
            if(document.getElementById("dlpttime")){
                document.getElementById("dlpttime").classList.add("on");
            }
            if(document.getElementById("searchTime")){
                document.getElementById("searchTime").classList.remove("on");
            }
            $scope.trackList.sort($scope.by(column, name))
        }
    }

    $scope.by = function (column, name) {
        return function(o, p) {
            var a = p[column]
            var b = o[column]
            if (a === b) {
                var a1 = o[name]
                var b1 = p[name]
                return a1.localeCompare(b1)
            }
            return a - b
        };
    }

    $scope.addTrack = function() {
        var userId = locals.get('login_content'); //用户id       
        if (userId == null || userId == "" || userId == undefined || userId == '[object Object]') {
            Popup2.showAlert($translate.instant('sjgz_qxdl'), '/#/tab/login');
        } else {
            $ionicHistory.clearHistory()
            $ionicHistory.clearCache().then(function() {
                $state.go('tab.trackAdd', {cache:true},{reload: true});
            })
        }

    }
    $scope.trackDetailPage = function(data) {
        if (data.datatype == 0) { //货箱跟踪详情
            if(data.resultState==0){
                var etdValue = data.etd ? data.etd.replace(/\-/g, '/') : '';
                // 处理中转的信息 已传给地图
                var transitMap = []
                if (data.entrePortList !== null) {
                    for (let i = 0; i < data.entrePortList.length; i++) {
                        let c = data.entrePortList[i]
                        if(c.lat && c.lon){ //如果当前中转港有坐标
                        transitMap.push({
                            name:c.entrePort,
                            lat:Number(c.lat),
                            lon:Number(c.lon)
                        })
                        }
                    }
                }
                var mapVal = {
                    vessel: data.vslname, //船名
                    voyage: data.voy, //航次
                    mmsi: data.mmsi, //mmsi
                    pol: { //起始港
                        name: data.pol ? (data.pol.replace(' ','')).toUpperCase() : '',
                        terminal: data.terminal,
                        code: data.polcd,
                        eta: "",
                        etd: data.etd,
                        lat: data.pollat ? Number(data.pollat) : '',
                        lon: data.pollon ? Number(data.pollon) : ''
                    },
                    pod: { //目的港
                        name: data.dtp ? (data.dtp.replace(' ','')).toUpperCase() : '',
                        terminal: "",
                        code: "",
                        eta: data.eta,
                        etd: "",
                        lat: data.podlat ? Number(data.podlat) : '',
                        lon: data.podlon ? Number(data.podlon) : ''
                    },
                    eta: new Date(etdValue) - 0,
                    during: 1000 * 3600 * 24 * 30,
                    transit:transitMap, //中转港
                    polTime: data.dlpttime ? (new Date(data.dlpttime) - 0) : data.etd ? (new Date(data.etd) - 0) : '', //起始港时间 有实际就取实际没有就取预计
                    podTime: data.dschtime ? (new Date(data.dschtime) - 0) : data.eta ? (new Date(data.eta) - 0) : '', //目的港时间有实际就取实际没有就取预计
                    isEntre:data.entrePortList && data.entrePortList.length > 0 ? '1' : '0', //0 直达 ,1 中转
                }
                var setParamDate = {
                    pol: data.polcd,
                    referenceno: data.referenceno,
                    carriercd: data.carriercd,
                    mapVal: mapVal,
                }

                var paramDate = setParams(setParamDate)

                $ionicHistory.clearHistory()
                $ionicHistory.clearCache().then(function() {
                    $state.go('tab.track-detail', {referenceno:data.referenceno,id:paramDate},{cache:true},{reload: true});
                });

            }else{
                Popup.showAlert($translate.instant('gz_bqmyztgzxx'));
            }
           
        } else { //船舶跟踪详情
            // var etd_item = $filter('Time')(data.etd, 'yyyy-MM-dd HH:mm');
            // location.href = "/#/tab/sailScheduleDetail_track/" + data.voyageId + "/" + data.id + "/" + etd_item + "/" + data.identify;

        }
    }
    //长按手势事件，删除订阅
    $scope.handleHoldDelete = function(item){
        $scope.handleModal.show()
        $scope.currentUpadte = item
        if(item.subStatus == 1){
            $scope.warnFu1 = true
            $scope.warnFu0 = false                    
        }else{
            $scope.warnFu1 = false
            $scope.warnFu0 = true                           
        }
}

    //取消模态框
    $scope.quxiaoModel = function(){
        $scope.handleModal.hide()
    }
    //删除
    $scope.delectAll = function(){
        var userId = (locals.get("login_content") == undefined || locals.get("login_content") == '[object Object]') ? "" : locals.get('login_content'); //用户id
        var authorization = getTokenInfor()
        var fd = new FormData(); //初始化一个FormData实例  
        var identify = "['" + $scope.currentUpadte.identify + "']";
        fd.append('paramStr', identify);
        var apiUrl = baseUrl + "/trace/fore/delHistoryData?userId=" + userId;
        $http.post(apiUrl,fd, {
            headers: { 'Authorization': authorization,'Content-Type': undefined },
            timeout: timeOut,
        }).success(function(data) {
            if (data.status == 1) {
                $scope.handleModal.hide()
                setTimeout(()=>{
                    Popup.showAlert($translate.instant('gz_sccg'));
                }, 500)
                $scope.initList()
            }
            }).error(function(result) {
        });
    }
    $ionicModal.fromTemplateUrl('templates/modal.html', {
        scope: $scope,
        animation:'none'
      }).then(function(modal) {
        $scope.handleModal = modal
    });    
    //页面写死跟踪数据
    $scope.trackDetail_track = function() {
        var etdValue = "2020/01/25 23:30:00"
        // 处理中转的信息 已传给地图
        var transitMap = []
        var mapVal = {
            vessel: 'YM ULTIMATE', //船名
            voyage: '081E', //航次
            mmsi: '538005956', //mmsi
            pol: { //起始港
                name: 'SHANG HAI',
                terminal: '',
                code: 'CNSHA',
                eta: "",
                etd: '2020/01/25 23:30:00',
                lat: '',
                lon: ''
            },
            pod: { //目的港
                name: 'VANCOUVER',
                terminal: "",
                code: "",
                eta: '2020/02/19 10:24:00',
                etd: "",
                lat: '',
                lon: ''
            },
            eta: new Date(etdValue) - 0,
            during: 1000 * 3600 * 24 * 30,
            transit:transitMap, //中转港
            polTime: '2020/01/25 23:30:00',
            podTime: '2020/02/19 10:24:00',
            isEntre: '0', //0 直达 ,1 中转
        }
        var setParamDate = {
            pol: 'CNSHA',
            referenceno: 'ONEYSH9ET7374500',
            carriercd: 'ONE',
            mapVal: mapVal,
        }

        var paramDate = setParams(setParamDate)
        $ionicHistory.clearHistory()
        $ionicHistory.clearCache().then(function() {
            $state.go('tab.track-detail', {referenceno:'ONEYSH9ET7374500',id:paramDate},{cache:true},{reload: true});
        });
}

    //各状态搜索   
    $scope.listSearchFun = function(arry, objID,index) {
        $ionicScrollDelegate.$getByHandle('myscroll').scrollTop([true])
        $scope.clickHeaderIndex = index
        localStorage.setItem("clickHeader", index)
    
        $("#" + objID).parents('.gtit').find('li').attr('class', '');
        $("#" + objID).attr('class', 'on');

        $scope.trackList = arry;
        $scope.trackTypeClick($scope.trackType, 'vslname1')

    }
    //////////////////////////////////////跟踪详情/////////////////
    $scope.initDetail = function() {
        if($stateParams.id){
            var paramDate = getParams($stateParams.id)
            $scope.GetTrackDetail(paramDate)
            $scope.authorization = getTokenInfor()
            $scope.GetDTInit(paramDate.mapVal) //调用地图方法
        }
    }
    $scope.GetTrackDetail = function(paramDate){
        //加载动画显示
        $ionicLoading.show({
            template: $translate.instant('sjcq_jzz')
        });
        $scope.warnFu1 = false
        $scope.warnFu0 = true
        
        var userId = (locals.get("login_content") == undefined || locals.get("login_content") == '[object Object]') ? "125" : locals.get('login_content'); //用户id
        $scope.referenceno = paramDate.referenceno

        var apiUrlGet = baseUrl + "/trace/fore/downloadDetails?pol=" + paramDate.pol + "&referenceno=" + paramDate.referenceno + "&carriercd=" + paramDate.carriercd + "&userId=" + userId;
        
        $scope.polItem = "";
        $scope.dtpItem = "";
        // $scope.shipLogoUrl = shipLogoUrl;
        $scope.iDays="";
        var authorization = getTokenInfor()
        $scope.getHeaderToken = ''
        auth = authorization;
        $scope.getHeaderToken = {
            'Authorization': authorization,
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate"
        }
        $http.get(apiUrlGet, {
            headers: { 'Authorization': authorization },
            timeout: timeOut
        }).success(function(results) {
            $ionicLoading.hide()
            var data = results.content;
            if (data.resultState == 0 || data.resultState == 1005) {
                $scope.trackDetail = data;
                $scope.polItem = $scope.trackDetail.pol.length > 13 ? $scope.trackDetail.pol.substr(0, 12) + "..." : $scope.trackDetail.pol;
                $scope.dtpItem = $scope.trackDetail.dtp.length > 13 ? $scope.trackDetail.dtp.substr(0, 12) + "..." : $scope.trackDetail.dtp;
                var day = 0;                       
                if (data.dlpttime && data.dschtime) {
                    day = (new Date(data.dschtime) - new Date(data.dlpttime)) /
                    (1000 * 60 * 60 * 24)
                    $scope.iDays = Math.floor(day)
                } else if (data.dlpttime && data.eta) {
                    day = (new Date(data.eta) - new Date(data.dlpttime)) /
                    (1000 * 60 * 60 * 24)
                    $scope.iDays = Math.floor(day)
                } else if(data.etd && data.eta){
                    day = (new Date(data.eta) - new Date(data.etd)) /
                    (1000 * 60 * 60 * 24)
                    $scope.iDays = Math.floor(day)
                } else {
                    $scope.iDays = ''
                }
                
                if(data.subStatus == 1){
                    $scope.warnFu1 = true
                    $scope.warnFu0 = false                    
                }else{
                    $scope.warnFu1 = false
                    $scope.warnFu0 = true                           
                }
                //从接口中获取当前船数据 ---绘制地图  $scope.trackDetail.vesselList[0].vesselInfo.mmsi
                // var mmsi = "";
                // if ($scope.trackDetail.vesselList[0].vesselInfo != undefined) {
                //     mmsi = $scope.trackDetail.vesselList[0].vesselInfo.mmsi;
                // }
                
                
                //处理流程信息
                var lstctnrbase = $scope.trackDetail.lstctnrbaseinfos  //箱子基础信息
                var lstlinertrack = $scope.trackDetail.lstlinertrackingctnrinfo // 每个箱子所对应得流程
                var linerTrackStatus = []
                if(lstctnrbase == null || lstctnrbase.length < 1) { //没有箱子的基础信息 或者箱子基础信息数组为空
                    if(lstlinertrack && lstlinertrack.length > 0) { //并且 有 提单流程信息
                        linerTrackStatus = lstlinertrack
                    }
                }else if(lstctnrbase && lstlinertrack && lstctnrbase.length > 0 && lstlinertrack.length > 0) { // 两者都有 取流程长度为准
                    for (let i = 0; i < lstlinertrack.length; i++) {
                        for (let j = 0; j < lstctnrbase.length; j++) {
                            if(lstlinertrack[i].ctnrno == lstctnrbase[j].ctnrno) { //如果箱子信息箱号 ==  流程箱号 则两个接合
                                let a = Object.assign({},lstlinertrack[i],lstctnrbase[j]);
                                lstlinertrack[i] = a
                            }
                        }
                    }
                    linerTrackStatus = lstlinertrack
                }
                // 注释的位置

                var vesselList = [];
                if($scope.trackDetail.vesselList && $scope.trackDetail.vesselList.length > 0){
                    vesselList = $scope.trackDetail.vesselList;
                }
                
                // 所有的港口类型集合（起始港，中转港，目的港）
                var portList = [];
                // 提空箱
                portList.push({
                    nameCn: '提空箱',
                    nameEn: 'EmptyBox',
                    icon: '4',
                    nodeIndex: 3,
                    statustime: '',
                    statuNode:[]
                })

                // 起始港
                portList.push({
                    name: $scope.trackDetail.pol,
                    nameCn: '起运港 ' + $scope.trackDetail.pol.toUpperCase(),
                    nameEn: 'Pol ' + $scope.trackDetail.pol.toUpperCase(),
                    polcd: $scope.trackDetail.polcd,
                    nodeIndex: 8,
                    ismaritime: $scope.trackDetail.ismaritime, // 上海港海事放行状态 Y放行，N未放行
                    dgid: $scope.trackDetail.dgid, // 是否是危险品标识 Y危险品：展示海事节点，N正常品：不展示海事节点
                    isPortShow: true, // 显示途经港口 
                    portType: 'start',
                    icon:'1'
                });

                // 所有中转港
                var entrePortList = $scope.trackDetail.entrePortList; //中转港集合
                //判断用户是否中转
                var isEnter = '0' //直达
                if (entrePortList && entrePortList.length > 0) {
                    isEnter = '1' //中转
                }
                var currentnodeplace = $scope.trackDetail.currentnodeplace //当前节点地址
                var currentnodeId = $scope.getCurrentIndex($scope.trackDetail.currentnode) //当前节点索引
                if(entrePortList !== null && entrePortList !== '' && entrePortList.length > 0){
                    for (let index = 0; index < entrePortList.length; index++) {
                        if(currentnodeId < 13){// 筛选出当前中转港的索引
                            portList.push({
                                name: entrePortList[index].entrePort,
                                nameCn: '中转港 ' + entrePortList[index].entrePort.toUpperCase(),
                                nameEn: 'TransitPort ' + entrePortList[index].entrePort.toUpperCase(),
                                nodeIndex: 13,
                                portType: 'mid',
                                isShowEntre: false,
                                origname: entrePortList[index].origname,
                                icon:'1'
                            });
                        }else if(currentnodeId > 16){// 筛选出当前中转港的索引
                            portList.push({
                                name: entrePortList[index].entrePort,
                                nameCn: '中转港 ' + entrePortList[index].entrePort.toUpperCase(),
                                nameEn: 'TransitPort ' + entrePortList[index].entrePort.toUpperCase(),
                                nodeIndex: 13,
                                portType: 'mid',
                                isShowEntre: true,
                                origname: entrePortList[index].origname,
                                icon:'1'
                            });
                        }else{// 筛选出当前中转港的索引
                            if(currentnodeplace.toUpperCase().replace(/\s/g, "") == entrePortList[index].origname.toUpperCase().replace(/\s/g, "")){
                                let entreIndex = index
                                for(let i= 0; i < entrePortList.length; i++){
                                    // 已经经过的中转港节点高亮 isShowEntre: true
                                    if(i <= entreIndex){
                                        portList.push({
                                            name: entrePortList[i].entrePort,
                                            nameCn: '中转港 ' + entrePortList[i].entrePort.toUpperCase(),
                                            nameEn: 'TransitPort ' + entrePortList[i].entrePort.toUpperCase(),
                                            nodeIndex: 13,
                                            portType: 'mid',
                                            isShowEntre: true,
                                            origname: entrePortList[i].origname,
                                            icon:'1'
                                        });
                                    }else{
                                    // 还未经过的中转港节点灰色 isShowEntre: false
                                        portList.push({
                                            name: entrePortList[i].entrePort,
                                            nameCn: '中转港 ' + entrePortList[i].entrePort.toUpperCase(),
                                            nameEn: 'TransitPort ' + entrePortList[i].entrePort.toUpperCase(),
                                            nodeIndex: 13,
                                            portType: 'mid',
                                            isShowEntre: false,
                                            origname: entrePortList[i].origname,
                                            icon:'1'
                                        });
                                    }
                                }
                            }
                        }
                    }
                }

                // 交货地
                if ($scope.trackDetail.pld.replace(/\s/g, "") == '' || $scope.trackDetail.pld.replace(/\s/g, "") == $scope.trackDetail.dtp.replace(/\s/g, "")) {
                    // 目的港
                    portList.push({
                        nameCn: '目的港 ' + $scope.trackDetail.dtp.toUpperCase(),
                        nameEn: 'Pod ' + $scope.trackDetail.dtp.toUpperCase(),
                        nodeIndex: 17,
                        portType: 'end',
                        icon:'4',
                        isPldShow:false,
                    });
                } else {
                    // 目的港
                    portList.push({
                        nameCn: '目的港 ' + $scope.trackDetail.dtp.toUpperCase(),
                        nameEn: 'Pod ' + $scope.trackDetail.dtp.toUpperCase(),
                        nodeIndex: 17,
                        portType: 'end',
                        icon:'4',
                        isPldShow:true,
                    });
                    portList.push({
                        nameCn: '交货地 ' + $scope.trackDetail.pld.toUpperCase(),
                        nameEn: 'delivery ' + $scope.trackDetail.pld.toUpperCase(),
                        nodeIndex: 18.3,
                        portType: 'deliver',
                        icon:'4',
                    });
                }
                // 还空箱
                portList.push({
                    nameCn: '还空箱',
                    nameEn: 'emptyNullbox',
                    nodeIndex: 20,
                    statustime: '',
                    statuNode:[]
                })
                linerTrackStatus.forEach(item => {
                    item.portList = JSON.parse(JSON.stringify(portList));
                    item.portList.forEach(item1 => {
                        item1.statuNode = [];
                        // 先把所有的N放进list中
                        item1.color = false
                        vesselList.forEach(vess=> {
                            if(item1.name == vess.pol){
                                item1.vesselInfo = vess.vesselInfo;
                            }
                        })
                        item.lstLinertrackingStatus.forEach(item2 => {
                            item2.statedescription = item2.statuscd ? $scope.getCurrentNode(item2.statuscd) : item2.statedescription
                            if (item1.portType == 'start' && (
                                    item2.statuscd == 'STSP' ||
                                    item2.statuscd == 'FCGI' ||
                                    item2.statuscd == 'CGGI' ||
                                    item2.statuscd == 'CLOD' ||
                                    item2.statuscd == 'CYTC' ||
                                    item2.statuscd == 'GITM' ||
                                    item2.statuscd == 'PASS' ||
                                    item2.statuscd == 'TMPS' ||
                                    item2.statuscd == 'PRLD' ||
                                    item2.statuscd == 'LOBD' ||
                                    item2.statuscd == 'DLPT') && item2.isest == 'N') {
                                item2.statustime = item2.statustime ? $scope.GetProcessTime("YY-mm-dd HH:MM", new Date(item2.statustime)) : ''
                                item2.statuNodeIndex = $scope.getCurrentIndex(item2.statuscd)
                                item1.statuNode.push(item2)
                            } else if (item1.portType == 'end' && item1.isPldShow && (//显示交货地
                                    item2.statuscd == 'BDAR' ||
                                    item2.statuscd == 'DSCH' ||
                                    item2.statuscd == 'IRLB' ||
                                    item2.statuscd == 'IRDP') && item2.isest == 'N') {
                                item2.statustime = item2.statustime ? $scope.GetProcessTime("YY-mm-dd HH:MM", new Date(item2.statustime)) : ''
                                item2.statuNodeIndex = $scope.getCurrentIndex(item2.statuscd)
                                item1.statuNode.push(item2)
                            } else if (item1.portType == 'end' && !item1.isPldShow && (//不显示交货地
                                    item2.statuscd == 'BDAR' ||
                                    item2.statuscd == 'DSCH' ||
                                    item2.statuscd == 'STCS' ||
                                    item2.statuscd == 'RCVE') && item2.isest == 'N') {
                                item2.statustime = item2.statustime ? $scope.GetProcessTime("YY-mm-dd HH:MM", new Date(item2.statustime)) : ''
                                item2.statuNodeIndex = $scope.getCurrentIndex(item2.statuscd)
                                item1.statuNode.push(item2)
                            } else if (item1.portType == 'mid' && (
                                    item2.statuscd == 'TSBA' ||
                                    item2.statuscd == 'TSDC' ||
                                    item2.statuscd == 'TSLB' ||
                                    item2.statuscd == 'TSDP') && item2.isest == 'N' && item1.origname.replace(/\s+/g,'') == item2.statusplace.replace(/\s+/g,'')) {
                                item2.statustime = item2.statustime ? $scope.GetProcessTime("YY-mm-dd HH:MM", new Date(item2.statustime)) : ''
                                item2.statuNodeIndex = $scope.getCurrentIndex(item2.statuscd)
                                item1.statuNode.push(item2)
                            } else if (item1.portType == 'deliver' && (
                                    item2.statuscd == 'IRAR' ||
                                    item2.statuscd == 'STCS' ||
                                    item2.statuscd == 'RCVE') && item2.isest == 'N') {
                                item2.statustime = item2.statustime ? $scope.GetProcessTime("YY-mm-dd HH:MM", new Date(item2.statustime)) : ''
                                item2.statuNodeIndex = $scope.getCurrentIndex(item2.statuscd)
                                item1.statuNode.push(item2)
                            }
                        })
                    })
                })
                // 循环遍历将 'Y'类型有的数据'N'类型没有的数据放到集合中
                linerTrackStatus.forEach(item => {
                    item.lastArry = []
                    item.nowEntreArry = [] // 当前中转港节点数组
                    item.latestTime = ''
                    item.latestNode = ''
                    item.portList.forEach(item1 => {
                        // 先把所有的N放进list中
                        item.lstLinertrackingStatus.forEach(item2 => {
                            item2.statedescription = item2.statuscd ? $scope.getCurrentNode(item2.statuscd) : item2.statedescription
                            if (item1.portType == 'start' && (
                                    item2.statuscd == 'STSP' ||
                                    item2.statuscd == 'FCGI' ||
                                    item2.statuscd == 'CGGI' ||
                                    item2.statuscd == 'CLOD' ||
                                    item2.statuscd == 'CYTC' ||
                                    item2.statuscd == 'GITM' ||
                                    item2.statuscd == 'PASS' ||
                                    item2.statuscd == 'TMPS' ||
                                    item2.statuscd == 'PRLD' ||
                                    item2.statuscd == 'LOBD' ||
                                    item2.statuscd == 'DLPT') && item2.isest == 'Y') {
                                // 如果有相同类型的就不往list中添加 例如：数组中已经有了 'DLSP' 类型 并且是N 那么 'DLSP' 是Y 的类型就不插入
                                if (item1.statuNode.filter(function (v) {return item2.statuscd == v.statuscd}).length == 0) {
                                    item2.statustime = item2.statustime ? $scope.GetProcessTime("YY-mm-dd HH:MM", new Date(item2.statustime)) : ''
                                    item2.statuNodeIndex = $scope.getCurrentIndex(item2.statuscd)
                                    item1.statuNode.push(item2)
                                }
                            } else if (item1.portType == 'end' && item1.isPldShow && (//显示交货地
                                    item2.statuscd == 'BDAR' ||
                                    item2.statuscd == 'DSCH' ||
                                    item2.statuscd == 'IRLB' ||
                                    item2.statuscd == 'IRDP') && item2.isest == 'Y') {
                                if (item1.statuNode.filter(function (v) {return item2.statuscd == v.statuscd}).length == 0) {
                                    item2.statustime = item2.statustime ? $scope.GetProcessTime("YY-mm-dd HH:MM", new Date(item2.statustime)) : ''
                                    item2.statuNodeIndex = $scope.getCurrentIndex(item2.statuscd)
                                    item1.statuNode.push(item2)
                                }
                            } else if (item1.portType == 'end' && !item1.isPldShow && (//不显示交货地
                                    item2.statuscd == 'BDAR' ||
                                    item2.statuscd == 'DSCH' ||
                                    item2.statuscd == 'STCS' ||
                                    item2.statuscd == 'RCVE') && item2.isest == 'Y') {
                                if (item1.statuNode.filter(function (v) {return item2.statuscd == v.statuscd}).length == 0) {
                                    item2.statustime = item2.statustime ? $scope.GetProcessTime("YY-mm-dd HH:MM", new Date(item2.statustime)) : ''
                                    item2.statuNodeIndex = $scope.getCurrentIndex(item2.statuscd)
                                    item1.statuNode.push(item2)
                                }
                            } else if (item1.portType == 'mid' && (
                                    item2.statuscd == 'TSBA' ||
                                    item2.statuscd == 'TSDC' ||
                                    item2.statuscd == 'TSLB' ||
                                    item2.statuscd == 'TSDP') && item2.isest == 'Y' && item1.origname.replace(/\s+/g,'') == item2.statusplace.replace(/\s+/g,'')) {
                                if (item1.statuNode.filter(function (v) {return item2.statuscd == v.statuscd}).length == 0) {
                                    item2.statustime = item2.statustime ? $scope.GetProcessTime("YY-mm-dd HH:MM", new Date(item2.statustime)) : ''
                                    item2.statuNodeIndex = $scope.getCurrentIndex(item2.statuscd)
                                    item1.statuNode.push(item2)
                                }
                            } else if (item1.portType == 'deliver' && (
                                    item2.statuscd == 'IRAR' ||
                                    item2.statuscd == 'STCS' ||
                                    item2.statuscd == 'RCVE') && item2.isest == 'Y') {
                                if (item1.statuNode.filter(function (v) {return item2.statuscd == v.statuscd}).length == 0) {
                                    item2.statustime = item2.statustime ? $scope.GetProcessTime("YY-mm-dd HH:MM", new Date(item2.statustime)) : ''
                                    item2.statuNodeIndex = $scope.getCurrentIndex(item2.statuscd)
                                    item1.statuNode.push(item2)
                                }
                            }
                        })
                        item1.statuNode = item1.statuNode.sort($scope.compare('statuNodeIndex')).reverse();
                        item.lastArry = item.lastArry.concat(item1.statuNode)
                    })
                    item.lastArry = item.lastArry.filter(function (v) {return v.isest == 'N'})
                    if(item.lastArry.length > 0){
                        item.latestNode = item.lastArry[item.lastArry.length - 1].statuscd
                        for(let i=0; i<item.lastArry.length; i++){
                            // 筛选出当前中转港的中转节点
                            if (currentnodeplace.replace(/\s/g, "") == item.lastArry[i].statusplace.replace(/\s/g, "") &&
                                currentnodeId > 12 && currentnodeId < 17) {
                                item.nowEntreArry.push(item.lastArry[i])
                            }
                        }
                        // 取出当前中转港最后一个节点
                        if(item.nowEntreArry.length > 0){
                            var last = item.nowEntreArry[item.nowEntreArry.length - 1]
                        } else {
                            var last = item.lastArry[item.lastArry.length - 1]
                        }

                        item.latestTime = last.statustime ? $scope.GetProcessTime("YY-mm-dd HH:MM", new Date(last.statustime)) : ''
                        item.latestNodeIndex = last.statuNodeIndex ? last.statuNodeIndex : ''
                    }
                })
                for(let i = 0;i < linerTrackStatus.length;i++){
                    let linerTrackStatus1 = linerTrackStatus[i];
                    var currentnodeIndex = linerTrackStatus1.latestNodeIndex
                    
                    // 最后高亮的节点不显示icon图片
                    if (linerTrackStatus1.portList.slice(-1)[0] !== undefined) {
                        linerTrackStatus1.portList.slice(-1)[0].icon = ''
                    }
                    for(let j = 0;j < linerTrackStatus1.portList.length;j++){
                        let portList1 = linerTrackStatus1.portList[j];  
                        portList1.isViaWayColor = false  
                        // 提空箱要求单独一个节点
                        if(portList1.portType == 'start'){
                            for(let ps = 0;ps < portList1.statuNode.length;ps++){
                                if(portList1.statuNode[ps].statuscd == "STSP"){
                                    // 提空箱时间
                                    linerTrackStatus1.portList[0].statustime = portList1.statuNode[ps].statustime;
                                    portList1.statuNode.splice(ps, 1)
                                    break;
                                }
                            }
                        }
                        // 还空箱要求单独一个节点
                        if(portList1.portType == 'deliver' || portList1.portType == 'end'){
                            for(let ps = 0;ps < portList1.statuNode.length;ps++){
                                if(portList1.statuNode[ps].statuscd == "RCVE"){
                                    // 还空箱时间
                                    linerTrackStatus1.portList[linerTrackStatus1.portList.length - 1].statustime = portList1.statuNode[ps].statustime;
                                    portList1.statuNode.splice(ps, 1)
                                    break;
                                }
                            }
                        }
                        // 如果有铁路节点，目的港下显示火车图标，途经地
                        if(portList1.portType == 'end' && portList1.isPldShow){
                            for(let ps = 0; ps < portList1.statuNode.length; ps++){
                                if(portList1.statuNode[ps].statuscd == "IRLB" || portList1.statuNode[ps].statuscd == "IRDP"){
                                    portList1.icon = '3'
                                    portList1.isViaWayShow = true
                                    if(portList1.statuNode[ps].isest == 'N'){
                                        portList1.isViaWayColor = true
                                    }
                                }
                            }
                            // 如果有多个铁运装箱，筛选出第一个
                            var IRLBList = portList1.statuNode.filter((item) => {
                                return item.statuscd == "IRLB"
                            })
                            IRLBList = IRLBList.sort((a,b)=>{
                                return new Date(a.statustime).getTime() - new Date(b.statustime).getTime()
                            })[0]
                            var unIRLBList = portList1.statuNode.filter((item) => {
                                return item.statuscd != "IRLB"
                            })
                            if(IRLBList){
                                portList1.statuNode = [IRLBList].concat(unIRLBList)   
                            }
                            // 如果有多个铁运发车，筛选出第一个
                            var IRDPList = portList1.statuNode.filter((item) => {
                                return item.statuscd == "IRDP"
                            })
                            IRDPList = IRDPList.sort((a,b)=>{
                                return new Date(a.statustime).getTime() - new Date(b.statustime).getTime()
                            })[0]
                            var unIRDPList = portList1.statuNode.filter((item) => {
                                return item.statuscd != "IRDP"
                            })
                            if(IRDPList){
                                portList1.statuNode = [IRDPList].concat(unIRDPList)   
                            }
                        }
                        if(portList1.portType == 'deliver' && linerTrackStatus1.portList[j-1].isPldShow){
                            for(let ps = 0; ps < portList1.statuNode.length; ps++){
                                if(portList1.statuNode[ps].statuscd == "IRAR"){
                                    linerTrackStatus1.portList[j-1].icon = '3'
                                    linerTrackStatus1.portList[j-1].isViaWayShow = true
                                    if(portList1.statuNode[ps].isest == 'N'){
                                        portList1.isViaWayColor = true
                                    }
                                }
                            }
                            // 如果有多个铁运到达，筛选出最近的一个
                            var IRARList = portList1.statuNode.filter((item) => {
                                return item.statuscd == "IRAR"
                            })
                            IRARList = IRARList.sort((a,b)=>{
                                return new Date(a.statustime).getTime() - new Date(b.statustime).getTime()
                            })[IRARList.length-1]
                            var unIRARList = portList1.statuNode.filter((item) => {
                                return item.statuscd != "IRAR"
                            })
                            if(IRARList){
                                portList1.statuNode = [IRARList].concat(unIRARList)   
                            }
                        }
                        // 补全欠缺的节点,匹配没有的节点
                        //搜索起运港
                        if(portList1.portType == "start"){
                            if(portList1.polcd == 'CNTAO'){
                                portList1.nodeIndex = 4
                                var startList = ['FCGI','CGGI','CLOD','CYTC','GITM','PASS','TMPS','LOBD','DLPT']
                            }else if(portList1.polcd == 'CNSHA' || portList1.polcd == 'CNCAN' || portList1.polcd == 'CNNGB'){
                                var startList = ['GITM','PASS','TMPS','PRLD','LOBD','DLPT']
                                if(portList1.polcd == 'CNSHA' && portList1.dgid == 'Y'){
                                    var startList = ['GITM','PASS','TMPS','HAISHI','PRLD','LOBD','DLPT']
                                }
                            }else{
                                var startList = ['GITM','PASS','TMPS','LOBD','DLPT']
                            }
                            var needNode = $scope.getArrDifference(startList,portList1.statuNode)
                            for (let qq = 0; qq < needNode.length; qq++) {
                                // 到达码放节点海事节点高亮
                                if ($scope.getCurrentIndex(needNode[qq]) == 10.2 && currentnodeIndex == 10){
                                    var isest = 'N'
                                } else {
                                    var isest = $scope.getCurrentIndex(needNode[qq]) <= currentnodeIndex ? 'N' : 'Y'
                                } 
                                portList1.statuNode.push({
                                    statedescription:$scope.getCurrentNode(needNode[qq]),
                                    statuNodeIndex:$scope.getCurrentIndex(needNode[qq]),
                                    statuscd:needNode[qq],
                                    statustime:'',
                                    isest:isest,
                                })                  
                            }
                            //排序
                            portList1 = portList1.statuNode.sort($scope.compare('statuNodeIndex')).reverse()
                        }
                        //搜索中转港
                        if(portList1.portType == "mid"){
                            if (portList1.isShowEntre) {
                                if(currentnodeplace.replace(/\s/g, "") == portList1.origname.replace(/\s/g, "")){
                                    var startList = ['TSBA','TSDC','TSLB','TSDP']
                                    var needNode = $scope.getArrDifference(startList,portList1.statuNode)
                                    for (let qq = 0; qq < needNode.length; qq++) {
                                        var isest = $scope.getCurrentIndex(needNode[qq]) <= currentnodeIndex ? 'N' : 'Y'
                                        portList1.statuNode.push({
                                            statedescription:$scope.getCurrentNode(needNode[qq]),
                                            statuNodeIndex:$scope.getCurrentIndex(needNode[qq]),
                                            statuscd:needNode[qq],
                                            statustime:'',
                                            isest:isest
                                        })                  
                                    }
                                    //排序
                                    portList1 = portList1.statuNode.sort($scope.compare('statuNodeIndex')).reverse()
                                }else{
                                    var startList = ['TSBA','TSDC','TSLB','TSDP']
                                    var needNode = $scope.getArrDifference(startList,portList1.statuNode)
                                    for (let qq = 0; qq < needNode.length; qq++) {
                                        var isest = 'N'
                                        portList1.statuNode.push({
                                            statedescription:$scope.getCurrentNode(needNode[qq]),
                                            statuNodeIndex:$scope.getCurrentIndex(needNode[qq]),
                                            statuscd:needNode[qq],
                                            statustime:'',
                                            isest:isest
                                        })                  
                                    }
                                    //排序
                                    portList1 = portList1.statuNode.sort($scope.compare('statuNodeIndex')).reverse()
                                }
                            } else {
                                var startList = ['TSBA','TSDC','TSLB','TSDP']
                                var needNode = $scope.getArrDifference(startList,portList1.statuNode)
                                for (let qq = 0; qq < needNode.length; qq++) {
                                    var isest = 'Y'
                                    portList1.statuNode.push({
                                        statedescription:$scope.getCurrentNode(needNode[qq]),
                                        statuNodeIndex:$scope.getCurrentIndex(needNode[qq]),
                                        statuscd:needNode[qq],
                                        statustime:'',
                                        isest:isest
                                    })                  
                                }
                                //排序
                                portList1 = portList1.statuNode.sort($scope.compare('statuNodeIndex')).reverse()
                            }
                        }
                        //搜索目的港
                        if(portList1.portType == "end"){
                            if(portList1.isPldShow){ //说明有交货地
                                var startList = ['BDAR','DSCH']
                                var needNode = $scope.getArrDifference(startList,portList1.statuNode)
                                for (let qq = 0; qq < needNode.length; qq++) {
                                    var isest = $scope.getCurrentIndex(needNode[qq]) <= currentnodeIndex ? 'N' : 'Y'
                                    portList1.statuNode.push({
                                        statedescription:$scope.getCurrentNode(needNode[qq]),
                                        statuNodeIndex:$scope.getCurrentIndex(needNode[qq]),
                                        statuscd:needNode[qq],
                                        statustime:'',
                                        isest:isest
                                    })                  
                                }
                            }else{ //说明没有交货地
                                var startList = ['BDAR','DSCH','STCS']
                                var needNode = $scope.getArrDifference(startList,portList1.statuNode)
                                for (let qq = 0; qq < needNode.length; qq++) {
                                    var isest = $scope.getCurrentIndex(needNode[qq]) <= currentnodeIndex ? 'N' : 'Y'
                                    portList1.statuNode.push({
                                        statedescription:$scope.getCurrentNode(needNode[qq]),
                                        statuNodeIndex:$scope.getCurrentIndex(needNode[qq]),
                                        statuscd:needNode[qq],
                                        statustime:'',
                                        isest:isest
                                    })                  
                                }
                            }
                            //排序
                            portList1 = portList1.statuNode.sort($scope.compare('statuNodeIndex')).reverse()
                        }
                        //搜索交货地
                        if(portList1.portType == "deliver"){
                            var startList = ['STCS']
                            var needNode = $scope.getArrDifference(startList,portList1.statuNode)
                            for (let qq = 0; qq < needNode.length; qq++) {
                                var isest = $scope.getCurrentIndex(needNode[qq]) <= currentnodeIndex ? 'N' : 'Y'
                                portList1.statuNode.push({
                                    statedescription:$scope.getCurrentNode(needNode[qq]),
                                    statuNodeIndex:$scope.getCurrentIndex(needNode[qq]),
                                    statuscd:needNode[qq],
                                    statustime:'',
                                    isest:isest,
                                })                  
                            }
                            //排序
                            portList1 = portList1.statuNode.sort($scope.compare('statuNodeIndex')).reverse()
                        }
                        // 节点高亮状态
                        if (currentnodeIndex >= linerTrackStatus[i].portList[j].nodeIndex) {
                            linerTrackStatus[i].portList[j].color = true
                            // 中转节点
                            if (linerTrackStatus[i].portList[j].portType == 'mid' && linerTrackStatus[i].portList[j].isShowEntre == false) {
                                linerTrackStatus[i].portList[j].color = false
                            }
                        } else {
                            linerTrackStatus[i].portList[j].color = false
                        }
                        if (linerTrackStatus[i].portList[j].color && j > 0) {
                            linerTrackStatus[i].portList[j-1].halfColor = true
                        }
                        if (linerTrackStatus[i].portList[j].halfColor == undefined) {
                            linerTrackStatus[i].portList[j].halfColor = false
                        }
                    }
                }
                $scope.trackDetail.isEnter = isEnter
                $scope.moreFun('',0)
                $ionicLoading.hide() //加载动画隐藏 
            } else if (data.resultState == 1000) {
                Popup.showAlert($translate.instant('gz_bqmyztgzxx'));
                $ionicLoading.hide(); //加载动画隐藏  
            }

        }).error(function(result) {
            console.log("log:" + result);
            $ionicLoading.hide(); //加载动画隐藏
            Popup.showAlert($translate.instant('ts_qjcwl'));
        });
    }
    $scope.statuNodeActive = function(type, latestNodeIndex, activity){
        let nameClass = ''
        let colorClass = ''
        let latestNodeClass = ''
        let image = ''
        // 提空还空的大节点显示小圆点
        if (activity.nameCn == '提空箱' || activity.nameCn == '还空箱') {
            nameClass = 'small_dot'
        } else {
            nameClass = ''
        }
        // 是否是已发生的大节点
        if (activity.color) {
            if (activity.halfColor) {
                colorClass = 'line_active'
            } else {
                // 正在发生的大节点
                if (latestNodeIndex == 3) {
                    colorClass = 'STSP_line_active' // 提空箱 STSP
                }
                // 青岛的起始港小节点样式
                if(activity.polcd == 'CNTAO'){
                    if (latestNodeIndex == 4) {
                        colorClass = 'Q_FCGI_line_active' // 返场 FCGI
                        image = 'Q_FCGI_imageChuan'
                    }
                    if (latestNodeIndex == 5) {
                        colorClass = 'Q_CGGI_line_active' // 入货 CGGI
                        image = 'Q_CGGI_imageChuan'
                    }
                    if (latestNodeIndex == 6) {
                        colorClass = 'Q_CLOD_line_active' // 装箱 CLOD
                        image = 'Q_CLOD_imageChuan'
                    }
                    if (latestNodeIndex == 7) {
                        colorClass = 'Q_CYTC_line_active' // 集港 CYTC
                        image = 'Q_CYTC_imageChuan'
                    }
                    if (latestNodeIndex == 8) {
                        colorClass = 'Q_GITM_line_active' // 进港 GITM
                        image = 'Q_GITM_imageChuan'
                    }
                    if (latestNodeIndex == 9) {
                        colorClass = 'Q_PASS_line_active' // 海放 PASS
                        image = 'Q_PASS_imageChuan'
                    }
                    if (latestNodeIndex == 10) {
                        colorClass = 'Q_TMPS_line_active' // 码放 TMPS
                        image = 'Q_TMPS_imageChuan'
                    }
                    if (latestNodeIndex == 11) {
                        colorClass = 'Q_LOBD_line_active' // 上船 LOBD
                        image = 'Q_LOBD_imageChuan'
                    }
                    if (latestNodeIndex == 12) {
                        colorClass = 'Q_DLPT_line_active' // 离港 DLPT
                        image = 'Q_DLPT_imageChuan'
                    }
                // 上海广州宁波的起始港小节点样式
                }else if(activity.polcd == 'CNSHA' || activity.polcd == 'CNCAN' || activity.polcd == 'CNNGB'){
                    if (latestNodeIndex == 8) {
                        colorClass = 'SGN_GITM_line_active' // 进港 GITM
                        image = 'SGN_GITM_imageChuan'
                    }
                    if (latestNodeIndex == 9) {
                        colorClass = 'SGN_PASS_line_active' // 海放 PASS
                        image = 'SGN_PASS_imageChuan'
                    }
                    if (latestNodeIndex == 10) {
                        colorClass = 'SGN_TMPS_line_active' // 码放 TMPS
                        image = 'SGN_TMPS_imageChuan'
                    }
                    // 危险品，展示上海起始港的特殊状态，海事放行，的小节点样式
                    if (activity.polcd == 'CNSHA' && activity.dgid == 'Y') {
                        if (latestNodeIndex == 10.2) {
                            colorClass = 'SDG_HAISHI_line_active' // 海事 HAISHI
                            image = 'SDG_HAISHI_imageChuan'
                        }
                        if (latestNodeIndex == 10.5) {
                            colorClass = 'SDG_PRLD_line_active' // 配载 PRLD
                            image = 'SDG_PRLD_imageChuan'
                        }
                        if (latestNodeIndex == 11) {
                            colorClass = 'SDG_LOBD_line_active' // 上船 LOBD
                            image = 'SDG_LOBD_imageChuan'
                        }
                        if (latestNodeIndex == 12) {
                            colorClass = 'SDG_DLPT_line_active' // 离港 DLPT
                            image = 'SDG_DLPT_imageChuan'
                        }
                    // 非危险品，不展示海事放行，的小节点样式
                    }else{
                        if (latestNodeIndex == 10.5) {
                            colorClass = 'SGN_PRLD_line_active' // 配载 PRLD
                            image = 'SGN_PRLD_imageChuan'
                        }
                        if (latestNodeIndex == 11) {
                            colorClass = 'SGN_LOBD_line_active' // 上船 LOBD
                            image = 'SGN_LOBD_imageChuan'
                        }
                        if (latestNodeIndex == 12) {
                            colorClass = 'SGN_DLPT_line_active' // 离港 DLPT
                            image = 'SGN_DLPT_imageChuan'
                        }
                    }
                // 其他港口的起始港的小节点样式
                }else{
                    if (latestNodeIndex == 8) {
                        colorClass = 'GITM_line_active' // 进港 GITM
                        image = 'GITM_imageChuan'
                    }
                    if (latestNodeIndex == 9) {
                        colorClass = 'PASS_line_active' // 海放 PASS
                        image = 'PASS_imageChuan'
                    }
                    if (latestNodeIndex == 10) {
                        colorClass = 'TMPS_line_active' // 码放 TMPS
                        image = 'TMPS_imageChuan'
                    }
                    if (latestNodeIndex == 11) {
                        colorClass = 'LOBD_line_active' // 上船 LOBD
                        image = 'LOBD_imageChuan'
                    }
                    if (latestNodeIndex == 12) {
                        colorClass = 'DLPT_line_active' // 离港 DLPT
                        image = 'DLPT_imageChuan'
                    }
                }
                if (latestNodeIndex == 13) {
                    colorClass = 'TSBA_line_active' // 中转抵港 TSBA
                    image = 'TSBA_imageChuan'
                }
                if (latestNodeIndex == 14) {
                    colorClass = 'TSDC_line_active' // 中转卸船 TSDC
                    image = 'TSDC_imageChuan'
                }
                if (latestNodeIndex == 15) {
                    colorClass = 'TSLB_line_active' // 中转装船 TSLB
                    image = 'TSLB_imageChuan'
                }
                if (latestNodeIndex == 16) {
                    colorClass = 'TSDP_line_active' // 中转开航 TSDP
                    image = 'TSDP_imageChuan'
                }
                if (latestNodeIndex == 17) {
                    colorClass = 'BDAR_line_active' // 到港 BDAR
                    // 到港节点，展示车图标，的节点样式
                    if(activity.icon == 4){
                        image = 'BDAR_imageChe'
                    // 到港节点，展示火车图标，的节点样式
                    }else{
                        image = 'BDAR_imageRailway'
                    }
                }
                if (latestNodeIndex == 18) {
                    colorClass = 'DSCH_line_active'
                    image = 'DSCH_imageChe'
                }
                if (latestNodeIndex == 18.1) {
                    colorClass = 'IRLB_line_active' // 铁运装箱 IRLB
                    image = 'IRLB_imageRailway'
                }
                if (latestNodeIndex == 18.2) {
                    colorClass = 'IRDP_line_active' // 铁运发车 IRDP
                    image = 'IRDP_imageRailway'
                }
                if (latestNodeIndex == 18.3) {
                    colorClass = 'IRAR_line_active' // 到达 IRAR
                    image = 'IRAR_imageChe'
                }
                if (latestNodeIndex == 19) {
                    // 不显示交货地时，目的港下的提货，小节点样式
                    if(activity.portType == 'end'){
                        colorClass = 'end_STCS_line_active' // 提货 STCS
                        image = 'end_STCS_imageChe'  
                    // 显示交货地，且没有到达节点时，交货地下的提货，小节点样式
                    }else if(activity.portType == 'deliver' && activity.statuNode.length == 1){
                        colorClass = 'deliver1_STCS_line_active' // 提货 STCS
                        image = 'deliver1_STCS_imageChe'
                    // 显示交货地，且有到达节点时，交货地下的提货，小节点样式
                    }else if(activity.portType == 'deliver' && activity.statuNode.length == 2){
                        colorClass = 'deliver2_STCS_line_active' // 提货 STCS
                        image = 'deliver2_STCS_imageChe'
                    }
                }
            }
        }
        if(type == 'timeLine'){
            return nameClass + ' ' + colorClass
        }
        if(type == 'image'){
            return image
        }
    }
    $scope.moreFun = function(obj,index) { // more1 打开

        //当我点击打开的时候  上一个关闭
        $(".h_list .more1").show()
        $(".h_list .close1").hide()
        $(".h_list .gz_box").hide()

        //当前的打开

        $(".h_list .more1").eq(index).hide()
        $(".h_list .close1").eq(index).show()
        $(".h_list .gz_box").eq(index).show()

    }
    $scope.closeFun = function(obj,index) { //close1 关闭

        //当我点击关闭的时候 正常关闭当前
        var objValue = obj.target;
        $(objValue).parent().find('.more1').show();
        $(objValue).parents('.h_list').find('.gz_box').hide();
        $(objValue).hide();

        }
        //提醒功能
        $scope.warnFun = function(mark, identify,isPage) {
        //加载动画显示
        $ionicLoading.show({
            template: $translate.instant('sjcq_jzz')
        });
        var userId = (locals.get("login_content") == undefined || locals.get("login_content") == '[object Object]') ? "" : locals.get('login_content'); //用户id
        var fd = new FormData(); //初始化一个FormData实例  
        var identify = "['" + identify + "']";
        fd.append('paramStr', identify);
        var apiUrlPost = baseUrl + `/trace/fore/subscribe?userId=` + userId + "&mark=" + mark ;
        var authorization = getTokenInfor()
        $http.post(apiUrlPost, fd, {
            headers: { 'Authorization': authorization, 'Content-Type': undefined },
            timeout: timeOut
        }).success(function(results) {
            $ionicLoading.hide(); //加载动画隐藏
            if (results.status == 1) {
                if (mark == 1) {
                    $scope.warnFu1 = true
                    $scope.warnFu0 = false
                } else {
                    $scope.warnFu1 = false
                    $scope.warnFu0 = true
                }
                if(isPage == 'List'){
                    $scope.handleModal.hide()
                    $scope.initList()
                }
            }
        }).error(function(result) {
            console.log("log:" + result);
            $ionicLoading.hide(); //加载动画隐藏
            Popup.showAlert($translate.instant('ts_qjcwl'));
        });
    }

    $scope.openQQ = function() {
        contactCustomer()
    }

    //生成随机数
    $scope.createRandomId = function() {
        return (Math.random() * 10000000).toString(16).substr(0, 4) + '_' + (new Date()).getTime() + '_' + Math.random().toString().substr(2, 5);
    }
    $scope.deleteTest = function() {
        locals.setObject("useripLog", ""); //存入缓存
    }

    $scope.doYourStuff = function() {
        localStorage.setItem("clickHeader", 1) //此时是全部
        $ionicHistory.clearHistory()
        $ionicHistory.clearCache().then(function() {
            $state.go('tab.trackList', {isAddTrack:true},{cache:true},{reload: true});
        });
    }

    $scope.DiRepeatTemp= function(_oldData) {
      var newData = new Array();
      var oldData = _oldData.sort(function(a, b) { if (a.statuscd < b.statuscd) { return -1 }; if (a.statuscd > b.statuscd) { return 1 }; });

      var i = 0;
      while (i < oldData.length) {
          var t1, t2;
          t1 = oldData[i];
          if (i + 1 < oldData.length) {
              t2 = oldData[i + 1];
          }
          if (t2 == null || t2 == undefined || t1.statuscd != t2.statuscd) {
              i = i + 1;
              newData.push(t1);
          } else {
              i = i + 2;
              if (t1.isest == 'N') {
                  newData.push(t1);
              } else {
                  newData.push(t2);
              }
          }
      }
      return newData;
      
    }


    //去重
    $scope.DiRepeat = function(_oldData) {
        var ar=new Array();
        ar=_oldData;
        for(var i=0;i< 5;i++){
          ar= $scope.DiRepeatTemp(ar);
        }
        return ar;
    }

    //当前高度
    var topNow = 0;
    //按下
    $scope.onTouch = function() {
        var _topNow = $('#track_detial').css('top').replace('px', '');
        topNow = _topNow * 1;
    }
    //y轴滑动距离
    $scope.hd_y = 0;
    //拖拽
    $scope.onDrag = function($event) {
        var dy = $event.gesture.deltaY;
        $scope.hd_y = dy;

        // //滑动灵敏度
        if (-8 < dy < 8) {
            return;
        }
        if (dy < 0) { //上滑
            var top = dy + topNow;
            if (top < maxTop) {
                $('#map_track').css({ height: 44 + 10 + 'px' });
                $('#track_detial').css({ top: (screen.height / 2) - 6 + 'px' });
                $scope.CalculateOverflowDivHeight();
            }
        } else { //下滑
            var top = dy + topNow;
            if (top > minTop) {
                $('#map_track').css({ height: (screen.height / 2) + 'px' });
                $('#track_detial').css({ top: 44 - 10 + 'px' });
                $scope.CalculateOverflowDivHeight();
            }
        }
    };
    var maxTop = (screen.height / 2) + 10;
    var minTop = 44 + 10;

    //监听内容区回收状态下用户上划展开的动作
    $scope.DetailIdDrag = function($event) {
        if($event.gesture.deltaY < 0){
            $("#track_detial").animate({ top: minTop - 10  + 'px' });
            $scope.CalculateOverflowDivHeight('上滑')
            $('.mapButton').hide()
            $('#overflowDiv').css("overflow", "auto")
            // 展开状态下，判断内容区域是否可滚动
            var allHight = $('#overflowDiv').height() // 可视区的高度
            var shippingsHight = $('.shippings').height() // 下半部内容高度
            var portListHeight = $('.port_list').height() // 下半部内容高度
            var hListHeight = $('.h_list').height() // 下半部内容高度
            var hListZwHeight = $('.h_list_zw').height() // 下半部内容高度
            if(allHight > (shippingsHight + portListHeight + hListHeight + hListZwHeight)){
                $scope.isOverFlowScroll = true
            }else{
                $scope.isOverFlowScroll = false
            }
        }
        // 监听内容区域展开状态下用户下滑收起的动作，内容不可滚动时收起
        if($event.gesture.deltaY > 0 && $scope.isOverFlowScroll){
            $("#track_detial").animate({ top: maxTop - 6 + 'px' });
            $scope.CalculateOverflowDivHeight('下滑')
            $('.mapButton').show()
            $('#overflowDiv').css("overflow", "hidden")
        }
        // 监听内容区域展开状态下用户下滑收起的动作，内容可以滚动时，滚动到顶部时收起
        if($event.gesture.deltaY > 0 && !$scope.isOverFlowScroll){
            $('#overflowDiv').on('scroll',function(){
                $scope.scrollTop = $('#overflowDiv').scrollTop()
                if ($scope.scrollTop == 0){
                    $scope.dragHeight = $event.gesture.deltaY
                }else{
                    $scope.dragHeight = -1
                }
            });
            if ($scope.scrollTop == 0 && $scope.dragHeight > 0){
                $("#track_detial").animate({ top: maxTop - 6 + 'px' });
                $scope.CalculateOverflowDivHeight('下滑')
                $('.mapButton').show()
                $('#overflowDiv').css("overflow", "hidden")
            }
        }
    }
    
    //抬起
    $scope.onRelease = function() {

        if($scope.hd_y > 8){ //下滑
            $("#track_detial").animate({ top: maxTop - 6 + 'px' });
            $scope.CalculateOverflowDivHeight('下滑')
            $('.mapButton').show()
            $('#overflowDiv').css("overflow", "hidden")
        }else if($scope.hd_y < -8){ //上滑
            $("#track_detial").animate({ top: minTop - 10  + 'px' });
            $scope.CalculateOverflowDivHeight('上滑')
            $('.mapButton').hide()
            $('#overflowDiv').css("overflow", "auto")
        }
        //下滑（滑动趋势判断）
        if ($scope.hd_y > 40) {
            console.log('> 40')
            $("#track_detial").animate({ top: maxTop - 6 + 'px' });
            
        } else if ($scope.hd_y > 0 && $scope.hd_y <= 40) {
            console.log('> 0<= 40')
            $("#track_detial").animate({ top: maxTop - 6 + 'px' });
        }
        //上滑（滑动趋势判断）
        if ($scope.hd_y < -40) {
            console.log('< -40')
            $("#track_detial").animate({ top: minTop - 10  + 'px' });
        } else if ($scope.hd_y < 0 && $scope.hd_y >= -40) {
            console.log('< 0')
            $("#track_detial").animate({ top: minTop - 10  + 'px' });
        }
    }

    //计算滚动位置高度
    $scope.CalculateOverflowDivHeight = function (val) {
        var screenHeight = screen.height //屏幕的高度
        var mapDom = $('#overflowDiv')
        var overflowDivHeight
        if(val == '下滑'){ //val 为 下滑 代表下滑
            overflowDivHeight = screenHeight - (screenHeight / 2) - 50 - 26;
                            //屏幕宽度 - 距离顶部的距离 - 底部导航栏高度 - 拖拽图标的高度

        }else{ //代表上滑
            overflowDivHeight = screenHeight - 44 - 50 - 26;
              //屏幕宽度 - 距离顶部的距离 - 底部导航栏高度 - 拖拽图标的高度
        }
        if (mapDom.length > 0) {
            $('#overflowDiv').css('height', overflowDivHeight + 'px');
        }
    }
    
    //返回上一页
    $scope.goBack = function(){
        // window.history.back();  //返回上一页
        $ionicHistory.clearHistory()
        $ionicHistory.clearCache().then(function() {
            $state.go('tab.trackList', {isAddTrack:true},{cache:true},{reload: true});
        });
    }
    //返回跟踪列表页
    $scope.goBackList = function(){
        $ionicHistory.clearHistory()
        $ionicHistory.clearCache().then(function() {
            $state.go('tab.trackList', {isAddTrack:true},{cache:true},{reload: true});
        });
    }
    //格式化日期 mm-dd (周) 
    //一般用与 etd eta的显示
    $scope.GetTimeDay = function(time) {
        if(time){
            var weekDay = [
                $translate.instant('sjcq_Sun'),
                $translate.instant('sjcq_Mon'), 
                $translate.instant('sjcq_Tue'),
                $translate.instant('sjcq_Wed'), 
                $translate.instant('sjcq_Thu'),
                $translate.instant('sjcq_Fri'), 
                $translate.instant('sjcq_Sat')
            ];
            var time = time.replace(/-/g,'/')
            var geS = $scope.GetProcessTime("mm-dd HH:MM",new Date(time)) //格式化时间
            var b = geS.split(' ')[0]
            var d = geS.split(' ')[1]
            var c = weekDay[new Date(time).getDay()]
            return b + '(' + c + ') '
        }else{
            return '--'
        }
    }

    //格式化日期 mm-dd (周)
    //用与跟踪列表页的当前节点的显示  为空时不显示值
    $scope.GetTime_Day = function(time) {
        if(time){
            var weekDay = [
                $translate.instant('sjcq_Sun'),
                $translate.instant('sjcq_Mon'), 
                $translate.instant('sjcq_Tue'),
                $translate.instant('sjcq_Wed'), 
                $translate.instant('sjcq_Thu'),
                $translate.instant('sjcq_Fri'), 
                $translate.instant('sjcq_Sat')
            ];
            var time = time.replace(/-/g,'/')
            var geS = $scope.GetProcessTime("mm-dd HH:MM",new Date(time)) //格式化时间
            var b = geS.split(' ')[0]
            var d = geS.split(' ')[1]
            var c = weekDay[new Date(time).getDay()]
            return b + '(' + c + ') '
        }else{
            return ''
        }
    }

        //格式化日期 mm-dd (周) HH:MM
        //码头信息时间的显示
        $scope.GetDay_Time = function(time) {
            if(time){
                var weekDay = [
                    $translate.instant('sjcq_Sun'),
                    $translate.instant('sjcq_Mon'), 
                    $translate.instant('sjcq_Tue'),
                    $translate.instant('sjcq_Wed'), 
                    $translate.instant('sjcq_Thu'),
                    $translate.instant('sjcq_Fri'), 
                    $translate.instant('sjcq_Sat')
                ];
                var time = time.replace(/-/g,'/')
                var geS = $scope.GetProcessTime("mm-dd HH:MM",new Date(time)) //格式化时间
                var b = geS.split(' ')[0]
                var d = geS.split(' ')[1]
                var c = weekDay[new Date(time).getDay()]
                return b + '(' + c + ') ' + d
            }else{
                return '--'
            }
        }
    
        //格式化日期 mm-dd (周) HH:MM
        //码头信息时间的显示
        $scope.box_Time = function(time,isest,nameCn) {
            if(time){
                var weekDay = [
                    $translate.instant('sjcq_Sun'),
                    $translate.instant('sjcq_Mon'), 
                    $translate.instant('sjcq_Tue'),
                    $translate.instant('sjcq_Wed'), 
                    $translate.instant('sjcq_Thu'),
                    $translate.instant('sjcq_Fri'), 
                    $translate.instant('sjcq_Sat')
                ];
                var time = time.replace(/-/g,'/')
                var geS = $scope.GetProcessTime("mm-dd HH:MM",new Date(time)) //格式化时间
                var b = geS.split(' ')[0]
                var d = geS.split(' ')[1]
                var c = weekDay[new Date(time).getDay()]
                return b + '(' + c + ') ' + d
            }else{
                if(isest == 'N' || isest == true){
                    return 'Y'
                }else{
                    return ''
                }
            }
        }

    //格式化日期  YY-mm-dd HH:MM
    $scope.GetProcessTime= function(fmt, date) {
        let ret;
        let opt = {
            "Y+": date.getFullYear().toString(),        // 年
            "m+": (date.getMonth() + 1).toString(),     // 月
            "d+": date.getDate().toString(),            // 日
            "H+": date.getHours().toString(),           // 时
            "M+": date.getMinutes().toString(),         // 分
            "S+": date.getSeconds().toString()          // 秒
            // 有其他格式化字符需求可以继续添加，必须转化成字符串
        };
        for (let k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
                fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
            };
        };
        return fmt;
    }
        //当前节点索引顺序
        $scope.getCurrentIndex = function(data){
            let weekList = {
                'BKCF': 1,
                'EPRL': 2,
                'STSP': 3, //
                'FCGI': 4,
                'CGGI': 5,
                'CLOD': 6,
                'CYTC': 7,
                'GITM': 8,
                'CUIP': 8.5,
                'PASS': 9, //
                'TMPS': 10,
                'HAISHI': 10.2,
                'PRLD': 10.5,
                'LOBD': 11,
                'DLPT': 12,
                'TSBA': 13, //
                'TSDC': 14,
                'TSLB': 15,
                'TSDP': 16,
                'BDAR': 17,
                'DSCH': 18,
                'IRLB': 18.1, //
                'IRDP': 18.2,
                'IRAR': 18.3, //
                'IRDS': 18.4, //
                'STCS': 19,
                'RCVE': 20, //
                'SUOT': 21,
                // 'CUIP':'22',
            };
            if(weekList[data]){
                return weekList[data];
            }else{
                return '0';
            };
        }
        //当前节点中文
        $scope.getCurrentNode = function(data){
            let weekList = {
                'BKCF': 'Booking',
                'EPRL': 'DropBox',
                'STSP': 'EmptyBox',
                'FCGI': 'Return',
                'CGGI': 'Restock',
                'CLOD': 'Boxing',
                'CYTC': 'SetPort',
                'GITM': 'IntoPort',
                'PASS': 'CustomsRelease',
                'TMPS': 'TerminalRelease',
                'HAISHI': 'MaritimeTelease',
                'PRLD': 'Withload',
                'LOBD': 'GetBoard',
                'DLPT': 'Departure',
                'TSDP': 'Sailing',
                'TSLB': 'Shipment',
                'TSBA': 'Arrivals',
                'TSDC': 'Discharged',
                'BDAR': 'Arrival',
                'DSCH': 'Unloading',
                'IRLB': 'RailwayBoxing', // 铁运装箱
                'IRDP': 'RailwayDeparture', // 铁运发车
                'IRAR': 'arrivals', // 铁运到站
                'IRDS': 'arrivals', // 铁运卸箱
                'STCS': 'PickUp',
                'RCVE': 'StillEmpty',
                'SUOT': 'Exit',
                'CUIP': 'Check', //查验
            }
        }
        //获取到的节点排序
        $scope.compare = function(property){
            return function(a,b){
                var value1 = a[property];
                var value2 = b[property];
                return value2 - value1;
            }
        }
        //得出传入的两个数组的不同
        $scope.getArrDifference = function(arr1, arr2) {
            let result = []
            for (var i = 0; i < arr1.length; i++) {
                var num = arr1[i]
                var flag = false;
                for (var j = 0; j < arr2.length; j++) {
                    var n = arr2[j].statuscd
                        if (n == num) {
                            flag = true;
                            break
                        }
                }
                if (!flag) {
                    result.push(num)
                }
            }
            return result
        }
        
    /*************************************************地图开始****************************************************** */
        //当前开始调用地图方法
        $scope.GetDTInit = function(val) {
            $scope.execute = []  //实际路径 历史接口 预计要走的
            $scope.history = [] //历史路径 历史接口 已经走过的
            $scope.ports = [] //历史挂港 通过船的MMIS号得到船航行的历史挂靠港信息
            $scope.ships = {} //船舶信息
            $scope.direction = 0 //初始经纬度
            $scope.center = [1.292088, 21.495623]; //默认
            $scope.isShowShip = false
            var that = this
            $scope.val = val
            if (val && val.mmsi) {
                that.getVesselDetailByMMSI(val.mmsi).then((vesselDetailRes) => {
                    let vesselDetailResArray = vesselDetailRes[0];
                    $scope.ships = vesselDetailResArray;
                    $scope.qiLat = []; //起始港坐标
                    $scope.muLat = []; //目的港坐标
                    $scope.cLat = []; //船的坐标
                    if (val.pol.lat && val.pol.lon) {//起始港坐标
                        //判断起始港坐标是否反方向环绕地球航线
                        var lons = val.pol.lon
                        let hlimit = Math.abs( val.pol.lat - val.pol.lon) > 180
                        if (hlimit) {
                            $scope.direction = lons < 0 ? 1 : -1;
                        }
                        $scope.qiLat = [val.pol.lat,  $scope.getLon(val.pol.lon)];
                    }
                    if (val.pod.lat && val.pod.lon) {//目的港坐标
                        //判断目的港坐标是否反方向环绕地球航线
                        var lonss = val.pod.lon
                        let hlimit = Math.abs( val.pod.lat - val.pod.lon) > 180
                        if (hlimit) {
                            $scope.direction = lonss < 0 ? 1 : -1;
                        }
                        $scope.muLat = [val.pod.lat,  $scope.getLon(val.pod.lon)];
                    }
                    
                    //判断船坐标是否反方向环绕地球航线
                    //判断有船坐标
                    if(vesselDetailResArray.lat && vesselDetailResArray.lon){
                        var lon = vesselDetailResArray.lon / 1000000.0
                        let hlimit = Math.abs( vesselDetailResArray.lat / 1000000.0 - vesselDetailResArray.lon / 1000000.0) > 180
                        if (hlimit) {
                            $scope.direction = lon < 0 ? 1 : -1;
                        }
                        $scope.cLat = $scope.ships.latlng = [(vesselDetailResArray.lat / 1000000.0), $scope.getLon((vesselDetailResArray.lon / 1000000.0))];
                    }
                })
                //得到挂港列表和往返一次同一港口的周期
                that.getPorts(val.mmsi, val.pol).then((portsRes) => {
                    //得到并更新历史跟踪路径
                    that.getTracePaths(val.mmsi,val.polTime,val.podTime,val.during,val.isEntre).then((pathsRes) => {

                        $scope.history = {
                            latlngs: [],
                            color: "#072c4c"
                        };
                        $scope.execute = {
                            latlngs: [],
                            color: "#072c4c"
                        };
                        let h = []
                        for (var point in pathsRes.history) {

                            let lon = pathsRes.history[point].lon / 1000000.0
                            let lat = pathsRes.history[point].lat / 1000000.0
                                //判断是否反方向环绕地球航线
                            let hlimit = point > 1 && Math.abs(pathsRes.history[point - 1].lon / 1000000.0 - pathsRes.history[point].lon / 1000000.0) > (180);
                            if (hlimit) {
                                $scope.direction = lon < 0 ? 1 : -1
                            }
                            h.push([lat, $scope.getLon(lon)])
                        }
                        $scope.history.latlngs = $scope.sliceLine(h);
                        let h2 = []
                        for (var point in pathsRes.execute) {

                            let lon = pathsRes.execute[point].lon / 1000000.0
                            let lat = pathsRes.execute[point].lat / 1000000.0
                                //判断是否反方向环绕地球航线
                            let limit = point > 1 && Math.abs(pathsRes.execute[point - 1].lon / 1000000.0 - pathsRes.execute[point].lon / 1000000.0) > (180);
                            if (limit) {
                                $scope.direction = lon < 0 ? 1 : -1
                            }
                            h2.push([lat, $scope.getLon(lon)])

                        }
                        $scope.execute.latlngs = $scope.sliceLine(h2);
                        if (pathsRes.history.length + pathsRes.execute.length == 0) {
                            // $scope.history.latlngs.push([val.pol.lat, val.pol.lon])
                            // $scope.history.latlngs.push([val.pod.lat, val.pod.lon])
                        }

                        $scope.ports = portsRes.ports
                        // $scope.ships.latlng = [($scope.ships.lat / 1000000.0), $scope.getLon(this.ships.lon / 1000000.0)];
                        $scope.mapDetail(true)
                    });
                })
            }else{
                $scope.mapDetail(false)
            }
        }
        /*****************************是否渲染地图*********** */
    
        $scope.mapDetail = function(val){
            if(val){ //说明有地图信息 掉MapInit
                $scope.MapInit($scope.val)
            }else{ //创建个地图示例放在页面上
                var map = L.map('map_track').setView($scope.center, 2);
                L.tileLayer(mapUrl, {
                    foo: 'bar',
                    attribution: '© <a href="http://osm.org/copyright">OpenStreetMap</a> Haut-Gis-Org',
                    zoom: 5, //地图缩放大小
                    center: L.latLng($scope.center),
                    id: 'mapbox.streets'
                }).addTo(map);
            }
        }
    
    
        /*****************************调用接口*********** */
    
        //通过船名得到船的MMSI号（如果多个取一个）
        $scope.getMMSIByVesselName = function(kw) {
            return new Promise(
                (resolve, reject) => {
                    $.ajax({
                        type: "GET",
                        url: baseUrl + '/schedules/dragon/queryShip',
                        async: false,
                        headers:{ 'Authorization': $scope.authorization },
                        data: {
                            kw: kw,
                            max: 3
                        }
                    }).then(res => {
                        if (res.data && res.status == 0) {
                            resolve(res.data);
                        } else {
                            reject(res.data);
                        }
                    }).catch(err => {
                        reject(err)
                    })
                }
            )
        }
    
        //通过船的MMIS号得到船的详细信息
        $scope.getVesselDetailByMMSI = function(mmsi) {
            return new Promise(
                (resolve, reject) => {
                    $.ajax({
                        type: "GET",
                        url: baseUrl + '/schedules/dragon/getSingleVesselShip',
                        async: false,
                        headers:{ 'Authorization': $scope.authorization },
                        data: {
                            id: mmsi
                        }
                    }).then(res => {
                        if (res.data && res.status == 0) {
                            resolve(res.data);
                        } else {
                            reject(res.data);
                        }
                    })
                }
            )
        }
        //通过船的MMIS号得到船航行的历史路径
        $scope.getTracePaths = function(mmsi, polTime, podTime,during,isEntre) {
            //mmsi  起始港时间  目的港时间  60天  是否中转 
            return new Promise((resolve, reject) => {
                var etd //起始港时间
                var eta //目的港时间时间
                // 时间取值规则
                // 当前时间小于起始港ETD是，路径为（当前时间-2天） 到当前时间的路径。
                // 当前时间在起始港ETD和目的港ETA间，路径为起始港ETD到当前时间。
                // 当前时间大于目的港ETA，路径为起始港MIN（ETD，当前时间-60）到目的港ETA；不显示船。
                // 目的港ETA在当前时间前60天路径信息；不显示船。
                let promises = [];
                let now = new Date().getTime();
                //每个周期时间差
                // //根据当前时间得到开始，中间，结束
                // let end = now - etd > 0 ? now : (now - eta < 0 ? now - 0 : etd);
                // let mid =  now - etd > 0 ? etd : (now - eta  < 0 ? (eta - 0 - during): eta);
                // let start =  now - etd > 0 ? eta : (now - eta < 0 ? (eta - 0 - 2 * during): (eta - during));
                
    
                if(isEntre == '0'){ //直达
                //有起始港时间
                if(polTime){ //起始港时间
                    etd = polTime
                    eta = podTime ? podTime : (polTime + during)
                }else{
                    // if(podTime){ //有目的港时间 无起始港时间
                    //   etd = podTime - during
                    //   eta = podTime
                    // }
                    // return
                }
                }else{ //代表中转
                    if(polTime){ //起始港时间
                        etd = polTime
                        eta = polTime + during
                    }else{
                        // return
                    }
                }
                //比较当前时间-60 和 etd哪个时间小
                let a = new Date().getTime() - 30 * 1000 * 3600 * 24; //当前时间-30
                let minEtd = a - etd > 0 ? etd : etd;
                //根据当前时间得到开始，中间，结束
                let mid, start, end;
                mid = start = now - eta > 0 ? minEtd : now - etd < 0 ? (now - (2 * 1000 * 3600 * 24)) : etd;
                end = now - eta > 0 ? eta : now - etd < 0 ? now : now;
                //判断是否要显示船 当前时间大于目的港不显示船
                if(now - eta > 0){
                    $scope.isShowShip = false
                }else{
                    $scope.isShowShip = true
                }
    
                let days = Math.round((end - start) / (1000 * 3600 * 24));
                //每次取两天的数据避免接口返回（continue == 1）
                for (var i = 0; i < days; i = i + 2) {
                    var p = Math.round(end / 1000) - 3600 * 24 * (i + 2)
                    if( i + 2 > days){
                        p = start ? (start / 1000) : (Math.round(end / 1000) - 3600 * 24 * (i + 2))
                    }
                    var mathData = Math.round(end / 1000) - 3600 * 24 * i;
                    var url = baseUrl + '/schedules/dragon/getShipVesselTrack?'+'id=' + mmsi + '&btm=' + p + '&etm=' + mathData

                    promises.push(
                        fetch(url, {
                            method:'GET',
                            headers: { 'Authorization': $scope.authorization },
                            }).then((res)=>res.json())
                            // .then(function(response){
                            //     promises.push(response);
                            // }).catch(function(ex){
                            //     console.log(ex)
                        // })
                    )
                } 
                Promise.all(
                    promises
                ).then(
                    (res) => {
                        if (res.length > 0) {
                            if (res[0].status == 0) {
                                //处理历史轨迹
                                let all = []
    
                                //每两天取4个样点
                                for (let r in res) {
                                    if (res[r].points) {
                                        all.push(res[r].points[0]);
                                        all.push(res[r].points[Math.round(res[r].points.length / 4)])
                                        if(res[r].points.length > 1){ //数组如果只有一个 按照算法 数组[1]就是undefined
                                            all.push(res[r].points[Math.round(res[r].points.length / 2)])
                                          }
                                        all.push(res[r].points[res[r].points.length - 1])
                                    }
                                }
    
                                //排序所有样点
                                all = all.sort((p, c) => { return p.utc - c.utc })
                                    //按中间时间分割样点为历史路径和执行路径
                                resolve({
                                    // history: all.slice(0, Math.round((mid - start) / (1000 * 3600 * 24)) * 2),
                                    // execute: all.slice(Math.round((mid - start) / (1000 * 3600 * 24)) * 2, all.length - 1),
    
                                    history: all.slice(0, Math.round((mid - start) / (1000 * 3600 * 24)) * 2),
                                    execute: all.slice(Math.round((mid - start) / (1000 * 3600 * 24)) * 2, all.length)
                                })
                            } else {
                                //无任何历史轨迹数据
                                resolve({
                                    history: [],
                                    execute: []
                                })
                            }
                        } else {
                            //无任何历史轨迹数据
                            resolve({
                                history: [],
                                execute: []
                            })
                        }
                    }
                ).catch(err => {
                    reject(err)
                })
    
            })
        }
    
        //通过船的MMIS号得到船航行的历史挂靠港信息
        $scope.getPorts = function(mmsi, pol) {
            //默认历史数据的开始时间为60天前
            return new Promise(
                (resolve, reject) => {
                    // $.ajax({
                    //     type: "GET",
                    //     url: baseUrl + '/schedules/dragon/getPortOfCallByShip',
                    //     async: false,
                    //     headers:{ 'Authorization': $scope.authorization },
                    //     data: {
                    //         mmsi: mmsi,
                    //         begin: Math.round(new Date() / 1000) - 3600 * 24 * 0,
                    //         end: Math.round(new Date() / 1000)
                    //     }
                    // }).then(res => {
                    //     let result = []
                    //     if (res) {
                    //         if (res.status == 0) {
    
                    //             //排序
                    //             let all = res.records.sort((p, c) => { return p.ata - c.ata })
                    //                 //排重
                    //             let hash = {}
                    //             let days = 0
    
                    //             all.forEach((r) => {
                    //                     if (!hash[r.portname_en]) {
                    //                         hash[r.portname_en] = r
                    //                     } else {
                    //                         //两次经过同一港口的间隔天数
                    //                         if (days == 0 && r.countrycode == 'CN') {
                    //                             days = Math.round((new Date(hash[r.portname_en].ata.replace(/\-/g, '/')) - new Date(r.atd.replace(/\-/g, '/'))) / (1000 * 3600 * 24))
                    //                         }
                    //                         //  console.log(days)
                    //                     }
                    //                 })
                    //                 //取经纬度         
                    //             Object.keys(hash).map(p => {
                    //                 if (hash[p].portcode) {
                    //                     $.ajax({
                    //                         type: "get",
                    //                         url: baseUrl + '/schedules/dragon/getPortLocation',
                    //                         async: false,
                    //                         headers:{ 'Authorization': $scope.authorization },
                    //                         data: {
                    //                             portCode: hash[p].portcode.toLowerCase(),
                    //                         },                    
                    //                         success: function(result) {},
                    //                         error: function(xhr, textStatus, errorThrown) {}
                    //                     }).then(c => {
                    //                         if (c.content && c.content.LON) {
                    //                             hash[p].lon = c.content.LON;
                    //                             hash[p].lat = c.content.LAT;
                    //                             //取到经纬度的挂港返回
                    //                             result.push(hash[p])
                    //                         }
                    //                     })
                    //                 }
                    //             })
                    //             resolve({ ports: result, during: days })
                    //         } else {
                    //             resolve({ ports: result, during: 0 })
                    //         }
    
                    //     } else {
                    //         reject({ ports: result, during: 0 })
                    //     }
                    // }).catch(err => {
                    //     reject(err)
                    // })
                    resolve({ ports: [], during: 0 })
                }
            )
            return [];
        }
    
        $scope.getLon = function(lon) {
            if (Math.abs(this.direction + lon) < Math.abs(lon)) {
                return this.direction > 0 ? 360 + lon : -360 + lon
            }
            return lon;
        }
    
        $scope.sliceLine = function(h) {
            let sliceIndex = -1
            for (var point in h) {
                if (point > 1 && Math.abs(h[point - 1][1] - h[point][1]) > (180)) {
                    sliceIndex = point
                }
            }
            if (sliceIndex > 0) {
                let h2 = h.slice(sliceIndex * 1, h.length - 1)
                let h1 = h.slice(0, sliceIndex);
                return h2.concat(h1)
    
            }
            return h;
        }
    
        $scope.openPopup = function(target) {
            target.openPopup()
        }
    
        $scope.polyLineReady = function() {
    
        }
    
        $scope.getAnchor = function(point1, point2) {
            return Math.round(Math.atan((point2.lat - point1.lat) / (point2.lon - point1.lon)))
        }
    
        $scope.create = function() {
    
        }
    
        $scope.mounted = function() {
    
        }
        
        $scope.shipStatus = function(value) {
    
            let status = ["在航", "锚泊", "失控", "操作受限", "吃水受限", "靠泊", "搁浅", "捕鱼", "船帆动力",
                "保留", "保留", "保留", "保留", "保留", "AIS-SART", "未定义"
            ]
            return status[value];
    
        }
    
        /******************************调用接口********** */
    
        //*********************************************地图开始*************************************************** */
        //绘制地图
        $scope.MapInit = function(value) {
            try {
                $scope.val = value
                $scope.val = value
                //初始化 地图
                var map = L.map('map_track').setView($scope.center, 2)
                L.tileLayer(mapUrl, {
                    foo: 'bar',
                    attribution: '© <a href="http://osm.org/copyright">OpenStreetMap</a> Haut-Gis-Org',
                    zoom: 5, //地图缩放大小
                    id: 'mapbox.streets'
                }).addTo(map)
                $scope.latlngs = []
                if($scope.qiLat.length > 0){
                    $scope.latlngs.push($scope.qiLat)
                }
                if($scope.cLat.length > 0 && $scope.isShowShip){
                    $scope.latlngs.push($scope.cLat)
                }else{
                    if($scope.muLat.length > 0){
                        $scope.latlngs.push($scope.muLat)
                    }
                }
                if($scope.latlngs.length == 2){ //代表两个坐标都有
                    var polyline = L.polyline($scope.latlngs,{color: 'transparent'}).addTo(map);
                    map.fitBounds(polyline.getBounds());
                }else if($scope.latlngs.length == 1){ //说明有1个坐标 让那个坐标为中心

                }
            //实际路径
                var executeList = $scope.execute.latlngs == undefined ? [] : $scope.execute.latlngs;
                if (executeList.length > 0) {
                    //map.fitBounds(executeList);
                    new L.polyline(executeList, {
                        color: '#072c4c'
                    }).addTo(map); //线条颜色
                }
                //历史路径
                var historyList = $scope.history.latlngs == undefined ? [] : $scope.history.latlngs;
                if (historyList.length > 0) {
                    L.polylineDecorator(historyList, {
                        patterns: [{
                                offset: 12,
                                repeat: 200,
                                symbol: L.Symbol.arrowHead({
                                    pixelSize: 8,
                                    polygon: true,
                                    pathOptions: {
                                        stroke: true,
                                        weight: 2,
                                        color: '#072c4c'
                                    }
                                }),
                            },
                            {
                                offset: 0,
                                repeat: 16,
                                symbol: L.Symbol.dash({ pixelSize: 8, pathOptions: { color: '#072c4c' } })
                            }
                        ]
                    }).addTo(map); //线条颜色
                }

                /****************坐标样式**********************************************************/
                    //当前船样式
                    var shipicon = L.icon({
                        iconUrl: '../img/chuan.png',
                        iconSize: [28, 28],
                        iconAnchor: [16, 16],
                        className: "ship",
                    });

                    //起始坐标点样式
                    var policon = L.icon({
                        iconUrl: '../img/qishi.png',
                        iconSize: [24, 35],
                        iconAnchor: [16, 16]
                        });

                    //目的坐标点样式
                    var podicon = L.icon({
                        iconUrl: '../img/mudi.png',
                        iconSize: [24, 35],
                        iconAnchor: [16, 16]
                    });

                    //中转坐标点样式
                    // var zhongicon = L.icon({
                    //     iconUrl: require("./images/guakao.png"),
                    //     iconSize: [16, 16],
                    //     iconAnchor: [8, 16]
                    //   }),


                /****************坐标样式*************************************************************/
                //当前船点击事件
                if($scope.isShowShip){
                    var group = L.layerGroup().addTo(map)
                    var marker = L.marker($scope.ships.latlng, {
                        icon: shipicon,
                    }).addTo(group).bindPopup("<div class='whiteP'><div class='titleHe'>" + $scope.ships.name + '【' + ($scope.shipStatus($scope.ships.navistat)) + '】'+"</div>" + "<div class='textTop'>MMSI：" + $scope.val.mmsi + "</div>" + "<div class='textTop'>更新： " + ($filter('formatTimer')($scope.ships.lasttime * 1000)) + "</div>" + "<img src='../img/jian.png' class='images' /></div>").openPopup();
                }

                //起始港点击事件
                if ($scope.val.pol.lat) {
                    var markerPol = L.marker([$scope.val.pol.lat, $scope.getLon($scope.val.pol.lon)], { icon: policon }).addTo(map);
                    var popupPol = L.popup();
                    markerPol.on('click', function(e) {
                        var content = "<div class='PolPod'><div class='polPodHe'>" + $scope.val.pol.name + "<span class='tesBox'>放X</span></div></div>";
                        popupPol.setContent(content); //点击事件显示提示内容
                    })
                    markerPol.bindPopup(popupPol);
                    markerPol.addTo(map);
                }

                //目的港点击事件
                if ($scope.val.pod.lat) {
                    var markerPod = L.marker([$scope.val.pod.lat, $scope.getLon($scope.val.pod.lon)], { icon: podicon }).addTo(map);
                    var popupPod = L.popup();
                    markerPod.on('click', function(e) {
                        var content = "<div class='PolPod'><div class='titleHe'>" + $scope.val.pod.name + "<span class='tesBox'>放X</span></div></div>";
                        popupPod.setContent(content); //点击事件显示提示内容
                    })
                    markerPod.bindPopup(popupPod);
                    markerPod.addTo(map);
                }
                //挂港信息
                //console.log('挂港' + $scope.ports);
                // $scope.ports = [
                //     { lat: 38.92, lon: 121.62, portname_en: '大连', ata: '2020-08-08', atd: '2020-09-09' },
                //     { lat: 36.07, lon: 120.38, portname_en: '青岛', ata: '2020-08-08', atd: '2020-09-09' },
                //     { lat: 29.88, lon: 121.55, portname_en: '宁波', ata: '2020-08-08', atd: '2020-09-09' }
                // ]
                var group = L.layerGroup().addTo(map)
                for (let i = 0; i < $scope.ports.length; i++) {
                    var lat = $scope.ports[i].lat;
                    var lon = $scope.ports[i].lon;
                    var portname_en = $scope.ports[i].portname_en;
                    var ata = $scope.ports[i].ata;
                    var atd = $scope.ports[i].atd;
                    //挂靠坐标点样式
                    var guakaoicon = L.icon({
                        iconUrl: '../img/guakao.png',
                        iconSize: [12, 12],
                        iconAnchor: [8, 16]
                    });
                    var marker = L.marker([lat, lon], {
                        icon: guakaoicon,

                    }).addTo(group).bindPopup("<div class='PolPod'><div class='polPodHe'>" + portname_en + "<span class='tesBox'>放X</span></div></div>");
                }
            } catch (error) {
                console.log(error);
            }
        }        

    /*************************************************地图结束****************************************************** */
});
app.filter("currentNode", function($filter, $translate) {
    return function(input) {
        if (input == 'BKCF') {
            return $translate.instant('gzzt_dc');//订舱

        }
        if (input == 'EPRL') {
            return $translate.instant('gzzt_fx');//放箱

        }
        if (input == 'STSP') {
            return $translate.instant('gzzt_tkx');//提空箱

        }
        if (input == 'FCGI') {
            return $translate.instant('gzzt_fc');//返场

        }
        if (input == 'CGGI') {
            return $translate.instant('gzzt_rh');//入货
        }
        if (input == 'CLOD') {
            return $translate.instant('gzzt_fx_clod');//装箱
        }
        if (input == 'CYTC') {
            return $translate.instant('gzzt_jg');//集港
        }
        if (input == 'GITM') {
            return $translate.instant('gzzt_jc');//进港
        }
        if (input == 'PASS') {
            return $translate.instant('gzzt_hgfx');//海放
        }
        if (input == 'TMPS') {
            return $translate.instant('gzzt_mtfx');//码放
        }
        if (input == 'HAISHI') {
            return $translate.instant('gzjd_hasi');//海事
        }
        if (input == 'PRLD') {
            return $translate.instant('gzjd_xq_pz');//配载
        }
        if (input == 'LOBD') {
            return $translate.instant('gzzt_zc');//装船
        }
        if (input == 'DLPT') {
            return $translate.instant('gzzt_lg');//离港
        }
        if (input == 'TSDP') {
            return $translate.instant('gzzt_zzkh');//中转开航
        }
        if (input == 'TSLB') {
            return $translate.instant('gzzt_zzzc');//中转装船
        }
        if (input == 'TSBA') {
            return $translate.instant('gzzt_zzdg');//中转抵港
        }
        if (input == 'TSDC') {
            return $translate.instant('gzzt_zzxc');//中转卸船
        }
        if (input == 'BDAR') {
            return $translate.instant('gzzt_dg'); //到港
        }
        if (input == 'DSCH') {
            return $translate.instant('gzzt_xc');//卸船
        }
        if (input == 'STCS') {
            return $translate.instant('gzzt_tgh');//提货
        }
        if (input == 'IRAR') {
            return $translate.instant('gzjd_xq_dd');//到达
        }
        if (input == 'RCVE') {
            return $translate.instant('gzzt_hk');//还空
        }
        if (input == 'SUOT') {
            return $translate.instant('gzzt_tg');//退关
        }
        if (input == 'CUIP') {
            return $translate.instant('gzzt_cy');//检查
        }
        if (input == 'IRLB' || input == 'IRDP' || input == 'IRAR' || input == 'IRDS') { //铁路运输
            return $translate.instant('sjgz_tl');
        }

        if (input == 'POLA') {
            return $translate.instant('gzzt_ddqyg'); //到达起运港
        }
        if (input == 'POLP') {
            return $translate.instant('gzzt_jhlg'); //计划离港
        }
        if (input == 'TSIN') {
            return $translate.instant('gzzt_ysz'); //运输中
        }
        if (input == 'PODA') {
            return $translate.instant('gzzt_ddmdd'); //到达目的地
        }
        if (input == 'TSAR') {
            return $translate.instant('gzzt_ddzzg'); //到达中转港
        } else {
            return "";
        }
    };
});

app.filter("Time", function($filter) {
    return function(input, forma) {
        if (input == undefined || input == null || input == "") {
            return "";
        } else {
            input=input.replace(/\-/g, '/');
            return $filter('date')(new Date(input), forma);
        }
    }
});
app.filter('unique', function() {
    return function(collection, keyname, tj) {
        var output = [],
            keys = [];
        angular.forEach(collection, function(item) {
            var key = item[keyname];
            if (keys.indexOf(key) === -1 && item[tj] == "N") {
                keys.push(key);
                output.push(item);
            }
        });
        return output;
    };
});


//每个箱子的状态
app.filter("currentNode_detail", function($filter, $translate) {
    return function(input) {       
        if (input == 'BKCF') {
            return $translate.instant('gzjd_xq_dc');//订舱
        }   
        if (input == 'EPRL') {
            return $translate.instant('gzjd_xq_fx');//放箱
        }
        if (input == 'STSP') {
            return $translate.instant('gzjd_xq_tkx');//提空箱
        }
        if (input == 'FCGI') {
            return $translate.instant('gzjd_xq_fc');//返场
        }
        if (input == 'CGGI') {
            return $translate.instant('gzjd_xq_rh');//入货
        }
        if (input == 'CLOD') {
            return $translate.instant('gzjd_xq_zx');//装箱
        }
        if (input == 'CYTC') {
            return $translate.instant('gzjd_xq_jg');//集港
        }
        if (input == 'GITM') {
            return $translate.instant('gzjd_xq_jingang');//进港
        }
        if (input == 'PASS') {
            return $translate.instant('gzjd_xq_hf');//海放
        }
        if (input == 'TMPS') {
            return $translate.instant('gzjd_xq_mf');//码放
        }
        if (input == 'HAISHI') {
            return $translate.instant('gzjd_hasi');//海事
        }
        if (input == 'PRLD') {
            return $translate.instant('gzjd_xq_pz');//配载
        }
        if (input == 'LOBD') {
            return $translate.instant('gzjd_xq_zc');//装船
        }
        if (input == 'DLPT') {
            return $translate.instant('gzjd_xq_lg');//离港
        }
        if (input == 'TSDP') {
            return $translate.instant('gzjd_xq_zzkh');//中转开航
        }
        if (input == 'TSLB') {
            return $translate.instant('gzjd_xq_zzzc');//中转装船
        }
        if (input == 'TSBA') {
            return $translate.instant('gzjd_xq_zzdg');//中转抵港
        }
        if (input == 'TSDC') {
            return $translate.instant('gzjd_xq_zzxc');//中转卸船
        }
        if (input == 'BDAR') {
            return $translate.instant('gzzt_dg'); //到港
        }
        if (input == 'DSCH') {
            return $translate.instant('gzzt_xc'); //卸船
        }
        if (input == 'STCS') {
            return $translate.instant('gzjd_xq_th');//提货
        }
        if (input == 'IRAR') {
            return $translate.instant('gzjd_xq_dd');//到达
        }

        if (input == 'RCVE') {
            return $translate.instant('gzjd_xq_hc');//还空
        }
        if (input == 'SUOT') {
            return $translate.instant('gzjd_xq_tg');//退关
        }

        if (input == 'IRLB') { //铁运装箱
            return $translate.instant('sjgz_tl_Boxing');
        }
        if (input == 'IRDP') { //铁运发车
            return $translate.instant('sjgz_tl_Departure');
        }
        if (input == 'IRDS') { //铁运卸箱
            return $translate.instant('sjgz_tl_unloadBox');
        }
        if (input == 'IRAR') { //铁运到站
            return $translate.instant('sjgz_tl_arrivals');
        }
       
    };
});