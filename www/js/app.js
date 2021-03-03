// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $ionicPopup,locals) {
    //解决IOS ：active不兼容
    document.body.addEventListener('touchstart',function(){})
        
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs).
        // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
        // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
        // useful especially with forms, though we would prefer giving the user a little more room
        // to interact with the app.
        if (window.cordova && window.Keyboard) {

            /**
             * 解决 解决select在ios上不显示done按钮问题，安装 cordova-plugin-ionic-keyboard
             * 杨卿林
             * 2020-03-25
             */
            if (ionic.Platform.isIOS()) { //判断是否是iOS平台
                if (window.cordova && window.cordova.plugins) {
                    window.Keyboard.hideFormAccessoryBar(false); //window在Android系统上会报错
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true); //解决select在ios上不显示done按钮
                    cordova.plugins.Keyboard.disableScroll(true);
                }
                if (window.StatusBar) {
                    // Set the statusbar to use the default style, tweak this to
                    // remove the status bar on iOS or change it to use white instead of dark colors.
                    StatusBar.backgroundColorByHexString("#072c4c")
                    StatusBar.styleDefault();
                }

            }
            
            window.ionic.Platform.ready(() => {
                //如果当前打开的是微信 则没有隐私协议和自动更新
                var ua = navigator.userAgent.toLowerCase()
                if (ua.match(/MicroMessenger/i) == "micromessenger") {
                    //当前为微信
                } else {
                    //隐私判断
                    if(!eval(localStorage.getItem("isApply"))){
                        var confirmPopup = $ionicPopup.confirm({
                            title: '服务协议与隐私政策',
                            templateUrl: '../templates/tab-privacyAgree.html',
                            // template: '欢迎使用爱鲸准APP,在你使用爱鲸准APP服务前，请认真阅读《服务协议》和《隐私协议》全部条款。我们非常重视您的用户权益与个人信息的保护，我们将通过上诉协议向你说明我们如何为你提供服务并保障你的用户权益，如你同意，请点击“同意并继续”接受我们的服务。',
                            cssClass: 'new_confirm',//自定义的样式名称，在这个样式名称下修改popup的样式，用以覆盖默认样式。
                            cancelText: '不同意并退出',//取消按钮
                            okText: '同意并继续',//确认按钮
                        })
                        confirmPopup.then(function(res) {
                            if(res){ //同意
                                localStorage.setItem("isApply",true)
                                //判断当前是否是苹果机
                                if (ionic.Platform.isIOS()) {
                                    
                                }else{
                                    //app android 自动更新
                                    var versionCode = AppVersion.build
                                    // alert(versionCode,'versionCode')
                                    var updateUrl = "https://jingzhun.s3.cn-northwest-1.amazonaws.com.cn/app/version.xml";
                                    window.AppUpdate.checkAppUpdate(
                                        function () {
                                            console.log("success");
                                        }, 
                                        function () {
                                            console.log("fail");
                                        }, updateUrl
                                    )
                                }
                            }else{ //不同意
                                navigator.app.exitApp()
                            }
                        });
                    }else{
                        //判断当前是否是苹果机
                        if (ionic.Platform.isIOS()) {
                            
                        }else{
                            //app android 自动更新
                            var versionCode = AppVersion.build
                            // alert(versionCode,'versionCode')
                            var updateUrl = "https://jingzhun.s3.cn-northwest-1.amazonaws.com.cn/app/version.xml";
                            window.AppUpdate.checkAppUpdate(
                                function () {
                                    console.log("success");
                                }, 
                                function () {
                                    console.log("fail");
                                }, updateUrl
                            )
                        }
                    }
                }
                if (window.cordova && window.cordova.plugins.Keyboard) {
                  window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
                  if (window.ionic.Platform.isIOS()) {
                    window.cordova.plugins.Keyboard.disableScroll(true);
                  }
                }
                //app版本号获取
                window.cordova.getAppVersion.getVersionNumber().then(function (version){
                    // localStorage.setItem('versionCode',version)
                    locals.set("versionCode", version)
                })
              });
            window.Keyboard.hideKeyboardAccessoryBar(false);
        }        
        //适配刘海屏
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
        //    StatusBar.backgroundColorByHexString("#072c4c");
       
           StatusBar.getStatusBarHeight(function (height) {
             if (!height) return;
             handleNotchStatusBar(Number(height));
           });
        }
       
        var handleNotchStatusBar = function (statusBarHeight) {
            var normalHeight = 0;
            var platformStr = "";
        
            if (ionic.Platform.isIOS()) {
                normalHeight = 20;
                platformStr = "ios";
            } else if (ionic.Platform.isAndroid()) {
                normalHeight = 24;
                platformStr = "android"
            }
        
            if (statusBarHeight === normalHeight) {
                return;
            }
        
            var styleSheets = document.styleSheets;
            for (var i = 0; i < styleSheets.length; i++) {
                var sheet = styleSheets[i];
                if (sheet.href && sheet.href.indexOf('your css file path') !== -1) {
                for (var j = 0; j < sheet.cssRules.length; j++) {
                    var rule = sheet.cssRules[j];
                    var subStr = '.platform-' + platformStr + '.platform-cordova';
        
                    if (rule.selectorText && rule.selectorText.indexOf(subStr) !== -1) {
                    if (rule.style.height) {
                        var modifyHeight = Number(rule.style.height.substr(0, rule.style.height.length - 2)) + statusBarHeight - normalHeight;
                        rule.style.height = modifyHeight + 'px';
                    }
        
                    if (rule.style.top) {
                        var modifyTop = Number(rule.style.top.substr(0, rule.style.top.length - 2)) + statusBarHeight - normalHeight;
                        rule.style.top = modifyTop + 'px';
                    }
        
                    if (rule.style.marginTop) {
                        var modifyMarginTop = Number(rule.style.marginTop.substr(0, rule.style.marginTop.length - 2)) + statusBarHeight - normalHeight;
                        rule.style.marginTop = modifyMarginTop + 'px';
                    }
                    }
                }
                break;
                }
            }
        };
    }); 
}

)
// 搜索页面的滚动高度
.directive('scrollHeight',function($window){
    return{
        restrict:'AE',
        link:function(scope,element,attr){
        element[0].style.height=($window.innerHeight-44-84-44)+'px';
        }
    }
})
// 跟踪列表的滚动高度
.directive('scrollHeight2',function($window){
    return{
        restrict:'AE',
        link:function(scope,element,attr){
        element[0].style.height=($window.innerHeight-44-71-47)+'px';
        }
    }
})
// 船期列表的滚动高度
.directive('scrollHeight3',function($window){
    return{
        restrict:'AE',
        link:function(scope,element,attr){
        element[0].style.height=($window.innerHeight-44-61)+'px';
        }
    }
})
//键盘弹出问题
.directive('focusInput', ['$ionicScrollDelegate', '$window', '$timeout', '$ionicPosition', function ($ionicScrollDelegate, $window, $timeout, $ionicPosition) {
    return {
        restrict: 'A',
        scope: false,
        link: function ($scope, iElm, iAttrs, controller) {
            if (ionic.Platform.isIOS()) {
                iElm.on('focus', function () {
                    var top = $ionicScrollDelegate.getScrollPosition().top;
                    var eleTop = ($ionicPosition.offset(iElm).top) / 2
                    var realTop = eleTop + top;
                    $timeout(function () {
                        if (!$scope.$last) {
                            $ionicScrollDelegate.scrollTo(0,realTop);
                        } else {
                            try {
                                var aim = angular.element(document).find('.scroll')
                                aim.css('transform', 'translate3d(0px,' + '-' + realTop + 'px, 0px) scale(1)');
                                $timeout(function () {
                                    iElm[0].focus();
                                }, 100)
                            } catch (e) {
                            }
                        }
                    }, 500)
                })
            }

        }
    }
}])

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider,$httpProvider) {
    $httpProvider.interceptors.push("httpInterceptor");
    $ionicConfigProvider.tabs.position('bottom'); //杨卿林 保证任何平台底部tab必须在底部
    $ionicConfigProvider.backButton.text("");
    $ionicConfigProvider.backButton.previousTitleText(false);
    $ionicConfigProvider.views.swipeBackEnabled(false)

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    //     .state("login", {
    //     url: "/login",
    //     templateUrl: "/pages/login/index.html",
    //     controller: 'loginController'
    // })

    // setup an abstract state for the tabs directive
        .state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'templates/tabs.html'
        })
        .state('tab.my', {
            url: '/my',
            views: {
                'tab-my': {
                    templateUrl: 'templates/tab-my.html',
                    controller: 'myController'
                }
            },
            cache: false,
        })
        .state('tab.my-about', {
            url: '/my/about',
            views: {
                'tab-my': {
                    templateUrl: 'templates/tab-my-about.html',
                    controller: 'myController'
                }
            },
            cache: false,
            params: {
                isCache: true
            }
        })
        .state('tab.my-about-info', {
            url: '/my/about/:id/:title',
            views: {
                'tab-my': {
                    templateUrl: 'templates/tab-my-about-info.html',
                    controller: 'myController'
                }
            },
            cache: false,
            params: {
                isCache: true
            }
        })
        .state('tab.my-detail', {
            url: '/my/:id/:type/:name',
            views: {
                'tab-my': {
                    templateUrl: 'templates/tab-my-detail.html',
                    controller: 'myController'
                }
            },
            cache: false,
            params: {
                isCache: true
            }
        })
        .state('tab.my-detail-edit', {
            url: '/my/edit/:id/:placehode/:name',
            views: {
                'tab-my': {
                    templateUrl: 'templates/tab-my-detail-edit.html',
                    controller: 'myController'
                }
            },
            cache: false,
            params: {
                isCache: true
            }
        })
        .state('tab.login', {
            url: '/login',
            views: {
                'tab-my': {
                    templateUrl: 'templates/tab-login.html',
                    controller: 'loginController'
                }
            },
            cache: false,
            params: {
                isCache: true
            }
        })
        .state('tab.login-phpne', {
            url: '/login/loginphone',
            views: {
                'tab-my': {
                    templateUrl: 'templates/tab-login-phone.html',
                    controller: 'loginController'
                }
            },
            cache: false,
            params: {
                isCache: true
            }
        })
        .state('tab.login-getcode', {
            url: '/login/logingetcode/:phonecode/:phone/:code',
            views: {
                'tab-my': {
                    templateUrl: 'templates/tab-login-getcode.html',
                    controller: 'loginController'
                }
            },
            cache: false,
            params: {
                isCache: true
            }
        })
        .state('tab.tab-customer', {
            url: '/customer',
            views: {
                'tab-my': {
                    templateUrl: 'templates/tab-customer.html',
                    controller: 'customerController'
                }
            },
            cache: false,
            params: {
                isCache: true
            }
        })
        .state('tab.register-phone', {
            url: '/register/registerphone',
            views: {
                'tab-my': {
                    templateUrl: 'templates/tab-register-phone.html',
                    controller: 'registerController'
                }
            },
            cache: false,
            params: {
                isCache: true
            }
        })
        .state('tab.register-getcode', {
            url: '/register/registergetcode/:phonecode/:phone/:code',
            views: {
                'tab-my': {
                    templateUrl: 'templates/tab-register-getcode.html',
                    controller: 'registerController'
                }
            },
            cache: false,
            params: {
                isCache: true
            }
        })
        .state('tab.register-perfection', {
            url: '/register/perfection/:phonecode/:phone/:code',
            views: {
                'tab-my': {
                    templateUrl: 'templates/tab-register-perfection.html',
                    controller: 'registerController'
                }
            },

        })
        .state('tab.register-agreement', {
            url: '/register/agreement',
            views: {
                'tab-my': {
                    templateUrl: 'templates/tab-register-agreement.html',
                    controller: 'registerController'
                }
            },

        })
        .state('tab.forgetpassword-phone', {
            url: '/forgetpassword/forgetpasswordphone',
            views: {
                'tab-my': {
                    templateUrl: 'templates/tab-forgetpassword-phone.html',
                    controller: 'forgetpasswordController'
                }
            },
            cache: false,
            params: {
                isCache: true
            }
        })
        .state('tab.forgetpassword-getcode', {
            url: '/forgetpassword/forgetpasswordgetcode/:phonecode/:phone/:code',
            views: {
                'tab-my': {
                    templateUrl: 'templates/tab-forgetpassword-getcode.html',
                    controller: 'forgetpasswordController'
                }
            },
            cache: false,
            params: {
                isCache: true
            }
        })
        .state('tab.forgetpassword-reset', {
            url: '/forgetpassword/reset/:phonecode/:phone',
            views: {
                'tab-my': {
                    templateUrl: 'templates/tab-forgetpassword-reset.html',
                    controller: 'forgetpasswordController'
                }
            },
            cache: false,
            params: {
                isCache: true
            }
        })
        // Each tab has its own nav history stack:
        .state('tab.yang', {
            url: '/yang',
            views: {
                'tab-yang': {
                    templateUrl: 'templates/tab-yang.html',
                    controller: 'yangController'
                }
            }
        })
        .state('tab.yang-detail', {
            url: '/yang/:id',
            views: {
                'tab-yang': {
                    templateUrl: 'templates/tab-yang-detail.html',
                    controller: 'yangController'
                }
            }
        })

        .state('tab.yang-detail-vip', {
            url: '/yang-vip/:id',
            views: {
                'tab-yang': {
                    templateUrl: 'templates/tab-yang-detail-vip.html',
                    controller: 'yangController'
                }
            }
        })
        .state('tab.dash', {
            url: '/dash',
            views: {
                'tab-dash': {
                    templateUrl: 'templates/tab-dash.html',
                    controller: 'DashCtrl'
                }
            }
        })

        .state('tab.track', {
            url: '/track',
            views: {
                'tab-trackList': {
                    templateUrl: 'templates/tab-track.html',
                }
            }
        })
        .state('tab.trackAdd', {
            url: '/trackAdd',
            views: {
                'tab-trackList': {
                    templateUrl: 'templates/tab-trackAdd.html',
                    controller: 'trackController'
                }
            }
        })
        .state('tab.trackList', {
            url: '/trackList',
            params: {'isAddTrack': null},
            views: {
                'tab-trackList': {
                    templateUrl: 'templates/tab-trackList.html',
                    controller: 'trackController'
                }
            }
        })
        .state('tab.trackSearch', {
            url: '/trackSearch',
            views: {
                'tab-trackList': {
                    templateUrl: 'templates/tab-trackSearch.html'

                }
            }
        })
        .state('tab.track-detail', {
            url: '/track/:referenceno/:id',
            views: {
                'tab-trackList': {
                    templateUrl: 'templates/track-detail.html',
                    controller: 'trackController'
                }
            }
        })
        //船公司搜索页面
        .state('tab.CarrierSearch', {
            url: '/CarrierSearch/:ref_nameCn',
            views: {
                'tab-trackList': {
                    templateUrl: 'templates/tab-CarrierSearch.html'

                }
            }
        })
        //跟踪页面起始港目的港
        .state('tab.track-portSearch', {
            url: '/track-portSearch/:type/:title',
            views: {
                'tab-trackList': {
                    templateUrl: 'templates/tab-track-portSearch.html',
                    controller: 'trackPortSearchController'
                }
            }
        })

        //船期搜索页
        .state('tab.sailSchedule', {
            url: '/sailSchedule',
            views: {
                'tab-sailSchedule': {
                    templateUrl: 'templates/tab-sailSchedule.html',
                    controller: 'sailScheduleController'
                }
            }
        })
        //起始港目的港页
        .state('tab.portSearch', {
            url: '/portSearch/:type/:title',
            views: {
                'tab-sailSchedule': {
                    templateUrl: 'templates/tab-portSearch.html',
                    controller: 'portSearchController'
                }
            }
        })
        //船期列表页
        .state('tab.sailScheduleList', {
            url: '/sailScheduleList/:startId/:endId/:dateType/:Time/:userType/:userId/:userIp/:title',
            views: {
                'tab-sailSchedule': {
                    templateUrl: 'templates/tab-sailScheduleList.html',
                    controller: 'sailScheduleListController'
                }
            }
        })
        //船期详情页
        .state('tab.sailScheduleDetail', {
            url: '/sailScheduleDetail/:id',
            views: {
                'tab-sailSchedule': {
                    templateUrl: 'templates/tab-sailScheduleDetail.html',
                    controller: 'sailScheduleDetailController'
                }
            }
        })
        //地图页
        .state('tab.path', {
            url: '/path',
            views: {
                'tab-path': {
                    templateUrl: 'templates/tab-path.html',
                    controller: 'pathController'
                }
            }
        })
        .state('tab.chats', {
            url: '/chats',
            views: {
                'tab-chats': {
                    templateUrl: 'templates/tab-chats.html',
                    controller: 'ChatsCtrl'
                }
            }
        })
        .state('tab.chat-detail', {
            url: '/chats/:chatId',
            views: {
                'tab-chats': {
                    templateUrl: 'templates/chat-detail.html',
                    controller: 'ChatDetailCtrl'
                }
            }
        })
        .state('tab.account', {
            url: '/account',
            views: {
                'tab-account': {
                    templateUrl: 'templates/tab-account.html',
                    controller: 'AccountCtrl'
                }
            }
        });


    // if none of the above states are matched, use this as the fallback
    // $urlRouterProvider.otherwise('/tab/dash');
    $urlRouterProvider.otherwise('/tab/sailSchedule');

});

