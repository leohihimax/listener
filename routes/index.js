var express = require('express');
var exec = require('child_process').exec;
var router = express.Router();
var phantom = require('phantom');

/* GET home page. */
router.get('/snapshot', function(req, res, next) {
  if (typeof(req.query._escaped_fragment_) !== "undefined") {
    phantom.create(function(ph) {
      ph.createPage(function(page) {
        page.open("http://ued.ustack.com/#!" + req.query._escaped_fragment_, function (status) {
	  if (status == "success") {
	    setTimeout(function() {
		page.evaluate(function() {return document.getElementsByTagName('html')[0].innerHTML;}, function(result) {
		  var html = "<!DOCTYPE html><html>" + result + "</html>";
                  res.send(html);
                  ph.exit();
            	});
	    }, 3000);
	  }
	});
      });
    });
  } else {
    res.render('index', { title: 'Express' });
  }
});

router.post('/deploy', function(req, res, next) {
  exec('git pull && npm install  && bower install --allow-root && cp -r app/* ../www/ued_ustack_com', {cwd: '/var/ued'}, function(error, stdout, stderr) {
	res.send(stdout);
	if (error !== null) {
	    console.log('exec error: ' + error);
	    res.send(error);
	}
  });
});

module.exports = router;
