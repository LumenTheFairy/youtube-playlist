#YouTube Playlist

This is a simple webpage that automatically plays YouTube videos from a pre-made list of anime and video game music songs.

It is mainly for personal use, and use on [my stream](https://www.twitch.tv/theonly0) with some special hooks to interact with my stream bot (which is not public code at the moment) and update the scoreboard linked in the bottom-right corner of the page (which is a bad link on this repo). There is a hosted version on firebase that has a database for playlist scores (also not public code).

It is an example of a webpage using the [Promise Loader](https://github.com/LumenTheFairy/PromiseLoader) (although an admittedly somewhat messy one).

I, annoyingly, need to maintain two copies of this repository, one here, and one on firebase, since firebase won't allow a git repository nested inside the hosted public directory (which is exactly where this lies), and I couldn't find a mechanism to ask firebase to ignore the .git directory. So if you want to use the webpage to listen to music, you have two options:

[https://lumenthefairy.github.io/youtube-playlist/](https://lumenthefairy.github.io/youtube-playlist/) - Up to date with this repository. Scoreboard links are broken, bot connection will only work with the repo hosted locally.
[https://theonly0-playlist-scoreboard.firebaseapp.com/playlist/](https://theonly0-playlist-scoreboard.firebaseapp.com/playlist/) - Up to date with the scoreboard's view of the playlist. Scoreboard links work correctly.