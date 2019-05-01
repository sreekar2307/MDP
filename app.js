const express = require('express')
const bodyParser = require('body-parser');
const app = express();
const request = require('request');
const session = require('express-session')
var cookieParser = require('cookie-parser')
const email = require('./email.js');

app.use(express.static('public'))
app.use(cookieParser())
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({ secret: 'Hello there!!', cookie: { maxAge: 900000 },   resave: false,  saveUninitialized: true}))

// Routes
/*HOME ROUTE*/
app.get('/',function(req,res){
	res.render('index',{username:req.session.username});
})

/*To login and logout*/ 
app.get('/login',not_logged_in,function(req,res){
	res.render('login',{wrong_crendentials :false});
})
app.post('/login',not_logged_in,function(req,res){
	if(req.body.username=='admin' && req.body.password=='admin'){
		req.session.username="admin";
		res.redirect('/');
	}
	else{
		res.render("login",{wrong_crendentials :true});
	}
})
app.get('/logout',check_logged_in,function(req,res){
	req.session.destroy()
	res.redirect("/");
})

/*Signup just rendering the page*/
app.get('/signup',not_logged_in, function(req,res){
	res.render('signup');
})
/*for a spefic movie*/
app.get('/movie/:id',function(req,res){
	let movie, credits,boolean=true;
	request('https://api.themoviedb.org/3/movie/'+req.params.id+'?api_key=27b1aefdf15b7483f95fdc09a980acc0&language=en-US',function(error,response,body){
			movie = JSON.parse(response.body)
	request('https://api.themoviedb.org/3/movie/'+req.params.id+'/credits?api_key=27b1aefdf15b7483f95fdc09a980acc0&language=en-US',function(error,response,body){
			credits = JSON.parse(response.body);
	if(req.session.cart_items_id && req.session.cart_items_id.find(function(element){ return element==req.params.id}))
		boolean  = false;
	if(movie && credits)
		res.render('movie',{body:movie,credits:credits,username:req.session.username,add_to_cart:boolean});
	else
		res.send('plz refresh the page');
		})
	})
})
/*Cart functionality*/
app.get('/user/cart',check_logged_in,function(req,res){
	res.render("cart",{cart_items:req.session.cart_items,username:req.session.username})
})
app.post('/add_to_cart/:id',check_logged_in,function(req,res){
	if(!req.session.cart_items){
		req.session.cart_items = new Array()
		req.session.cart_items_id = new Array()
	}
	req.session.cart_items_id.push(req.params.id);
	req.session.cart_items.push(req.body);
	res.redirect('/movie/'+req.params.id);
})
app.post('/remove_from_cart/:id',check_logged_in,function(req,res){
	var index = req.session.cart_items_id.indexOf(req.params.id);
	if (index > -1) {
  		req.session.cart_items_id.splice(index, 1);
  		req.session.cart_items.splice(index, 1);
	}
	res.redirect('/movie/'+req.params.id);
})

/*checkout and send a notification message*/
app.post('/checkout',check_logged_in,function(req,res){
	if(req.session.cart_items){
		var cart_items_json  = JSON.parse(req.cookies.cart_items);
		var total = 0
		var email_body  = "Hi User,\n"
		email_body +="We recived an order for\n\n\n"
		for(var key in cart_items_json){
			email_body+=(key+".......... ₹"+cart_items_json[key])+"\n";
			total += cart_items_json[key];
		}
		email_body+= ("Total............... ₹"+total+"\n\n\n");
		email_body+="The above items will be posted to you in three working days to the below mentioned address\n\n"
		email_body+=req.body.address1+", "+ req.body.address2+",\n"+req.body.address3+", "+ req.body.address4+".";
		email.send_an_email(req.body.email,email_body);
		req.session.cart_items=null;
		req.session.cart_items_id=null;
		res.redirect('/')
	}
	else{
		res.send('Your cart is empty');
	}
})
/*Middle ware to check if the user is looged in */
function check_logged_in(req,res,next){
	if(req.session.username)
		next()
	else
		res.redirect('/login')
}
function not_logged_in(req,res,next){
	if(!req.session.username)
		next();
	else
		res.send('You are already logged in plz logout first');
}
// Listen in port no 3000
app.listen(3000,function(){
	console.log('server started');
}) 