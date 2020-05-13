trial = {	
	setup: function(){
		$('#start').click(function(){trial.start()});
		$('#right').click(function(){trial.stop()});
		fullscreen.enforce_fullscreen();
	},
	
	start: function(){
		$('#start').prop("disabled", true);
		$('#right').prop("disabled", false);
		mousetracking.start_tracking();
		frame.add();
		frame.show();
	},
	
	abort: function(){
		$('#right').prop("disabled", true);
		$('#start').prop("disabled", false);
		mousetracking.reset();
		frame.hide();
	},
	
	stop: function(){
		$('#right').prop("disabled", true);
		$('#start').prop("disabled", false);
		mousetracking.stop_tracking();	
	},
	
	debug: function(){
	    fullscreen.stop_enforcing_fullscreen();
	}
}

frame = {
	calculate_sizes: function(){
		// In the offline version,
		// the frame had ~17 px borders and ~220 px square cells,
		// the screen resolution was 1920x780
		window_width = $(window).width();
		width_ratio = window_width / 1920
		border = Math.round(17 * width_ratio);
		cell_side = Math.round(210 * width_ratio);
		return [cell_side, border];
	},
	
	add: function(){
		if ($('#frame-div').length){return};
		const div = document.createElement('div');
		div.style.visibility = 'hidden';
		div.className = 'center-of-the-screen';
		div.id = "frame-div";
		div.innerHTML = `
			<table class="frame">
				<tr>
					<td class="frame">
						<img id="image-1"></img>
					</td>
					<td class="frame">
						<img id="image-2"></img>
					</td>
				</tr>
				<tr>
					<td class="frame">
						<img id="image-3"></img>
					</td>
					<td class="frame">
						<img id="image-4"></img>
					</td>
				</tr>
			</table>
		`;
		document.body.appendChild(div);
		
		
		[cell_side, border] = frame.calculate_sizes();
		$('td.frame').css({
			'height': cell_side + 'px',
			'width': cell_side + 'px',
			'border-width': border + 'px',
			'border-style': 'solid', 
			'border-color': 'brown'
		});
	},
	
	show: function(){
		$('#frame-div').css('visibility', 'visible');
	},
	
	hide: function(){
		$('#frame-div').css('visibility', 'hidden');
	},
}
