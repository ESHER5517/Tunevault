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
const searchStatus = $('search-status');
const player = document.querySelector('.player');

// Store last focused element for modal focus management
let lastFocusedElement = null;

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
const modalTitle = document.getElementById('modalTitle');
const modalDecade = document.getElementById('modalDecade');
const closeModal = document.querySelector('.modal-close');
const modalWrapper = document.querySelector('.modal-content-wrapper');

// Get all focusable elements in modal
const getFocusableElements = () => {
    return modalWrapper.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
};

document.querySelectorAll('.artist-img-modal').forEach(img => {
    const openModalHandler = () => {
        // Store last focused element
        lastFocusedElement = document.activeElement;

        modal.classList.add('show');
        modalImg.src = img.src;
        modalImg.alt = img.alt;

        // Get artist information from the parent artist card
        const artistCard = img.closest('.artist');
        const artistHeader = artistCard ? artistCard.querySelector('.artist-header span:first-child') : null;
        const artistMeta = artistCard ? artistCard.querySelector('.artist-meta') : null;
        const decadeCard = artistCard ? artistCard.closest('.decade') : null;
        const decadeHeader = decadeCard ? decadeCard.querySelector('.decade-header span:first-child') : null;

        // Populate modal with artist data
        if (modalTitle && artistHeader) {
            modalTitle.textContent = artistHeader.textContent;
        }

        if (modalDecade && decadeHeader) {
            modalDecade.textContent = decadeHeader.textContent;
        }

        if (modalCaption && artistMeta) {
            modalCaption.textContent = artistMeta.textContent.trim();
        } else if (modalCaption) {
            modalCaption.textContent = img.alt;
        }

        document.body.style.overflow = 'hidden'; // Prevent background scroll

        // Focus close button
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

    // Return focus to last focused element
    if (lastFocusedElement) {
        lastFocusedElement.focus();
        lastFocusedElement = null;
    }
};

closeModal.addEventListener('click', closeModalHandler);

// Close on outside click
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModalHandler();
    }
});

// Focus trap for modal
modal.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('show')) return;

    // Close on Escape key
    if (e.key === 'Escape') {
        closeModalHandler();
        return;
    }

    // Trap Tab key
    if (e.key === 'Tab') {
        const focusableElements = Array.from(getFocusableElements());
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Shift + Tab
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        }
        // Tab
        else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
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
    let visibleArtistsCount = 0;
    let visibleDecadesCount = 0;

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
            if (shouldShow) {
                hasVisibleArtist = true;
                visibleArtistsCount++;
            }
        });

        // Show decade if it contains matching artists or matches itself
        const shouldShowDecade = (hasVisibleArtist || filter === '');
        decade.style.display = shouldShowDecade ? '' : 'none';
        if (shouldShowDecade) visibleDecadesCount++;

        // Auto-expand decade if searching and it has matches
        if (filter !== '' && hasVisibleArtist) {
            decade.classList.add('open');
            const header = decade.querySelector('.decade-header');
            if (header) header.setAttribute('aria-expanded', 'true');
        }
    });

    // Announce search results to screen readers
    if (searchStatus) {
        if (filter === '') {
            searchStatus.textContent = '';
        } else if (visibleArtistsCount === 0) {
            searchStatus.textContent = 'No artists found matching your search.';
        } else {
            searchStatus.textContent = `Found ${visibleArtistsCount} ${visibleArtistsCount === 1 ? 'artist' : 'artists'} in ${visibleDecadesCount} ${visibleDecadesCount === 1 ? 'decade' : 'decades'}.`;
        }
    }
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
