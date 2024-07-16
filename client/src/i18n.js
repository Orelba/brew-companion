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
          pageTitles: {
            brewsPage: 'Brews',
            coffeesPage: 'Coffees',
            roasteriesPage: 'Roasteries',
            notFoundPage: 'Not Found',
          },
          brewingMethods: {
            espresso: 'Espresso',
            pourOver: 'Pour Over',
            mokaPot: 'Moka Pot',
            frenchPress: 'French Press',
            aeroPress: 'AeroPress',
            turkishCoffee: 'Turkish Coffee',
            coldBrew: 'Cold Brew',
          },
          header: {
            home: 'Home',
            brews: 'Brews',
            inventory: 'Coffees and Roasteries',
          },
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
            addBrew: 'Add Brew',
          },
          newBrewForm: {
            stepOneTitle: 'What did you brew?',
            stepOneDescription: 'Choose Brewing Method',
            stepTwoTitle: 'Which coffee did you use?',
            stepTwoDescription: 'Choose a coffee',
            stepThreeTitle: 'How did it go?',
            stepThreeDescription: 'Add your brew details',
            inputs: {
              grindSetting: {
                label: 'Grind Setting',
                error: 'Grind setting must be filled',
              },
              time: {
                label: 'Time',
                error: 'Time must be in a format of 00:00 or 00:00:00',
              },
              dose: {
                label: 'Dose',
                error: 'Dose must be bigger than 0 grams',
              },
              yield: {
                label: 'Yield',
                error: 'Yield must be bigger than 0 grams',
              },
              temperature: {
                label: 'Temperature',
                error: 'Temperature must be a number between 0 and 100',
              },
              notes: {
                label: 'Notes',
                error: '',
              },
            },
            save: 'Save',
          },
          accordionItemWithMenu: {
            edit: 'Edit',
            archive: 'Archive',
            delete: 'Delete',
            brewSettings: 'Brew Settings',
            notes: 'Notes',
            grindSetting: 'Grind Setting',
            doseYield: 'Dose - Yield',
            time: 'Time',
            temp: 'Temp',
            gram: 'g',
            unknown: 'Unknown',
            savingBrew: 'Saving Brew...',
          },
          extractionRating: {
            underExtracted: 'Under Extracted',
            slightlyUnderExtracted: 'Slightly Under Extracted',
            balanced: 'Balanced',
            slightlyOverExtracted: 'Slightly Over Extracted',
            overExtracted: 'Over Extracted',
            callToRate: 'Rate the extraction',
          },
          inventoryLayout: {
            coffees: 'Coffees',
            roasteries: 'Roasteries',
            search: 'Search',
          },
          footer: {
            text: `© {{year}} {{appName}}. All rights reserved.`,
            links: {
              contact: 'Contact',
              privacy: 'Privacy',
              tos: 'Terms of Service',
            },
          },
        },
      },
      he: {
        translation: {
          pageTitles: {
            brewsPage: 'לוג קפה',
            coffeesPage: 'קליות',
            roasteriesPage: 'בתי קלייה',
            notFoundPage: 'העמוד לא נמצא',
          },
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
            addBrew: 'הוסף רשומה',
          },
          newBrewForm: {
            stepOneTitle: 'מה הכנת?',
            stepOneDescription: 'בחר שיטת הכנה',
            stepTwoTitle: 'באיזה קפה השתמשת?',
            stepTwoDescription: 'בחר קפה',
            stepThreeTitle: 'איך היה?',
            stepThreeDescription: 'הכנס את פרטי ההכנה',
            inputs: {
              grindSetting: {
                label: 'דרגת טחינה',
                error: 'חובה לציין את דרגת הטחינה',
              },
              time: {
                label: 'זמן',
                error: 'הזמן חייב להיות בפורמט 00:00 או 00:00:00',
              },
              dose: {
                label: 'כמות קפה',
                error: 'הכמות חייבת להיות גדולה מ-0 גרם',
              },
              yield: {
                label: 'כמות מים / כמה יצא',
                error: 'הכמות חייבת להיות גדולה מ-0 גרם',
              },
              temperature: {
                label: 'טמפרטורה',
                error: 'הטמפרטורה חייבת להיות בין מספר בין 0 ל-100',
              },
              notes: {
                label: 'הערות',
                error: '',
              },
            },
            save: 'שמור',
          },
          accordionItemWithMenu: {
            edit: 'ערוך',
            archive: 'העבר לארכיון',
            delete: 'מחק',
            brewSettings: 'פרטי ההכנה',
            notes: 'הערות',
            grindSetting: 'דרגת טחינה',
            doseYield: 'כמות - תוצאה',
            time: 'זמן',
            temp: 'טמפרטורה',
            gram: 'גרם',
            unknown: 'לא ידוע',
            savingBrew: 'שומר...',
          },
          extractionRating: {
            underExtracted: 'מיצוי חסר',
            slightlyUnderExtracted: 'מיצוי חסר קל',
            balanced: 'מאוזן',
            slightlyOverExtracted: 'מיצוי יתר קל',
            overExtracted: 'מיצוי יתר',
            callToRate: 'דרג את המיצוי',
          },
          inventoryLayout: {
            coffees: 'קליות',
            roasteries: 'בתי קלייה',
            search: 'חיפוש',
          },
          footer: {
            text: `© {{year}} {{appName}}. כל הזכויות שמורות.`,
            links: {
              contact: 'צור קשר',
              privacy: 'פרטיות',
              tos: 'תנאי שימוש',
            },
          },
        },
      },
    },
  })
