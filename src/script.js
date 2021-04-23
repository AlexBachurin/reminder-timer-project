window.addEventListener('DOMContentLoaded', () => {
    const minutes = document.querySelector('.reminder__timer-minutes'),
        seconds = document.querySelector('.reminder__timer-seconds'),
        controlBtns = document.querySelectorAll('[data-control]'),
        counterBtns = document.querySelectorAll('.reminder__length-btn');

    //default value to show in timer 
    let defaultValue = 15,
        defaultZero = 0;
    //timerId, counter for setupClock
    let timerId,
        counter;

    minutes.textContent = defaultValue;

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

    //add event listeners for each control button
    controlBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.currentTarget;
            const control = target.dataset.control;

            switch (control) {
                case "play":
                    //get value from page
                    const minutesInMs = Number(minutes.textContent) * 60000;
                    const secondsInMs = Number(seconds.textContent) * 1000;
                    //transform to miliseconds
                    const miliseconds = minutesInMs + secondsInMs;
                    //get deadline
                    const endDate = (Date.parse(new Date()) + miliseconds);
                    //set timer
                    setTimer(endDate);

                    //disable buttons when we start timer so we cant change counter
                    disableButtons();
                    break;
                case "pause":
                    clearInterval(timerId);
                    paused = true;
                    break;
                case "reset":
                    clearInterval(timerId);
                    minutes.textContent = defaultValue;
                    seconds.textContent = addZero(defaultZero);
                    //set counter to default
                    counter = defaultValue;
                    enableButtons();
                    break;
            }
        })
    })

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
                minutes.textContent = '00';
                seconds.textContent = '00';
                const audio = new Audio('https://res.cloudinary.com/dljezd6qv/video/upload/v1619188645/reminder-project/Alarm_Clock.wav');
                audio.volume = 0.2;
                audio.loop = false;
                audio.play();
                enableButtons();

            }
        }
        //update timer every second
        timerId = setInterval(updateTimer, 1000);
    }

    //helper to add zeroes

    function addZero(num) {
        return num >= 0 && num < 10 ? num = `0${num}` : num;
    }

    //Adjusting timer, adding/substracting counter

    function processClick(buttonsSelector, minutesSelector) {
        const counterBtns = document.querySelectorAll(buttonsSelector);
        const minutes = document.querySelector(minutesSelector);
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
                        console.log(counter);
                        minutes.textContent = addZero(counter);
                    }
                    //else we decrement counter
                } else {
                    if (counter === 0) {
                        counter -= 0;
                    } else {
                        counter--;
                        minutes.textContent = addZero(counter);
                    }
                }
            })
        })
    }



    processClick('.reminder__length-btn', '.reminder__timer-minutes');


})