# Fan Favorite și Player of the Match automate din Instagram

Site-ul citește postările @fc__basarabia de 4 ori pe zi și pune automat în secțiunea
**„Jucători în formă”** cine a fost ales **Fan Favorite** și **Player of the Match**.
Golgheterul nu are nevoie de Instagram: vine din golurile de pe site-ul ligii.

## 1. Cum scrii postarea (important)

În descrierea postării trebuie să apară **cuvântul-cheie** și **numele jucătorului din lot**:

| Premiu | Cuvinte recunoscute | Exemplu |
|---|---|---|
| Fan Favorite | `Fan Favorite`, `#FanFavorite` | `🏆 Fan Favorite etapa 9: Danu Garbuz!` |
| Player of the Match | `Player of the Match`, `#POTM`, `Omul meciului`, `Jucătorul meciului` | `#POTM vs ZF Lifetec — Viorel Ciugureanu 🔥` |

- Numele poate fi scris oricum: „Danu Garbuz”, „GARBUZ DANU”, cu sau fără diacritice.
- Dacă descrierea are mai multe nume, se ia primul nume scris **după** cuvântul-cheie.
- Se ia mereu **cea mai recentă** postare pentru fiecare premiu.
- Adversarul („Player of the Match vs …”) se completează singur din ultimul meci jucat.

## 2. Configurare (o singură dată, ~15 minute)

Trebuie făcută de cineva care are acces la contul @fc__basarabia.

**a) Cont profesional.** În aplicația Instagram: Setări → Tipul contului și instrumente
→ *Treci la un cont profesional* (Creator sau Business). E gratuit și nu schimbă nimic vizibil.

**b) Aplicație Meta (doar pentru cheie).**
1. Intră pe [developers.facebook.com/apps](https://developers.facebook.com/apps) cu un cont Facebook.
2. **Create app** → la „use case” alege **Manage messaging & content on Instagram** → tip **Business** → creează.
3. În aplicație: **Instagram → API setup with Instagram login**.
4. La **Generate access tokens** apasă **Add account** și autentifică-te cu @fc__basarabia.
5. Apasă **Generate token** și copiază cheia (un text lung).

Aplicația poate rămâne în modul „Development”: citește doar contul vostru.

**c) Pune cheia în GitHub.** În repo: **Settings → Secrets and variables → Actions →
New repository secret**
- Name: `IG_ACCESS_TOKEN`
- Secret: cheia copiată

**d) Test.** **Actions → Actualizare site → Run workflow**. În câteva secunde
`src/data/instagram-auto.json` se actualizează și Vercel republică site-ul.

## 3. Dacă rularea apare cu roșu

Clasamentul se actualizează oricum. Roșul înseamnă doar că Instagram nu a răspuns,
de cele mai multe ori pentru că a expirat cheia. Scriptul o prelungește singur la fiecare rulare,
dar dacă totuși expiră, repeți pașii **b4–b5** și **c** cu o cheie nouă (înlocuiești secretul).

## Fără Instagram

Dacă nu e pusă nicio cheie, site-ul folosește ultimele valori din `src/data/instagram-auto.json`.
Le poți schimba și de mână, direct pe GitHub (editezi câmpul `name`).
