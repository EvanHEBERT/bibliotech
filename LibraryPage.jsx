import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Données simulées pour la bibliothèque
const LIBRARY_DATA = [
  {
    id: "echo",
    name: "Échographes",
    models: [
      {
        id: "voluson-e10",
        name: "Voluson E10",
        failures: [
          {
            title: "Image bruitée / Artefacts",
            cause: "Interférences électromagnétiques ou sonde défectueuse.",
            solution: "Vérifier la mise à la terre, éloigner les sources d'interférences (téléphones), tester une autre sonde.",
            questions: [
              "Le problème est-il présent sur toutes les sondes ?",
              "Avez-vous déplacé l'appareil récemment ?"
            ]
          },
          {
            title: "Erreur de démarrage système",
            cause: "Disque dur défaillant ou corruption logicielle.",
            solution: "Tenter un redémarrage forcé. Si échec, réinstallation logicielle requise.",
            questions: [
              "Y a-t-il eu une coupure de courant récente ?",
              "Quel est le code d'erreur affiché ?"
            ]
          }
        ]
      },
      {
        id: "vivid-e95",
        name: "Vivid E95",
        failures: []
      },
      {
        id: "affiniti-70",
        name: "Affiniti 70",
        failures: []
      }
    ]
  },
  {
    id: "ct",
    name: "Scanners (CT)",
    models: []
  },
  {
    id: "irm",
    name: "IRM",
    models: []
  },
  {
    id: "vni",
    name: "Ventilation Non Invasive (VNI)",
    brands: [
      {
        id: "resmed-vni",
        name: "ResMed",
        logo: "/logos/resmed.png",
        models: [
          { id: "aircurve-10", name: "AirCurve 10", failures: [] },
          { id: "lumis-150", name: "Lumis 150", failures: [] }
        ]
      },
      {
        id: "philips-respironics",
        name: "Philips Respironics",
        logo: "/logos/philips.png",
        models: [
          { id: "trilogy-evo", name: "Trilogy Evo", failures: [] }
        ]
      }
    ]
  },
  {
    id: "vaa",
    name: "Ventilation Assistée (VAA)",
    brands: []
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
          { id: "airsense-10", name: "AirSense 10", failures: [] }
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

  // Navigation handlers
  const goHome = () => navigate("/");
  const resetType = () => { setSelectedType(null); setSelectedBrand(null); setSelectedModel(null); };
  const resetBrand = () => { setSelectedBrand(null); setSelectedModel(null); };
  const resetModel = () => { setSelectedModel(null); };

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
              <span style={{ ...breadcrumbItemStyle, color: selectedModel ? "#0284c7" : "#0f172a" }} onClick={resetBrand}>
                {selectedBrand.name}
              </span>
            </>
          )}
          {selectedModel && (
            <>
              <span>/</span>
              <span style={breadcrumbItemStyle}>{selectedModel.name}</span>
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

          {selectedModel && (
            <div style={{ animation: "fadeIn 0.3s ease-in" }}>
              <h2 style={{ marginBottom: "24px", fontSize: "24px", borderBottom: "2px solid #0284c7", display: "inline-block", paddingBottom: "4px" }}>
                Guide de dépannage : {selectedModel.name}
              </h2>
              
              {selectedModel.failures.length === 0 ? (
                <p style={{ color: "#64748b", fontStyle: "italic" }}>Aucune panne connue enregistrée pour ce modèle.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {selectedModel.failures.map((failure, idx) => (
                    <div key={idx} style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" }}>
                      <h3 style={{ marginTop: 0, color: "#ef4444", display: "flex", alignItems: "center", gap: "10px" }}>
                        ⚠️ {failure.title}
                      </h3>
                      
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "16px" }}>
                        <div style={{ background: "#fef2f2", padding: "16px", borderRadius: "8px" }}>
                          <strong style={{ color: "#991b1b", display: "block", marginBottom: "8px" }}>Cause probable</strong>
                          <div style={{ color: "#7f1d1d" }}>{failure.cause}</div>
                        </div>
                        
                        <div style={{ background: "#f0fdf4", padding: "16px", borderRadius: "8px" }}>
                          <strong style={{ color: "#166534", display: "block", marginBottom: "8px" }}>Solution recommandée</strong>
                          <div style={{ color: "#14532d" }}>{failure.solution}</div>
                        </div>
                      </div>

                      <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px dashed #cbd5e1" }}>
                        <strong style={{ color: "#0f172a", display: "block", marginBottom: "10px" }}>❓ Questions à poser au client :</strong>
                        <ul style={{ margin: 0, paddingLeft: "20px", color: "#334155" }}>
                          {failure.questions.map((q, i) => (
                            <li key={i} style={{ marginBottom: "4px" }}>{q}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}