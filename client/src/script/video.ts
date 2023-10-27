import $ from "jquery";

const video = document.getElementById("video") as HTMLVideoElement;

let isPlaying: boolean = false;
let isPIP: boolean = false;
let isFullScreen: boolean = false;
let isMuted: boolean = false;

// $(".total-time").html(video.duration.toString());

$(".play-speed").on("click", () => $(".speed-opt-holder").toggle());

// play & pause video
function play() {
  if (isPlaying) isPlaying = false;
  else isPlaying = true;

  if (isPlaying) {
    $("#play").attr("class", "fa-solid fa-pause");
    video.play();
  } else {
    $("#play").attr("class", "fa-solid fa-play");
    video.pause();
  }
}

$("#play").on("click", play);

// forward
function forward() {
  if (video.currentTime < video.duration - 10) {
    video.currentTime += 10;
  }
}

$(".forward").on("click", forward);

// backward
function backward() {
  if (video.currentTime < 10) video.currentTime = 0;
  else video.currentTime -= 10;
}

$(".backward").on("click", backward);

// PIP mode
function pip() {
  if (isPIP) isPIP = false;
  isPIP = true;

  if (isPIP) video.requestPictureInPicture();
  else video.disablePictureInPicture;
}

$(".pip").on("click", pip);

// playback speed
function changePlaybackSpeed(rate: number) {
  video.playbackRate = rate;
}

const speedOptions = document.getElementsByClassName("speed-options") as any;

for (let i of speedOptions) {
  i.onclick = () => {
    changePlaybackSpeed(Number(i.innerText));
    $(".speed-opt-holder").hide();
  };
}

// set volume
function setVolume() {
  video.volume = Number($(".volume").val()) / 100 || 0.3;
}

$(".volume").on("change", setVolume);

// mute
const muteVideo = () => {
  if (isMuted) isMuted = false;
  else isMuted = true;

  if (isMuted) {
    $("#voice").attr("class", "fa-solid fa-volume-xmark");
    video.volume = 0;
    $(".volume").val(0);
  } else {
    $("#voice").attr("class", "fa-solid fa-volume-high");
    video.volume = 0.3;
  }
};

$("#voice").on("click", muteVideo);

// full screen
function fullScreen() {
  if (isFullScreen) isFullScreen = false;
  else isFullScreen = true;

  if (isFullScreen) video.requestFullscreen();
}

$(".full-screen").on("click", fullScreen);

// set current time
video.addEventListener("timeupdate", (e: any) => {
  let currentTime = e.target?.currentTime;
  let totalTime = e.target?.duration;
  let progress = (currentTime / totalTime) * 100;

  $("#range").val(progress);

  // current time
  let currentMin = Math.floor(currentTime / 60);
  let currentSec: string | number = Math.floor(currentTime % 60);
  if (currentSec < 10) currentSec = `0${currentSec}`;
  $(".current-time").html(String(`${currentMin}:${currentSec}`));

  // total time
  let totalMin = Math.floor(totalTime / 60);
  let totalSec: string | number = Math.floor(totalTime % 60);
  if (totalSec < 10) totalSec = `0${totalSec}`;
  $(".total-time").html(String(`${totalMin}:${totalSec}`));
});

// changing video time
$("#range").on("change", function (): void {
  video.currentTime = Number((Number($(this).val()) * video.duration) / 100);
});

$("#range").on("click", function (): void {
  video.currentTime = Number((Number($(this).val()) * video.duration) / 100);
});
