import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Données simulées pour la bibliothèque
const LIBRARY_DATA = [
  {
    id: "vni",
    name: "Ventilation Non Invasive (VNI)",
    brands: [
      {
        id: "resmed-vni",
        name: "ResMed",
        logo: "/logos/resmed.png",
        models: [
          { id: "aircurve-10", name: "AirCurve 10", failures: [{
            title: "Alarme 'Pression faible' ou 'Pression basse'",
            cause: "Fuite importante dans le circuit, masque mal ajusté, ou problème de la turbine.",
            solutionsPatient: [
              "Est-ce que ça sonne tout le temps, ou juste quand vous vous tournez dans le lit ?",
              "Vous sentez de l'air qui s'échappe près de vos yeux ou de votre bouche ? Ça fait un sifflement ?"
            ],
            solutionsTech: [
              "Guidez le patient pour utiliser la fonction 'Ajustement du masque' (Mask Fit) disponible dans le menu patient pour visualiser l'étanchéité.",
              "Accédez au menu clinicien et vérifiez que la pression prescrite (IPAP/EPAP) correspond à l'ordonnance.",
              "Entrez dans le menu de service pour lancer un test de la turbine et vérifier que la pression mesurée correspond à la pression de consigne."
            ]
          }] },
          { id: "lumis-150", name: "Lumis 150", failures: [{
            title: "L'appareil ne détecte pas la respiration (pas de trigger)",
            cause: "Masque mal ajusté, fuites, ou mauvais réglage de la sensibilité du trigger.",
             solutionsPatient: [
              "Si vous forcez un peu l'inspiration, est-ce que la machine se déclenche ?",
              "C'est arrivé juste après avoir changé de masque ou touché un bouton ?"
            ],
            solutionsTech: [
              "Accédez au menu clinicien. Diminuez le réglage de sensibilité du trigger inspiratoire (ex: passez de 'Moyen' à 'Élevé') pour que l'appareil détecte des efforts plus faibles.",
              "Vérifiez le réglage de la 'Rampe'. Si elle est active, désactivez-la temporairement pour tester le déclenchement à la pression prescrite.",
              "Assurez-vous que le trigger expiratoire (Cycle) n'est pas réglé sur une valeur trop élevée (trop sensible), ce qui pourrait interrompre le cycle prématurément."
            ]
          }] }
        ]
      },
      {
        id: "philips-respironics",
        name: "Philips Respironics",
        logo: "/logos/philips.png",
        models: [{
          id: "trilogy-evo",
          name: "Trilogy Evo",
          failures: [{
            title: "L'appareil ne s'allume pas",
            cause: "Problème d'alimentation externe, batterie déchargée/défectueuse, ou panne matérielle interne.",
            solutionsPatient: [
              "Quand vous appuyez sur le bouton, est-ce que l'écran s'allume, même une seconde ?",
              "Est-ce que l'appareil est tombé, a pris l'eau, ou y'a eu une coupure de courant juste avant la panne ?",
              "C'était quand la dernière fois qu'il a bien marché ?",
              "Est-ce que vous êtes dehors avec l'appareil ?"
            ],
            solutionsTech: [
              "Si disponible, utilisez un bloc d'alimentation et un câble d'un autre appareil identique pour écarter un problème d'alimentation externe.",
              "Si l'appareil a une batterie amovible, retirez-la. Branchez l'appareil sur secteur et essayez de démarrer. Si ça marche, la batterie est défectueuse.",
              "Si rien ne fonctionne, une panne de la carte mère ou d'un composant interne est probable. L'appareil nécessite une intervention en atelier."
            ]
          }]
        }]
      }
    ]
  },
  {
    id: "vaa",
    name: "Ventilation Assistée (VAA)",
    brands: [{
        id: "draeger-vaa",
        name: "Dräger",
        logo: "/logos/draeger.png",
        models: [{
            id: "evita-v300",
            name: "Evita V300",
            failures: [{
                title: "Alarme 'Pression voies aériennes haute' (Paw haute)",
                cause: "Obstruction dans le circuit patient, toux du patient, encombrement bronchique, ou mauvais réglages.",
                solutionsPatient: [
                  "L'alarme sonne en continu, ou seulement quand le patient tousse ?",
                  "Sur l'écran, le chiffre de la pression monte à combien juste avant que ça sonne ?"
                ],
                solutionsTech: [
                  "Sur l'écran du ventilateur, vérifiez le réglage de l'alarme 'Pression Max'. Assurez-vous qu'il est réglé environ 10 cmH2O au-dessus de la pression de crête (Ppeak) habituelle du patient.",
                  "Lancez la procédure de 'Test du circuit' ou 'Calibration du circuit' depuis le menu de service pour vérifier sa compliance et sa résistance.",
                  "Si le problème persiste sans cause évidente, calibrez les capteurs de pression et de débit."
                ]
            }]
        }]
    }]
  },
  {
    id: "ppc",
    name: "Pression Positive Continue (PPC)",
    brands: [
      {
        id: "resmed-ppc",
        name: "ResMed",
        logo: "/logos/resmed.png",
        models: [
          { 
            id: "airsense-10", 
            name: "AirSense 10", 
            failures: [
              {
                title: "Fuites de masque importantes",
                cause: "Mauvais ajustement du masque, coussin usé, ou mauvaise taille de masque.",
                solutionsPatient: [
                  "La partie en silicone de votre masque, vous l'avez changée quand pour la dernière fois ?",
                  "Ça fuit surtout quand vous dormez sur le côté, ou sur le dos ?"
                ],
                solutionsTech: [
                  "Examinez le coussin en silicone du masque. Recherchez des déchirures, des fissures ou une perte de souplesse. S'il est usé, il doit être remplacé.",
                  "Utilisez le gabarit de taille du fabricant pour confirmer que le patient a la bonne taille de masque. Un masque trop grand ou trop petit fuira toujours.",
                  "Si les fuites persistent malgré tout, proposez au patient d'essayer un masque d'un autre type ou d'une autre marque."
                ]
              }
            ] 
          }
        ]
      }
    ]
  },
  {
    id: "aspiration",
    name: "Aspirateurs de mucosités",
    brands: [
      {
        id: "laerdal",
        name: "Laerdal",
        logo: "/logos/laerdal.png",
        models: [
          { 
            id: "lcs-u4", 
            name: "LCSU 4", 
            failures: [
              {
                title: "Faible aspiration ou pas d'aspiration",
                cause: "Manomètre mal réglé, tuyauterie bouchée ou mal connectée, bocal plein, batterie faible.",
                solutionsPatient: [
                  "Sur votre machine il y a un manomètre, est-ce que l'aiguille va sur la gauche ?",
                  "Quand la machine tourne, est-ce que vous entendez de l'air qui sort quelque part ?",
                  "Le petit filtre blanc, il a l'air sale ou vieux ?"
                ],
                solutionsTech: [
                  "Démontez et inspectez toute la tuyauterie à la recherche d'un bouchon ou d'une fissure.",
                  "Testez l'aspiration directement à la sortie de la machine (sans le bocal) pour isoler le problème.",
                  "Vérifiez le filtre antibactérien, il peut être colmaté et doit être remplacé.",
                  "Si la batterie est suspectée, testez l'appareil sur secteur uniquement. Si l'aspiration est bonne, la batterie est à remplacer."
                ]
              },
              {
                title: "L'appareil ne démarre pas",
                cause: "Batterie complètement déchargée, problème d'alimentation, fusible interne grillé.",
                solutionsPatient: [
                    "Quand vous le branchez sur la prise, est-ce qu'il y a une petite lumière qui s'allume ?",
                    "Ça fait longtemps qu'il n'a pas servi ou qu'il n'a pas été chargé ?",
                    "Est-ce que vous êtes dehors avec l'appareil ?"
                ],
                solutionsTech: [
                    "Testez avec un autre chargeur compatible si disponible.",
                    "Vérifiez le compartiment batterie. Assurez-vous que la batterie est bien connectée.",
                    "Si l'appareil a un fusible accessible, vérifiez-le et remplacez-le si nécessaire.",
                    "Si rien ne fonctionne, une intervention interne est requise."
                ]
              }
            ] 
          }
        ]
      }
    ]
  },
  {
    id: "o2",
    name: "O₂",
    subTypes: [
      {
        id: "bouteille-o2",
        name: "Bouteilles d'O₂",
        models: [
          {
            id: "b15", name: "Bouteille B15", failures: [
              { title: "Débit irrégulier", cause: "Régulateur bloqué.", solutionsPatient: ["Le bouton du régulateur est-il dur à tourner ou coincé ?"], solutionsTech: ["Nettoyer ou remplacer le régulateur."] },
              { title: "Fuite", cause: "Joint valve usé.", solutionsPatient: ["Entendez-vous un sifflement (pshhh) au niveau de la valve ?", "Sentez-vous de l'air sortir ?"], solutionsTech: ["Remplacer le joint."] }
            ]
          },
          {
            id: "b2", name: "Bouteille B2", failures: [
              { title: "Débit irrégulier", cause: "Régulateur bloqué.", solutionsPatient: ["Le bouton du régulateur est-il dur à tourner ou coincé ?"], solutionsTech: ["Nettoyer ou remplacer le régulateur."] },
              { title: "Fuite", cause: "Joint valve usé.", solutionsPatient: ["Entendez-vous un sifflement (pshhh) au niveau de la valve ?", "Sentez-vous de l'air sortir ?"], solutionsTech: ["Remplacer le joint."] }
            ]
          },
          {
            id: "b5", name: "Bouteille B5", failures: [
              { title: "Débit irrégulier", cause: "Régulateur bloqué.", solutionsPatient: ["Le bouton du régulateur est-il dur à tourner ou coincé ?"], solutionsTech: ["Nettoyer ou remplacer le régulateur."] },
              { title: "Fuite", cause: "Joint valve usé.", solutionsPatient: ["Entendez-vous un sifflement (pshhh) au niveau de la valve ?", "Sentez-vous de l'air sortir ?"], solutionsTech: ["Remplacer le joint."] }
            ]
          },
          {
            id: "oxalys", name: "Oxalys", failures: [
              { title: "Débit irrégulier", cause: "Régulateur bloqué.", solutionsPatient: ["Le bouton du régulateur est-il dur à tourner ou coincé ?"], solutionsTech: ["Nettoyer ou remplacer le régulateur."] },
              { title: "Fuite", cause: "Joint valve usé.", solutionsPatient: ["Entendez-vous un sifflement (pshhh) au niveau de la valve ?", "Sentez-vous de l'air sortir ?"], solutionsTech: ["Remplacer le joint."] }
            ]
          },
          {
            id: "ifill", name: "Bouteille IFILL", failures: [
              { title: "Fuite bouteille ou robinet", cause: "Serrage incorrect.", solutionsPatient: ["La bouteille semble-t-elle bien serrée ?", "Pouvez-vous la resserrer légèrement ?"], solutionsTech: ["Contrôler le serrage."] },
              { title: "Fuite (joint)", cause: "Joint défectueux.", solutionsPatient: ["Entendez-vous de l'air s'échapper malgré un bon serrage ?"], solutionsTech: ["Remplacer le joint."] }
            ]
          }
        ]
      },
      {
        id: "concentrateur",
        name: "Concentrateur",
        subTypes: [
          {
            id: "fixe",
            name: "Fixe",
            models: [
                { id: "1025ks", name: "Concentrateur 10L (GCE / 1025KS)", failures: [
                    { title: "Débit faible", cause: "Filtre sale.", solutionsPatient: ["Le filtre à air est-il noir ou poussiéreux ?"], solutionsTech: ["Nettoyage filtre."] },
                    { title: "Bruit moteur", cause: "Compresseur fatigué.", solutionsPatient: ["L'appareil fait-il un bruit de claquement ou inhabituel ?"], solutionsTech: ["Maintenance moteur."] }
                ] },
                { id: "525ks", name: "Concentrateur 5L (525KS)", failures: [
                    { title: "Alarme surchauffe", cause: "Ventilation obstruée.", solutionsPatient: ["Est-ce que l'appareil est collé contre un mur ou un rideau ?", "Les grilles d'aération sont-elles propres ?"], solutionsTech: ["Nettoyer ventilation."] },
                    { title: "Arrêt automatique", cause: "Capteurs HS.", solutionsPatient: ["L'appareil s'arrête-t-il tout seul sans raison apparente ?"], solutionsTech: ["Remplacer capteurs."] }
                ] },
                { id: "8f-5a", name: "Concentrateur 5L (8F-5A)", failures: [
                    { title: "Alarme surchauffe", cause: "Ventilation obstruée.", solutionsPatient: ["Est-ce que l'appareil est collé contre un mur ou un rideau ?", "Les grilles d'aération sont-elles propres ?"], solutionsTech: ["Nettoyer ventilation."] },
                    { title: "Arrêt automatique", cause: "Capteurs HS.", solutionsPatient: ["L'appareil s'arrête-t-il tout seul sans raison apparente ?"], solutionsTech: ["Remplacer capteurs."] }
                ] },
                { id: "everflo", name: "Concentrateur EverFlo", failures: [
                    { title: "Débit irrégulier", cause: "Compresseur usé.", solutionsPatient: ["Sentez-vous que l'air n'arrive pas régulièrement ?"], solutionsTech: ["Maintenance compresseur."] },
                    { title: "Bruit pompe", cause: "Humidité.", solutionsPatient: ["Y a-t-il de l'eau dans le tuyau ?", "La pièce est-elle humide ?"], solutionsTech: ["Déshumidificateur si nécessaire."] }
                ] },
                { id: "everflo-pediatrique", name: "Concentrateur EverFlo Pédiatrique", failures: [
                    { title: "Débit irrégulier", cause: "Compresseur usé.", solutionsPatient: ["Sentez-vous que l'air n'arrive pas régulièrement ?"], solutionsTech: ["Maintenance compresseur."] },
                    { title: "Bruit pompe", cause: "Humidité.", solutionsPatient: ["Y a-t-il de l'eau dans le tuyau ?", "La pièce est-elle humide ?"], solutionsTech: ["Déshumidificateur si nécessaire."] }
                ] },
                { id: "igo2-fixe", name: "Concentrateur iGo 2 (Mode Fixe)", failures: [
                     { title: "Alarme", cause: "Batterie faible.", solutionsPatient: ["Le voyant batterie est-il allumé ?", "Est-il bien branché sur le secteur ?"], solutionsTech: ["Remplacer batterie."] },
                     { title: "Arrêt soudain", cause: "Surchauffe.", solutionsPatient: ["L'appareil est-il chaud au toucher ?", "Les aérations sont-elles libres ?"], solutionsTech: ["Vérifier ventilation."] }
                ] }
            ]
          },
          {
            id: "portable",
            name: "Portable",
            models: [
                { id: "inogen-g3", name: "Inogen One G3", failures: [
                    { title: "Batterie faible", cause: "Batterie vieillissante.", solutionsPatient: ["La batterie tient-elle la charge ?", "Est-ce que vous êtes dehors avec l'appareil ?"], solutionsTech: ["Remplacer batterie."] },
                    { title: "Débit irrégulier", cause: "Filtre bouché.", solutionsPatient: ["Le filtre est-il propre ?"], solutionsTech: ["Nettoyer filtre."] }
                ] },
                { id: "inogen-g4", name: "Inogen One G4", failures: [
                    { title: "Batterie faible", cause: "Batterie vieillissante.", solutionsPatient: ["La batterie tient-elle la charge ?", "Est-ce que vous êtes dehors avec l'appareil ?"], solutionsTech: ["Remplacer batterie."] },
                    { title: "Débit irrégulier", cause: "Filtre bouché.", solutionsPatient: ["Le filtre est-il propre ?"], solutionsTech: ["Nettoyer filtre."] }
                ] },
                { id: "inogen-g5", name: "Inogen One G5", failures: [
                    { title: "Batterie faible", cause: "Batterie vieillissante.", solutionsPatient: ["La batterie tient-elle la charge ?", "Est-ce que vous êtes dehors avec l'appareil ?"], solutionsTech: ["Remplacer batterie."] },
                    { title: "Débit irrégulier", cause: "Filtre bouché.", solutionsPatient: ["Le filtre est-il propre ?"], solutionsTech: ["Nettoyer filtre."] }
                ] },
                { id: "inogen-rove", name: "Inogen Rove 6", failures: [
                    { title: "Batterie faible", cause: "Batterie vieillissante.", solutionsPatient: ["La batterie tient-elle la charge ?", "Est-ce que vous êtes dehors avec l'appareil ?"], solutionsTech: ["Remplacer batterie."] },
                    { title: "Débit irrégulier", cause: "Filtre bouché.", solutionsPatient: ["Le filtre est-il propre ?"], solutionsTech: ["Nettoyer filtre."] }
                ] },
                { id: "simplygo-mini", name: "SimplyGo Mini", failures: [
                    { title: "Alarme surchauffe", cause: "Filtre sale.", solutionsPatient: ["Le filtre est-il propre ?", "Est-ce que vous êtes dehors avec l'appareil ?"], solutionsTech: ["Nettoyage filtre."] },
                    { title: "Perte débit", cause: "Ventilation insuffisante.", solutionsPatient: ["Est-ce que le sac de transport bouche les aérations ?", "L'appareil respire-t-il bien ?"], solutionsTech: ["Ne pas obstruer aérations."] }
                ] },
                { id: "simplygo-mini-ld", name: "SimplyGo Mini (Longue Durée)", failures: [
                    { title: "Alarme surchauffe", cause: "Filtre sale.", solutionsPatient: ["Le filtre est-il propre ?", "Est-ce que vous êtes dehors avec l'appareil ?"], solutionsTech: ["Nettoyage filtre."] },
                    { title: "Perte débit", cause: "Ventilation insuffisante.", solutionsPatient: ["Est-ce que le sac de transport bouche les aérations ?", "L'appareil respire-t-il bien ?"], solutionsTech: ["Ne pas obstruer aérations."] }
                ] },
                { id: "zen-o-lite", name: "Zen-O Lite", failures: [
                    { title: "Débit faible", cause: "Pompe défectueuse.", solutionsPatient: ["L'appareil fait-il un bruit anormal ?"], solutionsTech: ["Maintenance pompe."] },
                    { title: "Bruit pompe", cause: "Batterie faible.", solutionsPatient: ["La batterie est-elle bien chargée ?", "Est-ce que vous êtes dehors avec l'appareil ?"], solutionsTech: ["Remplacer batterie."] }
                ] },
                { id: "freestyle", name: "FreeStyle Comfort", failures: [
                    { title: "Fuite d’air", cause: "Connectique mal serrée.", solutionsPatient: ["Le tuyau est-il bien clipsé ?"], solutionsTech: ["Vérifier connexions."] },
                    { title: "Alarme système", cause: "Joint usé.", solutionsPatient: ["Voyez-vous un message d'erreur sur l'écran ?"], solutionsTech: ["Remplacer joint."] }
                ] }
            ]
          },
          {
            id: "transportable",
            name: "Transportable",
            models: [
                { id: "eclipse-3", name: "Eclipse 3", failures: [
                    { title: "Batterie faible", cause: "Batterie vieillissante.", solutionsPatient: ["La batterie tient-elle la charge ?", "Est-ce que vous êtes dehors avec l'appareil ?"], solutionsTech: ["Remplacer batterie."] },
                    { title: "Débit irrégulier", cause: "Filtre bouché.", solutionsPatient: ["Le filtre à air est-il propre ?"], solutionsTech: ["Nettoyer filtre."] }
                ] },
                { id: "eclipse-5", name: "Eclipse 5", failures: [
                    { title: "Alarme surchauffe", cause: "Filtre sale.", solutionsPatient: ["Le filtre à air est-il propre ?", "Est-ce que vous êtes dehors avec l'appareil ?"], solutionsTech: ["Nettoyage filtre."] },
                    { title: "Perte débit", cause: "Ventilation insuffisante.", solutionsPatient: ["L'appareil est-il bien ventilé ?", "Rien ne bouche les entrées d'air ?"], solutionsTech: ["Ne pas obstruer aérations."] }
                ] },
                { id: "simplygo", name: "SimplyGo (Standard)", failures: [
                    { title: "Débit faible", cause: "Pompe défectueuse.", solutionsPatient: ["Sentez-vous moins d'air sortir ?"], solutionsTech: ["Maintenance pompe."] },
                    { title: "Bruit pompe", cause: "Batterie faible.", solutionsPatient: ["La batterie est-elle bien chargée ?", "Est-ce que vous êtes dehors avec l'appareil ?"], solutionsTech: ["Remplacer batterie."] }
                ] },
                { id: "zen-o", name: "Zen-O (Double batterie)", failures: [
                    { title: "Fuite d’air", cause: "Connectique mal serrée.", solutionsPatient: ["Le tuyau est-il bien branché ?"], solutionsTech: ["Vérifier connexions."] },
                    { title: "Alarme système", cause: "Joint usé.", solutionsPatient: ["Voyez-vous un message d'erreur ?"], solutionsTech: ["Remplacer joint."] }
                ] }
            ] 
          }
        ]
      },
      { 
        id: "o2-liquide", 
        name: "O₂ Liquide", 
        models: [
              { id: "companion-1000", name: "Portable Companion 1000", failures: [
                  { title: "Pas de débit", causes: ["Thermostat défectueux", "Valve gelée"], solutionsPatient: ["Sentez-vous de l'air sortir ?", "Voyez-vous du givre sur la valve ?"], solutionsTech: ["Remplacer thermostat.", "Décongélation valve."] },
                  { title: "Panne (Indicateur)", cause: "Capteur HS", solutionsPatient: ["L'indicateur de niveau fonctionne-t-il ?"], solutionsTech: ["Remplacement capteur."] }
              ] },
              { id: "companion-t", name: "Portable Companion 1000T", failures: [
                  { title: "Pas de débit", causes: ["Thermostat défectueux", "Valve gelée"], solutionsPatient: ["Sentez-vous de l'air sortir ?", "Voyez-vous du givre sur la valve ?"], solutionsTech: ["Remplacer thermostat.", "Décongélation valve."] },
                  { title: "Panne (Indicateur)", cause: "Capteur HS", solutionsPatient: ["L'indicateur de niveau fonctionne-t-il ?"], solutionsTech: ["Remplacement capteur."] }
              ] },
              { id: "companion-500", name: "Portable Companion 500", failures: [
                  { title: "Pas de débit", causes: ["Thermostat défectueux", "Valve gelée"], solutionsPatient: ["Sentez-vous de l'air sortir ?", "Voyez-vous du givre sur la valve ?"], solutionsTech: ["Remplacer thermostat.", "Décongélation valve."] },
                  { title: "Panne (Indicateur)", cause: "Capteur HS", solutionsPatient: ["L'indicateur de niveau fonctionne-t-il ?"], solutionsTech: ["Remplacement capteur."] }
              ] },
              { id: "sprint", name: "Companion Sprint", failures: [
                  { title: "Fuite de liquide", cause: "Joint usé.", solutionsPatient: ["Voyez-vous du liquide couler ?"], solutionsTech: ["Vérifier et remplacer joint."] },
                  { title: "Faible autonomie", cause: "Remplissage incorrect.", solutionsPatient: ["Remplissez-vous bien jusqu'à saturation (crachement) ?"], solutionsTech: ["Former utilisateur.", "Corriger remplissage."] }
              ] },
              { id: "stroller", name: "Companion Stroller", failures: [
                  { title: "Fuite de liquide", cause: "Joint usé.", solutionsPatient: ["Voyez-vous du liquide couler ?"], solutionsTech: ["Vérifier et remplacer joint."] },
                  { title: "Faible autonomie", cause: "Remplissage incorrect.", solutionsPatient: ["Remplissez-vous bien jusqu'à saturation (crachement) ?"], solutionsTech: ["Former utilisateur.", "Corriger remplissage."] }
              ] },
              { id: "freelox-05", name: "Freelox 0.5L", failures: [
                  { title: "Blocage de vapeur", cause: "Tube de vapeur bouché.", solutionsPatient: ["Le tube est-il plié ?"], solutionsTech: ["Nettoyage tube de vapeur."] },
                  { title: "Alarme température", cause: "Stockage inadapté.", solutionsPatient: ["Le portable est-il bien stocké à la verticale ?"], solutionsTech: ["Respecter position verticale et stockage recommandé."] }
              ] },
              { id: "freelox-12", name: "Freelox 1.2L", failures: [
                  { title: "Blocage de vapeur", cause: "Tube de vapeur bouché.", solutionsPatient: ["Le tube est-il plié ?"], solutionsTech: ["Nettoyage tube de vapeur."] },
                  { title: "Alarme température", cause: "Stockage inadapté.", solutionsPatient: ["Le portable est-il bien stocké à la verticale ?"], solutionsTech: ["Respecter position verticale et stockage recommandé."] }
              ] },
              { id: "joggy", name: "Joggy", failures: [
                  { title: "Blocage de vapeur", cause: "Tube de vapeur bouché.", solutionsPatient: ["Le tube est-il plié ?"], solutionsTech: ["Nettoyage tube de vapeur."] },
                  { title: "Alarme température", cause: "Stockage inadapté.", solutionsPatient: ["Le portable est-il bien stocké à la verticale ?"], solutionsTech: ["Respecter position verticale et stockage recommandé."] }
              ] },
              { id: "helios-h300", name: "Helios H300", failures: [
                  { title: "Débit irrégulier", causes: ["Pompe usée", "Bulles dans liquide"], solutionsPatient: ["Entendez-vous un bruit irrégulier ?", "Avez-vous secoué l'appareil ?"], solutionsTech: ["Remplacer pompe.", "Purger système."] },
                  { title: "Bruit pompe", cause: "Bulles dans liquide.", solutionsPatient: ["Entendez-vous un bruit de pompe inhabituel ?"], solutionsTech: ["Purger système."] }
              ] },
              { id: "helios-marathon", name: "Helios Marathon 850", failures: [
                  { title: "Débit irrégulier", causes: ["Pompe usée", "Bulles dans liquide"], solutionsPatient: ["Entendez-vous un bruit irrégulier ?", "Avez-vous secoué l'appareil ?"], solutionsTech: ["Remplacer pompe.", "Purger système."] },
                  { title: "Bruit pompe", cause: "Bulles dans liquide.", solutionsPatient: ["Entendez-vous un bruit de pompe inhabituel ?"], solutionsTech: ["Purger système."] }
              ] },
              { id: "hi-flow-stroller", name: "Hi Flow Stroller", failures: [
                  { title: "Débit insuffisant", cause: "Régulateur bloqué.", solutionsPatient: ["Le bouton de réglage tourne-t-il bien ?"], solutionsTech: ["Remplacer régulateur."] },
                  { title: "Alarme surchauffe", cause: "Ventilation obstruée.", solutionsPatient: ["Les aérations sont-elles propres ?"], solutionsTech: ["Nettoyer ventilation."] }
              ] },
              { id: "cuve-companion-41", name: "Cuve Companion 41L", failures: [
                  { title: "Fuite liquide", cause: "Joint détérioré", solutionsPatient: ["Entendez-vous une fuite continue ?"], solutionsTech: ["Remplacer joint."] },
                  { title: "Perte pression", cause: "Remplissage trop rapide", solutionsPatient: ["Avez-vous rempli le portable très vite récemment ?"], solutionsTech: ["Remplissage lent et contrôlé."] }
              ] },
              { id: "cuve-companion-45", name: "Cuve Companion 45L", failures: [
                  { title: "Fuite liquide", cause: "Joint détérioré", solutionsPatient: ["Entendez-vous une fuite continue ?"], solutionsTech: ["Remplacer joint."] },
                  { title: "Perte pression", cause: "Remplissage trop rapide", solutionsPatient: ["Avez-vous rempli le portable très vite récemment ?"], solutionsTech: ["Remplissage lent et contrôlé."] }
              ] },
              { id: "cuve-freelox-32", name: "Cuve Freelox 32L", failures: [
                  { title: "Alarme température", cause: "Surcharge de cuve", solutionsPatient: ["L'alarme sonne-t-elle en continu ?"], solutionsTech: ["Respecter capacité max."] },
                  { title: "Fuite vapeur", cause: "Capteurs HS", solutionsPatient: ["Voyez-vous de la vapeur s'échapper anormalement ?"], solutionsTech: ["Remplacement capteurs."] }
              ] },
              { id: "cuve-freelox-44", name: "Cuve Freelox 44L (+ Embase)", failures: [
                  { title: "Alarme température", cause: "Surcharge de cuve", solutionsPatient: ["L'alarme sonne-t-elle en continu ?"], solutionsTech: ["Respecter capacité max."] },
                  { title: "Fuite vapeur", cause: "Capteurs HS", solutionsPatient: ["Voyez-vous de la vapeur s'échapper anormalement ?"], solutionsTech: ["Remplacement capteurs."] }
              ] }
        ] 
      }
    ]
  }
];

