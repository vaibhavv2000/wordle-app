import $ from "jquery";
import axios from "axios";

$(".otp").hide();

$("input").on("focus", function () {
  $(this).next().addClass("label");
});

$(".login-right-google").on("click", function () {
  window.location.href = "/auth/google";
});

let emailRegex: RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const name_label = $("#name").next();
const username_label = $("#username").next();
const email_label = $("#email").next();
const pwd_label = $("#password").next();
const confirmPwd_label = $("#confirm-password").next();
const otp_label = $("#otp-in").next();

let isRegistered: boolean = false;
let user: any;

$("form").on("submit", async function (e) {
  e.preventDefault();

  let name = $("#name").val() as string;
  let username = $("#username").val() as string;
  let email = $("#email").val() as string;
  let pwd = $("#password").val() as string;
  let confirmPwd = $("#confirm-password").val() as string;

  if (!name || !username || !email || !pwd || !confirmPwd) {
    $("#warning").html("All fields are necessary");

    setTimeout(() => $("#warning").html(""), 5000);
    return;
  }

  if (username.length < 3) {
    username_label.html("Username should be atleast 3 chars");
    username_label.attr("style", "color: red !important;");
    setTimeout(() => {
      username_label.css("color", "blue");
      username_label.html("Username");
    }, 5000);

    return;
  }

  if (!email.match(emailRegex)) {
    email_label.html("Invalid email");
    email_label.attr("style", "color: red !important;");
    setTimeout(() => {
      email_label.css("color", "blue");
      email_label.html("Email");
    }, 5000);

    return;
  }

  if (pwd.length < 8) {
    pwd_label.html("Password length should be atleast 8 char");
    pwd_label.attr("style", "color: red !important;");
    setTimeout(() => {
      pwd_label.css("color", "blue");
      pwd_label.html("Password");
    }, 5000);

    return;
  }

  if (pwd !== confirmPwd) {
    confirmPwd_label.html("Passwords don't match with each other");
    confirmPwd_label.attr("style", "color: red !important;");
    setTimeout(() => {
      confirmPwd_label.css("color", "blue");
      confirmPwd_label.html("Confirm Password");
    }, 5000);

    return;
  }

  try {
    if (!isRegistered) {
      const res = await axios.post("http://localhost:3000/api/auth/register", {
        name,
        email,
        password: pwd,
        username,
        confirmPassword: confirmPwd,
      });

      if (res.data.msg === "ok") {
        isRegistered = true;
        $(".otp").show();
        user = res.data.user;
        $("#warning")
          .html("An OTP has been sent to your email")
          .css("color", "rgb(37, 166, 37)");
      }
    } else {
      let otp = Number($("#otp-in").val()) as number;

      const res = await axios.post(
        "http://localhost:3000/api/auth/register/confirm",
        {
          ...user,
          otp,
        }
      );

      if (res.data.msg === "success") {
        user = null;
        $("#warning").html("Account created successfully").css("color", "blue");

        setTimeout(() => {
          window.location.href = "/wordle";
        }, 2000);
      }
    }
  } catch (error: any) {
    $("#warning").html(error.response.data.msg);
  }
});

let title = "Sign up, To meet Different People Around the World.....";
let n = 0;

setInterval(() => {
  $(".login-right-title").html(title.slice(0, n));
  n++;
  if (n > title.length) {
    setTimeout(() => {
      n = 0;
    }, 7000);
  }
}, 100);
