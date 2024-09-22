let nav = 0;
let clicked = null;
let events = [];

const calendar = document.getElementById('calendar');
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function openModal(date) {
    clicked = date;
    const eventForDay = events.find(e => e.date === clicked);

    if (eventForDay) {
        document.getElementById('eventTitle').innerText = eventForDay.title;
        document.getElementById('eventDate').innerText = clicked;
        eventTitleInput.value = eventForDay.title;
        document.querySelector(`input[name="eventColor"][value="${eventForDay.color || '#ff0000'}"]`).checked = true; // Set color
        deleteEventModal.style.display = 'block';
        document.getElementById('editButton').style.display = 'block'; // Show the Edit button
    } else {
        newEventModal.style.display = 'block';
        document.getElementById('editButton').style.display = 'none'; // Hide the Edit button
    }

    backDrop.style.display = 'block';
}

const eventForDay = events.find(e => e.date === dayString);
if (eventForDay) {
    const eventDiv = document.createElement('div');
    eventDiv.classList.add('event');
    eventDiv.innerText = eventForDay.title;
    eventDiv.style.backgroundColor = eventForDay.color || '#ff0000';  // Default to red if no color is set
    daySquare.appendChild(eventDiv);
}

function createEventDiv(event) {
    const eventDiv = document.createElement('div');
    eventDiv.classList.add('event');
    eventDiv.innerText = event.title;
    eventDiv.style.backgroundColor = event.color || '#ff0000';  // Default color red
    return eventDiv;
}



function load() {
    fetch('/get_events')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            events = data;
            renderCalendar();
        })
        .catch(error => {
            console.error('Error fetching events:', error);
        });
}

function renderCalendar() {
    const dt = new Date();
    if (nav !== 0) {
        dt.setMonth(new Date().getMonth() + nav);
    }

    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();

    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevLastDay = new Date(year, month, 0).getDate(); // Last day of the previous month

    const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });
    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

    document.getElementById('monthDisplay').innerText =
        `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`;

    calendar.innerHTML = ''; // Clear the calendar

    let dayCount = 1;
    let nextMonthDayCount = 1; // Start counting for next month's days
    const nextMonthName = new Date(year, month + 1, 1).toLocaleDateString('en-us', { month: 'short' }); // Name of the next month

    // Display 42 squares (6 weeks x 7 days)
    for (let i = 1; i <= 42; i++) {
        const daySquare = document.createElement('div');
        daySquare.classList.add('day');

        // Days from the previous month
        if (i <= paddingDays) {
            const prevMonthDateString = `${month === 0 ? 12 : month}/${prevLastDay - paddingDays + i}/${month === 0 ? year - 1 : year}`;
            daySquare.innerText = prevLastDay - paddingDays + i;
            daySquare.classList.add('padding-day'); // Styling class for previous/next month's days
            
            // Handle events for previous month's days
            const eventForDay = events.find(e => e.date === prevMonthDateString);
            if (eventForDay) {
                const eventDiv = document.createElement('div');
                eventDiv.classList.add('event');
                eventDiv.innerText = eventForDay.title;
                eventDiv.style.backgroundColor = eventForDay.color || '#ff0000'; // Apply selected color or default to red
                daySquare.appendChild(eventDiv);
            }

            // Add click event for previous month dates
            daySquare.addEventListener('click', () => openModal(prevMonthDateString));

        }
        // Days in the current month
        else if (i - paddingDays <= daysInMonth) {
            const dayString = `${month + 1}/${dayCount}/${year}`;
            
            // Display first day of the month as "Sep 1"
            if (dayCount === 1) {
                const monthName = dt.toLocaleDateString('en-us', { month: 'short' });
                daySquare.innerText = `${monthName} ${dayCount}`;
            } else {
                daySquare.innerText = dayCount;
            }

            if (dayCount === day && nav === 0) {
                daySquare.id = 'currentDay'; // Highlight the current day
            }

            const eventForDay = events.find(e => e.date === dayString);
            if (eventForDay) {
                const eventDiv = document.createElement('div');
                eventDiv.classList.add('event');
                eventDiv.innerText = eventForDay.title;
                eventDiv.style.backgroundColor = eventForDay.color || '#ff0000'; // Apply selected color or default to red
                daySquare.appendChild(eventDiv);
            }

            // Add click event for current month days
            daySquare.addEventListener('click', () => openModal(dayString));

            dayCount++;
        }
        // Days from the next month
        else {
            if (nextMonthDayCount === 1) {
                daySquare.innerText = `${nextMonthName} ${nextMonthDayCount}`;
            } else {
                daySquare.innerText = nextMonthDayCount;
            }
            daySquare.classList.add('padding-day'); // Styling class for next month's days
            
            const nextMonthDateString = `${month + 2}/${nextMonthDayCount}/${year + (month + 1 === 12 ? 1 : 0)}`;
            
            // Handle events for next month's days
            const eventForDay = events.find(e => e.date === nextMonthDateString);
            if (eventForDay) {
                const eventDiv = document.createElement('div');
                eventDiv.classList.add('event');
                eventDiv.innerText = eventForDay.title;
                eventDiv.style.backgroundColor = eventForDay.color || '#ff0000'; // Apply selected color or default to red
                daySquare.appendChild(eventDiv);
            }

            // Add click event for next month dates
            daySquare.addEventListener('click', () => openModal(nextMonthDateString));

            nextMonthDayCount++;
        }

        calendar.appendChild(daySquare); // Append the day square to the calendar
    }
}