// Styles déplacés à l'extérieur pour éviter la recréation à chaque rendu
const containerStyle = {
  maxWidth: "1000px",
  margin: "0 auto",
  padding: "20px",
  fontFamily: "Arial, sans-serif",
  color: "#0f172a",
};

const headerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "40px",
  paddingBottom: "20px",
  borderBottom: "1px solid #e2e8f0"
};

const cardGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  gap: "20px",
};

const cardStyle = {
  background: "white",
  borderRadius: "16px",
  padding: "24px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  cursor: "pointer",
  transition: "transform 0.2s, box-shadow 0.2s",
  border: "1px solid #f1f5f9",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  justifyContent: "center",
  minHeight: "120px"
};

const breadcrumbStyle = {
  display: "flex",
  gap: "8px",
  alignItems: "center",
  fontSize: "14px",
  color: "#64748b",
  marginBottom: "30px",
  fontWeight: 500
};

const breadcrumbItemStyle = {
  cursor: "pointer",
  padding: "4px 8px",
  borderRadius: "6px",
  transition: "background 0.2s"
};

const guideBoxStyle = {
  background: "white",
  borderRadius: "16px",
  padding: "32px",
  boxShadow: "0 8px 16px rgba(0,0,0,0.05)",
  border: "1px solid #e2e8f0",
  textAlign: 'center',
  maxWidth: '600px',
  margin: '40px auto 0 auto',
  animation: "fadeIn 0.5s ease-out"
};

