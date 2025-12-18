/// This file contains code to support viewing on portrait devices.
//.

// This function handles updating the UI
// We need to pass in a boolean which tells if the current mode if portrait or not
function updateUI(portrait) {
    if (portrait) {
        // This is used in bookmaker.js for the resize function
        _orientation = true;

        // Hide certain elements
        $('#topMenu').addClass('hideForPortrait');
        // $('#turnControls').addClass('hideForPortrait');
        $('.turnButton').addClass('hideForPortrait');
        $('.bookInfo').addClass('hideForPortrait');
        $('#tapControls').removeClass('hideForPortrait');
        $('#portraitPrompt').removeClass('hideForPortrait');

        $('#book').turn('display', 'single');

        //we need to add this class to ensure correct z-ordering
        //when switching between portrait and landscape..
        //this is needed due to a wierd browser bug where it doesn't set z-index correctly
        //when switching from landscape to portrait..
        $('#book').addClass('bookToFront');
        $('#contactInfo').addClass('bookToFront');
    } else {
        _orientation = false;

        // Unhide certain elements
        $('#topMenu').removeClass('hideForPortrait');
        // $('#turnControls').removeClass('hideForPortrait');
        $('.turnButton').removeClass('hideForPortrait');
        $('.bookInfo').removeClass('hideForPortrait');
        $('#tapControls').addClass('hideForPortrait');
        $('#portraitPrompt').addClass('hideForPortrait');


        $('#book').turn('display', 'double');
        $('#book').removeClass('bookToFront');
        $('#contactInfo').removeClass('bookToFront');
    }
}
// This adds an event listener to the window object, which listens for a change on the orientation property
window.matchMedia("(orientation: portrait)").addEventListener("change", e => {
    const portrait = e.matches;
    updateUI(portrait);
    updateBookSize();
});
updateUI(window.matchMedia("(orientation: portrait)").matches);


// Add custom swipe support for touch devices..
var touchstartX = 0;
var touchendX = 0;
var minSwipeDist = 100;

// This is used to keep track of when tap is started.
// When using TurnJS TouchStart event doesn't fire when turning from the corner.
// So we can use a variable to enable gesture when not swiping over the corner.
var startedSwipe = false;

//We simply set two variables, then compare the distance between then,
//and direction between them, this is our simple swipe gesture detection.
document.addEventListener('touchstart', function (e) {
    //Dont fire if tapping on outer controls
    if (e.target.classList.contains('rightSide')) return;
    if (e.target.classList.contains('leftSide')) return;

    touchstartX = e.changedTouches[0].screenX;

    startedSwipe = true;
}, false);

document.addEventListener('touchend', function (e) {
    touchendX = e.changedTouches[0].screenX;

    // Disabled due to not working when user pinch zooms :(
    handleGesture(e);
    startedSwipe = false;
}, false);

// Disable startedSwipe if scrolling / panning
window.visualViewport.addEventListener('scroll', function () {
    startedSwipe = false;
})


function handleGesture(e) {
    // Halts execution if the touchstart event never fired!
    // meaning the swipe started on a corner!
    if (!startedSwipe) return;

    // Halt execution if there are multiple touch points
    if (e.touches.length > 1) return;

    // Halt execution if minimum swipe distance is not achieved
    // to prevent accidental swipes
    var dist = Math.abs(touchendX - touchstartX);
    if (dist < minSwipeDist) return;

    if (touchendX > touchstartX) {
        previousPage();

    } else if (touchendX < touchstartX) {
        nextPage();
    }
}


// TAP Controls
$('#tapControls .leftSide').on('click', previousPage)
$('#tapControls .rightSide').on('click', nextPage)

$(document).on('scroll', function () {
    console.log('scrolling')
})