(function($) {

	//for debate creation
	$.fn.voi_debate = function ( options ) {

    	var $this = $(this);

    	var settings = $.extend({
            url         : null,
            users    	: null,
            vote 		: null,
            token 		: null,
            debate_form : null
        }, options);

    	//load fancybox script for debate form 
    	var css = $("<link>", { rel: "stylesheet", type: "text/css", href: "http://www.voteoverit.com/js/fancybox/source/jquery.fancybox.css?v=2.1.5" }).appendTo('head'); 

    	$.getScript(

        	"http://www.voteoverit.com/js/fancybox/source/jquery.fancybox.pack.js?v=2.1.5",
        	function(){
           	
        	$("a#create_debate").fancybox({
          		'width'		: '100%',
          		'height'    : '885',
          		'autoscale' : 'true',
          		'overflow'  : 'scroll'
      		});

      		}
   		);

   		$.post('http://www.voteoverit.com/connect/debate_form.html', 
    		{token : settings.token,
    		  title : settings.url}).done(function(data) {
    		  	settings.debate_form.html(data);

    		  	$("#url").val( $(location).attr('href') );
    	});  
		//end fancybox script

         //submit debate
        $('#' + settings.debate_form.attr('id')).on("click", "#new_debate", function() {

            if( $("#description_background").val() == '') {
                $('#' + settings.debate_form.attr('id')).append('<p style="color:red">Please add a description</p>');
                return false;
            }

            if( $("#title").val() == '') {
                $('#' + settings.debate_form.attr('id')).append('<p style="color:red">Please add a title</p>');
                return false;
            }

           // e.preventDefault();
           console.log('new debate');
            //var data = $(this).serialize();
            //console.log(data);
            //serialize form data, set create to 1 so we know what to do on hook
            var body = $("#description_background").val();

            body += '<br/>' + $("#description_questions").val();

            body += '<br/>' + $("#opinion").val();
            console.log(body);
            $.post('http://www.voteoverit.com/connect/api_hook.php', 
                    { 

                      body: body,
                      title: $("#title").val(), 
                      email: $("#email").val(), 
                      url: $("#url").val(),
                      resource_title : $(document).find("title").text(),
                      create: 1

                    }).done(function(d) {

                        console.log(d);
                        $('#' + settings.debate_form.attr('id')).html(d);//show returned message

                    });

        });
        //end submit debate
	}

	//for debate display
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
    		  	$this.html(data);
    	});    

    	$('#' + $this.attr('id')).on("click",".positive", function () {
            console.log('pos vote');
			$.post('http://www.voteoverit.com/connect/api_hook.php', 
    		 {token : settings.token,
    		  title : settings.url,
    		  vote: 1,
    		  users: settings.users}).done(function(data) {
                console.log(data);
    		  	$(".votebuttons").html(data);

    		  });

            return;

        });
        //negative
        $('#' + $this).on("click",".negative", function () {
            console.log('neg vote');
			$.post('http://www.voteoverit.com/connect/api_hook.php', 
    		  {token : settings.token,
    		  title : settings.url,
    		  vote: 0,
    		  users: settings.users}).done(function(data) {
console.log(data);
    		  	$(".votebuttons").html(data);

    		  });
            
            return;
        });

	}


}(jQuery));
