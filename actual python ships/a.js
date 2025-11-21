const plantSelect = document.getElementById('plant-select');
let alarmSound = new Audio('BGM.wav');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const currentMonthDisplay = document.getElementById('current-month');
const calendarDates = document.getElementById('calendar-dates');
const alarmDateInput = document.getElementById('alarm-date');
const alarmTimeInput = document.getElementById('alarm-time');
const setAlarmBtn = document.getElementById('set-alarm');
let alarmDates = [];
let currentDate = new Date();

function displayCalendar(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    currentMonthDisplay.textContent = `${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`;
    calendarDates.innerHTML = '';

    let date = 1;
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < startingDay) {
                const cell = document.createElement('td');
                cell.textContent = '';
                row.appendChild(cell);
            } else if (date > daysInMonth) {
                break;
            } else {
                const cell = document.createElement('td');
                cell.textContent = date;
                const currentDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;

                if (alarmDates.includes(currentDateStr)) {
                    cell.classList.add('alarm-dot');
                }
                row.appendChild(cell);
                date++;
            }
        }
        calendarDates.appendChild(row);
        if (date > daysInMonth) {
            break;
        }
    }
}


prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    displayCalendar(currentDate.getFullYear(), currentDate.getMonth());
});

nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    displayCalendar(currentDate.getFullYear(), currentDate.getMonth());
});


setAlarmBtn.addEventListener('click', () => {
    console.log('setAlarmBtn clicked');
    console.log(alarmDateInput.value);
    const alarmDate = alarmDateInput.value;
    const alarmTime = alarmTimeInput.value;
    const selectedPlant = plantSelect.value;

    if (alarmDate && alarmTime) {
        const alarmDateTime = `${alarmDate}T${alarmTime}`;
        const selectedDate = new Date(alarmDate);
        const dayOfWeek = selectedDate.getDay();

        console.log("dayOfWeek variable");
        console.log(dayOfWeek);
        if (dayOfWeek == 6) {
            alert('Sorry, you cannot set an alarm on Sunday.');
            return;
        }


        const now = new Date();
        const alarm = new Date(alarmDateTime);

        if (alarm <= now) {
            alert('Please select a future date and time.');
            return;
        }


        const timeDiff = alarm.getTime() - now.getTime();

        if (timeDiff > 0) {

            alarmDates.push(alarmDate);
            console.log('Alarm set for:', alarmDate);
            console.log('All alarm dates:', alarmDates);

            // Send data to the server
            fetch('http://127.0.0.1:5000/set_alarm', { // Replace with your server URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ alarm_datetime: alarmDateTime })
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    setTimeout(() => {
                        alarmSound.play('BGM.wav');
                        alert(`Alarm set to water the ${selectedPlant}!`);
                    }, timeDiff);
                })
                .catch((error) => {
                    console.error('Error:', error);
                    alert('Failed to set alarm. Please try again.');
                });
        } else {
            alert('Please select a future time for the alarm.');
        }

    } else {
        alert('Please select a date and time for the alarm.');
    }
    displayCalendar(currentDate.getFullYear(), currentDate.getMonth());
});

displayCalendar(currentDate.getFullYear(), currentDate.getMonth());
