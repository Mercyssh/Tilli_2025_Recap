const bookmarks = $("#bookmarks li");

//Jquery will automatically add the event listener to all bookmarks selected
//by above query
// Over here 'this' referce to whichever element the loop is on
bookmarks.on("click", function () {
    let pageStart = $(this).data("page-start")

    // Set currentPage directly here, to make it feel more responsive
    $currentPage.val(pageStart)

    // Turn to this page.
    turnToPage(pageStart + 1)
})

// Handles hiding and showing of Contents page and back to contents btn
//.bind is used to add eventlisteners provided by TurnJS
$('#book').bind('first', function () {
    $(".bookInfo").removeClass("hideBookInfo");
    $("#topMenu").addClass("hideTopMenu")
})

$('#book').bind('turning', function (event, newPage, corner) {
    if (newPage > 1) {
        $(".bookInfo").addClass("hideBookInfo");
        $("#topMenu").removeClass("hideTopMenu")
    }
})


//Handle TopContents Width Resizing
// We need to manually resize this, since we are also resizing the book
// through JS, and the width of this element relies on the width of the book's container
function updateTopContentsWidth() {
    var containerWidth = $('.container').width();
    $('#topMenu').css('max-width', containerWidth);
}
updateTopContentsWidth();
$(window).resize(updateTopContentsWidth);



//Handle Top menu items Animations and logic
// This referes to a jquery collection of individual elements
const topMenuItems = $("#topMenuItems div");
// This refers to the toggle button for the top menu
const topMenuToggle = $("#topMenuToggle");

//adds classes to topMenuItems to hide them
//We do it here instead of HTML
//because its cleaner to do it here.
function InitTopMenuItems() {
    // Hide the menu items initially
    topMenuItems.addClass('collapseTopMenuItems');
    makeIncrementalDelay();
}
InitTopMenuItems();

// Adds transition delay to each item
// These are helper functions, and called from within other functions
// These basically just add delay in an order, either left -> right (incremental)
// or right -> left (decremental)
// incremental delays = 0, 50, 100, ...
// decremental delays = 200, 150, 100, ...
function makeIncrementalDelay() {
    topMenuItems.each(function (index) {
        $(this).css("transition-delay", index * 50 + "ms");
    });
}
// We need to call this function before we collapseTopMenuItems
function makeDecrementalDelay() {
    topMenuItems.each(function (index) {
        var reverseIndex = topMenuItems.length - index - 1;
        $(this).css("transition-delay", reverseIndex * 50 + "ms");
    });
}

// Get rid of delay once its done being used
topMenuItems.on("transitionend", function () {
    // Code to run after the transition
    $(this).css("transition-delay", "0ms");
});

// Handle the logic for page turning and toggling off context menu
topMenuItems.on("click", function () {

    //Hide the items
    makeDecrementalDelay();
    topMenuItems.addClass('collapseTopMenuItems');

    //Make the contents toggle inactive
    topMenuToggle.removeClass('activateTopMenuToggle')

    // Get the page to turn to from HTML data property, and turn to that page
    let pageStart = $(this).data("page-start")
    // Set currentPage directly here, to make it feel more responsive
    $currentPage.val(pageStart)
    // Turn to this page.
    turnToPage(pageStart + 1)
})

// Handle the actual toggling on and off of menu
topMenuToggle.on('click', () => {
    // Toggle the menu
    topMenuToggle.toggleClass('activateTopMenuToggle')

    // Check state of menu now, if its on, we show the items, else we collapse them
    if (topMenuToggle.hasClass('activateTopMenuToggle')) {
        //Set incremental delay - so they fade left to right
        makeIncrementalDelay();
        topMenuItems.removeClass('collapseTopMenuItems');
    }
    else {
        //Set decremental delay - so they fade right to left
        //Then add the class to hide them
        makeDecrementalDelay();
        topMenuItems.addClass('collapseTopMenuItems');
    }
})