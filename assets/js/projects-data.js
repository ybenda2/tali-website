/* eslint-disable no-unused-vars */
/**
 * נתוני פרויקטים + הגדרות סטודיו — נטען לפני main.js / project-page.js
 * @typedef {{ id:string, title:string, subtitle?:string, description?:string, tags:string[], cover:string, images:string[] }} TaliProject
 */
(() => {
  const PLACEHOLDER = "assets/images/placeholder.svg";

  const BEIT_TIVON_DIR = "assets/images/beit-tivon";
  const BEIT_TIVON_FILES = [
    "beit-tivon_1.JPG",
    "beit-tivon_2.JPG",
    "beit-tivon_3.JPG",
    "beit-tivon_4.JPG",
    "beit-tivon_5.JPG",
    "beit-tivon_6.JPG",
    "beit-tivon_7.JPG",
    "beit-tivon_8.JPG",
    "beit-tivon_9.JPG",
    "beit-tivon_10.JPG",
    "beit-tivon_11.JPG",
    "beit-tivon_12.JPG",
    "beit-tivon_13.JPG",
    "beit-tivon_14.JPG",
    "beit-tivon_15.JPG",
    "beit-tivon_16.JPG",
    "beit-tivon_17.jpg",
    "beit-tivon_18.JPG",
    "beit-tivon_19.JPG",
    "beit-tivon_20.JPG",
    "beit-tivon_21.JPG",
    "beit-tivon_22.JPG",
    "beit-tivon_23.JPG",
    "beit-tivon_24.JPG",
    "beit-tivon_25.JPG",
    "beit-tivon_26.JPG",
    "beit-tivon_27.JPG",
    "beit-tivon_28.JPG",
    "beit-tivon_29.JPG",
    "beit-tivon_30.JPG",
  ];
  const BEIT_TIVON_IMAGES = BEIT_TIVON_FILES.map((name) => `${BEIT_TIVON_DIR}/${name}`);

  const GEVA_CARMEL_DIR = "assets/images/gavecarmel";
  /** תמונה ראשית (geva_19) ראשונה בגלריה ובכרטיס הפרויקט */
  const GEVA_CARMEL_ORDER = [19, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25];
  const GEVA_CARMEL_IMAGES = GEVA_CARMEL_ORDER.map((n) => `${GEVA_CARMEL_DIR}/geva_${n}.jpg`);

  /** @type {TaliProject[]} */
  /* סדר בתצוגת המרקיז: רצף לוגי (אזור/קרבה) — אחרי בטבעון מיד חיפה, ואז הלאה */
  const PROJECTS = [
    {
      id: "farmhouseModern",
      title: "פרויקט בטבעון",
      tags: ["בתים"],
      cover: BEIT_TIVON_IMAGES[0],
      images: BEIT_TIVON_IMAGES,
      description:
        "פרויקט מגורים בטבעון — חלל פתוח, חומרים טבעיים ואור יום. התכנון שם דגש על זרימה בין אזורי המגורים, המטבח והחוץ.\n\nהפרטים הושלמו בליווי צמוד עד לרגע האחרון, עם בחירת חומרים, טקסטיל ותאורה שמחממים את הבית ונשארים נקיים ועכשוויים.",
    },
    {
      id: "gardenApartmentHaifa",
      title: "דירת גן בחיפה",
      tags: ["דירות"],
      cover: PLACEHOLDER,
      images: [PLACEHOLDER, PLACEHOLDER, PLACEHOLDER],
      description:
        "דירת גן בחיפה — איזון בין פרטיות לחלל משפחתי, ועיצוב שמתאים לסביבה העירונית. פרטים וצילומים יתעדכנו בקרוב.",
    },
    {
      id: "penthouseTivon",
      title: "פנטהאוז בטבעון",
      tags: ["דירות"],
      cover: PLACEHOLDER,
      images: [PLACEHOLDER, PLACEHOLDER, PLACEHOLDER],
      description:
        "פנטהאוז בטבעון — ניצול נוף ואור, קווים נקיים וחומריות חמה. פרטים וצילומים יתעדכנו בקרוב.",
    },
    {
      id: "gardenApartmentAtlit",
      title: "דירת גן בעתלית",
      tags: ["דירות"],
      cover: PLACEHOLDER,
      images: [PLACEHOLDER, PLACEHOLDER, PLACEHOLDER],
      description:
        "דירת גן בעתלית — חיבור בין פנים לחוץ, תכנון פונקציונלי ואווירה ביתית. פרטים וצילומים יתעדכנו בקרוב.",
    },
    {
      id: "privateHomeItzmon",
      title: "בית פרטי בעצמון",
      tags: ["בתים"],
      cover: PLACEHOLDER,
      images: [PLACEHOLDER, PLACEHOLDER, PLACEHOLDER],
      description:
        "בית פרטי בעצמון — חללים מדויקים, חומרים נבחרים וליווי מלא עד הפרטים הקטנים. פרטים וצילומים יתעדכנו בקרוב.",
    },
    {
      id: "gevaCarmelPrivateHome",
      title: "בית פרטי בגבע כרמל",
      tags: ["בתים"],
      cover: GEVA_CARMEL_IMAGES[0],
      images: GEVA_CARMEL_IMAGES,
      description:
        "בית פרטי בגבע כרמל — חללים מרווחים, חומרים טבעיים והרגשה ביתית. התכנון מתחבר לסביבה ומאזן בין פונקציונליות לעיצוב עדין.\n\nהליווי כלל בחירת גוונים, טקסטיל ופרטים שמרככים את החלל ויוצרים רצף ויזואלי נעים בין החדרים.",
    },
  ];

  window.TALI = {
    studio: {
      name: "Tali Baker",
      tagline: "סטודיו בוטיק לעיצוב פנים • תכנון • ליווי",
      instagramUrl: "https://www.instagram.com/p/DVB0B2IjAMS/",
      facebookUrl: "https://www.facebook.com/100063679711509/posts/1462182822581028/",
      phone: "052-4245573",
      email: "",
      addressLines: ["ישראל"],
    },
    placeholder: PLACEHOLDER,
    projects: PROJECTS,
  };
})();
