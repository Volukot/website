document.addEventListener("DOMContentLoaded", () => {
if (document.getElementById("pagebody-entrywarning")) {
    document.getElementById("pagebody-entrywarning").querySelector("#box2").lastElementChild.onclick = () => history.back();
    document.getElementById("pagebody-entrywarning").querySelector("#box2").lastElementChild.innerHTML = "Go back please.";
}

if (document.getElementById("pagebody-home")) {
//https://www.w3schools.com/xml/ajax_xmlhttprequest_response.asp
function loadURL(url, callback) {
    var xhttp=new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(this);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}
loadURL("https://api.listenbrainz.org/1/user/KittyKot/playing-now", playingNow);
setInterval(function() {loadURL("https://api.listenbrainz.org/1/user/KittyKot/playing-now", playingNow)}, 30000);

function playingNow(data) {
    var playingNowJSON = JSON.parse(data.responseText);
    var metadata = playingNowJSON.payload.listens[0].track_metadata
    var divListening = document.getElementById("div-listening");

    divListening.innerHTML = `
    <a class="album-cover track" id="album-cover-link" href="https://listenbrainz.org/user/KittyKot">
    <img id="album-cover-img" alt="No cover artwork." title="No cover artwork."></a>
    <a class="text listenbrain-link" href="https://listenbrainz.org/user/KittyKot">Listening to:</a>
    <a class="track-name track" id="track-name" href="https://listenbrainz.org/user/KittyKot">${metadata.track_name}</a>
    <a class="track-album track" id="track-album" href="https://listenbrainz.org/user/KittyKot">(${metadata.release_name})</a>
    <a class="track-artist track" id="track-artist" href="https://listenbrainz.org/user/KittyKot">by ${metadata.artist_name}</a>
    `;

    if (metadata.additional_info.recording_mbid) {
        for (var track of
        document.getElementsByClassName("track")) {
            track.href = "https://musicbrainz.org/recording/" +
            metadata.additional_info.recording_mbid;
        }
    }
    if (metadata.additional_info.release_mbid) {
        document.getElementById("track-album").href =
        "https://musicbrainz.org/release/" +
        metadata.additional_info.release_mbid;
        document.getElementById("album-cover-link").href =
        "https://musicbrainz.org/release/" +
        metadata.additional_info.release_mbid;
        loadURL("https://coverartarchive.org/release/" +
        metadata.additional_info.release_mbid, albumCover);
        function albumCover(data) {
            document.getElementById("album-cover-img").src =
            JSON.parse(data.responseText).images[0].thumbnails.small;
            document.getElementById("album-cover-img").alt =
            `Artwork for the album cover of ${metadata.release_name}.`;
            document.getElementById("album-cover-img").title =
            `Artwork for the album cover of ${metadata.release_name}.`;
        }
    }
    if (metadata.additional_info.artist_mbids) {
        document.getElementById("track-artist").href =
        "https://musicbrainz.org/artist/" +
        metadata.additional_info.artist_mbids[0];
    }
    if (metadata.additional_info.media_player) {
        if (metadata.additional_info.media_player_version) {
            document.getElementById("boxtitle-listening").innerHTML =
            `${metadata.additional_info.media_player} ${metadata.additional_info.media_player_version} (ListenBrainz)`;
        } else {
            document.getElementById("boxtitle-listening").innerHTML =
            `${metadata.additional_info.media_player} (ListenBrainz)`;
        }
    } else {
        document.getElementById("boxtitle-listening").innerHTML = "ListenBrainz";
    }
}
/* Currently doesn't work.
loadURL("https://v1.nocodeapi.com/kot/xml_to_json/ypuIicggTmzdnknK?url=https://www.imood.com/users/KittyKot", mood);
function mood(data) {
    var bigAssThing = JSON.parse(data.responseText);
    var moodLabel = bigAssThing.html.body.div[1].div[0].div[0].div[1].div[1].div[1].a._.replace(/[\n\r\s]+/g, '');
    document.getElementById("div-mood").innerHTML = moodLabel;
}
*/
}
});
