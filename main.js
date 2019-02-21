const startButton = document.querySelector(".mds-body-button");
const quizBody = document.querySelector(".mds-body");
const popUpContainer = document.querySelector(".mds-popup");
const container = document.querySelector(".mds-container");
const iconButton = document.querySelector(".mds-header-icon ");
const menuBar = document.querySelector(".mds-menubar");
const menubarListItem = document.querySelectorAll(".mds-menubar-list-item");
const statsContainer = document.querySelector (".mds-stats");
const aboutContainer = document.querySelector(".mds-about");
let headTitle = document.querySelector(".mds-header-text");
let headerContainer = document.querySelector(".mds-header");
let scroll = document.querySelector(".mds-scroll")
let audio = new Audio("https://wow.zamimg.com/wowsounds/53202");
audio.loop = true;
const overlayContainer = document.querySelector(".mds-overlay");
let stats = {
        gamesplayed: "0" ,
        correctanswers:"0",
        incorrectanswer:"0",
        correctpercentage:"",
}
let gamesPlayed = 1;
let allCorrect = 0;
let numberOfWrong = 0;
let percentage = 0;
let count = 1;
let allCorrectAnswer = [];
let playerAnswer = [];
let numOfCorrectAnswer = 0;

startButton.addEventListener ("click",() =>{
    startButton.classList.add ("mds-display-none");
    quizBody.dataset.type = "active"
    startAnimation();
    if(volumeIcon.textContent ==="volume_up"){
        audio.play();
    }
    getData()
    .then (res => {
        clearHtmlFunction();
        renderQuiz(res)
    });
})


