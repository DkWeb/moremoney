var i18n = {
    de: {
        dataTables: {
            search: "Suchen",
            oPaginate: {
                sFirst:    "Erste",
                sPrevious: "Zurück",
                sNext:     "Nächste",
                sLast:     "Letzte"
            },
            oAria: {
                sSortAscending:  "Spalte aufsteigend sortieren",
                sSortDescending: "Spalte absteigend sortieren"
            },                                               
            sEmptyTable: "Keine Ausgaben vorhanden",
            sInfo: "_START_ bis _END_ von _TOTAL_ Einträge",
            sInfoEmpty: "Keine Ausgaben vorhanden",
            sInfoFiltered: "(gefiltert von _MAX_ Einträgen)", 
            lengthMenu: "Anzeigen von _MENU_ Einträgen"
        },
        settingsPage: {
            currentCurrency: "Aktuelle Währung",
            categories: "Kategorien",
            change: "Ändern",            
            create: "Anlegen",
            categoryLimit: "Limit",        
            categoryName: "Name"            
        },
        createCategoryDialog: {
            title: "Neue Kategorie",
            categoryName: "Name",
            categoryLimit: "Limit",
            save: "Speichern",
            close: "Schließen"
        },
        expanseDialog: {
            expanse: "Ausgabe",
            what: "Was hast du gekauft?",
            howMuch: "Wieviel hast du ausgegeben?",
            when: "Wann war der Einkauf?",
            category: "Kannst du eine Kategorie zuordnen?",
            save: "Speichern",
            close: "Schließen"
        },
        menu: {
            expanses: "Ausgaben",
            settings: "Einstellungen",
            export: "Export",
            info: "Info"
        },
        info: {
            appName: "Anwendungsname",
            developer: "Entwickler",
            contact: "Dirk Weber (<a href='mailto:mailme@dkweb.de'>Kontakt</a>)",
            thanks: "Mit freundlicher Unterstützung von:",
            disclaimer: "Bitte beachte die Lizenzbestimmungen dieser Projekte. Sie unterliegen nicht notwendigerweise der MIT Lizenz wie dieses Projekt"
        },
        export: {
            intro: "Downloade alle Ausgaben im CSV-Format. Dieser Export kann von dir dazu benutzt werden, die Daten in deiner bevorzugten Tabellenkalkulation auszuwerten",
            start: "CSV Export"
        },        
        expansePage: {
            newExpanse: "Neue Ausgabe",
            editExpanse: "Ausgabe bearbeiten",
            deleteExpanse: "Ausgabe löschen",
            total: "Gesamt (Seite):",  
            overallTotal: "Gesamt (alle Seiten):",  
            item: "Artikel",
            amount: "Betrag",
            date: "Kaufdatum",
            category: "Kategory"
        },
        formats: {
            date: "DD.MM.YYYY"
        },
        catLimitAlert: {
            title: "Limit für Kategorie überschritten",
            body: "Für {} ist ein Monatslimit von {} festgelegt. Aktueller Betrag: {}"
        }        
    },
    en: {
        dataTables: {
            search: "Search",
            oPaginate: {
                sFirst:    "First",
                sPrevious: "Back",
                sNext:     "Next",
                sLast:     "Last"
            },
            oAria: {
                sSortAscending:  "Sort column ascending",
                sSortDescending: "Sort column descending"
            },                                               
            sEmptyTable: "No expanses exist",
            sInfo: "_START_ to _END_ of _TOTAL_ items",
            sInfoEmpty: "No expanses exist",
            sInfoFiltered: "(filtered of _MAX_ items)", 
            lengthMenu: "Show _MENU_ items"
        },
        settingsPage: {
            currentCurrency: "Current currency",
            categories: "Categories",
            change: "Change",
            create: "Create",
            categoryLimit: "Limit",
            categoryName: "Name"            
        },
        createCategoryDialog: {
            title: "Create category",
            categoryName: "Name",
            categoryLimit: "Limit",
            save: "Save",
            close: "Abort"
        },
        expanseDialog: {
            expanse: "Expanse",
            what: "What did you buy?",
            howMuch: "How much did you spend?",
            when: "When did you go shopping?",
            category: "Can you assign a category?",
            save: "Save",
            close: "Abort"
        },
        menu: {
            expanses: "Expanses",
            settings: "Settings",
            export: "Export",
            info: "Info"
        },
        info: {
            appName: "Appname:",
            developer: "Developer:",
            contact: "Dirk Weber (<a href='mailto:mailme@dkweb.de'>Contact</a>)",
            thanks: "With kind support of:",
            disclaimer: "Please consider the licenses of the mentioned projects. They do not necessarily use MIT license like this project"
        },
        export: {
            intro: "You can download the expanses in a CSV format. This export can be used to analyze the data in your favorite spreadsheet app",
            start: "Export to CSV"
        },
        expansePage: {
            newExpanse: "Create expanse",
            editExpanse: "Edit expanse",
            deleteExpanse: "Delete expanse",
            total: "Total (page):",
            overallTotal: "Overall total (all pages):",  
            item: "Item",
            amount: "Amount",
            date: "Date",
            category: "Category"
        },
        formats: {
            date: "MM/DD/YYYY"
        },
        catLimitAlert: {
            title: "Limit reached for category",
            body: "You've set a monthly limit for {} of {}. Spent up to  now: {}"
        }        
    },    
    text: function(key, lang, params) {
        if (lang === undefined || lang === null) {
            lang = "en";
        }
        var keyParts = key.split(".");
        if (params === undefined || params === null) {
            return getTranslationByKey(key, lang);
        }

        var newText = getTranslationByKey(key, lang);
        newText = postponedParamsReplacer.replaceAll(newText, params);
        return newText;

        function getTranslationByKey(key, lang) {
            var last = i18n[lang];
            for (var i = 0; i < keyParts.length; i++) {
                last = last[keyParts[i]];
            }
            return last;
        }
    },
    dataTables: function(lang) {
        if (lang === undefined || lang === null) {
            lang = "en";
        }
        return i18n[lang]["dataTables"];
    }

}

var langDetector =  {
    detect: function() {
        var lang = navigator.language;
        return lang.split("-")[0];
    }
}

var i18nFormatter = {
    formatDate: function(date, lang) {
        return moment(date).format(i18n.text("formats.date", lang));        
    },
    formatAmount: function(number, currency, lang) {
        return parseFloat(number).toLocaleString(lang, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ' + currency;
    }
}

var postponedParamsReplacer = {
    replaceAll: function(text, params) {
        for (var i = 0; i < params.length; i++) {
            text = text.replace("{}", params[i]);
        }
        return text;
    }
}