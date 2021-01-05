var settingsController = {
    registerHandler: function($mainArea, moneydao) {
        var $newCategoryRow = $mainArea.find('.new-category');
        $mainArea.find('.add-category').on('click', function() {
            $newCategoryRow.toggleClass('d-none');
        });
        $mainArea.find('.change-currency .btn-primary').on('click', function() {
            var selected = $mainArea.find('.settings-currency option:selected').text();
            moneydao.saveSetting('currency', selected);
        });
        $mainArea.find('.new-category .btn-primary').on('click', function() {
            var $newCategoryInput = $mainArea.find('.new-category .new-category-name');
            moneydao.saveCategory( { name: $newCategoryInput.val() }).then(function() {
                settingsController.showCategories($mainArea, moneydao);
                $newCategoryInput.val('');
                $newCategoryRow.toggleClass('d-none');
            });
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
                $categories.append($('<option></option>').text(category.name));
            }
        });
    }
}