function getData (){
    return fetch("https://opentdb.com/api.php?amount=10&difficult=easy")
    .then  (response => response.json())
    .then (response => {return response})
    .catch (error => console.error ("Error", error));
}
// Animation while fetching data
function startAnimation (){
    let myAnimation = document.createElement("div");
    myAnimation.classList.add("loadingAnimation");
    quizBody.appendChild(myAnimation);
}
function renderQuiz (data){
    let answer = [];
    let quizHeadline = document.createElement("h3");
    quizHeadline.innerHTML = "Quiz "+(gamesPlayed);
    quizBody.appendChild (quizHeadline);
    let array = data.results;
    for (let i = 0; i < array.length;i++){
        let question = array[i].question;
        let questionText = document.createElement("h2");
        questionText.innerHTML = question;
        quizBody.appendChild(questionText);
        answer = randomAnswer(array[i].correct_answer,array[i].incorrect_answers);
        renderAnswer(answer);
        count ++;
    }
    let divButton = document.createElement("div");
    let doneButton = document.createElement("button");
    divButton.className ="mds-body-div--Button"
    doneButton.className ="mds-body-doneButton";
    doneButton.innerHTML = "Done";
    quizBody.appendChild(divButton);
    divButton.appendChild(doneButton);
    doneButton.addEventListener("click",checkanswer)
    topFunction();
}   
function randomAnswer(correct,wrong){
    SaveCorrectAnswer (correct);
    wrong.push(correct);
        let j,x,i;
        for (i = wrong.length -1; i > 0; i--){
            j = Math.floor(Math.random() * (i+1))
            x=wrong[i];
            wrong[i] = wrong[j];
            wrong[j] = x;
            return wrong;
        }
    return wrong;
}
function renderAnswer (answer){
    let ulTag = document.createElement("ul");
    quizBody.appendChild(ulTag);
    for(let i = 0; i < answer.length;i++){
        let liTag = document.createElement("li");
        let inputTag = document.createElement ("input");
        let spanTag1 = document.createElement("span");
        let spanTag2 = document.createElement("span");
        let labelTag = document.createElement("label");
        giveAttributes(inputTag,{
            type: "radio",
            name: "radio"+count,
            value: answer[i],
        });
        inputTag.className ="mds-radio-input"
        spanTag1.className = "mds-radio-border"
        spanTag2.className = "mds-radio-toogle"
        labelTag.innerHTML = answer[i];
        ulTag.appendChild(liTag);
        liTag.appendChild(inputTag);
        liTag.appendChild(spanTag1);
        liTag.appendChild(spanTag2);
        liTag.appendChild(labelTag);
    }
    quizBody.scrollIntoView();
}
function giveAttributes(element,obj){
    for (let prop in obj){
        if(obj.hasOwnProperty(prop)){
            element[prop] = obj[prop];
        }
    }
}
function SaveCorrectAnswer(correct){
    allCorrectAnswer.push(correct);
}
function checkanswer (){
    let inputTags = document.querySelectorAll("input");
    numOfCorrectAnswer = 0;
    for (let i = 0; i < inputTags.length;i++){
        if (inputTags[i].type === "radio" && inputTags[i].checked){
            playerAnswer.push(inputTags[i].value);
        }   else {continue};
    }
   for (let i = 0; i < playerAnswer.length;i++){
        if(playerAnswer[i] === allCorrectAnswer[i]){
            numOfCorrectAnswer++;
        }
   }
   popUpFunction()
}
function popUpFunction (){
    popUpContainer.dataset.check = "active";
    popUpContainer.classList.remove("mds-display-none")
    overlayContainer.style.display ="block";
    let dialogtext = document.querySelector(".mds-popup-supporting--text");
    dialogtext.innerHTML = "You answered "+ numOfCorrectAnswer +"/10 questions correct"
    headerTextFunction();
    let closeButton = document.querySelector(".close");
    closeButton.setAttribute("tabindex","0");
    let reStartButton = document.querySelector(".re-start");
    reStartButton.setAttribute("tabindex","0");
    let checkButton = document.querySelector (".check")
    checkButton.setAttribute("tabindex","0");
    closeButton.addEventListener("click",closeFunction);
    reStartButton.addEventListener("click",reStartFunction)
    checkButton.addEventListener("click",checkFunction);
}
//  Change popup text depending of number of correct answer
function headerTextFunction (){
    let headerText = document.querySelector(".mds-popup-title--text")

    if (numOfCorrectAnswer <= 3){
        headerText.textContent = "You Suck!"
    }
    else if (numOfCorrectAnswer >3 && numOfCorrectAnswer <= 6 ){
        headerText.textContent = "Well Done!"
    }
    else if (numOfCorrectAnswer >6 && numOfCorrectAnswer <= 10){
        headerText.textContent = "Congratulations!"
    }
}
function closeFunction (){
    audio.pause();
    audio.currentTime = 0;
    savePlayerStats();
    clearHtmlFunction()
    allCorrectAnswer = [];
    playerAnswer = [];
    count = 1;
    quizBody.dataset.type = "inactive";
    iconButton.dataset.click = "inactive";
    startButton.classList.remove("mds-display-none");
}
function reStartFunction (){
    savePlayerStats();
    gamesPlayed++;
    count = 1;
    numOfCorrectAnswer = 0;
    clearHtmlFunction();
    topFunction();
    allCorrectAnswer = [];
    playerAnswer = [];
    startAnimation();
    getData()
    .then (res => {
        clearHtmlFunction();
        renderQuiz(res)
    });
    
}
// Clear all html to go back to the beginning
function clearHtmlFunction (){
    while (quizBody.firstChild) {
        quizBody.removeChild(quizBody.firstChild);
    }
    popUpContainer.classList.add ("mds-display-none");
    popUpContainer.dataset.check = "inactive";
    overlayContainer.style.display ="none";
}
// check which answer you got right and wrong
function checkFunction() {
    topFunction();
    popUpContainer.classList.add ("mds-display-none");
    popUpContainer.dataset.check = "inactive";
    overlayContainer.style.display ="none";
    let inputTags = document.querySelectorAll("input");
        for (let j = 0; j < allCorrectAnswer.length;j++){ 
            let correctText = allCorrectAnswer[j];
            for (let i = 0; i < inputTags.length;i++){
                inputTags[i].disabled = true;
                value = inputTags[i].value
                inputName = inputTags[i].name
                    if(value === correctText) {
                        if (inputName === "radio"+[j+1]){
                            inputTags[i].parentNode.style.color ="rgb(53, 199, 53)";  
                        }
                    } 
                    if (inputTags[i].checked && value !== correctText){
                        if (inputName === "radio"+[j+1]){
                            inputTags[i].parentNode.style.color ="red"; 
                        } 
                    }

            }     
        }
}
// Save stats from player in a object.
function savePlayerStats (){
    console.log (stats);
    allCorrect = allCorrect + numOfCorrectAnswer;
    percentage = allCorrect / (10 * gamesPlayed); 
    numberOfWrong =  numberOfWrong + (10 - numOfCorrectAnswer);    
    stats = {
        gamesplayed: gamesPlayed,
        correctanswers: allCorrect,
        incorrectanswer: numberOfWrong,
        correctpercentage: percentage,
    }
    numOfCorrectAnswer = 0;
}
iconButton.addEventListener("click",iconFunction)
overlayContainer.addEventListener("click",iconFunction)

