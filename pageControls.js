//Panning Controls
//This behaviour allows us to pan the page simply using left click
//and dragging across the screen
var panning = false;
var lastX, lastY;

// document.body.style.overflow = 'hidden'; // hides scrollbars
// Tracks the point where the mouse was when clicked
// The offset position is then used to track how to scroll the page
document.addEventListener('mousedown', function (e) {
    if (document.documentElement.scrollHeight > document.documentElement.clientHeight ||
        document.documentElement.scrollWidth > document.documentElement.clientWidth) {
        lastX = e.clientX;
        lastY = e.clientY;
        panning = true;
    }
});

document.addEventListener('mousemove', function (e) {
    if (_orientation) return;
    if (panning) {
        var deltaX = e.clientX - lastX;
        var deltaY = e.clientY - lastY;
        window.scrollBy(-deltaX, -deltaY);
        lastX = e.clientX;
        lastY = e.clientY;
    }
});

document.addEventListener('mouseup', function () {
    panning = false;
});


//Keyboard Controls to ease Navigation
let isProcessingKey = false;
let delay = 200; // Delay in milliseconds

//We set a flag to true, and we use SetTimeout function to enable it back up after a fixed delay
//We do this because without this, the event fires rapidly if button is held
//This behaviour allows us to flip at a steady rate when key is held,
//But skip the delay if tapping fast
document.onkeydown = function checkKey(e) {

    // Number Keys navigation
    if (e.key.match(/^[0-9]$/) && !$currentPage.is(':focus')) {
        $currentPage.val(0);
        $currentPage.focus();
    }

    //Arrow Key navigation
    if (isProcessingKey) return;
    if (currentPageFocused) return;

    if (e.key == "ArrowRight" || e.key == "d") {
        isProcessingKey = true;
        nextPage();
        setTimeout(() => { isProcessingKey = false; }, delay);
    }
    if (e.key == "ArrowLeft" || e.key == "a") {
        isProcessingKey = true;
        previousPage();
        setTimeout(() => { isProcessingKey = false; }, delay);
    }
}

//We reset flag on keyup so the user can spam tap faster if they want to
document.onkeyup = function releaseKey(e) {
    if (isProcessingKey) isProcessingKey = false;
}


//Button Controls to ease Navigation

//We write some validation to ensure number is clamped between 0-max
//and it is always a number.
const lastPage = $("#book").turn('pages') - 1;
var currentPageFocused = false;

// Update 'of 0' text at bottom of currentPage
$('#turnControls .ofPages').html(`of ${lastPage}`);


// Below event listener runs every time any input is passed
// and manages validation
const $currentPage = $(".currentPage");
$currentPage.on("input", function () {
    let inputValue = parseFloat($currentPage.val());

    if (isNaN(inputValue)) {
        $currentPage.val("0");
    }
    else {
        inputValue = Math.min(Math.max(inputValue, 0), lastPage);
        $currentPage.val(inputValue.toString());
    }
})

//Below listeners are used to track focus / unfocus events
$currentPage.on("focus", () => { currentPageFocused = true })
$currentPage.on("blur", () => {
    currentPageFocused = false
    let targetPage = parseFloat($currentPage.val()) + 1
    turnToPage(targetPage);
})

//Check for enter press, and turns to page
$currentPage.on("keypress", (e) => {
    if (currentPageFocused && e.key === "Enter") {
        $currentPage.blur();

        let targetPage = parseFloat($currentPage.val()) + 1
        turnToPage(targetPage);
    }
})

//Uses TurnJS events to keep the input field updated
function updateCurrentPage() {
    let pageno = $("#book").turn('page') - 1;
    $currentPage.val(pageno)
}
$("#book").bind('turned', updateCurrentPage)