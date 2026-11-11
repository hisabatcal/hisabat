/* يُحمَّل هذا الملف في كل صفحات الموقع. أضف رقم الناشر والوحدة الإعلانية بعد تفعيل حسابك. */
(() => {
  const client = ''; // مثال: ca-pub-0000000000000000
  const slot = '';   // معرّف الوحدة الإعلانية
  if (!/^ca-pub-\d+$/.test(client) || !/^\d+$/.test(slot)) return;
  const script = document.createElement('script');
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + encodeURIComponent(client);
  document.head.appendChild(script);
  document.querySelectorAll('[data-ad-slot]').forEach((box) => {
    box.hidden = false;
    const ad = document.createElement('ins');
    ad.className = 'adsbygoogle';
    ad.style.display = 'block';
    ad.setAttribute('data-ad-client', client);
    ad.setAttribute('data-ad-slot', slot);
    ad.setAttribute('data-ad-format', 'auto');
    ad.setAttribute('data-full-width-responsive', 'true');
    box.replaceChildren(ad);
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  });
})();
