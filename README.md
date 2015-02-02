voi-plugin
==========

voi jquery plugin

requires jquery

download and include this plugin after jquery.

If you haven't already, create a debate at http://www.voteoverit.com/create_issue.php. Put your link (see url below) in this input box for reference.<br/>

This plugin will access the voteoverit.com system and return an html element with matching debate content. See http://voteoverit.tk/connect/hook_test.html for an example.<br/>

Example usage:

url - current url of your content. this is a unique parameter matched up with voi system. this is set up when debate is created. <br/>
users - unique identifier for user. so as to provide unique votes on a per user basis<br/>
token - unique token from voi<br/>

$('#voi_wrapper').voi({<br/>
    	url       : '',<br/>
    	users       : '',<br/>
    	token  : '', <br />
	});

<br/>
please direct any questions to martin@voteoverit.com. Thanks!

#added February 1, 2015
suggested debates - this will search for and provide links to other pages on your site. the domain names must match what you used in debate creation. 

edit/add comment - guests can now add and edit comments from your site. VOI will log these comments under a uid@yoursite.com if no information is provided.

improved user logging - log all user actions, create unique user based on domain provided