const guideStepInstructionStyle = {
    fontSize: "20px",
    fontWeight: 500,
    marginTop: "12px",
    marginBottom: "28px",
    color: "#1e293b",
    lineHeight: 1.6
};

const guideActionsStyle = {
    marginTop: "24px",
    display: "flex",
    gap: "16px",
    justifyContent: "center"
};

const baseGuideButtonStyle = {
    padding: "12px 24px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "15px",
    transition: "all 0.2s",
};

// Les types qui nécessitent une sélection de marque
const typesWithBrandsStep = ['vni', 'vaa', 'ppc', 'aspiration'];

// Composant Carte Simple déplacé à l'extérieur
const SelectionCard = ({ label, image, onClick }) => (
  <div 
    style={cardStyle} 
    onClick={onClick}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
      e.currentTarget.style.borderColor = "#bae6fd";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
      e.currentTarget.style.borderColor = "#f1f5f9";
    }}
  >
    {/* Affichage du logo s'il existe */}
    {image && (
      <img src={image} alt={label} style={{ maxHeight: "50px", maxWidth: "80%", marginBottom: "16px", objectFit: "contain" }} />
    )}
    <div style={{ fontSize: "18px", fontWeight: "bold", color: "#0f172a" }}>{label}</div>
  </div>
);

