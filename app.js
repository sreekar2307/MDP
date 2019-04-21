const express = require('express')
const bodyParser = require('body-parser');
const app = express();
const request = require('request');
const session = require('express-session')
const email = require('./email.js');

app.use(express.static('public'))
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({ secret: 'Hello there!!', cookie: { maxAge: 900000 },   resave: false,  saveUninitialized: true}))

// Routes
app.get('/',function(req,res){
	app.set('title', 'My Site');
	res.render('index',{username:req.session.username});

})
app.get('/login',function(req,res){
	res.render('login',{wrong_crendentials :false});
})
app.post('/login',function(req,res){
	if(req.body.username=='Sreekar2307' && req.body.password=='Sreekar@123'){
		req.session.username="Sreekar2307";
		res.redirect('/');
	}
	else{
		res.render("login",{wrong_crendentials :true});
	}
})
app.get('/logout',function(req,res){
	if(req.session.username){
		req.session.destroy()
		res.redirect("/");
	}
	else{
		res.redirect("/login");
	}
})
app.get('/signup',function(req,res){
	res.render('signup')
})
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
app.get('/user/cart',function(req,res){
	res.render("cart",{cart_items:req.session.cart_items,username:req.session.username})
})
app.post('/add_to_cart/:id',function(req,res){
	if(!req.session.cart_items){
		req.session.cart_items = new Array()
		req.session.cart_items_id = new Array()
	}
	req.session.cart_items_id.push(req.params.id);
	req.session.cart_items.push(req.body);
	res.redirect('/movie/'+req.params.id);
})
app.post('/remove_from_cart/:id',function(req,res){
	var index = req.session.cart_items_id.indexOf(req.params.id);
	if (index > -1) {
  		req.session.cart_items_id.splice(index, 1);
  		req.session.cart_items.splice(index, 1);
	}
	res.redirect('/movie/'+req.params.id);
})
app.get('/mail',function(req,res){
	email.send_an_email("bollamsreekhar@gmail.com",'Age of Ultron-1');
	res.send('Done');
})
// Listen in port no 3000
app.listen(3000,function(){
	console.log('server started');
}) 
