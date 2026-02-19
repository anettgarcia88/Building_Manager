/**
 * Genera una contraseña aleatoria segura
 * Con al menos: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial
 */
export function generateRandomPassword(length: number = 12): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*';

    let password = '';

    // Asegurar que al menos una de cada tipo está incluida
    password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    password += special.charAt(Math.floor(Math.random() * special.length));

    // Rellenar el resto aleatoriamente
    const allChars = uppercase + lowercase + numbers + special;
    for (let i = password.length; i < length; i++) {
        password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    // Mezclar la contraseña
    return password
        .split('')
        .sort(() => Math.random() - 0.5)
        .join('');
}
