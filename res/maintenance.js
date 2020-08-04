/* for the maintenance page when its down */

async function check_status() {
    let response = await fetch("/status.php");
    if(response.ok != true || response.status != 200) {
        return;
    }

    let status = await response.json();
    if(status.up != "true" || status.playback.song == "") {
        return;
    }

    window.location.replace("/");
}

window.onload = function() {
    document.onmouseup = function() {
        active_window = null;
    };
    document.onmousemove = function(e) {
        handle_drag(e);
    };
    document.getElementById('maintenance_window_title').onmousedown = function() {
        active_window = document.getElementById('maintenance_window');
    };

    center_window(document.getElementById('maintenance_window'));

    setInterval(function() {
        check_status();
    }, 5000);
};

