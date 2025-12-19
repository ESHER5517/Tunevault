// Settings management with localStorage persistence
const $ = id => document.getElementById(id);

// Settings elements
const volumeSetting = $('volume-setting');
const volumeValue = $('volume-value');
const autoplaySetting = $('autoplay-setting');
const contrastSetting = $('contrast-setting');
const contrastValue = $('contrast-value');
const scalingSetting = $('scaling-setting');
const scalingValue = $('scaling-value');
const fontSetting = $('font-setting');

// Font mapping
const fontMap = {
    'default': "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    'courier': "'Courier New', monospace",
    'arial': "Arial, Helvetica, sans-serif",
    'georgia': "Georgia, 'Times New Roman', serif",
    'verdana': "Verdana, Geneva, sans-serif",
    'comic': "'Comic Sans MS', cursive"
};

// Load settings from localStorage
function loadSettings() {
    const savedVolume = localStorage.getItem('defaultVolume');
    const savedAutoplay = localStorage.getItem('autoplay');
    const savedContrast = localStorage.getItem('contrast');
    const savedScaling = localStorage.getItem('scaling');
    const savedFont = localStorage.getItem('fontFamily');

    if (savedVolume !== null && volumeSetting) {
        volumeSetting.value = savedVolume;
        volumeValue.textContent = savedVolume + '%';
    }

    if (savedAutoplay !== null && autoplaySetting) {
        autoplaySetting.checked = savedAutoplay === 'true';
    }

    if (savedContrast !== null && contrastSetting) {
        contrastSetting.value = savedContrast;
        contrastValue.textContent = savedContrast + '%';
        applyContrast(savedContrast);
    }

    if (savedScaling !== null && scalingSetting) {
        scalingSetting.value = savedScaling;
        scalingValue.textContent = savedScaling + '%';
        applyScaling(savedScaling);
    }

    if (savedFont !== null && fontSetting) {
        fontSetting.value = savedFont;
        applyFont(savedFont);
    }
}

// Apply contrast adjustment
function applyContrast(value) {
    const contrastAmount = 1 + (value / 100);
    const brightnessAmount = 1 + (value / 200); // Subtle brightness boost
    document.body.style.filter = `contrast(${contrastAmount}) brightness(${brightnessAmount})`;
}

// Apply scaling adjustment
function applyScaling(value) {
    const scale = value / 100;
    document.documentElement.style.fontSize = (16 * scale) + 'px';
}

// Apply font family
function applyFont(fontKey) {
    const fontFamily = fontMap[fontKey] || fontMap['default'];
    document.body.style.fontFamily = fontFamily;
}

// Volume setting
if (volumeSetting) {
    volumeSetting.addEventListener('input', (e) => {
        const value = e.target.value;
        volumeValue.textContent = value + '%';
        localStorage.setItem('defaultVolume', value);
        updateRange(volumeSetting);
    });
    updateRange(volumeSetting);
}

// Autoplay setting
if (autoplaySetting) {
    autoplaySetting.addEventListener('change', (e) => {
        localStorage.setItem('autoplay', e.target.checked);
    });
}

// Contrast setting
if (contrastSetting) {
    contrastSetting.addEventListener('input', (e) => {
        const value = e.target.value;
        contrastValue.textContent = value + '%';
        applyContrast(value);
        localStorage.setItem('contrast', value);
        updateRange(contrastSetting);
    });
    updateRange(contrastSetting);
}

// Scaling setting
if (scalingSetting) {
    scalingSetting.addEventListener('input', (e) => {
        const value = e.target.value;
        scalingValue.textContent = value + '%';
        applyScaling(value);
        localStorage.setItem('scaling', value);
        updateRange(scalingSetting);
    });
    updateRange(scalingSetting);
}

// Font setting
if (fontSetting) {
    fontSetting.addEventListener('change', (e) => {
        const value = e.target.value;
        applyFont(value);
        localStorage.setItem('fontFamily', value);
    });
}

// Update range slider visual progress
function updateRange(range) {
    const min = range.min || 0;
    const max = range.max || 1;
    const value = range.value;
    const percent = ((value - min) / (max - min)) * 100 || 0;
    range.style.setProperty('--progress', `${percent}%`);
}

// Load saved settings on page load
loadSettings();
