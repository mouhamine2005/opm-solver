/**
 * Extrait un message d'erreur lisible depuis une réponse d'API
 */
export function extractErrorMessage(error: any): string {
  // Si c'est déjà une chaîne, on la retourne
  if (typeof error === 'string') {
    return error;
  }

  // Essayer d'extraire depuis la réponse Axios
  const detail = error?.response?.data?.detail;

  if (!detail) {
    return error?.message || 'Erreur lors de la communication avec le serveur';
  }

  // Si detail est une chaîne, on la retourne
  if (typeof detail === 'string') {
    return detail;
  }

  // Si detail est un tableau d'erreurs de validation (Pydantic)
  if (Array.isArray(detail)) {
    return detail
      .map((err: any) => {
        if (typeof err === 'string') return err;
        if (err.msg) {
          const location = err.loc ? ` (${err.loc.join(' → ')})` : '';
          return `${err.msg}${location}`;
        }
        return JSON.stringify(err);
      })
      .join('; ');
  }

  // Si detail est un objet
  if (typeof detail === 'object') {
    // Erreur de validation Pydantic unique
    if (detail.msg) {
      const location = detail.loc ? ` (${detail.loc.join(' → ')})` : '';
      return `${detail.msg}${location}`;
    }
    // Autre objet
    return JSON.stringify(detail);
  }

  return 'Erreur inconnue';
}
