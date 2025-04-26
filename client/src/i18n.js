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
          notifications: {
            loginSuccessful: 'Login successful!',
            loginFailed: 'Login failed',
            logoutSuccessful: 'Logout successful',
            logoutFailed: 'Logout failed. Please try again later.',
            passwordResetEmailSent:
              'If an account with that email exists, a reset link has been sent.',
            noServerResponse: 'No server response',
            missingEmailOrPassword: 'Missing email or password',
            invalidEmailOrPassword: 'Invalid email or password',
            termsAgreementError:
              'You must read and agree to the terms and conditions',
            registrationSuccessful: 'Registration successful!',
            registrationFailed: 'Registration failed. Please try again later.',
            usernameAlreadyExists:
              'The username you selected is already taken. Please choose a different one.',
            emailAlreadyExists:
              'The email you chose is already registered. Please try logging in or resetting your password.',
            unexpectedError: 'An error has occurred. Please try again later.',
            userInfoFetchError:
              'Something went wrong. User info cannot be accessed at the moment.',
            quickBrewCarouselFetchError:
              'Something went wrong. Recent brews cannot be accessed at the moment.',
            statsFetchError:
              'Something went wrong. Stats cannot be accessed at the moment.',
          },
          loading: {
            coffees: 'Loading Your Coffees...',
            brews: 'Loading Your Brews...',
            passwordReset: 'Validating...',
          },
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
          auth: {
            welcome: 'Welcome, {{formType}} with',
            login: 'login',
            register: 'register',
            resetPassword: 'reset password',
            changePassword: 'Change your password',
            validation: {
              usernameInvalid: 'Username should include at least 3 characters',
              emailInvalid: 'Invalid email',
              passwordInvalid: 'Password should include at least 8 characters',
              passwordMismatch: 'Passwords must match',
            },
            inputs: {
              emailLabel: 'Email',
              emailPlaceholder: 'Your email address',
              usernameLabel: 'Username',
              usernamePlaceholder: 'Your username',
              passwordLabel: 'Password',
              passwordPlaceholder: 'Your password',
              confirmPasswordLabel: 'Password Confirmation',
              confirmPasswordPlaceholder: 'Confirm your new password',
              termsAndConditions:
                'I have read and agree to the terms and conditions',
            },
            forgotYourPassword: 'Forgot your password?',
            persistLogin: 'Keep me signed in',
            callToLogin: 'Already have an account? Login',
            callToRegister: "Don't have an account? Register",
            callToGoBack: 'Back to the login page',
          },
          weight: {
            kg: 'kg',
            g: 'g',
            lbs: 'lbs',
            oz: 'oz',
          },
          userDropdownMenu: {
            accountSettings: 'Account settings',
            logout: 'Logout',
          },
          passwordResetPage: {
            title: 'Reset Your Password',
            subtitle: 'Choose a new password to complete the process',
            linkInvalid:
              'It looks like this link is no longer valid. Please request a new password reset link.',
            passwordResetSuccessful:
              'Password reset successfully! You can now log in using your new password.',
          },
          statsGrid: {
            title: 'My Statistics',
          },
          statsCard: {
            favoriteBrewMethod: 'Favorite Brew Method',
            totalCoffeesTried: 'Total Coffees Tried',
            totalCoffeeConsumed: 'Total Coffee Consumed',
            totalBrewedThisMonth: 'Total Brewed This Month',
            comparedToPreviousMonth: 'Compared to previous month',
          },
          roasteryStatsCard: {
            titleSingleRoastery: 'Favorite Roastery',
            titleMultipleRoasteries: 'Favorite Roasteries',
            cups: 'Cups',
          },
          monthlyConsumedCoffeeStatsCard: {
            titleSingleMonth: 'Coffee Consumed This Month',
            titleMultipleMonths: 'Coffee Consumed Monthly',
            consumption: 'Consumption',
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
            archive: 'Archive',
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
          notifications: {
            loginSuccessful: 'התחברת בהצלחה!',
            loginFailed: 'ההתחברות נכשלה',
            logoutSuccessful: 'התנתקת בהצלחה',
            logoutFailed: 'ההתנתקות נכשלה. אנא נסה שנית מאוחר יותר.',
            passwordResetEmailSent:
              'לינק לשחזור סיסמה ישלח לכתובת המייל שציינת במידה והחשבון קיים במערכת.',
            noServerResponse: 'אין תגובה מהשרת',
            missingEmailOrPassword: 'אחר או יותר מהפרטים חסרים',
            invalidEmailOrPassword: 'אחד או יותר מהפרטים שהזנת שגויים',
            termsAgreementError: 'עליך לקרוא ולהסכים לתנאים ולהגבלות',
            registrationSuccessful: 'נרשמת בהצלחה!',
            registrationFailed: 'ההרשמה נכשלה. אנא נסה שנית מאוחר יותר.',
            usernameAlreadyExists: 'שם המשתמש שבחרת כבר תפוס, אנא בחר אחד אחר',
            emailAlreadyExists:
              'האימייל שבחרת כבר רשום במערכת, אנא נסה להתחבר או לשחזר את הסיסמה.',
            unexpectedError: 'אירעה שגיאה. אנא נסה שוב מאוחר יותר.',
            userInfoFetchError:
              'אירעה שגיאה. אין אפשרות לגשת לפרטי המשתמש כרגע.',
            quickBrewCarouselFetchError:
              'אירעה שגיאה. אין אפשרות לגשת לרשימת ההכנות האחרונות כרגע.',
            statsFetchError: 'אירעה שגיאה. אין אפשרות לגשת לסטטיסטיקות כרגע.',
          },
          loading: {
            coffees: 'טוען את רשימת הקפה שלך...',
            brews: 'טוען את הלוג...',
            passwordReset: 'מאמת פרטים...',
          },
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
          auth: {
            welcome: 'ברוך הבא, {{formType}} עם',
            login: 'התחבר',
            register: 'הירשם',
            resetPassword: 'אפס סיסמה',
            validation: {
              usernameInvalid: 'שם המשתמש חייב לכלול לפחות 3 תווים',
              emailInvalid: 'דואר אלקטרוני לא תקין',
              passwordInvalid: 'הסיסמה חייבת לכלול לפחות 8 תווים',
              passwordMismatch: 'הסיסמאות חייבות להיות זהות',
            },
            inputs: {
              emailLabel: 'אימייל',
              emailPlaceholder: 'כתובת האימייל שלך',
              usernameLabel: 'שם משתמש',
              usernamePlaceholder: 'שם המשתמש שלך',
              passwordLabel: 'סיסמה',
              passwordPlaceholder: 'הסיסמה שלך',
              confirmPasswordLabel: 'אישור סיסמה',
              confirmPasswordPlaceholder: 'אשר את הסיסמה החדשה שלך',
              termsAndConditions: 'קראתי ואני מסכים/ה לתנאים וההגבלות',
            },
            forgotYourPassword: 'שכחת סיסמה?',
            persistLogin: 'השאר אותי מחובר',
            callToLogin: 'כבר יש לך משתמש? להתחברות לחץ כאן',
            callToRegister: 'אין לך משתמש? להרשמה לחץ כאן',
            callToGoBack: 'חזרה להתחברות',
          },
          weight: {
            kg: 'ק"ג',
            g: 'גרם',
            lbs: 'פאונד',
            oz: 'אונקיה',
          },
          userDropdownMenu: {
            accountSettings: 'הגדרות',
            logout: 'התנתק',
          },
          passwordResetPage: {
            title: 'אפס את הסיסמה שלך',
            subtitle: 'בחר סיסמה חדשה כדי להשלים את התהליך',
            linkInvalid:
              'נראה שהקישור הזה פג תוקף. אנא בקש קישור חדש לאיפוס הסיסמה שלך.',
          },
          statsGrid: {
            title: 'הסטטיסטיקות שלי',
          },
          statsCard: {
            favoriteBrewMethod: 'שיטת הכנה מועדפת',
            totalCoffeesTried: 'כלל סוגי הקפה שנוסו',
            totalCoffeeConsumed: 'כלל הקפה שנצרך',
            totalBrewedThisMonth: 'כלל הכוסות שהוכנו החודש',
            comparedToPreviousMonth: 'בהשוואה לחודש הקודם',
          },
          roasteryStatsCard: {
            titleSingleRoastery: 'בית קלייה מועדף',
            titleMultipleRoasteries: 'בתי קלייה מועדפים',
            cups: 'כוסות',
          },
          monthlyConsumedCoffeeStatsCard: {
            titleSingleMonth: 'צריכת קפה החודש',
            titleMultipleMonths: 'צריכת קפה חודשית',
            consumption: 'צריכה',
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
            archive: 'ארכיון',
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
