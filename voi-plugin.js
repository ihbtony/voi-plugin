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

      //cookie
      var CookieSet = $.cookie('voi'); 

      if (CookieSet == null) { //check if voi cookie is set
        var timenow = $.now();
        $.cookie("voi", timenow, { expires : 365 }); //set cookie id voi to timestamp and to expire in 1 year
      }

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
        $(document).on("click", "#new_debate", function() {

            if( $("#description_background").val() == '') {
                $('#' + settings.debate_form.attr('id')).append('<p style="color:red">Please add a description</p>');
                return false;
            }

            if( $("#title").val() == '') {
                $('#' + settings.debate_form.attr('id')).append('<p style="color:red">Please add a title</p>');
                return false;
            }
            //var data = $(this).serialize();
            //console.log(data);
            //serialize form data, set create to 1 so we know what to do on hook
            var body = $("#description_background").val();

            body += '<br/>' + $("#description_questions").val();

            body += '<br/>' + $("#opinion").val();
            console.log(body);
            $.post('http://www.voteoverit.com/connect/debate_display.php', 
                    { 

                      body: body,
                      title: $("#title").val(), 
                      email: $("#email").val(), 
                      url: $("#url").val(),
                      resource_title : $(document).find("title").text(),
                      create: 1

                    }).done(function(d) {

                        $('#' + settings.debate_form.attr('id')).html(d);//show returned message

                    });

        });
        //end submit debate
	}

	//for debate display
    $.fn.voi = function( options ) {

    	$this = $(this);

    	var settings = $.extend({
            url      : null,
            users    	: null,
            vote 		: null,
            token 		: null,
        }, options);
      //user not set
      user = '';

      if(settings.users == null) {

        //get the cookie scripte from voi.com so we can start setting cookies. this will be our new unique user id.

      $.getScript(
          "http://www.voteoverit.com/js/jscookie.js",function(e) {

      var CookieSet = $.cookie('voi'); 
      if (CookieSet == null) { //check if voi cookie is set
          var timenow = $.now();
          $.cookie("voi", timenow, { expires: 365, path: '/' }); //set cookie id voi to timestamp and to expire in 1 year
          user = $.cookie('voi');
        } else {
          user = $.cookie('voi');
          console.log('user c 1 :' + user);
        }

      });
      } else {
        user = settings.users;
      }


setTimeout(function() {
      // Do something after 5 seconds
        $.post('http://www.voteoverit.com/connect/debate_display.php', 
    		{ token : settings.token,
    		  title : settings.url,
          user  : user }).done(function(data) {
    		  	$this.html(data);
    	});    
}, 3000);
      //end cookie/users check
  $(document).on("click", ".userCommentEdit", function() {
  //$(".userCommentEdit").click(function() {

    var ele = $(this).attr('id').split('-');
    if( $(this).text() == 'EDIT') {

      var ele = $(this).attr('id').split('-');
      $( "#pollText_" + ele[2] ).hide();

      $(this).text('SAVE');
      $('.userCommentText').hide();
      $("#comment_" + ele[2]).show(); //show textbox with existing text for editing

    } else if($(this).text() == 'SAVE') {
      
      ele = $(this).attr('id').split('-');
      issue_id = ele[1];

      var $this = $(this);

      $.post("http://www.voteoverit.com/API/polls/edit", { 

        id: ele[2],
        Updated: "",
        pollText : $("#comment_" + ele[2]).val(),
        user : user,
        issue_id : ele[1]

      }).done(function(data) {

        var return_data = $.parseJSON(data);
        PollID = return_data.PollID; //poll id from insert returned
        
        $(".addCommentDiv").html('<div class="userCommentDiv" id="userCommentDiv_60" style="display: inline-block;"><div class="debateImageDiv latter" style="margin-top:2px; float:left;"><a href="http://www.voteoverit.com/myprofile/history.php?user=3"><img id="debateImage" src="http://www.voteoverit.com/member/profileImages/3.jpg" style="height:40px;"></a></div><div id="comment_' + issue_id + '" style="float:left; width:300px;"><span class="userCommentText" id="pollText_60">' + $("#comment_" + ele[2]).val() + '<font class=""></font></span><textarea type="text" class="addCommentText" id="comment_' + PollID + '" style="display:none; height:78px; min-width:300px; max-width:300px; margin:0px 6px;">' + $("#comment_" + ele[2]).val() + '</textarea></div><div style="float:right;"><button class="userCommentEdit" id="comment-' + issue_id + '-' + PollID + '">EDIT</button><br><button class="userCommentRemove" id="remove-' + issue_id + '-' + PollID + '">REMOVE</button></div><br></div>');
            //$("#comment_" + ele[2]).val() );
          $(".addCommentDiv").show();
          $('.userCommentText').html( $("#comment_" + ele[2]).val() );
          $('.userCommentText').show();                          

        $("#comment_" + ele[2]).hide(); 
        //redisplay polltext and put in the comment contents
        $( "#pollText_" + ele[2] ).html( $("#comment_" + ele[2]).val() + " (SAVED)");
        $( "#pollText_" + ele[2] ).show();

      }); 

      $(this).text('EDIT');

    }

  });

  //for remove button
    $(document).on("click", ".userCommentRemove", function() {
      console.log('User comment remove');
      
      var ele = $(this).attr('id').split('-');
      $.post("http://www.voteoverit.com/API/polls/edit", { 

        id: ele[2],
        Updated: "",
        pollText : '',
        user: user,
        remove: 1

      }).done(function(data) {

        reload_vote_display();

      }); 
  });
  $(".voi-bookmark").click(function() {

      $(this).css("color" , "#48D8DC")
      $("#messageMessage").html("<span class='influence'>Bookmarked</span> Debate for later!<br>");
      //$("#message" ).show("slide", {direction: "right"}, 500, callbackMessage );

  });


  $(document).on("click", ".addCommentButton", function() {

      var ele = $(this).attr('id').split('-');

      issue_id = ele[1];
      vote = ele[2];

      console.log(issue_id + "\r\n" + 'vote:' + vote + "\r\n" + user + "\r\n" + $("#comment_" + issue_id).val());

    $.post("http://www.voteoverit.com/API/polls/add", { 

          user: user,
          issue_id: issue_id,
          Created : "", 
          pollText : $("#comment_" + issue_id).val(),
          vote: vote 

      }).done(function(data) { 

        var return_data = $.parseJSON(data);
        PollID = return_data.PollID; //poll id from insert returned
        if(return_data.message != 'Problem saving opinion') {
          console.log("comment saved");

          $("#bar_" + issue_id).append("<div class='userCommentDiv' id='userCommentDiv_" + PollID + "' style='display:inline-block;'><div class='debateImageDiv latter' style='margin-top:2px; float:left;'><img id='debateImage' src='http://www.voteoverit.com/member/profileImages/6307.jpg' style='height:40px;'/></div><div id='comment_" + issue_id + "' style='float:left;'><span class='userCommentText' id=''>" + $('#comment_' + issue_id).val() + "<font class=''></font> -  <font class=''> (ADDED) </font></span><textarea type='text' class='addCommentText' id='comment_" + PollID + "' style='display:none; height:78px; min-width:300px; max-width:300px; margin:0px 6px;'>" + $('#comment_' + issue_id).val() + "</textarea></div><div style='float:right;'><button class='userCommentEdit' id='comment-" + issue_id + "-" + PollID + "'>EDIT</button><br><button class='userCommentRemove' id='remove-" + issue_id + "-" + PollID + "' style=''>REMOVE</button></div><br></div>");


            $(".addCommentDiv").remove(); //remove add comment div and start using UserCommentDiv since they now have an existing comment in place

        } 

      }); 

    });

  $(document).on("click", ".addCommentCancel", function() {
    console.log('hide addCommentDiv');
    $(".addCommentText").val('');
    $(".addCommentDiv").hide();
  });

  $(document).on("click", ".userComment", function() {
    $(this).next('.addCommentDiv').slideToggle(300, 'linear');
    $('.userCommentDiv').show();
  });
  //for comments

  $(document).on('click', '.voi-plus', function() {

      var id = $(this).attr("id").split("_")
      var elementID = id[1];
      var $this = $(this);

      $.post("http://www.voteoverit.com/API/Polls/vote/1/" + elementID + "/" + user, 
      {   user: user,
          id: elementID,
          vote: 1 }).done(function(data) {

                if ((data) == "Already voted on this opinion!") {
                    console.log('already voted');
                } else {

            var current_count = parseInt( $this.next('span.commentStat').html().replace('+', '') );

            var new_count = current_count + 1;

            $this.next("span.commentStat").html('+ ' + new_count);

            $this.addClass("voi-plus-fill");
            $this.removeClass("voi-plus");
            $("#messageMessage").html("<span class='influence'>+1pt</span> For Comment Vote<br>");
            //$("#message" ).show(1000, "swing", callbackMessage );
            }
      });

   });  

  function reload_vote_display() {

  	$.post('http://www.voteoverit.com/connect/debate_display.php', 
    		{ token : settings.token,
    		  title : settings.url,
          //cookie: $.cookie('voi'),
          user  : user }).done(function(data) {
    		  	$this.html(data);
    });   
  	
  }
    
    $(document).on('click', '.voi-minus', function() {

    var id = $(this).attr("id").split("_")
    var elementID = id[1];
    var $this = $(this);
            console.log(elementID);
      $.post("http://www.voteoverit.com/API/Polls/vote/0/" + elementID + "/" + user, 
      {   user: user,
          id: elementID,
          vote: 0 }).done(function(data) {
        console.log(data);
        if ((data) == "Already voted on this opinion!") {

        } else {
            
            var current_count = parseInt( $this.prev('span.commentStat').html().replace('-', '') );

            var new_count = current_count + 1;

            $this.prev("span.commentStat").html('- ' + new_count);

          $this.addClass("voi-minus-fill");
          $this.removeClass("voi-minus");
          $("#messageMessage").html("<span class='influence'>+1pt</span> For Comment Vote<br>");
          //$("#message" ).show(1000, "swing", callbackMessage );
        }
      });

   });

     $(document).on('click', '.posButton', function() {

      var element = $(this).attr("id").split("_");
      id = element[2];
      $ele = $(this);
      $("#current_vote").val('1');
      $("#current_issue_id").val(id);

    	$.post('http://www.voteoverit.com/connect/api_hook.php', 
             {token : settings.token,
              title : settings.url,
              vote: 1,
              user: user}).done(function(data) {       

        if ( data == 'Already voted' || data == 'Vote Not Saved') {
            
            //we're passing back the login stuff here because we don't have a valid email associated with this user id
        } else if( data.indexOf("<div class='signin'") >= 0) {

          $('.votebuttons').hide();
          $('.votingArea').prepend(data); ///append the html for them to add an email

        } else {

            reload_vote_display();
                  //$("#message" ).show(1000, "swing", callbackMessage );  
            $("#bar_" + id).show();
            $("#neg_button_" + id).remove();
            $ele.css({"margin-top" : "11.5px", "width" : "100%", "text-align" : "center"});

          }
        }); 

  });

  //negative button click
       $(document).on('click', '.negButton', function() {

        var element = $(this).attr("id").split("_");
        id = element[2];
        $ele = $(this);
        $("#current_vote").val('0');
        $("#current_issue_id").val(id);

    $.post('http://www.voteoverit.com/connect/api_hook.php', 
             {token : settings.token,
              title : settings.url,
              vote: 0,
              user: user}).done(function(data) {       

        if ( data == 'Already voted' || data == 'Vote Not Saved') {
            
            //we're passing back the login stuff here because we don't have a valid email associated with this user id
        } else if( data.indexOf("<div class='signin'") >= 0) {

          $('.votebuttons').hide();
          $('.votingArea').prepend(data);  ///append the html for them to add an email
          
        } else {

            reload_vote_display(); 
            $("#bar_" + id).show();
            $("#pos_button_" + id).remove();
            $ele.css({"margin-top" : "11.5px", "width" : "100%", "text-align" : "center"});

          }
    }); 

  });

  //for new email add
  $(document).on('click', '#save_email', function() {

    var updates = 0;

    if ( $( $("#updates") ).prop( "checked" ) ) {
      var updates = 1;
    }

    $.post('http://www.voteoverit.com/connect/api_hook.php', 
        { update : updates,
          user_id : $("#user_id").val(),
          email : $("#email").val(),
          vote : $("#current_vote").val(),
          issue_id : $("#current_issue_id").val()
          }).done(function(data) {

      $(".signin").hide();
      $(".votebuttons").show();
      $("#bar_" + id).show();

      if($("#current_vote").val() == 1) {
      	$("#neg_button_" + $("#current_issue_id").val()).remove();
      	$("#pos_button_" + $("#current_issue_id").val()).css({"margin-top" : "11.5px", "width" : "100%", "text-align" : "center"});

      } else {

      	$("#pos_button_" + $("#current_issue_id").val()).remove();
      	$("#neg_button_" + $("#current_issue_id").val()).css({"margin-top" : "11.5px", "width" : "100%", "text-align" : "center"});

      }

    });

  });

  $(document).on('click', '#toggleView', function() {
    $(".voi-angle-right").toggleClass(function(){
      return "voi-angle-down";
    });

  });

  $(document).on('click', '.addComment', function() {
    $(this).next(".addCommentDiv").slideToggle(300, "linear");
  });

  //$(".userCommentDiv").hide();

  $(document).on('click', '.userComment', function() {
    $(this).next(".userCommentDiv").slideToggle(300, "linear");
  });

 $(document).on('click', '.CollapsibleTab', function() {
    $(this).next('.CollapsibleComments').slideToggle(300, 'linear');

    if($(this).hasClass('ten')) {

      $(this).html($(this).html() == "HIDE THESE COMMENTS" ? "SHOW MORE COMMENTS" : "HIDE THESE COMMENTS");

    } else {

      $(this).html($(this).html() == "HIDE ALL COMMENTS" ? "SHOW LEADING COMMENTS" : "HIDE ALL COMMENTS");
    }

  });

 //pagination
 $(document).on('click', '.voi-circle-left', function() {

 	var page_num = parseInt( $("#page_number").val() );

 	if(page_num == 1) {

 		return false;

 	} else {

 		new_page_num = page_num - 1;
 		$("#page_number").val(parseInt(new_page_num));
    $("#page_num_display").html(new_page_num);
 		console.log('page number called'+ new_page_num);
 		$.post('http://www.voteoverit.com/connect/debate_display.php', 
 			{page:new_page_num, 
 		     issue_id : $(this).data('issueid'), 
 		     user: user
 		    }).done(function(data){

 			console.log(data);

 			if(data == 'no comments') {
 				$("#page_number").val(page_num);
 				return false;
 			} else {
 				$("#opinionslist").html(data);
 			}
 		});
 	}
 });

 $(document).on('click', '.voi-circle-right', function() {

 	var page_num = parseInt( $("#page_number").val() );

 	new_page_num = page_num + 1;

 	$("#page_number").val(parseInt(new_page_num));
  $("#page_num_display").html(new_page_num);

console.log('page:' + new_page_num);
 		$.post('http://www.voteoverit.com/connect/debate_display.php', 
 			{page:new_page_num, 
 		     issue_id : $(this).data('issueid'), 
 		     user: user
 		    }).done(function(data){

 			if(data == 'No Comments') {
 				$("#page_number").val(page_num);
 				return false;
 			} else {
 				$("#opinionslist").html(data);
 			}
 		});
 });

 $(document).on('click', '.suggest_link', function(e) {

 	$.post('http://www.voteoverit.com/connect/api_hook.php', {

 		link_type : $(this).data('linktype'),
 		link_url : $(this).attr('href'),
 		user : user,
 		issue_id: $(this).data('issueid'),
 		from_url: window.location.href

 	})

 });

	}


}(jQuery));
