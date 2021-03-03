app.controller('tabShowHideController', function($scope, $rootScope, $http, $resource, $translate, $state,
    $stateParams, $ionicActionSheet, locals, $ionicTabsDelegate, $cordovaCamera, $cordovaImagePicker, $ionicHistory, Popup, $ionicLoading) {
    $scope.model = {};
    $rootScope.$on('$ionicView.beforeEnter', function() {
        var login_content = locals.get("login_content"); //字符串缓存 //用户id
        if ((login_content == null || login_content == undefined || login_content == "")) {
            //$ionicTabsDelegate.showBar(false); //当前页面隐藏tab
            $rootScope.is_my = false;

        } else {

            $rootScope.is_my = true;
        }
        $scope.$on('$ionicView.beforeLeave', function() {
            //打开tab选项卡
            //$ionicTabsDelegate.showBar(true);
            var login_content = locals.get("login_content"); //字符串缓存 //用户id
            if ((login_content == null || login_content == undefined || login_content == "")) {
                //$ionicTabsDelegate.showBar(false); //当前页面隐藏tab
                $rootScope.is_my = false;
            } else {

                $rootScope.is_my = true;
            }
        });

        var yy = $.cookie('lang');
        if (yy == "zh-en") {
            $translate.use('zh');

        } else if (yy == "us-en") {
            $translate.use('en');
        }
    });

    /**
     * 解决tabs跳转，页面不重新加载问题
     * 杨卿林
     * 2020-04-02
     */
    $scope.toThisTab = function(url) {
        localStorage.removeItem('clickHeader')
        if (url != 'login') {
            $ionicHistory.clearCache().then(function() {
                // if (url === 'trackList') {
                //     $state.go('tab.' + url, {});
                // } else {
                location.href = '/#/tab/' + url;
                // }
            });
        } else {
            location.href = '/#/tab/' + url;
        }
    }

    /**
     * 解决船跟踪详情再到船期搜索页总是加载船跟踪详情里的js方法，暂时找到此种解决办法
     * 刘嵩
     * 2020-04-20
     */
    $scope.reloads = function() {
        location.replace('/#/tab/sailSchedule')
    }

})