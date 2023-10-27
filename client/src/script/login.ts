import axios from "axios";
import $ from "jquery";

$("input").on("focus", function (): void {
  $(this).next().addClass("label");
});

const user_label = $("#user").next() as JQuery<HTMLElement>;
const pwd_label = $("#user").next() as JQuery<HTMLElement>;

$(".google-login").on("click", () => location.href = "/auth/google");

$("form").on("submit", async function (e: JQuery.SubmitEvent): Promise<void> {
  e.preventDefault();

  const user = $("#user").val() as string;
  const password = $("#password").val() as string;

  if (!user || !password) {
    $("#warning").html("All fields are necessary").css("color", "red");
    return;
  }

  try {
    const res = await axios.post("http://localhost:3000/api/auth/login", {
      user,
      password,
    });

    if (res.data.msg === "Login Successful") {
      $("#warning").html("Login successful").css("color", "blue");

      setTimeout(() => {
        window.location.href = "/wordle";
      }, 3000);
    }
  } catch (error: any) {
    $("#warning").html(error.response.data.msg).css("color", "red");
  }
});
