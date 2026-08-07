import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx';
import { db } from "./firebaseConfig";
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc, setDoc } from "firebase/firestore";
import ErrorBoundary from "./ErrorBoundary"; // Assurez-vous que le chemin est correct

// Données simulées pour la bibliothèque
const LIBRARY_DATA = [
  {
    id: "aerosol",
    name: "Aérosol",
    models: [
      { id: "airforce-max", name: "Airforce Max", failures: [ // MODIFIED
          { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Cordon secteur déconnecté ou défectueux", "Prise murale hors service", "Disjoncteur déclenché", "Interrupteur de l'appareil sur 'Off'", "Fusible interne grillé", "Panne de la carte d'alimentation"], solutionsPatient: ["Vérifiez que le cordon est bien enfoncé dans la prise murale ET à l'arrière de l'appareil.", "Branchez une lampe sur la même prise pour vérifier si elle fonctionne. Si non, vérifiez le disjoncteur.", "Assurez-vous que le bouton Marche/Arrêt est bien sur la position 'I' (Marche).", "Inspectez visuellement le câble pour toute coupure ou dommage."], solutionsTech: ["Tester la continuité du cordon d'alimentation avec un multimètre.", "Vérifier la présence de tension (230V AC) sur la prise murale.", "Contrôler l'interrupteur de l'appareil (continuité en position 'On').", "Ouvrir l'appareil et vérifier le fusible interne sur la carte d'alimentation.", "Mesurer les tensions de sortie de la carte d'alimentation."] },
          { title: "Débit faible ou irrégulier", causes: ["Kit bouché", "Filtre sale", "Compresseur"], solutionsPatient: ["Avez-vous nettoyé la petite buse du kit ?", "Est-ce que le tuyau est plié ou écrasé ?", "Le filtre à air est-il propre ?"], solutionsTech: ["Vérifier la pression de sortie.", "Remplacer le kit piston/membrane.", "Vérifier les fuites internes."] },
          { title: "Bruit anormal ou vibrations", causes: ["Moteur usé", "Filtre mal inséré", "Corps étranger dans la turbine"], solutionsPatient: ["Vérifier que le filtre est bien en place.", "S'assurer que l'appareil est sur une surface stable."], solutionsTech: ["Nettoyer/remplacer la turbine.", "Vérifier les silentblocs."] },
          { title: "Surchauffe de l'appareil", causes: ["Aérations obstruées", "Utilisation prolongée", "Filtre encrassé"], solutionsPatient: ["Dégager les aérations de l'appareil.", "Laisser refroidir l'appareil avant de le réutiliser."], solutionsTech: ["Nettoyer les conduits d'air internes.", "Vérifier le fonctionnement du ventilateur."] },
          { title: "Tuyau se déconnecte fréquemment", causes: ["Buse du kit obstruée", "Tuyau usé ou distendu", "Pression sortie trop élevée"], solutionsPatient: ["Nettoyez la buse centrale du kit", "Vérifiez si le raccord du tuyau est gras", "Essayez un tuyau neuf"], solutionsTech: ["Vérifier la pression de service.", "Remplacer le raccord de sortie."] },
          { title: "Odeur de brûlé / Surchauffe", causes: ["Filtre à air obstrué", "Moteur fatigué", "Poussière interne"], solutionsPatient: ["Éteindre immédiatement l'appareil", "Remplacer le filtre à air si gris/noir", "Dégager les entrées d'air"], solutionsTech: ["Nettoyage interne.", "Contrôler la consommation moteur.", "Vérifier le ventilateur."] }
      ] },
      { id: "innospire-elegance", name: "Innospire Elegance", failures: [
           { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Cordon secteur déconnecté", "Prise murale défectueuse", "Interrupteur défaillant"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Si vous essayez sur une autre prise, est-ce que ça marche ?", "Le bouton est-il bien sur la position 'I' (Marche) ?"], solutionsTech: ["Tester la continuité du cordon.", "Vérifier l'interrupteur.", "Contrôler la carte électronique."] },
          { title: "Débit faible ou irrégulier", causes: ["Kit bouché", "Filtre sale", "Compresseur"], solutionsPatient: ["Avez-vous nettoyé la petite buse du kit ?", "Est-ce que le tuyau est plié ou écrasé ?", "Le filtre à air est-il propre ?"], solutionsTech: ["Vérifier la pression de sortie.", "Remplacer le kit piston/membrane."] }, // MODIFIED
          { title: "Fuites importantes (Masque ou Circuit)", causes: ["Kit mal assemblé", "Joint usé", "Fissure dans le kit"], solutionsPatient: ["Réassembler correctement le kit.", "Vérifier l'état des joints du kit."], solutionsTech: ["Remplacer le kit de nébulisation.", "Vérifier la pression de sortie de l'appareil."] },
          { title: "Bruit anormal ou vibrations", causes: ["Pieds caoutchouc usés", "Surface instable", "Fixation interne desserrée"], solutionsPatient: ["Placer sur une surface plane et solide", "Vérifier les 4 pieds sous l'appareil"], solutionsTech: ["Resserrer les fixations compresseur.", "Remplacer les silentblocs."] },
          { title: "Arrêt intermittent", causes: ["Surchauffe moteur", "Faux contact cordon", "Interrupteur HS"], solutionsPatient: ["Laisser refroidir 30 min", "Vérifier le branchement mural", "Ne pas utiliser de multiprise"], solutionsTech: ["Tester le cordon.", "Vérifier la sécurité thermique.", "Remplacer l'interrupteur."] },
          { title: "Raccord de sortie cassé", causes: ["Choc", "Usure branchements"], solutionsPatient: ["Vérifier si le tuyau tient", "Ne pas forcer le branchement"], solutionsTech: ["Remplacer l'embase de sortie."] }
      ] },
      { id: "innospire-mini", name: "Innospire Mini", failures: [
          { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Batterie déchargée", "Chargeur défectueux", "Carte mère HS"], solutionsPatient: ["Le chargeur est-il bien branché ?", "Le voyant de charge s'allume-t-il ?", "Est-ce que vous êtes dehors avec l'appareil ?"], solutionsTech: ["Tester avec un autre chargeur.", "Remplacer la batterie.", "Remplacer la carte électronique."] },
          { title: "Débit faible ou irrégulier", causes: ["Kit bouché", "Filtre sale", "Compresseur"], solutionsPatient: ["Avez-vous nettoyé la petite buse du kit ?", "Le filtre à air est-il propre ?"], solutionsTech: ["Vérifier la pression de sortie.", "Remplacer le compresseur."] }, // MODIFIED
          { title: "Voyant de charge ne s'allume pas", causes: ["Chargeur défectueux", "Port de charge endommagé", "Batterie HS"], solutionsPatient: ["Tester avec un autre chargeur.", "Vérifier que le port de charge n'est pas obstrué."], solutionsTech: ["Remplacer le chargeur.", "Vérifier la carte de charge."] },
          { title: "Batterie faible autonomie / Gonflée", causes: ["Cellules Lithium usées", "Chaleur excessive", "Défaut de charge"], solutionsPatient: ["Utiliser sur secteur", "Retirer la batterie si déformée", "Ne pas charger au soleil"], solutionsTech: ["Remplacer la batterie.", "Vérifier tension chargeur."] },
          { title: "Fuites importantes (Masque ou Circuit)", causes: ["Fuite kit nébuliseur", "Tuyau micro-percé", "Filtre mal inséré"], solutionsPatient: ["Réassembler le kit fermement", "Vérifier l'état du tuyau", "Vérifier le filtre à air"], solutionsTech: ["Test étanchéité interne.", "Vérifier clapet compresseur."] },
          { title: "Nébulisation trop lente", causes: ["Kit entartré/usé", "Débit compresseur faible", "Filtre colmaté"], solutionsPatient: ["Changer le kit nébuliseur", "Nettoyer filtre à air", "Utiliser du sérum physiologique frais"], solutionsTech: ["Mesurer le débit air libre.", "Vérifier pression compresseur."] }
      ] },
      { id: "inspiration-elite", name: "Inspiration Elite", failures: [
          { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Alimentation", "Fusible", "Interrupteur"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Si vous essayez sur une autre prise, est-ce que ça marche ?", "Le bouton est-il bien sur la position 'I' (Marche) ?"], solutionsTech: ["Tester la continuité du cordon.", "Vérifier l'interrupteur.", "Contrôler la carte électronique."] },
          { title: "Débit faible ou irrégulier", causes: ["Kit bouché", "Filtre sale", "Compresseur"], solutionsPatient: ["Avez-vous nettoyé la petite buse du kit ?", "Est-ce que le tuyau est plié ou écrasé ?", "Le filtre à air est-il propre ?"], solutionsTech: ["Vérifier la pression de sortie.", "Remplacer le kit piston/membrane."] }, // MODIFIED
          { title: "Bruit anormal ou vibrations", causes: ["Coussinets moteur usés", "Ventilateur touchant le boîtier"], solutionsPatient: ["Vérifier si l'appareil a subi un choc", "S'assurer qu'aucun objet n'est entré dedans"], solutionsTech: ["Ouvrir et inspecter la mécanique.", "Remplacer roulements."] },
          { title: "Fuites importantes (Masque ou Circuit)", causes: ["Joint interne usé", "Raccord fissuré"], solutionsPatient: ["Vérifier l'extrémité du tuyau", "Enfoncer le tuyau fermement"], solutionsTech: ["Remplacer le raccord sortie.", "Vérifier tubes internes."] },
          { title: "Surchauffe rapide du boîtier", causes: ["Entrées air bouchées", "Filtre interne colmaté"], solutionsPatient: ["Dégager l'espace autour de l'appareil", "Changer le filtre à air"], solutionsTech: ["Nettoyage circuit aération.", "Vérifier ventilateur."] },
          { title: "Tuyau qui saute de l'appareil", causes: ["Pression excessive (kit bouché)", "Extrémité tuyau lâche"], solutionsPatient: ["Nettoyer la buse du kit", "Couper 1cm du bout du tuyau", "Tester un nouveau tuyau"], solutionsTech: ["Mesurer pression maximale."] }
      ] },
      { id: "pariboy-pro", name: "PariBoy Pro", failures: [
          { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Alimentation", "Cordon", "Interrupteur"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Si vous essayez sur une autre prise, est-ce que ça marche ?", "Le bouton est-il bien sur la position 'I' (Marche) ?"], solutionsTech: ["Tester le cordon d'alimentation.", "Vérifier l'interrupteur.", "Remplacer la carte électronique."] },
          { title: "Débit faible ou irrégulier", causes: ["Kit bouché", "Filtre sale", "Compresseur"], solutionsPatient: ["Avez-vous nettoyé la petite buse du kit ?", "Est-ce que le tuyau est plié ou écrasé ?", "Le filtre à air est-il propre ?"], solutionsTech: ["Mesurer la pression de service.", "Remplacer le compresseur."] }, // MODIFIED
          { title: "Bruit anormal ou vibrations", causes: ["Moteur desserré", "Segment piston usé"], solutionsPatient: ["Vérifier que rien ne vibre contre l'appareil"], solutionsTech: ["Resserrer berceau moteur.", "Maintenance compresseur."] },
          { title: "Fuites importantes (Masque ou Circuit)", causes: ["Tuyau interne débranché", "Joint culasse HS"], solutionsPatient: ["Appareil semble moins puissant", "Sifflement venant de l'intérieur"], solutionsTech: ["Réparation pneumatique interne."] },
          { title: "Interrupteur bloqué", causes: ["Résidus de médicaments", "Ressort cassé"], solutionsPatient: ["Nettoyer le bouton au sec"], solutionsTech: ["Remplacer interrupteur."] },
          { title: "Pas de brouillard / Buse bouchée", causes: ["Orifice buse obstrué", "Filtre mouillé"], solutionsPatient: ["Déboucher la buse du kit", "Sécher ou changer le filtre"], solutionsTech: ["Vérifier débit (min 3.5L/min)."] }
      ] },
      { id: "pariboy-sx", name: "PariBoy SX", failures: [
          { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Alimentation", "Cordon", "Interrupteur"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Si vous essayez sur une autre prise, est-ce que ça marche ?", "Le bouton est-il bien sur la position 'I' (Marche) ?"], solutionsTech: ["Tester le cordon d'alimentation.", "Vérifier l'interrupteur.", "Remplacer la carte électronique."] },
          { title: "Débit faible ou irrégulier", causes: ["Kit bouché", "Filtre sale", "Compresseur"], solutionsPatient: ["Avez-vous nettoyé la petite buse du kit ?", "Est-ce que le tuyau est plié ou écrasé ?", "Le filtre à air est-il propre ?"], solutionsTech: ["Mesurer la pression de service.", "Remplacer le compresseur."] }, // MODIFIED
          { title: "Bruit anormal ou vibrations", causes: ["Amortisseurs moteur usés", "Axe moteur voilé"], solutionsPatient: ["Poser sur un support stable", "Vérifier les pieds"], solutionsTech: ["Remplacer silentblocs."] },
          { title: "Débit saccadé", causes: ["Membrane compresseur usée", "Clapets fatigués"], solutionsPatient: ["Vérifier si le bruit change", "Vérifier le filtre"], solutionsTech: ["Révision tête compresseur."] },
          { title: "Odeur de chaud", causes: ["Moteur surchauffe", "Ventilation interne obstruée"], solutionsPatient: ["Vérifier le dessous de l'appareil", "Changer le filtre"], solutionsTech: ["Contrôler température moteur."] },
          { title: "Manque de puissance / Ronflement", causes: ["Condensateur HS", "Usure mécanique"], solutionsPatient: ["Moteur peine à démarrer ?", "Ronflement sans air ?"], solutionsTech: ["Changer condensateur."] }
      ] }
    ]
  },
  {
    id: "vni",
    name: "Ventilation Non Invasive (VNI)",
    subTypes: [
      {
        id: "niv-i",
        name: "NIV I",
        brands: [
          {
            id: "lowenstein",
            name: "Löwenstein",
            logo: "/logos/lowenstein.png",
            models: [
              {
                id: "prismaline",
                name: "prismaLine (Série WM100TD)",
                failures: [
                  { // MODIFIED
                    title: "Problème d'alimentation (L'appareil ne démarre pas)",
                    causes: ["Cordon secteur mal branché", "Prise murale hors tension", "Bloc d'alimentation externe défectueux", "Câble DC endommagé", "Connecteur d'embase de l'appareil défectueux", "Panne carte mère"],
                    solutionsPatient: ["Vérifier que le cordon est bien enfoncé dans la prise murale ET dans le bloc d'alimentation.", "S'assurer que le câble DC est bien branché à l'arrière de l'appareil.", "Le voyant vert sur le bloc d'alimentation est-il allumé ? Si non, tester une autre prise.", "Inspecter les câbles pour toute coupure ou pliure excessive."],
                    solutionsTech: ["Mesurer la tension de sortie du bloc d'alimentation externe (doit être ~24V DC).", "Tester avec un bloc d'alimentation compatible connu pour être fonctionnel.", "Vérifier la continuité et l'état du connecteur d'embase à l'arrière de l'appareil.", "Contrôler les tensions d'entrée sur la carte mère."]
                  },
                  {
                    title: "Problème d'affichage (Écran noir ou figé)",
                    causes: ["L'appareil est en mode 'Éco énergie'", "La carte SD est défectueuse ou mal lue, bloquant le système", "Une erreur interne logicielle est survenue", "Nappe de l'écran LCD déconnectée ou endommagée", "Surtension ayant figé le processeur"],
                    solutionsPatient: ["Appuyer brièvement sur la touche I/O (Marche/Arrêt)", "Retirer la carte SD et redémarrer l'appareil", "Débrancher et rebrancher l'appareil après 1 minute"],
                    solutionsTech: ["Désactiver le mode 'Éco énergie' dans le menu clinicien.", "Tester avec une carte SD neuve formatée en FAT32.", "Réinstaller le firmware.", "Vérifier la connexion de la nappe écran."]
                  },
                  {
                    title: "Pression insuffisante ou instable",
                    causes: ["Le filtre à air (gris) est colmaté", "Fuite excessive au masque", "Le tuyau est percé, fendu ou mal raccordé", "Usure des roulements de la turbine", "Obstruction de l'entrée d'air interne"],
                    solutionsPatient: ["Remplacer immédiatement le filtre à air", "Réajuster le masque et vérifier les sangles", "Inspecter le tuyau sur toute sa longueur", "Vérifier que rien n'obstrue la grille d'aération"],
                    solutionsTech: ["Vérifier la calibration du capteur de pression.", "Inspecter l'étanchéité interne (tubulures).", "Vérifier le nombre d'heures de la turbine.", "Mesurer la pression réelle avec un manomètre externe."]
                  },
                  {
                    title: "Message 'Error 702' (Présence d'eau dans la turbine)",
                    causes: ["Appareil basculé avec humidificateur plein", "Réservoir trop rempli (débordement)", "Condensation massive retournée dans l'appareil", "Joint de l'humidificateur défectueux"],
                    solutionsPatient: ["Vider et retirer l'humidificateur immédiatement", "Incliner l'appareil vers l'avant pour évacuer l'eau", "Laisser sécher à l'air libre 24h sans brancher"],
                    solutionsTech: ["Ouvrir l'appareil pour sécher les composants à l'air sec.", "Vérifier l'absence de corrosion sur la carte mère.", "Tester l'étanchéité du réservoir prismaAQUA.", "Remplacer le capteur d'humidité si le code persiste."]
                  },
                  {
                    title: "Bruit anormal ou vibrations",
                    causes: ["Filtre à air mal inséré", "Obstruction de la turbine par un corps étranger", "Usure des roulements turbine", "Appareil posé sur une surface instable"],
                    solutionsPatient: ["Vérifier que le filtre gris est bien clipsé", "Placer l'appareil sur une surface plane et stable", "Vérifier que rien ne touche les entrées d'air"],
                    solutionsTech: ["Nettoyer le bloc turbine.", "Vérifier l'état des silentblocs.", "Remplacer la turbine si le bruit persiste."]
                  },
                  {
                    title: "Problème d'humidification (Air sec ou condensation)",
                    causes: ["Niveau d'humidité réglé trop bas ou trop haut", "Réservoir d'eau vide ou mal inséré", "Température ambiante trop froide", "Tuyau non chauffant ou non isolé"],
                    solutionsPatient: ["Vérifier le niveau d'eau dans le réservoir", "Ajuster le réglage d'humidité dans le menu", "Placer l'appareil plus bas que la tête", "Utiliser une housse de tuyau"],
                    solutionsTech: ["Vérifier la résistance chauffante de l'humidificateur", "Contrôler la sonde de température ambiante", "Tester l'étanchéité du réservoir", "Mettre à jour le firmware si bug de régulation"]
                  },
                  {
                    title: "Fuites importantes (Masque ou Circuit)",
                    causes: ["Masque mal ajusté ou taille inadaptée", "Coussin de masque usé ou déformé", "Harnais trop lâche ou trop serré", "Mouvements importants pendant le sommeil"],
                    solutionsPatient: ["Réajuster le masque sur le visage", "Vérifier l'état du coussin en silicone", "Ajuster les sangles du harnais sans trop serrer", "Utiliser la fonction 'Ajustement du masque' si disponible"],
                    solutionsTech: ["Proposer un gabarit de taille pour le masque", "Remplacer le coussin ou le masque complet", "Vérifier la pression réelle délivrée par l'appareil", "Conseiller un autre type de masque (nasal, facial)"]
                  },
                  {
                    title: "Problème de batterie ou autonomie",
                    causes: ["Batterie interne de secours usée", "Défaut de charge", "Stockage prolongé sans charge"],
                    solutionsPatient: ["Brancher sur secteur immédiatement", "Vérifier le voyant de charge", "Laisser charger au moins 4 heures"],
                    solutionsTech: ["Tester la capacité réelle de la batterie", "Vérifier le circuit de charge", "Remplacer la batterie interne"]
                  }
                ]
              },
              { id: "prisma-30st", name: "Prisma 30ST", failures: [
                { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Cordon secteur déconnecté", "Prise murale défectueuse", "Bloc d'alimentation HS", "Connecteur arrière endommagé"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Avez-vous essayé de brancher une lampe sur cette prise ?", "Est-ce que le voyant du bloc est allumé ?"], solutionsTech: ["Vérifier le bloc d'alimentation externe.", "Tester la tension de sortie du bloc.", "Contrôler la continuité du câble secteur."] }, // MODIFIED
                { title: "Pression insuffisante ou instable", causes: ["Le filtre à air est colmaté", "Fuite excessive au masque", "Le tuyau est percé ou mal raccordé", "Usure des roulements de la turbine", "Obstruction de l'entrée d'air interne"], solutionsPatient: ["Remplacer immédiatement le filtre à air", "Réajuster le masque et vérifier les sangles", "Inspecter le tuyau sur toute sa longueur", "Vérifier que rien n'obstrue la grille d'aération"], solutionsTech: ["Vérifier la calibration du capteur de pression.", "Inspecter l'étanchéité interne (tubulures).", "Vérifier le nombre d'heures de la turbine.", "Mesurer la pression réelle avec un manomètre externe."] }, // MODIFIED
                { title: "Erreur Système (Message d'erreur)", causes: ["Surchauffe de l'appareil due à une obstruction des entrées d'air", "Un bug logiciel passager", "Utilisation d'accessoires non compatibles"], solutionsPatient: ["Laisser l'appareil refroidir et vérifier que rien ne bloque le filtre à l'arrière", "Débrancher l'alimentation, attendre 2 minutes, puis rebrancher", "Vérifier que le filtre est propre et que le tuyau n'est pas plié"], solutionsTech: ["Nettoyer les filtres et les grilles d'aération.", "Mettre à jour le firmware de l'appareil.", "Vérifier la compatibilité des accessoires."] },
                {
                  title: "Problème d'affichage (Écran noir ou figé)",
                  causes: ["Défaut de nappe LCD", "Panne de rétroéclairage", "Erreur logicielle"],
                  solutionsPatient: ["Redémarrer l'appareil", "Vérifier si le bouton Marche s'allume", "Débrancher/rebrancher le bloc secteur", "Appuyer longuement sur la molette"],
                  solutionsTech: ["Tester la tension de la nappe écran.", "Remplacer le bloc LCD.", "Mettre à jour le firmware", "Vérifier la carte graphique interne"]
                },
                {
                  title: "Problème d'humidification (Air sec ou condensation)",
                  causes: ["Humidificateur mal inséré", "Niveau d'humidité réglé incorrectement", "Réservoir d'eau vide ou entartré", "Tuyau non chauffant"],
                  solutionsPatient: ["Vérifier que le réservoir est bien en place", "Ajuster le réglage d'humidité", "Nettoyer le réservoir", "Vider l'eau du tuyau si condensation"],
                  solutionsTech: ["Vérifier la connexion électrique de l'humidificateur", "Tester la résistance chauffante", "Contrôler la sonde de température", "Remplacer l'humidificateur si défectueux"]
                },
                {
                    title: "Erreur Système (Message d'erreur)",
                    causes: ["Mécanisme bloqué par la poussière", "Axe molette fendu", "Nappe déconnectée"],
                    solutionsPatient: ["Nettoyer le contour du bouton", "Appuyer plus fermement", "Débrancher/rebrancher", "Vérifier l'absence de liquide collant"],
                  solutionsTech: ["Tester la tension de la nappe écran.", "Remplacer le bloc LCD.", "Remplacer l'encodeur rotatif", "Dépoussiérer la carte interface"]
                },
                {
                  title: "Bruit anormal ou vibrations",
                  causes: ["Filtre à air mal inséré", "Obstruction de la turbine par un corps étranger", "Usure des roulements turbine", "Appareil posé sur une surface instable"],
                  solutionsPatient: ["Vérifier que le filtre gris est bien clipsé", "Placer l'appareil sur une surface plane et stable", "Vérifier que rien ne touche les entrées d'air"],
                  solutionsTech: ["Nettoyer le bloc turbine.", "Vérifier l'état des silentblocs.", "Remplacer la turbine si le bruit persiste."]
                },
                {
                  title: "Problème de batterie ou autonomie",
                  causes: ["Batterie de sauvegarde défectueuse", "Décharge profonde", "Cycles de vie atteints"],
                  solutionsPatient: ["Laisser branché sur secteur 24h", "Vérifier l'icône batterie", "Contacter le prestataire", "Tester sur une autre prise"],
                  solutionsTech: ["Contrôler la tension de maintien", "Remplacer l'accumulateur interne", "Vérifier le circuit de charge", "Recalibrer via le logiciel Prisma"]
                }
              ]}
            ]
          },
          {
            id: "resmed",
            name: "ResMed",
            logo: "/logos/resmed.png",
            models: [
              { id: "aircurve-10", name: "AirCurve 10", failures: [
                {
                title: "Pression insuffisante ou instable",
                causes: ["Fuite importante dans le circuit", "Masque mal ajusté", "Usure de la turbine", "Tuyau percé ou fissuré"],
                solutionsPatient: [
                  "Est-ce que ça sonne tout le temps, ou juste quand vous vous tournez dans le lit ?",
                  "Vous sentez de l'air qui s'échappe près de vos yeux ou de votre bouche ? Ça fait un sifflement ?",
                  "Vérifiez que le tuyau n'est pas coincé ou percé.",
                  "Assurez-vous que le coude est bien cliqué à l'arrière de la machine."
                ],
                solutionsTech: ["Vérifier P IPAP/EPAP", "Test turbine service", "Inspecter joint sortie"]
              },
              {
                title: "Pas de chauffage",
                causes: ["Résistance chauffante HS", "Humidité trop forte", "Absence de circuit chauffant"],
                solutionsPatient: ["Entendez-vous un clapotis dans le tuyau ?", "Baisser le réglage d'humidité"],
                solutionsTech: ["Réduire l'humidité.", "Utiliser ClimateLineAir.", "Ajouter une housse."]
              },
              { // MODIFIED
                title: "Problème d'alimentation (L'appareil ne démarre pas)",
                causes: ["Cordon secteur mal branché", "Prise murale hors service", "Bloc d'alimentation 90W défectueux", "Connecteur d'embase de l'appareil endommagé", "Panne interne de la machine"],
                solutionsPatient: ["Vérifier que le cordon est bien enfoncé dans la prise murale ET dans le bloc d'alimentation.", "Le voyant vert sur le bloc d'alimentation est-il allumé ? Si non, tester une autre prise.", "S'assurer que le câble DC est bien branché à l'arrière de l'appareil. L'appareil doit bipper au branchement.", "Inspecter les câbles pour toute coupure ou dommage."],
                solutionsTech: ["Mesurer la tension de sortie du bloc d'alimentation 90W (doit être ~24V DC).", "Tester avec un bloc d'alimentation ResMed 90W fonctionnel.", "Vérifier la continuité et l'état du connecteur d'embase à l'arrière de l'appareil.", "Contrôler les tensions d'entrée sur la carte mère."]
              },
              {
                title: "Bruit anormal ou vibrations",
                causes: ["Filtre à air mal inséré ou sale", "Obstruction de la turbine", "Usure des roulements de la turbine", "Appareil posé sur une surface instable"],
                solutionsPatient: ["Vérifier que le filtre est bien en place", "Placer l'appareil sur une surface plane", "Vérifier que rien n'obstrue les entrées d'air"],
                solutionsTech: ["Nettoyer le bloc turbine", "Vérifier l'état des silentblocs", "Remplacer la turbine si le bruit persiste"]
              },
              {
                title: "Problème de batterie ou autonomie",
                causes: ["Batterie externe (Power Station II) usée", "Câble DC mal branché", "Défaut de charge"],
                solutionsPatient: ["Vérifier le branchement de la batterie externe", "Laisser charger la batterie PS II", "Tester sans batterie", "Nettoyer les contacts"],
                solutionsTech: ["Vérifier la tension de sortie de la PS II", "Remplacer le câble de liaison DC", "Remplacer la batterie", "Mettre à jour le firmware de l'appareil"]
              }]
              },
              {
                id: "lumis-150",
                name: "Lumis 150",
                failures: [
                  {
                title: "Problème de détection respiratoire (Trigger)",
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
              { // MODIFIED
                title: "Problème d'alimentation (L'appareil ne démarre pas)",
                causes: ["Cordon secteur mal branché", "Prise murale hors service", "Bloc d'alimentation 90W défectueux", "Connecteur d'embase de l'appareil endommagé", "Panne interne de la machine"],
                solutionsPatient: ["Vérifier que le cordon est bien enfoncé dans la prise murale ET dans le bloc d'alimentation.", "Le voyant vert sur le bloc d'alimentation est-il allumé ? Si non, tester une autre prise.", "S'assurer que le câble DC est bien branché à l'arrière de l'appareil. L'appareil doit bipper au branchement.", "Inspecter les câbles pour toute coupure ou dommage."],
                solutionsTech: ["Mesurer la tension de sortie du bloc d'alimentation 90W (doit être ~24V DC).", "Tester avec un bloc d'alimentation ResMed 90W fonctionnel.", "Vérifier la continuité et l'état du connecteur d'embase à l'arrière de l'appareil.", "Contrôler les tensions d'entrée sur la carte mère."]
              },
              {
                title: "Bruit anormal ou vibrations",
                causes: ["Filtre à air mal inséré", "Obstruction de la turbine par un corps étranger", "Usure des roulements turbine", "Appareil posé sur une surface instable"],
                solutionsPatient: ["Vérifier que le filtre est bien clipsé", "Placer l'appareil sur une surface plane et stable", "Vérifier que rien ne touche les entrées d'air"],
                solutionsTech: ["Nettoyer le bloc turbine.", "Vérifier l'état des silentblocs.", "Remplacer la turbine si le bruit persiste."]
              },
              {
                title: "Problème d'humidification (Air sec ou condensation)",
                causes: ["Réservoir d'eau vide ou mal inséré", "Niveau d'humidité réglé incorrectement", "Tuyau non chauffant", "Température ambiante trop froide"],
                solutionsPatient: ["Vérifier le niveau d'eau", "S'assurer que le réservoir est bien cliqué", "Ajuster le réglage d'humidité", "Vider l'eau du tuyau si condensation"],
                solutionsTech: ["Vérifier la résistance chauffante", "Contrôler la sonde de température", "Tester le fonctionnement du ClimateLineAir", "Nettoyer les contacts de l'humidificateur"]
              },
              {
                title: "Problème de batterie ou autonomie",
                causes: ["Alarme de batterie vide", "Défaut de la batterie externe", "Connectique défectueuse"],
                solutionsPatient: ["Brancher sur secteur", "Vérifier l'icône batterie", "Laisser charger la batterie externe", "Vérifier le câble DC"],
                solutionsTech: ["Tester la batterie interne de secours", "Vérifier le circuit de commutation", "Mesurer l'ampérage de charge", "Remplacer la batterie interne"]
              }]
              },
              {
                id: "lumis-100-vpap",
                name: "Lumis 100 VPAP",
                failures: [
                  { title: "Fuites importantes (Masque ou Circuit)", causes: ["Le masque est mal positionné, mal serré ou de taille inadaptée", "Le circuit respiratoire est mal branché à la sortie d'air", "Le joint du réservoir d'eau est mal inséré ou usé"], solutionsPatient: ["Réajuster le masque et utiliser la fonction 'Ajustement du masque' (Fit) dans le menu", "Déconnecter et reconnecter fermement le tuyau", "Vérifier que le réservoir est bien fermé et que le joint est bien plat"], solutionsTech: ["Vérifier l'étanchéité du masque avec le gabarit.", "Inspecter le circuit patient pour toute fissure.", "Remplacer le joint du réservoir d'eau."] },
                  { title: "Problème d'humidification (Air sec ou condensation)", causes: ["Le niveau d'humidification réglé est trop bas", "Le patient respire par la bouche avec un masque nasal (fuite buccale)", "L'air ambiant est trop sec"], solutionsPatient: ["Augmenter le niveau d'humidité dans le menu 'Options'", "Utiliser une mentonnière ou passer à un masque facial (bucco-nasal)", "Vérifier que le réservoir contient assez d'eau"], solutionsTech: ["Ajuster le réglage d'humidité dans le menu clinicien.", "Conseiller un masque facial.", "Vérifier le fonctionnement de l'humidificateur."] },
                  {
                    title: "Problème d'affichage (Écran noir ou figé)",
                causes: ["Cordon secteur déconnecté", "Prise murale défectueuse", "Bloc d'alimentation HS", "Connecteur arrière endommagé"],
                solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Avez-vous essayé de brancher une lampe sur cette prise ?", "Est-ce que le voyant du bloc est allumé ?"],
                solutionsTech: ["Vérifier le bloc d'alimentation externe.", "Tester la tension de sortie du bloc.", "Contrôler la continuité du câble secteur."]
              },
              {
                title: "Bruit anormal ou vibrations",
                causes: ["Filtre à air mal inséré", "Obstruction de la turbine par un corps étranger", "Usure des roulements turbine", "Appareil posé sur une surface instable"],
                solutionsPatient: ["Vérifier que le filtre est bien clipsé", "Placer l'appareil sur une surface plane et stable", "Vérifier que rien ne touche les entrées d'air"],
                solutionsTech: ["Nettoyer le bloc turbine.", "Vérifier l'état des silentblocs.", "Remplacer la turbine si le bruit persiste."]
              },
              {
                title: "Problème de batterie ou autonomie",
                causes: ["Batterie de sauvegarde déchargée", "Surchauffe pendant la charge", "Cycles épuisés", "Défaut carte mère"],
                solutionsPatient: ["Laisser refroidir l'appareil", "Brancher sur secteur", "Vérifier les icônes", "Retirer le sac de transport"],
                solutionsTech: ["Vérifier le ventilateur de charge", "Remplacer la batterie interne", "Mesurer la tension de charge", "Mise à jour logicielle"]
              }
              ]
              },
              {
                id: "lumis-150-vpap",
                name: "Lumis 150 VPAP",
                failures: [
                  { title: "Problème d'humidification (Air sec ou condensation)", causes: ["L'humidité réglée est trop élevée pour la température de la chambre", "L'appareil est posé plus haut que la tête du patient, laissant l'eau couler vers le masque"], solutionsPatient: ["Diminuer le réglage de l'humidité ou activer le mode 'Auto'", "Placer l'appareil à une hauteur inférieure à celle du lit", "Utiliser un tuyau chauffant ClimateLineAir pour maintenir la température de l'air"], solutionsTech: ["Vérifier la sonde de température ambiante.", "Installer un tuyau chauffant.", "Ajuster les paramètres de Climate Control."] },
                  { title: "Erreur Système (Message d'erreur)", causes: ["Surchauffe de l'appareil due à une obstruction des entrées d'air", "Un bug logiciel passager", "Utilisation d'accessoires non compatibles"], solutionsPatient: ["Laisser l'appareil refroidir et vérifier que rien ne bloque le filtre à l'arrière", "Débrancher l'alimentation, attendre 2 minutes, puis rebrancher", "Vérifier que le filtre est propre et que le tuyau n'est pas plié"], solutionsTech: ["Nettoyer les filtres et les grilles d'aération.", "Mettre à jour le firmware de l'appareil.", "Vérifier la compatibilité des accessoires."] },
                  {
                    title: "Problème d'alimentation (L'appareil ne démarre pas)",
                    causes: ["Cordon secteur déconnecté", "Prise murale défectueuse", "Bloc d'alimentation HS", "Connecteur arrière endommagé"],
                    solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Avez-vous essayé de brancher une lampe sur cette prise ?", "Est-ce que le voyant du bloc est allumé ?"],
                    solutionsTech: ["Vérifier le bloc d'alimentation externe.", "Tester la tension de sortie du bloc.", "Contrôler la continuité du câble secteur."]
                  },
                  {
                    title: "Pression insuffisante ou instable",
                    causes: ["Le filtre à air est colmaté", "Fuite excessive au masque", "Le tuyau est percé ou mal raccordé", "Usure des roulements de la turbine", "Obstruction de l'entrée d'air interne"],
                    solutionsPatient: ["Remplacer immédiatement le filtre à air", "Réajuster le masque et vérifier les sangles", "Inspecter le tuyau sur toute sa longueur", "Vérifier que rien n'obstrue la grille d'aération"],
                    solutionsTech: ["Vérifier la calibration du capteur de pression.", "Inspecter l'étanchéité interne (tubulures).", "Vérifier le nombre d'heures de la turbine.", "Mesurer la pression réelle avec un manomètre externe."]
                  },
                  {
                    title: "Problème de batterie ou autonomie",
                    causes: ["Batterie interne HS", "Défaut de charge", "Utilisation prolongée sur batterie"],
                  solutionsPatient: ["Brancher sur secteur", "Laisser charger 6h", "Vérifier les icônes à l'écran", "Vérifier le voyant du chargeur"],
                  solutionsTech: ["Tester la capacité réelle", "Remplacer le module batterie", "Vérifier l'embase de connexion", "Mise à jour firmware"]
                  }
                ]
              },
            ]
          },
          {
            id: "philips-respironics",
            name: "Philips Respironics",
            logo: "/logos/philips.png",
            models: [{
              id: "trilogy-evo",
              name: "Trilogy Evo",
              failures: []
            }]
          }
        ]
    },
      {
        id: "niv-iii",
        name: "NIV III",
        brands: [
          {
            id: "resmed",
            name: "ResMed",
            logo: "/logos/resmed.png",
            models: [
              { id: "astral-150", name: "Astral 150", failures: [
                { title: "Problème de batterie ou autonomie", causes: ["Fin cycle batterie", "Stockage sans charge", "Température élevée"], solutionsPatient: ["Brancher sur secteur pour recalibrer", "Vérifier santé batterie (Info)", "Contacter le technicien"], solutionsTech: ["Remplacer batterie interne"] },
                { title: "Erreur Système (Générique / Apprentissage)", causes: ["Apprentissage circuit non fait", "Fuite valve expiratoire Astral", "Capteur O2 HS", "Entrée air bouchée"], solutionsPatient: ["Lancer 'Apprentissage circuit'", "Vérifier clipsage valve expiratoire", "Nettoyer les filtres", "Redémarrer la machine"], solutionsTech: ["Tester autre bloc valve", "Calibration capteurs", "Remplacer cellule O2", "Nettoyage interne"] },
                { title: "Alarme Volume Minute Bas (Vmin Bas)", causes: ["Encombrement bronchique", "Fuite importante au masque", "Pression inspiratoire insuffisante", "Patient endormi profondément"], solutionsPatient: ["Réajuster le masque", "Pratiquer un désencombrement", "Vérifier si le tuyau est percé"], solutionsTech: ["Ajuster les alarmes", "Vérifier la calibration du capteur de débit", "Vérifier l'étanchéité interne"] },
                { title: "Alarme Fréquence Haute", causes: ["Anxiété ou douleur", "Lutte contre la machine", "Auto-déclenchement (Trigger trop sensible)"], solutionsPatient: ["Se calmer et respirer avec la machine", "Vérifier l'absence de condensation dans le tuyau"], solutionsTech: ["Diminuer la sensibilité du trigger", "Vérifier les réglages de confort (pente)", "Analyser les logs de trigger"] }
              ]},
              { id: "elisee-150", name: "Elisée 150 (V2)", failures: [
                { title: "Erreur Système (Message d'erreur)", causes: ["Tube commande débranché", "Membrane valve percée", "Pile bouton vide"], solutionsPatient: ["Vérifier petit tube transparent", "Vérifier membrane silicone", "Demander remplacement pile"], solutionsTech: ["Remplacer pile CR2032", "Vérifier bus communication", "Mise à jour soft"] },
                { title: "Problème d'affichage (Écran noir ou figé)", causes: ["Humidité sur dalle", "Défaut étalonnage dalle tactile", "Nappe desserrée", "Surcharge processeur"], solutionsPatient: ["Nettoyer l'écran", "Redémarrer l'appareil", "Utiliser un stylet", "Vérifier branchement secteur"], solutionsTech: ["Étalonnage dalle tactile", "Remplacer l'écran LCD", "Contrôler la carte mère", "Vérifier rétroéclairage"] },
                {
                  title: "Problème de batterie ou autonomie",
                  causes: ["Batterie interne usée", "Décharge profonde", "Surchauffe"],
                  solutionsPatient: ["Brancher sur secteur", "Vérifier l'icône de charge", "Laisser charger 4h minimum"],
                  solutionsTech: ["Tester la capacité réelle", "Vérifier le circuit de charge", "Remplacer la batterie interne"]
                }
              ]},
              { id: "vs-iii", name: "VS III", failures: [
                { title: "Pression insuffisante ou instable", causes: ["Circuit double mal raccordé", "Fuite port pilotage valve", "Membrane expiratoire percée", "Usure piston"], solutionsPatient: ["Vérifier clipsage bloc arrière", "Inspecter raccords circuit double", "Vérifier la membrane de valve", "Réajuster le masque"], solutionsTech: ["Test étanchéité interne", "Calibration turbine", "Remplacer la membrane de valve", "Contrôler le bloc de pilotage"] },
                {
                  title: "Problème de batterie ou autonomie",
                  causes: ["Fin de vie des accumulateurs", "Stockage sans charge", "Défaut carte alim", "Surchauffe"],
                  solutionsPatient: ["Laisser branché sur secteur en permanence hors utilisation", "Vérifier le voyant de charge", "Tester autre cordon", "Vérifier prise murale"],
                  solutionsTech: ["Remplacer le bloc batterie interne", "Vérifier la tension de maintien", "Mesurer ampérage charge", "Contrôler bus batterie"]
                },
                { title: "Alarme Déconnexion", causes: ["Circuit patient débranché", "Fuite massive", "Valve expiratoire mal clipsée"], solutionsPatient: ["Vérifier les connexions du tuyau", "Vérifier le masque", "Vérifier le clipsage du bloc valve"], solutionsTech: ["Tester avec un poumon de test", "Vérifier le capteur de pression", "Calibration"] }
              ]}
            ]
          },
          {
            id: "philips-respironics",
            name: "Philips Respironics",
            logo: "/logos/philips.png",
            models: [
              { id: "trilogy-100", name: "Trilogy 100", failures: [
                { title: "Erreur Système (Générique / Surchauffe)", causes: ["Évents obstrués", "Filtre mousse sale", "Température > 40°C"], solutionsPatient: ["Dégager espace (> 15cm)", "Nettoyer le filtre mousse", "Laisser refroidir"], solutionsTech: ["Vérifier ventilateur interne", "Dépoussiérage interne", "Mise à jour firmware"] },
                { title: "Pression insuffisante ou instable", causes: ["Encombrement bronchique", "Fuite importante", "Vmin Bas"], solutionsPatient: ["Vérifier les raccords", "Soin de désencombrement", "Réajuster le masque"], solutionsTech: ["Calibration débit", "Tester turbine", "Check valve expiratoire"] },
                { title: "Alarme Circuit déconnecté", causes: ["Circuit patient débranché", "Fuite massive", "Capteur de pression interne défectueux"], solutionsPatient: ["Vérifier les connexions du tuyau", "Vérifier le masque", "Appuyer sur 'Silence alarme' et reconnecter"], solutionsTech: ["Tester avec un poumon de test", "Vérifier le capteur de pression"] },
                {
                  title: "Problème de batterie ou autonomie",
                  causes: ["Batterie interne ou externe HS", "Mauvaise gestion de charge", "Contacts Smart oxydés", "Fusible batterie grillé"],
                  solutionsPatient: ["Vérifier si l'appareil bascule bien sur AC", "Laisser charger 6h", "Retirer la batterie externe pour tester", "Nettoyer contacts"],
                  solutionsTech: ["Tester l'autonomie sur charge fictive", "Remplacer la batterie interne (Lithium-Ion)", "Vérifier le module Smart", "Mise à jour logiciel charge"]
                }
              ]}
            ]
          },
          {
            id: "air-liquide",
            name: "Air Liquide",
            logo: "/logos/airliquide.png",
            models: [
              { id: "monnal-t50", name: "Monnal T50", failures: [
                { title: "Erreur Système (Générique / Capteur Débit)", causes: ["Capteur débit humide/sale", "Batterie faible pour tests", "Bug écran", "Obstruction turbine"], solutionsPatient: ["Vérifier propreté capteur", "Brancher sur secteur", "Vérifier étanchéité branche", "Redémarrer"], solutionsTech: ["Calibrer capteur débit", "Mise à jour soft", "Check filtres internes"] },
                { title: "Pression insuffisante ou instable", causes: ["Valve expiratoire bloquée", "Tuyau plié", "Lutte patient"], solutionsPatient: ["Sécher valve expiratoire", "Dégager tubulure", "Aspiration bronchique"], solutionsTech: ["Nettoyer bloc expiratoire", "Check Pmax", "Recalibrer trigger"] },
                { title: "Alarme O2 Bas", causes: ["Source O2 vide", "Cellule O2 usée", "Raccord O2 mal branché"], solutionsPatient: ["Vérifier la bouteille d'oxygène", "Vérifier le branchement au dos de la machine"], solutionsTech: ["Recalibrer la cellule O2", "Remplacer la cellule O2", "Vérifier le mélangeur interne"] },
                {
                  title: "Problème de batterie ou autonomie",
                  causes: ["Cycles de charge dépassés", "Surchauffe pendant la charge", "Défaut bloc alim", "Batterie HS"],
                  solutionsPatient: ["Brancher sur secteur immédiatement", "Vérifier l'état de la batterie dans le menu maintenance", "Charger 12h", "Vérifier voyant"],
                  solutionsTech: ["Remplacer le pack batterie", "Mise à jour logiciel de gestion d'énergie", "Tester alimentation 19V", "Calibration"]
                }
              ]}
            ]
          },
          {
            id: "puritan-bennett",
            name: "Puritan Bennett",
            logo: "/logos/covidien.png",
            models: [
              { id: "pb-560", name: "PB 560", failures: [
                { title: "Erreur Système (Générique / Paramètres)", causes: ["Paramètres incompatibles", "Erreur décharge totale", "Bug firmware", "Capteur de pression HS"], solutionsPatient: ["Revoir la prescription", "Valider chaque écran de réglage", "Débrancher et rebrancher l'alimentation", "Redémarrer l'appareil"], solutionsTech: ["Reset logiciel via menu SAV", "Mise à jour du firmware", "Remplacer le capteur de pression", "Analyser les logs d'erreurs"] },
                { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Câble défaillant", "Fusible interne grillé", "Interrupteur HS", "Tension instable"], solutionsPatient: ["Tester autre câble standard", "Vérifier icône prise à l'écran", "Changer de prise murale", "Pousser l'interrupteur"], solutionsTech: ["Tester bloc alim", "Vérifier continuité inter", "Remplacer fusible", "Mesurer V sortie"] },
                { title: "Problème de trigger (Auto-déclenchement)", causes: ["Condensation dans le circuit", "Trigger trop sensible", "Fuite importante"], solutionsPatient: ["Vider l'eau du tuyau", "Réajuster le masque"], solutionsTech: ["Diminuer la sensibilité du trigger", "Vérifier l'étanchéité du circuit"] },
                {
                  title: "Problème de batterie ou autonomie",
                  causes: ["Batterie totalement déchargée (0%)", "Fin de vie utile", "Surchauffe charge", "Commutateur batterie"],
                  solutionsPatient: ["Laisser branché 24h sans interruption", "Vérifier si l'appareil bipe au branchement", "Aérer la machine", "Vérifier icône batterie"],
                  solutionsTech: ["Tester la tension résiduelle", "Remplacer la batterie interne", "Calibration batterie", "Tester cycle décharge"]
                }
              ]}
            ]
          },
          {
            id: "lowenstein",
            name: "Löwenstein",
            logo: "/logos/lowenstein.png",
            models: [
              { id: "luisa", name: "LUISA", failures: [
                { title: "Problème d'oxygène (FiO2 basse)", causes: ["Source O2 vide", "Cellule O2 usée/non calibrée", "Fuite circuit", "Sélecteur O2"], solutionsPatient: ["Vérifier l'arrivée d'O2", "Recalibrer la cellule", "Vérifier raccords", "Changer le bocal O2"], solutionsTech: ["Remplacer la cellule O2", "Tester la valve O2", "Mise à jour calibration", "Check pressostat"] },
                { title: "Problème d'affichage (Écran noir ou figé)", causes: ["Saleté/humidité sur dalle", "Bug logiciel", "Nappe écran", "Surchauffe CPU"], solutionsPatient: ["Nettoyer l'écran", "Redémarrer l'appareil", "Vérifier secteur", "Laisser refroidir"], solutionsTech: ["Mise à jour firmware", "Changer unité LCD", "Vérifier nappe graphique", "Reprogrammation carte mère"] },
                {
                  title: "Problème de batterie ou autonomie",
                  causes: ["Batterie intelligente en erreur", "Vieillissement", "Contacts sales", "Alim sous-dimensionnée"],
                  solutionsPatient: ["Vérifier le niveau sur l'écran tactile", "Brancher sur secteur", "Nettoyer les connecteurs", "Charger 10h"],
                  solutionsTech: ["Vérifier les logs batterie", "Remplacer la SmartBattery", "Tester bloc alim", "Recalibrer"]
                }
              ]}
            ]
          },
          {
            id: "saime",
            name: "Saime",
            models: [
              { id: "eole-3", name: "Eole 3 S / XLS", failures: [
                { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Cordon secteur déconnecté", "Fusible embase grillé", "Interrupteur défectueux", "Batterie interne HS", "Panne carte alim"], solutionsPatient: ["Vérifier le branchement au mur et au dos de l'appareil", "Appuyer fermement sur l'interrupteur", "Vérifier si un voyant s'allume au branchement", "Tester une autre prise murale"], solutionsTech: ["Tester le cordon secteur", "Vérifier/Remplacer le fusible d'embase", "Mesurer la tension de sortie de la carte alim", "Vérifier la tension des batteries"] },
                { title: "Pression insuffisante ou instable", causes: ["Usure soufflet (modèle XLS)", "Fuite interne majeure", "Vanne expiratoire", "Filtre bouché"], solutionsPatient: ["Utiliser ventilateur de secours immédiatement", "Appeler le technicien", "Changer le filtre", "Désencombrer patient"], solutionsTech: ["Remplacer le soufflet", "Révision atelier", "Calibration débit", "Test étanchéité interne"] },
                { title: "Erreur Système (Message d'erreur)", causes: ["Panne carte électronique", "Batterie sécurité vide", "Bug logiciel", "Surtension"], solutionsPatient: ["Passer en ventilation manuelle (ballon)", "Retour atelier d'urgence", "Éteindre/rallumer", "Vérifier voyants"], solutionsTech: ["Diagnostic carte mère", "Mise à jour firm", "Remplacer pile RAM", "Dépannage bus"] },
                {
                  title: "Problème de batterie ou autonomie",
                  causes: ["Batterie Pb-Acide ou NiMH usée", "Absence de charge longue durée", "Chargeur interne HS", "Surchauffe"],
                  solutionsPatient: ["Brancher sur secteur 12h", "Vérifier le voyant batterie", "Nettoyer les ouïes", "Vérifier cordon"],
                  solutionsTech: ["Remplacer les accumulateurs de secours", "Tester le circuit de charge", "Mesurer V maintien", "Revision complète"]
                },
                { title: "Fuites importantes (Masque ou Circuit)", causes: ["Circuit mal branché", "Valve expiratoire mal vissée", "Tuyau percé"], solutionsPatient: ["Vérifier le serrage du circuit", "S'assurer que la valve expiratoire fait 'clic'", "Inspecter le tuyau"], solutionsTech: ["Test étanchéité circuit", "Vérifier la membrane de valve", "Contrôler le débit de fuite"] },
                { title: "Bruit anormal ou sifflement (Turbine)", causes: ["Usure des roulements", "Filtre à air colmaté", "Corps étranger"], solutionsPatient: ["Vérifier la propreté du filtre arrière", "Dégager l'arrière de l'appareil"], solutionsTech: ["Nettoyer la turbine", "Remplacer le bloc moteur/turbine", "Vérifier l'équilibrage"] },
                { title: "Problème d'affichage (Écran noir ou figé)", causes: ["Nappe d'écran desserrée", "Surtension secteur", "Défaut rétroéclairage"], solutionsPatient: ["Débrancher/rebrancher le secteur", "Vérifier si les voyants s'allument"], solutionsTech: ["Tester la nappe LCD", "Remplacer l'unité d'affichage", "Vérifier les tensions carte mère"] }
              ]}
            ]
          },
          {
            id: "breas",
            name: "Breas",
            models: [
              { id: "vivo-45-ls", name: "Vivo 45 LS", failures: [
                { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Alimentation", "Batterie", "Carte"], solutionsPatient: ["Brancher sur secteur", "Voyant charge allumé ?", "Tester autre prise", "Vérifier voyant bloc"], solutionsTech: ["Tester alimentation", "Remplacer batterie", "Contrôler carte mère", "Vérifier connecteur DC"] },
                { title: "Pression insuffisante ou instable", causes: ["Masque", "Circuit", "Filtre"], solutionsPatient: ["Masque bien mis ?", "Filtre propre ?", "Tuyau plié ?", "Respirer doucement"], solutionsTech: ["Vérifier calibration", "Remplacer turbine", "Nettoyage interne", "Test étanchéité"] }
              ]}
            ]
          }
        ]
      }
    },
    ]
  },
  {
    id: "vaa",
    name: "Ventilation Assistée (VAA)",
    brands: [
      {
        id: "draeger",
        name: "Dräger",
        models: [
          {
            id: "evita-v300",
            name: "Evita V300",
            failures: [
              {
                title: "Pression insuffisante ou instable",
                causes: ["Obstruction du circuit", "Toux ou encombrement du patient", "Tuyau plié", "Filtre expiratoire colmaté"],
                solutionsPatient: ["Vérifier si le tuyau est plié ou coincé", "Vérifier le branchement secteur", "Procéder à un désencombrement si nécessaire"],
                solutionsTech: ["Vérifiez le réglage de l'alarme Pmax", "Lancez un test de circuit", "Inspectez et remplacez le filtre expiratoire"]
              },
              {
                title: "Fuites importantes (Masque ou Circuit)",
                causes: ["Déconnexion du circuit", "Fuite massive au masque", "Valve expiratoire mal clipsée"],
                solutionsPatient: ["Reconnecter fermement le circuit", "Réajuster le masque", "Vérifier le clipsage de la valve expiratoire"],
                solutionsTech: ["Vérifier l'intégrité de la tubulure", "Contrôler le montage de la valve expiratoire", "Recalibrer les capteurs de débit"]
              }
            ]
          }
        ]
      },
      {
        id: "resmed",
        name: "ResMed",
        logo: "/logos/resmed.png",
        models: [
          {
            id: "aircurve-10-cs",
            name: "AirCurve 10 CS PaceWave",
            failures: [
              { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Cordon déconnecté", "Bloc alim HS", "Prise murale défectueuse"], solutionsPatient: ["Vérifier branchement secteur", "Tester autre prise", "Vérifier voyant bloc secteur", "Vérifier le voyant vert sur bloc"], solutionsTech: ["Tester bloc 90W", "Vérifier connecteur embase", "Remplacer cordon", "Check fusible embase"] },
              { title: "Pression insuffisante ou instable", causes: ["Tuyau plié", "Filtre colmaté", "Obstruction interne"], solutionsPatient: ["Vérifier si le tuyau est plié", "Remplacer le filtre à air", "Réajuster le masque"], solutionsTech: ["Vérifier calibration turbine", "Check capteur pression"] },
              { title: "Fuites importantes (Masque ou Circuit)", causes: ["Masque mal ajusté", "Joint réservoir usé", "Bac mal inséré"], solutionsPatient: ["Réajuster le masque ('Mask Fit')", "Vérifier insertion bac", "Vérifier clipsage tuyau"], solutionsTech: ["Vérifier étanchéité coude", "Remplacer joint silicone"] },
              { title: "Problème d'humidification (Air sec ou condensation)", causes: ["Humidité trop haute", "Chambre froide", "Tuyau non isolé"], solutionsPatient: ["Baisser réglage humidité", "Utiliser housse tuyau", "Placer l'appareil plus bas que le lit"], solutionsTech: ["Vérifier sonde thermique", "Installer ClimateLineAir"] },
              {
                title: "Erreur Système (Message d'erreur)",
                causes: ["Moteur défaillant", "Eau dans turbine", "Surchauffe"],
                solutionsPatient: ["Laisser refroidir 30 min", "Vérifier propreté filtre", "Débrancher/rebrancher"],
                solutionsTech: ["Vérifier absence humidité interne", "Tester turbine mode service"]
              },
              {
                title: "Problème de batterie ou autonomie",
                causes: ["Batterie externe (PS II) usée", "Câble DC défectueux", "Défaut communication"],
                solutionsPatient: ["Vérifier le câble de la batterie externe", "Charger la Power Station II", "Vérifier les connecteurs", "Brancher sur secteur"],
                solutionsTech: ["Vérifier la tension DC", "Remplacer le câble", "Recalibrer charge", "Changer PS II"]
              }
            ]
          },
          {
            id: "aircurve-10-vauto",
            name: "AirCurve 10 VAuto",
            failures: [
              { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Bloc alim HS", "Faux contact prise", "Câble abîmé"], solutionsPatient: ["Vérifier branchement secteur", "Vérifier voyant bloc", "Tester autre prise", "Vérifier connecteur machine"], solutionsTech: ["Vérifier alimentation 90W", "Check embase interne", "Ressouder connecteur", "Mise à jour soft"] },
              { title: "Pression insuffisante ou instable", causes: ["Trigger trop sensible", "Pression support élevée", "Asynchronie"], solutionsPatient: ["Réajuster le masque", "Vérifier si tuyau plié", "Respirer calmement", "Changer le filtre"], solutionsTech: ["Ajuster sensibilité trigger", "Check pressions IPAP/EPAP", "Calibration turbine", "Test asynchronie poumon test"] },
              { title: "Fuites importantes (Masque ou Circuit)", causes: ["Coussin usé", "Harnais lâche", "Bac mal inséré"], solutionsPatient: ["Resserrer le harnais", "Vérifier insertion bac", "Vérifier clipsage tuyau", "Ajuster la bulle"], solutionsTech: ["Vérifier taille masque", "Remplacer joint de sortie", "Test étanchéité interne", "Check bac à eau"] },
              { title: "Problème d'humidification (Air sec ou condensation)", causes: ["Humidité haute", "Chambre froide", "Appareil au sol"], solutionsPatient: ["Baisser réglage humidité", "Vider l'eau du tuyau", "Utiliser housse isolante", "Surélever la machine"], solutionsTech: ["Réduire réglage humidité", "Check sonde température", "Tester ClimateLine", "Check embase"] }
            ]
          }
        ]
      },
      {
        id: "philips-respironics",
        name: "Philips Respironics",
        logo: "/logos/philips.png",
        models: [
          {
            id: "trilogy-evo",
            name: "Trilogy Evo",
            failures: [
              {
                title: "Problème d'alimentation (L'appareil ne démarre pas)",
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
              },
              {
                title: "Problème de batterie ou autonomie",
                causes: ["Batterie amovible défectueuse", "Fin de vie utile", "Surchauffe"],
                solutionsPatient: ["Retirer et réinsérer la batterie", "Brancher sur secteur", "Laisser refroidir", "Nettoyer les contacts"],
                solutionsTech: ["Tester la capacité", "Remplacer la batterie Smart", "Contrôler le circuit de charge", "Firmware gestion énergie"]
              }
            ]
          },
          {
            id: "dreamstation-bipap-autosv",
            name: "DreamStation BiPAP autoSV",
            failures: [
              {
                  title: "Pression insuffisante ou instable",
                  causes: ["Obstruction circuit", "Filtre colmaté", "Fuite massive", "Tuyau écrasé"],
                  solutionsPatient: ["Vérifier branchement", "Vérifier si tuyau plié", "Réajuster le masque"],
                solutionsTech: ["Inspecter le tuyau.", "Remplacer le filtre à air.", "Réajuster le masque.", "Tester l'appareil avec un bouchon."]
              },
              {
                title: "Problème d'alimentation (L'appareil ne démarre pas)",
                causes: ["Mauvais transformateur (60W au lieu de 80W)", "Fiche centrale tordue", "Bloc défectueux"],
                solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Le message s'affiche-t-il ?", "Est-ce bien le bloc d'alimentation d'origine Philips ?"],
                solutionsTech: ["Utiliser exclusivement le bloc d'alimentation de 80W fourni.", "Vérifier la tension de sortie du bloc secteur.", "Tester avec un autre bloc 80W Philips certifié."]
              },
              {
                title: "Problème de batterie ou autonomie",
                causes: ["Module batterie Philips usé", "Connectique embase oxydée", "Charge incomplète"],
                solutionsPatient: ["Vérifier le voyant sur le module batterie", "Nettoyer les contacts avec un chiffon sec", "Laisser charger 4h", "Brancher on secteur"],
                solutionsTech: ["Tester la tension du module", "Remplacer le module batterie", "Vérifier alim 80W", "Check comm bus batterie"]
              }
            ]
          },
          {
            id: "bipap-autosv-advanced",
            name: "BiPAP autoSV Advanced",
            failures: [
              {
              title: "Problème d'alimentation (L'appareil ne démarre pas)",
              causes: ["Perte secteur", "Faux contact prise arrière", "Bloc alim HS", "Température interne", "Cordon coupé"],
              solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "La machine s'arrête-t-elle si vous bougez légèrement le fil à l'arrière ?", "Dégager l'arrière", "Tester autre prise"],
              solutionsTech: ["Vérifier que le cordon est bien enfoncé.", "Tester avec une autre alimentation.", "Contrôler la température interne.", "Vérifier l'embase soudée"]
              },
              {
                title: "Pression insuffisante ou instable",
                causes: ["Valve expiratoire bloquée", "Toux patient", "Filtre colmaté", "Tuyau plié"],
                solutionsPatient: ["Vérifier branchement", "Nettoyer la valve System One", "Remplacer le filtre arrière", "Ajuster masque"],
                solutionsTech: ["Nettoyer la valve System One.", "Remplacer le filtre gris.", "Vérifier les réglages de Pmax.", "Recalibrer turbine"]
              },
              {
                title: "Problème de batterie ou autonomie",
                causes: ["Batterie interne de secours usée", "Stockage prolongé sans charge", "Défaut carte mère", "Chargeur interne HS"],
                solutionsPatient: ["Brancher sur secteur en permanence", "Vérifier si l'appareil bipe au démarrage", "Laisser charger 24h", "Redémarrer l'appareil"],
                solutionsTech: ["Remplacer l'accumulateur interne", "Vérifier tension de maintien", "Révision carte alim", "Recalibrage batterie"]
              }
            ]
          }
        ]
      }
    ]
  },
      {
        id: "dreamstation-bipap-autosv",
        name: "DreamStation BiPAP autoSV",
        failures: [
          {
                title: "Pression insuffisante ou instable",
                causes: ["Obstruction circuit", "Filtre colmaté", "Fuite massive", "Tuyau écrasé"],
                solutionsPatient: ["Vérifier branchement", "Vérifier si tuyau plié", "Réajuster le masque"],
            solutionsTech: ["Inspecter le tuyau.", "Remplacer le filtre à air.", "Réajuster le masque.", "Tester l'appareil avec un bouchon."]
          },
          {
            title: "Problème d'alimentation (L'appareil ne démarre pas)",
            causes: ["Mauvais transformateur (60W au lieu de 80W)", "Fiche centrale tordue", "Bloc défectueux"],
            solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Le message s'affiche-t-il ?", "Est-ce bien le bloc d'alimentation d'origine Philips ?"],
            solutionsTech: ["Utiliser exclusivement le bloc d'alimentation de 80W fourni.", "Vérifier la tension de sortie du bloc secteur.", "Tester avec un autre bloc 80W Philips certifié."]
          },
          {
            title: "Bruit anormal ou vibrations",
            causes: ["Mauvais alignement entre l'appareil et l'humidificateur", "Joint interne mal positionné", "Fissure dans le bac à eau", "Turbine fatiguée"],
            solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Entendez-vous le sifflement au raccord entre les deux parties ?", "Le bac à eau présente-t-il une fissure visible ?"],
            solutionsTech: ["Réassembler l'appareil et l'humidificateur.", "Nettoyer les joints de connexion.", "Vérifier l'étanchéité pneumatique interne."]
          },
          {
            title: "Fuites importantes (Masque ou Circuit)",
            causes: ["Bac à eau mal enclenché", "Masque inadapté", "Circuit percé", "Valve expiratoire absente", "Joint interne délogé"],
            solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Avez-vous entendu un 'clic' en remettant le bac à eau ?", "Le masque est-il bien plaqué contre votre visage ?"],
            solutionsTech: ["Vérifier le joint du réservoir.", "Tester l'appareil avec un bouchon.", "Effectuer un test d'étanchéité système.", "Remplacer la tubulure."]
          },
          {
            title: "Problème d'humidification (Air sec ou condensation)",
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
            title: "Problème d'humidification (Air sec ou condensation)",
                causes: ["Pièce froide", "Absence de housse de tuyau", "Réglage trop haut"],
                solutionsPatient: ["Vérifier branchement", "Utiliser une housse de tuyau", "Baisser le réglage d'humidité"],
            solutionsTech: ["Utiliser une housse de circuit.", "Baisser le réglage de l'humidificateur System One.", "Vérifier le circuit chauffant."]
          },
          {
            title: "Problème d'alimentation (L'appareil ne démarre pas)",
            causes: ["Perte secteur", "Faux contact prise arrière", "Bloc alim HS", "Surchauffe interne", "Batterie interne vide"],
            solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "La machine s'arrête-t-elle si vous bougez légèrement le fil à l'arrière ?"],
            solutionsTech: ["Vérifier que le cordon est bien enfoncé.", "Tester avec une autre alimentation.", "Contrôler la température interne.", "Vérifier les logs d'erreurs d'alimentation."]
          },
          {
                title: "Pression insuffisante ou instable",
                causes: ["Valve expiratoire bloquée", "Toux patient", "Filtre colmaté", "Tuyau plié"],
                solutionsPatient: ["Vérifier branchement", "Nettoyer la valve System One", "Remplacer le filtre arrière"],
            solutionsTech: ["Nettoyer la valve System One.", "Remplacer le filtre gris.", "Vérifier les réglages de Pmax."]
          },
          {
            title: "Fuites importantes (Masque ou Circuit)",
            causes: ["Humidificateur mal verrouillé", "Circuit percé", "Masque défectueux"],
            solutionsPatient: ["Est-ce que la prise est bien branchée ?", "Entendez-vous un pshhh au raccord ?", "Le masque est-il usé ?"],
            solutionsTech: ["Vérifier l'alignement de l'humidificateur.", "Remplacer le circuit.", "Tester avec un masque neuf."]
          }
        ]
      }
    ]
  }}}
  {
    id: "ppc",
    name: "Pression Positive Continue (PPC)",
    models: [
      { id: "s9", name: "S9 (AutoSet, Elite)", failures: [
          { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Cordon débranché", "Bloc alim HS"], solutionsPatient: ["Vérifier voyant bloc", "Tester autre prise"], solutionsTech: ["Tester bloc 90W"] },
          { title: "Pression insuffisante ou instable", causes: ["Filtre colmaté", "Fuite importante"], solutionsPatient: ["Changer filtre air", "Vérifier masque"], solutionsTech: ["Calibration turbine"] },
          { title: "Pas de chauffage", causes: ["Résistance chauffante HS", "Réglage bas", "Chambre froide"], solutionsPatient: ["Vérifier branchement bac", "Augmenter humidité"], solutionsTech: ["Tester plaque chauffante"] },
          { title: "Carte SD illisible", causes: ["Mal insérée", "Verrouillage"], solutionsPatient: ["Pousser la carte", "Vérifier loquet"], solutionsTech: ["Formater FAT32"] }
      ] },
      { id: "airsense-10", name: "S10 (AutoSet, Elite)", failures: [
          { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Cordon déconnecté", "Alim HS"], solutionsPatient: ["Vérifier branchement"], solutionsTech: ["Tester bloc 90W"] },
          { title: "Pression insuffisante ou instable", causes: ["Filtre bouché", "Entrée air obstruée"], solutionsPatient: ["Remplacer filtre", "Réajuster masque"], solutionsTech: ["Recalibrer capteurs"] },
          { title: "Pas de chauffage", causes: ["Résistance chauffante HS", "Joint réservoir fissuré"], solutionsPatient: ["Nettoyer calcaire", "Pousser le bac"], solutionsTech: ["Remplacer joint silicone"] },
          { title: "Fuites importantes (Masque ou Circuit)", causes: ["Coussin usé", "Harnais lâche"], solutionsPatient: ["Silicone jauni ?", "Resserrer sangles"], solutionsTech: ["Gabarit taille"] },
          { title: "Carte SD illisible", causes: ["Mal insérée", "Carte HS"], solutionsPatient: ["Pousser la carte"], solutionsTech: ["Formater FAT32"] },
          { title: "Erreur Système (Message d'erreur)", causes: ["Panne interne", "Surchauffe"], solutionsPatient: ["Noter le code"], solutionsTech: ["Check ventilateur"] }
      ] },
      { id: "s11", name: "S11 (AutoSet)", failures: [
          { title: "Problème d'affichage (Écran noir ou figé)", causes: ["Doigts humides", "Bug logiciel"], solutionsPatient: ["Mains sèches", "Débrancher/rebrancher"], solutionsTech: ["Mise à jour firmware"] },
          { title: "Pression insuffisante ou instable", causes: ["Obstruction", "Filtre"], solutionsPatient: ["Vérifier filtre gris"], solutionsTech: ["Calibration turbine"] },
          { title: "Fuites importantes (Masque ou Circuit)", causes: ["Bac mal inséré", "Joint mal mis"], solutionsPatient: ["Clic du bac entendu ?"], solutionsTech: ["Check étanchéité réservoir"] },
          { title: "Carte SD illisible", causes: ["Format"], solutionsPatient: ["Pousser carte"], solutionsTech: ["Formater"] },
          { title: "Erreur Système (Message d'erreur)", causes: ["Bug logiciel", "Capteur HS"], solutionsPatient: ["Redémarrer"], solutionsTech: ["Diagnostic Cloud"] }
      ] },
      { id: "dreamstation-1", name: "DreamStation 1", failures: [
          { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Mauvais transfo", "Fiche centrale tordue"], solutionsPatient: ["Utilisez le bloc d'origine ?", "Tige droite ?"], solutionsTech: ["Check bloc 80W"] },
          { title: "Pas de chauffage", causes: ["Résistance chauffante HS", "Bac mal inséré"], solutionsPatient: ["Clic entendu ?", "Vérifier niveau eau"], solutionsTech: ["Tester plaque"] },
          { title: "Pression insuffisante ou instable", causes: ["Filtre colmaté", "Tuyau plié"], solutionsPatient: ["Changer filtre blanc"], solutionsTech: ["Vérifier moteur"] },
          { title: "Fuites importantes (Masque ou Circuit)", causes: ["Joint embase usé"], solutionsPatient: ["Sifflement sous bac ?"], solutionsTech: ["Changer joint base"] },
          { title: "Carte SD illisible", causes: ["Carte HS"], solutionsPatient: ["Pousser carte"], solutionsTech: ["Formater FAT32"] }
      ] },
      { id: "prisma-smart", name: "Prisma (Smart, Soft)", failures: [
          { title: "Pression insuffisante ou instable", causes: ["Filtre colmaté"], solutionsPatient: ["Changer filtre"], solutionsTech: ["Calibration"] },
          { title: "Pas de chauffage", causes: ["Résistance chauffante HS", "Bac vide"], solutionsPatient: ["Vérifier réglage"], solutionsTech: ["Tester plaque"] },
          { title: "Fuites importantes (Masque ou Circuit)", causes: ["Mauvais fit"], solutionsPatient: ["Ajuster masque"], solutionsTech: ["Check joint sortie"] },
          { title: "Carte SD illisible", causes: ["Format"], solutionsPatient: ["Pousser carte"], solutionsTech: ["Formater"] }
      ] },
      { id: "remstar-auto", name: "REMstar Auto", failures: [
          { title: "Bruit anormal ou vibrations", causes: ["Humidificateur mal verrouillé", "Turbine fatiguée"], solutionsPatient: ["Clipsage OK ?", "Appareil stable ?"], solutionsTech: ["Remplacer silentblocs"] },
          { title: "Pas de chauffage", causes: ["Résistance chauffante HS", "Contacts oxydés"], solutionsPatient: ["Nettoyer picots métal"], solutionsTech: ["Tester plaque"] },
          { title: "Pression insuffisante ou instable", causes: ["Filtre gris colmaté"], solutionsPatient: ["Changer filtre"], solutionsTech: ["Recalibrer"] }
      ] },
    ]
  },
  {
    id: "aspiration",
    name: "Aspirateurs de mucosités",
    models: [
      { id: "lcs-u4", name: "LCSU 4 (Laerdal)", failures: [
          { title: "Débit faible ou irrégulier", causes: ["Manomètre mal réglé", "Tuyauterie bouchée", "Bocal mal fermé", "Filtre colmaté"], solutionsPatient: ["Le manomètre indique-t-il une dépression ?", "Entendez-vous de l'air s'échapper ?", "Le filtre est-il propre ?"], solutionsTech: ["Vérifier l'étanchéité des tuyaux.", "Mesurer la dépression max.", "Remplacer le filtre antibactérien."] },
          { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Batterie vide", "Chargeur HS", "Fusible interne grillé"], solutionsPatient: ["Une lumière s'allume-t-elle au branchement ?", "L'appareil a-t-il été chargé récemment ?", "Est-ce que vous êtes dehors avec l'appareil ?"], solutionsTech: ["Tester le chargeur.", "Vérifier la batterie.", "Vérifier les connexions internes."] }
      ] },
      { id: "aidal", name: "AIDAL", failures: [
          { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Appareil noyé", "Alimentation", "Fusible", "Interrupteur"], solutionsPatient: ["Se passe-t-il quelque chose à l'appui sur Marche ?", "L'appareil a-t-il aspiré du liquide récemment ?"], solutionsTech: ["Vérifier l'absence de liquide interne (appareil noyé).", "Tester le cordon.", "Vérifier fusible et carte."] },
          { title: "Débit faible ou irrégulier", causes: ["Appareil noyé", "Bocal", "Filtre", "Tuyau", "Réglage"], solutionsPatient: ["L'aiguille du manomètre bouge-t-elle ?", "Entendez-vous un sifflement d'air ?", "Le filtre est-il gris ?"], solutionsTech: ["Vérifier l'étanchéité interne.", "Tester la pompe.", "Mesurer le vide."] },
          { title: "Bruit anormal ou vibrations", causes: ["Vibrations pompe", "Fixations desserrées"], solutionsPatient: ["L'appareil est-il bien à plat ?"], solutionsTech: ["Resserrer les silentblocs.", "Remplacer la pompe."] }
      ] },
      { id: "clario-medela", name: "Clario Medela", failures: [
          { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Appareil noyé", "Batterie", "Alimentation", "Fusible"], solutionsPatient: ["Le voyant de charge s'allume-t-il ?", "Ça fait longtemps qu'il n'a pas servi ?"], solutionsTech: ["Vérifier l'appareil noyé.", "Tester le chargeur.", "Remplacer la batterie."] },
          { title: "Débit faible ou irrégulier", causes: ["Appareil noyé", "Bocal mal fermé", "Filtre saturé", "Tuyau"], solutionsPatient: ["L'aiguille va-t-elle vers la gauche ?", "Entendez-vous un 'pshhhh' ?", "Le filtre est-il sale ?"], solutionsTech: ["Tester l'étanchéité du circuit.", "Mesurer la dépression.", "Vérifier la soupape."] },
          { title: "Problème de batterie ou autonomie", causes: ["Batterie usée", "Chargeur", "Connectique"], solutionsPatient: ["Vérifier le branchement.", "Laisser charger 2h.", "Nettoyer les contacts."], solutionsTech: ["Tester avec un autre chargeur.", "Remplacer la batterie."] },
          { title: "Bruit anormal ou vibrations", causes: ["Silentblocs", "Pompe usée"], solutionsPatient: ["L'appareil est-il stable ?"], solutionsTech: ["Remplacer silentblocs.", "Check turbine."] }
      ] },
      { id: "v7-ac", name: "V7+ AC", failures: [
          { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Appareil noyé", "Batterie", "Alimentation", "Carte"], solutionsPatient: ["Lumière allumée au branchement ?", "Ça fait longtemps qu'il n'a pas servi ?"], solutionsTech: ["Vérifier si noyé.", "Tester le chargeur.", "Vérifier la carte."] },
          { title: "Débit faible ou irrégulier", causes: ["Appareil noyé", "Bocal", "Filtre", "Pompe"], solutionsPatient: ["L'aiguille bouge-t-elle ?", "Bruit d'air qui s'échappe ?", "Filtre gris ?"], solutionsTech: ["Tester la pompe.", "Vérifier l'étanchéité."] },
          { title: "Bruit anormal ou vibrations", causes: ["Fixations", "Pompe"], solutionsPatient: ["Poser sur surface stable."], solutionsTech: ["Check silentblocs."] }
      ] },
      { id: "v7-ac-batt", name: "V7+ AC-B", failures: [
          { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Appareil noyé", "Batterie", "Alimentation", "Carte"], solutionsPatient: ["Lumière allumée ?", "Ça fait longtemps ?"], solutionsTech: ["Tester chargeur.", "Remplacer batterie."] },
          { title: "Débit faible ou irrégulier", causes: ["Appareil noyé", "Bocal", "Filtre", "Pompe"], solutionsPatient: ["L'aiguille bouge ?", "Sifflement ?", "Filtre sale ?"], solutionsTech: ["Tester pompe.", "Vérifier fuites."] },
          { title: "Problème de batterie ou autonomie", causes: ["Batterie usée", "Chargeur"], solutionsPatient: ["Vérifier branchement.", "Charger 2h.", "Contacts propres ?"], solutionsTech: ["Remplacer batterie."] }
      ] },
      { id: "vacuaide-7314", name: "Vacu-Aid 7314", failures: [
          { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Appareil noyé", "Batterie", "Alimentation", "Fusible"], solutionsPatient: ["Lumière allumée ?", "Pas servi depuis longtemps ?"], solutionsTech: ["Vérifier si noyé.", "Tester chargeur.", "Check fusible."] },
          { title: "Débit faible ou irrégulier", causes: ["Appareil noyé", "Bocal", "Filtre", "Tuyau"], solutionsPatient: ["L'aiguille bouge ?", "Sifflement ?", "Filtre sale ?"], solutionsTech: ["Tester l'étanchéité.", "Mesurer dépression."] },
          { title: "Bruit anormal ou vibrations", causes: ["Pompe", "Fixations"], solutionsPatient: ["Appareil stable ?"], solutionsTech: ["Resserrer fixations.", "Check pompe."] },
          { title: "Problème de batterie ou autonomie", causes: ["Batterie usée", "Chargeur"], solutionsPatient: ["Brancher sur secteur.", "Contacts propres ?"], solutionsTech: ["Remplacer batterie."] }
      ] },
      { id: "vacuaide-7325", name: "Vacu-Aid 7325", failures: [
          { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Appareil noyé", "Batterie", "Alimentation", "Fusible"], solutionsPatient: ["Lumière allumée ?", "Pas servi depuis longtemps ?"], solutionsTech: ["Vérifier si noyé.", "Tester chargeur.", "Check fusible."] },
          { title: "Débit faible ou irrégulier", causes: ["Appareil noyé", "Bocal", "Filtre", "Tuyau"], solutionsPatient: ["L'aiguille bouge ?", "Sifflement ?", "Filtre sale ?"], solutionsTech: ["Tester l'étanchéité.", "Mesurer dépression."] },
          { title: "Bruit anormal ou vibrations", causes: ["Pompe", "Fixations"], solutionsPatient: ["Appareil stable ?"], solutionsTech: ["Resserrer fixations.", "Check pompe."] },
          { title: "Problème de batterie ou autonomie", causes: ["Batterie usée", "Chargeur"], solutionsPatient: ["Brancher sur secteur.", "Contacts propres ?"], solutionsTech: ["Remplacer batterie."] }
      ] }
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
            title: "Problème de détection respiratoire (Trigger)",
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
            title: "Erreur Système (Message d'erreur)",
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
            title: "Fuites importantes (Masque ou Circuit)",
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
            title: "Pression insuffisante ou instable",
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
            title: "Problème d'alimentation (L'appareil ne démarre pas)",
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
            title: "Bruit anormal ou vibrations",
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
            title: "Pression insuffisante ou instable",
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
            title: "Problème de détection respiratoire (Trigger)",
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
            title: "Fuites importantes (Masque ou Circuit)",
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
            title: "Problème d'alimentation (L'appareil ne démarre pas)",
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
            title: "Problème de détection respiratoire (Trigger)",
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
            title: "Problème d'alimentation (L'appareil ne démarre pas)",
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
            title: "Bruit anormal ou vibrations",
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
            title: "Pression insuffisante ou instable",
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
            title: "Problème de détection respiratoire (Trigger)",
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
            title: "Fuites importantes (Masque ou Circuit)",
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
            title: "Problème d'alimentation (L'appareil ne démarre pas)",
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
            title: "Pression insuffisante ou instable",
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
            title: "Problème de détection respiratoire (Trigger)",
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
            title: "Problème d'alimentation (L'appareil ne démarre pas)",
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
            title: "Bruit anormal ou vibrations",
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
            title: "Pression insuffisante ou instable",
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
            title: "Problème de détection respiratoire (Trigger)",
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
            title: "Problème d'alimentation (L'appareil ne démarre pas)",
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
            title: "Bruit anormal ou vibrations",
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
            title: "Pression insuffisante ou instable",
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
            title: "Problème de détection respiratoire (Trigger)",
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
            title: "Problème d'alimentation (L'appareil ne démarre pas)",
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
            title: "Bruit anormal ou vibrations",
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
            title: "Pression insuffisante ou instable",
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
            title: "Pression insuffisante ou instable",
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
            title: "Fuites importantes (Masque ou Circuit)",
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
            title: "Problème d'alimentation (L'appareil ne démarre pas)",
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
            title: "Pression insuffisante ou instable",
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
            title: "Problème de détection respiratoire (Trigger)",
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
            title: "Fuites importantes (Masque ou Circuit)",
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
            title: "Débit faible ou irrégulier",
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
                title: "Problème d'humidification (Air sec ou condensation)", 
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
                title: "Fuites importantes (Masque ou Circuit)", 
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
                title: "Problème d'humidification (Air sec ou condensation)", 
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
              },
              {
                title: "Bruit anormal ou vibrations",
                causes: ["Réservoir mal enclenché", "Bruit de glouglou (condensation)", "Joint d'embase desséché", "Vibration contre l'appareil"],
                solutionsPatient: ["Vérifiez que le réservoir est bien enfoncé jusqu'au clic", "Videz l'eau du tuyau si vous entendez un glouglou", "Assurez-vous que l'appareil est sur une surface plane"],
                solutionsTech: ["Vérifier l'état du joint d'embase", "Inspecter les fixations de la plaque chauffante", "Tester avec un autre réservoir"]
              }
          ] },
          { id: "h41", name: "H41", failures: [
              { title: "Problème d'humidification (Air sec ou condensation)", causes: ["Plaque chauffante HS", "Option désactivée dans le menu", "Mauvais couplage"], solutionsPatient: ["Vérifiez l'activation dans le menu patient", "Vérifiez que le bac est bien inséré à fond", "L'air est-il tiède après 10 minutes ?"], solutionsTech: ["Tester la résistance de la plaque", "Vérifier le fusible thermique interne", "Remplacer la plaque."] },
              { title: "Fuites importantes (Masque ou Circuit)", causes: ["Joint de bac usé", "Bac mal positionné", "Fissure dans le plastique"], solutionsPatient: ["Vérifiez que le joint est propre et bien logé", "Retirez et remettez le bac fermement", "Voyez-vous de l'eau sous la machine ?"], solutionsTech: ["Changer le joint d'étanchéité", "Remplacer le bac", "Vérifier l'alignement des ports."] },
              { 
                title: "Problème d'humidification (Air sec ou condensation)", 
                causes: ["Niveau d'eau stable (ne baisse pas)", "Bac calcaire", "Réglage trop bas", "Pièce trop ventilée"], 
                solutionsPatient: [
                  "Détartrez le bac avec du vinaigre blanc dilué",
                  "Vérifiez si l'air de la chambre n'est pas trop sec (chauffage excessif)",
                  "Augmentez le réglage de chauffe sur l'appareil",
                  "S'assurer que la canule ou le masque est bien étanche"
                ], 
                solutionsTech: ["Vérifier la résistance chauffante", "Contrôler les réglages de rampe d'humidité"] 
              },
              {
                title: "Bruit anormal ou vibrations",
                causes: ["Réservoir mal enclenché", "Bruit de glouglou (condensation)", "Joint d'embase desséché", "Vibration contre l'appareil"],
                solutionsPatient: ["Vérifiez que le réservoir est bien enfoncé jusqu'au clic", "Videz l'eau du tuyau si vous entendez un glouglou", "Assurez-vous que l'appareil est sur une surface plane"],
                solutionsTech: ["Vérifier l'état du joint d'embase", "Inspecter les fixations de la plaque chauffante", "Tester avec un autre réservoir"]
              }
          ] },
          { id: "humidair", name: "HumidAir", failures: [
              { title: "Problème d'humidification (Air sec ou condensation)", causes: ["Connecteurs sales ou oxydés", "Plaque chauffante défectueuse", "Mauvaise insertion"], solutionsPatient: ["Vérifiez que la prise est bien branchée", "Nettoyez les petits contacts au dos du bac avec un chiffon sec", "Poussez le bac jusqu'à entendre le clic"], solutionsTech: ["Vérifier la continuité du circuit de chauffe", "Mesurer la tension aux bornes de l'embase", "Remplacer la plaque"] },
              { title: "Fuites importantes (Masque ou Circuit)", causes: ["Bac mal inséré", "Joint de réservoir pincé", "Réservoir calcaire"], solutionsPatient: ["Vérifiez que le réservoir est enfoncé à fond", "Le joint en silicone est-il bien propre et plat ?", "Y a-t-il du calcaire sur les bords du bac ?"], solutionsTech: ["Nettoyer au vinaigre blanc", "Remplacer le joint silicone", "Tester avec un bac neuf"] },
              { title: "Problème d'humidification (Air sec ou condensation)", causes: ["Réglage trop bas", "Mode manuel inadapté", "Fuite importante au masque"], solutionsPatient: ["Essayez de passer le réglage sur 'Auto'", "Augmentez le niveau d'humidité manuellement", "Vérifiez que le masque ne fuit pas"], solutionsTech: ["Activer le mode Climate Control Auto", "Tester avec un tuyau ClimateLineAir", "Check calibration sonde."] },
              {
                title: "Bruit anormal ou vibrations",
                causes: ["Réservoir mal enclenché", "Bruit de glouglou (condensation)", "Joint d'embase desséché", "Vibration contre l'appareil"],
                solutionsPatient: ["Vérifiez que le réservoir est bien enfoncé jusqu'au clic", "Videz l'eau du tuyau si vous entendez un glouglou", "Assurez-vous que l'appareil est sur une surface plane"],
                solutionsTech: ["Vérifier l'état du joint d'embase", "Inspecter les fixations de la plaque chauffante", "Tester avec un autre réservoir"]
              }
          ] },
          { id: "hum-bipap-a40", name: "BIPAP A40", failures: [
              { title: "Problème d'humidification (Air sec ou condensation)", causes: ["Connecteurs métalliques sales", "Plaque HS", "Désactivé dans le menu"], solutionsPatient: ["Nettoyer les connecteurs métalliques avec un coton-tige sec", "Assurez-vous que l'humidificateur est activé", "Vérifiez le branchement du bac"], solutionsTech: ["Contrôler la continuité de la résistance", "Vérifier la tension de sortie", "Remplacer la plaque."] },
              { title: "Fuites importantes (Masque ou Circuit)", causes: ["Joint de réservoir usé", "Bac fissuré", "Trop-plein"], solutionsPatient: ["Le joint du réservoir semble-t-il souple et bien mis ?", "Ne pas dépasser le trait MAX", "Voyez-vous de l'eau couler le long du bac ?"], solutionsTech: ["Remplacer le joint du réservoir", "Changer le bac", "Vérifier l'étanchéité du socle."] },
              { title: "Problème d'humidification (Air sec ou condensation)", causes: ["Humidité trop haute", "Pièce froide", "Machine trop haute"], solutionsPatient: ["Essayez de baisser le niveau d'humidité", "Videz le tuyau pendant la nuit", "Placez l'appareil plus bas que votre tête"], solutionsTech: ["Installer une housse de circuit", "Ajuster les réglages cliniciens", "Check inclinaison."] },
              {
                title: "Bruit anormal ou vibrations",
                causes: ["Réservoir mal enclenché", "Bruit de glouglou (condensation)", "Joint d'embase desséché", "Vibration contre l'appareil"],
                solutionsPatient: ["Vérifiez que le réservoir est bien enfoncé jusqu'au clic", "Videz l'eau du tuyau si vous entendez un glouglou", "Assurez-vous que l'appareil est sur une surface plane"],
                solutionsTech: ["Vérifier l'état du joint d'embase", "Inspecter les fixations de la plaque chauffante", "Tester avec un autre réservoir"]
              }
          ] },
          { id: "hum-breas", name: "Breas", failures: [
              { 
                title: "Problème d'humidification (Air sec ou condensation)", 
                causes: ["Plaque HS", "Mauvais clipsage sur la machine", "Contacts embase tordus", "Option désactivée dans le menu clinicien", "Fusible thermique interne"], 
                solutionsPatient: ["Vérifiez que le bac est bien enclenché", "Assurez-vous que l'icône de chauffe est visible sur l'écran", "Débranchez et rebranchez l'appareil pour réinitialiser"], 
                solutionsTech: ["Vérifier la continuité de la plaque", "Mesurer la tension sur les broches de connexion", "Activer l'option dans le menu service"] 
              },
              { 
                title: "Problème d'humidification (Air sec ou condensation)", 
                causes: ["Joint de couvercle usé", "Bac fissuré (choc)", "Trop plein d'eau", "Réglage trop élevé par rapport à la température"], 
                solutionsPatient: ["Ne pas dépasser le trait max", "Vérifiez que le joint blanc est bien plat", "Placez l'appareil plus bas que votre lit"], 
                solutionsTech: ["Remplacer le joint d'étanchéité", "Changer le réservoir", "Vérifier la sonde de température ambiante"] 
              }
          ] },
          { id: "hum-sys1", name: "System One", failures: [
              { 
                title: "Problème d'humidification (Air sec ou condensation)", 
                causes: ["Plaque HS", "Mauvaise connexion embase", "Picots de contact oxydés", "Alimentation 60W insuffisante (nécessite 80W)"], 
                solutionsPatient: ["Nettoyez les contacts métalliques avec un coton-tige sec", "Assurez-vous que le voyant sur le côté est bien allumé", "Vérifiez que le bac est poussé à fond"], 
                solutionsTech: ["Tester avec un bloc 80W", "Remplacer l'embase chauffante", "Vérifier la résistance (Ohms)"] 
              },
              { 
                title: "Problème d'humidification (Air sec ou condensation)", 
                causes: ["Réglage humidité trop haut", "Chambre froide", "Absence de housse", "Tuyau non chauffant"], 
                solutionsPatient: ["Tentez de baisser le réglage d'un cran ou deux", "Videz l'eau du tuyau pendant la nuit", "Utilisez une housse isolante sur le tuyau"], 
                solutionsTech: ["Proposer un circuit chauffant System One", "Contrôle des capteurs de débit", "Check calibration."] 
              }
          ] },
          { id: "nea-hum", name: "NEA", failures: [
              { title: "Problème d'humidification (Air sec ou condensation)", causes: ["Plaque chauffante HS", "Désactivé dans le menu", "Mauvaise insertion du bac"], solutionsPatient: ["Activez l'humidification dans le menu 'Confort'", "Vérifiez que le bac est bien clipsé", "L'air est-il tiède après 10 minutes ?"], solutionsTech: ["Remplacer la plaque chauffante", "Vérifier la nappe de connexion interne", "Tester l'alimentation de la plaque"] },
              { title: "Fuites importantes (Masque ou Circuit)", causes: ["Joint silicone usé", "Couvercle mal clipsé", "Trop-plein d'eau"], solutionsPatient: ["Le joint noir sous le bac est-il propre et en place ?", "Le couvercle a-t-il bien fait 'clic' ?", "Vérifiez que vous n'avez pas dépassé le trait MAX"], solutionsTech: ["Remplacer le joint d'embase", "Changer le réservoir complet", "Vérifier le châssis."] },
              { title: "Problème d'humidification (Air sec ou condensation)", causes: ["Humidité réglée trop forte", "Chambre froide", "Machine placée trop haut"], solutionsPatient: ["Baissez le réglage d'un niveau", "Vider l'eau du tuyau au milieu de la nuit", "Isolez le tuyau avec une housse"], solutionsTech: ["Calibration de la sonde ambiante", "Vérifier le fonctionnement du circuit chauffant si présent", "Check circuit."] }
          ] },
          { id: "prisma-aqua", name: "PrismaAQUA", failures: [
              { 
                title: "Problème d'humidification (Air sec ou condensation)", 
                causes: ["Défaut résistance", "Mauvais couplage Prisma", "Tarnissage des contacts", "Bac vide (sécurité)"], 
                solutionsPatient: ["Vérifiez que le symbole de chauffe est présent sur l'écran", "Nettoyez les contacts sous le bac avec un chiffon sec", "Remplissez le bac jusqu'au niveau"], 
                solutionsTech: ["Vérifier la résistance chauffante", "Contrôler le connecteur de l'appareil Prisma"] 
              },
              { 
                title: "Problème d'humidification (Air sec ou condensation)", 
                causes: ["Réglage trop bas", "Bac entartré", "Fuite au masque", "Température de chambre trop haute"], 
                solutionsPatient: ["Détartrez le bac au vinaigre blanc", "Augmentez le niveau de 1 à 5", "Vérifiez l'étanchéité de votre masque"], 
                solutionsTech: ["Contrôler la régulation de puissance", "Vérifier la sonde de température"] 
              }
          ] },
          { id: "hum-sbox", name: "S.Box", failures: [
              { 
                title: "Problème d'humidification (Air sec ou condensation)", 
                causes: ["Bac mal inséré", "Joint arrière déformé", "Plaque chauffante HS", "Bug logiciel"], 
                solutionsPatient: ["Retirez et remettez le bac fermement", "Vérifiez que l'humidificateur est activé sur l'écran tactile", "Videz le bac et séchez les contacts"], 
                solutionsTech: ["Vérifier le joint de liaison interne", "Tester la plaque chauffante", "Mise à jour firmware"] 
              },
              { 
                title: "Fuites importantes (Masque ou Circuit)", 
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
                title: "Problème d'humidification (Air sec ou condensation)", 
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
                title: "Fuites importantes (Masque ou Circuit)", 
                causes: ["Joint de bac usé", "Bac mal positionné", "Différence de température trop forte", "Tuyau non isolé"], 
                solutionsPatient: [
                  "Vérifiez que le bac est bien à plat sur la plaque",
                  "Le joint en caoutchouc est-il propre et sans fissure ?",
                  "Eloignez l'appareil des courants d'air froid",
                  "Isolez le tuyau avec une housse"
                ], 
                solutionsTech: ["Remplacer le joint d'étanchéité", "Vérifier la régulation de température", "Inspecter le bac pour micro-fissures"] 
              },
              {
                title: "Bruit anormal ou vibrations",
                causes: ["Réservoir mal enclenché", "Bruit de glouglou (condensation)", "Joint d'embase desséché", "Vibration contre l'appareil"],
                solutionsPatient: ["Vérifiez que le réservoir est bien enfoncé jusqu'au clic", "Videz l'eau du tuyau si vous entendez un glouglou", "Assurez-uous que l'appareil est sur une surface plane"],
                solutionsTech: ["Vérifier l'état du joint d'embase", "Inspecter les fixations de la plaque chauffante", "Tester avec un autre réservoir"]
              }
          ] },
          { id: "mr810-mr820", name: "MR810 / MR820", failures: [
              { title: "Problème d'humidification (Air sec ou condensation)", causes: ["Appareil mal branché", "Résistance HS", "Fusible thermique sauté"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Est-ce que le voyant orange en façade est allumé ?", "L'air est-il tiède après 10 minutes ?"], solutionsTech: ["Vérifier l'alimentation secteur.", "Remplacer la base chauffante.", "Vérifier la continuité de l'interrupteur."] },
              { title: "Fuites importantes (Masque ou Circuit)", causes: ["Chambre mal percée", "Joint usé", "Raccords mal serrés"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Est-ce que vous voyez de l'eau couler le long du réservoir bleu ?", "Est-ce que les tuyaux sont bien enfoncé sur les raccords ?"], solutionsTech: ["Changer la chambre d'humidification.", "Inspecter l'intégrité de la chambre.", "Vérifier l'étanchéité des raccords."] },
              { title: "Problème d'humidification (Air sec ou condensation)", causes: ["Température ambiante basse", "Sonde défectueuse", "Flux d'air trop important"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Est-ce que l'air vous paraît trop frais ou trop sec ?", "Est-ce que vous avez installé une housse de protection sur le tuyau ?"], solutionsTech: ["Ajuster la température.", "Vérifier la sonde de température.", "Contrôler le débit de l'appareil associé."] },
              { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Câble secteur abîmé", "Surtension", "Fusible interne grillé"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Est-ce que vous avez essayé de le brancher on une autre prise ?", "Le voyant d'alimentation s'allume-t-il ?"], solutionsTech: ["Vérifier le cordon et le fusible interne.", "Mesurer la tension d'entrée."] },
              {
                title: "Bruit anormal ou vibrations",
                causes: ["Réservoir mal enclenché", "Bruit de glouglou (condensation)", "Joint d'embase desséché", "Vibration contre l'appareil"],
                solutionsPatient: ["Vérifiez que le réservoir est bien enfoncé jusqu'au clic", "Videz l'eau du tuyau si vous entendez un glouglou", "Assurez-vous que l'appareil est sur une surface plane"],
                solutionsTech: ["Vérifier l'état du joint d'embase", "Inspecter les fixations de la plaque chauffante", "Tester avec un autre réservoir"]
              }
          ] },
          { id: "my-airvo-2", name: "MY AIRVO 2", failures: [
              { title: "Problème d'humidification (Air sec ou condensation)", causes: ["Résistance chauffante défectueuse", "Erreur logicielle", "Surchauffe"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Est-ce que vous voyez un message d'alerte rouge sur l'écran ?", "Redémarrer l'appareil."], solutionsTech: ["Remplacement de la base chauffante.", "Mise à jour du firmware.", "Vérifier le capteur de température."] },
              { title: "Fuites importantes (Masque ou Circuit)", causes: ["Chambre mal insérée", "Joint usé", "Trop-plein d'eau"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Est-ce que le réservoir est bien poussé au fond de son emplacement ?", "Est-ce que vous voyez de l'eau couler sous la machine ?"], solutionsTech: ["Remplacer le joint de base.", "Vérifier le clapet anti-retour.", "Changer le réservoir."] },
              { title: "Problème d'humidification (Air sec ou condensation)", causes: ["Pièce trop froide", "Circuit non chauffé", "Canule nasale bouchée"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Avez-vous beaucoup d'eau dans votre canule nasale ?", "Sentez-vous que l'air est trop froid ?"], solutionsTech: ["Vérifier la continuité du circuit chauffant.", "Recalibrer les capteurs.", "Vérifier le bloc turbine."] },
              { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Cordon secteur déconnecté", "Batterie interne déchargée ou HS", "Bloc alimentation défaillant"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Est-ce que vous voyez l'icône de batterie s'afficher à l'écran ?", "L'appareil bipe-t-il au branchement ?"], solutionsTech: ["Vérifier le bloc d'alimentation externe.", "Tester la tension de sortie du bloc.", "Vérifier la carte d'alimentation."] },
              {
                title: "Bruit anormal ou vibrations",
                causes: ["Réservoir mal enclenché", "Bruit de glouglou (condensation)", "Joint d'embase desséché", "Vibration contre l'appareil"],
                solutionsPatient: ["Vérifiez que le réservoir est bien enfoncé jusqu'au clic", "Videz l'eau du tuyau si vous entendez un glouglou", "Assurez-vous que l'appareil est sur une surface plane"],
                solutionsTech: ["Vérifier l'état du joint d'embase", "Inspecter les fixations de la plaque chauffante", "Tester avec un autre réservoir"]
              }
          ] },
          { id: "vhb10a", name: "VHB10A", failures: [
              { title: "Problème d'humidification (Air sec ou condensation)", causes: ["Résistance HS", "Fusible grillé", "Défaut carte"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Est-ce que l'interrupteur sur le côté est sur la position 'I' ?", "Vérifiez si l'écran s'allume."], solutionsTech: ["Remplacement de la résistance.", "Vérifier le fusible.", "Tester la résistance."] },
              { title: "Fuites importantes (Masque ou Circuit)", causes: ["Raccords mal serrés", "Joint dégradé", "Fissure réservoir"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Est-ce que vous voyez de l'eau couler près des raccords blancs ?", "Est-ce que le bac à eau est bien stable sur sa base ?"], solutionsTech: ["Vérifier l'étanchéité.", "Resserrer les raccords.", "Remplacer le joint."] },
              { title: "Problème d'humidification (Air sec ou condensation)", causes: ["Manque d'isolation", "Fil chauffant déconnecté", "Sonde défectueuse"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Est-ce que l'air vous semble trop sec ?", "Est-ce que vous avez bien branché le câble électrique du tuyau ?"], solutionsTech: ["Vérifier le fil chauffant.", "Vérifier la sonde thermique.", "Ajuster la puissance."] },
              { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Interrupteur HS", "Fusible grillé", "Cordon abîmé"], solutionsPatient: ["Est-ce que la prise est bien branchée au mur et à l'appareil ?", "Est-ce que les chiffres s'allument sur l'écran ?", "Tester une autre prise."], solutionsTech: ["Vérifier le cordon et le fusible.", "Vérifier le fusible.", "Mesurer la tension."] },
              {
                title: "Bruit anormal ou vibrations",
                causes: ["Réservoir mal enclenché", "Bruit de glouglou (condensation)", "Joint d'embase desséché", "Vibration contre l'appareil"],
                solutionsPatient: ["Vérifiez que le réservoir est bien enfoncé jusqu'au clic", "Videz l'eau du tuyau si vous entendez un glouglou", "Assurez-vous que l'appareil est sur une surface plane"],
                solutionsTech: ["Vérifier l'état du joint d'embase", "Inspecter les fixations de la plaque chauffante", "Tester avec un autre réservoir"]
              }
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
              { title: "Débit faible ou irrégulier", causes: ["Bouteille vide (aiguille rouge)", "Robinet mal ouvert", "Canule pliée ou écrasée", "Régulateur défectueux"], solutionsPatient: ["Regardez le manomètre : l'aiguille est-elle dans la zone verte ?", "Le robinet sur le dessus est-il ouvert à fond ?", "Vérifiez que personne ne marche sur le tuyau.", "Essayez avec une autre canule neuve."], solutionsTech: ["Tester la bouteille avec un autre manodétendeur", "Vérifier la pression de sortie", "Contrôler l'absence d'obstruction dans le raccord de sortie"] },
              { title: "Fuites importantes (Masque ou Circuit)", causes: ["Joint de valve (O-ring) usé ou manquant", "Raccord rapide mal enclenché", "Soupape de sécurité activée"], solutionsPatient: ["Entendez-vous un sifflement (pshhh) au niveau du robinet ?", "Débranchez et rebranchez fermement la canule", "Fermez le robinet immédiatement si la fuite est importante"], solutionsTech: ["Remplacer le joint d'étanchéité (O-ring)", "Vérifier le serrage du manodétendeur", "Tester l'étanchéité"] },
              { title: "Bruit anormal ou vibrations", causes: ["Encrassement interne", "Choc mécanique", "Gel interne (utilisation intensive)"], solutionsPatient: ["Le bouton tourne-t-il sans forcer ?", "Y a-t-il du givre blanc sur le métal ?", "Laissez reposer la bouteille 15 minutes"], solutionsTech: ["Nettoyer le mécanisme de réglage", "Remplacer le bloc régulateur", "Vérifier l'absence de corps gras"] }
            ]
          },
          {
            id: "b2", name: "Bouteille B2", failures: [
                  { title: "Débit faible ou irrégulier", causes: ["Bouteille vide (aiguille rouge)", "Robinet mal ouvert", "Canule pliée ou écrasée", "Régulateur défectueux"], solutionsPatient: ["Regardez le manomètre : l'aiguille est-elle dans la zone verte ?", "Le robinet sur le dessus est-il ouvert à fond ?", "Vérifiez que personne ne marche sur le tuyau.", "Essayez avec une autre canule neuve."], solutionsTech: ["Tester la bouteille avec un autre manodétendeur", "Vérifier la pression de sortie", "Contrôler l'absence d'obstruction dans le raccord de sortie"] },
                  { title: "Fuites importantes (Masque ou Circuit)", causes: ["Joint de valve (O-ring) usé ou manquant", "Raccord rapide mal enclenché", "Soupape de sécurité activée"], solutionsPatient: ["Entendez-vous un sifflement (pshhh) au niveau du robinet ?", "Débranchez et rebranchez fermement la canule", "Fermez le robinet immédiatement si la fuite est importante"], solutionsTech: ["Remplacer le joint d'étanchéité (O-ring)", "Vérifier le serrage du manodétendeur", "Tester l'étanchéité"] },
                  { title: "Bruit anormal ou vibrations", causes: ["Encrassement interne", "Choc mécanique", "Gel interne (utilisation intensive)"], solutionsPatient: ["Le bouton tourne-t-il sans forcer ?", "Y a-t-il du givre blanc sur le métal ?", "Laissez reposer la bouteille 15 minutes"], solutionsTech: ["Nettoyer le mécanisme de réglage", "Remplacer le bloc régulateur", "Vérifier l'absence de corps gras"] }
            ]
          },
          {
            id: "b5", name: "Bouteille B5", failures: [
                  { title: "Débit faible ou irrégulier", causes: ["Bouteille vide (aiguille rouge)", "Robinet mal ouvert", "Canule pliée ou écrasée", "Régulateur défectueux"], solutionsPatient: ["Regardez le manomètre : l'aiguille est-elle dans la zone verte ?", "Le robinet sur le dessus est-il ouvert à fond ?", "Vérifiez que personne ne marche sur le tuyau.", "Essayez avec une autre canule neuve."], solutionsTech: ["Tester la bouteille avec un autre manodétendeur", "Vérifier la pression de sortie", "Contrôler l'absence d'obstruction dans le raccord de sortie"] },
                  { title: "Fuites importantes (Masque ou Circuit)", causes: ["Joint de valve (O-ring) usé ou manquant", "Raccord rapide mal enclenché", "Soupape de sécurité activée"], solutionsPatient: ["Entendez-vous un sifflement (pshhh) au niveau du robinet ?", "Débranchez et rebranchez fermement la canule", "Fermez le robinet immédiatement si la fuite est importante"], solutionsTech: ["Remplacer le joint d'étanchéité (O-ring)", "Vérifier le serrage du manodétendeur", "Tester l'étanchéité"] },
                  { title: "Bruit anormal ou vibrations", causes: ["Encrassement interne", "Choc mécanique", "Gel interne (utilisation intensive)"], solutionsPatient: ["Le bouton tourne-t-il sans forcer ?", "Y a-t-il du givre blanc sur le métal ?", "Laissez reposer la bouteille 15 minutes"], solutionsTech: ["Nettoyer le mécanisme de réglage", "Remplacer le bloc régulateur", "Vérifier l'absence de corps gras"] }
            ]
          },
          {
            id: "oxalys", name: "Oxalys", failures: [
                  { title: "Débit faible ou irrégulier", causes: ["Bouteille vide (aiguille rouge)", "Robinet mal ouvert", "Canule pliée ou écrasée", "Régulateur défectueux"], solutionsPatient: ["Regardez le manomètre : l'aiguille est-elle dans la zone verte ?", "Le robinet sur le dessus est-il ouvert à fond ?", "Vérifiez que personne ne marche sur le tuyau.", "Essayez avec une autre canule neuve."], solutionsTech: ["Tester la bouteille avec un autre manodétendeur", "Vérifier la pression de sortie", "Contrôler l'absence d'obstruction dans le raccord de sortie"] },
                  { title: "Fuites importantes (Masque ou Circuit)", causes: ["Joint de valve (O-ring) usé ou manquant", "Raccord rapide mal enclenché", "Soupape de sécurité activée"], solutionsPatient: ["Entendez-vous un sifflement (pshhh) au niveau du robinet ?", "Débranchez et rebranchez fermement la canule", "Fermez le robinet immédiatement si la fuite est importante"], solutionsTech: ["Remplacer le joint d'étanchéité (O-ring)", "Vérifier le serrage du manodétendeur", "Tester l'étanchéité"] },
                  { title: "Bruit anormal ou vibrations", causes: ["Encrassement interne", "Choc mécanique", "Gel interne (utilisation intensive)"], solutionsPatient: ["Le bouton tourne-t-il sans forcer ?", "Y a-t-il du givre blanc sur le métal ?", "Laissez reposer la bouteille 15 minutes"], solutionsTech: ["Nettoyer le mécanisme de réglage", "Remplacer le bloc régulateur", "Vérifier l'absence de corps gras"] }
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
                        { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Problème alimentation", "Coupure de courant", "Câble mal branché"], solutionsPatient: ["Quand vous appuyez sur le bouton Marche, est-ce qu'il se passe quelque chose (bruit, lumière) ?", "Est-ce que le câble d'alimentation est bien enfoncé des deux côtés (mur et machine) ?", "Avez-vous essayé sur une autre prise électrique ?", "Y a-t-il eu une coupure de courant ?"], solutionsTech: ["Vérifier le cordon secteur.", "Vérifier le fusible/disjoncteur.", "Vérifier l'interrupteur.", "Vérifier le secteur / basculer sur secours."] },
                        { title: "Erreur Système (O2 Bas / Pureté)", causes: ["Concentration entre 75 % et 82 %", "Saturation des tamis moléculaires", "Fuite interne sur le circuit oxygène", "Filtre d'entrée colmaté"], solutionsPatient: ["L'appareil est-il placé loin des murs pour bien respirer ?", "Le filtre à poussière à l'arrière est-il propre ?", "Est-ce qu'une révision de l'appareil est prévue prochainement ?"], solutionsTech: ["Mesurer la pureté avec un analyseur calibré.", "Vérifier l'étanchéité du circuit pneumatique.", "Remplacer les colonnes de tamis.", "Contrôler la pression de sortie du compresseur."] },
                        { title: "Erreur Système (Surchauffe / Disjoncteur)", causes: ["Disjoncteur thermique (surcharge)", "Surchauffe compresseur", "Câble secteur endommagé", "Panne ventilateur"], solutionsPatient: ["Appuyez sur le bouton blanc du disjoncteur (Reset)", "Vérifiez si le cordon est abîmé ou chaud", "Laissez refroidir l'appareil 30 minutes"], solutionsTech: ["Contrôle température turbine", "Vérifier la consommation électrique du compresseur", "Remplacer le ventilateur interne"] },
                    { title: "Débit faible ou irrégulier", causes: ["Filtre bouché", "Tamis moléculaire usé", "Fuite au niveau de l'humidificateur", "Canule trop longue ou pliée"], solutionsPatient: ["Le filtre à air est-il noir ou poussiéreux ?", "Sentez-vous que l'air n'arrive pas régulièrement ?", "Le bocal de l'humidificateur est-il bien vissé ?"], solutionsTech: ["Nettoyage ou remplacement du filtre HEPA.", "Vérifier la bille du débitmètre.", "Remplacement des tamis.", "Tester la pression de sortie."] },
                        { title: "Erreur Système (Surchauffe / Ventilation)", causes: ["Ventilation obstruée", "Environnement trop chaud"], solutionsPatient: ["L'appareil est-il très chaud ?", "Est-ce que quelque chose bouche les grilles d'aération ?", "Fait-il très chaud dans la pièce ?"], solutionsTech: ["Nettoyer grilles d’aération.", "Déplacer appareil, laisser refroidir."] },
                        { title: "Erreur Système (Obstruction Sortie Air)", causes: ["Sortie d’air obstruée", "Filtre d'échappement colmaté", "Couvercle mal positionné"], solutionsPatient: ["La grille à l'arrière est-elle libre ?", "Vérifiez que l'appareil n'est pas collé à un rideau"], solutionsTech: ["Dégager la sortie d’air.", "Remplacer le silencieux.", "Vérifier l'étanchéité du boîtier"] },
                        { title: "Erreur Système (Circuit Bouché)", causes: ["Circuit complètement bouché", "Débit réglé trop bas"], solutionsPatient: ["Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?"], solutionsTech: ["Vérifier tubulure / canule.", "Ajuster débit."] },
                        { title: "Erreur Système (Défaut Pression / Vanne)", causes: ["Vibration excessive du compresseur", "Fuite interne sur les tubulures", "Vanne 4 voies bloquée", "Obstruction du filtre HEPA"], solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression sur l'écran ?", "Vérifiez que l'appareil n'est pas posé sur un tapis trop épais"], solutionsTech: ["Tester la pression de sortie compresseur", "Inspecter les tuyaux internes", "Vérifier le cycle de la vannes", "Remplacer filtres internes"] },
                        { title: "Erreur Système (Panne Interne / SAV)", causes: ["Compresseur en fin de vie", "Capteur de pureté HS", "Défaut carte électronique", "Surchauffe moteur", "Pile d'alarme HS"], solutionsPatient: ["Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Y a-t-il un message d'erreur sur l'écran ?", "Redémarrer l'appareil après 15 min d'arrêt"], solutionsTech: ["Effectuer un diagnostic logiciel.", "Mesurer la tension de la carte.", "Vérifier les balais du moteur.", "Remplacer le bloc compresseur.", "Changer la pile 9V si applicable."] },
                        { title: "Bruit anormal ou vibrations", causes: ["Compresseur fatigué", "Silentblocs usés", "Position instable", "Composant interne desserré"], solutionsPatient: ["L'appareil est-il bien à plat sur une surface stable ?", "Le bruit change-t-il si vous le déplacez ?", "Vérifiez qu'aucun objet ne vibre contre le boîtier."], solutionsTech: ["Vérifier les fixations moteur.", "Remplacer les silentblocs.", "Vérifier le ventilateur.", "Resserrer le châssis."] }
                ] },
          { id: "525ks", name: "5L", failures: [
                    { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Alimentation", "Cordon", "Interrupteur"], solutionsPatient: ["Quand vous appuyez sur le bouton Marche, est-ce qu' il se passe quelque chose (bruit, lumière) ?", "Est-ce que le câble d'alimentation est bien enfoncé des deux côtés ?", "Avez-vous essayé sur une autre prise électrique ?"], solutionsTech: ["Vérifier le cordon secteur.", "Vérifier le fusible/disjoncteur.", "Vérifier l'interrupteur.", "Tester le condensateur de démarrage."] },
                    { title: "Débit faible ou irrégulier", causes: ["Débitmètre bloqué", "Obstruction interne", "Défaut capteur de pression", "Concentration O2 insuffisante"], solutionsPatient: ["Est-ce que la petite bille du débitmètre est bien au-dessus du zéro ?", "Est-ce que le tuyau n'est pas un peu plié ou coincé sous un meuble ?", "Vérifiez que l'humidificateur ne fuit pas."], solutionsTech: ["Vérifier circuit interne.", "Nettoyer le débitmètre", "Tester le capteur de pression", "Vérifier la vanne 4 voies."] },
                    { title: "Erreur Système (Coupure Secteur)", causes: ["Coupure électrique", "Défaut condensateur", "Surtension réseau"], solutionsPatient: ["Vérifiez le branchement mural.", "Y a-t-il eu une coupure de courant ?", "Essayez de brancher une lampe sur la même prise pour tester le courant.", "Débranchez l'appareil 10 minutes."], solutionsTech: ["Tester tension secteur", "Vérifier le condensateur de démarrage", "Remplacer la batterie d'alarme"] },
                    { title: "Erreur Système (Surchauffe / Ventilation)", causes: ["Ventilation obstruée", "Environnement trop chaud"], solutionsPatient: ["L'appareil est-il collé contre un mur ou un rideau ?", "Les grilles d'aération sont-elles propres ?", "Fait-il très chaud dans la pièce ?"], solutionsTech: ["Nettoyer grilles d’aération.", "Déplacer appareil, laisser refroidir."] },
                    { title: "Erreur Système (Obstruction Sortie Air)", causes: ["Grille arrière obstruée", "Accumulation de poussière interne", "Silencieux colmaté"], solutionsPatient: ["La sortie d'air est-elle dégagée ?", "L'appareil est-il trop près d'un rideau ?"], solutionsTech: ["Dégager la sortie d'air.", "Nettoyage interne à l'air sec", "Remplacer silencieux"] },
                    { title: "Erreur Système (Circuit Bouché)", causes: ["Circuit complètement bouché", "Débit réglé trop bas"], solutionsPatient: ["Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?"], solutionsTech: ["Vérifier tubulure / canule.", "Ajuster débit."] },
                    { title: "Erreur Système (Défaut Pression / Fuite interne)", causes: ["Défaut compresseur", "Fuite interne sur les tubulures", "Vanne 4 voies bloquée"], solutionsPatient: ["L'appareil fait-il un sifflement anormal ?", "Sentez-vous moins d'air sortir par rapport à d'habitude ?", "Vérifiez que la canule n'est pas coincée."], solutionsTech: ["Maintenance technique (compresseur).", "Recherche de fuites pneumatiques.", "Vérifier le cycle des vannes.", "Resserrer les colliers de serrage."] },
                    { title: "Erreur Système (Panne Interne / SAV)", causes: ["Capteurs HS", "Panne interne", "Fuite pneumatique", "Surchauffe", "Tamis moléculaires fatigués"], solutionsPatient: ["L'appareil s'arrête-t-il tout seul sans raison apparente ?", "Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Vérifiez la température de la pièce et le filtre arrière."], solutionsTech: ["Remplacer capteurs.", "Effectuer test d'étanchéité", "Vérifier ventilateur", "Maintenance technique / SAV."] },
                    { title: "Bruit anormal ou vibrations", causes: ["Compresseur fatigué", "Silentblocs usés", "Position instable", "Composant interne desserré"], solutionsPatient: ["L'appareil est-il bien à plat sur une surface stable ?", "Le bruit change-t-il si vous le déplacez ?", "Vérifiez qu'aucun objet ne vibre contre le boîtier."], solutionsTech: ["Vérifier les fixations moteur.", "Remplacer les silentblocs.", "Vérifier le ventilateur.", "Resserrer le châssis."] }
                ] },
          { id: "8f-5a", name: "5L", failures: [
                    { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Alimentation", "Cordon", "Interrupteur"], solutionsPatient: ["Quand vous appuyez sur le bouton Marche, est-ce qu'il se passe quelque chose (bruit, lumière) ?", "Est-ce que le câble d'alimentation est bien enfoncé des deux côtés (mur et machine) ?", "Avez-vous essayé sur une autre prise électrique ?"], solutionsTech: ["Vérifier le cordon secteur.", "Vérifier le fusible/disjoncteur.", "Vérifier l'interrupteur.", "Contrôler la carte d'alimentation."] },
                    { title: "Débit faible ou irrégulier", causes: ["Filtre bouché", "Tamis moléculaire usé", "Tubulure / canule obstruée", "Débitmètre fuyard", "Tuyau interne débranché", "Canule bouchée"], solutionsPatient: ["Le filtre à air est-il propre ?", "Sentez-vous que l'air n'arrive pas régulièrement ?", "La tubulure ou la canule est-elle pliée ou bouchée ?", "Vérifiez si l'humidificateur fait des bulles normalement.", "Testez avec une autre canule.", "Inspectez les sorties d'air à l'arrière de l'appareil."], solutionsTech: ["Nettoyage filtre.", "Remplacement tamis.", "Vérifier ou remplacer tubulure/canule.", "Tester l'étanchéité du bocal.", "Vérifier les connexions pneumatiques internes."] },
                    // Removed duplicate entry for "Débit faible ou irrégulier"
                    // { title: "Débit faible ou irrégulier", causes: ["Tuyau interne débranché", "Canule bouchée"], solutionsPatient: ["Testez avec une autre canule.", "Inspectez les sorties d'air à l'arrière de l'appareil."], solutionsTech: ["Vérifier les connexions pneumatiques internes."] },
                    { title: "Erreur Système (O2 Bas / Pureté)", causes: ["Tamis moléculaire usé", "Mauvaise concentration O₂", "Humidité excessive dans l'air ambiant", "Compresseur sous-performant"], solutionsPatient: ["Le voyant O2 est-il allumé ?", "L'appareil a-t-il été entretenu récemment ?", "La pièce est-elle bien aérée ?", "L'appareil est-il utilisé près d'une source de vapeur ?"], solutionsTech: ["Vérifier la pureté à l'analyseur.", "Maintenance interne des filtres.", "Remplacement des colonnes.", "Contrôler les pressions de cycle."] },
                    { title: "Erreur Système (Surchauffe / Ventilation)", causes: ["Ventilation obstruée", "Environnement trop chaud"], solutionsPatient: ["L'appareil est-il collé contre un mur ou un rideau ?", "Les grilles d'aération sont-elles propres ?", "Fait-il très chaud dans la pièce ?"], solutionsTech: ["Nettoyer grilles d’aération.", "Déplacer appareil, laisser refroidir."] },
                    { title: "Erreur Système (Obstruction Sortie Air)", causes: ["Obstruction physique", "Filtre final saturé", "Surchauffe"], solutionsPatient: ["La sortie d'air est-elle dégagée ?", "Vérifier qu'un objet n'est posé sur la machine"], solutionsTech: ["Dégager la sortie d'air.", "Remplacer filtre HEPA", "Contrôler le débit d'air"] },
                    { title: "Erreur Système (Circuit Bouché)", causes: ["Circuit complètement bouché", "Débit réglé trop bas"], solutionsPatient: ["Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?"], solutionsTech: ["Vérifier tubulure / canule.", "Ajuster débit."] },
                    { title: "Erreur Système (Défaut Pression / Vanne)", causes: ["Défaut compresseur", "Vanne directionnelle bloquée", "Fuite de tubulure"], solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression sur l'écran ?", "Vérifiez que le tuyau n'est pas écrasé."], solutionsTech: ["Maintenance technique (compresseur).", "Tester les vannes", "Resserrer raccords", "Vérifier le pressostat."] },
                    { title: "Erreur Système (Panne Interne / SAV)", causes: ["Capteurs HS", "Panne interne (compresseur, capteur, carte)", "Défaut alimentation carte", "Cycle de vanne irrégulier"], solutionsPatient: ["L'appareil s'arrête-t-il tout seul sans raison apparente ?", "Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Débranchez et rebranchez l'appareil après 5 minutes."], solutionsTech: ["Remplacer capteurs.", "Vérifier tensions carte", "Maintenance technique / SAV.", "Contrôler le ventilateur."] },
                    { title: "Bruit anormal ou vibrations", causes: ["Compresseur fatigué", "Silentblocs usés", "Position instable", "Composant interne desserré"], solutionsPatient: ["L'appareil est-il bien à plat sur une surface stable ?", "Le bruit change-t-il si vous le déplacez ?", "Vérifiez qu'aucun objet ne vibre contre le boîtier."], solutionsTech: ["Vérifier les fixations moteur.", "Remplacer les silentblocs.", "Vérifier le ventilateur.", "Resserrer le châssis."] }
                ] },
          { id: "platinum-9", name: "Platinum 9", failures: [
                    { title: "Débit faible ou irrégulier", causes: ["Débitmètre réglé < 1 L/min", "Tubulure 15m pliée", "Filtre HEPA colmaté", "Fuite interne"], solutionsPatient: ["Augmentez le débit au-dessus de 1 L/min pour tester.", "Redressez la tubulure pour éviter les coudes.", "Le filtre noir est-il propre ?"], solutionsTech: ["Tester la pression de sortie.", "Remplacer le filtre HEPA interne.", "Vérifier l'étanchéité du circuit interne."] },
                    { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Surchauffe compresseur", "Pression trop haute", "Ventilateur bloqué", "Condensateur HS"], solutionsPatient: ["Éteignez l'appareil pendant 30 min pour le laisser refroidir.", "Vérifiez que l'air circule bien autour de la machine.", "Appuyez sur le bouton blanc 'Reset' au-dessus de la prise."], solutionsTech: ["Nettoyer les filtres.", "Vérifier le fonctionnement du ventilateur.", "Tester le condensateur de démarrage."] },
                    { title: "Erreur Système (Message d'erreur)", causes: ["Saturation des tamis", "Filtre d'entrée colmaté", "Fuite sur le circuit oxygène"], solutionsPatient: ["Le voyant jaune est-il allumé ?", "L'appareil est-il placé loin des murs (min 15cm) ?"], solutionsTech: ["Mesurer la pureté à l'analyseur.", "Remplacer les colonnes de tamis.", "Vérifier l'étanchéité pneumatique."] },
                  { title: "Erreur Système (Défaut Pression / Fuite interne)", causes: ["Défaut compresseur", "Fuite interne sur les tubulures", "Vanne 4 voies bloquée"], solutionsPatient: ["L'appareil fait-il un sifflement anormal ?", "Vérifiez que la canule n'est pas coincée."], solutionsTech: ["Maintenance technique (compresseur).", "Recherche de fuites pneumatiques.", "Vérifier le cycle des vannes."] },
                    { title: "Bruit anormal ou vibrations", causes: ["Compresseur fatigué", "Silentblocs usés", "Position instable", "Composant interne desserré"], solutionsPatient: ["L'appareil est-il bien à plat sur une surface stable ?", "Le bruit change-t-il si vous le déplacez ?", "Vérifiez qu'aucun objet ne vibre contre le boîtier."], solutionsTech: ["Vérifier les fixations moteur.", "Remplacer les silentblocs.", "Vérifier le ventilateur.", "Resserrer le châssis."] }
                ] },
          { id: "perfecto2-v", name: "Perfecto2 V", failures: [
                    { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Cordon secteur déconnecté", "Disjoncteur déclenché", "Coupure de courant", "Condensateur HS"], solutionsPatient: ["La prise est-elle bien enfoncée ?", "Appuyez sur le bouton blanc (disjoncteur) juste au-dessus de la prise.", "Essayez de brancher une lampe sur la même prise."], solutionsTech: ["Tester le cordon secteur.", "Vérifier le condensateur de démarrage.", "Contrôler l'interrupteur Marche/Arrêt."] },
                    { title: "Erreur Système (Message d'erreur)", causes: ["Usure des tamis moléculaires", "Filtre d'entrée poussiéreux", "Fuite interne"], solutionsPatient: ["Le voyant jaune ou rouge est-il allumé ?", "Le filtre noir sur le côté est-il propre ?", "Aérez la pièce."], solutionsTech: ["Mesurer la pureté.", "Effectuer un test de fuite sous pression.", "Remplacer les colonnes."] },
                    { title: "Débit faible ou irrégulier", causes: ["Tuyau plié", "Débitmètre sur 0", "Filtre HEPA interne colmaté", "Bocal mal vissé"], solutionsPatient: ["La petite bille monte-t-elle quand vous tournez le bouton ?", "Vérifiez que le bocal de l'humidificateur est bien vissé droit.", "Le tuyau est-il coincé sous un meuble ou une porte ?"], solutionsTech: ["Nettoyer le débitmètre.", "Vérifier la pression du compresseur.", "Remplacer le filtre HEPA."] },
                    { title: "Fuites importantes (Masque ou Circuit)", causes: ["Bocal mal vissé", "Joint du couvercle usé ou absent", "Tuyau d'oxygène mal connecté"], solutionsPatient: ["Est-ce que vous entendez un sifflement persistant ?", "Avez-vous essayé de dévisser puis de revisser bien droit le couvercle du bocal ?"], solutionsTech: ["Contrôler l'état du joint du bocal.", "Vérifier le raccord de sortie d'O2.", "Tester l'étanchéité sous pression."] },
                    { title: "Erreur Système (Message d'erreur)", causes: ["Ventilation obstruée", "Température ambiante trop élevée", "Ventilateur interne bloqué"], solutionsPatient: ["Est-ce que l'appareil est collé contre un mur ou un rideau ?", "Fait-il très chaud dans votre chambre ?"], solutionsTech: ["Nettoyer les ouïes de ventilation.", "Vérifier le fonctionnement du ventilateur.", "Maintenance préventive."] },
                    { title: "Bruit anormal ou vibrations", causes: ["Compresseur fatigué", "Silentblocs usés", "Position instable", "Composant interne desserré"], solutionsPatient: ["L'appareil est-il bien à plat sur une surface stable ?", "Le bruit change-t-il si vous le déplacez ?", "Vérifiez qu'aucun objet ne vibre contre le boîtier."], solutionsTech: ["Vérifier les fixations moteur.", "Remplacer les silentblocs.", "Vérifier le ventilateur.", "Resserrer le châssis."] }
                ] },
                { id: "everflo", name: "EverFlo", failures: [ // Renamed from "Concentrateur EverFlo"
                    { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Alimentation", "Cordon", "Interrupteur"], solutionsPatient: ["Quand vous appuyez sur le bouton Marche, est-ce qu'il se passe quelque chose (bruit, lumière) ?", "Est-ce que le câble d'alimentation est bien enfoncé des deux côtés (mur et machine) ?", "Avez-vous essayé sur une autre prise électrique ?"], solutionsTech: ["Vérifier le cordon secteur.", "Vérifier le fusible/disjoncteur.", "Vérifier l'interrupteur.", "Vérifier le condensateur."] },
                    { title: "Débit faible ou irrégulier", causes: ["Filtre bouché", "Tamis moléculaire usé", "Compresseur usé", "Tubulure / canule obstruée"], solutionsPatient: ["Sentez-vous que l'air n'arrive pas régulièrement ?", "Le filtre à air est-il propre ?", "La tubulure ou la canule est-elle pliée ou bouchée ?", "Vérifiez le serrage de l'humidificateur."], solutionsTech: ["Maintenance compresseur.", "Remplacement tamis.", "Nettoyage filtre.", "Vérifier ou remplacer tubulure/canule."] },
                    { title: "Bruit anormal ou vibrations", causes: ["Humidité dans le silencieux", "Silenblocs compresseur usés", "Position instable", "Objet dans ventilateur"], solutionsPatient: ["Y a-t-il de l'eau dans le tuyau ?", "La pièce est-elle humide ?", "L'appareil est-il bien à plat sur le sol ?"], solutionsTech: ["Déshumidificateur si nécessaire.", "Remplacer silencieux", "Vérifier fixations moteur"] },
                    { title: "Erreur Système (O2 Bas / Pureté)", causes: ["Tamis moléculaire usé", "Mauvaise concentration O₂", "Filtre d'entrée noirci", "Fuite interne"], solutionsPatient: ["Le voyant oxygène est-il jaune ou rouge ?", "L'appareil a-t-il été entretenu récemment ?", "Vérifiez que rien n'obstrue les entrées d'air."], solutionsTech: ["Vérifier la pureté à l'analyseur.", "Maintenance interne (filtre feutre).", "Remplacer les colonnes.", "Contrôler les pressions."] },
                    { title: "Erreur Système (Surchauffe / Ventilation)", causes: ["Ventilation obstruée", "Environnement trop chaud"], solutionsPatient: ["L'appareil est-il chaud ?", "La grille à l'arrière est-elle libre ?", "Fait-il très chaud dans la pièce ?"], solutionsTech: ["Nettoyer grilles d'aération.", "Déplacer appareil, laisser refroidir."] },
                    { title: "Erreur Système (Obstruction Sortie Air)", causes: ["Sortie d’air bloquée", "Filtre final colmaté", "Couvercle mal clipsé"], solutionsPatient: ["La grille à l'arrière est-elle libre ?", "Vérifiez que rien ne cache le bas de l'appareil"], solutionsTech: ["Dégager la sortie d'air.", "Remplacer le filtre de sortie", "Vérifier étanchéité boîtier"] },
                    { title: "Erreur Système (Circuit Bouché)", causes: ["Circuit complètement bouché", "Débit réglé trop bas"], solutionsPatient: ["Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?"], solutionsTech: ["Vérifier tubulure / canule.", "Ajuster débit."] },
                    { title: "Erreur Système (Défaut Pression / Vanne)", causes: ["Défaut compresseur", "Fuite interne", "Vanne bloquée"], solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression sur l'écran ?", "Vérifiez que la canule n'est pas coincée."], solutionsTech: ["Maintenance technique (compresseur).", "Check tubulures", "Tester vannes"] },
                    { title: "Erreur Système (Panne Interne / SAV)", causes: ["Panne interne", "Défaut carte", "Surchauffe", "Vanne 4 voies bloquée"], solutionsPatient: ["Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Y a-t-il un message d'erreur sur l'écran ?", "Vérifiez que l'appareil est branché seul sur la prise."], solutionsTech: ["Maintenance technique / SAV.", "Check carte", "Nettoyer ouïes", "Vérifier les tensions."] },
                ] },
          { id: "homefill", name: "HomeFill", failures: [ // Renamed from "Invacare HomeFill (Compresseur)"
                    { title: "Erreur Système (Message d'erreur)", causes: ["Débit concentrateur > 3 L/min", "Pression d'entrée insuffisante", "Fuite au raccord"], solutionsPatient: ["Réduisez le débit de votre concentrateur à 3 L/min ou moins.", "Attendez 3 minutes que le voyant repasse au vert.", "Vérifiez que le tuyau reliant les deux machines n'est pas pincé."], solutionsTech: ["Vérifier la pression de couplage.", "Tester le capteur de pression d'entrée."] },
                    { title: "Erreur Système (Message d'erreur)", causes: ["Bouteille mal enclenchée", "Joint de l'embase sale", "Compresseur interne fatigué"], solutionsPatient: ["Retirez et remettez la bouteille jusqu'au 'double clic'.", "Nettoyez le connecteur avec un chiffon propre et sec.", "Vérifiez si la station fait du bruit (compresseur)."], solutionsTech: ["Remplacer le joint de l'embase.", "Vérifier le débit de remplissage.", "Révision du bloc compresseur."] },
                    { title: "Fuites importantes (Masque ou Circuit)", causes: ["Mauvaise connexion", "Joint sale", "O-ring de bouteille manquant"], solutionsPatient: ["Nettoyez le connecteur avec un chiffon sec.", "Reconnectez fermement la bouteille jusqu'au clic.", "Vérifiez le petit joint noir sur la bouteille."], solutionsTech: ["Remplacer le joint de l'embase.", "Vérifier l'étanchéité de la valve de remplissage.", "Contrôler l'alignement."] }
                ] },
          { id: "ultrafill", name: "UltraFill", failures: [ // Renamed from " UltraFill"
                    { title: "Erreur Système (Message d'erreur)", causes: ["Concentrateur compagnon éteint", "Débit réglé trop haut", "Vanne de couplage bloquée", "Bouteille mal positionnée"], solutionsPatient: ["Vérifiez que le concentrateur à côté est bien allumé.", "Réglez le débit sur la position 'Remplissage' (souvent 2L).", "Assurez-vous que la bouteille est bien verticale."], solutionsTech: ["Vérifier la valve de transfert.", "Tester la communication entre les deux appareils.", "Nettoyer les connecteurs.", "Vérifier les capteurs de pression."] }
                ] },
                { id: "everflo-pediatrique", name: "EverFlo Pédiatrique", failures: [ // Renamed from "Concentrateur EverFlo Pédiatrique"
                    { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Alimentation", "Cordon", "Interrupteur"], solutionsPatient: ["Quand vous appuyez sur le bouton Marche, est-ce qu'il se passe quelque chose (bruit, lumière) ?", "Est-ce que le câble d'alimentation est bien enfoncé des deux côtés (mur et machine) ?", "Avez-vous essayé sur une autre prise électrique ?"], solutionsTech: ["Vérifier le cordon secteur.", "Vérifier le fusible/disjoncteur.", "Vérifier l'interrupteur."] },
                    { title: "Débit faible ou irrégulier", causes: ["Filtre bouché", "Tamis moléculaire usé", "Compresseur usé", "Tubulure / canule obstruée"], solutionsPatient: ["Sentez-vous que l'air n'arrive pas régulièrement ?", "Le filtre à air est-il propre ?", "La tubulure ou la canule est-elle pliée ou bouchée ?", "Vérifiez le serrage de l'humidificateur."], solutionsTech: ["Maintenance compresseur.", "Remplacement tamis.", "Nettoyage filtre.", "Vérifier ou remplacer tubulure/canule."] },
                    { title: "Bruit anormal ou vibrations", causes: ["Compresseur fatigué", "Silentblocs usés", "Position instable", "Composant interne desserré"], solutionsPatient: ["L'appareil est-il bien à plat sur une surface stable ?", "Le bruit change-t-il si vous le déplacez ?", "Vérifiez qu'aucun objet ne vibre contre le boîtier."], solutionsTech: ["Vérifier les fixations moteur.", "Remplacer les silentblocs.", "Vérifier le ventilateur.", "Resserrer le châssis."] },
                    { title: "Erreur Système (O2 Bas / Pureté)", causes: ["Tamis moléculaire usé", "Mauvaise concentration O₂", "Filtre d'entrée noirci", "Fuite interne"], solutionsPatient: ["Le voyant oxygène est-il jaune ou rouge ?", "L'appareil a-t-il été entretenu récemment ?", "Vérifiez que rien n'obstrue les entrées d'air."], solutionsTech: ["Vérifier la pureté à l'analyseur.", "Maintenance interne (filtre feutre).", "Remplacer les colonnes.", "Contrôler les pressions."] },
                    { title: "Erreur Système (Surchauffe / Ventilation)", causes: ["Ventilation obstruée", "Environnement trop chaud"], solutionsPatient: ["L'appareil est-il chaud ?", "La grille à l'arrière est-elle libre ?", "Fait-il très chaud dans la pièce ?"], solutionsTech: ["Nettoyer grilles d'aération.", "Déplacer appareil, laisser refroidir."] },
                    { title: "Erreur Système (Obstruction Sortie Air)", causes: ["Sortie d’air bloquée", "Filtre HEPA colmaté", "Moteur de vanne bloqué"], solutionsPatient: ["La grille à l'arrière est-elle libre ?", "Vérifiez que rien ne cache le bas de l'appareil"], solutionsTech: ["Dégager la sortie d'air.", "Remplacer filtre HEPA", "Tester le cycle des vannes"] },
                    { title: "Erreur Système (Circuit Bouché)", causes: ["Circuit complètement bouché", "Débit réglé trop bas"], solutionsPatient: ["Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?"], solutionsTech: ["Vérifier tubulure / canule.", "Ajuster débit."] },
                    { title: "Erreur Système (Défaut Pression / Vanne)", causes: ["Défaut compresseur", "Fuite interne", "Obstruction tubulure"], solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression sur l'écran ?", "Vérifiez que la canule n'est pas pliée."], solutionsTech: ["Maintenance technique (compresseur).", "Inspecter tubulures internes", "Recalibrer capteurs"] },
                    { title: "Erreur Système (Panne Interne / SAV)", causes: ["Panne interne", "Carte électronique HS", "Capteur O2 défectueux"], solutionsPatient: ["Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Y a-t-il un message d'erreur sur l'écran ?", "Vérifiez l'état de la prise murale."], solutionsTech: ["Maintenance technique / SAV.", "Vérifier tensions carte", "Remplacer capteur O2"] }
                ] },
                { id: "igo2-fixe", name: "iGo 2 (Mode Fixe)", failures: [ // Renamed from "Concentrateur iGo 2 (Mode Fixe)"
                     { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Batterie vide", "Chargeur HS", "Carte"], solutionsPatient: ["Quand vous branchez le chargeur, est-ce qu'un voyant s'allume sur la machine ?", "Est-ce que le câble du chargeur est abîmé ou tordu ?", "Si vous retirez la batterie et branchez le chargeur, est-ce qu'il démarre ?"], solutionsTech: ["Tester l'alimentation externe.", "Tester sans batterie.", "Vérifier connectique interne."] },
                     { title: "Erreur Système (Batterie Faible / DC)", causes: ["Batterie faible", "Cordon mal inséré", "Surchauffe batterie"], solutionsPatient: ["Le voyant batterie est-il allumé ?", "Est-il bien branché sur le secteur ?", "La batterie est-elle chaude ?"], solutionsTech: ["Remplacer batterie.", "Nettoyer contacts batterie.", "Vérifier tension chargeur."] },
                     { title: "Erreur Système (Surchauffe Interne)", causes: ["Surchauffe interne", "Batterie déconnectée", "Défaut carte"], solutionsPatient: ["L'appareil est-il chaud au toucher ?", "Les aérations sont-elles libres ?", "Vérifiez que la batterie ne bouge pas"], solutionsTech: ["Vérifier ventilation.", "Contrôler logs d'erreur.", "Tester carte."] },
                     { title: "Erreur Système (O2 Bas / Pureté)", causes: ["Tamis moléculaire usé", "Mauvaise concentration O₂", "Filtre d'entrée obstrué", "Compresseur usé"], solutionsPatient: ["Le voyant oxygène est-il jaune ou rouge ?", "Le filtre est-il bien propre ?", "L'appareil est-il dans un sac mal aéré ?"], solutionsTech: ["Vérifier la pureté à l'analyseur.", "Maintenance interne.", "Remplacer les tamis.", "Tester la pression."] },
                     { title: "Erreur Système (Surchauffe / Ventilation)", causes: ["Ventilation obstruée", "Environnement trop chaud"], solutionsPatient: ["L'appareil est-il très chaud ?", "Est-ce que quelque chose bouche les grilles d'aération ?", "Fait-il très chaud dans la pièce ?"], solutionsTech: ["Nettoyer grilles d'aération.", "Déplacer appareil, laisser refroidir."] },
                     { title: "Erreur Système (Obstruction Sortie Air)", causes: ["Sortie d’air obstruée", "Sacoche mal positionnée", "Filtre d'échappement saturé"], solutionsPatient: ["Vérifiez que rien ne bouche l'arrière.", "Sortez l'appareil de sa sacoche pour tester."], solutionsTech: ["Dégager la sortie d’air.", "Remplacer filtre échappement."] },
                     { title: "Erreur Système (Circuit Bouché)", causes: ["Circuit complètement bouché", "Débit réglé trop bas"], solutionsPatient: ["Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?"], solutionsTech: ["Vérifier tubulure / canule.", "Ajuster débit."] },
                     { title: "Erreur Système (Défaut Pression / Vanne)", causes: ["Défaut compresseur", "Fuite interne", "Sonde pression HS"], solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme sur l'écran ?"], solutionsTech: ["Maintenance technique (compresseur).", "Rechercher fuite.", "Remplacer capteur."] },
                     { title: "Erreur Système (Panne Interne / SAV)", causes: ["Panne interne", "Défaut carte", "Surchauffe", "Vanne 4 voies bloquée"], solutionsPatient: ["Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Y a-t-il un message d'erreur sur l'écran ?", "Vérifiez que l'appareil est branché seul sur la prise."], solutionsTech: ["Maintenance technique / SAV.", "Check carte", "Nettoyer ouïes", "Vérifier les tensions."] },
                     { title: "Bruit anormal ou vibrations", causes: ["Compresseur fatigué", "Silentblocs usés", "Position instable", "Composant interne desserré"], solutionsPatient: ["L'appareil est-il bien à plat sur une surface stable ?", "Le bruit change-t-il si vous le déplacez ?", "Vérifiez qu'aucun objet ne vibre contre le boîtier."], solutionsTech: ["Vérifier les fixations moteur.", "Remplacer les silentblocs.", "Vérifier le ventilateur.", "Resserrer le châssis."] }
                ] }
            ]
          },
          {
            id: "portable",
            name: "Portable",
            models: [
                { id: "inogen-g3", name: "Inogen One G3", failures: [
                { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Batterie vide", "Chargeur HS", "Coupure de courant", "Câble mal branché"], solutionsPatient: ["Quand vous branchez le chargeur, est-ce qu'un voyant s'allume sur la machine ?", "Est-ce que le câble du chargeur est abîmé ou tordu ?", "Si vous retirez la batterie et branchez le chargeur, est-ce qu'il démarre ?", "Y a-t-il eu une coupure de courant ?"], solutionsTech: ["Tester l'alimentation externe.", "Tester sans batterie.", "Vérifier connectique interne.", "Vérifier secteur / basculer sur secours."] },
                { title: "Problème de batterie ou autonomie", causes: ["Batterie usée", "Contacts sales", "Mauvaise insertion", "Surchauffe batterie"], solutionsPatient: ["La batterie tient-elle la charge ?", "Vérifiez que vous avez bien entendu le 'clic' lors de l'insertion.", "Nettoyez les contacts métalliques avec un chiffon sec.", "La batterie est-elle chaude ?"], solutionsTech: ["Contrôler la capacité réelle de la batterie.", "Remplacer batterie.", "Nettoyer connecteurs.", "Vérifier circuit de charge."] },
                { title: "Débit faible ou irrégulier", causes: ["Filtre bouché", "Airflow bloqué", "Tubulure / canule obstruée", "Tamis moléculaires fatigués", "Circuit complètement bouché", "Débit réglé trop bas", "Canule trop longue", "Pliure dans la tubulure"], solutionsPatient: ["Le filtre est-il propre ?", "Est-ce que le sac bouche les trous ?", "La tubulure ou la canule est-elle pliée ou bouchée ?", "Voyez-vous un message O2 faible ?", "Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?", "Vérifiez votre canule sur toute la longueur.", "Essayez avec une canule neuve."], solutionsTech: ["Nettoyer filtre.", "Dégager aérations.", "Vérifier ou remplacer tubulure/canule.", "Analyser la pureté O2.", "Ajuster débit.", "Tester la valve de pulsion.", "Vérifier le capteur de pression."] },
                    { title: "Erreur Système (Surchauffe / Ventilation)", causes: ["Environnement trop chaud", "Capteur défectueux", "Filtres encrassés", "Ventilateur interne HS"], solutionsPatient: ["L'appareil est-il au soleil ou dans une zone chaude ?", "Vérifiez que les filtres extérieurs sont propres.", "Qu'est-ce qui est écrit sur l'écran ?", "Laissez refroidir l'appareil."], solutionsTech: ["Utiliser en zone ventilée.", "Nettoyer l'intérieur.", "Remplacer le ventilateur.", "Effectuer un diagnostic logiciel."] },
                { title: "Erreur Système (Défaut Pression / Vanne)", causes: ["Défaut compresseur", "Fuite interne", "Obstruction interne"], solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression sur l'écran ?", "Vérifiez que la canule n'est pas pincée."], solutionsTech: ["Maintenance technique (compresseur).", "Recherche de fuites internes.", "Remplacer capteurs de pression."] },
                { title: "Erreur Système (Panne Interne / SAV)", causes: ["Panne interne", "Tamis en fin de vie", "Pile interne vide", "Capteur O2 HS"], solutionsPatient: ["Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Y a-t-il un message d'erreur spécifique ?", "Redémarrer l'appareil après 10 min."], solutionsTech: ["Maintenance technique / SAV.", "Remplacement des colonnes.", "Diagnostic via logiciel constructeur."] },
                { title: "Bruit anormal ou vibrations", causes: ["Compresseur fatigué", "Silentblocs usés", "Position instable", "Composant interne desserré"], solutionsPatient: ["L'appareil est-il bien à plat sur une surface stable ?", "Le bruit change-t-il si vous le déplacez ?", "Vérifiez qu'aucun objet ne vibre contre le boîtier."], solutionsTech: ["Vérifier les fixations moteur.", "Remplacer les silentblocs.", "Vérifier le ventilateur.", "Resserrer le châssis."] }
                ] },
                { id: "inogen-g4", name: "Inogen One G4", failures: [
                { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Batterie vide", "Chargeur HS", "Coupure de courant", "Câble mal branché"], solutionsPatient: ["Quand vous branchez le chargeur, est-ce qu'un voyant s'allume sur la machine ?", "Est-ce que le câble du chargeur est abîmé ou tordu ?", "Si vous retirez la batterie et branchez le chargeur, est-ce qu'il démarre ?", "Y a-t-il eu une coupure de courant ?"], solutionsTech: ["Tester l'alimentation externe.", "Tester sans batterie.", "Vérifier connectique interne.", "Vérifier secteur / basculer sur secours."] },
                { title: "Problème de batterie ou autonomie", causes: ["Batterie usée", "Contacts sales", "Mauvaise insertion", "Surchauffe batterie"], solutionsPatient: ["La batterie tient-elle la charge ?", "Vérifiez que vous avez bien entendu le 'clic' lors de l'insertion.", "Nettoyez les contacts métalliques avec un chiffon sec.", "La batterie est-elle chaude ?"], solutionsTech: ["Contrôler la capacité réelle de la batterie.", "Remplacer batterie.", "Nettoyer connecteurs.", "Vérifier circuit de charge."] },
                { title: "Débit faible ou irrégulier", causes: ["Filtre bouché", "Airflow bloqué", "Tubulure / canule obstruée", "Tamis moléculaires fatigués", "Circuit complètement bouché", "Débit réglé trop bas", "Canule trop longue", "Pliure dans la tubulure"], solutionsPatient: ["Le filtre est-il propre ?", "Est-ce que le sac bouche les trous ?", "La tubulure ou la canule est-elle pliée ou bouchée ?", "Voyez-vous un message O2 faible ?", "Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?", "Vérifiez votre canule sur toute la longueur.", "Essayez avec une canule neuve."], solutionsTech: ["Nettoyer filtre.", "Dégager aérations.", "Vérifier ou remplacer tubulure/canule.", "Analyser la pureté O2.", "Ajuster débit.", "Tester la valve de pulsion.", "Vérifier le capteur de pression."] },
                    { title: "Erreur Système (Surchauffe / Ventilation)", causes: ["Environnement trop chaud", "Capteur défectueux", "Filtres encrassés", "Ventilateur interne HS"], solutionsPatient: ["L'appareil est-il au soleil ou dans une zone chaude ?", "Vérifiez que les filtres extérieurs sont propres.", "Qu'est-ce qui est écrit sur l'écran ?", "Laissez refroidir l'appareil."], solutionsTech: ["Utiliser en zone ventilée.", "Nettoyer l'intérieur.", "Remplacer le ventilateur.", "Effectuer un diagnostic logiciel."] },
                { title: "Erreur Système (Défaut Pression / Vanne)", causes: ["Défaut compresseur", "Fuite interne", "Obstruction interne"], solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression sur l'écran ?", "Vérifiez que la canule n'est pas pincée."], solutionsTech: ["Maintenance technique (compresseur).", "Recherche de fuites internes.", "Remplacer capteurs de pression."] },
                { title: "Erreur Système (Panne Interne / SAV)", causes: ["Panne interne", "Tamis en fin de vie", "Pile interne vide", "Capteur O2 HS"], solutionsPatient: ["Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Y a-t-il un message d'erreur spécifique ?", "Redémarrer l'appareil après 10 min."], solutionsTech: ["Maintenance technique / SAV.", "Remplacement des colonnes.", "Diagnostic via logiciel constructeur."] },
                { title: "Bruit anormal ou vibrations", causes: ["Compresseur fatigué", "Silentblocs usés", "Position instable", "Composant interne desserré"], solutionsPatient: ["L'appareil est-il bien à plat sur une surface stable ?", "Le bruit change-t-il si vous le déplacez ?", "Vérifiez qu'aucun objet ne vibre contre le boîtier."], solutionsTech: ["Vérifier les fixations moteur.", "Remplacer les silentblocs.", "Vérifier le ventilateur.", "Resserrer le châssis."] }
                ] },
                { id: "inogen-g5", name: "Inogen One G5", failures: [
                { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Batterie vide", "Chargeur HS", "Coupure de courant", "Câble mal branché"], solutionsPatient: ["Quand vous branchez le chargeur, est-ce qu'un voyant s'allume sur la machine ?", "Est-ce que le câble du chargeur est abîmé ou tordu ?", "Si vous retirez la batterie et branchez le chargeur, est-ce qu'il démarre ?", "Y a-t-il eu une coupure de courant ?"], solutionsTech: ["Tester l'alimentation externe.", "Tester sans batterie.", "Vérifier connectique interne.", "Vérifier secteur / basculer sur secours."] },
                { title: "Problème de batterie ou autonomie", causes: ["Batterie usée", "Contacts sales", "Mauvaise insertion", "Surchauffe batterie"], solutionsPatient: ["La batterie tient-elle la charge ?", "Vérifiez que vous avez bien entendu le 'clic' lors de l'insertion.", "Nettoyez les contacts métalliques avec un chiffon sec.", "La batterie est-elle chaude ?"], solutionsTech: ["Contrôler la capacité réelle de la batterie.", "Remplacer batterie.", "Nettoyer connecteurs.", "Vérifier circuit de charge."] },
                { title: "Débit faible ou irrégulier", causes: ["Filtre bouché", "Airflow bloqué", "Tubulure / canule obstruée", "Tamis moléculaires fatigués", "Circuit complètement bouché", "Débit réglé trop bas", "Canule trop longue", "Pliure dans la tubulure"], solutionsPatient: ["Le filtre est-il propre ?", "Est-ce que le sac bouche les trous ?", "La tubulure ou la canule est-elle pliée ou bouchée ?", "Voyez-vous un message O2 faible ?", "Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?", "Vérifiez votre canule sur toute la longueur.", "Essayez avec une canule neuve."], solutionsTech: ["Nettoyer filtre.", "Dégager aérations.", "Vérifier ou remplacer tubulure/canule.", "Analyser la pureté O2.", "Ajuster débit.", "Tester la valve de pulsion.", "Vérifier le capteur de pression."] },
                    { title: "Erreur Système (Surchauffe / Ventilation)", causes: ["Environnement trop chaud", "Capteur défectueux", "Filtres encrassés", "Ventilateur interne HS"], solutionsPatient: ["L'appareil est-il au soleil ou dans une zone chaude ?", "Vérifiez que les filtres extérieurs sont propres.", "Qu'est-ce qui est écrit on l'écran ?", "Laissez refroidir l'appareil."], solutionsTech: ["Utiliser en zone ventilée.", "Nettoyer l'intérieur.", "Remplacer le ventilateur.", "Effectuer un diagnostic logiciel."] },
                { title: "Erreur Système (Défaut Pression / Vanne)", causes: ["Défaut compresseur", "Fuite interne", "Obstruction interne"], solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression sur l'écran ?", "Vérifiez que la canule n'est pas pincée."], solutionsTech: ["Maintenance technique (compresseur).", "Recherche de fuites internes.", "Remplacer capteurs de pression."] },
                { title: "Erreur Système (Panne Interne / SAV)", causes: ["Panne interne", "Tamis en fin de vie", "Pile interne vide", "Capteur O2 HS"], solutionsPatient: ["Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Y a-t-erreur spécifique ?", "Redémarrer l'appareil après 10 min."], solutionsTech: ["Maintenance technique / SAV.", "Remplacement des colonnes.", "Diagnostic via logiciel constructeur."] },
                { title: "Bruit anormal ou vibrations", causes: ["Compresseur fatigué", "Silentblocs usés", "Position instable", "Composant interne desserré"], solutionsPatient: ["L'appareil est-il bien à plat sur une surface stable ?", "Le bruit change-t-il si vous le déplacez ?", "Vérifiez qu'aucun objet ne vibre contre le boîtier."], solutionsTech: ["Vérifier les fixations moteur.", "Remplacer les silentblocs.", "Vérifier le ventilateur.", "Resserrer le châssis."] }
                ] },
                { id: "inogen-rove", name: "Inogen Rove 6", failures: [
                { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Batterie vide", "Chargeur HS", "Carte"], solutionsPatient: ["Quand vous branchez le chargeur, est-is qu'un voyant s'allume on la machine ?", "Est-ce que le câble du chargeur est abîmé ou tordu ?", "Si vous retirez la batterie et branchez le chargeur, est-ce qu'il démarre ?"], solutionsTech: ["Tester l'alimentation externe.", "Tester sans batterie.", "Vérifier connectique interne."] },
                { title: "Problème de batterie ou autonomie", causes: ["Batterie usée", "Contacts sales", "Mauvaise insertion", "Surchauffe batterie"], solutionsPatient: ["La batterie tient-elle la charge ?", "Vérifiez que vous avez bien entendu le 'clic' lors de l'insertion.", "Nettoyez les contacts métalliques avec un chiffon sec.", "La batterie est-elle chaude ?"], solutionsTech: ["Contrôler la capacité réelle de la batterie.", "Remplacer batterie.", "Nettoyer connecteurs.", "Vérifier circuit de charge."] },
                { title: "Débit faible ou irrégulier", causes: ["Filtre bouché", "Airflow bloqué", "Tubulure / canule obstruée", "Tamis moléculaires fatigués", "Circuit complètement bouché", "Débit réglé trop bas", "Canule trop longue", "Pliure dans la tubulure"], solutionsPatient: ["Le filtre est-il propre ?", "Est-ce que le sac bouche les trous ?", "La tubulure ou la canule est-elle pliée ou bouchée ?", "Voyez-vous un message O2 faible ?", "Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?", "Vérifiez votre canule sur toute la longueur.", "Essayez avec une canule neuve."], solutionsTech: ["Nettoyer filtre.", "Dégager aérations.", "Vérifier ou remplacer tubulure/canule.", "Analyser la pureté O2.", "Ajuster débit.", "Tester la valve de pulsion.", "Vérifier le capteur de pression."] },
                    { title: "Erreur Système (Surchauffe / Ventilation)", causes: ["Environnement trop chaud", "Capteur défectueux", "Filtres encrassés", "Ventilateur interne HS"], solutionsPatient: ["L'appareil est-il au soleil ou dans une zone chaude ?", "Vérifiez que les filtres extérieurs sont propres.", "Qu'est-ce qui est écrit sur l'écran ?", "Laissez refroidir l'appareil."], solutionsTech: ["Utiliser en zone ventilée.", "Nettoyer l'intérieur.", "Remplacer le ventilateur.", "Effectuer un diagnostic logiciel."] },
                { title: "Erreur Système (Défaut Pression / Vanne)", causes: ["Défaut compresseur", "Fuite interne", "Obstruction interne"], solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression sur l'écran ?", "Vérifiez que la canule n'est pas pincée."], solutionsTech: ["Maintenance technique (compresseur).", "Recherche de fuites internes.", "Remplacer capteurs de pression."] },
                { title: "Erreur Système (Panne Interne / SAV)", causes: ["Panne interne", "Tamis en fin de vie", "Pile interne vide", "Capteur O2 HS"], solutionsPatient: ["Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Y a-t-il un message d'erreur spécifique ?", "Redémarrer l'appareil après 10 min."], solutionsTech: ["Maintenance technique / SAV.", "Remplacement des colonnes.", "Diagnostic via logiciel constructeur."] },
                { title: "Bruit anormal ou vibrations", causes: ["Compresseur fatigué", "Silentblocs usés", "Position instable", "Composant interne desserré"], solutionsPatient: ["L'appareil est-il bien à plat sur une surface stable ?", "Le bruit change-t-il si vous le déplacez ?", "Vérifiez qu'aucun objet ne vibre contre le boîtier."], solutionsTech: ["Vérifier les fixations moteur.", "Remplacer les silentblocs.", "Vérifier le ventilateur.", "Resserrer le châssis."] }
                ] },
                { id: "xpo2", name: "Invacare XPO2", failures: [
                    { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Batterie vide", "Bloc secteur HS", "Connecteur d'embase dessoudé"], solutionsPatient: ["Branchez l'appareil sur secteur.", "Le voyant vert sur le bloc d'alimentation est-il allumé ?", "Essayez de démarrer sans la batterie, juste sur secteur."], solutionsTech: ["Tester la tension de sortie du chargeur (19V).", "Vérifier la continuité de l'embase de charge.", "Contrôler le fusible interne."] },
                    { title: "Problème de détection respiratoire (Trigger)", causes: ["Tubulure trop longue (> 10m)", "Respiration buccale", "Capteur de trigger HS"], solutionsPatient: ["Utilisez une canule de 2 mètres maximum.", "Respirez bien par le nez.", "Vérifiez que le raccord de canule est bien vissé."], solutionsTech: ["Vérifier la valve de pulsion.", "Recalibrer la sensibilité du trigger.", "Tester l'étanchéité du circuit interne."] },
                    { title: "Erreur Système (O2 Bas / Pureté)", causes: ["Usure des tamis moléculaires", "Filtre d'entrée colmaté", "Compresseur fatigué"], solutionsPatient: ["Vérifiez que les filtres extérieurs sont propres.", "Ne couvrez pas l'appareil avec une couverture.", "Aérez la pièce."], solutionsTech: ["Mesurer la pureté à l'analyseur.", "Remplacer les colonnes de tamis.", "Vérifier la pression de sortie du compresseur."] },
                    { title: "Problème de batterie ou autonomie", causes: ["Batterie trop chaude", "Cellules usées", "Contacts sales"], solutionsPatient: ["Laissez la batterie refroidir 1h.", "Nettoyez les contacts avec un chiffon sec.", "Vérifiez que la batterie est bien cliquée."], solutionsTech: ["Vérifier le cycle de charge.", "Remplacer la batterie."] },
                    { title: "Bruit anormal ou vibrations", causes: ["Compresseur fatigué", "Silentblocs usés", "Position instable", "Composant interne desserré"], solutionsPatient: ["L'appareil est-il bien à plat sur une surface stable ?", "Le bruit change-t-il si vous le déplacez ?", "Vérifiez qu'aucun objet ne vibre contre le boîtier."], solutionsTech: ["Vérifier les fixations moteur.", "Remplacer les silentblocs.", "Vérifier le ventilateur.", "Resserrer le châssis."] }
                ] },
                { id: "simplygo-mini", name: "SimplyGo Mini", failures: [
                    { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Batterie vide", "Chargeur HS", "Carte"], solutionsPatient: ["Quand vous branchez le chargeur, est-is qu'un voyant s'allume on la machine ?", "Est-ce que le câble du chargeur est abîmé ou tordu ?", "Si vous retirez la batterie et branchez le chargeur, est-ce qu'il démarre ?"], solutionsTech: ["Tester l'alimentation externe.", "Tester sans batterie.", "Vérifier connectique interne."] },
                    { title: "Erreur Système (Surchauffe / Ventilation)", causes: ["Filtre sale", "Environnement trop chaud", "Capteur défectueux", "Surchauffe batterie"], solutionsPatient: ["Le filtre est-il propre ?", "Fait-il très chaud là où vous êtes ?", "Vérifiez que le sac n'obstrue pas les grilles.", "Voyez-vous un code d'alarme ?"], solutionsTech: ["Nettoyage filtre.", "Déplacer appareil, laisser refroidir.", "Vérifier ventilateur interne.", "Maintenance technique."] },
                { title: "Débit faible ou irrégulier", causes: ["Ventilation insuffisante", "Airflow bloqué", "Tubulure / canule obstruée", "Tamis moléculaires fatigués", "Circuit complètement bouché", "Débit réglé trop bas"], solutionsPatient: ["Est-ce que le sac de transport bouche les aérations ?", "L'appareil respire-t-il bien ?", "La tubulure ou la canule est-elle pliée ou bouchée ?", "Vérifiez si l'appareil bipe sur chaque inspiration?", "Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?"], solutionsTech: ["Ne pas obstruer aérations.", "Dégager entrées d'air.", "Mesurer la pureté O2.", "Vérifier ou remplacer tubulure/canule.", "Ajuster débit."] },
                    { title: "Erreur Système (Défaut Pression / Vanne)", causes: ["Défaut compresseur", "Tubulure interne coudée", "Fuite interne"], solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression sur l'écran ?", "Vérifiez que la canule n'est pas écrasée."], solutionsTech: ["Maintenance technique (compresseur).", "Recherche de fuites pneumatiques.", "Vérifier le cycle des vannes."] },
                    { title: "Erreur Système (Panne Interne / SAV)", causes: ["Panne interne", "Capteur O2 HS", "Défaut carte mère", "Pile d'alarme HS"], solutionsPatient: ["Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Y a-t-il un message d'erreur sur l'écran ?", "Retirez la batterie et le secteur, attendez 1 min."], solutionsTech: ["Maintenance technique / SAV.", "Effectuer un diagnostic via le menu technique.", "Vérifier les tensions de la carte."] },
                    { title: "Bruit anormal ou vibrations", causes: ["Compresseur fatigué", "Silentblocs usés", "Position instable", "Composant interne desserré"], solutionsPatient: ["L'appareil est-il bien à plat sur une surface stable ?", "Le bruit change-t-il si vous le déplacez ?", "Vérifiez qu'aucun objet ne vibre contre le boîtier."], solutionsTech: ["Vérifier les fixations moteur.", "Remplacer les silentblocs.", "Vérifier le ventilateur.", "Resserrer le châssis."] }
                ] },
                { id: "simplygo-mini-ld", name: "SimplyGo Mini (Longue Durée)", failures: [
                    { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Batterie vide", "Chargeur HS", "Carte"], solutionsPatient: ["Quand vous branchez le chargeur, est-is qu'un voyant s'allume on la machine ?", "Est-ce que le câble du chargeur est abîmé ou tordu ?", "Si vous retirez la batterie et branchez le chargeur, est-ce qu'il démarre ?"], solutionsTech: ["Tester l'alimentation externe.", "Tester sans batterie.", "Vérifier connectique interne."] },
                    { title: "Erreur Système (Surchauffe / Ventilation)", causes: ["Filtre sale", "Environnement chaud", "Capteur HS"], solutionsPatient: ["Le filtre est-il propre ?", "Est-qu'il fait chaud dehors ?", "Voyez-vous un code d'alarme ?"], solutionsTech: ["Nettoyage filtre.", "Déplacer appareil, laisser refroidir.", "Maintenance technique."] },
                { title: "Débit faible ou irrégulier", causes: ["Ventilation insuffisante", "Airflow bloqué", "Tubulure / canule obstruée", "Circuit complètement bouché", "Débit réglé trop bas"], solutionsPatient: ["Est-ce que le sac de transport bouche les aérations ?", "L'appareil respire-t-il bien ?", "La tubulure ou la canule est-elle pliée ou bouchée ?", "Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?"], solutionsTech: ["Ne pas obstruer aérations.", "Dégager entrées d'air.", "Vérifier ou remplacer tubulure/canule.", "Ajuster débit."] },
                    { title: "Erreur Système (Défaut Pression / Vanne)", causes: ["Défaut compresseur", "Tubulure interne coudée", "Surchauffe"], solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression sur l'écran ?"], solutionsTech: ["Maintenance technique (compresseur).", "Vérifier tubulures", "Check ventilateur"] },
                    { title: "Erreur Système (Panne Interne / SAV)", causes: ["Panne interne", "Capteur O2 HS", "Défaut carte"], solutionsPatient: ["Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Y a-t-il un message d'erreur sur l'écran ?"], solutionsTech: ["Maintenance technique / SAV.", "Remplacer capteur", "Vérifier tensions"] },
                    { title: "Bruit anormal ou vibrations", causes: ["Compresseur fatigué", "Silentblocs usés", "Position instable", "Composant interne desserré"], solutionsPatient: ["L'appareil est-il bien à plat sur une surface stable ?", "Le bruit change-t-il si vous le déplacez ?", "Vérifiez qu'aucun objet ne vibre contre le boîtier."], solutionsTech: ["Vérifier les fixations moteur.", "Remplacer les silentblocs.", "Vérifier le ventilateur.", "Resserrer le châssis."] }
                ] },
                { id: "zen-o-lite", name: "Zen-O Lite", failures: [
                    { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Batterie vide", "Chargeur HS", "Carte"], solutionsPatient: ["Quand vous branchez le chargeur, est-is qu'un voyant s'allume on la machine ?", "Est-ce que le câble du chargeur est abîmé ou tordu ?", "Si vous retirez la batterie et branchez le chargeur, est-ce qu'il démarre ?"], solutionsTech: ["Tester l'alimentation externe.", "Tester sans batterie.", "Vérifier connectique interne."] },
                    { title: "Problème de batterie ou autonomie", causes: ["Autonomie < 10 %", "Batterie en fin de vie", "Défaut de communication batterie", "Surchauffe batterie"], solutionsPatient: ["Branchez sur secteur immédiatement.", "Retirez et remettez la batterie fermement.", "Laissez la batterie refroidir si elle est chaude.", "Vérifiez si l'icône batterie s'affiche."], solutionsTech: ["Vérifier la capacité de charge.", "Nettoyer les connecteurs batterie.", "Remplacer la batterie.", "Vérifier le circuit de charge sur la carte."] },
                { title: "Débit faible ou irrégulier", causes: ["Pompe défectueuse", "Airflow bloqué", "Tubulure / canule obstruée", "Filtre d'entrée colmaté", "Circuit complètement bouché", "Débit réglé trop bas"], solutionsPatient: ["L'appareil fait-il un bruit anormal ?", "Les aérations sont-elles libres ?", "La tubulure ou la canule est-elle pliée ou bouchée ?", "Vérifiez que le sac est bien positionné?", "Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?"], solutionsTech: ["Maintenance pompe.", "Dégager aérations.", "Vérifier ou remplacer tubulure/canule.", "Nettoyer les conduits d'entrée.", "Vérifier tubulure / canule.", "Ajuster débit."] },
                    { title: "Bruit anormal ou vibrations", causes: ["Compresseur fatigué", "Silentblocs usés", "Position instable", "Composant interne desserré"], solutionsPatient: ["L'appareil est-il bien à plat sur une surface stable ?", "Le bruit change-t-il si vous le déplacez ?", "Vérifiez qu'aucun objet ne vibre contre le boîtier."], solutionsTech: ["Vérifier les fixations moteur.", "Remplacer les silentblocs.", "Vérifier le ventilateur.", "Resserrer le châssis."] },
                    { title: "Erreur Système (Surchauffe / Ventilation)", causes: ["Environnement trop chaud", "Capteur défectueux", "Ventilateur interne bloqué", "Aérations bouchées"], solutionsPatient: ["Fait-il très chaud ?", "Vérifiez que rien ne bouche les grilles.", "Y a-t-il une alarme système sur l'écran ?"], solutionsTech: ["Déplacer appareil, laisser refroidir.", "Vérifier le fonctionnement du ventilateur.", "Maintenance technique."] },
                    { title: "Erreur Système (Défaut Pression / Vanne)", causes: ["Défaut compresseur", "Fuite interne", "Surchauffe"], solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression sur l'écran ?"], solutionsTech: ["Maintenance technique (compresseur).", "Vérifier tubulures"] },
                    { title: "Erreur Système (Panne Interne / SAV)", causes: ["Panne interne", "Capteur HS", "Défaut carte"], solutionsPatient: ["Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Y a-t-il un message d'erreur sur l'écran ?"], solutionsTech: ["Maintenance technique / SAV.", "Check carte"] },
                    { title: "Bruit anormal ou vibrations", causes: ["Compresseur fatigué", "Silentblocs usés", "Position instable", "Composant interne desserré"], solutionsPatient: ["L'appareil est-il bien à plat sur une surface stable ?", "Le bruit change-t-il si vous le déplacez ?", "Vérifiez qu'aucun objet ne vibre contre le boîtier."], solutionsTech: ["Vérifier les fixations moteur.", "Remplacer les silentblocs.", "Vérifier le ventilateur.", "Resserrer le châssis."] }
                ] },
                { id: "zen-o", name: "Zen-O (Double batterie)", failures: [
                    { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Batterie vide", "Chargeur HS", "Carte"], solutionsPatient: ["Quand vous branchez le chargeur, est-is qu'un voyant s'allume on la machine ?", "Est-ce que le câble du chargeur est abîmé ou tordu ?", "Si vous retirez la batterie et branchez le chargeur, est-ce qu'il démarre ?"], solutionsTech: ["Tester l'alimentation externe.", "Tester sans batterie.", "Vérifier connectique interne."] },
                    { title: "Problème de batterie ou autonomie", causes: ["Une des deux batteries est défaillante", "Batterie en fin de vie", "Défaut de communication (Bus SMBus)", "Surchauffe batterie"], solutionsPatient: ["Branchez sur secteur.", "Retirez les deux batteries et testez-les une par une.", "Nettoyez les contacts métalliques au fond des compartiments.", "Vérifiez le niveau de charge sur chaque batterie (bouton test)."], solutionsTech: ["Vérifier la capacité de charge individuelle.", "Nettoyer les connecteurs machine.", "Remplacer la batterie défectueuse.", "Vérifier le circuit de commutation sur la carte mère."] },
                    { title: "Fuites importantes (Masque ou Circuit)", causes: ["Connectique mal serrée", "Joint valve usé", "Canule percée", "Raccord de sortie desserré"], solutionsPatient: ["Le tuyau est-il bien branché ?", "Sentez-vous de l'air sortir ailleurs ?", "Essayez une autre canule.", "Vérifiez le raccord de sortie sur l'appareil."], solutionsTech: ["Vérifier connexions.", "Remplacer joint valve.", "Tester étanchéité sortie.", "Vérifier le circuit pneumatique interne."] },
                    { title: "Erreur Système (Surchauffe / Ventilation)", causes: ["Environnement trop chaud", "Capteur HS", "Filtres bouchés", "Ventilateur interne fatigué"], solutionsPatient: ["Voyez-vous un message d'erreur ?", "Fait-il chaud ?", "Les grilles à l'arrière sont-elles propres ?"], solutionsTech: ["Déplacer appareil, laisser refroidir.", "Nettoyer conduits.", "Remplacer ventilateur.", "Maintenance technique."] },
                { title: "Débit faible ou irrégulier", causes: ["Circuit complètement bouché", "Débit réglé trop bas"], solutionsPatient: ["Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?"], solutionsTech: ["Vérifier tubulure / canule.", "Ajuster débit."] },
                    { title: "Erreur Système (Défaut Pression / Vanne)", causes: ["Défaut compresseur", "Tubulure pliée", "Vanne HS", "Fuite interne"], solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression on l'écran ?", "Vérifiez que le tuyau n'est pas pincé par le sac."], solutionsTech: ["Maintenance technique (compresseur).", "Vérifier tubulures.", "Tester vannes.", "Effectuer test d'étanchéité."] },
                    { title: "Erreur Système (Panne Interne / SAV)", causes: ["Panne interne", "Défaut carte", "Batterie défectueuse"], solutionsPatient: ["Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Y a-t-il un message d'erreur sur l'écran ?"], solutionsTech: ["Maintenance technique / SAV.", "Check carte", "Contrôler batterie"] },
                    { title: "Bruit anormal ou vibrations", causes: ["Compresseur fatigué", "Silentblocs usés", "Position instable", "Composant interne desserré"], solutionsPatient: ["L'appareil est-il bien à plat sur une surface stable ?", "Le bruit change-t-il si vous le déplacez ?", "Vérifiez qu'aucun objet ne vibre contre le boîtier."], solutionsTech: ["Vérifier les fixations moteur.", "Remplacer les silentblocs.", "Vérifier le ventilateur.", "Resserrer le châssis."] }
                ] },
                { id: "freestyle", name: "FreeStyle Comfort", failures: [
                    { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Batterie vide", "Chargeur HS", "Carte"], solutionsPatient: ["Quand vous branchez le chargeur, est-is qu'un voyant s'allume on la machine ?", "Est-ce que le câble du chargeur est abîmé ou tordu ?", "Si vous retirez la batterie et branchez le chargeur, est-ce qu'il démarre ?"], solutionsTech: ["Tester l'alimentation externe.", "Tester sans batterie.", "Vérifier connectique interne."] },
                    { title: "Fuites importantes (Masque ou Circuit)", causes: ["Connectique mal serrée", "Airflow bloqué", "Tubulure / canule obstruée", "Joint de raccord usé"], solutionsPatient: ["Le tuyau est-il bien clipsé ?", "Rien ne bouche les trous d'air ?", "La tubulure ou la canule est-elle pliée ou bouchée ?", "Entendez-vous un sifflement au branchement ?"], solutionsTech: ["Vérifier connexions.", "Dégager aérations.", "Vérifier ou remplacer tubulure/canule.", "Remplacer joint torique de sortie."] },
                    { title: "Erreur Système (Surchauffe / Ventilation)", causes: ["Environnement trop chaud", "Capteur HS", "Filtre bouché", "Ventilateur interne bloqué"], solutionsPatient: ["Voyez-vous un message d'erreur ?", "Fait-il chaud ?", "Les filtres noirs sur les côtés sont-ils propres ?", "Sentez-vous l'air sortir par les grilles ?"], solutionsTech: ["Nettoyer les filtres extérieurs.", "Déplacer appareil, laisser refroidir.", "Nettoyage interne à l'air sec.", "Remplacer ventilateur."] },
                { title: "Débit faible ou irrégulier", causes: ["Circuit complètement bouché", "Débit réglé trop bas"], solutionsPatient: ["Sentez-vous de l'air sortir du tout ?", "Le débit est-il réglé au minimum ?"], solutionsTech: ["Vérifier tubulure / canule.", "Ajuster débit."] },
                    { title: "Erreur Système (Défaut Pression / Vanne)", causes: ["Défaut compresseur", "Fuite interne", "Surchauffe", "Vanne de pulsion bloquée"], solutionsPatient: ["L'appareil fait-il un bruit étrange ?", "Voyez-vous une alarme de pression sur l'écran ?", "Vérifiez que votre canule n'est pas trop longue."], solutionsTech: ["Maintenance technique (compresseur).", "Vérifier tubulures.", "Nettoyer ventilateur.", "Tester la valve pneumatique."] },
                    { title: "Erreur Système (Panne Interne / SAV)", causes: ["Panne interne", "Défaut carte", "Surchauffe", "Tamis moléculaires HS"], solutionsPatient: ["Le voyant rouge est-il allumé et l'appareil bipe-t-il ?", "Y a-t-il un message d'erreur sur l'écran ?", "Laissez l'appareil éteint 30 min et redémarrez."], solutionsTech: ["Maintenance technique / SAV.", "Check carte.", "Contrôler tensions.", "Remplacer les colonnes."] },
                    { title: "Bruit anormal ou vibrations", causes: ["Compresseur fatigué", "Silentblocs usés", "Position instable", "Composant interne desserré"], solutionsPatient: ["L'appareil est-il bien à plat sur une surface stable ?", "Le bruit change-t-il si vous le déplacez ?", "Vérifiez qu'aucun objet ne vibre contre le boîtier."], solutionsTech: ["Vérifier les fixations moteur.", "Remplacer les silentblocs.", "Vérifier le ventilateur.", "Resserrer le châssis."] }
                ] }
            ]
          },
          {
            id: "transportable",
            name: "Transportable",
            models: [
                { id: "eclipse-3", name: "Eclipse 3", failures: [
                    { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Batterie vide", "Chargeur HS", "Connectique interne défaillante", "Carte mère HS"], solutionsPatient: ["Branchez l'appareil sur secteur.", "Le voyant du bloc d'alimentation est-il allumé ?", "Retirez la batterie et essayez sur secteur seul.", "Vérifiez que le câble n'est pas coupé."], solutionsTech: ["Tester la tension du chargeur (28V DC).", "Vérifier l'embase de charge.", "Vérifier les fusibles internes.", "Remplacer la carte mère."] },
                    { title: "Problème de batterie ou autonomie", causes: ["Autonomie < 10 %", "Batterie en fin de vie", "Défaut de communication batterie", "Surchauffe batterie"], solutionsPatient: ["Branchez sur secteur immédiatement.", "Retirez et remettez la batterie fermement.", "Laissez la batterie refroidir si elle est chaude.", "Vérifiez si l'icône batterie s'affiche."], solutionsTech: ["Vérifier la capacité de charge.", "Nettoyer les connecteurs batterie.", "Remplacer la batterie.", "Vérifier le circuit de charge sur la carte."] },
                    { title: "Problème d'alimentation (12V / Voiture)", causes: ["Cordon DC mal inséré", "Fusible allume-cigare grillé", "Prise voiture défectueuse", "Surchauffe du bloc DC"], solutionsPatient: ["Vérifiez que la prise est bien enfoncée dans l'allume-cigare.", "Vérifiez le voyant sur la prise.", "Dévissez l'embout pour vérifier le petit fusible.", "Essayez sur une autre prise 12V."], solutionsTech: ["Tester la continuité du câble DC.", "Vérifier le fusible du câble.", "Contrôler la tension de sortie sous charge."] },
                  { title: "Erreur Système (O2 Bas / Pureté)", causes: ["Saturation des tamis moléculaires", "Filtre d'entrée colmaté", "Fuite interne", "Humidité excessive"], solutionsPatient: ["Vérifiez que le filtre à poussière à l'arrière est propre.", "Placez l'appareil dans un endroit bien aéré.", "Assurez-vous de ne pas être trop près d'une source de vapeur.", "Aérez la pièce."], solutionsTech: ["Mesurer la pureté O2 avec un analyseur.", "Remplacer les colonnes de tamis.", "Vérifier la pression du compresseur.", "Contrôler l'étanchéité pneumatique."] },
                    { title: "Débit faible ou irrégulier", causes: ["Canule pliée ou écrasée", "Filtre HEPA bouché", "Vanne de sortie bloquée", "Bocal humidificateur fuyard"], solutionsPatient: ["Vérifiez que votre canule n'est pas pliée.", "Essayez avec une canule neuve.", "Si vous utilisez un humidificateur, vérifiez qu'il est bien fermé.", "Sentez-vous l'air sortir au bout ?"], solutionsTech: ["Vérifier le capteur de débit.", "Remplacer le filtre HEPA de sortie.", "Tester la pression de sortie.", "Vérifier le cycle de la vanne de pulsion."] },
                  { title: "Erreur Système (Surchauffe / Ventilation)", causes: ["Ventilation obstruée", "Ventilateur interne HS", "Environnement trop chaud", "Filtres internes encrassés"], solutionsPatient: ["Sortez l'appareil de sa sacoche.", "Vérifiez que les grilles sont libres.", "Laissez refroidir l'appareil 30 minutes.", "Éloignez l'appareil du soleil."], solutionsTech: ["Vérifier le ventilateur interne.", "Nettoyage interne à l'air sec.", "Contrôler la température de la turbine via le menu service."] },
                    { title: "Problème de détection respiratoire (Trigger)", causes: ["Respiration par la bouche", "Canule trop longue (> 2.1m)", "Sensibilité trigger basse", "Valve de pulsion bloquée"], solutionsPatient: ["Respirez bien par le nez.", "Utilisez une canule de 2 mètres maximum.", "Vérifiez le branchement du tuyau.", "Testez en mode continu."], solutionsTech: ["Recalibrer la sensibilité du trigger.", "Tester la valve pneumatique.", "Vérifier l'étanchéité du circuit."] },
                  { title: "Erreur Système (Code Fail 01, 02, 04...)", causes: ["Fail 01 (O2)", "Fail 02 (Pression)", "Fail 04 (Batterie)", "Défaut carte mère"], solutionsPatient: ["Retirez la batterie et débranchez le secteur 1 minute.", "Redémarrez l'appareil.", "Notez le numéro de Fail qui s'affiche."], solutionsTech: ["Identifier le composant via le code erreur.", "Tester les tensions de carte.", "Contrôler les capteurs internes."] },
                    { title: "Bruit anormal ou vibrations", causes: ["Compresseur fatigué", "Silentblocs usés", "Position instable", "Composant interne desserré"], solutionsPatient: ["L'appareil est-il bien à plat sur une surface stable ?", "Le bruit change-t-il si vous le déplacez ?", "Vérifiez qu'aucun objet ne vibre contre le boîtier."], solutionsTech: ["Vérifier les fixations moteur.", "Remplacer les silentblocs.", "Vérifier le ventilateur.", "Resserrer le châssis."] }
                ] },
                { id: "eclipse-5", name: "Eclipse 5", failures: [
                    { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Batterie vide", "Chargeur HS", "Connectique interne défaillante", "Carte mère HS"], solutionsPatient: ["Branchez l'appareil sur secteur.", "Le voyant du bloc d'alimentation est-il allumé ?", "Retirez la batterie et essayez sur secteur seul.", "Vérifiez que le câble n'est pas coupé."], solutionsTech: ["Tester la tension du chargeur (28V DC).", "Vérifier l'embase de charge.", "Vérifier les fusibles internes.", "Remplacer la carte mère."] },
                    { title: "Problème de batterie ou autonomie", causes: ["Autonomie < 10 %", "Batterie en fin de vie", "Défaut de communication batterie", "Surchauffe batterie"], solutionsPatient: ["Branchez sur secteur immédiatement.", "Retirez et remettez la batterie fermement.", "Laissez la batterie refroidir si elle est chaude.", "Vérifiez si l'icône batterie s'affiche."], solutionsTech: ["Vérifier la capacité de charge.", "Nettoyer les connecteurs batterie.", "Remplacer la batterie.", "Vérifier le circuit de charge sur la carte."] },
                    { title: "Problème d'alimentation (12V / Voiture)", causes: ["Cordon DC mal inséré", "Fusible allume-cigare grillé", "Prise voiture défectueuse", "Surchauffe du bloc DC"], solutionsPatient: ["Vérifiez que la prise est bien enfoncée dans l'allume-cigare.", "Vérifiez le voyant sur la prise.", "Dévissez l'embout pour vérifier le petit fusible.", "Essayez sur une autre prise 12V."], solutionsTech: ["Tester la continuité du câble DC.", "Vérifier le fusible du câble.", "Contrôler la tension de sortie sous charge."] },
                    { title: "Erreur Système (O2 Bas / Pureté)", causes: ["Saturation des tamis moléculaires", "Filtre d'entrée colmaté", "Fuite interne", "Humidité excessive"], solutionsPatient: ["Vérifiez que le filtre à poussière à l'arrière est propre.", "Placez l'appareil dans un endroit bien aéré.", "Assurez-vous de ne pas être trop près d'une source de vapeur.", "Aérez la pièce."], solutionsTech: ["Mesurer la pureté O2 avec un analyseur.", "Remplacer les colonnes de tamis.", "Vérifier la pression du compresseur.", "Contrôler l'étanchéité pneumatique."] },
                    { title: "Débit faible ou irrégulier", causes: ["Canule pliée ou écrasée", "Filtre HEPA bouché", "Vanne de sortie bloquée", "Bocal humidificateur fuyard"], solutionsPatient: ["Vérifiez que votre canule n'est pas pliée.", "Essayez avec une canule neuve.", "Si vous utilisez un humidificateur, vérifiez qu'il est bien fermé.", "Sentez-vous l'air sortir au bout ?"], solutionsTech: ["Vérifier le capteur de débit.", "Remplacer le filtre HEPA de sortie.", "Tester la pression de sortie.", "Vérifier le cycle de la vanne de pulsion."] },
                    { title: "Erreur Système (Message d'erreur)", causes: ["Ventilation obstruée", "Ventilateur interne HS", "Environnement trop chaud", "Filtres internes encrassés"], solutionsPatient: ["Sortez l'appareil de sa sacoche.", "Vérifiez que les grilles sont libres.", "Laissez refroidir l'appareil 30 minutes.", "Éloignez l'appareil du soleil."], solutionsTech: ["Vérifier le ventilateur interne.", "Nettoyage interne à l'air sec.", "Contrôler la température de la turbine via le menu service."] },
                    { title: "Problème de détection respiratoire (Trigger)", causes: ["Respiration par la bouche", "Canule trop longue (> 2.1m)", "Sensibilité trigger basse", "Valve de pulsion bloquée"], solutionsPatient: ["Respirez bien par le nez.", "Utilisez une canule de 2 mètres maximum.", "Vérifiez le branchement du tuyau.", "Testez en mode continu."], solutionsTech: ["Recalibrer la sensibilité du trigger.", "Tester la valve pneumatique.", "Vérifier l'étanchéité du circuit."] },
                    { title: "Erreur Système (Message d'erreur)", causes: ["Fail 01 (O2)", "Fail 02 (Pression)", "Fail 04 (Batterie)", "Défaut carte mère"], solutionsPatient: ["Retirez la batterie et débranchez le secteur 1 minute.", "Redémarrez l'appareil.", "Notez le numéro de Fail qui s'affiche."], solutionsTech: ["Identifier le composant via le code erreur.", "Tester les tensions de carte.", "Contrôler les capteurs internes."] },
                    { title: "Bruit anormal ou vibrations", causes: ["Compresseur fatigué", "Silentblocs usés", "Position instable", "Composant interne desserré"], solutionsPatient: ["L'appareil est-il bien à plat sur une surface stable ?", "Le bruit change-t-il si vous le déplacez ?", "Vérifiez qu'aucun objet ne vibre contre le boîtier."], solutionsTech: ["Vérifier les fixations moteur.", "Remplacer les silentblocs.", "Vérifier le ventilateur.", "Resserrer le châssis."] }
                ] },
          { id: "simplygo", name: "SimplyGo (Standard)", failures: [
                        { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Batterie vide", "Chargeur HS", "Connectique interne défaillante", "Carte mère HS"], solutionsPatient: ["Branchez l'appareil sur secteur.", "Le voyant du bloc d'alimentation est-il allumé ?", "Retirez la batterie et essayez sur secteur seul.", "Vérifiez que le câble n'est pas coupé."], solutionsTech: ["Tester la tension du chargeur (28V DC).", "Vérifier l'embase de charge.", "Vérifier les fusibles internes.", "Remplacer la carte mère."] },
                        { title: "Problème de batterie ou autonomie", causes: ["Autonomie < 10 %", "Batterie en fin de vie", "Défaut de communication batterie", "Surchauffe batterie"], solutionsPatient: ["Branchez sur secteur immédiatement.", "Retirez et remettez la batterie fermement.", "Laissez la batterie refroidir si elle est chaude.", "Vérifiez si l'icône batterie s'affiche."], solutionsTech: ["Vérifier la capacité de charge.", "Nettoyer les connecteurs batterie.", "Remplacer la batterie.", "Vérifier le circuit de charge sur la carte."] },
                        { title: "Problème d'alimentation (12V / Voiture)", causes: ["Cordon DC mal inséré", "Fusible allume-cigare grillé", "Prise voiture défectueuse", "Surchauffe du bloc DC"], solutionsPatient: ["Vérifiez que la prise est bien enfoncée dans l'allume-cigare.", "Vérifiez le voyant sur la prise.", "Dévissez l'embout pour vérifier le petit fusible.", "Essayez sur une autre prise 12V."], solutionsTech: ["Tester la continuité du câble DC.", "Vérifier le fusible du câble.", "Contrôler la tension de sortie sous charge."] },
                        { title: "Erreur Système (O2 Bas / Pureté)", causes: ["Saturation des tamis moléculaires", "Filtre d'entrée colmaté", "Fuite interne", "Humidité excessive"], solutionsPatient: ["Vérifiez que le filtre à poussière à l'arrière est propre.", "Placez l'appareil dans un endroit bien aéré.", "Assurez-vous de ne pas être trop près d'une source de vapeur.", "Aérez la pièce."], solutionsTech: ["Mesurer la pureté O2 avec un analyseur.", "Remplacer les colonnes de tamis.", "Vérifier la pression du compresseur.", "Contrôler l'étanchéité pneumatique."] },
                        { title: "Débit faible ou irrégulier", causes: ["Canule pliée ou écrasée", "Filtre HEPA bouché", "Vanne de sortie bloquée", "Bocal humidificateur fuyard"], solutionsPatient: ["Vérifiez que votre canule n'est pas pliée.", "Essayez avec une canule neuve.", "Si vous utilisez un humidificateur, vérifiez qu'it est bien fermé.", "Sentez-vous l'air sortir au bout ?"], solutionsTech: ["Vérifier le capteur de débit.", "Remplacer le filtre HEPA de sortie.", "Tester la pression de sortie.", "Vérifier le cycle de la vanne de pulsion."] },
                        { title: "Erreur Système (Surchauffe / Ventilation)", causes: ["Ventilation obstruée", "Ventilateur interne HS", "Environnement trop chaud", "Filtres internes encrassés"], solutionsPatient: ["Sortez l'appareil de sa sacoche.", "Vérifiez que les grilles sont libres.", "Laissez refroidir l'appareil 30 minutes.", "Éloignez l'appareil du soleil."], solutionsTech: ["Vérifier le ventilateur interne.", "Nettoyage interne à l'air sec.", "Contrôler la température de la turbine via le menu service."] },
                        { title: "Problème de détection respiratoire (Trigger)", causes: ["Respiration par la bouche", "Canule trop longue (> 2.1m)", "Sensibilité trigger basse", "Valve de pulsion bloquée"], solutionsPatient: ["Respirez bien par le nez.", "Utilisez une canule de 2 mètres maximum.", "Vérifiez le branchement du tuyau.", "Testez on mode continu."], solutionsTech: ["Recalibrer la sensibilité du trigger.", "Tester la valve pneumatique.", "Vérifier l'étanchéité du circuit."] },
                        { title: "Erreur Système (Code Fail 01, 02, 04...)", causes: ["Fail 01 (O2)", "Fail 02 (Pression)", "Fail 04 (Batterie)", "Défaut carte mère"], solutionsPatient: ["Retirez la batterie et débranchez le secteur 1 minute.", "Redémarrez l'appareil.", "Notez le numéro de Fail qui s'affiche."], solutionsTech: ["Identifier le composant via le code erreur.", "Tester les tensions de carte.", "Contrôler les capteurs internes."] },
                        { title: "Bruit anormal ou vibrations", causes: ["Compresseur fatigué", "Silentblocs usés", "Position instable", "Composant interne desserré"], solutionsPatient: ["L'appareil est-il bien à plat sur une surface stable ?", "Le bruit change-t-il si vous le déplacez ?", "Vérifiez qu'aucun objet ne vibre contre le boîtier."], solutionsTech: ["Vérifier les fixations moteur.", "Remplacer les silentblocs.", "Vérifier le ventilateur.", "Resserrer le châssis."] }
          ] },
          { id: "zen-o-transp", name: "Zen-O", failures: [
                        { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Batterie vide", "Chargeur HS", "Connectique interne défaillante", "Carte mère HS"], solutionsPatient: ["Branchez l'appareil sur secteur.", "Le voyant du bloc d'alimentation est-il allumé ?", "Retirez la batterie et essayez sur secteur seul.", "Vérifiez que le câble n'est pas coupé."], solutionsTech: ["Tester la tension du chargeur (28V DC).", "Vérifier l'embase de charge.", "Vérifier les fusibles internes.", "Remplacer la carte mère."] },
                        { title: "Problème de batterie ou autonomie", causes: ["Autonomie < 10 %", "Batterie en fin de vie", "Défaut de communication batterie", "Surchauffe batterie"], solutionsPatient: ["Branchez sur secteur immédiatement.", "Retirez et remettez la batterie fermement.", "Laissez la batterie refroidir si elle est chaude.", "Vérifiez si l'icône batterie s'affiche."], solutionsTech: ["Vérifier la capacité de charge.", "Nettoyer les connecteurs batterie.", "Remplacer la batterie.", "Vérifier le circuit de charge sur la carte."] },
                        { title: "Problème d'alimentation (12V / Voiture)", causes: ["Cordon DC mal inséré", "Fusible allume-cigare grillé", "Prise voiture défectueuse", "Surchauffe du bloc DC"], solutionsPatient: ["Vérifiez que la prise est bien enfoncée dans l'allume-cigare.", "Vérifiez le voyant sur la prise.", "Dévissez l'embout pour vérifier le petit fusible.", "Essayez sur une autre prise 12V."], solutionsTech: ["Tester la continuité du câble DC.", "Vérifier le fusible du câble.", "Contrôler la tension de sortie sous charge."] },
                        { title: "Erreur Système (O2 Bas / Pureté)", causes: ["Saturation des tamis moléculaires", "Filtre d'entrée colmaté", "Fuite interne", "Humidité excessive"], solutionsPatient: ["Vérifiez que le filtre à poussière à l'arrière est propre.", "Placez l'appareil dans un endroit bien aéré.", "Assurez-vous de ne pas être trop près d'une source de vapeur.", "Aérez la pièce."], solutionsTech: ["Mesurer la pureté O2 avec un analyseur.", "Remplacer les colonnes de tamis.", "Vérifier la pression du compresseur.", "Contrôler l'étanchéité pneumatique."] },
                        { title: "Débit faible ou irrégulier", causes: ["Canule pliée ou écrasée", "Filtre HEPA bouché", "Vanne de sortie bloquée", "Bocal humidificateur fuyard"], solutionsPatient: ["Vérifiez que votre canule n'est pas pliée.", "Essayez avec une canule neuve.", "Si vous utilisez un humidificateur, vérifiez qu'il est bien fermé.", "Sentez-vous l'air sortir au bout ?"], solutionsTech: ["Vérifier le capteur de débit.", "Remplacer le filtre HEPA de sortie.", "Tester la pression de sortie.", "Vérifier le cycle de la vanne de pulsion."] },
                        { title: "Erreur Système (Surchauffe / Ventilation)", causes: ["Ventilation obstruée", "Ventilateur interne HS", "Environnement trop chaud", "Filtres internes encrassés"], solutionsPatient: ["Sortez l'appareil de sa sacoche.", "Vérifiez que les grilles sont libres.", "Laissez refroidir l'appareil 30 minutes.", "Éloignez l'appareil du soleil."], solutionsTech: ["Vérifier le ventilateur interne.", "Nettoyage interne à l'air sec.", "Contrôler la température de la turbine via le menu service."] },
                        { title: "Problème de détection respiratoire (Trigger)", causes: ["Respiration par la bouche", "Canule trop longue (> 2.1m)", "Sensibilité trigger basse", "Valve de pulsion bloquée"], solutionsPatient: ["Respirez bien par le nez.", "Utilisez une canule de 2 mètres maximum.", "Vérifiez le branchement du tuyau.", "Testez on mode continu."], solutionsTech: ["Recalibrer la sensibilité du trigger.", "Tester la valve pneumatique.", "Vérifier l'étanchéité du circuit."] },
                        { title: "Erreur Système (Code Fail 01, 02, 04...)", causes: ["Fail 01 (O2)", "Fail 02 (Pression)", "Fail 04 (Batterie)", "Défaut carte mère"], solutionsPatient: ["Retirez la batterie et débranchez le secteur 1 minute.", "Redémarrez l'appareil.", "Notez le numéro de Fail qui s'affiche."], solutionsTech: ["Identifier le composant via le code erreur.", "Tester les tensions de carte.", "Contrôler les capteurs internes."] },
                        { title: "Bruit anormal ou vibrations", causes: ["Compresseur fatigué", "Silentblocs usés", "Position instable", "Composant interne desserré"], solutionsPatient: ["L'appareil est-il bien à plat sur une surface stable ?", "Le bruit change-t-il si vous le déplacez ?", "Vérifiez qu'aucun objet ne vibre contre le boîtier."], solutionsTech: ["Vérifier les fixations moteur.", "Remplacer les silentblocs.", "Vérifier le ventilateur.", "Resserrer le châssis."] }
          ] },
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
// Les types qui nécessitent une sélection de marque
const typesWithBrandsStep = ['vni', 'aspiration', 'vaa'];

// Composant Carte Simple déplacé à l'extérieur
const SelectionCard = ({ label, image, onClick, onDelete }) => (
  <div 
    className="card"
    onClick={onClick}
  >
    {onDelete && (
      <button 
        className="del-btn"
        onClick={(e) => { e.stopPropagation(); onDelete(); }} // Empêche le clic sur la carte parente
      >
        ×
      </button>
    )}
    {/* Affichage du logo s'il existe */}
    {image && (
      <img src={image} alt={label} className="card-img" />
    )}
    <div style={{ fontSize: "18px", fontWeight: "bold", color: "#0f172a" }}>{label}</div>
  </div>
);

export default function LibraryPage() {
  // Enveloppez le contenu de LibraryPage avec ErrorBoundary
  const navigate = useNavigate();
  const [data, setData] = useState([]); // Initialement vide, sera rempli par Firebase
  const [selectedType, setSelectedType] = useState(null);
  const [history, setHistory] = useState([]);

  // 1. Écouteur pour la BIBLIOTHÈQUE
  useEffect(() => {
    const q = query(collection(db, "library"), orderBy("name", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const libraryData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setData(libraryData);
    });
    return () => unsubscribe();
  }, []);

  // 2. Écouteur pour l'HISTORIQUE
  useEffect(() => {
    const q = query(collection(db, "history"), orderBy("id", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const historyData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        docId: doc.id,
      }));
      setHistory(historyData);
    });
    return () => unsubscribe();
  }, []);

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
    const normalize = (str) => str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
    const lowerQuery = normalize(query);
    const results = [];

    const traverse = (items, path = "", topType = null, parentMatched = false) => {
      items.forEach(item => {
        const currentPath = path ? `${path} > ${item.name}` : item.name;
        const currentTopType = topType || item;
        const itemMatch = parentMatched || normalize(item.name).includes(lowerQuery);

        // Recherche dans les modèles directs
        if (item.models) {
          item.models.forEach(m => {
            if (normalize(m.name).includes(lowerQuery) || itemMatch) {
              results.push({ model: m, type: currentTopType, path: `${currentPath} > ${m.name}` });
            }
          });
        }
        // Recherche dans les marques
        if (item.brands) {
          item.brands.forEach(b => {
            const brandMatch = itemMatch || normalize(b.name).includes(lowerQuery);
            if (b.models) b.models.forEach(m => {
              if (normalize(m.name).includes(lowerQuery) || brandMatch) {
                results.push({ model: m, type: currentTopType, brand: b, path: `${currentPath} > ${b.name} > ${m.name}` });
              }
            });
          });
        }
        if (item.subTypes) traverse(item.subTypes, currentPath, currentTopType, itemMatch);
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

  // Fonction pour copier les données locales vers Firebase au premier lancement
  const seedDatabase = async () => {
    if (window.confirm("Transférer les données locales vers Firebase ?")) {
      try {
        for (const category of LIBRARY_DATA) {
          await addDoc(collection(db, "library"), category);
        }
        alert("Données initialisées avec succès !");
      } catch (e) {
        console.error(e);
        alert("Erreur lors de l'initialisation.");
      }
    }
  };

  const handleSelectFailure = (failure) => {
    setSelectedFailure(failure);
    setView('library');
    setCurrentStep(0);
    setShowTech(false);
  };

  const addItem = async () => {
    if (!selectedType) {
      const name = prompt("Nom de la nouvelle catégorie :");
      if (name) {
        await addDoc(collection(db, "library"), { name, models: [], subTypes: [] });
      }
    } else if (selectedType && typesWithBrandsStep.includes(selectedType.id) && !selectedBrand) {
      const name = prompt(`Nouvelle marque pour ${selectedType.name} :`);
      if (name) {
        const categoryRef = doc(db, "library", selectedType.id);
        const updatedBrands = [...(selectedType.brands || []), { 
          id: Date.now().toString(), 
          name, 
          models: [] 
        }];
        await updateDoc(categoryRef, { brands: updatedBrands });
      }
    } else if (selectedType && !selectedModel) {
      const name = prompt(`Nouveau modèle pour ${selectedType.name} :`);
      if (name) {
        const categoryRef = doc(db, "library", selectedType.id);
        const newModel = { id: Date.now().toString(), name, failures: [] };
        
        if (selectedBrand) {
          const updatedBrands = selectedType.brands.map((b) => 
            b.id === selectedBrand.id ? { ...b, models: [...(b.models || []), newModel] } : b
          );
          await updateDoc(categoryRef, { brands: updatedBrands });
        } else {
          const updatedModels = [...(selectedType.models || []), newModel];
          await updateDoc(categoryRef, { models: updatedModels });
        }
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

      const categoryRef = doc(db, "library", selectedType.id);
      // On met à jour l'arborescence dans Firestore
      let updatedModels;
      if (selectedBrand) {
        const updatedBrands = selectedType.brands.map(b => {
          if (b.id === selectedBrand.id) {
            return { ...b, models: b.models.map(m => m.id === selectedModel.id ? { ...m, failures: [...m.failures, newFailure] } : m) };
          }
          return b;
        });
        await updateDoc(categoryRef, { brands: updatedBrands });
      } else {
        updatedModels = selectedType.models.map(m => 
          m.id === selectedModel.id ? { ...m, failures: [...m.failures, newFailure] } : m
        );
        await updateDoc(categoryRef, { models: updatedModels });
      }
      alert("Panne ajoutée et synchronisée sur tous les appareils.");
    }
  };

  const removeItem = async (type, id, index) => {
    if (!window.confirm("Supprimer cet élément ?")) return;

    if (type === 'category') {
      await deleteDoc(doc(db, "library", id));
      resetType();
    } else if (type === 'model') {
      const categoryRef = doc(db, "library", selectedType.id);
      if (selectedBrand) {
        const updatedBrands = selectedType.brands.map(b => 
          b.id === selectedBrand.id ? { ...b, models: b.models.filter(m => m.id !== id) } : b
        );
        await updateDoc(categoryRef, { brands: updatedBrands });
      } else {
        const updatedModels = selectedType.models.filter(m => m.id !== id);
        await updateDoc(categoryRef, { models: updatedModels });
      }
      resetModel();
    } else if (type === 'failure') {
      const categoryRef = doc(db, "library", selectedType.id);
      const updatedModels = (selectedBrand ? selectedBrand.models : selectedType.models).map(m => {
        if (m.id === selectedModel.id) {
          return { ...m, failures: m.failures.filter((_, i) => i !== index) };
        }
        return m;
      });
      if (selectedBrand) {
        const updatedBrands = selectedType.brands.map(b => b.id === selectedBrand.id ? { ...b, models: updatedModels } : b);
        await updateDoc(categoryRef, { brands: updatedBrands });
      } else {
        await updateDoc(categoryRef, { models: updatedModels });
      }
      setSelectedFailure(null);
    }
  };

  const logIntervention = async (status) => {
    const otherCause = document.getElementById('cause-other-input')?.value;
    const entry = {
      id: Date.now(),
      date: new Date().toLocaleString('fr-FR'),
      device: `${selectedType?.name}${selectedBrand ? ` (${selectedBrand.name})` : ''} > ${selectedModel?.name}`,
      failure: selectedFailure?.title,
      status: status, // 'Succès' ou 'Échec'
      comment: otherCause || '',
      // Enregistrement des détails pour l'export complet
      causes: selectedFailure?.causes || [],
      solutionsPatient: selectedFailure?.solutionsPatient || [],
      solutionsTech: selectedFailure?.solutionsTech || []
    };

    try {
      await addDoc(collection(db, "history"), entry);
      resetToModel();
    } catch (error) {
      console.error("Erreur d'ajout Firebase:", error);
      alert("Impossible de sauvegarder dans Firebase. Vérifiez vos règles de sécurité.");
    }
  };

  const clearHistory = () => {
    alert("La suppression groupée doit être faite via la console Firebase pour plus de sécurité.");
  };

  const removeHistoryItem = async (docId) => {
    if (!window.confirm("Supprimer cet élément de Firebase ?")) return;
    try {
      await deleteDoc(doc(db, "history", docId));
    } catch (error) {
      console.error("Erreur suppression Firebase:", error);
    }
  };

  const nextStep = () => setCurrentStep(s => s + 1);

  // Helper pour décider si on affiche le nom du type entre parenthèses
  const shouldHideNameInTitle = (name) => 
    !name || ["concentrateur", "fixe", "portable", "transportable"].some(term => name.toLowerCase().includes(term));

  const downloadHistoryExcel = () => {
    if (typeof XLSX === 'undefined') {
      alert("La librairie Excel n'est pas chargée.");
      return;
    }
    if (history.length === 0) return alert("Le journal est vide.");

    const worksheetData = history.map(item => ({
      Date: item.date,
      Appareil: item.device,
      "Problème": item.failure,
      "Causes": (item.causes || []).join(', '),
      "Solutions Patient": (item.solutionsPatient || []).join(', '),
      "Actions Technicien": (item.solutionsTech || []).join(', '),
      Statut: item.status,
      Notes: item.comment || '-'
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Interventions");

    XLSX.writeFile(workbook, "journal.xlsx");
  };

  return ( // Le composant ErrorBoundary est ajouté ici
    <ErrorBoundary showDetails={process.env.NODE_ENV === 'development'}>
    <div className="container">
        {/* Header */}
        <div className="header">
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
          {/* Bouton d'initialisation Cloud si vide */}
          {data.length === 0 && (
            <button onClick={seedDatabase} style={{ marginLeft: '20px', background: '#f59e0b', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
              ☁️ Initialiser Cloud
            </button>
          )}
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
            <div className="header" style={{ marginBottom: '20px', paddingBottom: '0', borderBottom: 'none', boxShadow: 'none', border: 'none' }}>
              <h2 style={{ fontSize: "24px", margin: 0 }}>Journal des Interventions</h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className="header-btn primary"
                  onClick={downloadHistoryExcel}
                >
                  📥 Télécharger Excel
                </button>
                <button className="header-btn" style={{ border: "1px solid #ef4444", color: "#ef4444" }} onClick={clearHistory}>
                  Vider le journal
                </button>
              </div>
            </div>
            {history.length === 0 ? <p style={{ color: "#64748b", fontStyle: "italic" }}>Aucune intervention enregistrée.</p> : (
              <table className="history-table">
                <thead>
                    <tr>
                      <th>Date</th>
                      <th>Appareil</th>
                      <th>Problème</th>
                      <th>Statut</th>
                      <th>Notes</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map(item => <tr key={item.docId}>
                        <td>{item.date}</td>
                        <td>{item.device}</td>
                        <td>{item.failure}</td>
                        <td>
                          <span className={`status-badge ${item.status === 'Succès' ? 'status-success' : 'status-fail'}`}>
                            {item.status}
                          </span>
                        </td>
                        <td style={{ color: '#64748b', fontStyle: 'italic' }}>{item.comment || "-"}</td>
                        <td><button className="delete-btn" onClick={() => removeHistoryItem(item.docId)} style={{ position: 'static', opacity: 1, background: 'none', border: 'none', color: '#ef4444', fontSize: '18px', fontWeight: 'bold', width: 'auto', height: 'auto' }}>×</button></td>
                      </tr>
                    )}
                  </tbody>
              </table>
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
                  className="card"
                  style={{ textAlign: 'left', alignItems: 'flex-start', padding: '16px', minHeight: 'unset' }}
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
                <div className="card-grid">
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
              <div className="card-grid">
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
              {typesWithBrandsStep.includes(selectedType.id) && selectedType.brands ? (
                <>
                  <h2 style={{ marginBottom: "20px", fontSize: "24px" }}>Marque de l'appareil {!shouldHideNameInTitle(selectedType.name) ? `(${selectedType.name})` : ""}</h2>
                  <div className="card-grid">
                    {selectedType.brands?.map((brand) => (
                      <SelectionCard 
                        key={brand.id} 
                        label={brand.name} 
                        image={brand.logo}
                        onClick={() => setSelectedBrand(brand)} 
                        onDelete={() => removeItem('brand', brand.id)}
                      />
                    ))}
                    {selectedType.brands?.length === 0 && <p>Aucune marque répertoriée pour ce type d'équipement.</p>}
                  </div>
                </>
              ) : (
                <>
                  <h2 style={{ marginBottom: "20px", fontSize: "24px" }}>Modèle {!shouldHideNameInTitle(selectedType.name) ? `(${selectedType.name})` : ""}</h2>
                  <div className="card-grid">
                    {/* Supporte à la fois la structure 'models' directe et l'ancienne structure 'brands' aplatie */}
                    {(selectedType.models || selectedType.subTypes || selectedType.brands?.flatMap(brand => brand.models || []) || []).map((item) => (
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
              <div className="card-grid">
                {selectedBrand.models?.map((model) => (
                  <SelectionCard 
                    key={model.id} 
                    label={model.name} 
                    onClick={() => setSelectedModel(model)} 
                    onDelete={() => removeItem('model', model.id)}
                  />
                ))}
                {selectedBrand.models?.length === 0 && <p>Aucun modèle répertorié.</p>}
              </div>
            </>
          )}

          {selectedModel && !selectedFailure && (
            <>
              <h2 style={{ marginBottom: "20px", fontSize: "24px" }}>Problème rencontré sur {selectedModel.name}</h2>
              {selectedModel.failures.length === 0 ? (
                <p style={{ color: "#64748b", fontStyle: "italic" }}>Aucune panne connue enregistrée pour ce modèle.</p>
              ) : (
                <div className="card-grid">
                  {selectedModel.failures?.map((failure, index) => (
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
                      className="header-btn" style={{ opacity: hasPrev ? 1 : 0.5 }}
                      title="Problème précédent"
                    >
                      ←
                    </button>
                    <button 
                      disabled={!hasNext}
                      onClick={() => handleSelectFailure(selectedModel.failures[failureIndex + 1])}
                      className="header-btn" style={{ opacity: hasNext ? 1 : 0.5 }}
                      title="Problème suivant"
                    >
                      →
                    </button>
                  </div>
                </div>

                <div className="failure-grid">
                  <div className="box-cause">
                    <strong style={{ color: "#991b1b", display: "block", marginBottom: "12px" }}>📋 Causes probables</strong>
                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                      {(Array.isArray(selectedFailure.causes) ? selectedFailure.causes : [selectedFailure.causes || "Inconnue"]).map((c, i) => (
                        <li key={i} style={{ marginBottom: '8px', color: '#7f1d1d' }}>{c}</li>
                      ))}
                    </ul>
                    <div style={{marginTop:'12px', borderTop:'1px dashed #fca5a5', paddingTop:'12px'}}>
                      <label style={{fontSize:'13px', fontWeight:600}}>Autre cause :</label>
                      <input type="text" id="cause-other-input" className="form-input" style={{borderColor: '#fca5a5'}} />
                    </div>
                  </div>

                  <div className="box-solution">
                    {isPatientStep && (
                      <div className="step-card">
                        <span className="step-number">Étape Patient {currentStep + 1} / {totalPatientSteps}</span>
                        <p className="step-instruction">{patientSteps[currentStep]}</p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                          <button className="resolve-btn" onClick={() => logIntervention('Succès')}>✅ Résolu</button>
                          <button className="header-btn" onClick={nextStep}>Suivant</button>
                        </div>
                      </div>
                    )}

                    {isTechTransition && (
                      <div className="step-card">
                        <p style={{ color: "#b45309", fontWeight: 700 }}>⚠️ Échec des solutions patient.</p>
                        <p className="step-instruction" style={{ fontSize: '16px', margin: '15px 0', color: '#b45309' }}>Passer aux étapes technicien ?</p>
                        <button className="header-btn" style={{ background: "#f59e0b", color: "white", border: 'none' }} onClick={() => setShowTech(true)}>🛠️ Mode Technicien</button>
                      </div>
                    )}

                    {isTechStep && (
                      <div className="step-card">
                        <span className="step-number" style={{color:'#d97706'}}>Action Technicien {currentStep - totalPatientSteps + 1} / {techSteps.length}</span>
                        <p className="step-instruction">{techSteps[currentStep - totalPatientSteps]}</p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                          <button className="resolve-btn" onClick={() => logIntervention('Succès')}>✅ Corrigé</button>
                          <button className="header-btn" onClick={nextStep}>Suivant</button>
                        </div>
                      </div>
                    )}

                    {isEndOfGuide && (
                      <div className="step-card">
                        <p className="step-instruction" style={{ color: "#ef4444" }}>❌ Impossible de résoudre</p>
                        <p style={{ marginBottom: '20px', color: '#475569' }}>Toutes les solutions ont été tentées. Contactez le support Niveau 2.</p>
                        <button className="fail-btn" onClick={() => logIntervention('Échec')}>Terminer</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  </ErrorBoundary>
  );
}}