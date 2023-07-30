var moneydao = function(){
	var CATEGORY_STORE_NAME = 'categories';
	var EXPANSES_STORE_NAME = 'expanses';
	var SETTINGS_STORE_NAME = 'settings';

	var db;

	return {
		initDb: function() {
			return new Promise(function(resolve, reject) {
	  			if (!window.indexedDB) {
	    			reject(new Error('Leider keine Unterstützung für IndexedDB in diesem Browser. Es ist deshalb nicht möglich, Ausgaben abzuspeichern!'));
	    			return;
	  			}
				var request = indexedDB.open('expansedb', 1);
				request.onupgradeneeded = function(event) {
					console.log('onupgradeneeded aufgerufen');
  					db = event.target.result;
				    if (!db.objectStoreNames.contains(CATEGORY_STORE_NAME)) {
						db.createObjectStore(CATEGORY_STORE_NAME, { keyPath: 'name' });
				    }					
				    if (!db.objectStoreNames.contains(EXPANSES_STORE_NAME)) {
						db.createObjectStore(EXPANSES_STORE_NAME, { keyPath: 'id', autoIncrement: true });
				    }
				    if (!db.objectStoreNames.contains(SETTINGS_STORE_NAME)) {
						db.createObjectStore(SETTINGS_STORE_NAME, { keyPath: 'name' });
				    }									      					
				};
				request.onerror = function(event) {
					console.log('Konnte Datenbank nicht erstellen');
					reject(new Error('Leider konnte die Datenbank nicht angelegt werden. Vielleicht haben Sie der App nicht die erforderlichen Rechte eingeräumt?' + event));
				};
				request.onsuccess = function(event) {
					console.log('Datenbank konnte erfolgreich angelegt werden');
					db = request.result;
					resolve();
				};	  			
			});

		},
		saveCategory: function(toSave) {
			return new Promise(function(resolve, reject) {
				if (!db) {
					reject(new Error('Bitte zuerst die Datenbank mittels initDb initialisieren'));
					return;
				}
				var transaction = db.transaction([  CATEGORY_STORE_NAME ], "readwrite");
				transaction.oncomplete = function(event) {
				  resolve();
				};

				transaction.onerror = function(event) {
				  reject('Fehler beim Speichern einer Kategorie. ' + event);
				};
				var objectStore = transaction.objectStore(CATEGORY_STORE_NAME);
				objectStore.put(toSave);
			});
		},
        removeCategory: function(toRemove) {
            return new Promise(function(resolve, reject) {
                if (!db) {
                    reject(new Error('Bitte zuerst die Datenbank mittels initDb initialisieren'));
                    return;
                }
                var transaction = db.transaction([  CATEGORY_STORE_NAME ], "readwrite");
                transaction.oncomplete = function(event) {
                  resolve();
                };

                transaction.onerror = function(event) {
                  reject('Fehler beim Löschen einer der Kategorie ' + toRemove.name + '.' + event);
                };
                var objectStore = transaction.objectStore(CATEGORY_STORE_NAME);
                objectStore.delete(toRemove.name);
            });
        },        
		loadCategories: function() {
			return new Promise(function(resolve, reject) {
				if (!db) {
					reject(new Error('Bitte zuerst die Datenbank mittels initDb initialisieren'));
					return;
				}
				var transaction = db.transaction([  CATEGORY_STORE_NAME ], "readonly");
				transaction.onerror = function(event) {
				  reject('Fehler beim Laden der Kategorien. ' + event);
				};
				var objectStore = transaction.objectStore(CATEGORY_STORE_NAME);
				var request = objectStore.getAll();
                request.onsuccess = function(event) {
                	var categories = event.target.result;
    	            categories.sort(function(cat1, cat2) {
			            if (cat1.name < cat2.name) {
			                return -1;
			            }
			            if (cat1.name > cat2.name) {
			                return 1;
			            }
			            return 0;
		        	});
                    resolve(categories);
                }
			});
		},
		getCategory: function(categoryName) {
			return new Promise(function(resolve, reject) {
				if (!db) {
					reject(new Error('Bitte zuerst die Datenbank mittels initDb initialisieren'));
					return;
				}
				var transaction = db.transaction([  CATEGORY_STORE_NAME ], "readonly");
				transaction.onerror = function(event) {
				  reject('Fehler beim Laden der Kategorien. ' + event);
				};
				var objectStore = transaction.objectStore(CATEGORY_STORE_NAME);
				var request = objectStore.get(categoryName);
                request.onsuccess = function(event) {
                	var category = event.target.result;
                    resolve(category);
                }
			});
		},
		saveExpanse: function(toSave) {
			return new Promise(function(resolve, reject) {
				if (!db) {
					reject(new Error('Bitte zuerst die Datenbank mittels initDb initialisieren'));
					return;
				}
				var transaction = db.transaction([  EXPANSES_STORE_NAME ], "readwrite");
				transaction.onerror = function(event) {
				  reject('Fehler beim Speichern einer Ausgabe. ' + event);
				};
				var objectStore = transaction.objectStore(EXPANSES_STORE_NAME);
				var request = objectStore.put(toSave);
			    request.onsuccess = function (e) {
        			resolve(e.target.result);
    			};
			});
		},
		loadExpanse: function(expanseId) {
			return new Promise(function(resolve, reject) {
				if (!db) {
					reject(new Error('Bitte zuerst die Datenbank mittels initDb initialisieren'));
					return;
				}
				var transaction = db.transaction([  EXPANSES_STORE_NAME ], "readonly");
				transaction.onerror = function(event) {
				  reject('Fehler beim Laden einer Ausgabe. ' + event);
				};
				var objectStore = transaction.objectStore(EXPANSES_STORE_NAME);
				var request = objectStore.get(expanseId);
			    request.onsuccess = function (e) {
        			resolve(e.target.result);
    			};
			});
		},
		deleteExpanse: function(toDelete) {
			return new Promise(function(resolve, reject) {
				if (!db) {
					reject(new Error('Bitte zuerst die Datenbank mittels initDb initialisieren'));
					return;
				}
				var transaction = db.transaction([  EXPANSES_STORE_NAME ], "readwrite");
				transaction.oncomplete = function(event) {
				  resolve();
				};

				transaction.onerror = function(event) {
				  reject('Fehler beim Löschen einer Ausgabe. ' + event);
				};
				var objectStore = transaction.objectStore(EXPANSES_STORE_NAME);
				objectStore.delete(toDelete.id);
			});
		},
		/**
		 * Sums up the total expanses for a given category within the also given date range
		 * @param {*} category The category to search for
		 * @param {*} startDate The start date (inclusive)
		 * @param {*} endDate The end date (exclusive)
		 * @returns The summed up expanses
		 */
		getTotalExpanseValue(category, startDate, endDate) {
			return new Promise(function(resolve, reject) {
				if (!db) {
					reject(new Error('Bitte zuerst die Datenbank mittels initDb initialisieren'));
					return;
				}
				var transaction = db.transaction([  EXPANSES_STORE_NAME ], "readonly");
				transaction.oncomplete = function(event) {
				  resolve();
				};

				transaction.onerror = function(event) {
				  reject('Fehler beim Lesen der Ausgaben. ' + event);
				};
				var objectStore = transaction.objectStore(EXPANSES_STORE_NAME);
				var request = objectStore.getAll();
                request.onsuccess = function(event) {
                	var expanses = event.target.result.map(function(dbObject) {
            			return new Expanse(dbObject.id, dbObject.text, dbObject.category, dbObject.amount, dbObject.date);
                	});
					var sum = 0.0;
					expanses.forEach((expanse) => {
						if (expanse.category == category.name && 
							expanse.date >= startDate && expanse.date < endDate) {
							sum += expanse.amount;
						}						
					});					
                    resolve(sum);
                }		
			});
		},
		saveSetting: function(name, value) {
			return new Promise(function(resolve, reject) {
				if (!db) {
					reject(new Error('Bitte zuerst die Datenbank mittels initDb initialisieren'));
					return;
				}
				var transaction = db.transaction([  SETTINGS_STORE_NAME ], "readwrite");
				transaction.oncomplete = function(event) {
				  resolve();
				};

				transaction.onerror = function(event) {
				  reject('Fehler beim Speichern einer Einstellung. ' + event);
				};
				var objectStore = transaction.objectStore(SETTINGS_STORE_NAME);
				objectStore.put({ name: name, value: value });
			});
		},	
		getSetting: function(name) {
			return new Promise(function(resolve, reject) {
				if (!db) {
					reject(new Error('Bitte zuerst die Datenbank mittels initDb initialisieren'));
					return;
				}
				var transaction = db.transaction([  SETTINGS_STORE_NAME ], "readonly");
				transaction.onerror = function(event) {
				  reject('Fehler beim Auslesen der Einstellung für ' + name + ' ' + event);
				};
				var objectStore = transaction.objectStore(SETTINGS_STORE_NAME);
				var request = objectStore.get(name);
                request.onsuccess = function(event) {
                	retrievedSetting = event.target.result;
                    resolve(retrievedSetting === undefined ? undefined : event.target.result.value);
                };
			});
		},
		loadExpanses: function() {
			return new Promise(function(resolve, reject) {
				if (!db) {
					reject(new Error('Bitte zuerst die Datenbank mittels initDb initialisieren'));
					return;
				}
				var transaction = db.transaction([  EXPANSES_STORE_NAME ], "readonly");
				transaction.onerror = function(event) {
				  reject('Fehler beim Laden der Ausgaben. ' + event);
				};
				var objectStore = transaction.objectStore(EXPANSES_STORE_NAME);
				var request = objectStore.getAll();
                request.onsuccess = function(event) {
                	var expanses = event.target.result.map(function(dbObject) {
            			return new Expanse(dbObject.id, dbObject.text, dbObject.category, dbObject.amount, dbObject.date);
                	});
    	            expanses.sort(function(exp1, exp2) {
			            if (exp1.date < exp2.date) {
			                return -1;
			            }
			            if (exp1.date > exp2.date) {
			                return 1;
			            }
			            return 0;
		        	});
                    resolve(expanses);
                }				
			});
		}
	};
}();