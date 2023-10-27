import $ from "jquery";

$("form").on("submit", async (e: JQuery.SubmitEvent) => {
  e.preventDefault();

  const old_pwd = $("#old-pwd").val() as string;
  const new_pwd = $("#new-pwd").val() as string;
  const confirm_new_pwd = $("#confirm-new-pwd").val() as string;

  if (!old_pwd || !new_pwd || !confirm_new_pwd) {
    $(".warning").show();
    $(".warning").html("All fields are necessary");
    return;
  }

  if (new_pwd.length < 8) {
    $(".warning").html("Password should be atleast 8 characters");
    return;
  }

  if (new_pwd !== confirm_new_pwd) {
    $(".warning").html("Passwords don't match with each other");
    return;
  }

  const pwd = {
    old_pwd,
    new_pwd: new_pwd.trim(),
    confirm_new_pwd: confirm_new_pwd.trim(),
  };

  try {
    const res = await fetch(`http://localhost:3000/api/user/changepassword`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pwd),
    });

    const data = await res.json();

    if (data.success) {
      $(".warning").html(data.msg);
      $(".warning").css("color", "dodgerblue");
      return;
    }

    if (data.msg) {
      $(".warning").html(data.error);
      $(".warning").css("color", "red");
    }
  } catch (error: any) {
    $(".warning").html(error.msg);
  }
});
