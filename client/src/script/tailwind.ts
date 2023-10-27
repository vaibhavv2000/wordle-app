import $ from "jquery";

let isToggled: boolean = false;

$(".exp-toggle").next().hide();

$(".exp-toggle").on("click", function () {
  $(this).next().slideToggle(500);
});

$(".nav-toggle").on("click", function () {
  if (isToggled) isToggled = false;
  else isToggled = true;

  if (isToggled) {
    $(".nav-list").addClass("nav-show");
    $(".nav-toggle").attr("style", "color: #fff !important;");
  } else {
    $(".nav-list").removeClass("nav-show");
    $(".nav-toggle").attr("style", "color: #111 !important;");
  }
});
