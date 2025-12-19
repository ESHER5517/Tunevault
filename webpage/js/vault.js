const $ = id => document.getElementById(id); // saw it on stackoverflow, lwk genius.

const audio = $('audio');
const playPauseButton = $('playPauseBtn');
const playPauseIcon = $('playPauseIcon');
const trackLabel = $('trackLabel');
const currentTimeEl = $('currentTime');
const durationEl = $('duration');
const progressBar = $('progress');
const volumeBar = $('volume');
const searchInput = $('searchInput');
const player = document.querySelector('.player');

document.querySelectorAll('.artist-header').forEach(header => {
    header.addEventListener('click', () => {
        const artist = header.closest('.artist');
        artist.classList.toggle('open');
    });
});

function playArtist(button, audioSource) {
    if (!audioSource) return;

    if (audio.src !== audioSource) {
        audio.src = audioSource;
    }

    audio.play();

    trackLabel.textContent = button.textContent.trim();
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
    updateRange(progressBar);
});

audio.addEventListener('timeupdate', () => {
    progressBar.value = audio.currentTime;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    updateRange(progressBar);
});

progressBar.addEventListener('input', () => {
    audio.currentTime = progressBar.value;
    updateRange(progressBar);
});

volumeBar.addEventListener('input', () => {
    audio.volume = volumeBar.value;
    updateRange(volumeBar);
});

audio.addEventListener('ended', () => {
    playPauseIcon.src = 'icons/solid/play-circle.svg';
});

searchInput.addEventListener('input', () => {
    const filter = searchInput.value.toLowerCase();
    document.querySelectorAll('.artist').forEach(artist => {
        artist.style.display = artist.textContent.toLowerCase().includes(filter)
            ? ''
            : 'none';
    });
});

function updateRange(range) {
    const min = range.min || 0;
    const max = range.max || 1;
    const value = range.value;
    const percent = ((value - min) / (max - min)) * 100 || 0;
    range.style.setProperty('--progress', `${percent}%`);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
}

updateRange(progressBar);
updateRange(volumeBar);
