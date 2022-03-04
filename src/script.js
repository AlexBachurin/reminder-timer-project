window.addEventListener('DOMContentLoaded', () => {
    const minutes = document.querySelector('.reminder__timer-minutes'),
        seconds = document.querySelector('.reminder__timer-seconds'),
        controlBtns = document.querySelectorAll('[data-control]'),
        counterBtns = document.querySelectorAll('.reminder__length-btn'),
        sessionValue = document.querySelector('.reminder__length-value');

    //default value to show in timer 
    let defaultValue = 15,
        defaultZero = 0;
    //timerId, counter for setupClock
    let timerId,
        counter,
        repeatId,
        repeatInnerId;
    //var for repeat
    let isRepeat = false;

    //setup initial value
    minutes.textContent = defaultValue;
    sessionValue.textContent = defaultValue;

    /* CONTROL BUTTONS */

    //function helper to disable buttons
    function disableButtons() {
        counterBtns.forEach(btn => {
            btn.disabled = true;
        })
    }
    //enable buttons
    function enableButtons() {
        counterBtns.forEach(btn => {
            btn.disabled = false;
        })
    }
    //disable buttons for play//repeat
    function disableControlButtonsOnPlay() {
        controlBtns.forEach(btn => {
            if (btn.dataset.control === 'reset' || btn.dataset.control === 'pause') {
                btn.disabled = false;
            }
            else {
                btn.disabled = true;
            }

        })
    }
    function disableControlButtonsOnRepeat() {
        controlBtns.forEach(btn => {
            if (btn.dataset.control !== 'reset') {
                btn.disabled = true;
            }
        })
    }
    //enable control buttons 
    function enableControlButtons() {
        controlBtns.forEach(btn => {
            btn.disabled = false;
        })
    }
    //calculate deadline
    function getDeadline() {
        //get value from page
        const minutesInMs = Number(minutes.textContent) * 60000;
        const secondsInMs = Number(seconds.textContent) * 1000;
        //transform to miliseconds
        const miliseconds = minutesInMs + secondsInMs;
        //get deadline
        const endDate = (Date.parse(new Date()) + miliseconds);
        //set timer
        return endDate;
    }

    //add event listeners for each control button
    controlBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.currentTarget;
            const control = target.dataset.control;
            console.log(control);
            let endDate;
            //depending on which button we clicked  handle different approaches
            switch (control) {
                case "play":
                    //get deadline
                    //and start timer
                    endDate = getDeadline();
                    setTimer(endDate);
                    //disable control buttons;
                    disableControlButtonsOnPlay();
                    //disable buttons when we start timer so we cant change counter
                    disableButtons();
                    break;
                case "pause":
                    //just clear timer
                    clearInterval(timerId);
                    //also enable start btn
                    controlBtns.forEach(btn => {
                        if (btn.dataset.control === 'play') {
                            btn.disabled = false;
                        }
                    })
                    break;
                case "reset":
                    //clear timer, reset minutes, sessionValue and counter to defaults and enable buttons
                    clearInterval(timerId);
                    //clear repeat
                    clearInterval(repeatId);
                    isRepeat = false;
                    minutes.textContent = defaultValue;
                    seconds.textContent = addZero(defaultZero);
                    //set counter to default
                    counter = defaultValue;
                    sessionValue.textContent = counter;
                    enableButtons();
                    enableControlButtons();
                    break;
                //functionality works but timer doesnt show up on page
                case "repeat":
                    //set repeat var to true
                    isRepeat = true;
                    //clear timer, set minutes and sessionValue to counter, get date and start timer
                    clearInterval(timerId);
                    endDate = getDeadline();
                    //set interval based on current counter to cycle repeat it
                    repeatId = setInterval(() => {
                        // clearInterval(repeatInnerId);
                        // setTimer(endTime)
                        function updateTimer() {
                            let t = getTimeLeft(endDate);
                            console.log(t)
                            minutes.textContent = addZero(t.minutes);
                            seconds.textContent = addZero(t.seconds);
                            console.log(t.minutes);
                            console.log(t.seconds);
                            if (t.total <= 0) {
                                //clear inner interval
                                clearInterval(repeatInnerId);
                                minutes.textContent = defaultValue;
                                seconds.textContent = addZero(defaultZero)
                                const audio = new Audio('https://res.cloudinary.com/dljezd6qv/video/upload/v1619188645/reminder-project/Alarm_Clock.wav');
                                audio.volume = 0.2;
                                audio.loop = false;
                                audio.play();
                            }

                        }
                        repeatInnerId = setInterval(updateTimer, 1000);
                    }, 60000 * counter);
                    disableButtons();
                    disableControlButtonsOnRepeat();
                    break;


            }
        })
    })


    /*TIMER SETUP*/


    //get remaining time
    function getTimeLeft(deadline) {
        //get time diff in ms
        const timeRemaining = deadline - Date.parse(new Date());
        //transform to proper values
        const minutes = Math.floor((timeRemaining / 1000 / 60) % 60),
            seconds = Math.floor((timeRemaining / 1000) % 60);

        //return as obj
        return {
            'total': timeRemaining,
            minutes,
            seconds
        }
    }

    //setup Timer
    function setTimer(deadline) {

        //function to update timer on page 
        function updateTimer() {
            const t = getTimeLeft(deadline);
            minutes.textContent = addZero(t.minutes);
            seconds.textContent = addZero(t.seconds);
            //if time diff reaches 0 - clearinterval, setup html , and play audio alarm, and enable back buttons!!
            if (t.total <= 0) {
                clearInterval(timerId);
                minutes.textContent = defaultValue;
                seconds.textContent = addZero(defaultZero);
                const audio = new Audio('https://res.cloudinary.com/dljezd6qv/video/upload/v1619188645/reminder-project/Alarm_Clock.wav');
                audio.volume = 0.2;
                audio.loop = false;
                audio.play();
                if (!isRepeat) {
                    enableButtons();
                    enableControlButtons();
                }

            }
        }
        //update timer every second
        timerId = setInterval(updateTimer, 1000);
    }

    //helper to add zeroes
    function addZero(num) {
        return num >= 0 && num < 10 ? num = `0${num}` : num;
    }


    /* COUNTER */

    function processClick(buttonsSelector, minutesSelector, sessionValueSelector) {
        const counterBtns = document.querySelectorAll(buttonsSelector),
            minutes = document.querySelector(minutesSelector),
            sessionValue = document.querySelector(sessionValueSelector);
        counter = minutes.textContent;
        //add event listeners for btns
        counterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                //use event.currentTarget because we have <i> in our button, so if we use event.target and click on i, then we get i in event.target and get wrong results
                //but if we use currentTarget, we will have the element that contains event listener
                const target = e.currentTarget;

                //check if we click on plus button we increment counter
                if (target.classList.contains('reminder__length-plus')) {
                    //if counter 60 then stop add +1 to counter, same for 0
                    if (counter == 60) {
                        counter += 0;

                    } else {
                        counter++;
                        minutes.textContent = addZero(counter);
                        sessionValue.textContent = counter;
                        defaultValue = counter;
                    }
                    //else we decrement counter
                } else {
                    if (counter === 1) {
                        counter -= 0;
                    } else {
                        counter--;
                        minutes.textContent = addZero(counter);
                        sessionValue.textContent = counter;
                        defaultValue = counter
                    }
                }
            })
        })
    }



    processClick('.reminder__length-btn', '.reminder__timer-minutes', '.reminder__length-value');


})