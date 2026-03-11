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
              "Vérifiez que le tuyau est bien enfoncé dans la sortie d'air de l'appareil.",
              "Suivez le tuyau et vérifiez que l'autre extrémité est bien connectée au masque.",
              "Passez votre main le long du tuyau pour sentir d'éventuelles fuites d'air provenant de trous ou de fissures.",
              "Réajustez le masque sur votre visage. Il doit être stable mais pas trop serré. Écoutez s'il y a des sifflements de fuite.",
              "Assurez-vous que le réservoir d'eau de l'humidificateur est bien enclenché et que son couvercle est fermé."
            ],
            solutionsTech: [
              "Guidez le patient pour utiliser la fonction 'Ajustement du masque' (Mask Fit) disponible dans le menu patient pour visualiser l'étanchéité.",
              "Accédez au menu clinicien et vérifiez que la pression prescrite (IPAP/EPAP) correspond à l'ordonnance.",
              "Entrez dans le menu de service pour lancer un test de la turbine et vérifier que la pression mesurée correspond à la pression de consigne."
            ],
            questions: [
              "L'alarme se déclenche-t-elle tout le temps ou seulement dans certaines positions ?",
              "Entendez-vous ou sentez-vous de l'air s'échapper autour du masque ?"
            ]
          }] },
          { id: "lumis-150", name: "Lumis 150", failures: [{
            title: "L'appareil ne détecte pas la respiration (pas de trigger)",
            cause: "Masque mal ajusté, fuites, ou mauvais réglage de la sensibilité du trigger.",
            solutionsPatient: [
              "Vérifiez l'ajustement de votre masque. Les fuites, même petites, peuvent empêcher l'appareil de détecter votre respiration.",
              "Prenez une inspiration volontairement plus ample et plus rapide pour voir si cela déclenche le ventilateur.",
              "Dans le menu utilisateur, vérifiez que le 'Type de masque' sélectionné (Nasal, Facial, etc.) est bien celui que vous portez."
            ],
            solutionsTech: [
              "Accédez au menu clinicien. Diminuez le réglage de sensibilité du trigger inspiratoire (ex: passez de 'Moyen' à 'Élevé') pour que l'appareil détecte des efforts plus faibles.",
              "Vérifiez le réglage de la 'Rampe'. Si elle est active, désactivez-la temporairement pour tester le déclenchement à la pression prescrite.",
              "Assurez-vous que le trigger expiratoire (Cycle) n'est pas réglé sur une valeur trop élevée (trop sensible), ce qui pourrait interrompre le cycle prématurément."
            ],
            questions: [
              "L'appareil finit-il par se déclencher si vous attendez ?",
              "Le problème est-il apparu après un changement de masque ou de réglages ?"
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
              "Appuyez une fois brièvement sur le bouton Marche/Arrêt. L'écran s'allume-t-il ?",
              "Vérifiez la connexion du câble d'alimentation au dos de l'appareil. Débranchez et rebranchez-le.",
              "Branchez le bloc d'alimentation sur une autre prise murale, dont vous avez vérifié le fonctionnement avec une lampe.",
              "Inspectez le câble et le bloc d'alimentation. S'ils sont endommagés, ne les utilisez pas.",
              "Laissez l'appareil branché sur secteur pendant 30 minutes sans y toucher, puis réessayez de l'allumer. Cela permet de recharger une batterie très faible."
            ],
            solutionsTech: [
              "Si disponible, utilisez un bloc d'alimentation et un câble d'un autre appareil identique pour écarter un problème d'alimentation externe.",
              "Si l'appareil a une batterie amovible, retirez-la. Branchez l'appareil sur secteur et essayez de démarrer. Si ça marche, la batterie est défectueuse.",
              "Si rien ne fonctionne, une panne de la carte mère ou d'un composant interne est probable. L'appareil nécessite une intervention en atelier."
            ],
            questions: ["L'écran affiche-t-il un voyant ou un message, même brièvement ?", "Y a-t-il eu un événement particulier avant la panne (chute, liquide, coupure de courant) ?", "Quand l'appareil a-t-il fonctionné pour la dernière fois ?"]
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
                  "Observez le patient. Tousse-t-il ou semble-t-il 'se battre' contre le ventilateur ? Si oui, une aspiration ou une sédation peut être nécessaire.",
                  "Suivez le circuit patient du ventilateur jusqu'au patient. Assurez-vous qu'aucun tuyau n'est plié, coincé ou écrasé.",
                  "Regardez dans les pièges à eau du circuit. S'ils sont remplis de condensation, videz-les.",
                  "Si l'état du patient le suggère, effectuez une aspiration endo-trachéale pour lever un éventuel bouchon muqueux."
                ],
                solutionsTech: [
                  "Sur l'écran du ventilateur, vérifiez le réglage de l'alarme 'Pression Max'. Assurez-vous qu'il est réglé environ 10 cmH2O au-dessus de la pression de crête (Ppeak) habituelle du patient.",
                  "Lancez la procédure de 'Test du circuit' ou 'Calibration du circuit' depuis le menu de service pour vérifier sa compliance et sa résistance.",
                  "Si le problème persiste sans cause évidente, calibrez les capteurs de pression et de débit."
                ],
                questions: [
                  "L'alarme est-elle intermittente (pendant la toux) ou continue ?",
                  "Quelle est la valeur de la pression de crête (Ppeak) affichée juste avant l'alarme ?"
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
                  "Retirez votre masque et nettoyez le coussin en silicone avec une lingette ou de l'eau savonneuse douce pour enlever les graisses de la peau.",
                  "Repositionnez le masque sur votre visage. Pour un masque nasal ou facial, le haut doit se situer sur l'arête du nez.",
                  "Tout en étant assis, tirez doucement sur les sangles pour réduire les fuites, sans trop serrer. Les sangles doivent être ajustées de manière égale.",
                  "Allongez-vous dans votre position de sommeil. Les fuites peuvent apparaître à ce moment. Réajustez si nécessaire.",
                  "Lancez la fonction 'Ajustement du masque' sur votre appareil. Il vous montrera un smiley vert si l'étanchéité est bonne."
                ],
                solutionsTech: [
                  "Examinez le coussin en silicone du masque. Recherchez des déchirures, des fissures ou une perte de souplesse. S'il est usé, il doit être remplacé.",
                  "Utilisez le gabarit de taille du fabricant pour confirmer que le patient a la bonne taille de masque. Un masque trop grand ou trop petit fuira toujours.",
                  "Si les fuites persistent malgré tout, proposez au patient d'essayer un masque d'un autre type ou d'une autre marque."
                ],
                questions: [
                  "Quand avez-vous remplacé votre coussin de masque pour la dernière fois ?",
                  "Les fuites se produisent-elles dans une position de sommeil particulière ?"
                ]
              }
            ] 
          }
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
const typesWithBrandsStep = ['vni', 'vaa', 'ppc'];

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
                            <strong style={{ color: "#334155", display: "block", marginBottom: "8px" }}>Cause probable</strong>
                            <div style={{ color: "#475569" }}>{selectedFailure.cause}</div>
                          </div>
                          
                          <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "8px" }}>
                            <strong style={{ color: "#334155", display: "block", marginBottom: "8px" }}>❓ Questions à poser</strong>
                            <ul style={{ margin: 0, paddingLeft: "20px", color: "#475569", fontSize: '14px' }}>
                              {selectedFailure.questions.map((q, i) => (
                                <li key={i} style={{ marginBottom: "4px" }}>{q}</li>
                              ))}
                            </ul>
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