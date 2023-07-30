var settingsController = {
    registerHandler: function($mainArea, moneydao, settings) {
        $mainArea.find('.save-settings-change').on('click', function() {
            var selected = $mainArea.find('.settings-currency option:selected').text();            
            moneydao.saveSetting('currency', selected).then(function() {
                // Next, save the (potentially) updated limit for the current category
                var categoryName = $('.settings-category').find(":selected").val();
                var categoryLimit = $('.category-limit').val();
                if (categoryName != null && categoryName != '') {
                    moneydao.saveCategory(new Category(categoryName, categoryLimit)).then(function() {                    
                        console.log('Category updated');
                        settingsController.showCategories($mainArea, moneydao);
                        $('.category-limit').val('');
                    });    
                }
            });
        });

        var $createCategoryDialog = $('#createCategoryModal');
        createCategoryDialogController.registerHandler($createCategoryDialog, moneydao, settingsController.showCategories.bind(this, $mainArea, moneydao));
        
        $mainArea.find('.add-category').on('click', function() {
            createCategoryDialogController.showDialog($createCategoryDialog);
        });
        $mainArea.find('.remove-category').on('click', function() {
            var selected = $mainArea.find('.settings-category option:selected').text();
            moneydao.removeCategory({ name: selected }).then(function() {
                settingsController.showCategories($mainArea, moneydao);
            });
        });            
    },
    showCategories: function($mainArea, moneydao) {
        var $categories = $($mainArea.find('.settings-category'));
        $categories.empty();
        moneydao.loadCategories().then(function(categories) {
            for (var i = 0; i < categories.length; i++) {
                var category = categories[i];
                $categories.append($("<option data-cat-limit='" + category.catLimit +"'></option>").text(category.name));
            }
            $categories.on('change', function (e) {                
                var $optionSelected = $("option:selected", this);
                updateCategoryLimit($optionSelected);
            });    

            $categories.find('option:selected').each(function(e) {
                updateCategoryLimit($(this));
            });            
            function updateCategoryLimit($option) {
                var catLimit = $option.data("cat-limit");
                $('.category-limit').val(catLimit);
            };
        });
    }
}