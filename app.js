let app = angular.module('list',[]);


app.controller('ListController', ['$scope', '$http', function ($scope, $http){
  $scope.users;
  const baseUrl =  'https://jsonplaceholder.typicode.com/users';

  $http.get(baseUrl).then(function(response){
    $scope.users = response.data
  }, function(err) {
    console.log(err);
  })
}]);


  app.controller('GraficController', GraficController)
  .directive('pieChart', pieChart);


function GraficController() {
  var vm = this;
  vm.data = [8, 12,5, 3]
  
}

function pieChart() {
    return {
        restrict: 'EA',
        template: '<div class="ct-chart ct-perfect-fourth"></div>',
        scope: {
            data: '='
        },
        link: function(scope, elem, attr) {
            var chartElement = elem[0].querySelector('.ct-chart');
            var options = {
              donut: true,
              donutWidth: 80
            };
            
            var chart = new Chartist.Pie(chartElement, {
              labels: [],
              series: []
            }, options).on('draw', draw).on('created', created);
            

            scope.$watch('data', function(newValue, oldValue) {
                chart.update({
                labels: [],
                series: scope.data
              });
            }, true);
            
            var oldBars = [];
            
            var lastValues = [];
            function created() {
              lastValues = angular.copy(scope.data);
            }
            
            function draw(data) {
              if (angular.equals(lastValues, scope.data))
                return;
              if(data.type === 'slice') {
                var angle = data.endAngle - data.startAngle;
                var dur = angle / 360 * 1000;
                
                var pathLength = data.element._node.getTotalLength();
                data.element.attr({
                  'stroke-dasharray': pathLength + 'px ' + pathLength + 'px'
                });
                console.log(data);

                var animationDefinition = {
                  'stroke-dashoffset': {
                    id: 'anim' + data.index,
                    dur: dur,
                    from: -pathLength + 'px',
                    to:  '0px',
                    fill: 'freeze'
                  }
                };

                if(data.index !== 0) {
                  animationDefinition['stroke-dashoffset'].begin = 'anim' + (data.index - 1) + '.end';
                }
            
                data.element.attr({
                  'stroke-dashoffset': -pathLength + 'px'
                });
            
                data.element.animate(animationDefinition, false);
              }
            }
            
        }
    }
}


