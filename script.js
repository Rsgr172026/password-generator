const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckbox = document.querySelectorAll("input[type=checkbox]");

const symbol = "!@#$%^&*()_+-=[]{}|;:,.<>?";

let password ="";
let passwordLength = 10;
let checkCount = 1;

// Debug: Check if elements are found
console.log("Generate button found:", generateBtn);
console.log("Checkboxes found:", allCheckbox.length);

handleSlider();

setIndicator("#ccc");
calcStrength();

function handleSlider(){
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  const min =  inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max - min))
   +"100%"
}

inputSlider.addEventListener('input', (event) => {
    passwordLength = event.target.value;
    handleSlider();
    calcStrength();
});

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 20px ${color}`;
}

function getRndInteger(min,max){
    return Math.floor(Math.random() * (max-min) + min);
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowercase(){
    return String.fromCharCode(getRndInteger(97,123));
}
 
function generateUppercase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    const randNum = getRndInteger(0,symbol.length);
    return symbol.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (symbolsCheck.checked) hasSym = true;
    if (numberCheck.checked) hasNum = true;
    
    let strength = 0;
    if (hasUpper) strength++;
    if (hasLower) strength++;
    if (hasNum) strength++;
    if (hasSym) strength++;
    
    // Strong password conditions
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator("#0fbeb1"); // Green for strong
    }else if (passwordLength >= 16 && (hasUpper || hasLower) && (hasNum || hasSym)){
        setIndicator("#0fbeb1"); // Green for strong
    }
    // Medium password conditions
    else if (strength >= 2 && passwordLength >= 6){
        setIndicator("#fbbf24"); // Yellow for medium
    }
    // Weak password
    else{
        setIndicator("#ef4444"); // Red for weak
    }
}

async function copyContent(){
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch (e) {
        copyMsg.innerText = "Failed";
    }

    copyMsg.classList.add("active"); 
    setTimeout(() => {
        copyMsg.classList.remove("active");
    },2000);
}

copyBtn.addEventListener("click", ()=>{
    if(passwordDisplay.value)
        copyContent();
});

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckbox.forEach((checkbox) =>{
        if(checkbox.checked) checkCount++;
    });
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    calcStrength();
}

allCheckbox.forEach((checkbox) =>{
    checkbox.addEventListener("change", handleCheckBoxChange);
});

generateBtn.addEventListener("click",()=>{
    console.log("Generate button clicked!");
    console.log("Check count:", checkCount);
    
    if (checkCount <= 0){
        console.log("No checkboxes selected!");
        return;
    }
    
    if (passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";

    let arrayOfCheckedFunction = [];

    if (uppercaseCheck.checked) arrayOfCheckedFunction.push(generateUppercase);
    if (lowercaseCheck.checked) arrayOfCheckedFunction.push(generateLowercase);
    if (numberCheck.checked) arrayOfCheckedFunction.push(generateRandomNumber);
    if (symbolsCheck.checked) arrayOfCheckedFunction.push(generateSymbol);

    console.log("Selected functions:", arrayOfCheckedFunction.length);

    // Compulsory Addition
    for (let i = 0; i < arrayOfCheckedFunction.length; i++) {
        password += arrayOfCheckedFunction[i]();
    }

    for (let i = 0; i < passwordLength - arrayOfCheckedFunction.length; i++) {
        let randIndex = getRndInteger(0, arrayOfCheckedFunction.length);
        password += arrayOfCheckedFunction[randIndex]();
    } 

    password = shuffle(Array.from(password));
    passwordDisplay.value = password;
    calcStrength();
    
    console.log("Generated password:", password);
});

// Initialize indicator on page load
calcStrength();




