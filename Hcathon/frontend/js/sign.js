let username=document.getElementById("username")
let email_sign=document.getElementById("email_sign")
let password_sign=document.getElementById("password_sign")
let form_sign=document.getElementById("form_sign")

sign.onclick=()=>{
    let save_object_sign={"user_name":username.value,"email":email_sign.value,"password":password_sign.value}
    fetch("http://localhost:8080/sign_up",{
        method:"POST",
        headers:{"content-Type":"application/json"},
        body:JSON.stringify(save_object_sign)
    })
    form_sign.reset();
}
