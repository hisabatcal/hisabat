(() => {
  const fmt = (n) => new Intl.NumberFormat('ar', {maximumFractionDigits: 2}).format(n);
  const val = (form, name) => Math.max(0, Number(form.elements[name]?.value || 0));
  document.querySelectorAll('[data-calculator]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const out = form.querySelector('[data-result]');
      const type = form.dataset.calculator;
      let text = '';
      if (type === 'zakat') {
        const total = val(form,'cash') + val(form,'gold') + val(form,'business');
        const net = Math.max(0, total - val(form,'debts'));
        const nisab = val(form,'nisab');
        text = net >= nisab && nisab > 0
          ? `الوعاء التقديري: ${fmt(net)}. الزكاة التقديرية بنسبة ٢٫٥٪: ${fmt(net * .025)}.`
          : 'بحسب الأرقام المدخلة، لم يبلغ صافي المال حدَّ النصاب الذي أدخلته. تحقّق من طريقة التقييم والنصاب مع أهل الاختصاص.';
      } else if (type === 'fitrah') {
        const total = val(form,'people') * val(form,'rate');
        text = `المجموع التقديري: ${fmt(total)}. أدخل مقدار الفطرة المعتمد محلياً لكل شخص.`;
      } else if (type === 'qurbani') {
        const total = val(form,'shares') * val(form,'sharePrice');
        text = `التكلفة التقديرية للحصص المحددة: ${fmt(total)}. هذا تقدير مالي فقط ولا يحدد حكم الأضحية.`;
      } else if (type === 'inheritance') {
        const sons = Math.floor(val(form,'sons'));
        const daughters = Math.floor(val(form,'daughters'));
        const remainder = val(form,'remainder');
        const units = sons * 2 + daughters;
        if (!units) text = 'أدخل عدداً صحيحاً موجباً من الأبناء أو البنات.';
        else text = `من المبلغ المتبقي الذي أدخلته: نصيب الابن التقديري ${fmt(remainder * 2 / units)}، ونصيب البنت التقديري ${fmt(remainder / units)}. لا يصلح هذا إلا بعد تحديد أصحاب الفروض والديون والوصايا بواسطة مختص.`;
      } else if (type === 'hajj') {
        const goal = val(form,'goal'), saved = val(form,'saved'), months = Math.floor(val(form,'months'));
        text = months > 0 ? `المبلغ المتبقي: ${fmt(Math.max(0, goal-saved))}. الادخار الشهري المطلوب تقريباً: ${fmt(Math.max(0, goal-saved)/months)}.` : 'أدخل عدداً موجباً من الأشهر المتبقية.';
      } else if (type === 'mahr') {
        const gold = val(form,'goldGrams') * val(form,'goldPrice');
        const silver = val(form,'silverGrams') * val(form,'silverPrice');
        text = `قيمة الذهب التقديرية: ${fmt(gold)}. قيمة الفضة التقديرية: ${fmt(silver)}. أدخل الأسعار المحلية؛ ولا يوجد في هذه الأداة تقدير شرعي ملزم للمهر.`;
      } else if (type === 'qarz') {
        const amount = val(form,'amount'), monthly = val(form,'monthly');
        if (!monthly) text = 'أدخل مبلغاً شهرياً أكبر من صفر.';
        else text = `المدة التقديرية للسداد: ${fmt(Math.ceil(amount/monthly))} شهراً، دون احتساب أي زيادة أو فائدة.`;
      } else if (type === 'sadaqah') {
        const total = val(form,'monthly') * Math.floor(val(form,'months'));
        text = `إجمالي الصدقة التقديري خلال المدة: ${fmt(total)}.`;
      }
      out.textContent = text;
    });
  });
})();
