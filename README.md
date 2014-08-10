voi-plugin
==========

voi jquery plugin

requires jquery

use http://www.voteoverit.com/js/voi-plugin.js or this plugin

If you haven't already, create a debate at http://www.voteoverit.com/create_issue.php. Put your link (see url below) in this input box for reference.<br/>

Example usage:

url - current url of your content. this is a unique parameter matched up with voi system. this is set up when debate is created. <br/>
users - unique identifier for user. so as to provide unique votes on a per user basis<br/>
token - unique token from voi<br/>

$('#voi_wrapper').voi({<br/>
    	url       : '',<br/>
    	users       : '',<br/>
    	token  : '', <br />
	});
