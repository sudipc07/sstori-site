(function () {
  var revealItems = document.querySelectorAll('.reveal');

  if (!revealItems.length) {
    return;
  }

  if (!('IntersectionObserver' in window)) {
    revealItems.forEach(function (item) {
      item.classList.add('reveal-visible');
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries, io) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add('reveal-visible');
        io.unobserve(entry.target);
      });
    },
    {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -8% 0px'
    }
  );

  revealItems.forEach(function (item) {
    observer.observe(item);
  });
})();
