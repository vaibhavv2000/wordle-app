import $ from "jquery";

$(".del-acc").hide();

$(".logout").on("click", async () => {
  try {
    const res = await fetch("http://localhost:3000/api/auth/logout", {
      method: "POST",
    });
    const data = await res.json();
    if (data.msg) {
      window.location.href = "/";
    }
  } catch (error) {
    console.log({ error });
  }
});

$(".delete-acc").on("click", () => $(".del-acc").css("display", "grid"));

$(".del-cancel").on("click", () => $(".del-acc").hide());

$(".del-confirm").on("click", async () => {
  try {
    const res = await fetch("http://localhost:3000/api/user/deleteuser", {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.msg) {
      window.location.href = "/";
    }
  } catch (error) {
    console.log({ error });
  }
});

$(".account").on("click", () => (location.href = "/account"));

$(".pwd").on("click", () => (location.href = "/changepassword"));
