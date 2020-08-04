/* Window Manipulation Routines */

var active_window = null;   /* the window being dragged */

/* shows the window on the center of the screen */
function center_window(id) {
    var x = (window.innerWidth / 2) - (id.offsetWidth / 2);
    var y = (window.innerHeight / 2) - (id.offsetHeight / 2);

    id.style = "top: " + y + "px; left: " + x + "px;";
}

/* speaks for itself */
function handle_drag(e) {
    if(e.buttons & 1 && active_window != null) {
        var x = active_window.offsetLeft;
        var y = active_window.offsetTop;

        x += e.movementX;
        y += e.movementY;

        active_window.style = "top: " + y + "px; left: " + x + "px;";
    }
}

