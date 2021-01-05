var expanseDialogController = {
    registerHandler: function($expanseDialog, moneydao, dataTable) {
        $('.save-expanse-btn').on('click', function() { 
            var existingExpanseId = $expanseDialog.data('expanse-id');
            var toSave;
            if (existingExpanseId === undefined || existingExpanseId === null) {
                toSave = new Expanse(null, expanseDialogController.getExpanseText($expanseDialog), expanseDialogController.getExpanseCategory($expanseDialog), 
                                                expanseDialogController.getExpanseAmount($expanseDialog), expanseDialogController.getExpanseDate($expanseDialog));   
            } else {
                toSave = new Expanse(existingExpanseId, expanseDialogController.getExpanseText($expanseDialog), expanseDialogController.getExpanseCategory($expanseDialog), 
                                                expanseDialogController.getExpanseAmount($expanseDialog), expanseDialogController.getExpanseDate($expanseDialog));   
            }    
            moneydao.saveExpanse(toSave).then(function(newId) {
                toSave.id = newId;
                return moneydao.getSetting('currency');
            }).then(function(currencySetting) {
                if (existingExpanseId !== null) {
                    dataTable.row('.selected').remove().draw(false);
                }
                dataTable.row.add(toSave).draw(false);
                expanseDialogController.clearDialog($expanseDialog);
                expanseDialogController.hideDialog($expanseDialog, moneydao);                                
            });
        });
        $('.abort-expanse-btn').on('click', function() {
            expanseDialogController.hideDialog($expanseDialog, moneydao);
        });          
    },

    showDialog: function($expanseDialog, moneydao, currencySetting, expanseId) {
        if (expanseId === undefined) {
            expanseId = null;
        }
        $expanseDialog.data('expanseId', expanseId);
        var $currencySuffix = $expanseDialog.find('#expanse-currency');
        $currencySuffix.text(currencySetting);
        var $categories = $($expanseDialog.find('#expanse-category'));
        $categories.empty();

        moneydao.loadCategories().then(function(categories) {
            for (var i = 0; i < categories.length; i++) {
                var category = categories[i];
                $categories.append($('<option></option>').text(category.name));
            }            
            if (expanseId !== null) {                
                moneydao.loadExpanse(expanseId).then(function(expanse) {
                   expanseDialogController.setExpanse($expanseDialog, expanse); 
                   $expanseDialog.show();
                });
            } else {
                $expanseDialog.show();    
        }                       
        });      
    },

    hideDialog: function($expanseDialog, moneydao) {
        $expanseDialog.hide();
    },

    getExpanseText: function($expanseDialog) {
        return $expanseDialog.find('#expanse-name').val();
    },

    clearExpanseText: function($expanseDialog) {
        $expanseDialog.find('#expanse-name').val('');
    },

    getExpanseCategory: function($expanseDialog) {
        return $expanseDialog.find('#expanse-category').val();
    },

    getExpanseAmount: function($expanseDialog) {
        return $expanseDialog.find('#expanse-amount')[0].valueAsNumber;
    },

    clearExpanseAmount: function($expanseDialog) {
        $expanseDialog.find('#expanse-amount').val('');
    },    

    getExpanseDate: function($expanseDialog) {
        return $expanseDialog.find('#expanse-date')[0].valueAsDate;
    },

    clearDialog: function($expanseDialog) {
        expanseDialogController.clearExpanseText($expanseDialog);
        expanseDialogController.clearExpanseAmount($expanseDialog);
    },
    setExpanse: function($expanseDialog, expanse) {
      $expanseDialog.find('#expanse-name').val(expanse.text);
      $expanseDialog.find('#expanse-amount').val(expanse.amount);
      $expanseDialog.find('#expanse-date')[0].valueAsDate = expanse.date;  
      $expanseDialog.find('#expanse-category').val(expanse.category);
    }
}