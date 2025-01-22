// Select all card elements
let cards = document.querySelectorAll('.card');
let cardHeights = Array.from(cards).map(card => card.offsetHeight);

window.addEventListener('scroll', function() {
    // let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    let currentScroll = window.scrollY || document.documentElement.scrollTop;

    cards.forEach((card, index) => {
        // Calculate the top offset for the current card
        let cardOffsetTop = cardHeights.slice(0, index).reduce((a, b) => a + b, 0); // Sum of heights of all previous cards

        // Calculate scroll percentage for the current card
        let scrollPercentage = Math.min((currentScroll - cardOffsetTop) / (cardHeights[index] / 2), 1); // Ensure it doesn't go over 1

        // Calculate scale and blur for the current card
        let scaleValue = 1 - (scrollPercentage * 0.2); // Scale down to 0.5 at 50% scroll
        let blurValue = scrollPercentage * 7; // Maximum blur at 3px when scroll percentage is 1

        // Apply effects to the current card
        if (currentScroll > cardOffsetTop && index != 1) {
            card.style.transform = `scale(${scaleValue})`;
            card.style.filter = `blur(${blurValue}px)`;
        } else {
            // Reset effects when not scrolled down
            card.style.transform = `scale(1)`;
            card.style.filter = `blur(0px)`;
        }
    });

});

// BUTTON FOR PAGE TRANSITION
let startCreatingButton = document.querySelector('#card1end button');
let goUpButton = document.querySelector("#card2end button");
let card1 = document.querySelector('.card1');
let card2 = document.querySelector('.card2');

// Scroll to Card 2
startCreatingButton.addEventListener('click', function() {
    card2.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Scroll to Card 1
goUpButton.addEventListener('click', function() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // Smooth scrolling
});
});


// window.onload = ()=>{
//   fetch("/checkStatus")
//   .then(response => response.json())
//   .then(result => {
//     console.log(result);
//     console.log(result.user);
//     username = result.user || "User";
//     username = username.toUpperCase();
//     sentence = `Hello ${username}`;
//     typewriter(); 
//   })
//   .catch(err => console.log(err))
// }


let sentence, username;
let cursorSpan = document.createElement("span");
    cursorSpan.className = "cursor";

// console.log("username: "+username);

const typewriterDiv = document.getElementById("typewriterDiv");
let index = 0;

function typewriter() {
    typewriterDiv.textContent = '';  // Clear the previous content
    typewriterDiv.appendChild(cursorSpan);

    let interval = setInterval(() => {
      if (index < sentence.length) {
        typewriterDiv.textContent += sentence[index++];
        typewriterDiv.appendChild(cursorSpan);
      } else {
        clearInterval(interval); // Stop the interval when done
        setTimeout(() => {
          deleteTypeWriter(); // Start deleting after a pause
        }, 2000); // Wait 2 seconds before starting the deletion
      }
    }, 200); // Typing speed (200ms between each character)
  }

  function deleteTypeWriter() {
    let interval = setInterval(() => {
      if (index > 0) {
        index--;
        typewriterDiv.textContent = sentence.slice(0, index);
        typewriterDiv.appendChild(cursorSpan);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          typewriter(); // Restart typing after deletion is finished
        }, 2000); // Wait before restarting typing
      }
    }, 200); // Deleting speed (200ms between each character)
  }




document.querySelector("#cross").addEventListener("click",()=>{
  document.querySelector(".todoForm form").reset();
  document.querySelector(".todoForm").style.display = "none";
})

document.querySelector("#createTodoButton").addEventListener("click",()=>{
  document.querySelector(".todoForm").style.display = "flex";
})


// LOGOUT HANDLING
const logout = document.getElementById("logout");
document.getElementById("userCircle").addEventListener("click",()=>{
  console.log("Hello")
  logout.classList.toggle("show");
})

document.addEventListener("click", function(e) {
  if (!userCircle.contains(e.target) && !logout.contains(e.target)) {
      logout.classList.remove("show");
  }
});

logout.addEventListener("click",async (e)=>{
  window.location.href = "/";
  window.getCoo
})