import $ from "jquery";

let r1 = "QWERTYUIOP";
let r2 = "ASDFGHJKL";
let r3 = "ZXCVBNM";

let getWord: string = "";

let boxNum: number = 0;
let row: number = 0;

let isPlaying: boolean = false;
let userWon: boolean = false;

// getting word

async function fetchWord(): Promise<void> {
  try {
    const res = await fetch("http://localhost:3000/api/game/getword");
    const data = await res.json();
    getWord = data.msg;
    console.log(getWord);
  } catch (error) {
    console.log({ error });
  }
}

// stats

$("#play-btn").on("click", async () => {
  isPlaying = true;
  $(".stats-holder").hide();

  try {
    await fetchWord();
    await fetch("http://localhost:3000/api/game/newgame", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log({ error });
  }
});

// end stats

$("#remove-letter").on("click", removeLetter);

function createBoxes() {
  for (let i = 0; i < 30; i++) {
    let box = document.createElement("div") as HTMLDivElement;
    box.className = "box";
    $(".box-container").append(box);
  }
}

createBoxes();

let boxes = document.querySelectorAll(".box");

function createKeyboard() {
  for (let i of r1) {
    let key = document.createElement("div") as HTMLDivElement;
    key.innerText = i;
    key.className = "key";
    key.onclick = () => insertLetter(i);
    $(".k1").append(key);
  }

  for (let i of r2) {
    let key = document.createElement("div") as HTMLDivElement;
    key.innerText = i;
    key.className = "key";
    key.onclick = () => insertLetter(i);
    $(".k2").append(key);
  }

  for (let i of ["ENTER", ...r3.split("")].reverse()) {
    let key = document.createElement("div") as HTMLDivElement;
    key.innerText = i;
    key.className = "key";
    if (i === "ENTER") {
      key.classList.add("enter");
      key.onclick = () => checkWord();
    } else {
      key.onclick = () => insertLetter(i);
    }
    $(".k3").prepend(key);
  }
}

createKeyboard();

window.addEventListener("keydown", (e: KeyboardEvent) => {
  let str: string = "qwertyuiopasdfghjklzxcvbnm";

  if (str.includes(e.key)) insertLetter(e.key.toUpperCase());
  else if (e.key === "Enter") checkWord();
  else if (e.key === "Backspace") removeLetter();
});

function insertLetter(letter: string) {
  if (isPlaying && boxNum > -1 && boxNum < 30) {
    if (row === 0 && boxNum < 5) {
      boxes[boxNum].innerHTML = letter;
      boxNum++;
    }
    if (row === 1 && boxNum < 10) {
      boxes[boxNum].innerHTML = letter;
      boxNum++;
    }
    if (row === 2 && boxNum < 15) {
      boxes[boxNum].innerHTML = letter;
      boxNum++;
    }
    if (row === 3 && boxNum < 20) {
      boxes[boxNum].innerHTML = letter;
      boxNum++;
    }
    if (row === 4 && boxNum < 25) {
      boxes[boxNum].innerHTML = letter;
      boxNum++;
    }
    if (row === 5 && boxNum < 30) {
      boxes[boxNum].innerHTML = letter;
      boxNum++;
    }
  }
}

function checkWord() {
  if (boxNum !== 0 && boxNum % 5 === 0 && row < 7) {
    row++;
    let userInput: string = "";

    if (row === 1) {
      userInput = "";
      for (let i = 0; i <= 4; i++) {
        userInput += boxes[i].innerHTML;
      }

      for (let i in userInput.split("")) {
        if (getWord.includes(userInput[i])) {
          if (getWord[i] === userInput[i]) {
            boxes[i].classList.add("green");
          } else {
            boxes[i].classList.add("yellow");
          }
        } else {
          boxes[i].classList.add("grey");
        }
      }
    }
    // row 2

    if (row === 2) {
      userInput = "";
      for (let i = 5; i <= 9; i++) {
        userInput += boxes[i].innerHTML;
      }

      for (let i in userInput.split("")) {
        if (getWord.includes(userInput[i])) {
          if (getWord[i] === userInput[i]) {
            boxes[Number(i) + 5].classList.add("green");
          } else {
            boxes[Number(i) + 5].classList.add("yellow");
          }
        } else {
          boxes[Number(i) + 5].classList.add("grey");
        }
      }
    }

    // row 3
    if (row === 3) {
      userInput = "";
      for (let i = 10; i <= 14; i++) {
        userInput += boxes[i].innerHTML;
      }

      for (let i in userInput.split("")) {
        if (getWord.includes(userInput[i])) {
          if (getWord[i] === userInput[i]) {
            boxes[Number(i) + 10].classList.add("green");
          } else {
            boxes[Number(i) + 10].classList.add("yellow");
          }
        } else {
          boxes[Number(i) + 10].classList.add("grey");
        }
      }
    }

    // row 4
    if (row === 4) {
      userInput = "";
      for (let i = 15; i <= 19; i++) {
        userInput += boxes[i].innerHTML;
      }

      for (let i in userInput.split("")) {
        if (getWord.includes(userInput[i])) {
          if (getWord[i] === userInput[i]) {
            boxes[Number(i) + 15].classList.add("green");
          } else {
            boxes[Number(i) + 15].classList.add("yellow");
          }
        } else {
          boxes[Number(i) + 15].classList.add("grey");
        }
      }
    }

    // row 5
    if (row === 5) {
      userInput = "";
      for (let i = 20; i <= 24; i++) {
        userInput += boxes[i].innerHTML;
      }

      for (let i in userInput.split("")) {
        if (getWord.includes(userInput[i])) {
          if (getWord[i] === userInput[i]) {
            boxes[Number(i) + 20].classList.add("green");
          } else {
            boxes[Number(i) + 20].classList.add("yellow");
          }
        } else {
          boxes[Number(i) + 20].classList.add("grey");
        }
      }
    }

    // row 6
    if (row === 6) {
      userInput = "";
      for (let i = 25; i <= 29; i++) {
        userInput += boxes[i].innerHTML;
      }

      for (let i in userInput.split("")) {
        if (getWord.includes(userInput[i])) {
          if (getWord[i] === userInput[i]) {
            boxes[Number(i) + 25].classList.add("green");
          } else {
            boxes[Number(i) + 25].classList.add("yellow");
          }
        } else {
          boxes[Number(i) + 25].classList.add("grey");
        }
      }
    }

    // rows ended

    if (userInput === getWord) {
      isPlaying = false;
      alert("YOU WON");

      userWon = true;

      (async () => {
        try {
          await fetch("http://localhost:3000/api/game/gamewon", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
          });
        } catch (error) {
          console.log({ error });
        }
      })();

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }

    if (row >= 6 && boxNum >= 29) {
      if (!userWon) {
        isPlaying = false;
        alert(`You lost the word is ${getWord}`);

        setTimeout(() => {
          window.location.reload();
        }, 5000);
      }
    }
  }
}

function removeLetter() {
  if (isPlaying) {
    if (
      (row === 0 && boxNum > 0) ||
      (row === 1 && boxNum > 5) ||
      (row === 2 && boxNum > 10) ||
      (row === 3 && boxNum > 15) ||
      (row === 4 && boxNum > 20) ||
      (row === 5 && boxNum > 25)
    ) {
      boxNum--;
      boxes[boxNum].innerHTML = "";
    }
  }
}
