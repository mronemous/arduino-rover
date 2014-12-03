class RemoteController {
	
	constructor($scope, $ionicGesture) {
		
		var changed = () => {
			$scope.$apply();
		};
		
		this.rover = new Rover(changed);
		this.host = Rover.host;
		this.rover.connect(Rover.host.socketio);
		
		this.cameraDragPad = {xLabel: 'Rotate', yLabel: 'Pan', yOffset: 15, dragged: (data) => { this.cameraDragged(data); }};
		this.movementDragPad = {xLabel: 'Steering', yLabel: 'Throttle', dragged: (data) => { this.movementDragged(data); }};
	}
	
	cameraDragged(data) {

		this.rover.cameraRotate(data.px);
	  //NOTE: Invert because servo setup for pilots apparently:)
		this.rover.cameraTilt(data.py * -1); 
	
		//console.log('cameraDragPad ' + JSON.stringify(data));
	}
	
	movementDragged(data) {

		this.rover.steer(data.px);
		this.rover.throttle(data.py);
		
		//console.log('movmentDragPad ' + JSON.stringify(data));
	}
}

class DragPadDirective {
	constructor($ionicGesture) { 
  return {
			restrict: 'C',
			scope:{
        ngModel :'='
    	},
			link: function($scope, $element, $attr) {
				
				var el = $element[0];
				var _boundingRect = el.getBoundingClientRect();
				var boundingRect = {
					//HACK: Not sure what is throwing the 1st dragpad off.
					top: _boundingRect.top + ($scope.ngModel.yOffset || 0),
					left: _boundingRect.left, 
					bottom: _boundingRect.bottom,
					width: _boundingRect.width,
					//HACK: TODO figure out why this is needed.
					height: _boundingRect.height - 43
				};				
				//console.log(JSON.stringify(boundingRect));
				
				var xLabel = $scope.ngModel.xLabel;
				var yLabel = $scope.ngModel.yLabel;
				
				var x = angular.element("<div class='x-axis'><span class='label'>" + xLabel +"</span></div>");
				var indicatorX = angular.element("<span class='indicator'></span>");
				var midpointX = angular.element("<span class='midpoint'></span>");
				x.append(indicatorX);
				x.append(midpointX);
				$element.append(x);
			
				var y = angular.element("<div class='y-axis'><span class='label'>" + yLabel +"</span></div>");
				var indicatorY = angular.element("<span class='indicator'></span>");
				var midpointY = angular.element("<span class='midpoint'></span>");
				y.append(indicatorY);
				y.append(midpointY);
				$element.append(y);
				
				var xMid =  boundingRect.width/2;
				var yMid = (boundingRect.height)/2;
				
				indicatorX.css({left: xMid + 'px'});
				midpointX.css({left: xMid + 'px'});
				indicatorY.css({top: yMid +  'px'});
				midpointY.css({top: yMid +  'px'});
							
				var released = function(e) {

					indicatorX.css({left: xMid + 'px'});
					indicatorY.css({top: yMid +  'px'});
					
					if($scope.ngModel.dragged) {
						$scope.ngModel.dragged({
							x: xMid,
							y: yMid,
							px: 0,
							py: 0
						});
						
						//console.log('released');
					}
				};
				var releaseGesture = $ionicGesture.on('release', released, $element);
				
				var dragged = function(e) {
			
					var toRatio = function(ratio) {
						
						//map from 0.0 -> 1.0 to -1.0 -> 1.0
						ratio = (ratio - 0.5) / 0.5;
						
						var v = ratio.toFixed(2);
						if(v > 1.0) { v = 1.0; }
						else if(v < -1.0) { v = -1.0; }
											
						return v;
					}
					
					var data = {
						x: e.gesture.touches[0].pageX,
						y: e.gesture.touches[0].pageY - boundingRect.top,
						dx: e.gesture.deltaX,
						dy: e.gesture.deltaY
					};
					data.px = toRatio(data.x / boundingRect.width);
					data.py = toRatio(1.0 - (data.y / boundingRect.height));
										
					indicatorX.css({left: data.x + 'px'});
					indicatorY.css({top: data.y + 'px'});
					
					if($scope.ngModel.dragged) { 
						$scope.ngModel.dragged(data); 
					}
					
					//console.log('drag ' + JSON.stringify(data));
				};
				var dragGesture = $ionicGesture.on('drag', dragged, $element);

				$scope.$on('$destroy', function () {
					$ionicGesture.off(dragGesture, 'drag', dragged);
					$ionicGesture.off(releaseGesture, 'release', released);
				});
			}
		};
	}
}


angular.module('arduino-rover.remote')
.controller('RemoteCtrl', RemoteController)
.directive('dragpad', DragPadDirective);


