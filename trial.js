trial = {	
	setup: function(){
		$('#start').click(function(){trial.start()});
		$('.response-div').click(function(){trial.stop()});
		fullscreen.enforce_fullscreen();
	},
	
	start: function(){
		$('#start').prop("disabled", true);
		$('#right').prop("disabled", false);
		mousetracking.start_tracking();
		frame.add();
		frame.show();
		audio.add();
		audio.load();
		response_options.add();
		response_options.show();
	},
	
	abort: function(){
		$('.response-div').prop("disabled", true);
		$('#start').prop("disabled", false);
		mousetracking.reset();
		frame.hide();
	},
	
	stop: function(){
		$('.response-div').prop("disabled", true);
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
		// returns cell side and border width as percentages of the width
		percent_per_pixel = 100 / 1920;
		border = 17 * percent_per_pixel;
		cell_side = 210 * percent_per_pixel;
		return [cell_side, border];
	},
	
	add: function(){
		if ($('#frame-div').length){return};
		div = document.createElement('div');
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
			'height': cell_side + 'vw',
			'width': cell_side + 'vw',
			'border-width': border + 'vw',
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

audio = {
	add: function(){
		if ($('#audio').length){return};
		const audio_element = document.createElement('audio');
		audio_element.id = 'audio';
		audio_element.style.visibility = 'hidden';
		document.body.appendChild(audio_element);
	},
	
	load: function(){
		audio_element = $('#audio').get(0);
		audio_element.src = "this-time_positive_bottom.wav";
		audio_element.addEventListener('canplaythrough', audio.play);
		audio_element.load();
	},
	
	play: function(){
		audio_element = $('#audio').get(0);
		audio_element.play();
	}
}

response_options = {
	add_response: function(corner){
		id = 'response-' + corner;
		if ($('#' + id).length){return};
		div = document.createElement('div');
		div.className = 'response-div';
		div.id = id;
		cssText = "position: absolute; height:10vw; width: 10vw; top: 0%;";
		cssText += "border: 3px solid black;";
		if (corner == 'left'){
			cssText += 'left: 0%;';
		} else if (corner == 'right'){
			cssText += 'right: 0%;';
		}
		div.style.cssText = cssText;
		div.style.visibility = 'hidden';
		document.body.appendChild(div);
	},
	
	add: function(){
		response_options.add_response('left');
		response_options.add_response('right');
	},
	
	show: function(){
		$('.response-div').css('visibility', 'visible');
	},
	
	hide: function(){
		$('.response-div').css('visibility', 'hidden');
	},
	
}
