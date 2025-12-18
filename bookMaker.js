// Initialize the book
$("#book").turn({ gradients: true, acceleration: true, autoCenter: false })

// This variable is used later in the mobileViewer module, 
var _orientation = window.matchMedia("(orientation: portrait)").matches;

// Resizes Book upon window Resize.
// While the same can be declared in CSS
// TurnJS creates a new object after reading initial CSS values
// It does not update these values by reading from CSS constantly.
// Hence we must do it manually.
function updateBookSize() {

    // Escape this entire function if _orientation is not set,
    // because then we don't know what size we need to resize for..
    if (_orientation == null) return;

    // Get the current viewport width minus the margins
    // Choose different margin depending on orientation
    // var width = window.outerWidth - (_orientation ? 30 : 100);
    var height = window.outerHeight - (_orientation ? 300 : 300);

    /// Calculate the height maintaining the aspect ratio

    // If orientation is landscape, we need to calculate height for 2x width
    // since two pages are displayed at the same time
    // But if it is Portrait, only one page is shown,
    // So the numbers change.

    // Here 1240.5/3508 is the height/width ratio. We simple do a ratio calculation to find out
    // the missing height value. w1/h1 = w2/h2 
    if (_orientation == false)
        var width = height * 2828 / 2000
    // var height = width * 1240.5 / 3508;
    if (_orientation == true)
        var width = height * 1414 / 2000
    // var height = width * 1240.5 / 1754;

    // Get the book element
    var book = document.getElementById('book');

    // Update the width and height of the book
    book.style.width = width + 'px';
    book.style.height = height + 'px';

    // Update the size in TurnJS
    $('#book').turn('size', width, height);
    $('#book').turn('zoom', 1, 0);
}
window.addEventListener('resize', updateBookSize);
// $(document).ready(updateBookSize);
updateBookSize();

//Helper functions for easier calling
function nextPage() {
    $("#book").turn('next');

    //Hide prompts
    if (_orientation)
        $('#portraitPrompt').addClass('hidePrompt');

    //Immediately updates the page number upon clicking.
    //This makes the page numbering more responsive
    //We perform a simple check to ensure it doesn't display above lastPage
    let pageNo = parseFloat($currentPage.val());

    //We flip 2 pages in landscape, (front and back)
    //but only 1 otherwise..
    let newPageNo = pageNo + (_orientation == true ? 1 : 2);

    if (newPageNo <= lastPage)
        $currentPage.val(newPageNo);
    else
        $currentPage.val(lastPage);
}

function previousPage() {
    $("#book").turn('previous');

    //Hide prompts
    if (_orientation)
        $('#portraitPrompt').addClass('hidePrompt');

    //Immediately updates the page number upon clicking.
    //This makes the page numbering more responsive
    //We perform a simple check to ensure it doesn't display below 0
    let pageNo = parseFloat($currentPage.val());
    let newPageNo = pageNo - (_orientation == true ? 1 : 2);
    if (newPageNo >= 0)
        $currentPage.val(newPageNo);
    else {
        $currentPage.val(0);
    }
}

function turnToPage(number) {
    if (number == null) return;
    $("#book").turn('page', number);

    //Hide prompts
    if (_orientation)
        $('#portraitPrompt').addClass('hidePrompt');
}