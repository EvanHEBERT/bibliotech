import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Mettez à jour l'état pour que le prochain rendu affiche l'UI de secours.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Vous pouvez aussi logguer l'erreur dans un service de rapport d'erreurs
    console.error("Erreur non capturée par l'ErrorBoundary:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Vous pouvez rendre n'importe quelle UI de secours
      return (
        <div style={{ padding: '20px', textAlign: 'center', border: '1px solid #ef4444', borderRadius: '8px', margin: '50px auto', maxWidth: '600px', backgroundColor: '#fef2f2', color: '#991b1b' }}>
          <h2 style={{ color: '#ef4444' }}>Oups ! Quelque chose s'est mal passé.</h2>
          <p>Nous sommes désolés pour le désagrément. Veuillez réessayer ou contacter le support.</p>
          {this.props.showDetails && this.state.error && (
            <details style={{ whiteSpace: 'pre-wrap', textAlign: 'left', marginTop: '20px', borderTop: '1px solid #fecaca', paddingTop: '10px' }}>
              <summary>Détails de l'erreur</summary>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </details>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#0284c7', color: 'white', cursor: 'pointer' }}
          >
            Recharger la page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;