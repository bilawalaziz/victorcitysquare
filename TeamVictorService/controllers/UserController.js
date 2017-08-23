//This Controller deals with all functionalities of Student

function usersController() {
    var users = require('../models/usersSchema');
    var generalResponse = require('./GeneralResponse');
    var fs = require('fs');
    var that = this;
    var bcrypt = require('bcrypt');

    // Register User
    that.register = function (req, res, next) {
        try {

            users.find({email:req.params.email}, function(err, result){

                if(result.length>0){
                    return res.send(generalResponse.sendFailureResponse("User Already Registered With Given Email Address",400,result));
                }
                else{

                    var user = {};
                    // Hash the password with the salt
                    var salt = bcrypt.genSaltSync(10);
                    user["hashKey"] = salt;

                    for (var n in req.params) {
                        //encrypt pass before inserting into db
                        if (n == "password")
                            user[n] = bcrypt.hashSync(req.params.password, salt);
                        else
                            user[n] = req.params[n];
                    }
                    users.create(
                        user
                        , function (err, result) {
                            if (err) {
                                console.log(err);
                                return res.send(generalResponse.sendFailureResponse("Error Occured While registering a user",400,err));
                            }
                            else {
                                return res.send(generalResponse.sendSuccessResponse("Registeration Was Successfull",200,result));
                            }
                        });


                }
            });


        }
        catch (ex) {
            console.log("Exception:" + ex);
            return res.send(generalResponse.sendFailureResponse("/register:Exception Occured",400,ex));
        }
    };


    // Login
    that.login = function (req, res, next) {
        var email = req.params.email;
        var password = req.params.password;
        console.log("EMail "+email)
        console.log("Password "+password)


        users.findOne({email: email}, function (err, result) {

            console.log("result="+result);
            console.log("err="+err);
            if (err) {
                return res.send(generalResponse.sendFailureResponse("/login:error occured",400,err));
            }
            else if(result){
                //comparasison
                var salt = result.hashKey;
                var hash = result.password;
                var passwordHash = bcrypt.hashSync(password, salt);


                if(bcrypt.compareSync(password, hash)) {
                    // Passwords match
                    return res.send(generalResponse.sendSuccessResponse("/login: Successfull",200,result));
                } else {
                    // Passwords don't match
                    return res.send(generalResponse.sendFailureResponse("Email or password do not match",400,null));
                }


            }

            else   return res.send(generalResponse.sendFailureResponse("Email does not match",400,null));
        });
    };


    that.getUserList = function (req, res, next) {
        users.find(function (err, users) {
            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify(users));
        });
        return next();
    };

    that.getUserByEmail = function (req, res, next) {
        users.findOne({
            email: req.params.email
        }, function (err, data) {
        if (err)
                return   res.send(generalResponse.sendFailureResponse("getUserByEmail: Error Occured",400,error));
            else {
                return   res.send(generalResponse.sendSuccessResponse("getUserByEmail: Successful",200,data));
            }
        });
        return next();
    };
    that.updateUserProfile = function (req, res, next) {

        var query=   {"email": req.body.email};
        var userData = {}; // updated user
        for (var n in req.params) {
            if(req.body[n]) {
                userData[n] = req.body[n];
                if (n == "password"){
                    var salt = bcrypt.genSaltSync(10);
                    userData[n] = bcrypt.hashSync(req.body.password, salt);
                    userData["hashKey"] = salt;
                }
            }
        }
        users.findOneAndUpdate(query, userData, {upsert:true}, function(err, data){
            if (err)
                return   res.send(generalResponse.sendFailureResponse("Error Occured",400,error));
            else {
                return   res.send(generalResponse.sendSuccessResponse("Record Was Updated Successfully",200,data));
            }
        });

    };


    that.deleteUserByEmail = function (req, res, next) {
        users.remove({
        email: req.params.email
        }, function (err, data) {
            if (err)
                return res.send(generalResponse.sendFailureResponse("Error Occured While deleting the user",400,err));
            else {
                return res.send(generalResponse.sendSuccessResponse("user was deleted successful",200,data));
            }
        });

    };
};

module.exports = new usersController();