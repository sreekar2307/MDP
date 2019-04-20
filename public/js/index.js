// GLobal Variables

var json;
var current_number = 8;
var page_no=1;

// for the initial document on load 
window.addEventListener('DOMContentLoaded', (event) => {
  get_json_page();
});

// loading the content as we scroll down the page
window.onscroll = function() {
  var d = document.documentElement;
  var offset = d.scrollTop + window.innerHeight;
  var height = d.offsetHeight;
  if (offset === height && current_number<20) {
  	var hero = document.querySelector('.hero')
  	var text ="";
  	text+='<div class="row mx-auto">'
  	for(var i=current_number;i<current_number+4;i++){
  	text+='<div class="card col-lg-3 col-sm-6 my-3 border-left-0 border-right-0 border-top-0"><a href="/movie/'+json.results[i].id+'"><img src="https://image.tmdb.org/t/p/w500'+json.results[i].poster_path+'"class="card-img-top latest" alt="Movie Poster"></a>'+'<div class="card-body text-center"><h5 class="card-title">'+json.results[i].title+'</h5><p class="card-text"><sup>₹</sup>299<span></span><sup>₹</sup><strike>499</strike></p><a href="movie/'+ json.results[i].id + '"class="btn btn-primary">Read More..</a></div></div>'
  	}
  	text+='</div>'
  	current_number+=4;
  	hero.innerHTML += text;
  }
};

// fetching the json from the TMDB api
function get_json_page(){
  var json_page = "https://api.themoviedb.org/3/movie/popular?api_key=27b1aefdf15b7483f95fdc09a980acc0&language=en-US&page="+page_no;
  var xhr = new XMLHttpRequest()
  xhr.open('GET',json_page,true)
  xhr.onload = function(){
    json = JSON.parse(this.responseText);
    setTimeout(function(){
    for(var i =0;i<$('img.card-img-top.latest').length;i++){
        $('img.card-img-top.latest')[i].src="https://image.tmdb.org/t/p/w500"+json.results[i].poster_path;
        $('.card-title')[i].innerText = json.results[i].title;
        $('.card-text')[i].innerHTML = "<sup>₹</sup>299<span></span><sup>₹</sup><strike>499</strike>";
        $('.image-link')[i].href = "/movie/"+json.results[i].id;
        $('.read-more')[i].href = "/movie/"+json.results[i].id;
        }
      },100);
    }
    xhr.send()
}

// re creating the loading effect on the images 
function change_to_default(){
  for(var i =0;i<$('img.card-img-top.latest').length;i++){
      $('img.card-img-top.latest')[i].src="img/Ellipsis.gif";
      $('.card-title')[i].innerText = "";
      $('.card-text')[i].innerHTML = "";
      $('.image-link')[i].href = "#";
      $('.read-more')[i].href = "#";
  }
}

// click handlers 
document.querySelector("a.next").addEventListener('click',function(e){
  e.preventDefault();
  change_to_default();
  page_no = (page_no%100)+1;
  get_json_page()
})
document.querySelector("a.previous").addEventListener('click',function(e){
  e.preventDefault();
  change_to_default();
  page_no--;
  page_no = page_no<=0?100-page_no:page_no;
  get_json_page()
})
document.querySelector("a.first").addEventListener('click',function(e){
  e.preventDefault();
  change_to_default();
  page_no = 1;
  get_json_page()
})
document.querySelector("a.last").addEventListener('click',function(e){
  e.preventDefault();
  change_to_default();
  page_no = 100;
  get_json_page()
})
