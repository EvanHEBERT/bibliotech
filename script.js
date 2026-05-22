// --- DONNÉES ---
let LIBRARY_DATA = [
      {
        id: "aerosol",
        name: "Aérosol",
        models: [
          { id: "airforce-max", name: "Airforce Max", failures: [
              { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Cordon secteur déconnecté", "Prise murale défectueuse", "Fusible interne grillé"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Si vous essayez sur une autre prise, est-ce que ça marche ?", "Le bouton est-il bien sur la position 'I' (Marche) ?"], solutionsTech: ["Tester la continuité du cordon.", "Vérifier l'interrupteur.", "Contrôler la carte électronique."] },
              { title: "Débit faible ou irrégulier", causes: ["Kit bouché", "Filtre sale", "Compresseur"], solutionsPatient: ["Avez-vous nettoyé la petite buse du kit ?", "Est-ce que le tuyau est plié ou écrasé ?", "Le filtre à air est-il propre ?"], solutionsTech: ["Vérifier la pression de sortie.", "Remplacer le kit piston/membrane.", "Vérifier les fuites internes."] }
          , { title: "Problème de bruit excessif", causes: ["Moteur usé", "Filtre mal inséré", "Corps étranger dans la turbine"], solutionsPatient: ["Vérifier que le filtre est bien en place.", "S'assurer que l'appareil est sur une surface stable."], solutionsTech: ["Nettoyer/remplacer la turbine.", "Vérifier les silentblocs."] }
          , { title: "Surchauffe de l'appareil", causes: ["Aérations obstruées", "Utilisation prolongée", "Filtre encrassé"], solutionsPatient: ["Dégager les aérations de l'appareil.", "Laisser refroidir l'appareil avant de le réutiliser."], solutionsTech: ["Nettoyer les conduits d'air internes.", "Vérifier le fonctionnement du ventilateur."] }
          , { title: "Tuyau se déconnecte fréquemment", causes: ["Buse du kit obstruée", "Tuyau usé ou distendu", "Pression sortie trop élevée"], solutionsPatient: ["Nettoyez la buse centrale du kit", "Vérifiez si le raccord du tuyau est gras", "Essayez un tuyau neuf"], solutionsTech: ["Vérifier la pression de service.", "Remplacer le raccord de sortie."] }
          , { title: "Odeur de brûlé / Surchauffe", causes: ["Filtre à air obstrué", "Moteur fatigué", "Poussière interne"], solutionsPatient: ["Éteindre immédiatement l'appareil", "Remplacer le filtre à air si gris/noir", "Dégager les entrées d'air"], solutionsTech: ["Nettoyage interne.", "Contrôler la consommation moteur.", "Vérifier le ventilateur."] }
          ] },
          { id: "innospire-elegance", name: "Innospire Elegance", failures: [
               { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Cordon secteur déconnecté", "Prise murale défectueuse", "Interrupteur défaillant"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Si vous essayez sur une autre prise, est-ce que ça marche ?", "Le bouton est-il bien sur la position 'I' (Marche) ?"], solutionsTech: ["Tester la continuité du cordon.", "Vérifier l'interrupteur.", "Contrôler la carte électronique."] },
              { title: "Débit faible ou irrégulier", causes: ["Kit bouché", "Filtre sale", "Compresseur"], solutionsPatient: ["Avez-vous nettoyé la petite buse du kit ?", "Est-ce que le tuyau est plié ou écrasé ?", "Le filtre à air est-il propre ?"], solutionsTech: ["Vérifier la pression de sortie.", "Remplacer le kit piston/membrane."] }
          , { title: "Fuite d'air au niveau du kit", causes: ["Kit mal assemblé", "Joint usé", "Fissure dans le kit"], solutionsPatient: ["Réassembler correctement le kit.", "Vérifier l'état des joints du kit."], solutionsTech: ["Remplacer le kit de nébulisation.", "Vérifier la pression de sortie de l'appareil."] }
          , { title: "Vibrations excessives / Bruit de choc", causes: ["Pieds caoutchouc usés", "Surface instable", "Fixation interne desserrée"], solutionsPatient: ["Placer sur une surface plane et solide", "Vérifier les 4 pieds sous l'appareil"], solutionsTech: ["Resserrer les fixations compresseur.", "Remplacer les silentblocs."] }
          , { title: "Arrêt intermittent", causes: ["Surchauffe moteur", "Faux contact cordon", "Interrupteur HS"], solutionsPatient: ["Laisser refroidir 30 min", "Vérifier le branchement mural", "Ne pas utiliser de multiprise"], solutionsTech: ["Tester le cordon.", "Vérifier la sécurité thermique.", "Remplacer l'interrupteur."] }
          , { title: "Raccord de sortie cassé", causes: ["Choc", "Usure branchements"], solutionsPatient: ["Vérifier si le tuyau tient", "Ne pas forcer le branchement"], solutionsTech: ["Remplacer l'embase de sortie."] }
          ] },
          { id: "innospire-mini", name: "Innospire Mini", failures: [
              { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Batterie déchargée", "Chargeur défectueux", "Carte mère HS"], solutionsPatient: ["Le chargeur est-il bien branché ?", "Le voyant de charge s'allume-t-il ?", "Est-ce que vous êtes dehors avec l'appareil ?"], solutionsTech: ["Tester avec un autre chargeur.", "Remplacer la batterie.", "Remplacer la carte électronique."] },
              { title: "Débit faible ou irrégulier", causes: ["Kit bouché", "Filtre sale", "Compresseur"], solutionsPatient: ["Avez-vous nettoyé la petite buse du kit ?", "Le filtre à air est-il propre ?"], solutionsTech: ["Vérifier la pression de sortie.", "Remplacer le compresseur."] }
          , { title: "Voyant de charge ne s'allume pas", causes: ["Chargeur défectueux", "Port de charge endommagé", "Batterie HS"], solutionsPatient: ["Tester avec un autre chargeur.", "Vérifier que le port de charge n'est pas obstrué."], solutionsTech: ["Remplacer le chargeur.", "Vérifier la carte de charge."] }
          , { title: "Batterie faible autonomie / Gonflée", causes: ["Cellules Lithium usées", "Chaleur excessive", "Défaut de charge"], solutionsPatient: ["Utiliser sur secteur", "Retirer la batterie si déformée", "Ne pas charger au soleil"], solutionsTech: ["Remplacer la batterie.", "Vérifier tension chargeur."] }
          , { title: "Sifflement aigu", causes: ["Fuite kit nébuliseur", "Tuyau micro-percé", "Filtre mal inséré"], solutionsPatient: ["Réassembler le kit fermement", "Vérifier l'état du tuyau", "Vérifier le filtre à air"], solutionsTech: ["Test étanchéité interne.", "Vérifier clapet compresseur."] }
          , { title: "Nébulisation trop lente", causes: ["Kit entartré/usé", "Débit compresseur faible", "Filtre colmaté"], solutionsPatient: ["Changer le kit nébuliseur", "Nettoyer filtre à air", "Utiliser du sérum physiologique frais"], solutionsTech: ["Mesurer le débit air libre.", "Vérifier pression compresseur."] }
          ] },
          { id: "inspiration-elite", name: "Inspiration Elite", failures: [
              { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Alimentation", "Fusible", "Interrupteur"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Si vous essayez sur une autre prise, est-ce que ça marche ?", "Le bouton est-il bien sur la position 'I' (Marche) ?"], solutionsTech: ["Tester la continuité du cordon.", "Vérifier l'interrupteur.", "Contrôler la carte électronique."] },
              { title: "Débit faible ou irrégulier", causes: ["Kit bouché", "Filtre sale", "Compresseur"], solutionsPatient: ["Avez-vous nettoyé la petite buse du kit ?", "Est-ce que le tuyau est plié ou écrasé ?", "Le filtre à air est-il propre ?"], solutionsTech: ["Vérifier la pression de sortie.", "Remplacer le kit piston/membrane."] },
              { title: "Bruit de frottement interne", causes: ["Coussinets moteur usés", "Ventilateur touchant le boîtier"], solutionsPatient: ["Vérifier si l'appareil a subi un choc", "S'assurer qu'aucun objet n'est entré dedans"], solutionsTech: ["Ouvrir et inspecter la mécanique.", "Remplacer roulements."] },
              { title: "Fuite d'air au raccord tuyau", causes: ["Joint interne usé", "Raccord fissuré"], solutionsPatient: ["Vérifier l'extrémité du tuyau", "Enfoncer le tuyau fermement"], solutionsTech: ["Remplacer le raccord sortie.", "Vérifier tubes internes."] },
              { title: "Surchauffe rapide du boîtier", causes: ["Entrées air bouchées", "Filtre interne colmaté"], solutionsPatient: ["Dégager l'espace autour de l'appareil", "Changer le filtre à air"], solutionsTech: ["Nettoyage circuit aération.", "Vérifier ventilateur."] },
              { title: "Tuyau qui saute de l'appareil", causes: ["Pression excessive (kit bouché)", "Extrémité tuyau lâche"], solutionsPatient: ["Nettoyer la buse du kit", "Couper 1cm du bout du tuyau", "Tester un nouveau tuyau"], solutionsTech: ["Mesurer pression maximale."] }
          ] },
          { id: "pariboy-pro", name: "PariBoy Pro", failures: [
              { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Alimentation", "Cordon", "Interrupteur"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Si vous essayez sur une autre prise, est-ce que ça marche ?", "Le bouton est-il bien sur la position 'I' (Marche) ?"], solutionsTech: ["Tester le cordon d'alimentation.", "Vérifier l'interrupteur.", "Remplacer la carte électronique."] },
              { title: "Débit faible ou irrégulier", causes: ["Kit bouché", "Filtre sale", "Compresseur"], solutionsPatient: ["Avez-vous nettoyé la petite buse du kit ?", "Est-ce que le tuyau est plié ou écrasé ?", "Le filtre à air est-il propre ?"], solutionsTech: ["Mesurer la pression de service.", "Remplacer le compresseur."] },
              { title: "Bruit anormal / Claquement", causes: ["Moteur desserré", "Segment piston usé"], solutionsPatient: ["Vérifier que rien ne vibre contre l'appareil"], solutionsTech: ["Resserrer berceau moteur.", "Maintenance compresseur."] },
              { title: "Fuite air interne (Sifflement)", causes: ["Tuyau interne débranché", "Joint culasse HS"], solutionsPatient: ["Appareil semble moins puissant", "Sifflement venant de l'intérieur"], solutionsTech: ["Réparation pneumatique interne."] },
              { title: "Interrupteur bloqué", causes: ["Résidus de médicaments", "Ressort cassé"], solutionsPatient: ["Nettoyer le bouton au sec"], solutionsTech: ["Remplacer interrupteur."] },
              { title: "Pas de brouillard / Buse bouchée", causes: ["Orifice buse obstrué", "Filtre mouillé"], solutionsPatient: ["Déboucher la buse du kit", "Sécher ou changer le filtre"], solutionsTech: ["Vérifier débit (min 3.5L/min)."] }
          ] },
          { id: "pariboy-sx", name: "PariBoy SX", failures: [
              { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Alimentation", "Cordon", "Interrupteur"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Si vous essayez sur une autre prise, est-ce que ça marche ?", "Le bouton est-il bien sur la position 'I' (Marche) ?"], solutionsTech: ["Tester le cordon d'alimentation.", "Vérifier l'interrupteur.", "Remplacer la carte électronique."] },
              { title: "Débit faible ou irrégulier", causes: ["Kit bouché", "Filtre sale", "Compresseur"], solutionsPatient: ["Avez-vous nettoyé la petite buse du kit ?", "Est-ce que le tuyau est plié ou écrasé ?", "Le filtre à air est-il propre ?"], solutionsTech: ["Mesurer la pression de service.", "Remplacer le compresseur."] },
              { title: "Vibrations fortes", causes: ["Amortisseurs moteur usés", "Axe moteur voilé"], solutionsPatient: ["Poser sur un support stable", "Vérifier les pieds"], solutionsTech: ["Remplacer silentblocs."] },
              { title: "Débit saccadé", causes: ["Membrane compresseur usée", "Clapets fatigués"], solutionsPatient: ["Vérifier si le bruit change", "Vérifier le filtre"], solutionsTech: ["Révision tête compresseur."] },
              { title: "Odeur de chaud", causes: ["Moteur surchauffe", "Ventilation interne obstruée"], solutionsPatient: ["Vérifier le dessous de l'appareil", "Changer le filtre"], solutionsTech: ["Contrôler température moteur."] },
              { title: "Manque de puissance / Ronflement", causes: ["Condensateur HS", "Usure mécanique"], solutionsPatient: ["Moteur peine à démarrer ?", "Ronflement sans air ?"], solutionsTech: ["Changer condensateur."] }
          ] }
        ]
      },
      { 
        id: "aspirateur",
        name: "Aspirateurs",
        models: [
          { id: "aidal", name: "AIDAL", failures: [
              { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Appareil noyé", "Alimentation", "Fusible", "Interrupteur"], solutionsPatient: ["Quand vous appuyez sur Marche, est-ce qu'il se passe quelque chose (bruit, lumière) ?", "Est-ce qu'il est tombé ou a aspiré du liquide récemment ?"], solutionsTech: ["Vérifier l'absence de liquide dans le compartiment moteur (appareil noyé).", "Tester le cordon.", "Vérifier l'interrupteur et le fusible.", "Remplacer la carte."] },
              { title: "Débit faible ou irrégulier", causes: ["Appareil noyé", "Bocal", "Filtre", "Tuyau", "Réglage"], solutionsPatient: ["Sur votre machine il y a un manomètre, est-ce que l'aiguille va sur la gauche ?", "Quand la machine tourne, est-ce que vous entendez de l'air s'échapper (un pshhhh) ?", "Est-ce que le petit filtre est devenu gris ou sale ?"], solutionsTech: ["Vérifier l'absence de liquide dans le compartiment moteur (appareil noyé).", "Tester la pompe.", "Vérifier les fuites internes."] }
          , { title: "Bruit anormal ou vibrations", causes: ["Vibrations pompe", "Fixations desserrées"], solutionsPatient: ["Poser l'appareil sur une surface stable."], solutionsTech: ["Vérifier les silentblocs.", "Remplacer la pompe."] }
          ] },
          { id: "clario-medela", name: "Clario Medela", failures: [
              { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Appareil noyé", "Batterie", "Alimentation", "Fusible"], solutionsPatient: ["Quand vous le branchez, est-ce qu'une petite lumière s'allume ?", "Ça fait longtemps qu'il n'a pas servi ?"], solutionsTech: ["Vérifier l'absence de liquide dans le compartiment moteur (appareil noyé).", "Tester le chargeur.", "Remplacer la batterie.", "Vérifier fusible et carte."] },
              { 
                title: "Débit faible ou irrégulier", 
                causes: ["Appareil noyé", "Bocal mal fermé", "Filtre saturé", "Tuyau", "Réglage"], 
                solutionsPatient: ["Sur votre machine il y a un manomètre, est-ce que l'aiguille va sur la gauche ?", "Quand la machine tourne, est-ce que vous entendez de l'air s'échapper (un pshhhh) ?", "Est-ce que le petit filtre est devenu gris ou sale ?"], 
                solutionsTech: ["Vérifier l'absence de liquide dans le compartiment moteur (appareil noyé).", "Tester l'étanchéité du circuit interne.", "Mesurer la dépression max.", "Remplacer la pompe."],
              },
              { title: "Problème de batterie ou autonomie", causes: ["Batterie usée", "Chargeur", "Connectique"], solutionsPatient: ["Vérifier le branchement du chargeur.", "Laisser charger 2h minimum.", "Nettoyer les contacts de charge.", "Est-ce que vous êtes dehors avec l'appareil ?"], solutionsTech: ["Tester avec un autre chargeur.", "Remplacer la batterie."] }
          ] },
          { id: "aidal-v7-ac", name: "V7+ AC", failures: [
              { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Appareil noyé", "Batterie", "Alimentation", "Carte"], solutionsPatient: ["Quand vous le branchez, est-ce qu'une petite lumière s'allume ?", "Ça fait longtemps qu'il n'a pas servi ?"], solutionsTech: ["Vérifier l'absence de liquide dans le compartiment moteur (appareil noyé).", "Tester le chargeur.", "Remplacer la batterie.", "Remplacer la carte électronique."] },
              { title: "Débit faible ou irrégulier", causes: ["Appareil noyé", "Bocal", "Filtre", "Pompe", "Réglage"], solutionsPatient: ["Sur votre machine il y a un manomètre, est-ce que l'aiguille va sur la gauche ?", "Quand la machine tourne, est-ce que vous entendez de l'air s'échapper (un pshhhh) ?", "Est-ce que le petit filtre est devenu gris ou sale ?"], solutionsTech: ["Vérifier l'absence de liquide dans le compartiment moteur (appareil noyé).", "Tester la pompe.", "Vérifier l'étanchéité interne."] }
          ] },
          { id: "aidal-v7-ac-batt", name: "V7+ AC-B", failures: [
              { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Appareil noyé", "Batterie", "Alimentation", "Carte"], solutionsPatient: ["Quand vous le branchez, est-ce qu'une petite lumière s'allume ?", "Ça fait longtemps qu'il n'a pas servi ?"], solutionsTech: ["Vérifier l'absence de liquide dans le compartiment moteur (appareil noyé).", "Tester le chargeur.", "Remplacer la batterie.", "Remplacer la carte électronique."] },
              { title: "Débit faible ou irrégulier", causes: ["Appareil noyé", "Bocal", "Filtre", "Pompe", "Réglage"], solutionsPatient: ["Sur votre machine il y a un manomètre, est-ce que l'aiguille va sur la gauche ?", "Quand la machine tourne, est-ce que vous entendez de l'air s'échapper (un pshhhh) ?", "Est-ce que le petit filtre est devenu gris ou sale ?"], solutionsTech: ["Vérifier l'absence de liquide dans le compartiment moteur (appareil noyé).", "Tester la pompe.", "Vérifier l'étanchéité interne."] },
              { title: "Problème de batterie ou autonomie", causes: ["Batterie usée", "Chargeur", "Connectique"], solutionsPatient: ["Vérifier le branchement du chargeur.", "Laisser charger 2h minimum.", "Nettoyer les contacts de charge.", "Est-ce que vous êtes dehors avec l'appareil ?"], solutionsTech: ["Tester avec un autre chargeur.", "Remplacer la batterie."] }
          ] },
          { id: "vacuaide-7314", name: "Vacu-Aid 7314", failures: [
              { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Appareil noyé", "Batterie", "Alimentation", "Fusible"], solutionsPatient: ["Quand vous le branchez, est-ce qu'une petite lumière s'allume ?", "Ça fait longtemps qu'il n'a pas servi ?"], solutionsTech: ["Vérifier l'absence de liquide dans le compartiment moteur (appareil noyé).", "Tester le chargeur.", "Remplacer la batterie.", "Vérifier fusible et carte."] },
              { title: "Débit faible ou irrégulier", causes: ["Appareil noyé", "Bocal mal fermé", "Filtre saturé", "Tuyau", "Réglage"], solutionsPatient: ["Sur votre machine il y a un manomètre, est-ce qu'l'aiguille va sur la gauche ?", "Quand la machine tourne, est-ce que vous entendez de l'air s'échapper (un pshhhh) ?", "Est-ce que le petit filtre est devenu gris ou sale ?"], solutionsTech: ["Vérifier l'absence de liquide dans le compartiment moteur (appareil noyé).", "Tester l'étanchéité du circuit interne.", "Mesurer la dépression max.", "Remplacer la pompe."] },
              { title: "Bruit anormal ou vibrations", causes: ["Pompe", "Fixations", "Vibrations"], solutionsPatient: ["Poser l'appareil sur une surface stable."], solutionsTech: ["Resserrer les fixations moteur.", "Remplacer la pompe."] },
              { title: "Problème de batterie ou autonomie", causes: ["Batterie usée", "Chargeur", "Connectique"], solutionsPatient: ["Vérifier le branchement du chargeur.", "Laisser charger 2h minimum.", "Nettoyer les contacts de charge.", "Est-ce que vous êtes dehors avec l'appareil ?"], solutionsTech: ["Tester avec un autre chargeur.", "Remplacer la batterie."] }
          ] },
          { id: "vacuaide-7325", name: "Vacu-Aid 7325", failures: [
              { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Appareil noyé", "Batterie", "Alimentation", "Fusible"], solutionsPatient: ["Quand vous le branchez, est-ce qu'une petite lumière s'allume ?", "Ça fait longtemps qu'il n'a pas servi ?"], solutionsTech: ["Vérifier l'absence de liquide dans le compartiment moteur (appareil noyé).", "Tester le chargeur.", "Remplacer la batterie.", "Vérifier fusible et carte."] },
              { title: "Débit faible ou irrégulier", causes: ["Appareil noyé", "Bocal mal fermé", "Filtre saturé", "Tuyau", "Réglage"], solutionsPatient: ["Sur votre machine il y a un manomètre, est-ce qu'l'aiguille va sur la gauche ?", "Quand la machine tourne, est-ce que vous entendez de l'air s'échapper (un pshhhh) ?", "Est-ce que le petit filtre est devenu gris ou sale ?"], solutionsTech: ["Vérifier l'absence de liquide dans le compartiment moteur (appareil noyé).", "Tester l'étanchéité du circuit interne.", "Mesurer la dépression max.", "Remplacer la pompe."] },
              { title: "Bruit anormal ou vibrations", causes: ["Pompe", "Fixations", "Vibrations"], solutionsPatient: ["Si vous posez l'appareil par terre ou sur une table stable, est-ce qu'il fait moins de bruit ?"], solutionsTech: ["Resserrer les fixations moteur.", "Remplacer la pompe."] },
              { title: "Problème de batterie ou autonomie", causes: ["Batterie usée", "Chargeur", "Connectique"], solutionsPatient: ["Vérifier le branchement du chargeur.", "Laisser charger 2h minimum.", "Nettoyer les contacts de charge.", "Est-ce que vous êtes dehors avec l'appareil ?"], solutionsTech: ["Tester avec un autre chargeur.", "Remplacer la batterie."] }
          ] }
        ]
      },
      {
        id: "desencombrement",
        name: "Désencombrement",
        subTypes: [
          { id: "aide-a-la-toux", name: "Aide à la toux", models: [
            { id: "biwaze", name: "BiWaze", failures: [
              { title: "Pression insuffisante ou instable", causes: ["Pressions d'exsufflation trop basses", "Sécrétions trop visqueuses ou sèches", "Fuites massives au masque", "Temps d'inspiration trop court"], solutionsPatient: ["Vérifier que la prise est bien branchée au mur et à l'appareil", "S'assurer que le masque est bien plaqué contre le visage (pas de sifflement)", "Boire davantage d'eau pour fluidifier les glaires", "Bien vider ses poumons avant le début du cycle d'insufflation"], solutionsTech: ["Augmenter progressivement les pressions d'insufflation et d'exsufflation", "Ajuster les temps de cycle (augmenter l'inspiration pour un meilleur volume)", "Vérifier l'étanchéité pneumatique complète du circuit", "Mesurer la pression réelle en sortie de turbine avec un manomètre"] },
              { title: "Mauvaise synchronisation (Trigger)", causes: ["Réglage du trigger inadapté", "Rythme respiratoire irrégulier", "Stress ou anxiété du patient", "Fuite d'air perturbant la détection"], solutionsPatient: ["Vérifier que l'appareil est bien alimenté (prise secteur)", "Essayer de caler son souffle sur le rythme de la machine", "Vérifier que le tuyau n'est pas écrasé ou plié", "Se détendre et respirer calmement par le nez"], solutionsTech: ["Ajuster la sensibilité du trigger inspiratoire et expiratoire", "Passer en mode automatique si le patient peine à déclencher", "Vérifier et mettre à jour le firmware de l'appareil", "Recalibrer les capteurs de débit internes"] },
              { title: "Désaturation pendant l'utilisation", causes: ["Effort respiratoire trop important", "Cycles trop longs ou trop fréquents", "Encombrement bronchique majeur", "Temps de repos insuffisant"], solutionsPatient: ["Vérifier le branchement électrique de la machine", "Faire des pauses plus longues entre chaque série de cycles", "Vérifier si le taux d'oxygène (SpO2) descend sous 90%", "Signaler toute fatigue excessive ou malaise"], solutionsTech: ["Surveillance de la SpO2 en continu pendant la séance", "Allonger les temps de repos programmés entre les cycles", "Réduire le nombre de cycles par série pour limiter l'effort", "Ajouter de l'oxygène dans le circuit si prescrit"] },
              { title: "Fuite importante au circuit ou masque", causes: ["Masque mal ajusté ou taille inadaptée", "Circuit mal connecté à la machine", "Valve expiratoire défaillante ou sale", "Tubulure percée ou fendue"], solutionsPatient: ["Vérifier que le cordon secteur est bien enfoncé", "Resserrer légèrement le harnais du masque", "S'assurer que le tuyau est bien cliqué sur l'appareil", "Nettoyer le silicone du masque avec de l'eau savonneuse"], solutionsTech: ["Changer la taille ou le modèle du masque (test de gabarit)", "Vérifier et nettoyer soigneusement la valve expiratoire", "Remplacer la tubulure si une fuite est détectée par test de pression", "Vérifier l'état des joints de connexion internes"] },
              { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Cordon secteur déconnecté ou abîmé", "Batterie interne vide ou HS", "Bloc d'alimentation HS", "Fusible interne grillé"], solutionsPatient: ["Vérifier que la prise est bien enfoncée au mur et sur le bloc", "Laisser charger l'appareil au moins 2 heures sur secteur"], solutionsTech: ["Tester la tension de sortie du bloc d'alimentation (Multimètre)", "Vérifier et remplacer le fusible interne si nécessaire"] }
            ]},
            { id: "clearway", name: "Clearway", failures: [
              { title: "Pression insuffisante ou instable", causes: ["Pressions d'insufflation/exsufflation trop basses", "Sécrétions trop sèches", "Fuites massives au masque", "Temps d'exsufflation trop court"], solutionsPatient: ["Vérifiez que le masque est bien plaqué (pas de sifflement)", "Avez-vous bu assez d'eau aujourd'hui ?", "Essayez de bien vider vos poumons avant le démarrage"], solutionsTech: ["Augmenter progressivement la pression d'exsufflation", "Ajuster le temps de plateau inspiratoire", "Vérifier l'étanchéité interne du bloc turbine"] },
              { title: "Mauvaise synchronisation (Trigger)", causes: ["Sensibilité du trigger inadaptée", "Stress patient", "Fuite perturbant le capteur"], solutionsPatient: ["Essayez de caler votre respiration sur l'appareil", "Le tuyau est-il bien branché et non plié ?", "Respirez calmement par le nez"], solutionsTech: ["Réglage fin de la sensibilité du trigger inspiratoire", "Passer en mode automatique si nécessaire", "Calibration des capteurs de débit"] },
              { title: "Fuite d'air importante", causes: ["Masque inadapté ou usé", "Harnais trop lâche", "Valve expiratoire mal positionnée"], solutionsPatient: ["L'air passe-t-il près de vos yeux ?", "Resserrer légèrement le harnais", "Nettoyer le silicone du masque"], solutionsTech: ["Changer la taille du masque (test gabarit)", "Vérifier la valve expiratoire", "Contrôler la tubulure"] },
              { title: "Problème d'alimentation / Batterie", causes: ["Cordon secteur mal enfoncé", "Bloc d'alimentation HS", "Fusible interne grillé"], solutionsPatient: ["La prise est-elle bien branchée au mur et à la machine ?", "Y a-t-il une lumière sur le bloc secteur ?"], solutionsTech: ["Tester la tension du bloc alim", "Vérifier le fusible interne", "Contrôler le connecteur d'embase"] }
            ]}
          ] },
          { id: "mixte", name: "Mixte", models: [
            { id: "pegaso", name: "Pegaso A Cough", failures: [
              { title: "Pression insuffisante ou instable", causes: ["Pressions d'insufflation/exsufflation trop basses", "Sécrétions trop visqueuses ou sèches", "Fuites massives au masque", "Mauvaise synchronisation"], solutionsPatient: ["Vérifier que le masque est bien ajusté et qu'il n'y a pas de fuites audibles", "S'assurer d'une bonne hydratation pour fluidifier les sécrétions", "Essayer de bien vider les poumons avant le début du cycle d'insufflation"], solutionsTech: ["Augmenter progressivement les pressions d'insufflation et d'exsufflation", "Ajuster les temps de cycle (inspiration/expiration)", "Vérifier l'étanchéité du circuit patient et du masque", "Recalibrer les capteurs de pression et de débit"] },
              { title: "Mauvaise synchronisation (Trigger)", causes: ["Sensibilité du trigger inadaptée", "Rythme respiratoire irrégulier du patient", "Fuite d'air perturbant la détection"], solutionsPatient: ["Essayer de se détendre et de caler sa respiration sur le rythme de la machine", "Vérifier que le tuyau n'est pas plié ou écrasé", "Signaler si l'appareil démarre trop tôt ou trop tard"], solutionsTech: ["Ajuster la sensibilité du trigger inspiratoire et expiratoire", "Passer en mode automatique si le patient a du mal à déclencher", "Vérifier l'absence de fuite au niveau du masque et du circuit"] },
              { title: "Problème d'alimentation / Batterie", causes: ["Cordon secteur déconnecté ou endommagé", "Batterie interne vide ou défectueuse", "Bloc d'alimentation HS", "Fusible interne grillé"], solutionsPatient: ["Vérifier que la prise est bien branchée au mur et à l'appareil", "S'assurer que le voyant du bloc d'alimentation est allumé", "Laisser l'appareil charger sur secteur pendant au moins 2 heures"], solutionsTech: ["Tester la tension de sortie du bloc d'alimentation", "Vérifier l'état de la batterie interne (test de capacité)", "Contrôler la continuité du câble secteur et du connecteur d'embase"] },
              { title: "Bruit anormal / Baisse de puissance (Turbine)", causes: ["Usure des roulements de la turbine", "Filtres internes encrassés", "Surchauffe moteur", "Obstruction de l'entrée d'air"], solutionsPatient: ["Nettoyer ou remplacer le filtre à air à l'arrière de l'appareil", "S'assurer que rien ne bouche les grilles de ventilation", "Signaler tout bruit inhabituel (sifflement, frottement)"], solutionsTech: ["Vérifier le compteur d'heures de la turbine", "Mesurer les pressions de sortie réelles de l'appareil", "Nettoyer l'intérieur de l'appareil et remplacer les filtres HEPA", "Remplacer le bloc turbine si le bruit de roulement persiste"] }
            ]},
            { id: "clearway-2", name: "Clearway 2", failures: [
              { title: "Toux inefficace (Mobilisation faible)", causes: ["Pressions d'insufflation/exsufflation trop basses", "Sécrétions trop visqueuses ou sèches", "Fuites massives au masque", "Temps d'exsufflation trop court"], solutionsPatient: ["Vérifiez que le masque est bien plaqué (pas de sifflement)", "Avez-vous bu assez d'eau aujourd'hui ?", "Essayez de bien vider vos poumons avant le démarrage"], solutionsTech: ["Augmenter progressivement la pression d'exsufflation", "Ajuster le temps de plateau inspiratoire", "Vérifier l'étanchéité interne du bloc turbine"] },
              { title: "Problème de détection respiratoire (Trigger)", causes: ["Sensibilité du trigger inadaptée", "Stress patient", "Fuite perturbant le capteur"], solutionsPatient: ["Essayez de caler votre respiration sur l'appareil", "Le tuyau est-il bien branché et non plié ?", "Respirez calmement par le nez"], solutionsTech: ["Réglage fin de la sensibilité du trigger inspiratoire", "Passer en mode automatique si nécessaire", "Calibration des capteurs de débit"] },
              { title: "Fuites importantes (Masque ou Circuit)", causes: ["Masque inadapté ou usé", "Harnais trop lâche", "Valve expiratoire mal positionnée"], solutionsPatient: ["L'air passe-t-il près de vos yeux ?", "Resserrer légèrement le harnais", "Nettoyer le silicone du masque"], solutionsTech: ["Changer la taille du masque (test gabarit)", "Vérifier la valve expiratoire", "Contrôler la tubulure"] },
              { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Cordon secteur mal enfoncé", "Bloc d'alimentation HS", "Fusible interne grillé"], solutionsPatient: ["La prise est-elle bien branchée au mur et à la machine ?", "Y a-t-il une lumière sur le bloc secteur ?"], solutionsTech: ["Tester la tension du bloc alim", "Vérifier le fusible interne", "Contrôler le connecteur d'embase"] }
            ]},
            { id: "e70", name: "E70", failures: [
              { title: "Toux inefficace (Mobilisation faible)", causes: ["Pressions d'insufflation/exsufflation trop basses", "Sécrétions trop visqueuses ou sèches", "Fuites massives au masque", "Mauvaise synchronisation"], solutionsPatient: ["Vérifier que le masque est bien ajusté et qu'il n'y a pas de fuites audibles", "S'assurer d'une bonne hydratation pour fluidifier les sécrétions", "Essayer de bien vider les poumons avant le début du cycle d'insufflation"], solutionsTech: ["Augmenter progressivement les pressions d'insufflation et d'exsufflation", "Ajuster les temps de cycle (inspiration/expiration)", "Vérifier l'étanchéité du circuit patient et du masque", "Recalibrer les capteurs de pression et de débit"] },
              { title: "Mauvaise synchronisation (Trigger)", causes: ["Sensibilité du trigger inadaptée", "Rythme respiratoire irrégulier du patient", "Fuite d'air perturbant la détection"], solutionsPatient: ["Essayer de se détendre et de caler sa respiration sur le rythme de la machine", "Vérifier que le tuyau n'est pas plié ou écrasé", "Signaler si l'appareil démarre trop tôt ou trop tard"], solutionsTech: ["Ajuster la sensibilité du trigger inspiratoire et expiratoire", "Passer en mode automatique si le patient a du mal à déclencher", "Vérifier l'absence de fuite au niveau du masque et du circuit"] },
              { title: "Problème d'alimentation / Batterie", causes: ["Cordon secteur déconnecté ou endommagé", "Batterie interne vide ou défectueuse", "Bloc d'alimentation HS", "Fusible interne grillé"], solutionsPatient: ["Vérifier que la prise est bien branchée au mur et à l'appareil", "S'assurer que le voyant du bloc d'alimentation est allumé", "Laisser l'appareil charger sur secteur pendant au moins 2 heures"], solutionsTech: ["Tester la tension de sortie du bloc d'alimentation", "Vérifier l'état de la batterie interne (test de capacité)", "Contrôler la continuité du câble secteur et du connecteur d'embase"] },
              { title: "Bruit anormal / Baisse de puissance (Turbine)", causes: ["Usure des roulements de la turbine", "Filtres internes encrassés", "Surchauffe moteur", "Obstruction de l'entrée d'air"], solutionsPatient: ["Nettoyer ou remplacer le filtre à air à l'arrière de l'appareil", "S'assurer que rien ne bouche les grilles de ventilation", "Signaler tout bruit inhabituel (sifflement, frottement)"], solutionsTech: ["Vérifier le compteur d'heures de la turbine", "Mesurer les pressions de sortie réelles de l'appareil", "Nettoyer l'intérieur de l'appareil et remplacer les filtres HEPA", "Remplacer le bloc turbine si le bruit de roulement persiste"] }
            ]},
            { id: "eo70", name: "Station + Turbine EO-70", failures: [
              { title: "Toux inefficace (Mobilisation faible)", causes: ["Pressions d'insufflation/exsufflation trop basses", "Sécrétions trop visqueuses ou sèches", "Fuites massives au masque", "Mauvaise synchronisation"], solutionsPatient: ["Vérifier que le masque est bien ajusté et qu'il n'y a pas de fuites audibles", "S'assurer d'une bonne hydratation pour fluidifier les sécrétions", "Essayer de bien vider les poumons avant le début du cycle d'insufflation"], solutionsTech: ["Augmenter progressivement les pressions d'insufflation et d'exsufflation", "Ajuster les temps de cycle (inspiration/expiration)", "Vérifier l'étanchéité du circuit patient et du masque", "Recalibrer les capteurs de pression et de débit"] },
              { title: "Mauvaise synchronisation (Trigger)", causes: ["Sensibilité du trigger inadaptée", "Rythme respiratoire irrégulier du patient", "Fuite d'air perturbant la détection"], solutionsPatient: ["Essayer de se détendre et de caler sa respiration sur le rythme de la machine", "Vérifier que le tuyau n'est pas plié ou écrasé", "Signaler si l'appareil démarre trop tôt ou trop tard"], solutionsTech: ["Ajuster la sensibilité du trigger inspiratoire et expiratoire", "Passer en mode automatique si le patient a du mal à déclencher", "Vérifier l'absence de fuite au niveau du masque et du circuit"] },
              { title: "Problème d'alimentation / Batterie", causes: ["Cordon secteur déconnecté ou endommagé", "Batterie interne vide ou défectueuse", "Bloc d'alimentation HS", "Fusible interne grillé"], solutionsPatient: ["Vérifier que la prise est bien branchée au mur et à l'appareil", "S'assurer que le voyant du bloc d'alimentation est allumé", "Laisser l'appareil charger sur secteur pendant au moins 2 heures"], solutionsTech: ["Tester la tension de sortie du bloc d'alimentation", "Vérifier l'état de la batterie interne (test de capacité)", "Contrôler la continuité du câble secteur et du connecteur d'embase"] },
              { title: "Bruit anormal / Baisse de puissance (Turbine)", causes: ["Usure des roulements de la turbine", "Filtres internes encrassés", "Surchauffe moteur", "Obstruction de l'entrée d'air"], solutionsPatient: ["Nettoyer ou remplacer le filtre à air à l'arrière de l'appareil", "S'assurer que rien ne bouche les grilles de ventilation", "Signaler tout bruit inhabituel (sifflement, frottement)"], solutionsTech: ["Vérifier le compteur d'heures de la turbine", "Mesurer les pressions de sortie réelles de l'appareil", "Nettoyer l'intérieur de l'appareil et remplacer les filtres HEPA", "Remplacer le bloc turbine si le bruit de roulement persiste"] }
            ]},
            { id: "comfort-cough", name: "Comfort Cough II", failures: [
              { title: "Toux inefficace (Mobilisation faible)", causes: ["Pressions d'insufflation/exsufflation trop basses", "Sécrétions trop visqueuses ou sèches", "Fuites massives au masque", "Temps d'exsufflation trop court"], solutionsPatient: ["Vérifier que le masque est bien ajusté et qu'il n'y a pas de fuites audibles", "S'assurer d'une bonne hydratation pour fluidifier les sécrétions", "Essayer de bien vider les poumons avant le début du cycle d'insufflation"], solutionsTech: ["Augmenter progressivement les pressions d'insufflation et d'exsufflation", "Ajuster les temps de cycle (inspiration/expiration)", "Vérifier l'étanchéité du circuit patient et du masque", "Recalibrer les capteurs de pression et de débit"] },
              { title: "Problème de détection respiratoire (Trigger)", causes: ["Sensibilité du trigger inadaptée", "Rythme respiratoire irrégulier du patient", "Fuite d'air perturbant la détection"], solutionsPatient: ["Essayer de se détendre et de caler sa respiration sur le rythme de la machine", "Vérifier que le tuyau n'est pas plié ou écrasé", "Signaler si l'appareil démarre trop tôt ou trop tard"], solutionsTech: ["Ajuster la sensibilité du trigger inspiratoire et expiratoire", "Passer en mode automatique si le patient a du mal à déclencher", "Vérifier l'absence de fuite au niveau du masque et du circuit"] },
              { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Cordon secteur déconnecté ou endommagé", "Batterie interne vide ou défectueuse", "Bloc d'alimentation HS", "Fusible interne grillé"], solutionsPatient: ["Vérifier que la prise est bien branchée au mur et à l'appareil", "S'assurer que le voyant du bloc d'alimentation est allumé", "Laisser l'appareil charger sur secteur pendant au moins 2 heures"], solutionsTech: ["Tester la tension de sortie du bloc d'alimentation", "Vérifier l'état de la batterie interne (test de capacité)", "Contrôler la continuité du câble secteur et du connecteur d'embase"] },
              { title: "Bruit anormal ou vibrations", causes: ["Usure des roulements de la turbine", "Filtres internes encrassés", "Surchauffe moteur", "Obstruction de l'entrée d'air"], solutionsPatient: ["Nettoyer ou remplacer le filtre à air à l'arrière de l'appareil", "S'assurer que rien ne bouche les grilles de ventilation", "Signaler tout bruit inhabituel (sifflement, frottement)"], solutionsTech: ["Vérifier le compteur d'heures de la turbine", "Mesurer les pressions de sortie réelles de l'appareil", "Nettoyer l'intérieur de l'appareil et remplacer les filtres HEPA", "Remplacer le bloc turbine si le bruit de roulement persiste"] }
            ]}
          ] },
          { id: "ippb", name: "Relaxateur de pression (IPPB)", models: [
            { id: "alpha-300", name: "VAEB Alpha 300", failures: [
              { title: "Pression instable / Débit irrégulier", causes: ["Mauvais réglage de la pression ou du débit", "Fuite importante dans le circuit", "Usure interne du compresseur ou des valves", "Filtres colmatés", "Clapet anti-retour bloqué", "Condensateur de démarrage du moteur fatigué"], solutionsPatient: ["Vérifier que la prise est bien branchée au mur et à l'appareil", "Est-ce que l'air vous semble changer de force brusquement ou de manière irrégulière ?", "Entendez-vous un sifflement ou un bruit d'air qui s'échappe quelque part ?", "Le filtre à air à l'arrière est-il propre ?", "Avez-vous essayé de brancher l'appareil directement sur la prise murale sans multiprise ?"], solutionsTech: ["Recalibrer l'appareil (pression et débit) via le menu service.", "Effectuer un test d'étanchéité complet du circuit patient et interne.", "Vérifier l'état du compresseur et des valves pneumatiques.", "Remplacer les filtres à air (entrée et sortie).", "Mesurer la tension aux bornes du moteur pendant le cycle.", "Vérifier l'étanchéité du raccord rapide de sortie."] },
              { title: "Inconfort respiratoire / Mauvaise tolérance", causes: ["Pression d'insufflation trop élevée", "Temps d'insufflation inadapté", "Mauvaise adaptation du patient", "Plaie buccale ou nasale", "Trigger inspiratoire trop dur", "Humidité de l'air insuffisante"], solutionsPatient: ["Vérifier que la prise est bien branchée au mur et à l'appareil", "L'air arrive-t-il trop fort ou trop brutalement ?", "Le masque ou l'embout vous blesse-t-il ou irrite-t-il la peau ?", "Avez-vous du mal à suivre le rythme de la machine ?", "Essayez de vous détendre et de prendre de plus petites inspirations au début."], solutionsTech: ["Ajuster progressivement la pression d'insufflation pour améliorer le confort.", "Modifier les temps d'insufflation et d'expiration pour une meilleure synchronisation.", "Conseiller une interface patient plus adaptée (masque, embout buccal).", "Vérifier la pression de consigne et les réglages de rampe.", "Ajuster la sensibilité du déclenchement (trigger).", "Vérifier le fonctionnement de la valve de sécurité."] },
              { title: "Fuite d'air importante au masque ou circuit", causes: ["Masque/embout mal positionné", "Taille d'interface inadaptée", "Harnais trop lâche", "Tubulure percée", "Joint de bocal d'humidification usé", "Raccord O2 mal enclenché"], solutionsPatient: ["Vérifier que la prise est bien branchée au mur et à l'appareil", "Sentez-vous de l'air s'échapper sur les côtés du masque ou de l'embout ?", "Le masque bouge-t-il trop facilement sur votre visage ?", "Entendez-vous un sifflement au niveau du tuyau ?", "Vérifiez que le réservoir d'eau est bien vissé ou clipsé."], solutionsTech: ["Repositionner correctement le masque ou l'embout sur le patient.", "Changer la taille ou le modèle de l'interface patient.", "Remplacer le harnais si usé ou détendu.", "Vérifier l'intégrité de la tubulure et des connexions.", "Tester l'étanchéité sous pression à 30 cmH2O.", "Remplacer les joints toriques des connecteurs."] },
              { title: "Problème d'alimentation (L'appareil ne s'allume pas)", causes: ["Cordon secteur déconnecté ou endommagé", "Prise murale défectueuse", "Compresseur interne HS", "Interrupteur défectueux", "Fusible grillé", "Disjoncteur thermique activé"], solutionsPatient: ["Vérifier que la prise est bien branchée au mur et à l'appareil", "Le compresseur démarre-t-il (fait-il du bruit) ?", "Avez-vous essayé de brancher l'appareil sur une autre prise électrique ?", "Le voyant d'alimentation est-il allumé ?", "Appuyez sur le bouton de réinitialisation (reset) s'il est accessible."], solutionsTech: ["Tester la continuité du cordon secteur et du connecteur d'embase.", "Vérifier le condensateur de démarrage du compresseur.", "Contrôler l'interrupteur Marche/Arrêt.", "Vérifier et remplacer le fusible interne si nécessaire.", "Mesurer la tension en sortie de carte d'alimentation.", "Vérifier l'absence de court-circuit sur le moteur."] }
            ]},
            { id: "eo-300", name: "EO-300 IPPB", failures: [
              { title: "Inefficacité ventilatoire / Toux inefficace", causes: ["Mauvais réglage de la pression ou du débit", "Fuite importante au masque ou circuit", "Capteur de pression/débit défectueux", "Sécrétions trop denses", "Filtre HME saturé", "Paramètre de pente (Ramp) trop lent"], solutionsPatient: ["Vérifier que la prise est bien branchée au mur et à l'appareil", "L'appareil vous aide-t-il à respirer profondément et à mobiliser les sécrétions ?", "Sentez-vous une résistance anormale à l'inspiration ou l'expiration ?", "S'assurer d'une bonne hydratation.", "Vérifiez si le filtre antibactérien n'est pas humide ou obstrué."], solutionsTech: ["Ajuster les paramètres de pression (IPAP/EPAP) et de débit (Flow).", "Réévaluer le protocole de traitement avec le prescripteur.", "Recalibrer les capteurs de pression et de débit.", "Vérifier l'étanchéité complète du circuit patient.", "Contrôler le volume courant expiré réel.", "Mettre à jour le logiciel de l'appareil."] },
              { title: "Mauvaise synchronisation patient-machine", causes: ["Sensibilité du trigger inadaptée", "Fuites massives perturbant la détection", "Rythme respiratoire irrégulier", "Défaut du capteur de trigger", "Auto-déclenchement dû à des condensations"], solutionsPatient: ["Vérifier que la prise est bien branchée au mur et à l'appareil", "La machine se déclenche-t-elle au moment où vous inspirez ?", "L'air arrive-t-il trop tard ou trop tôt par rapport à votre effort ?", "Avez-vous du mal à coordonner votre respiration avec l'appareil ?", "Videz l'eau éventuellement présente dans le circuit."], solutionsTech: ["Ajuster la sensibilité du trigger inspiratoire et expiratoire.", "Renforcer le coaching du patient sur la coordination respiratoire.", "Vérifier l'absence de fuites importantes au masque et au circuit.", "Tester et, si nécessaire, remplacer le capteur de trigger.", "Vérifier l'intégrité de la valve expiratoire.", "Analyser les logs de trigger dans le menu clinicien."] },
              { title: "Fuite d'air importante au masque ou circuit", causes: ["Masque mal positionné", "Tubulure percée", "Valve expiratoire défectueuse", "Coussin de masque usé", "Membrane de valve mal clipsée", "Fissure sur le bocal"], solutionsPatient: ["Vérifier que la prise est bien branchée au mur et à l'appareil", "Sentez-vous de l'air s'échapper sur les côtés du masque ?", "Le masque est-il bien plaqué contre votre visage ?", "Entendez-vous un sifflement au niveau du tuyau ou des raccords ?", "Vérifiez que le tuyau est bien 'cliqué' à l'arrière."], solutionsTech: ["Repositionner correctement le masque et ajuster le harnais.", "Changer la taille ou le modèle du masque si inadapté.", "Remplacer la tubulure si elle est percée ou fendue.", "Vérifier et nettoyer la valve expiratoire.", "Remplacer le joint de la valve de sortie.", "Tester l'appareil avec un bouchon pour isoler la fuite."] },
              { title: "Débit insuffisant / Baisse de puissance", causes: ["Obstruction du circuit patient", "Filtre d'entrée d'air colmaté", "Moteur ou turbine fatigué", "Fuite interne", "Accumulation de poussière sur la grille de refroidissement"], solutionsPatient: ["Vérifier que la prise est bien branchée au mur et à l'appareil", "Le tuyau est-il plié, écrasé ou bouché ?", "Le filtre à air à l'arrière est-il propre et non encrassé ?", "L'appareil vous semble-t-il moins puissant qu'avant ?", "Dégagez l'espace autour de la machine pour qu'elle respire mieux."], solutionsTech: ["Vérifier l'intégrité et la perméabilité du circuit patient.", "Remplacer le filtre d'entrée d'air.", "Mesurer le débit et la pression en sortie d'appareil.", "Vérifier l'état du moteur/turbine et rechercher des fuites internes.", "Nettoyer la turbine à l'air comprimé sec.", "Contrôler la vitesse de rotation de la turbine (RPM)."] }
            ]}
          ] }
        ]
      },
      { 
        id: "humidificateur", 
        name: "Humidificateur", 
        subTypes: [
          { id: "hum-interne", name: "Internes (dépendants)", models: [
            { id: "dreamstation-hum", name: "DreamStation", failures: [
                { title: "Pas de chauffage / Air froid", causes: ["Plaque chauffante défectueuse", "Mauvaise connexion avec l'unité PPC", "Menu humidification désactivé", "Connecteurs d'embase oxydés"], solutionsPatient: ["Vérifiez que le bac est bien enfoncé jusqu'au 'clic'", "S'assurer que l'option d'humidification est active dans le menu 'Confort'", "Nettoyez les contacts métalliques à l'arrière du bac avec un chiffon sec"], solutionsTech: ["Mesurer la tension de sortie sur l'embase de la machine", "Tester la continuité de la résistance de chauffe", "Vérifier le bon fonctionnement du capteur de présence bac", "Remplacer l'embase chauffante si nécessaire"] },
                { title: "Fuite d'eau sous l'appareil", causes: ["Réservoir fissuré", "Joint du couvercle mal positionné", "Niveau d'eau dépassant le trait MAX", "Joint de l'embase interne usé"], solutionsPatient: ["Vérifiez que le joint bleu dans le couvercle est bien plat et propre", "Avez-vous rempli le bac au-dessus de la ligne maximale ?", "Le couvercle est-il bien clipsé sur les quatre côtés ?", "Essuyez bien le dessous du bac avant de le remettre"], solutionsTech: ["Remplacer le joint d'étanchéité du couvercle", "Inspecter le bac à la lumière pour détecter une micro-fissure", "Vérifier l'alignement de la tubulure de sortie d'air", "Changer le réservoir complet"] },
                { title: "Bruit de glouglou / Condensation (Rainout)", causes: ["Réglage humidité trop élevé", "Température de chambre trop basse", "Tuyau non isolé", "Appareil placé trop haut par rapport au patient"], solutionsPatient: ["Baissez le réglage de l'humidificateur d'un ou deux niveaux", "Placez la machine plus bas que le niveau de votre tête", "Videz l'eau accumulée dans le tuyau au milieu de la nuit", "Installez une housse en tissu sur le tuyau"], solutionsTech: ["Conseiller l'utilisation d'un tuyau chauffant (HT15)", "Vérifier la sonde de température ambiante de l'appareil", "Activer le mode 'Adaptatif' dans les réglages cliniciens"] }
            ] },
            { id: "h41", name: "H41", failures: [
                { title: "Pas de chauffage", causes: ["Plaque chauffante HS", "Option désactivée dans le menu", "Mauvais couplage"], solutionsPatient: ["Vérifiez l'activation dans le menu patient", "Vérifiez que le bac est bien inséré à fond", "L'air est-il tiède après 10 minutes ?"], solutionsTech: ["Tester la résistance de la plaque", "Vérifier le fusible thermique interne", "Remplacer la plaque."] },
                { title: "Fuite d'eau", causes: ["Joint de bac usé", "Bac mal positionné", "Fissure dans le plastique"], solutionsPatient: ["Vérifiez que le joint est propre et bien logé", "Retirez et remettez le bac fermement", "Voyez-vous de l'eau sous la machine ?"], solutionsTech: ["Changer le joint d'étanchéité", "Remplacer le bac", "Vérifier l'alignement des ports."] },
                { title: "Pas d'humidification / Air trop sec", causes: ["Mauvais réglage de confort", "Air ambiant trop sec", "Bac calcaire"], solutionsPatient: ["Augmentez le réglage de chauffe sur l'appareil", "Vérifiez l'étanchéité du masque", "Détartrez le bac avec du vinaigre blanc"], solutionsTech: ["Ajuster paramètres confort", "Vérifier la chauffe du tuyau si présent", "Check circuit."] }
            ] },
            { id: "humidair", name: "HumidAir", failures: [
                { title: "Pas de chauffage", causes: ["Connecteurs sales ou oxydés", "Plaque chauffante défectueuse", "Mauvaise insertion"], solutionsPatient: ["Vérifiez que la prise est bien branchée", "Nettoyez les petits contacts au dos du bac avec un chiffon sec", "Poussez le bac jusqu'à entendre le clic"], solutionsTech: ["Vérifier la continuité du circuit de chauffe", "Mesurer la tension aux bornes de l'embase", "Remplacer la plaque"] },
                { title: "Fuite d'eau", causes: ["Bac mal inséré", "Joint de réservoir pincé", "Réservoir calcaire"], solutionsPatient: ["Vérifiez que le réservoir est enfoncé à fond", "Le joint en silicone est-il bien propre et plat ?", "Y a-t-il du calcaire sur les bords du bac ?"], solutionsTech: ["Nettoyer au vinaigre blanc", "Remplacer le joint silicone", "Tester avec un bac neuf"] },
                { title: "Pas d'humidification / Air sec", causes: ["Réglage trop bas", "Mode manuel inadapté", "Fuite importante au masque"], solutionsPatient: ["Essayez de passer le réglage sur 'Auto'", "Augmentez le niveau d'humidité manuellement", "Vérifiez que le masque ne fuit pas"], solutionsTech: ["Activer le mode Climate Control Auto", "Tester avec un tuyau ClimateLineAir", "Check calibration sonde."] }
            ] },
            { id: "hum-breas", name: "Humidificateur Chauffant (Breas)", failures: [
                { title: "Pas de chauffage", causes: ["Plaque chauffante HS", "Option désactivée dans le menu", "Mauvais clipsage"], solutionsPatient: ["Vérifier l'activation dans le menu Confort", "Assurez-vous que le bac est bien enclenché", "Débranchez et rebranchez pour réinitialiser"], solutionsTech: ["Remplacer la plaque", "Vérifier la nappe de connexion interne", "Mesurer la résistance (Ohms)"] },
                { title: "Fuite d'eau", causes: ["Bac mal fermé", "Joint usé", "Bac fissuré après chute"], solutionsPatient: ["Le bac vous semble-t-il bien fermé sur tout le tour ?", "Vérifiez que le joint blanc est bien plat", "Voyez-vous des fissures sur le plastique ?"], solutionsTech: ["Remplacer le joint d'étanchéité", "Changer le réservoir complet", "Vérifier l'embase."] },
                { title: "Pas d'humidification / Nez sec", causes: ["Réglage trop bas", "Fuite au masque", "Temps de préchauffage court"], solutionsPatient: ["Augmentez le niveau de chauffe dans le menu", "Vérifiez que le masque est bien étanche", "Attendez 15 minutes que l'eau chauffe"], solutionsTech: ["Ajuster paramètres avancés", "Vérifier la sonde de température", "Tester à vide."] }
            ] },
            { id: "hum-sys1", name: "System One", failures: [
                { title: "Pas de chauffage / Voyant bleu éteint", causes: ["Plaque chauffante HS", "Mauvaise connexion embase", "Alimentation 60W au lieu de 80W"], solutionsPatient: ["Vérifiez que le bac est poussé à fond", "Nettoyez les contacts métalliques avec un coton-tige sec", "Vérifiez que le voyant bleu sur le côté est allumé"], solutionsTech: ["Tester avec un bloc 80W", "Remplacer l'embase chauffante", "Vérifier la résistance."] },
                { title: "Fuite d'eau", causes: ["Joint transparent usé", "Couvercle mal clipsé", "Réservoir fissuré"], solutionsPatient: ["Le joint transparent au milieu est-il bien en place ?", "Le couvercle est-il bien clipsé sur les quatre points ?", "Avez-vous renversé de l'eau en le transportant ?"], solutionsTech: ["Remplacer le joint interne", "Changer le réservoir", "Vérifier l'étanchéité du coude."] },
                { title: "Condensation dans le masque", causes: ["Humidité réglée trop haut", "Chambre froide", "Absence de circuit chauffant"], solutionsPatient: ["Tentez de baisser le réglage d'un cran ou deux", "Videz l'eau du tuyau pendant la nuit", "Utilisez une housse isolante sur le tuyau"], solutionsTech: ["Proposer un circuit chauffant System One", "Contrôle des capteurs de débit", "Check calibration."] }
            ] },
            { id: "prisma-aqua", name: "PrismaAQUA", failures: [
                { title: "Pas de chauffage", causes: ["Résistance chauffante HS", "Symbole absent sur l'écran", "Bac vide (sécurité)"], solutionsPatient: ["Vérifier la présence du symbole de chauffe sur l'écran", "Vérifiez que le bac est rempli d'eau", "Nettoyez les contacts sous le bac avec un chiffon sec"], solutionsTech: ["Effectuer la maintenance de la base chauffante", "Tester la résistance (Ohms)", "Remplacer l'embase"] },
                { title: "Fuite d'eau / Condensation", causes: ["Réservoir fissuré", "Joint de couvercle mal mis", "Tuyau non isolé"], solutionsPatient: ["Voyez-vous une petite fente ou de l'eau sous l'appareil ?", "Le joint bleu dans le couvercle est-il bien plat ?", "Videz l'eau du tuyau"], solutionsTech: ["Remplacer le réservoir d'eau", "Changer le joint de couvercle", "Vérifier la sonde thermique"] },
                { title: "Air trop sec / Niveau d'eau stable", causes: ["Réglage humidité trop bas", "Bac entartré", "Fuite importante au masque"], solutionsPatient: ["Augmentez le niveau d'humidité sur l'écran", "Détartrez le bac avec du vinaigre blanc", "Vérifiez l'étanchéité du masque"], solutionsTech: ["Ajuster les paramètres de confort", "Contrôler la régulation de puissance", "Check calibration."] }
            ] },
            { id: "hum-sbox", name: "S.Box", failures: [
                { title: "Pas de chauffage", causes: ["Mauvaise connexion du bac", "Plaque chauffante HS", "Bug logiciel"], solutionsPatient: ["Retirez et remettez le bac fermement", "Vérifiez que l'humidificateur est activé sur l'écran tactile", "Videz le bac et séchez les contacts en dessous"], solutionsTech: ["Vérifier le branchement interne", "Mise à jour du firmware", "Tester la plaque chauffante"] },
                { title: "Fuite d'eau / Condensation", causes: ["Joint arrière déformé", "Couvercle mal fermé", "Pièce trop froide"], solutionsPatient: ["Le gros joint à l'arrière vous semble-t-il bien droit ?", "Vérifiez que le couvercle est bien clipsé", "Baissez l'humidité ou isolez le tuyau"], solutionsTech: ["Changer le joint de liaison interne", "Remplacer le réservoir complet", "Vérifier la connexion du circuit"] },
                { title: "Air trop sec / Niveau d'eau ne baisse pas", causes: ["Humidification désactivée", "Bac entartré", "Température de chambre élevée"], solutionsPatient: ["Vérifiez que l'icône de goutte est active", "Détartrez le bac avec du vinaigre blanc", "Augmentez le réglage d'un ou deux niveaux"], solutionsTech: ["Contrôler les réglages de confort", "Vérifier la puissance de chauffe", "Check sonde."] }
            ] }
          ] },
          { id: "hum-externe", name: "Externes (autonomes)", models: [
            { id: "hc150", name: "HC150", failures: [
                { title: "Pas de chauffage / Voyant éteint", causes: ["Résistance défectueuse", "Fusible interne grillé", "Interrupteur défectueux", "Thermostat de sécurité activé"], solutionsPatient: ["Vérifiez que l'appareil est branché sur une prise murale en direct", "Tournez le bouton rotatif : le voyant orange s'allume-t-il ?", "L'appareil a-t-il fonctionné à vide (sans eau) récemment ?", "Vérifiez l'état du cordon d'alimentation"], solutionsTech: ["Tester la résistance (Ohmmètre)", "Remplacer le fusible thermique si l'appareil a surchauffé", "Vérifier la tension aux bornes du bouton de réglage", "Contrôler le câblage interne"] },
                { title: "Fuite d'eau / Condensation excessive", causes: ["Joint de bac usé", "Bac mal positionné", "Différence de température trop forte", "Tuyau non isolé"], solutionsPatient: ["Vérifiez que le bac est bien à plat sur la plaque", "Le joint en caoutchouc est-il propre et sans fissure ?", "Eloignez l'appareil des courants d'air froid", "Isolez le tuyau avec une housse"], solutionsTech: ["Remplacer le joint d'étanchéité", "Vérifier la régulation de température", "Inspecter le bac pour micro-fissures"] },
                { title: "Pas d'humidification", causes: ["Pièce froide", "Réglage trop bas", "Tuyau non isolé"], solutionsPatient: ["Isolez le tuyau avec une housse", "Augmentez le réglage sur le bouton rotatif", "Vérifiez s'il reste de l'eau dans le bac le matin"], solutionsTech: ["Check sonde température.", "Tester la plaque chauffante", "Vérifier le thermostat."] }
            ] },
            { id: "mr810-mr820", name: "MR810 / MR820", failures: [
                { title: "Pas de chauffage", causes: ["Appareil mal branché", "Résistance HS", "Fusible thermique sauté"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Est-ce que le voyant orange en façade est allumé ?", "L'air est-il tiède après 10 minutes ?"], solutionsTech: ["Vérifier l'alimentation secteur.", "Remplacer la base chauffante.", "Vérifier la continuité de l'interrupteur."] },
                { title: "Fuite d'eau", causes: ["Chambre mal percée", "Joint usé", "Raccords mal serrés"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Est-ce que vous voyez de l'eau couler le long du réservoir bleu ?", "Est-ce que les tuyaux sont bien enfoncés sur les raccords ?"], solutionsTech: ["Changer la chambre d'humidification.", "Inspecter l'intégrité de la chambre.", "Vérifier l'étanchéité des raccords."] },
                { title: "Pas d'humidification", causes: ["Température ambiante basse", "Sonde défectueuse", "Flux d'air trop important"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Est-ce que l'air vous paraît trop frais ou trop sec ?", "Est-ce que vous avez installé une housse de protection sur le tuyau ?"], solutionsTech: ["Ajuster la température.", "Vérifier la sonde de température.", "Contrôler le débit de l'appareil associé."] },
                { title: "Alimentation", causes: ["Câble secteur abîmé", "Surtension", "Fusible interne grillé"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Est-ce que vous avez essayé de le brancher sur une autre prise ?", "Le voyant d'alimentation s'allume-t-il ?"], solutionsTech: ["Vérifier le cordon et le fusible interne.", "Mesurer la tension d'entrée."] }
            ] },
            { id: "my-airvo-2", name: "MY AIRVO 2", failures: [
                { title: "Pas de chauffage", causes: ["Résistance chauffante défectueuse", "Erreur logicielle", "Surchauffe"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Est-ce que vous voyez un message d'alerte rouge sur l'écran ?", "Redémarrer l'appareil."], solutionsTech: ["Remplacement de la base chauffante.", "Mise à jour du firmware.", "Vérifier le capteur de température."] },
                { title: "Fuite d'eau", causes: ["Chambre mal insérée", "Joint usé", "Trop-plein d'eau"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Est-ce que le réservoir est bien poussé au fond de son emplacement ?", "Est-ce que vous voyez de l'eau couler sous la machine ?"], solutionsTech: ["Remplacer le joint de base.", "Vérifier le clapet anti-retour.", "Changer le réservoir."] },
                { title: "Pas d'humidification", causes: ["Pièce trop froide", "Circuit non chauffé", "Canule nasale bouchée"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Avez-vous beaucoup d'eau dans votre canule nasale ?", "Sentez-vous que l'air est trop froid ?"], solutionsTech: ["Vérifier la continuité du circuit chauffant.", "Recalibrer les capteurs.", "Vérifier le bloc turbine."] },
                { title: "Alimentation/Batterie", causes: ["Cordon secteur déconnecté", "Batterie interne déchargée ou HS", "Bloc alimentation défaillant"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Est-ce que vous voyez l'icône de batterie s'afficher à l'écran ?", "L'appareil bipe-t-il au branchement ?"], solutionsTech: ["Vérifier le bloc d'alimentation externe.", "Tester la tension de sortie du bloc.", "Vérifier la carte d'alimentation."] }
            ] },
            { id: "vhb10a", name: "VHB10A", failures: [
                { title: "Pas de chauffage", causes: ["Résistance HS", "Fusible grillé", "Défaut carte"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Est-ce que l'interrupteur sur le côté est sur la position 'I' ?", "Vérifiez si l'écran s'allume."], solutionsTech: ["Remplacement de la résistance.", "Vérifier le fusible.", "Tester la résistance."] },
                { title: "Fuite d'eau", causes: ["Raccords mal serrés", "Joint dégradé", "Fissure réservoir"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Est-ce que vous voyez de l'eau couler près des raccords blancs ?", "Est-ce que le bac à eau est bien stable sur sa base ?"], solutionsTech: ["Vérifier l'étanchéité.", "Resserrer les raccords.", "Remplacer le joint."] },
                { title: "Pas d'humidification", causes: ["Manque d'isolation", "Fil chauffant déconnecté", "Sonde défectueuse"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Est-ce que l'air vous semble trop sec ?", "Est-ce que vous avez bien branché le câble électrique du tuyau ?"], solutionsTech: ["Vérifier le fil chauffant.", "Vérifier la sonde thermique.", "Ajuster la puissance."] },
                { title: "Alimentation", causes: ["Interrupteur HS", "Fusible grillé", "Cordon abîmé"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Est-ce que les chiffres s'allument sur l'écran ?", "Tester une autre prise."], solutionsTech: ["Vérifier le cordon et le fusible.", "Mesurer la tension."] }
            ] }
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
              { id: "b15", name: "Bouteille B15", failures: [
                  { title: "Pas de débit ou débit insuffisant", causes: ["Bouteille vide (aiguille rouge)", "Robinet mal ouvert", "Canule pliée ou écrasée", "Régulateur défectueux"], solutionsPatient: ["Regardez le manomètre : l'aiguille est-elle dans la zone verte ?", "Le robinet sur le dessus est-il ouvert à fond ?", "Vérifiez que personne ne marche sur le tuyau.", "Essayez avec une autre canule neuve."], solutionsTech: ["Tester la bouteille avec un autre manodétendeur", "Vérifier la pression de sortie", "Contrôler l'absence d'obstruction dans le raccord de sortie"] },
                  { title: "Fuite d'oxygène (sifflement)", causes: ["Joint de valve (O-ring) usé ou manquant", "Raccord rapide mal enclenché", "Soupape de sécurité activée"], solutionsPatient: ["Entendez-vous un sifflement (pshhh) au niveau du robinet ?", "Débranchez et rebranchez fermement la canule", "Fermez le robinet immédiatement si la fuite est importante"], solutionsTech: ["Remplacer le joint d'étanchéité (O-ring)", "Vérifier le serrage du manodétendeur", "Tester l'étanchéité"] },
                  { title: "Débitmètre bloqué ou dur à tourner", causes: ["Encrassement interne", "Choc mécanique", "Gel interne (utilisation intensive)"], solutionsPatient: ["Le bouton tourne-t-il sans forcer ?", "Y a-t-il du givre blanc sur le métal ?", "Laissez reposer la bouteille 15 minutes"], solutionsTech: ["Nettoyer le mécanisme de réglage", "Remplacer le bloc régulateur", "Vérifier l'absence de corps gras"] }
                ]
              },
              { id: "b2", name: "Bouteille B2", failures: [
                  { title: "Pas de débit ou débit insuffisant", causes: ["Bouteille vide (aiguille rouge)", "Robinet mal ouvert", "Canule pliée ou écrasée", "Régulateur défectueux"], solutionsPatient: ["Regardez le manomètre : l'aiguille est-elle dans la zone verte ?", "Le robinet sur le dessus est-il ouvert à fond ?", "Vérifiez que personne ne marche sur le tuyau.", "Essayez avec une autre canule neuve."], solutionsTech: ["Tester la bouteille avec un autre manodétendeur", "Vérifier la pression de sortie", "Contrôler l'absence d'obstruction dans le raccord de sortie"] },
                  { title: "Fuite d'oxygène (sifflement)", causes: ["Joint de valve (O-ring) usé ou manquant", "Raccord rapide mal enclenché", "Soupape de sécurité activée"], solutionsPatient: ["Entendez-vous un sifflement (pshhh) au niveau du robinet ?", "Débranchez et rebranchez fermement la canule", "Fermez le robinet immédiatement si la fuite est importante"], solutionsTech: ["Remplacer le joint d'étanchéité (O-ring)", "Vérifier le serrage du manodétendeur", "Tester l'étanchéité"] },
                  { title: "Débitmètre bloqué ou dur à tourner", causes: ["Encrassement interne", "Choc mécanique", "Gel interne (utilisation intensive)"], solutionsPatient: ["Le bouton tourne-t-il sans forcer ?", "Y a-t-il du givre blanc sur le métal ?", "Laissez reposer la bouteille 15 minutes"], solutionsTech: ["Nettoyer le mécanisme de réglage", "Remplacer le bloc régulateur", "Vérifier l'absence de corps gras"] }
                ]
              },
              { id: "b5", name: "Bouteille B5", failures: [
                  { title: "Pas de débit ou débit insuffisant", causes: ["Bouteille vide (aiguille rouge)", "Robinet mal ouvert", "Canule pliée ou écrasée", "Régulateur défectueux"], solutionsPatient: ["Regardez le manomètre : l'aiguille est-elle dans la zone verte ?", "Le robinet sur le dessus est-il ouvert à fond ?", "Vérifiez que personne ne marche sur le tuyau.", "Essayez avec une autre canule neuve."], solutionsTech: ["Tester la bouteille avec un autre manodétendeur", "Vérifier la pression de sortie", "Contrôler l'absence d'obstruction dans le raccord de sortie"] },
                  { title: "Fuite d'oxygène (sifflement)", causes: ["Joint de valve (O-ring) usé ou manquant", "Raccord rapide mal enclenché", "Soupape de sécurité activée"], solutionsPatient: ["Entendez-vous un sifflement (pshhh) au niveau du robinet ?", "Débranchez et rebranchez fermement la canule", "Fermez le robinet immédiatement si la fuite est importante"], solutionsTech: ["Remplacer le joint d'étanchéité (O-ring)", "Vérifier le serrage du manodétendeur", "Tester l'étanchéité"] },
                  { title: "Débitmètre bloqué ou dur à tourner", causes: ["Encrassement interne", "Choc mécanique", "Gel interne (utilisation intensive)"], solutionsPatient: ["Le bouton tourne-t-il sans forcer ?", "Y a-t-il du givre blanc sur le métal ?", "Laissez reposer la bouteille 15 minutes"], solutionsTech: ["Nettoyer le mécanisme de réglage", "Remplacer le bloc régulateur", "Vérifier l'absence de corps gras"] }
                ]
              },
              { id: "oxalys", name: "Oxalys", failures: [
                  { title: "Pas de débit ou débit insuffisant", causes: ["Bouteille vide (aiguille rouge)", "Robinet mal ouvert", "Canule pliée ou écrasée", "Régulateur défectueux"], solutionsPatient: ["Regardez le manomètre : l'aiguille est-elle dans la zone verte ?", "Le robinet sur le dessus est-il ouvert à fond ?", "Vérifiez que personne ne marche sur le tuyau.", "Essayez avec une autre canule neuve."], solutionsTech: ["Tester la bouteille avec un autre manodétendeur", "Vérifier la pression de sortie", "Contrôler l'absence d'obstruction dans le raccord de sortie"] },
                  { title: "Fuite d'oxygène (sifflement)", causes: ["Joint de valve (O-ring) usé ou manquant", "Raccord rapide mal enclenché", "Soupape de sécurité activée"], solutionsPatient: ["Entendez-vous un sifflement (pshhh) au niveau du robinet ?", "Débranchez et rebranchez fermement la canule", "Fermez le robinet immédiatement si la fuite est importante"], solutionsTech: ["Remplacer le joint d'étanchéité (O-ring)", "Vérifier le serrage du manodétendeur", "Tester l'étanchéité"] },
                  { title: "Débitmètre bloqué ou dur à tourner", causes: ["Encrassement interne", "Choc mécanique", "Gel interne (utilisation intensive)"], solutionsPatient: ["Le bouton tourne-t-il sans forcer ?", "Y a-t-il du givre blanc sur le métal ?", "Laissez reposer la bouteille 15 minutes"], solutionsTech: ["Nettoyer le mécanisme de réglage", "Remplacer le bloc régulateur", "Vérifier l'absence de corps gras"] }
                ]
              },
              { id: "ifill", name: "Bouteille IFILL", failures: [
                  { title: "La bouteille ne se remplit pas", causes: ["Bouteille mal clipsée sur la station", "Concentrateur iFill éteint", "Pression de remplissage atteinte"], solutionsPatient: ["Assurez-vous d'avoir entendu le double clic lors de l'insertion.", "Le voyant de remplissage sur la station est-il allumé ?", "La bouteille est-elle déjà pleine (voir manomètre) ?"], solutionsTech: ["Vérifier le raccord de transfert", "Tester avec une autre bouteille", "Vérifier la pression du compresseur interne"] },
                  { title: "Fuite lors du remplissage", causes: ["Joint de connexion sale ou usé", "Mauvais alignement", "Givre sur le raccord"], solutionsPatient: ["Dégagez la bouteille et essuyez les connecteurs avec un chiffon sec.", "Vérifiez que la bouteille est bien verticale.", "Attendez que le givre fonde avant de re-tester."], solutionsTech: ["Remplacer le joint d'embase de la station", "Vérifier l'étanchéité de la valve de bouteille", "Nettoyer les surfaces de contact"] }
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
                    { id: "1025ks", name: "10L (GCE / 1025KS)", failures: [
                        { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Alimentation", "Cordon", "Interrupteur"], solutionsPatient: ["Quand vous appuyez sur le bouton Marche, est-ce qu'il se passe quelque chose (bruit, lumière) ?", "Est-ce que le câble d'alimentation est bien enfoncé des deux côtés (mur et machine) ?", "Avez-vous essayé sur une autre prise électrique ?"], solutionsTech: ["Vérifier le cordon secteur.", "Vérifier le fusible/disjoncteur.", "Vérifier l'interrupteur."] },
                        { title: "Débit faible ou irrégulier", causes: ["Filtre bouché", "Tamis moléculaire usé", "Tubulure / canule obstruée", "Fuite humidificateur", "Canule trop longue"], solutionsPatient: ["Le filtre à air est-il noir ou poussiéreux ?", "Sentez-vous que l'air n'arrive pas régulièrement ?", "Le bocal de l'humidificateur est-il bien vissé ?", "La canule est-elle pliée ?"], solutionsTech: ["Nettoyage filtre HEPA.", "Remplacement des tamis.", "Vérifier la bille du débitmètre.", "Tester la pression de sortie."] },
                        { title: "Bruit anormal ou vibrations", causes: ["Compresseur fatigué", "Silentblocs usés", "Ventilateur desserré"], solutionsPatient: ["L'appareil fait-il un bruit de claquement ?", "Vérifiez si l'appareil est bien à plat sur le sol."], solutionsTech: ["Maintenance moteur.", "Remplacer les fixations moteur.", "Vérifier les pales du ventilateur."] },
                        { title: "Erreur Système (Message d'erreur)", causes: ["Tamis moléculaire usé", "Mauvaise concentration O₂", "Filtre d'entrée colmaté", "Fuite interne"], solutionsPatient: ["Le voyant oxygène est-il jaune ou rouge ?", "L'appareil est-il loin des murs pour respirer ?", "Le filtre à poussière est-il propre ?"], solutionsTech: ["Mesurer la pureté à l'analyseur.", "Vérifier l'étanchéité pneumatique.", "Remplacer les colonnes.", "Contrôler la pression compresseur."] }
                    ] },
                    { id: "525ks", name: "5L (525KS)", failures: [
                        { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Alimentation", "Cordon", "Interrupteur", "Condensateur HS"], solutionsPatient: ["Quand vous appuyez sur le bouton Marche, est-ce qu'il se passe quelque chose (bruit, lumière) ?", "Est-ce que le câble d'alimentation est bien enfoncé des deux côtés ?", "Avez-vous essayé sur une autre prise électrique ?"], solutionsTech: ["Vérifier le cordon secteur.", "Vérifier le fusible/disjoncteur.", "Vérifier l'interrupteur.", "Tester le condensateur de démarrage."] },
                        { title: "Débit faible ou irrégulier", causes: ["Filtre bouché", "Tamis moléculaire usé", "Tubulure / canule obstruée", "Fuite humidificateur"], solutionsPatient: ["Le filtre à air est-il propre ?", "Sentez-vous que l'air n'arrive pas régulièrement ?", "Vérifiez que le bocal humidificateur est bien vissé."], solutionsTech: ["Nettoyage filtre.", "Remplacement tamis.", "Vérifier ou remplacer tubulure/canule."] },
                        { title: "Erreur Système (Message d'erreur)", causes: ["Tamis moléculaire usé", "Mauvaise concentration O₂", "Vanne 4 voies bloquée"], solutionsPatient: ["Le voyant O2 est-il allumé ?", "L'appareil a-t-il été entretenu récemment ?", "La pièce est-elle bien aérée ?"], solutionsTech: ["Vérifier pureté.", "Maintenance interne.", "Contrôler la vanne 4 voies."] }
                    ] },
                    { id: "8f-5a", name: "5L (8F-5A)", failures: [
                        { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Alimentation", "Cordon", "Interrupteur", "Carte alimentation"], solutionsPatient: ["Quand vous appuyez sur le bouton Marche, est-ce qu'il se passe quelque chose (bruit, lumière) ?", "Est-ce que le câble d'alimentation est bien enfoncé ?", "Avez-vous essayé sur une autre prise électrique ?"], solutionsTech: ["Vérifier le cordon secteur.", "Vérifier le fusible/disjoncteur.", "Vérifier l'interrupteur.", "Contrôler la carte d'alimentation."] },
                        { title: "Débit faible ou irrégulier", causes: ["Filtre bouché", "Tamis moléculaire usé", "Tubulure / canule obstruée", "Débitmètre fuyard"], solutionsPatient: ["Le filtre à air est-il propre ?", "Sentez-vous que l'air n'arrive pas régulièrement ?", "Vérifiez si l'humidificateur fait des bulles normalement."], solutionsTech: ["Nettoyage filtre.", "Remplacement tamis.", "Vérifier ou remplacer tubulure/canule.", "Tester l'étanchéité du bocal."] },
                        { title: "Erreur Système (Message d'erreur)", causes: ["Tamis moléculaire usé", "Mauvaise concentration O₂", "Humidité excessive", "Compresseur sous-performant"], solutionsPatient: ["Le voyant O2 est-il allumé ?", "L'appareil a-t-il été entretenu récemment ?", "La pièce est-elle bien aérée ?", "L'appareil est-il utilisé près d'une source de vapeur ?"], solutionsTech: ["Vérifier la pureté à l'analyseur.", "Maintenance interne filtres.", "Remplacer les colonnes.", "Contrôler les pressions."] }
                    ] },
                    { id: "everflo", name: "EverFlo", failures: [
                        { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Alimentation", "Cordon", "Interrupteur", "Condensateur"], solutionsPatient: ["Quand vous appuyez sur le bouton Marche, est-ce qu'il se passe quelque chose (bruit, lumière) ?", "Est-ce que le câble d'alimentation est bien enfoncé ?", "Avez-vous essayé sur une autre prise électrique ?"], solutionsTech: ["Vérifier le cordon secteur.", "Vérifier le fusible/disjoncteur.", "Vérifier l'interrupteur.", "Vérifier le condensateur."] },
                        { title: "Débit faible ou irrégulier", causes: ["Filtre bouché", "Tamis moléculaire usé", "Compresseur usé", "Tubulure / canule obstruée"], solutionsPatient: ["Sentez-vous que l'air n'arrive pas régulièrement ?", "Le filtre à air est-il propre ?", "Vérifiez le serrage de l'humidificateur."], solutionsTech: ["Maintenance compresseur.", "Remplacement tamis.", "Nettoyage filtre.", "Vérifier ou remplacer tubulure/canule."] },
                        { title: "Bruit anormal ou vibrations", causes: ["Humidité dans le silencieux", "Vibrations compresseur", "Ventilateur sale"], solutionsPatient: ["Y a-t-il de l'eau dans le tuyau ?", "La pièce est-elle humide ?", "L'appareil est-il bien stable ?"], solutionsTech: ["Remplacer silencieux.", "Vérifier fixations moteur.", "Nettoyer ventilateur."] },
                        { title: "Erreur Système (Message d'erreur)", causes: ["Tamis moléculaire usé", "Mauvaise concentration O₂", "Filtre d'entrée noirci", "Fuite interne"], solutionsPatient: ["Le voyant oxygène est-il jaune ou rouge ?", "L'appareil a-t-il été entretenu récemment ?", "Vérifiez que rien n'obstrue les entrées d'air."], solutionsTech: ["Vérifier la pureté à l'analyseur.", "Maintenance interne (filtre feutre).", "Remplacer les colonnes.", "Contrôler les pressions."] }
                    ] },
                    { id: "platinum-9", name: "Invacare Platinum 9", failures: [
                        { title: "Débit faible ou irrégulier", causes: ["Débitmètre réglé à moins de 1 L/min", "Tubulure de 15 m pliée"], solutionsPatient: ["Augmentez le débit au-dessus de 1 L/min.", "Redressez la tubulure pour éviter les coudes."], solutionsTech: ["Vérifier l'étanchéité du circuit interne."] },
                        { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Surchauffe compresseur", "Pression trop haute", "Ventilateur bloqué", "Condensateur HS"], solutionsPatient: ["Éteignez l'appareil pendant 30 min.", "Vérifiez que l'air circule bien autour.", "Appuyez sur le bouton blanc 'Reset'."], solutionsTech: ["Nettoyer les filtres.", "Vérifier le ventilateur.", "Tester le condensateur de démarrage."] },
                        { title: "Erreur Système (Message d'erreur)", causes: ["Saturation des tamis", "Filtre d'entrée colmaté", "Fuite interne"], solutionsPatient: ["Le voyant jaune est-il allumé ?", "L'appareil est-il loin des murs ?"], solutionsTech: ["Mesurer la pureté O2.", "Remplacer les colonnes de tamis.", "Vérifier l'étanchéité pneumatique."] },
                        { title: "Bruit anormal ou vibrations", causes: ["Compresseur fatigué", "Silentblocs usés", "Ventilateur desserré"], solutionsPatient: ["L'appareil fait-il un bruit de claquement ?", "Vérifiez si l'appareil est bien à plat sur le sol."], solutionsTech: ["Maintenance moteur.", "Remplacer les fixations moteur.", "Vérifier les pales du ventilateur."] }
                    ] },
                    { id: "perfecto2-v", name: "Invacare Perfecto2 V", failures: [
                        { title: "L'appareil ne démarre pas", causes: ["Problème d'alimentation", "Disjoncteur de l'appareil déclenché", "Coupure de courant au domicile"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Est-ce que vous avez essayé d'appuyer sur le bouton blanc (disjoncteur) juste au-dessus de la prise ?"], solutionsTech: ["Tester le cordon secteur.", "Vérifier le condensateur de démarrage.", "Contrôler l'interrupteur."] },
                        { title: "Erreur Système (Message d'erreur)", causes: ["Usure des tamis moléculaires", "Filtre d'entrée poussiéreux", "Fuite interne"], solutionsPatient: ["Est-ce que vous voyez un voyant de couleur jaune ou rouge allumé ?", "Le filtre noir sur le côté de l'appareil vous semble-t-il propre ?"], solutionsTech: ["Mesurer la pureté à l'analyseur.", "Effectuer un test de fuite.", "Remplacer les colonnes de tamis."] },
                        { title: "Fuites importantes (Masque ou Circuit)", causes: ["Bocal mal vissé", "Joint du couvercle usé ou absent", "Tuyau d'oxygène mal connecté"], solutionsPatient: ["Est-ce que vous entendez un sifflement persistant ?", "Avez-vous essayé de dévisser puis de revisser bien droit le couvercle du bocal ?"], solutionsTech: ["Contrôler l'état du joint du bocal.", "Vérifier le raccord de sortie d'O2."] },
                        { title: "Débit faible ou irrégulier", causes: ["Tuyau d'oxygène plié ou écrasé", "Débitmètre réglé sur 0", "Filtre HEPA interne colmaté"], solutionsPatient: ["Est-ce que la petite bille monte bien jusqu'au chiffre demandé ?", "Est-ce que votre tuyau n'est pas coincé sous un meuble ou une porte ?"], solutionsTech: ["Nettoyer le débitmètre.", "Vérifier la pression du compresseur.", "Remplacer le filtre HEPA."] },
                        { title: "Erreur Système (Message d'erreur)", causes: ["Ventilation obstruée", "Température ambiante trop élevée", "Ventilateur interne bloqué"], solutionsPatient: ["Est-ce que l'appareil est collé contre un mur ou un rideau ?", "Fait-il très chaud dans votre chambre ?"], solutionsTech: ["Nettoyer les ouïes de ventilation.", "Vérifier le fonctionnement du ventilateur.", "Maintenance préventive."] }
                    ] },
                    { id: "homefill", name: "Invacare HomeFill (Compresseur)", failures: [
                        { title: "Erreur Système (Message d'erreur)", causes: ["Débit du concentrateur compagnon supérieur à 3 L/min"], solutionsPatient: ["Réduisez le débit du concentrateur (celui qui est à côté du compresseur).", "Attendez que le voyant repasse au vert."], solutionsTech: ["Vérifier la pression de couplage."] },
                        { title: "Fuites importantes (Masque ou Circuit)", causes: ["Mauvaise connexion", "Joint sale"], solutionsPatient: ["Nettoyez le connecteur avec un chiffon sec.", "Reconnectez fermement la bouteille jusqu'au clic."], solutionsTech: ["Remplacer le joint de l'embase."] }
                    ] },
                    { id: "ultrafill", name: "UltraFill", failures: [
                        { title: "Erreur Système (Message d'erreur)", causes: ["Concentrateur éteint", "Débit trop haut"], solutionsPatient: ["Assurez-vous que le concentrateur compagnon est allumé.", "Réglez le débit selon les instructions spécifiques de remplissage."], solutionsTech: ["Vérifier la valve de couplage."] }
                    ] },
                    { id: "igo2-fixe", name: "iGo 2 (Mode Fixe)", failures: [
                        { title: "L'appareil ne démarre pas", causes: ["Batterie vide", "Chargeur HS", "Carte"], solutionsPatient: ["Quand vous branchez le chargeur, est-ce qu'un voyant s'allume sur la machine ?", "Est-ce que le câble du chargeur est abîmé ou tordu ?", "Si vous retirez la batterie et branchez le chargeur, est-ce qu'il démarre ?"], solutionsTech: ["Tester l'alimentation externe.", "Tester sans batterie.", "Vérifier connectique interne."] },
                        { title: "Erreur Système (Message d'erreur)", causes: ["Tamis moléculaire usé", "Mauvaise concentration O₂", "Filtre d'entrée obstrué", "Compresseur usé"], solutionsPatient: ["Le voyant oxygène est-il jaune ou rouge ?", "Le filtre est-il bien propre ?", "L'appareil est-il dans un sac mal aéré ?"], solutionsTech: ["Vérifier la pureté à l'analyseur.", "Maintenance interne.", "Remplacer les tamis.", "Tester la pression."] }
                    ] }
                ]
              },
              {
                id: "portable",
                name: "Portable",
                models: [
                    { id: "inogen-g3", name: "Inogen One G3", failures: [
                        { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Batterie vide", "Chargeur déconnecté", "Prise murale défectueuse", "Fusible chargeur grillé"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "L'appareil démarre-t-il sans batterie sur secteur ?", "Avez-vous essayé sur une autre prise ?"], solutionsTech: ["Tester l'alimentation externe.", "Vérifier le connecteur de charge.", "Remplacer la batterie.", "Contrôler l'embase interne."] },
                        { title: "Erreur Système (Message d'erreur)", causes: ["Tamis (colonnes) usés", "Filtres à particules sales", "Utilisation en haute altitude", "Fuite interne"], solutionsPatient: ["Est-ce que les deux filtres sur les côtés sont propres ?", "Voyez-vous un message de colonnes à changer ?", "L'appareil est-il bien aéré dans son sac ?"], solutionsTech: ["Mesurer la pureté O2.", "Remplacer les colonnes.", "Nettoyer ou remplacer les filtres.", "Vérifier l'étanchéité pneumatique."] },
                        { title: "Problème de détection respiratoire (Trigger)", causes: ["Canule mal positionnée", "Respiration buccale", "Canule trop longue ou pliée", "Capteur de trigger décalibré"], solutionsPatient: ["Respirez-vous bien par le nez ?", "La canule est-elle pliée ou écrasée ?", "Vérifiez que le raccord est bien vissé."], solutionsTech: ["Vérifier le capteur de trigger.", "Vérifier la valve de pulsion.", "Tester avec un simulateur de souffle."] },
                        { title: "Problème de batterie ou autonomie", causes: ["Batterie mal enclenchée", "Contacts sales", "Batterie en fin de vie", "Surchauffe batterie"], solutionsPatient: ["Avez-vous entendu le 'clic' ?", "Les contacts en métal sont-ils propres ?", "La batterie est-elle très chaude ?"], solutionsTech: ["Contrôler la capacité de la batterie.", "Nettoyer les connecteurs.", "Remplacer la batterie."] }
                    ] },
                    { id: "inogen-g4", name: "Inogen One G4", failures: [
                        { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Batterie vide", "Chargeur déconnecté", "Prise murale défectueuse"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "L'appareil démarre-t-il sans batterie sur secteur ?", "Avez-vous essayé sur une autre prise ?"], solutionsTech: ["Tester l'alimentation externe.", "Vérifier le connecteur de charge.", "Remplacer la batterie."] },
                        { title: "Erreur Système (Message d'erreur)", causes: ["Tamis (colonnes) usés", "Filtres à particules sales", "Fuite interne"], solutionsPatient: ["Est-ce que les deux filtres sur les côtés sont propres ?", "L'appareil est-il bien aéré dans son sac ?"], solutionsTech: ["Mesurer la pureté O2.", "Remplacer les colonnes.", "Vérifier l'étanchéité pneumatique."] },
                        { title: "Problème de batterie ou autonomie", causes: ["Batterie mal enclenchée", "Contacts sales", "Batterie en fin de vie"], solutionsPatient: ["Avez-vous entendu le 'clic' ?", "Les contacts en métal sont-ils propres ?"], solutionsTech: ["Contrôler la capacité de la batterie.", "Remplacer la batterie."] }
                    ] },
                    { id: "inogen-g5", name: "Inogen One G5", failures: [
                        { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Batterie vide", "Chargeur déconnecté", "Prise murale défectueuse"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "L'appareil démarre-t-il sans batterie sur secteur ?"], solutionsTech: ["Tester l'alimentation externe.", "Remplacer la batterie."] },
                        { title: "Problème de détection respiratoire (Trigger)", causes: ["Canule mal positionnée", "Respiration buccale", "Capteur de trigger décalibré"], solutionsPatient: ["Respirez-vous bien par le nez ?", "La canule est-elle pliée ou écrasée ?"], solutionsTech: ["Vérifier le capteur de trigger.", "Tester avec un simulateur de souffle."] },
                        { title: "Problème de batterie ou autonomie", causes: ["Batterie en fin de vie", "Contacts sales"], solutionsPatient: ["Les contacts en métal sont-ils propres ?", "La batterie est-elle très chaude ?"], solutionsTech: ["Contrôler la capacité de la batterie.", "Remplacer la batterie."] }
                    ] },
                    { id: "inogen-rove", name: "Inogen Rove 6", failures: [
                        { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Batterie vide", "Chargeur déconnecté"], solutionsPatient: ["Est-ce que la prise est bien branchée ?", "L'appareil démarre-t-il sans batterie sur secteur ?"], solutionsTech: ["Tester l'alimentation externe.", "Remplacer la batterie."] },
                        { title: "Erreur Système (Message d'erreur)", causes: ["Tamis (colonnes) usés", "Filtres à particules sales", "Fuite interne"], solutionsPatient: ["Les filtres sur les côtés sont-ils propres ?", "L'appareil est-il bien aéré dans son sac ?"], solutionsTech: ["Mesurer la pureté O2.", "Remplacer les colonnes.", "Vérifier l'étanchéité pneumatique."] },
                        { title: "Problème de batterie ou autonomie", causes: ["Batterie en fin de vie", "Contacts sales", "Surchauffe batterie"], solutionsPatient: ["Avez-vous entendu le 'clic' ?", "La batterie est-elle très chaude ?"], solutionsTech: ["Contrôler la capacité.", "Remplacer la batterie."] }
                    ] },
                    { id: "xpo2", name: "Invacare XPO2", failures: [
                        { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Batterie vide", "Chargeur défectueux", "Embase interne dessoudée"], solutionsPatient: ["Branchez l'appareil sur secteur.", "Vérifiez que le voyant du bloc d'alimentation est allumé.", "Retirez la batterie pour tester sur secteur seul."], solutionsTech: ["Tester la tension du chargeur.", "Vérifier le connecteur de charge.", "Vérifier les fusibles internes."] },
                        { title: "Problème de détection respiratoire (Trigger)", causes: ["Canule trop longue", "Respiration par la bouche", "Valve de pulsion bloquée"], solutionsPatient: ["Utilisez une canule courte (2m).", "Respirez fermement par le nez.", "Vérifiez le branchement du tuyau."], solutionsTech: ["Vérifier la valve de pulsion.", "Recalibrer le trigger.", "Tester le capteur de pression."] },
                        { title: "Erreur Système (Message d'erreur)", causes: ["Saturation des tamis", "Filtres encrassés", "Fuite interne"], solutionsPatient: ["Nettoyez les filtres d'entrée d'air.", "Assurez-vous que l'appareil n'est pas dans un sac fermé."], solutionsTech: ["Mesurer la pureté.", "Remplacer les colonnes.", "Vérifier l'étanchéité pneumatique."] }
                    ] },
                    { id: "simplygo-mini", name: "SimplyGo Mini", failures: [
                        { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Batterie vide", "Chargeur HS", "Carte"], solutionsPatient: ["Quand vous branchez le chargeur, est-ce qu'un voyant s'allume sur la machine ?", "Si vous retirez la batterie et branchez le chargeur, est-ce qu'il démarre ?"], solutionsTech: ["Tester l'alimentation externe.", "Tester sans batterie.", "Vérifier connectique interne."] },
                        { title: "Débit faible ou irrégulier", causes: ["Ventilation insuffisante", "Tubulure / canule obstruée", "Tamis moléculaires fatigués", "Débit réglé trop bas"], solutionsPatient: ["Est-ce que le sac de transport bouche les aérations ?", "La tubulure ou la canule est-elle pliée ou bouchée ?", "Le débit est-il réglé au minimum ?"], solutionsTech: ["Ne pas obstruer aérations.", "Mesurer la pureté O2.", "Vérifier ou remplacer tubulure/canule.", "Ajuster débit."] }
                    ] },
                    { id: "simplygo-mini-ld", name: "SimplyGo Mini Longue Durée", failures: [
                        { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Batterie vide", "Chargeur HS"], solutionsPatient: ["Quand vous branchez le chargeur, est-ce qu'un voyant s'allume ?", "Si vous retirez la batterie et branchez le chargeur, est-ce qu'il démarre ?"], solutionsTech: ["Tester l'alimentation externe.", "Tester sans batterie."] },
                        { title: "Débit faible ou irrégulier", causes: ["Ventilation insuffisante", "Tamis fatigués", "Fuite circuit", "Débit réglé trop bas"], solutionsPatient: ["Est-ce que le sac de transport bouche les aérations ?", "Vérifiez que la canule est bien connectée.", "Le débit est-il réglé au minimum ?"], solutionsTech: ["Ne pas obstruer aérations.", "Vérifier pureté O2.", "Remplacer colonnes.", "Ajuster débit."] }
                    ] },
                    { id: "zen-o-lite", name: "Zen-O Lite", failures: [
                        { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Batterie vide", "Chargeur HS"], solutionsPatient: ["Quand vous branchez le chargeur, est-ce qu'un voyant s'allume ?", "Si vous retirez la batterie et branchez le chargeur, est-ce qu'il démarre ?"], solutionsTech: ["Tester l'alimentation externe.", "Tester sans batterie."] },
                        { title: "Débit faible ou irrégulier", causes: ["Pompe défectueuse", "Tubulure / canule obstruée", "Filtre d'entrée colmaté", "Débit réglé trop bas"], solutionsPatient: ["L'appareil fait-il un bruit anormal ?", "La tubulure ou la canule est-elle pliée ?", "Le débit est-il réglé au minimum ?"], solutionsTech: ["Maintenance pompe.", "Vérifier ou remplacer tubulure/canule.", "Nettoyer les conduits d'entrée.", "Ajuster débit."] },
                        { title: "Problème de détection respiratoire (Trigger)", causes: ["Inspiration non détectée depuis 2 min", "Canule mal branchée", "Respiration buccale"], solutionsPatient: ["Vérifiez que la canule est bien branchée à l'appareil.", "Essayez de bien respirer par le nez."], solutionsTech: ["Tester le capteur de pression.", "Recalibrer la sensibilité du trigger."] },
                        { title: "Erreur Système (Message d'erreur)", causes: ["Chute de la pureté", "Filtres d'entrée sales", "Saturation des tamis"], solutionsPatient: ["Vérifiez que les entrées d'air sont libres.", "Le filtre à poussière est-il propre ?"], solutionsTech: ["Vérifier les colonnes.", "Mesurer la pureté à l'analyseur."] }
                    ] }
                ]
              },
              {
                id: "transportable",
                name: "Transportable",
                models: [
                    { id: "eclipse-3", name: "Eclipse 3", failures: [
                        { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Batterie vide", "Chargeur HS", "Connectique interne défaillante", "Carte mère HS"], solutionsPatient: ["Branchez l'appareil sur secteur.", "Le voyant du bloc d'alimentation est-il allumé ?", "Retirez la batterie et essayez sur secteur seul.", "Vérifiez que le câble n'est pas coupé."], solutionsTech: ["Tester la tension du chargeur (28V DC).", "Vérifier l'embase de charge.", "Vérifier les fusibles internes.", "Remplacer la carte mère."] },
                        { title: "Problème de batterie ou autonomie", causes: ["Autonomie < 10 %", "Batterie en fin de vie", "Défaut de communication batterie", "Surchauffe batterie"], solutionsPatient: ["Branchez sur secteur immédiatement.", "Retirez et remettez la batterie fermement.", "Laissez la batterie refroidir si elle est chaude."], solutionsTech: ["Vérifier la capacité de charge.", "Nettoyer les connecteurs batterie.", "Remplacer la batterie."] },
                        { title: "Débit faible ou irrégulier", causes: ["Canule pliée ou écrasée", "Filtre HEPA bouché", "Vanne de sortie bloquée"], solutionsPatient: ["Vérifiez que votre canule n'est pas pliée.", "Essayez avec une canule neuve.", "Sentez-vous l'air sortir au bout ?"], solutionsTech: ["Vérifier le capteur de débit.", "Remplacer le filtre HEPA de sortie.", "Tester la pression de sortie."] },
                        { title: "Erreur Système (Message d'erreur)", causes: ["Saturation des tamis moléculaires", "Filtre d'entrée colmaté", "Fuite interne", "Ventilation obstruée", "Environnement trop chaud"], solutionsPatient: ["Vérifiez que le filtre à poussière à l'arrière est propre.", "Placez l'appareil dans un endroit bien aéré.", "Sortez l'appareil de sa sacoche.", "Laissez refroidir l'appareil 30 minutes."], solutionsTech: ["Mesurer la pureté O2 avec un analyseur.", "Remplacer les colonnes de tamis.", "Vérifier le ventilateur interne.", "Nettoyage interne à l'air sec."] }
                    ] },
                    { id: "eclipse-5", name: "Eclipse 5", failures: [
                        { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Batterie vide", "Chargeur HS", "Carte mère HS"], solutionsPatient: ["Branchez l'appareil sur secteur.", "Le voyant du bloc d'alimentation est-il allumé ?", "Retirez la batterie et essayez sur secteur seul."], solutionsTech: ["Tester la tension du chargeur.", "Vérifier les fusibles internes.", "Remplacer la carte mère."] },
                        { title: "Problème de batterie ou autonomie", causes: ["Batterie en fin de vie", "Surchauffe batterie"], solutionsPatient: ["Branchez sur secteur immédiatement.", "Retirez et remettez la batterie fermement."], solutionsTech: ["Vérifier la capacité de charge.", "Remplacer la batterie."] },
                        { title: "Erreur Système (Message d'erreur)", causes: ["Saturation des tamis moléculaires", "Filtre d'entrée colmaté", "Fuite interne", "Environnement trop chaud"], solutionsPatient: ["Vérifiez que le filtre à poussière est propre.", "Placez l'appareil dans un endroit bien aéré.", "Laissez refroidir l'appareil 30 minutes."], solutionsTech: ["Mesurer la pureté O2.", "Remplacer les colonnes.", "Vérifier le ventilateur interne."] }
                    ] },
                    { id: "solo2", name: "Invacare SOLO2", failures: [
                        { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Batterie vide", "Chargeur HS", "Carte mère HS"], solutionsPatient: ["Branchez l'appareil sur secteur.", "Le voyant du bloc d'alimentation est-il allumé ?", "Retirez la batterie et essayez sur secteur seul."], solutionsTech: ["Tester la tension du chargeur.", "Vérifier les fusibles internes.", "Remplacer la carte mère."] },
                        { title: "Débit faible ou irrégulier", causes: ["Canule pliée ou écrasée", "Filtre HEPA bouché"], solutionsPatient: ["Vérifiez que votre canule n'est pas pliée.", "Essayez avec une canule neuve."], solutionsTech: ["Remplacer le filtre HEPA de sortie.", "Tester la pression de sortie."] },
                        { title: "Erreur Système (Message d'erreur)", causes: ["Saturation des tamis", "Fuite interne", "Environnement trop chaud"], solutionsPatient: ["Placez l'appareil dans un endroit bien aéré.", "Sortez l'appareil de sa sacoche.", "Laissez refroidir 30 minutes."], solutionsTech: ["Mesurer la pureté O2.", "Remplacer les colonnes.", "Vérifier le ventilateur."] }
                    ] },
                    { id: "simplygo", name: "SimplyGo", failures: [
                        { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Batterie vide", "Chargeur HS", "Carte mère HS"], solutionsPatient: ["Branchez l'appareil sur secteur.", "Le voyant du bloc d'alimentation est-il allumé ?", "Retirez la batterie et essayez sur secteur seul."], solutionsTech: ["Tester la tension du chargeur.", "Vérifier les fusibles internes.", "Remplacer la carte mère."] },
                        { title: "Problème de batterie ou autonomie", causes: ["Batterie en fin de vie", "Surchauffe batterie"], solutionsPatient: ["Branchez sur secteur immédiatement.", "Laissez la batterie refroidir si elle est chaude."], solutionsTech: ["Vérifier la capacité de charge.", "Remplacer la batterie."] },
                        { title: "Débit faible ou irrégulier", causes: ["Canule pliée ou écrasée", "Filtre HEPA bouché"], solutionsPatient: ["Vérifiez que votre canule n'est pas pliée.", "Essayez avec une canule neuve."], solutionsTech: ["Remplacer le filtre HEPA.", "Tester la pression de sortie."] },
                        { title: "Erreur Système (Message d'erreur)", causes: ["Saturation des tamis", "Ventilation obstruée", "Environnement trop chaud"], solutionsPatient: ["Sortez l'appareil de sa sacoche.", "Vérifiez que les grilles sont libres.", "Laissez refroidir 30 minutes."], solutionsTech: ["Mesurer la pureté O2.", "Vérifier le ventilateur interne.", "Remplacer les colonnes."] }
                    ] },
                    { id: "zen-o", name: "Zen-O", failures: [
                        { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Batterie vide", "Chargeur HS", "Carte mère HS"], solutionsPatient: ["Branchez l'appareil sur secteur.", "Le voyant du bloc d'alimentation est-il allumé ?", "Vérifiez que le câble n'est pas coupé."], solutionsTech: ["Tester la tension du chargeur.", "Vérifier les fusibles internes.", "Remplacer la carte mère."] },
                        { title: "Débit faible ou irrégulier", causes: ["Canule pliée ou écrasée", "Filtre HEPA bouché", "Vanne de sortie bloquée"], solutionsPatient: ["Vérifiez que votre canule n'est pas pliée.", "Sentez-vous l'air sortir au bout ?"], solutionsTech: ["Vérifier le capteur de débit.", "Remplacer le filtre HEPA.", "Tester la pression de sortie."] },
                        { title: "Erreur Système (Message d'erreur)", causes: ["Saturation des tamis", "Fuite interne", "Environnement trop chaud"], solutionsPatient: ["Placez l'appareil dans un endroit bien aéré.", "Sortez l'appareil de sa sacoche.", "Laissez refroidir 30 minutes."], solutionsTech: ["Mesurer la pureté O2.", "Remplacer les colonnes.", "Vérifier le ventilateur interne."] }
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
                    { title: "Pas de débit d'oxygène", causes: ["Valve de sortie gelée", "Sélecteur de débit cassé", "Canule obstruée", "Niveau de liquide trop bas"], solutionsPatient: ["Sentez-vous de l'air sortir au bout de la canule ?", "Voyez-vous du givre blanc sur le dessus de l'appareil ?", "L'aiguille de l'indicateur est-elle bien dans le vert ?", "Essayez avec une autre canule neuve."], solutionsTech: ["Décongeler l'appareil à température ambiante.", "Vérifier le limiteur de débit interne.", "Remplacer le bouton sélecteur si l'axe est fendu.", "Contrôler la pression de tête de la cuve mère."] },
                    { title: "Panne de l'indicateur de niveau", causes: ["Pile 9V interne épuisée", "Capteur de pression différentielle HS", "Flotteur bloqué par la glace"], solutionsPatient: ["L'indicateur reste-t-il noir quand vous appuyez sur le bouton ?", "Avez-vous bien rempli l'appareil jusqu'au 'crachement' ?", "Secouez doucement l'appareil, entendez-vous le liquide bouger ?"], solutionsTech: ["Remplacer la pile 9V.", "Vérifier la tension aux bornes du capteur.", "Dégivrer complètement l'unité pour libérer le flotteur.", "Calibrer l'affichage du niveau via les potentiomètres."] }
                ] },
                { id: "companion-t", name: "Companion 1000T", failures: [
                    { title: "Bruit de sifflement continu", causes: ["Soupape de sécurité active", "Fuite au joint de remplissage", "Pression interne trop élevée", "Choc sur l'embase"], solutionsPatient: ["Entendez-vous un sifflement même quand vous ne l'utilisez pas ?", "Y a-t-il de la glace sur le connecteur de remplissage ?", "L'appareil a-t-il subi une chute récemment ?"], solutionsTech: ["Vérifier la pression de tarage de la soupape.", "Remplacer le joint à lèvres du connecteur mâle.", "Contrôler le vide du vase Dewar.", "Nettoyer les portées de joint à l'alcool."] }
                ] },
                { id: "companion-500", name: "Companion 500", failures: [
                    { title: "Pas de débit", causes: ["Thermostat défectueux", "Valve gelée"], solutionsPatient: ["Sentez-vous de l'air sortir ?", "Voyez-vous du givre sur la valve ?"], solutionsTech: ["Remplacer thermostat.", "Décongélation valve."] }
                ] },
                { id: "sprint", name: "Companion Sprint", failures: [
                    { title: "Fuite de liquide", causes: ["Joint usé"], solutionsPatient: ["Voyez-vous du liquide couler ?"], solutionsTech: ["Vérifier et remplacer joint."] },
                    { title: "Faible autonomie", causes: ["Remplissage incorrect"], solutionsPatient: ["Remplissez-vous bien jusqu'à saturation (crachement) ?"], solutionsTech: ["Former utilisateur.", "Corriger remplissage."] },
                    { title: "Givre important", causes: ["Utilisation continue à des débits élevés"], solutionsPatient: ["Laissez l'appareil au repos pendant au moins 1 heure après usage."], solutionsTech: ["Vérifier l'isolation interne."] },
                    { title: "Le bouton de remplissage ne s'enclenche pas", causes: ["Le mécanisme est resté en position fermée"], solutionsPatient: ["Tirez sur le bouton jusqu'à ce qu'il s'enclenche en position 'ouvert' avant de retenter la connexion."], solutionsTech: ["Vérifier le ressort de rappel."] }
                ] },
                { id: "stroller", name: "Companion Stroller", failures: [
                    { title: "Fuite de liquide", causes: ["Joint usé"], solutionsPatient: ["Voyez-vous du liquide couler ?"], solutionsTech: ["Vérifier et remplacer joint."] },
                    { title: "Faible autonomie", causes: ["Remplissage incorrect"], solutionsPatient: ["Remplissez-vous bien jusqu'à saturation (crachement) ?"], solutionsTech: ["Former utilisateur.", "Corriger remplissage."] }
                ] },
                { id: "freelox-05", name: "Freelox 0.5L", failures: [
                    { title: "Blocage de vapeur", causes: ["Tube de vapeur bouché"], solutionsPatient: ["Le tube est-il plié ?"], solutionsTech: ["Nettoyage tube de vapeur."] },
                    { title: "Le réservoir portable ne se remplit pas", causes: ["La valve de remplissage est peut-être gelée ou mal connectée"], solutionsPatient: ["Vérifiez la connexion et, si du givre bloque la valve, attendez qu'elle dégèle naturellement avant de réessayer."], solutionsTech: ["Vérifier la valve de remplissage."] }
                ] },
                { id: "freelox-12", name: "Freelox 1.2L", failures: [
                    { title: "Blocage de vapeur", causes: ["Tube de vapeur bouché"], solutionsPatient: ["Le tube est-il plié ?"], solutionsTech: ["Nettoyage tube de vapeur."] },
                    { title: "Le réservoir portable ne se remplit pas", causes: ["Valve gelée ou mal connectée"], solutionsPatient: ["Vérifiez la connexion et attendez le dégel naturel si nécessaire."], solutionsTech: ["Vérifier valve."] }
                ] },
                { id: "joggy", name: "Joggy", failures: [
                    { title: "Blocage de vapeur", causes: ["Tube de vapeur bouché"], solutionsPatient: ["Le tube est-il plié ?"], solutionsTech: ["Nettoyage tube de vapeur."] },
                    { title: "Le réservoir portable ne se remplit pas", causes: ["Valve gelée"], solutionsPatient: ["Vérifiez la connexion et laissez dégeler si besoin."], solutionsTech: ["Vérifier valve."] }
                ] },
                { id: "helios-h300", name: "Helios H300", failures: [
                    { title: "Débit faible ou irrégulier", causes: ["Pompe usée", "Bulles dans liquide"], solutionsPatient: ["Entendez-vous un bruit irrégulier ?"], solutionsTech: ["Remplacer pompe.", "Purger système."] },
                    { title: "Pas de débit", causes: ["Le réservoir est vide ou la canule est débranchée/obstruée"], solutionsPatient: ["Vérifiez le niveau d'oxygène sur l'indicateur et assurez-vous que la canule est correctement fixée."], solutionsTech: ["Vérifier le trigger pneumatique."] }
                ] },
                { id: "helios-marathon", name: "Helios Marathon 850", failures: [
                    { title: "Débit faible ou irrégulier", causes: ["Pompe usée", "Bulles dans liquide"], solutionsPatient: ["Entendez-vous un bruit irrégulier ?"], solutionsTech: ["Remplacer pompe.", "Purger système."] }
                ] },
                { id: "cuve-companion-41", name: "Cuve Companion 41L", failures: [
                    { title: "Fuite liquide", causes: ["Joint détérioré"], solutionsPatient: ["Entendez-vous une fuite continue ?"], solutionsTech: ["Remplacer joint."] }
                ] },
                { id: "cuve-companion-45", name: "Cuve Companion 45L", failures: [
                    { title: "Fuite de liquide", causes: ["Joint détérioré"], solutionsPatient: ["Entendez-vous une fuite continue ?"], solutionsTech: ["Remplacer joint."] }
                ] },
                { id: "cuve-freelox-32", name: "Cuve Freelox 32L", failures: [
                    { title: "Alarme température", causes: ["Surcharge de cuve"], solutionsPatient: ["L'alarme sonne-t-elle en continu ?"], solutionsTech: ["Respecter capacité max."] }
                ] },
                { id: "cuve-freelox-44", name: "Cuve Freelox 44L", failures: [
                    { title: "Alarme température", causes: ["Surcharge de cuve"], solutionsPatient: ["L'alarme sonne-t-elle en continu ?"], solutionsTech: ["Respecter capacité max."] }
                ] }
            ] 
          }
        ]
      },
      { 
        id: "ppc", 
        name: "PPC", 
        models: [
            { id: "s9", name: "S9 (AutoSet, Elite)", failures: [
                { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Cordon débranché", "Bloc alim HS", "Prise murale défectueuse"], solutionsPatient: ["Vérifiez le branchement mural et sur l'appareil.", "Le voyant du bloc secteur est-il vert ?", "Essayez sur une autre prise."], solutionsTech: ["Tester le bloc d'alimentation 90W.", "Vérifier le connecteur d'embase interne.", "Remplacer le cordon secteur."] },
                { title: "Erreur Système (Message d'erreur)", causes: ["Filtre colmaté", "Entrée d'air obstruée", "Pièce trop chaude"], solutionsPatient: ["Le petit filtre à l'arrière est-il propre ?", "Y a-t-espace autour de la machine ?", "Éloignez l'appareil du radiateur."], solutionsTech: ["Remplacer le filtre.", "Nettoyer la turbine (poussière).", "Vérifier le ventilateur interne."] },
                { title: "Problème d'humidification (Air sec ou condensation)", causes: ["Chambre froide", "Réglage humidité trop haut", "Tuyau non isolé"], solutionsPatient: ["Videz l'eau accumulée dans le tuyau.", "Baissez le niveau d'humidité.", "Utilisez une housse sur le tuyau."], solutionsTech: ["Vérifier la sonde thermique.", "Conseiller l'usage d'un ClimateLine."] },
                { title: "Erreur de carte SD", causes: ["Carte mal insérée", "Protection en écriture", "Carte HS"], solutionsPatient: ["Le petit loquet de la carte est-il bien vers le haut ?", "Retirez et remettez la carte fermement."], solutionsTech: ["Formater la carte en FAT32.", "Remplacer la carte SD."] }
            ] },
            { id: "airsense-10", name: "S10 (AutoSet, Elite)", failures: [
                { title: "Fuites importantes (Masque ou Circuit)", causes: ["Mauvais ajustement", "Coussin usé", "Harnais trop lâche"], solutionsPatient: ["Votre silicone est-il devenu jauni ou rigide ?", "Avez-vous bien ajusté les sangles ?", "Vérifiez que le masque correspond à votre taille."], solutionsTech: ["Examinez le coussin.", "Utiliser le gabarit de taille.", "Vérifier la pression IPAP/EPAP."] },
                { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Cordon déconnecté", "Alimentation HS", "Embase interne dessoudée"], solutionsPatient: ["L'écran s'allume-t-il au branchement ?", "Le fil est-il abîmé ?", "Vérifiez la prise murale avec une lampe."], solutionsTech: ["Tester le bloc 90W.", "Vérifier la continuité électrique.", "Ressouder le connecteur interne."] },
                { title: "Erreur Système (Message d'erreur)", causes: ["Entrée d'air bouchée", "Humidité dans le moteur", "Usure naturelle"], solutionsPatient: ["Le filtre à air arrière est-il propre ?", "Avez-vous renversé de l'eau sur l'appareil ?"], solutionsTech: ["Remplacer le filtre.", "Laisser sécher.", "Tester la turbine en mode service."] },
                { title: "Problème d'humidification (Air sec ou condensation)", causes: ["Joint de réservoir fissuré", "Réservoir calcaire"], solutionsPatient: ["Voyez-vous de l'eau sous l'appareil ?", "Le joint en silicone est-il bien propre et plat ?"], solutionsTech: ["Nettoyer le calcaire.", "Remplacer le joint silicone."] },
                { title: "Erreur Système (Message d'erreur)", causes: ["Filtre à air sale", "Obstruction de la grille d'entrée"], solutionsPatient: ["Le filtre à l'arrière est-il blanc ou gris/noir ?", "Assurez-vous qu'aucun objet n'est à moins de 5cm de l'entrée d'air."], solutionsTech: ["Changer le filtre.", "Dépoussiérer l'entrée d'air turbine.", "Vérifier le capteur de débit."] },
                { title: "Erreur de carte SD", causes: ["Carte mal insérée", "Protection en écriture", "Carte HS"], solutionsPatient: ["Le petit loquet de la carte est-il bien vers le haut ?", "Retirez et remettez la carte fermement."], solutionsTech: ["Formater la carte en FAT32.", "Remplacer la carte SD."] }
            ] },
            { id: "s11", name: "S11 (AutoSet)", failures: [
                { title: "Problème d'affichage (Écran noir ou figé)", causes: ["Doigts humides", "Bug logiciel", "Interférences"], solutionsPatient: ["Avez-vous les mains bien sèches ?", "Débranchez et rebranchez l'appareil.", "Nettoyez l'écran avec un chiffon sec."], solutionsTech: ["Mise à jour firmware.", "Tester l'écran en mode SAV.", "Vérifier la nappe de l'écran."] },
                { title: "Fuites importantes (Masque ou Circuit)", causes: ["Bac mal inséré", "Joint mal mis", "Tuyau mal cliqué"], solutionsPatient: ["Le bac a-t-il bien fait 'clic' ?", "Vérifiez que le coude arrière est bien verrouillé."], solutionsTech: ["Réinsérer le bac.", "Vérifier le joint interne.", "Vérifier l'étanchéité du réservoir."] },
                { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Alimentation", "Connectique", "Carte HS", "Surtension"], solutionsPatient: ["La prise est-elle branchée ?", "L'écran s'allume-t-il ?", "Testé on une autre prise ?"], solutionsTech: ["Tester bloc alim.", "Changer cordon.", "Vérifier carte.", "Contrôler fusible."] },
                { title: "Erreur de carte SD", causes: ["Carte mal insérée", "Protection en écriture", "Carte HS"], solutionsPatient: ["Le petit loquet de la carte est-il bien vers le haut ?", "Retirez et remettez la carte fermement."], solutionsTech: ["Formater la carte en FAT32.", "Remplacer la carte SD."] }
            ] },
            { id: "dreamstation-1", name: "DreamStation 1", failures: [
                { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Mauvais transfo", "Fiche centrale tordue", "Bloc HS"], solutionsPatient: ["Utilisez-vous le bloc Philips d'origine ?", "La petite tige au centre de la fiche est-elle tordue ?"], solutionsTech: ["Vérifier puissance 80W.", "Redresser la tige avec précaution.", "Tester avec un autre bloc."] },
                { title: "Problème d'humidification (Air sec ou condensation)", causes: ["Bac mal inséré", "Trop plein", "Joint embase usé"], solutionsPatient: ["Avez-vous dépassé le trait MAX ?", "Avez-vous entendu le clic en remettant le bac ?"], solutionsTech: ["Remplacer le joint d'embase.", "Vérifier l'étanchéité du réservoir."] },
                { title: "Pression insuffisante ou instable", causes: ["Tuyau plié", "Filtre blanc colmaté", "Obstruction turbine"], solutionsPatient: ["Le tuyau est-il bien déroulé ?", "Le petit filtre blanc est-il noir ou sale ?"], solutionsTech: ["Changer le filtre blanc.", "Déplier le tuyau.", "Vérifier le moteur."] }
            ] },
            { id: "dreamstation-2", name: "DreamStation 2", failures: [
                { title: "Problème d'affichage (Écran noir ou figé)", causes: ["Mains humides", "Bug logiciel"], solutionsPatient: ["Essuyez l'écran.", "Débranchez 30 secondes pour réinitialiser."], solutionsTech: ["Mise à jour logiciel.", "Remplacement de l'unité écran."] },
                { title: "Fuites importantes (Masque ou Circuit)", causes: ["Tuyau mal branché", "Circuit percé", "Joint usé"], solutionsPatient: ["Le tuyau est-il bien cliqué à l'arrière ?", "Sentez-vous de l'air s'échapper au raccord ?"], solutionsTech: ["Vérifier raccordement coude.", "Changer le joint de sortie."] }
            ] },
            { id: "prisma-smart", name: "Prisma (Smart, Soft)", failures: [
                { title: "Fuites importantes (Masque ou Circuit)", causes: ["Fuite importante au masque", "Déconnexion"], solutionsPatient: ["Le masque bouge-t-il pendant la nuit ?", "Le tuyau est-il bien branché ?"], solutionsTech: ["Désactiver Auto-OFF.", "Ajuster le seuil de détection de fuite."] },
                { title: "Problème d'humidification (Air sec ou condensation)", causes: ["Humidité trop basse", "Bac vide"], solutionsPatient: ["L'air est-il trop froid ?", "Avez-vous de l'eau dans le bac le matin ?"], solutionsTech: ["Augmenter la chauffe.", "Vérifier la plaque chauffante."] }
            ] },
            { id: "remstar-auto", name: "REMstar Auto", failures: [
                { title: "Bruit anormal ou vibrations", causes: ["Humidificateur mal verrouillé", "Joint usé", "Bac fissuré"], solutionsPatient: ["Les deux parties sont-elles bien clipsées ?", "Voyez-vous de l'eau couler ?"], solutionsTech: ["Vérifier les joints noirs.", "Remplacer l'embase de l'humidificateur."] },
                { title: "Problème d'humidification (Air sec ou condensation)", causes: ["Contacts oxydés", "Plaque HS", "Mode ECO"], solutionsPatient: ["Les petits picots en métal sont-ils propres ?", "Le réservoir est-il bien enfoncé ?"], solutionsTech: ["Nettoyer les contacts.", "Tester la résistance de la plaque."] }
            ] },
            { id: "fp-icon", name: "ICON", failures: [
                { title: "Problème d'humidification (Air sec ou condensation)", causes: ["Mode ECO activé", "Chambre mal insérée", "Plaque HS"], solutionsPatient: ["Voyez-vous le symbole de chauffe ?", "Le bac est-il bien au fond ?"], solutionsTech: ["Désactiver le mode ECO.", "Changer l'embase chauffante."] },
                { title: "Pression insuffisante ou instable", causes: ["Altitude élevée", "Usure moteur", "Fuite interne"], solutionsPatient: ["Vivez-vous à la montagne ?", "Le moteur fait-il un bruit de sifflement ?"], solutionsTech: ["Ajuster le réglage d'altitude.", "Remplacer la turbine."] }
            ] },
            { id: "nea", name: "NÉA", failures: [ 
                { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Cordon mal branché", "Bloc alim défectueux", "Carte HS"], solutionsPatient: ["Voyez-vous un voyant sur le bloc noir du fil ?", "Testez sur une autre prise murale."], solutionsTech: ["Tester la tension du bloc.", "Vérifier le connecteur d'embase."] },
                { title: "Problème d'humidification (Air sec ou condensation)", causes: ["Humidité basse", "Bac vide", "Plaque HS"], solutionsPatient: ["Reste-t-il de l'eau le matin ?", "Avez-vous augmenté le chauffage dans le menu ?"], solutionsTech: ["Augmenter le réglage.", "Vérifier la chauffe.", "Tester la sonde."] },
                { title: "Fuites importantes (Masque ou Circuit)", causes: ["Masque mal mis", "Coussin usé", "Taille inadaptée"], solutionsPatient: ["Sentez-vous de l'air s'échapper vers vos yeux ?", "Le silicone du masque est-il encore bien souple ?"], solutionsTech: ["Vérifier la taille.", "Remplacer coussin.", "Changer harnais."] }
            ] },
            { id: "z2-auto", name: "Z2 Auto", failures: [
                { title: "Bruit anormal ou vibrations", causes: ["Filtre manquant", "Usure turbine", "Mauvais support"], solutionsPatient: ["Le petit filtre est-il bien en place ?", "Posez-vous l'appareil sur un tapis ou une surface dure ?"], solutionsTech: ["Remplacer la turbine.", "Utiliser le silencieux Q-Tube."] },
                { title: "Pression insuffisante ou instable", causes: ["Tuyau percé", "Masque débranché", "Filtre bouché"], solutionsPatient: ["Le tuyau est-il bien enfoncé ?", "Le filtre est-il gris ?"], solutionsTech: ["Vérifier l'étanchéité.", "Changer le filtre."] }
            ] },
            { id: "aircurve-10", name: "AirCurve 10", failures: [
                { title: "Problème d'humidification (Air sec ou condensation)", causes: ["Humidité trop forte", "Chambre froide", "Absence de circuit chauffant"], solutionsPatient: ["Entendez-vous un clapotis dans le tuyau ?"], solutionsTech: ["Réduire l'humidité.", "Utiliser ClimateLineAir.", "Ajouter une housse."] }
            ] }
        ]
      },
      { 
        id: "vaa", 
        name: "Ventilation Assistée (VAA)",
        models: [
          { id: "prisma-cr", name: "Prisma CR", failures: [
              { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Cordon secteur", "Batterie HS", "Carte mère"], solutionsPatient: ["Brancher sur secteur", "Vérifier le voyant de charge"], solutionsTech: ["Tester l'alimentation", "Remplacer la batterie"] },
              { title: "Pression insuffisante ou instable", causes: ["Fuite masque", "Circuit percé", "Filtre colmaté"], solutionsPatient: ["Réajuster le masque", "Vérifier le filtre"], solutionsTech: ["Vérifier la calibration", "Vérifier la turbine"] },
              { title: "Fuites importantes (Masque ou Circuit)", causes: ["Fuite masque", "Déconnexion", "Bac mal inséré"], solutionsPatient: ["Vérifier branchement", "Masque fuit ?", "Tuyau bien branché ?"], solutionsTech: ["Vérifier étanchéité circuit", "Vérifier joint bac"] },
              { title: "Problème d'humidification (Air sec ou condensation)", causes: ["Réglage bas", "Bac vide"], solutionsPatient: ["Vérifier niveau d'eau", "Ajuster réglage"], solutionsTech: ["Tester plaque chauffante"] },
              { title: "Bruit anormal ou vibrations", causes: ["Turbine", "Filtre mal mis"], solutionsPatient: ["Vérifier filtre", "Stabilité"], solutionsTech: ["Remplacer turbine"] }
          ] },
          { id: "dreamstation-bipap-autosv", name: "DreamStation BiPAP autoSV", failures: [
              { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Fiche centrale tordue", "Mauvais bloc Philips (60W)", "Bloc HS"], solutionsPatient: ["Vérifier branchement", "Bloc d'origine Philips ?", "Tige centrale droite ?"], solutionsTech: ["Vérifier puissance 80W", "Redresser tige", "Tester avec bloc neuf"] },
              { title: "Pression insuffisante ou instable", causes: ["Obstruction circuit", "Filtre colmaté", "Fuite massive", "Moteur fatigué"], solutionsPatient: ["Vérifier branchement", "Vérifier si tuyau plié", "Réajuster le masque"], solutionsTech: ["Inspecter tuyau", "Remplacer filtre", "Réajuster masque", "Contrôler turbine"] },
              { title: "Fuites importantes (Masque ou Circuit)", causes: ["Bac mal clipsé", "Joint usé"], solutionsPatient: ["Vérifier clipsage bac"], solutionsTech: ["Remplacer joint"] },
              { title: "Problème d'humidification (Air sec ou condensation)", causes: ["Plaque HS", "Réglage"], solutionsPatient: ["Augmenter niveau"], solutionsTech: ["Tester plaque"] }
          ] },
          { id: "bipap-autosv-advanced", name: "BiPAP autoSV Advanced", failures: [
              { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Perte secteur", "Faux contact", "Bloc alim HS"], solutionsPatient: ["Vérifier branchement", "Machine s'arrête si fil bouge ?", "Prise murale OK ?"], solutionsTech: ["Vérifier cordon", "Check prise murale", "Tester bloc"] },
              { title: "Pression insuffisante ou instable", causes: ["Valve bloquée", "Obstruction", "Filtre sale"], solutionsPatient: ["Vérifier si le tuyau est plié", "Vérifier le branchement", "Vérifier la propreté du filtre"], solutionsTech: ["Nettoyer valve", "Vérifier Pmax", "Changer filtre"] },
              { title: "Fuites importantes (Masque ou Circuit)", causes: ["Joint humidificateur", "Masque"], solutionsPatient: ["Vérifier masque"], solutionsTech: ["Remplacer embase"] },
              { title: "Problème d'humidification (Air sec ou condensation)", causes: ["Humidificateur HS", "Réglage"], solutionsPatient: ["Vérifier voyant"], solutionsTech: ["Tester plaque"] }
          ] },
          { id: "aircurve-10-cs", name: "AirCurve 10 CS PaceWave", failures: [
              { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Bloc HS", "Turbine bloquée", "Cordon"], solutionsPatient: ["Écran s'allume ?", "Message Moteur ?"], solutionsTech: ["Tester bloc 90W", "Reset machine"] },
              { title: "Fuites importantes (Masque ou Circuit)", causes: ["Bac mal inséré", "Joint abîmé", "Bac fendu"], solutionsPatient: ["Réservoir enfoncé à fond ?", "Joint propre et bien logé ?"], solutionsTech: ["Réinsérer bac", "Vérifier joint silicone", "Changer réservoir"] },
              { title: "Pression insuffisante ou instable", causes: ["Fuite", "Filtre bouché"], solutionsPatient: ["Vérifier masque", "Vérifier filtre"], solutionsTech: ["Calibration turbine"] },
              { title: "Problème d'humidification (Air sec ou condensation)", causes: ["Réglage", "Circuit"], solutionsPatient: ["Baisser niveau"], solutionsTech: ["Vérifier sonde"] }
          ] },
          { id: "aircurve-10-vauto", name: "AirCurve 10 VAuto", failures: [
              { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Alim", "Prise", "Faux contact"], solutionsPatient: ["Vérifier branchement", "Voyant vert sur bloc alim ?"], solutionsTech: ["Check branchements", "Tester autre alim"] },
              { title: "Erreur Système (Message d'erreur)", causes: ["Filtre bouché", "Panne", "Humidité turbine"], solutionsPatient: ["Filtre arrière sale ?", "Eau renversée ?"], solutionsTech: ["Reset machine", "Remplacer filtre", "SAV Turbine"] },
              { title: "Pression insuffisante ou instable", causes: ["Fuite massive"], solutionsPatient: ["Réajuster masque"], solutionsTech: ["Check capteurs"] },
              { title: "Fuites importantes (Masque ou Circuit)", causes: ["Bac mal mis"], solutionsPatient: ["Pousser le bac"], solutionsTech: ["Remplacer joint"] }
          ] }
        ]
      },
      {
        id: "vni",
        name: "VNI",
        subTypes: [
            { 
                id: "niv-i", name: "NIV I", brands: [
                    { id: "lowenstein", name: "Löwenstein", models: [
                        { id: "prisma-30st", name: "Prisma 30ST", failures: [
                            { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Alimentation", "Connectique", "Carte"], solutionsPatient: ["Quand vous appuyez sur Marche, est-ce que l'écran s'éclaire ?", "La prise est-elle bien enfoncée des deux côtés ?"], solutionsTech: ["Tester le bloc d'alimentation.", "Remplacer la carte électronique."] },
                            { title: "Pression insuffisante ou instable", causes: ["Masque", "Circuit", "Filtre"], solutionsPatient: ["Est-ce que le masque est bien mis sur le visage ?", "Le tuyau n'est pas décroché ou percé ?", "Le filtre est-il propre ?"], solutionsTech: ["Vérifier la calibration.", "Rechercher une fuite interne.", "Remplacer la turbine."] },
                            { title: "Alarme 'Pression faible' ou 'Fuite'", causes: ["Fuite importante dans le circuit", "Masque mal ajusté", "Usure de la turbine", "Tuyau percé ou fissuré"], solutionsPatient: ["Est-ce que ça sonne tout le temps, ou juste quand vous bougez ?", "Sentez-vous de l'air qui s'échappe près de vos yeux ?", "Vérifiez que le tuyau n'est pas coincé sous le lit.", "Assurez-vous que le circuit est bien cliqué à l'arrière."], solutionsTech: ["Utiliser la fonction 'Mask Fit' pour visualiser l'étanchéité.", "Vérifier la pression prescrite (IPAP/EPAP).", "Lancer un test turbine en menu service.", "Inspecter le joint de sortie d'air interne."] },
                            { title: "Erreur Système (Message d'erreur)", causes: ["Logiciel", "Carte"], solutionsPatient: ["Pouvez-vous débrancher la prise, attendre 10 secondes et rebrancher ?", "Qu'est-ce qui est écrit sur l'écran ?"], solutionsTech: ["Consulter le code erreur.", "Remplacer la carte principale."] },
                            { title: "Problème d'humidification (Air sec ou condensation)", causes: ["Humidificateur mal inséré", "Niveau d'humidité réglé incorrectement", "Réservoir d'eau vide ou entartré"], solutionsPatient: ["Vérifier que le réservoir est bien en place", "Ajuster le réglage d'humidité", "Nettoyer le réservoir"], solutionsTech: ["Vérifier la connexion électrique de l'humidificateur", "Tester la résistance chauffante", "Remplacer l'humidificateur si défectueux"] }
                        ]},
                        { id: "prismaline", name: "prismaLine (Série WM100TD)", failures: [
                            { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Le cordon secteur n'est pas branché", "La prise de courant est hors tension ou le disjoncteur a sauté", "Le bloc d'alimentation est défectueux", "Fusible interne de l'appareil grillé"], solutionsPatient: ["Brancher correctement le cordon sur l'appareil et sur la prise", "Tester la prise avec un autre appareil électrique", "Inspecter le câble sur toute sa longueur"], solutionsTech: ["Vérifier la continuité du cordon secteur.", "Mesurer la tension de sortie du bloc (V DC).", "Vérifier et remplacer le fusible interne si accessible."] },
                            { title: "Problème d'affichage (Écran noir ou figé)", causes: ["L'appareil est en mode 'Éco énergie'", "La carte SD est défectueuse ou mal lue", "Une erreur interne logicielle est survenue", "Nappe de l'écran LCD déconnectée"], solutionsPatient: ["Appuyer brièvement sur la touche I/O (Marche/Arrêt)", "Retirer la carte SD et redémarrer l'appareil", "Débrancher et rebrancher l'appareil après 1 minute"], solutionsTech: ["Désactiver le mode 'Éco énergie' dans le menu clinicien.", "Tester avec une carte SD neuve formatée en FAT32.", "Réinstaller le firmware.", "Vérifier la connexion de la nappe écran."] },
                            { title: "Pression insuffisante ou instable", causes: ["Le filtre à air (gris) est colmaté", "Fuite excessive au masque", "Le tuyau est percé, fendu ou mal raccordé", "Usure des roulements de la turbine"], solutionsPatient: ["Remplacer immédiatement le filtre à air", "Réajuster le masque et vérifier les sangles", "Inspecter le tuyau sur toute sa longueur"], solutionsTech: ["Vérifier la calibration du capteur de pression.", "Inspecter l'étanchéité interne (tubulures).", "Vérifier le nombre d'heures de la turbine.", "Mesurer la pression réelle avec un manomètre externe."] },
                            { title: "Message 'Error 702' (Présence d'eau dans la turbine)", causes: ["Appareil basculé avec humidificateur plein", "Réservoir trop rempli (débordement)", "Condensation massive retournée dans l'appareil"], solutionsPatient: ["Vider et retirer l'humidificateur immédiatement", "Incliner l'appareil vers l'avant pour évacuer l'eau", "Laisser sécher à l'air libre 24h sans brancher"], solutionsTech: ["Ouvrir l'appareil pour sécher les composants à l'air sec.", "Vérifier l'absence de corrosion sur la carte mère.", "Tester l'étanchéité du réservoir prismaAQUA.", "Remplacer le capteur d'humidité si le code persiste."] },
                            { title: "Problème d'humidification (Air sec ou condensation)", causes: ["Niveau d'humidité réglé trop bas ou trop haut", "Réservoir d'eau vide ou mal inséré", "Température ambiante trop froide", "Tuyau non chauffant ou non isolé"], solutionsPatient: ["Vérifier le niveau d'eau dans le réservoir", "Ajuster le réglage d'humidité dans le menu", "Placer l'appareil plus bas que la tête", "Utiliser une housse de tuyau"], solutionsTech: ["Vérifier la résistance chauffante de l'humidificateur", "Contrôler la sonde de température ambiante", "Tester l'étanchéité du réservoir", "Mettre à jour le firmware si bug de régulation"] }
                        ]}
                    ]},
                    { id: "philips", name: "Philips", models: [
                        { id: "avaps", name: "AVAPS", failures: [
                            { title: "L'appareil ne démarre pas", causes: ["Alimentation", "Connectique", "Carte"], solutionsPatient: ["Quand vous appuyez sur Marche, est-ce que l'écran s'éclaire ?", "La prise est-elle bien enfoncée des deux côtés ?"], solutionsTech: ["Tester le bloc d'alimentation.", "Remplacer la carte électronique."] },
                            { title: "Pression instable / Fuites", causes: ["Masque", "Circuit", "Filtre"], solutionsPatient: ["Est-ce que le masque est bien mis sur le visage ?", "Le tuyau n'est pas décroché ou percé ?", "Le filtre est-il propre ?"], solutionsTech: ["Vérifier la calibration.", "Rechercher une fuite interne.", "Remplacer la turbine."] }
                        ]}
                    ]},
                    { id: "resmed", name: "ResMed", models: [
                        { id: "lumis-150", name: "Lumis 150", failures: [
                            { title: "L'appareil ne détecte pas la respiration (pas de trigger)", causes: ["Masque mal ajusté", "Fuites importantes", "Mauvais réglage du trigger", "Capteur de débit sale", "Eau dans le tuyau"], solutionsPatient: ["Si vous forcez l'inspiration, est-ce que la machine se déclenche ?", "Vérifiez si de l'eau (condensation) est présente dans le tuyau.", "Respirez calmement par le nez sans ouvrir la bouche."], solutionsTech: ["Diminuer le réglage de sensibilité du trigger inspiratoire.", "Vérifier le réglage de la Rampe.", "Nettoyer le capteur de débit à l'air sec.", "Tester l'appareil avec un poumon de test."] },
                            { title: "Pression insuffisante ou instable", causes: ["Fuite massive", "Turbine usée", "Filtre bouché"], solutionsPatient: ["Vérifier le masque", "Vérifier le tuyau"], solutionsTech: ["Mesurer pression sortie.", "Tester étanchéité."] }
                        ]},
                        { id: "lumis-100-vpap", name: "Lumis 100 VPAP", failures: [
                            { title: "Fuites importantes (Masque ou Circuit)", causes: ["Masque mal positionné", "Circuit mal branché", "Joint du réservoir usé", "Harnais détendu"], solutionsPatient: ["Réajuster le masque (fonction 'Mask Fit')", "Reconnecter fermement le tuyau", "Vérifier que le réservoir est bien cliqué"], solutionsTech: ["Vérifier l'étanchéité du masque (gabarit).", "Inspecter le joint du réservoir HumidAir.", "Tester le circuit avec un bouchon."] },
                            { title: "Problème d'humidification (Air sec ou condensation)", causes: ["Niveau d'humidité trop bas", "Fuite buccale (masque nasal)", "Air ambiant trop sec"], solutionsPatient: ["Augmenter l'humidité dans 'Mes Options'", "Utiliser une mentonnière", "Vérifier le niveau d'eau le matin"], solutionsTech: ["Ajuster le réglage d'humidité clinicien.", "Proposer un masque facial.", "Vérifier la plaque chauffante."] },
                            { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Cordon secteur déconnecté", "Bloc d'alimentation HS"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Est-ce que le voyant du bloc est allumé ?"], solutionsTech: ["Vérifier le bloc d'alimentation externe.", "Tester la tension de sortie du bloc."] }
                        ]},
                        { id: "lumis-150-vpap", name: "Lumis 150 VPAP", failures: [
                            { title: "Problème d'humidification (Air sec ou condensation)", causes: ["Humidité réglée trop haute", "Chambre froide", "Appareil placé trop haut"], solutionsPatient: ["Baisser le réglage d'humidité", "Placer la machine plus bas que le lit", "Utiliser une housse de tuyau"], solutionsTech: ["Vérifier la sonde thermique.", "Activer Climate Control 'Auto'.", "Installer un ClimateLineAir."] },
                            { title: "Erreur Système (Message d'erreur)", causes: ["Surchauffe interne", "Bug logiciel", "Accessoires non compatibles", "Turbine HS"], solutionsPatient: ["Laisser refroidir et vérifier le filtre", "Débrancher 2 minutes et rebrancher", "Vérifier que rien n'obstrue l'entrée d'air"], solutionsTech: ["Consulter les logs d'erreurs.", "Mise à jour du firmware.", "Tester la turbine en mode service.", "Vérifier l'alimentation 90W."] },
                            { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Cordon secteur déconnecté", "Bloc d'alimentation HS"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Est-ce que le voyant du bloc est allumé ?"], solutionsTech: ["Vérifier le bloc d'alimentation externe.", "Contrôler la continuité du câble secteur."] }
                        ]}
                    ]}
                ] 
            },
            { 
                id: "niv-ii", name: "NIV II", brands: [
                    { id: "breas", name: "Breas", models: [
                        { id: "vivo-3", name: "Vivo 3", failures: [
                            { title: "L'appareil ne démarre pas", causes: ["Alimentation", "Batterie", "Carte"], solutionsPatient: ["Si vous le branchez sur le secteur, est-ce qu'il démarre ?", "Le voyant de charge est-il allumé ?"], solutionsTech: ["Tester l'alimentation.", "Remplacer la batterie.", "Remplacer la carte."] },
                            { title: "Pression instable / Fuites", causes: ["Masque", "Circuit", "Filtre"], solutionsPatient: ["Est-ce que le masque est bien mis sur le visage ?", "Le tuyau n'est pas décroché ou percé ?", "Le filtre est-il propre ?"], solutionsTech: ["Vérifier la calibration.", "Rechercher une fuite interne.", "Remplacer la turbine."] },
                            { title: "Problème de batterie ou autonomie", causes: ["Batterie usée", "Chargeur", "Connectique"], solutionsPatient: ["Le voyant de charge s'allume-t-il quand vous branchez ?", "Laisser charger 2h minimum.", "Vérifier le branchement."], solutionsTech: ["Tester la capacité batterie.", "Remplacer la batterie.", "Vérifier le circuit de charge."] },
                            { title: "Pression instable / Fuites", causes: ["Masque", "Circuit", "Filtre"], solutionsPatient: ["Est-ce que le masque est bien mis sur le visage ?", "Le filtre est-il propre ?"], solutionsTech: ["Vérifier la calibration.", "Rechercher une fuite interne.", "Remplacer la turbine."] },
                            { title: "Problème de batterie ou autonomie", causes: ["Batterie usée", "Chargeur", "Connectique"], solutionsPatient: ["Le voyant de charge s'allume-t-il quand vous branchez ?", "Vérifier l'icône batterie à l'écran."], solutionsTech: ["Tester la capacité batterie.", "Remplacer la batterie.", "Contrôler la gestion de charge."] },
                        ]},
                        { id: "vivo-45", name: "Vivo 45", failures: [
                            { title: "L'appareil ne démarre pas", causes: ["Alimentation", "Batterie", "Carte"], solutionsPatient: ["Si vous le branchez sur le secteur, est-ce qu'il démarre ?", "Le voyant de charge est-il allumé ?"], solutionsTech: ["Tester l'alimentation.", "Remplacer la batterie.", "Remplacer la carte."] },
                            { title: "Pression instable / Fuites", causes: ["Masque", "Circuit", "Filtre"], solutionsPatient: ["Est-ce que le masque est bien mis sur le visage ?", "Le filtre est-il propre ?"], solutionsTech: ["Vérifier la calibration.", "Rechercher une fuite interne.", "Remplacer la turbine."] },
                            { title: "Erreur Système", causes: ["Logiciel", "Carte"], solutionsPatient: ["Pouvez-vous l'éteindre complètement et le rallumer ?", "Quel est le message affiché ?"], solutionsTech: ["Consulter le code erreur.", "Remplacer la carte principale."] },
                            { title: "Problème de batterie ou autonomie", causes: ["Batterie usée", "Défaut de charge", "Batterie mal enclenchée"], solutionsPatient: ["Brancher sur secteur", "Vérifier le voyant de charge", "Réinsérer la batterie fermement"], solutionsTech: ["Tester la capacité réelle", "Vérifier le circuit de charge", "Remplacer la batterie"] },
                            { title: "Alarme « Déconnexion » (Priorité Haute)", causes: ["Débranchement accidentel du circuit au niveau de la sortie d'air de l'appareil.", "Le patient retire son masque pendant le sommeil ou ouvre la bouche (si masque nasal).", "Le seuil de détection de l'alarme est réglé de façon trop sensible par rapport au débit utilisé."], solutionsPatient: ["Enfoncer fermement le circuit sur la sortie d'air et vérifier les raccords.", "Envisager l'utilisation d'une mentonnière ou passer à un masque buccal/nasal.", "Demander au prestataire de réévaluer le seuil d'alarme de déconnexion."], solutionsTech: ["Vérifier la calibration du capteur de débit.", "Ajuster les réglages d'alarme dans le menu clinicien."] },
                            { title: "Alarme « Volume Minute Bas » ou « Volume Courant Bas »", causes: ["Encombrement des voies respiratoires du patient (sécrétions/glaires).", "Masque trop serré qui réduit le passage de l'air ou s'écrase.", "Changement physiologique (le patient est en sommeil plus profond ou sa maladie évolue)."], solutionsPatient: ["Procéder à un désencombrement (aspiration, toux assistée ou kinésithérapie).", "Desserrer légèrement le masque pour libérer le flux tout en surveillant les fuites.", "Contacter immédiatement le médecin si le volume reste bas malgré les ajustements."], solutionsTech: ["Vérifier l'absence de fuite interne.", "Recalibrer la turbine."] }
                        ]}
                    ]},
                    { id: "lowenstein", name: "Löwenstein", models: [ // Corrected brand name
                        { id: "vent-40", name: "Vent 40", failures: [
                            { title: "L'appareil ne démarre pas", causes: ["Alimentation", "Batterie", "Carte"], solutionsPatient: ["Si vous le branchez sur le secteur, est-ce qu'il démarre ?", "Le voyant de charge est-il allumé ?"], solutionsTech: ["Tester l'alimentation.", "Remplacer la batterie.", "Remplacer la carte."] },
                            { title: "Pression instable / Fuites", causes: ["Masque", "Circuit", "Filtre"], solutionsPatient: ["Est-ce que le masque est bien mis sur le visage ?", "Le filtre est-il propre ?"], solutionsTech: ["Vérifier la calibration.", "Rechercher une fuite interne.", "Remplacer la turbine."] },                            { title: "Problème de batterie ou autonomie", causes: ["Batterie usée", "Chargeur", "Connectique"], solutionsPatient: ["Le voyant de charge s'allume-t-il quand vous branchez ?", "Vérifier l'icône batterie à l'écran."], solutionsTech: ["Tester la capacité batterie.", "Remplacer la batterie.", "Contrôler la gestion de charge."] },
                            { title: "Alarme « Fuite importante » ou fuite massive", causes: ["La valve expiratoire est mal montée, absente ou son clapet est bloqué.", "Masque très usé dont le coussinet en silicone ne fait plus l'étanchéité.", "Bouchon de mesure de pression (sur le circuit) resté ouvert."], solutionsPatient: ["Démonter et remonter soigneusement la valve de fuite.", "Remplacer le masque ou la bulle en silicone si elle est distendue.", "S'assurer que tous les ports de mesure sur le circuit sont bien fermés."], solutionsTech: ["Inspecter la valve de non-retour.", "Vérifier les réglages de compensation de fuite."] },
                            { title: "L'appareil ne s'allume pas ou s'arrête seul", causes: ["Câble d'alimentation secteur défectueux ou mal inséré au dos.", "Batterie interne totalement déchargée après un stockage prolongé.", "Surchauffe due à un filtre à air totalement obstrué."], solutionsPatient: ["Vérifier que le voyant du bloc d'alimentation externe est bien allumé.", "Laisser l'appareil branché sur secteur plusieurs heures pour recalibrer la batterie.", "Remplacer le filtre à air (gris et blanc) et dégager les entrées d'air."], solutionsTech: ["Tester le bloc d'alimentation.", "Vérifier la carte de gestion de charge."] },
                            { title: "Problème de batterie ou autonomie", causes: ["Batterie interne usée", "Décharge profonde", "Surchauffe"], solutionsPatient: ["Brancher sur secteur", "Vérifier le voyant de charge", "Laisser l'appareil branché en permanence"], solutionsTech: ["Vérifier l'état de santé batterie", "Remplacer la batterie"] }
                        ]}
                    ]},
                    { id: "philips", name: "Philips", models: [
                        { id: "bipap-a40", name: "BiPAP A40", failures: [
                            { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Alimentation", "Batterie", "Carte"], solutionsPatient: ["Si vous le branchez sur le secteur, est-ce qu'il démarre ?", "Le voyant de charge est-il allumé ?"], solutionsTech: ["Tester l'alimentation.", "Remplacer la batterie.", "Remplacer la carte."] },
                            { title: "Pression insuffisante ou instable", causes: ["Masque", "Circuit", "Filtre"], solutionsPatient: ["Est-ce que le masque est bien mis sur le visage ?", "Le filtre est-il propre ?"], solutionsTech: ["Vérifier la calibration.", "Rechercher une fuite interne.", "Remplacer la turbine."] },
                            { title: "Problème d'humidification (Air sec ou condensation)", causes: ["Connecteurs métalliques sales", "Plaque HS", "Désactivé dans le menu"], solutionsPatient: ["Nettoyer les connecteurs métalliques avec un coton-tige sec", "Assurez-vous que l'humidificateur est activé"], solutionsTech: ["Contrôler la continuité de la résistance", "Remplacer la plaque."] },
                            { title: "Problème de batterie ou autonomie", causes: ["Batterie Smart défectueuse", "Mauvais branchement", "Fin de vie"], solutionsPatient: ["Vérifier l'enclenchement de la batterie", "Nettoyer les contacts", "Laisser charger 4h"], solutionsTech: ["Tester la capacité réelle", "Vérifier le circuit de charge"] },
                            { title: "Erreur Système (Message d'erreur)", causes: ["Logiciel", "Carte"], solutionsPatient: ["Pouvez-vous l'éteindre complètement et le rallumer ?", "Quel est le message affiché ?"], solutionsTech: ["Consulter le code erreur.", "Remplacer la carte principale."] },
                            { title: "Alarme « Circuit obstrué »", causes: ["Tuyau plié sous le poids du patient ou coincé dans les barreaux du lit.", "Filtre antibactérien (HME) saturé d'humidité ou de sécrétions.", "Obstruction physique à l'intérieur de l'entrée d'air (poussière, tissu)."], solutionsPatient: ["Dégager le tuyau et s'assurer qu'il décrit une courbe libre.", "Remplacer le filtre antibactérien par un neuf.", "Nettoyer le support de l'appareil et remplacer les filtres à air."], solutionsTech: ["Nettoyer le bloc turbine.", "Vérifier le capteur de pression différentielle."] },
                            { title: "L'alarme retentit sans message clair à l'écran", causes: ["L'appareil est en période de \"Silence d'alarme\" (l'alerte visuelle peut avoir disparu mais le problème persiste).", "Batterie amovible lithium-ion mal enclenchée."], solutionsPatient: ["Appuyer sur le bouton de réinitialisation de l'alarme pour voir le dernier message.", "Retirer la batterie amovible et la réinsérer fermement jusqu'au clic."], solutionsTech: ["Vérifier les connecteurs de la batterie.", "Mettre à jour le firmware."] }
                        ]},
                        { id: "dreamstation-bipap-avaps", name: "DreamStation BiPAP AVAPS", failures: [ // Corrected brand name
                            { title: "Message « Vérifier le débit »", causes: ["Utilisation d'un tuyau de 15mm alors que l'appareil est réglé sur 22mm.", "Encrassement des trous de fuite du masque par du calcaire ou de la salive."], solutionsPatient: ["Ajuster le paramètre « Diamètre du tuyau » dans le menu de confort.", "Nettoyer les orifices d'expiration du masque avec une petite brosse et de l'eau savonneuse."], solutionsTech: ["Vérifier le capteur de débit interne.", "Effectuer un test de calibration pneumatique."] },
                            { title: "Problème de batterie ou autonomie", causes: ["Batterie usée", "Défaut de charge", "Alimentation 60W au lieu de 80W"], solutionsPatient: ["Vérifier si le bloc alim est bien de 80W.", "Laisser charger 4h.", "Vérifier le voyant sur la batterie."], solutionsTech: ["Tester la capacité réelle.", "Vérifier la tension de charge.", "Remplacer la batterie."] },
                            { title: "L'humidificateur ne produit plus de chaleur ou de vapeur", causes: ["Réservoir mal enclenché (le contact électrique ne se fait pas).", "Niveau de température réglé trop bas dans le menu utilisateur."], solutionsPatient: ["Pousser le bac d'eau jusqu'à ce que le loquet de l'appareil se ferme complètement.", "Augmenter le réglage de l'humidification (passer de 0 à un niveau supérieur)."], solutionsTech: ["Mesurer la résistance de la plaque chauffante.", "Vérifier les picots de connexion de l'embase."] }
                        ]}
                    ]},
                    { id: "resmed", name: "ResMed", models: [
                        { id: "stellar-150", name: "Stellar 150", failures: [
                            { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Alimentation", "Batterie", "Carte"], solutionsPatient: ["Si vous le branchez sur le secteur, est-ce qu'il démarre ?", "Le voyant de charge est-il allumé ?"], solutionsTech: ["Tester l'alimentation.", "Remplacer la batterie.", "Remplacer la carte."] },
                            { title: "Pression insuffisante ou instable", causes: ["Masque", "Circuit", "Filtre"], solutionsPatient: ["Est-ce que le masque est bien mis sur le visage ?", "Le filtre est-il propre ?"], solutionsTech: ["Vérifier la calibration.", "Rechercher une fuite interne.", "Remplacer la turbine."] },
                            { title: "Problème de batterie ou autonomie", causes: ["Batterie usée (fin de vie)", "Stockage sans charge", "Surchauffe batterie"], solutionsPatient: ["Vérifier le voyant de charge arrière.", "Laisser charger sur secteur plusieurs heures.", "Laisser refroidir si brûlant."], solutionsTech: ["Vérifier le menu service (capacité batterie).", "Remplacer la batterie interne.", "Vérifier le circuit de charge."] },
                            { title: "Erreur Système (Message d'erreur)", causes: ["Logiciel", "Carte"], solutionsPatient: ["Pouvez-vous l'éteindre complètement et le rallumer ?", "Quel est le message affiché ?"], solutionsTech: ["Consulter le code erreur.", "Remplacer la carte principale."] }
                        ]}
                    ]}
                ] 
            },
            { 
                id: "niv-iii", name: "NIV III", brands: [
                    { id: "breas", name: "Breas", models: [
                        { id: "vivo-45-ls", name: "Vivo 45 LS", failures: [
                            { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Alimentation", "Batterie", "Carte"], solutionsPatient: ["Si vous le branchez sur le secteur, est-ce qu'il démarre ?", "Le voyant de charge est-il allumé ?"], solutionsTech: ["Tester l'alimentation.", "Remplacer la batterie.", "Remplacer la carte."] },
                            { title: "Pression insuffisante ou instable", causes: ["Masque", "Circuit", "Filtre"], solutionsPatient: ["Est-ce que le masque est bien mis sur le visage ?", "Le filtre est-il propre ?"], solutionsTech: ["Vérifier la calibration.", "Rechercher une fuite interne.", "Remplacer la turbine."] },
                            { title: "Problème de batterie ou autonomie", causes: ["Batterie usée", "Chargeur", "Connectique"], solutionsPatient: ["Le voyant de charge s'allume-t-il quand vous branchez ?", "Laisser charger 4h.", "Vérifier le branchement."], solutionsTech: ["Tester la capacité batterie.", "Remplacer la batterie."] }
                        ]}
                    ]},
                    { id: "lowenstein", name: "Löwenstein", models: [
                        { id: "luisa", name: "Luisa", failures: [
                            { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Alimentation", "Batterie", "Carte"], solutionsPatient: ["Si vous le branchez sur le secteur, est-ce qu'il démarre ?", "Le voyant de charge est-il allumé ?"], solutionsTech: ["Tester l'alimentation.", "Remplacer la batterie.", "Remplacer la carte."] },
                            { title: "Pression insuffisante ou instable", causes: ["Masque", "Circuit", "Filtre"], solutionsPatient: ["Est-ce que le masque est bien mis sur le visage ?", "Le filtre est-il propre ?"], solutionsTech: ["Vérifier la calibration.", "Rechercher une fuite interne.", "Remplacer la turbine."] },
                            { title: "Erreur Système (Message d'erreur)", causes: ["Logiciel", "Carte"], solutionsPatient: ["Pouvez-vous l'éteindre complètement et le rallumer ?", "Quel est le message affiché ?"], solutionsTech: ["Consulter le code erreur.", "Remplacer la carte principale."] },
                            { title: "Problème d'oxygène (FiO2 basse)", causes: ["Source O2 vide ou fermée", "Cellule O2 usée ou non calibrée"], solutionsPatient: ["Vérifier l'arrivée d'oxygène", "Recalibrer cellule O2 (Menu Maintenance)", "Remplacer la cellule si elle a plus d'un an"], solutionsTech: ["Remplacer la cellule O2 (> 1 an)"] },
                            { title: "Problème d'affichage (Écran noir ou figé)", causes: ["Saleté/humidité sur écran", "Bug logiciel"], solutionsPatient: ["Nettoyer l'écran au sec", "Redémarrer l'appareil"], solutionsTech: ["Mise à jour firmware", "Changer bloc LCD"] }
                            , { title: "Problème de batterie ou autonomie", causes: ["Batterie Smart défectueuse", "Fin de vie"], solutionsPatient: ["Vérifier le niveau sur l'écran", "Brancher sur secteur"], solutionsTech: ["Vérifier logs batterie", "Remplacer batterie"] }
                        ]}
                    ]},
                    { id: "philips", name: "Philips", models: [
                        { id: "eove-150", name: "EOVE 150", failures: [
                            { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Alimentation", "Batterie", "Carte"], solutionsPatient: ["Si vous le branchez sur le secteur, est-ce qu'il démarre ?", "Le voyant de charge est-il allumé ?"], solutionsTech: ["Tester l'alimentation.", "Remplacer la batterie.", "Remplacer la carte."] },
                            { title: "Pression insuffisante ou instable", causes: ["Masque", "Circuit", "Filtre"], solutionsPatient: ["Est-ce que le masque est bien mis sur le visage ?", "Le filtre est-il propre ?"], solutionsTech: ["Vérifier la calibration.", "Rechercher une fuite interne.", "Remplacer la turbine."] },
                            { title: "Erreur Système (Message d'erreur)", causes: ["Logiciel", "Carte"], solutionsPatient: ["Pouvez-vous l'éteindre complètement et le rallumer ?", "Quel est le message affiché ?"], solutionsTech: ["Consulter le code erreur.", "Remplacer la carte principale."] }
                        ]},
                        { id: "trilogy-100", name: "Trilogy 100", failures: [
                            { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Alimentation", "Batterie", "Carte"], solutionsPatient: ["Si vous le branchez sur le secteur, est-ce qu'il démarre ?"], solutionsTech: ["Tester l'alimentation.", "Remplacer la batterie.", "Remplacer la carte."] },
                            { title: "Pression insuffisante ou instable", causes: ["Masque", "Circuit", "Filtre"], solutionsPatient: ["Est-ce que le masque est bien mis sur le visage ?"], solutionsTech: ["Vérifier la calibration.", "Remplacer la turbine."] },
                            { title: "Erreur Système (Message d'erreur)", causes: ["Logiciel", "Carte"], solutionsPatient: ["Pouvez-vous l'éteindre complètement et le rallumer ?"], solutionsTech: ["Consulter le code erreur.", "Remplacer la carte principale."] },
                            { title: "Erreur Système (Message d'erreur)", causes: ["Évents de refroidissement obstrués", "Filtre mousse saturé", "Pièce non ventilée"], solutionsPatient: ["Dégager l'espace autour (> 15cm)", "Nettoyer/remplacer le filtre mousse", "Laisser refroidir 30 minutes"], solutionsTech: ["Vérifier le ventilateur interne", "Dépoussiérage interne"] },
                            { title: "Pression insuffisante ou instable", causes: ["Déconnexion partielle", "Encombrement bronchique", "Fuite importante"], solutionsPatient: ["Vérifier tous les raccords", "Désencombrement (aspiration/kiné)", "Réajuster le masque"], solutionsTech: ["Vérifier calibration débit", "Check fuites internes"] },
                            { title: "Erreur Système (Température élevée)", causes: ["Obstruction entrées d'air", "Filtre à air sale", "Température ambiante > 40°C"], solutionsPatient: ["Dégager orifices ventilation", "Nettoyer/remplacer filtre à air", "Placer appareil au frais"], solutionsTech: ["Vérifier le ventilateur interne", "Dépoussiérage interne"] },
                            { title: "Fuites importantes (Déconnexion circuit)", causes: ["Débranchement circuit", "Sensibilité alarme trop basse"], solutionsPatient: ["Inspecter tubulure", "Vérifier connecteurs capteur pression", "Ajuster seuil alarme (si autorisé)"], solutionsTech: [] }
                            , { title: "Problème de batterie ou autonomie", causes: ["Vieillissement", "Défaut de charge"], solutionsPatient: ["Laisser branché 6h", "Vérifier voyant AC"], solutionsTech: ["Tester autonomie", "Remplacer batterie interne"] }
                        ]},
                        { id: "trilogy-evo", name: "Trilogy Evo", failures: [
                            { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Alimentation", "Batterie", "Carte"], solutionsPatient: ["Si vous le branchez sur le secteur, est-ce qu'il démarre ?"], solutionsTech: ["Tester l'alimentation.", "Remplacer la batterie.", "Remplacer la carte."] },
                            { title: "Pression insuffisante ou instable", causes: ["Masque", "Circuit", "Filtre"], solutionsPatient: ["Est-ce que le masque est bien mis sur le visage ?"], solutionsTech: ["Vérifier la calibration.", "Remplacer la turbine."] },
                            { title: "Erreur Système (Message d'erreur)", causes: ["Logiciel", "Carte"], solutionsPatient: ["Pouvez-vous l'éteindre complètement et le rallumer ?"], solutionsTech: ["Consulter le code erreur.", "Remplacer la carte principale."] },
                            { title: "Problème de batterie ou autonomie", causes: ["Batterie interne usée", "Stockage prolongé"], solutionsPatient: ["Brancher sur secteur", "Vérifier icône batterie"], solutionsTech: ["Remplacer batterie Lithium"] }
                        ]}
                    ]},
                    { id: "resmed", name: "ResMed", models: [
                        { id: "astral-150", name: "Astral 150", failures: [
                            { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Alimentation", "Batterie", "Carte"], solutionsPatient: ["Si vous le branchez sur le secteur, est-ce qu'il démarre ?", "Le voyant de charge est-il allumé ?"], solutionsTech: ["Tester l'alimentation.", "Remplacer la batterie.", "Remplacer la carte."] },
                            { title: "Pression insuffisante ou instable", causes: ["Masque", "Circuit", "Filtre"], solutionsPatient: ["Est-ce que le masque est bien mis sur le visage ?", "Le filtre est-il propre ?"], solutionsTech: ["Vérifier la calibration.", "Rechercher une fuite interne.", "Remplacer la turbine."] },
                            { title: "Problème de batterie ou autonomie", causes: ["Batterie en fin de cycle (2 ans/200 cycles)", "Stockage prolongé sans charge", "Température élevée"], solutionsPatient: ["Brancher sur secteur pour recalibrer", "Vérifier la santé batterie (Menu Info)", "Laisser refroidir si chaud"], solutionsTech: ["Remplacer la batterie interne", "Vérifier le circuit de charge"] },
                            { title: "Erreur Système (Message d'erreur)", causes: ["Apprentissage circuit non réalisé", "Fuite valve expiratoire Astral"], solutionsPatient: ["Lancer 'Apprentissage circuit'", "Vérifier le clipsage de la valve expiratoire"], solutionsTech: ["Tester avec un autre bloc valve", "Calibration des capteurs"] }
                        ]},
                        { id: "elisee-150", name: "Elisée 150", failures: [
                            { title: "Fuites importantes (Masque ou Circuit)", causes: ["Tuyau de commande de la valve débranché ou percé", "Membrane valve percée ou mal positionnée"], solutionsPatient: ["Vérifier le petit tube fin qui longe le gros tuyau", "Remplacer la membrane en silicone de la valve expiratoire (petite pièce ronde transparente)"], solutionsTech: ["Vérifier pilotage valve", "Test étanchéité pneumatique"] },
                            { title: "Erreur Système (Message d'erreur)", causes: ["Pile bouton carte mère déchargée"], solutionsPatient: ["Appareil fonctionnel (ignorer pour la nuit)", "Demander remplacement pile au prestataire"], solutionsTech: ["Remplacer la pile CR2032 sur carte mère"] },
                            { title: "Erreur Système (Erreur Valve)", causes: ["Tube de pilotage de la valve expiratoire déconnecté", "Membrane de la valve expiratoire percée ou absente"], solutionsPatient: ["Rebrancher le petit tube transparent", "Ouvrir la valve et vérifier l'état de la membrane en silicone"], solutionsTech: ["Vérifier pilotage valve", "Test étanchéité pneumatique"] },
                            { title: "Problème d'affichage (Écran noir ou figé)", causes: ["Poussière/eau sur dalle", "Défaut étalonnage dalle tactile"], solutionsPatient: ["Nettoyer l'écran (chiffon sec)", "Redémarrer et étalonner dalle (si nécessaire)"], solutionsTech: ["Mise à jour firmware", "Changer bloc LCD"] }
                            , { title: "Problème de batterie ou autonomie", causes: ["Décharge profonde", "Vieillissement"], solutionsPatient: ["Brancher 4h", "Vérifier l'icône"], solutionsTech: ["Remplacer batterie Lithium"] }
                        ]},
                        { id: "vs-iii", name: "VS III", failures: [
                            { title: "Pression insuffisante ou instable (Pression commande basse)", causes: ["Circuit double branche mal connecté au bloc de connexion arrière", "Fuite sur le port de pilotage de la valve"], solutionsPatient: ["Vérifier que le bloc de connexion est bien clipsé à l'arrière", "Inspecter les raccords du circuit double"], solutionsTech: [] },
                            { title: "Problème de batterie ou autonomie", causes: ["Batterie interne vieillissante", "Charge incomplète"], solutionsPatient: ["Laisser l'appareil branché en permanence", "Vérifier voyant de charge"], solutionsTech: ["Remplacer batterie interne"] }
                        ]}
                    ]},
                    { id: "air-liquide", name: "Air Liquide", models: [
                        { id: "monnal-t50", name: "Monnal T50", failures: [
                            { title: "Erreur Système (Message d'erreur)", causes: ["Capteur débit humide/sale", "Batterie faible pour tests", "Branche mal insérée"], solutionsPatient: ["Vérifier propreté capteur", "Brancher sur secteur", "Vérifier étanchéité branche expiratoire"], solutionsTech: ["Calibrer capteur débit"] },
                            { title: "Pression insuffisante ou instable", causes: ["Valve expiratoire bloquée", "Tuyau plié", "Lutte patient"], solutionsPatient: ["Sécher valve expiratoire", "Dégager tubulure", "Aspiration bronchique"], solutionsTech: ["Nettoyer bloc expiratoire"] },
                            { title: "Pression insuffisante ou instable (Pression haute)", causes: ["Tuyau patient plié ou écrasé", "Valve expiratoire obstruée (humidité/sécrétions)", "Lutte patient"], solutionsPatient: ["Vérifier passage circuit", "Nettoyer/sécher ensemble expiratoire", "Vérifier besoin aspiration bronchique"], solutionsTech: ["Vérifier réglages de confort", "Nettoyer bloc expiratoire"] },
                            { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Cordon mal inséré", "Fusible bloc secteur HS"], solutionsPatient: ["Vérifier branchement mural", "Vérifier disjoncteur"], solutionsTech: ["Tester bloc alimentation"] }
                            , { title: "Problème de batterie ou autonomie", causes: ["Cycles épuisés", "Défaut carte"], solutionsPatient: ["Brancher sur secteur", "Vérifier menu maintenance"], solutionsTech: ["Remplacer batterie", "Calibration"] }
                        ]}
                    ]},
                    { id: "puritan-bennett", name: "Puritan Bennett", models: [
                        { id: "pb-560", name: "PB 560", failures: [
                            { title: "Erreur Système (Message d'erreur)", causes: ["Paramètres incompatibles", "Erreur décharge totale"], solutionsPatient: ["Revoir prescription", "Valider chaque écran réglage"], solutionsTech: ["Reset logiciel"] },
                            { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Câble défaillant", "Fusible interne grillé"], solutionsPatient: ["Tester autre câble standard", "Vérifier icône prise à l'écran"], solutionsTech: ["Tester bloc alim"] },
                            { title: "Erreur Système (Vérifier réglages)", causes: ["Paramètres incompatibles", "Erreur logicielle (décharge totale)"], solutionsPatient: ["Revoir prescription et ressaisir paramètres", "Valider chaque écran de réglage"], solutionsTech: ["Vérifier logs erreurs", "Reset logiciel"] },
                            { title: "Pression insuffisante ou instable", causes: ["Fuite masque/canule", "Encombrement patient", "Volume Bas"], solutionsPatient: ["Réajuster masque", "Soin de désencombrement"], solutionsTech: ["Vérifier étanchéité circuit"] }
                            , { title: "Problème de batterie ou autonomie", causes: ["Décharge totale", "Fin de vie"], solutionsPatient: ["Brancher 24h", "Bipe au branchement ?"], solutionsTech: ["Remplacer batterie interne"] }
                        ]}
                    ]},
                    { id: "saime", name: "Saime", models: [
                        { id: "eole-3", name: "Eole 3 S / XLS", failures: [
                            { title: "Pression insuffisante ou instable", causes: ["Usure soufflet (modèle XLS)", "Fuite interne majeure"], solutionsPatient: ["Utiliser ventilateur de secours immédiatement"], solutionsTech: ["Remplacer le soufflet", "Révision atelier"] },
                            { title: "Erreur Système (Message d'erreur)", causes: ["Panne carte électronique", "Batterie sécurité vide"], solutionsPatient: ["Passer en ventilation manuelle (ballon)", "Retour atelier d'urgence"], solutionsTech: ["Diagnostic carte mère"] }
                            , { title: "Problème de batterie ou autonomie", causes: ["Batterie usée", "Non utilisation"], solutionsPatient: ["Brancher 12h", "Vérifier voyant"], solutionsTech: ["Remplacer accumulateurs"] }
                        ]}
                    ]}
                ]
            } 
        ]
      }
    ];

// --- ÉTAT ---
var state = { 
    view: 'library',
    type: null, subType: null, subSubType: null, brand: null, model: null,
    failure: null, failureIndex: null, showTech: false, stepIndex: 0,
    searchQuery: '', searchResults: []
};

let HISTORY = [];

// --- CONFIGURATION FIREBASE ---
// Remplace avec tes propres clés (Console Firebase > Paramètres du projet)
const firebaseConfig = {
    apiKey: "AIzaSyAh7r0X_arTuQj0mA-9xkJf9lryPtp4GZQ",
    authDomain: "bibliotech-bd07b.firebaseapp.com",
    projectId: "bibliotech-bd07b",
    storageBucket: "bibliotech-bd07b.firebasestorage.app",
    messagingSenderId: "543967791494",
    appId: "1:543967791494:web:9be2d694e3ff35d8720407",
    measurementId: "G-446N7TNSWB"
};

// Initialisation de Firebase
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    // Écouteur en temps réel pour le Journal
    db.collection("history").orderBy("id", "desc").onSnapshot((snapshot) => {
        HISTORY = snapshot.docs.map(doc => ({
            ...doc.data(),
            docId: doc.id // On garde l'ID Firebase pour la suppression
        }));
        render(); // Redessine l'interface dès qu'une donnée change
    }, (error) => {
        console.error("Erreur écouteur Firestore:", error);
        if (error.code === 'permission-denied') {
            console.warn("Accès refusé. Vérifiez vos règles Firestore.");
        }
    });
} else {
    // Fallback local si Firebase n'est pas chargé
    HISTORY = JSON.parse(localStorage.getItem('failure_history') || '[]');
}

// --- FONCTIONS DE NAVIGATION ---
function performSearch(query) {
    if (!query || query.length < 2 || state.view === 'history') {
        state.searchResults = [];
        return;
    }
    const lowerQuery = query.toLowerCase();
    const results = [];

    LIBRARY_DATA.forEach(type => {
        const processBrands = (brands, currentType, subType = null, subSubType = null) => {
            if (!brands) return;
            brands.forEach(brand => {
                if (brand.models) {
                    brand.models.forEach(model => {
                        if (model.name.toLowerCase().includes(lowerQuery) || brand.name.toLowerCase().includes(lowerQuery)) {
                            let path = `${currentType.name}`;
                            if (subType) path += ` > ${subType.name}`;
                            if (subSubType) path += ` > ${subSubType.name}`;
                            if (brand.name) path += ` > ${brand.name}`;
                            path += ` > ${model.name}`;
                            results.push({ type, subType, subSubType, brand, model, path });
                        }
                    });
                }
            });
        };

        const processSubTypes = (subTypes, currentType) => {
            if (!subTypes) return;
            subTypes.forEach(subType => {
                if (subType.brands) processBrands(subType.brands, currentType, subType);
                if (subType.subTypes) subType.subTypes.forEach(subSubType => {
                    if (subSubType.brands) processBrands(subSubType.brands, currentType, subType, subSubType);
                });
            });
        };

        if (type.models) {
            type.models.forEach(model => {
                if (model.name.toLowerCase().includes(lowerQuery) || type.name.toLowerCase().includes(lowerQuery)) {
                    results.push({ type: type, subType: null, subSubType: null, brand: null, model: model, path: `${type.name} > ${model.name}` });
                }
            });
        } else if (type.brands) {
            processBrands(type.brands, type);
        } else if (type.subTypes) {
            processSubTypes(type.subTypes, type);
        }
    });
    state.searchResults = results;
}

function selectType(typeId) {
    state.type = LIBRARY_DATA.find(t => t.id === typeId);
    state.view = 'library';
    state.subType = null; state.subSubType = null; state.brand = null; state.model = null; state.failure = null;
    render();
}
function selectSubType(subTypeId) {
    state.subType = state.type.subTypes.find(s => s.id === subTypeId);
    state.view = 'library';
    state.subSubType = null; state.brand = null; state.model = null; state.failure = null;
    render();
}
function selectSubSubType(subSubTypeId) {
    state.subSubType = state.subType.subTypes.find(s => s.id === subSubTypeId);
    state.view = 'library';
    state.brand = null; state.model = null; state.failure = null;
    render();
}
function selectBrand(brandId) {
    const source = state.subSubType || state.subType || state.type;
    state.brand = source.brands.find(b => b.id === brandId);
    state.view = 'library';
    state.model = null; state.failure = null;
    render();
}
function selectModel(modelId) {
    const source = state.brand || state.subSubType || state.subType || state.type;
    state.model = source.models.find(m => m.id === modelId);
    state.view = 'library';
    state.failure = null;
    render();
}
function selectFailure(failureIndex) {
    state.failure = state.model.failures[failureIndex];
    state.failureIndex = failureIndex;
    state.view = 'library';
    state.showTech = false;
    state.stepIndex = 0;
    render();
}
function nextStep() {
    state.stepIndex++;
    render();
}

function previousStep() {
    if (state.showTech) {
        state.showTech = false;
        render();
        return;
    }
    if (state.stepIndex > 0) {
        state.stepIndex--;
        render();
    }
}

function resetAll() { 
    state = { view: 'library', type: null, subType: null, subSubType: null, brand: null, model: null, failure: null, failureIndex: null, showTech: false, stepIndex: 0, searchQuery: '', searchResults: [] }; 
    const searchInput = document.getElementById('global-search');
    if (searchInput) searchInput.value = '';
    render(); 
}
function resetToType() { state.subType = null; state.subSubType = null; state.brand = null; state.model = null; state.failure = null; state.failureIndex = null; state.showTech = false; state.stepIndex = 0; render(); }
function resetToSubType() { state.subSubType = null; state.brand = null; state.model = null; state.failure = null; state.failureIndex = null; state.showTech = false; state.stepIndex = 0; render(); }
function resetToSubSubType() { state.brand = null; state.model = null; state.failure = null; state.failureIndex = null; state.showTech = false; state.stepIndex = 0; render(); }
function resetToBrand() { state.model = null; state.failure = null; state.failureIndex = null; state.showTech = false; state.stepIndex = 0; render(); }
function resetToModel() { state.failure = null; state.failureIndex = null; state.showTech = false; state.stepIndex = 0; render(); }

function toggleView() {
    state.view = state.view === 'library' ? 'history' : 'library';
    render();
}

function toggleFailuresView() {
    state.view = state.view === 'failures' ? 'library' : 'failures';
    render();
}

async function logIntervention(status) {
    const otherCause = document.getElementById('cause-other-input')?.value || '';
    const entry = {
        id: Date.now(),
        date: new Date().toLocaleString('fr-FR'),
        device: `${state.type?.name}${state.brand ? ` (${state.brand.name})` : ''} > ${state.model?.name}`,
        failure: state.failure?.title,
        status: status,
        comment: otherCause,
        causes: state.failure?.causes || (state.failure?.cause ? [state.failure.cause] : []),
        solutionsPatient: state.failure?.solutionsPatient || [],
        solutionsTech: state.failure?.solutionsTech || []
    };

    if (typeof firebase !== 'undefined') {
        try {
            await firebase.firestore().collection("history").add(entry);
            resetToModel();
        } catch (e) {
            console.error("Erreur Firebase:", e);
            alert("Erreur de synchronisation Cloud : " + e.message);
        }
    } else {
        HISTORY.unshift(entry);
        localStorage.setItem('failure_history', JSON.stringify(HISTORY));
        resetToModel();
    }
}

function clearHistory() {
    if (confirm("Voulez-vous vider le journal ?")) {
        HISTORY = [];
        localStorage.removeItem('failure_history');
        render();
    }
}

async function deleteHistoryItem(id, docId) {
    if (confirm("Supprimer cette intervention du journal ?")) {
        if (docId && typeof firebase !== 'undefined') {
            await firebase.firestore().collection("history").doc(docId).delete();
        } else {
            HISTORY = HISTORY.filter(item => item.id !== id);
            localStorage.setItem('failure_history', JSON.stringify(HISTORY));
            render();
        }
    }
}

function downloadHistoryPDF() {
    if (HISTORY.length === 0) {
        alert("Le journal est vide.");
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('l', 'mm', 'a4');
    
    doc.setFontSize(18);
    doc.text("Journal des Interventions - Bibliotech", 14, 15);
    doc.setFontSize(10);
    doc.text(`Généré le ${new Date().toLocaleString()}`, 14, 22);

    const tableRows = HISTORY.map(item => [
        item.date,
        item.device,
        item.failure,
        (item.causes || []).join(', '),
        (item.solutionsPatient || []).join(', '),
        (item.solutionsTech || []).join(', '),
        item.status,
        item.comment || '-'
    ]);

    if (typeof doc.autoTable === 'undefined') {
        alert("Impossible de générer le PDF. Le plugin de tableau est manquant.");
        return;
    }

    doc.autoTable({
        head: [['Date', 'Appareil', 'Problème', 'Causes', 'Sol. Patient', 'Sol. Tech', 'Statut', 'Notes']],
        body: tableRows,
        startY: 28,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [2, 132, 199] }
    });

    doc.save(`historique_interventions_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.pdf`);
}

function goBack() {
    if (state.view !== 'library') state.view = 'library';
    else if (state.failure) state.failure = null;
    else if (state.model) state.model = null;
    else if (state.brand) state.brand = null;
    else if (state.subSubType) state.subSubType = null;
    else if (state.subType) state.subType = null;
    else if (state.type) state.type = null;
    render();
}

window.addItem = function() {
    if (!state.type) {
        const name = prompt("Nom de la nouvelle catégorie :");
        if (name) {
            LIBRARY_DATA.push({ id: Date.now().toString(), name, models: [] });
        }
    } else if (state.type && !state.brand && (state.type.brands || ['vni', 'aspiration'].includes(state.type.id))) {
        const name = prompt("Nom de la nouvelle marque pour " + state.type.name + " :");
        if (name) {
            if (!state.type.brands) state.type.brands = [];
            state.type.brands.push({ id: Date.now().toString(), name, models: [] });
        }
    } else if (state.type && !state.model) {
        const name = prompt("Nom du nouveau modèle pour " + state.type.name + " :");
        if (name) {
            const target = state.brand || state.subSubType || state.subType || state.type;
            if (!target.models) target.models = [];
            target.models.push({ id: Date.now().toString(), name, failures: [] });
        }
    } else if (state.model) {
        const title = prompt("Titre du problème :");
        if (!title) return;
        const cause = prompt("Cause probable :");
        const solP = prompt("Solutions Patient (séparées par ';') :");
        const solT = prompt("Solutions Technicien (séparées par ';') :");
        
        if (!state.model.failures) state.model.failures = [];
        state.model.failures.push({
            title,
            causes: cause ? [cause] : [],
            solutionsPatient: solP ? solP.split(';').map(s => s.trim()) : [],
            solutionsTech: solT ? solT.split(';').map(s => s.trim()) : []
        });
    }
    render();
}

function deleteItem(event, type) {
    event.stopPropagation();
    if (!confirm("Voulez-vous vraiment supprimer cet élément ?")) return;

    const dataset = event.currentTarget.dataset;
    
    if (type === 'category') {
        const idx = LIBRARY_DATA.findIndex(t => t.id === dataset.id);
        LIBRARY_DATA.splice(idx, 1);
        state.type = null;
    } else if (type === 'brand') {
        const source = state.subSubType || state.subType || state.type;
        const idx = source.brands.findIndex(b => b.id === dataset.id);
        source.brands.splice(idx, 1);
        state.brand = null;
    } else if (type === 'model') {
        const source = state.brand || state.subSubType || state.subType || state.type;
        const idx = source.models.findIndex(m => m.id === dataset.id);
        source.models.splice(idx, 1);
        state.model = null;
    } else if (type === 'failure') {
        state.model.failures.splice(parseInt(dataset.index), 1);
        state.failure = null;
    }
    
    render();
}

// --- RENDU ---
function render() {
    const app = document.getElementById('app-content');
    if (!app) return;
    let html = '';
    
    const toggleBtn = document.getElementById('toggle-history-btn');
    if (toggleBtn) {
        toggleBtn.style.background = state.view === 'history' ? '#0284c7' : 'white';
        toggleBtn.style.color = state.view === 'history' ? 'white' : '#0284c7';
    }
    const failuresBtn = document.getElementById('toggle-failures-btn');
    if (failuresBtn) {
        failuresBtn.style.background = state.view === 'failures' ? '#0284c7' : 'white';
        failuresBtn.style.color = state.view === 'failures' ? 'white' : '#0284c7';
    }

    // Fil d'ariane + boutons navigation
    html += `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">`;
    html += `<div class="breadcrumb" style="margin-bottom: 0;">
        <span class="breadcrumb-item ${state.type || state.view !== 'library' ? 'breadcrumb-active' : ''}" data-action="reset-all">Accueil</span>`;
    if (state.view === 'history') html += `<span>/</span><span class="breadcrumb-item">Journal</span>`;
    if (state.view === 'failures') html += `<span>/</span><span class="breadcrumb-item">Catalogue</span>`;
    if (state.type) html += `<span>/</span><span class="breadcrumb-item ${state.subType || state.brand ? 'breadcrumb-active' : ''}" data-action="reset-to-type">${state.type.name}</span>`;
    if (state.subType) html += `<span>/</span><span class="breadcrumb-item ${state.subSubType || state.brand ? 'breadcrumb-active' : ''}" data-action="reset-to-sub-type">${state.subType.name}</span>`;
    if (state.subSubType) html += `<span>/</span><span class="breadcrumb-item ${state.brand ? 'breadcrumb-active' : ''}" data-action="reset-to-sub-sub-type">${state.subSubType.name}</span>`;
    if (state.brand) html += `<span>/</span><span class="breadcrumb-item ${state.model ? 'breadcrumb-active' : ''}" data-action="reset-to-brand">${state.brand.name}</span>`;
    if (state.model) html += `<span>/</span><span class="breadcrumb-item ${state.failure ? 'breadcrumb-active' : ''}" data-action="reset-to-model">${state.model.name}</span>`;
    if (state.failure) html += `<span>/</span><span class="breadcrumb-item">${state.failure.title}</span>`;
    html += `</div>`;

    html += `<div style="display: flex; gap: 10px;">`;
    if (state.type) html += `<button data-action="go-back" style="padding: 8px 16px; border-radius: 8px; border: 1px solid #cbd5e1; background: white; cursor: pointer; font-weight: 600;">Retour</button>`;
    html += `<button data-action="reset-all" style="padding: 8px 16px; border-radius: 8px; border: 1px solid #cbd5e1; background: white; cursor: pointer; font-weight: 600;">Accueil</button>`;
    html += `</div></div>`;
    
    // --- Contenu selon la vue ---
    if (state.view === 'history') {
        html += `<h2 style="margin-bottom: 20px;">Journal des Interventions</h2>`;
        html += `<div style="display: flex; gap: 10px; margin-bottom: 20px;">
                    <button onclick="downloadHistoryPDF()" style="padding: 8px 16px; border-radius: 8px; border: 1px solid #0284c7; background: #0284c7; color: white; cursor: pointer; font-weight: 600;">📥 Télécharger PDF</button>
                    <button onclick="clearHistory()" style="padding: 8px 16px; border-radius: 8px; border: 1px solid #ef4444; background: white; color: #ef4444; cursor: pointer; font-weight: 600;">Effacer tout le journal</button>
                </div>`;

        if (HISTORY.length === 0) {
            html += `<p style="color: #64748b; font-style: italic;">Aucune intervention enregistrée.</p>`;
        } else {
            html += `<div style="overflow-x: auto;"><table class="history-table"><thead><tr>
                        <th>Date</th><th>Appareil</th><th>Problème</th><th>Causes</th>
                        <th>Solutions Patient</th><th>Solutions Tech</th><th>Statut</th><th>Notes</th><th></th>
                    </tr></thead><tbody>`;
            HISTORY.forEach(item => {
                const statusClass = item.status === 'Succès' ? 'status-success' : 'status-fail';
                const causesDisplay = (item.causes && item.causes.length > 0) ? item.causes.join('<br/>') : '-';
                const solutionsPatientDisplay = (item.solutionsPatient && item.solutionsPatient.length > 0) ? item.solutionsPatient.join('<br/>') : '-';
                const solutionsTechDisplay = (item.solutionsTech && item.solutionsTech.length > 0) ? item.solutionsTech.join('<br/>') : '-';
                html += `<tr>
                    <td>${item.date}</td><td>${item.device}</td><td>${item.failure}</td>
                    <td>${causesDisplay}</td><td>${solutionsPatientDisplay}</td><td>${solutionsTechDisplay}</td>
                    <td><span class="status-badge ${statusClass}">${item.status}</span></td>
                    <td>${item.comment || '-'}</td>
                    <td style="text-align: center;"><button onclick="deleteHistoryItem(${item.id}, '${item.docId || ''}')" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 18px; font-weight: bold;">&times;</button></td>
                </tr>`;
            });
            html += `</tbody></table></div>`;
        }
    }
    else if (state.view === 'failures') {
        const allFailures = [];
        const traverse = (items, path = "") => {
            items.forEach(item => {
                const currentPath = path ? `${path} > ${item.name}` : item.name;
                if (item.failures) item.failures.forEach(f => allFailures.push({ ...f, model: item, path: currentPath }));
                if (item.subTypes) traverse(item.subTypes, currentPath);
                if (item.brands) traverse(item.brands, currentPath);
                if (item.models) traverse(item.models, currentPath);
            });
        };
        traverse(LIBRARY_DATA);

        html += `<h2 style="margin-bottom: 20px;">Catalogue Complet des Pannes</h2>`;
        if (allFailures.length === 0) {
            html += `<p style="color: #64748b; font-style: italic;">Aucune panne répertoriée.</p>`;
        } else {
            html += `<div style="display: grid; grid-template-columns: 1fr; gap: 10px;">`;
            allFailures.forEach((f) => {
                html += `<div class="card" style="text-align: left; align-items: flex-start; padding: 16px; min-height: unset;" onclick="openFailureFromCatalogue('${f.model.id}', ${f.model.failures.indexOf(f)})">
                    <div style="font-weight: bold; color: #ef4444;">⚠️ ${f.title}</div>
                    <div style="font-size: 12px; color: #64748b; margin-top: 4px;">${f.path}</div>
                    <span style="color: #0284c7; font-weight: bold; margin-top: 8px;">Voir le guide →</span>
                </div>`;
            });
            html += `</div>`;
        }
    }
    else if (state.searchQuery.length > 1) {
        html += `<h2 style="margin-bottom: 20px;">Résultats de recherche pour "${state.searchQuery}"</h2>`;
        if (state.searchResults.length > 0) {
            html += `<div class="card-grid">`;
            state.searchResults.forEach((result, index) => {
                html += `<div class="card" data-action="select-search-result" data-index="${index}">
                    <div style="font-size: 18px; font-weight: bold;">${result.model.name}</div>
                    <div style="font-size: 12px; color: #64748b; margin-top: 8px; line-height: 1.4;">${result.path}</div>
                </div>`;
            });
            html += `</div>`;
        } else {
            html += `<p>Aucun résultat trouvé.</p>`;
        }
    }
    else if (!state.type) {
        html += `<h2>Sélectionnez le type d'équipement</h2><div class="card-grid">`;
        LIBRARY_DATA.forEach(type => {
            html += `<div class="card" data-action="select-type" data-id="${type.id}">
                <button class="delete-btn" onclick="deleteItem(event, 'category')" data-id="${type.id}">&times;</button>
                <div style="font-size: 18px; font-weight: bold;">${type.name}</div>
            </div>`;
        });
        html += `</div>`;
    } else if (state.type.subTypes && !state.subType) {
        html += `<h2>Type (${state.type.name})</h2><div class="card-grid">`;
        state.type.subTypes.forEach(subType => {
            html += `<div class="card" data-action="select-sub-type" data-id="${subType.id}"><div style="font-size: 18px; font-weight: bold;">${subType.name}</div></div>`;
        });
        html += `</div>`;
    } else if (state.subType && state.subType.subTypes && !state.subSubType) {
        html += `<h2>Type (${state.subType.name})</h2><div class="card-grid">`;
        state.subType.subTypes.forEach(sub => {
            html += `<div class="card" data-action="select-sub-sub-type" data-id="${sub.id}"><div style="font-size: 18px; font-weight: bold;">${sub.name}</div></div>`;
        });
        html += `</div>`;
    } else if (!state.brand && ((state.type && state.type.brands) || (state.subType && state.subType.brands) || (state.subSubType && state.subSubType.brands))) {
        const source = state.subSubType || state.subType || state.type;
        html += `<h2>Marque (${source.name})</h2><div class="card-grid">`;
        if (!source.brands || source.brands.length === 0) {
            html += `<p>Aucune marque répertoriée.</p>`;
        } else {
            source.brands.forEach(brand => {
                html += `<div class="card" data-action="select-brand" data-id="${brand.id}">
                    <button class="delete-btn" onclick="deleteItem(event, 'brand')" data-id="${brand.id}">&times;</button>
                    <div style="font-size: 18px; font-weight: bold;">${brand.name}</div>
                </div>`;
            });
        }
        html += `</div>`;
    } else if (!state.model) {
        const source = state.brand || state.subSubType || state.subType || state.type;
        html += `<h2>Modèle (${source.name})</h2><div class="card-grid">`;
        if (!source.models || source.models.length === 0) {
            html += `<p>Aucun modèle répertorié.</p>`;
        } else {
            source.models.forEach(model => {
                html += `<div class="card" data-action="select-model" data-id="${model.id}">
                    <button class="delete-btn" onclick="deleteItem(event, 'model')" data-id="${model.id}">&times;</button>
                    <div style="font-size: 18px; font-weight: bold;">${model.name}</div>
                </div>`;
            });
        }
        html += `</div>`;
    } else if (!state.failure) {
        html += `<h2>Problèmes connus pour : ${state.model.name}</h2>`;
        if (!state.model.failures || state.model.failures.length === 0) {
            html += `<p style="color: #64748b; font-style: italic;">Aucune panne connue enregistrée.</p>`;
        } else {
            html += `<div class="card-grid">`;
            state.model.failures.forEach((failure, index) => {
                html += `<div class="card" data-action="select-failure" data-index="${index}">
                    <button class="delete-btn" onclick="deleteItem(event, 'failure')" data-index="${index}">&times;</button>
                    <div style="font-size: 18px; font-weight: bold;">${failure.title}</div>
                </div>`;
            });
            html += `</div>`;
        }
    } else {
        // Vue détail panne
        const failure = state.failure;
        const causesList = Array.isArray(failure.causes) ? failure.causes : (failure.cause ? [failure.cause] : []);
        const causesHtml = causesList.map((cause, idx) => `
            <div class="solution-item">
                <input type="checkbox" id="cause-${idx}">
                <label for="cause-${idx}">${cause}</label>
            </div>
        `).join('') + `
            <div class="solution-item" style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #cbd5e1;">
                <input type="checkbox" id="cause-other">
                <label for="cause-other" style="white-space: nowrap; font-weight: 500;">Autre :</label>
                <input type="text" id="cause-other-input" placeholder="Précisez la cause..." style="flex-grow: 1; padding: 5px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;">
            </div>
        `;

        const patientSteps = failure.solutionsPatient || [];
        const techSteps = failure.solutionsTech || [];
        const totalPatientSteps = patientSteps.length;
        
        let guideContent = '';
        
        if (state.stepIndex < totalPatientSteps) {
            guideContent = `
                <div class="step-card">
                    <div class="step-number">Étape Patient ${state.stepIndex + 1} / ${totalPatientSteps}</div>
                    <div class="step-instruction">${patientSteps[state.stepIndex]}</div>
                    <div class="step-actions">
                        ${state.stepIndex > 0 ? `<button class="btn-action btn-no" data-action="previous-step">⬅️ Précédent</button>` : ''}
                        <button class="btn-action btn-yes" data-action="log-success">✅ Résolu</button>
                        <button class="btn-action btn-no" data-action="next-step">❌ Non résolu, étape suivante</button>
                    </div>
                </div>`;
        } else if (state.stepIndex === totalPatientSteps && !state.showTech && techSteps.length > 0) {
            guideContent = `
                <div class="step-card" style="border-color: #f59e0b; background: #fffbeb;">
                    <div class="step-instruction" style="color: #b45309;">⚠️ Les solutions patient n'ont pas fonctionné.<br>Voulez-vous passer aux étapes technicien ?</div>
                    <div class="step-actions">
                        <button class="btn-action btn-no" data-action="previous-step">⬅️ Précédent</button>
                        <button class="btn-action btn-tech" data-action="show-tech">🛠️ Oui, je suis technicien</button>
                        <button class="btn-action btn-restart" data-action="reset-to-model">Retour au modèle</button>
                    </div>
                </div>`;
        } else if (state.showTech && techSteps.length > 0) {
            const techChecklistHtml = techSteps.map((step, idx) => `
                <div class="solution-item" style="margin-bottom: 12px; align-items: flex-start; text-align: left;">
                    <input type="checkbox" id="tech-step-${idx}" style="margin-top: 5px; flex-shrink: 0;">
                    <label for="tech-step-${idx}">${step}</label>
                </div>
            `).join('');
            guideContent = `
                <div class="step-card" style="border-color: #f59e0b;">
                    <h4 style="color: #d97706; margin-top: 0; margin-bottom: 15px; font-size: 16px; text-align: left;">Checklist Technicien</h4>
                    ${techChecklistHtml}
                    <div class="step-actions" style="margin-top: 24px;">
                        <button class="btn-action btn-no" data-action="previous-step">⬅️ Précédent</button>
                        <button class="btn-action btn-yes" data-action="log-success">✅ Intervention terminée</button>
                    </div>
                </div>`;
        } else {
            guideContent = `
                <div class="step-card" style="border-color: #ef4444; background: #fef2f2;">
                    <div class="step-instruction" style="color: #991b1b;">❌ Toutes les solutions ont été tentées.<br>Le problème persiste.</div>
                    <div style="margin-bottom: 20px; color: #7f1d1d;">Veuillez contacter le support niveau 2 ou procéder au remplacement de l'appareil.</div>
                    <div class="step-actions">
                        <button class="btn-action btn-restart" data-action="log-fail">Terminer l'intervention</button>
                    </div>
                </div>`;
        }

        const hasPrev = state.failureIndex > 0;
        const hasNext = state.failureIndex < state.model.failures.length - 1;

        html += `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0284c7; padding-bottom: 8px; margin-bottom: 10px;">
                <h2 style="margin: 0;">Guide : ${state.model.name}</h2>
                <div style="display: flex; gap: 8px;">
                    <button data-action="prev-problem" style="padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1; background: ${hasPrev ? 'white' : '#f8fafc'}; cursor: ${hasPrev ? 'pointer' : 'not-allowed'}; opacity: ${hasPrev ? 1 : 0.5}; font-weight: 600;" ${!hasPrev ? 'disabled' : ''}>←</button>
                    <button data-action="next-problem" style="padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1; background: ${hasNext ? 'white' : '#f8fafc'}; cursor: ${hasNext ? 'pointer' : 'not-allowed'}; opacity: ${hasNext ? 1 : 0.5}; font-weight: 600;" ${!hasNext ? 'disabled' : ''}>→</button>
                </div>
            </div>
            <div class="failure-card">
                <h3 class="failure-title">⚠️ ${failure.title}</h3>
                <div class="solution-grid">
                    <div class="box-cause">
                        <strong style="color: #991b1b; display: block; margin-bottom: 8px;">Causes probables</strong>
                        <div style="color: #7f1d1d;">${causesHtml}</div>
                    </div>
                    <div class="box-solution" style="display: flex; flex-direction: column; justify-content: center;">
                        ${guideContent}
                    </div>
                </div>
            </div>`;
    }

    app.innerHTML = html;
}

// Ouvrir une panne depuis le catalogue
window.openFailureFromCatalogue = function(modelId, failureIndex) {
    const findModel = (items) => {
        for (const item of items) {
            if (item.models) {
                const m = item.models.find(mod => mod.id === modelId);
                if (m) return { model: m, type: item };
            }
            if (item.subTypes) { const found = findModel(item.subTypes); if (found) return found; }
            if (item.brands) { const found = findModel(item.brands); if (found) return found; }
        }
        return null;
    };
    const res = findModel(LIBRARY_DATA);
    if (res) {
        state.type = res.type;
        state.model = res.model;
        state.view = 'library';
        selectFailure(failureIndex);
    }
};

// --- GESTION DES INTERACTIONS ---
function handleInteraction(event) {
    const target = event.target;
    const actionTarget = target.closest('[data-action]');
    if (!actionTarget) return;

    const { action, id, index } = actionTarget.dataset;

    switch (action) {
        case 'select-type': selectType(id); break;
        case 'select-sub-type': selectSubType(id); break;
        case 'select-sub-sub-type': selectSubSubType(id); break;
        case 'select-brand': selectBrand(id); break;
        case 'select-model': selectModel(id); break;
        case 'select-failure': selectFailure(parseInt(index, 10)); break;
        case 'select-search-result': {
            const result = state.searchResults[parseInt(index, 10)];
            state.type = result.type;
            state.subType = result.subType;
            state.subSubType = result.subSubType;
            state.brand = result.brand;
            state.model = result.model;
            state.searchQuery = '';
            state.searchResults = [];
            render();
            break;
        }
        case 'reset-all': resetAll(); break;
        case 'go-back': goBack(); break;
        case 'reset-to-type': resetToType(); break;
        case 'reset-to-sub-type': resetToSubType(); break;
        case 'reset-to-sub-sub-type': resetToSubSubType(); break;
        case 'reset-to-brand': resetToBrand(); break;
        case 'reset-to-model': resetToModel(); break;
        case 'prev-problem':
            if (state.failureIndex > 0) selectFailure(state.failureIndex - 1);
            break;
        case 'next-problem':
            if (state.failureIndex < state.model.failures.length - 1) selectFailure(state.failureIndex + 1);
            break;
        case 'next-step': nextStep(); break;
        case 'previous-step': previousStep(); break;
        case 'show-tech': state.showTech = true; render(); break;
        case 'log-success': logIntervention('Succès'); break;
        case 'log-fail': logIntervention('Échec'); break;
    }
}

document.addEventListener('click', handleInteraction);
document.addEventListener('DOMContentLoaded', render);