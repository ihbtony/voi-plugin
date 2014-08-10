(function($) {

    $.fn.voi = function( options ) {

    	var $this = $(this).attr('id');
    	
    	var settings = $.extend({
            title       : null,
            users    	: null,
            vote 		: null,
            token 		: null,
        }, options);


        $.post('http://www.voteoverit.com/api_hook.php', 
    		{token : settings.token,
    		  title : settings.title}).done(function(data) {
    		  	console.log(data);
    		  	$("#voi_wrapper").html(data);
    	});    

    	$('#' + $this).on("click",".positive", function () {

            console.log('testp');
			$.post('http://www.voteoverit.com/api_hook.php', 
    		 {token : settings.token,
    		  title : settings.title,
    		  vote: settings.vote,
    		  users: settings.users}).done(function(data) {

    		  	console.log(data);
    		  	$(".votebuttons").html(data);

    		  });

            return;

        });
        //negative
        $('#' + $this).on("click",".negative", function () {

             console.log('testn');
			$.post('http://www.voteoverit.com/api_hook.php', 
    		  {token : settings.token,
    		  title : settings.title,
    		  vote: settings.vote,
    		  users: settings.users}).done(function(data) {

    		  	console.log(data);
    		  	$(".votebuttons").html(data);

    		  });
            
            return;
        });

}

}(jQuery));
