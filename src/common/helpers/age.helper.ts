/**
 * Calcula a idade em anos a partir da data de nascimento.
 * @param birthDate Data de nascimento (Date, string ISO ou null)
 * @returns Idade em anos ou null se birthDate for inválido
 */
export function getAgeFromBirthDate(birthDate: Date | string | null | undefined): number | null {
  if (birthDate == null) return null;
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age >= 0 ? age : null;
}

/**
 * Verifica se a idade está dentro da faixa opcional do produto (min_age/max_age).
 * Se o produto não tem faixa etária (ambos null), retorna true.
 */
export function isAgeInProductRange(
  userAge: number | null,
  minAge: number | null,
  maxAge: number | null,
): boolean {
  if (minAge == null && maxAge == null) return true;
  if (userAge == null) return false;
  if (minAge != null && userAge < minAge) return false;
  if (maxAge != null && userAge > maxAge) return false;
  return true;
}
