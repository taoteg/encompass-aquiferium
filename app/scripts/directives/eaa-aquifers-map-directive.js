'use strict';

angular.module('eaa.directives.d3.maps', [])
  .directive('eaaAquifersMap', ['$window', '$location', function ($window, $location) {
    var directiveDefinitionObject = {
      compile: false,
      controller: function ($scope) {
        // console.log('controller for:', $scope.pageClass);
      }, /*false,*/
      controllerAs: false,
      link: false,
      priority: 0,
      // replace: false,  -deprecated.
      require: false,
      restrict: 'E',
      scope: false,
      template: false,
      templateUrl: false,
      terminal: false,
      transclude: false,
      type: false
    };
    
    directiveDefinitionObject.link = function postLink (scope, element) {

      // VARS.
      var container = $('#major-aquifers');
      var containerWidth = container.width();

      var width = containerWidth;
      var height = width * 0.75;

      var vizMargin = {top: 0, right: 0, bottom: 0, left: 0};
      var vizWidth = width - vizMargin.left - vizMargin.right;
      var vizHeight = height - vizMargin.top - vizMargin.bottom;

      var mapWidth = vizWidth;
      var mapHeight = vizHeight * 0.75;

      var boundariesSource = '../../data/geojson/NEW_major_aquifers_dd_reduced100.geo.json';
      var markersSource = '../../data/explore-markerData.csv';

      var markerRadius = 5;
      var color = d3.scale.category10().domain(['Barton Springs', 'Comal Springs', 'Hueco Springs', 'J17', 'J27', 'Las Moras Springs', 'Leona Springs', 'San Antonio Springs', 'San Marcos Springs', 'San Pedro Springs']);

      // METHODS.
      d3.selection.prototype.moveToFront = function () {
        return this.each(function () {
          this.parentNode.appendChild(this);
        });
      };

      d3.selection.prototype.moveToBack = function () {
        return this.each(function () {
          var firstChild = this.parentNode.firstChild;
          if (firstChild) {
            this.parentNode.insertBefore(this, firstChild);
          }
        });
      };

      var onTargetClick = function (target) {
        if (target['Location'] === 'Leona Springs') {
          location.hash = '#/caves-karsts';          
        } else if (target['Location'] === 'J17') {
          location.hash = '#/conservation';
        } else if (target['Location'] === 'San Marcos Springs') {
          location.hash = '#/springs';
        }
        location.reload();
      };

      // VIZ - BASE.
      var el = element[0];
      var viz = d3.select(el).append('div').attr('class', 'viz').attr('width', vizWidth).attr('height', vizHeight);

      var geoBounds = viz.append('svg').attr('class', 'geo-bounds major-aquifers')
        .attr('width', mapWidth)
        .attr('height', mapHeight);

      // MAP.
      d3.json(boundariesSource, function (error, boundariesData) {
        if (error) {
          return console.error(error);
        }
        var scale = mapHeight * 4; // geojson display.
        var offset = [mapWidth / 2, mapHeight / 2];
        var center = d3.geo.centroid(boundariesData);
        // Valid projection types: azimuthalEqualArea, azimuthalEquidistant, conicEqualArea, conicConformal, conicEquidistant, equirectangular, gnomonic, mercator, orthographic, stereographic, 
        // Note: albersUsa() and transverseMercator() require additional configs.
        var projection = d3.geo.mercator().scale(scale).center(center).translate(offset);
        var path = d3.geo.path().projection(projection);
        var geoBoundaries = geoBounds.selectAll('g').data(boundariesData.features).enter().append('g');
        geoBoundaries.append('path').attr('d', path).attr('class', function(d, i) { return i % 2 ? 'area1' : 'area2'; }).on('click', onTargetClick);
        var eaaMarkers = geoBoundaries.append('g');

        d3.csv(markersSource, function (error, data) {
          if (error) {
            return console.error(error);
          }
          eaaMarkers.selectAll('circle').data(data).enter().append('circle')
            .attr('class', function (d) { return d.Location; })
            .attr('cx', function (d) {
              return projection([d.lon_ddd, d.lat_ddd])[0];
            })
            .attr('cy', function (d) {
              return projection([d.lon_ddd, d.lat_ddd])[1];
            })
            .attr('r', markerRadius)
            .attr('z-index', 0)
            .style('fill', function (d) { return color(d.Location); })
            .style('stroke', '#000')
            .on('click', onTargetClick);
          });
      });
    };

    return directiveDefinitionObject;
  }]);