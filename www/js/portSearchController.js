app.controller('portSearchController', function($scope, $stateParams, $ionicScrollDelegate, $rootScope, $timeout, $anchorScroll, $http, $state, $ionicTabsDelegate, $translate, locals, Popup) {

    //监听页面动作
    $rootScope.$on('$ionicView.beforeEnter', function() {
        var statename = $state.current.name;
        if (statename === 'tab.portSearch') {
            $ionicTabsDelegate.showBar(false); //当前页面隐藏tab
        } else {
            $ionicTabsDelegate.showBar(true);
        }
    })

    //刷新页面语言不变
    var lan = locals.get('lang');
    if (lan == "zh-cn") {
        $translate.use('zh');

    } else if (lan == "us-en") {
        $translate.use('en');
    }
    $scope.lan = locals.get('lang') == undefined ? "zh-cn" : locals.get('lang');
    $scope.model = {};
    $scope.user = {
        text: ""
    }



    //接到参数
    $scope.type = $stateParams.type; //起始港或目的港
    $scope.user.text = ""; //起始港 目的港 路由带过来的参数
    $scope.user.textPod = "";
    $scope.user.textPol = "";

    //获取起始港数据
    if ($scope.type == 'start') {
        if ($stateParams.title == "") {
            $scope.user.text = "";
        } else {
            $scope.user.text = $stateParams.title;
            $scope.user.textPol = $stateParams.title.split("(")[0];
        }
    } else {
        if ($stateParams.title == "") {
            $scope.user.text = "";
        } else {
            $scope.user.text = $stateParams.title;
            $scope.user.textPod = $stateParams.title.split("(")[0];
        }
    }

    //初始化
    $scope.init = function() {
        if ($scope.type != 'start') {
            $scope.getPod(); //初始化调用方法，-用于绑值
        }
        if($scope.type == 'start'){
            $scope.getPol(); //初始化调用方法，-用于绑值
        }
    }

    var polList = new Array();

    /**
     * 起始港接口获取数据
     */

    $scope.getPol = function() {
        //从接口获取起始港数据
        var city = $scope.user.text; //获取输入框值
        var startPort = $('#startPort').val();
        if (city == '' || city == undefined || city == null) {
            if (startPort == '' || startPort == undefined || startPort == null) {} else {
                city = startPort;
            }
        }
        //判断城市名是否包含(，如果包含，就是把括号截掉
        if (city.indexOf('(') != -1 && city.indexOf(')') != -1) {
            var citystart = city.indexOf('(');
            var cityend = city.indexOf(')');
            var cityStr = city.substring(citystart, cityend + 1);
            city = city.replace(cityStr, '');
        } else {
            $scope.user.textPod = $scope.user.text; //获取输入框值
        }
        var authorization = getTokenInfor()
        var apiUrlPost = baseUrl + "/schedules/web/queryCity?pol=0&city=" + city
        $http.get(apiUrlPost, {
            headers: { 'Authorization': authorization },
            timeout: timeOut
        }).success(function(data) {
            if (data.status == 1) { //成功
                $scope.polList = data.content;
            }
        }).error(function(result) {
            console.log("log:" + result);
            //  Popup.showAlert($translate.instant('ts_qjcwl'));
        });
    }

    var podList = new Array();

    /**
     * 目的港接口获取数据
     */
    $scope.getPod = function() {
        //从接口获取目的港数据
        var city = $scope.user.text; //获取输入框值
        var endPort = $('#endPort').val();
        if (city == '' || city == undefined || city == null) {
            if (endPort == '' || endPort == undefined || endPort == null) {} else {
                city = endPort;
            }
        }
        //判断城市名是否包含(，如果包含，就是把括号截掉
        if (city.indexOf('(') != -1 && city.indexOf(')') != -1) {
            var citystart = city.indexOf('(');
            var cityend = city.indexOf(')');
            var cityStr = city.substring(citystart, cityend + 1);
            city = city.replace(cityStr, '');
        } else {
            $scope.user.textPod = $scope.user.text; //获取输入框值
        }
        var authorization = getTokenInfor()
        var apiUrlPost = baseUrl + "/schedules/web/queryCity?pol=1&city=" + city
        $http.get(apiUrlPost, {
            headers: { 'Authorization': authorization },
            timeout: timeOut
        }).success(function(data) {
            if (data.status == 1) { //成功
                $scope.podList = data.content;
            }
        }).error(function(result) {
            console.log("log:" + result);
            //  Popup.showAlert($translate.instant('ts_qjcwl'));
        });
    }
    
    $scope.selectItem = function(item) {
        //向上一页面传参，区分是起始港或目的港
        var TypeValue = '';
        if ($scope.type == 'start') {
            TypeValue = 'start';
        } else if ($scope.type == 'end') {
            TypeValue = 'end';
        } else {
            TypeValue = 'no';
        }
        $rootScope.$broadcast('select-city', item, TypeValue);
        $scope.$ionicGoBack();
    }

    $scope.gotoTop = function() {
        location.href = "#/tab/sailSchedule"
        $scope.clearData()

    },
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
        $scope.user.textPol = "";
        $scope.isShowKeyboard = false;
        $('#endPort').val("");
        $('#startPort').val("");
        $scope.getPod(); //初始化调用方法，-用于绑值
        $scope.getPol(); //初始化调用方法，-用于绑值
        //$scope.$apply();
        //cordova.plugins.Keyboard.close();
    }
    $("#polsailListShow").hide();
})
app.filter('startPortFilter', function() {
    return function(arryTemp, keyname) {
        var startPort = $('#startPort').val();
        var ArryReslut = new Array();
        if (keyname == '' || keyname == undefined || keyname == null) {
            if (startPort == '' || startPort == undefined || startPort == null) {
                $("#polsailListShow").hide();
                return _polsailList;
            } else {
                keyname = startPort;
            }

        }else{
            keyname = keyname.toUpperCase()
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
            $("#polsailListShow").show();
        } else {
            $("#polsailListShow").hide();
        }
        return polsailList;
    }
});