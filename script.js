import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js';
import QRCode from 'https://cdn.jsdelivr.net/npm/qrcode@1.5.4/+esm';

const RECORDING_LENGTH_MS = 25_000;
const storage = getStorage(initializeApp({
  apiKey: 'AIzaSyAdBRst13901_XRbO_fgE68h1j2zSlNdfI', authDomain: 'vid-b4fec.firebaseapp.com', projectId: 'vid-b4fec',
  storageBucket: 'vid-b4fec.firebasestorage.app', messagingSenderId: '881131523380', appId: '1:881131523380:web:3282f6712f38ac24c9a961'
}));
const btn = document.getElementById('openCamera');
const languageSelect = document.getElementById('languageSelect');
const preview = document.getElementById('cameraPreview');
const status = document.getElementById('recordingStatus');
const qrResult = document.getElementById('qrResult');
const qrCode = document.getElementById('qrCode');
const videoLink = document.getElementById('videoLink');
const recordAnother = document.getElementById('recordAnother');
const installApp = document.getElementById('installApp');

const LANGUAGES = { en: { dir: 'ltr' }, af: { dir: 'ltr' }, st: { dir: 'ltr' } };
const TRANSLATIONS = {
  en: { appTitle: '360 Video App', languageLabel: 'Language', instructionsHeading: 'Follow the instructions below for recording your 360-degree video:', step1: '<b>1. </b>Click the red circle button.', step2: '<b>2. </b>Allow access to your camera when prompted.', step3: '<b>3. </b>Position yourself in the environment you want to record.', step4: '<b>4. </b>Press the record button to start recording.', step5: '<b>5. </b>The video will record for 25 seconds.', step6: '<b>6. </b>After recording, the app will display a QR code.', step7: '<b>7. </b>Scan the QR code with your phone to view the video.', step8: '<b>8. </b>Download the video.', note: 'Note: the QR code for this video will only be shown once and will never be available again. If you did not download the video you will have to repeat the recording process.', takeVideo: 'Click here to take your video', openCamera: 'Record video', videoReady: 'Your video is ready', scanQr: 'Scan this QR code to watch and download your video.', openVideo: 'Open video', recordAnother: 'Record another video', recording: 'Recording… {seconds} seconds left', uploading: 'Uploading video… {percent}%', cameraError: 'Could not access the camera. Please allow camera access and try again.', uploadError: 'Your video was recorded but could not be uploaded. Please try again.' },
  af: { appTitle: '360 Video-toep', languageLabel: 'Taal', instructionsHeading: 'Volg die instruksies hieronder om jou 360-grade-video op te neem:', step1: '<b>1. </b>Kliek op die rooi sirkelknoppie.', step2: '<b>2. </b>Gee toegang tot jou kamera wanneer gevra.', step3: '<b>3. </b>Plaas jouself in die omgewing wat jy wil opneem.', step4: '<b>4. </b>Druk die opnameknoppie om te begin opneem.', step5: '<b>5. </b>Die video sal vir 25 sekondes opneem.', step6: '<b>6. </b>Ná opname sal die toepassing ’n QR-kode wys.', step7: '<b>7. </b>Skandeer die QR-kode met jou foon om die video te kyk.', step8: '<b>8. </b>Laai die video af.', note: 'Let wel: die QR-kode vir hierdie video sal net een keer gewys word en sal nooit weer beskikbaar wees nie. As jy nie die video afgelaai het nie, sal jy die opnameproses moet herhaal.', takeVideo: 'Kliek hier om jou video te neem', openCamera: 'Neem video op', videoReady: 'Jou video is gereed', scanQr: 'Skandeer hierdie QR-kode om jou video te kyk en af te laai.', openVideo: 'Maak video oop', recordAnother: 'Neem nog ’n video op', recording: 'Neem op… {seconds} sekondes oor', uploading: 'Laai video op… {percent}%', cameraError: 'Kon nie toegang tot die kamera kry nie. Gee asseblief kameratoegang en probeer weer.', uploadError: 'Jou video is opgeneem, maar kon nie opgelaai word nie. Probeer asseblief weer.' },
  st: { appTitle: 'App ya Video ya 360', languageLabel: 'Puo', instructionsHeading: 'Latela ditaelo tse ka tlase ho rekota video ya hao ya 360-degree:', step1: '<b>1. </b>Tobetsa konopo e kgubedu e sedikadikwe.', step2: '<b>2. </b>Dumella ho sebediswa ha khamera ya hao ha o kopuwa.', step3: '<b>3. </b>Ipehe sebakeng seo o batlang ho se rekota.', step4: '<b>4. </b>Tobetsa konopo ya ho rekota ho qala ho rekota.', step5: '<b>5. </b>Video e tla rekota metsotsoana e 25.', step6: '<b>6. </b>Kamora ho rekota, app e tla bontsha khoutu ya QR.', step7: '<b>7. </b>Sekena khoutu ya QR ka fono ya hao ho shebella video.', step8: '<b>8. </b>Jarolla video.', note: 'Tlhokomeliso: khoutu ya QR ya video ena e tla bontshwa hang feela mme e ke ke ya fumaneha hape. Haeba o sa jarolla video, o tla hloka ho pheta mokgwa wa ho rekota.', takeVideo: 'Tobetsa mona ho nka video ya hao', openCamera: 'Rekota video', videoReady: 'Video ya hao e lokile', scanQr: 'Sekena khoutu ena ya QR ho shebella le ho jarolla video ya hao.', openVideo: 'Bula video', recordAnother: 'Rekota video e nngwe', recording: 'E a rekota… metsotswana e {seconds} e setse', uploading: 'E kenya video… {percent}%', cameraError: 'Ha rea kgona ho fihlella khamera. Dumella khamera mme o leke hape.', uploadError: 'Video ya hao e rekotilwe empa ha e a ka ya kenngwa. Leka hape.' }
};
let activeStream, recordingTimer, countdownTimer;
let installPrompt;
const text = (key, values = {}) => Object.entries(values).reduce((value, [name, replacement]) => value.replace(`{${name}}`, replacement), TRANSLATIONS[languageSelect.value || 'en'][key] || '');

