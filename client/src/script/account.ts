import $ from "jquery";

interface user {
  name: string;
  username: string;
  email: string;
  profile?: string;
  cover?: string;
}

const getUser = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/user/getuser");
    const { user }: { user: user } = await res.json();

    $(".name").val(user.name);
    $(".username").val(user.username);
    $(".email").val(user.email);
    $(".profile").val(user.profile || "");
    $(".cover").val(user.cover || "");
  } catch (error: any) {
    $(".warning").show();
    $(".warning").html(error.msg);
  }
};

getUser();

$("form").on("submit", async (e: JQuery.SubmitEvent) => {
  e.preventDefault();

  $(".warning").html("");
  $(".warning").show();

  const name = $(".name").val() as string;
  const username = $(".username").val() as string;
  const email = $(".email").val() as string;
  const profile = $(".profile").val() as string;
  const cover = $(".cover").val() as string;

  if (!name || !username || !email) {
    $(".warning").html("All fields are necessary");
    return;
  }

  const user: user = {
    name,
    username,
    email,
  };

  if (profile) user.profile = profile;
  if (cover) user.cover = cover;

  try {
    const res = await fetch(`http://localhost:3000/api/user/updateuser`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const data = await res.json();

    if (data.success) {
      $(".warning").html(data.msg);
      $(".warning").css("color", "darkblue");
      return;
    } else {
      $(".warning").html(data.msg);
    }
  } catch (error: any) {
    $(".warning").html(error.msg);
  }
});
