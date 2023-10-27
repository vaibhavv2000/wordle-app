import $ from "jquery";

let songs = [
  {
    id: 1,
    path: "http://localhost:3000/audio/overtaken.mp3",
    name: "Overtaken",
    from: "One piece",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNWdIOt4jn_V3QyQlXLaPI5lsRp5jBKv4G6S3cJU7Fpg&usqp=CAU&ec=48600113",
  },
  {
    id: 2,
    path: "http://localhost:3000/audio/Giorno.mp3",
    name: "Giorno",
    from: "JOJO",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_7LP3cFL4Jl5P6MavqKlywHmSVpKVCGBR70ZQas_VPg&usqp=CAU&ec=48600113",
  },
];

// const audio = document.getElementById("audio") as HTMLAudioElement;
let audio = new Audio() as HTMLAudioElement;

let currentSongIndex: number = 0;
let isLooped: boolean = false;
let isShuffled: boolean = false;

let isPlaying: boolean = false;

function songsList(): void {
  for (let i in songs) {
    const holder = document.createElement("div") as HTMLDivElement;
    const left = document.createElement("div") as HTMLDivElement;
    const img = document.createElement("img") as HTMLImageElement;
    const desc = document.createElement("div") as HTMLDivElement;
    const title = document.createElement("h5") as HTMLHeadingElement;
    const from = document.createElement("span") as HTMLSpanElement;

    const right = document.createElement("div") as HTMLDivElement;
    const player = document.createElement("i") as HTMLElement;
    const remove = document.createElement("i") as HTMLElement;

    title.innerText = songs[i].name;
    from.innerHTML = songs[i].from;
    img.src = songs[i].image;

    holder.className = "song-holder";
    left.className = "left-holder";
    img.className = `current-song-img`;
    img.id = String(songs[i].id);
    desc.className = "song-desc";
    title.className = "song-title";
    from.className = "song-from";

    right.className = "right-holder";
    player.className = "fa-solid fa-play";
    remove.className = "fa-solid fa-square-minus";

    player.onclick = function () {
      currentSongIndex = Number(i);
      currentSong();
      isPlaying = true;
      // play(songs[currentSongIndex].path);
      $("#play").attr("class", "fa-solid fa-pause");
      audio.src = songs[currentSongIndex].path;
      audio.play();
      imgRotate();
    };

    remove.onclick = function () {
      songs = songs.filter((s) => s.id !== songs[i].id);
      holder.remove();
    };

    desc.append(title, from);
    left.append(img, desc);
    right.append(player, remove);
    holder.append(left, right);
    $(".all-songs").append(holder);
  }
}

songsList();

const allSongs = document.getElementsByClassName("current-song-img") as any;

function imgRotate() {
  for (let i of allSongs) {
    i.classList.remove("rotate-thumbnail");
  }

  for (let i of allSongs) {
    if (Number(i.id) === currentSongIndex + 1) {
      i.classList.add("rotate-thumbnail");
    }
  }
}

function play(src?: string) {
  if (src) audio.src = src;

  if (isPlaying) isPlaying = false;
  else isPlaying = true;

  if (isPlaying) {
    $("#play").attr("class", "fa-solid fa-pause");
    audio.play();
  } else {
    $("#play").attr("class", "fa-solid fa-play");
    audio.pause();
  }

  imgRotate();
}

function currentSong() {
  const song = songs[currentSongIndex];

  $(".current-music-img").attr("src", song.image);
  $(".music-name").html(song.name);
  $(".music-from").html(song.from);

  audio.src = song.path;

  $(".current-time").html("0:00");
  $(".total-time").html(`1:58`);
}

currentSong();

// adding event listeners
$("#play").on("click", () => play());
$(".shuffle").on("click", shuffleSongs);
$(".backward").on("click", previousSong);
$(".forward").on("click", nextSong);
$(".loop").on("click", loopSong);

// next song
function nextSong() {
  if (currentSongIndex < songs.length - 1) {
    if (isShuffled) {
      currentSongIndex = Math.floor(Math.random() * songs.length);
    } else currentSongIndex++;
    currentSong();

    isPlaying = true;
    // play(songs[currentSongIndex].path);
    $("#play").attr("class", "fa-solid fa-pause");
    audio.src = songs[currentSongIndex].path;
    audio.play();

    imgRotate();
  }
}

// previous song
function previousSong() {
  if (currentSongIndex > 0) {
    currentSongIndex--;
    currentSong();
    isPlaying = true;
    // play(songs[currentSongIndex].path);
    $("#play").attr("class", "fa-solid fa-pause");
    audio.src = songs[currentSongIndex].path;
    audio.play();

    imgRotate();
  }
}

// loop songs
function loopSong() {
  if (isLooped) isLooped = false;
  else isLooped = true;

  if (isLooped) {
    audio.loop = true;
    $(".loop").css("color", "palevioletred");
  } else {
    audio.loop = false;
    $(".loop").css("color", "rgb(21, 10, 65)");
  }
}

// shuffle Song
function shuffleSongs() {
  if (isShuffled) isShuffled = false;
  else isShuffled = true;

  if (isShuffled) $(".shuffle").css("color", "palevioletred");
  else $(".shuffle").css("color", "rgb(21, 10, 65)");
}

// setting range
audio.addEventListener("timeupdate", (e: any) => {
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

  if (currentTime === totalTime) {
    if (currentSongIndex < songs.length) {
      currentSongIndex++;
      currentSong();
      // play(songs[currentSongIndex].path);
      audio.src = songs[currentSongIndex].path;
      audio.play();
      imgRotate();
    }
  }
});

// changing song time
$("#range").on("change", function (): void {
  audio.currentTime = Number((Number($(this).val()) * audio.duration) / 100);
});

$("#range").on("click", function (): void {
  audio.currentTime = Number((Number($(this).val()) * audio.duration) / 100);
});