function closeModal() {
    eventTitleInput.classList.remove('error');
    newEventModal.style.display = 'none';
    deleteEventModal.style.display = 'none';
    backDrop.style.display = 'none';
    eventTitleInput.value = '';
    clicked = null;
    load();  // Reload the calendar to show the updated events
}

function saveEvent() {
    const selectedColor = document.querySelector('input[name="eventColor"]:checked').value;
    console.log('Selected Color:', selectedColor);  // Debug log
    console.log('Event Title:', eventTitleInput.value);  // Debug log
    console.log('Clicked Date:', clicked);  // Debug log

    if (eventTitleInput.value) {
        eventTitleInput.classList.remove('error');

        const event = {
            date: clicked,
            title: eventTitleInput.value,
            color: selectedColor
        };

        fetch('/save_event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(event)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                load();  // Reload the calendar after saving
                closeModal();
            } else {
                console.error('Error saving event:', data.message);
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
    } else {
        eventTitleInput.classList.add('error');
    }
}


function deleteEvent() {
    events = events.filter(e => e.date !== clicked);
    
    fetch('/delete_event', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ date: clicked })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // Fetch the updated list of events and reload the calendar
            load();
            // Close the modal after deleting
            closeModal();
        } else {
            console.error('Error deleting event');
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}

function goToToday() {
    // Set nav to 0 to navigate to the current month
    nav = 0;

    // Reload the calendar to show the current month
    load();
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {  // Check if the 'Enter' key is pressed
        if (newEventModal.style.display === 'block' || deleteEventModal.style.display === 'block') {
            saveEvent();  // Save the event
        }
    } else if (event.key === 'Escape') {  // Check if the 'Esc' key is pressed
        closeModal();  // Close the modal
    }
}

document.addEventListener('keydown', handleKeyPress);

function initButtons() {
    document.getElementById('nextButton').addEventListener('click', () => {
        nav++;
        load();
    });

    document.getElementById('backButton').addEventListener('click', () => {
        nav--;
        load();
    });

    document.getElementById('saveButton').addEventListener('click', saveEvent);

    document.getElementById('cancelButton').addEventListener('click', closeModal);

    document.getElementById('deleteButton').addEventListener('click', deleteEvent);

    document.getElementById('closeButton').addEventListener('click', closeModal);

    document.getElementById('todayButton').addEventListener('click', goToToday);
}

initButtons();
load();
