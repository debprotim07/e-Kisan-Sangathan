var mysql        = require('mysql');
var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride= require("method-override");
var session       = require('express-session');
var path          = require("path");

var router  = express.Router();

    

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());




// var con = mysql.createConnection({
//   host: "localhost",
//   user: "username",
//   password: "password",
//   database: "trial"
// });



app.get("/",function(req,res){
    res.render("landing");
});

//INDEX - show all staff details
app.get("/staff",isLoggedIn,function(req,res){
    //get all staff from db
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "Devrocks1997",
        database: "trial3"
    });
    con.connect(function(err) {
      if (err){
        console.log(err);
      }else{
      console.log("Connected!");
      var sql="SELECT * FROM staff";
      con.query(sql, function (err, result,fields) {
        if (err){
          console.log(err);
        }else{
        res.render("index",{staff:result});
        }
        });
      }
      con.end();
});
});

//CREATE - add new employee to db
        app.post("/staff", function(req, res){
            // get data from form and add to staff
            var rname = req.body.name;
            var rid = req.body.id;
            var rgroupid=req.body.groupid;
            var rgroupname=req.body.groupname;
            var rprojectid=req.body.projectid;
            var rprojectname=req.body.projectname;
            var rpassword=req.body.password;
            var rcontribution=req.body.contribution;
            var rprojectyear=req.body.projectyear;
            var rdivision=req.body.division;
            var rdesignation=req.body.designation;
            console.log(req);
        
            
            
        let mysql = require('mysql');
        let connection = mysql.createConnection({
          host: "localhost",
                user: "root",
                password: "Devrocks1997",
                database: "trial3"});
         
        // insert statment staff
        let stmt = `INSERT INTO staff(name,id,groupid,projectid,password,contribution,year,division,designation)  VALUES ?  `;
        let staff = [
          [rname, rid, rgroupid, rprojectid,rpassword,rcontribution,rprojectyear,rdivision,rdesignation ],
        ];
         
        // execute the insert statment
        connection.query(stmt, [staff], (err, results, fields) => {
          if (err) {
            return console.error(err.message);
          }
          // get inserted rows
          console.log('Row inserted:' + results.affectedRows);
        });
        
        // insert statment groupproject
        let stmt1 = `INSERT INTO groupproject(id,groupid,projectid,groupname,projectname,projectyear)  VALUES ?  `;
        let staff1 = [
          [rid,rgroupid,rprojectid,rgroupname,rprojectname,rprojectyear ],
        ];
         
        // execute the insert statment
        connection.query(stmt1, [staff1], (err, results, fields) => {
          if (err) {
            return console.error(err.message);
          }
          // get inserted rows
          console.log('Row inserted:' + results.affectedRows);
        });
        
        // insert statment groupview
        let stmt2 = `INSERT INTO groupview(groupid,groupname)  VALUES ?  `;
        let staff2 = [
          [rgroupid,rgroupname ],
        ];
         
        // execute the insert statment
        connection.query(stmt2, [staff2], (err, results, fields) => {
          if (err) {
            return console.error(err.message);
          }
          // get inserted rows
          console.log('Row inserted:' + results.affectedRows);
        });
         
        // close the database connection
        connection.end();
        res.redirect("/staff");
          
        
        });



//NEW - SHOW FORM TO CREATE NEW ENTRY
        app.get("/staff/new",isLoggedIn, function(req, res){
           res.render("new.ejs"); 
        });

//DELETE - FORM TO DELETE A ROW
        app.get("/staff/delete",isLoggedIn,function(req,res){
          res.render("delete.ejs");
        });

//DESTROY- DELETE THE ROW
        app.post("/staff/delete/id", function(req, res){
            // get data from form and add to staff
            var rname = req.body.name;
            var rtid = req.body.id;
            var rid  =Number(rtid);
            var rgroupid=req.body.groupid;
            var rprojectid=req.body.projectid;
            console.log(req);

        let mysql = require('mysql');
        let connection = mysql.createConnection({
          host: "localhost",
                user: "root",
                password: "Devrocks1997",
                database: "trial3"});
 

 
        // DELETE statment
        let sql = `DELETE FROM staff WHERE staff.id = ? AND staff.groupid=? AND  staff.projectid=?`;
         
        // delete a row with id : rid
        connection.query(sql, [rid,rgroupid,rprojectid] , (error, results, fields) => {
          if (error)
            return console.error(error.message);
         
          console.log('Deleted Row(s):', results.affectedRows);
        });
         
        connection.end();
        res.redirect("/staff");
          

        });

//SORTED STAFF - VIEW
        app.post("/staff/sorted",isLoggedIn,function(req,res){
          var rname=req.body.efarmername;
          
          
          var con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "Devrocks1997",
                database: "trial3"
            });
            con.connect(function(err) {
              if (err){
                console.log(err);
              }else{
              console.log("Connected!");
        
              }
        });
              // insert statment
              var search=rname;
              // let stmt="select * from staff where staff.name like ";
              // let staff = [ rname];
                 
              // execute the insert statment
                    con.query('SELECT * FROM staff WHERE staff.name LIKE ?',['%'+search+'%'], (err, results, fields) => {
                  if (err) {
                    return console.error(err.message);
                  }else{
                  // get inserted rows
                  console.log('Rows searched:' + results);
                  console.log(results);
                  res.render("index.ejs",{staff:results});
                  con.end();
                    }
                  });
        
        });


