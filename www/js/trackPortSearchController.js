app.controller('trackPortSearchController', function($scope, $stateParams, $ionicScrollDelegate, $rootScope, $timeout, $anchorScroll, $http, $state, locals,$translate,$ionicTabsDelegate) {

    //监听页面动作
    $rootScope.$on('$ionicView.beforeEnter', function() {
        var statename = $state.current.name;
        //console.log('current state name is: ' + statename);
        if (statename==='tab.track-portSearch') {
            $ionicTabsDelegate.showBar(false); //当前页面隐藏tab
        } else {
            $ionicTabsDelegate.showBar(true);
        }
    })
    //刷新页面语言不变
    var lan = locals.get('lang');
    $scope.lan = locals.get('lang') == undefined ? "zh-cn" : locals.get('lang');
    if (lan == "zh-cn") {
        $translate.use('zh');

    } else if (lan == "us-en") {
        $translate.use('en');

    }
    $scope.model = {};
    $scope.user = {
        text: ""
    }
    $scope.polList={};
    //接到参数
    $scope.type = $stateParams.type; //起始港或目的港
    $scope.user.text = "";
    //初始化
    $scope.init = function() {
        if ($scope.type != 'start' && $scope.type != 'start-track') {
            $scope.getPod(); //初始化调用方法，-用于绑值
        }       
    }

   
    var polList_=null;

    //获取起始港数据
    if($scope.type == 'start-track'){
        polList_ = polList_track;
        $scope.user.text = $stateParams.title;
    }else if ($scope.type == 'start') {
        polList_ = polList;
        $scope.user.text = $stateParams.title;
    } else {
        if ($stateParams.title == "") {
            $scope.user.text = "";
        } else {
            $scope.user.text = $stateParams.title;
            $scope.user.textPod = $stateParams.title.split("(")[0];
        }
    }

    /**
     * 目的港接口获取数据
     */
    $scope.getPod = function() {
        var city = $scope.user.text; //获取输入框值
        //判断城市名是否包含(，如果包含，就是选中带过来的值
        if (city.indexOf('(') != -1 && city.indexOf(')') != -1) {
            var citystart = city.indexOf('(');
            var cityend = city.indexOf(')');
            var cityStr = city.substring(citystart, cityend + 1);
            city = city.replace(cityStr, '');
        } else {
            $scope.user.textPod = $scope.user.text; //获取输入框值
        }

       
        //获取起始港数据
        // if ($scope.type == 'start') {           
        //     if(city=="" || city==null ){
        //         $scope.newJson = eval(polList);  //json是你的json变量名                
        //     }else{
        //         newJson = [];
        //         polList = eval(polList);
        //         for(var i=0; i<polList.length; i++)  
        //         {  
        //             if((polList[i].value).indexOf(city.toUpperCase())>-1){  //name为你需要遍历的变量
        //             var tempJson = {   //一下id和name是json中需要输出的变量
        //                 "id":polList[i].id,
        //                 "value":polList[i].value,
        //                 "countryCode":polList[i].countryCode
        //             };
        //             newJson.push(tempJson);
        //             } 
        //         }  
        //         $scope.newJson=newJson;
        //     }
        // }else{
            //从接口获取目的港数据  
            //alert($scope.user.text);
            var authorization = getTokenInfor()
            var apiUrlPost = baseUrl + "/schedules/web/queryCity?city="+city+"&pol=1";
            $http.get(apiUrlPost, {
                headers: { 'Authorization': authorization },
                timeout: timeOut
            }).success(function(data) {
                if (data.status == 1) { //成功
                    $scope.podList = data.content;
                }
            }).error(function(result) {
                Popup.showAlert($translate.instant('ts_qjcwl'));      
            });
            
    }





    $scope.selectItem = function(item) {
        //向上一页面传参，区分是起始港或目的港
        var TypeValue = '';
        if ($scope.type == 'start-track') {
            TypeValue = 'start-track';
        } else if ($scope.type == 'start') {
            TypeValue = 'start';
        }else if ($scope.type == 'end') {
            TypeValue = 'end';
        } else {
            TypeValue = 'no';
        }
        $rootScope.$broadcast('select-city-track', item, TypeValue);
        $scope.$ionicGoBack();
    }


    $scope.isShowTypeCircle = false;
    $scope.typeCircle = "A";
    $scope.selected = "";
    var time = "";
    $scope.selectType = function(id) {
        $scope.selected = id;
        $scope.typeCircle = id;
        $timeout.cancel(time);
        $scope.isShowTypeCircle = true;
        $anchorScroll(id);
        time = $timeout(function() {
            $scope.isShowTypeCircle = false;
            $scope.selected = "";
        }, 1000);
    }


    // 滑动框
    var navBar = $(".select-city-type-line");
    var width = 40;
    var height = 20;
    $scope.isTrueNavBar = false;
    $scope.touchmove = function($event) {
        var e = $event.targetTouches[0];
        $scope.isTrueNavBar = true;
        var y = e.pageY;
        var x = e.pageX;
        navBar.find(".letter").each(function(i, item) {
            var offset = $(item).offset();
            var left = offset.left,
                top = offset.top;
            if (x > left && x < (left + width) && y > top && y < (top + height)) {
                var id = $(item).text();
                $scope.selected = id;
                $scope.typeCircle = id;
                $scope.isShowTypeCircle = true;
                $anchorScroll(id);
            }
        });
    }

    $scope.touchend = function() {
        $scope.isTrueNavBar = false;
        $timeout(function() {
            $scope.isShowTypeCircle = false;
            $scope.selected = "";
        }, 500);
    }

    //键盘回车键
    $scope.todoSomething = function($event) {
        if ($event.keyCode == 13) {
            cordova.plugins.Keyboard.close();
        }
    }

    //查询按钮事件
    $scope.select = function() {
        cordova.plugins.Keyboard.close();
    }

    $scope.close = function() {
        $scope.clearData();
    }

    $scope.clearData = function() {
        $scope.user.text = "";
        $scope.user.textPod = "";
        $scope.isShowKeyboard = false;
        $scope.getPod()
        //$scope.$apply();
        //cordova.plugins.Keyboard.close();
    }

    $scope.gotoTop = function() {
        location.href = "#/tab/trackAdd"
    },

    // 监听键盘
    // $scope.isShowKeyboard = false;
    // window.addEventListener('native.showkeyboard', keyboardShowHandler);

    // function keyboardShowHandler(e) {
    //     cityHandle.scrollTop(true);
    //     $scope.isShowKeyboard = true;
    //     $scope.$apply();
    // };

    // window.addEventListener('native.keyboardhide', keyboardHideHandler);

    // function keyboardHideHandler(e) {
    //     if ($scope.user.text == "") {
    //         $scope.isShowKeyboard = false;
    //     }
    //     $scope.$apply();
    // };

    // 对象字母排序
    // function objKeySort(obj) {
    //     var newkey = Object.keys(obj).sort();
    //     var newObj = {};
    //     for (var i = 0; i < newkey.length; i++) {
    //         newObj[newkey[i]] = obj[newkey[i]];
    //     }
    //     return newObj;
    // }
    $("#poltrackListShow").hide();
    $("#poltrackListShow_track").hide();
})

