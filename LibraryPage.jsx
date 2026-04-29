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
            causes: ["Fuite importante dans le circuit", "Masque mal ajusté", "Usure de la turbine", "Tuyau percé ou fissuré", "Valve de fuite intentionnelle obstruée", "Capteur de pression interne décalibré"],
            solutionsPatient: [
              "Est-ce que ça sonne tout le temps, ou juste quand vous vous tournez dans le lit ?",
              "Vous sentez de l'air qui s'échappe près de vos yeux ou de votre bouche ? Ça fait un sifflement ?",
              "Vérifiez que le tuyau n'est pas coincé ou percé.",
              "Assurez-vous que le coude est bien cliqué à l'arrière de la machine."
            ],
            solutionsTech: [
              "Guidez le patient pour utiliser la fonction 'Ajustement du masque' (Mask Fit) disponible dans le menu patient pour visualiser l'étanchéité.",
              "Accédez au menu clinicien et vérifiez que la pression prescrite (IPAP/EPAP) correspond à l'ordonnance.",
              "Entrez dans le menu de service pour lancer un test de la turbine et vérifier que la pression mesurée correspond à la pression de consigne.",
              "Inspecter le joint de sortie d'air interne.",
              "Vérifier l'absence d'obstruction dans le capteur de pression."
            ]
          },
          {
            title: "Problème d'alimentation (L'appareil ne s'allume pas)",
            causes: ["Cordon secteur déconnecté", "Prise murale défectueuse", "Bloc d'alimentation HS", "Connecteur arrière endommagé"],
            solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Avez-vous essayé de brancher une lampe sur cette prise ?", "Est-ce que le voyant du bloc est allumé ?"],
            solutionsTech: ["Vérifier le bloc d'alimentation externe.", "Tester la tension de sortie du bloc.", "Contrôler la continuité du câble secteur."]
          }] },
          { id: "lumis-150", name: "Lumis 150", failures: [{
            title: "L'appareil ne détecte pas la respiration (pas de trigger)",
            causes: ["Masque mal ajusté", "Fuites importantes", "Mauvais réglage du trigger", "Défaut du capteur de débit", "Auto-déclenchement dû à des turbulences", "Obstruction du filtre antibactérien"],
             solutionsPatient: [
              "Si vous forcez un peu l'inspiration, est-ce que la machine se déclenche ?",
              "C'est arrivé juste après avoir changé de masque ou touché un bouton ?",
              "Vérifiez si de l'eau (condensation) est présente dans le tuyau.",
              "Respirez calmement par le nez sans ouvrir la bouche."
            ],
            solutionsTech: [
              "Accédez au menu clinicien. Diminuez le réglage de sensibilité du trigger inspiratoire (ex: passez de 'Moyen' à 'Élevé') pour que l'appareil détecte des efforts plus faibles.",
              "Vérifiez le réglage de la 'Rampe'. Si elle est active, désactivez-la temporairement pour tester le déclenchement à la pression prescrite.",
              "Assurez-vous que le trigger expiratoire (Cycle) n'est pas réglé sur une valeur trop élevée (trop sensible), ce qui pourrait interrompre le cycle prématurément.",
              "Nettoyer le capteur de débit à l'air sec.",
              "Tester l'appareil avec un poumon de test."
            ]
          },
          {
            title: "Problème d'alimentation (Écran noir)",
            causes: ["Cordon déconnecté", "Prise murale défectueuse", "Bloc secteur HS", "Surtension réseau"],
            solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Voyez-vous une lumière sur le bloc rectangulaire du fil ?", "L'appareil a-t-il bippé au branchement ?"],
            solutionsTech: ["Vérifier le bloc d'alimentation externe.", "Tester avec un autre bloc 90W.", "Contrôler les fusibles internes si accessible."]
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
            causes: ["Problème d'alimentation externe", "Batterie déchargée ou défectueuse", "Panne matérielle interne de la carte mère"],
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
    models: [
      {
        id: "evita-v300",
        name: "Evita V300",
        failures: [{
            title: "Alarme 'Pression voies aériennes haute' (Paw haute)",
            causes: ["Obstruction du circuit", "Toux ou encombrement du patient", "Tuyau plié", "Filtre expiratoire colmaté"],
            solutionsPatient: [
              "Est-ce que la prise est bien branchée au mur et à l'appareil ?",
              "L'alarme sonne-t-elle seulement quand vous toussez ou en continu ?",
              "Pouvez-vous vérifier que le tuyau n'est pas coincé sous un pied de lit ou une roue ?"
            ],
            solutionsTech: [
              "Vérifiez le réglage de l'alarme Pmax (environ 10 cmH2O au-dessus de la Ppeak).",
              "Lancez la procédure de 'Test du circuit' ou 'Calibration du circuit' depuis le menu de service pour vérifier sa compliance et sa résistance.",
              "Inspectez et remplacez le filtre expiratoire si nécessaire."
            ]
        },
        {
            title: "Alarme 'Pression basse' ou 'Déconnexion' (Fuite)",
            causes: ["Déconnexion du circuit", "Fuite massive au masque", "Valve expiratoire mal clipsée", "Tubulure percée"],
            solutionsPatient: [
              "Est-ce que la prise est bien branchée au mur et à l'appareil ?",
              "Le tuyau est-il bien enfoncé sur la machine et sur votre masque ?",
              "Sentez-vous beaucoup d'air sortir au niveau de votre visage ?"
            ],
            solutionsTech: ["Vérifier l'intégrité de la tubulure (trous).", "Contrôler le montage de la valve expiratoire.", "Recalibrer les capteurs de débit."]
        },
        {
            title: "Problème d'alimentation / Batterie (L'appareil ne s'allume pas)",
            causes: ["Cordon déconnecté ou endommagé", "Panne secteur", "Batterie interne épuisée ou HS", "Fusible interne grillé"],
            solutionsPatient: [
              "Est-ce que la prise est bien branchée au mur et à l'appareil ?",
              "Y a-t-il un voyant vert ou une icône de prise sur l'écran ?",
              "L'appareil a-t-il bipé avant de s'éteindre ?"
            ],
            solutionsTech: ["Tester le cordon secteur.", "Vérifier les fusibles de l'appareil.", "Contrôler l'état de santé de la batterie interne."]
        },
        {
            title: "Bruit de condensation dans le circuit",
            causes: ["Humidité réglée trop haut", "Température de la chambre basse", "Appareil placé trop haut"],
            solutionsPatient: [
                "Est-ce que la prise est bien branchée ?",
                "Entendez-vous un clapotis dans le tuyau ?",
                "L'appareil est-il plus bas que votre tête ?"
            ],
            solutionsTech: ["Réduire le niveau d'humidité.", "Installer une housse de tuyau.", "Vérifier le fonctionnement de l'humidificateur."]
        },
        {
            title: "Erreur Système / Moteur défaillant",
            causes: ["Surchauffe interne", "Capteur de débit HS", "Turbine bloquée"],
            solutionsPatient: [
                "Est-ce que la prise est bien branchée ?",
                "L'appareil est-il très chaud au toucher ?",
                "Y a-t-il un code erreur affiché à l'écran ?"
            ],
            solutionsTech: ["Nettoyer les filtres d'entrée d'air.", "Effectuer un reset électrique (30 sec débranché).", "Retour atelier pour remplacement turbine."]
        }]
      },
      {
        id: "aircurve-10-cs",
        name: "AirCurve 10 CS PaceWave",
        failures: [
          {
            title: "Alerte : 'Fuite importante, vérifiez le bac à eau ou le joint du bac'",
            causes: ["Humidificateur mal inséré", "Joint du réservoir endommagé", "Bac fissuré", "Entrée d'air du bac obstruée"],
            solutionsPatient: ["Le réservoir d'eau est-il bien enfoncé jusqu'au clic ?", "Le joint en silicone est-il bien propre ?", "Voyez-vous de l'eau sous la machine ?", "Est-ce que la prise est bien branchée ?"],
            solutionsTech: ["Remplacer le joint du réservoir.", "Vérifier l'étanchéité du coude arrière.", "Contrôler le clapet anti-retour.", "Tester avec un bac neuf."]
          },
          {
            title: "Alarme 'Pression Haute' / Inconfort",
            causes: ["Patient qui lutte contre la machine", "Obstruction du circuit", "Filtre à air colmaté", "ASV auto-ajustement trop agressif"],
            solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Avez-vous l'impression que la machine vous envoie trop d'air d'un coup ?", "Le petit filtre à l'arrière est-il blanc ou gris ?"],
            solutionsTech: ["Ajuster les réglages de confort (Temps de montée).", "Remplacer le filtre à air.", "Vérifier la pression de consigne Max."]
          },
          {
            title: "Bruit de condensation dans le circuit",
            causes: ["Humidité trop haute", "Chambre trop froide", "Réservoir trop plein", "Appareil placé trop haut par rapport au lit"],
            solutionsPatient: ["Est-ce que la prise est bien branchée ?", "Entendez-vous de l'eau bouger dans le tuyau ?", "Le réservoir est-il rempli au-dessus du trait Max ?"],
            solutionsTech: ["Réduire l'humidité ou utiliser un ClimateLineAir.", "Vider le surplus d'eau dans le tuyau.", "Conseiller l'usage d'une housse de tuyau."]
          },
          {
            title: "Problème d'alimentation / Moteur défaillant",
            causes: ["Cordon mal branché", "Moteur défaillant", "Surchauffe", "Eau dans la turbine"],
            solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "L'écran est-il allumé ?", "Y a-t-il un message 'Moteur défaillant' ?"],
            solutionsTech: ["Tester le bloc 90W.", "Vérifier l'absence d'eau dans la turbine.", "Contrôler la tension de la carte.", "Nettoyer les conduits de ventilation."]
          }
        ]
      },
      {
        id: "aircurve-10-vauto",
        name: "AirCurve 10 VAuto",
        failures: [
          {
            title: "Alarme 'Pression Haute' ou Inconfort",
            causes: ["Pression de support trop élevée", "Asynchronie patient-ventilateur", "Trigger trop sensible"],
            solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Avez-vous du mal à suivre le rythme de la machine ?", "Sentez-vous des ballonnements au réveil ?"],
            solutionsTech: ["Diminuer la Pression de Support (PS).", "Ajuster la sensibilité du trigger (Trigger).", "Vérifier les réglages de cycle expiratoire."]
          },
          {
            title: "Alarme 'Fuite' ou 'Pression Basse' (Déconnexion)",
            causes: ["Harnais trop lâche", "Coussin de masque usé", "Circuit mal branché", "Bac à eau mal inséré"],
            solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Sentez-vous de l'air passer près de vos yeux ?", "Le tuyau est-il bien clipsé à l'arrière ?"],
            solutionsTech: ["Vérifier la taille du masque.", "Remplacer le coussin en silicone.", "Contrôler le joint de sortie arrière."]
          },
          {
            title: "Problème d'alimentation / Démarrage (Ecran noir)",
            causes: ["Bloc d'alimentation HS", "Bouton Start défectueux", "SmartStart désactivé", "Faux contact prise"],
            solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Est-ce que l'appareil démarre si vous appuyez sur le bouton ?", "Le voyant du bloc secteur est-il allumé ?"],
            solutionsTech: ["Vérifier l'alimentation 90W.", "Activer SmartStart dans le menu clinicien.", "Tester avec un autre cordon secteur."]
          },
          {
            title: "Bruit de condensation dans le circuit",
            causes: ["Humidité trop haute", "Température de chambre basse", "Appareil au sol"],
            solutionsPatient: [
                "Est-ce que la prise est bien branchée ?",
                "Entendez-vous un bruit d'eau ?",
                "L'appareil est-il au-dessus de votre lit ?"
            ],
            solutionsTech: ["Réduire le réglage d'humidité.", "Installer une housse de circuit.", "Vider l'eau du tuyau."]
          }
        ]
      },
      {
        id: "dreamstation-bipap-autosv",
        name: "DreamStation BiPAP autoSV",
        failures: [
          {
            title: "Alerte : 'Vérifier le débit' (Obstruction / Pression Haute)",
            causes: ["Obstruction dans le circuit respiratoire", "Filtre colmaté", "Fuite massive au masque", "Tuyau écrasé"],
            solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Le tuyau est-il plié ou écrasé ?", "Le masque est-il bien ajusté sur votre visage ?"],
            solutionsTech: ["Inspecter le tuyau.", "Remplacer le filtre à air.", "Réajuster le masque.", "Tester l'appareil avec un bouchon."]
          },
          {
            title: "L'appareil affiche 'Bloc d'alimentation incorrect' (Alim)",
            causes: ["Mauvais transformateur (60W au lieu de 80W)", "Fiche centrale tordue", "Bloc défectueux"],
            solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Le message s'affiche-t-il ?", "Est-ce bien le bloc d'alimentation d'origine Philips ?"],
            solutionsTech: ["Utiliser exclusivement le bloc d'alimentation de 80W fourni.", "Vérifier la tension de sortie du bloc secteur.", "Tester avec un autre bloc 80W Philips certifié."]
          },
          {
            title: "Bruit de sifflement provenant de la machine (Moteur/Fuite)",
            causes: ["Mauvais alignement entre l'appareil et l'humidificateur", "Joint interne mal positionné", "Fissure dans le bac à eau", "Turbine fatiguée"],
            solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Entendez-vous le sifflement au raccord entre les deux parties ?", "Le bac à eau présente-t-il une fissure visible ?"],
            solutionsTech: ["Réassembler l'appareil et l'humidificateur.", "Nettoyer les joints de connexion.", "Vérifier l'étanchéité pneumatique interne."]
          },
          {
            title: "Alarme 'Pression basse' / Fuite / Déconnexion",
            causes: ["Bac à eau mal enclenché", "Masque inadapté", "Circuit percé", "Valve expiratoire absente", "Joint interne délogé"],
            solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Avez-vous entendu un 'clic' en remettant le bac à eau ?", "Le masque est-il bien plaqué contre votre visage ?"],
            solutionsTech: ["Vérifier le joint du réservoir.", "Tester l'appareil avec un bouchon.", "Effectuer un test d'étanchéité système.", "Remplacer la tubulure."]
          },
          {
            title: "Bruit de condensation dans le circuit",
            causes: ["Niveau d'humidité trop haut", "Chambre froide", "Housse de tuyau manquante"],
            solutionsPatient: ["Est-ce que la prise est bien branchée ?", "Entendez-vous de l'eau bouger ?", "Le bac est-il trop rempli ?"],
            solutionsTech: ["Baisser le niveau d'humidité.", "Utiliser une housse de circuit.", "Vérifier la sonde thermique."]
          }
        ]
      },
      {
        id: "bipap-autosv-advanced",
        name: "BiPAP autoSV Advanced",
        failures: [
          {
            title: "Condensation dans le masque (phénomène de 'rainout') / Condensation",
            causes: ["Utilisation d'un humidificateur chauffant dans une pièce froide", "Absence de protection thermique du tuyau", "Réglage humidité trop haut"],
            solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Est-ce que votre tuyau est posé sur le sol froid ?", "Avez-vous des gouttes d'eau qui arrivent sur votre visage ?"],
            solutionsTech: ["Utiliser une housse de circuit.", "Baisser le réglage de l'humidificateur System One.", "Vérifier le circuit chauffant."]
          },
          {
            title: "L'appareil s'arrête de manière inattendue (Alim)",
            causes: ["Perte secteur", "Faux contact prise arrière", "Bloc alim HS", "Surchauffe interne", "Batterie interne vide"],
            solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "La machine s'arrête-t-elle si vous bougez légèrement le fil à l'arrière ?"],
            solutionsTech: ["Vérifier que le cordon est bien enfoncé.", "Tester avec une autre alimentation.", "Contrôler la température interne.", "Vérifier les logs d'erreurs d'alimentation."]
          },
          {
            title: "Alarme 'Pression Haute' / Paw Haute (Obstruction)",
            causes: ["Valve expiratoire bloquée", "Toux du patient", "Filtre colmaté", "Tuyau plié"],
            solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "La petite valve en plastique tourne-t-elle librement ?", "Avez-vous nettoyé le filtre à l'arrière ?"],
            solutionsTech: ["Nettoyer la valve System One.", "Remplacer le filtre gris.", "Vérifier les réglages de Pmax."]
          },
          {
            title: "Alarme 'Pression Basse' / Fuite",
            causes: ["Humidificateur mal verrouillé", "Circuit percé", "Masque défectueux"],
            solutionsPatient: ["Est-ce que la prise est bien branchée ?", "Entendez-vous un pshhh au raccord ?", "Le masque est-il usé ?"],
            solutionsTech: ["Vérifier l'alignement de l'humidificateur.", "Remplacer le circuit.", "Tester avec un masque neuf."]
          }
        ]
      }
    ]
  },
  {
    id: "ppc",
    name: "Pression Positive Continue (PPC)",
    models: [
      { 
        id: "s9", 
        name: "S9", 
        failures: [
          { title: "L’appareil ne s’allume pas (écran noir)", causes: ["Cordon débranché", "Bloc alim HS", "Prise murale HS", "Panne bouton"], solutionsPatient: ["Est-ce que la prise est bien branchée ?", "Le voyant du bloc est-il vert ?", "Avez-vous testé une autre prise ?"], solutionsTech: ["Tester le bloc d'alimentation 90W.", "Vérifier le connecteur interne.", "Remplacer le cordon secteur.", "Vérifier le bouton Marche/Arrêt."] },
          { title: "Alerte 'Air chaud' ou surchauffe", causes: ["Filtre colmaté", "Entrée d'air obstruée", "Pièce trop chaude", "Ventilateur interne bloqué"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Le petit filtre à air à l'arrière est-il blanc ou gris ?", "Y a-t-il assez d'espace autour de la machine ?"], solutionsTech: ["Remplacer le filtre.", "Nettoyer la turbine.", "Dépoussiérer les ouïes.", "Remplacer le ventilateur."] },
          { title: "Bruit de condensation dans le circuit", causes: ["Condensation", "Chambre froide", "Réglage haut", "Tuyau non isolé"], solutionsPatient: ["Est-ce que la prise est bien branchée ?", "Y a-t-il de l'eau dans le tuyau ?", "La machine est-elle au sol ?"], solutionsTech: ["Baisser le niveau d'humidité.", "Installer une housse de tuyau.", "Passer en mode manuel.", "Vérifier la sonde thermique."] },
          { title: "Erreur de carte SD / Bouche sèche", causes: ["Carte mal insérée", "Fuite buccale", "Humidificateur bas", "Protection écriture"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Le petit loquet de la carte SD est-il bien vers le haut ?", "Dormez-vous la bouche ouverte ?"], solutionsTech: ["Remplacer la carte SD.", "Augmenter l'humidité.", "Formater la carte en FAT32."] }
        ] 
      },
      { 
        id: "s10", 
        name: "S10", 
        failures: [
          {
            title: "Fuites de masque importantes",
            causes: ["Mauvais ajustement du masque", "Coussin usé", "Mauvaise taille de masque", "Harnais trop lâche", "Silicone jauni/rigide"],
            solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "La partie en silicone de votre masque, vous l'avez changée quand pour la dernière fois ?", "Ça fuit surtout quand vous dormez sur le côté, ou sur le dos ?"],
            solutionsTech: ["Examinez le coussin en silicone.", "Utilisez le gabarit de taille.", "Essayer un autre modèle.", "Vérifier la pression IPAP/EPAP."]
          },
          {
            title: "Problème d'alimentation",
            causes: ["Cordon déconnecté", "Prise défectueuse", "Alimentation HS", "Connecteur embase dessoudé"],
            solutionsPatient: ["La prise est-elle bien enfoncée ?", "L'écran s'allume-t-il au branchement ?", "Le fil est-il abîmé ?", "La prise murale marche avec une lampe ?"],
            solutionsTech: ["Vérifier le bloc d'alimentation.", "Tester la continuité.", "Contrôler le fusible embase.", "Ressouder le connecteur interne."]
          },
          {
            title: "Message d'erreur : 'Moteur défaillant, contactez le prestataire'",
            causes: ["Entrée d'air obstruée (poussière)", "Humidité ayant pénétré dans le moteur", "Usure naturelle de la turbine", "Filtre bouché"],
            solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Le filtre à air à l'arrière est-il propre ?", "Y a-t-il eu de l'eau renversée sur l'appareil ?"],
            solutionsTech: ["Remplacez le filtre à air immédiatement.", "Laissez l'appareil sécher.", "SAV technique.", "Tester la turbine en mode service."]
          },
          {
            title: "Le réservoir d'eau fuit ou l'appareil affiche 'Insérer réservoir'",
            causes: ["Joint du réservoir HumidAir fissuré ou sec", "Réservoir calcaire empêchant la fermeture hermétique"],
            solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Voyez-vous des traces d'eau sous l'appareil ?", "Le joint en silicone du réservoir vous semble-t-il abîmé ou sec ?"],
            solutionsTech: ["Nettoyez le calcaire avec du vinaigre blanc.", "Remplacez le joint en silicone s'il présente des coupures."]
          },
          {
            title: "Bouton Marche/Arrêt ou molette inopérante",
            causes: ["Poussière ou résidus bloquant le mécanisme", "Axe de molette fendu", "Nappe de commande déconnectée"],
            solutionsPatient: ["Avez-vous essayé d'appuyer plus fermement au centre ?", "Nettoyez le contour avec une brossette sèche.", "La molette tourne-t-elle dans le vide ?"],
            solutionsTech: ["Nettoyer le contacteur.", "Vérifier la nappe de liaison.", "Remplacer l'interface de commande."]
          },
          {
            title: "Problème d’affichage (Écran noir ou figé)",
            causes: ["Bug logiciel", "Écran LCD défectueux", "Choc physique"],
            solutionsPatient: ["Effectuez un cycle d'alimentation (débrancher 30 sec).", "L'écran s'éclaire-t-il au démarrage ?", "Voyez-vous des taches noires sur l'afficheur ?"],
            solutionsTech: ["Rebrancher la nappe LCD.", "Remplacer le bloc écran.", "Mise à jour firmware."]
          },
          {
            title: "Alerte 'Filtre bouché, vérifiez le filtre'",
            causes: ["Filtre à air sale", "Obstruction de la grille d'entrée", "Rappel de maintenance"],
            solutionsPatient: ["Le filtre à l'arrière est-il blanc ou gris/noir ?", "Assurez-vous qu'aucun objet (rideau, mur) n'est à moins de 5cm de l'entrée d'air."],
            solutionsTech: ["Changer le filtre.", "Dépoussiérer l'entrée d'air turbine.", "Vérifier le capteur de débit."]
          }
        ] 
      },
      { 
        id: "s11", 
        name: "S11", 
        failures: [
          {
            title: "L’écran tactile ne répond pas ou réagit mal",
            causes: ["Doigts humides", "Bug logiciel", "Interférences", "Eau sur l'écran"],
            solutionsPatient: ["Avez-vous les mains sèches ?", "Avez-vous un téléphone proche ?", "L'écran est-il propre ?", "Prise bien branchée ?"],
            solutionsTech: ["Nettoyer l'écran.", "Débrancher 30 sec.", "Mise à jour firmware.", "Tester l'écran tactile."]
          },
          {
            title: "Message : 'Fuite importante, vérifiez le bac ou le circuit'",
            causes: ["Bac mal inséré", "Joint mal mis", "Tuyau mal cliqué", "Bac fendu"],
            solutionsPatient: ["Le bac a-t-il fait 'clic' ?", "Le joint est-il plat ?", "Le coude arrière est-il verrouillé ?", "Prise bien branchée ?"],
            solutionsTech: ["Réinsérer le bac fermement.", "Vérifier le joint interne.", "Changer le circuit.", "Vérifier l'étanchéité du bac."]
          },
          {
            title: "Le traitement ne démarre pas seul (SmartStart)",
            causes: ["Respiration faible", "Fuites", "Option OFF", "Canule trop longue"],
            solutionsPatient: ["Respirez plus fort au début.", "Le SmartStart est-il sur 'On' ?", "Le masque est-il bien ajusté ?", "Prise bien branchée ?"],
            solutionsTech: ["Vérifier le menu clinicien.", "Contrôler l'étanchéité.", "Recalibrer turbine.", "Ajuster trigger."]
          },
          { 
            title: "Alim (Écran noir)", 
            causes: ["Alimentation", "Connectique", "Carte HS", "Surtension"], 
            solutionsPatient: ["La prise est-elle branchée ?", "L'écran s'allume-t-il ?", "Testé sur une autre prise ?", "Câble tordu ?"], 
            solutionsTech: ["Tester bloc alim.", "Changer cordon.", "Vérifier carte.", "Contrôler fusible."] 
          },
          {
            title: "Erreur de carte SD",
            causes: ["Carte mal insérée", "Protection en écriture", "Carte HS"],
            solutionsPatient: ["Le petit loquet de la carte est-il bien vers le haut ?", "Retirez et remettez la carte fermement."],
            solutionsTech: ["Formater la carte en FAT32.", "Remplacer la carte SD."]
          }

        ]
      },
      {
        id: "dreamstation-1", 
        name: "DreamStation (Pro, Auto, Expert)", 
        failures: [
          { title: "Message 'Bloc d'alimentation incorrect'", causes: ["Mauvais transfo", "Fiche tordue", "Bloc défectueux"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Le bloc secteur est-il bien celui d'origine ?", "La fiche centrale est-elle tordue ?"], solutionsTech: ["Vérifier puissance 80W.", "Tester avec un autre bloc Philips.", "Redresser la tige centrale avec précaution."] },
          { title: "Fuite d'eau sous l'appareil", causes: ["Bac mal inséré", "Trop plein", "Joint de base usé"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Avez-vous dépassé le trait MAX ?", "Avez-vous entendu le clic en remettant le bac ?"], solutionsTech: ["Réinsérer le bac.", "Remplacer le joint de l'embase.", "Vérifier l'étanchéité du réservoir."] },
          {
            title: "Alerte 'Vérifier le débit'",
            causes: ["Tuyau écrasé ou plié", "Filtre ultra-fin blanc colmaté", "Obstruction turbine"],
            solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Le tuyau est-il bien déroulé ?", "Le petit filtre blanc est-il sale ou noir ?"],
            solutionsTech: ["Remplacer le filtre blanc.", "Déplier le tuyau.", "Vérifier le moteur."]
          },
          {
            title: "L'appareil glisse et fait du bruit",
            causes: ["Pieds antidérapants sales", "Vibration du tuyau", "Surface inégale"],
            solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Les petits patins sous la machine sont-ils propres ?", "Le tuyau tire-t-il sur l'appareil ?"],
            solutionsTech: ["Nettoyer les pieds à l'alcool.", "Utiliser une potence.", "Ajouter des patins neufs."]
          },
          { title: "Dégradation mousse PE-PUR (Rappel)", causes: ["Vieillissement matériau", "Nettoyage ozone", "Humidité forte"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Avez-vous bien arrêté d'utiliser la machine comme demandé ?", "Avez-vous reçu votre nouvelle machine ?"], solutionsTech: ["Remplacer l'appareil.", "Vérifier le numéro de série.", "Déclaration sur portail Philips."] }
        ]
      },
      {
        id: "dreamstation-2", 
        name: "DreamStation 2", 
        failures: [
          { title: "L'écran tactile ne répond pas bien", causes: ["Mains humides", "Bug", "Proximité onde"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Avez-vous essayé d'essuyer l'écran ?", "Vos mains sont-elles sèches ?"], solutionsTech: ["Débrancher 30 sec pour réinitialiser.", "Mise à jour logiciel.", "Tester écran en mode SAV."] },
          { title: "L'appareil indique 'Vérifiez le circuit'", causes: ["Tuyau mal mis", "Circuit percé", "Joint coude usé"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Le tuyau est-il bien branché à l'arrière ?", "Voyez-vous une fente sur le tuyau ?"], solutionsTech: ["Vérifier raccordement coude.", "Tester avec un autre circuit.", "Changer le joint de sortie."] }
        ]
      },
      {
        id: "remstar-auto", 
        name: "REMstar Auto (P-Flex)", 
        failures: [
          { title: "Sifflement à l'inspiration", causes: ["Humidificateur mal verrouillé", "Joint usé", "Bac fissuré"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Les deux parties sont-elles bien clipsées ?"], solutionsTech: ["Vérifier joints noirs.", "Remplacer embase humidificateur.", "Vérifier étanchéité bac."] }
              ,
              {
                title: "L'appareil fait un bruit de sifflement ou de vibration",
                causes: ["Filtre mal installé", "Humidificateur mal clipsé", "Moteur fatigué", "Filtre absent"],
                solutionsPatient: ["Le filtre est-il au fond ?", "L'humidificateur est-il clipsé ?", "Rien ne vibre ?", "Prise bien branchée ?"],
                solutionsTech: ["Vérifier filtre.", "Réassembler unité.", "Changer moteur.", "Remplacer silentblocs."]
              },
              {
                title: "L'eau ne chauffe pas (air froid)",
                causes: ["Picots de connexion oxydés", "Réservoir mal posé", "Plaque chauffante HS", "Mode ECO"],
                solutionsPatient: ["Est-ce que la prise est bien branchée ?", "Contacts propres ?", "Le réservoir est-il bien enfoncé ?", "L'air est-il sec ?"],
                solutionsTech: ["Nettoyez contacts.", "Assurez-vous de l'insertion.", "Tester résistance plaque.", "Désactiver ECO."]
              }
        ]
      },
      {
        id: "fp-icon", 
        name: "ICON", 
        failures: [
          { title: "L’humidificateur ne chauffe pas", causes: ["Mode ECO", "Chambre mal mise", "Plaque HS", "Connectique sale"], solutionsPatient: ["La prise est branchée ?", "Mode ECO affiché ?", "Le bac est-il au fond ?", "Symbole chauffe visible ?"], solutionsTech: ["Désactiver ECO.", "Vérifier plaque.", "Changer embase.", "Nettoyer contacts."] },
          { title: "Pression limitée à 18 cmH2O", causes: ["Altitude", "Usure moteur", "Fuite interne", "Obstruction"], solutionsPatient: ["La prise est branchée ?", "Vivez-vous en montagne ?", "Le moteur est bruyant ?", "Filtre gris ?"], solutionsTech: ["Ajuster altitude.", "Check turbine.", "Calibration.", "Remplacer turbine."] }
        ]
      },
      {
        id: "nea", 
        name: "NÉA", 
        failures: [
              { 
                title: "L'appareil ne démarre pas", 
                causes: ["Cordon mal branché", "Bloc d'alimentation défectueux", "Panne carte interne", "Interrupteur"], 
                solutionsPatient: [
                  "Est-ce que la prise est bien branchée au mur et à l'appareil ?", 
                  "L'écran s'allume-t-il quand vous branchez le câble ?", 
                  "Voyez-vous un voyant allumé sur le bloc rectangulaire du cordon ?",
                  "Testé sur une autre prise ?"
                ], 
                solutionsTech: ["Vérifier la tension de sortie.", "Contrôler le connecteur.", "Changer carte.", "Tester l'interrupteur."] 
              },
              {
                title: "Fuites de masque importantes",
                causes: ["Masque mal mis", "Coussin usé", "Taille inadaptée", "Pression support"],
                solutionsPatient: [
                  "Est-ce que la prise est bien branchée au mur et à l'appareil ?",
                  "Sentez-vous de l'air s'échapper vers vos yeux ?",
                  "Le silicone du masque est-il encore bien souple ?",
                  "Harnais trop serré ?"
                ],
                solutionsTech: ["Vérifier la taille.", "Remplacer coussin.", "Changer harnais.", "Réglage Rampe."]
              },
              {
                title: "Air trop sec ou sensation de nez bouché",
                causes: ["Humidité basse", "Bac vide", "Plaque HS", "Clapet fermé"],
                solutionsPatient: [
                  "Est-ce que la prise est bien branchée au mur et à l'appareil ?",
                  "Reste-t-il de l'eau dans le bac le matin ?",
                  "Avez-vous essayé d'augmenter le niveau de chauffage ?",
                  "Air tiède ?"
                ],
                solutionsTech: ["Augmenter le réglage.", "Vérifier la chauffe.", "Tester sonde.", "Vérifier clapet."]
              },
              {
                title: "Bruit de condensation dans le circuit",
                causes: ["Humidité forte", "Chambre froide", "Machine haute", "Tuyau non isolé"],
                solutionsPatient: ["Est-ce que la prise est bien branchée ?", "Entendez-vous de l'eau bouger ?", "L'appareil est-il plus bas que votre tête ?", "Glouglou ?"],
                solutionsTech: ["Diminuer le niveau.", "Vider le tuyau.", "Housse isolante.", "Check sonde ambiante."]
              }
        ]
      },
      { id: "z2-auto", name: "Z2 Auto", failures: [] },
      {
        id: "aircurve-10",
        name: "AirCurve 10",
        failures: [
          {
            title: "Bruit de condensation dans le circuit",
            causes: ["Humidité trop forte", "Chambre froide", "Absence de circuit chauffant"],
            solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Entendez-vous un clapotis dans le tuyau ?"],
            solutionsTech: ["Réduire l'humidité.", "Utiliser ClimateLineAir.", "Ajouter une housse."]
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
                causes: ["Manomètre mal réglé", "Tuyauterie bouchée ou mal connectée", "Bocal plein ou mal fermé", "Batterie faible", "Filtre antibactérien colmaté"],
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
                causes: ["Batterie complètement déchargée", "Problème d'alimentation secteur", "Fusible interne grillé"],
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
    id: "desencombrement",
    name: "Désencombrement",
    subTypes: [
      { id: "aide-a-la-toux", name: "Aide à la toux", models: [
        { id: "biwaze", name: "BiWaze", failures: [
          { 
            title: "Toux inefficace (Mobilisation faible)", 
            causes: ["Pressions d'exsufflation trop basses", "Sécrétions trop visqueuses ou sèches", "Fuites massives au masque", "Temps d'inspiration trop court"], 
            solutionsPatient: [
              "Vérifier que la prise est bien branchée au mur et à l'appareil",
              "S'assurer que le masque est bien plaqué contre le visage (pas de sifflement)",
              "Boire davantage d'eau pour fluidifier les glaires",
              "Bien vider ses poumons avant le début du cycle d'insufflation"
            ], 
            solutionsTech: [
              "Augmenter progressivement les pressions d'insufflation et d'exsufflation",
              "Ajuster les temps de cycle (augmenter l'inspiration pour un meilleur volume)",
              "Vérifier l'étanchéité pneumatique complète du circuit",
              "Mesurer la pression réelle en sortie de turbine avec un manomètre"
            ] 
          },
          { 
            title: "Mauvaise synchronisation (Trigger)", 
            causes: ["Réglage du trigger inadapté", "Rythme respiratoire irrégulier", "Stress ou anxiété du patient", "Fuite d'air perturbant la détection"], 
            solutionsPatient: [
              "Vérifier que l'appareil est bien alimenté (prise secteur)",
              "Essayer de caler son souffle sur le rythme de la machine",
              "Vérifier que le tuyau n'est pas écrasé ou plié",
              "Se détendre et respirer calmement par le nez"
            ], 
            solutionsTech: [
              "Ajuster la sensibilité du trigger inspiratoire et expiratoire",
              "Passer en mode automatique si le patient peine à déclencher",
              "Vérifier et mettre à jour le firmware de l'appareil",
              "Recalibrer les capteurs de débit internes"
            ] 
          },
          { 
            title: "Désaturation pendant l'utilisation", 
            causes: ["Effort respiratoire trop important", "Cycles trop longs ou trop fréquents", "Encombrement bronchique majeur", "Temps de repos insuffisant"], 
            solutionsPatient: [
              "Vérifier le branchement électrique de la machine",
              "Faire des pauses plus longues entre chaque série de cycles",
              "Vérifier si le taux d'oxygène (SpO2) descend sous 90%",
              "Signaler toute fatigue excessive ou malaise"
            ], 
            solutionsTech: [
              "Surveillance de la SpO2 en continu pendant la séance",
              "Allonger les temps de repos programmés entre les cycles",
              "Réduire le nombre de cycles par série pour limiter l'effort",
              "Ajouter de l'oxygène dans le circuit si prescrit"
            ] 
          },
          { 
            title: "Fuite importante au circuit ou masque", 
            causes: ["Masque mal ajusté ou taille inadaptée", "Circuit mal connecté à la machine", "Valve expiratoire défaillante ou sale", "Tubulure percée ou fendue"], 
            solutionsPatient: [
              "Vérifier que le cordon secteur est bien enfoncé",
              "Resserrer légèrement le harnais du masque",
              "S'assurer que le tuyau est bien cliqué sur l'appareil",
              "Nettoyer le silicone du masque avec de l'eau savonneuse"
            ], 
            solutionsTech: [
              "Changer la taille ou le modèle du masque (test de gabarit)",
              "Vérifier et nettoyer soigneusement la valve expiratoire",
              "Remplacer la tubulure si une fuite est détectée par test de pression",
              "Vérifier l'état des joints de connexion internes"
            ] 
          },
          { 
            title: "Inconfort / Mauvaise tolérance", 
            causes: ["Montée en pression trop brutale", "Pression de consigne trop élevée", "Trigger trop vif", "Aérophagie (avaler de l'air)"], 
            solutionsPatient: [
              "Vérifier que l'alimentation de la machine est stable",
              "Essayer de ne pas lutter contre l'arrivée d'air",
              "Utiliser la fonction rampe si disponible pour une montée douce",
              "Signaler toute sensation de ballonnement abdominal"
            ], 
            solutionsTech: [
              "Augmenter le temps de rampe (pente d'insufflation)",
              "Diminuer légèrement les pressions Max si la tolérance est nulle",
              "Ajuster la sensibilité du déclenchement pour plus de souplesse",
              "Revoir la position du patient pendant la séance (plus assis)"
            ] 
          },
          { 
            title: "Problème d'alimentation / Batterie", 
            causes: ["Cordon secteur déconnecté ou abîmé", "Batterie interne vide ou HS", "Bloc d'alimentation HS", "Fusible interne grillé"], 
            solutionsPatient: [
              "Vérifier que la prise est bien enfoncée au mur et sur le bloc",
              "Tester l'appareil sur une autre prise murale",
              "Vérifier si un voyant s'allume sur le bloc noir du fil",
              "Laisser charger l'appareil au moins 2 heures sur secteur"
            ], 
            solutionsTech: [
              "Tester la tension de sortie du bloc d'alimentation (Multimètre)",
              "Lancer un test de cycle de charge de la batterie (Menu service)",
              "Vérifier la continuité du connecteur d'embase arrière",
              "Vérifier et remplacer le fusible interne si nécessaire"
            ] 
          },
          { 
            title: "Bruit anormal / Baisse de puissance", 
            causes: ["Usure des roulements de la turbine", "Filtres internes encrassés", "Surchauffe moteur", "Obstruction de l'entrée d'air"], 
            solutionsPatient: [
              "Vérifier le branchement secteur",
              "Nettoyer ou remplacer le filtre à air à l'arrière",
              "S'assurer que rien ne bouche les grilles de ventilation",
              "Éloigner l'appareil des sources de chaleur (radiateur)"
            ], 
            solutionsTech: [
              "Vérifier le compteur d'heures de la turbine",
              "Mesurer les pressions de sortie réelles",
              "Nettoyer l'intérieur de l'appareil et remplacer les filtres HEPA",
              "Remplacer le bloc turbine si le bruit de roulement persiste"
            ] 
          }
        ]},
        { id: "clearway", name: "Clearway", failures: [
          { 
            title: "Toux inefficace (Mobilisation faible)", 
            causes: ["Pressions d'insufflation/exsufflation trop basses", "Sécrétions trop sèches", "Fuites massives au masque", "Temps d'exsufflation trop court"], 
            solutionsPatient: [
              "Vérifiez que le masque est bien plaqué (pas de sifflement)",
              "Avez-vous bu assez d'eau aujourd'hui ?",
              "Essayez de bien vider vos poumons avant le démarrage"
            ], 
            solutionsTech: [
              "Augmenter progressivement la pression d'exsufflation",
              "Ajuster le temps de plateau inspiratoire",
              "Vérifier l'étanchéité interne du bloc turbine"
            ] 
          },
          { 
            title: "Mauvaise synchronisation (Trigger)", 
            causes: ["Sensibilité du trigger inadaptée", "Stress patient", "Fuite perturbant le capteur"], 
            solutionsPatient: [
              "Essayez de caler votre respiration sur l'appareil",
              "Le tuyau est-il bien branché et non plié ?",
              "Respirez calmement par le nez"
            ], 
            solutionsTech: [
              "Réglage fin de la sensibilité du trigger inspiratoire",
              "Passer en mode automatique si nécessaire",
              "Calibration des capteurs de débit"
            ] 
          },
          { 
            title: "Fuite d’air importante", 
            causes: ["Masque inadapté ou usé", "Harnais trop lâche", "Valve expiratoire mal positionnée"], 
            solutionsPatient: [
              "L'air passe-t-il près de vos yeux ?",
              "Resserrer légèrement le harnais",
              "Nettoyer le silicone du masque"
            ], 
            solutionsTech: [
              "Changer la taille du masque (test gabarit)",
              "Vérifier la valve expiratoire",
              "Contrôler la tubulure"
            ] 
          },
          { 
            title: "Problème d'alimentation / Batterie", 
            causes: ["Cordon secteur mal enfoncé", "Bloc d'alimentation HS", "Fusible interne grillé"], 
            solutionsPatient: [
              "La prise est-elle bien branchée au mur et à la machine ?",
              "Y a-t-il une lumière sur le bloc secteur ?"
            ], 
            solutionsTech: [
              "Tester la tension du bloc alim",
              "Vérifier le fusible interne",
              "Contrôler le connecteur d'embase"
            ] 
          }
        ]}
      ] },
      { id: "mixte", name: "Mixte", models: [
        { id: "pegaso", name: "Pegaso A Cough", failures: [
          { 
            title: "Toux inefficace (Mobilisation faible)", 
            causes: ["Pressions d'insufflation/exsufflation trop basses", "Sécrétions trop visqueuses ou sèches", "Fuites massives au masque", "Mauvaise synchronisation"], 
            solutionsPatient: [
              "Vérifier que le masque est bien ajusté et qu'il n'y a pas de fuites audibles",
              "S'assurer d'une bonne hydratation pour fluidifier les sécrétions",
              "Essayer de bien vider les poumons avant le début du cycle d'insufflation"
            ], 
            solutionsTech: [
              "Augmenter progressivement les pressions d'insufflation et d'exsufflation",
              "Ajuster les temps de cycle (inspiration/expiration)",
              "Vérifier l'étanchéité du circuit patient et du masque",
              "Recalibrer les capteurs de pression et de débit"
            ] 
          },
          { 
            title: "Mauvaise synchronisation (Trigger)", 
            causes: ["Sensibilité du trigger inadaptée", "Rythme respiratoire irrégulier du patient", "Fuite d'air perturbant la détection"], 
            solutionsPatient: [
              "Essayer de se détendre et de caler sa respiration sur le rythme de la machine",
              "Vérifier que le tuyau n'est pas plié ou écrasé",
              "Signaler si l'appareil démarre trop tôt ou trop tard"
            ], 
            solutionsTech: [
              "Ajuster la sensibilité du trigger inspiratoire et expiratoire",
              "Passer en mode automatique si le patient a du mal à déclencher",
              "Vérifier l'absence de fuite au niveau du masque et du circuit"
            ] 
          },
          { 
            title: "Problème d'alimentation / Batterie", 
            causes: ["Cordon secteur déconnecté ou endommagé", "Batterie interne vide ou défectueuse", "Bloc d'alimentation HS", "Fusible interne grillé"], 
            solutionsPatient: [
              "Vérifier que la prise est bien branchée au mur et à l'appareil",
              "S'assurer que le voyant du bloc d'alimentation est allumé",
              "Laisser l'appareil charger sur secteur pendant au moins 2 heures"
            ], 
            solutionsTech: [
              "Tester la tension de sortie du bloc d'alimentation",
              "Vérifier l'état de la batterie interne (test de capacité)",
              "Contrôler la continuité du câble secteur et du connecteur d'embase"
            ] 
          },
          { 
            title: "Bruit anormal / Baisse de puissance (Turbine)", 
            causes: ["Usure des roulements de la turbine", "Filtres internes encrassés", "Surchauffe moteur", "Obstruction de l'entrée d'air"], 
            solutionsPatient: [
              "Nettoyer ou remplacer le filtre à air à l'arrière de l'appareil",
              "S'assurer que rien ne bouche les grilles de ventilation",
              "Signaler tout bruit inhabituel (sifflement, frottement)"
            ], 
            solutionsTech: [
              "Vérifier le compteur d'heures de la turbine",
              "Mesurer les pressions de sortie réelles de l'appareil",
              "Nettoyer l'intérieur de l'appareil et remplacer les filtres HEPA",
              "Remplacer le bloc turbine si le bruit de roulement persiste"
            ] 
          }
        ]},
        { id: "clearway-2", name: "Clearway 2", failures: [
          { 
            title: "Toux inefficace (Mobilisation faible)", 
            causes: ["Pressions d'insufflation/exsufflation trop basses", "Sécrétions trop visqueuses ou sèches", "Fuites massives au masque", "Temps d'exsufflation trop court"], 
            solutionsPatient: [
              "Vérifiez que le masque est bien plaqué (pas de sifflement)",
              "Avez-vous bu assez d'eau aujourd'hui ?",
              "Essayez de bien vider vos poumons avant le démarrage"
            ], 
            solutionsTech: [
              "Augmenter progressivement la pression d'exsufflation",
              "Ajuster le temps de plateau inspiratoire",
              "Vérifier l'étanchéité interne du bloc turbine"
            ] 
          },
          { 
            title: "Mauvaise synchronisation (Trigger)", 
            causes: ["Sensibilité du trigger inadaptée", "Stress patient", "Fuite perturbant le capteur"], 
            solutionsPatient: [
              "Essayez de caler votre respiration sur l'appareil",
              "Le tuyau est-il bien branché et non plié ?",
              "Respirez calmement par le nez"
            ], 
            solutionsTech: [
              "Réglage fin de la sensibilité du trigger inspiratoire",
              "Passer en mode automatique si nécessaire",
              "Calibration des capteurs de débit"
            ] 
          },
          { 
            title: "Fuite d’air importante", 
            causes: ["Masque inadapté ou usé", "Harnais trop lâche", "Valve expiratoire mal positionnée"], 
            solutionsPatient: [
              "L'air passe-t-il près de vos yeux ?",
              "Resserrer légèrement le harnais",
              "Nettoyer le silicone du masque"
            ], 
            solutionsTech: [
              "Changer la taille du masque (test gabarit)",
              "Vérifier la valve expiratoire",
              "Contrôler la tubulure"
            ] 
          },
          { 
            title: "Problème d'alimentation / Batterie", 
            causes: ["Cordon secteur mal enfoncé", "Bloc d'alimentation HS", "Fusible interne grillé"], 
            solutionsPatient: [
              "La prise est-elle bien branchée au mur et à la machine ?",
              "Y a-t-il une lumière sur le bloc secteur ?"
            ], 
            solutionsTech: [
              "Tester la tension du bloc alim",
              "Vérifier le fusible interne",
              "Contrôler le connecteur d'embase"
            ] 
          }
        ]},
        { id: "e70", name: "E70", failures: [
          { 
            title: "Toux inefficace (Mobilisation faible)", 
            causes: ["Pressions d'insufflation/exsufflation trop basses", "Sécrétions trop visqueuses ou sèches", "Fuites massives au masque", "Temps d'exsufflation trop court"], 
            solutionsPatient: [
              "Vérifier que le masque est bien ajusté et qu'il n'y a pas de fuites audibles",
              "S'assurer d'une bonne hydratation pour fluidifier les sécrétions",
              "Essayer de bien vider les poumons avant le début du cycle d'insufflation"
            ], 
            solutionsTech: [
              "Augmenter progressivement les pressions d'insufflation et d'exsufflation",
              "Ajuster les temps de cycle (inspiration/expiration)",
              "Vérifier l'étanchéité du circuit patient et du masque",
              "Recalibrer les capteurs de pression et de débit"
            ] 
          },
          { 
            title: "Mauvaise synchronisation (Trigger)", 
            causes: ["Sensibilité du trigger inadaptée", "Rythme respiratoire irrégulier du patient", "Fuite d'air perturbant la détection"], 
            solutionsPatient: [
              "Essayer de se détendre et de caler sa respiration sur le rythme de la machine",
              "Vérifier que le tuyau n'est pas plié ou écrasé",
              "Signaler si l'appareil démarre trop tôt ou trop tard"
            ], 
            solutionsTech: [
              "Ajuster la sensibilité du trigger inspiratoire et expiratoire",
              "Passer en mode automatique si le patient a du mal à déclencher",
              "Vérifier l'absence de fuite au niveau du masque et du circuit"
            ] 
          },
          { 
            title: "Problème d'alimentation / Batterie", 
            causes: ["Cordon secteur déconnecté ou endommagé", "Batterie interne vide ou défectueuse", "Bloc d'alimentation HS", "Fusible interne grillé"], 
            solutionsPatient: [
              "Vérifier que la prise est bien branchée au mur et à l'appareil",
              "S'assurer que le voyant du bloc d'alimentation est allumé",
              "Laisser l'appareil charger sur secteur pendant au moins 2 heures"
            ], 
            solutionsTech: [
              "Tester la tension de sortie du bloc d'alimentation",
              "Vérifier l'état de la batterie interne (test de capacité)",
              "Contrôler la continuité du câble secteur et du connecteur d'embase"
            ] 
          },
          { 
            title: "Bruit anormal / Baisse de puissance (Turbine)", 
            causes: ["Usure des roulements de la turbine", "Filtres internes encrassés", "Surchauffe moteur", "Obstruction de l'entrée d'air"], 
            solutionsPatient: [
              "Nettoyer ou remplacer le filtre à air à l'arrière de l'appareil",
              "S'assurer que rien ne bouche les grilles de ventilation",
              "Signaler tout bruit inhabituel (sifflement, frottement)"
            ], 
            solutionsTech: [
              "Vérifier le compteur d'heures de la turbine",
              "Mesurer les pressions de sortie réelles de l'appareil",
              "Nettoyer l'intérieur de l'appareil et remplacer les filtres HEPA",
              "Remplacer le bloc turbine si le bruit de roulement persiste"
            ] 
          }
        ]},
        { id: "eo70", name: "Station + Turbine EO-70", failures: [
          { 
            title: "Toux inefficace (Mobilisation faible)", 
            causes: ["Pressions d'insufflation/exsufflation trop basses", "Sécrétions trop visqueuses ou sèches", "Fuites massives au masque", "Mauvaise synchronisation"], 
            solutionsPatient: [
              "Vérifier que le masque est bien ajusté et qu'il n'y a pas de fuites audibles",
              "S'assurer d'une bonne hydratation pour fluidifier les sécrétions",
              "Essayer de bien vider les poumons avant le début du cycle d'insufflation"
            ], 
            solutionsTech: [
              "Augmenter progressivement les pressions d'insufflation et d'exsufflation",
              "Ajuster les temps de cycle (inspiration/expiration)",
              "Vérifier l'étanchéité du circuit patient et du masque",
              "Recalibrer les capteurs de pression et de débit"
            ] 
          },
          { 
            title: "Mauvaise synchronisation (Trigger)", 
            causes: ["Sensibilité du trigger inadaptée", "Rythme respiratoire irrégulier du patient", "Fuite d'air perturbant la détection"], 
            solutionsPatient: [
              "Essayer de se détendre et de caler sa respiration sur le rythme de la machine",
              "Vérifier que le tuyau n'est pas plié ou écrasé",
              "Signaler si l'appareil démarre trop tôt ou trop tard"
            ], 
            solutionsTech: [
              "Ajuster la sensibilité du trigger inspiratoire et expiratoire",
              "Passer en mode automatique si le patient a du mal à déclencher",
              "Vérifier l'absence de fuite au niveau du masque et du circuit"
            ] 
          },
          { 
            title: "Problème d'alimentation / Batterie", 
            causes: ["Cordon secteur déconnecté ou endommagé", "Batterie interne vide ou défectueuse", "Bloc d'alimentation HS", "Fusible interne grillé"], 
            solutionsPatient: [
              "Vérifier que la prise est bien branchée au mur et à l'appareil",
              "S'assurer que le voyant du bloc d'alimentation est allumé",
              "Laisser l'appareil charger sur secteur pendant au moins 2 heures"
            ], 
            solutionsTech: [
              "Tester la tension de sortie du bloc d'alimentation",
              "Vérifier l'état de la batterie interne (test de capacité)",
              "Contrôler la continuité du câble secteur et du connecteur d'embase"
            ] 
          },
          { 
            title: "Bruit anormal / Baisse de puissance (Turbine)", 
            causes: ["Usure des roulements de la turbine", "Filtres internes encrassés", "Surchauffe moteur", "Obstruction de l'entrée d'air"], 
            solutionsPatient: [
              "Nettoyer ou remplacer le filtre à air à l'arrière de l'appareil",
              "S'assurer que rien ne bouche les grilles de ventilation",
              "Signaler tout bruit inhabituel (sifflement, frottement)"
            ], 
            solutionsTech: [
              "Vérifier le compteur d'heures de la turbine",
              "Mesurer les pressions de sortie réelles de l'appareil",
              "Nettoyer l'intérieur de l'appareil et remplacer les filtres HEPA",
              "Remplacer le bloc turbine si le bruit de roulement persiste"
            ] 
          }
        ]},
        { id: "comfort-cough", name: "Comfort Cough II", failures: [
          { 
            title: "Toux inefficace (Mobilisation faible)", 
            causes: ["Pressions d'insufflation/exsufflation trop basses", "Sécrétions trop visqueuses ou sèches", "Fuites massives au masque", "Temps d'exsufflation trop court"], 
            solutionsPatient: [
              "Vérifier que le masque est bien ajusté et qu'il n'y a pas de fuites audibles",
              "S'assurer d'une bonne hydratation pour fluidifier les sécrétions",
              "Essayer de bien vider les poumons avant le début du cycle d'insufflation"
            ], 
            solutionsTech: [
              "Augmenter progressivement les pressions d'insufflation et d'exsufflation",
              "Ajuster les temps de cycle (inspiration/expiration)",
              "Vérifier l'étanchéité du circuit patient et du masque",
              "Recalibrer les capteurs de pression et de débit"
            ] 
          },
          { 
            title: "Mauvaise synchronisation (Trigger)", 
            causes: ["Sensibilité du trigger inadaptée", "Rythme respiratoire irrégulier du patient", "Fuite d'air perturbant la détection"], 
            solutionsPatient: [
              "Essayer de se détendre et de caler sa respiration sur le rythme de la machine",
              "Vérifier que le tuyau n'est pas plié ou écrasé",
              "Signaler si l'appareil démarre trop tôt ou trop tard"
            ], 
            solutionsTech: [
              "Ajuster la sensibilité du trigger inspiratoire et expiratoire",
              "Passer en mode automatique si le patient a du mal à déclencher",
              "Vérifier l'absence de fuite au niveau du masque et du circuit"
            ] 
          },
          { 
            title: "Problème d'alimentation / Batterie", 
            causes: ["Cordon secteur déconnecté ou endommagé", "Batterie interne vide ou défectueuse", "Bloc d'alimentation HS", "Fusible interne grillé"], 
            solutionsPatient: [
              "Vérifier que la prise est bien branchée au mur et à l'appareil",
              "S'assurer que le voyant du bloc d'alimentation est allumé",
              "Laisser l'appareil charger sur secteur pendant au moins 2 heures"
            ], 
            solutionsTech: [
              "Tester la tension de sortie du bloc d'alimentation",
              "Vérifier l'état de la batterie interne (test de capacité)",
              "Contrôler la continuité du câble secteur et du connecteur d'embase"
            ] 
          },
          { 
            title: "Bruit anormal / Baisse de puissance (Turbine)", 
            causes: ["Usure des roulements de la turbine", "Filtres internes encrassés", "Surchauffe moteur", "Obstruction de l'entrée d'air"], 
            solutionsPatient: [
              "Nettoyer ou remplacer le filtre à air à l'arrière de l'appareil",
              "S'assurer que rien ne bouche les grilles de ventilation",
              "Signaler tout bruit inhabituel (sifflement, frottement)"
            ], 
            solutionsTech: [
              "Vérifier le compteur d'heures de la turbine",
              "Mesurer les pressions de sortie réelles de l'appareil",
              "Nettoyer l'intérieur de l'appareil et remplacer les filtres HEPA",
              "Remplacer le bloc turbine si le bruit de roulement persiste"
            ] 
          }
        ]}
      ] 
    },
      { id: "ippb", name: "Relaxateur de pression (IPPB)", models: [
        { id: "alpha-300", name: "VAEB Alpha 300", failures: [
          { 
            title: "Pression instable / Débit irrégulier", 
            causes: ["Mauvais réglage de la pression ou du débit", "Fuite importante dans le circuit", "Usure interne du compresseur ou des valves", "Filtres colmatés", "Clapet anti-retour bloqué", "Condensateur de démarrage du moteur fatigué"], 
            solutionsPatient: [
              "Vérifier que la prise est bien branchée au mur et à l'appareil",
              "Est-ce que l'air vous semble changer de force brusquement ou de manière irrégulière ?",
              "Entendez-vous un sifflement ou un bruit d'air qui s'échappe quelque part ?",
              "Le filtre à air à l'arrière est-il propre ?",
              "Avez-vous essayé de brancher l'appareil directement sur la prise murale sans multiprise ?"
            ], 
            solutionsTech: [
              "Recalibrer l'appareil (pression et débit) via le menu service.",
              "Effectuer un test d'étanchéité complet du circuit patient et interne.",
              "Vérifier l'état du compresseur et des valves pneumatiques.",
              "Remplacer les filtres à air (entrée et sortie).",
              "Mesurer la tension aux bornes du moteur pendant le cycle.",
              "Vérifier l'étanchéité du raccord rapide de sortie."
            ] 
          },
          { 
            title: "Inconfort respiratoire / Mauvaise tolérance", 
            causes: ["Pression d'insufflation trop élevée", "Temps d'insufflation inadapté", "Mauvaise adaptation du patient", "Plaie buccale ou nasale", "Trigger inspiratoire trop dur", "Humidité de l'air insuffisante"], 
            solutionsPatient: [
              "Vérifier que la prise est bien branchée au mur et à l'appareil",
              "L'air arrive-t-il trop fort ou trop brutalement ?",
              "Le masque ou l'embout vous blesse-t-il ou irrite-t-il la peau ?",
              "Avez-vous du mal à suivre le rythme de la machine ?",
              "Essayez de vous détendre et de prendre de plus petites inspirations au début."
            ], 
            solutionsTech: [
              "Ajuster progressivement la pression d'insufflation pour améliorer le confort.",
              "Modifier les temps d'insufflation et d'expiration pour une meilleure synchronisation.",
              "Conseiller une interface patient plus adaptée (masque, embout buccal).",
              "Vérifier la pression de consigne et les réglages de rampe.",
              "Ajuster la sensibilité du déclenchement (trigger).",
              "Vérifier le fonctionnement de la valve de sécurité."
            ] 
          },
          { 
            title: "Fuite d’air importante au masque ou circuit", 
            causes: ["Masque/embout mal positionné", "Taille d'interface inadaptée", "Harnais trop lâche", "Tubulure percée", "Joint de bocal d'humidification usé", "Raccord O2 mal enclenché"], 
            solutionsPatient: [
              "Vérifier que la prise est bien branchée au mur et à l'appareil",
              "Sentez-vous de l'air s'échapper sur les côtés du masque ou de l'embout ?",
              "Le masque bouge-t-il trop facilement sur votre visage ?",
              "Entendez-vous un sifflement au niveau du tuyau ?",
              "Vérifiez que le réservoir d'eau est bien vissé ou clipsé."
            ], 
            solutionsTech: [
              "Repositionner correctement le masque ou l'embout sur le patient.",
              "Changer la taille ou le modèle de l'interface patient.",
              "Remplacer le harnais si usé ou détendu.",
              "Vérifier l'intégrité de la tubulure et des connexions.",
              "Tester l'étanchéité sous pression à 30 cmH2O.",
              "Remplacer les joints toriques des connecteurs."
            ] 
          },
          { 
            title: "Problème d'alimentation (L'appareil ne s'allume pas)", 
            causes: ["Cordon secteur déconnecté ou endommagé", "Prise murale défectueuse", "Compresseur interne HS", "Interrupteur défectueux", "Fusible grillé", "Disjoncteur thermique activé"], 
            solutionsPatient: [
              "Vérifier que la prise est bien branchée au mur et à l'appareil",
              "Le compresseur démarre-t-il (fait-il du bruit) ?",
              "Avez-vous essayé de brancher l'appareil sur une autre prise électrique ?",
              "Le voyant d'alimentation est-il allumé ?",
              "Appuyez sur le bouton de réinitialisation (reset) s'il est accessible."
            ], 
            solutionsTech: [
              "Tester la continuité du cordon secteur et du connecteur d'embase.",
              "Vérifier le condensateur de démarrage du compresseur.",
              "Contrôler l'interrupteur Marche/Arrêt.",
              "Vérifier et remplacer le fusible interne si nécessaire.",
              "Mesurer la tension en sortie de carte d'alimentation.",
              "Vérifier l'absence de court-circuit sur le moteur."
            ] 
          }
        ]},
        { id: "eo-300", name: "EO-300 IPPB", failures: [
          { 
            title: "Inefficacité ventilatoire / Toux inefficace", 
            causes: ["Mauvais réglage de la pression ou du débit", "Fuite importante au masque ou circuit", "Capteur de pression/débit défectueux", "Sécrétions trop denses", "Filtre HME saturé", "Paramètre de pente (Ramp) trop lent"], 
            solutionsPatient: [
              "Vérifier que la prise est bien branchée au mur et à l'appareil",
              "L'appareil vous aide-t-il à respirer profondément et à mobiliser les sécrétions ?",
              "Sentez-vous une résistance anormale à l'inspiration ou l'expiration ?",
              "S'assurer d'une bonne hydratation.",
              "Vérifiez si le filtre antibactérien n'est pas humide ou obstrué."
            ], 
            solutionsTech: [
              "Ajuster les paramètres de pression (IPAP/EPAP) et de débit (Flow).",
              "Réévaluer le protocole de traitement avec le prescripteur.",
              "Recalibrer les capteurs de pression et de débit.",
              "Vérifier l'étanchéité complète du circuit patient.",
              "Contrôler le volume courant expiré réel.",
              "Mettre à jour le logiciel de l'appareil."
            ] 
          },
          { 
            title: "Mauvaise synchronisation patient-machine", 
            causes: ["Sensibilité du trigger inadaptée", "Fuites massives perturbant la détection", "Rythme respiratoire irrégulier", "Défaut du capteur de trigger", "Auto-déclenchement dû à des condensations"], 
            solutionsPatient: [
              "Vérifier que la prise est bien branchée au mur et à l'appareil",
              "La machine se déclenche-t-elle au moment où vous inspirez ?",
              "L'air arrive-t-il trop tard ou trop tôt par rapport à votre effort ?",
              "Avez-vous du mal à coordonner votre respiration avec l'appareil ?",
              "Videz l'eau éventuellement présente dans le circuit."
            ], 
            solutionsTech: [
              "Ajuster la sensibilité du trigger inspiratoire et expiratoire.",
              "Renforcer le coaching du patient sur la coordination respiratoire.",
              "Vérifier l'absence de fuites importantes au masque et au circuit.",
              "Tester et, si nécessaire, remplacer le capteur de trigger.",
              "Vérifier l'intégrité de la valve expiratoire.",
              "Analyser les logs de trigger dans le menu clinicien."
            ] 
          },
          { 
            title: "Fuite d’air importante au masque ou circuit", 
            causes: ["Masque mal positionné", "Tubulure percée", "Valve expiratoire défectueuse", "Coussin de masque usé", "Membrane de valve mal clipsée", "Fissure sur le bocal"], 
            solutionsPatient: [
              "Vérifier que la prise est bien branchée au mur et à l'appareil",
              "Sentez-vous de l'air s'échapper sur les côtés du masque ?",
              "Le masque est-il bien plaqué contre votre visage ?",
              "Entendez-vous un sifflement au niveau du tuyau ou des raccords ?",
              "Vérifiez que le tuyau est bien 'cliqué' à l'arrière."
            ], 
            solutionsTech: [
              "Repositionner correctement le masque et ajuster le harnais.",
              "Changer la taille ou le modèle du masque si inadapté.",
              "Remplacer la tubulure si elle est percée ou fendue.",
              "Vérifier et nettoyer la valve expiratoire.",
              "Remplacer le joint de la valve de sortie.",
              "Tester l'appareil avec un bouchon pour isoler la fuite."
            ] 
          },
          { 
            title: "Débit insuffisant / Baisse de puissance", 
            causes: ["Obstruction du circuit patient", "Filtre d'entrée d'air colmaté", "Moteur ou turbine fatigué", "Fuite interne", "Accumulation de poussière sur la grille de refroidissement"], 
            solutionsPatient: [
              "Vérifier que la prise est bien branchée au mur et à l'appareil",
              "Le tuyau est-il plié, écrasé ou bouché ?",
              "Le filtre à air à l'arrière est-il propre et non encrassé ?",
              "L'appareil vous semble-t-il moins puissant qu'avant ?",
              "Dégagez l'espace autour de la machine pour qu'elle respire mieux."
            ], 
            solutionsTech: [
              "Vérifier l'intégrité et la perméabilité du circuit patient.",
              "Remplacer le filtre d'entrée d'air.",
              "Mesurer le débit et la pression en sortie d'appareil.",
              "Vérifier l'état du moteur/turbine et rechercher des fuites internes.",
              "Nettoyer la turbine à l'air comprimé sec.",
              "Contrôler la vitesse de rotation de la turbine (RPM)."
            ] 
          }
        ]}
      ] 
    },
    {
    id: "humidificateur",
    name: "Humidificateur",
    subTypes: [
      {
        id: "hum-interne",
        name: "Internes (dépendants de la machine)",
        models: [
          { id: "dreamstation-hum", name: "DreamStation", failures: [
              { 
                title: "Pas de chauffage / Air froid", 
                causes: ["Plaque chauffante défectueuse", "Mauvaise connexion avec l'unité PPC", "Menu humidification désactivé", "Connecteurs d'embase oxydés"], 
                solutionsPatient: [
                  "Vérifiez que le bac est bien enfoncé jusqu'au 'clic'",
                  "S'assurer que l'option d'humidification est active dans le menu 'Confort'",
                  "Nettoyez les contacts métalliques à l'arrière du bac avec un chiffon sec"
                ], 
                solutionsTech: [
                  "Mesurer la tension de sortie sur l'embase de la machine",
                  "Tester la continuité de la résistance de chauffe",
                  "Vérifier le bon fonctionnement du capteur de présence bac",
                  "Remplacer l'embase chauffante si nécessaire"
                ] 
              },
              { 
                title: "Fuite d'eau sous l'appareil", 
                causes: ["Réservoir fissuré", "Joint du couvercle mal positionné", "Niveau d'eau dépassant le trait MAX", "Joint de l'embase interne usé"], 
                solutionsPatient: [
                  "Vérifiez que le joint bleu dans le couvercle est bien plat et propre",
                  "Avez-vous rempli le bac au-dessus de la ligne maximale ?",
                  "Le couvercle est-il bien clipsé sur les quatre côtés ?",
                  "Essuyez bien le dessous du bac avant de le remettre"
                ], 
                solutionsTech: [
                  "Remplacer le joint d'étanchéité du couvercle",
                  "Inspecter le bac à la lumière pour détecter une micro-fissure",
                  "Vérifier l'alignement de la tubulure de sortie d'air",
                  "Changer le réservoir complet"
                ] 
              },
              { 
                title: "Bruit de glouglou / Condensation (Rainout)", 
                causes: ["Réglage humidité trop élevé", "Température de chambre trop basse", "Tuyau non isolé", "Appareil placé trop haut par rapport au patient"], 
                solutionsPatient: [
                  "Baissez le réglage de l'humidificateur d'un ou deux niveaux",
                  "Placez la machine plus bas que le niveau de votre tête",
                  "Videz l'eau accumulée dans le tuyau au milieu de la nuit",
                  "Installez une housse en tissu sur le tuyau"
                ], 
                solutionsTech: [
                  "Conseiller l'utilisation d'un tuyau chauffant (HT15)",
                  "Vérifier la sonde de température ambiante de l'appareil",
                  "Activer le mode 'Adaptatif' dans les réglages cliniciens"
                ] 
              }
          ] },
          { id: "h41", name: "H41", failures: [
              { title: "Pas de chauffage", causes: ["Plaque chauffante HS", "Option désactivée dans le menu", "Mauvais couplage"], solutionsPatient: ["Vérifiez l'activation dans le menu patient", "Vérifiez que le bac est bien inséré à fond", "L'air est-il tiède après 10 minutes ?"], solutionsTech: ["Tester la résistance de la plaque", "Vérifier le fusible thermique interne", "Remplacer la plaque."] },
              { title: "Fuite d'eau", causes: ["Joint de bac usé", "Bac mal positionné", "Fissure dans le plastique"], solutionsPatient: ["Vérifiez que le joint est propre et bien logé", "Retirez et remettez le bac fermement", "Voyez-vous de l'eau sous la machine ?"], solutionsTech: ["Changer le joint d'étanchéité", "Remplacer le bac", "Vérifier l'alignement des ports."] },
              { 
                title: "Air trop sec / Mauvaise humidification", 
                causes: ["Niveau d'eau stable (ne baisse pas)", "Bac calcaire", "Réglage trop bas", "Pièce trop ventilée"], 
                solutionsPatient: [
                  "Détartrez le bac avec du vinaigre blanc dilué",
                  "Vérifiez si l'air de la chambre n'est pas trop sec (chauffage excessif)",
                  "Augmentez le réglage de chauffe sur l'appareil",
                  "S'assurer que la canule ou le masque est bien étanche"
                ], 
                solutionsTech: ["Vérifier la résistance chauffante", "Contrôler les réglages de rampe d'humidité"] 
              }
          ] },
          { id: "humidair", name: "HumidAir", failures: [
              { title: "Pas de chauffage", causes: ["Connecteurs sales ou oxydés", "Plaque chauffante défectueuse", "Mauvaise insertion"], solutionsPatient: ["Vérifiez que la prise est bien branchée", "Nettoyez les petits contacts au dos du bac avec un chiffon sec", "Poussez le bac jusqu'à entendre le clic"], solutionsTech: ["Vérifier la continuité du circuit de chauffe", "Mesurer la tension aux bornes de l'embase", "Remplacer la plaque"] },
              { title: "Fuite d'eau", causes: ["Bac mal inséré", "Joint de réservoir pincé", "Réservoir calcaire"], solutionsPatient: ["Vérifiez que le réservoir est enfoncé à fond", "Le joint en silicone est-il bien propre et plat ?", "Y a-t-il du calcaire sur les bords du bac ?"], solutionsTech: ["Nettoyer au vinaigre blanc", "Remplacer le joint silicone", "Tester avec un bac neuf"] },
              { title: "Pas d'humidification / Air sec", causes: ["Réglage trop bas", "Mode manuel inadapté", "Fuite importante au masque"], solutionsPatient: ["Essayez de passer le réglage sur 'Auto'", "Augmentez le niveau d'humidité manuellement", "Vérifiez que le masque ne fuit pas"], solutionsTech: ["Activer le mode Climate Control Auto", "Tester avec un tuyau ClimateLineAir", "Check calibration sonde."] }
          ] },
          { id: "hum-bipap-a40", name: "BIPAP A40", failures: [
              { title: "Pas de chauffage", causes: ["Connecteurs métalliques sales", "Plaque HS", "Désactivé dans le menu"], solutionsPatient: ["Nettoyer les connecteurs métalliques avec un coton-tige sec", "Assurez-vous que l'humidificateur est activé", "Vérifiez le branchement du bac"], solutionsTech: ["Contrôler la continuité de la résistance", "Vérifier la tension de sortie", "Remplacer la plaque."] },
              { title: "Fuite d'eau", causes: ["Joint de réservoir usé", "Bac fissuré", "Trop-plein"], solutionsPatient: ["Le joint du réservoir semble-t-il souple et bien mis ?", "Ne pas dépasser le trait MAX", "Voyez-vous de l'eau couler le long du bac ?"], solutionsTech: ["Remplacer le joint du réservoir", "Changer le bac", "Vérifier l'étanchéité du socle."] },
              { title: "Eau dans le circuit", causes: ["Humidité trop haute", "Pièce froide", "Machine trop haute"], solutionsPatient: ["Essayez de baisser le niveau d'humidité", "Videz le tuyau pendant la nuit", "Placez l'appareil plus bas que votre tête"], solutionsTech: ["Installer une housse de circuit", "Ajuster les réglages cliniciens", "Check inclinaison."] }
          ] },
          { id: "hum-breas", name: "Breas", failures: [
              { 
                title: "Pas de chauffage / Erreur Humidificateur", 
                causes: ["Plaque HS", "Mauvais clipsage sur la machine", "Contacts embase tordus", "Option désactivée dans le menu clinicien", "Fusible thermique interne"], 
                solutionsPatient: ["Vérifiez que le bac est bien enclenché", "Assurez-vous que l'icône de chauffe est visible sur l'écran", "Débranchez et rebranchez l'appareil pour réinitialiser"], 
                solutionsTech: ["Vérifier la continuité de la plaque", "Mesurer la tension sur les broches de connexion", "Activer l'option dans le menu service"] 
              },
              { 
                title: "Fuite d'eau / Condensation", 
                causes: ["Joint de couvercle usé", "Bac fissuré (choc)", "Trop plein d'eau", "Réglage trop élevé par rapport à la température"], 
                solutionsPatient: ["Ne pas dépasser le trait max", "Vérifiez que le joint blanc est bien plat", "Placez l'appareil plus bas que votre lit"], 
                solutionsTech: ["Remplacer le joint d'étanchéité", "Changer le réservoir", "Vérifier la sonde de température ambiante"] 
              }
          ] },
          { id: "hum-sys1", name: "System One", failures: [
              { 
                title: "Pas de chauffage / Voyant bleu éteint", 
                causes: ["Plaque HS", "Mauvaise connexion embase", "Picots de contact oxydés", "Alimentation 60W insuffisante (nécessite 80W)"], 
                solutionsPatient: ["Nettoyez les contacts métalliques avec un coton-tige sec", "Assurez-vous que le voyant sur le côté est bien allumé", "Vérifiez que le bac est poussé à fond"], 
                solutionsTech: ["Tester avec un bloc 80W", "Remplacer l'embase chauffante", "Vérifier la résistance (Ohms)"] 
              },
              { 
                title: "Condensation dans le masque", 
                causes: ["Réglage humidité trop haut", "Chambre froide", "Absence de housse", "Tuyau non chauffant"], 
                solutionsPatient: ["Tentez de baisser le réglage d'un cran ou deux", "Videz l'eau du tuyau pendant la nuit", "Utilisez une housse isolante sur le tuyau"], 
                solutionsTech: ["Proposer un circuit chauffant System One", "Contrôle des capteurs de débit", "Check calibration."] 
              }
          ] },
          { id: "nea-hum", name: "NEA", failures: [
              { title: "Pas de chauffage", causes: ["Plaque chauffante HS", "Désactivé dans le menu", "Mauvaise insertion du bac"], solutionsPatient: ["Activez l'humidification dans le menu 'Confort'", "Vérifiez que le bac est bien clipsé", "L'air est-il tiède après 10 minutes ?"], solutionsTech: ["Remplacer la plaque chauffante", "Vérifier la nappe de connexion interne", "Tester l'alimentation de la plaque"] },
              { title: "Fuite d'eau", causes: ["Joint silicone usé", "Couvercle mal clipsé", "Trop-plein d'eau"], solutionsPatient: ["Le joint noir sous le bac est-il propre et en place ?", "Le couvercle a-t-il bien fait 'clic' ?", "Vérifiez que vous n'avez pas dépassé le trait MAX"], solutionsTech: ["Remplacer le joint d'embase", "Changer le réservoir complet", "Vérifier le châssis."] },
              { title: "Bruit de condensation (Glouglou)", causes: ["Humidité réglée trop forte", "Chambre froide", "Machine placée trop haut"], solutionsPatient: ["Baissez le réglage d'un niveau", "Vider l'eau du tuyau au milieu de la nuit", "Isolez le tuyau avec une housse"], solutionsTech: ["Calibration de la sonde ambiante", "Vérifier le fonctionnement du circuit chauffant si présent", "Check circuit."] }
          ] },
          { id: "prisma-aqua", name: "PrismaAQUA", failures: [
              { 
                title: "Pas de chauffage / Symbole absent", 
                causes: ["Défaut résistance", "Mauvais couplage Prisma", "Tarnissage des contacts", "Bac vide (sécurité)"], 
                solutionsPatient: ["Vérifiez que le symbole de chauffe est présent sur l'écran", "Nettoyez les contacts sous le bac avec un chiffon sec", "Remplissez le bac jusqu'au niveau"], 
                solutionsTech: ["Vérifier la résistance chauffante", "Contrôler le connecteur de l'appareil Prisma"] 
              },
              { 
                title: "Air trop sec / Niveau d'eau stable", 
                causes: ["Réglage trop bas", "Bac entartré", "Fuite au masque", "Température de chambre trop haute"], 
                solutionsPatient: ["Détartrez le bac au vinaigre blanc", "Augmentez le niveau de 1 à 5", "Vérifiez l'étanchéité de votre masque"], 
                solutionsTech: ["Contrôler la régulation de puissance", "Vérifier la sonde de température"] 
              }
          ] },
          { id: "hum-sbox", name: "S.Box", failures: [
              { 
                title: "Pas de chauffage / Mauvaise connexion", 
                causes: ["Bac mal inséré", "Joint arrière déformé", "Plaque chauffante HS", "Bug logiciel"], 
                solutionsPatient: ["Retirez et remettez le bac fermement", "Vérifiez que l'humidificateur est activé sur l'écran tactile", "Videz le bac et séchez les contacts"], 
                solutionsTech: ["Vérifier le joint de liaison interne", "Tester la plaque chauffante", "Mise à jour firmware"] 
              },
              { 
                title: "Fuite d'eau arrière", 
                causes: ["Joint silicone pincé", "Réservoir mal fermé", "Calcaire sur les portées de joint"], 
                solutionsPatient: ["Vérifiez que le gros joint noir est bien positionné", "Nettoyez le contour du réservoir", "Assurez-vous qu'il n'y a pas de fissure"], 
                solutionsTech: ["Remplacer le joint de l'embase", "Changer le réservoir"] 
              }
          ] }
        ]
      },
      {
        id: "hum-externe",
        name: "Externes (modules autonomes)",
        models: [
          { id: "hc150", name: "HC150", failures: [
              { 
                title: "Pas de chauffage / Voyant éteint", 
                causes: ["Résistance défectueuse", "Fusible interne grillé", "Interrupteur défectueux", "Thermostat de sécurité activé"], 
                solutionsPatient: [
                  "Vérifiez que l'appareil est branché sur une prise murale en direct",
                  "Tournez le bouton rotatif : le voyant orange s'allume-t-il ?",
                  "L'appareil a-t-il fonctionné à vide (sans eau) récemment ?",
                  "Vérifiez l'état du cordon d'alimentation"
                ], 
                solutionsTech: [
                  "Tester la résistance (Ohmmètre)",
                  "Remplacer le fusible thermique si l'appareil a surchauffé",
                  "Vérifier la tension aux bornes du bouton de réglage",
                  "Contrôler le câblage interne"
                ] 
              },
              { 
                title: "Fuite d'eau / Condensation excessive", 
                causes: ["Joint de bac usé", "Bac mal positionné", "Différence de température trop forte", "Tuyau non isolé"], 
                solutionsPatient: [
                  "Vérifiez que le bac est bien à plat sur la plaque",
                  "Le joint en caoutchouc est-il propre et sans fissure ?",
                  "Eloignez l'appareil des courants d'air froid",
                  "Isolez le tuyau avec une housse"
                ], 
                solutionsTech: ["Remplacer le joint d'étanchéité", "Vérifier la régulation de température", "Inspecter le bac pour micro-fissures"] 
              }
          ] },
          { id: "mr810-mr820", name: "MR810 / MR820", failures: [
              { title: "Pas de chauffage", causes: ["Appareil mal branché", "Résistance HS", "Fusible thermique sauté"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Est-ce que le voyant orange en façade est allumé ?", "L'air est-il tiède après 10 minutes ?"], solutionsTech: ["Vérifier l'alimentation secteur.", "Remplacer la base chauffante.", "Vérifier la continuité de l'interrupteur."] },
              { title: "Fuite d'eau", causes: ["Chambre mal percée", "Joint usé", "Raccords mal serrés"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Est-ce que vous voyez de l'eau couler le long du réservoir bleu ?", "Est-ce que les tuyaux sont bien enfoncés sur les raccords ?"], solutionsTech: ["Changer la chambre d'humidification.", "Inspecter l'intégrité de la chambre.", "Vérifier l'étanchéité des raccords."] },
              { title: "Pas d'humidification", causes: ["Température ambiante basse", "Sonde défectueuse", "Flux d'air trop important"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Est-ce que l'air vous paraît trop frais ou trop sec ?", "Est-ce que vous avez installé une housse de protection sur le tuyau ?"], solutionsTech: ["Ajuster la température.", "Vérifier la sonde de température.", "Contrôler le débit de l'appareil associé."] },
              { title: "Défaut d'alimentation", causes: ["Câble secteur abîmé", "Surtension", "Fusible interne grillé"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Est-ce que vous avez essayé de le brancher sur une autre prise ?", "Le voyant d'alimentation s'allume-t-il ?"], solutionsTech: ["Vérifier le cordon et le fusible interne.", "Mesurer la tension d'entrée."] }
          ] },
          { id: "my-airvo-2", name: "MY AIRVO 2", failures: [
              { title: "Pas de chauffage", causes: ["Résistance chauffante défectueuse", "Erreur logicielle", "Surchauffe"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Est-ce que vous voyez un message d'alerte rouge sur l'écran ?", "Redémarrer l'appareil."], solutionsTech: ["Remplacement de la base chauffante.", "Mise à jour du firmware.", "Vérifier le capteur de température."] },
              { title: "Fuite d'eau", causes: ["Chambre mal insérée", "Joint usé", "Trop-plein d'eau"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Est-ce que le réservoir est bien poussé au fond de son emplacement ?", "Est-ce que vous voyez de l'eau couler sous la machine ?"], solutionsTech: ["Remplacer le joint de base.", "Vérifier le clapet anti-retour.", "Changer le réservoir."] },
              { title: "Pas d'humidification", causes: ["Pièce trop froide", "Circuit non chauffé", "Canule nasale bouchée"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Avez-vous beaucoup d'eau dans votre canule nasale ?", "Sentez-vous que l'air est trop froid ?"], solutionsTech: ["Vérifier la continuité du circuit chauffant.", "Recalibrer les capteurs.", "Vérifier le bloc turbine."] },
              { title: "Alimentation / Batterie", causes: ["Cordon secteur déconnecté", "Batterie interne déchargée ou HS", "Bloc alimentation défaillant"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Est-ce que vous voyez l'icône de batterie s'afficher à l'écran ?", "L'appareil bipe-t-il au branchement ?"], solutionsTech: ["Vérifier le bloc d'alimentation externe.", "Tester la tension de sortie du bloc.", "Vérifier la carte d'alimentation."] }
          ] },
          { id: "vhb10a", name: "VHB10A", failures: [
              { title: "Pas de chauffage", causes: ["Résistance HS", "Fusible grillé", "Défaut carte"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Est-ce que l'interrupteur sur le côté est sur la position 'I' ?", "Vérifiez si l'écran s'allume."], solutionsTech: ["Remplacement de la résistance.", "Vérifier le fusible.", "Tester la résistance."] },
              { title: "Fuite d'eau", causes: ["Raccords mal serrés", "Joint dégradé", "Fissure réservoir"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Est-ce que vous voyez de l'eau couler près des raccords blancs ?", "Est-ce que le bac à eau est bien stable sur sa base ?"], solutionsTech: ["Vérifier l'étanchéité.", "Resserrer les raccords.", "Remplacer le joint."] },
              { title: "Pas d'humidification", causes: ["Manque d'isolation", "Fil chauffant déconnecté", "Sonde défectueuse"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Est-ce que l'air vous semble trop sec ?", "Est-ce que vous avez bien branché le câble électrique du tuyau ?"], solutionsTech: ["Vérifier le fil chauffant.", "Vérifier la sonde thermique.", "Ajuster la puissance."] },
              { title: "Problème d'alimentation", causes: ["Interrupteur HS", "Fusible grillé", "Cordon abîmé"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Est-ce que les chiffres s'allument sur l'écran ?", "Tester une autre prise."], solutionsTech: ["Vérifier le cordon et le fusible.", "Vérifier le fusible.", "Mesurer la tension."] }
          ] }
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
              { title: "Pas de débit ou débit insuffisant", causes: ["Bouteille vide (aiguille rouge)", "Robinet mal ouvert", "Canule pliée ou écrasée", "Régulateur défectueux"], solutionsPatient: ["Regardez le manomètre : l'aiguille est-elle dans la zone verte ?", "Le robinet sur le dessus est-il ouvert à fond ?", "Vérifiez que personne ne marche sur le tuyau.", "Essayez avec une autre canule neuve."], solutionsTech: ["Tester la bouteille avec un autre manodétendeur", "Vérifier la pression de sortie", "Contrôler l'absence d'obstruction dans le raccord de sortie"] },
              { title: "Fuite d'oxygène (sifflement)", causes: ["Joint de valve (O-ring) usé ou manquant", "Raccord rapide mal enclenché", "Soupape de sécurité activée"], solutionsPatient: ["Entendez-vous un sifflement (pshhh) au niveau du robinet ?", "Débranchez et rebranchez fermement la canule", "Fermez le robinet immédiatement si la fuite est importante"], solutionsTech: ["Remplacer le joint d'étanchéité (O-ring)", "Vérifier le serrage du manodétendeur", "Tester l'étanchéité"] },
              { title: "Débitmètre bloqué ou dur à tourner", causes: ["Encrassement interne", "Choc mécanique", "Gel interne (utilisation intensive)"], solutionsPatient: ["Le bouton tourne-t-il sans forcer ?", "Y a-t-il du givre blanc sur le métal ?", "Laissez reposer la bouteille 15 minutes"], solutionsTech: ["Nettoyer le mécanisme de réglage", "Remplacer le bloc régulateur", "Vérifier l'absence de corps gras"] }
            ]
          },
          {
            id: "b2", name: "Bouteille B2", failures: [
              { title: "Pas de débit ou débit insuffisant", causes: ["Bouteille vide (aiguille rouge)", "Robinet mal ouvert", "Canule pliée ou écrasée", "Régulateur défectueux"], solutionsPatient: ["Regardez le manomètre : l'aiguille est-elle dans la zone verte ?", "Le robinet sur le dessus est-il ouvert à fond ?", "Vérifiez que personne ne marche sur le tuyau.", "Essayez avec une autre canule neuve."], solutionsTech: ["Tester la bouteille avec un autre manodétendeur", "Vérifier la pression de sortie", "Contrôler l'absence d'obstruction dans le raccord de sortie"] },
              { title: "Fuite d'oxygène (sifflement)", causes: ["Joint de valve (O-ring) usé ou manquant", "Raccord rapide mal enclenché", "Soupape de sécurité activée"], solutionsPatient: ["Entendez-vous un sifflement (pshhh) au niveau du robinet ?", "Débranchez et rebranchez fermement la canule", "Fermez le robinet immédiatement si la fuite est importante"], solutionsTech: ["Remplacer le joint d'étanchéité (O-ring)", "Vérifier le serrage du manodétendeur", "Tester l'étanchéité"] },
              { title: "Débitmètre bloqué ou dur à tourner", causes: ["Encrassement interne", "Choc mécanique", "Gel interne (utilisation intensive)"], solutionsPatient: ["Le bouton tourne-t-il sans forcer ?", "Y a-t-il du givre blanc sur le métal ?", "Laissez reposer la bouteille 15 minutes"], solutionsTech: ["Nettoyer le mécanisme de réglage", "Remplacer le bloc régulateur", "Vérifier l'absence de corps gras"] }
            ]
          },
          {
            id: "b5", name: "Bouteille B5", failures: [
              { title: "Pas de débit ou débit insuffisant", causes: ["Bouteille vide (aiguille rouge)", "Robinet mal ouvert", "Canule pliée ou écrasée", "Régulateur défectueux"], solutionsPatient: ["Regardez le manomètre : l'aiguille est-elle dans la zone verte ?", "Le robinet sur le dessus est-il ouvert à fond ?", "Vérifiez que personne ne marche sur le tuyau.", "Essayez avec une autre canule neuve."], solutionsTech: ["Tester la bouteille avec un autre manodétendeur", "Vérifier la pression de sortie", "Contrôler l'absence d'obstruction dans le raccord de sortie"] },
              { title: "Fuite d'oxygène (sifflement)", causes: ["Joint de valve (O-ring) usé ou manquant", "Raccord rapide mal enclenché", "Soupape de sécurité activée"], solutionsPatient: ["Entendez-vous un sifflement (pshhh) au niveau du robinet ?", "Débranchez et rebranchez fermement la canule", "Fermez le robinet immédiatement si la fuite est importante"], solutionsTech: ["Remplacer le joint d'étanchéité (O-ring)", "Vérifier le serrage du manodétendeur", "Tester l'étanchéité"] },
              { title: "Débitmètre bloqué ou dur à tourner", causes: ["Encrassement interne", "Choc mécanique", "Gel interne (utilisation intensive)"], solutionsPatient: ["Le bouton tourne-t-il sans forcer ?", "Y a-t-il du givre blanc sur le métal ?", "Laissez reposer la bouteille 15 minutes"], solutionsTech: ["Nettoyer le mécanisme de réglage", "Remplacer le bloc régulateur", "Vérifier l'absence de corps gras"] }
            ]
          },
          {
            id: "oxalys", name: "Oxalys", failures: [
              { title: "Pas de débit ou débit insuffisant", causes: ["Bouteille vide (aiguille rouge)", "Robinet mal ouvert", "Canule pliée ou écrasée", "Régulateur défectueux"], solutionsPatient: ["Regardez le manomètre : l'aiguille est-elle dans la zone verte ?", "Le robinet sur le dessus est-il ouvert à fond ?", "Vérifiez que personne ne marche sur le tuyau.", "Essayez avec une autre canule neuve."], solutionsTech: ["Tester la bouteille avec un autre manodétendeur", "Vérifier la pression de sortie", "Contrôler l'absence d'obstruction dans le raccord de sortie"] },
              { title: "Fuite d'oxygène (sifflement)", causes: ["Joint de valve (O-ring) usé ou manquant", "Raccord rapide mal enclenché", "Soupape de sécurité activée"], solutionsPatient: ["Entendez-vous un sifflement (pshhh) au niveau du robinet ?", "Débranchez et rebranchez fermement la canule", "Fermez le robinet immédiatement si la fuite est importante"], solutionsTech: ["Remplacer le joint d'étanchéité (O-ring)", "Vérifier le serrage du manodétendeur", "Tester l'étanchéité"] },
              { title: "Débitmètre bloqué ou dur à tourner", causes: ["Encrassement interne", "Choc mécanique", "Gel interne (utilisation intensive)"], solutionsPatient: ["Le bouton tourne-t-il sans forcer ?", "Y a-t-il du givre blanc sur le métal ?", "Laissez reposer la bouteille 15 minutes"], solutionsTech: ["Nettoyer le mécanisme de réglage", "Remplacer le bloc régulateur", "Vérifier l'absence de corps gras"] }
            ]
          },
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
                    { title: "Alarme O₂ faible", causes: ["Concentration entre 75 % et 82 %", "Saturation des tamis moléculaires", "Fuite interne sur le circuit oxygène", "Filtre d'entrée colmaté"], solutionsPatient: ["L'appareil est-il placé loin des murs pour bien respirer ?", "Le filtre à poussière à l'arrière est-il propre ?", "Est-ce qu'une révision de l'appareil est prévue prochainement ?"], solutionsTech: ["Mesurer la pureté avec un analyseur calibré.", "Vérifier l'étanchéité du circuit pneumatique.", "Remplacer les colonnes de tamis.", "Contrôler la pression de sortie du compresseur."] },
                    { title: "Arrêt brusque", causes: ["Disjoncteur thermique (surcharge)", "Surchauffe compresseur", "Câble secteur endommagé", "Panne ventilateur"], solutionsPatient: ["Appuyez sur le bouton blanc du disjoncteur (Reset)", "Vérifiez si le cordon est abîmé ou chaud", "Laissez refroidir l'appareil 30 minutes"], solutionsTech: ["Contrôle température turbine", "Vérifier la consommation électrique du compresseur", "Remplacer le ventilateur interne"] },
                    { title: "Débit faible ou irrégulier", causes: ["Filtre bouché", "Tamis moléculaire usé", "Fuite au niveau de l'humidificateur", "Canule trop longue ou pliée"], solutionsPatient: ["Le filtre à air est-il noir ou poussiéreux ?", "Sentez-vous que l'air n'arrive pas régulièrement ?", "Le bocal de l'humidificateur est-il bien vissé ?"], solutionsTech: ["Nettoyage ou remplacement du filtre HEPA.", "Vérifier la bille du débitmètre.", "Remplacement des tamis.", "Tester la pression de sortie."] },
                    { title: "Alarme (Surchauffe)", causes: ["Ventilation obstruée", "Environnement trop chaud"], solutionsPatient: ["L'appareil est-il très chaud ?", "Est-ce que quelque chose bouche les grilles d'aération ?", "Fait-il très chaud dans la pièce ?"], solutionsTech: ["Nettoyer grilles d’aération.", "Déplacer appareil, laisser refroidir."] },
                    { title: "Alarme (Échappement bloqué)", causes: ["Sortie d’air obstruée", "Filtre d'échappement colmaté", "Couvercle mal positionné"], solutionsPatient: ["La grille à l'arrière est-elle libre ?", "Vérifiez que l'appareil n'est pas collé à un rideau"], solutionsTech: ["Dégager la sortie d’air.", "Remplacer le silencieux.", "Vérifier l'étanchéité du boîtier"] },
                    { title: "Alarme No Flow (pas de débit)", causes: ["Circuit complètement bouché", "Débit réglé trop bas"], solutionsPatient: ["Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?"], solutionsTech: ["Vérifier tubulure / canule.", "Ajuster débit."] },
                    { title: "Alarme pression (High/Low Pressure)", causes: ["Vibration excessive du compresseur", "Fuite interne sur les tubulures", "Vanne 4 voies bloquée", "Obstruction du filtre HEPA"], solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression sur l'écran ?", "Vérifiez que l'appareil n'est pas posé sur un tapis trop épais"], solutionsTech: ["Tester la pression de sortie compresseur", "Inspecter les tuyaux internes", "Vérifier le cycle des vannes", "Remplacer filtres internes"] },
                    { title: "Alarme Service Required", causes: ["Compresseur en fin de vie", "Capteur de pureté HS", "Défaut carte électronique", "Surchauffe moteur", "Pile d'alarme HS"], solutionsPatient: ["Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Y a-t-il un message d'erreur sur l'écran ?", "Redémarrer l'appareil après 15 min d'arrêt"], solutionsTech: ["Effectuer un diagnostic logiciel.", "Mesurer la tension de la carte.", "Vérifier les balais du moteur.", "Remplacer le bloc compresseur.", "Changer la pile 9V si applicable."] }
                ] },
          { id: "525ks", name: "5L", failures: [
                    { title: "L'appareil ne démarre pas", causes: ["Alimentation", "Cordon", "Interrupteur"], solutionsPatient: ["Quand vous appuyez sur le bouton Marche, est-ce qu' il se passe quelque chose (bruit, lumière) ?", "Est-ce que le câble d'alimentation est bien enfoncé des deux côtés (mur et machine) ?", "Avez-vous essayé sur une autre prise électrique ?"], solutionsTech: ["Vérifier le cordon secteur.", "Vérifier le fusible/disjoncteur.", "Vérifier l'interrupteur.", "Tester le condensateur de démarrage."] },
                    { title: "Voyant rouge d'alerte allumé", causes: ["Débitmètre bloqué", "Obstruction interne", "Défaut capteur de pression", "Concentration O2 insuffisante"], solutionsPatient: ["Est-ce que la petite bille du débitmètre est bien au-dessus du zéro ?", "Est-ce que le tuyau n'est pas un peu plié ou coincé sous un meuble ?", "Vérifiez que l'humidificateur ne fuit pas."], solutionsTech: ["Vérifier circuit interne.", "Nettoyer le débitmètre", "Tester le capteur de pression", "Vérifier la vanne 4 voies."] },
                    { title: "Alarme sonore continue", causes: ["Coupure électrique", "Défaut condensateur", "Surtension réseau"], solutionsPatient: ["Vérifiez le branchement mural.", "Y a-t-il eu une coupure de courant ?", "Essayez de brancher une lampe sur la même prise pour tester le courant.", "Débranchez l'appareil 10 minutes."], solutionsTech: ["Tester tension secteur", "Vérifier le condensateur de démarrage", "Remplacer la batterie d'alarme"] },
                    { title: "Alarme (Surchauffe)", causes: ["Ventilation obstruée", "Environnement trop chaud"], solutionsPatient: ["L'appareil est-il collé contre un mur ou un rideau ?", "Les grilles d'aération sont-elles propres ?", "Fait-il très chaud dans la pièce ?"], solutionsTech: ["Nettoyer grilles d’aération.", "Déplacer appareil, laisser refroidir."] },
                    { title: "Alarme (Échappement bloqué)", causes: ["Grille arrière obstruée", "Accumulation de poussière interne", "Silencieux colmaté"], solutionsPatient: ["La sortie d'air est-elle dégagée ?", "L'appareil est-il trop près d'un rideau ?"], solutionsTech: ["Dégager la sortie d'air.", "Nettoyage interne à l'air sec", "Remplacer silencieux"] },
                    { title: "Alarme No Flow (pas de débit)", causes: ["Circuit complètement bouché", "Débit réglé trop bas"], solutionsPatient: ["Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?"], solutionsTech: ["Vérifier tubulure / canule.", "Ajuster débit."] },
                    { title: "Alarme Service Required", causes: ["Capteurs HS", "Panne interne", "Fuite pneumatique", "Surchauffe", "Tamis moléculaires fatigués"], solutionsPatient: ["L'appareil s'arrête-t-il tout seul sans raison apparente ?", "Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Vérifiez la température de la pièce et le filtre arrière."], solutionsTech: ["Remplacer capteurs.", "Effectuer test d'étanchéité", "Vérifier ventilateur", "Maintenance technique / SAV."] }
                ] },
          { id: "8f-5a", name: "5L", failures: [
                    { title: "L'appareil ne démarre pas", causes: ["Alimentation", "Cordon", "Interrupteur"], solutionsPatient: ["Quand vous appuyez sur le bouton Marche, est-ce qu'il se passe quelque chose (bruit, lumière) ?", "Est-ce que le câble d'alimentation est bien enfoncé des deux côtés (mur et machine) ?", "Avez-vous essayé sur une autre prise électrique ?"], solutionsTech: ["Vérifier le cordon secteur.", "Vérifier le fusible/disjoncteur.", "Vérifier l'interrupteur.", "Contrôler la carte d'alimentation."] },
                    { title: "Débit faible ou irrégulier", causes: ["Filtre bouché", "Tamis moléculaire usé", "Tubulure / canule obstruée", "Débitmètre fuyard"], solutionsPatient: ["Le filtre à air est-il propre ?", "Sentez-vous que l'air n'arrive pas régulièrement ?", "La tubulure ou la canule est-elle pliée ou bouchée ?", "Vérifiez si l'humidificateur fait des bulles normalement."], solutionsTech: ["Nettoyage filtre.", "Remplacement tamis.", "Vérifier ou remplacer tubulure/canule.", "Tester l'étanchéité du bocal."] },
                    { title: "Alarme O₂ faible", causes: ["Tamis moléculaire usé", "Mauvaise concentration O₂", "Humidité excessive dans l'air ambiant", "Compresseur sous-performant"], solutionsPatient: ["Le voyant O2 est-il allumé ?", "L'appareil a-t-il été entretenu récemment ?", "La pièce est-elle bien aérée ?", "L'appareil est-il utilisé près d'une source de vapeur ?"], solutionsTech: ["Vérifier la pureté à l'analyseur.", "Maintenance interne des filtres.", "Remplacement des colonnes.", "Contrôler les pressions de cycle."] },
                    { title: "Alarme (Surchauffe)", causes: ["Ventilation obstruée", "Environnement trop chaud"], solutionsPatient: ["L'appareil est-il collé contre un mur ou un rideau ?", "Les grilles d'aération sont-elles propres ?", "Fait-il très chaud dans la pièce ?"], solutionsTech: ["Nettoyer grilles d’aération.", "Déplacer appareil, laisser refroidir."] },
                    { title: "Alarme (Échappement bloqué)", causes: ["Obstruction physique", "Filtre final saturé", "Surchauffe"], solutionsPatient: ["La sortie d'air est-elle dégagée ?", "Vérifier qu'aucun objet n'est posé sur la machine"], solutionsTech: ["Dégager la sortie d'air.", "Remplacer filtre HEPA", "Contrôler le débit d'air"] },
                    { title: "Alarme No Flow (pas de débit)", causes: ["Circuit complètement bouché", "Débit réglé trop bas"], solutionsPatient: ["Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?"], solutionsTech: ["Vérifier tubulure / canule.", "Ajuster débit."] },
                    { title: "Alarme pression (High/Low Pressure)", causes: ["Défaut compresseur", "Vanne directionnelle bloquée", "Fuite de tubulure"], solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression sur l'écran ?", "Vérifiez que le tuyau n'est pas écrasé."], solutionsTech: ["Maintenance technique (compresseur).", "Tester les vannes", "Resserrer raccords", "Vérifier le pressostat."] },
                    { title: "Alarme Service Required", causes: ["Capteurs HS", "Panne interne (compresseur, capteur, carte)", "Défaut alimentation carte", "Cycle de vanne irrégulier"], solutionsPatient: ["L'appareil s'arrête-t-il tout seul sans raison apparente ?", "Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Débranchez et rebranchez l'appareil après 5 minutes."], solutionsTech: ["Remplacer capteurs.", "Vérifier tensions carte", "Maintenance technique / SAV.", "Contrôler le ventilateur."] }
                ] },
          { id: "platinum-9", name: "Platinum 9", failures: [
                    { title: "Débit faible ou irrégulier", causes: ["Débitmètre réglé < 1 L/min", "Tubulure 15m pliée", "Filtre HEPA colmaté", "Fuite interne"], solutionsPatient: ["Augmentez le débit au-dessus de 1 L/min pour tester.", "Redressez la tubulure pour éviter les coudes.", "Le filtre noir est-il propre ?"], solutionsTech: ["Tester la pression de sortie.", "Remplacer le filtre HEPA interne.", "Vérifier l'étanchéité du circuit interne."] },
                    { title: "Arrêt brusque", causes: ["Surchauffe compresseur", "Pression trop haute", "Ventilateur bloqué", "Condensateur HS"], solutionsPatient: ["Éteignez l'appareil pendant 30 min pour le laisser refroidir.", "Vérifiez que l'air circule bien autour de la machine.", "Appuyez sur le bouton blanc 'Reset' au-dessus de la prise."], solutionsTech: ["Nettoyer les filtres.", "Vérifier le fonctionnement du ventilateur.", "Tester le condensateur de démarrage."] },
                    { title: "Alarme O₂ faible", causes: ["Saturation des tamis", "Filtre d'entrée colmaté", "Fuite sur le circuit oxygène"], solutionsPatient: ["Le voyant jaune est-il allumé ?", "L'appareil est-il placé loin des murs (min 15cm) ?"], solutionsTech: ["Mesurer la pureté à l'analyseur.", "Remplacer les colonnes de tamis.", "Vérifier l'étanchéité pneumatique."] }
                ] },
          { id: "perfecto2-v", name: "Perfecto2 V", failures: [
                    { title: "L'appareil ne démarre pas", causes: ["Cordon secteur déconnecté", "Disjoncteur déclenché", "Coupure de courant", "Condensateur HS"], solutionsPatient: ["La prise est-elle bien enfoncée ?", "Appuyez sur le bouton blanc (disjoncteur) juste au-dessus de la prise.", "Essayez de brancher une lampe sur la même prise."], solutionsTech: ["Tester le cordon secteur.", "Vérifier le condensateur de démarrage.", "Contrôler l'interrupteur Marche/Arrêt."] },
                    { title: "Alarme O₂ faible", causes: ["Usure des tamis moléculaires", "Filtre d'entrée poussiéreux", "Fuite interne"], solutionsPatient: ["Le voyant jaune ou rouge est-il allumé ?", "Le filtre noir sur le côté est-il propre ?", "Aérez la pièce."], solutionsTech: ["Mesurer la pureté.", "Effectuer un test de fuite sous pression.", "Remplacer les colonnes."] },
                    { title: "Débit faible ou irrégulier", causes: ["Tuyau plié", "Débitmètre sur 0", "Filtre HEPA interne colmaté", "Bocal mal vissé"], solutionsPatient: ["La petite bille monte-t-elle quand vous tournez le bouton ?", "Vérifiez que le bocal de l'humidificateur est bien vissé droit.", "Le tuyau est-il coincé sous un meuble ou une porte ?"], solutionsTech: ["Nettoyer le débitmètre.", "Vérifier la pression du compresseur.", "Remplacer le filtre HEPA."] },
                    { title: "Sifflement ou fuite à l'humidificateur", causes: ["Bocal mal vissé", "Joint du couvercle usé ou absent", "Tuyau d'oxygène mal connecté"], solutionsPatient: ["Est-ce que vous entendez un sifflement persistant ?", "Avez-vous essayé de dévisser puis de revisser bien droit le couvercle du bocal ?"], solutionsTech: ["Contrôler l'état du joint du bocal.", "Vérifier le raccord de sortie d'O2.", "Tester l'étanchéité sous pression."] },
                    { title: "Alarme sonore continue (Surchauffe)", causes: ["Ventilation obstruée", "Température ambiante trop élevée", "Ventilateur interne bloqué"], solutionsPatient: ["Est-ce que l'appareil est collé contre un mur ou un rideau ?", "Fait-il très chaud dans votre chambre ?"], solutionsTech: ["Nettoyer les ouïes de ventilation.", "Vérifier le fonctionnement du ventilateur.", "Maintenance préventive."] }
                ] },
                { id: "everflo", name: "EverFlo", failures: [
                    { title: "L'appareil ne démarre pas", causes: ["Alimentation", "Cordon", "Interrupteur"], solutionsPatient: ["Quand vous appuyez sur le bouton Marche, est-ce qu'il se passe quelque chose (bruit, lumière) ?", "Est-ce que le câble d'alimentation est bien enfoncé des deux côtés (mur et machine) ?", "Avez-vous essayé sur une autre prise électrique ?"], solutionsTech: ["Vérifier le cordon secteur.", "Vérifier le fusible/disjoncteur.", "Vérifier l'interrupteur.", "Vérifier le condensateur."] },
                    { title: "Débit faible ou irrégulier", causes: ["Filtre bouché", "Tamis moléculaire usé", "Compresseur usé", "Tubulure / canule obstruée"], solutionsPatient: ["Sentez-vous que l'air n'arrive pas régulièrement ?", "Le filtre à air est-il propre ?", "La tubulure ou la canule est-elle pliée ou bouchée ?", "Vérifiez le serrage de l'humidificateur."], solutionsTech: ["Maintenance compresseur.", "Remplacement tamis.", "Nettoyage filtre.", "Vérifier ou remplacer tubulure/canule."] },
                    { title: "Bruit anormal", causes: ["Humidité dans le silencieux", "Silenblocs compresseur usés", "Position instable", "Objet dans ventilateur"], solutionsPatient: ["Y a-t-il de l'eau dans le tuyau ?", "La pièce est-elle humide ?", "L'appareil est-il bien à plat sur le sol ?"], solutionsTech: ["Déshumidificateur si nécessaire.", "Remplacer silencieux", "Vérifier fixations moteur"] },
                    { title: "Alarme O₂ faible", causes: ["Tamis moléculaire usé", "Mauvaise concentration O₂", "Filtre d'entrée noirci", "Fuite interne"], solutionsPatient: ["Le voyant oxygène est-il jaune ou rouge ?", "L'appareil a-t-il été entretenu récemment ?", "Vérifiez que rien n'obstrue les entrées d'air."], solutionsTech: ["Vérifier la pureté à l'analyseur.", "Maintenance interne (filtre feutre).", "Remplacer les colonnes.", "Contrôler les pressions."] },
                    { title: "Alarme (Surchauffe)", causes: ["Ventilation obstruée", "Environnement trop chaud"], solutionsPatient: ["L'appareil est-il chaud ?", "La grille à l'arrière est-elle libre ?", "Fait-il très chaud dans la pièce ?"], solutionsTech: ["Nettoyer grilles d'aération.", "Déplacer appareil, laisser refroidir."] },
                    { title: "Alarme (Échappement bloqué)", causes: ["Sortie d’air bloquée", "Filtre final colmaté", "Couvercle mal clipsé"], solutionsPatient: ["La grille à l'arrière est-elle libre ?", "Vérifiez que rien ne cache le bas de l'appareil"], solutionsTech: ["Dégager la sortie d'air.", "Remplacer le filtre de sortie", "Vérifier étanchéité boîtier"] },
                    { title: "Alarme No Flow (pas de débit)", causes: ["Circuit complètement bouché", "Débit réglé trop bas"], solutionsPatient: ["Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?"], solutionsTech: ["Vérifier tubulure / canule.", "Ajuster débit."] },
                    { title: "Alarme pression (High/Low Pressure)", causes: ["Défaut compresseur", "Fuite interne", "Vanne bloquée"], solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression sur l'écran ?", "Vérifiez que la canule n'est pas coincée."], solutionsTech: ["Maintenance technique (compresseur).", "Check tubulures", "Tester vannes"] },
                    { title: "Alarme Service Required", causes: ["Panne interne", "Défaut carte", "Surchauffe", "Vanne 4 voies bloquée"], solutionsPatient: ["Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Y a-t-il un message d'erreur sur l'écran ?", "Vérifiez que l'appareil est branché seul sur la prise."], solutionsTech: ["Maintenance technique / SAV.", "Check carte", "Nettoyer ouïes", "Vérifier les tensions."] }
                ] },
          { id: "homefill", name: "HomeFill", failures: [
                    { title: "Voyant rouge 'ATTENTION' allumé", causes: ["Débit concentrateur > 3 L/min", "Pression d'entrée insuffisante", "Fuite au raccord"], solutionsPatient: ["Réduisez le débit de votre concentrateur à 3 L/min ou moins.", "Attendez 3 minutes que le voyant repasse au vert.", "Vérifiez que le tuyau reliant les deux machines n'est pas pincé."], solutionsTech: ["Vérifier la pression de couplage.", "Tester le capteur de pression d'entrée."] },
                    { title: "La bouteille ne se remplit pas", causes: ["Bouteille mal enclenchée", "Joint de l'embase sale", "Compresseur interne fatigué"], solutionsPatient: ["Retirez et remettez la bouteille jusqu'au 'double clic'.", "Nettoyez le connecteur avec un chiffon propre et sec.", "Vérifiez si la station fait du bruit (compresseur)."], solutionsTech: ["Remplacer le joint de l'embase.", "Vérifier le débit de remplissage.", "Révision du bloc compresseur."] },
                    { title: "Fuite au raccord de la bouteille", causes: ["Mauvaise connexion", "Joint sale", "O-ring de bouteille manquant"], solutionsPatient: ["Nettoyez le connecteur avec un chiffon sec.", "Reconnectez fermement la bouteille jusqu'au clic.", "Vérifiez le petit joint noir sur la bouteille."], solutionsTech: ["Remplacer le joint de l'embase.", "Vérifier l'étanchéité de la valve de remplissage.", "Contrôler l'alignement."] }
                ] },
          { id: "ultrafill", name: "UltraFill", failures: [
                    { title: "La bouteille ne se remplit pas", causes: ["Concentrateur compagnon éteint", "Débit réglé trop haut", "Vanne de couplage bloquée", "Bouteille mal positionnée"], solutionsPatient: ["Vérifiez que le concentrateur à côté est bien allumé.", "Réglez le débit sur la position 'Remplissage' (souvent 2L).", "Assurez-vous que la bouteille est bien verticale."], solutionsTech: ["Vérifier la valve de transfert.", "Tester la communication entre les deux appareils.", "Nettoyer les connecteurs.", "Vérifier les capteurs de pression."] }
                ] },
                { id: "everflo-pediatrique", name: "EverFlo Pédiatrique", failures: [
                    { title: "L'appareil ne démarre pas", causes: ["Alimentation", "Cordon", "Interrupteur"], solutionsPatient: ["Quand vous appuyez sur le bouton Marche, est-ce qu'il se passe quelque chose (bruit, lumière) ?", "Est-ce que le câble d'alimentation est bien enfoncé des deux côtés (mur et machine) ?", "Avez-vous essayé sur une autre prise électrique ?"], solutionsTech: ["Vérifier le cordon secteur.", "Vérifier le fusible/disjoncteur.", "Vérifier l'interrupteur."] },
                    { title: "Débit faible ou irrégulier", causes: ["Filtre bouché", "Tamis moléculaire usé", "Compresseur usé", "Tubulure / canule obstruée"], solutionsPatient: ["Sentez-vous que l'air n'arrive pas régulièrement ?", "Le filtre à air est-il propre ?", "La tubulure ou la canule est-elle pliée ou bouchée ?", "Vérifiez le serrage de l'humidificateur."], solutionsTech: ["Maintenance compresseur.", "Remplacement tamis.", "Nettoyage filtre.", "Vérifier ou remplacer tubulure/canule."] },
                    { title: "Bruit anormal", causes: ["Humidité dans le silencieux", "Silenblocs moteur usés", "Position instable"], solutionsPatient: ["Y a-t-il de l'eau dans le tuyau ?", "L'appareil est-il bien à plat sur le sol ?"], solutionsTech: ["Remplacer silencieux", "Vérifier fixations moteur", "Contrôler le ventilateur"] },
                    { title: "Alarme O₂ faible", causes: ["Tamis moléculaire usé", "Mauvaise concentration O₂", "Filtre d'entrée noirci", "Fuite interne"], solutionsPatient: ["Le voyant oxygène est-il jaune ou rouge ?", "L'appareil a-t-il été entretenu récemment ?", "Vérifiez que rien n'obstrue les entrées d'air."], solutionsTech: ["Vérifier la pureté à l'analyseur.", "Maintenance interne (filtre feutre).", "Remplacer les colonnes.", "Contrôler les pressions."] },
                    { title: "Alarme (Surchauffe)", causes: ["Ventilation obstruée", "Environnement trop chaud"], solutionsPatient: ["L'appareil est-il chaud ?", "La grille à l'arrière est-elle libre ?", "Fait-il très chaud dans la pièce ?"], solutionsTech: ["Nettoyer grilles d'aération.", "Déplacer appareil, laisser refroidir."] },
                    { title: "Alarme (Échappement bloqué)", causes: ["Sortie d’air bloquée", "Filtre HEPA colmaté", "Moteur de vanne bloqué"], solutionsPatient: ["La grille à l'arrière est-elle libre ?", "Vérifiez que rien ne cache le bas de l'appareil"], solutionsTech: ["Dégager la sortie d'air.", "Remplacer filtre HEPA", "Tester le cycle des vannes"] },
                    { title: "Alarme No Flow (pas de débit)", causes: ["Circuit complètement bouché", "Débit réglé trop bas"], solutionsPatient: ["Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?"], solutionsTech: ["Vérifier tubulure / canule.", "Ajuster débit."] },
                    { title: "Alarme pression (High/Low Pressure)", causes: ["Défaut compresseur", "Fuite interne", "Obstruction tubulure"], solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression sur l'écran ?", "Vérifiez que la canule n'est pas pliée."], solutionsTech: ["Maintenance technique (compresseur).", "Inspecter tubulures internes", "Recalibrer capteurs"] },
                    { title: "Alarme Service Required", causes: ["Panne interne", "Carte électronique HS", "Capteur O2 défectueux"], solutionsPatient: ["Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Y a-t-il un message d'erreur sur l'écran ?", "Vérifiez l'état de la prise murale."], solutionsTech: ["Maintenance technique / SAV.", "Vérifier tensions carte", "Remplacer capteur O2"] }
                ] },
                { id: "igo2-fixe", name: "iGo 2 (Mode Fixe)", failures: [
                     { title: "L'appareil ne démarre pas", causes: ["Batterie vide", "Chargeur HS", "Carte"], solutionsPatient: ["Quand vous branchez le chargeur, est-ce qu'un voyant s'allume sur la machine ?", "Est-ce que le câble du chargeur est abîmé ou tordu ?", "Si vous retirez la batterie et branchez le chargeur, est-ce qu'il démarre ?"], solutionsTech: ["Tester l'alimentation externe.", "Tester sans batterie.", "Vérifier connectique interne."] },
                     { title: "Alarme", causes: ["Batterie faible", "Cordon mal inséré", "Température batterie élevée"], solutionsPatient: ["Le voyant batterie est-il allumé ?", "Est-il bien branché sur le secteur ?", "La batterie est-elle chaude ?"], solutionsTech: ["Remplacer batterie.", "Nettoyer contacts batterie", "Vérifier alimentation secteur"] },
                     { title: "Arrêt inopiné", causes: ["Surchauffe", "Batterie déconnectée", "Défaut capteur"], solutionsPatient: ["L'appareil est-il chaud au toucher ?", "Les aérations sont-elles libres ?", "Vérifiez que la batterie ne bouge pas"], solutionsTech: ["Vérifier ventilation.", "Tester la batterie", "Contrôler logs d'erreur"] },
                     { title: "Alarme O₂ faible", causes: ["Tamis moléculaire usé", "Mauvaise concentration O₂", "Filtre d'entrée obstrué", "Compresseur usé"], solutionsPatient: ["Le voyant oxygène est-il jaune ou rouge ?", "Le filtre est-il bien propre ?", "L'appareil est-il dans un sac mal aéré ?"], solutionsTech: ["Vérifier la pureté à l'analyseur.", "Maintenance interne.", "Remplacer les tamis.", "Tester la pression."] },
                     { title: "Alarme (Surchauffe)", causes: ["Ventilation obstruée", "Environnement trop chaud"], solutionsPatient: ["L'appareil est-il très chaud ?", "Est-ce que quelque chose bouche les grilles d'aération ?", "Fait-il très chaud dans la pièce ?"], solutionsTech: ["Nettoyer grilles d'aération.", "Déplacer appareil, laisser refroidir."] },
                     { title: "Alarme (Échappement bloqué)", causes: ["Sortie d’air obstruée", "Poussière sur la grille", "Sac de transport mal mis"], solutionsPatient: ["Est-ce que quelque chose bouche la grille à l'arrière (sortie d'air) ?", "L'appareil est-il bien positionné dans son sac ?"], solutionsTech: ["Dégager la sortie d’air.", "Remplacer le filtre d'échappement"] },
                     { title: "Alarme No Flow (pas de débit)", causes: ["Circuit complètement bouché", "Débit réglé trop bas"], solutionsPatient: ["Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?"], solutionsTech: ["Vérifier tubulure / canule.", "Ajuster débit."] },
                     { title: "Alarme pression (High/Low Pressure)", causes: ["Défaut compresseur", "Fuite interne", "Sonde pression HS"], solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression sur l'écran ?"], solutionsTech: ["Maintenance technique (compresseur).", "Rechercher fuite", "Recalibrer capteurs"] },
                     { title: "Alarme Service Required", causes: ["Panne interne", "Défaut carte", "Surchauffe", "Capteur O2 défectueux"], solutionsPatient: ["Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Y a-t-il un message d'erreur sur l'écran ?", "Retirez la batterie et le secteur, attendez 1 min."], solutionsTech: ["Maintenance technique / SAV.", "Check carte", "Nettoyer ventilateur", "Tester le capteur O2."] }
                ] }
            ]
          },
          {
            id: "portable",
            name: "Portable",
            models: [
                { id: "inogen-g3", name: "Inogen One G3", failures: [
                    { title: "L'appareil ne démarre pas", causes: ["Batterie vide", "Chargeur HS", "Coupure de courant", "Câble mal branché"], solutionsPatient: ["Quand vous branchez le chargeur, est-ce qu'un voyant s'allume sur la machine ?", "Est-ce que le câble du chargeur est abîmé ou tordu ?", "Si vous retirez la batterie et branchez le chargeur, est-ce qu'il démarre ?", "Y a-t-il eu une coupure de courant ?"], solutionsTech: ["Tester l'alimentation externe.", "Tester sans batterie.", "Vérifier connectique interne.", "Vérifier secteur / basculer sur secours."] },
                    { title: "Problème de batterie / Autonomie", causes: ["Batterie usée", "Contacts sales", "Mauvaise insertion", "Surchauffe batterie"], solutionsPatient: ["La batterie tient-elle la charge ?", "Vérifiez que vous avez bien entendu le 'clic' lors de l'insertion.", "Nettoyez les contacts métalliques avec un chiffon sec.", "La batterie est-elle chaude ?"], solutionsTech: ["Contrôler la capacité réelle de la batterie.", "Remplacer batterie.", "Nettoyer connecteurs.", "Vérifier circuit de charge."] },
                    { title: "Débit faible ou irrégulier", causes: ["Filtre bouché", "Airflow bloqué", "Tubulure / canule obstruée", "Tamis moléculaires fatigués"], solutionsPatient: ["Le filtre est-il propre ?", "Est-ce que le sac bouche les trous ?", "La tubulure ou la canule est-elle pliée ou bouchée ?", "Voyez-vous un message O2 faible ?"], solutionsTech: ["Nettoyer filtre.", "Dégager aérations.", "Vérifier ou remplacer tubulure/canule.", "Analyser la pureté O2."] },
                    { title: "Alarme (Température / Système)", causes: ["Environnement trop chaud", "Capteur défectueux", "Filtres encrassés", "Ventilateur interne HS"], solutionsPatient: ["L'appareil est-il au soleil ou dans une zone chaude ?", "Vérifiez que les filtres extérieurs sont propres.", "Qu'est-ce qui est écrit sur l'écran ?", "Laissez refroidir l'appareil."], solutionsTech: ["Utiliser en zone ventilée.", "Nettoyer l'intérieur.", "Remplacer le ventilateur.", "Effectuer un diagnostic logiciel."] },
                    { title: "Alarme No Flow (pas de débit)", causes: ["Circuit complètement bouché", "Débit réglé trop bas", "Canule trop longue", "Pliure dans la tubulure"], solutionsPatient: ["Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?", "Vérifiez votre canule sur toute la longueur.", "Essayez avec une canule neuve."], solutionsTech: ["Vérifier tubulure / canule.", "Ajuster débit.", "Tester la valve de pulsion.", "Vérifier le capteur de pression."] },
                    { title: "Alarme pression (High/Low Pressure)", causes: ["Défaut compresseur", "Fuite interne", "Obstruction interne"], solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression sur l'écran ?", "Vérifiez que la canule n'est pas pincée."], solutionsTech: ["Maintenance technique (compresseur).", "Recherche de fuites internes.", "Remplacer capteurs de pression."] },
                    { title: "Alarme Service Required", causes: ["Panne interne", "Tamis en fin de vie", "Pile interne vide", "Capteur O2 HS"], solutionsPatient: ["Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Y a-t-il un message d'erreur spécifique ?", "Redémarrer l'appareil après 10 min."], solutionsTech: ["Maintenance technique / SAV.", "Remplacement des colonnes.", "Diagnostic via logiciel constructeur."] }
                ] },
                { id: "inogen-g4", name: "Inogen One G4", failures: [
                    { title: "L'appareil ne démarre pas", causes: ["Batterie vide", "Chargeur HS", "Coupure de courant", "Câble mal branché"], solutionsPatient: ["Quand vous branchez le chargeur, est-ce qu'un voyant s'allume sur la machine ?", "Est-ce que le câble du chargeur est abîmé ou tordu ?", "Si vous retirez la batterie et branchez le chargeur, est-ce qu'il démarre ?", "Y a-t-il eu une coupure de courant ?"], solutionsTech: ["Tester l'alimentation externe.", "Tester sans batterie.", "Vérifier connectique interne.", "Vérifier secteur / basculer sur secours."] },
                    { title: "Problème de batterie / Autonomie", causes: ["Batterie usée", "Contacts sales", "Mauvaise insertion", "Surchauffe batterie"], solutionsPatient: ["La batterie tient-elle la charge ?", "Vérifiez que vous avez bien entendu le 'clic' lors de l'insertion.", "Nettoyez les contacts métalliques avec un chiffon sec.", "La batterie est-elle chaude ?"], solutionsTech: ["Contrôler la capacité réelle de la batterie.", "Remplacer batterie.", "Nettoyer connecteurs.", "Vérifier circuit de charge."] },
                    { title: "Débit faible ou irrégulier", causes: ["Filtre bouché", "Airflow bloqué", "Tubulure / canule obstruée", "Tamis moléculaires fatigués"], solutionsPatient: ["Le filtre est-il propre ?", "Est-ce que le sac bouche les trous ?", "La tubulure ou la canule est-elle pliée ou bouchée ?", "Voyez-vous un message O2 faible ?"], solutionsTech: ["Nettoyer filtre.", "Dégager aérations.", "Vérifier ou remplacer tubulure/canule.", "Analyser la pureté O2."] },
                    { title: "Alarme (Température / Système)", causes: ["Environnement trop chaud", "Capteur défectueux", "Filtres encrassés", "Ventilateur interne HS"], solutionsPatient: ["L'appareil est-il au soleil ou dans une zone chaude ?", "Vérifiez que les filtres extérieurs sont propres.", "Qu'est-ce qui est écrit sur l'écran ?", "Laissez refroidir l'appareil."], solutionsTech: ["Utiliser en zone ventilée.", "Nettoyer l'intérieur.", "Remplacer le ventilateur.", "Effectuer un diagnostic logiciel."] },
                    { title: "Alarme No Flow (pas de débit)", causes: ["Circuit complètement bouché", "Débit réglé trop bas", "Canule trop longue", "Pliure dans la tubulure"], solutionsPatient: ["Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?", "Vérifiez votre canule sur toute la longueur.", "Essayez avec une canule neuve."], solutionsTech: ["Vérifier tubulure / canule.", "Ajuster débit.", "Tester la valve de pulsion.", "Vérifier le capteur de pression."] },
                    { title: "Alarme pression (High/Low Pressure)", causes: ["Défaut compresseur", "Fuite interne", "Obstruction interne"], solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression sur l'écran ?", "Vérifiez que la canule n'est pas pincée."], solutionsTech: ["Maintenance technique (compresseur).", "Recherche de fuites internes.", "Remplacer capteurs de pression."] },
                    { title: "Alarme Service Required", causes: ["Panne interne", "Tamis en fin de vie", "Pile interne vide", "Capteur O2 HS"], solutionsPatient: ["Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Y a-t-il un message d'erreur spécifique ?", "Redémarrer l'appareil après 10 min."], solutionsTech: ["Maintenance technique / SAV.", "Remplacement des colonnes.", "Diagnostic via logiciel constructeur."] }
                ] },
                { id: "inogen-g5", name: "Inogen One G5", failures: [
                    { title: "L'appareil ne démarre pas", causes: ["Batterie vide", "Chargeur HS", "Coupure de courant", "Câble mal branché"], solutionsPatient: ["Quand vous branchez le chargeur, est-ce qu'un voyant s'allume sur la machine ?", "Est-ce que le câble du chargeur est abîmé ou tordu ?", "Si vous retirez la batterie et branchez le chargeur, est-ce qu'il démarre ?", "Y a-t-il eu une coupure de courant ?"], solutionsTech: ["Tester l'alimentation externe.", "Tester sans batterie.", "Vérifier connectique interne.", "Vérifier secteur / basculer sur secours."] },
                    { title: "Problème de batterie / Autonomie", causes: ["Batterie usée", "Contacts sales", "Mauvaise insertion", "Surchauffe batterie"], solutionsPatient: ["La batterie tient-elle la charge ?", "Vérifiez que vous avez bien entendu le 'clic' lors de l'insertion.", "Nettoyez les contacts métalliques avec un chiffon sec.", "La batterie est-elle chaude ?"], solutionsTech: ["Contrôler la capacité réelle de la batterie.", "Remplacer batterie.", "Nettoyer connecteurs.", "Vérifier circuit de charge."] },
                    { title: "Débit faible ou irrégulier", causes: ["Filtre bouché", "Airflow bloqué", "Tubulure / canule obstruée", "Tamis moléculaires fatigués"], solutionsPatient: ["Le filtre est-il propre ?", "Est-ce que le sac bouche les trous ?", "La tubulure ou la canule est-elle pliée ou bouchée ?", "Voyez-vous un message O2 faible ?"], solutionsTech: ["Nettoyer filtre.", "Dégager aérations.", "Vérifier ou remplacer tubulure/canule.", "Analyser la pureté O2."] },
                    { title: "Alarme (Température / Système)", causes: ["Environnement trop chaud", "Capteur défectueux", "Filtres encrassés", "Ventilateur interne HS"], solutionsPatient: ["L'appareil est-il au soleil ou dans une zone chaude ?", "Vérifiez que les filtres extérieurs sont propres.", "Qu'est-ce qui est écrit sur l'écran ?", "Laissez refroidir l'appareil."], solutionsTech: ["Utiliser en zone ventilée.", "Nettoyer l'intérieur.", "Remplacer le ventilateur.", "Effectuer un diagnostic logiciel."] },
                    { title: "Alarme No Flow (pas de débit)", causes: ["Circuit complètement bouché", "Débit réglé trop bas", "Canule trop longue", "Pliure dans la tubulure"], solutionsPatient: ["Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?", "Vérifiez votre canule sur toute la longueur.", "Essayez avec une canule neuve."], solutionsTech: ["Vérifier tubulure / canule.", "Ajuster débit.", "Tester la valve de pulsion.", "Vérifier le capteur de pression."] },
                    { title: "Alarme pression (High/Low Pressure)", causes: ["Défaut compresseur", "Fuite interne", "Obstruction interne"], solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression sur l'écran ?", "Vérifiez que la canule n'est pas pincée."], solutionsTech: ["Maintenance technique (compresseur).", "Recherche de fuites internes.", "Remplacer capteurs de pression."] },
                    { title: "Alarme Service Required", causes: ["Panne interne", "Tamis en fin de vie", "Pile interne vide", "Capteur O2 HS"], solutionsPatient: ["Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Y a-t-il un message d'erreur spécifique ?", "Redémarrer l'appareil après 10 min."], solutionsTech: ["Maintenance technique / SAV.", "Remplacement des colonnes.", "Diagnostic via logiciel constructeur."] }
                ] },
                { id: "inogen-rove", name: "Inogen Rove 6", failures: [
                    { title: "L'appareil ne démarre pas", causes: ["Batterie vide", "Chargeur HS", "Carte"], solutionsPatient: ["Quand vous branchez le chargeur, est-ce qu'un voyant s'allume sur la machine ?", "Est-ce que le câble du chargeur est abîmé ou tordu ?", "Si vous retirez la batterie et branchez le chargeur, est-ce qu'il démarre ?"], solutionsTech: ["Tester l'alimentation externe.", "Tester sans batterie.", "Vérifier connectique interne."] },
                    { title: "Problème de batterie / Autonomie", causes: ["Batterie usée", "Contacts sales", "Mauvaise insertion", "Surchauffe batterie"], solutionsPatient: ["La batterie tient-elle la charge ?", "Vérifiez que vous avez bien entendu le 'clic' lors de l'insertion.", "Nettoyez les contacts métalliques avec un chiffon sec.", "La batterie est-elle chaude ?"], solutionsTech: ["Contrôler la capacité réelle de la batterie.", "Remplacer batterie.", "Nettoyer connecteurs.", "Vérifier circuit de charge."] },
                    { title: "Débit faible ou irrégulier", causes: ["Filtre bouché", "Airflow bloqué", "Tubulure / canule obstruée", "Tamis moléculaires fatigués"], solutionsPatient: ["Le filtre est-il propre ?", "Est-ce que le sac bouche les trous ?", "La tubulure ou la canule est-elle pliée ou bouchée ?", "Voyez-vous un message O2 faible ?"], solutionsTech: ["Nettoyer filtre.", "Dégager aérations.", "Vérifier ou remplacer tubulure/canule.", "Analyser la pureté O2."] },
                    { title: "Alarme (Température / Système)", causes: ["Environnement trop chaud", "Capteur défectueux", "Filtres encrassés", "Ventilateur interne HS"], solutionsPatient: ["L'appareil est-il au soleil ou dans une zone chaude ?", "Vérifiez que les filtres extérieurs sont propres.", "Qu'est-ce qui est écrit sur l'écran ?", "Laissez refroidir l'appareil."], solutionsTech: ["Utiliser en zone ventilée.", "Nettoyer l'intérieur.", "Remplacer le ventilateur.", "Effectuer un diagnostic logiciel."] },
                    { title: "Alarme No Flow (pas de débit)", causes: ["Circuit complètement bouché", "Débit réglé trop bas", "Canule trop longue", "Pliure dans la tubulure"], solutionsPatient: ["Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?", "Vérifiez votre canule sur toute la longueur.", "Essayez avec une canule neuve."], solutionsTech: ["Vérifier tubulure / canule.", "Ajuster débit.", "Tester la valve de pulsion.", "Vérifier le capteur de pression."] },
                    { title: "Alarme pression (High/Low Pressure)", causes: ["Défaut compresseur", "Fuite interne", "Obstruction interne"], solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression sur l'écran ?", "Vérifiez que la canule n'est pas pincée."], solutionsTech: ["Maintenance technique (compresseur).", "Recherche de fuites internes.", "Remplacer capteurs de pression."] },
                    { title: "Alarme Service Required", causes: ["Panne interne", "Tamis en fin de vie", "Pile interne vide", "Capteur O2 HS"], solutionsPatient: ["Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Y a-t-il un message d'erreur spécifique ?", "Redémarrer l'appareil après 10 min."], solutionsTech: ["Maintenance technique / SAV.", "Remplacement des colonnes.", "Diagnostic via logiciel constructeur."] }
                ] },
                { id: "xpo2", name: "Invacare XPO2", failures: [
                    { title: "L'appareil ne s'allume pas", causes: ["Batterie vide", "Bloc secteur HS", "Connecteur d'embase dessoudé"], solutionsPatient: ["Branchez l'appareil sur le secteur.", "Le voyant vert sur le bloc d'alimentation est-il allumé ?", "Essayez de démarrer sans la batterie, juste sur secteur."], solutionsTech: ["Tester la tension de sortie du chargeur (19V).", "Vérifier la continuité de l'embase de charge.", "Contrôler le fusible interne."] },
                    { title: "Aucun souffle détecté", causes: ["Tubulure trop longue (> 10m)", "Respiration buccale", "Capteur de trigger HS"], solutionsPatient: ["Utilisez une canule de 2 mètres maximum.", "Respirez bien par le nez.", "Vérifiez que le raccord de canule est bien vissé."], solutionsTech: ["Vérifier la valve de pulsion.", "Recalibrer la sensibilité du trigger.", "Tester l'étanchéité du circuit interne."] },
                    { title: "Alarme O₂ faible", causes: ["Usure des tamis moléculaires", "Filtre d'entrée colmaté", "Compresseur fatigué"], solutionsPatient: ["Vérifiez que les filtres extérieurs sont propres.", "Ne couvrez pas l'appareil avec une couverture.", "Aérez la pièce."], solutionsTech: ["Mesurer la pureté à l'analyseur.", "Remplacer les colonnes de tamis.", "Vérifier la pression de sortie du compresseur."] },
                    { title: "Batterie ne charge pas", causes: ["Batterie trop chaude", "Cellules usées", "Contacts sales"], solutionsPatient: ["Laissez la batterie refroidir 1h.", "Nettoyez les contacts avec un chiffon sec.", "Vérifiez que la batterie est bien cliquée."], solutionsTech: ["Vérifier le cycle de charge.", "Remplacer la batterie."] }
                ] },
                { id: "simplygo-mini", name: "SimplyGo Mini", failures: [
                    { title: "L'appareil ne démarre pas", causes: ["Batterie vide", "Chargeur HS", "Carte"], solutionsPatient: ["Quand vous branchez le chargeur, est-ce qu'un voyant s'allume sur la machine ?", "Est-ce que le câble du chargeur est abîmé ou tordu ?", "Si vous retirez la batterie et branchez le chargeur, est-ce qu'il démarre ?"], solutionsTech: ["Tester l'alimentation externe.", "Tester sans batterie.", "Vérifier connectique interne."] },
                    { title: "Alarme (Température / Système)", causes: ["Filtre sale", "Environnement trop chaud", "Capteur défectueux", "Surchauffe batterie"], solutionsPatient: ["Le filtre est-il propre ?", "Fait-il très chaud là où vous êtes ?", "Vérifiez que le sac n'obstrue pas les grilles.", "Voyez-vous un code d'alarme ?"], solutionsTech: ["Nettoyage filtre.", "Déplacer appareil, laisser refroidir.", "Vérifier ventilateur interne.", "Maintenance technique."] },
                    { title: "Débit faible ou irrégulier", causes: ["Ventilation insuffisante", "Airflow bloqué", "Tubulure / canule obstruée", "Tamis moléculaires fatigués"], solutionsPatient: ["Est-ce que le sac de transport bouche les aérations ?", "L'appareil respire-t-il bien ?", "La tubulure ou la canule est-elle pliée ou bouchée ?", "Vérifiez si l'appareil bipe sur chaque inspiration."], solutionsTech: ["Ne pas obstruer aérations.", "Dégager entrées d'air.", "Mesurer la pureté O2.", "Vérifier ou remplacer tubulure/canule."] },
                    { title: "Alarme No Flow (pas de débit)", causes: ["Circuit complètement bouché", "Débit réglé trop bas"], solutionsPatient: ["Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?"], solutionsTech: ["Vérifier tubulure / canule.", "Ajuster débit."] },
                    { title: "Alarme pression (High/Low Pressure)", causes: ["Défaut compresseur", "Tubulure interne coudée", "Fuite interne"], solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression sur l'écran ?", "Vérifiez que la canule n'est pas écrasée."], solutionsTech: ["Maintenance technique (compresseur).", "Recherche de fuites pneumatiques.", "Vérifier le cycle des vannes."] },
                    { title: "Alarme Service Required", causes: ["Panne interne", "Capteur O2 HS", "Défaut carte mère", "Pile d'alarme HS"], solutionsPatient: ["Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Y a-t-il un message d'erreur sur l'écran ?", "Retirez la batterie et le secteur, attendez 1 min."], solutionsTech: ["Maintenance technique / SAV.", "Effectuer un diagnostic via le menu technique.", "Vérifier les tensions de la carte."] }
                ] },
                { id: "simplygo-mini-ld", name: "SimplyGo Mini (Longue Durée)", failures: [
                    { title: "L'appareil ne démarre pas", causes: ["Batterie vide", "Chargeur HS", "Carte"], solutionsPatient: ["Quand vous branchez le chargeur, est-ce qu'un voyant s'allume sur la machine ?", "Est-ce que le câble du chargeur est abîmé ou tordu ?", "Si vous retirez la batterie et branchez le chargeur, est-ce qu'il démarre ?"], solutionsTech: ["Tester l'alimentation externe.", "Tester sans batterie.", "Vérifier connectique interne."] },
                    { title: "Alarme (Température / Système)", causes: ["Filtre sale", "Environnement trop chaud", "Capteur HS"], solutionsPatient: ["Le filtre est-il propre ?", "Est-ce qu'il fait chaud dehors ?", "Voyez-vous un code d'alarme ?"], solutionsTech: ["Nettoyage filtre.", "Déplacer appareil, laisser refroidir.", "Maintenance technique."] },
                    { title: "Débit faible ou irrégulier", causes: ["Ventilation insuffisante", "Airflow bloqué", "Tubulure / canule obstruée"], solutionsPatient: ["Est-ce que le sac de transport bouche les aérations ?", "L'appareil respire-t-il bien ?", "La tubulure ou la canule est-elle pliée ou bouchée ?"], solutionsTech: ["Ne pas obstruer aérations.", "Dégager entrées d'air.", "Vérifier ou remplacer tubulure/canule."] },
                    { title: "Alarme No Flow (pas de débit)", causes: ["Circuit complètement bouché", "Débit réglé trop bas"], solutionsPatient: ["Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?"], solutionsTech: ["Vérifier tubulure / canule.", "Ajuster débit."] },
                    { title: "Alarme pression (High/Low Pressure)", causes: ["Défaut compresseur", "Tubulure interne coudée", "Surchauffe"], solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression sur l'écran ?"], solutionsTech: ["Maintenance technique (compresseur).", "Vérifier tubulures", "Check ventilateur"] },
                    { title: "Alarme Service Required", causes: ["Panne interne", "Capteur O2 HS", "Défaut carte"], solutionsPatient: ["Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Y a-t-il un message d'erreur sur l'écran ?"], solutionsTech: ["Maintenance technique / SAV.", "Remplacer capteur", "Vérifier tensions"] }
                ] },
                { id: "zen-o-lite", name: "Zen-O Lite", failures: [
                    { title: "L'appareil ne démarre pas", causes: ["Batterie vide", "Chargeur HS", "Carte"], solutionsPatient: ["Quand vous branchez le chargeur, est-ce qu'un voyant s'allume sur la machine ?", "Est-ce que le câble du chargeur est abîmé ou tordu ?", "Si vous retirez la batterie et branchez le chargeur, est-ce qu'il démarre ?"], solutionsTech: ["Tester l'alimentation externe.", "Tester sans batterie.", "Vérifier connectique interne."] },
                    { title: "Débit faible ou irrégulier", causes: ["Pompe défectueuse", "Airflow bloqué", "Tubulure / canule obstruée", "Filtre d'entrée colmaté"], solutionsPatient: ["L'appareil fait-il un bruit anormal ?", "Les aérations sont-elles libres ?", "La tubulure ou la canule est-elle pliée ou bouchée ?", "Vérifiez que le sac est bien positionné."], solutionsTech: ["Maintenance pompe.", "Dégager aérations.", "Vérifier ou remplacer tubulure/canule.", "Nettoyer les conduits d'entrée."] },
                    { title: "Bruit anormal", causes: ["Batterie faible", "Vibration compresseur", "Objet dans ventilateur", "Silentblocs usés"], solutionsPatient: ["La batterie est-elle bien chargée ?", "L'appareil est-il stable dans son sac ?", "Entendez-vous un sifflement ou un claquement ?"], solutionsTech: ["Remplacer batterie.", "Vérifier fixations moteur.", "Nettoyer ventilateur.", "Resserrer le boîtier."] },
                    { title: "Alarme (Température / Système)", causes: ["Environnement trop chaud", "Capteur défectueux", "Ventilateur interne bloqué", "Aérations bouchées"], solutionsPatient: ["Fait-il très chaud ?", "Vérifiez que rien ne bouche les grilles.", "Y a-t-il une alarme système sur l'écran ?"], solutionsTech: ["Déplacer appareil, laisser refroidir.", "Vérifier le fonctionnement du ventilateur.", "Maintenance technique."] },
                    { title: "Alarme No Flow (pas de débit)", causes: ["Circuit complètement bouché", "Débit réglé trop bas"], solutionsPatient: ["Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?"], solutionsTech: ["Vérifier tubulure / canule.", "Ajuster débit."] },
                    { title: "Alarme pression (High/Low Pressure)", causes: ["Défaut compresseur", "Fuite interne", "Surchauffe"], solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression sur l'écran ?"], solutionsTech: ["Maintenance technique (compresseur).", "Vérifier tubulures"] },
                    { title: "Alarme Service Required", causes: ["Panne interne", "Capteur HS", "Défaut carte"], solutionsPatient: ["Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Y a-t-il un message d'erreur sur l'écran ?"], solutionsTech: ["Maintenance technique / SAV.", "Check carte"] }
                ] },
                { id: "zen-o", name: "Zen-O (Double batterie)", failures: [
                    { title: "L'appareil ne démarre pas", causes: ["Batterie vide", "Chargeur HS", "Carte"], solutionsPatient: ["Quand vous branchez le chargeur, est-ce qu'un voyant s'allume sur la machine ?", "Est-ce que le câble du chargeur est abîmé ou tordu ?", "Si vous retirez la batterie et branchez le chargeur, est-ce qu'il démarre ?"], solutionsTech: ["Tester l'alimentation externe.", "Tester sans batterie.", "Vérifier connectique interne."] },
                    { title: "Fuite d’air", causes: ["Connectique mal serrée", "Joint valve usé", "Canule percée", "Raccord de sortie desserré"], solutionsPatient: ["Le tuyau est-il bien branché ?", "Sentez-vous de l'air sortir ailleurs ?", "Essayez une autre canule.", "Vérifiez le raccord de sortie sur l'appareil."], solutionsTech: ["Vérifier connexions.", "Remplacer joint valve.", "Tester étanchéité sortie.", "Vérifier le circuit pneumatique interne."] },
                    { title: "Alarme (Température / Système)", causes: ["Environnement trop chaud", "Capteur HS", "Filtres bouchés", "Ventilateur interne fatigué"], solutionsPatient: ["Voyez-vous un message d'erreur ?", "Fait-il chaud ?", "Les grilles à l'arrière sont-elles propres ?"], solutionsTech: ["Déplacer appareil, laisser refroidir.", "Nettoyer conduits.", "Remplacer ventilateur.", "Maintenance technique."] },
                    { title: "Alarme No Flow (pas de débit)", causes: ["Circuit complètement bouché", "Débit réglé trop bas"], solutionsPatient: ["Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?"], solutionsTech: ["Vérifier tubulure / canule.", "Ajuster débit."] },
                    { title: "Alarme pression (High/Low Pressure)", causes: ["Défaut compresseur", "Tubulure pliée", "Vanne HS", "Fuite interne"], solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression sur l'écran ?", "Vérifiez que le tuyau n'est pas pincé par le sac."], solutionsTech: ["Maintenance technique (compresseur).", "Vérifier tubulures.", "Tester vannes.", "Effectuer test d'étanchéité."] },
                    { title: "Alarme Service Required", causes: ["Panne interne", "Défaut carte", "Batterie défectueuse"], solutionsPatient: ["Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Y a-t-il un message d'erreur sur l'écran ?"], solutionsTech: ["Maintenance technique / SAV.", "Check carte", "Contrôler batterie"] }
                ] },
                { id: "freestyle", name: "FreeStyle Comfort", failures: [
                    { title: "L'appareil ne démarre pas", causes: ["Batterie vide", "Chargeur HS", "Carte"], solutionsPatient: ["Quand vous branchez le chargeur, est-ce qu'un voyant s'allume sur la machine ?", "Est-ce que le câble du chargeur est abîmé ou tordu ?", "Si vous retirez la batterie et branchez le chargeur, est-ce qu'il démarre ?"], solutionsTech: ["Tester l'alimentation externe.", "Tester sans batterie.", "Vérifier connectique interne."] },
                    { title: "Fuite d’air", causes: ["Connectique mal serrée", "Airflow bloqué", "Tubulure / canule obstruée", "Joint de raccord usé"], solutionsPatient: ["Le tuyau est-il bien clipsé ?", "Rien ne bouche les trous d'air ?", "La tubulure ou la canule est-elle pliée ou bouchée ?", "Entendez-vous un sifflement au branchement ?"], solutionsTech: ["Vérifier connexions.", "Dégager aérations.", "Vérifier ou remplacer tubulure/canule.", "Remplacer joint torique de sortie."] },
                    { title: "Alarme (Température / Système)", causes: ["Environnement trop chaud", "Capteur HS", "Filtre bouché", "Ventilateur interne bloqué"], solutionsPatient: ["Voyez-vous un message d'erreur ?", "Fait-il chaud ?", "Les filtres noirs sur les côtés sont-ils propres ?", "Sentez-vous l'air sortir par les grilles ?"], solutionsTech: ["Nettoyer les filtres extérieurs.", "Déplacer appareil, laisser refroidir.", "Nettoyage interne à l'air sec.", "Remplacer ventilateur."] },
                    { title: "Alarme No Flow (pas de débit)", causes: ["Circuit complètement bouché", "Débit réglé trop bas"], solutionsPatient: ["Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?"], solutionsTech: ["Vérifier tubulure / canule.", "Ajuster débit."] },
                    { title: "Alarme pression (High/Low Pressure)", causes: ["Défaut compresseur", "Fuite interne", "Surchauffe", "Vanne de pulsion bloquée"], solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression sur l'écran ?", "Vérifiez que votre canule n'est pas trop longue."], solutionsTech: ["Maintenance technique (compresseur).", "Vérifier tubulures.", "Nettoyer ventilateur.", "Tester la valve pneumatique."] },
                    { title: "Alarme Service Required", causes: ["Panne interne", "Défaut carte", "Surchauffe", "Tamis moléculaires HS"], solutionsPatient: ["Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Y a-t-il un message d'erreur sur l'écran ?", "Laissez l'appareil éteint 30 min et redémarrez."], solutionsTech: ["Maintenance technique / SAV.", "Check carte.", "Contrôler tensions.", "Remplacer les colonnes."] }
                ] }
            ]
          },
          {
            id: "transportable",
            name: "Transportable",
            models: [
                { id: "eclipse-3", name: "Eclipse 3", failures: [
                    { title: "L'appareil ne démarre pas", causes: ["Batterie vide", "Chargeur HS", "Connectique interne défaillante", "Carte mère HS"], solutionsPatient: ["Branchez l'appareil sur secteur.", "Le voyant du bloc d'alimentation est-il allumé ?", "Retirez la batterie et essayez sur secteur seul.", "Vérifiez que le câble n'est pas coupé."], solutionsTech: ["Tester la tension du chargeur (28V DC).", "Vérifier l'embase de charge.", "Vérifier les fusibles internes.", "Remplacer la carte mère."] },
                    { title: "Voyant batterie jaune clignotant", causes: ["Autonomie < 10 %", "Batterie en fin de vie", "Défaut de communication batterie", "Surchauffe batterie"], solutionsPatient: ["Branchez sur secteur immédiatement.", "Retirez et remettez la batterie fermement.", "Laissez la batterie refroidir si elle est chaude.", "Vérifiez si l'icône batterie s'affiche."], solutionsTech: ["Vérifier la capacité de charge.", "Nettoyer les connecteurs batterie.", "Remplacer la batterie.", "Vérifier le circuit de charge sur la carte."] },
                    { title: "Problème d'alimentation (12V / Voiture)", causes: ["Cordon DC mal inséré", "Fusible allume-cigare grillé", "Prise voiture défectueuse", "Surchauffe du bloc DC"], solutionsPatient: ["Vérifiez que la prise est bien enfoncée dans l'allume-cigare.", "Vérifiez le voyant sur la prise.", "Dévissez l'embout pour vérifier le petit fusible.", "Essayez sur une autre prise 12V."], solutionsTech: ["Tester la continuité du câble DC.", "Vérifier le fusible du câble.", "Contrôler la tension de sortie sous charge."] },
                    { title: "Alarme O₂ faible", causes: ["Saturation des tamis moléculaires", "Filtre d'entrée colmaté", "Fuite interne", "Humidité excessive"], solutionsPatient: ["Vérifiez que le filtre à poussière à l'arrière est propre.", "Placez l'appareil dans un endroit bien aéré.", "Assurez-vous de ne pas être trop près d'une source de vapeur.", "Aérez la pièce."], solutionsTech: ["Mesurer la pureté O2 avec un analyseur.", "Remplacer les colonnes de tamis.", "Vérifier la pression du compresseur.", "Contrôler l'étanchéité pneumatique."] },
                    { title: "Alarme débit / Obstruction", causes: ["Canule pliée ou écrasée", "Filtre HEPA bouché", "Vanne de sortie bloquée", "Bocal humidificateur fuyard"], solutionsPatient: ["Vérifiez que votre canule n'est pas pliée.", "Essayez avec une canule neuve.", "Si vous utilisez un humidificateur, vérifiez qu'il est bien fermé.", "Sentez-vous l'air sortir au bout ?"], solutionsTech: ["Vérifier le capteur de débit.", "Remplacer le filtre HEPA de sortie.", "Tester la pression de sortie.", "Vérifier le cycle de la vanne de pulsion."] },
                    { title: "Alarme Température / Surchauffe", causes: ["Ventilation obstruée", "Ventilateur interne HS", "Environnement trop chaud", "Filtres internes encrassés"], solutionsPatient: ["Sortez l'appareil de sa sacoche.", "Vérifiez que les grilles sont libres.", "Laissez refroidir l'appareil 30 minutes.", "Éloignez l'appareil du soleil."], solutionsTech: ["Vérifier le ventilateur interne.", "Nettoyage interne à l'air sec.", "Contrôler la température de la turbine via le menu service."] },
                    { title: "Alarme 'Aucun souffle détecté' (Mode Pulsion)", causes: ["Respiration par la bouche", "Canule trop longue (> 2.1m)", "Sensibilité trigger basse", "Valve de pulsion bloquée"], solutionsPatient: ["Respirez bien par le nez.", "Utilisez une canule de 2 mètres maximum.", "Vérifiez le branchement du tuyau.", "Testez en mode continu."], solutionsTech: ["Recalibrer la sensibilité du trigger.", "Tester la valve pneumatique.", "Vérifier l'étanchéité du circuit."] },
                    { title: "Message 'Erreur Système' (Fail XX)", causes: ["Fail 01 (O2)", "Fail 02 (Pression)", "Fail 04 (Batterie)", "Défaut carte mère"], solutionsPatient: ["Retirez la batterie et débranchez le secteur 1 minute.", "Redémarrez l'appareil.", "Notez le numéro de Fail qui s'affiche."], solutionsTech: ["Identifier le composant via le code erreur.", "Tester les tensions de carte.", "Contrôler les capteurs internes."] },
                    { title: "Bruit de sifflement ou fuite interne", causes: ["Tuyau débranché", "Joint vanne usé", "Membrane compresseur fendue"], solutionsPatient: ["Entendez-vous un sifflement venant de l'intérieur ?", "Le bruit s'arrête-t-il si vous bouchez la sortie ?"], solutionsTech: ["Recherche de fuite interne.", "Remplacer la tubulure défectueuse.", "Vérifier le compresseur."] }
                ] },
                { id: "eclipse-5", name: "Eclipse 5", failures: [
                    { title: "L'appareil ne démarre pas", causes: ["Batterie vide", "Chargeur HS", "Connectique interne défaillante", "Carte mère HS"], solutionsPatient: ["Branchez l'appareil sur secteur.", "Le voyant du bloc d'alimentation est-il allumé ?", "Retirez la batterie et essayez sur secteur seul.", "Vérifiez que le câble n'est pas coupé."], solutionsTech: ["Tester la tension du chargeur (28V DC).", "Vérifier l'embase de charge.", "Vérifier les fusibles internes.", "Remplacer la carte mère."] },
                    { title: "Voyant batterie jaune clignotant", causes: ["Autonomie < 10 %", "Batterie en fin de vie", "Défaut de communication batterie", "Surchauffe batterie"], solutionsPatient: ["Branchez sur secteur immédiatement.", "Retirez et remettez la batterie fermement.", "Laissez la batterie refroidir si elle est chaude.", "Vérifiez si l'icône batterie s'affiche."], solutionsTech: ["Vérifier la capacité de charge.", "Nettoyer les connecteurs batterie.", "Remplacer la batterie.", "Vérifier le circuit de charge sur la carte."] },
                    { title: "Problème d'alimentation (12V / Voiture)", causes: ["Cordon DC mal inséré", "Fusible allume-cigare grillé", "Prise voiture défectueuse", "Surchauffe du bloc DC"], solutionsPatient: ["Vérifiez que la prise est bien enfoncée dans l'allume-cigare.", "Vérifiez le voyant sur la prise.", "Dévissez l'embout pour vérifier le petit fusible.", "Essayez sur une autre prise 12V."], solutionsTech: ["Tester la continuité du câble DC.", "Vérifier le fusible du câble.", "Contrôler la tension de sortie sous charge."] },
                    { title: "Alarme O₂ faible", causes: ["Saturation des tamis moléculaires", "Filtre d'entrée colmaté", "Fuite interne", "Humidité excessive"], solutionsPatient: ["Vérifiez que le filtre à poussière à l'arrière est propre.", "Placez l'appareil dans un endroit bien aéré.", "Assurez-vous de ne pas être trop près d'une source de vapeur.", "Aérez la pièce."], solutionsTech: ["Mesurer la pureté O2 avec un analyseur.", "Remplacer les colonnes de tamis.", "Vérifier la pression du compresseur.", "Contrôler l'étanchéité pneumatique."] },
                    { title: "Alarme débit / Obstruction", causes: ["Canule pliée ou écrasée", "Filtre HEPA bouché", "Vanne de sortie bloquée", "Bocal humidificateur fuyard"], solutionsPatient: ["Vérifiez que votre canule n'est pas pliée.", "Essayez avec une canule neuve.", "Si vous utilisez un humidificateur, vérifiez qu'il est bien fermé.", "Sentez-vous l'air sortir au bout ?"], solutionsTech: ["Vérifier le capteur de débit.", "Remplacer le filtre HEPA de sortie.", "Tester la pression de sortie.", "Vérifier le cycle de la vanne de pulsion."] },
                    { title: "Alarme Température / Surchauffe", causes: ["Ventilation obstruée", "Ventilateur interne HS", "Environnement trop chaud", "Filtres internes encrassés"], solutionsPatient: ["Sortez l'appareil de sa sacoche.", "Vérifiez que les grilles sont libres.", "Laissez refroidir l'appareil 30 minutes.", "Éloignez l'appareil du soleil."], solutionsTech: ["Vérifier le ventilateur interne.", "Nettoyage interne à l'air sec.", "Contrôler la température de la turbine via le menu service."] },
                    { title: "Alarme 'Aucun souffle détecté' (Mode Pulsion)", causes: ["Respiration par la bouche", "Canule trop longue (> 2.1m)", "Sensibilité trigger basse", "Valve de pulsion bloquée"], solutionsPatient: ["Respirez bien par le nez.", "Utilisez une canule de 2 mètres maximum.", "Vérifiez le branchement du tuyau.", "Testez en mode continu."], solutionsTech: ["Recalibrer la sensibilité du trigger.", "Tester la valve pneumatique.", "Vérifier l'étanchéité du circuit."] },
                    { title: "Message 'Erreur Système' (Fail XX)", causes: ["Fail 01 (O2)", "Fail 02 (Pression)", "Fail 04 (Batterie)", "Défaut carte mère"], solutionsPatient: ["Retirez la batterie et débranchez le secteur 1 minute.", "Redémarrez l'appareil.", "Notez le numéro de Fail qui s'affiche."], solutionsTech: ["Identifier le composant via le code erreur.", "Tester les tensions de carte.", "Contrôler les capteurs internes."] },
                    { title: "Bruit de sifflement ou fuite interne", causes: ["Tuyau débranché", "Joint vanne usé", "Membrane compresseur fendue"], solutionsPatient: ["Entendez-vous un sifflement venant de l'intérieur ?", "Le bruit s'arrête-t-il si vous bouchez la sortie ?"], solutionsTech: ["Recherche de fuite interne.", "Remplacer la tubulure défectueuse.", "Vérifier le compresseur."] }
                ] },
          { id: "simplygo", name: "SimplyGo (Standard)", failures: [
                        { title: "L'appareil ne démarre pas", causes: ["Batterie vide", "Chargeur HS", "Connectique interne défaillante", "Carte mère HS"], solutionsPatient: ["Branchez l'appareil sur secteur.", "Le voyant du bloc d'alimentation est-il allumé ?", "Retirez la batterie et essayez sur secteur seul.", "Vérifiez que le câble n'est pas coupé."], solutionsTech: ["Tester la tension du chargeur (28V DC).", "Vérifier l'embase de charge.", "Vérifier les fusibles internes.", "Remplacer la carte mère."] },
                        { title: "Voyant batterie jaune clignotant", causes: ["Autonomie < 10 %", "Batterie en fin de vie", "Défaut de communication batterie", "Surchauffe batterie"], solutionsPatient: ["Branchez sur secteur immédiatement.", "Retirez et remettez la batterie fermement.", "Laissez la batterie refroidir si elle est chaude.", "Vérifiez si l'icône batterie s'affiche."], solutionsTech: ["Vérifier la capacité de charge.", "Nettoyer les connecteurs batterie.", "Remplacer la batterie.", "Vérifier le circuit de charge sur la carte."] },
                        { title: "Problème d'alimentation (12V / Voiture)", causes: ["Cordon DC mal inséré", "Fusible allume-cigare grillé", "Prise voiture défectueuse", "Surchauffe du bloc DC"], solutionsPatient: ["Vérifiez que la prise est bien enfoncée dans l'allume-cigare.", "Vérifiez le voyant sur la prise.", "Dévissez l'embout pour vérifier le petit fusible.", "Essayez sur une autre prise 12V."], solutionsTech: ["Tester la continuité du câble DC.", "Vérifier le fusible du câble.", "Contrôler la tension de sortie sous charge."] },
                        { title: "Alarme O₂ faible", causes: ["Saturation des tamis moléculaires", "Filtre d'entrée colmaté", "Fuite interne", "Humidité excessive"], solutionsPatient: ["Vérifiez que le filtre à poussière à l'arrière est propre.", "Placez l'appareil dans un endroit bien aéré.", "Assurez-vous de ne pas être trop près d'une source de vapeur.", "Aérez la pièce."], solutionsTech: ["Mesurer la pureté O2 avec un analyseur.", "Remplacer les colonnes de tamis.", "Vérifier la pression du compresseur.", "Contrôler l'étanchéité pneumatique."] },
                        { title: "Alarme débit / Obstruction", causes: ["Canule pliée ou écrasée", "Filtre HEPA bouché", "Vanne de sortie bloquée", "Bocal humidificateur fuyard"], solutionsPatient: ["Vérifiez que votre canule n'est pas pliée.", "Essayez avec une canule neuve.", "Si vous utilisez un humidificateur, vérifiez qu'il est bien fermé.", "Sentez-vous l'air sortir au bout ?"], solutionsTech: ["Vérifier le capteur de débit.", "Remplacer le filtre HEPA de sortie.", "Tester la pression de sortie.", "Vérifier le cycle de la vanne de pulsion."] },
                        { title: "Alarme Température / Surchauffe", causes: ["Ventilation obstruée", "Ventilateur interne HS", "Environnement trop chaud", "Filtres internes encrassés"], solutionsPatient: ["Sortez l'appareil de sa sacoche.", "Vérifiez que les grilles sont libres.", "Laissez refroidir l'appareil 30 minutes.", "Éloignez l'appareil du soleil."], solutionsTech: ["Vérifier le ventilateur interne.", "Nettoyage interne à l'air sec.", "Contrôler la température de la turbine via le menu service."] },
                        { title: "Alarme 'Aucun souffle détecté' (Mode Pulsion)", causes: ["Respiration par la bouche", "Canule trop longue (> 2.1m)", "Sensibilité trigger basse", "Valve de pulsion bloquée"], solutionsPatient: ["Respirez bien par le nez.", "Utilisez une canule de 2 mètres maximum.", "Vérifiez le branchement du tuyau.", "Testez en mode continu."], solutionsTech: ["Recalibrer la sensibilité du trigger.", "Tester la valve pneumatique.", "Vérifier l'étanchéité du circuit."] },
                        { title: "Message 'Erreur Système' (Fail XX)", causes: ["Fail 01 (O2)", "Fail 02 (Pression)", "Fail 04 (Batterie)", "Défaut carte mère"], solutionsPatient: ["Retirez la batterie et débranchez le secteur 1 minute.", "Redémarrez l'appareil.", "Notez le numéro de Fail qui s'affiche."], solutionsTech: ["Identifier le composant via le code erreur.", "Tester les tensions de carte.", "Contrôler les capteurs internes."] },
                        { title: "Bruit de sifflement ou fuite interne", causes: ["Tuyau débranché", "Joint vanne usé", "Membrane compresseur fendue"], solutionsPatient: ["Entendez-vous un sifflement venant de l'intérieur ?", "Le bruit s'arrête-t-il si vous bouchez la sortie ?"], solutionsTech: ["Recherche de fuite interne.", "Remplacer la tubulure défectueuse.", "Vérifier le compresseur."] }
          ] },
          { id: "zen-o-transp", name: "Zen-O", failures: [
                        { title: "L'appareil ne démarre pas", causes: ["Batterie vide", "Chargeur HS", "Connectique interne défaillante", "Carte mère HS"], solutionsPatient: ["Branchez l'appareil sur secteur.", "Le voyant du bloc d'alimentation est-il allumé ?", "Retirez la batterie et essayez sur secteur seul.", "Vérifiez que le câble n'est pas coupé."], solutionsTech: ["Tester la tension du chargeur (28V DC).", "Vérifier l'embase de charge.", "Vérifier les fusibles internes.", "Remplacer la carte mère."] },
                        { title: "Voyant batterie jaune clignotant", causes: ["Autonomie < 10 %", "Batterie en fin de vie", "Défaut de communication batterie", "Surchauffe batterie"], solutionsPatient: ["Branchez sur secteur immédiatement.", "Retirez et remettez la batterie fermement.", "Laissez la batterie refroidir si elle est chaude.", "Vérifiez si l'icône batterie s'affiche."], solutionsTech: ["Vérifier la capacité de charge.", "Nettoyer les connecteurs batterie.", "Remplacer la batterie.", "Vérifier le circuit de charge sur la carte."] },
                        { title: "Problème d'alimentation (12V / Voiture)", causes: ["Cordon DC mal inséré", "Fusible allume-cigare grillé", "Prise voiture défectueuse", "Surchauffe du bloc DC"], solutionsPatient: ["Vérifiez que la prise est bien enfoncée dans l'allume-cigare.", "Vérifiez le voyant sur la prise.", "Dévissez l'embout pour vérifier le petit fusible.", "Essayez sur une autre prise 12V."], solutionsTech: ["Tester la continuité du câble DC.", "Vérifier le fusible du câble.", "Contrôler la tension de sortie sous charge."] },
                        { title: "Alarme O₂ faible", causes: ["Saturation des tamis moléculaires", "Filtre d'entrée colmaté", "Fuite interne", "Humidité excessive"], solutionsPatient: ["Vérifiez que le filtre à poussière à l'arrière est propre.", "Placez l'appareil dans un endroit bien aéré.", "Assurez-vous de ne pas être trop près d'une source de vapeur.", "Aérez la pièce."], solutionsTech: ["Mesurer la pureté O2 avec un analyseur.", "Remplacer les colonnes de tamis.", "Vérifier la pression du compresseur.", "Contrôler l'étanchéité pneumatique."] },
                        { title: "Alarme débit / Obstruction", causes: ["Canule pliée ou écrasée", "Filtre HEPA bouché", "Vanne de sortie bloquée", "Bocal humidificateur fuyard"], solutionsPatient: ["Vérifiez que votre canule n'est pas pliée.", "Essayez avec une canule neuve.", "Si vous utilisez un humidificateur, vérifiez qu'il est bien fermé.", "Sentez-vous l'air sortir au bout ?"], solutionsTech: ["Vérifier le capteur de débit.", "Remplacer le filtre HEPA de sortie.", "Tester la pression de sortie.", "Vérifier le cycle de la vanne de pulsion."] },
                        { title: "Alarme Température / Surchauffe", causes: ["Ventilation obstruée", "Ventilateur interne HS", "Environnement trop chaud", "Filtres internes encrassés"], solutionsPatient: ["Sortez l'appareil de sa sacoche.", "Vérifiez que les grilles sont libres.", "Laissez refroidir l'appareil 30 minutes.", "Éloignez l'appareil du soleil."], solutionsTech: ["Vérifier le ventilateur interne.", "Nettoyage interne à l'air sec.", "Contrôler la température de la turbine via le menu service."] },
                        { title: "Alarme 'Aucun souffle détecté' (Mode Pulsion)", causes: ["Respiration par la bouche", "Canule trop longue (> 2.1m)", "Sensibilité trigger basse", "Valve de pulsion bloquée"], solutionsPatient: ["Respirez bien par le nez.", "Utilisez une canule de 2 mètres maximum.", "Vérifiez le branchement du tuyau.", "Testez en mode continu."], solutionsTech: ["Recalibrer la sensibilité du trigger.", "Tester la valve pneumatique.", "Vérifier l'étanchéité du circuit."] },
                        { title: "Message 'Erreur Système' (Fail XX)", causes: ["Fail 01 (O2)", "Fail 02 (Pression)", "Fail 04 (Batterie)", "Défaut carte mère"], solutionsPatient: ["Retirez la batterie et débranchez le secteur 1 minute.", "Redémarrez l'appareil.", "Notez le numéro de Fail qui s'affiche."], solutionsTech: ["Identifier le composant via le code erreur.", "Tester les tensions de carte.", "Contrôler les capteurs internes."] },
                        { title: "Bruit de sifflement ou fuite interne", causes: ["Tuyau débranché", "Joint vanne usé", "Membrane compresseur fendue"], solutionsPatient: ["Entendez-vous un sifflement venant de l'intérieur ?", "Le bruit s'arrête-t-il si vous bouchez la sortie ?"], solutionsTech: ["Recherche de fuite interne.", "Remplacer la tubulure défectueuse.", "Vérifier le compresseur."] }
          ] },
          { id: "solo2-transp", name: "Invacare SOLO2", failures: [
                        { title: "L'appareil ne démarre pas", causes: ["Batterie vide", "Chargeur HS", "Connectique interne défaillante", "Carte mère HS"], solutionsPatient: ["Branchez l'appareil sur secteur.", "Le voyant du bloc d'alimentation est-il allumé ?", "Retirez la batterie et essayez sur secteur seul.", "Vérifiez que le câble n'est pas coupé."], solutionsTech: ["Tester la tension du chargeur (28V DC).", "Vérifier l'embase de charge.", "Vérifier les fusibles internes.", "Remplacer la carte mère."] },
                        { title: "Voyant batterie jaune clignotant", causes: ["Autonomie < 10 %", "Batterie en fin de vie", "Défaut de communication batterie", "Surchauffe batterie"], solutionsPatient: ["Branchez sur secteur immédiatement.", "Retirez et remettez la batterie fermement.", "Laissez la batterie refroidir si elle est chaude.", "Vérifiez si l'icône batterie s'affiche."], solutionsTech: ["Vérifier la capacité de charge.", "Nettoyer les connecteurs batterie.", "Remplacer la batterie.", "Vérifier le circuit de charge sur la carte."] },
                        { title: "Problème d'alimentation (12V / Voiture)", causes: ["Cordon DC mal inséré", "Fusible allume-cigare grillé", "Prise voiture défectueuse", "Surchauffe du bloc DC"], solutionsPatient: ["Vérifiez que la prise est bien enfoncée dans l'allume-cigare.", "Vérifiez le voyant sur la prise.", "Dévissez l'embout pour vérifier le petit fusible.", "Essayez sur une autre prise 12V."], solutionsTech: ["Tester la continuité du câble DC.", "Vérifier le fusible du câble.", "Contrôler la tension de sortie sous charge."] },
                        { title: "Alarme O₂ faible", causes: ["Saturation des tamis moléculaires", "Filtre d'entrée colmaté", "Fuite interne", "Humidité excessive"], solutionsPatient: ["Vérifiez que le filtre à poussière à l'arrière est propre.", "Placez l'appareil dans un endroit bien aéré.", "Assurez-vous de ne pas être trop près d'une source de vapeur.", "Aérez la pièce."], solutionsTech: ["Mesurer la pureté O2 avec un analyseur.", "Remplacer les colonnes de tamis.", "Vérifier la pression du compresseur.", "Contrôler l'étanchéité pneumatique."] },
                        { title: "Alarme débit / Obstruction", causes: ["Canule pliée ou écrasée", "Filtre HEPA bouché", "Vanne de sortie bloquée", "Bocal humidificateur fuyard"], solutionsPatient: ["Vérifiez que votre canule n'est pas pliée.", "Essayez avec une canule neuve.", "Si vous utilisez un humidificateur, vérifiez qu'il est bien fermé.", "Sentez-vous l'air sortir au bout ?"], solutionsTech: ["Vérifier le capteur de débit.", "Remplacer le filtre HEPA de sortie.", "Tester la pression de sortie.", "Vérifier le cycle de la vanne de pulsion."] },
                        { title: "Alarme Température / Surchauffe", causes: ["Ventilation obstruée", "Ventilateur interne HS", "Environnement trop chaud", "Filtres internes encrassés"], solutionsPatient: ["Sortez l'appareil de sa sacoche.", "Vérifiez que les grilles sont libres.", "Laissez refroidir l'appareil 30 minutes.", "Éloignez l'appareil du soleil."], solutionsTech: ["Vérifier le ventilateur interne.", "Nettoyage interne à l'air sec.", "Contrôler la température de la turbine via le menu service."] },
                        { title: "Alarme 'Aucun souffle détecté' (Mode Pulsion)", causes: ["Respiration par la bouche", "Canule trop longue (> 2.1m)", "Sensibilité trigger basse", "Valve de pulsion bloquée"], solutionsPatient: ["Respirez bien par le nez.", "Utilisez une canule de 2 mètres maximum.", "Vérifiez le branchement du tuyau.", "Testez en mode continu."], solutionsTech: ["Recalibrer la sensibilité du trigger.", "Tester la valve pneumatique.", "Vérifier l'étanchéité du circuit."] },
                        { title: "Message 'Erreur Système' (Fail XX)", causes: ["Fail 01 (O2)", "Fail 02 (Pression)", "Fail 04 (Batterie)", "Défaut carte mère"], solutionsPatient: ["Retirez la batterie et débranchez le secteur 1 minute.", "Redémarrez l'appareil.", "Notez le numéro de Fail qui s'affiche."], solutionsTech: ["Identifier le composant via le code erreur.", "Tester les tensions de carte.", "Contrôler les capteurs internes."] },
                        { title: "Bruit de sifflement ou fuite interne", causes: ["Tuyau débranché", "Joint vanne usé", "Membrane compresseur fendue"], solutionsPatient: ["Entendez-vous un sifflement venant de l'intérieur ?", "Le bruit s'arrête-t-il si vous bouchez la sortie ?"], solutionsTech: ["Recherche de fuite interne.", "Remplacer la tubulure défectueuse.", "Vérifier le compresseur."] }
          ] }
            ] 
          }
        ]
      },
      { 
        id: "o2-liquide", 
        name: "O₂ Liquide", 
        models: [
            { id: "companion-1000", name: "Companion 1000", failures: [
                { title: "Pas de débit d'oxygène", causes: ["Valve de sortie gelée", "Sélecteur de débit cassé", "Canule obstruée", "Réservoir vide"], solutionsPatient: ["Vérifiez le niveau sur l'indicateur.", "Sentez-vous l'air sortir ?", "Laissez l'appareil se réchauffer si présence de givre blanc.", "Essayez une autre canule."], solutionsTech: ["Décongeler l'unité.", "Vérifier l'axe du sélecteur.", "Contrôler la pression de tête de la cuve mère."] },
                { title: "Fuite ou sifflement après remplissage", causes: ["Valve de remplissage bloquée (givre)", "Joint de valve usé"], solutionsPatient: ["Entendez-vous un sifflement continu ?", "Y a-t-il de la glace sur le connecteur ?", "Ré-enclenchez brièvement le portable sur la cuve pour dégeler la valve."], solutionsTech: ["Sécher les valves à l'air sec.", "Remplacer le joint à lèvres."] },
                { title: "Indicateur de niveau HS", causes: ["Pile 9V morte", "Capteur de pression HS", "Flotteur bloqué par la glace"], solutionsPatient: ["L'écran reste noir ?", "Appuyez bien au centre du bouton.", "Secouez doucement l'appareil pour libérer le flotteur."], solutionsTech: ["Remplacer la pile 9V.", "Calibrer les potentiomètres de niveau."] }
            ] },
            { id: "companion-500", name: "Companion 500", failures: [
                { title: "Pas de débit d'oxygène", causes: ["Valve de sortie gelée", "Sélecteur de débit cassé", "Canule obstruée", "Réservoir vide"], solutionsPatient: ["Vérifiez le niveau sur l'indicateur.", "Sentez-vous l'air sortir ?", "Laissez l'appareil se réchauffer si présence de givre blanc.", "Essayez une autre canule."], solutionsTech: ["Décongeler l'unité.", "Vérifier l'axe du sélecteur.", "Contrôler la pression de tête de la cuve mère."] },
                { title: "Fuite ou sifflement après remplissage", causes: ["Valve de remplissage bloquée (givre)", "Joint de valve usé"], solutionsPatient: ["Entendez-vous un sifflement continu ?", "Y a-t-il de la glace sur le connecteur ?", "Ré-enclenchez brièvement le portable sur la cuve pour dégeler la valve."], solutionsTech: ["Sécher les valves à l'air sec.", "Remplacer le joint à lèvres."] }
            ] },
            { id: "sprint", name: "Companion Sprint", failures: [
                { title: "Pas de débit d'oxygène", causes: ["Valve de sortie gelée", "Sélecteur de débit cassé", "Canule obstruée", "Réservoir vide"], solutionsPatient: ["Vérifiez le niveau sur l'indicateur.", "Sentez-vous l'air sortir ?", "Laissez l'appareil se réchauffer si présence de givre blanc.", "Essayez une autre canule."], solutionsTech: ["Décongeler l'unité.", "Vérifier l'axe du sélecteur.", "Contrôler la pression de tête de la cuve mère."] },
                { title: "Fuite ou sifflement après remplissage", causes: ["Valve de remplissage bloquée (givre)", "Joint de valve usé"], solutionsPatient: ["Entendez-vous un sifflement continu ?", "Y a-t-il de la glace sur le connecteur ?", "Ré-enclenchez brièvement le portable sur la cuve pour dégeler la valve."], solutionsTech: ["Sécher les valves à l'air sec.", "Remplacer le joint à lèvres."] },
                { title: "Indicateur de niveau HS", causes: ["Pile 9V morte", "Capteur de pression HS", "Flotteur bloqué par la glace"], solutionsPatient: ["L'écran reste noir ?", "Appuyez bien au centre du bouton.", "Secouez doucement l'appareil pour libérer le flotteur."], solutionsTech: ["Remplacer la pile 9V.", "Calibrer les potentiomètres de niveau."] }
            ] },
            { id: "stroller", name: "Companion Stroller", failures: [
                { title: "Pas de débit d'oxygène", causes: ["Valve de sortie gelée", "Sélecteur de débit cassé", "Canule obstruée", "Réservoir vide"], solutionsPatient: ["Vérifiez le niveau sur l'indicateur.", "Sentez-vous l'air sortir ?", "Laissez l'appareil se réchauffer si présence de givre blanc.", "Essayez une autre canule."], solutionsTech: ["Décongeler l'unité.", "Vérifier l'axe du sélecteur.", "Contrôler la pression de tête de la cuve mère."] },
                { title: "Fuite ou sifflement après remplissage", causes: ["Valve de remplissage bloquée (givre)", "Joint de valve usé"], solutionsPatient: ["Entendez-vous un sifflement continu ?", "Y a-t-il de la glace sur le connecteur ?", "Ré-enclenchez brièvement le portable sur la cuve pour dégeler la valve."], solutionsTech: ["Sécher les valves à l'air sec.", "Remplacer le joint à lèvres."] },
                { title: "Indicateur de niveau HS", causes: ["Pile 9V morte", "Capteur de pression HS", "Flotteur bloqué par la glace"], solutionsPatient: ["L'écran reste noir ?", "Appuyez bien au centre du bouton.", "Secouez doucement l'appareil pour libérer le flotteur."], solutionsTech: ["Remplacer la pile 9V.", "Calibrer les potentiomètres de niveau."] }
            ] },
            { id: "freelox-05", name: "Freelox 0.5L", failures: [
                { title: "Pas de débit d'oxygène", causes: ["Valve de sortie gelée", "Sélecteur de débit cassé", "Canule obstruée", "Réservoir vide"], solutionsPatient: ["Vérifiez le niveau sur l'indicateur.", "Sentez-vous l'air sortir ?", "Laissez l'appareil se réchauffer si présence de givre blanc.", "Essayez une autre canule."], solutionsTech: ["Décongeler l'unité.", "Vérifier l'axe du sélecteur.", "Contrôler la pression de tête de la cuve mère."] },
                { title: "Fuite ou sifflement après remplissage", causes: ["Valve de remplissage bloquée (givre)", "Joint de valve usé"], solutionsPatient: ["Entendez-vous un sifflement continu ?", "Y a-t-il de la glace sur le connecteur ?", "Ré-enclenchez brièvement le portable sur la cuve pour dégeler la valve."], solutionsTech: ["Sécher les valves à l'air sec.", "Remplacer le joint à lèvres."] }
            ] },
            { id: "freelox-12", name: "Freelox 1.2L", failures: [
                { title: "Pas de débit d'oxygène", causes: ["Valve de sortie gelée", "Sélecteur de débit cassé", "Canule obstruée", "Réservoir vide"], solutionsPatient: ["Vérifiez le niveau sur l'indicateur.", "Sentez-vous l'air sortir ?", "Laissez l'appareil se réchauffer si présence de givre blanc.", "Essayez une autre canule."], solutionsTech: ["Décongeler l'unité.", "Vérifier l'axe du sélecteur.", "Contrôler la pression de tête de la cuve mère."] },
                { title: "Fuite ou sifflement après remplissage", causes: ["Valve de remplissage bloquée (givre)", "Joint de valve usé"], solutionsPatient: ["Entendez-vous un sifflement continu ?", "Y a-t-il de la glace sur le connecteur ?", "Ré-enclenchez brièvement le portable sur la cuve pour dégeler la valve."], solutionsTech: ["Sécher les valves à l'air sec.", "Remplacer le joint à lèvres."] }
            ] },
            { id: "helios-h300", name: "Helios H300", failures: [
                { title: "Pas de débit d'oxygène", causes: ["Valve de sortie gelée", "Sélecteur de débit cassé", "Canule obstruée", "Réservoir vide"], solutionsPatient: ["Vérifiez le niveau sur l'indicateur.", "Sentez-vous l'air sortir ?", "Laissez l'appareil se réchauffer si présence de givre blanc.", "Essayez une autre canule."], solutionsTech: ["Décongeler l'unité.", "Vérifier l'axe du sélecteur.", "Contrôler la pression de tête de la cuve mère."] },
                { title: "Fuite ou sifflement après remplissage", causes: ["Valve de remplissage bloquée (givre)", "Joint de valve usé"], solutionsPatient: ["Entendez-vous un sifflement continu ?", "Y a-t-il de la glace sur le connecteur ?", "Ré-enclenchez brièvement le portable sur la cuve pour dégeler la valve."], solutionsTech: ["Sécher les valves à l'air sec.", "Remplacer le joint à lèvres."] },
                { title: "Indicateur de niveau HS", causes: ["Pile morte", "Capteur de pression HS", "Flotteur bloqué par la glace"], solutionsPatient: ["L'écran reste noir ?", "Appuyez bien au centre du bouton.", "Secouez doucement l'appareil pour libérer le flotteur."], solutionsTech: ["Remplacer la pile.", "Calibrer les potentiomètres de niveau."] }
            ] },
            { id: "helios-marathon", name: "Helios Marathon 850", failures: [
                { title: "Pas de débit d'oxygène", causes: ["Valve de sortie gelée", "Sélecteur de débit cassé", "Canule obstruée", "Réservoir vide"], solutionsPatient: ["Vérifiez le niveau sur l'indicateur.", "Sentez-vous l'air sortir ?", "Laissez l'appareil se réchauffer si présence de givre blanc.", "Essayez une autre canule."], solutionsTech: ["Décongeler l'unité.", "Vérifier l'axe du sélecteur.", "Contrôler la pression de tête de la cuve mère."] },
                { title: "Fuite ou sifflement après remplissage", causes: ["Valve de remplissage bloquée (givre)", "Joint de valve usé"], solutionsPatient: ["Entendez-vous un sifflement continu ?", "Y a-t-il de la glace sur le connecteur ?", "Ré-enclenchez brièvement le portable sur la cuve pour dégeler la valve."], solutionsTech: ["Sécher les valves à l'air sec.", "Remplacer le joint à lèvres."] }
            ] },
            { id: "cuve-companion-41", name: "Cuve Companion 41L", failures: [
                { title: "Sifflement continu (Soupape de sécurité)", causes: ["Pression interne trop haute (utilisation faible)", "Perte de vide", "Fuite port de remplissage"], solutionsPatient: ["Utilisez-vous l'oxygène tous les jours ? Si non, le sifflement est normal (évaporation).", "Vérifiez s'il y a du givre sur l'embase de remplissage."], solutionsTech: ["Contrôler la pression de service.", "Vérifier le vide du vase Dewar.", "Remplacer le raccord de transfert."] },
                { title: "Fuite au remplissage du portable", causes: ["Joint de l'embase usé", "Valve mâle coincée par le givre"], solutionsPatient: ["Voyez-vous un nuage blanc sortir de l'embase après le remplissage ?", "Essuyez bien les connecteurs avant chaque remplissage."], solutionsTech: ["Remplacer le joint à lèvres de l'embase.", "Vérifier le ressort de rappel de la valve."] }
            ] },
            { id: "cuve-companion-45", name: "Cuve Companion 45L", failures: [
                { title: "Sifflement continu (Soupape de sécurité)", causes: ["Pression interne trop haute (utilisation faible)", "Perte de vide", "Fuite port de remplissage"], solutionsPatient: ["Utilisez-vous l'oxygène tous les jours ? Si non, le sifflement est normal (évaporation).", "Vérifiez s'il y a du givre sur l'embase de remplissage."], solutionsTech: ["Contrôler la pression de service.", "Vérifier le vide du vase Dewar.", "Remplacer le raccord de transfert."] },
                { title: "Fuite au remplissage du portable", causes: ["Joint de l'embase usé", "Valve mâle coincée par le givre"], solutionsPatient: ["Voyez-vous un nuage blanc sortir de l'embase après le remplissage ?", "Essuyez bien les connecteurs avant chaque remplissage."], solutionsTech: ["Remplacer le joint à lèvres de l'embase.", "Vérifier le ressort de rappel de la valve."] }
            ] },
            { id: "cuve-freelox-32", name: "Cuve Freelox 32L", failures: [
                { title: "Sifflement continu (Soupape de sécurité)", causes: ["Pression interne trop haute (utilisation faible)", "Perte de vide", "Fuite port de remplissage"], solutionsPatient: ["Utilisez-vous l'oxygène tous les jours ? Si non, le sifflement est normal (évaporation).", "Vérifiez s'il y a du givre sur l'embase de remplissage."], solutionsTech: ["Contrôler la pression de service.", "Vérifier le vide du vase Dewar.", "Remplacer le raccord de transfert."] },
                { title: "Fuite au remplissage du portable", causes: ["Joint de l'embase usé", "Valve mâle coincée par le givre"], solutionsPatient: ["Voyez-vous un nuage blanc sortir de l'embase après le remplissage ?", "Essuyez bien les connecteurs avant chaque remplissage."], solutionsTech: ["Remplacer le joint à lèvres de l'embase.", "Vérifier le ressort de rappel de la valve."] }
            ] },
            { id: "cuve-freelox-44", name: "Cuve Freelox 44L", failures: [
                { title: "Sifflement continu (Soupape de sécurité)", causes: ["Pression interne trop haute (utilisation faible)", "Perte de vide", "Fuite port de remplissage"], solutionsPatient: ["Utilisez-vous l'oxygène tous les jours ? Si non, le sifflement est normal (évaporation).", "Vérifiez s'il y a du givre sur l'embase de remplissage."], solutionsTech: ["Contrôler la pression de service.", "Vérifier le vide du vase Dewar.", "Remplacer le raccord de transfert."] },
                { title: "Fuite au remplissage du portable", causes: ["Joint de l'embase usé", "Valve mâle coincée par le givre"], solutionsPatient: ["Voyez-vous un nuage blanc sortir de l'embase après le remplissage ?", "Essuyez bien les connecteurs avant chaque remplissage."], solutionsTech: ["Remplacer le joint à lèvres de l'embase.", "Vérifier le ressort de rappel de la valve."] }
          ] }
            ] 
          },
          {
            id: "o2-liquide",
            name: "O₂ Liquide",
            models: [
              { id: "companion-1000", name: "Companion 1000", failures: [
                  { title: "Pas de débit d'oxygène", causes: ["Valve de sortie gelée", "Sélecteur de débit cassé", "Canule obstruée", "Réservoir vide"], solutionsPatient: ["Vérifiez le niveau sur l'indicateur.", "Sentez-vous l'air sortir ?", "Laissez l'appareil se réchauffer si présence de givre blanc.", "Essayez une autre canule."], solutionsTech: ["Décongeler l'unité.", "Vérifier l'axe du sélecteur.", "Contrôler la pression de tête de la cuve mère."] },
                  { title: "Fuite ou sifflement après remplissage", causes: ["Valve de remplissage bloquée (givre)", "Joint de valve usé"], solutionsPatient: ["Entendez-vous un sifflement continu ?", "Y a-t-il de la glace sur le connecteur ?", "Ré-enclenchez brièvement le portable sur la cuve pour dégeler la valve."], solutionsTech: ["Sécher les valves à l'air sec.", "Remplacer le joint à lèvres."] },
                  { title: "Indicateur de niveau HS", causes: ["Pile 9V morte", "Capteur de pression HS", "Flotteur bloqué par la glace"], solutionsPatient: ["L'écran reste noir ?", "Appuyez bien au centre du bouton.", "Secouez doucement l'appareil pour libérer le flotteur."], solutionsTech: ["Remplacer la pile 9V.", "Calibrer les potentiomètres de niveau."] }
              ] },
              { id: "companion-500", name: "Companion 500", failures: [
                  { title: "Pas de débit d'oxygène", causes: ["Valve de sortie gelée", "Sélecteur de débit cassé", "Réservoir vide"], solutionsPatient: ["Vérifiez le niveau.", "Laissez réchauffer l'unité.", "Vérifiez que le sélecteur n'est pas entre deux positions."], solutionsTech: ["Décongélation.", "Vérifier le limiteur de débit."] },
                  { title: "Fuite de liquide au remplissage", causes: ["Joint de valve usé", "Mauvais alignement"], solutionsPatient: ["Vérifiez que le portable est bien vertical lors du remplissage.", "Nettoyez les connecteurs avant usage."], solutionsTech: ["Remplacer le joint à lèvres.", "Vérifier la valve mâle."] }
              ] },
              { id: "sprint", name: "Companion Sprint", failures: [
                  { title: "Givre excessif sur le boîtier", causes: ["Utilisation à fort débit", "Humidité ambiante élevée", "Fuite interne"], solutionsPatient: ["Essuyez le boîtier avec un chiffon sec.", "Laissez l'appareil au repos 1 heure.", "Éloignez l'appareil d'une source d'humidité."], solutionsTech: ["Vérifier l'isolation du vase Dewar.", "Contrôler l'étanchéité des raccords internes."] },
                  { title: "Le bouton de remplissage ne s'enclenche pas", causes: ["Mécanisme gelé", "Ressort de rappel cassé"], solutionsPatient: ["Attendez que le givre fonde.", "Actionnez le levier plusieurs fois à vide."], solutionsTech: ["Lubrification cryogénique du mécanisme.", "Remplacer le bloc de remplissage."] }
              ] },
              { id: "stroller", name: "Companion Stroller", failures: [
                  { title: "Faible autonomie", causes: ["Remplissage incomplet", "Perte de vide (vase Dewar)", "Fuite soupape"], solutionsPatient: ["Remplissez-vous bien jusqu'au 'crachement' de vapeur ?", "L'appareil est-il très froid à l'extérieur (hors zone de givre) ?"], solutionsTech: ["Vérifier le vide interne.", "Contrôler le tarage de la soupape de sécurité."] }
              ] },
              { id: "freelox", name: "Freelox (0.5L / 1.2L)", failures: [
                  { title: "Pas de débit", causes: ["Valve de sortie gelée", "Canule pliée", "Sélecteur cassé"], solutionsPatient: ["Sentez-vous de l'air ?", "Voyez-vous du givre sur le haut ?", "Vérifiez la canule."], solutionsTech: ["Décongélation.", "Vérifier l'axe du bouton."] },
                  { title: "Indicateur de niveau bloqué", causes: ["Givre interne", "Défaut mécanique"], solutionsPatient: ["Secouez légèrement pour débloquer.", "Attendez la fin du givre après remplissage."], solutionsTech: ["Nettoyage interne.", "Remplacer l'indicateur."] }
              ] },
              { id: "helios-h300", name: "Helios H300", failures: [
                  { title: "Pas de débit d'oxygène", causes: ["Valve de sortie gelée", "Sélecteur de débit cassé", "Réservoir vide"], solutionsPatient: ["Vérifiez le niveau.", "Sentez-vous l'air ?", "Laissez réchauffer."], solutionsTech: ["Décongeler l'unité.", "Vérifier l'axe du sélecteur."] },
                  { title: "Difficulté de désaccouplement", causes: ["Givre sur les valves de remplissage"], solutionsPatient: ["Ne forcez jamais.", "Attendez que la glace fonde naturellement.", "Ré-enclenchez pour réchauffer la valve."], solutionsTech: ["Sécher les valves à l'air sec."] },
                  { title: "Indicateur HS", causes: ["Pile morte", "Flotteur bloqué"], solutionsPatient: ["Appuyez sur le bouton bleu.", "Secouez doucement."], solutionsTech: ["Remplacer la pile.", "Calibration."] }
              ] },
              { id: "helios-marathon", name: "Helios Marathon 850", failures: [
                  { title: "Sifflement après remplissage", causes: ["Valve de remplissage restée ouverte", "Joint givré"], solutionsPatient: ["Ré-enclenchez le portable sur la cuve 2 secondes.", "Vérifiez si du givre bloque le connecteur."], solutionsTech: ["Remplacer le joint.", "Nettoyer les valves."] }
              ] },
              { id: "cuve-companion", name: "Cuves Companion (41L / 45L)", failures: [
                  { title: "Sifflement continu (Soupape)", causes: ["Évaporation normale", "Pression trop haute", "Perte de vide"], solutionsPatient: ["Utilisez-vous l'appareil tous les jours ? Si non, c'est normal.", "Le sifflement s'arrête-t-il quand vous utilisez l'oxygène ?"], solutionsTech: ["Contrôler la pression de service.", "Vérifier le vide du vase Dewar."] },
                  { title: "Fuite d'oxygène à l'embase", causes: ["Joint d'embase usé", "Givre sur le connecteur"], solutionsPatient: ["Essuyez bien l'embase avant de remplir le portable.", "Voyez-vous un nuage blanc sortir de la cuve sans le portable ?"], solutionsTech: ["Remplacer le joint à lèvres de l'embase.", "Vérifier la valve de transfert."] }
              ] },
              { id: "cuve-freelox", name: "Cuves Freelox (32L / 44L)", failures: [
                  { title: "Fuite vapeur embase", causes: ["Valve coincée", "Joint usé"], solutionsPatient: ["Le portable est-il bien retiré ?", "Vérifiez la propreté de l'embase."], solutionsTech: ["Remplacer le joint.", "Vérifier le ressort de rappel."] }
              ] }
            ]
          }
        ]
      }
    ]

// Styles déplacés à l'extérieur pour éviter la recréation à chaque rendu
const containerStyle = {
  maxWidth: "1000px",
  margin: "0 auto",
  padding: "20px",
  fontFamily: "Arial, sans-serif",
  color: "#0f172a",
},

const headerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "40px",
  paddingBottom: "20px",
  borderBottom: "1px solid #e2e8f0"
},

const cardGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  gap: "20px",
},

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
},

const breadcrumbStyle = {
  display: "flex",
  gap: "8px",
  alignItems: "center",
  fontSize: "14px",
  color: "#64748b",
  marginBottom: "30px",
  fontWeight: 500
},

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
const typesWithBrandsStep = ['vni', 'aspiration'];

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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Navigation handlers
  const goHome = () => navigate("/");
  const resetType = () => { setView('library'); setSelectedType(null); setSelectedBrand(null); setSelectedModel(null); setSelectedFailure(null); setCurrentStep(0); setShowTech(false); };
  const resetBrand = () => { setView('library'); setSelectedBrand(null); setSelectedModel(null); setSelectedFailure(null); setCurrentStep(0); setShowTech(false); };
  const resetModel = () => { setView('library'); setSelectedModel(null); setSelectedFailure(null); setCurrentStep(0); setShowTech(false); };
  const resetToModel = () => { setView('library'); setSelectedFailure(null); setCurrentStep(0); setShowTech(false); };

  // Gestion de la recherche
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length < 2 || view === 'history') {
      setSearchResults([]);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const results = [];

    const traverse = (items, path = "") => {
      items.forEach(item => {
        const currentPath = path ? `${path} > ${item.name}` : item.name;
        // Recherche dans les modèles directs
        if (item.models) {
          item.models.forEach(m => {
            if (m.name.toLowerCase().includes(lowerQuery)) {
              results.push({ model: m, type: item, path: `${currentPath} > ${m.name}` });
            }
          });
        }
        // Recherche dans les marques
        if (item.brands) {
          item.brands.forEach(b => {
            if (b.models) b.models.forEach(m => {
              if (m.name.toLowerCase().includes(lowerQuery)) results.push({ model: m, type: item, brand: b, path: `${currentPath} > ${b.name} > ${m.name}` });
            });
          });
        }
        if (item.subTypes) traverse(item.subTypes, currentPath);
      });
    };
    traverse(data);
    setSearchResults(results);
  };

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
      const causeInput = prompt("Cause(s) probable(s) (séparées par ';' ou ',') :");
      const solPInput = prompt("Solutions Patient (séparées par ';' ou ',') :");
      const solTInput = prompt("Solutions Tech (séparées par ';' ou ',') :");
      
      const newFailure = {
        title,
        causes: causeInput ? causeInput.split(/[;,]/).map(c => c.trim()) : [],
        solutionsPatient: solPInput ? solPInput.split(/[;,]/).map(s => s.trim()) : [],
        solutionsTech: solTInput ? solTInput.split(/[;,]/).map(s => s.trim()) : []
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
          {/* Barre de recherche intégrée */}
          <div style={{ flexGrow: 1, margin: "0 20px 0 40px" }}>
            <input 
              type="search" 
              placeholder="Rechercher un appareil, une marque..." 
              style={{ width: "100%", padding: "10px 15px", fontSize: "15px", borderRadius: "8px", border: "1px solid #e2e8f0", backgroundColor: "white" }}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
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
            {searchQuery.length > 1 ? (
              <>
                <h2 style={{ marginBottom: "20px", fontSize: "24px" }}>Résultats pour "{searchQuery}"</h2>
                <div style={cardGridStyle}>
                  {searchResults.map((result, idx) => (
                    <SelectionCard 
                      key={idx} 
                      label={result.model.name} 
                      onClick={() => {
                        setSelectedType(result.type);
                        if (result.brand) setSelectedBrand(result.brand);
                        setSelectedModel(result.model);
                        setSearchQuery("");
                      }} 
                    />
                  ))}
                  {searchResults.length === 0 && <p>Aucun appareil trouvé.</p>}
                </div>
              </>
            ) : !selectedType && (
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
                        onClick={() => (item.subTypes || item.models) ? setSelectedType(item) : setSelectedModel(item)}
                        onDelete={() => removeItem('model', item.id)}
                      />
                    ))}
                    {(selectedType.models || selectedType.subTypes || selectedType.brands?.flatMap(b => b.models) || []).length === 0 && <p>Aucun modèle ou catégorie répertorié pour ce type d'équipement.</p>}
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

            const failureIndex = selectedModel.failures.indexOf(selectedFailure);
            const hasPrev = failureIndex > 0;
            const hasNext = failureIndex < selectedModel.failures.length - 1;

            return (
              <div style={{ animation: "fadeIn 0.3s ease-in" }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '2px solid #0284c7', paddingBottom: '8px' }}>
                  <h2 style={{ margin: 0, fontSize: "24px" }}>
                    Guide : {selectedFailure.title}
                  </h2>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      disabled={!hasPrev}
                      onClick={() => handleSelectFailure(selectedModel.failures[failureIndex - 1])}
                      style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", background: hasPrev ? "white" : "#f8fafc", cursor: hasPrev ? "pointer" : "not-allowed", opacity: hasPrev ? 1 : 0.5, fontWeight: 600 }}
                      title="Problème précédent"
                    >
                      ←
                    </button>
                    <button 
                      disabled={!hasNext}
                      onClick={() => handleSelectFailure(selectedModel.failures[failureIndex + 1])}
                      style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", background: hasNext ? "white" : "#f8fafc", cursor: hasNext ? "pointer" : "not-allowed", opacity: hasNext ? 1 : 0.5, fontWeight: 600 }}
                      title="Problème suivant"
                    >
                      →
                    </button>
                  </div>
                </div>

                <div style={{...guideBoxStyle, margin: '0 auto'}}>
                  <div style={{marginBottom: '32px', background: '#eff6ff', padding: '20px', borderRadius: '12px', border: '1px solid #93c5fd', textAlign: 'left'}}>
                      <h3 style={{marginTop: 0, color: '#1e40af'}}>Avant de commencer : Diagnostic</h3>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "20px", marginTop: "16px", textAlign: 'left' }}>
                          <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "8px", border: '1px solid #e2e8f0' }}>
                            <strong style={{ color: "#1e40af", display: "block", marginBottom: "12px", borderBottom: '1px solid #cbd5e1', paddingBottom: '4px' }}>📋 Causes probables</strong>
                            <div style={{ color: "#334155", fontSize: '15px' }}>
                              <ul style={{ margin: 0, paddingLeft: "20px", textAlign: 'left' }}>
                                {(
                                  Array.isArray(selectedFailure.causes) ? selectedFailure.causes :
                                  Array.isArray(selectedFailure.cause) ? selectedFailure.cause :
                                  typeof (selectedFailure.causes || selectedFailure.cause) === 'string' 
                                    ? (selectedFailure.causes || selectedFailure.cause).split(/[;,]/).map(s => s.trim())
                                    : [selectedFailure.cause || selectedFailure.causes || "Non spécifiée"]
                                ).map((c, i) => (
                                  <li key={i} style={{ marginBottom: '6px' }}>{c}</li>
                                ))}
                              </ul>
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

                          <div style={{ background: "#fff", padding: "16px", borderRadius: "8px", border: '1px solid #e2e8f0' }}>
                            <strong style={{ color: "#166534", display: "block", marginBottom: "12px", borderBottom: '1px solid #cbd5e1', paddingBottom: '4px' }}>🚀 Guide de résolution</strong>
                            
                            {isPatientStep && (
                              <div style={{ animation: "fadeIn 0.3s ease" }}>
                                <div style={{ color: "#64748b", fontSize: "12px", fontWeight: 600, textTransform: 'uppercase' }}>Étape Patient {currentStep + 1} / {totalPatientSteps}</div>
                                <p style={{...guideStepInstructionStyle, fontSize: '17px', margin: '12px 0'}}>{patientSteps[currentStep]}</p>
                                <div style={{...guideActionsStyle, gap: '10px'}}>
                                  <button style={{...baseGuideButtonStyle, background: "#22c55e", color: "white", padding: '8px 16px'}} onClick={() => logIntervention('Succès')}>✅ Résolu</button>
                                  {!isLastPatientStep ? (
                                    <button style={{...baseGuideButtonStyle, background: "#f1f5f9", color: "#334155", padding: '8px 16px'}} onClick={nextStep}>Suivant</button>
                                  ) : (
                                    <button style={{...baseGuideButtonStyle, background: "#fecaca", color: "#991b1b", padding: '8px 16px'}} onClick={nextStep}>
                                      {techSteps.length > 0 ? "🛠️ Technicien" : "❌ Échec"}
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}

                            {isTechTransition && (
                              <div style={{ textAlign: 'center', animation: "fadeIn 0.3s ease" }}>
                                <p style={{ color: "#b45309", fontWeight: 600, fontSize: '16px' }}>⚠️ Solutions patient épuisées.</p>
                                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>Voulez-vous passer aux étapes de maintenance technique ?</p>
                                <button style={{...baseGuideButtonStyle, background: "#f59e0b", color: "white"}} onClick={() => setShowTech(true)}>🛠️ Passer en mode Technicien</button>
                              </div>
                            )}

                            {isTechStep && (
                              <div style={{ animation: "fadeIn 0.3s ease" }}>
                                <div style={{ color: "#d97706", fontSize: "12px", fontWeight: 600, textTransform: 'uppercase' }}>🔧 Action Technicien {currentStep - totalPatientSteps + 1} / {techSteps.length}</div>
                                <p style={{...guideStepInstructionStyle, fontSize: '17px', margin: '12px 0'}}>{techSteps[currentStep - totalPatientSteps]}</p>
                                <div style={{...guideActionsStyle, gap: '10px'}}>
                                  <button style={{...baseGuideButtonStyle, background: "#22c55e", color: "white", padding: '8px 16px'}} onClick={() => logIntervention('Succès')}>✅ Corrigé</button>
                                  <button style={{...baseGuideButtonStyle, background: "#f1f5f9", color: "#334155", padding: '8px 16px'}} onClick={nextStep}>Suivant</button>
                                </div>
                              </div>
                            )}

                            {isEndOfGuide && (
                              <div style={{ textAlign: 'center', animation: "fadeIn 0.3s ease" }}>
                                <p style={{...guideStepInstructionStyle, color: "#991b1b", fontSize: '18px'}}>❌ Échec de la résolution</p>
                                <p style={{ color: "#475569", fontSize: '14px', marginBottom: '20px' }}>Toutes les solutions ont été tentées. Contactez le support niveau 2.</p>
                                <button style={{...baseGuideButtonStyle, background: "#64748b", color: "white"}} onClick={() => logIntervention('Échec')}>Terminer l'intervention</button>
                              </div>
                            )}
                          </div>
                      </div>
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  </div>
  );
}