//GROUP VIEW
        app.get("/groupindex",isLoggedIn,function(req,res){
          var con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "Devrocks1997",
                database: "trial3"
            });
            con.connect(function(err) {
              if (err){
                console.log(err);
              }else{
              console.log("Connected!");
              var sql="SELECT * FROM groupview";
              con.query(sql, function (err, result,fields) {
                if (err){
                  console.log(err);
                }else{
                res.render("groupindex.ejs",{groupview:result});
                }
                });
              }
              con.end();
        });
        });

//SORTED-GROUP VIEW
        app.post("/group/sorted",function(req,res){
          var rname=req.body.egroupname;
          
          
          var con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "Devrocks1997",
                database: "trial3"
            });
            con.connect(function(err) {
              if (err){
                console.log(err);
              }else{
              console.log("Connected!");
        
              }
        });
              // search statment
              var search=rname;
                 
              // execute the search statement
                    con.query('SELECT * FROM groupview WHERE groupview.groupname LIKE ?',['%'+search+'%'], (err, results, fields) => {
                  if (err) {
                    return console.error(err.message);
                  }else{
                  // get inserted rows
                  console.log('Rows searched:' + results);
                  console.log(results);
                  res.render("groupindex.ejs",{groupview:results});
                  con.end();
                    }
                  });
        
        });



//GROUP->PROJECT VIEW
        app.get("/groupindex/:id",isLoggedIn,function(req,res){
          var rgroupid=req.params.id;
          console.log(req.params);
          
          
          var con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "Devrocks1997",
                database: "trial3"
            });
            con.connect(function(err) {
              if (err){
                console.log(err);
              }else{
              console.log("Connected!");
        
              }
        });
              // insert statment
              let stmt="select distinct groupproject.groupid, groupproject.groupname, groupproject.projectid, groupproject.projectname from groupproject, groupview where groupproject.groupid= ?";
              let groupproject = [ rgroupid];
                 
              // execute the insert statment
                    con.query(stmt, [groupproject], (err, results, fields) => {
                  if (err) {
                    return console.error(err.message);
                  }else{
                  // get searched rows
                  console.log('Rows searched:' + results);
                  console.log(results);
                  if(results[0].projectid==''){
                    res.render("nocontent.ejs",{results:results});
                  }else{
                  res.render("groupprojectview.ejs",{results:results});}
                  con.end();
                    }
                  });
        
        });
        
//GROUP->PROJECT->STAFF VIEW
app.get("/groupindex/:gid/:pid/staff",isLoggedIn,function(req,res){
  var rgroupid=req.params.gid;
  var rprojectid=req.params.pid;
  
  var con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "Devrocks1997",
                database: "trial3"
            });
            con.connect(function(err) {
              if (err){
                console.log(err);
              }else{
              console.log("Connected!");
        
              }
        });
              // query statment
              let stmt="select distinct groupproject.groupid, groupproject.groupname, groupproject.projectid, groupproject.projectname, staff.id, staff.name, staff.division, staff.designation, staff.year, staff.contribution from groupproject,staff where groupproject.id=staff.id AND groupproject.groupid=staff.groupid AND groupproject.projectid=staff.projectid AND staff.groupid= ? AND staff.projectid= ?";
              let groupproject = [rgroupid,rprojectid];
                 
              // execute the insert statment
                    con.query(stmt, groupproject, (err, results, fields) => {
                  if (err) {
                    return console.error(err.message);
                  }else{
                  // get searched rows
                  console.log('Rows searched:' + results);
                  console.log(results);
                  
                  res.render("groupprojectstaff.ejs",{staff:results});
                  
                  con.end();
                    }
                  });
  
})
          


//PROJECT VIEW
        app.get("/projectindex",isLoggedIn,function(req,res){
          res.render("projectindex.ejs");
        });

//ORGANISATION VIEW
        app.get("/organisationindex",isLoggedIn,function(req,res){
          res.render("organisationindex.ejs");
        });
        

//handling login logic
app.post('/login', function(request, response) {
  var con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "Devrocks1997",
                database: "trial3"
            });
            con.connect(function(err) {
              if (err){
                console.log(err);
              }else{
              console.log("Connected!");
        
              }
        });
  global.loggedin=false;
	var username = request.body.farmerid;
	var password = request.body.farmerpassword;
	if (username && password) {
		con.query('SELECT * FROM staff WHERE id = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
			  global.loggedin=true;
				request.session.loggedin = true;
				request.session.username =username;
				response.redirect('/staff');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
	con.end();
});

// logout route
app.get("/logout", function(req, res){
   global.loggedin=false;
   req.logout();
   res.render("landing.ejs");
});


//MIDDLEWARE
function isLoggedIn(req, res, next){
    if(global.loggedin==true){
        return next();
    }else{
    res.render("landing.ejs");
    }
}










// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   var sql="INSERT INTO STAFF(name, id) values()";
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("Result: " + result);
//   });
// });



//CODE FOR LISTENING TO CLOUD 9 PORT
// app.listen(process.env.PORT, process.env.IP, function(){
//    console.log("The Cloud9 Server Has Started!");
// });

//CODE FOR CONNECTING TO LOCAL SERVER
const http = require('http');


var server = http.createServer(app);
server.listen(3000, 'localhost');
server.on('listening', function() {
    console.log('Express server started on port %s at %s', server.address().port, server.address().address);
});