app.controller('privacyAgreeController', function($scope) {
    $scope.serveAndPrivacy = true
    $scope.isServe = false
    $scope.isPrivacy = false
    //初始化
    $scope.getMount = function() {
        $scope.serveAndPrivacy = true
        $scope.isServe = false
        $scope.isPrivacy = false
    }
    //服务协议
    $scope.serveClick = function(){
        $scope.isServe = true
        $scope.serveAndPrivacy = false
        $scope.isPrivacy = false
        }

    //隐私协议
    $scope.privacyClick = function(){
        $scope.isPrivacy = true
        $scope.serveAndPrivacy = false
        $scope.isServe = false
    }

    //
    $scope.goBack = function(){
        $scope.serveAndPrivacy = true
        $scope.isPrivacy = false
        $scope.isServe = false
    }
});