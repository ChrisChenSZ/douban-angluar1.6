/**
 * Created by Administrator on 2017/6/18.
 */
(function (angular) {

    //1.创建模块
    var app = angular.module('app',['ngRoute']);

    //2.创建整个应用的控制器
    app.controller('AppController',['$scope',function ($scope) {
            $scope.title = "豆瓣电影";
    }]);

    //3.配置路由
    app.config(['$routeProvider',function ($routeProvider) {
            $routeProvider.when('/movie/:type',{
                templateUrl:'list_tpl.html',
                controller:'MovieController'
            }).when('/detail/:id',{
                templateUrl:'movie_detail_tpl.html',
                controller:'DetailController'
            }).otherwise({
                redirectTo:'/movie/in_theaters'
            });
    }]);

    app.config(['$sceDelegateProvider',function ($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'https://api.douban.com/**'
        ]);
    }]);



    app.value('baseUrl','https://api.douban.com/v2/movie/');


    /*创建MovieController控制器*/
    app.controller('MovieController',['$scope','$routeParams','baseUrl','xmgHttp',
        function ($scope,$routeParams,baseUrl,xmgHttp) {

        $scope.isLoading = true;

        var url = baseUrl +  $routeParams.type;
        console.log(url);
        //https://api.douban.com/v2/movie/coming_soon
        //http://localhost:63342/douban/
            var params = {
                start:0,
                count:5
            };
            xmgHttp.jsonp(url,params,function (res) {
                console.log('--call--',res);
                $scope.res = res;
                $scope.isLoading = false;
                $scope.$apply();
            });


    }]);
    
    
    app.controller('DetailController',['$scope','xmgHttp','$routeParams',
        function ($scope,xmgHttp,$routeParams) {

        var id = $routeParams.id;
        var url = "http://api.douban.com/v2/movie/subject/"+id;

        xmgHttp.jsonp(url,null,function (res) {
            console.log(res);
            $scope.res = res;
            $scope.$apply();
        });



    }]);
    


    app.service('xmgHttp',['$window',function ($window) {
        this.jsonp = function (url,params,callback) {

            //生成一方法的名称。
            var callbackName = 'callback'+ Math.random().toString().slice(2);
            //1.声明一个方法  //这里要把方法变成全局
            $window[callbackName] = function (res) {
                callback(res);
                $window.document.body.removeChild(newScript);
            };
            //2.添加一个script标签
            var newScript = $window.document.createElement('script');

            //格式化参数，
            /*
             var params = {
                start:0,
                count:5
             }
             url?start=0&count=5
            */
            var queryString = "";
            for(key in params){
                queryString += key + '=' + params[key] + '&'
            }
            queryString += 'callback='+ callbackName;

            url += "?" + queryString;
            newScript.src = url;
            $window.document.body.appendChild(newScript);

        }
    }]);

})(angular);