export default function LibraryPage() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedFailure, setSelectedFailure] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showTech, setShowTech] = useState(false);

  // Navigation handlers
  const goHome = () => navigate("/");
  const resetType = () => { setSelectedType(null); setSelectedBrand(null); setSelectedModel(null); setSelectedFailure(null); setCurrentStep(0); setShowTech(false); };
  const resetBrand = () => { setSelectedBrand(null); setSelectedModel(null); setSelectedFailure(null); setCurrentStep(0); setShowTech(false); };
  const resetModel = () => { setSelectedModel(null); setSelectedFailure(null); setCurrentStep(0); setShowTech(false); };
  const resetToModel = () => { setSelectedFailure(null); setCurrentStep(0); setShowTech(false); };

  const handleSelectFailure = (failure) => {
    setSelectedFailure(failure);
    setCurrentStep(0);
    setShowTech(false);
  };

  const problemSolved = () => {
    resetToModel();
  };

  const nextStep = () => setCurrentStep(s => s + 1);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <div style={containerStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }} onClick={goHome}>
            {/* Logo généré en CSS pour éviter les erreurs d'image manquante */}
            <div style={{ width: "40px", height: "40px", background: "#0284c7", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold", fontSize: "20px" }}>
              B
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: "20px", color: "#0f172a" }}>Base de Connaissances</h1>
              <span style={{ fontSize: "12px", color: "#64748b" }}>Bibliothèque technique</span>
            </div>
          </div>
          <button 
            onClick={goHome}
            style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "white", cursor: "pointer", fontWeight: 600 }}
          >
            Fermer
          </button>
        </div>

        {/* Fil d'ariane (Breadcrumbs) */}
        <div style={breadcrumbStyle}>
          <span style={{ ...breadcrumbItemStyle, color: "#0284c7" }} onClick={resetType}>Accueil</span>
          {selectedType && (
            <>
              <span>/</span>
              <span style={{ ...breadcrumbItemStyle, color: selectedBrand ? "#0284c7" : "#0f172a" }} onClick={resetBrand}>
                {selectedType.name}
              </span>
            </>
          )}
          {selectedBrand && typesWithBrandsStep.includes(selectedType.id) && (
            <>
              <span>/</span>
              <span style={{ ...breadcrumbItemStyle, color: selectedModel ? "#0284c7" : "#0f172a" }} onClick={resetModel}>
                {selectedBrand.name}
              </span>
            </>
          )}
          {selectedModel && (
            <>
              <span>/</span>
              <span style={{ ...breadcrumbItemStyle, color: selectedFailure ? "#0284c7" : "#0f172a" }} onClick={resetToModel}>
                {selectedModel.name}
              </span>
            </>
          )}
          {selectedFailure && (
            <>
              <span>/</span>
              <span style={{...breadcrumbItemStyle, color: '#334155'}}>
                {selectedFailure.title}
              </span>
            </>
          )}
        </div>

        {/* Contenu Dynamique */}
        <div>
          {!selectedType && (
            <>
              <h2 style={{ marginBottom: "20px", fontSize: "24px" }}>Sélectionnez le type d'équipement</h2>
              <div style={cardGridStyle}>
                {LIBRARY_DATA.map((type) => (
                  <SelectionCard key={type.id} label={type.name} onClick={() => setSelectedType(type)} />
                ))}
              </div>
            </>
          )}

          {selectedType && !selectedBrand && (
            <>
              {typesWithBrandsStep.includes(selectedType.id) ? (
                <>
                  <h2 style={{ marginBottom: "20px", fontSize: "24px" }}>Marque de l'appareil ({selectedType.name})</h2>
                  <div style={cardGridStyle}>
                    {selectedType.brands.map((brand) => (
                      <SelectionCard 
                        key={brand.id} 
                        label={brand.name} 
                        image={brand.logo}
                        onClick={() => setSelectedBrand(brand)} 
                      />
                    ))}
                    {selectedType.brands.length === 0 && <p>Aucune marque répertoriée pour ce type d'équipement.</p>}
                  </div>
                </>
              ) : (
                <>
                  <h2 style={{ marginBottom: "20px", fontSize: "24px" }}>Modèle ({selectedType.name})</h2>
                  <div style={cardGridStyle}>
                    {/* Supporte à la fois la structure 'models' directe et l'ancienne structure 'brands' aplatie */}
                    {(selectedType.models || selectedType.brands?.flatMap(brand => brand.models) || []).map((model) => (
                      <SelectionCard 
                        key={model.id} 
                        label={model.name} 
                        onClick={() => {
                          setSelectedModel(model);
                        }} 
                      />
                    ))}
                    {(selectedType.models || selectedType.brands?.flatMap(b => b.models) || []).length === 0 && <p>Aucun modèle répertorié pour ce type d'équipement.</p>}
                  </div>
                </>
              )}
            </>
          )}

          {selectedBrand && !selectedModel && typesWithBrandsStep.includes(selectedType.id) && (
            <>
              <h2 style={{ marginBottom: "20px", fontSize: "24px" }}>Modèle ({selectedBrand.name})</h2>
              <div style={cardGridStyle}>
                {selectedBrand.models.map((model) => (
                  <SelectionCard key={model.id} label={model.name} onClick={() => setSelectedModel(model)} />
                ))}
                {selectedBrand.models.length === 0 && <p>Aucun modèle répertorié.</p>}
              </div>
            </>
          )}

          {selectedModel && !selectedFailure && (
            <>
              <h2 style={{ marginBottom: "20px", fontSize: "24px" }}>Problème rencontré sur {selectedModel.name}</h2>
              {selectedModel.failures.length === 0 ? (
                <p style={{ color: "#64748b", fontStyle: "italic" }}>Aucune panne connue enregistrée pour ce modèle.</p>
              ) : (
                <div style={cardGridStyle}>
                  {selectedModel.failures.map((failure, index) => (
                    <SelectionCard key={index} label={failure.title} onClick={() => handleSelectFailure(failure)} />
                  ))}
                </div>
              )}
            </>
          )}

          {selectedFailure && (() => {
            const patientSteps = selectedFailure.solutionsPatient || [];
            const techSteps = selectedFailure.solutionsTech || [];
            const totalPatientSteps = patientSteps.length;
            const isLastPatientStep = currentStep === totalPatientSteps - 1;

            const isPatientStep = currentStep < totalPatientSteps;
            const isTechTransition = currentStep === totalPatientSteps && !showTech && techSteps.length > 0;
            const isTechStep = showTech && currentStep >= totalPatientSteps && currentStep < totalPatientSteps + techSteps.length;
            const isEndOfGuide = (currentStep === totalPatientSteps && techSteps.length === 0) || currentStep >= totalPatientSteps + techSteps.length;

            return (
              <div style={{ animation: "fadeIn 0.3s ease-in" }}>
                <h2 style={{ marginBottom: "24px", fontSize: "24px", borderBottom: "2px solid #0284c7", display: "inline-block", paddingBottom: "4px" }}>
                  Guide : {selectedFailure.title}
                </h2>

                <div style={{...guideBoxStyle, margin: '0 auto'}}>
                  <div style={{marginBottom: '32px', background: '#eff6ff', padding: '20px', borderRadius: '12px', border: '1px solid #93c5fd', textAlign: 'left'}}>
                      <h3 style={{marginTop: 0, color: '#1e40af'}}>Avant de commencer : Diagnostic</h3>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "16px" }}>
                          <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "8px" }}>
                            <strong style={{ color: "#334155", display: "block", marginBottom: "8px" }}>Causes probables</strong>
                            <div style={{ color: "#475569" }}>
                              {selectedFailure.causes ? (
                                <ul style={{ margin: 0, paddingLeft: "20px" }}>
                                  {selectedFailure.causes.map((c, i) => <li key={i}>{c}</li>)}
                                </ul>
                              ) : selectedFailure.cause}
                            </div>
                          </div>
                        </div>
                  </div>

                  {isPatientStep && (
                    <>
                      <div style={{ color: "#64748b", fontSize: "14px", fontWeight: 500 }}>Étape Patient {currentStep + 1} / {totalPatientSteps}</div>
                      <p style={guideStepInstructionStyle}>{patientSteps[currentStep]}</p>
                      <div style={guideActionsStyle}>
                        <button style={{...baseGuideButtonStyle, background: "#22c55e", color: "white"}} onClick={problemSolved}>✅ Résolu</button>
                        {!isLastPatientStep ? (
                          <button style={{...baseGuideButtonStyle, background: "#f1f5f9", color: "#334155"}} onClick={nextStep}>❌ Non résolu, étape suivante</button>
                        ) : (
                          <button style={{...baseGuideButtonStyle, background: "#fecaca", color: "#991b1b"}} onClick={nextStep}>
                            {techSteps.length > 0 ? "❌ Voir étapes technicien" : "❌ Problème non résolu"}
                          </button>
                        )}
                      </div>
                    </>
                  )}

                  {isTechTransition && (
                    <>
                      <p style={{...guideStepInstructionStyle, color: "#b45309"}}>⚠️ Les solutions patient n'ont pas fonctionné.<br/>Voulez-vous passer aux étapes technicien ?</p>
                      <div style={guideActionsStyle}>
                        <button style={{...baseGuideButtonStyle, background: "#f59e0b", color: "white"}} onClick={() => setShowTech(true)}>🛠️ Oui, je suis technicien</button>
                        <button style={{...baseGuideButtonStyle, background: "#f1f5f9", color: "#334155"}} onClick={problemSolved}>Retour</button>
                      </div>
                    </>
                  )}

                  {isTechStep && (
                    <>
                      <div style={{ color: "#d97706", fontSize: "14px", fontWeight: 500 }}>Étape Technicien {currentStep - totalPatientSteps + 1} / {techSteps.length}</div>
                      <p style={guideStepInstructionStyle}>{techSteps[currentStep - totalPatientSteps]}</p>
                      <div style={guideActionsStyle}>
                        <button style={{...baseGuideButtonStyle, background: "#22c55e", color: "white"}} onClick={problemSolved}>✅ Résolu</button>
                        <button style={{...baseGuideButtonStyle, background: "#f1f5f9", color: "#334155"}} onClick={nextStep}>❌ Non résolu, étape suivante</button>
                      </div>
                    </>
                  )}

                  {isEndOfGuide && (
                    <>
                      <p style={{...guideStepInstructionStyle, color: "#991b1b"}}>❌ Toutes les solutions ont été tentées sans succès.</p>
                      <div style={{ color: "#475569" }}>
                        Le problème persiste. Veuillez contacter le support niveau 2 ou procéder au remplacement de l'appareil.
                      </div>
                      <div style={guideActionsStyle}>
                        <button style={{...baseGuideButtonStyle, background: "#64748b", color: "white"}} onClick={problemSolved}>Terminer l'intervention</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )
          })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}