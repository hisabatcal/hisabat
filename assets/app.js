(function () {
  const $ = (id) => document.getElementById(id);
  const nf = (n, cur) => {
    const x = Number(n) || 0;
    const s = x.toLocaleString("ar-SA", { maximumFractionDigits: 2 });
    return cur ? s + " " + cur : s;
  };

  document.querySelectorAll(".tabs button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tabs button").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".panel").forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      $(btn.dataset.tab).classList.add("active");
      history.replaceState(null, "", "#" + btn.dataset.tab);
    });
  });
  const hash = (location.hash || "#zakat").slice(1);
  const start = document.querySelector('.tabs button[data-tab="' + hash + '"]');
  if (start) start.click();

  function show(id) {
    $(id).classList.add("show");
  }

  /* Zakat: Z = (W - L) * 0.025 ; Nisab gold 87.48g silver 612.36g */
  $("z-go").onclick = () => {
    const gp = +$("z-gold-price").value || 0;
    const sp = +$("z-silver-price").value || 0;
    const g = +$("z-gold").value || 0;
    const sv = +$("z-silver").value || 0;
    const cash = +$("z-cash").value || 0;
    const bank = +$("z-bank").value || 0;
    const inv = +$("z-inv").value || 0;
    const trade = +$("z-trade").value || 0;
    const debt = +$("z-debt").value || 0;
    const cur = $("z-cur").value;
    const W = g * gp + sv * sp + cash + bank + inv + trade;
    const net = Math.max(0, W - debt);
    const nisabG = 87.48 * gp;
    const nisabS = 612.36 * sp;
    const use = $("z-nisab").value;
    const N = use === "gold" ? nisabG : nisabS;
    const wajib = net >= N && N > 0;
    const Z = wajib ? net * 0.025 : 0;
    $("z-total").textContent = nf(Z, cur);
    $("z-wealth").textContent = nf(net, cur);
    $("z-nval").textContent = nf(N, cur);
    $("z-status").textContent = wajib ? "الزكاة واجبة" : "لم يبلغ النصاب — الزكاة غير واجبة";
    show("z-out");
  };

  /* Qurbani */
  $("q-animal").onchange = () => {
    const a = $("q-animal").value;
    const seven = a === "cow" || a === "buffalo" || a === "camel";
    $("q-shares").disabled = !seven;
    if (!seven) $("q-shares").value = 1;
    else if (+$("q-shares").value < 2) $("q-shares").value = 7;
  };
  $("q-go").onclick = () => {
    const a = $("q-animal").value;
    const price = +$("q-price").value || 0;
    const extras = +$("q-extras").value || 0;
    const shares = a === "goat" || a === "sheep" ? 1 : Math.min(7, Math.max(1, +$("q-shares").value || 7));
    const mine = Math.min(shares, Math.max(1, +$("q-mine").value || 1));
    const n = Math.max(1, +$("q-count").value || 1);
    const cur = $("q-cur").value;
    const one = price + extras;
    const per = one / shares;
    const my = per * mine * n;
    $("q-total").textContent = nf(my, cur);
    $("q-per").textContent = nf(per, cur);
    $("q-my").textContent = nf(my, cur);
    $("q-all").textContent = nf(one * n, cur);
    show("q-out");
  };

  $("gs-add").onclick = () => {
    const row = document.createElement("div");
    row.className = "person";
    row.innerHTML =
      '<input type="text" class="gs-name" placeholder="الاسم">' +
      '<input type="number" class="gs-share" min="1" max="7" value="1">' +
      '<button type="button" class="linkish gs-del">حذف</button>';
    $("gs-list").appendChild(row);
    row.querySelector(".gs-del").onclick = () => row.remove();
  };
  document.querySelectorAll(".gs-del").forEach((b) => {
    b.onclick = () => b.parentElement.remove();
  });
  $("gs-go").onclick = () => {
    const total = (+$("gs-price").value || 0) + (+$("gs-ex").value || 0);
    const cur = $("q-cur").value;
    let shares = 0;
    const rows = [...$("gs-list").querySelectorAll(".person")];
    rows.forEach((r) => (shares += +r.querySelector(".gs-share").value || 0));
    const per = total / (shares || 1);
    let html = "<table><tr><th>الاسم</th><th>الحصص</th><th>المبلغ</th></tr>";
    rows.forEach((r, i) => {
      const name = r.querySelector(".gs-name").value || "شخص " + (i + 1);
      const s = +r.querySelector(".gs-share").value || 0;
      html += "<tr><td>" + name + "</td><td>" + s + "</td><td>" + nf(s * per, cur) + "</td></tr>";
    });
    html += "</table>";
    $("gs-detail").innerHTML = html;
    show("gs-out");
  };

  /* Fitrana: members * (kg per sa' * price/kg)  1 Sa' = 3.5 default */
  $("f-go").onclick = () => {
    const members = Math.max(1, +$("f-members").value || 1);
    const kg = +$("f-sa").value || 3.5;
    const price = +$("f-price").value || 0;
    const cur = $("f-cur").value;
    const per = kg * price;
    const tot = members * per;
    $("f-total").textContent = nf(tot, cur);
    $("f-per").textContent = nf(per, cur);
    show("f-out");
  };

  /* Hajj savings */
  $("h-go").onclick = () => {
    const cost = +$("h-cost").value || 0;
    const persons = Math.max(1, +$("h-persons").value || 1);
    const saved = +$("h-saved").value || 0;
    const year = +$("h-year").value || 2027;
    const infl = (+$("h-infl").value || 0) / 100;
    const extra = +$("h-extra").value || 0;
    const now = 2026;
    const years = Math.max(1, year - now);
    let future = (cost + extra) * persons;
    for (let i = 0; i < years; i++) future *= 1 + infl;
    const need = Math.max(0, future - saved);
    const monthly = need / (years * 12);
    const cur = $("h-cur").value;
    $("h-total").textContent = nf(need, cur);
    $("h-month").textContent = nf(monthly, cur);
    $("h-yearamt").textContent = nf(monthly * 12, cur);
    $("h-future").textContent = nf(future, cur);
    show("h-out");
  };

  /* Mehr: Fatimi ~ 262.5g silver classic approx; gold weight * price */
  $("m-go").onclick = () => {
    const type = $("m-type").value;
    const cur = $("m-cur").value;
    const gp = +$("m-gp").value || 0;
    const sp = +$("m-sp").value || 0;
    const w = +$("m-w").value || 0;
    const cash = +$("m-cash").value || 0;
    let amt = 0;
    if (type === "fatimi") amt = 262.5 * (sp || 0); /* ~12.5 riyal silver weight common teaching */
    else if (type === "gold") amt = w * gp;
    else if (type === "silver") amt = w * sp;
    else if (type === "wives") amt = 12.5 * (sp * 2.975); /* approx 12.5 uqiyya teaching placeholder via silver */
    else if (type === "min") amt = sp * 10.5; /* hanafi min dirhams approx via silver grams teaching */
    else amt = cash;
    const pct = Math.min(100, Math.max(0, +$("m-pct").value || 100));
    const nowp = amt * (pct / 100);
    $("m-total").textContent = nf(amt, cur);
    $("m-now").textContent = nf(nowp, cur);
    $("m-later").textContent = nf(amt - nowp, cur);
    show("m-out");
  };

  /* Qarz hasana */
  $("l-go").onclick = () => {
    const amt = +$("l-amt").value || 0;
    let months = +$("l-months").value || 12;
    if ($("l-months").value === "custom") months = Math.max(1, +$("l-custom").value || 12);
    const grace = Math.max(0, +$("l-grace").value || 0);
    const income = +$("l-income").value || 0;
    const cur = $("l-cur").value;
    const payMonths = Math.max(1, months - grace);
    const inst = amt / payMonths;
    const riba = amt * 0.2 * (months / 12);
    $("l-inst").textContent = nf(inst, cur);
    $("l-back").textContent = nf(amt, cur);
    $("l-saved").textContent = nf(riba, cur);
    $("l-pct").textContent = income ? ((inst / income) * 100).toFixed(1) + "%" : "—";
    show("l-out");
  };

  /* Sadaqah */
  $("s-go").onclick = () => {
    const income = +$("s-income").value || 0;
    const pct = $("s-pct").value;
    const cur = $("s-cur").value;
    const monthly = pct === "custom" ? +$("s-custom").value || 0 : income * ((+pct) / 100);
    $("s-total").textContent = nf(monthly, cur);
    $("s-d").textContent = nf(monthly / 30, cur);
    $("s-w").textContent = nf(monthly / 4.33, cur);
    $("s-m").textContent = nf(monthly, cur);
    $("s-y").textContent = nf(monthly * 12, cur);
    show("s-out");
  };

  /* Inheritance — common Quran 4:11-12 cases (estimate, not fatwa) */
  $("w-go").onclick = () => {
    const estate = Math.max(0, +$("w-estate").value || 0);
    const cur = $("w-cur").value;
    const spouse = $("w-spouse").value;
    const sons = Math.max(0, +$("w-sons").value || 0);
    const da = Math.max(0, +$("w-daughters").value || 0);
    const father = $("w-father").checked;
    const mother = $("w-mother").checked;
    const kids = sons + da;
    const rows = [];
    let rest = estate;

    function take(name, frac, note) {
      const v = estate * frac;
      rows.push({ name, v, note });
      rest -= v;
    }

    if (spouse === "wife") {
      take("الزوجة", kids ? 1 / 8 : 1 / 4, kids ? "1/8 لوجود الفرع الوارث" : "1/4 لعدم الفرع");
    } else if (spouse === "husband") {
      take("الزوج", kids ? 1 / 4 : 1 / 2, kids ? "1/4 لوجود الفرع" : "1/2 لعدم الفرع");
    }
    if (mother) take("الأم", kids || father ? 1 / 6 : 1 / 3, kids || father ? "1/6" : "1/3");
    if (father && kids) take("الأب", 1 / 6, "1/6 + عصبة إن بقي");
    if (father && !kids) {
      /* father as residuary after spouse/mother already taken from rest conceptually */
      rows.push({ name: "الأب (عصبة)", v: Math.max(0, rest), note: "الباقي تعصيباً" });
      rest = 0;
    }
    if (sons + da > 0) {
      const units = sons * 2 + da;
      const pool = Math.max(0, rest);
      if (sons) {
        rows.push({
          name: "الأبناء (" + sons + ")",
          v: (pool * (sons * 2)) / units,
          note: "للذكر مثل حظ الأنثيين",
        });
      }
      if (da) {
        rows.push({
          name: "البنات (" + da + ")",
          v: (pool * da) / units,
          note: sons ? "نصف حظ الذكر" : da === 1 ? "1/2" : "2/3 يشتركن",
        });
      }
      rest = 0;
    }
    if (rest > 1) rows.push({ name: "باقي / رد أو عاصب آخر", v: rest, note: "راجع عالماً" });

    let html = "<table><tr><th>الوارث</th><th>النصيب</th><th>الملاحظة</th></tr>";
    rows.forEach((r) => {
      html += "<tr><td>" + r.name + "</td><td>" + nf(r.v, cur) + "</td><td>" + r.note + "</td></tr>";
    });
    html += "</table>";
    $("w-detail").innerHTML = html;
    $("w-total").textContent = nf(estate, cur);
    show("w-out");
  };
})();
