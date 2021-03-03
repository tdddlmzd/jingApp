app.controller('myController', function($scope, $rootScope, $http, $resource, $translate, $state,
    $stateParams, $ionicActionSheet, $ionicLoading, locals, $ionicTabsDelegate, $cordovaCamera, $cordovaImagePicker, $ionicHistory, Popup) {
    $scope.model = {};

    $rootScope.$on('$ionicView.beforeEnter', function() {
        var statename = $state.current.name;
        if (statename === 'tab.my-detail' || statename === 'tab.my-detail-edit' || statename === 'tab.my-about' || statename === 'tab.my-about-info') {
            $ionicTabsDelegate.showBar(false); //当前页面隐藏tab

        } else {
            $ionicTabsDelegate.showBar(true);
        }
        var Namenc = locals.get("Namenc");
        var Position = locals.get("Position");
        var Company = locals.get("Company");
        var img = locals.get("uploadimage");
        if (Namenc != "" && Namenc != null && Namenc != undefined) {
            $scope.model.Namenc = Namenc;
        }
        if (Position != "" && Position != null && Position != undefined) {
            $scope.model.Position = Position;
            $("#PositionId").show();
        } else {
            $("#PositionId").hide();
        }
        if (Company != "" && Company != null && Company != undefined) {
            $scope.model.Company = Company;
        }

        if (img != undefined && img != "" && img != null) {
            $("#upimage").attr('src', img);
        }

        // $ionicTabsDelegate.showBar(true);
    })

    //按刷新页语言不变
    var yy = locals.get("lang"); //字符串缓存;
    if (yy == "zh-cn") {
        $translate.use('zh');
    } else if (yy == "us-en") {
        $translate.use('en');
    }
    $scope.openQQ = function() {
        contactCustomer()
    }
    $scope.toAbout = function() {
        location.href = "#/tab/my/about";
    }
    //语言修改
    $scope.changezh = function() {
        document.getElementById('zh').style.background = "#0983f8";
        document.getElementById('en').style.background = "#eee";
        document.getElementById('zh').style.color = "#FFF";
        document.getElementById('en').style.color = "#909090";
        $translate.use('zh');
        locals.set("lang", "zh-cn"); //字符串缓存

    }

    //语言修改
    $scope.changeen = function() {
        document.getElementById('en').style.background = "#0983f8";
        document.getElementById('zh').style.background = "#eee";
        document.getElementById('en').style.color = "#FFF";
        document.getElementById('zh').style.color = "#909090";
        $translate.use('en');
        locals.set("lang", "us-en"); //字符串缓存
    }

    //男女修改
    $scope.changeman = function(id) {
        document.getElementById('man').style.background = "#0983f8";
        document.getElementById('woman').style.background = "#eee";
        document.getElementById('man').style.color = "#FFF";
        document.getElementById('woman').style.color = "#909090";
        $scope.isman = true;
        $scope.iswoman = false;
        var login_content = locals.get("login_content"); //字符串缓存 //用户id
        var fd = new FormData(); //初始化一个FormData实例
        fd.append('id', login_content);
        fd.append('gender', id);
        locals.set("sex", "0"); //字符串缓存

        var authorization = getTokenInfor();
        try {
            var apiUrlPost = baseUrl + "/schedules/web/updateUserInfo";
            $http.post(apiUrlPost, fd, {
                headers: { 'Authorization': authorization, 'Content-Type': undefined },
                timeout: timeOut
            }).success(function(data) {
                if (data.status == 1) { //成功

                }
            }).error(function(result) {
                Popup.showAlert($translate.instant('ts_qjcwl')); //请检查网络！
            });
        } catch (er) {}
    }

    //男女修改
    $scope.changewoman = function(id) {
        document.getElementById('woman').style.background = "#0983f8";
        document.getElementById('man').style.background = "#eee";
        document.getElementById('woman').style.color = "#FFF";
        document.getElementById('man').style.color = "#909090";

        var login_content = locals.get("login_content"); //字符串缓存 //用户id
        var fd = new FormData(); //初始化一个FormData实例
        fd.append('id', login_content);
        fd.append('gender', id);
        locals.set("sex", "1"); //字符串缓存

        var authorization = getTokenInfor()
        try {
            var apiUrlPost = baseUrl + "/schedules/web/updateUserInfo";
            $http.post(apiUrlPost, fd, {
                headers: { 'Authorization': authorization, 'Content-Type': undefined },
                timeout: timeOut
            }).success(function(data) {
                if (data.status == 1) { //成功

                }

            }).error(function(result) {
                Popup.showAlert($translate.instant('ts_qjcwl')); //请检查网络！
            });
        } catch (er) {}

    }
    
    //初始化
    $scope.myinit = function() {
        
        //调取我的页面的内容
        //姓名
        var Namenc = locals.get("Namenc")
        if (Namenc != "" && Namenc != null && Namenc != undefined) {
            $scope.model.Namenc = Namenc;
        }
        //职位
        var Position = locals.get("Position")
        if (Position != "" && Position != null && Position != undefined) {
            $scope.model.Position = Position;
            $("#PositionId").show();
        } else {
            $("#PositionId").hide();
        }
        //公司
        var Company = locals.get("Company")
        if (Company != "" && Company != null && Company != undefined) {
            $scope.model.Company = Company;
        }
        //图片
        var upImage = locals.get("uploadimage")
        if (upImage != "" && upImage != null && upImage != undefined) {
            $("#upimage").attr('src', upImage)
        }

        var yy = locals.get('lang')
        if (yy == "zh-cn") {
            $translate.use('zh');
            document.getElementById('zh').style.color = "#fff";
            document.getElementById('en').style.color = "#909090";
            document.getElementById('zh').style.background = "#0983f8";
            document.getElementById('en').style.background = "#eee";
        } else if (yy == "us-en") {
            $translate.use('en');
            document.getElementById('en').style.color = "#fff";
            document.getElementById('zh').style.color = "#909090";
            document.getElementById('en').style.background = "#0983f8";
            document.getElementById('zh').style.background = "#eee";
        } else {
            //默认中文
            $translate.use('zh');
            document.getElementById('zh').style.color = "#fff";
            document.getElementById('en').style.color = "#909090";
            document.getElementById('zh').style.background = "#0983f8";
            document.getElementById('en').style.background = "#eee";
        }
        if (Namenc == "" || Namenc == undefined || Position == "" || Position == undefined || Company == "" || Company == undefined) {

            var login_content = locals.get("login_content"); //字符串缓存 //用户id()
            var authorization = getTokenInfor()
            try {
                var apiUrlPost = baseUrl + "/schedules/web/getUserInfo?id=" + login_content;
                $http.get(apiUrlPost, {
                    headers: { 'Authorization': authorization },
                    timeout: timeOut
                }).success(function(data) {
                    if (data.status == 1) { //成功
                        $scope.model.Namenc = data.content.username;
                        locals.set("Namenc", data.content.username); //字符串缓存
                        $scope.model.Company = data.content.companyName;
                        locals.set("Company", data.content.companyName); //字符串
                        // $scope.model.Position = data.content.companyPosition;
                        var ps = data.content.companyPosition;
                        if (ps != "" && ps != null && ps != undefined) {
                            $scope.model.Position = ps;
                            locals.set("Position", ps); //字符串
                            $("#PositionId").show();
                        } else {
                            $("#PositionId").hide();
                            locals.set("Position", ""); //字符串
                        }
                        $scope.model.Phone = data.content.phone
                        locals.set("Phone", data.content.phone) //字符串
                        $scope.model.Tel = data.content.workPhone
                        locals.set("Tel", data.content.workPhone) //
                        $scope.model.Email = data.content.email
                        locals.set("Email", data.content.email) //字符串

                        var avatarUrl = data.content.avatarUrl
                        if (avatarUrl != undefined && avatarUrl != "" && avatarUrl != null) {
                            locals.set("uploadimage", avatarUrl)
                            $("#upimage").attr('src', avatarUrl)
                        }
                        var sex = data.content.gender;
                        if (sex != "" && sex != undefined && sex != null) {
                            if (sex == 0) { // 性别0男1女                       
                                locals.set("sex", "0"); //字符串缓存
                            } else if (sex == 1) {
                                locals.set("sex", "1"); //字符串缓存
                            }
                        }
                    }
                });
            } catch (er) {}

        }
    }

    //返回我的页面
    $scope.goBackMy = function(){
        location.href = "#/tab/my";
    },
    //返回我的页面
    $scope.goBackMyDetail = function(){
        location.href = "#/tab/my/1//";
    },
    $scope.aboutinit = function () {
        // var versionCode = localStorage.getItem('versionCode')
        var versionCode = locals.get("versionCode")
        $scope.versionCode = versionCode
    }
    //个人信息详情初始化
    $scope.detailinit = function() {
        var Namenc = locals.get("Namenc");
        var Position = locals.get("Position");
        var Company = locals.get("Company");
        var Phone = locals.get("Phone");
        var Tel = locals.get("Tel");
        var Email = locals.get("Email");
        var sex = locals.get("sex");
        var upImage = locals.get("uploadimage");
        if (sex == "0") {
            document.getElementById('man').style.background = "#0983f8";
            document.getElementById('woman').style.background = "#eee";
            document.getElementById('man').style.color = "#fff";
            document.getElementById('woman').style.color = "#909090";
        }
        if (sex == "1") {
            document.getElementById('woman').style.background = "#0983f8";
            document.getElementById('man').style.background = "#eee";
            document.getElementById('woman').style.color = "#fff";
            document.getElementById('man').style.color = "#909090";
        }
        if (Namenc != "" && Namenc != null || Namenc != undefined) {
            $scope.model.Namenc = Namenc;
        }
        if (Position != "" && Position != null || Position != undefined) {
            $scope.model.Position = Position;
        }
        if (Company != "" && Company != null || Company != undefined) {
            $scope.model.Company = Company;
            if (Company.length > 19) {
                //$("#companystr").attr();
                $("#companystr").css({ "right": "15px", "display": "inline-block", "width": "19em", "top": "20px", "line-height": "14px" });
            } else {
                $("#companystr").css({ "right": "15px", "display": "inline-block", "width": "19em" });

            }

        }
        if (Phone != "" && Phone != null || Phone != undefined) {
            $scope.model.Phone = Phone;
        }
        if (Tel != "" && Tel != null || Tel != undefined) {
            $scope.model.Tel = Tel;
        }
        if (Email != "" && Email != null || Email != undefined) {
            $scope.model.Email = Email;
            if (Email.length > 19) {
                //$("#companystr").attr();
                $("#emailstr").css({ "right": "15px", "display": "inline-block", "width": "19em", "top": "20px", "line-height": "14px" });
            } else {
                $("#emailstr").css({ "right": "15px", "display": "inline-block", "width": "19em" });

            }

        }
        if (upImage != "" && upImage != null && upImage != undefined) {
            $("#imageId").attr('src', upImage);
        }
    }
    //跳转协议页面
    $scope.agreement = function(id){
        if(id == 1){//服务协议
            top.location.href = "#/tab/my/about/" + id + "/" + $translate.instant('sjqty_fwxy')
        }else if(id == 2){//隐私协议
            top.location.href = "#/tab/my/about/" + id + "/" + $translate.instant('sjqty_ysxy')
        }
    }
    //跳转调修改页面
    $scope.edit = function(id) {
        var param = "";
        if (id == 1) { //昵称
            if ($scope.model.Namenc == undefined || $scope.model.Namenc == null) {
                param = "";

            } else {
                param = $scope.model.Namenc;
            }

            if ($scope.model.Namenc != undefined && $scope.model.Namenc != null && $scope.model.Namenc.indexOf("/") != -1) {
                param = $scope.model.Namenc.replace(/\//g, "!");
            }
            top.location.href = "#/tab/my/edit/" + id + "/" + $translate.instant('sjqty_nc') + "/" + param;

        } else if (id == 3) {
            if ($scope.model.Position == undefined || $scope.model.Position == null) {
                param = "";

            } else {
                param = $scope.model.Position;
            }
            if ($scope.model.Position != undefined && $scope.model.Position != null && $scope.model.Position.indexOf("/") != -1) {
                param = $scope.model.Position.replace(/\//g, "!");
            }
            top.location.href = "#/tab/my/edit/" + id + "/" + $translate.instant('sjqty_zw') + "/" + param;

        } else if (id == 4) {
            if ($scope.model.Company == undefined || $scope.model.Company == null) {
                param = "";

            } else {
                param = $scope.model.Company;
            }
            if ($scope.model.Company != undefined && $scope.model.Company != null && $scope.model.Company.indexOf("/") != -1) {
                param = $scope.model.Company.replace(/\//g, "!");
            }
            top.location.href = "#/tab/my/edit/" + id + "/" + $translate.instant('sjqty_ssgs') + "/" + param;

        } else if (id == 5) {
            if ($scope.model.Phone == undefined || $scope.model.Phone == null) {
                param = "";

            } else {
                param = $scope.model.Phone;
            }
            if ($scope.model.Phone != undefined && $scope.model.Phone != null && $scope.model.Phone.indexOf("/") != -1) {
                param = $scope.model.Phone.replace(/\//g, "!");
            }
            top.location.href = "#/tab/my/edit/" + id + "/" + $translate.instant('sjqty_sj') + "/" + param;

        } else if (id == 6) {
            if ($scope.model.Tel == undefined || $scope.model.Tel == null) {
                param = "";

            } else {
                param = $scope.model.Tel;
            }
            if ($scope.model.Tel != undefined && $scope.model.Tel != null && $scope.model.Tel.indexOf("/") != -1) {
                param = $scope.model.Tel.replace(/\//g, "!");
            }
            top.location.href = "#/tab/my/edit/" + id + "/" + $translate.instant('sjqty_zj') + "/" + param;
        } else if (id == 7) {
            if ($scope.model.Email == undefined && $scope.model.Email == null) {
                param = "";

            } else {
                param = $scope.model.Email;
            }
            if ($scope.model.Email != undefined && $scope.model.Email != null && $scope.model.Email.indexOf("/") != -1) {
                param = $scope.model.Email.replace(/\//g, "!");
            }
            top.location.href = "#/tab/my/edit/" + id + "/" + $translate.instant('sjqty_yx') + "/" + param;
        }


    }
    $scope.cancelName = function() {
        $scope.model.editname = "";
        $("#editname").focus();
    }

    //个人信息修改初始化
    $scope.mydetaileditinit = function() {
        var id = $stateParams.id;
        var placehode = $stateParams.placehode;
        var name = $stateParams.name;
        if (name == undefined || name == null) {
            name = "";
        } else if (name.indexOf("!") != -1) {
            name = name.replace(/!/g, '/');
        }
        $("#type").val(id);
        $scope.model.placehode = placehode;
        $scope.model.editname = name;
    }
    // 协议页面初始化
    $scope.myaboutinit = function(){
        $scope.title = $stateParams.title
        $scope.myAboutId = $stateParams.id
    }
    //修改保存
    $scope.save = function() {
        var type = $("#type").val();
        var editname = $scope.model.editname
        var login_content = locals.get("login_content"); //字符串缓存 //用户id

        var apiUrlPost = baseUrl + "/schedules/web/updateUserInfo";
        var fd = new FormData(); //初始化一个FormData实例
        fd.append('id', login_content);
        if (type == "1" && editname != "" && editname != undefined) { //昵称
            fd.append('username', editname);
        } else if (type == "1" && (editname == "" || editname == undefined)) {
            Popup.showAlert($translate.instant('dlzc_qsrzsxm')); //请输入真实姓名',
            return false;
        }
        if (type == "3" && editname != "" && editname != undefined) {
            fd.append('companyPosition', editname);
        } else if (type == "3" && (editname == "" || editname == undefined)) {
            Popup.showAlert($translate.instant('dlzc_qsrgszw')); //请输入公司职位
            return false;
        }
        if (type == "4" && editname != "" && editname != undefined) {
            fd.append('companyName', editname);
        } else if (type == "4" && (editname == "" || editname == undefined)) {
            Popup.showAlert($translate.instant('dlzc_qsrgsmc')); //请输入公司名称',
            return false;
        }
        var ret = /^1\d{10}$/;
        if (type == "5" && (editname == "" || editname == undefined)) {
            Popup.showAlert($translate.instant('dlzc_qsrndsjhm')); //请输入您的手机号码
            return false;
        } else
        if (type == "5" && !ret.test(editname)) {
            Popup.showAlert($translate.instant('dlzc_sjhssz')); //
            return false;
        } else
        if (type == "5" && editname != "" && editname != undefined) {
            fd.append('phone', editname);
        }
        var rem = /^\d{3,4}-\d{7,8}$/;
        if (type == "6" && (editname == "" || editname == undefined)) {
            Popup.showAlert($translate.instant('dlzc_qsrbgdh'));
            return false;
        } else if (type == "6" && !rem.test(editname)) {
            Popup.showAlert($translate.instant('dlzc_zjgsbd')); //
            return false;
        } else if (type == "6" && editname != "" && editname != undefined) {
            fd.append('workPhone', editname);
        }
        var reg = /^([a-zA-Z\d])(\w|\-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4}$/;
        if (type == "7" && (editname == "" || editname == undefined)) {
            Popup.showAlert($translate.instant('dlzc_qsryxdz'));
            return false;
        } else if (type == "7" && !reg.test(editname)) {
            Popup.showAlert($translate.instant('dlzc_yxgscw')); //邮箱
            return false;
        } else if (type == "7") {
            fd.append('email', editname);
        }
        //上传中
        $ionicLoading.show({
            template: $translate.instant('sjcq_jzz')
        });
        var authorization = getTokenInfor()
        $http.post(apiUrlPost, fd, {
            headers: { 'Authorization': authorization, 'Content-Type': undefined },
            timeout: timeOut
        }).success(function(data) {
            if (data.status == 1) { //成功
                if (type == "1") { //昵称
                    locals.set("Namenc", editname); //字符串缓存
                }
                if (type == "3") {
                    locals.set("Position", editname); //字符串
                }
                if (type == "4") {
                    locals.set("Company", editname); //字符串
                }
                if (type == "5") {
                    locals.set("Phone", editname); //字符串
                }
                if (type == "6") {
                    locals.set("Tel", editname); //
                }
                if (type == "7") {
                    locals.set("Email", editname); //字符串
                }
                // $ionicHistory.goBack();
                $ionicLoading.hide();
                history.back(-1);
            } else {
                $ionicLoading.hide();
                Popup.showAlert($translate.instant('dlzc_bcsb')); //保存失败
            }
        }).error(function(result) {
            $ionicLoading.hide();
            Popup.showAlert($translate.instant('ts_qjcwl')); //请检查网络！
        });
    }

    //退出登录
    $scope.out = function() {
        locals.set("login_content", ""); //字符串缓存 //用户id
        locals.set("Namenc", ""); //字符串缓存
        locals.set("Company", ""); //字符串
        locals.set("Position", ""); //字符串
        locals.set("Phone", ""); //字符串
        locals.set("Tel", ""); //
        locals.set("Email", ""); //字符串
        locals.set("uploadimage", ""); //字符串
        locals.set("sex", ""); //字符串
        location.href = "/#/tab/login";
        location.reload();
        localStorage.removeItem('storedInfor')
        localStorage.removeItem('gateway_token')
    }

    //语言切换
    $scope.slideIndexSearch = -1;
    $scope.activeSlideSearch = function(index) {
        $scope.slideIndexSearch = index;
    };

    /*********************调用相机********************/

    document.addEventListener("deviceready", function() {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };

        $scope.openCamera = function() {
            $cordovaCamera.getPicture(options).then(function(imageData) {
                var image = document.getElementById('imageFile');
                image.src = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                // error
            });
        }, false;



        /* ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ 方法2 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ */
        $scope.getCamera = function() {
            if ($scope.data.y_image.length < 9) {
                var options = {
                    quality: 70,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    //allowEdit: true,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 480,
                    targetHeight: 720,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false
                };
                $cordovaCamera.getPicture(options).then(function(imageData) {
                    var imagedata = imageData;
                    $scope.data.isimage = true;
                    $ionicLoading.show({
                        template: '图片上传中...'
                    });
                    client.UpdateImage(imagedata, function(result) {
                        $ionicLoading.hide();
                        $scope.data.y_image.push({ 'src': "data:image/jpeg;base64," + imageData, 'val': '/Yuonhtt_FileUpload/img/' + result });
                        $scope.$digest();
                    }, function(name, err) {
                        alert(err);
                    });
                }, function(err) {
                    console.log(err);
                });
            } else {
                var confirmPopup = $ionicPopup.alert({
                    title: '提醒',
                    template: '上传图片超过9张!',
                    okText: '确 认',
                    okType: 'button-assertive'
                });
                confirmPopup.then(function(res) {});
            }

        };

        /* ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ 方法3 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ */
        // 上传文件
        $scope.postUploadFile = function() {
            $ionicActionSheet.show({
                buttons: [{
                        text: '相机'
                    },
                    {
                        text: '图库'
                    }
                ],
                cancelText: '关闭',
                cancel: function() {
                    return true;
                },
                buttonClicked: function(index) {
                    switch (index) {
                        case 0:
                            $scope.pickImage(1); // 相机
                            break;
                        case 1:
                            $scope.pickImage(0); // 相册
                            break;
                        default:
                            break;
                    }
                    return true;
                }
            });
        }

        // 调用 相机 相册
        $scope.pickImage = function(type) {
            var options = {
                //这些参数可能要配合着使用，比如选择了sourcetype是0，destinationtype要相应的设置
                quality: 100, //相片质量0-100
                destinationType: 0, //返回类型：DATA_URL= 0，返回作为 base64 編碼字串。 FILE_URI=1，返回影像档的 URI。NATIVE_URI=2，返回图像本机URI (例如，資產庫)
                sourceType: 0, //从哪里选择图片：PHOTOLIBRARY=0，相机拍照=1，SAVEDPHOTOALBUM=2。0和1其实都是本地图库
                allowEdit: false, //在选择之前允许修改截图
                encodingType: 0, //保存的图片格式： JPEG = 0, PNG = 1
                targetWidth: 800, //照片宽度
                targetHeight: 800, //照片高度
                mediaType: 2, //可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
                cameraDirection: 0, //枪后摄像头类型：Back= 0,Front-facing = 1
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: true //保存进手机相册
            };
            $cordovaCamera.getPicture(options).then(function(data) {
                $scope.uploadFile(data); //图片上传
            }, function(err) {
                // console.log(err);
            });
        };

        //图片上传
        $scope.isUpLoad = false;
        $scope.Jh2Host = '';
        $scope.uploadFile = function(data) {
            var fileUrl = data.split("/0/").pop();
            var filename = data.split("/").pop();
            var targetPath = cordova.file.externalRootDirectory + fileUrl; //APP下载存放的路径，可以使用cordova file插件进行相关配置
            console.log(targetPath);
            $scope.upInfo = '准备上传';
            $scope.isUpLoad = true;
            $scope.buttonFlag = true;
            var url = encodeURI(Jh2Host + "/Admin/postUploadFile");
            var trustHosts = true;
            var options = {
                fileName: filename,
            };
            $cordovaFileTransfer.upload(url, targetPath, options, trustHosts).then(function(result) {
                console.log(result);
                var res = JSON.parse(result.response);
                if (!res.IsErr) {
                    $scope.uploadFileName = res.Data;
                    $scope.upInfo = '上传成功';
                    $scope.buttonFlag = false;
                    $timeout(function() {
                        $scope.isUpLoad = false;
                    }, 1500)
                } else {
                    $cordovaToast.showShortBottom('上传失败');
                }

            }, function(err) {
                console.log(err);
                // $ionicLoading.hide();
            }, function(progress) {
                var downloadProgress = (progress.loaded / progress.total) * 100;
                $scope.upInfo = '已上传' + Math.floor(downloadProgress) + '%';
            });
        };

        /* ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ 方法4 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ */

        $scope.takePhoto = function() {
            var options = {
                //这些参数可能要配合着使用，比如选择了sourcetype是0，destinationtype要相应的设置
                quality: 100, //相片质量0-100
                destinationType: Camera.DestinationType.FILE_URI, //返回类型：DATA_URL= 0，返回作为 base64 編碼字串。 FILE_URI=1，返回影像档的 URI。NATIVE_URI=2，返回图像本机URI (例如，資產庫)
                sourceType: Camera.PictureSourceType.CAMERA, //从哪里选择图片：PHOTOLIBRARY=0，相机拍照=1，SAVEDPHOTOALBUM=2。0和1其实都是本地图库
                allowEdit: false, //在选择之前允许修改截图
                encodingType: Camera.EncodingType.JPEG, //保存的图片格式： JPEG = 0, PNG = 1
                targetWidth: 200, //照片宽度
                targetHeight: 200, //照片高度
                mediaType: 0, //可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
                cameraDirection: 0, //枪后摄像头类型：Back= 0,Front-facing = 1
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: true //保存进手机相册
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
                CommonJs.AlertPopup(imageData);
                var image = document.getElementById('myImage');
                image.src = imageData;
                //image.src = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                // error
                CommonJs.AlertPopup(err.message);
            });

        };

    });

    /*********************调用相册方法二********************/
    //点击事件
    $scope.getPermissions_2 = function() {

        //cordova 插件打开
        checkPermissions2()
    }

    //验证内存读取权限
    function checkPermissions2() {
        var permissions = cordova.plugins.permissions;
        permissions.hasPermission(permissions.READ_EXTERNAL_STORAGE, checkPermissionCallback, null);

        function checkPermissionCallback(status) {
            if (!status.hasPermission) {
                var errorCallback = function() {
                    alert('请在设置中打开对应权限，否则无法修改图像！');
                }
                permissions.requestPermission(
                    permissions.READ_EXTERNAL_STORAGE,
                    function(status) {
                        if (!status.hasPermission) {
                            errorCallback();
                        } else {
                            $scope.openImagePicker();
                        }
                    },
                    errorCallback);
            } else {
                $scope.openImagePicker();
            }
        }
    }

    "use strict";

    $scope.imgList = [];
    $scope.permissions = 'ready';
    $scope.permissions2 = '未打开相册';
    $scope.openImagePicker = () => {
        const options = {
            maximumImagesCount: 1, // 允许一次选中的最多照片数量
            width: 800, // 筛选宽度
            height: 600, //筛选高度
            quality: 100 //图像质量的大小，默认为100
        };
        $cordovaImagePicker.getPictures(options).then(function(results) {
            if (results.length != 0 && results != null) {
                $scope.uploadFile3(results[0]);
            }
        }, function(error) {
            // error getting photos
        });
    }

    //上传图片 走接口
    $scope.uploadFile3 = function(data) {
        try {
            var filename = data.split("/").pop()
            var authorization = getTokenInfor()
            var params = {
                Authorization: authorization,
            };
            var options = new FileUploadOptions()
            options.fileKey = "file"
            options.fileName = filename
            options.mimeType = "image/jpeg"
            options.headers = params

            var fobj = new FileTransfer()
            var uploadUrl = baseUrl + "/schedules/web/imgUpload"
            fobj.onprogress = function(progressEvent) {
                //上传中
                $ionicLoading.show({
                    template: $translate.instant('dlzc_tpscz')
                })
            };
            fobj.upload(data, encodeURI(uploadUrl),
                function(re) {
                    ///////////////////////////////图片上传成功///////////////////////
                    var _response = JSON.parse(re.response)
                    var _content = _response.content
                    // alert("_content:" + _content)
                    var avatarUrl = basic_icon + _content
                    $("#imageId").attr('src', avatarUrl)
                    locals.set("uploadimage", avatarUrl) //字符串
                    ///////////////////////////////图片保存///////////////////////

                    var login_content = locals.get("login_content") //字符串缓存 //用户id
                    var apiUrlPost = baseUrl + "/schedules/web/updateUserInfo"
                    var fd = new FormData(); //初始化一个FormData实例
                    fd.append('id', login_content)
                    fd.append('avatarUrl', _content)
                    var _authorization = getTokenInfor()
                    $http.post(apiUrlPost, fd, {
                        headers: { 'Authorization': _authorization, 'Content-Type': undefined },
                        timeout: timeOut
                    }).success(function(res) {
                        if (res.status == 1) { //成功
                            $ionicLoading.hide()
                            $("#imageId").attr('src', avatarUrl)
                            locals.set("uploadimage", avatarUrl) //字符串
                            Popup.showAlert($translate.instant('dlzc_sccg'))
                        }
                    }).error(function(result) {
                        $ionicLoading.hide()
                        //alert("上传保存" + JSON.stringify(result));
                        Popup.showAlert($translate.instant('dlzc_scsb'))
                    });
                },
                function(e) {
                    $ionicLoading.hide()
                    Popup.showAlert($translate.instant('dlzc_scsb'))
                    //alert("上传异常1" + JSON.stringify(e));

                }, options)

        } catch (e) {
            //alert("上传异常2" + JSON.stringify(e));
            Popup.showAlert($translate.instant('dlzc_scsb'))
        }
    }


    /*********************调用相册方法一********************/

    $scope.getPermissions = function() {
        // cordova 插件方法
        checkPermissions()
        $scope.permissions2 = '打开相册'
    }

    function checkPermissions() {
        const permissions = cordova.plugins.permissions,
            permissionList = [permissions.CAMERA, permissions.WRITE_EXTERNAL_STORAGE];

        function errorCallback() {
            console.warn("permissions is not turned on");
        }

        function checkPermissionCallback(status) {
            if (!status.hasPermission) {
                permissions.requestPermissions(
                    permissionList,

                    status => {
                        if (!status.hasPermission) {
                            errorCallback();
                            $scope.permissions = 'no1';
                        } else {
                            $scope.permissions = 'yes1';
                            $scope.openImagePicker();
                        }
                    }, errorCallback);
            } else {
                $scope.permissions = 'yes2';
                $scope.openImagePicker();
            }
        }
        permissions.hasPermission(permissionList, checkPermissionCallback, null);
    }
    /*
       获取读取内存权限，获取成功后打开相册并上传照片
       杨卿林
       2020-03-17
    */

    var uploadUrl = 'https://wxservice.jctrans.com/wxapi/user/UploadHeadPortrait';
    $scope.uploadFile2 = function(data) {
        var fileUrl = data.split("/0/").pop();
        var filename = data.split("/").pop();
        alert(fileUrl);
        alert(filename);
        var targetPath = cordova.file.externalRootDirectory + fileUrl; //APP下载存放的路径，可以使用cordova file插件进行相关配置
        alert(targetPath);
        $scope.upInfo = '准备上传';
        $scope.isUpLoad = true;
        $scope.buttonFlag = true;
        var url = encodeURI(uploadUrl);
        var trustHosts = true;
        var options = {
            fileName: filename,
        };
        $cordovaFileTransfer.upload(url, targetPath, options, trustHosts).then(function(result) {
            console.log(result);
            var res = JSON.parse(result);
            // if (!res.IsErr) {
            //     $scope.uploadFileName = res.Data;
            //     $scope.upInfo = '上传成功';
            //     $scope.buttonFlag = false;
            //     alert('上传成功');
            //     $timeout(function () {
            //         $scope.isUpLoad = false;
            //     }, 1500)
            // } else {
            //     alert('上传失败');
            // }
            alert(result);

        }, function(err) {
            alert(err);
            // $ionicLoading.hide();
        }, function(progress) {
            var downloadProgress = (progress.loaded / progress.total) * 100;
            $scope.upInfo = '已上传' + Math.floor(downloadProgress) + '%';
        });
    };

    $scope.viewTitle = '开始';
    $scope.switchTitle = function() {
        $scope.viewTitle = '标题更换';
    }

});