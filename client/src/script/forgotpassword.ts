import axios from "axios";
import $ from "jquery";

let emailRegex: RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

let emailSent: boolean = false;
let user: { token: string; email: string };

$("input").on("focus", function () {
  $(this).next().addClass("label");
});

$(".otp-holder").hide();
$(".pwd").hide();
$(".confirm-pwd").hide();

const email_label = $("#email").next();
const pwd_label = $("#new-password").next();
const confirm_label = $("#confirm-new-password").next();

$("form").on("submit", async function (e: JQuery.SubmitEvent) {
  e.preventDefault();

  email_label.html("Email");
  $(".warning").html("");

  const email = $("#email").val() as string;

  if (!email) {
    email_label.html("Email Required");
    return;
  }

  if (!email.match(emailRegex)) {
    email_label.html("Invalid email");
    return;
  }

  try {
    if (!emailSent) {
      const res = await axios.post(
        "http://localhost:3000/api/auth/forgotpassword",
        {
          email,
        }
      );

      if (res.data.msg === "ok") {
        emailSent = true;
        user = { token: res.data.token, email: res.data.email };
        $("button").html("Reset password");
        $(".otp-holder").show();
        $(".pwd").show();
        $(".confirm-pwd").show();
      }
    } else {
      const otp = Number($("#otp").val()) as number;
      const password = $("#new-password").val() as string;
      const confirmPassword = $("#confirm-new-password").val() as string;

      if (!otp || !password || !confirmPassword) {
        $(".warning").html("All fields are neccessary");
        return;
      }

      if (password.length < 8) {
        $(".warning").html("Password should be atleast 8 char");
        return;
      }

      if (password !== confirmPassword) {
        $(".warning").html("Password's don't match with each other");
        return;
      }

      const res = await axios.post(
        "http://localhost:3000/api/auth/resetpassword",
        {
          ...user,
          otp,
          password,
          confirmPassword,
        }
      );

      if (res.data.status === "ok") {
        $(".warning").html(res.data.msg).css("color", "darkblue");
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      }
    }
  } catch (error: any) {
    $(".warning").html(error.response.data.msg);
  }
});
