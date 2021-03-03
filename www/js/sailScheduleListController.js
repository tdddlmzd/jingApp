app.controller('sailScheduleListController', function($scope, $ionicHistory, $ionicScrollDelegate, $http, $resource, $filter, $stateParams, $rootScope, $state, $ionicTabsDelegate, $translate, $ionicLoading, Popup, Popup2, locals) {

    //刷新页面语言不变
    var lan = locals.get('lang');
    if (lan == "zh-cn") {
        $translate.use('zh');

    } else if (lan == "us-en") {
        $translate.use('en');
    }
    $scope.lan = locals.get('lang') == undefined ? "zh-cn" : locals.get('lang');
    $scope.ETDValue = "ETD:";
    //监听页面动作
    $rootScope.$on('$ionicView.beforeEnter', function() {
        var statename = $state.current.name;
        if (statename === 'tab.sailScheduleDetail' || statename === 'tab.sailScheduleList') {
            $scope.isShow = false;
            $ionicTabsDelegate.showBar(false); //当前页面隐藏tab
        } else {
            $ionicTabsDelegate.showBar(true);
        }
    })
    //接到参数
    $scope.startId = $stateParams.startId; //起始港ID
    $scope.endId = $stateParams.endId; //目的港ID
    $scope.dateType = $stateParams.dateType; //离港到港1或2
    $scope.Time = $stateParams.Time; //时间
    $scope.userType = $stateParams.userType; //用户类型0登录用户1游客
    $scope.userId = $stateParams.userId; //用户ID
    $scope.userIp = $stateParams.userIp; //用户IP

    //定义全局变量
    $scope.model = {};
    $scope.directLength = 0; //中转
    $scope.transitLength = 0; //中转
    
    $scope.startTime = ''
    //标题赋值
    $scope.model.title = $stateParams.title;

    $scope.searchTime = ''
    //语言
    //$translate.use('en');

    //船期列表页初始化
    $scope.init = function() {
        $scope.TimeTypeClick(1, $scope.Time); //日期tab页，并且加载数据
        $scope.sailTypeClick(1); //直达或中转tab页
    }

    /**
     * 获取数据
     * TimeType  日期tab栏类别
     */
    $scope.GetList = function(startTime, endTime) {
        try {
            //加载动画显示
            $ionicLoading.show({
                template: $translate.instant('sjcq_jzz')
            });
            $scope.searchTime = $scope.GetProcessTime("YY-mm-dd",new Date())
            //因为ios不支持 -日期
            $scope.startTime = startTime
            startTime = startTime.replace(/\//g, "-");
            endTime = endTime.replace(/\//g, "-");
            //请求后台数据
            var authorization = getTokenInfor()
            var apiUrl_GetTest = baseUrl + "/schedules/web/schedule?polCode=" + $scope.startId + '&podCode=' + $scope.endId + "&searchTime=" + $scope.searchTime + "&recordType=1" + '&dateType=' + $scope.dateType + '&startTime=' + startTime + '&endTime=' + endTime + '&userType=' + $scope.userType + '&userId=' + $scope.userId + '&userIp=' + $scope.userIp;
            $http.get(apiUrl_GetTest, {
                headers: { 'Authorization': authorization},
                timeout: timeOut
            }).success(function(data) {
                if (data.status == 6) { //说明未登录最多查询3次，请登录
                    if (!$scope.isShow) {
                        Popup2.showAlert($translate.instant('sjcq_ykcx'), "/#/tab/login");
                        $scope.isShow = true;
                    }
                    $ionicLoading.hide(); //加载动画隐藏
                } else if (data.status == 1) {
                    $scope.direct = []; //直达
                    $scope.transit = []; //中转

                    //中转和直达 按照  etdWeek 1-7来排  从小到大
                    if(data.content.direct.length > 0){
                        $scope.direct = data.content.direct.sort($scope.sortArry('etdWeek'))
                    }
                    if(data.content.transit.length > 0){
                        $scope.transit = data.content.transit.sort($scope.sortArry('etdWeek'))
                    }
                    $scope.directLength = 0;
                    for (var index = 0; index < data.content.direct.length; index++) {
                        $scope.directLength = $scope.directLength + data.content.direct[index].sameRoute.length;
                    }
                    $scope.transitLength = data.content.transit.length; //中转
                    $ionicLoading.hide(); //加载动画隐藏
                } else {
                    $scope.direct = data.content.direct; //直达
                    $scope.transit = data.content.transit; //中转
                    $scope.directLength = 0; //中转
                    $scope.transitLength = 0; //中转
                    $ionicLoading.hide(); //加载动画隐藏
                }
            }).error(function(result) {
                $ionicLoading.hide(); //加载动画隐藏
                Popup.showAlert($translate.instant('ts_qjcwl'));
            });
        } catch (error) {
            $ionicLoading.hide(); //加载动画隐藏
            Popup.showAlert($translate.instant('ts_qjcwl'));　　
        }
    }


    //根据数据对象的某个属性进行排序  从小到大排
    $scope.sortArry = function(property){
        return function(a,b){
            var value1 = a[property];
            var value2 = b[property];
            return value1 - value2;
        }
    }
    $scope.goBack = function() {
        // location.href = "#/tab/sailSchedule/"
        $ionicHistory.clearHistory()
        $ionicHistory.clearCache().then(function() {
            $state.go('tab.sailSchedule', {cache:true},{reload: true})
        })
}


    /**
     * 日期点击事件
     */
    $scope.TimeTypeClick = function(TimeType, TimeValue) {
        $ionicScrollDelegate.$getByHandle('myscroll').scrollTop([true])
        let now = new Date()
        var nowWeek = now.getDay() == 0 ? 7 : now.getDay()
        var zhouri = 7 - nowWeek //当前时间距离周日相差几天+
        now = now.setDate(now.getDate() + zhouri)
        var NowZhouriString = $filter("date")(now, "yyyy/MM/dd") //当前时间周日时间
        if (TimeValue != "") {
            var startTime = ""
            var endTime = ""

            //传过来的时间减去当前时间的周日，除7算出是第几周
            var TimeValue = new Date(TimeValue)
            var a1 = Date.parse(new Date(TimeValue))
            var a2 = Date.parse(new Date(NowZhouriString))
            var day = parseInt((a1 - a2) / (1000 * 60 * 60 * 24)); //核心：时间戳相减，然后除以天数

            if (day <= 0) {
                TimeType = 1
            } else {
                var TimeNum = day / 7
                if (TimeNum <= 1) {
                    TimeType = 2
                } else if (TimeNum > 1 && TimeNum <= 2) {
                    TimeType = 3
                } else {
                    TimeType = 4
                }
            }
        }

        //当前周次选择
        $scope.clickTabIndex = TimeType

        var week = new Date().getDay()
        //本周
        if(TimeType == 1) {
            if(week == 0){
                startTime = $scope.getNewData(NowZhouriString, -6)
                endTime = $scope.getNewData(NowZhouriString, 0)
            }else{
                startTime = $scope.getNewData(NowZhouriString, -6)
                endTime = $scope.getNewData(NowZhouriString, 0)
            }
            $scope.GetList(startTime, endTime)
        //下一周
        } else if (TimeType == 2) {
            if(week == 0){
                startTime = $scope.getNewData(NowZhouriString, 8)
                endTime = $scope.getNewData(NowZhouriString, 14)
            }else{
                startTime = ($scope.getNewData(NowZhouriString, 1))
                endTime = ($scope.getNewData(NowZhouriString, 7))
            }
            $scope.GetList(startTime, endTime)
        //下两周
        } else if (TimeType == 3) {
            if(week == 0){
                startTime = $scope.getNewData(NowZhouriString, 15)
                endTime = $scope.getNewData(NowZhouriString, 21)
            }else{
                startTime = ($scope.getNewData(NowZhouriString, 8))
                endTime = ($scope.getNewData(NowZhouriString, 14))
            }
            $scope.GetList(startTime, endTime)
        //下三周
        }else{
            if(week == 0){
                startTime = $scope.getNewData(NowZhouriString, 22)
                endTime = $scope.getNewData(NowZhouriString, 28)
            }else{
                startTime = ($scope.getNewData(NowZhouriString, 15))
                endTime = ($scope.getNewData(NowZhouriString, 21))
            }
            $scope.GetList(startTime, endTime)
        }
        $scope.GetTab(NowZhouriString) //获取tab显示日期
    }

    /**
     * 直达中转点击事件
     */
    $scope.sailTypeClick = function(sailType) {
        $scope.clicksailIndex = sailType
        //直达
        if (sailType == 1) {
            $scope.model.sailType = true
        } else { //中转
            $scope.model.sailType = false
        }
    }

    /**
     * 详情
     */
    $scope.sailScheduleDetail = function(id, etd, pathId, state, wayType, totalId, data) {
        //如果状态等于0，正常 才可以跳转到详情页
        if (state == 0) {
            var detail = {
                startId : $stateParams.startId, //起始港ID
                endId : $stateParams.endId, //目的港ID
                dateType : $stateParams.dateType, //离港到港1或2
                Time : $stateParams.Time, //时间
                userType : $stateParams.userType, //用户类型0登录用户1游客
                userId : $stateParams.userId, //用户ID
                userIp : $stateParams.userIp, //用户IP
                title : $stateParams.title
            }
            // 处理中转的信息 已传给地图
            var transitMap = []
            if(data.isTransit == "1"){
                if (data.routeCodeList !== null) {
                    for (let i = 0; i < data.routeCodeList.length; i++) {
                        let c = data.routeCodeList[i]
                        if(c.lat && c.lon){ //如果当前中转港有坐标
                        transitMap.push({
                            name:c.entrePort,
                            lat:Number(c.lat),
                            lon:Number(c.lon)
                        })
                        }
                    }
                }
            }
            var eta =  data.eta ? data.eta.replace(/\-/g, '/') : ''
            var etd =  data.etd ? data.etd.replace(/\-/g, '/') : ''
            var mapVal = {
                vessel: data.vessel,
                voyage: data.voyage,
                mmsi: data.mmsi,
                pol: {
                    name: data.pol ? (data.pol.replace(' ','')).toUpperCase() : '',
                    terminal: data.polTerninal,
                    code: data.polCode,
                    eta: eta,
                    etd: etd,
                    lat: data.polLat,
                    lon: data.polLon
                },
                pod: {
                    name: data.pod ? (data.pod.replace(' ','')).toUpperCase() : '',
                    terminal: data.podTerninal,
                    code: data.podCode,
                    eta: eta,
                    etd: etd,
                    lat: data.podLat,
                    lon: data.podLon
                },
                eta: new Date(data.etd.replace(/\-/g, '/')) - 0,
                during: 1000 * 3600 * 24 * 30,
                transit:transitMap, //中转港
                polTime: data.etd ? new Date(eta).getTime() : '', //起始港时间 有实际就取实际没有就取预计
                podTime: data.eta ? new Date(etd).getTime() : '', //目的港时间有实际就取实际没有就取预计
                isEntre: data.routeCodeList && data.routeCodeList.length > 0 ? '1' : '0', //0 直达 ,1 中转
            }
            var idValue = id;
            var trackIdValue = "";
            var startTime = $scope.startTime.replace(/\//g, '-')

            var setParamDate = {
                id:idValue,
                trackId:trackIdValue,
                etd:etd,
                pathId:pathId,
                wayType:wayType,
                totalId:totalId,
                detail:detail,
                mapVal:mapVal,
                startTime:startTime,
        }

            var paramDate = setParams(setParamDate)
            $state.go('tab.sailScheduleDetail', {id:paramDate})
            // location.href = "#/tab/sailScheduleDetail/" + paramDate
        }
    }

    /**
     * 根据当前时间的本周周日算出各tab栏显示日期
     * NowTime 当前时间的本周周日
     *
     */

    // $scope.timeTest = function(NowZhouriString) {
    //     let Todaydate = new Date(); //当前时间

    //     if (NowZhouriString == $filter("date")(Todaydate, "yyyy-MM-dd")) {
    //         $scope.model.Tab = $filter("date")(Todaydate, "MM/dd") + "-" + $filter("date")($scope.getNewData(NowZhouriString, 7), "MM/dd");
    //         $scope.model.OneTab = $filter("date")($scope.getNewData(NowZhouriString, 8), "MM/dd") + "-" + $filter("date")($scope.getNewData(NowZhouriString, 14), "MM/dd");
    //         $scope.model.TwoTab = $filter("date")($scope.getNewData(NowZhouriString, 15), "MM/dd") + "-" + $filter("date")($scope.getNewData(NowZhouriString, 21), "MM/dd");
    //         $scope.model.ThreeTab = $filter("date")($scope.getNewData(NowZhouriString, 22), "MM/dd") + "-" + $filter("date")($scope.getNewData(NowZhouriString, 28), "MM/dd");
    //     } else {
    //         $scope.model.Tab = $filter("date")(Todaydate, "MM/dd") + "-" + $filter("date")(NowZhouriString, "MM/dd");
    //         $scope.model.OneTab = $filter("date")($scope.getNewData(NowZhouriString, 1), "MM/dd") + "-" + $filter("date")($scope.getNewData(NowZhouriString, 7), "MM/dd");
    //         $scope.model.TwoTab = $filter("date")($scope.getNewData(NowZhouriString, 8), "MM/dd") + "-" + $filter("date")($scope.getNewData(NowZhouriString, 14), "MM/dd");
    //         $scope.model.ThreeTab = $filter("date")($scope.getNewData(NowZhouriString, 15), "MM/dd") + "-" + $filter("date")($scope.getNewData(NowZhouriString, 21), "MM/dd");
    //     }
    // }

    $scope.GetTab = function(zm_str) {
        //zm_str 代表 这周的最后一天
        var zm_date = new Date(zm_str)
        var week = new Date().getDay()
        var p0, p1, p2, p3;

        //确定当前时间是否是周日
        //确定本周时间的取值
        if (week == 0) {
            var t0 = new Date(zm_date.getTime() - (1000 * 60 * 60 * 24 * 6))
            var t0_end = new Date(zm_date.getTime())
            p0 = String(t0.getMonth() + 1) + '.' + t0.getDate() + '-' + String(t0_end.getMonth() + 1) + '.' + t0_end.getDate();
        }else{
            var t0 = new Date(zm_date.getTime() - (1000 * 60 * 60 * 24 * 6))
            var t0_end = new Date(zm_date.getTime())
            p0 = String(t0.getMonth() + 1) + '.' + t0.getDate() + '-' + String(t0_end.getMonth() + 1) + '.' + t0_end.getDate();
        }
        //下一周
        var t1 = new Date(zm_date.getTime() + (1000 * 60 * 60 * 24 * 1))
        var t1_end = new Date(zm_date.getTime() + (1000 * 60 * 60 * 24 * 7))
        p1 = String(t1.getMonth() + 1) + '.' + t1.getDate() + '-' + String(t1_end.getMonth() + 1) + '.' + t1_end.getDate();

        //下两周
        var t2 = new Date(zm_date.getTime() + (1000 * 60 * 60 * 24 * 8))
        var t2_end = new Date(zm_date.getTime() + (1000 * 60 * 60 * 24 * 14))
        p2 = String(t2.getMonth() + 1) + '.' + t2.getDate() + '-' + String(t2_end.getMonth() + 1) + '.' + t2_end.getDate()

        //下三周
        var t3 = new Date(zm_date.getTime() + (1000 * 60 * 60 * 24 * 15))
        var t3_end = new Date(zm_date.getTime() + (1000 * 60 * 60 * 24 * 21))
        p3 = String(t3.getMonth() + 1) + '.' + t3.getDate() + '-' + String(t3_end.getMonth() + 1) + '.' + t3_end.getDate()

        $scope.model.Tab = p0;
        $scope.model.OneTab = p1;
        $scope.model.TwoTab = p2;
        $scope.model.ThreeTab = p3;
    }

    //格式化日期 mm-dd (周) HH:MM
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
            var geS = $scope.GetProcessTime("mm-dd HH:MM",new Date(time)) //格式化时间
            var b = geS.split(' ')[0]
            var d = geS.split(' ')[1]
            var c = weekDay[new Date(time).getDay()]
            return b + '(' + c + ') ' +  d
        }else{
            return '--'
        }
    }

    //格式化日期  YY-mm-dd HH:MM
    $scope.GetProcessTime = function(fmt, date) {
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


    /**
     * 计算日期加法
     */
    $scope.getNewData = function(dateTemp, days) {
        var dateTemp = dateTemp.split("/")
        var nDate = new Date(dateTemp[1] + '/' + dateTemp[2] + '/' + dateTemp[0]) //转换为MM-DD-YYYY格式    
        var millSeconds = Math.abs(nDate) + (days * 24 * 60 * 60 * 1000)
        var rDate = new Date(millSeconds)
        var year = rDate.getFullYear()
        var month = rDate.getMonth() + 1
        if (month < 10) month = "0" + month
        var date = rDate.getDate()
        if (date < 10) date = "0" + date
        return (year + "/" + month + "/" + date)
    }
});
app.filter("Time", function($filter) {
    return function(input, forma) {
        if (input == undefined || input == null || input == "") {
            return "";
        } else {
            return $filter('date')(new Date(input), forma);
        }
    }
});
//ETD中英文过滤器
app.filter("ETDCNorEN", function($filter, $translate) {
    return function(input, format) {
        var inputValue = new Date(input).getDay()
        if ((inputValue == undefined || inputValue == "" || inputValue == null) && inputValue !== 0 ) {
            return "";
        } else {
            if (inputValue == 1) {
                return $translate.instant('sjcq_Mon');
            }
            if (inputValue == 2) {
                return $translate.instant('sjcq_Tue');
            }
            if (inputValue == 3) {
                return $translate.instant('sjcq_Wed');
            }
            if (inputValue == 4) {
                return $translate.instant('sjcq_Thu');
            }
            if (inputValue == 5) {
                return $translate.instant('sjcq_Fri');
            }
            if (inputValue == 6) {
                return $translate.instant('sjcq_Sat');
            }
            if (inputValue == 0) {
                return $translate.instant('sjcq_Sun');
            }
        }
    }
});
app.filter('FormatStrDate', function() {
    return function(input) {
        if (input == undefined || input == "" || input == null) {
            return "";
        } else {
            input = input + ":00"
            var dateStr = new Date(input);
            var month = String((dateStr.getMonth() + 1));
            var dat = String(dateStr.getDate())

            var formatDate = month + "-" + dat;
            return formatDate;
        }
    }
});