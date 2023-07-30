var createCategoryDialogController = {
    registerHandler: function($createCategoryDialog, moneydao, updateCategoriesFunc) {
        $('.create-category-btn').on('click', function() { 
            var newCategoryName =  createCategoryDialogController.getCategoryName($createCategoryDialog);
            var newCategoryLimit = createCategoryDialogController.getCategoryLimit($createCategoryDialog);
            moneydao.saveCategory(new Category(newCategoryName, newCategoryLimit)).then(function() {
                createCategoryDialogController.hideDialog($createCategoryDialog);
                createCategoryDialogController.clearDialog($createCategoryDialog);
            }).then(function(category) {
                console.log("Finished saving category " +  category);
                updateCategoriesFunc.call();
            });                
        });
        $('.abort-create-category-btn').on('click', function() {
            createCategoryDialogController.hideDialog($createCategoryDialog, moneydao);
        });          
    },

    showDialog: function($createCategoryDialog) {  
        $createCategoryDialog.show();  
    },

    hideDialog: function($createCategoryDialog) {
        $createCategoryDialog.hide();
    },

    getCategoryName: function($createCategoryDialog) {
        return $createCategoryDialog.find('.new-category-name').val();
    },

    getCategoryLimit: function($createCategoryDialog) {
        return $createCategoryDialog.find('.new-category-limit').val();
    },

    clearCategoryName: function($createCategoryDialog) {
        return $createCategoryDialog.find('.new-category-name').val('');
    },

    clearCategoryLimit: function($createCategoryDialog) {
        return $createCategoryDialog.find('.new-category-limit').val('');
    },    

    clearDialog: function($createCategoryDialog) {
        createCategoryDialogController.clearCategoryName($createCategoryDialog);
        createCategoryDialogController.clearCategoryLimit($createCategoryDialog);
    }
}