if (window.StatusBar) {
    // org.apache.cordova.statusbar required
   StatusBar.styleDefault();

   StatusBar.getStatusBarHeight(function (height) {
     if (!height) return;
     handleNotchStatusBar(Number(height));
   });
}

var handleNotchStatusBar = function (statusBarHeight) {
   var normalHeight = 0;
   var platformStr = "";

   if (ionic.Platform.isIOS()) {
     normalHeight = 20;
     platformStr = "ios";
   } else if (ionic.Platform.isAndroid()) {
     normalHeight = 24;
     platformStr = "android"
   }

   if (statusBarHeight === normalHeight) {
     return;
   }

   var styleSheets = document.styleSheets;
   for (var i = 0; i < styleSheets.length; i++) {
     var sheet = styleSheets[i];
     if (sheet.href && sheet.href.indexOf('your css file path') !== -1) {
       for (var j = 0; j < sheet.cssRules.length; j++) {
         var rule = sheet.cssRules[j];
         var subStr = '.platform-' + platformStr + '.platform-cordova';

         if (rule.selectorText && rule.selectorText.indexOf(subStr) !== -1) {
           if (rule.style.height) {
             var modifyHeight = Number(rule.style.height.substr(0, rule.style.height.length - 2)) + statusBarHeight - normalHeight;
             rule.style.height = modifyHeight + 'px';
           }

           if (rule.style.top) {
             var modifyTop = Number(rule.style.top.substr(0, rule.style.top.length - 2)) + statusBarHeight - normalHeight;
             rule.style.top = modifyTop + 'px';
           }

           if (rule.style.marginTop) {
             var modifyMarginTop = Number(rule.style.marginTop.substr(0, rule.style.marginTop.length - 2)) + statusBarHeight - normalHeight;
             rule.style.marginTop = modifyMarginTop + 'px';
           }
         }
       }
       break;
     }
   }
};