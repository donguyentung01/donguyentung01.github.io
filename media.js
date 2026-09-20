// Looping demo videos: play only while on screen, respect reduced-motion.
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var videos = document.querySelectorAll("video[data-loop]");
  videos.forEach(function (v) {
    v.muted = true;
    if (reduce) { v.removeAttribute("autoplay"); v.pause(); v.controls = true; return; }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
          else v.pause();
        });
      }, { threshold: 0.2 }).observe(v);
    }
  });

  // Reserve Court SF timeline: reveal one line at a time, then loop.
  document.querySelectorAll(".log[data-animate] ol").forEach(function (list) {
    if (reduce) return;
    var items = list.querySelectorAll("li");
    var i = 0, timer = null;
    list.classList.add("typing");
    function step() {
      if (i < items.length) { items[i].classList.add("shown"); i++; timer = setTimeout(step, i === items.length ? 3200 : 1100); }
      else { items.forEach(function (li) { li.classList.remove("shown"); }); i = 0; timer = setTimeout(step, 500); }
    }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !timer) step();
          else if (!e.isIntersecting && timer) { clearTimeout(timer); timer = null; }
        });
      }, { threshold: 0.3 }).observe(list);
    } else step();
  });

  // làm thân: the "questions answered" number comes from the live site's counter.
  var lamthan = document.querySelector('[data-lamthan="total"]');
  if (lamthan && window.fetch) {
    fetch("https://lamthan.com/api/count")
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!d || !d.enabled || !d.total) return;
        lamthan.textContent = d.total.toLocaleString("en-US");
        var tag = document.querySelector('[data-lamthan="live"]');
        if (tag) tag.hidden = false;
      })
      .catch(function () {});               // offline or blocked: the baked-in number stands
  }
})();