function iconFunction(){
    var windowWidth = window.matchMedia("(min-width: 768px)")
    if (popUpContainer.dataset.check === "active"){return};    
        if (iconButton.dataset.click === "active"){
            if (windowWidth.matches){
                menuBar.style.width ="300px";
            }
            else{
                menuBar.style.width ="304px";
            }
            iconButton.dataset.click = "inactive"
            overlayContainer.style.display ="block";
        }
        else{
            if (headTitle.textContent === "Stats"){
                statsFunction();
            }
            else if (headTitle.textContent ==="About this app"){
                overlayContainer.style.display ="none";
                aboutFunction()
            }
            else {
                menuBar.style.width ="0px";
                quizBody.classList.remove("mds-display-none")
                    if (quizBody.dataset.type !== "active"){
                        startButton.classList.remove("mds-display-none");
                    }
                overlayContainer.style.display ="none";
                iconButton.dataset.click = "active"
            }
        }     
}        
for (let bar of menubarListItem){
    bar.addEventListener("click",function(e){
        menuBarFunction(e);
    });
}    
function menuBarFunction(e){
        if (e.target.innerHTML === "Game screen"){
            statsContainer.classList.add("mds-display-none");
            aboutContainer.classList.add("mds-display-none")
            headTitle.innerHTML = "Quiz Master";
            iconFunction();
        }
        else if (e.target.innerHTML ==="Stats"){
            statsFunction();
        }
        else if (e.target.innerHTML === "About this app"){
            aboutFunction();
        }
    }

function statsFunction (){
    overlayContainer.style.display ="none";
    quizBody.classList.add("mds-display-none")
    startButton.classList.add("mds-display-none");
    aboutContainer.classList.add("mds-display-none")
    iconButton.dataset.click = "active"
    headTitle.innerHTML = "Stats";
    statsContainer.classList.remove("mds-display-none")
    renderStats();
    menuBar.style.width ="0px";
}
function renderStats (){
    document.querySelector(".played").innerHTML = (stats.gamesplayed);
    document.querySelector(".correct").innerHTML = (stats.correctanswers);
    document.querySelector(".incorrect").innerHTML = (stats.incorrectanswer);
    document.querySelector(".percentage").innerHTML = (Math.floor((stats.correctpercentage)*100)) +"%";
}
let statsResetButton = document.querySelector(".mds-stats-button").addEventListener("click",function(){
    stats = {
        gamesplayed: "0" ,
        correctanswers:"0",
        incorrectanswer:"0",
        correctpercentage:"",
    }
    renderStats();
})
function aboutFunction (){
    statsContainer.classList.add("mds-display-none");
    headTitle.innerHTML = "About this app";
    quizBody.classList.add("mds-display-none")
    iconButton.dataset.click = "active"
    startButton.classList.add("mds-display-none");
    overlayContainer.style.display ="none";
    menuBar.style.width ="0px";
    aboutContainer.classList.remove("mds-display-none")
}
function topFunction() {
    scroll.scrollTo({ top: 0, behavior: 'smooth' });
}

// Tabindex 
window.addEventListener("keydown",function(e){
    let myInputs = document.querySelectorAll("input");
    for (let input of myInputs){
        if(e.target === input){
            if (e.keyCode === 13){
                console.log ("tjena");
                input.checked = true;
            }
        }
    }
    for (let bar of menubarListItem){
        if(e.target === bar){
            if (e.keyCode === 13){
                menuBarFunction(e);
            }
        }
    }
    if(e.target === iconButton){
        if (e.keyCode === 13){
            iconFunction();
        }
    }
})
let volumeIcon = document.createElement("i");
volumeIcon.textContent = "volume_up";
volumeIcon.classList.add("material-icons","mds-header-icon-volume");
headerContainer.appendChild(volumeIcon);
volumeIcon.addEventListener("click",function(e){
    quizMusic(e);
})

function quizMusic(e){
    if(e.target.textContent ==="volume_up"){
        e.target.textContent ="volume_off"
        audio.pause();
    }else if(e.target.textContent ==="volume_off"){
        e.target.textContent ="volume_up"
        audio.play();
    }
}