function setLanguage(language) {
  const selected = LANGUAGES[language] ? language : 'en';
  document.documentElement.lang = selected; document.documentElement.dir = LANGUAGES[selected].dir; document.title = TRANSLATIONS[selected].appTitle;
  document.querySelectorAll('[data-i18n]').forEach((element) => { element.innerHTML = TRANSLATIONS[selected][element.dataset.i18n]; });
  languageSelect.value = selected; localStorage.setItem('language', selected); localStorage.setItem('languageSelected', selected);
}
function stopCamera() { if (activeStream) activeStream.getTracks().forEach((track) => track.stop()); activeStream = undefined; preview.srcObject = null; preview.hidden = true; }
function mimeType() { return ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4'].find((type) => MediaRecorder.isTypeSupported(type)); }
async function uploadVideo(blob) {
  const extension = blob.type.includes('mp4') ? 'mp4' : 'webm'; const videoRef = ref(storage, `videos/${crypto.randomUUID()}.${extension}`);
  const task = uploadBytesResumable(videoRef, blob, { contentType: blob.type || `video/${extension}` });
  task.on('state_changed', (snapshot) => { status.textContent = text('uploading', { percent: Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100) }); });
  await task; return getDownloadURL(videoRef);
}
async function showQr(downloadUrl) {
  const viewerUrl = new URL('QR.html', window.location.href); viewerUrl.searchParams.set('video', downloadUrl); viewerUrl.searchParams.set('lang', languageSelect.value);
  qrCode.replaceChildren(); const canvas = document.createElement('canvas'); qrCode.append(canvas); await QRCode.toCanvas(canvas, viewerUrl.toString(), { width: 280, margin: 1, errorCorrectionLevel: 'M' });
  videoLink.href = viewerUrl; qrResult.hidden = false; status.textContent = '';
}
async function startRecording() {
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) { status.textContent = text('cameraError'); return; }
  btn.disabled = true; qrResult.hidden = true;
  try {
    activeStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: true }); preview.srcObject = activeStream; preview.hidden = false;
    const recorder = new MediaRecorder(activeStream, mimeType() ? { mimeType: mimeType() } : undefined); const chunks = []; const startedAt = Date.now();
    recorder.addEventListener('dataavailable', (event) => { if (event.data.size) chunks.push(event.data); });
    recorder.addEventListener('stop', async () => {
      clearTimeout(recordingTimer); clearInterval(countdownTimer); stopCamera(); status.textContent = text('uploading', { percent: 0 });
      try { await showQr(await uploadVideo(new Blob(chunks, { type: recorder.mimeType || 'video/webm' }))); } catch (error) { console.error(error); status.textContent = text('uploadError'); } finally { btn.disabled = false; }
    });
    recorder.start(1000);
    countdownTimer = setInterval(() => { status.textContent = text('recording', { seconds: Math.max(0, Math.ceil((RECORDING_LENGTH_MS - (Date.now() - startedAt)) / 1000)) }); }, 250);
    recordingTimer = setTimeout(() => recorder.stop(), RECORDING_LENGTH_MS);
  } catch (error) { console.error(error); stopCamera(); status.textContent = text('cameraError'); btn.disabled = false; }
}
setLanguage(localStorage.getItem('language') || 'en');
languageSelect.addEventListener('change', (event) => setLanguage(event.target.value)); btn.addEventListener('click', startRecording); recordAnother.addEventListener('click', startRecording);

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault(); installPrompt = event; installApp.hidden = false;
});
installApp.addEventListener('click', async () => {
  if (!installPrompt) return;
  installPrompt.prompt(); await installPrompt.userChoice; installPrompt = undefined; installApp.hidden = true;
});
window.addEventListener('appinstalled', () => { installPrompt = undefined; installApp.hidden = true; });
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js'));
