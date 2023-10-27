import $ from "jquery";

interface user {
  name: string;
  username: string;
  profile?: string;
}

function debounce(fn: Function,delay: number) {
  let timer;
  return (() => {
    if(timer) clearTimeout(timer);
    timer = setTimeout(fn,delay);
  })();
}

const getUsers = async (query: string) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/user/searchusers?user=${query}`
    );
    const users: {users: user[]} = await res.json();

    $(".users").html("");

    if(users.users.length < 1) {
      $(".users").hide();
      return;
    }

    $(".users").show();

    for(let user of users.users) {
      const userHolder = document.createElement("div") as HTMLDivElement;
      const userLeft = document.createElement("div") as HTMLDivElement;
      const profile = document.createElement("img") as HTMLImageElement;
      const userDetails = document.createElement("div") as HTMLDivElement;
      const userName = document.createElement("p") as HTMLParagraphElement;
      const user_name = document.createElement("span") as HTMLSpanElement;

      const userRight = document.createElement("div") as HTMLDivElement;
      const follow = document.createElement("span") as HTMLSpanElement;

      userHolder.className = "user";
      userLeft.className = "user-left";
      profile.className = "user-img";

      userDetails.className = "user-details";
      userName.className = "username";
      user_name.className = "user-name";

      userRight.className = "user-right";

      profile.src =
        user.profile || "https://cdn-icons-png.flaticon.com/128/149/149071.png";

      userName.innerText = user.username;
      user_name.innerText = user.name;
      follow.innerText = "Follow";

      userHolder.onclick = () =>
        (window.location.href = `/profile?user=${user.username}`);

      userDetails.append(userName,user_name);
      userLeft.append(profile,userDetails);
      userRight.append(follow);
      userHolder.append(userLeft,userRight);

      $(".users").append(userHolder);
    }
  } catch(error) {
    error instanceof Error && console.log("errrr",error.message);
  }
};

$(".users").hide();

$("input").on("input",function() {
  const query = $(this).val() as string;

  if(query) debounce(() => getUsers(query),1000);
  else $(".users").hide();
});
