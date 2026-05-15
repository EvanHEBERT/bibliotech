export const INITIAL_LIBRARY_DATA = [
  {
    id: "aerosol",
    name: "Aérosol",
    models: [
      { id: "airforce-max", name: "Airforce Max", failures: [
          { title: "Problème d'alimentation", causes: ["Cordon déconnecté", "Prise murale défectueuse", "Fusible interne"], solutionsPatient: ["Prise bien branchée ?", "Essayer une autre prise ?", "Bouton sur 'I' ?"], solutionsTech: ["Tester continuité cordon.", "Vérifier interrupteur.", "Contrôler carte."] },
          { title: "Débit faible ou irrégulier", causes: ["Kit bouché", "Filtre sale", "Compresseur"], solutionsPatient: ["Nettoyer buse du kit ?", "Tuyau plié ?", "Filtre propre ?"], solutionsTech: ["Vérifier pression.", "Remplacer kit piston.", "Vérifier fuites."] }
      ] },
      { id: "innospire-elegance", name: "Innospire Elegance", failures: [
          { title: "Problème d'alimentation", causes: ["Cordon déconnecté", "Prise défectueuse"], solutionsPatient: ["Vérifier branchements", "Autre prise ?"], solutionsTech: ["Tester cordon", "Vérifier interrupteur"] },
          { title: "Débit faible", causes: ["Kit bouché", "Filtre sale"], solutionsPatient: ["Nettoyer kit", "Vérifier tuyau"], solutionsTech: ["Pression sortie", "Kit membrane"] }
      ] }
    ]
  },
  {
    id: "vni",
    name: "VNI",
    subTypes: [
      {
        id: "niv-i",
        name: "NIV I",
        brands: [
          {
            id: "lowenstein",
            name: "Löwenstein",
            models: [
              {
                id: "prismaline",
                name: "prismaLine",
                failures: [
                  { title: "Alimentation", causes: ["Cordon", "Bloc défectueux"], solutionsPatient: ["Vérifier branchement", "Inspecter câble"], solutionsTech: ["Mesurer tension bloc", "Vérifier fusible"] }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "vaa",
    name: "Ventilation Assistée (VAA)",
    brands: [
      {
        id: "resmed",
        name: "ResMed",
        models: [
          {
            id: "aircurve-10-cs",
            name: "AirCurve 10 CS",
            failures: [
              { title: "Fuites importantes", causes: ["Humidificateur mal mis", "Joint abîmé"], solutionsPatient: ["Bac bien cliqué ?", "Joint propre ?"], solutionsTech: ["Remplacer joint", "Vérifier coude"] }
            ]
          }
        ]
      }
    ],
    models: [
      { id: "evita-v300", name: "Evita V300", failures: [] }
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
          { id: "1025ks", name: "10L", failures: [{ title: "Alarme O2", causes: ["Tamis usés"], solutionsPatient: ["Aérer la pièce"], solutionsTech: ["Mesurer pureté"] }] }
        ]
      }
    ]
  },
  {
    id: "concentrateur",
    name: "Concentrateur",
    subTypes: [
      {
        id: "transportable",
        name: "Transportable",
        models: [
          { id: "eclipse-3", name: "Eclipse 3", failures: [
              { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Batterie vide", "Chargeur HS", "Connectique interne défaillante", "Carte mère HS", "Cordon DC mal inséré", "Fusible allume-cigare grillé", "Prise voiture défectueuse", "Surchauffe du bloc DC"], solutionsPatient: ["Branchez l'appareil sur secteur.", "Le voyant du bloc d'alimentation est-il allumé ?", "Retirez la batterie et essayez sur secteur seul.", "Vérifiez que le câble n'est pas coupé.", "Vérifiez que la prise est bien enfoncée dans l'allume-cigare.", "Vérifiez le voyant sur la prise.", "Dévissez l'embout pour vérifier le petit fusible.", "Essayez sur une autre prise 12V."], solutionsTech: ["Tester la tension du chargeur (28V DC).", "Vérifier l'embase de charge.", "Vérifier les fusibles internes.", "Remplacer la carte mère.", "Tester la continuité du câble DC.", "Vérifier le fusible du câble.", "Contrôler la tension de sortie sous charge."] },
              { title: "Problème de batterie ou autonomie", causes: ["Autonomie < 10 %", "Batterie en fin de vie", "Défaut de communication batterie", "Surchauffe batterie"], solutionsPatient: ["Branchez sur secteur immédiatement.", "Retirez et remettez la batterie fermement.", "Laissez la batterie refroidir si elle est chaude.", "Vérifiez si l'icône batterie s'affiche."], solutionsTech: ["Vérifier la capacité de charge.", "Nettoyer les connecteurs batterie.", "Remplacer la batterie.", "Vérifier le circuit de charge sur la carte."] },
              { title: "Débit faible ou irrégulier", causes: ["Canule pliée ou écrasée", "Filtre HEPA bouché", "Vanne de sortie bloquée", "Bocal humidificateur fuyard"], solutionsPatient: ["Vérifiez que votre canule n'est pas pliée.", "Essayez avec une canule neuve.", "Si vous utilisez un humidificateur, vérifiez qu'il est bien fermé.", "Sentez-vous l'air sortir au bout ?"], solutionsTech: ["Vérifier le capteur de débit.", "Remplacer le filtre HEPA de sortie.", "Tester la pression de sortie.", "Vérifier le cycle de la vanne de pulsion."] },
              { title: "Problème de détection respiratoire (Trigger)", causes: ["Respiration par la bouche", "Canule trop longue (> 2.1m)", "Sensibilité trigger basse", "Valve de pulsion bloquée"], solutionsPatient: ["Respirez bien par le nez.", "Utilisez une canule de 2 mètres maximum.", "Vérifiez le branchement du tuyau.", "Testez en mode continu."], solutionsTech: ["Recalibrer la sensibilité du trigger.", "Tester la valve pneumatique.", "Vérifier l'étanchéité du circuit."] },
              { title: "Fuites importantes (Masque ou Circuit)", causes: ["Tuyau débranché", "Joint vanne usé", "Membrane compresseur fendue"], solutionsPatient: ["Entendez-u un sifflement venant de l'intérieur ?", "Le bruit s'arrête-t-il si vous bouchez la sortie ?"], solutionsTech: ["Recherche de fuite interne.", "Remplacer la tubulure défectueuse.", "Vérifier le compresseur."] },
              { title: "Erreur Système (Message d'erreur)", causes: ["Saturation des tamis moléculaires", "Filtre d'entrée colmaté", "Fuite interne", "Humidité excessive", "Ventilation obstruée", "Ventilateur interne HS", "Environnement trop chaud", "Filtres internes encrassés", "Fail 01 (O2)", "Fail 02 (Pression)", "Fail 04 (Batterie)", "Défaut carte mère"], solutionsPatient: ["Vérifiez que le filtre à poussière à l'arrière est propre.", "Placez l'appareil dans un endroit bien aéré.", "Assurez-u de ne pas être trop près d'une source de vapeur.", "Aérez la pièce.", "Sortez l'appareil de sa sacoche.", "Vérifiez que les grilles sont libres.", "Laissez refroidir l'appareil 30 minutes.", "Éloignez l'appareil du soleil.", "Retirez la batterie et débranchez le secteur 1 minute.", "Redémarrez l'appareil.", "Notez le numéro de Fail qui s'affiche."], solutionsTech: ["Mesurer la pureté O2 avec un analyseur.", "Remplacer les colonnes de tamis.", "Vérifier la pression du compresseur.", "Contrôler l'étanchéité pneumatique.", "Vérifier le ventilateur interne.", "Nettoyage interne à l'air sec.", "Contrôler la température de la turbine via le menu service.", "Identifier le composant via le code erreur.", "Tester les tensions de carte.", "Contrôler les capteurs internes."] }
          ] },
          { id: "eclipse-5", name: "Eclipse 5", failures: [
              { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Batterie vide", "Chargeur HS", "Connectique interne défaillante", "Carte mère HS", "Cordon DC mal inséré", "Fusible allume-cigare grillé", "Prise voiture défectueuse", "Surchauffe du bloc DC"], solutionsPatient: ["Branchez l'appareil sur secteur.", "Le voyant du bloc d'alimentation est-il allumé ?", "Retirez la batterie et essayez sur secteur seul.", "Vérifiez que le câble n'est pas coupé.", "Vérifiez que la prise est bien enfoncée dans l'allume-cigare.", "Vérifiez le voyant sur la prise.", "Dévissez l'embout pour vérifier le petit fusible.", "Essayez sur une autre prise 12V."], solutionsTech: ["Tester la tension du chargeur (28V DC).", "Vérifier l'embase de charge.", "Vérifier les fusibles internes.", "Remplacer la carte mère.", "Tester la continuity du câble DC.", "Vérifier le fusible du câble.", "Contrôler la tension de sortie sous charge."] },
              { title: "Problème de batterie ou autonomie", causes: ["Autonomie < 10 %", "Batterie en fin de vie", "Défaut de communication batterie", "Surchauffe batterie"], solutionsPatient: ["Branchez sur secteur immédiatement.", "Retirez et remettez la batterie fermement.", "Laissez la batterie refroidir si elle est chaude.", "Vérifiez si l'icône batterie s'affiche."], solutionsTech: ["Vérifier la capacité de charge.", "Nettoyer les connecteurs batterie.", "Remplacer la batterie.", "Vérifier le circuit de charge sur la carte."] },
              { title: "Débit faible ou irrégulier", causes: ["Canule pliée ou écrasée", "Filtre HEPA bouché", "Vanne de sortie bloquée", "Bocal humidificateur fuyard"], solutionsPatient: ["Vérifiez que votre canule n'est pas pliée.", "Essayez avec une canule neuve.", "Si vous utilisez un humidificateur, vérifiez qu'il est bien fermé.", "Sentez-vous l'air sortir au bout ?"], solutionsTech: ["Vérifier le capteur de débit.", "Remplacer le filtre HEPA de sortie.", "Tester la pression de sortie.", "Vérifier le cycle de la vanne de pulsion."] },
              { title: "Problème de détection respiratoire (Trigger)", causes: ["Respiration par la bouche", "Canule trop longue (> 2.1m)", "Sensibilité trigger basse", "Valve de pulsion bloquée"], solutionsPatient: ["Respirez bien par le nez.", "Utilisez une canule de 2 mètres maximum.", "Vérifiez le branchement du tuyau.", "Testez en mode continu."], solutionsTech: ["Recalibrer la sensibilité du trigger.", "Tester la valve pneumatique.", "Vérifier l'étanchéité du circuit."] },
              { title: "Fuites importantes (Masque ou Circuit)", causes: ["Tuyau débranché", "Joint vanne usé", "Membrane compresseur fendue"], solutionsPatient: ["Entendez-u un sifflement venant de l'intérieur ?", "Le bruit s'arrête-t-il si vous bouchez la sortie ?"], solutionsTech: ["Recherche de fuite interne.", "Remplacer la tubulure défectueuse.", "Vérifier le compresseur."] },
              { title: "Erreur Système (Message d'erreur)", causes: ["Saturation des tamis moléculaires", "Filtre d'entrée colmaté", "Fuite interne", "Humidité excessive", "Ventilation obstruée", "Ventilateur interne HS", "Environnement trop chaud", "Filtres internes encrassés", "Fail 01 (O2)", "Fail 02 (Pression)", "Fail 04 (Batterie)", "Défaut carte mère"], solutionsPatient: ["Vérifiez que le filtre à poussière à l'arrière est propre.", "Placez l'appareil dans un endroit bien aéré.", "Assurez-u de ne pas être trop près d'une source de vapeur.", "Aérez la pièce.", "Sortez l'appareil de sa sacoche.", "Vérifiez que les grilles sont libres.", "Laissez refroidir l'appareil 30 minutes.", "Éloignez l'appareil du soleil.", "Retirez la batterie et débranchez le secteur 1 minute.", "Redémarrez l'appareil.", "Notez le numéro de Fail qui s'affiche."], solutionsTech: ["Mesurer la pureté O2 avec un analyseur.", "Remplacer les colonnes de tamis.", "Vérifier la pression du compresseur.", "Contrôler l'étanchéité pneumatique.", "Vérifier le ventilateur interne.", "Nettoyage interne à l'air sec.", "Contrôler la température de la turbine via le menu service.", "Identifier le composant via le code erreur.", "Tester les tensions de carte.", "Contrôler les capteurs internes."] }
          ] },
          { id: "solo2", name: "Invacare SOLO2", failures: [
              { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Batterie vide", "Chargeur HS", "Connectique interne défaillante", "Carte mère HS", "Cordon DC mal inséré", "Fusible allume-cigare grillé", "Prise voiture défectueuse", "Surchauffe du bloc DC"], solutionsPatient: ["Branchez l'appareil sur secteur.", "Le voyant du bloc d'alimentation est-il allumé ?", "Retirez la batterie et essayez sur secteur seul.", "Vérifiez que le câble n'est pas coupé.", "Vérifiez que la prise est bien enfoncée dans l'allume-cigare.", "Vérifiez le voyant sur la prise.", "Dévissez l'embout pour vérifier le petit fusible.", "Essayez sur une autre prise 12V."], solutionsTech: ["Tester la tension du chargeur (28V DC).", "Vérifier l'embase de charge.", "Vérifier les fusibles internes.", "Remplacer la carte mère.", "Tester la continuity du câble DC.", "Vérifier le fusible du câble.", "Contrôler la tension de sortie sous charge."] },
              { title: "Problème de batterie ou autonomie", causes: ["Autonomie < 10 %", "Batterie en fin de vie", "Défaut de communication batterie", "Surchauffe batterie"], solutionsPatient: ["Branchez sur secteur immédiatement.", "Retirez et remettez la batterie fermement.", "Laissez la batterie refroidir si elle est chaude.", "Vérifiez si l'icône batterie s'affiche."], solutionsTech: ["Vérifier la capacité de charge.", "Nettoyer les connecteurs batterie.", "Remplacer la batterie.", "Vérifier le circuit de charge sur la carte."] },
              { title: "Débit faible ou irrégulier", causes: ["Canule pliée ou écrasée", "Filtre HEPA bouché", "Vanne de sortie bloquée", "Bocal humidificateur fuyard"], solutionsPatient: ["Vérifiez que votre canule n'est pas pliée.", "Essayez avec une canule neuve.", "Si vous utilisez un humidificateur, vérifiez qu'il est bien fermé.", "Sentez-vous l'air sortir au bout ?"], solutionsTech: ["Vérifier le capteur de débit.", "Remplacer le filtre HEPA de sortie.", "Tester la pression de sortie.", "Vérifier le cycle de la vanne de pulsion."] },
              { title: "Problème de détection respiratoire (Trigger)", causes: ["Respiration par la bouche", "Canule trop longue (> 2.1m)", "Sensibilité trigger basse", "Valve de pulsion bloquée"], solutionsPatient: ["Respirez bien par le nez.", "Utilisez une canule de 2 mètres maximum.", "Vérifiez le branchement du tuyau.", "Testez en mode continu."], solutionsTech: ["Recalibrer la sensibilité du trigger.", "Tester la valve pneumatique.", "Vérifier l'étanchéité du circuit."] },
              { title: "Fuites importantes (Masque ou Circuit)", causes: ["Tuyau débranché", "Joint vanne usé", "Membrane compresseur fendue"], solutionsPatient: ["Entendez-u un sifflement venant de l'intérieur ?", "Le bruit s'arrête-t-il si vous bouchez la sortie ?"], solutionsTech: ["Recherche de fuite interne.", "Remplacer la tubulure défectueuse.", "Vérifier le compresseur."] },
              { title: "Erreur Système (Message d'erreur)", causes: ["Saturation des tamis moléculaires", "Filtre d'entrée colmaté", "Fuite interne", "Humidité excessive", "Ventilation obstruée", "Ventilateur interne HS", "Environnement trop chaud", "Filtres internes encrassés", "Fail 01 (O2)", "Fail 02 (Pression)", "Fail 04 (Batterie)", "Défaut carte mère"], solutionsPatient: ["Vérifiez que le filtre à poussière à l'arrière est propre.", "Placez l'appareil dans un endroit bien aéré.", "Assurez-u de ne pas être trop près d'une source de vapeur.", "Aérez la pièce.", "Sortez l'appareil de sa sacoche.", "Vérifiez que les grilles sont libres.", "Laissez refroidir l'appareil 30 minutes.", "Éloignez l'appareil du soleil.", "Retirez la batterie et débranchez le secteur 1 minute.", "Redémarrez l'appareil.", "Notez le numéro de Fail qui s'affiche."], solutionsTech: ["Mesurer la pureté O2 avec un analyseur.", "Remplacer les colonnes de tamis.", "Vérifier la pression du compresseur.", "Contrôler l'étanchéité pneumatique.", "Vérifier le ventilateur interne.", "Nettoyage interne à l'air sec.", "Contrôler la température de la turbine via le menu service.", "Identifier le composant via le code erreur.", "Tester les tensions de carte.", "Contrôler les capteurs internes."] }
          ] },
          { id: "simplygo", name: "SimplyGo", failures: [
              { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Batterie vide", "Chargeur HS", "Connectique interne défaillante", "Carte mère HS", "Cordon DC mal inséré", "Fusible allume-cigare grillé", "Prise voiture défectueuse", "Surchauffe du bloc DC"], solutionsPatient: ["Branchez l'appareil sur secteur.", "Le voyant du bloc d'alimentation est-il allumé ?", "Retirez la batterie et essayez sur secteur seul.", "Vérifiez que le câble n'est pas coupé.", "Vérifiez que la prise est bien enfoncée dans l'allume-cigare.", "Vérifiez le voyant sur la prise.", "Dévissez l'embout pour vérifier le petit fusible.", "Essayez sur une autre prise 12V."], solutionsTech: ["Tester la tension du chargeur (28V DC).", "Vérifier l'embase de charge.", "Vérifier les fusibles internes.", "Remplacer la carte mère.", "Tester la continuity du câble DC.", "Vérifier le fusible du câble.", "Contrôler la tension de sortie sous charge."] },
              { title: "Problème de batterie ou autonomie", causes: ["Autonomie < 10 %", "Batterie en fin de vie", "Défaut de communication batterie", "Surchauffe batterie"], solutionsPatient: ["Branchez sur secteur immédiatement.", "Retirez et remettez la batterie fermement.", "Laissez la batterie refroidir si elle est chaude.", "Vérifiez si l'icône batterie s'affiche."], solutionsTech: ["Vérifier la capacité de charge.", "Nettoyer les connecteurs batterie.", "Remplacer la batterie.", "Vérifier le circuit de charge sur la carte."] },
              { title: "Débit faible ou irrégulier", causes: ["Canule pliée ou écrasée", "Filtre HEPA bouché", "Vanne de sortie bloquée", "Bocal humidificateur fuyard"], solutionsPatient: ["Vérifiez que votre canule n'est pas pliée.", "Essayez avec une canule neuve.", "Si vous utilisez un humidificateur, vérifiez qu'il est bien fermé.", "Sentez-u l'air sortir au bout ?"], solutionsTech: ["Vérifier le capteur de débit.", "Remplacer le filtre HEPA de sortie.", "Tester la pression de sortie.", "Vérifier le cycle de la vanne de pulsion."] },
              { title: "Problème de détection respiratoire (Trigger)", causes: ["Respiration par la bouche", "Canule trop longue (> 2.1m)", "Sensibilité trigger basse", "Valve de pulsion bloquée"], solutionsPatient: ["Respirez bien par le nez.", "Utilisez une canule de 2 mètres maximum.", "Vérifiez le branchement du tuyau.", "Testez en mode continu."], solutionsTech: ["Recalibrer la sensibilité du trigger.", "Tester la valve pneumatique.", "Vérifier l'étanchéité du circuit."] },
              { title: "Fuites importantes (Masque ou Circuit)", causes: ["Tuyau débranché", "Joint vanne usé", "Membrane compresseur fendue"], solutionsPatient: ["Entendez-u un sifflement venant de l'intérieur ?", "Le bruit s'arrête-t-il si vous bouchez la sortie ?"], solutionsTech: ["Recherche de fuite interne.", "Remplacer la tubulure défectueuse.", "Vérifier le compresseur."] },
              { title: "Erreur Système (Message d'erreur)", causes: ["Saturation des tamis moléculaires", "Filtre d'entrée colmaté", "Fuite interne", "Humidité excessive", "Ventilation obstruée", "Ventilateur interne HS", "Environnement trop chaud", "Filtres internes encrassés", "Fail 01 (O2)", "Fail 02 (Pression)", "Fail 04 (Batterie)", "Défaut carte mère"], solutionsPatient: ["Vérifiez que le filtre à poussière à l'arrière est propre.", "Placez l'appareil dans un endroit bien aéré.", "Assurez-u de ne pas être trop près d'une source de vapeur.", "Aérez la pièce.", "Sortez l'appareil de sa sacoche.", "Vérifiez que les grilles sont libres.", "Laissez refroidir l'appareil 30 minutes.", "Éloignez l'appareil du soleil.", "Retirez la batterie et débranchez le secteur 1 minute.", "Redémarrez l'appareil.", "Notez le numéro de Fail qui s'affiche."], solutionsTech: ["Mesurer la pureté O2 avec un analyseur.", "Remplacer les colonnes de tamis.", "Vérifier la pression du compresseur.", "Contrôler l'étanchéité pneumatique.", "Vérifier le ventilateur interne.", "Nettoyage interne à l'air sec.", "Contrôler la température de la turbine via le menu service.", "Identifier le composant via le code erreur.", "Tester les tensions de carte.", "Contrôler les capteurs internes."] }
          ] },
          { id: "zen-o", name: "Zen-O", failures: [
              { title: "Problème d'alimentation (L'appareil ne démarre pas)", causes: ["Batterie vide", "Chargeur HS", "Connectique interne défaillante", "Carte mère HS", "Cordon DC mal inséré", "Fusible allume-cigare grillé", "Prise voiture défectueuse", "Surchauffe du bloc DC"], solutionsPatient: ["Branchez l'appareil sur secteur.", "Le voyant du bloc d'alimentation est-il allumé ?", "Retirez la batterie et essayez sur secteur seul.", "Vérifiez que le câble n'est pas coupé.", "Vérifiez que la prise est bien enfoncée dans l'allume-cigare.", "Vérifiez le voyant sur la prise.", "Dévissez l'embout pour vérifier le petit fusible.", "Essayez sur une autre prise 12V."], solutionsTech: ["Tester la tension du chargeur (28V DC).", "Vérifier l'embase de charge.", "Vérifier les fusibles internes.", "Remplacer la carte mère.", "Tester la continuity du câble DC.", "Vérifier le fusible du câble.", "Contrôler la tension de sortie sous charge."] },
              { title: "Problème de batterie ou autonomie", causes: ["Autonomie < 10 %", "Batterie en fin de vie", "Défaut de communication batterie", "Surchauffe batterie"], solutionsPatient: ["Branchez sur secteur immédiatement.", "Retirez et remettez la batterie fermement.", "Laissez la batterie refroidir si elle est chaude.", "Vérifiez si l'icône batterie s'affiche."], solutionsTech: ["Vérifier la capacité de charge.", "Nettoyer les connecteurs batterie.", "Remplacer la batterie.", "Vérifier le circuit de charge sur la carte."] },
              { title: "Débit faible ou irrégulier", causes: ["Canule pliée ou écrasée", "Filtre HEPA bouché", "Vanne de sortie bloquée", "Bocal humidificateur fuyard"], solutionsPatient: ["Vérifiez que votre canule n'est pas pliée.", "Essayez avec une canule neuve.", "Si vous utilisez un humidificateur, vérifiez qu'il est bien fermé.", "Sentez-u l'air sortir au bout ?"], solutionsTech: ["Vérifier le capteur de débit.", "Remplacer le filtre HEPA de sortie.", "Tester la pression de sortie.", "Vérifier le cycle de la vanne de pulsion."] },
              { title: "Problème de détection respiratoire (Trigger)", causes: ["Respiration par la bouche", "Canule trop longue (> 2.1m)", "Sensibilité trigger basse", "Valve de pulsion bloquée"], solutionsPatient: ["Respirez bien par le nez.", "Utilisez une canule de 2 mètres maximum.", "Vérifiez le branchement du tuyau.", "Testez en mode continu."], solutionsTech: ["Recalibrer la sensibilité du trigger.", "Tester la valve pneumatique.", "Vérifier l'étanchéité du circuit."] },
              { title: "Fuites importantes (Masque ou Circuit)", causes: ["Tuyau débranché", "Joint vanne usé", "Membrane compresseur fendue"], solutionsPatient: ["Entendez-u un sifflement venant de l'intérieur ?", "Le bruit s'arrête-t-il si vous bouchez la sortie ?"], solutionsTech: ["Recherche de fuite interne.", "Remplacer la tubulure défectueuse.", "Vérifier le compresseur."] },
              { title: "Erreur Système (Message d'erreur)", causes: ["Saturation des tamis moléculaires", "Filtre d'entrée colmaté", "Fuite interne", "Humidité excessive", "Ventilation obstruée", "Ventilateur interne HS", "Environnement trop chaud", "Filtres internes encrassés", "Fail 01 (O2)", "Fail 02 (Pression)", "Fail 04 (Batterie)", "Défaut carte mère"], solutionsPatient: ["Vérifiez que le filtre à poussière à l'arrière est propre.", "Placez l'appareil dans un endroit bien aéré.", "Assurez-u de ne pas être trop près d'une source de vapeur.", "Aérez la pièce.", "Sortez l'appareil de sa sacoche.", "Vérifiez que les grilles sont libres.", "Laissez refroidir l'appareil 30 minutes.", "Éloignez l'appareil du soleil.", "Retirez la batterie et débranchez le secteur 1 minute.", "Redémarrez l'appareil.", "Notez le numéro de Fail qui s'affiche."], solutionsTech: ["Mesurer la pureté O2 avec un analyseur.", "Remplacer les colonnes de tamis.", "Vérifier la pression du compresseur.", "Contrôler l'étanchéité pneumatique.", "Vérifier le ventilateur interne.", "Nettoyage interne à l'air sec.", "Contrôler la température de la turbine via le menu service.", "Identifier le composant via le code erreur.", "Tester les tensions de carte.", "Contrôler les capteurs internes."] }
          ] }
        ]
      }
    ]
  }
];