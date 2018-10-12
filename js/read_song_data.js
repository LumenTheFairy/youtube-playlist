yp.scripts.read_song_data = function(songs) {

//parse this into a more uniform form
let song_data = [];
let tags = new Set();
songs.forEach( function(song) {
  let data = {};
  data.info = {
    desc: song.desc,
    name: song.name,
    artist: song.artist,
    uuid: song.uuid,
    tags: new Set(song.tags),
  };
  //add the tags to the complete set of tags
  data.info.tags.forEach( function(tag) {
    tags.add(tag);
  });
  //if the tag set is empty, give it a dummy tag so that it will still play in an all include filter
  if(data.info.tags.size == 0) {
    data.info.tags.add("No tags");
    tags.add("No tags");
  }
  let build_alternative = function(obj) {
    return {
      id: obj.id,
      start: obj.start,
      end: obj.end,
      volume: obj.volume,
      expected_fail: obj.expected_fail,
    };
  };
  if(song.alternatives) {
    data.alternatives = song.alternatives.map(build_alternative);
  }
  else {
    data.alternatives = [build_alternative(song)];
  }
  song_data.push(data);
});

//https://stackoverflow.com/questions/3746725/create-a-javascript-array-containing-1-n
let basic_order = [...Array(song_data.length).keys()];
let shuffled_order = basic_order.slice();
//https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
shuffled_order.shuffle_me = (function() {
    let a = this;
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
});
shuffled_order.shuffle_me();

yp.song_data = song_data;
yp.basic_order = basic_order;
yp.shuffled_order = shuffled_order;
yp.tags = tags;
};