const $ = id => document.getElementById(id);

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

// Decade accordion functionality
document.querySelectorAll('.decade-header').forEach(header => {
    header.addEventListener('click', () => {
        const decade = header.closest('.decade');
        const isOpen = decade.classList.contains('open');

        decade.classList.toggle('open');
        header.setAttribute('aria-expanded', !isOpen);
    });

    header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            header.click();
        }
    });
});

// Artist accordion functionality with accessibility
document.querySelectorAll('.artist-header').forEach(header => {
    header.addEventListener('click', () => {
        const artist = header.closest('.artist');
        const isOpen = artist.classList.contains('open');

        // Toggle open state
        artist.classList.toggle('open');

        // Update ARIA attribute
        header.setAttribute('aria-expanded', !isOpen);
    });

    // Keyboard support
    header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            header.click();
        }
    });
});

// Modal image functionality
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');
const closeModal = document.querySelector('.modal-close');

document.querySelectorAll('.artist-img-modal').forEach(img => {
    const openModalHandler = () => {
        modal.classList.add('show');
        modalImg.src = img.src;
        modalCaption.textContent = img.alt;
        document.body.style.overflow = 'hidden'; // Prevent background scroll

        // Focus trap - focus close button
        closeModal.focus();
    };

    img.addEventListener('click', openModalHandler);

    // Keyboard support for images
    img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModalHandler();
        }
    });
});

// Close modal
const closeModalHandler = () => {
    modal.classList.remove('show');
    document.body.style.overflow = ''; // Restore scroll
};

closeModal.addEventListener('click', closeModalHandler);

// Close on outside click
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModalHandler();
    }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
        closeModalHandler();
    }
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

    document.querySelectorAll('.decade').forEach(decade => {
        // Get decade name from the first span in decade-header
        const decadeHeader = decade.querySelector('.decade-header span:first-child');
        const decadeName = decadeHeader ? decadeHeader.textContent.toLowerCase() : '';
        const decadeMatches = decadeName.includes(filter);

        let hasVisibleArtist = false;

        decade.querySelectorAll('.artist').forEach(artist => {
            // Get artist name from the first span in artist-header
            const artistHeader = artist.querySelector('.artist-header span:first-child');
            const artistName = artistHeader ? artistHeader.textContent.toLowerCase() : '';
            const artistMatches = artistName.includes(filter);

            // Show artist if it matches OR if the decade category matches
            const shouldShow = artistMatches || decadeMatches || filter === '';
            artist.style.display = shouldShow ? '' : 'none';
            if (shouldShow) hasVisibleArtist = true;
        });

        // Show decade if it contains matching artists or matches itself
        decade.style.display = (hasVisibleArtist || filter === '') ? '' : 'none';

        // Auto-expand decade if searching and it has matches
        if (filter !== '' && hasVisibleArtist) {
            decade.classList.add('open');
            const header = decade.querySelector('.decade-header');
            if (header) header.setAttribute('aria-expanded', 'true');
        }
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
