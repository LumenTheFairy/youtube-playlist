yp.scripts.events = function() {

const player = yp.player;
const comm = yp.comm;

//handlers
let toggle_play_pause = function() {
  if(player.p.getPlayerState() === 1) { //playing
    player.p.pauseVideo();
  }
  else if(player.p.getPlayerState() === 2) { //paused
    player.p.playVideo();
    document.getElementById("play-pause").innerHTML = "Pause";
  }
}

// let hide_player = function() {
//   document.getElementById('player-container').style.display = 'none';
//   player.player_hidden = true;
// }

// let show_player = function() {
//   document.getElementById('player-container').style.display = 'initial';
//   player.player_hidden = false;
// }

let reload_songs = function() {
  yp.loader.reload(['songs']);
};


let volume_handle = function() {
  volume = this.value;
  number_elem = document.getElementById('volume-number');
  number_elem.innerHTML = volume;
  player.volume_perc = volume;
  player.set_volume();
  localStorage.setItem('volume_perc', JSON.stringify(player.volume_perc));
};

// let shuffle_handle = function(cb) {
//   player.shuffle = cb.checked;
//   localStorage.setItem('shuffle', JSON.stringify(cb.checked));
// };

let song_order_handle = function(sel) {
  player.song_order = sel.value;
  localStorage.setItem('song_order', JSON.stringify(sel.value));
};

let skip_expected_fails_handle = function(cb) {
  player.skip_expected_fail = cb.checked;
  localStorage.setItem('skip_expected_fail', JSON.stringify(cb.checked));
};

// let hide_player_handle = function(cb) {
//   if(cb.checked) {
//     hide_player();
//   }
//   else {
//     show_player();
//   }
//   localStorage.setItem('player_hidden', JSON.stringify(player.player_hidden));
// };

let clear_local_storage = function() {
  localStorage.clear();
};

//attach handlers
return function() {
  if(player.player_hidden) {
    hide_player();
  }
  document.getElementById("play-pause").onclick = toggle_play_pause;
  document.getElementById("next").onclick = player.play_next;
  //document.getElementById("reload-songs").onclick = reload_songs;
  document.getElementById("comm-button").onclick = comm.onbutton;

  const volume_slider = document.getElementById("volume-slider");
  volume_slider.oninput = volume_handle;
  volume_slider.value = player.volume_perc;
  document.getElementById("volume-number").innerHTML = player.volume_perc;

  // const shuffle_cb = document.getElementById("cb-shuffle");
  // shuffle_cb.onclick = shuffle_handle.bind(shuffle_cb, shuffle_cb);
  // shuffle_cb.checked = player.shuffle;

  const song_order_sel = document.getElementById("song-order-select");
  song_order_sel.onchange = song_order_handle.bind(song_order_sel, song_order_sel);
  song_order_sel.value = player.song_order;

  const skip_fail_cb = document.getElementById("cb-skip-fail");
  skip_fail_cb.onclick = skip_expected_fails_handle.bind(skip_fail_cb, skip_fail_cb);
  skip_fail_cb.checked = player.skip_expected_fail;

  document.getElementById("bot-host").value = comm.server_hostname;
  document.getElementById("bot-port").value = comm.server_port;

  // const hide_player_cb = document.getElementById("cb-hide-player");
  // hide_player_cb.onclick = hide_player_handle.bind(hide_player_cb, hide_player_cb);
  // hide_player_cb.checked = player.player_hidden;
};

};