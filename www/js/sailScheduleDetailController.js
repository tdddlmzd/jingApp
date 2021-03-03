app.controller('sailScheduleDetailController', function($scope, $http, $resource, $stateParams, $translate, $ionicLoading, Popup, $ionicPopup, $rootScope, $state, $ionicTabsDelegate, $sce, locals, Popup2, $filter) {

    // StatusBar.backgroundColorByHexString('transparent')
    //刷新页面语言不变
    var lan = locals.get('lang');
    if (lan == "zh-cn") {
        $translate.use('zh');

    } else if (lan == "us-en") {
        $translate.use('en');
    }

    $scope.lan = locals.get('lang') == undefined ? "zh-cn" : locals.get('lang');

    //监听页面动作
    $rootScope.$on('$ionicView.beforeEnter', function() {
            var statename = $state.current.name;
            if (statename === 'tab.sailScheduleDetail' ||  statename === 'tab.sailScheduleList') {
                $ionicTabsDelegate.showBar(false); //当前页面隐藏tab
                $scope.CalculateOverflowDivHeight('下滑');
            } else {
                $ionicTabsDelegate.showBar(true);
            }
        })
    //地图的宽度
    $scope.mapHeight = {
        "height" : (screen.height / 2) + 10 + 'px',
    }

    //地图下面高度
    $scope.topHeight = {
        "top" : (screen.height / 2) + 4 + 'px',
    }

    $scope.model = {};
    // $scope.shipLogoUrl = shipLogoUrl; //旗帜
    $scope.isshow = true; //船期途径默认显示
    $scope.isHaveShow = false;
    $scope.isWarn_id = true; //判断手机提醒按钮  true-已提醒

    $scope.isTransit = 0; //0直达 1中转
    $scope.model.userId = locals.get("login_content") == undefined ? "" : locals.get("login_content"); //当前登录人ID
    //如果当前登录人ID等于0，表示是游客
    if ($scope.model.userId == "") {
        $scope.model.userType = 1; //游客
    } else {
        $scope.model.userType = 0; //登录用户
    }
    // $scope.model.userIp = locals.getObject("useripLog") == undefined ? "" : locals.getObject("useripLog"); //当前登录人ip
    $scope.model.userIp = '220.181.108.105'

    //船期详情页初始化
    $scope.init = function() {
        if($stateParams.id){
            var paramDate = getParams($stateParams.id)
            $scope.GetDetail(paramDate)
            $scope.GetCQTJ(paramDate)
            setTimeout(()=>{
                $scope.authorization = getTokenInfor()
                $scope.GetDTInit(paramDate.mapVal) //调用地图方法  
            },1000)        
        }
    }

    $("#TiDan").hide(); //提单按钮隐藏
    $("#GenZong").show();

    var auth = null;

    /**
     * 获取详情数据
     * 
     */
    $scope.GetDetail = function(paramDate) {
        //加载动画显示
        $ionicLoading.show({
            template: $translate.instant('sjcq_jzz')
        });

        //请求后台数据-获取船期详情
        var authorization = getTokenInfor()
        $scope.getHeaderToken = ''
        auth = authorization;
        var apiUrlPost = baseUrl + "/schedules/web/details?id=" + paramDate.id + "&userId=" + $scope.model.userId + "&userIp=" + $scope.model.userIp + "&userType=" + $scope.model.userType + "&startTime=" + paramDate.startTime;
        $scope.getHeaderToken = {
            'Authorization': authorization,
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate"
        }
        $http.get(apiUrlPost, {
            headers: { 'Authorization': authorization },
            timeout: timeOut
        }).success(function(data) {
            try {
                if (data.content.length > 0) {
                    if (data.status == 6) { //说明未登录最多查询3次，请登录
                        $ionicLoading.hide(); //加载动画隐藏
                        Popup2.showAlert($translate.instant('sjcq_ykcx'), "/#/tab/login");
                    } else {
                        //成功
                        $scope.sailScheduleDetail = data.content[0]; //船期详情
                        $scope.isTransit = data.content[0].isTransit; //0直达 1中转
                        $ionicLoading.hide(); //加载动画隐藏
                        if ($scope.sailScheduleDetail != null && $scope.sailScheduleDetail != "" && $scope.sailScheduleDetail != undefined) {
                            if ($scope.sailScheduleDetail.subStatus != 1) {
                                $scope.isWarn_id = false; //fasle-手机提醒
                            }
                            //0: 未跟踪
                            if ($scope.sailScheduleDetail.traceStatus == 0) {
                                //未登录不显示跟踪按钮
                                if ($scope.model.userId == "") {
                                    $("#GenZong").hide(); //跟踪隐藏
                                    $("#TiDan").hide(); //提单按钮隐藏
                                } else {
                                    $("#GenZong").show(); //跟踪隐藏
                                    $("#TiDan").hide(); //提单按钮隐藏
                                }
                            } else {
                                $("#TiDan").show(); //提单按钮显示
                                $("#GenZong").hide(); //跟踪隐藏
                            }
                            $scope.model.title = $scope.sailScheduleDetail.vessel;
                        } else {
                        }
                        $ionicLoading.hide(); //加载动画隐藏
                    }
                } else {
                    if (data.status == 6) { //说明未登录最多查询3次，请登录
                        $ionicLoading.hide(); //加载动画隐藏
                        Popup2.showAlert($translate.instant('sjcq_ykcx'), "/#/tab/login");
                    }
                    $ionicLoading.hide(); //加载动画隐藏
                }
            } catch (error) {
                $ionicLoading.hide(); //加载动画隐藏
            }
        }).error(function(result) {
            $ionicLoading.hide(); //加载动画隐藏
            Popup.showAlert($translate.instant('ts_qjcwl'));
        });
    }

    /**
     * 请求后台数据-船期途径 
     */
    $scope.GetCQTJ = function(paramDate) {
        $scope.pathList = []
        $scope.isTransitShow = $scope.isTransit;
        $scope.cccccc = ["SHEKOU", "NANSHA"];
        //代表加载过数据
        if ($scope.isHaveShow == true) {
            $scope.isshow = true;
        } else {
            //加载动画显示
            $ionicLoading.show({
                template: $translate.instant('sjcq_jzz')
            });
            var authorization = getTokenInfor()
            var apiUrlPost = baseUrl + "/schedules/web/completePath?id=" + paramDate.totalId + "&voyageId=" + paramDate.id + "&wayType=" + paramDate.wayType;
            $http.get(apiUrlPost, {
                headers: { 'Authorization': authorization },
                timeout: timeOut
            }).success(function(data) {
                if (data.status == 1) { //成功
                    $scope.pathList = data.content
                    if($scope.pathList.length > 0){
                        $scope.pathList[$scope.pathList.length-1]['str'] = '计划到港';
                        $scope.pathList[0]['str'] = '计划离港';
                        for (let i = 0; i < $scope.pathList.length; i++) {
                            if (i == 0) {
                                $scope.pathList[i].basePortCn = '起运港 ' + $scope.pathList[i].basePort
                                $scope.pathList[i].basePortEn = 'Pol ' + $scope.pathList[i].basePort
                            } else if (i == $scope.pathList.length-1) {
                                $scope.pathList[i].basePortCn = '目的港 ' + $scope.pathList[i].basePort
                                $scope.pathList[i].basePortEn = 'Pod ' + $scope.pathList[i].basePort
                            } else {
                                $scope.pathList[i].basePortCn = '中转港 ' + $scope.pathList[i].basePort
                                $scope.pathList[i].basePortEn = 'TransitPort ' + $scope.pathList[i].basePort
                            }
                            $scope.pathList[i].isShowVess = true
                            var c = $scope.pathList[i]
                            console.log($scope.pathList[i],'$scope.pathList[i]')
                            //下面的是处理是否要显示船节点的信息
                            if(c.vesselInfo.vessel == '' && c.vesselInfo.voyage == '' && c.vesselInfo.imo == '' && c.vesselInfo.mmsi == '' && c.vesselInfo.ctnrVolume == '' && c.vesselInfo.buildDate == '' && c.vesselInfo.operator == ''){
                            $scope.pathList[i].isShowVess = false
                            }
                            //下面处理的是 个节点应该显示的标识（显示的应该是下一个节点应该显示的标识）
                            if($scope.pathList[i+1]){
                            $scope.pathList[i].flag = $scope.pathList[i+1].flag ? $scope.pathList[i+1].flag : '-'
                            }
                        }
                    }
                    $scope.isshow = true;
                    $scope.isHaveShow = true; //代表加载过数据
                } else {
                    //Popup.showAlert($translate.instant('sjcq_czsb')); //失败
                }
            }).error(function(result) {
                Popup.showAlert($translate.instant('ts_qjcwl'));
            });
        }
    }

    /**
     * 请求后台数据-准点分析
     */
    $scope.GetZDFX = function(id) {
        //加载动画显示
        $ionicLoading.show({
            template: $translate.instant('sjcq_jzz')
        });
        var sailid = id;
        var authorization = getTokenInfor()
        var apiUrlPost = baseUrl + "/schedules/web/onTime?id=" + sailid;
        $http.get(apiUrlPost, {
            headers: { 'Authorization': authorization },
            timeout: timeOut
        }).success(function(data) {
            if (data.status == 1) {
                $ionicLoading.hide(); //加载动画隐藏
                //起始港
                var arr = data.content.pol.coordinates;
                var prodData = arr.map(function(item) {
                    return item['x'];
                });
                var prodDataPod = arr.map(function(item) {
                    return item['y'];
                });
                $scope.series = ['起始港'];
                $scope.labels = prodData; //横坐标
                $scope.data = [prodDataPod]; //纵坐标
                $scope.onTime = data.content.pol.onTime; //准班率
                //目的港
                var arrPod = data.content.pod.coordinates;
                var prodDataPod = arrPod.map(function(item) {
                    return item['x'];
                });
                var prodDataPod = arrPod.map(function(item) {
                    return item['y'];
                });
                $scope.seriesPod = ['目的港'];
                $scope.labelsPod = prodDataPod;
                $scope.dataPod = [prodDataPod];
                $scope.onTimePod = data.content.pod.onTime; //准班率
            }
        }).error(function(result) {
            $ionicLoading.hide(); //加载动画隐藏
        });
    }

    //当前高度
    var topNow = 0;
    //按下
    $scope.onTouch = function() {
        var _topNow = $('#DetailId').css('top').replace('px', '');
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
    };

    var maxTop = (screen.height / 2) + 10;
    var minTop = 44 + 10;
    //监听内容区回收状态下用户上划展开的动作
    $scope.DetailIdDrag = function($event) {
        if($event.gesture.deltaY < 0){
            $("#DetailId").animate({ top: minTop - 10  + 'px' });
            $scope.CalculateOverflowDivHeight('上滑')
            $('.mapButton').hide()
            $('#overflowDiv').css("overflow", "auto")
            // 展开状态下，判断内容区域是否可滚动
            var allHight = $('#overflowDiv').height() // 可视区的高度
            var shippingsHight = $('.shippings').height() // 上半部内容高度
            var showUlHeight = $('.showUl').height() // 下半部内容高度
            if(allHight > (shippingsHight + showUlHeight)){
                $scope.isOverFlowScroll = true
            }else{
                $scope.isOverFlowScroll = false
            }
        }
        // 监听内容区域展开状态下用户下滑收起的动作，内容不可滚动时收起
        if($event.gesture.deltaY > 0 && $scope.isOverFlowScroll){
            $("#DetailId").animate({ top: maxTop - 6 + 'px' });
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
                $("#DetailId").animate({ top: maxTop - 6 + 'px' });
                $scope.CalculateOverflowDivHeight('下滑')
                $('.mapButton').show()
                $('#overflowDiv').css("overflow", "hidden")
            }
        }
    }
    
    //抬起
    $scope.onRelease = function() {

        if($scope.hd_y > 8){ //下滑
            $("#DetailId").animate({ top: maxTop - 6 + 'px' });
            $scope.CalculateOverflowDivHeight('下滑')
            $('.mapButton').show()
            $('#overflowDiv').css("overflow", "hidden")
        }else if($scope.hd_y < -8){ //上滑
            $("#DetailId").animate({ top: minTop - 10  + 'px' });
            $scope.CalculateOverflowDivHeight('上滑')
            $('.mapButton').hide()
            $('#overflowDiv').css("overflow", "auto")
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
        window.history.go(-1)
        // window.history.back()
        // return false
    }
    // //下滑事件
    // $scope.onDragDown = function () {
    //     console.log("我在下滑" + "onDragDown")
    //     // $('#map').css({ 'height': '363px' });
    //     //$("#DetailId").animate({ top: "372px" }, 600);
    //     $('#DetailId').css({ top: '372px' });
    //     map.invalidateSize(true);
    // }

    // //上滑事件
    // $scope.onDragUp = function () {
    //     console.log("我在上滑" + "onDragUp")
    //     //$('#map').css({ 'height': '128px' });
    //     // $("#DetailId").animate({ top: "138px" }, 600);
    //     $('#DetailId').css({ top: '200px' });
    // }


    //隐藏框-船途径信息-隐藏
    $scope.closeFun = function() {
        $scope.isshow = false;
    }
    //显示框-船途径信息-显示
    $scope.openFun = function() {
        $scope.isshow = true;
    }
    //打开QQ功能
    $scope.openQQ = function() {
        contactCustomer()
    }


    //提醒功能
    $scope.warnFun = function(mark, identify) {
        //加载动画显示
        $ionicLoading.show({
            template: $translate.instant('sjcq_jzz')
        });
        var fd = new FormData(); //初始化一个FormData实例  
        var userId = (locals.get("login_content") == undefined || locals.get("login_content") == '[object Object]') ? "" : locals.get('login_content'); //用户id
        var identify = "['" + identify + "']";
        var apiUrlPost = baseUrl + "/trace/fore/subscribe";
        fd.append('userId', userId);
        fd.append('mark', mark);
        fd.append('paramStr', identify);
        var authorization = getTokenInfor()
        $http.post(apiUrlPost, fd, {
            headers: { 'Authorization': authorization, 'Content-Type': undefined },
            timeout: timeOut
        }).success(function(results) {
            $ionicLoading.hide(); //加载动画隐藏
            if (results.status == 1) {
                if (mark == 1) {
                    $scope.isWarn_id = true;
                } else {
                    $scope.isWarn_id = false;
                }
            }
        }).error(function(result) {
            console.log("log:" + result);
            $ionicLoading.hide(); //加载动画隐藏
            Popup.showAlert($translate.instant('ts_qjcwl'));
        });
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
            var time = time.replace(/-/g,'/')
            var geS = $scope.GetProcessTime("mm-dd HH:MM",new Date(time)) //格式化时间
            var b = geS.split(' ')[0]
            var d = geS.split(' ')[1]
            var c = weekDay[new Date(time).getDay()]
            return b + '(' + c + ') ' +  d
        }else{
            return '--'
        }
    }

    //格式化日期 mm-dd (周)
    $scope.GetTime = function(time) {
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
            var geS = $scope.GetProcessTime("mm-dd",new Date(time)) //格式化时间
            var b = geS.split(' ')[0]
            var d = geS.split(' ')[1]
            var c = weekDay[new Date(time).getDay()]
            return b + '(' + c + ') '
        }else{
            return '--'
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

    /*************************************************地图开始****************************************************** */
    if ($("#sailMap").length > 0) {
        $scope.execute = []  //实际路径 历史接口 预计要走的
        $scope.history = [] //历史路径 历史接口 已经走过的
        $scope.ports = [] //历史挂港 通过船的MMIS号得到船航行的历史挂靠港信息
        $scope.ships = {} //船舶信息
        $scope.direction = 0 //初始经纬度
        $scope.center = [1.292088, 21.495623]; //默认
        $scope.isShowShip = false
        //当前开始调用地图方法
        $scope.GetDTInit = function(val) {
            $scope.val = val
            if (val && val.mmsi) {
                this.getVesselDetailByMMSI(val.mmsi).then((vesselDetailRes) => {
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
                this.getPorts(val.mmsi, val.pol).then((portsRes) => {
                    //得到并更新历史跟踪路径
                    this.getTracePaths(val.mmsi,val.polTime,val.podTime,val.during,val.isEntre).then((pathsRes) => {
                        console.log('this.getTracePaths进行中')
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
                        }

                        $scope.ports = portsRes.ports
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
                var map = L.map('sailMap').setView($scope.center, 2);
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
                        timeout: timeOut,
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
                        timeout: timeOut,
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
                    return
                }
                }else{ //代表中转
                    if(polTime){ //起始港时间
                        etd = polTime
                        eta = polTime + during
                    }else{
                        return
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
                            headers: { 'Authorization': $scope.authorization }
                        }).then((res)=>res.json())
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
                    $.ajax({
                        type: "GET",
                        url: baseUrl + '/schedules/dragon/getPortOfCallByShip',
                        async: false,
                        timeout: timeOut,
                        headers:{ 'Authorization': $scope.authorization },
                        data: {
                            mmsi: mmsi,
                            begin: Math.round(new Date() / 1000) - 3600 * 24 * 0,
                            end: Math.round(new Date() / 1000)
                        }
                    }).then(res => {
    
                        let result = []
    
                        if (res) {
    
                            if (res.status == 0) {
    
                                //排序
                                let all = res.records.sort((p, c) => { return p.ata - c.ata })
                                    //排重
                                let hash = {}
                                let days = 0
    
                                all.forEach((r) => {
                                        if (!hash[r.portname_en]) {
                                            hash[r.portname_en] = r
                                        } else {
                                            //两次经过同一港口的间隔天数
                                            if (days == 0 && r.countrycode == 'CN') {
                                                days = Math.round((new Date(hash[r.portname_en].ata.replace(/\-/g, '/')) - new Date(r.atd.replace(/\-/g, '/'))) / (1000 * 3600 * 24))
                                            }
                                            //  console.log(days)
                                        }
                                    })
                                    //取经纬度         
                                Object.keys(hash).map(p => {
                                    if (hash[p].portcode) {
                                        $.ajax({
                                            type: "get",
                                            url: baseUrl + '/schedules/dragon/getPortLocation',
                                            timeout: timeOut,
                                            async: false,
                                            headers:{ 'Authorization': $scope.authorization },
                                            data: {
                                                portCode: hash[p].portcode.toLowerCase(),
                                            },                    
                                            success: function(result) {},
                                            error: function(xhr, textStatus, errorThrown) {}
                                        }).then(c => {
                                            if (c.content && c.content.LON) {
                                                hash[p].lon = c.content.LON;
                                                hash[p].lat = c.content.LAT;
                                                //取到经纬度的挂港返回
                                                result.push(hash[p])
                                            }
                                        })
                                    }
                                })
    
                                resolve({ ports: result, during: days });
                            } else {
                                resolve({ ports: result, during: 0 });
                            }
    
                        } else {
    
                            reject({ ports: result, during: 0 });
    
                        }
                    })
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
                $scope.val = value;
                $scope.val = value   ;
                //初始化 地图
                var map = L.map('sailMap').setView($scope.center, 2);
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
                    console.log('有船的坐标')
                    $scope.latlngs.push($scope.cLat)
                }else{
                    if($scope.muLat.length > 0){
                        $scope.latlngs.push($scope.muLat)
                    }
                }
                if($scope.latlngs.length == 2){ //代表两个坐标都有
                    console.log($scope.latlngs)
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
    }    
});
/*************************************************地图结束****************************************************** */

//时间过滤器
app.filter("Time", function($filter) {
    return function(input, forma) {
        if (input == undefined || input == null || input == "") {
            return "";
        } else {
            var timeValue = input.replace(/\-/g, '/');
            return $filter('date')(new Date(timeValue), forma);
        }
    }
});
app.filter("formatTimer", function($filter) {
    return function(input, format) {
        if (input == undefined || input == "" || input == null) {
            return "";
        } else {
            let date = new Date(input);
            let y = date.getFullYear();
            let MM = date.getMonth() + 1;
            MM = MM < 10 ? "0" + MM : MM;
            let d = date.getDate();
            d = d < 10 ? "0" + d : d;
            let h = date.getHours();
            h = h < 10 ? "0" + h : h;
            let m = date.getMinutes();
            m = m < 10 ? "0" + m : m;
            let s = date.getSeconds();
            s = s < 10 ? "0" + s : s;
            return y + "-" + MM + "-" + d + " " + h + ":" + m;
        }
    }
});
app.filter("shipStatus", function($filter) {
    return function(input, format) {
        if (input == undefined || input == "" || input == null) {
            return "";
        } else {
            let status = ["在航", "锚泊", "失控", "操作受限", "吃水受限", "靠泊", "搁浅", "捕鱼", "船帆动力",
                "保留", "保留", "保留", "保留", "保留", "AIS-SART", "未定义"
            ]
            return status[input];
        }
    }
});
app.filter("timeFilter", function($filter) {
    return function(input, format) {
        if (input == undefined || input == "" || input == null) {
            return "";
        } else {
            var dateTime = new Date(input);
            var yy = dateTime.getFullYear();
            var dd = dateTime.getDate();
            var mm = dateTime.getMonth();

            var test = (mm + 1) + "-" + dd;
            return test;
        }
    }
});