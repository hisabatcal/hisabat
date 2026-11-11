/* ============ GLOBAL CALCULATOR ENGINE ============ */
/* Automatically activates calculators in article content */
document.addEventListener('DOMContentLoaded', function() {
    var content = document;

    // Helper: Format Number
    function nf(n) { return Math.round(n).toLocaleString('en-PK'); }

    // Find all buttons in content
    var buttons = content.querySelectorAll('button');
    buttons.forEach(function(btn) {
        var text = btn.textContent.trim().toUpperCase();
        
        // 1a. HAJJ CALCULATOR
        if (text.indexOf('CALCULATE HAJJ') !== -1) {
            // Auto-update cost based on country/package
            var countrySel = document.getElementById('hajj-country');
            var packSel = document.getElementById('hajj-package');
            var costInp = document.getElementById('hajj-cost');
            
            var updateCost = function() {
                if(!countrySel || !packSel || !costInp) return;
                var baseCosts = {
                    'PKR': { economy: 900000, standard: 1200000, premium: 1800000, vip: 3000000 },
                    'INR': { economy: 400000, standard: 600000, premium: 1000000, vip: 1800000 },
                    'USD': { economy: 7000, standard: 10000, premium: 15000, vip: 25000 },
                    'GBP': { economy: 5500, standard: 8000, premium: 12000, vip: 20000 },
                    'AED': { economy: 18000, standard: 25000, premium: 40000, vip: 70000 },
                    'SAR': { economy: 8000, standard: 12000, premium: 20000, vip: 35000 }
                };
                var country = countrySel.value;
                var pack = packSel.value;
                if(baseCosts[country]) {
                    costInp.value = baseCosts[country][pack] || baseCosts[country].standard;
                }
            };
            
            if(countrySel) countrySel.addEventListener('change', updateCost);
            if(packSel) packSel.addEventListener('change', updateCost);

            btn.addEventListener('click', function(e) {
                e.preventDefault();
                var baseCost = parseFloat(document.getElementById('hajj-cost')?.value) || 1200000;
                var persons = parseInt(document.getElementById('hajj-persons')?.value) || 1;
                var saved = parseFloat(document.getElementById('hajj-saved')?.value) || 0;
                var targetYear = parseInt(document.getElementById('hajj-year')?.value) || 2027;
                var inflation = (parseFloat(document.getElementById('hajj-inflation')?.value) || 8) / 100;
                var extrasPct = (parseFloat(document.getElementById('hajj-extras')?.value) || 10) / 100;
                
                var years = targetYear - 2026;
                if (years < 0) years = 0;
                
                var futureCostPerPerson = baseCost * Math.pow(1 + inflation, years);
                var totalCost = (futureCostPerPerson * persons) * (1 + extrasPct);
                var need = totalCost - saved;
                var months = (years * 12) || 1;
                var monthly = need / months;

                var res = document.getElementById('hajj-result');
                if (res) {
                    res.style.display = 'block';
                    if (document.getElementById('hr-total')) document.getElementById('hr-total').textContent = 'Rs. ' + nf(totalCost);
                    if (document.getElementById('hr-monthly')) document.getElementById('hr-monthly').textContent = 'Rs. ' + nf(Math.max(0, monthly));
                    if (document.getElementById('hr-need')) document.getElementById('hr-need').textContent = 'Rs. ' + nf(Math.max(0, need));
                    if (document.getElementById('hr-year')) document.getElementById('hr-year').textContent = targetYear;
                }
            });
        }

        // 1b. REVERSE HAJJ CALCULATOR
        if (text.indexOf('CALCULATE TIMELINE') !== -1) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                var capacity = parseFloat(document.getElementById('rev-monthly')?.value) || 0;
                var target = parseFloat(document.getElementById('rev-target')?.value) || 1200000;
                var saved = parseFloat(document.getElementById('rev-saved')?.value) || 0;
                if (capacity <= 0) { alert("Please enter monthly savings capacity"); return; }
                var need = target - saved;
                var totalMonths = Math.ceil(need / capacity);
                if (totalMonths < 0) totalMonths = 0;
                
                var years = Math.floor(totalMonths / 12);
                var months = totalMonths % 12;
                
                var res = document.getElementById('rev-result');
                if (res) {
                    res.style.display = 'block';
                    var timeStr = "";
                    if (years > 0) timeStr += years + " Year" + (years > 1 ? "s " : " ");
                    if (months > 0) timeStr += months + " Month" + (months > 1 ? "s" : "");
                    if (totalMonths === 0) timeStr = "Now (Already Saved)";
                    
                    if (document.getElementById('rev-time')) document.getElementById('rev-time').textContent = timeStr;
                    if (document.getElementById('rev-detail')) document.getElementById('rev-detail').textContent = 'At Rs. ' + nf(capacity) + '/month, you will reach your goal in ' + totalMonths + ' months.';
                    
                    // Add target date calculation
                    var now = new Date();
                    now.setMonth(now.getMonth() + totalMonths);
                    var dateStr = "Estimated Date: " + now.toLocaleString('en-PK', { month: 'long', year: 'numeric' });
                    if (document.getElementById('rev-target-date')) document.getElementById('rev-target-date').textContent = dateStr;
                }
            });
        }

        // 1c. MEHR CALCULATOR
        if (text.indexOf('CALCULATE MEHR') !== -1) {
            var typeSel = document.getElementById('mh-type');
            var currSel = document.getElementById('mh-currency');
            var goldPr = document.getElementById('mh-goldprice');
            var silvPr = document.getElementById('mh-silverprice');
            
            var updatePrices = function() {
                if(!currSel || !goldPr || !silvPr) return;
                var p = { PKR: [23000, 280], INR: [7200, 95], USD: [85, 1.1], GBP: [65, 0.85], AED: [310, 4.2], SAR: [315, 4.3] };
                var vals = p[currSel.value] || p.PKR;
                goldPr.value = vals[0];
                silvPr.value = vals[1];
            };
            if(currSel) currSel.addEventListener('change', updatePrices);

            btn.addEventListener('click', function() {
                var type = typeSel?.value || 'fatimi';
                var gp = parseFloat(goldPr?.value) || 0;
                var sp = parseFloat(silvPr?.value) || 0;
                var weight = parseFloat(document.getElementById('mh-weight')?.value) || 10;
                var cash = parseFloat(document.getElementById('mh-cash')?.value) || 100000;
                var payment = document.getElementById('mh-payment')?.value || 'muajjal';
                var splitPct = (parseFloat(document.getElementById('mh-split-pct')?.value) || 50) / 100;

                var total = 0;
                var formula = "";
                var detail = "";

                if(type === 'fatimi') {
                    total = 1469.664 * sp;
                    formula = "1,469.664g Silver &times; Rate";
                    detail = "Based on 480 Dirhams of Silver (Sunnah of Hazrat Fatimah RA)";
                } else if(type === 'azwaj') {
                    total = 1530.9 * sp;
                    formula = "1,530.9g Silver &times; Rate";
                    detail = "Based on 500 Dirhams (Sunnah of Prophet's Wives)";
                } else if(type === 'minimum') {
                    total = 30.618 * sp;
                    formula = "30.618g Silver &times; Rate";
                    detail = "Based on 10 Dirhams (Hanafi Minimum)";
                } else if(type === 'gold') {
                    total = weight * gp;
                    formula = weight + "g Gold &times; Rate";
                } else if(type === 'silver') {
                    total = weight * sp;
                    formula = weight + "g Silver &times; Rate";
                } else {
                    total = cash;
                    formula = "Custom Fixed Amount";
                }

                var res = document.getElementById('mh-result');
                if(res) {
                    res.style.display = 'block';
                    if(document.getElementById('mh-total')) document.getElementById('mh-total').innerHTML = currSel.value + ' ' + nf(total);
                    if(document.getElementById('mh-formula')) document.getElementById('mh-formula').innerHTML = formula;
                    if(document.getElementById('mh-detail')) document.getElementById('mh-detail').innerHTML = detail;
                    
                    var now = total, later = 0;
                    if(payment === 'muwajjal') { now = 0; later = total; }
                    else if(payment === 'split') { now = total * splitPct; later = total - now; }
                    
                    if(document.getElementById('mh-now')) document.getElementById('mh-now').innerHTML = nf(now);
                    if(document.getElementById('mh-later')) document.getElementById('mh-later').innerHTML = nf(later);
                }
            });
        }

        // 1d. GOLD TO MEHR CONVERTER
        if (text.indexOf('CONVERT TO CASH VALUE') !== -1) {
            btn.addEventListener('click', function() {
                var weight = parseFloat(document.getElementById('gc-weight')?.value) || 0;
                var karat = parseInt(document.getElementById('gc-karat')?.value) || 24;
                var price = parseFloat(document.getElementById('gc-price')?.value) || 0;
                var pureWeight = weight * (karat / 24);
                var total = pureWeight * price;
                var res = document.getElementById('gc-result');
                if(res) {
                    res.style.display = 'block';
                    if(document.getElementById('gc-total')) document.getElementById('gc-total').innerHTML = nf(total);
                    if(document.getElementById('gc-detail')) document.getElementById('gc-detail').innerHTML = weight + "g (" + karat + "K) = " + pureWeight.toFixed(2) + "g Pure Gold";
                }
            });
        }

        // 1e. QARZ-E-HASANA CALCULATOR
        if (text.indexOf('CALCULATE REPAYMENT PLAN') !== -1) {
            btn.addEventListener('click', function() {
                var amount = parseFloat(document.getElementById('ql-amount')?.value) || 0;
                var period = document.getElementById('ql-period')?.value || '12';
                var months = (period === 'custom') ? (parseInt(document.getElementById('ql-custom-months')?.value) || 12) : parseInt(period);
                var income = parseFloat(document.getElementById('ql-income')?.value) || 1;
                var grace = parseInt(document.getElementById('ql-grace')?.value) || 0;

                var installment = amount / months;
                var incomePct = (installment / income) * 100;
                var interestSaved = amount * 0.20 * (months/12); // Sample 20% interest estimate

                var res = document.getElementById('ql-result');
                if(res) {
                    res.style.display = 'block';
                    if(document.getElementById('ql-installment')) document.getElementById('ql-installment').innerHTML = nf(installment);
                    if(document.getElementById('ql-total-repay')) document.getElementById('ql-total-repay').innerHTML = nf(amount);
                    if(document.getElementById('ql-income-pct')) document.getElementById('ql-income-pct').innerHTML = Math.round(incomePct) + '%';
                    if(document.getElementById('ql-interest-saved')) document.getElementById('ql-interest-saved').innerHTML = nf(interestSaved);
                }
            });
        }

        // 1f. RIBA VS HALAL COMPARISON
        if (text.indexOf('COMPARE RIBA VS HALAL') !== -1) {
            btn.addEventListener('click', function() {
                var amount = parseFloat(document.getElementById('rb-amount')?.value) || 0;
                var rate = (parseFloat(document.getElementById('rb-rate')?.value) || 20) / 100;
                var years = parseInt(document.getElementById('rb-years')?.value) || 3;
                var n = years * 12;
                var r = rate / 12;
                var emi = amount * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
                var bankTotal = emi * n;
                var halalTotal = amount;
                var res = document.getElementById('rb-result');
                if(res) {
                    res.style.display = 'block';
                    if(document.getElementById('rb-bank-total')) document.getElementById('rb-bank-total').innerHTML = nf(bankTotal);
                    if(document.getElementById('rb-halal-total')) document.getElementById('rb-halal-total').innerHTML = nf(halalTotal);
                    if(document.getElementById('rb-bank-detail')) document.getElementById('rb-bank-detail').innerHTML = "Total with " + (rate*100) + "% Interest";
                    if(document.getElementById('rb-halal-detail')) document.getElementById('rb-halal-detail').innerHTML = "Total Interest-Free Repayment";
                }
            });
        }

        // 1g. QURBANI CALCULATOR
        if (text.indexOf('CALCULATE QURBANI COST') !== -1) {
            btn.addEventListener('click', function() {
                var animal = document.getElementById('qb-animal')?.value || 'cow';
                var price = parseFloat(document.getElementById('qb-price')?.value) || 0;
                var shares = parseInt(document.getElementById('qb-shares')?.value) || 7;
                var myShares = parseInt(document.getElementById('qb-myshares')?.value) || 1;
                var animals = parseInt(document.getElementById('qb-animals')?.value) || 1;
                var extras = parseFloat(document.getElementById('qb-extras')?.value) || 0;

                var totalOne = price + extras;
                var perShare = totalOne / (animal === 'goat' || animal === 'sheep' ? 1 : shares);
                var myCost = perShare * myShares * animals;
                var allTotal = totalOne * animals;

                var res = document.getElementById('qb-result');
                if(res) {
                    res.style.display = 'block';
                    if(document.getElementById('qb-total')) document.getElementById('qb-total').innerHTML = nf(myCost);
                    if(document.getElementById('qb-pershare')) document.getElementById('qb-pershare').innerHTML = nf(perShare);
                    if(document.getElementById('qb-mycost')) document.getElementById('qb-mycost').innerHTML = nf(myCost);
                    if(document.getElementById('qb-alltotal')) document.getElementById('qb-alltotal').innerHTML = nf(allTotal);
                }
            });
        }

        // 1h. GROUP QURBANI SPLITTER
        if (text.indexOf('CALCULATE GROUP SHARES') !== -1) {
            btn.addEventListener('click', function() {
                var price = parseFloat(document.getElementById('gs-price')?.value) || 0;
                var extras = parseFloat(document.getElementById('gs-extras')?.value) || 0;
                var total = price + extras;
                var inputs = document.querySelectorAll('.gs-share-input');
                var totalShares = 0;
                inputs.forEach(i => totalShares += (parseInt(i.value) || 0));
                
                var perShare = total / (totalShares || 1);
                var detailHtml = "<table style='width:100%; font-size:13px; border-collapse:collapse;'>";
                var rows = document.querySelectorAll('#gs-list > div');
                rows.forEach((r, idx) => {
                    var name = r.querySelector('input[type=text]')?.value || ('Person ' + (idx+1));
                    var s = parseInt(r.querySelector('.gs-share-input')?.value) || 0;
                    detailHtml += `<tr style='border-bottom:1px solid #eee;'><td style='padding:8px;'>${name}</td><td style='padding:8px;'>${s} Share(s)</td><td style='padding:8px; text-align:right; font-weight:700;'>${nf(s * perShare)}</td></tr>`;
                });
                detailHtml += "</table>";
                
                var res = document.getElementById('gs-result');
                if(res) {
                    res.style.display = 'block';
                    if(document.getElementById('gs-detail')) document.getElementById('gs-detail').innerHTML = detailHtml;
                }
            });
        }

        // 1i. SADAQAH PLANNER
        if (text.indexOf('CALCULATE SADAQAH PLAN') !== -1) {
            btn.addEventListener('click', function() {
                var income = parseFloat(document.getElementById('sd-income')?.value) || 0;
                var pct = document.getElementById('sd-percent')?.value;
                var amount = (pct === 'custom') ? (parseFloat(document.getElementById('sd-custom')?.value) || 0) : (income * (parseInt(pct)/100));
                
                var res = document.getElementById('sd-result');
                if(res) {
                    res.style.display = 'block';
                    if(document.getElementById('sd-total')) document.getElementById('sd-total').innerHTML = nf(amount);
                    if(document.getElementById('sd-daily')) document.getElementById('sd-daily').innerHTML = nf(amount/30);
                    if(document.getElementById('sd-weekly')) document.getElementById('sd-weekly').innerHTML = nf(amount/4.33);
                    if(document.getElementById('sd-monthly')) document.getElementById('sd-monthly').innerHTML = nf(amount);
                    if(document.getElementById('sd-yearly')) document.getElementById('sd-yearly').innerHTML = nf(amount*12);
                }
            });
        }

        // 1j. SADAQAH JARIYAH IMPACT
        if (text.indexOf('CALCULATE JARIYAH IMPACT') !== -1) {
            btn.addEventListener('click', function() {
                var years = parseInt(document.getElementById('sj-years')?.value) || 1;
                var people = parseInt(document.getElementById('sj-people')?.value) || 1;
                var total = years * people * 365;
                var res = document.getElementById('sj-result');
                if(res) {
                    res.style.display = 'block';
                    if(document.getElementById('sj-total-impact')) document.getElementById('sj-total-impact').innerHTML = nf(total) + " Lives Touched";
                    if(document.getElementById('sj-detail')) document.getElementById('sj-detail').innerHTML = "Your contribution will provide " + nf(total) + " person-days of benefit over " + years + " years.";
                }
            });
        }

        // 1k. FIDYA/KAFFARAH CALCULATOR
        if (text.indexOf('CALCULATE PENALTY') !== -1 || text.indexOf('CALCULATE FIDYA') !== -1) {
            btn.addEventListener('click', function() {
                var type = document.getElementById('fk-type')?.value || 'fidya';
                var count = parseInt(document.getElementById('fk-count')?.value) || 1;
                var meal = parseFloat(document.getElementById('fk-meal')?.value) || 300;
                var total = (type === 'fidya') ? (count * meal) : (count * 60 * meal);
                var res = document.getElementById('result') || document.getElementById('fk-result');
                if(res) {
                    res.style.display = 'block';
                    var amtBox = document.getElementById('fk-amount');
                    if(amtBox) amtBox.innerHTML = nf(total);
                }
            });
        }

        // 2. FITRANA CALCULATOR
        if (text.indexOf('CALCULATE FITRANA') !== -1) {
            btn.addEventListener('click', function() {
                var members = parseInt(document.getElementById('fitr-members')?.value) || 1;
                var price = parseFloat(document.getElementById('fitr-commodity')?.value) || 350;
                var total = members * price;
                var res = document.getElementById('fitr-result');
                if (res) {
                    res.style.display = 'block';
                    if (document.getElementById('fitr-total')) document.getElementById('fitr-total').textContent = 'Rs. ' + nf(total);
                }
            });
        }

        // 3. QURBANI CALCULATOR
        if (text.indexOf('CALCULATE QURBANI') !== -1) {
            btn.addEventListener('click', function() {
                var price = parseFloat(document.getElementById('qb-price')?.value) || 0;
                var extras = parseFloat(document.getElementById('qb-extras')?.value) || 0;
                var animal = document.getElementById('qb-animal')?.value || 'cow';
                var totalShares = (animal === 'goat' || animal === 'sheep') ? 1 : 7;
                var myShares = parseInt(document.getElementById('qb-myshares')?.value) || 1;
                var count = parseInt(document.getElementById('qb-animals')?.value) || 1;

                var perShare = (price + extras) / totalShares;
                var myTotal = perShare * myShares * count;
                var allTotal = (price + extras) * count;

                var res = document.getElementById('qb-result');
                if (res) {
                    res.style.display = 'block';
                    if (document.getElementById('qb-total')) document.getElementById('qb-total').textContent = 'Rs. ' + nf(myTotal);
                    if (document.getElementById('qb-pershare')) document.getElementById('qb-pershare').textContent = 'Rs. ' + nf(perShare);
                    if (document.getElementById('qb-mycost')) document.getElementById('qb-mycost').textContent = 'Rs. ' + nf(myTotal);
                    if (document.getElementById('qb-alltotal')) document.getElementById('qb-alltotal').textContent = 'Rs. ' + nf(allTotal);
                }
            });
        }

        // 4. MEHR CALCULATOR
        if (text.indexOf('CALCULATE MEHR') !== -1) {
            btn.addEventListener('click', function() {
                var gWeight = parseFloat(document.getElementById('mh-goldprice')?.previousElementSibling?.value) || 0; // fallback if IDs are weird
                var gPrice = parseFloat(document.getElementById('mh-goldprice')?.value) || 240000;
                var cash = parseFloat(document.getElementById('mh-cash')?.value) || 0;
                var total = (gWeight * (gPrice/11.66)) + cash;
                
                var res = document.getElementById('mh-result');
                if (res) {
                    res.style.display = 'block';
                    if (document.getElementById('mh-total')) document.getElementById('mh-total').textContent = 'Rs. ' + nf(total);
                }
            });
        }
    });
});
</script>



