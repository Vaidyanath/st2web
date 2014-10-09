'use strict';
angular.module('main')
  .config(function ($stateProvider) {

    $stateProvider
      .state('actions', {
        abstract: true,
        url: '/actions',
        controller: 'st2ActionsCtrl',
        templateUrl: 'apps/st2-actions/template.html',
        title: 'Actions'
      })
      .state('actions.list', {
        url: '?page'
      })
      .state('actions.summary', {
        url: '/{id:\\w+}?page'
      })
      .state('actions.details', {
        url: '/{id:\\w+}/details?page'
      })

      ;

  });

angular.module('main')

  .controller('st2ActionsCtrl', function ($scope, st2Api, $rootScope) {

    st2Api.actions.$watch('list() | unwrap', function (list) {
      $scope.groups = list && _.groupBy(list, 'content_pack');
    });

    $rootScope.$watch('state.params.page', function (page) {
      st2Api.actions.fetch(page);
    });

    $rootScope.$watch('state.params.id', function (id) {
      // TODO: figure out why you can't use $filter('unwrap')(...) here
      st2Api.actions.get(id).then(function (action) {
        $scope.action = action;

        $scope.payload = {};

        st2Api.executions.find({
          'action_id': action.id
        }).then(function (executions) {
          $scope.executions = executions;
        });
      });
    });

    // Running an action
    $scope.runAction = function (actionName, payload) {
      st2Api.executions.create({
        action: {
          name: actionName
        },
        parameters: payload
      }).then(function (execution) {
        st2Api.executions.find({
          'action_id': execution.action.id
        }).then(function (executions) {
          $scope.executions = executions;
        });
      });
    };

  })

  ;
