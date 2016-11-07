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
      res.redirect('back');
    });   
});

/*  This responds delete job */
router.delete('/', function (req, res) {
   res.send('DELETE job');
})

/*  This responds a GET request for the /list_user page. */
router.get('/list_job', function (req, res) {
   res.send('listing jobs');
})

module.exports = router;