'use strict';

var http = require("https");
var config = require('./config.js');

const APIM_CONTEXT = config.apim_context;
const HOSTNAME = config.hostname;


function IBM_APIs(){
    this.user = config.user;
}

IBM_APIs.prototype.test = function test(){
    console.log('test function!');
    console.log(this.user);
    console.log(this.user.username);
    console.log(this.user.password);
}

/**
 * Retrive the IBM Developer portal configuration
 * For internal functions use only
 */
 
IBM_APIs.prototype.portalconfig = function portalconfig(originURL, callback){
    this.https('/v1/portal/config?originURL='+encodeURIComponent(originURL), 'GET', false, null, function(err, data){
        callback(err, data);
    });
}

/**
 * Signup new user on IBM Developer portal 
 */

IBM_APIs.prototype.registeruser = function registeruser(User, callback){
    //{"username":"user_name","password":"password","firstName":"first_name","lastName":"last_name","organization":"dev_org_name"}
    //TODO   
}

/**
 * List organizations
 * Retrieve the list of developer organizations in which the authenticated user is a member
 * /v1/portal/orgs
 */
 IBM_APIs.prototype.getOrganizatins = function getOrganizatins(callback){
     this.https('/v1/portal/orgs', 'GET', true, null, function(err, data){
         callback(err, data);
     });
 }

/**
 * List applications 
 * Retrieve the collection of applications within the scope of orgs/{orgID}
 * /v1/portal/orgs/{orgID}/apps
 */
 IBM_APIs.prototype.getAppList = function getAppList(callback){
     var path = '/v1/portal/orgs/'+config.org_id+'/apps';
     this.https(path, 'GET', true, null, function(err, data) {
        callback(err, data); 
     });
 }

/**
 * Create an application
 * Create an application resource associated with orgs/{orgID}.
 * /v1/portal/orgs/{orgID}/apps
 * POST
 */
 IBM_APIs.prototype.createApp = function createApp(request, callback, orgID = null){
     request.credentials = {clientID:true, clientSecret:true, description:'credentials which use for invoking apis'}
     var path = '/v1/portal/orgs/'+config.org_id+'/apps';
     this.https(path, 'POST', true, request, function(err, data){
         callback(err, data);
     });
 }
 
/**
 * List the plan subscriptions for an application
 * Retrieve the collection of plan subscriptions for an application.
 * /v1/portal/orgs/{orgID}/apps/{appID}/subscriptions
 * GET
 */
 IBM_APIs.prototype.getPlanList = function getPlanList(callback, orgID = null, appID = null){
     var path = '';
     path = '/v1/portal/orgs/'+config.org_id+'/apps/'+config.app_id+'/subscriptions';
     this.https(path, 'GET', true, null, function(err, data){
         callback(err, data);
     });
 }
 
/**
 * Subscribe an application to a plan
 * An application plan subscription allows the application to invoke API resources that are exposed by the plan. 
 * To create a new subscription, specify the plan's name, and either product's ID or product's name and version, 
 * but not both.
 * /v1/portal/orgs/{orgID}/apps/{appID}/subscriptions
 * POST
 */
 
 IBM_APIs.prototype.subAppToPlan = function subAppToPlan(callback, appID = null, product = null){
    var path = '/v1/portal/orgs/'+config.org_id+'/apps/'+config.app_id+'/subscriptions';
    var request = {
        plan:config.plan,
        product:{
            name:config.product.name,
            version:config.product.version
        }
    };
    console.log(request);
    this.https(path, 'POST', true, request, function(err, data){
        callback(err, data);
    });
 }


/**
 * This is common https function for IBM apis request
 * For internal use only
 */
 
IBM_APIs.prototype.https = function https(path, methos, authorization, payload, callback){
    var options = {
      "method": methos,
      "hostname": HOSTNAME,
      "port": null,
      "path": path,
      "headers": {
        "x-ibm-apimanagement-context": APIM_CONTEXT,
        "content-type": "application/json",
      }
    };
    
    if (authorization) {
        options.headers.authorization = "Basic "+new Buffer(this.user.username+":"+this.user.password).toString('base64');
    }
    
    var req = http.request(options, function (res) {
      var chunks = [];
    
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });
    
      res.on("end", function () {
        var body = Buffer.concat(chunks);
        // console.log(body.toString());
        callback(0, body.toString());
      });
      
      req.on('error', function (e) {
          console.log(e);
          callback(1, null);
      });
        
      req.on('timeout', function () {
          console.log('timeout');
          callback(1, null);
          req.abort();
      });
      
    });

    if(methos === 'POST' && payload)
        req.write(JSON.stringify(payload));
        
    req.end();
}

/**
 * For feature implementation
 */
IBM_APIs.prototype.getAuthorization = function getAuthorization(){
    //> console.log(new Buffer("Hello World").toString('base64'));
    // SGVsbG8gV29ybGQ=
    // > console.log(new Buffer("SGVsbG8gV29ybGQ=", 'base64').toString('ascii'))
    // Hello World
    // return 
}

module.exports = IBM_APIs;