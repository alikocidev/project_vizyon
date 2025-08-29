import { iFilterOriginalLanguage } from "@/types/discover.type";
import { iGenre } from "@/types/movie.type";

export const Tmdb_MovieGenres: iGenre[] = [
    { id: 28, name: "Aksiyon" },
    { id: 12, name: "Macera" },
    { id: 16, name: "Animasyon" },
    { id: 35, name: "Komedi" },
    { id: 80, name: "Suç" },
    { id: 99, name: "Belgesel" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Aile" },
    { id: 14, name: "Fantastik" },
    { id: 36, name: "Tarih" },
    { id: 27, name: "Korku" },
    { id: 10402, name: "Müzik" },
    { id: 9648, name: "Gizem" },
    { id: 10749, name: "Romantik" },
    { id: 878, name: "Bilim Kurgu" },
    { id: 10770, name: "TV Filmi" },
    { id: 53, name: "Gerilim" },
    { id: 10752, name: "Savaş" },
    { id: 37, name: "Western" },
];

export const Tmdb_TvGenres: iGenre[] = [
    { id: 10759, name: "Aksiyon & Macera" },
    { id: 16, name: "Animasyon" },
    { id: 35, name: "Komedi" },
    { id: 80, name: "Suç" },
    { id: 99, name: "Belgesel" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Aile" },
    { id: 10762, name: "Çocuk" },
    { id: 9648, name: "Gizem" },
    { id: 10763, name: "Haber" },
    { id: 10764, name: "Reality" },
    { id: 10765, name: "Bilim Kurgu & Fantastik" },
    { id: 10766, name: "Pembe Dizi" },
    { id: 10767, name: "Sohbet" },
    { id: 10768, name: "Savaş & Politika" },
    { id: 37, name: "Western" },
];

export function genreIdsToNamesForMovies(genreIds: number[]): string {
    if (!genreIds) return "";
    const genreNames: string[] = genreIds
        .map((id) => Tmdb_MovieGenres.find((v) => v.id === id)?.name)
        .filter((name) => name !== undefined) as string[];
    return genreNames.join(", ");
}

export function genreIdsToNamesForTV(genreIds: number[]): string {
    if (!genreIds) return "";
    const genreNames: string[] = genreIds
        .map((id) => Tmdb_TvGenres.find((v) => v.id === id)?.name)
        .filter((name) => name !== undefined) as string[];
    return genreNames.join(", ");
}

export function formatDateToTurkishMonthDay(date: string): string {
    const monthNames = [
        "Ocak",
        "Şubat",
        "Mart",
        "Nisan",
        "Mayıs",
        "Haziran",
        "Temmuz",
        "Ağustos",
        "Eylül",
        "Ekim",
        "Kasım",
        "Aralık",
    ];

    const [_, month, day] = date.split("-");

    const monthIndex = parseInt(month, 10) - 1;

    const monthName = monthNames[monthIndex];

    return `${day} ${monthName}`;
}

export function getLanguageInTurkish(
    languageCode: iFilterOriginalLanguage
): string {
    if (languageCode === null) {
        return "Geçersiz dil kodu";
    }

    const languageMap: {
        [key in Exclude<iFilterOriginalLanguage, null>]: string;
    } = {
        en: "İngilizce",
        fr: "Fransızca",
        es: "İspanyolca",
        de: "Almanca",
        it: "İtalyanca",
        ja: "Japonca",
        ko: "Korece",
        zh: "Çince",
        pt: "Portekizce",
        ru: "Rusça",
        hi: "Hintçe",
        ar: "Arapça",
        bn: "Bengalce",
        cs: "Çekçe",
        da: "Danca",
        el: "Yunanca",
        he: "İbranice",
        hu: "Macarca",
        id: "Endonezce",
        ms: "Malayca",
        nl: "Flemenkçe",
        no: "Norveççe",
        pl: "Lehçe",
        ro: "Romence",
        sv: "İsveççe",
        ta: "Tamilce",
        th: "Tayca",
        tr: "Türkçe",
        uk: "Ukraynaca",
        vi: "Vietnamca",
    };

    return languageMap[languageCode];
}

export const deepEqual = (obj1: any, obj2: any): boolean => {
    if (obj1 === obj2) return true;

    if (
        typeof obj1 !== "object" ||
        obj1 === null ||
        typeof obj2 !== "object" ||
        obj2 === null
    ) {
        return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
        if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
            return false;
        }
    }

    return true;
};
