import crypto from 'crypto';

export function generateSchoolId(schoolName: string) {
    // Split the school name into words
    const words = schoolName.split(" ");

    // Generate acronym
    let acronym = "";
    for (let word of words) {
        acronym += word[0];
    }

    // Truncate if necessary
    if (acronym.length > 7) {
        acronym = acronym.slice(0, 7);
    }

    // Generate a hash of the school name
    const hash = crypto.createHash('sha1').update(schoolName).digest('hex').slice(0, 3);

    // If the acronym is shorter than 7 characters, pad it with zeros
    const schoolId = (acronym + hash).padEnd(4, '0');

    return schoolId.toUpperCase();
}