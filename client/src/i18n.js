import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    // debug: import.meta.env.MODE === 'development', // Set debug to true only in development
    // lng: 'he', // OVERRIDE LANGUAGE DETECTION TODO: remove this in production
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          brewingMethods: {
            espresso: 'Espresso',
            pourOver: 'Pour Over',
            mokaPot: 'Moka Pot',
            frenchPress: 'French Press',
            aeroPress: 'AeroPress',
            turkishCoffee: 'Turkish Coffee',
            coldBrew: 'Cold Brew',
          },
          header: { home: 'Home', brews: 'Brews', inventory: 'Inventory' },
          homePage: {
            heroTitle: 'Brew. Consistently.',
            heroDescription:
              'Elevate your coffee experience - log and refine your brewing results. Unlock the art of coffee brewing, one cup at a time.',
            heroButtonText: 'Get Brewing',
          },
          quickBrewCarousel: {
            title: 'Quick Brew',
          },
          brewsPage: {
            allCoffees: 'All Coffees',
            allMethods: 'All Brewing Methods',
            noCoffeesFound: 'No coffees found',
            resetFilters: 'Reset filters',
          },
          accordionItemWithMenu: {
            edit: 'Edit',
            archive: 'Archive',
            delete: 'Delete',
            underExtracted: 'Under Extracted',
            slightlyUnderExtracted: 'Slightly Under Extracted',
            balanced: 'Balanced',
            slightlyOverExtracted: 'Slightly Over Extracted',
            overExtracted: 'Over Extracted',
            extractionUnknown: 'Extraction Unknown',
            brewSettings: 'Brew Settings',
            notes: 'Notes',
            grindSetting: 'Grind Setting',
            doseYield: 'Dose - Yield',
            time: 'Time',
            temp: 'Temp',
          },
          inventoryLayout: {
            coffees: 'Coffees',
            roasteries: 'Roasteries',
            search: 'Search',
          },
          footer: {
            text: `© {{year}} {{appName}}. All rights reserved.`,
          },
        },
      },
      he: {
        translation: {
          brewingMethods: {
            espresso: 'אספרסו',
            pourOver: 'פילטר',
            mokaPot: 'מקינטה',
            frenchPress: "פרנץ' פרס",
            aeroPress: 'אירופרס',
            turkishCoffee: 'קפה שחור',
            coldBrew: 'חליטה קרה',
          },
          header: {
            home: 'בית',
            brews: 'לוג קפה',
            inventory: 'קליות ובתי קלייה',
          },
          homePage: {
            heroTitle: 'החליטה המושלמת ',
            heroDescription: 'שפר את חוויית הקפה שלך - כוס אחת בכל פעם.',
            heroButtonText: 'התחל עכשיו',
          },
          quickBrewCarousel: {
            title: 'הכנה מהירה',
          },
          brewsPage: {
            allCoffees: 'כל הקליות',
            allMethods: 'כל שיטות ההכנה',
            noCoffeesFound: 'לא נמצאו קליות',
            resetFilters: 'אפס סינון',
          },
          accordionItemWithMenu: {
            edit: 'ערוך',
            archive: 'העבר לארכיון',
            delete: 'מחק',
            underExtracted: 'מיצוי חסר',
            slightlyUnderExtracted: 'מיצוי חסר קל',
            balanced: 'מאוזן',
            slightlyOverExtracted: 'מיצוי יתר קל',
            overExtracted: 'מיצוי יתר',
            extractionUnknown: 'מיצוי לא ידוע',
            brewSettings: 'פרטי ההכנה',
            notes: 'הערות',
            grindSetting: 'הגדרת טחינה',
            doseYield: 'כמות - תוצאה',
            time: 'זמן',
            temp: 'טמפרטורה',
          },
          inventoryLayout: {
            coffees: 'קליות',
            roasteries: 'בתי קלייה',
            search: 'חיפוש',
          },
          footer: {
            text: `© {{year}} {{appName}}. כל הזכויות שמורות.`,
          },
        },
      },
    },
  })
