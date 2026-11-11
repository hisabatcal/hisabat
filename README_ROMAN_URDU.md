# Hisabat site — upload guide (Roman Urdu)

## Repo mein files kahan rakhni hain

1. ZIP extract karo. `hisabat-site` folder ko khol kar **andar ka tamam content** GitHub repo ke root (`main` branch ke top level) par upload karo. `hisabat-site` naam ka parent folder upload mat karna.
2. Tumhare current repo mein `index.html` aur `CNAME` hain; package wali files se unhein replace/overwrite karna. `CNAME` ka content `hisabat.mkm.fan` hai.
3. GitHub Settings → Pages mein `Deploy from a branch`, branch `main`, folder `/(root)` select karke Save karo.

## Articles aur tiles

Is version mein 11 Arabic articles hain; har article ka alag post page hai, aur har ek homepage aur blog page par apni tile/card se link hota hai. Article text 500+ Arabic words ka hai aur related articles/calculators ke internal links rakhta hai.

## CNAME do jagah hota hai

- Repo ka `CNAME` file: is ZIP ke root mein hai. Yeh GitHub Pages ko custom domain batata hai.
- DNS ka CNAME record: domain ke DNS provider ke panel mein hota hai; woh is ZIP mein nahi ban sakta. Host/Name `hisabat`, Target `hisabatcal.github.io` (repo ka `/hisabat` path nahi). Maujooda DNS record pehle check karo—usi host par purana A record ho to use samajh kar hi badlo.

## Admin aur file upload

`admin/` page GitHub ke official authenticated editor/upload page ke shortcuts deta hai. Sirf repo mein write permission wale account hi posts/files commit kar sakte hain. Posts `_posts/` mein Markdown file bana kar add hoti hain; `ads.txt` aur Google verification file site root mein upload hoti hain.

## Ads

`ads.js` script har HTML page mein shamil hai. Is waqt ad client/slot khali hain; apne AdSense publisher ID aur slot ID ke baghair koi ad nahi chalega. Fake ID na daalo.

## Ma'loomati ehtiyaat

Site ka visible content Arabic hai. Calculators browser mein andazan hisaab karte hain; zakat aur inheritance ke liye specialist se tasdeeq zaroori hai.
