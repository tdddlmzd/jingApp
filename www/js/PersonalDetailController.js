angular.module('starter.controllers', ['ngResource', 'ngCordova'])
    // .controller('PersonalDetailController', function($scope, $http, $resource, $ionicActionSheet, $cordovaCamera, $cordovaFileTransfer) {
    .controller('PersonalDetailController', function($scope, $http, $resource) {

        $scope.model = {};

        $scope.init = function() {
            console.log('in init function');
            $scope.username = '刘嵩';
        }

        //上传头像
        // 添加图片
        // $scope.addPhoto = function() {
        //     console.log("进来了");
        //     $ionicActionSheet.show({
        //         /* cancelOnStateChange: true,
        //          cssClass: 'action_s',*/
        //         titleText: "请选择获取图片方式",
        //         buttons: [{
        //             text: '<b>拍照</b> 上传'
        //         }, {
        //             text: '从 <b>相册</b> 中选'
        //         }],
        //         cancelText: '取消',
        //         cancel: function() {
        //             return true;
        //         },
        //         buttonClicked: function(index) {
        //             switch (index) {
        //                 case 0:
        //                     $scope.takePhoto();
        //                     break;
        //                 case 1:
        //                     $scope.pickImage();
        //                     break;
        //                 default:
        //                     break;
        //             }
        //             return true;
        //         }
        //     });
        // };
        //拍照
        // $scope.takePhoto = function() {
        //     var options = {
        //         quality: 100,
        //         destinationType: Camera.DestinationType.FILE_URI, //Choose the format of the return value.
        //         sourceType: Camera.PictureSourceType.CAMERA, //资源类型：CAMERA打开系统照相机；PHOTOLIBRARY打开系统图库
        //         targetWidth: 150, //头像宽度
        //         targetHeight: 150 //头像高度
        //     };
        //     $cordovaCamera.getPicture(options)
        //         .then(function(imageURI) {
        //             //Success
        //             $scope.imageSrc = imageURI;
        //             //$scope.uploadPhoto();
        //             var confirmPopup = $ionicPopup.confirm({
        //                 title: '<strong>提示</strong>',
        //                 template: '确认更新头像?',
        //                 okText: '确认',
        //                 cancelText: '取消'
        //             });
        //             confirmPopup.then(function(res) {
        //                 $scope.uploadPhoto(); //调用上传功能
        //             })
        //         }, function(err) {
        //             // Error
        //         });
        // };
        //选择照片
        // $scope.pickImage = function() {
        //     var options = {
        //         maximumImagesCount: 1,
        //         quality: 100,
        //         destinationType: Camera.DestinationType.FILE_URI, //Choose the format of the return value.
        //         sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM, //资源类型：CAMERA打开系统照相机；PHOTOLIBRARY打开系统图库
        //         targetWidth: 150, //头像宽度
        //         targetHeight: 150 //头像高度
        //     };

        //     $cordovaCamera.getPicture(options)
        //         .then(function(imageURI) {
        //             //Success
        //             $scope.imageSrc = imageURI;
        //             // $scope.imageSrc= imageURI.substring(0,imageURI.lastIndexOf("?"));//获取手机上的图片可能后面出现？时间戳
        //             // $scope.uploadPhoto();
        //             var confirmPopup = $ionicPopup.confirm({
        //                 title: '<strong>提示</strong>',
        //                 template: '确认更新头像?',
        //                 okText: '确认',
        //                 cancelText: '取消'
        //             });
        //             confirmPopup.then(function(res) {
        //                 $scope.uploadPhoto(); //调用上传
        //             })
        //         }, function(err) {
        //             // Error
        //         });
        // };


        // $scope.uploadPhoto = function() {
        //     // var requestParams = "?callback=JSON_CALLBACK";
        //     var options = new FileUploadOptions();
        //     var server = encodeURI('注意这写的是你的后台请求地址');
        //     var fileURL = $scope.imageSrc;
        //     alert("1 fileURL= " + fileURL);
        //     var params = {
        //         fileKey: "file", //相当于form表单项的name属性
        //         fileName: fileURL.substr(fileURL.lastIndexOf('/') + 1),
        //         mimeType: "image/jpeg",
        //         chunkedMode: true,
        //         id: $scope.user.id
        //     };
        //     options.params = params;
        //     //alert("2 options.fileKey = " +options.params.fileKey+" 3fileName= "+options.params.fileName);
        //     $cordovaFileTransfer.upload(server, fileURL, options)
        //         .then(function(result) {
        //             // Success!
        //             //alert("Code = " + result.responseCode + "Response = " + result.response+ "Sent = " + result.bytesSent);
        //             alert("头像更换成功！！");
        //         }, function(err) {
        //             // Error
        //             alert("An error has occurred: Code = " + error.code + "upload error source " + error.source + "upload error target " + error.target);
        //         }, function(progress) {
        //             // constant progress updates
        //         });

        // };
    });