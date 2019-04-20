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