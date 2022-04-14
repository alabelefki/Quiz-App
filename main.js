//Select Elements
let countSpan= document.querySelector(".count span");
let bulletsSpanContainer=document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea= document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");
let resultsContainer = document.querySelector(".results")
let countdownElement = document.querySelector(".countdown")

let currentIndex=0;
let rightAnswers=0;
let countdownInterval;

function getQuestions(){
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange= function() {
        if(this.readyState === 4 && this.status === 200){
            let questionsObject = JSON.parse(this.responseText);
            let qCount = questionsObject.length;
            //create bullets + set questions count
            createBullets(qCount);
            //add question data
            addQuestionData(questionsObject[currentIndex],qCount)
            // Start CountDown
            countdown(10, qCount);
            //click on submit 
            submitButton.onclick = () => {
                // get right answer
                let theRightAnswer = questionsObject[currentIndex].right_answer;
                //increase index
                currentIndex++;
                //check the answer
                checkAnswer(theRightAnswer,qCount)

                // Remove previous question 
                quizArea.innerHTML="";
                answersArea.innerHTML="";
                //add question data
                addQuestionData(questionsObject[currentIndex],qCount)
                //handle bullets class
                handleBullets();
                //show results
                showResults(qCount)
                // Start CountDown
                clearInterval(countdownInterval)
                countdown(3, qCount);
            }
        }
    };
    myRequest.open("GET","html_questions.json",true);
    myRequest.send();
}
getQuestions();

function createBullets(num){

countSpan.innerHTML = num;
//create spans
for(let i=0 ; i < num; i++ ){

    //create bullet
    let theBullets = document.createElement("span");
    
    if(i===0){

        theBullets.className="on";
    
    }

    //apend bullets to main bullet container
    bulletsSpanContainer.appendChild(theBullets)
}
}

function addQuestionData( obj,count ) {

    if(currentIndex<count){

    //create h2 question title
    let questionTitle = document.createElement("h2");
    // create question text
    let questionText = document.createTextNode(obj["title"]);
    // append text to h2
    questionTitle.appendChild(questionText);
    // append h2 to the quiz area 
    quizArea.appendChild(questionTitle);
    //create the answers
    for(let i=1; i<=4; i++){
        //create main answer div
        let mainDiv = document.createElement("div")
        //add class to main div
        mainDiv.className="answer";
        //creat radio button 
        let radioInput = document.createElement("input");
        // add type + name + id + data attribute
        radioInput.name= "question" ;
        radioInput.type = "radio";
        radioInput.id=`answer_${i}`;
        radioInput.dataset.answer= obj[`answer_${i}`];
        //create label
        let theLabel = document.createElement("label");
        //add for attribute
        theLabel.htmlFor = `answer_${i}`;
        //create label text
        let theLabelText = document.createTextNode(obj[`answer_${i}`])
        theLabel.appendChild(theLabelText)
        // add input + label to main div 
        mainDiv.appendChild(radioInput)
        mainDiv.appendChild(theLabel)
        // append all divs to answers area 
        answersArea.appendChild(mainDiv)
    }
    }
}

function checkAnswer(rAnswer,count) {
    
    let answers = document.getElementsByName("question");
    let theChooseAnswer;
    for(let i=0; i<answers.length; i++){
        if(answers[i].checked){
            theChooseAnswer = answers[i].dataset.answer;
        }
    }
        if(rAnswer === theChooseAnswer){
        rightAnswers++;
        }
}

function handleBullets () {
    
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpan = Array.from(bulletsSpans);
    arrayOfSpan.forEach((span,index)=>{
        if(currentIndex === index){
            span.className = "on"
         }
    });
 }

 function showResults(count) {
     let theResults;
     if(currentIndex === count) {
         quizArea.remove();
         answersArea.remove();
         bullets.remove();
         submitButton.remove();

         if (rightAnswers > count / 2 && rightAnswers < count) {
            theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count}`;
          } else if (rightAnswers === count) {
            theResults = `<span class="perfect">Perfect</span>, All Answers Is Good`;
          } else {
            theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count}`;
          }
          resultsContainer.innerHTML = theResults;
        //   resultsContainer.style.padding = "60px";
        //   resultsContainer.style.textAlign = "center";
        //   resultsContainer.style.fontSize = "28px";
        //   resultsContainer.style.backgroundColor = "white";
        //   resultsContainer.style.marginTop = "10px";
     }
 }

 function countdown(duration, count) {
    if (currentIndex < count) {
      let minutes, seconds;
      countdownInterval = setInterval(function () {
        minutes = parseInt(duration / 60);
        seconds = parseInt(duration % 60);
  
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        seconds = seconds < 10 ? `0${seconds}` : seconds;
        countdownElement.innerHTML = `${minutes}:${seconds}`;
  
        if (--duration < 0) {
          clearInterval(countdownInterval);
          submitButton.click();
        }
      }, 1000);
    }
  }