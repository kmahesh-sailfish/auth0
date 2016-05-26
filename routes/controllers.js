var myApp = angular.module('myApp');

myApp.controller('MsgCtrl', function ($scope, auth) {
  $scope.message = '';

});

myApp.controller('RootCtrl', function (auth, $scope,$http) {
  auth.profilePromise.then(function() {
    $scope.$parent.message = 'Welcome ' + auth.profile.name + '!';

    $scope.GetApi = function(){
      var dataval =  $http.get('http://localhost:3200/admin');
      dataval.then(function(response){
        $scope.datajson = JSON.stringify(response.data);
      });
    };


  });

  $scope.auth = auth;
});

myApp.controller('LoginCtrl', function (auth, $scope, $cookies, $state) {
  $scope.email = '';
  $scope.password = '';

  function onLoginSuccess() {
    $scope.$parent.message = '';
    $state.go('root');
    $scope.loading = false;
  }

  function onLoginFailed() {
    $scope.$parent.message = 'invalid credentials';
    $scope.loading = false;
  }

  $scope.adminsubmit = function () {
    $scope.$parent.message = 'loading...';
    $scope.loading = true;

    auth.signin({
      sso:false,
      connection: 'Username-Password-Authentication',
      username: $scope.email,
      password: $scope.password,
    }, onLoginSuccess, onLoginFailed);
  };

  $scope.doGoogleAuthWithPopup = function () {
    $scope.$parent.message = 'loading...';
    $scope.loading = true;

    auth.signin({
      popup: true,
      connection: 'google-oauth2',
      scope: 'openid name email'
    }, onLoginSuccess, onLoginFailed);
  };
});

myApp.controller('LogoutCtrl', function (auth, $scope, $state, store) {
  auth.signout();
  store.remove('profile');
  store.remove('token');
  $scope.$parent.message = '';
  $state.go('login');
});
