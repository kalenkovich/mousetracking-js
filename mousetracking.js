var mousetracking = {
	normalize_coordinates: function(coordinates){
		// bottom center is (0,0), top right is (1, 1), top left is (-1,1)
		coords = coordinates;
		x_normalized = coords.x / coords.width - 0.5;
		y_normalized = 1- coords.y / coords.height;
		return [x_normalized, y_normalized];
	},
	
	start_tracking: function(){
		console.log('Started tracking');
		mousetracking.trajectory = [];
		$(document).mousemove(function(event){
			coordinates = {
				x: event.clientX,
				y: event.clientY,
				width: $(window).width(),
				height: $(window).height()
			}
			mousetracking.trajectory.push(coordinates);
			xy_normalized = mousetracking.normalize_coordinates(coordinates);
			console.log(xy_normalized);
		});
	},
	
	stop_tracking: function(){
		$(document).off('mousemove');
		console.log('Stopped tracking');		
	},

}
