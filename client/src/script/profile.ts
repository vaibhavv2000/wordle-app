import $ from "jquery";

$("#user-id").hide();

$(".msg").on("click", async () => {
  const userId = $("#user-id").html();

  try {
    const res = await fetch(`http://localhost:3000/api/chat/createchat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: userId.trim() }),
    });

    const data = await res.json();

    if (data.success) location.href = "/chat";
    else {
      $("#user-id").show();
      $("#user-id").html(data.msg);
    }
  } catch (error: any) {
    $("#user-id").show();
    $("#user-id").html(error.msg);
  }
});
