voi-plugin
==========

voi jquery plugin

requires jquery

use http://www.voteoverit.com/js/voi-plugin.js or this plugin

Example usage:

url - current url of voi debate. example: http://www.voteoverit.com/polls/oil-sands-1 <br/>
users - unique identifier for user. so as to provide unique votes on a per user basis<br/>
token - unique token from voi<br/>

$('#voi_wrapper').voi({<br/>
    	url       : '',<br/>
    	users       : '',<br/>
    	token  : '', <br />
	});
