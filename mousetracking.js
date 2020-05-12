var mousetracking = {
	cursor_height: 20,
	
	normalize_coordinates: function(coordinates){
		// bottom center is (0,0), top right is (1, 1), top left is (-1,1)
		coords = coordinates;
		x_normalized = coords.x / coords.width - 0.5;
		y_normalized = 1- coords.y / coords.height;
		return [x_normalized, y_normalized];
	},
	
	add_current_coordinates: function(event){
		coordinates = {
			x: mousetracking.cursor_position.x,
			y: mousetracking.cursor_position.y,
			width: $(window).width(),
			height: $(window).height()
		}
		mousetracking.trajectory.push(coordinates);
		xy_normalized = mousetracking.normalize_coordinates(coordinates);
		console.log(xy_normalized);
	},
	
	handle_pointer_unlocking: function(){
		if (document.pointerLockElement === null){
			abort_trial();
		};
	},
	
	start_tracking: function(){
		console.log('Started tracking');
		mousetracking.trajectory = [];
		mousetracking.turn_fake_cursor_on(mousetracking.add_current_coordinates);
	},
	
	stop_tracking: function(){
		$(document).unbind('mousemove', mousetracking.add_current_coordinates);
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
		if ($('#cursor-img').length){
			$('#cursor-img').get(0).style.visibility = 'visible';
			return;
		};
		
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
		cursor_img.style.visibility = 'visible';		
		document.body.appendChild(cursor_img);
	},
	
	mouseMoveCallback: null,
	
	turn_fake_cursor_on: function(mouseMoveCallback){
		// mouseMoveCallback - function that will be bound to the `mousemove` event.
		// We save it here so that we can unbind it later.
		mousetracking.mouseMoveCallback = mouseMoveCallback;
		mousetracking.reset_cursor_position();
		mousetracking.lock_pointer();
		mousetracking.add_event_listener(mousetracking.handle_pointer_unlocking);
		mousetracking.add_cursor_image();
		mousetracking.redraw_cursor();
		mousetracking.let_user_move_cursor();
		$(document).mousemove(mouseMoveCallback);
		mousetracking.let_user_click_with_fake_cursor();
	},
	
	unlock_pointer: function(){
		document.exitPointerLock = document.exitPointerLock    ||
								   document.mozExitPointerLock;
		document.exitPointerLock();
	},
	
	remove_event_listener: function(fun){
		document.removeEventListener('pointerlockchange', fun);
		document.removeEventListener('mozpointerlockchange', fun);
	},
	
	hide_cursor_image: function(){
		cursor_img = $('#cursor-img').get(0);
		cursor_img.style.visibility = 'hidden';
	},
	
	turn_fake_cursor_off: function(){
		$(document).unbind("mousemove", mousetracking.mouseMoveCallback);
		mousetracking.mouseMoveCallback = null;
		mousetracking.unlock_pointer();
		mousetracking.remove_event_listener(mousetracking.handle_pointer_unlocking);
		mousetracking.hide_cursor_image();
		mousetracking.stop_moving_cursor();
		
	},
	
	cursor_position: {x: $(window).width() / 2, y: $(window).height() - 20},
	
	reset_cursor_position: function(){
		position = mousetracking.cursor_position;
		position.x = $(window).width() / 2;
		position.y = $(window).height() - mousetracking.cursor_height;
	},
	
	redraw_cursor: function(){
		cursor_img = $('#cursor-img').get(0);
		x = mousetracking.cursor_position.x;
		cursor_img.style.left = x + "px";
		y = mousetracking.cursor_position.y;
		cursor_img.style.top = y + "px";
	},
	
	bound_coordinates: function(x, y){
		// bound coordinates by the window sizeToContent
		width = $(window).width();
		x = Math.max(x, 0);
		x = Math.min(x, width);
		
		height = $(window).height();
		y = Math.max(y, 0);
		y = Math.min(y, height);
		
		return [x, y];
	},
	
	copy_mouse_movement: function(event){
			
		x = mousetracking.cursor_position.x += (event.movementX || event.originalEvent.movementX);
		y = mousetracking.cursor_position.y += (event.movementY || event.originalEvent.movementY);
		[x, y] = mousetracking.bound_coordinates(x, y);
		
		mousetracking.cursor_position.x = x;
		mousetracking.cursor_position.y = y;
		
		mousetracking.redraw_cursor();	
		
		console.log(x, y);
	},
	
	stop_moving_cursor: function(){
		$(document).unbind('mousemove', mousetracking.copy_mouse_movement);
	},
	
	let_user_move_cursor: function(){
		// This is to avoid binding the function twice. I don't know a better way.
		mousetracking.stop_moving_cursor();
		$(document).mousemove(mousetracking.copy_mouse_movement);
	},
	
	click_with_fake_cursor: function(event){
		pos = mousetracking.cursor_position;
		var object_under_cursor = document.elementFromPoint(pos.x, pos.y);  
		if (object_under_cursor !== null){
			object_under_cursor.click();
		}
	},
	
	stop_clicking_with_fake_cursor(){
		$(window).unbind('mouseup', mousetracking.click_with_fake_cursor);
	},
	
	let_user_click_with_fake_cursor: function(){
		// This is to avoid binding the function twice. I don't know a better way.
		mousetracking.stop_clicking_with_fake_cursor();
		window.addEventListener("mouseup", mousetracking.click_with_fake_cursor); 
	},
	
	plot_trajectory: function(){
		plotting.make_canvas();
		for (coords of mousetracking.trajectory) {
			plotting.add_point(coords.x, coords.y);
		}
	},
	
	add_event_listener: function(fun){
		document.addEventListener('pointerlockchange', fun);
		document.addEventListener('mozpointerlockchange', fun);
	},
	
	reset: function(){
		mousetracking.trajectory = [];
		mousetracking.turn_fake_cursor_off();
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
