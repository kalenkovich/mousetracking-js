var mousetracking = {
	normalize_coordinates: function(x, y){
		// bottom center is (0,0), top right is (1, 1), top left is (-1,1)
		width = $(window).width();
		height = $(window).height();
		x_normalized = x / width - 0.5;
		y_normalized = 1- y / height;
		return [x_normalized, y_normalized];
	}, 
	
	start_tracking: function(){
		console.log('Started tracking');
		$(document).mousemove(function(event){
			console.log(mousetracking.normalize_coordinates(event.clientX, event.clientY));
		});
	},
	
	stop_tracking: function(){
		$(document).off('mousemove');
		console.log('Stopped tracking');		
	},

}
