const container = document.querySelector('.container');
const seats = document.querySelectorAll('.row .seat:not(.occupied)');
const count = document.getElementById('count');
const total = document.getElementById('total');
const movieSelect = document.getElementById('movie');


const localMovieBookingInfo = JSON.parse(localStorage.getItem('movieBookingInfo'));

let movieBookingInfo = localMovieBookingInfo ? localMovieBookingInfo : {}; 

if (movieBookingInfo['timestamp'] < new Date()) {
    localStorage.removeItem('movieBookingInfo');
}

populateUI();

let ticketPrice = +movieSelect.value;


// Save movie and price
function setMovieData(index, price) {
    movieBookingInfo['selectedMovieIndex'] = index;
    movieBookingInfo['selectedMoviePrice'] = price;
    localStorage.setItem('movieBookingInfo', JSON.stringify(movieBookingInfo)); 

}

// Update total and count
function updateSelectedCount() {
    const selectedSeats = document.querySelectorAll('.row .seat.selected');

    // return array of indexes of seats from the nodelist
    const seatsIndex = [...selectedSeats].map((seat) => [...seats].indexOf(seat));

    // Remove local storage after 10 min
    timestamp = new Date();
    timestamp.setMinutes(timestamp.getMinutes() + 10);

    movieBookingInfo['selectedSeats'] = seatsIndex;
    movieBookingInfo['timestamp'] = timestamp;
    localStorage.setItem('movieBookingInfo', JSON.stringify(movieBookingInfo)); 

    const selectedSeatsCount = selectedSeats.length;
    count.innerText = selectedSeatsCount;
    total.innerText = selectedSeatsCount * ticketPrice;
}

// Use data from local storage to populate UI
function populateUI() {
    const selectedSeats = movieBookingInfo['selectedSeats'];

    if (selectedSeats !== null && selectedSeats.length > 0) {
        seats.forEach((seat, index) => {
            if (selectedSeats.indexOf(index) > -1) {
                seat.classList.add('selected');
            }
        });
    }

    const selectedMovieIndex = movieBookingInfo['selectedMovieIndex'];
    if (selectedMovieIndex !== null) {
        movieSelect.selectedIndex = selectedMovieIndex;
    }
}

// Movie change event
movieSelect.addEventListener('change', e => {
    ticketPrice = +e.target.value;
    setMovieData(e.target.selectedIndex, e.target.value);
    updateSelectedCount();
})

// Seat click event
container.addEventListener('click', (e) => {
    if (e.target.classList.contains('seat') && !e.target.classList.contains('occupied')) {
        e.target.classList.toggle('selected');

        updateSelectedCount();
    }
});

// Page load set values
updateSelectedCount();