app.filter('startPortFilter_cb', function() {
    return function(arryTemp, keyname) {

        var startPort = $('#startPort').val();
        var ArryReslut = new Array();
        if (keyname == '' || keyname == undefined || keyname == null) {
            if (startPort == '' || startPort == undefined || startPort == null) {
                $("#poltrackListShow").hide();
                return _polsailList;
            } else {
                keyname = startPort;
            }

        }
        for (var i = 0; i < _polsailList.length; i++) {
            valueStr = _polsailList[i].value;
            idStr = _polsailList[i].id;
            countryCodeStr = _polsailList[i].countryCode;
            nameCnStr = _polsailList[i].nameCn;
            nameEnStr = _polsailList[i].nameEn;


            if (valueStr.indexOf(keyname) != -1 || idStr.indexOf(keyname) != -1 || countryCodeStr.indexOf(keyname) != -1 || nameCnStr.indexOf(keyname) != -1 || nameEnStr.indexOf(keyname) != -1) {
                //将数据赋值到一个新对象中
                ArryReslut.push(_polsailList[i]); //将该对象放入数组中
            }
        }
        polsailList = null;
        polsailList = ArryReslut;
        if (polsailList.length == 0) {
            $("#poltrackListShow").show();
        } else {
            $("#poltrackListShow").hide();
        }
        return polsailList;
    }
});

app.filter('startPortFilter_track', function() {
    return function(arryTemp, keyname) {

        var startPort_track = $('#startPort_track').val();
        var ArryReslut = new Array();
        if (keyname == '' || keyname == undefined || keyname == null) {
            if (startPort_track == '' || startPort_track == undefined || startPort_track == null) {
                $("#poltrackListShow_track").hide();
                return polList_track.All;
            } else {
                keyname = startPort_track;
            }

        }else{
            keyname = keyname.toUpperCase()
        }
        for (var i = 0; i < polList_track.All.length; i++) {
            valueStr = polList_track.All[i].value;
            nameCnStr = polList_track.All[i].nameCn;
            nameEnStr = polList_track.All[i].nameEn;
            countryCnStr = polList_track.All[i].countryCn;
            portCodeStr=polList_track.All[i].portCode;
            countryEnStr=polList_track.All[i].countryEn;

            if (valueStr.indexOf(keyname) != -1 || nameCnStr.indexOf(keyname) != -1 || nameEnStr.indexOf(keyname) != -1 || countryCnStr.indexOf(keyname) != -1 || portCodeStr.indexOf(keyname) != -1 ||countryEnStr.indexOf(keyname)!= -1) {
                //将数据赋值到一个新对象中
                ArryReslut.push(polList_track.All[i]); //将该对象放入数组中
            }
        }
        polList_ = null;
        polList_ = ArryReslut;
        if (polList_.length == 0) {
            $("#poltrackListShow_track").show();
        } else {
            $("#poltrackListShow_track").hide();
        }
        return polList_;
    }
});
