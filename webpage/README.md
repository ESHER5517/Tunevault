# Tunevault
# README

# Content that was NOT sourced or created by me:

# Images of Justin Bieber
# Images of Roblox Hater 9000 (Yeat, Noah Olivier Smith)
# Iconography (sourced via fontawesome.com)
# Any songs used (raining-tacos.mp3, roblox-hate.mp3, i-feel-funny.mp3)
# Specific lines of code were sourced from the following resources:
# https://www.w3schools.com/
# https://developer.mozilla.org/en-US/docs/Web/CSS
# https://stackoverflow.com/
# These lines have been modified to fit the scope of the project
# Each line of code that has been modified to fit the scope of the project, has been commented on within the source code of the Tunevault project
# Any additional lines of code that are unmarked / uncommented, are original to this project and made by myself
# Paint.net (tool) was used to invert favicon.svg from black to white, to stand out more on dark mode
# Favicon.svg was originally sourced via fontawesome.com, who offer their resources free of charge non-commercially under specific license, which I have been sure to adhere to
# Images of Justin Bieber and Roblox Hater 9000 (Yeat, Noah Olivier Smith) were sourced from the following resources:
# Pinterest, Google Images
# Any songs used (raining-tacos.mp3, roblox-hate.mp3, i-feel-funny.mp3) were sourced from the following resources:
# Raining Tacos (https://devforum.roblox.com/)
# Roblox Hate (https://devforum.roblox.com/)
# I Feel Funny (https://www.youtube.com/watch?v=EUcvdGfGEj0)

# Development Issues & Resolutions

# Modal wasn't displaying properly - images and description were stacked vertically
# Original: <span class="modal-close"></span><img class="modal-content" id="modalImage"><div id="modalCaption"></div>
# Fixed: <div class="modal-content-wrapper"><div class="modal-image-container"><img class="modal-content"></div><div class="modal-info"><h2 class="modal-title"></h2><div id="modalCaption"></div></div></div>

# Search bar only filtered artist names, not decade categories like 2010s
# Original: const artistMatches = artistName.includes(filter); const shouldShow = artistMatches || filter === '';
# Fixed: const decadeMatches = decadeName.includes(filter); const shouldShow = artistMatches || decadeMatches || filter === '';

# CSS had missing colon after opacity property causing lint error
# Original: .artist.open .artist-content { opacity 1; }
# Fixed: .artist.open .artist-content { opacity: 1; }

# Settings only applied to contact.html, not entire site
# Original: settings.js only in contact.html
# Fixed: Added <script src="js/settings.js" defer></script> to index.html and vault.html

# Focus indicators weren't visible enough for keyboard navigation
# Original: No specific focus styles beyond browser defaults
# Fixed: a:focus-visible { outline: 2px solid var(--retro-magenta); box-shadow: 0 0 20px rgba(255, 0, 255, 0.6); }

# Skip navigation links were missing from all pages
# Original: No skip links
# Fixed: <a href="#main-content" class="skip-link">Skip to main content</a> with CSS: .skip-link { position: absolute; top: -100px; } .skip-link:focus { top: 0; }

# Modal didn't trap focus properly for keyboard users
# Original: No focus trap logic
# Fixed: modal.addEventListener('keydown', (e) => { if (e.key === 'Tab') { /* cycle through focusable elements */ } })