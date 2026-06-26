const words = ["GET IN TOUCH"];
const typingSpeed = 120;
const deletingSpeed = 70;
const pauseTime = 1500;

const textElement = document.getElementById("breakText");

let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeEffect(){

    const currentWord = words[wordIndex];

    if(!deleting){

        textElement.textContent = currentWord.substring(0,charIndex+1);
        charIndex++;

        if(charIndex === currentWord.length){

            deleting = true;
            setTimeout(typeEffect,pauseTime);
            return;
        }

        setTimeout(typeEffect,typingSpeed);

    }else{

        textElement.textContent = currentWord.substring(0,charIndex-1);
        charIndex--;

        if(charIndex === 0){

            deleting = false;
            wordIndex = (wordIndex+1)%words.length;
        }

        setTimeout(typeEffect,deletingSpeed);
    }

}

typeEffect();