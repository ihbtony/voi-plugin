(function($) {

    $.fn.voi = function( options ) {

    	var $this = $(this);
	
    	var settings = $.extend({
            url      : null,
            users    	: null,
            vote 		: null,
            token 		: null,
        }, options);


        $.post('http://www.voteoverit.com/connect/api_hook.php', 
    		{token : settings.token,
    		  title : settings.url}).done(function(data) {
    		  	$("#voi_wrapper").html(data);
    	});    

    	$('#' + $this).on("click",".positive", function () {
			$.post('http://www.voteoverit.com/connect/api_hook.php', 
    		 {token : settings.token,
    		  title : settings.url,
    		  vote: settings.vote,
    		  users: settings.users}).done(function(data) {

    		  	$(".votebuttons").html(data);

    		  });

            return;

        });
        //negative
        $('#' + $this.attr('id')).on("click",".negative", function () {

			$.post('http://www.voteoverit.com/connect/api_hook.php', 
    		  {token : settings.token,
    		  title : settings.url,
    		  vote: settings.vote,
    		  users: settings.users}).done(function(data) {

    		  	$(".votebuttons").html(data);

    		  });
            
            return;
        });

}

}(jQuery));
