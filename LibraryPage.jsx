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
            title: "Pression instable / Fuites",
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
            title: "Aucun souffle détecté",
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
            title: "L'appareil ne démarre pas",
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
                title: "Pression instable / Fuites",
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
                title: "Débit faible ou inexistant",
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
    id: "humidificateur",
    name: "Humidificateur",
    models: [
      { id: "dreamstation-hum", name: "DreamStation", failures: [
          { title: "Niveau d’eau faible", causes: ["Réservoir vide"], solutionsPatient: ["Vérifiez le niveau d'eau dans le bac.", "Remplissez le réservoir jusqu'au repère."], solutionsTech: ["Vérifier le capteur de niveau d'eau."] },
          { title: "Fuite d’eau", causes: ["Réservoir mal fermé", "Joint usé"], solutionsPatient: ["Vérifiez que le couvercle du réservoir est bien clipsé.", "Vérifiez que le réservoir est correctement inséré."], solutionsTech: ["Remplacer le joint du réservoir."] },
          { title: "Pas de chauffage", causes: ["Plaque chauffante défectueuse"], solutionsPatient: ["Vérifiez que l'humidificateur est bien connecté à la machine.", "Vérifiez si l'option est activée dans le menu."], solutionsTech: ["Remplacement de la plaque chauffante."] },
          { title: "Condensation (Glouglou)", causes: ["Humidité trop haute", "Pièce trop froide"], solutionsPatient: ["Baissez le niveau d'humidité.", "Placez la machine plus bas que le lit.", "Utilisez une housse pour le tuyau."], solutionsTech: ["Vérifier le réglage du circuit chauffant."] },
          { title: "Odeur de renfermé", causes: ["Entretien insuffisant", "Eau stagnante"], solutionsPatient: ["Nettoyez le bac avec un mélange eau/vinaigre blanc.", "Changez l'eau tous les jours."], solutionsTech: ["Vérifier l'état des filtres de la machine."] }
      ] },
      { id: "h41", name: "H41", failures: [
          { title: "Pas de chauffage", causes: ["Plaque chauffante HS"], solutionsPatient: ["Vérifiez que l'humidificateur est bien connecté à la PPC.", "Vérifiez si l'option humidification est activée dans le menu."], solutionsTech: ["Remplacement de la plaque chauffante."] },
          { title: "Niveau d’eau faible", causes: ["Réservoir vide"], solutionsPatient: ["Vérifiez le niveau d'eau dans le bac.", "Remplissez le réservoir jusqu'au repère."], solutionsTech: ["Vérifier le capteur de niveau d'eau."] },
          { title: "Fuite d’eau", causes: ["Réservoir mal fermé", "Joint usé"], solutionsPatient: ["Vérifiez que le couvercle est bien clipsé.", "Vérifiez l'étanchéité du bac."], solutionsTech: ["Remplacer le joint."] },
          { title: "Condensation", causes: ["Mauvais réglage humidité"], solutionsPatient: ["Baissez le niveau d'humidité dans les réglages.", "Utilisez un circuit chauffant si disponible."], solutionsTech: ["Ajuster les paramètres de confort."] },
          { title: "Dépôts de calcaire", causes: ["Utilisation d'eau du robinet"], solutionsPatient: ["Utilisez de l'eau déminéralisée ou distillée.", "Faites tremper le bac dans du vinaigre."], solutionsTech: ["Remplacement du bac si trop entartré."] }
      ] },
      { id: "hc150", name: "HC150", failures: [
          { title: "Pas de chauffage", causes: ["Mauvais réglage", "Résistance HS"], solutionsPatient: ["Tournez le bouton de réglage sur une valeur plus élevée.", "Attendez 10 minutes que l'eau chauffe."], solutionsTech: ["Vérifier la tension aux bornes de la résistance."] },
          { title: "Niveau d’eau faible", causes: ["Réservoir vide"], solutionsPatient: ["Vérifiez le niveau d'eau dans le bac."], solutionsTech: ["Contrôle visuel."] },
          { title: "Fuite d’eau", causes: ["Joint usé"], solutionsPatient: ["Vérifiez si le joint du bac est bien en place.", "Vérifiez l'absence de fissures sur le bac."], solutionsTech: ["Remplacer le joint d'étanchéité."] },
          { title: "Condensation dans le tuyau", causes: ["Différence de température"], solutionsPatient: ["Réduisez le réglage sur le bouton rotatif.", "Isolez le tuyau avec une gaine."], solutionsTech: ["Vérifier la sonde de température ambiante."] }
      ] },
      { id: "humidair", name: "HumidAir", failures: [
          { title: "Niveau d’eau faible", causes: ["Réservoir vide"], solutionsPatient: ["Remplissez le réservoir."], solutionsTech: ["Vérifier capteur."] },
          { title: "Fuite d’eau", causes: ["Bac mal inséré"], solutionsPatient: ["Réinsérez le bac jusqu'au clic."], solutionsTech: ["Remplacer joint."] },
          { title: "Pas de chauffage", causes: ["Connecteur sale"], solutionsPatient: ["Nettoyez les contacts au dos du réservoir."], solutionsTech: ["Vérifier continuité."] },
          { title: "Condensation / Rainout", causes: ["Humidité trop élevée"], solutionsPatient: ["Passez le Climate Control en mode 'Auto'.", "Utilisez un tuyau ClimateLine."], solutionsTech: ["Tester le tuyau chauffant."] },
          { title: "Odeur de plastique", causes: ["Appareil neuf", "Bac non nettoyé"], solutionsPatient: ["Lavez le bac avant première utilisation.", "Laissez l'appareil tourner à vide 30 min."], solutionsTech: ["Remplacement du bac."] }
      ] },
      { id: "hum-bipap-a40", name: "BIPAP A40", failures: [
          { title: "Pas de chauffage", causes: ["Mauvaise connexion avec machine"], solutionsPatient: ["Retirez l'humidificateur et rebranchez-le fermement.", "Vérifiez que les connecteurs sont propres."], solutionsTech: ["Contrôler la continuité."] },
          { title: "Niveau d’eau faible", causes: ["Réservoir vide"], solutionsPatient: ["Vérifiez le niveau d'eau."], solutionsTech: ["Vérifier sonde."] },
          { title: "Fuite d’eau", causes: ["Joint usé"], solutionsPatient: ["Vérifiez le joint du réservoir."], solutionsTech: ["Remplacer joint."] },
          { title: "Erreur système", causes: ["Défaut électronique"], solutionsPatient: ["Débranchez et rebranchez l'appareil.", "Si l'alarme persiste, utilisez l'appareil sans humidification."], solutionsTech: ["Retour en SAV pour diagnostic."] },
          { title: "Bruit de glouglou", causes: ["Eau dans le circuit"], solutionsPatient: ["Videz l'eau du tuyau.", "Baissez le réglage d'humidité."], solutionsTech: ["Vérifier inclinaison de l'appareil."] }
      ] },
      { id: "hum-breas", name: "Chauffant (Breas)", failures: [
          { title: "Niveau d’eau faible", causes: ["Réservoir vide"], solutionsPatient: ["Remplissez le bac."], solutionsTech: ["Check capteur."] },
          { title: "Fuite d’eau", causes: ["Bac mal fermé"], solutionsPatient: ["Vérifiez la fermeture."], solutionsTech: ["Remplacer joint."] },
          { title: "Pas de chauffage", causes: ["Plaque HS"], solutionsPatient: ["Vérifiez l'activation dans le menu."], solutionsTech: ["Remplacer plaque."] },
          { title: "Condensation", causes: ["Menu confort mal réglé"], solutionsPatient: ["Baissez le niveau de chauffe dans le menu."], solutionsTech: ["Ajuster paramètres."] }
      ] },
      { id: "hum-sys1", name: "System One", failures: [
          { title: "Niveau d’eau faible", causes: ["Réservoir vide"], solutionsPatient: ["Remplissez le bac."], solutionsTech: ["Check capteur."] },
          { title: "Fuite d’eau", causes: ["Joint usé"], solutionsPatient: ["Vérifiez l'état du joint."], solutionsTech: ["Remplacer joint."] },
          { title: "Pas de chauffage", causes: ["Plaque HS"], solutionsPatient: ["Vérifiez la connexion."], solutionsTech: ["Remplacer plaque."] },
          { title: "Eau dans le masque", causes: ["Condensation"], solutionsPatient: ["Baissez le réglage de 1 ou 2 crans.", "Utilisez un tuyau chauffant System One."], solutionsTech: ["Contrôle du circuit."] }
      ] },
      { id: "mr810-mr820", name: "MR810 / MR820", failures: [
          { title: "Pas de chauffage", causes: ["Appareil mal branché", "Résistance HS"], solutionsPatient: ["Vérifiez que le cordon d'alimentation est bien enfoncé.", "Vérifiez que le voyant orange s'allume."], solutionsTech: ["Vérifier l'alimentation secteur.", "Remplacer la base chauffante."] },
          { title: "Niveau d’eau faible", causes: ["Chambre d'humidification vide"], solutionsPatient: ["Vérifiez la poche d'eau stérile et le kit de transfert."], solutionsTech: ["Vérifier le flotteur."] },
          { title: "Fuite d’eau", causes: ["Chambre mal percée ou joint"], solutionsPatient: ["Vérifiez les connexions des tuyaux sur la chambre."], solutionsTech: ["Changer chambre."] },
          { title: "Condensation dans le circuit", causes: ["Température ambiante basse"], solutionsPatient: ["Augmentez la température de la pièce.", "Utilisez une housse isolante pour le tuyau."], solutionsTech: ["Ajuster la température ou installer un circuit chauffant."] },
          { title: "Bruit de sifflement", causes: ["Mauvaise insertion des tuyaux"], solutionsPatient: ["Vérifiez que les tuyaux sont bien enfoncés sur les ports de la chambre."], solutionsTech: ["Remplacer joints."] }
      ] },
      { id: "my-airvo-2", name: "MY AIRVO 2", failures: [
          { title: "Pas de chauffage", causes: ["Résistance chauffante défectueuse", "Mauvais réglage température"], solutionsPatient: ["Vérifiez le réglage de la température sur l'écran.", "Vérifiez que le circuit est bien branché."], solutionsTech: ["Remplacement de la base chauffante.", "Ajuster les réglages via le menu technicien."] },
          { title: "Niveau d’eau faible", causes: ["Poche d'eau vide"], solutionsPatient: ["Remplacez la poche d'eau."], solutionsTech: ["Vérifier capteur optique."] },
          { title: "Fuite d’eau", causes: ["Chambre mal insérée"], solutionsPatient: ["Poussez la chambre jusqu'au bout."], solutionsTech: ["Remplacer joint de base."] },
          { title: "Alarme température", causes: ["Sonde température HS", "Filtre sale"], solutionsPatient: ["Laissez refroidir.", "Vérifiez le filtre à air à l'arrière."], solutionsTech: ["Remplacer sonde."] },
          { title: "Pas de débit d’air", causes: ["Circuit obstrué"], solutionsPatient: ["Vérifiez la canule.", "Vérifiez le tuyau."], solutionsTech: ["Vérifier turbine."] },
          { title: "Condensation excessive", causes: ["Pièce trop froide"], solutionsPatient: ["Augmentez la température de la pièce.", "Vérifiez que le circuit chauffant est activé."], solutionsTech: ["Vérifier continuité circuit chauffant."] }
      ] },
      { id: "nea-hum", name: "NEA", failures: [
          { title: "Pas de chauffage", causes: ["Plaque HS", "Menu"], solutionsPatient: ["Activez l'humidification dans le menu confort."], solutionsTech: ["Remplacer plaque."] },
          { title: "Niveau d’eau faible", causes: ["Réservoir vide"], solutionsPatient: ["Remplissez le réservoir."], solutionsTech: ["Vérifier capteur."] },
          { title: "Fuite d’eau", causes: ["Joint usé"], solutionsPatient: ["Vérifiez le joint sous le bac."], solutionsTech: ["Remplacer joint."] },
          { title: "Bruit anormal", causes: ["Encrassement"], solutionsPatient: ["Nettoyez le réservoir avec de l'eau vinaigrée pour enlever le calcaire."], solutionsTech: ["Nettoyage complet du conduit d'air."] },
          { title: "Gouttelettes dans le masque", causes: ["Humidité trop forte"], solutionsPatient: ["Baissez le réglage d'un niveau.", "Isolez le tuyau."], solutionsTech: ["Calibration sonde."] }
      ] },
      { id: "prisma-aqua", name: "PrismaAQUA", failures: [
          { title: "Fuite d’eau", causes: ["Réservoir fissuré"], solutionsPatient: ["Vérifiez si de l'eau coule sous l'appareil.", "Inspectez le bac à la lumière pour voir des fissures."], solutionsTech: ["Remplacer le réservoir."] },
          { title: "Niveau d’eau faible", causes: ["Réservoir vide"], solutionsPatient: ["Remplissez le bac."], solutionsTech: ["Vérifier capteur."] },
          { title: "Pas de chauffage", causes: ["Défaut résistance"], solutionsPatient: ["Vérifiez que le bac est bien enfoncé jusqu'au clic.", "Vérifiez que le symbole de chauffe apparaît."], solutionsTech: ["Maintenance interne de la base."] },
          { title: "Condensation", causes: ["Réglage humidité trop haut"], solutionsPatient: ["Baissez l'humidité (niveau 1 à 5).", "Vérifiez que la pièce n'est pas trop froide."], solutionsTech: ["Ajuster paramètres."] }
      ] },
      { id: "hum-sbox", name: "S.Box", failures: [
          { title: "Pas de chauffage", causes: ["Mauvaise connexion"], solutionsPatient: ["Retirez le bac et remettez-le en place.", "Vérifiez qu'il y a assez d'eau."], solutionsTech: ["Vérifier le branchement interne."] },
          { title: "Niveau d’eau faible", causes: ["Réservoir vide"], solutionsPatient: ["Vérifiez le niveau d'eau."], solutionsTech: ["Check capteur."] },
          { title: "Fuite d’eau", causes: ["Joint déformé"], solutionsPatient: ["Vérifiez le joint à l'arrière du bac."], solutionsTech: ["Changer joint."] },
          { title: "Alarme", causes: ["Défaut capteur"], solutionsPatient: ["Nettoyez les contacts à l'arrière du réservoir.", "Redémarrez la machine."], solutionsTech: ["Retour SAV pour remplacement capteur."] },
          { title: "Condensation", causes: ["Pièce froide"], solutionsPatient: ["Baissez l'humidité.", "Utilisez le circuit chauffant S.Box."], solutionsTech: ["Vérifier connexion circuit."] }
      ] },
      { id: "vhb10a", name: "VHB10A", failures: [
          { title: "Pas de chauffage", causes: ["Résistance HS"], solutionsPatient: ["Vérifiez que l'appareil est allumé (interrupteur).", "Vérifiez le branchement secteur."], solutionsTech: ["Remplacement de la résistance."] },
          { title: "Niveau d’eau faible", causes: ["Chambre vide"], solutionsPatient: ["Vérifiez l'alimentation en eau."], solutionsTech: ["Check flotteur."] },
          { title: "Fuite d’eau", causes: ["Raccords mal serrés"], solutionsPatient: ["Vérifiez les tuyaux."], solutionsTech: ["Vérifier étanchéité."] },
          { title: "Arrêt brusque", causes: ["Surchauffe"], solutionsPatient: ["Laissez l'appareil refroidir.", "Vérifiez que les grilles de ventilation ne sont pas bouchées."], solutionsTech: ["Vérifier le circuit de ventilation."] },
          { title: "Condensation", causes: ["Manque d'isolation"], solutionsPatient: ["Isolez le circuit.", "Vérifiez le branchement du fil chauffant."], solutionsTech: ["Vérifier fil chauffant."] }
      ] }
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
          { id: "1025ks", name: "10L", failures: [
                    { title: "L'appareil ne démarre pas", causes: ["Problème alimentation", "Coupure de courant", "Câble mal branché"], solutionsPatient: ["Quand vous appuyez sur le bouton Marche, est-ce qu'il se passe quelque chose (bruit, lumière) ?", "Est-ce que le câble d'alimentation est bien enfoncé des deux côtés (mur et machine) ?", "Avez-vous essayé sur une autre prise électrique ?", "Y a-t-il eu une coupure de courant ?"], solutionsTech: ["Vérifier le cordon secteur.", "Vérifier le fusible/disjoncteur.", "Vérifier l'interrupteur.", "Vérifier le secteur / basculer sur secours."] },
              { title: "Alarme O₂ faible", causes: ["Concentration entre 75 % et 82 %"], solutionsPatient: ["La pureté de l'oxygène a baissé.", "Contactez votre prestataire pour un entretien."], solutionsTech: ["Analyse de pureté.", "Remplacer tamis."] },
              { title: "Arrêt brusque", causes: ["Disjoncteur thermique (surcharge)"], solutionsPatient: ["Appuyez sur le bouton du disjoncteur pour réinitialiser."], solutionsTech: ["Contrôle température."] },
                    { title: "Débit faible ou irrégulier", causes: ["Filtre bouché", "Tamis moléculaire usé"], solutionsPatient: ["Le filtre à air est-il noir ou poussiéreux ?", "Sentez-vous que l'air n'arrive pas régulièrement ?"], solutionsTech: ["Nettoyage filtre.", "Remplacement des tamis."] },
                    { title: "Alarme (Surchauffe)", causes: ["Ventilation obstruée", "Environnement trop chaud"], solutionsPatient: ["L'appareil est-il très chaud ?", "Est-ce que quelque chose bouche les grilles d'aération ?", "Fait-il très chaud dans la pièce ?"], solutionsTech: ["Nettoyer grilles d’aération.", "Déplacer appareil, laisser refroidir."] },
                    { title: "Alarme (Échappement bloqué)", cause: "Sortie d’air obstruée", solutionsPatient: ["Est-ce que quelque chose bouche la grille à l'arrière (sortie d'air) ?"], solutionsTech: ["Dégager la sortie d’air."] },
                    { title: "Alarme No Flow (pas de débit)", causes: ["Circuit complètement bouché", "Débit réglé trop bas"], solutionsPatient: ["Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?"], solutionsTech: ["Vérifier tubulure / canule.", "Ajuster débit."] },
                    { title: "Alarme pression (High/Low Pressure)", cause: "Défaut compresseur", solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression sur l'écran ?"], solutionsTech: ["Maintenance technique (compresseur)."] },
                    { title: "Alarme Service Required", cause: "Panne interne (compresseur, capteur, carte)", solutionsPatient: ["Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Y a-t-il un message d'erreur sur l'écran ?"], solutionsTech: ["Maintenance technique / SAV."] }
                ] },
          { id: "525ks", name: "5L", failures: [
                    { title: "L'appareil ne démarre pas", causes: ["Alimentation", "Cordon", "Interrupteur"], solutionsPatient: ["Quand vous appuyez sur le bouton Marche, est-ce qu'il se passe quelque chose (bruit, lumière) ?", "Est-ce que le câble d'alimentation est bien enfoncé des deux côtés (mur et machine) ?", "Avez-vous essayé sur une autre prise électrique ?"], solutionsTech: ["Vérifier le cordon secteur.", "Vérifier le fusible/disjoncteur.", "Vérifier l'interrupteur."] },
                    { title: "Voyant rouge d'alerte allumé", causes: ["Débitmètre bloqué", "Obstruction interne"], solutionsPatient: ["Vérifiez que le débitmètre n'est pas sur 0.", "Vérifiez que la tubulure n'est pas pliée."], solutionsTech: ["Vérifier circuit interne."] },
                    { title: "Alarme sonore continue", causes: ["Coupure électrique"], solutionsPatient: ["Vérifiez le branchement et le disjoncteur."], solutionsTech: ["Tester tension."] },
                    { title: "Alarme (Surchauffe)", causes: ["Ventilation obstruée", "Environnement trop chaud"], solutionsPatient: ["L'appareil est-il collé contre un mur ou un rideau ?", "Les grilles d'aération sont-elles propres ?", "Fait-il très chaud dans la pièce ?"], solutionsTech: ["Nettoyer grilles d’aération.", "Déplacer appareil, laisser refroidir."] },
                    { title: "Alarme (Échappement bloqué)", cause: "Sortie d’air obstruée", solutionsPatient: ["La sortie d'air est-elle dégagée ?"], solutionsTech: ["Dégager la sortie d'air."] },
                    { title: "Alarme No Flow (pas de débit)", causes: ["Circuit complètement bouché", "Débit réglé trop bas"], solutionsPatient: ["Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?"], solutionsTech: ["Vérifier tubulure / canule.", "Ajuster débit."] },
                    { title: "Alarme Service Required", causes: ["Capteurs HS", "Panne interne (compresseur, capteur, carte)"], solutionsPatient: ["L'appareil s'arrête-t-il tout seul sans raison apparente ?", "Le voyant rouge est-il allumé et l'appareil bipe-t-il ?"], solutionsTech: ["Remplacer capteurs.", "Maintenance technique / SAV."] }
                ] },
          { id: "8f-5a", name: "5L", failures: [
                    { title: "L'appareil ne démarre pas", causes: ["Alimentation", "Cordon", "Interrupteur"], solutionsPatient: ["Quand vous appuyez sur le bouton Marche, est-ce qu'il se passe quelque chose (bruit, lumière) ?", "Est-ce que le câble d'alimentation est bien enfoncé des deux côtés (mur et machine) ?", "Avez-vous essayé sur une autre prise électrique ?"], solutionsTech: ["Vérifier le cordon secteur.", "Vérifier le fusible/disjoncteur.", "Vérifier l'interrupteur."] },
                    { title: "Débit faible ou irrégulier", causes: ["Filtre bouché", "Tamis moléculaire usé", "Tubulure / canule obstruée"], solutionsPatient: ["Le filtre à air est-il propre ?", "Sentez-vous que l'air n'arrive pas régulièrement ?", "La tubulure ou la canule est-elle pliée ou bouchée ?"], solutionsTech: ["Nettoyage filtre.", "Remplacement tamis.", "Vérifier ou remplacer tubulure/canule."] },
                    { title: "Alarme O₂ faible", causes: ["Tamis moléculaire usé", "Mauvaise concentration O₂"], solutionsPatient: ["Le voyant O2 est-il allumé ?", "L'appareil a-t-il été entretenu récemment ?"], solutionsTech: ["Vérifier pureté.", "Maintenance interne."] },
                    { title: "Alarme (Surchauffe)", causes: ["Ventilation obstruée", "Environnement trop chaud"], solutionsPatient: ["L'appareil est-il collé contre un mur ou un rideau ?", "Les grilles d'aération sont-elles propres ?", "Fait-il très chaud dans la pièce ?"], solutionsTech: ["Nettoyer grilles d’aération.", "Déplacer appareil, laisser refroidir."] },
                    { title: "Alarme (Échappement bloqué)", cause: "Sortie d’air obstruée", solutionsPatient: ["La sortie d'air est-elle dégagée ?"], solutionsTech: ["Dégager la sortie d'air."] },
                    { title: "Alarme No Flow (pas de débit)", causes: ["Circuit complètement bouché", "Débit réglé trop bas"], solutionsPatient: ["Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?"], solutionsTech: ["Vérifier tubulure / canule.", "Ajuster débit."] },
                    { title: "Alarme pression (High/Low Pressure)", cause: "Défaut compresseur", solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression sur l'écran ?"], solutionsTech: ["Maintenance technique (compresseur)."] },
                    { title: "Alarme Service Required", causes: ["Capteurs HS", "Panne interne (compresseur, capteur, carte)"], solutionsPatient: ["L'appareil s'arrête-t-il tout seul sans raison apparente ?", "Le voyant rouge est-il allumé et l'appareil bipe-t-il ?"], solutionsTech: ["Remplacer capteurs.", "Maintenance technique / SAV."] }
                ] },
                { id: "everflo", name: "EverFlo", failures: [
                    { title: "L'appareil ne démarre pas", causes: ["Alimentation", "Cordon", "Interrupteur"], solutionsPatient: ["Quand vous appuyez sur le bouton Marche, est-ce qu'il se passe quelque chose (bruit, lumière) ?", "Est-ce que le câble d'alimentation est bien enfoncé des deux côtés (mur et machine) ?", "Avez-vous essayé sur une autre prise électrique ?"], solutionsTech: ["Vérifier le cordon secteur.", "Vérifier le fusible/disjoncteur.", "Vérifier l'interrupteur."] },
                    { title: "Débit faible ou irrégulier", causes: ["Filtre bouché", "Tamis moléculaire usé", "Compresseur usé", "Tubulure / canule obstruée"], solutionsPatient: ["Sentez-vous que l'air n'arrive pas régulièrement ?", "Le filtre à air est-il propre ?", "La tubulure ou la canule est-elle pliée ou bouchée ?"], solutionsTech: ["Maintenance compresseur.", "Remplacement tamis.", "Nettoyage filtre.", "Vérifier ou remplacer tubulure/canule."] },
                    { title: "Bruit anormal", cause: "Humidité.", solutionsPatient: ["Y a-t-il de l'eau dans le tuyau ?", "La pièce est-elle humide ?"], solutionsTech: ["Déshumidificateur si nécessaire."] },
                    { title: "Alarme O₂ faible", causes: ["Tamis moléculaire usé", "Mauvaise concentration O₂"], solutionsPatient: ["Le voyant oxygène est-il jaune ou rouge ?", "L'appareil a-t-il été entretenu récemment ?"], solutionsTech: ["Vérifier la pureté à l'analyseur.", "Maintenance interne."] },
                    { title: "Alarme (Surchauffe)", causes: ["Ventilation obstruée", "Environnement trop chaud"], solutionsPatient: ["L'appareil est-il chaud ?", "La grille à l'arrière est-elle libre ?", "Fait-il très chaud dans la pièce ?"], solutionsTech: ["Nettoyer grilles d'aération.", "Déplacer appareil, laisser refroidir."] },
                    { title: "Alarme (Échappement bloqué)", cause: "Sortie d’air bloquée", solutionsPatient: ["La grille à l'arrière est-elle libre ?"], solutionsTech: ["Dégager la sortie d'air."] },
                    { title: "Alarme No Flow (pas de débit)", causes: ["Circuit complètement bouché", "Débit réglé trop bas"], solutionsPatient: ["Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?"], solutionsTech: ["Vérifier tubulure / canule.", "Ajuster débit."] },
                    { title: "Alarme pression (High/Low Pressure)", cause: "Défaut compresseur", solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression sur l'écran ?"], solutionsTech: ["Maintenance technique (compresseur)."] },
                    { title: "Alarme Service Required", cause: "Panne interne (compresseur, capteur, carte)", solutionsPatient: ["Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Y a-t-il un message d'erreur sur l'écran ?"], solutionsTech: ["Maintenance technique / SAV."] }
                ] },
                { id: "everflo-pediatrique", name: "EverFlo Pédiatrique", failures: [
                    { title: "L'appareil ne démarre pas", causes: ["Alimentation", "Cordon", "Interrupteur"], solutionsPatient: ["Quand vous appuyez sur le bouton Marche, est-ce qu'il se passe quelque chose (bruit, lumière) ?", "Est-ce que le câble d'alimentation est bien enfoncé des deux côtés (mur et machine) ?", "Avez-vous essayé sur une autre prise électrique ?"], solutionsTech: ["Vérifier le cordon secteur.", "Vérifier le fusible/disjoncteur.", "Vérifier l'interrupteur."] },
                    { title: "Débit faible ou irrégulier", causes: ["Filtre bouché", "Tamis moléculaire usé", "Compresseur usé", "Tubulure / canule obstruée"], solutionsPatient: ["Sentez-vous que l'air n'arrive pas régulièrement ?", "Le filtre à air est-il propre ?", "La tubulure ou la canule est-elle pliée ou bouchée ?"], solutionsTech: ["Maintenance compresseur.", "Remplacement tamis.", "Nettoyage filtre.", "Vérifier ou remplacer tubulure/canule."] },
                    { title: "Bruit anormal", cause: "Humidité.", solutionsPatient: ["Y a-t-il de l'eau dans le tuyau ?", "La pièce est-elle humide ?"], solutionsTech: ["Déshumidificateur si nécessaire."] },
                    { title: "Alarme O₂ faible", causes: ["Tamis moléculaire usé", "Mauvaise concentration O₂"], solutionsPatient: ["Le voyant oxygène est-il jaune ou rouge ?", "L'appareil a-t-il été entretenu récemment ?"], solutionsTech: ["Vérifier la pureté à l'analyseur.", "Maintenance interne."] },
                    { title: "Alarme (Surchauffe)", causes: ["Ventilation obstruée", "Environnement trop chaud"], solutionsPatient: ["L'appareil est-il chaud ?", "La grille à l'arrière est-elle libre ?", "Fait-il très chaud dans la pièce ?"], solutionsTech: ["Nettoyer grilles d'aération.", "Déplacer appareil, laisser refroidir."] },
                    { title: "Alarme (Échappement bloqué)", cause: "Sortie d’air bloquée", solutionsPatient: ["La grille à l'arrière est-elle libre ?"], solutionsTech: ["Dégager la sortie d'air."] },
                    { title: "Alarme No Flow (pas de débit)", causes: ["Circuit complètement bouché", "Débit réglé trop bas"], solutionsPatient: ["Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?"], solutionsTech: ["Vérifier tubulure / canule.", "Ajuster débit."] },
                    { title: "Alarme pression (High/Low Pressure)", cause: "Défaut compresseur", solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression sur l'écran ?"], solutionsTech: ["Maintenance technique (compresseur)."] },
                    { title: "Alarme Service Required", cause: "Panne interne (compresseur, capteur, carte)", solutionsPatient: ["Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Y a-t-il un message d'erreur sur l'écran ?"], solutionsTech: ["Maintenance technique / SAV."] }
                ] },
                { id: "igo2-fixe", name: "iGo 2 (Mode Fixe)", failures: [
                     { title: "L'appareil ne démarre pas", causes: ["Batterie vide", "Chargeur HS", "Carte"], solutionsPatient: ["Quand vous branchez le chargeur, est-ce qu'un voyant s'allume sur la machine ?", "Est-ce que le câble du chargeur est abîmé ou tordu ?", "Si vous retirez la batterie et branchez le chargeur, est-ce qu'il démarre ?"], solutionsTech: ["Tester l'alimentation externe.", "Tester sans batterie.", "Vérifier connectique interne."] },
                     { title: "Alarme", cause: "Batterie faible.", solutionsPatient: ["Le voyant batterie est-il allumé ?", "Est-il bien branché sur le secteur ?"], solutionsTech: ["Remplacer batterie."] },
                     { title: "Arrêt inopiné", cause: "Surchauffe.", solutionsPatient: ["L'appareil est-il chaud au toucher ?", "Les aérations sont-elles libres ?"], solutionsTech: ["Vérifier ventilation."] },
                     { title: "Alarme O₂ faible", causes: ["Tamis moléculaire usé", "Mauvaise concentration O₂"], solutionsPatient: ["Le voyant oxygène est-il jaune ou rouge ?"], solutionsTech: ["Vérifier la pureté à l'analyseur.", "Maintenance interne."] },
                     { title: "Alarme (Surchauffe)", causes: ["Ventilation obstruée", "Environnement trop chaud"], solutionsPatient: ["L'appareil est-il très chaud ?", "Est-ce que quelque chose bouche les grilles d'aération ?", "Fait-il très chaud dans la pièce ?"], solutionsTech: ["Nettoyer grilles d'aération.", "Déplacer appareil, laisser refroidir."] },
                     { title: "Alarme (Échappement bloqué)", cause: "Sortie d’air obstruée", solutionsPatient: ["Est-ce que quelque chose bouche la grille à l'arrière (sortie d'air) ?"], solutionsTech: ["Dégager la sortie d’air."] },
                     { title: "Alarme No Flow (pas de débit)", causes: ["Circuit complètement bouché", "Débit réglé trop bas"], solutionsPatient: ["Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?"], solutionsTech: ["Vérifier tubulure / canule.", "Ajuster débit."] },
                     { title: "Alarme pression (High/Low Pressure)", cause: "Défaut compresseur", solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression sur l'écran ?"], solutionsTech: ["Maintenance technique (compresseur)."] },
                     { title: "Alarme Service Required", cause: "Panne interne (compresseur, capteur, carte)", solutionsPatient: ["Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Y a-t-il un message d'erreur sur l'écran ?"], solutionsTech: ["Maintenance technique / SAV."] }
                ] }
            ]
          },
          {
            id: "portable",
            name: "Portable",
            models: [
                { id: "inogen-g3", name: "Inogen One G3", failures: [
                    { title: "L'appareil ne démarre pas", causes: ["Batterie vide", "Chargeur HS", "Coupure de courant", "Câble mal branché"], solutionsPatient: ["Quand vous branchez le chargeur, est-ce qu'un voyant s'allume sur la machine ?", "Est-ce que le câble du chargeur est abîmé ou tordu ?", "Si vous retirez la batterie et branchez le chargeur, est-ce qu'il démarre ?", "Y a-t-il eu une coupure de courant ?"], solutionsTech: ["Tester l'alimentation externe.", "Tester sans batterie.", "Vérifier connectique interne.", "Vérifier secteur / basculer sur secours."] },
                    { title: "Problème de batterie / Autonomie", causes: ["Batterie faible", "Batterie usée"], solutionsPatient: ["La batterie tient-elle la charge ?", "Est-ce que vous êtes dehors avec l'appareil ?", "La batterie est-elle faible ?"], solutionsTech: ["Recharger batterie.", "Remplacer batterie."] },
                    { title: "Débit faible ou irrégulier", causes: ["Filtre bouché", "Airflow bloqué", "Tubulure / canule obstruée"], solutionsPatient: ["Le filtre est-il propre ?", "Est-ce que le sac bouche les trous ?", "La tubulure ou la canule est-elle pliée ou bouchée ?"], solutionsTech: ["Nettoyer filtre.", "Dégager aérations.", "Vérifier ou remplacer tubulure/canule."] },
                    { title: "Alarme (Température / Système)", causes: ["Environnement trop chaud", "Capteur défectueux"], solutionsPatient: ["L'appareil est-il au soleil ou dans une zone chaude ?", "Qu'est-ce qui est écrit sur l'écran ?"], solutionsTech: ["Utiliser en zone ventilée.", "Maintenance technique."] },
                    { title: "Alarme No Flow (pas de débit)", causes: ["Circuit complètement bouché", "Débit réglé trop bas"], solutionsPatient: ["Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?"], solutionsTech: ["Vérifier tubulure / canule.", "Ajuster débit."] },
                    { title: "Alarme pression (High/Low Pressure)", cause: "Défaut compresseur", solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression sur l'écran ?"], solutionsTech: ["Maintenance technique (compresseur)."] },
                    { title: "Alarme Service Required", cause: "Panne interne (compresseur, capteur, carte)", solutionsPatient: ["Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Y a-t-il un message d'erreur sur l'écran ?"], solutionsTech: ["Maintenance technique / SAV."] }
                ] },
                { id: "inogen-g4", name: "Inogen One G4", failures: [
                    { title: "L'appareil ne démarre pas", causes: ["Batterie vide", "Chargeur HS", "Coupure de courant", "Câble mal branché"], solutionsPatient: ["Quand vous branchez le chargeur, est-ce qu'un voyant s'allume sur la machine ?", "Est-ce que le câble du chargeur est abîmé ou tordu ?", "Si vous retirez la batterie et branchez le chargeur, est-ce qu'il démarre ?", "Y a-t-il eu une coupure de courant ?"], solutionsTech: ["Tester l'alimentation externe.", "Tester sans batterie.", "Vérifier connectique interne.", "Vérifier secteur / basculer sur secours."] },
                    { title: "Problème de batterie / Autonomie", causes: ["Batterie faible", "Batterie usée"], solutionsPatient: ["La batterie tient-elle la charge ?", "Est-ce que vous êtes dehors avec l'appareil ?", "La batterie est-elle faible ?"], solutionsTech: ["Recharger batterie.", "Remplacer batterie."] },
                    { title: "Débit faible ou irrégulier", causes: ["Filtre bouché", "Airflow bloqué", "Tubulure / canule obstruée"], solutionsPatient: ["Le filtre est-il propre ?", "Est-ce que le sac bouche les trous ?", "La tubulure ou la canule est-elle pliée ou bouchée ?"], solutionsTech: ["Nettoyer filtre.", "Dégager aérations.", "Vérifier ou remplacer tubulure/canule."] },
                    { title: "Alarme (Température / Système)", causes: ["Environnement trop chaud", "Capteur défectueux"], solutionsPatient: ["L'appareil est-il au soleil ou dans une zone chaude ?", "Qu'est-ce qui est écrit sur l'écran ?"], solutionsTech: ["Utiliser en zone ventilée.", "Maintenance technique."] },
                    { title: "Alarme No Flow (pas de débit)", causes: ["Circuit complètement bouché", "Débit réglé trop bas"], solutionsPatient: ["Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?"], solutionsTech: ["Vérifier tubulure / canule.", "Ajuster débit."] },
                    { title: "Alarme pression (High/Low Pressure)", cause: "Défaut compresseur", solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression sur l'écran ?"], solutionsTech: ["Maintenance technique (compresseur)."] },
                    { title: "Alarme Service Required", cause: "Panne interne (compresseur, capteur, carte)", solutionsPatient: ["Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Y a-t-il un message d'erreur sur l'écran ?"], solutionsTech: ["Maintenance technique / SAV."] }
                ] },
                { id: "inogen-g5", name: "Inogen One G5", failures: [
                    { title: "L'appareil ne démarre pas", causes: ["Batterie vide", "Chargeur HS", "Coupure de courant", "Câble mal branché"], solutionsPatient: ["Quand vous branchez le chargeur, est-ce qu'un voyant s'allume sur la machine ?", "Est-ce que le câble du chargeur est abîmé ou tordu ?", "Si vous retirez la batterie et branchez le chargeur, est-ce qu'il démarre ?", "Y a-t-il eu une coupure de courant ?"], solutionsTech: ["Tester l'alimentation externe.", "Tester sans batterie.", "Vérifier connectique interne.", "Vérifier secteur / basculer sur secours."] },
                    { title: "Problème de batterie / Autonomie", causes: ["Batterie faible", "Batterie usée"], solutionsPatient: ["La batterie tient-elle la charge ?", "Est-ce que vous êtes dehors avec l'appareil ?", "La batterie est-elle faible ?"], solutionsTech: ["Recharger batterie.", "Remplacer batterie."] },
                    { title: "Débit faible ou irrégulier", causes: ["Filtre bouché", "Airflow bloqué", "Tubulure / canule obstruée"], solutionsPatient: ["Le filtre est-il propre ?", "Est-ce que le sac bouche les trous ?", "La tubulure ou la canule est-elle pliée ou bouchée ?"], solutionsTech: ["Nettoyer filtre.", "Dégager aérations.", "Vérifier ou remplacer tubulure/canule."] },
                    { title: "Alarme (Température / Système)", causes: ["Environnement trop chaud", "Capteur défectueux"], solutionsPatient: ["L'appareil est-il au soleil ou dans une zone chaude ?", "Qu'est-ce qui est écrit sur l'écran ?"], solutionsTech: ["Utiliser en zone ventilée.", "Maintenance technique."] },
                    { title: "Alarme No Flow (pas de débit)", causes: ["Circuit complètement bouché", "Débit réglé trop bas"], solutionsPatient: ["Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?"], solutionsTech: ["Vérifier tubulure / canule.", "Ajuster débit."] },
                    { title: "Alarme pression (High/Low Pressure)", cause: "Défaut compresseur", solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression sur l'écran ?"], solutionsTech: ["Maintenance technique (compresseur)."] },
                    { title: "Alarme Service Required", cause: "Panne interne (compresseur, capteur, carte)", solutionsPatient: ["Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Y a-t-il un message d'erreur sur l'écran ?"], solutionsTech: ["Maintenance technique / SAV."] }
                ] },
                { id: "inogen-rove", name: "Inogen Rove 6", failures: [
                    { title: "L'appareil ne démarre pas", causes: ["Batterie vide", "Chargeur HS", "Carte"], solutionsPatient: ["Quand vous branchez le chargeur, est-ce qu'un voyant s'allume sur la machine ?", "Est-ce que le câble du chargeur est abîmé ou tordu ?", "Si vous retirez la batterie et branchez le chargeur, est-ce qu'il démarre ?"], solutionsTech: ["Tester l'alimentation externe.", "Tester sans batterie.", "Vérifier connectique interne."] },
                    { title: "Problème de batterie / Autonomie", causes: ["Batterie faible", "Batterie usée"], solutionsPatient: ["La batterie tient-elle la charge ?", "Est-ce que vous êtes dehors avec l'appareil ?", "La batterie est-elle faible ?"], solutionsTech: ["Recharger batterie.", "Remplacer batterie."] },
                    { title: "Débit faible ou irrégulier", causes: ["Filtre bouché", "Airflow bloqué", "Tubulure / canule obstruée"], solutionsPatient: ["Le filtre est-il propre ?", "Est-ce que le sac bouche les trous ?", "La tubulure ou la canule est-elle pliée ou bouchée ?"], solutionsTech: ["Nettoyer filtre.", "Dégager aérations.", "Vérifier ou remplacer tubulure/canule."] },
                    { title: "Alarme (Température / Système)", causes: ["Environnement trop chaud", "Capteur défectueux"], solutionsPatient: ["L'appareil est-il au soleil ou dans une zone chaude ?", "Qu'est-ce qui est écrit sur l'écran ?"], solutionsTech: ["Utiliser en zone ventilée.", "Maintenance technique."] },
                    { title: "Alarme No Flow (pas de débit)", causes: ["Circuit complètement bouché", "Débit réglé trop bas"], solutionsPatient: ["Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?"], solutionsTech: ["Vérifier tubulure / canule.", "Ajuster débit."] },
                    { title: "Alarme pression (High/Low Pressure)", cause: "Défaut compresseur", solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression sur l'écran ?"], solutionsTech: ["Maintenance technique (compresseur)."] },
                    { title: "Alarme Service Required", cause: "Panne interne (compresseur, capteur, carte)", solutionsPatient: ["Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Y a-t-il un message d'erreur sur l'écran ?"], solutionsTech: ["Maintenance technique / SAV."] }
                ] },
                { id: "simplygo-mini", name: "SimplyGo Mini", failures: [
                    { title: "L'appareil ne démarre pas", causes: ["Batterie vide", "Chargeur HS", "Carte"], solutionsPatient: ["Quand vous branchez le chargeur, est-ce qu'un voyant s'allume sur la machine ?", "Est-ce que le câble du chargeur est abîmé ou tordu ?", "Si vous retirez la batterie et branchez le chargeur, est-ce qu'il démarre ?"], solutionsTech: ["Tester l'alimentation externe.", "Tester sans batterie.", "Vérifier connectique interne."] },
                    { title: "Alarme (Température / Système)", causes: ["Filtre sale", "Environnement trop chaud", "Capteur défectueux"], solutionsPatient: ["Le filtre est-il propre ?", "Fait-il très chaud là où vous êtes ?", "Voyez-vous un code d'alarme ?"], solutionsTech: ["Nettoyage filtre.", "Déplacer appareil, laisser refroidir.", "Maintenance technique."] },
                    { title: "Débit faible ou irrégulier", causes: ["Ventilation insuffisante", "Airflow bloqué", "Tubulure / canule obstruée"], solutionsPatient: ["Est-ce que le sac de transport bouche les aérations ?", "L'appareil respire-t-il bien ?", "La tubulure ou la canule est-elle pliée ou bouchée ?"], solutionsTech: ["Ne pas obstruer aérations.", "Dégager entrées d'air.", "Vérifier ou remplacer tubulure/canule."] },
                    { title: "Alarme No Flow (pas de débit)", causes: ["Circuit complètement bouché", "Débit réglé trop bas"], solutionsPatient: ["Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?"], solutionsTech: ["Vérifier tubulure / canule.", "Ajuster débit."] },
                    { title: "Alarme pression (High/Low Pressure)", cause: "Défaut compresseur", solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression sur l'écran ?"], solutionsTech: ["Maintenance technique (compresseur)."] },
                    { title: "Alarme Service Required", cause: "Panne interne (compresseur, capteur, carte)", solutionsPatient: ["Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Y a-t-il un message d'erreur sur l'écran ?"], solutionsTech: ["Maintenance technique / SAV."] }
                ] },
                { id: "simplygo-mini-ld", name: "SimplyGo Mini (Longue Durée)", failures: [
                    { title: "L'appareil ne démarre pas", causes: ["Batterie vide", "Chargeur HS", "Carte"], solutionsPatient: ["Quand vous branchez le chargeur, est-ce qu'un voyant s'allume sur la machine ?", "Est-ce que le câble du chargeur est abîmé ou tordu ?", "Si vous retirez la batterie et branchez le chargeur, est-ce qu'il démarre ?"], solutionsTech: ["Tester l'alimentation externe.", "Tester sans batterie.", "Vérifier connectique interne."] },
                    { title: "Alarme (Température / Système)", causes: ["Filtre sale", "Environnement trop chaud", "Capteur HS"], solutionsPatient: ["Le filtre est-il propre ?", "Est-ce qu'il fait chaud dehors ?", "Voyez-vous un code d'alarme ?"], solutionsTech: ["Nettoyage filtre.", "Déplacer appareil, laisser refroidir.", "Maintenance technique."] },
                    { title: "Débit faible ou irrégulier", causes: ["Ventilation insuffisante", "Airflow bloqué", "Tubulure / canule obstruée"], solutionsPatient: ["Est-ce que le sac de transport bouche les aérations ?", "L'appareil respire-t-il bien ?", "La tubulure ou la canule est-elle pliée ou bouchée ?"], solutionsTech: ["Ne pas obstruer aérations.", "Dégager entrées d'air.", "Vérifier ou remplacer tubulure/canule."] },
                    { title: "Alarme No Flow (pas de débit)", causes: ["Circuit complètement bouché", "Débit réglé trop bas"], solutionsPatient: ["Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?"], solutionsTech: ["Vérifier tubulure / canule.", "Ajuster débit."] },
                    { title: "Alarme pression (High/Low Pressure)", cause: "Défaut compresseur", solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression sur l'écran ?"], solutionsTech: ["Maintenance technique (compresseur)."] },
                    { title: "Alarme Service Required", cause: "Panne interne (compresseur, capteur, carte)", solutionsPatient: ["Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Y a-t-il un message d'erreur sur l'écran ?"], solutionsTech: ["Maintenance technique / SAV."] }
                ] },
                { id: "zen-o-lite", name: "Zen-O Lite", failures: [
                    { title: "L'appareil ne démarre pas", causes: ["Batterie vide", "Chargeur HS", "Carte"], solutionsPatient: ["Quand vous branchez le chargeur, est-ce qu'un voyant s'allume sur la machine ?", "Est-ce que le câble du chargeur est abîmé ou tordu ?", "Si vous retirez la batterie et branchez le chargeur, est-ce qu'il démarre ?"], solutionsTech: ["Tester l'alimentation externe.", "Tester sans batterie.", "Vérifier connectique interne."] },
                    { title: "Débit faible ou irrégulier", causes: ["Pompe défectueuse", "Airflow bloqué", "Tubulure / canule obstruée"], solutionsPatient: ["L'appareil fait-il un bruit anormal ?", "Les aérations sont-elles libres ?", "La tubulure ou la canule est-elle pliée ou bouchée ?"], solutionsTech: ["Maintenance pompe.", "Dégager aérations.", "Vérifier ou remplacer tubulure/canule."] },
                    { title: "Bruit anormal", cause: "Batterie faible.", solutionsPatient: ["La batterie est-elle bien chargée ?", "Est-ce que vous êtes dehors avec l'appareil ?"], solutionsTech: ["Remplacer batterie."] },
                    { title: "Alarme (Température / Système)", causes: ["Environnement trop chaud", "Capteur défectueux"], solutionsPatient: ["Fait-il très chaud ?", "Y a-t-il une alarme système sur l'écran ?"], solutionsTech: ["Déplacer appareil, laisser refroidir.", "Maintenance technique."] },
                    { title: "Alarme No Flow (pas de débit)", causes: ["Circuit complètement bouché", "Débit réglé trop bas"], solutionsPatient: ["Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?"], solutionsTech: ["Vérifier tubulure / canule.", "Ajuster débit."] },
                    { title: "Alarme pression (High/Low Pressure)", cause: "Défaut compresseur", solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression sur l'écran ?"], solutionsTech: ["Maintenance technique (compresseur)."] },
                    { title: "Alarme Service Required", cause: "Panne interne (compresseur, capteur, carte)", solutionsPatient: ["Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Y a-t-il un message d'erreur sur l'écran ?"], solutionsTech: ["Maintenance technique / SAV."] }
                ] },
                { id: "zen-o", name: "Zen-O (Double batterie)", failures: [
                    { title: "L'appareil ne démarre pas", causes: ["Batterie vide", "Chargeur HS", "Carte"], solutionsPatient: ["Quand vous branchez le chargeur, est-ce qu'un voyant s'allume sur la machine ?", "Est-ce que le câble du chargeur est abîmé ou tordu ?", "Si vous retirez la batterie et branchez le chargeur, est-ce qu'il démarre ?"], solutionsTech: ["Tester l'alimentation externe.", "Tester sans batterie.", "Vérifier connectique interne."] },
                    { title: "Fuite d’air", cause: "Connectique mal serrée.", solutionsPatient: ["Le tuyau est-il bien branché ?"], solutionsTech: ["Vérifier connexions."] },
                    { title: "Alarme (Température / Système)", causes: ["Joint usé", "Environnement trop chaud", "Capteur HS"], solutionsPatient: ["Voyez-vous un message d'erreur ?", "Fait-il chaud ?"], solutionsTech: ["Remplacer joint.", "Déplacer appareil, laisser refroidir.", "Maintenance technique."] },
                    { title: "Alarme No Flow (pas de débit)", causes: ["Circuit complètement bouché", "Débit réglé trop bas"], solutionsPatient: ["Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?"], solutionsTech: ["Vérifier tubulure / canule.", "Ajuster débit."] },
                    { title: "Alarme pression (High/Low Pressure)", cause: "Défaut compresseur", solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression sur l'écran ?"], solutionsTech: ["Maintenance technique (compresseur)."] },
                    { title: "Alarme Service Required", cause: "Panne interne (compresseur, capteur, carte)", solutionsPatient: ["Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Y a-t-il un message d'erreur sur l'écran ?"], solutionsTech: ["Maintenance technique / SAV."] }
                ] },
                { id: "freestyle", name: "FreeStyle Comfort", failures: [
                    { title: "L'appareil ne démarre pas", causes: ["Batterie vide", "Chargeur HS", "Carte"], solutionsPatient: ["Quand vous branchez le chargeur, est-ce qu'un voyant s'allume sur la machine ?", "Est-ce que le câble du chargeur est abîmé ou tordu ?", "Si vous retirez la batterie et branchez le chargeur, est-ce qu'il démarre ?"], solutionsTech: ["Tester l'alimentation externe.", "Tester sans batterie.", "Vérifier connectique interne."] },
                    { title: "Fuite d’air", causes: ["Connectique mal serrée", "Airflow bloqué", "Tubulure / canule obstruée"], solutionsPatient: ["Le tuyau est-il bien clipsé ?", "Rien ne bouche les trous d'air ?", "La tubulure ou la canule est-elle pliée ou bouchée ?"], solutionsTech: ["Vérifier connexions.", "Dégager aérations.", "Vérifier ou remplacer tubulure/canule."] },
                    { title: "Alarme (Température / Système)", causes: ["Joint usé", "Environnement trop chaud", "Capteur HS"], solutionsPatient: ["Voyez-vous un message d'erreur ?", "Fait-il chaud ?"], solutionsTech: ["Remplacer joint.", "Déplacer appareil, laisser refroidir.", "Maintenance technique."] },
                    { title: "Alarme No Flow (pas de débit)", causes: ["Circuit complètement bouché", "Débit réglé trop bas"], solutionsPatient: ["Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?"], solutionsTech: ["Vérifier tubulure / canule.", "Ajuster débit."] },
                    { title: "Alarme pression (High/Low Pressure)", cause: "Défaut compresseur", solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression sur l'écran ?"], solutionsTech: ["Maintenance technique (compresseur)."] },
                    { title: "Alarme Service Required", cause: "Panne interne (compresseur, capteur, carte)", solutionsPatient: ["Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Y a-t-il un message d'erreur sur l'écran ?"], solutionsTech: ["Maintenance technique / SAV."] }
                ] }
            ]
          },
          {
            id: "transportable",
            name: "Transportable",
            models: [
                { id: "eclipse-3", name: "Eclipse 3", failures: [
                    { title: "L'appareil ne démarre pas", causes: ["Batterie vide", "Chargeur HS", "Carte"], solutionsPatient: ["Quand vous branchez le chargeur, est-ce qu'un voyant s'allume sur la machine ?", "Est-ce que le câble du chargeur est abîmé ou tordu ?", "Si vous retirez la batterie et branchez le chargeur, est-ce qu'il démarre ?"], solutionsTech: ["Tester l'alimentation externe.", "Tester sans batterie.", "Vérifier connectique interne."] },
                        { title: "Voyant batterie jaune clignotant", causes: ["Autonomie < 10 %"], solutionsPatient: ["Branchez sur secteur immédiatement."], solutionsTech: ["Check batterie."] }
                ] },
                { id: "eclipse-5", name: "Eclipse 5", failures: [
                    { title: "L'appareil ne démarre pas", causes: ["Batterie vide", "Chargeur HS", "Carte"], solutionsPatient: ["Quand vous branchez le chargeur, est-ce qu'un voyant s'allume sur la machine ?", "Est-ce que le câble du chargeur est abîmé ou tordu ?", "Si vous retirez la batterie et branchez le chargeur, est-ce qu'il démarre ?"], solutionsTech: ["Tester l'alimentation externe.", "Tester sans batterie.", "Vérifier connectique interne."] },
                        { title: "Alarme débit (LED rouge/jaune)", causes: ["Obstruction"], solutionsPatient: ["Vérifiez les nœuds dans la canule."], solutionsTech: ["Check débit."] },
                        { title: "Ne bascule pas sur batterie", causes: ["Mauvaise insertion"], solutionsPatient: ["Réinsérez la batterie jusqu'au clic."], solutionsTech: ["Check contacts."] }
                ] },
          { id: "simplygo", name: "SimplyGo", failures: [
                { id: "simplygo", name: "SimplyGo (Standard)", failures: [
                    { title: "L'appareil ne démarre pas", causes: ["Batterie vide", "Chargeur HS", "Carte"], solutionsPatient: ["Quand vous branchez le chargeur, est-ce qu'un voyant s'allume sur la machine ?", "Est-ce que le câble du chargeur est abîmé ou tordu ?", "Si vous retirez la batterie et branchez le chargeur, est-ce qu'il démarre ?"], solutionsTech: ["Tester l'alimentation externe.", "Tester sans batterie.", "Vérifier connectique interne."] },
                        { title: "Message 'Erreur système'", causes: ["Bug électronique"], solutionsPatient: ["Retirez batterie et secteur 30 sec."], solutionsTech: ["Code erreur."] },
              { title: "Alarme température", causes: ["Sacoche non aérée"], solutionsPatient: ["Sortez de la sacoche."], solutionsTech: ["Check ventilo."] }
                        { title: "Surchauffe", causes: ["Sacoche non aérée"], solutionsPatient: ["Sortez de la sacoche."], solutionsTech: ["Check ventilo."] }
                    ] },
                    { id: "zen-o", name: "Zen-O", failures: [
              { title: "Alarme sonore toutes les 15 s", causes: ["Aucun souffle détecté"], solutionsPatient: ["Vérifiez canule ou passez en continu."], solutionsTech: ["Check trigger."] }
                        { title: "Alarme sonore toutes les 15 s", causes: ["Pas de respiration décelée"], solutionsPatient: ["Vérifiez canule ou passez en continu."], solutionsTech: ["Check trigger."] }
                    ] },
                    { id: "solo2", name: "Invacare SOLO2", failures: [
              { title: "Alarme température", causes: ["Obstruction grilles"], solutionsPatient: ["Éloignez des rideaux."], solutionsTech: ["Check filtres."] }
                        { title: "Alarme de température", causes: ["Obstruction grilles"], solutionsPatient: ["Éloignez des rideaux."], solutionsTech: ["Check filtres."] }
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
                  { title: "Fuite de liquide", causes: ["Joint usé"], solutionsPatient: ["Voyez-vous du liquide couler ?"], solutionsTech: ["Vérifier et remplacer joint."] },
                  { title: "Fuite de liquide", cause: "Joint usé.", solutionsPatient: ["Voyez-vous du liquide couler ?"], solutionsTech: ["Vérifier et remplacer joint."] },
                  { title: "Faible autonomie", cause: "Remplissage incorrect.", solutionsPatient: ["Remplissez-vous bien jusqu'à saturation (crachement) ?"], solutionsTech: ["Former utilisateur.", "Corriger remplissage."] },
                  { title: "Givre important", causes: ["Utilisation continue à des débits élevés"], solutionsPatient: ["Laissez l'appareil au repos pendant au moins 1 heure après usage."], solutionsTech: ["Vérifier isolation."] },
                  { title: "Formation de givre importante sur le boîtier", causes: ["Utilisation continue à des débits élevés"], solutionsPatient: ["Laissez l'appareil au repos pendant au moins 1 heure après usage."], solutionsTech: ["Vérifier isolation."] },
                  { title: "Le bouton de remplissage ne s'enclenche pas", causes: ["Le mécanisme est resté en position fermée"], solutionsPatient: ["Tirez sur le bouton jusqu'à ce qu'il s'enclenche en position 'ouvert' avant de retenter la connexion."], solutionsTech: ["Actionner le mécanisme manuellement."] },
                  { title: "Fuite de vapeur (nuage blanc) pendant le remplissage", causes: ["Phénomène normal d'évaporation"], solutionsPatient: ["Maintenez une position droite et assurez-vous que les connecteurs sont alignés ; la fuite cesse après le remplissage."], solutionsTech: ["Conseil d'utilisation."] }
              ] },
              { id: "stroller", name: "Companion Stroller", failures: [
                  { title: "Fuite de liquide", causes: ["Joint usé"], solutionsPatient: ["Voyez-vous du liquide couler ?"], solutionsTech: ["Vérifier et remplacer joint."] },
                  { title: "Fuite de liquide", cause: "Joint usé.", solutionsPatient: ["Voyez-vous du liquide couler ?"], solutionsTech: ["Vérifier et remplacer joint."] },
                  { title: "Faible autonomie", cause: "Remplissage incorrect.", solutionsPatient: ["Remplissez-vous bien jusqu'à saturation (crachement) ?"], solutionsTech: ["Former utilisateur.", "Corriger remplissage."] },
                  { title: "Givre important", causes: ["Utilisation continue à des débits élevés"], solutionsPatient: ["Laissez l'appareil au repos pendant au moins 1 heure."], solutionsTech: ["Check isolation."] }
                  { title: "Formation de givre importante sur le boîtier", causes: ["Utilisation continue à des débits élevés"], solutionsPatient: ["Laissez l'appareil au repos pendant au moins 1 heure."], solutionsTech: ["Check isolation."] }
              ] },
              { id: "freelox-05", name: "Freelox 0.5L", failures: [
                  { title: "Blocage de vapeur", cause: "Tube de vapeur bouché.", solutionsPatient: ["Le tube est-il plié ?"], solutionsTech: ["Nettoyage tube de vapeur."] },
                  { title: "Alarme température", cause: "Stockage inadapté.", solutionsPatient: ["Le portable est-il bien stocké à la verticale ?"], solutionsTech: ["Respecter position verticale."] },
                  { title: "Le réservoir portable ne se remplit pas", causes: ["Valve de remplissage gelée ou mal connectée"], solutionsPatient: ["Vérifiez la connexion et, si du givre bloque la valve, attendez qu'elle dégèle naturellement."], solutionsTech: ["Vérifier valve mâle."] },
                  { title: "Givre important", causes: ["Fuite légère ou utilisation intensive"], solutionsPatient: ["Essuyez délicatement le givre avec un chiffon sec et vérifiez le sélecteur de débit."], solutionsTech: ["Test étanchéité."] }
                  { title: "Présence excessive de givre sur le portable", causes: ["Fuite légère ou utilisation intensive"], solutionsPatient: ["Essuyez délicatement le givre avec un chiffon sec et vérifiez le sélecteur de débit."], solutionsTech: ["Test étanchéité."] }
              ] },
              { id: "freelox-12", name: "Freelox 1.2L", failures: [
                  { title: "Blocage de vapeur", cause: "Tube de vapeur bouché.", solutionsPatient: ["Le tube est-il plié ?"], solutionsTech: ["Nettoyage tube de vapeur."] },
                  { title: "Alarme température", cause: "Stockage inadapté.", solutionsPatient: ["Le portable est-il bien stocké à la verticale ?"], solutionsTech: ["Respecter position verticale."] },
                  { title: "Le réservoir portable ne se remplit pas", causes: ["Valve gelée"], solutionsPatient: ["Vérifiez la connexion et laissez dégeler."], solutionsTech: ["Vérifier valve."] }
              ] },
              { id: "joggy", name: "Joggy", failures: [
                  { title: "Blocage de vapeur", cause: "Tube de vapeur bouché.", solutionsPatient: ["Le tube est-il plié ?"], solutionsTech: ["Nettoyage tube de vapeur."] },
                  { title: "Alarme température", cause: "Stockage inadapté.", solutionsPatient: ["Le portable est-il bien stocké à la verticale ?"], solutionsTech: ["Respecter position verticale."] }
              ] },
              { id: "helios-h300", name: "Helios H300", failures: [
                  { title: "Débit faible ou irrégulier", causes: ["Pompe usée", "Bulles dans liquide"], solutionsPatient: ["Entendez-vous un bruit irrégulier ?", "Avez-vous secoué l'appareil ?"], solutionsTech: ["Remplacer pompe.", "Purger système."] },
                  { title: "Débit irrégulier", causes: ["Pompe usée", "Bulles dans liquide"], solutionsPatient: ["Entendez-vous un bruit irrégulier ?", "Avez-vous secoué l'appareil ?"], solutionsTech: ["Remplacer pompe.", "Purger système."] },
                  { title: "Bruit pompe", cause: "Bulles dans liquide.", solutionsPatient: ["Entendez-vous un bruit de pompe inhabituel ?"], solutionsTech: ["Purger système."] },
                  { title: "Pas de débit", causes: ["Le réservoir est vide ou la canule est débranchée/obstruée"], solutionsPatient: ["Vérifiez le niveau d'oxygène sur l'indicateur et assurez-vous que la canule est fixée."], solutionsTech: ["Vérifier limiteur."] },
                  { title: "Le portable ne délivre pas d'oxygène", causes: ["Le réservoir est vide ou la canule est débranchée/obstruée"], solutionsPatient: ["Vérifiez le niveau d'oxygène sur l'indicateur et assurez-vous que la canule est fixée."], solutionsTech: ["Vérifier limiteur."] },
                  { title: "Difficulté lors du désaccouplement après remplissage", causes: ["Formation de glace sur les valves"], solutionsPatient: ["N'utilisez jamais de force. Laissez la glace fondre jusqu'à séparation facile."], solutionsTech: ["Sécher valves."] },
                  { title: "Panne (Indicateur)", causes: ["Pile interne épuisée ou mauvaise manipulation"], solutionsPatient: ["Appuyez fermement sur le bouton bleu de test. Si rien ne s'affiche, la pile est HS."], solutionsTech: ["Remplacer pile."] }
                  { title: "L'indicateur de contenu ne fonctionne pas", causes: ["Pile interne épuisée ou mauvaise manipulation"], solutionsPatient: ["Appuyez fermement sur le bouton bleu de test. Si rien ne s'affiche, la pile est HS."], solutionsTech: ["Remplacer pile."] }
              ] },
              { id: "helios-marathon", name: "Helios Marathon 850", failures: [
                  { title: "Débit faible ou irrégulier", causes: ["Pompe usée", "Bulles dans liquide"], solutionsPatient: ["Entendez-vous un bruit irrégulier ?", "Avez-vous secoué l'appareil ?"], solutionsTech: ["Remplacer pompe.", "Purger système."] },
                  { title: "Débit irrégulier", causes: ["Pompe usée", "Bulles dans liquide"], solutionsPatient: ["Entendez-vous un bruit irrégulier ?", "Avez-vous secoué l'appareil ?"], solutionsTech: ["Remplacer pompe.", "Purger système."] },
                  { title: "Bruit pompe", cause: "Bulles dans liquide.", solutionsPatient: ["Entendez-vous un bruit de pompe inhabituel ?"], solutionsTech: ["Purger système."] },
                  { title: "Pas de débit", causes: ["Réservoir vide ou canule obstruée"], solutionsPatient: ["Vérifiez le niveau et la canule."], solutionsTech: ["Vérifier débit."] }
                  { title: "Le portable ne délivre pas d'oxygène", causes: ["Réservoir vide ou canule obstruée"], solutionsPatient: ["Vérifiez le niveau et la canule."], solutionsTech: ["Vérifier débit."] }
              ] },
              { id: "hi-flow-stroller", name: "Hi Flow Stroller", failures: [
                  { title: "Débit faible ou irrégulier", cause: "Régulateur bloqué.", solutionsPatient: ["Le bouton de réglage tourne-t-il bien ?"], solutionsTech: ["Remplacer régulateur."] },
                  { title: "Alarme température", cause: "Ventilation obstruée.", solutionsPatient: ["Les aérations sont-elles propres ?"], solutionsTech: ["Nettoyer ventilation."] }
                  { title: "Débit insuffisant", cause: "Régulateur bloqué.", solutionsPatient: ["Le bouton de réglage tourne-t-il bien ?"], solutionsTech: ["Remplacer régulateur."] },
                  { title: "Alarme surchauffe", cause: "Ventilation obstruée.", solutionsPatient: ["Les aérations sont-elles propres ?"], solutionsTech: ["Nettoyer ventilation."] }
              ] },
              { id: "cuve-companion-41", name: "Cuve Companion 41L", failures: [
                  { title: "Fuite de liquide", cause: "Joint détérioré", solutionsPatient: ["Entendez-vous une fuite continue ?"], solutionsTech: ["Remplacer joint."] },
                  { title: "Fuite liquide", cause: "Joint détérioré", solutionsPatient: ["Entendez-vous une fuite continue ?"], solutionsTech: ["Remplacer joint."] },
                  { title: "Perte pression", cause: "Remplissage trop rapide", solutionsPatient: ["Avez-vous rempli le portable très vite récemment ?"], solutionsTech: ["Remplissage lent et contrôlé."] }
              ] },
              { id: "cuve-companion-45", name: "Cuve Companion 45L", failures: [
                  { title: "Fuite de liquide", cause: "Joint détérioré", solutionsPatient: ["Entendez-vous une fuite continue ?"], solutionsTech: ["Remplacer joint."] },
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
const SelectionCard = ({ label, image, onClick, onDelete }) => (
  <div 
    style={cardStyle} 
    onClick={onClick}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
      e.currentTarget.style.borderColor = "#bae6fd";
      if (onDelete) e.currentTarget.querySelector('.del-btn').style.opacity = "1";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
      e.currentTarget.style.borderColor = "#f1f5f9";
      if (onDelete) e.currentTarget.querySelector('.del-btn').style.opacity = "0";
    }}
    position="relative"
  >
    {onDelete && (
      <button 
        className="del-btn"
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        style={{ position: 'absolute', top: '8px', right: '8px', border: 'none', background: '#fee2e2', color: '#ef4444', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', opacity: 0, transition: 'opacity 0.2s', fontWeight: 'bold' }}
      >
        ×
      </button>
    )}
    {/* Affichage du logo s'il existe */}
    {image && (
      <img src={image} alt={label} style={{ maxHeight: "50px", maxWidth: "80%", marginBottom: "16px", objectFit: "contain" }} />
    )}
    <div style={{ fontSize: "18px", fontWeight: "bold", color: "#0f172a" }}>{label}</div>
  </div>
);

export default function LibraryPage() {
  const navigate = useNavigate();
  const [data, setData] = useState(LIBRARY_DATA);
  const [selectedType, setSelectedType] = useState(null);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('failure_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [view, setView] = useState('library'); // 'library', 'history', 'failures'
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedFailure, setSelectedFailure] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showTech, setShowTech] = useState(false);

  // Navigation handlers
  const goHome = () => navigate("/");
  const resetType = () => { setView('library'); setSelectedType(null); setSelectedBrand(null); setSelectedModel(null); setSelectedFailure(null); setCurrentStep(0); setShowTech(false); };
  const resetBrand = () => { setView('library'); setSelectedBrand(null); setSelectedModel(null); setSelectedFailure(null); setCurrentStep(0); setShowTech(false); };
  const resetModel = () => { setView('library'); setSelectedModel(null); setSelectedFailure(null); setCurrentStep(0); setShowTech(false); };
  const resetToModel = () => { setView('library'); setSelectedFailure(null); setCurrentStep(0); setShowTech(false); };

  // Extraction de toutes les pannes pour le catalogue
  const getAllFailures = () => {
    const results = [];
    const traverse = (items, path = "") => {
      items.forEach(item => {
        const currentPath = path ? `${path} > ${item.name}` : item.name;
        if (item.failures) {
          item.failures.forEach(f => {
            results.push({ ...f, model: item, path: currentPath });
          });
        }
        if (item.subTypes) traverse(item.subTypes, currentPath);
        if (item.brands) traverse(item.brands, currentPath);
        if (item.models) traverse(item.models, currentPath);
      });
    };
    traverse(data);
    return results;
  };

  const handleSelectFailure = (failure) => {
    setSelectedFailure(failure);
    setView('library');
    setCurrentStep(0);
    setShowTech(false);
  };

  const addItem = () => {
    if (!selectedType) {
      const name = prompt("Nom de la nouvelle catégorie :");
      if (name) setData([...data, { id: Date.now().toString(), name, models: [] }]);
    } else if (selectedType && typesWithBrandsStep.includes(selectedType.id) && !selectedBrand) {
      const name = prompt(`Nouvelle marque pour ${selectedType.name} :`);
      if (name) {
        const newData = data.map(t => {
          if (t.id === selectedType.id) {
            if (!t.brands) t.brands = [];
            t.brands = [...t.brands, { id: Date.now().toString(), name, models: [] }];
          }
          return t;
        });
        setData(newData);
      }
    } else if (selectedType && !selectedModel) {
      const name = prompt(`Nouveau modèle pour ${selectedType.name} :`);
      if (name) {
        const newData = data.map(t => {
          if (t.id === selectedType.id) {
            const target = selectedBrand || t;
            const newModel = { id: Date.now().toString(), name, failures: [] };
            if (selectedBrand) {
               target.models = [...(target.models || []), newModel];
            } else {
               t.models = [...(t.models || []), newModel];
            }
          }
          return t;
        });
        setData(newData);
      }
    } else if (selectedModel) {
      const title = prompt("Titre du problème :");
      if (!title) return;
      const cause = prompt("Cause probable :");
      const solP = prompt("Solutions Patient (séparées par ';') :");
      const solT = prompt("Solutions Tech (séparées par ';') :");
      
      const newFailure = {
        title,
        causes: cause ? [cause] : [],
        solutionsPatient: solP ? solP.split(';').map(s => s.trim()) : [],
        solutionsTech: solT ? solT.split(';').map(s => s.trim()) : []
      };

      const updatedModel = { ...selectedModel, failures: [...selectedModel.failures, newFailure] };
      setSelectedModel(updatedModel);
      alert("Problème ajouté au modèle actuel.");
    }
  };

  const removeItem = (type, id, index) => {
    if (!window.confirm("Supprimer cet élément ?")) return;

    if (type === 'category') {
      setData(data.filter(t => t.id !== id));
      setSelectedType(null);
    } else if (type === 'brand') {
      const newData = data.map(t => {
        if (t.id === selectedType.id) {
          return { ...t, brands: t.brands.filter(b => b.id !== id) };
        }
        return t;
      });
      setData(newData);
      setSelectedBrand(null);
    } else if (type === 'model') {
      const newData = data.map(t => {
        if (t.id === selectedType.id) {
          if (selectedBrand) {
            const newBrands = t.brands.map(b => b.id === selectedBrand.id ? { ...b, models: b.models.filter(m => m.id !== id) } : b);
            return { ...t, brands: newBrands };
          }
          return { ...t, models: t.models.filter(m => m.id !== id) };
        }
        return t;
      });
      setData(newData);
      setSelectedModel(null);
    } else if (type === 'failure') {
      const newFailures = selectedModel.failures.filter((_, i) => i !== index);
      setSelectedModel({ ...selectedModel, failures: newFailures });
    }
  };

  const logIntervention = (status) => {
    const otherCause = document.getElementById('cause-other-input')?.value;
    const entry = {
      id: Date.now(),
      date: new Date().toLocaleString('fr-FR'),
      device: `${selectedType?.name}${selectedBrand ? ` (${selectedBrand.name})` : ''} > ${selectedModel?.name}`,
      failure: selectedFailure?.title,
      status: status, // 'Succès' ou 'Échec'
      comment: otherCause || ''
    };
    const newHistory = [entry, ...history];
    setHistory(newHistory);
    localStorage.setItem('failure_history', JSON.stringify(newHistory));
    resetToModel();
  };

  const clearHistory = () => {
    if (window.confirm("Vider l'historique ?")) {
      setHistory([]);
      localStorage.removeItem('failure_history');
    }
  };

  const removeHistoryItem = (id) => {
    if (!window.confirm("Supprimer cette ligne du journal ?")) return;
    const newHistory = history.filter(item => item.id !== id);
    setHistory(newHistory);
    localStorage.setItem('failure_history', JSON.stringify(newHistory));
  };

  const nextStep = () => setCurrentStep(s => s + 1);

  // Helper pour décider si on affiche le nom du type entre parenthèses
  const shouldHideNameInTitle = (name) => 
    !name || ["concentrateur", "fixe", "portable", "transportable"].some(term => name.toLowerCase().includes(term));

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
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => setView(view === 'failures' ? 'library' : 'failures')}
              style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #0284c7", background: view === 'failures' ? "#0284c7" : "white", color: view === 'failures' ? "white" : "#0284c7", cursor: "pointer", fontWeight: 600 }}
            >
              📂 Toutes les pannes
            </button>
            <button 
              onClick={() => setView(view === 'library' ? 'history' : 'library')}
              style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #0284c7", background: view === 'history' ? "#0284c7" : "white", color: view === 'history' ? "white" : "#0284c7", cursor: "pointer", fontWeight: 600 }}
            >
              {view === 'library' ? '📋 Journal' : '📚 Bibliothèque'}
            </button>
            <button 
              onClick={addItem}
              style={{ padding: "8px 16px", borderRadius: "8px", border: "none", background: "#0284c7", color: "white", cursor: "pointer", fontWeight: 600 }}
            >
              ➕ Ajouter
            </button>
            <button 
              onClick={goHome}
              style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "white", cursor: "pointer", fontWeight: 600 }}
            >
              Fermer
            </button>
          </div>
        </div>

        {/* Fil d'ariane (Breadcrumbs) */}
        <div style={breadcrumbStyle}>
          <span style={{ ...breadcrumbItemStyle, color: (selectedType || view !== 'library') ? "#0284c7" : "#0f172a" }} onClick={resetType}>Accueil</span>
          {view === 'history' && (
             <><span>/</span><span style={{...breadcrumbItemStyle, color: '#0f172a'}}>Journal</span></>
          )}
          {view === 'failures' && (
             <><span>/</span><span style={{...breadcrumbItemStyle, color: '#0f172a'}}>Catalogue des pannes</span></>
          )}
          {selectedType && view === 'library' && !selectedFailure && (
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
        {view === 'history' ? (
          <div style={{ animation: "fadeIn 0.3s ease-in" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: "24px", margin: 0 }}>Journal des Interventions</h2>
              <button onClick={clearHistory} style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #ef4444", background: "white", color: "#ef4444", cursor: "pointer", fontSize: "14px" }}>Effacer tout</button>
            </div>
            {history.length === 0 ? (
              <p style={{ color: "#64748b", fontStyle: "italic" }}>Aucune intervention enregistrée.</p>
            ) : (
              <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <tr>
                      <th style={{ padding: '12px 16px' }}>Date</th>
                      <th style={{ padding: '12px 16px' }}>Appareil</th>
                      <th style={{ padding: '12px 16px' }}>Problème</th>
                      <th style={{ padding: '12px 16px' }}>Statut</th>
                      <th style={{ padding: '12px 16px' }}>Notes</th>
                      <th style={{ padding: '12px 16px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map(item => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>{item.date}</td>
                        <td style={{ padding: '12px 16px' }}>{item.device}</td>
                        <td style={{ padding: '12px 16px' }}>{item.failure}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, background: item.status === 'Succès' ? '#dcfce7' : '#fee2e2', color: item.status === 'Succès' ? '#166534' : '#991b1b' }}>
                            {item.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', color: '#64748b', fontStyle: 'italic' }}>
                          {item.comment || "-"}
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <button 
                            onClick={() => removeHistoryItem(item.id)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }}
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : view === 'failures' ? (
          <div style={{ animation: "fadeIn 0.3s ease-in" }}>
            <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>Catalogue Complet des Pannes</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
              {getAllFailures().map((f, idx) => (
                <div 
                  key={idx} 
                  onClick={() => {
                    // On simule la sélection pour ouvrir le guide
                    const findType = (path) => data.find(t => path.startsWith(t.name));
                    setSelectedType(findType(f.path));
                    setSelectedModel(f.model);
                    handleSelectFailure(f);
                  }}
                  style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "#0284c7"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
                >
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#ef4444' }}>⚠️ {f.title}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{f.path}</div>
                  </div>
                  <span style={{ color: '#0284c7', fontWeight: 'bold' }}>Voir le guide →</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {!selectedType && (
            <>
              <h2 style={{ marginBottom: "20px", fontSize: "24px" }}>Sélectionnez le type d'équipement</h2>
              <div style={cardGridStyle}>
                {data.map((type) => (
                  <SelectionCard 
                    key={type.id} 
                    label={type.name} 
                    onClick={() => setSelectedType(type)} 
                    onDelete={() => removeItem('category', type.id)}
                  />
                ))}
              </div>
            </>
          )}
          {selectedType && !selectedBrand && (
            <>
              {typesWithBrandsStep.includes(selectedType.id) ? (
                <>
                  <h2 style={{ marginBottom: "20px", fontSize: "24px" }}>Marque de l'appareil {!shouldHideNameInTitle(selectedType.name) ? `(${selectedType.name})` : ""}</h2>
                  <div style={cardGridStyle}>
                    {selectedType.brands.map((brand) => (
                      <SelectionCard 
                        key={brand.id} 
                        label={brand.name} 
                        image={brand.logo}
                        onClick={() => setSelectedBrand(brand)} 
                        onDelete={() => removeItem('brand', brand.id)}
                      />
                    ))}
                    {selectedType.brands.length === 0 && <p>Aucune marque répertoriée pour ce type d'équipement.</p>}
                  </div>
                </>
              ) : (
                <>
                  <h2 style={{ marginBottom: "20px", fontSize: "24px" }}>Modèle {!shouldHideNameInTitle(selectedType.name) ? `(${selectedType.name})` : ""}</h2>
                  <div style={cardGridStyle}>
                    {/* Supporte à la fois la structure 'models' directe et l'ancienne structure 'brands' aplatie */}
                    {(selectedType.models || selectedType.subTypes || selectedType.brands?.flatMap(brand => brand.models) || []).map((item) => (
                      <SelectionCard 
                        key={item.id} 
                        label={item.name} 
                        onClick={() => item.subTypes ? setSelectedType(item) : setSelectedModel(item)}
                        onDelete={() => removeItem('model', item.id)}
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
              <h2 style={{ marginBottom: "20px", fontSize: "24px" }}>Modèle {!shouldHideNameInTitle(selectedBrand.name) ? `(${selectedBrand.name})` : ""}</h2>
              <div style={cardGridStyle}>
                {selectedBrand.models.map((model) => (
                  <SelectionCard 
                    key={model.id} 
                    label={model.name} 
                    onClick={() => setSelectedModel(model)} 
                    onDelete={() => removeItem('model', model.id)}
                  />
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
                    <SelectionCard 
                      key={index} 
                      label={failure.title} 
                      onClick={() => handleSelectFailure(failure)} 
                      onDelete={() => removeItem('failure', null, index)}
                    />
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
                              ) : (
                                <div style={{ marginBottom: selectedFailure.cause ? "8px" : "0" }}>{selectedFailure.cause}</div>
                              )}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', borderTop: '1px dashed #e2e8f0', paddingTop: '12px' }}>
                                <input type="checkbox" id="cause-other" style={{ cursor: 'pointer' }} />
                                <label htmlFor="cause-other" style={{ fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}>Autre :</label>
                                <input 
                                  type="text" 
                                  id="cause-other-input"
                                  placeholder="Précisez la cause..." 
                                  style={{ flexGrow: 1, padding: '6px 10px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px' }} 
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                  </div>

                  {isPatientStep && (
                    <>
                      <div style={{ color: "#64748b", fontSize: "14px", fontWeight: 500 }}>Étape Patient {currentStep + 1} / {totalPatientSteps}</div>
                      <p style={guideStepInstructionStyle}>{patientSteps[currentStep]}</p>
                      <div style={guideActionsStyle}>
                        <button style={{...baseGuideButtonStyle, background: "#22c55e", color: "white"}} onClick={() => logIntervention('Succès')}>✅ Résolu</button>
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
                        <button style={{...baseGuideButtonStyle, background: "#22c55e", color: "white"}} onClick={() => logIntervention('Succès')}>✅ Résolu</button>
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
                        <button style={{...baseGuideButtonStyle, background: "#64748b", color: "white"}} onClick={() => logIntervention('Échec')}>Terminer l'intervention</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )
          })()}
        </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}