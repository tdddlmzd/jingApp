app.controller('customerController', function($scope, $rootScope,$state, $ionicTabsDelegate) {
    //监听页面动作
    $rootScope.$on('$ionicView.beforeEnter', function() {
        $ionicTabsDelegate.showBar(false)
    });
    $scope.init = function() {
        // location.href = "https://tb.53kf.com/code/client/638bf58335176d932b75ab10e96545745/1"
    }

});