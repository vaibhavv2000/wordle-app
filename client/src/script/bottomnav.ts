let showMore = false;
const moreOpt = document.getElementById('opt-more') as HTMLDivElement;
const more = document.getElementById("more") as HTMLDivElement;

more?.addEventListener('click',function() {
    if(showMore) {
        moreOpt.style.display = "none";
        showMore = false;
    } else {
        moreOpt.style.display = "flex";
        showMore = true;
    };
});