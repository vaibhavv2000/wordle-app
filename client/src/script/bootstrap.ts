import $ from "jquery";
import "../../../node_modules/bootstrap/js/src/collapse.js";

let isToggled: boolean = false;

$(".nav-list li").on("click",function(e: JQuery.ClickEvent) {
  const pos: number = e.target.offsetLeft;
  const width: number = e.target.offsetWidth;

  $(".nav-slider").css("left",`${pos}px`);
  $(".nav-slider").css("width",`0px`).delay(500).css("width",`${width}px`);
});

$("#toggle-nav").on("click",function() {
  if(isToggled) isToggled = false;
  else isToggled = true;

  $(".nav-list").toggleClass("nav-show");

  if(isToggled) {
    $("#toggle-nav").attr({class: "bi bi-x",style: "font-size: 22px;"});
    $("#toggle-nav").css({color: "#fff"});
  } else {
    $("#toggle-nav").attr("class","bi bi-text-left");
    $("#toggle-nav").css({color: "purple",style: "font-size: 18px;"});
  }
});
