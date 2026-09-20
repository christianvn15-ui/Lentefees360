const btn = document.getElementById('openCamera');
const input = document.getElementById('environment');
const languageSelect = document.getElementById('languageSelect');

const APP_CONFIG = {
  LANGUAGES: {
    en: { name: 'English', native: 'English', flag: '🇬🇧', dir: 'ltr' },
    af: { name: 'Afrikaans', native: 'Afrikaans', flag: '🇿🇦', dir: 'ltr' },
    st: { name: 'Sotho', native: 'Sesotho', flag: '🇱🇸', dir: 'ltr' }
  },
  STORAGE_KEYS: { LANGUAGE: 'language', LANGUAGE_SELECTED: 'languageSelected' }
};

const TRANSLATIONS = {
  en: {
    appTitle: '360 Video App', languageLabel: 'Language', instructionsHeading: 'Follow the instructions below for recording your 360-degree video:',
    step1: '<b>1. </b>Click the red circle button.', step2: '<b>2. </b>Allow access to your camera when prompted.',
    step3: '<b>3. </b>Position yourself in the environment you want to record.', step4: '<b>4. </b>Press the record button to start recording.',
    step5: '<b>5. </b>The video will record for 20 seconds.', step6: '<b>6. </b>After recording, the app will display a QR code.',
    step7: '<b>7. </b>Scan the QR code with your phone to view the video.', step8: '<b>8. </b>Download the video.',
    note: 'Note: the QR code for this video will only be shown once and will never be available again. If you did not download the video you will have to repeat the recording process.',
    takeVideo: 'Click here to take your video', openCamera: 'Open Camera'
  },
  af: {
    appTitle: '360 Video-toep', languageLabel: 'Taal', instructionsHeading: 'Volg die instruksies hieronder om jou 360-grade-video op te neem:',
    step1: '<b>1. </b>Kliek op die rooi sirkelknoppie.', step2: '<b>2. </b>Gee toegang tot jou kamera wanneer gevra.',
    step3: '<b>3. </b>Plaas jouself in die omgewing wat jy wil opneem.', step4: '<b>4. </b>Druk die opnameknoppie om te begin opneem.',
    step5: '<b>5. </b>Die video sal vir 20 sekondes opneem.', step6: '<b>6. </b>Ná opname sal die toepassing ’n QR-kode wys.',
    step7: '<b>7. </b>Skandeer die QR-kode met jou foon om die video te kyk.', step8: '<b>8. </b>Laai die video af.',
    note: 'Let wel: die QR-kode vir hierdie video sal net een keer gewys word en sal nooit weer beskikbaar wees nie. As jy nie die video afgelaai het nie, sal jy die opnameproses moet herhaal.',
    takeVideo: 'Kliek hier om jou video te neem', openCamera: 'Maak kamera oop'
  },
  st: {
    appTitle: 'App ya Video ya 360', languageLabel: 'Puo', instructionsHeading: 'Latela ditaelo tse ka tlase ho rekota video ya hao ya 360-degree:',
    step1: '<b>1. </b>Tobetsa konopo e kgubedu e sedikadikwe.', step2: '<b>2. </b>Dumella ho sebediswa ha khamera ya hao ha o kopuwa.',
    step3: '<b>3. </b>Ipehe sebakeng seo o batlang ho se rekota.', step4: '<b>4. </b>Tobetsa konopo ya ho rekota ho qala ho rekota.',
    step5: '<b>5. </b>Video e tla rekota metsotsoana e 20.', step6: '<b>6. </b>Kamora ho rekota, app e tla bontsha khoutu ya QR.',
    step7: '<b>7. </b>Sekena khoutu ya QR ka fono ya hao ho shebella video.', step8: '<b>8. </b>Jarolla video.',
    note: 'Tlhokomeliso: khoutu ya QR ya video ena e tla bontshwa hang feela mme e ke ke ya fumaneha hape. Haeba o sa jarolla video, o tla hloka ho pheta mokgwa wa ho rekota.',
    takeVideo: 'Tobetsa mona ho nka video ya hao', openCamera: 'Bula khamera'
  }
};

function setLanguage(language) {
  const selectedLanguage = APP_CONFIG.LANGUAGES[language] ? language : 'en';
  const translations = TRANSLATIONS[selectedLanguage];

  document.documentElement.lang = selectedLanguage;
  document.documentElement.dir = APP_CONFIG.LANGUAGES[selectedLanguage].dir;
  document.title = translations.appTitle;
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.innerHTML = translations[element.dataset.i18n];
  });
  languageSelect.value = selectedLanguage;
  localStorage.setItem(APP_CONFIG.STORAGE_KEYS.LANGUAGE, selectedLanguage);
  localStorage.setItem(APP_CONFIG.STORAGE_KEYS.LANGUAGE_SELECTED, selectedLanguage);
}

const savedLanguage = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.LANGUAGE);
setLanguage(savedLanguage || 'en');

languageSelect.addEventListener('change', (event) => setLanguage(event.target.value));

btn.addEventListener('click', () => {
  input.click();
});
