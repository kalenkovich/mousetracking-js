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
		mousetracking.plot_trajectory();
	},
	
	plot_trajectory: function(){
		plotting.make_canvas();
		for (coords of mousetracking.trajectory) {
			plotting.add_point(coords.x, coords.y);
		}
	}
}

var plotting = {
	make_canvas: function(){
		if (typeof plotting.canvas !== 'undefined') {
			return;
		}
		
		var canvas = document.createElement("canvas");
		plotting.canvas = canvas;
		
		canvas.setAttribute("style", "z-index:-1; display: block; width: 100%; height: 100%;");
		
		document.body.appendChild(canvas);
	},
	
	add_point: function(x, y){
		var ctx = plotting.canvas.getContext("2d");
		var rect = plotting.canvas.getBoundingClientRect();
		x_ = (x - rect.left) / (rect.right - rect.left) * plotting.canvas.width,
		y_ = (y - rect.top) / (rect.bottom - rect.top) * plotting.canvas.height
		ctx.fillRect(Math.round(x_), Math.round(y_), 1, 1);
	}
}
