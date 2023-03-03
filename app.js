const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
// const mailchimp = require("@mailchimp/mailchimp_marketing");
// mailchimp.setConfig({
//   apiKey: "1d85c28026f517934f778371a44dfc32-us21",
//   server: "us21",
// });
const app = express();
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public")); // This is a special method for using our local(static) files like css
//Change css file directory for html file relative to public file ex. if the file inside of folder -> css/styles.css
app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html");

});

app.post("/",function(req,res){
  const name = req.body.name;
  const surname = req.body.surname;
  const email = req.body.email;

//With https
/////////////////////////////////////////////////////////////////////////////////
  const data = {
    members : [
      {
        email_address : email,
        status : "subscribed",
        merge_fields:{
          FNAME: name,
          LNAME: surname
        }

      }
    ]
  };

  const jsondata = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/32664f868b";
  const options = {
    method : "POST",
    auth: "talha:1d85c28026f517934f778371a44dfc32-us21"
  }

  const request = https.request(url,options,function(response){

    if(response.statusCode == 200) {res.sendFile(__dirname+"/success.html");}
    else {res.sendFile(__dirname+"/failure.html");}

    response.on("data",function(data){
      console.log(JSON.parse(data));
    })


  });



  request.write(jsondata);
  request.end();
////////////////////////////////////////////////////////////////////////////////////////


//With mailchimps methods (documentation)
////////////////////////////////////////////////////////////////////////////////////
  // const listId = "32664f868b";
  // const subscribingUser = {
  //   firstName: name,
  //   lastName: surname,
  //   email: email
  // };
  //
  // async function run() {
  //   const response = await mailchimp.lists.addListMember(listId, {
  //     email_address: subscribingUser.email,
  //     status: "subscribed",
  //     merge_fields: {
  //       FNAME: subscribingUser.firstName,
  //       LNAME: subscribingUser.lastName
  //     }
  //   });
  //
  // }
  //
  // run();
////////////////////////////////////////////////////////////////////////////////////

});

app.post("/failure",function(req,res){
  res.redirect("/");
});





app.listen(process.env.PORT || 3000,function(){ //lately first part was 3000 because we working on local server for both we can write ||3000
  console.log("Server running on port 3000");
});

//API key
//1d85c28026f517934f778371a44dfc32-us21

//List ID
//32664f868b
