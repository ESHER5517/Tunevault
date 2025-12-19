const $ = id => document.getElementById(id);

const audio = $('audio');
const playPauseButton = $('playPauseBtn');
const playPauseIcon = $('playPauseIcon');
const trackLabel = $('trackLabel');
const currentTimeEl = $('currentTime');
const durationEl = $('duration');
const progressBar = $('progress');
const volumeControl = $('volume');
const searchInput = $('searchInput');
const player = document.querySelector('.player');

document.querySelectorAll('.artist-header').forEach(header => {
    header.addEventListener('click', () => {
        const content = header.closest('.artist').querySelector('.artist-content');
        content.style.display = content.style.display === 'block' ? 'none' : 'block';
    });
});

function playArtist(button) {
    const artist = button.closest('.artist');
    const audioSource = artist.dataset.audio;

    if (audio.src !== audioSource) {
        audio.src = audioSource;
    }

    audio.play();
    trackLabel.textContent = audioSource.split('/').pop();
    playPauseIcon.src = 'icons/solid/pause-circle.svg';
    player.classList.add('visible');
}

playPauseButton.addEventListener('click', () => {
    if (!audio.src) return;

    const isPaused = audio.paused;
    isPaused ? audio.play() : audio.pause();
    playPauseIcon.src = `icons/solid/${isPaused ? 'pause' : 'play'}-circle.svg`;
});

audio.addEventListener('loadedmetadata', () => {
    progressBar.max = audio.duration;
    durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('timeupdate', () => {
    progressBar.value = audio.currentTime;
    currentTimeEl.textContent = formatTime(audio.currentTime);
});

audio.addEventListener('ended', () => {
    playPauseIcon.src = 'icons/solid/play-circle.svg';
});

progressBar.addEventListener('input', () => {
    audio.currentTime = progressBar.value;
});

volumeControl.addEventListener('input', () => {
    audio.volume = volumeControl.value;
});

searchInput.addEventListener('input', () => {
    const filter = searchInput.value.toLowerCase();

    document.querySelectorAll('.artist').forEach(artist => {
        artist.style.display = artist.textContent.toLowerCase().includes(filter)
            ? ''
            : 'none';
    });
});

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
}
