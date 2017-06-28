const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

var backtestModel = require('../models/backtest');

// Backtests
router.get('/list', passport.authenticate('jwt', {session: false}), function(req, res, next){
		// console.log(req.user.id);
		backtestModel.getBacktestsByUserid(req.user.id, function(success, result) {
			if (success) {
					res.json(result);
			} else {
					res.json(null);
			}
		});
});

// Backtest
router.get('/single/*', passport.authenticate('jwt', {session: false}), function(req, res, next){
		backtestId = req.originalUrl.split('/')[req.originalUrl.split('/').length -1];
		console.log(backtestId);
		backtestModel.getBacktestById(backtestId, function(success, result) {
			if (success) {
					res.json(result);
			} else {
					res.json(null);
			}
		});
});

module.exports = router;