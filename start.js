var IBM_APIs = require('./IBM_APIs.js');
// ibm_apis({email:'asd@asd.com', password:'AsdUyr13'});

var ibm_apis = new IBM_APIs();
// ibm_apis.test();

// ibm_apis.portalconfig('https://sb-sohiloizomcom-oizom.developer.eu.apiconnect.ibmcloud.com/', function(err, data){
//     console.log(err)
//     console.log(data);
// });

// ibm_apis.getOrganizatins(function(err, data){
//     console.log(err)
//     console.log(data);
// });

// ibm_apis.getAppList(function(err, data){
//     console.log(err)
//     console.log(data);
// });

// var req = {
//     name:'Demo application2',
//     description:'Name And location of organizatin loram ispadam dummy text',
//     oauthRedirectURI:'',
//     public:true
// };
// ibm_apis.createApp(req, function(err, data){
//     console.log(err);
//     console.log(data);
// }, null);

// ibm_apis.getPlanList(function (err, data){
//     console.log(err);
//     console.log(data);
// });

ibm_apis.subAppToPlan(function (err, data){
    console.log(err);
    console.log(data);
});