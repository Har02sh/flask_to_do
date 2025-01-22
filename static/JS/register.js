const card = document.querySelector('.form-card');
const flipToLogin = document.querySelector('.flip-to-login');
const flipToRegister = document.querySelector('.flip-to-register');

// Flip to login form
flipToLogin.addEventListener('click', (e) => {
  e.preventDefault();
  card.classList.add('flipped');
});

// Flip to register form
flipToRegister.addEventListener('click', (e) => {
  e.preventDefault();
  card.classList.remove('flipped');
});


// Register
const formRegister = document.querySelector(".register-form");
formRegister.addEventListener("submit",async (event)=>{
    event.preventDefault();
    const formData = new FormData(formRegister);
    const payloadData = Object.fromEntries(formData);

    const response = await fetch("/register",{
        method:"POST",
        headers:{
            'Content-type':"application/json"
        },
        body:JSON.stringify(payloadData)
    });
    if(response.status === 401){
      alert("User already exists!");
      return;
    }
    const result = await response.json();
    if(response.ok){
      alert("Registraton Successful");
      document.querySelector('.form-card').classList.add('flipped');
    }
    console.log(result);
})

// Login
const formLogin = document.querySelector(".login-form");
formLogin.addEventListener("submit",async (event)=>{
    event.preventDefault();
    const formData = new FormData(formLogin);
    const payloadData = Object.fromEntries(formData);

    const response = await fetch("/login",{
        method:"POST",
        headers:{
            'Content-type':"application/json"
        },
        body:JSON.stringify(payloadData)
    });
    if(response.status === 404){
      alert('User not found');
      return;
    }
    const result = await response.json();
    if(response.ok){
      document.querySelector(".overlay").style.display = "flex";
      setTimeout(()=>{
        window.location.href = "/dashboard";
      },2000)
    }
    console.log(result);
})