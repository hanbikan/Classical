var express = require('express');
var router = express.Router();
var Account = require('../models/Account');

router.get('/register', function(req, res){
  var id = req.flash('id')[0];
  var nickname = req.flash('nickname')[0];
  var email = req.flash('email')[0];
  var errors = req.flash('errors')[0] || {};
  res.render('register', {
    id:id,
    nickname: nickname,
    email:email,
    errors:errors
  });
});

router.get('/welcome', function(req, res){
  res.render('welcome');
});

router.post('/register', function(req, res){ //TODO: 아이디, 닉네임 동시에 중복 시 에러 메시지가 같이 나오게
  Account.findOne({id:req.body.id}, function(err,user){
    if(user){
      req.flash('errors', parseError(11000, 'id'));
    }
  });
  Account.findOne({nickname:req.body.nickname}, function(err,user){
    if(user){
      req.flash('errors', parseError(11000, 'nickname'));
    }
  });
  Account.create(req.body, function(err, account){
    if(err){
      console.log(req.body.id);
      req.flash('id', req.body.id);
      req.flash('nickname', req.body.nickname);
      req.flash('email', req.body.email);
      return res.redirect('/register');
    }
    res.redirect('/welcome');
  });
});

module.exports = router;

function parseError(errorcode, target){
  var parsed = {};
  if(errorcode == '11000'){
    if (target=='id'){
      parsed.id = {message:'이미 존재하는 아이디입니다.'};
    }
    if (target=='nickname'){
      parsed.nickname = {message:'이미 존재하는 닉네임입니다.'};
    }
  }
  return parsed;
}