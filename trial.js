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
	},
	
	abort: function(){
		$('#right').prop("disabled", true);
		$('#start').prop("disabled", false);
		mousetracking.reset();
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
