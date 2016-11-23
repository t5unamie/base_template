var express = require('express');
var router = express.Router();
var elastic = require('../elasticsearch');
var _ = require('lodash');

/* GET home page. */
router.get('/', function(req, res) {
  
  elastic.getTasks(function (err, result) {
    if (err) {
      res.render('index', {esTasks: []}); 
      return console.log(err);
    }
    var records = _.get(result, 'hits.hits');
    console.log(records);
    res.render('index', {esTasks: records}); 
  });
});

/*  Allow new jobs to be added */

router.post('/', function (req, res) {
    var record = {
      task: req.body.task,
      urgency: req.body.urgency,
      requester: req.body.requester
    };

    console.log(record);

    elastic.addTask(record).then(function (result) {
      console.log('The record created!');
      console.log(result);
      res.redirect('/');
    }); 
});

/*  This responds delete job */
router.post('/delete', function(req, res, next) {
  console.log(req);
   var taskid = req.body.taskid || req.query.taskid;
   console.log(taskid);
   elastic.deleteTask(taskid, function(err, del) {
       if (err) { res.json({"err": err}); } else { res.json({success: true})}
   });
});

// respond with "hello world" when a GET request is made to the homepage
router.get('/test', function (req, res) {
  res.send('hello world')
})

module.exports = router;