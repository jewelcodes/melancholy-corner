/* Relevant to the player itself */

var is_playing = false;
var background_number;
var maximum_background = 31;    /* last valid bg */

function set_cookie(name, value) {
    var d = new Date();
    d.setTime(d.getTime() + 2*30*24*60*60*1000);
    var expires = ";expires=" + d.toUTCString();
    document.cookie = name + "=" + value + expires + ";path=/"; /* dirty af but we only have one cookie anyway */
}

function get_cookie(name) {
    var split_string = document.cookie.split('=');
    for(var i = 0; i < split_string.length; i++) {
        if(split_string[i] == name) {
            return split_string[i+1];
        }
    }

    return null;
}

function rand(range1, range2) {
    return Math.floor((Math.random() * range2) + range1);
}

/* updates the status */
async function update_playback() {
    let response = await fetch("/status.php");
    if(response.ok != true || response.status != 200) {
        window.location.replace("/maintenance.html");
    }

    let status = await response.json();
    if(status.up != "true" || status.playback.song == "") {
        window.location.replace("/maintenance.html");
    }

    document.getElementById('song_name').innerHTML = status.playback.song;
    document.getElementById('artist_name').innerHTML = status.playback.artist;
    document.getElementById('artwork').setAttribute("src", status.playback.artwork);
    document.getElementById('artwork').setAttribute("alt", status.playback.album);
    document.getElementById('artwork').setAttribute("title", status.playback.album);
    document.getElementById('listeners').innerHTML = status.icestats.source.listeners;
}

window.onload = function() {
    /* get broadcast url */
    var broadcast_url = window.location.protocol + "//" + window.location.hostname + ":8001/broadcast";
    document.getElementById('broadcast_link').setAttribute("href", broadcast_url);
    document.getElementById('broadcast_link').innerHTML = broadcast_url;

    /* before anything, in case we need to redirect */
    update_playback();

    /* install event handlers */
    document.getElementById('artwork').ondragstart = function() {
        return false;
    };
    document.getElementById('artwork').ondrag = document.getElementById('artwork').ondragstart;
    document.getElementById('artwork').ondragend = document.getElementById('artwork').ondrag;

    document.getElementById('play_stop').onclick = function() {
        if(is_playing) {
            document.getElementById('play_stop').innerHTML = "Play";
            document.getElementById('audio').pause();
            document.getElementById('audio').innerHTML = "";
            is_playing = 0;
        } else {
            document.getElementById('play_stop').innerHTML = "Stop";
            document.getElementById('audio').innerHTML = '<source src="' + broadcast_url + '">';
            document.getElementById('audio').load();
            document.getElementById('audio').play();
            is_playing = 1;
        }
    };
    document.getElementById('player_window_title').onmousedown = function() {
        active_window = document.getElementById('player_window');
    };
    document.getElementById('about_window_title').onmousedown = function() {
        active_window = document.getElementById('about_window');
    };
    document.getElementById('settings_window_title').onmousedown = function() {
        active_window = document.getElementById('settings_window');
    };
    document.getElementById('about_close').onclick = function() {
        document.getElementById('about_window').style = "visibility: hidden;";
    };
    document.onmouseup = function() {
        active_window = null;
    };
    document.onmousemove = function(e) {
        handle_drag(e);
    };
    document.getElementById('about_menu').onclick = function() {
        center_window(document.getElementById('about_window'));
    };
    document.getElementById('settings_button').onclick = function() {
        center_window(document.getElementById('settings_window'));
    };
    document.getElementById('settings_close').onclick = function() {
        document.getElementById('settings_window').style = "visibility: hidden;";
    };
    document.getElementById('bg_previous').onclick = function() {
        if(background_number > 1) {
            background_number--;
        } else {
            background_number = maximum_background;
        }

        document.getElementById('bg_number').innerHTML = background_number;
        set_cookie("background", background_number);
        document.getElementsByTagName("body")[0].style = "background-image: url('/bg/" + background_number + ".gif');";
    };
    document.getElementById('bg_next').onclick = function() {
        if(background_number < maximum_background) {
            background_number++;
        } else {
            background_number = 1;
        }

        document.getElementById('bg_number').innerHTML = background_number;
        set_cookie("background", background_number);
        document.getElementsByTagName("body")[0].style = "background-image: url('/bg/" + background_number + ".gif');";
    };
    document.getElementById('bg_solid').onclick = function() {
        background_number = 0;
        document.getElementById('bg_number').innerHTML = background_number;
        set_cookie("background", background_number);
        document.getElementsByTagName("body")[0].style = "";
    };
    document.getElementById('bg_random').onclick = function() {
        var new_background = rand(1, maximum_background);;
        while(new_background == background_number) {
            new_background = rand(1, maximum_background);
        }

        background_number = new_background;

        document.getElementById('bg_number').innerHTML = background_number;
        set_cookie("background", background_number);
        document.getElementsByTagName("body")[0].style = "background-image: url('/bg/" + background_number + ".gif');";
    };

    /* display the main window */
    center_window(document.getElementById('player_window'));

    /* load the background image */
    var background_number = get_cookie("background");
    if(background_number == null) {
        background_number = rand(1, maximum_background);
    }

    if(background_number > 0) {
        document.getElementsByTagName("body")[0].style = "background-image: url('/bg/" + background_number + ".gif');";
    }

    document.getElementById('bg_number').innerHTML = background_number;

    /* keep updating the status */
    setInterval(function() {
        update_playback();
    }, 5000);

    /* enable the player */
    document.getElementById('play_stop').innerHTML = "Play";
    document.getElementById('play_stop').removeAttribute("disabled");
};

