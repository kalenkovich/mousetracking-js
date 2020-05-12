var mousetracking = {
	cursor_height: 20,
	
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
	
	lock_pointer: function(){
		doc_elem = document.documentElement;
		doc_elem.requestPointerLock = doc_elem.requestPointerLock ||
                                      doc_elem.mozRequestPointerLock;
		doc_elem.requestPointerLock();
	},
	
	add_cursor_image: function(){
		if ($('#cursor-img').length){return};
		
		var cursor_img = document.createElement("img");
		cursor_img.src = "cursor.svg";
		cursor_img.id = "cursor-img";
		// This makes the cursor invisible to document.elementFromPoint.
		// Otherwise, it will just return the cursor image instead of the button.
		cursor_img.style.pointerEvents = "none";
		cursor_img.style.height = mousetracking.cursor_height + "px";
		cursor_img.style.position = "absolute";
		cursor_img.style.left = "50%";
		cursor_img.style.bottom = "0%";		
		document.body.appendChild(cursor_img);
	},
	
	cursor_position: {x: $(window).width() / 2, y: $(window).height() - 20},
	
	let_user_move_cursor: function(){
		$(document).mousemove(function(event){
			cursor_img = $('#cursor-img').get(0);
			mousetracking.cursor_position.x += (event.movementX || event.originalEvent.movementX);
			mousetracking.cursor_position.y += (event.movementY || event.originalEvent.movementY);
			
			x = mousetracking.cursor_position.x;
			y = mousetracking.cursor_position.y;
			cursor_img.style.left = x + "px";
			cursor_img.style.top = y + "px";	
			
			console.log(x, y);
		});
	},
	
	let_user_click_with_fake_cursor: function(){
		window.addEventListener("mouseup", function(event){
			pos = mousetracking.cursor_position;
			var object_under_cursor = document.elementFromPoint(pos.x, pos.y);  
			if (object_under_cursor !== null){
				object_under_cursor.click();
			};
		}) 
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
