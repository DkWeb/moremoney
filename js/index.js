window.onload = function() {
    var lang = langDetector.detect();
    $('.i18n').each(function() {
        var key = $(this).data("i18n");
        $(this).html(i18n.text(key, lang));
    });
    moneydao.initDb().then(function() {
        console.log('Datenbank erfolgreich initialisiert');
    }).then(function() {
        return moneydao.getSetting('currency');  
    }).then(function(currency) {
        if (currency === undefined) {
            return moneydao.saveSetting('currency', '€');
        }
    }).then(function() {
        $('#appNavBar a').on('click', function() {
            var selectedTemplateClass = $(this).data('open');
            var $mainArea = $('.main-area');
            $mainArea.empty();
            $mainArea.append($('.template.' + selectedTemplateClass).html());
            $mainArea.find('.template.' + selectedTemplateClass).removeClass('template');
            if (selectedTemplateClass === 'settings') {
                settingsController.registerHandler($mainArea, moneydao);
                settingsController.showCategories($mainArea, moneydao);
            } else if (selectedTemplateClass === 'export') {
                var btnExport = $('.export-to-csv-btn');
                btnExport.on('click', function() {
                    var selectedCurrrency = 'undefined';
                    moneydao.getSetting('currency').then(function(currency) {
                        selectedCurrrency = currency;
                        return moneydao.loadExpanses();
                    }).then(function(expanses) {
                        var language = langDetector.detect();
                        var csv = "item;categeory;amount;date\n";
                        for (var i = 0; i < expanses.length; i++) {
                            var expanse = expanses[i];
                            csv += expanse.text + ";" + expanse.category + ";";
                            csv += i18nFormatter.formatAmount(expanse.amount, selectedCurrrency,language) + ";";
                            csv += i18nFormatter.formatDate(expanse.date, language) + "\n";
                        }
                        const blob = new Blob([csv]);
                        const a = document.createElement('a');
                        a.href = URL.createObjectURL(blob, { type: 'text/csv' });
                        a.download = 'moremoney_export.csv';    
                        $($mainArea)[0].appendChild(a);
                        a.click();
                        $($mainArea)[0].removeChild(a);                        
                    });
                });
            } else if (selectedTemplateClass === 'expanses') {
                var selectedCurrency = 'empty';
                moneydao.getSetting('currency').then(function(currencySetting) {
                    selectedCurrency = currencySetting;
                    return moneydao.loadExpanses();    
                }).then(function(expanses) {
                    var dataSet = expanses;
                    $.fn.dataTable.moment('DD.MM.YYYY');
                    var table = $('#expanses-table').DataTable({
                                                data: dataSet,
                                                order: [[ 2, "desc" ]],
                                                rowId: 'id',
                                                footerCallback: function(tfoot, data, start, end, display) {                                                     
                                                    var overallTotal = display.reduce(function(total, rowIdx) {
                                                        return total + data[rowIdx].amount;
                                                    }, 0);
                                                    var pageTotal = 0;
                                                    for (var i = start;i < end;i++) {
                                                        var displayIndex = display[i];
                                                        pageTotal += data[displayIndex].amount;
                                                    }
                                                    $('#total-page-amount').html(i18n.text('expansePage.total', langDetector.detect()) + ' ' + i18nFormatter.formatAmount(pageTotal, selectedCurrency, langDetector.detect()));
                                                    if (pageTotal == overallTotal) {
                                                        $('#total-amount').parent().hide();                                                            
                                                    } else {
                                                        $('#total-amount').html(i18n.text('expansePage.overallTotal', langDetector.detect()) + ' ' + i18nFormatter.formatAmount(overallTotal, selectedCurrency, langDetector.detect()));
                                                    }                                                        
                                                },

                                                initComplete: function(){
                                                    var language = langDetector.detect();
                                                    var modifyExpanseBtns = '<div class="row">';
                                                    modifyExpanseBtns += '<div class="col-sm-12 col-md-4"><button type="button" class="btn-primary btn mb-3 expanse-btn" id="new-expanse-btn">' + i18n.text('expansePage.newExpanse', language) + '</button></div>';
                                                    modifyExpanseBtns += '<div class="col-sm-12 col-md-4"><button type="button" class="btn-primary btn center-block mb-3 expanse-btn" id="edit-expanse-btn">' + i18n.text('expansePage.editExpanse', language) + '</button></div>';
                                                    modifyExpanseBtns += '<div class="col-sm-12 col-md-4"><button type="button" class="btn-primary btn center-block expanse-btn" id="delete-expanse-btn">' + i18n.text('expansePage.deleteExpanse', language) + '</button></div>';
                                                    modifyExpanseBtns += '</div>';
                                                    $("#expanses-table_length").append(modifyExpanseBtns);
                                                    var $newExpanseBtn = $('#new-expanse-btn');                                                    
                                                    var $expanseModal = $('#expanseModal');
                                                    expanseDialogController.registerHandler($expanseModal, moneydao, $('#expanses-table').DataTable());
                                                    $newExpanseBtn.on('click', function() {                                                        
                                                        expanseDialogController.showDialog($expanseModal, moneydao, selectedCurrency);
                                                    });

                                                    var $editExpanseBtn = $('#edit-expanse-btn');
                                                    var $deleteExpanseBtn = $('#delete-expanse-btn');                                                    
                                                    $editExpanseBtn.prop('disabled', true);
                                                    $deleteExpanseBtn.prop('disabled', true);
                                                    $('#expanses-table tbody').on('click', 'tr', function () {
                                                        if ($(this).hasClass('selected')) {
                                                            $(this).removeClass('selected');
                                                            $editExpanseBtn.prop('disabled', true);
                                                            $deleteExpanseBtn.prop('disabled', true);
                                                        } else {
                                                            table.$('tr.selected').removeClass('selected');
                                                            $(this).addClass('selected');
                                                            $editExpanseBtn.prop('disabled', false);
                                                            $deleteExpanseBtn.prop('disabled', false);
                                                        }
                                                    }); 
                                                    $deleteExpanseBtn.click( function () {
                                                        var selectedRow = table.row('.selected');
                                                        var selectedExpanseId = Number.parseInt(selectedRow.id());
                                                        moneydao.deleteExpanse(new Expanse(selectedExpanseId)).then(function() {
                                                            selectedRow.remove().draw(false);
                                                            $deleteExpanseBtn.prop('disabled', true);   
                                                        });
                                                    });
                                                    $editExpanseBtn.click( function () {
                                                        var selectedRow = table.row('.selected');
                                                        var selectedExpanseId = Number.parseInt(selectedRow.id());
                                                        expanseDialogController.showDialog($expanseModal, moneydao, selectedCurrency, selectedExpanseId)
                                                    });


                                                    $("#expanses-table_length").closest('div').addClass('mb-3');
                                                },       
                                                "columnDefs": [
                                                    {
                                                        "title": i18n.text("expansePage.item", langDetector.detect()),
                                                        "render": function (data, type, row) {
                                                            return row.text;
                                                        },
                                                        responsivePriority: 2,
                                                        "targets": 0
                                                    },
                                                    {
                                                        "title": i18n.text("expansePage.amount", langDetector.detect()),
                                                        "render": function (data, type, row) {
                                                            if (type === 'display') {
                                                                return i18nFormatter.formatAmount(row.amount, selectedCurrency, langDetector.detect());
                                                            }
                                                            return row.amount;
                                                        },
                                                        responsivePriority: 3,
                                                        "targets": 1
                                                    },
                                                    {
                                                        "title": i18n.text("expansePage.date", langDetector.detect()),
                                                        "render": function (data, type, row) {
                                                            if (type === 'display') {
                                                                return i18nFormatter.formatDate(row.date, langDetector.detect());
                                                            } else if (type === 'filter') {
                                                                return i18nFormatter.formatDate(row.date, langDetector.detect());
                                                            }
                                                            return row.date;
                                                        },
                                                        responsivePriority: 1,
                                                        "targets": 2
                                                    },
                                                    {
                                                        "title": i18n.text("expansePage.category", langDetector.detect()),
                                                        "render": function (data, type, row) {
                                                            return row.category;
                                                        },
                                                        responsivePriority: 4,
                                                        "targets": 3
                                                    },
                                                ],                                               
                                                language: i18n.dataTables(langDetector.detect()),
                                                responsive: true
                                            });                
                });                            
            }
            $('#appNavBar').collapse('hide');
        });
    }).then(function() {
        $("#appNavBar li").find("[data-open='expanses']").click(); 
    });    
};