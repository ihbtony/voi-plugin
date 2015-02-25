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

      //var CookieSet = $.cookie('voi'); 

      //if (CookieSet == null) { //check if voi cookie is set
       // var timenow = $.now();
       // $.cookie("voi", timenow, { expires : 365 }); //set cookie id voi to timestamp and to expire in 1 year
      //}

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

           // e.preventDefault();
           console.log('new debate');
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

                        console.log(d);
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


        $.post('http://www.voteoverit.com/connect/debate_display.php', 
    		{ token : settings.token,
    		  title : settings.url,
          //cookie: $.cookie('voi'),
          user  : settings.users }).done(function(data) {
    		  	$this.html(data);
    	});    


  $(document).on("click", ".userCommentEdit", function() {
  //$(".userCommentEdit").click(function() {

    console.log('user comment edit clicked');

    console.log( $(this).text() );
var ele = $(this).attr('id').split('-');
    if( $(this).text() == 'EDIT') {

      console.log('element id:' + ele);
      console.log('value text = Edit');

      var ele = $(this).attr('id').split('-');
      $( "#pollText_" + ele[2] ).hide();

      $(this).text('SAVE');
      $('.userCommentText').hide();
      $("#comment_" + ele[2]).show(); //show textbox with existing text for editing

    } else if($(this).text() == 'SAVE') {
      
      //update
      console.log($(this).attr('id'));
      ele = $(this).attr('id').split('-');
      console.log(ele[0]);

      var $this = $(this);

      $.post("http://www.voteoverit.com/API/polls/edit", { 

        id: ele[2],
        Updated: "",
        pollText : $("#comment_" + ele[2]).val(),
        user : settings.users

      }).done(function(data) {

        console.log('edit data:' + data);
        if(data == 'Poll Saved') {
          $(".addCommentDiv").html('<div class="userCommentDiv" id="userCommentDiv_60" style="display: inline-block;"><div class="debateImageDiv latter" style="margin-top:2px; float:left;"><a href="http://www.voteoverit.com/myprofile/history.php?user=3"><img id="debateImage" src="http://www.voteoverit.com/member/profileImages/3.jpg" style="height:40px;"></a></div><div id="comment_3" style="float:left; width:300px;"><span class="userCommentText" id="pollText_60">' + $("#comment_" + ele[2]).val() + '<font class=""></font></span><textarea type="text" class="addCommentText" id="comment_60" style="display:none; height:78px; min-width:320px; max-width:280px; margin:0px 6px;">' + $("#comment_" + ele[2]).val() + '</textarea></div><div style="float:right"><button class="userCommentEdit" id="comment-3-60">EDIT</button><br><button class="userCommentRemove" id="remove-3-60" style="">REMOVE</button></div><br></div>');
            //$("#comment_" + ele[2]).val() );
          $(".addCommentDiv").show();
          $('.userCommentText').html( $("#comment_" + ele[2]).val() );
          $('.userCommentText').show();
        } 
                                              


        $("#comment_" + ele[2]).hide(); 
        console.log($("#comment_" + ele[2]).val());

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
        pollText : ''

      }).done(function(data) {

        console.log('data:' + data);
        $("#userCommentDiv_" + ele[2]).remove();

        $(".addCommentDiv").html('<div class="userCommentDiv" id="userCommentDiv_60" style="display: inline-block;"><div class="debateImageDiv latter" style="margin-top:2px; float:left;"><a href="http://www.voteoverit.com/myprofile/history.php?user=3"><img id="debateImage" src="http://www.voteoverit.com/member/profileImages/3.jpg" style="height:40px;"></a></div><div id="comment_3" style="float:left; width:300px;"><span class="userCommentText" id="pollText_60"><font class=""></font></span><textarea type="text" class="addCommentText" id="comment_60" style="display:none; height:78px; min-width:320px; max-width:280px; margin:0px 6px;"></textarea></div><div style="float:right"><button class="userCommentEdit" id="comment-3-60">EDIT</button><br><button class="userCommentRemove" id="remove-3-60" style="">REMOVE</button></div><br></div>');

          console.log('parent append!');

      }); 
  });
  $(".voi-bookmark").click(function() {

      $(this).css("color" , "#48D8DC")
      $("#messageMessage").html("<span class='influence'>Bookmarked</span> Debate for later!<br>");
      //$("#message" ).show("slide", {direction: "right"}, 500, callbackMessage );

  });


  $(document).on("click", ".addCommentButton", function() {

    console.log('add comment clicked');

      console.log($(this).attr('id'));
      var ele = $(this).attr('id').split('-');
      console.log(ele[0]);

      issue_id = ele[1];
      vote = ele[2];
      $this = $(this);
      console.log(issue_id + "\r\n" + 'vote:' + vote + "\r\n" + settings.users + "\r\n" + $("#comment_" + issue_id).val());

    $.post("http://www.voteoverit.com/API/polls/add", { 

          user: settings.users,
          issue_id: issue_id,
          Created : "", 
          pollText : $("#comment_" + issue_id).val(),
          vote: vote 

      }).done(function(data) { 
        console.log( ' return from add comment:' + data);
        var return_data = $.parseJSON(data);
        PollID = return_data.PollID; //poll id from insert returned
        if(return_data.message != 'Problem saving opinion') {
          console.log("comment saved");

          $("#bar_" + issue_id).append("<div class='userCommentDiv' id='userCommentDiv_" + PollID + "' style='display:inline-block;'><div class='debateImageDiv latter' style='margin-top:2px; float:left;'><img id='debateImage' src='http://www.voteoverit.com/member/profileImages/6307.jpg' style='height:40px;'/></div><div id='comment_" + issue_id + "' style='float:left; width:340px;'><span class='userCommentText' id=''>" + $('#comment_' + issue_id).val() + "<font class=''></font> -  <font class=''> (ADDED) </font></span><textarea type='text' class='addCommentText' id='comment_" + PollID + "' style='display:none; height:78px; min-width:320px; max-width:320px; margin:0px 6px;'>" + $('#comment_' + issue_id).val() + "</textarea></div><div style='float:right;'><button class='userCommentEdit' id='comment-" + issue_id + "-" + PollID + "'>EDIT</button><br><button class='userCommentRemove' id='remove-" + issue_id + "-" + PollID + "' style=''>REMOVE</button></div><br></div>");


            $(".addCommentDiv").remove(); //remove add comment div and start using UserCommentDiv since they now have an existing comment in place

        } 

      }); 

    });

    $(document).on("click", ".addCommentCancel", function() {
        $(this).parent().hide();
    });

  $(document).on("click", ".userComment", function() {
    $(this).next('.addCommentDiv').slideToggle(300, 'linear');
    $('.userCommentDiv').show();
  });
  //for comments

  $(document).on('click', '.voi-plus', function() {

  		console.log('add comment vote');

      var id = $(this).attr("id").split("_")
      var elementID = id[1];
      var $this = $(this);
      console.log(elementID + 'comment positive');
      $.post("http://www.voteoverit.com/API/Polls/vote/1/" + elementID + "/" + settings.users, 
      {   user: settings.users,
          id: elementID,
          vote: 1 }).done(function(data) {

                console.log(data);
                if ((data) == "Already voted on this opinion!") {
                    console.log('already voted');
                } else {
            $this.addClass("voi-plus-fill");
            $this.removeClass("voi-plus");
            $("#messageMessage").html("<span class='influence'>+1pt</span> For Comment Vote<br>");
            //$("#message" ).show(1000, "swing", callbackMessage );
            }
      });

   });  

  function reload_vote_display(voteType) {

  	  	console.log('reload called')

  	$.post('http://www.voteoverit.com/connect/debate_display.php', 
    		{ token : settings.token,
    		  title : settings.url,
          //cookie: $.cookie('voi'),
          user  : settings.users }).done(function(data) {
    		  	$this.html(data);
    });   
          console.log('after reload');

  	//var total_votes = $("#total_votes").html();
  	//var max_votes = $("#max_votes").html();
  	//var pos_votes = $("#yay_percentage").html().replace('%', '');
  	//var neg_votes = $("#nay_percentage").html().replace('%', '');
///
  //	$("#total_votes").html( parseInt(total_votes + 1) );

  	//if(voteType == 'positive') {

	//	$("#yay_percentage").html( (parseInt(total_votes + 1) * ( parseInt(pos_votes/100) ) ).toFixed() );

  	//} else {

  	//	$("#nay_percentage").html( (parseInt(total_votes + 1) * ( parseInt(neg_votes/100) ) ).toFixed() );


  	///}
  	
  }
    
    $(document).on('click', '.voi-minus', function() {

    var id = $(this).attr("id").split("_")
    var elementID = id[1];
    var $this = $(this);
            console.log(elementID);
      $.post("http://www.voteoverit.com/API/Polls/vote/0/" + elementID + "/" + settings.users, 
      {   user: settings.users,
          id: elementID,
          vote: 0 }).done(function(data) {
        console.log(data);
        if ((data) == "Already voted on this opinion!") {
            console.log('already voted on comment');
        } else {
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


    console.log('pos button clicked testing');

    	$.post('http://www.voteoverit.com/connect/api_hook.php', 
             {token : settings.token,
              title : settings.url,
              vote: 1,
              user: settings.users}).done(function(data) {       

        if ( data == 'Already voted' || data == 'Vote Not Saved') {
            
            console.log('already voted on issue');

            //we're passing back the login stuff here because we don't have a valid email associated with this user id
        } else if( data.indexOf("<div class='signin'") >= 0) {

          $('.votebuttons').hide();
          $('.votingArea').prepend(data); ///append the html for them to add an email

        } else {
console.log('saved');
            reload_vote_display('positive');
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

        console.log('neg buttonc licked');
    $.post('http://www.voteoverit.com/connect/api_hook.php', 
             {token : settings.token,
              title : settings.url,
              vote: 0,
              user: settings.users}).done(function(data) {       

        if ( data == 'Already voted' || data == 'Vote Not Saved') {
            
                console.log('already voted');

            //we're passing back the login stuff here because we don't have a valid email associated with this user id
        } else if( data.indexOf("<div class='signin'") >= 0) {

          $('.votebuttons').hide();
          $('.votingArea').prepend(data);  ///append the html for them to add an email
          
        } else {
            reload_vote_display('negative');
        	console.log('saved');
                 // $("#message").show(1000, "swing", callbackMessage );  
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
    console.log(' save email clicked');
    $.post('http://www.voteoverit.com/connect/api_hook.php', 
        { update : updates,
          user_id : $("#user_id").val(),
          email : $("#email").val(),
          vote : $("#current_vote").val(),
          issue_id : $("#current_issue_id").val()
          }).done(function(data) {
      console.log('return');
      console.log(data);
      $(".signin").hide();
      $(".votebuttons").show();
      $("#bar_" + id).show();

      console.log('voted');
      if($("#current_vote").val() == 1) {
      	console.log('pos');
      	$("#neg_button_" + $("#current_issue_id").val()).remove();
      	$("#pos_button_" + $("#current_issue_id").val()).css({"margin-top" : "11.5px", "width" : "100%", "text-align" : "center"});

      } else {
      	console.log('neg');
      	$("#pos_button_" + $("#current_issue_id").val()).remove();
      	$("#neg_button_" + $("#current_issue_id").val()).css({"margin-top" : "11.5px", "width" : "100%", "text-align" : "center"});

      }

    });

  });


  //for login info if user is not logged in. logged in is indicated by having a valid email

  $(document).on('click', '#toggleView', function() {
    $(".voi-angle-right").toggleClass(function(){
      return "voi-angle-down";
    });

  });

 // $(".addLinkDiv").hide();
 // $(".linkAdd").click(function() {
 //   $(this).prev(".addLinkDiv").slideToggle(300, "linear");
  //  $(this).html("+ DONE");  // USE THIS TO ADD A LINK TO THE DEBATE // NEED TO RESET THE FORM AFTER
 //   $(this).next(".linkCancel").html("x CANCEL");
//  });

 // $(".addCommentDiv").hide();

  $(document).on('click', '.addComment', function() {
    $(this).next(".addCommentDiv").slideToggle(300, "linear");
  });

  //$(".userCommentDiv").hide();

  $(document).on('click', '.userComment', function() {
    $(this).next(".userCommentDiv").slideToggle(300, "linear");
  });

  // $('.CollapsibleSunlight').hide();

  //$('.CollapsibleLinks').hide();
 // $('.CollapsibleComments').hide();

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

 		console.log('page number called'+ new_page_num);
 		$.post('http://www.voteoverit.com/connect/debate_display.php', 
 			{page:new_page_num, 
 		     issue_id : $(this).data('issueid'), 
 		     user: settings.users
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
console.log('page:' + new_page_num);
 		$.post('http://www.voteoverit.com/connect/debate_display.php', 
 			{page:new_page_num, 
 		     issue_id : $(this).data('issueid'), 
 		     user: settings.users
 		    }).done(function(data){

 			console.log(data);

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
 		user : settings.users,
 		issue_id: $(this).data('issueid'),
 		from_url: window.location.href

 	}).done(function(data) {
 		console.log(data);
 	});

 });

	}


}(jQuery));
