var audio;

//Hide Pause, mute and repeated 
$('#pause').hide();
$('#unmute').hide();
$('#repeated').hide();

initAudio($('#playlist li:first-child'));
function initAudio(element) {
    var song = element.attr('song');
    var title = element.text();
    var cover = element.attr('cover');
    var artist = element.attr('artist');

    //Create audio object
    audio = new Audio('music/' + song);

    //Insert audio info
    $('.artist').text(artist);
    $('.title').text(title);

    //Insert song cover
    $('img.cover').attr('src', 'art/' + cover);

    $('#playlist li').removeClass('active');
    element.addClass('active');
}


//Play button
$('#play').click(function () {
    audio.play();
    $('#play').hide();
    $('#pause').show();
    showDuration();
});

//Pause button
$('#pause').click(function () {
    audio.pause();
    $('#play').show();
    $('#pause').hide();
});

//Stop button
$('#stop').click(function () {
    audio.pause();
    $('#play').show();
    $('#pause').hide();
    audio.currentTime = 0;
    $("#seek").val = 0;
});

//Next button
$('#next').click(function () {
    audio.pause();
    var next = $('#playlist li.active').next();
    if (next.length == 0) {
        next = $('#playlist li:first-child');
    }
    initAudio(next);
    audio.play();
    $("#seek").val = 0;
    showDuration();
});

//Prev button
$('#prev').click(function () {
    audio.pause();
    var prev = $('#playlist li.active').prev();
    if (prev.length == 0) {
        prev = $('#playlist li:last-child');
    }
    initAudio(prev);
    audio.play();
    showDuration();
});
// Mute button
$('#mute').click(function () {
    audio.muted = true;
    $('#mute').hide();
    $('#unmute').show();
    showDuration();
});
// UnMute button
$('#unmute').click(function () {
    audio.muted = false;
    $('#unmute').hide();
    $('#mute').show();
    showDuration();
});
//Playlist song click
$('#playlist li').click(function () {
    audio.pause();
    initAudio($(this));
    $('#play').hide();
    $('#pause').show();
    audio.play();
    showDuration();
});

//Volume control
$('#volume').change(function () {
    audio.volume = parseFloat(this.value / 10);
});

//Repeat control
$('#repeat').click(function () {
    audio.loop = true;
    $('#repeat').hide();
    $('#repeated').show();

});
$('#repeated').click(function () {
    audio.loop = false;
    $('#repeat').show();
    $('#repeated').hide();

});
//Play All
var currentSong = 0;
$('#playall').click(function () {
     audio.play();
     showDuration()
     currentSong = $('#playlist li').index()
});

audio.addEventListener('ended', function () {
    currentSong++;
    if (currentSong == $('#playlist li').length) {
        currentSong = 0;
    }
    var nextsong = $($("#playlist li")[currentSong])
    initAudio(nextsong)
    audio.play();
    
    showDuration()
})


//Time/Duration
function showDuration() {
    $(audio).bind('timeupdate', function () {
        //Get hours and minutes
        var s = parseInt(audio.currentTime % 60);
        var m = parseInt(audio.currentTime / 60) % 60;
        if (s < 10) {
            s = '0' + s;
        }
        $('#duration').html(m + ':' + s);
        var value = 0;
        if (audio.currentTime > 0) {
            value = Math.floor((100 / audio.duration) * audio.currentTime);
        }
        //$('#seek').val(value);
    });
    $(audio).on("loadedmetadata", function () {
        $("#seek").attr("max", audio.duration);
    });
    $("#seek").bind("change", function () {
        audio.currentTime = $(this).val();
    });
    audio.addEventListener('timeupdate', function () {
        $("#seek").attr("max", audio.duration);
        $('#seek').val(audio.currentTime);
    });
}