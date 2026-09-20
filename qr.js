const videoUrl = new URLSearchParams(window.location.search).get('video');
const video = document.getElementById('recordedVideo');
const message = document.getElementById('videoMessage');
const download = document.getElementById('downloadVideo');
if (!videoUrl || !/^https:\/\//.test(videoUrl)) {
  message.textContent = 'This video link is invalid or has expired.';
} else {
  video.src = videoUrl; video.load(); message.textContent = 'Your 360 video is ready to watch.';
  download.href = videoUrl; download.style.display = 'inline-block';
}
