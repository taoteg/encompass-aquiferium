'use strict';

angular.module('aquiferiumApp')
  .controller('ConservationCtrl', ['$window', '$scope', '$location', '$anchorScroll', function ($window, $scope, $location, $anchorScroll) {
    $scope.pageClass = 'conservation';

    $scope.urlHcp = 'http://eahcp.org';

    $scope.linkModelFunc = function (url) {
      $window.open(url);
    };

    $scope.resetView = function () {
      $location.hash('.conservation');
      $anchorScroll();
    };

    $scope.resetView();

    $scope.goToByScroll = function (slidenumber) {
      var navbarHeight = $('#navbar').innerHeight();
      var htmlBody = angular.element(document).find('body').css('class', '.conservation');
      htmlBody.animate({
        scrollTop: $('.slide[data-slide="' + slidenumber + '"]').offset().top - navbarHeight
      }, 2000, 'easeInOutQuint');
    };

    $scope.buttonClick = function (e) {
      // console.log('firing click event from controller $scope with e == ' + e.valueOf());
      e.preventDefault();
      var dataslide = angular.element(e.target).attr('data-slide');
      $scope.goToByScroll(dataslide);
    };
  }]);
