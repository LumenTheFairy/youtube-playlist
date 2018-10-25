yp.scripts.setup_tags = function() {

const tag_data = {
  filter_cache: new Set(),
  filter_cache_is_valid: false,
};
yp.tag_data = tag_data;

Set.prototype.every = function( condition ) {
  for( let v of this ) {
    if( !condition(v) ) {
      return false;
    }
  }
  return true;
};

Set.prototype.some = function( condition ) {
  let not_conditon = (x) => !condition(x);
  return !this.every(not_conditon);
}

tag_data.require = new Set();
tag_data.exclude = new Set();
tag_data.include = new Set();
tag_data.ignore  = new Set();

tag_data.should_play = function(song) {
  //annoyingly need to bind this function to use in every and some
  const song_has = song.info.tags.has.bind(song.info.tags);
  //make sure all required tags are in the song's tag list
  if(! tag_data.require.every( song_has ) ) {
    return false;
  }
  //make sure no excluded tags are in the song's tag list
  if( tag_data.exclude.some( song_has ) ) {
    return false;
  }
  let found_include_tag = false;
  song.info.tags.forEach( function(tag) {
    if(tag_data.include.has(tag) || tag_data.require.has(tag)) {
      found_include_tag = true;
    }
  });
  return found_include_tag;
};

//return the list of indices of allowed songs
tag_data.filtered_set = function() {
  if(tag_data.filter_cache_is_valid) {
    return tag_data.filter_cache;
  }
  else if(yp.song_data) {
    tag_data.filter_cache = new Set(yp.song_data.filter(tag_data.should_play).map( (song) => song.index ));
    tag_data.filter_cache_is_valid = true;
    return tag_data.filter_cache;
  }
  else {
    tag_data.filter_cache_is_valid = false;
    return new Set();
  }
};

let add_tag_row = function(tag_name) {
  const table = document.getElementById('inner-tag-table');
  const template = document.getElementById('tag-table-row-template');
  const row = template.cloneNode(true); //pass true to do a deep copy
  row.id = 'tag-row-' + tag_name;

  const local_storage_id = "tag-" + tag_name;
  let saved_value = localStorage.getItem(local_storage_id);

  let previous_value = "include";
  if(saved_value) {
    previous_value = saved_value;
  }
  else {
    saved_value = previous_value;
    localStorage.setItem(local_storage_id, "include");
  }
  tag_data[previous_value].add(tag_name);
  let onclick = function() {
    const my_value = this.value;
    //if the radio button option changed
    if(previous_value !== my_value) {
      //update tag sets
      tag_data[my_value].add(tag_name);
      tag_data[previous_value].delete(tag_name);
      //update previous
      previous_value = my_value;      
      //invalidate filtered list cache
      tag_data.filter_cache_is_valid = false;
      //update localStorage
      localStorage.setItem(local_storage_id, my_value);
    }
  };

  row.getElementsByTagName('label')[0].innerHTML = tag_name;
  for( input of row.getElementsByTagName('input') ) {
    input.name = "tag-option-" + tag_name;
    input.onclick = onclick;
    if(saved_value === input.value) {
      input.checked = "checked";
    }
  }

  table.appendChild(row);
};

let clear_table = function() {
  const table = document.getElementById('inner-tag-table');
  table.innerHTML = ""
}

return function() {
  clear_table();
  tag_data.require = new Set();
  tag_data.exclude = new Set();
  tag_data.include = new Set();
  tag_data.ignore  = new Set();
  yp.tags.forEach( add_tag_row );
};

};