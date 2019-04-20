var icon =document.querySelector(".password i");
var input = document.querySelector(".password input");
var flag = true;

icon.addEventListener("click",function(){
if(flag)
{
	icon.classList.add("fa-eye");
	icon.classList.remove("fa-eye-slash");
	input.type="text";
}
else{
	input.type="password";
	icon.classList.add("fa-eye-slash");
	icon.classList.remove("fa-eye");	
}
flag=!flag;
});

input.addEventListener("keyup",function(){
	if(input.validity.tooShort)
		 document.querySelector(".error p ").innerText="minimum length is 6 characters";
	else if(input.validity.patternMismatch)
	     document.querySelector(".error p ").innerText="should contain atleast one numeric, special characters like '@#$_' are only allowed";
	else
	    document.querySelector(".error p ").innerText="";    	
})

var tel = document.querySelector(".phone_number input");

tel.addEventListener("keyup",function(){
  if(tel.checkValidity()){
   document.querySelector(".phone_number i").classList.add("fa-check-circle");
   document.querySelector(".phone_number i").style.color = "green";
   document.querySelector(".phone_number i").classList.remove("fa-times-circle");
  }
  else{
    document.querySelector(".phone_number i").classList.remove("fa-check-circle");
    document.querySelector(".phone_number i").style.color = "#cc0000";
    document.querySelector(".phone_number i").classList.add("fa-times-circle");
  }
});

