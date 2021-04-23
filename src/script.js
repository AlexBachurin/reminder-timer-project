window.addEventListener('DOMContentLoaded', () => {
    const minutes = document.querySelector('.timer__minutes'),
        seconds = document.querySelector('.timer__seconds'),
        startBtn = document.querySelector('.reminder__playBtn');


    //add event listener
    startBtn.addEventListener('click', (e) => {
        e.preventDefault();
        //get value from page
        const minutesInt = Number(minutes.textContent);
        //transform to miliseconds
        const miliseconds = minutesInt * 60000;
        //get deadline
        const endDate = (Date.parse(new Date()) + miliseconds);

        setTimer(endDate);

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
            console.log(t.minutes);
            console.log(t.seconds)
            minutes.textContent = addZero(t.minutes);
            seconds.textContent = addZero(t.seconds);
        }
        //update timer every second
        const timerId = setInterval(updateTimer, 1000);
    }

    //helper to add zeroes

    function addZero(num) {
        return num >= 0 && num < 10 ? num = `0${num}` : num;
    }



})