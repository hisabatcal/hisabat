/* لا تُحمّل الإعلانات إلا بعد تفعيلها وضبط معرّفات الناشر والوحدات. */
(() => {
  const scriptTag = document.currentScript;
  if (!scriptTag) return;

  const boxesOnPage = Array.from(document.querySelectorAll('[data-ad-placement]'));
  if (!boxesOnPage.length) return;
  const configUrl = new URL('ads-config.json', scriptTag.src).href;
  const publisherPattern = /^ca-pub-\d+$/;
  const slotPattern = /^\d+$/;
  let adsScript = null;

  function loadLibrary(publisherId) {
    if (adsScript) return;
    adsScript = document.createElement('script');
    adsScript.async = true;
    adsScript.crossOrigin = 'anonymous';
    adsScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + encodeURIComponent(publisherId);
    document.head.appendChild(adsScript);
  }

  function render(box, config) {
    const placement = box.dataset.adPlacement;
    const unit = config.slots && config.slots[placement];
    if (!unit || unit.enabled !== true || !slotPattern.test(String(unit.slotId || ''))) return;

    box.hidden = false;
    box.classList.remove('ad-slot-pending');
    const ad = document.createElement('ins');
    ad.className = 'adsbygoogle';
    ad.style.display = 'block';
    ad.setAttribute('data-ad-client', config.publisherId);
    ad.setAttribute('data-ad-slot', unit.slotId);
    ad.setAttribute('data-ad-format', 'auto');
    ad.setAttribute('data-full-width-responsive', 'true');
    box.replaceChildren(ad);

    loadLibrary(config.publisherId);
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }

  fetch(configUrl, { cache: 'no-store' })
    .then((response) => response.ok ? response.json() : null)
    .then((config) => {
      if (!config || config.enabled !== true || !publisherPattern.test(String(config.publisherId || ''))) return;
      const eligible = boxesOnPage.filter((box) => {
        const unit = config.slots && config.slots[box.dataset.adPlacement];
        return unit && unit.enabled === true && slotPattern.test(String(unit.slotId || ''));
      });
      if (!eligible.length) return;
      eligible.forEach((box) => { box.hidden = false; box.classList.add('ad-slot-pending'); });

      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);
            render(entry.target, config);
          });
        }, { rootMargin: '250px 0px' });
        eligible.forEach((box) => observer.observe(box));
      } else {
        eligible.forEach((box) => render(box, config));
      }
    })
    .catch(() => {});
})();
