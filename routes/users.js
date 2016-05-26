/**
 * Created by rubhu on 5/26/2016.
 */

// write the RestApi Servieces in this Resigion
var express = require('express');
var configs = require('../configs');

var routes = function(pool){
    var userRouter = express.Router();

    userRouter.route('/all').get(function(req,res){
        try{
            var query= "select * from usertypes";
             if(query !=0){
                 res.send(query[0]);
             }
        }
        catch (err) {

            return res.status(401).send({message: err.message});
        }
    });
    userRouter.route('/admin').get(function(req,res){
        try{
            var query= "select * from usertypes";
            if(query !=0){
                res.send(query[0]);
            }
        }
        catch (err) {

            return res.status(401).send({message: err.message});
        }
    });
    return userRouter;
};
module.exports =routes;
