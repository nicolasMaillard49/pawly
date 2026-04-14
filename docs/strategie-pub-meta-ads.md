# Strategie Pub Geestock — Meta Ads

> Budget : 250EUR/mois (~8EUR/jour) | Plateforme : Meta Ads (Instagram focus) | Marche : France

---

## Pourquoi Meta Ads

| Critere | Meta Ads | TikTok Ads | Google Shopping |
|---------|----------|------------|-----------------|
| Budget min/jour | 5-10EUR | 20EUR/jour min | 15EUR/jour |
| Photos suffisantes ? | Oui | Non, video obligatoire | Oui |
| Niche sport/fitness | Excellente | Bonne | Faible intention de recherche |
| Retargeting | Le meilleur | Limite | Limite |

**Verdict** : a 250EUR/mois (~8EUR/jour), Meta est la seule option viable. TikTok exige 20EUR/j minimum par adset. Google Shopping ne marche que s'il y a de l'intention de recherche — personne ne tape "sac magnetique gourde" sur Google.

---

## Calcul de rentabilite

```
Prix de vente :          29,99EUR
Cout produit :           12EUR
Stripe fees :            ~1EUR
Livraison :              ~3EUR (ou inclus)
--------------------------------------
Marge avant pub :        ~14EUR

CPA max rentable :       ~7EUR (ROAS ~4.3x)
Avec 250EUR/mois :       ~36 ventes minimum pour etre rentable
```

---

## Structure de compte Meta Ads

```
CAMPAGNE 1 — [TEST] Prospection (CBO — 7EUR/jour)

  Adset A — Broad (0 ciblage, France, 18-45 ans)
    3 creatifs photo differents

  Adset B — Interets : fitness, musculation, running, salle de sport
    3 memes creatifs

  Adset C — Interets : gourde, hydratation, accessoires sport
    3 memes creatifs

CAMPAGNE 2 — [RETARGETING] Visiteurs (1EUR/jour)

  Adset A — Visiteurs du site 0-14j (exclure acheteurs)
    Creatif avec preuve sociale + urgence
```

> Budget total : **8EUR/jour = 240EUR/mois** (marge de 10EUR restante)

---

## Creatifs avec photos

### Creatif 1 — Probleme/Solution (carrousel 1:1)

```
Slide 1 : "Tu galeres a porter ta gourde en salle ?" (photo situation frustrante)
Slide 2 : Photo produit en action
Slide 3 : Gros plan fixation magnetique
Slide 4 : "29,99EUR au lieu de 49,99EUR — Livraison gratuite"
```

### Creatif 2 — Visuel produit simple (image 1:1)

```
Photo lifestyle du produit porte
Texte sur l'image : "Se fixe en 1 seconde"
Overlay promo : "-40% aujourd'hui"
```

### Creatif 3 — Benefices multiples (carrousel)

```
Slide 1 : Hook visuel accrocheur
Slide 2 : "Magnetique — se fixe partout"
Slide 3 : "Resiste a 2kg"
Slide 4 : "Compatible toutes gourdes"
Slide 5 : CTA + prix barre
```

### Texte d'annonce (structure AIDA)

```
Ta gourde qui tombe en plein set, c'est fini.

Le sac Geestock se fixe magnetiquement a n'importe quelle
surface metallique. Machine, rack, casier — 1 seconde, zero effort.

- Aimant ultra-puissant
- Compatible toutes gourdes
- Matiere impermeable

Livraison offerte — Stock limite
29,99EUR au lieu de 49,99EUR
```

---

## Protocole de test (semaines 1-2)

```
Jour 1-4 : Lance les 3 adsets avec 3 creatifs chacun (7EUR/j)
           NE TOUCHE A RIEN. Laisse l'algo apprendre.

Jour 5 :   Analyse les resultats :
           - CTR < 0.8%  -> ce creatif est mort, coupe-le
           - CTR > 1.5%  -> gagnant potentiel, garde-le

Jour 7 :   Coupe les adsets perdants. Garde le(s) meilleur(s).
           Realloue le budget sur ce qui marche.

Jour 8-14 : Accumule des donnees de conversion.
           - 0 vente apres 50EUR depenses = probleme d'offre ou de landing page
           - 3+ ventes = produit valide, passer au scaling
```

---

## Metriques cles et seuils de decision

| Metrique | Mauvais | Acceptable | Bon |
|----------|---------|------------|-----|
| CTR (lien) | < 0.8% | 0.8-1.5% | > 1.5% |
| CPM France | > 15EUR | 10-15EUR | < 10EUR |
| CVR (visite -> achat) | < 1% | 1-2% | > 2% |
| ROAS (7j) | < 2x | 2-3x | > 3x |
| Frequence | > 4 | 2-4 | < 3 |

### Regles de decision

```
Si CTR < 0.8%              -> Changer le creatif en priorite
Si CTR bon mais CVR faible  -> Probleme sur la landing page ou le prix
Si ROAS < 2x sur 7j        -> Couper l'adset, ne pas attendre
Si ROAS > 3x sur 7j        -> Augmenter le budget de 20% max (pas doubler)
Si frequence > 4            -> Audience epuisee, rafraichir les creatifs
```

---

## Plan de scaling

### Phase 1 — ROAS > 3x sur 7 jours consecutifs

- Augmenter le budget de 20% max par jour (pas doubler d'un coup)
- Passer de 8EUR/j a 10EUR, puis 12EUR, puis 15EUR...

### Phase 2 — ROAS > 3x stable sur 14 jours

- Monter a 500EUR/mois en confiance
- Ajouter une campagne LAL (Lookalike) basee sur les acheteurs
- Investir dans 1-2 videos UGC (recuperer celles de TikTok ou commander sur Fiverr ~30EUR)

### Phase 3 — ROAS > 3x stable sur 30 jours

- Ouvrir TikTok Ads en parallele avec les videos UGC
- Repartition : Meta 70% / TikTok 30%

---

## Prerequis avant de depenser 1EUR

1. **Mettre le site en ligne** (DB PostgreSQL + Stripe fonctionnels)
2. **Installer le Pixel Meta** + configurer les evenements (ViewContent, AddToCart, InitiateCheckout, Purchase)
3. **Tester le tunnel d'achat complet** soi-meme (commande test Stripe -> confirmation -> tout marche)

**Sans ces 3 etapes, chaque euro en pub est un euro donne a Meta pour rien.**

---

*Strategie elaboree le 2026-03-26 — A reviser apres les 14 premiers jours de campagne.*
