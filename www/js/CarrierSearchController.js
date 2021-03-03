app.controller('CarrierSearchController', function($scope, $stateParams, $ionicScrollDelegate, $rootScope, $timeout, $anchorScroll, $state, locals,$http, $translate, $ionicTabsDelegate) {
    //监听页面动作
    $rootScope.$on('$ionicView.beforeEnter', function() {
        var statename = $state.current.name;
        //console.log('current state name is: ' + statename);

        if (statename === 'tab.CarrierSearch') {
            $ionicTabsDelegate.showBar(false); //当前页面隐藏tab
        } else {
            $ionicTabsDelegate.showBar(true);
        }
    });
    //刷新页面语言不变
    var lan = $.cookie('lang');
    $scope.lan = locals.get('lang') == undefined ? "zh-cn" : locals.get('lang');
    if (lan == "zh-cn") {
        $translate.use('zh');

    } else if (lan == "us-en") {
        $translate.use('en');

    }
    $scope.model = {};
    //初始化
    $scope.init = function() {
        var ref_nameCn = $stateParams.ref_nameCn;
        var nameCn = ref_nameCn.split('_')[1];
        if (nameCn != "") {
            $scope.user.text = nameCn;
        }
        $scope.getCarrier();

    }

    //获取船公司数据
    $scope.getCarrier = function() {
        // $scope.shipLogoUrl = shipLogoUrl;
        var ref_nameCn = $stateParams.ref_nameCn;
        var ref = ref_nameCn.split('_')[0];
        console.log(ref_nameCn)
        console.log(ref)
        var nameCn = $scope.user.text; //获取输入框值
       // $scope.carrierList = [];
        var authorization = getTokenInfor()
        var apiUrl = baseUrl + "/trace/fore/getShipping?ref=&nameCn=" + nameCn;
        $http.get(apiUrl, {
            headers: { 'Authorization': authorization },
            timeout: timeOut
        }).success(function(data) {
            if (data.status == 1) { //成功
                if (data.content[0] != null) {
                    $scope.carrierList = data.content;                            
                }else{
                    $scope.carrierList=[];
                }
            }
        }).error(function(result) {
            Popup.showAlert($translate.instant('ts_qjcwl'));
        });
    }

    // var cityHandle = $ionicScrollDelegate.$getByHandle('city-handle');
    // $http.get("/www/city.json").success(function(data) {
    //     //$scope.cityList = data;
    //     cityHandle.resize();
    // })



    // 选择城市 向上级目录传参
    $scope.selectItem = function(item) {
        var TypeValue = 'Carrier';
        $rootScope.$broadcast('select-city-track', item, TypeValue);
        $scope.$ionicGoBack();
    }

    $scope.user = {
        text: ""
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

    $scope.close = function() {
        clearData();
    }

    function clearData() {
        $scope.user.text = "";
        $scope.isShowKeyboard = false;
        $scope.getCarrier();
        $scope.$apply();
        $cordova.plugins.Keyboard.close();


    }
    $scope.gotoTop = function() {
        location.href = "#/tab/trackAdd"
    },

    // 监听键盘
    $scope.isShowKeyboard = false;
    window.addEventListener('native.showkeyboard', keyboardShowHandler);

    function keyboardShowHandler(e) {
        cityHandle.scrollTop(true);
        $scope.isShowKeyboard = true;
        $scope.$apply();
    };

    window.addEventListener('native.keyboardhide', keyboardHideHandler);

    function keyboardHideHandler(e) {
        if ($scope.user.text == "") {
            $scope.isShowKeyboard = false;
        }
        $scope.$apply();
    };

    // 对象字母排序
    function objKeySort(obj) {
        var newkey = Object.keys(obj).sort();
        var newObj = {};
        for (var i = 0; i < newkey.length; i++) {
            newObj[newkey[i]] = obj[newkey[i]];
        }
        return newObj;
    }
})
