/**
 * Created by mujahidmasood on 12.08.17.
 */

function FileController() {

    var that = this;
    var generalResponse = require('./GeneralResponse');
    var request = require('request').defaults({ encoding: null });

     that.download = function (req, res, next) {

         request.get(req.params.url, function (error, response, body) {
             if (!error && response.statusCode == 200) {
                 data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
                 console.log(data);
                 return res.send(generalResponse.sendSuccessResponse(true, 200, data))
             }else {
               console.error("Error inside download ",error);
               return res.send(generalResponse.sendFailureResponse(false, 400, error))
             }
         });
     }

    return that;

};

module.exports = new FileController();
