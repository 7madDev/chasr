(function () {
  var scripts = document.querySelectorAll('script[src*="embed.js"][data-goal]');
  scripts.forEach(function (script) {
    var slug = script.getAttribute("data-goal");
    if (!slug) return;

    var origin = new URL(script.src).origin;
    var container = document.createElement("div");
    container.style.display = "inline-block";

    var iframe = document.createElement("iframe");
    iframe.src = origin + "/embed/" + slug;
    iframe.style.width = "320px";
    iframe.style.height = "180px";
    iframe.style.border = "none";
    iframe.style.borderRadius = "8px";
    iframe.style.overflow = "hidden";
    iframe.setAttribute("scrolling", "no");
    iframe.setAttribute("loading", "lazy");
    iframe.setAttribute(
      "title",
      "Revenue goal progress on Chasr"
    );

    container.appendChild(iframe);
    script.parentNode.insertBefore(container, script.nextSibling);
  });
})();
