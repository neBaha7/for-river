document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = document.getElementById('audio-player');
    const playPauseBtn = document.getElementById('play-pause-btn'); // Wheel button 
    const prevBtn = document.getElementById('prev-btn'); // Wheel button
    const nextBtn = document.getElementById('next-btn'); // Wheel button
    const centerBtn = document.getElementById('center-btn'); // Center button
    const menuBtn = document.getElementById('menu-btn');

    const songTitleEl = document.getElementById('song-title');
    const artistNameEl = document.getElementById('artist-name');
    const progressBar = document.getElementById('progress');
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');

    // Default Playlist - User can add more here
    // NOTE: User needs to put files in 'songs/' directory with these names
    const playlist = [
        { title: "All In My Head", artist: "Library", src: "songs/All In My Head.mp3" },
        { title: "Bring Me To Life", artist: "Library", src: "songs/Bring Me To Life.mp3" },
        { title: "Cigarettes", artist: "Library", src: "songs/Cigarettes.mp3" },
        { title: "Drunk in Love", artist: "Library", src: "songs/Drunk in Love.mp3" },
        { title: "Earrings", artist: "Library", src: "songs/Earrings.mp3" },
        { title: "HIgh and Dry", artist: "Library", src: "songs/HIgh and Dry.mp3" },
        { title: "I miss your warm hands", artist: "Library", src: "songs/I miss your warm hands.mp3" },
        { title: "Made Of Pain", artist: "Library", src: "songs/Made Of Pain.mp3" },
        { title: "Send Your Loving", artist: "Library", src: "songs/Send Your Loving.mp3" },
        { title: "Talk 2 me", artist: "Library", src: "songs/Talk 2 me.mp3" },
        { title: "You Send Me", artist: "Library", src: "songs/You Send Me.mp3" },
        { title: "summerboy", artist: "Library", src: "songs/summerboy.mp3" }
    ];

    let currentSongIndex = 0;
    let isPlaying = false;

    // Initialize first song
    loadSong(currentSongIndex);

    function loadSong(index) {
        const song = playlist[index];
        songTitleEl.innerText = song.title;
        artistNameEl.innerText = song.artist;
        audioPlayer.src = song.src;

        // Update Album Art
        const albumArt = document.querySelector('.album-art');
        if (song.cover) {
            albumArt.style.backgroundImage = `url('${song.cover}')`;
        } else {
            // Default if no cover
            albumArt.style.backgroundImage = "url('https://github.com/NikhilMarko03/resources/blob/main/heart.gif?raw=true')";
        }

        // Reset progress
        progressBar.style.width = '0%';
        currentTimeEl.innerText = "0:00";
        totalTimeEl.innerText = "0:00";
    }

    function togglePlayPause() {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    }

    function playSong() {
        isPlaying = true;
        audioPlayer.play().catch(error => {
            console.log("Playback failed (likely no file):", error);
            // alert("Song file not found. Please add mp3 files to 'songs/' folder.");
        });
        // We could change an icon here if we had one on screen
    }

    function pauseSong() {
        isPlaying = false;
        audioPlayer.pause();
    }

    function nextSong() {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
        loadSong(currentSongIndex);
        if (isPlaying) playSong();
    }

    function prevSong() {
        currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
        loadSong(currentSongIndex);
        if (isPlaying) playSong();
    }

    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        if (isNaN(duration)) return;

        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;

        // Update time display
        const currentMin = Math.floor(currentTime / 60);
        const currentSec = Math.floor(currentTime % 60);
        currentTimeEl.innerText = `${currentMin}:${currentSec < 10 ? '0' + currentSec : currentSec}`;

        const totalMin = Math.floor(duration / 60);
        const totalSec = Math.floor(duration % 60);
        totalTimeEl.innerText = `${totalMin}:${totalSec < 10 ? '0' + totalSec : totalSec}`;
    }

    // Event Listeners for controls
    // Using the wheel areas as buttons for simplicity

    // Bottom area for Play/Pause
    playPauseBtn.onclick = (e) => {
        e.stopPropagation();
        togglePlayPause();
    };

    // Center button also Play/Pause for ease of use
    centerBtn.onclick = (e) => {
        e.stopPropagation();
        togglePlayPause();
    };

    // Right area for Next
    nextBtn.onclick = (e) => {
        e.stopPropagation();
        nextSong();
    };

    // Left area for Prev
    prevBtn.onclick = (e) => {
        e.stopPropagation();
        prevSong();
    };

    // Populate Song List
    const songListEl = document.getElementById('song-list');
    const menuViewEl = document.getElementById('menu-view');
    const mainContentEl = document.querySelector('.main-content'); // Assuming this exists or needed for toggling visibility if we don't overlay

    function renderPlaylist() {
        songListEl.innerHTML = '';
        playlist.forEach((song, index) => {
            const li = document.createElement('li');
            li.innerText = song.title;
            li.onclick = () => {
                currentSongIndex = index;
                loadSong(currentSongIndex);
                playSong();
                toggleMenu(); // Go back to Now Playing
            };
            songListEl.appendChild(li);
        });
    }

    renderPlaylist();

    function toggleMenu() {
        if (menuViewEl.style.display === 'none' || menuViewEl.style.display === '') {
            menuViewEl.style.display = 'block';
        } else {
            menuViewEl.style.display = 'none';
        }
    }

    // Audio events
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', nextSong);

    // Menu Button (Top) - Toggles the list view
    menuBtn.onclick = (e) => {
        e.stopPropagation();
        toggleMenu();
    };

    // Make sure pointer events are enabled in CSS for this to work on the screen list
});
