// generate html elements
function generateElements(html) {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.children;
};

document.addEventListener("DOMContentLoaded", () => {
    // stuff from :root
    const cDimension = parseInt(window.getComputedStyle(document.body).getPropertyValue("--cursor_sizeClick"));
    const clDimension = parseInt(window.getComputedStyle(document.body).getPropertyValue("--cursor_sizeClickLink"));
    const dDimension = parseInt(window.getComputedStyle(document.body).getPropertyValue("--cursor_sizeDust"));

    // what it works off on
    // top of the document so it overlays everything else
    document.body.prepend(generateElements(`
<div id="asset_cursor">
    <div id="cursor_drag"></div>
    <div id="cursor_click"></div>
</div>
`)[0]);

    let isDown = false; // mouse down flag
    let currentTap = undefined; // tapping cooldown; only one spark at a time :)
    let scrollOffsetX = 0; // scrolling offset for the x-position
    let scrollOffsetY = 0; // scrolling offset for the y-position

    const drag = document.getElementById("cursor_drag");
    const click = document.getElementById("cursor_click");

    // initiate cursor animation
    function mtDown(downX, downY, target) {
        isDown = true;
        if (!click.classList.contains("ed") && !click.classList.contains("edlink")) {
            let targetTag = target.tagName.toLowerCase().trim();
            if (targetTag == "a" || targetTag == "button" || target.classList.contains("cursor_link")) {
                click.classList.add("edlink");
                click.style.top = `${downY - (clDimension / 2) - scrollOffsetY}px`;
                click.style.left = `${downX - (clDimension / 2) - scrollOffsetX}px`;
                clearTimeout(currentTap);
            }
            else {
                click.classList.add("ed");
                click.style.top = `${downY - (cDimension / 2) - scrollOffsetY}px`;
                click.style.left = `${downX - (cDimension / 2) - scrollOffsetX}px`;
                clearTimeout(currentTap);
            }
            currentTap = setTimeout(() => {
                click.classList.remove("ed");
                click.classList.remove("edlink");
            }, 250);
        };
    };

    // move cursor animation
    function mtMove(currentX, currentY) {
        if (isDown) {
            const dragtrail = generateElements(`
<div class="cursor_dragtrail" style="top: ${currentY - (dDimension / 2) - scrollOffsetY}px; left: ${currentX - (dDimension / 2) - scrollOffsetX}px"></div>
`)[0];
            let dragdustDimensions = Math.floor(Math.random() * dDimension * 1.5);
            const dragdust = generateElements(`
<div class="cursor_dragdust" style="top: ${currentY - (dragdustDimensions * 1.5) + Math.floor(Math.random() * dragdustDimensions * 2) - scrollOffsetY}px; left: ${currentX - (dragdustDimensions * 1.5) + Math.floor(Math.random() * dragdustDimensions * 2) - scrollOffsetX}px; width: ${dragdustDimensions}px; height: ${dragdustDimensions}px; opacity: ${Math.random()};">
`)[0];

            drag.append(dragtrail);
            drag.append(dragdust);

            // this is so the trail shrinks properly
            dragtrail.animate([
                {},
                {
                    top: `${currentY - scrollOffsetY}px`,
                    left: `${currentX - scrollOffsetX}px`
                },
            ], {
                duration: 500,
                easing: "linear"
            });

            setTimeout(() => {
                dragtrail.remove();
                dragdust.remove();
            }, 500);
        }
    };

    // deactivate cursor animation
    function mtUp() {
        isDown = false;
    };

    document.addEventListener("mousedown", (event) => {
        mtDown(event.pageX, event.pageY, event.target);
    });

    document.addEventListener("touchstart", (event) => {
        mtDown(event.targetTouches[0].pageX, event.targetTouches[0].pageY, event.target);
    });

    document.addEventListener("mousemove", (event) => {
        mtMove(event.pageX, event.pageY);
    });

    document.addEventListener("touchmove", (event) => {
        mtMove(event.targetTouches[0].pageX, event.targetTouches[0].pageY);
    });

    document.addEventListener("mouseup", mtUp);
    document.addEventListener("touchend", mtUp);
    document.addEventListener("touchcancel", mtUp);

    document.addEventListener("scroll", () => {
        scrollOffsetX = window.scrollX;
        scrollOffsetY = window.scrollY;
    });
});