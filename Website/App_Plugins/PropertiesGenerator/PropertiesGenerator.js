
angular.module("umbraco.resources").factory("propertiesGeneratorResource", function ($http) {

    var cache = {};
    var idCounter = 0;

    return {
        // if throws javascript error and json file exists - validate your json file: http://jsonlint.com/
        getProperties: function (alias) {
            return $http.get('../App_plugins/PropertiesGenerator/properties/' + alias + '.json');
        },
        rteConfig: {
            all: {
                "dimensions": {
                    "height": 500
                },
                "maxImageSize": 500,
                "stylesheets": [],
                "toolbar": [
                    "code",
                    "codemirror",
                    "removeformat",
                    "undo",
                    "redo",
                    "cut",
                    "copy",
                    "paste",
                    "styleselect",
                    "bold",
                    "italic",
                    "underline",
                    "strikethrough",
                    "alignleft",
                    "aligncenter",
                    "alignright",
                    "alignjustify",
                    "bullist",
                    "numlist",
                    "outdent",
                    "indent",
                    "link",
                    "unlink",
                    "anchor",
                    "umbmediapicker",
                    //"umbmacro",
                    "table",
                    "umbembeddialog",
                    "hr",
                    "subscript",
                    "superscript",
                    "charmap",
                    "fontselect",
                    "fontsizeselect",
                    "forecolor",
                    "fullscreen"
                ]
            },
            general: {
                "dimensions": {
                    "height": 500
                },
                "maxImageSize": 500,
                "stylesheets": [],
                "toolbar": [
                    "code",
                    "codemirror",
                    "removeformat",
                    "undo",
                    "redo",
                    "cut",
                    "copy",
                    "paste",
                    "styleselect",
                    "bold",
                    "italic",
                    "underline",
                    "strikethrough",
                    "alignleft",
                    "aligncenter",
                    "alignright",
                    "alignjustify",
                    "bullist",
                    "numlist",
                    "outdent",
                    "indent",
                    "link",
                    "unlink",
                    "anchor",
                    "umbmediapicker",
                    "table",
                    "umbembeddialog",
                    "hr",
                    "subscript",
                    "superscript",
                    "charmap",
                    "fontselect",
                    "fontsizeselect",
                    "forecolor",
                    "fullscreen"
                ]
            }
        },
        getDropdown: function (method, property, onSuccess) {
            var key = 'dropdown.' + method;
            if (cache[key])
                return onSuccess(cache[key]);

            return $http.post("backoffice/propertiesGenerator/dropdown/" + method + "/", property).success(function (data) {
                cache[key] = data;
                onSuccess(data);
            });
        },
        setItemId: function (item) {
            if (item && !item.id) {
                item.id = idCounter++;
            }
        }
    }

});

angular.module("umbraco.directives").directive('propertiesGeneratorFieldEmbed', function () {
    return {
        restrict: 'E',
        replace: true,
        template: '<span class="field-embed">' +
            '<span><i class="icon icon-add blue"></i><a ng-click="openEmbed()" prevent-default>Select</a></span>' +
            '<span ng-if="model[property.alias].preview"><i class="icon icon-delete red"></i><a ng-click="remove()" prevent-default>Remove</a></span>' +
            '<div ng-if="model[property.alias].preview" ng-bind-html-unsafe="model[property.alias].preview"></div>' +
            '<umb-overlay ' +
                'ng-if="embedOverlay.show" ' +
                'model="embedOverlay" ' +
                'position="right" ' +
                'view="embedOverlay.view">' +
            '</umb-overlay>' +
        '</span>',
        scope: {
            model: '=',
            property: '=',
            validations: '='
        },
        link: function (scope, element, attrs) {

            if (!scope.model[scope.property.alias])
                scope.model[scope.property.alias] = {};

            var setSrc = function () {
                var preview = scope.model[scope.property.alias].preview;

                var ind = preview.indexOf('src');

                if (ind >= 0) {
                    preview = preview.substr(ind);

                    ind = preview.indexOf('"');
                    preview = preview.substr(ind);
                    ind = preview.indexOf('"', 1);
                    
                    scope.model[scope.property.alias].src = preview.substr(1, ind - 1);
                }
            }

            scope.openEmbed = function (editor) {
                scope.embedOverlay = {
                    view: "embed",
                    show: true,
                    submit: function (model) {
                        scope.model[scope.property.alias] = model.embed;
                        setSrc();
                        scope.embedOverlay.show = false;
                        scope.embedOverlay = null;
                    }
                };
            };

            scope.remove = function () {
                scope.model[scope.property.alias] = {};
            }
        }
    }
});

angular.module("umbraco.directives").directive('propertiesGeneratorFieldDecimal', function () {
    return {
        restrict: 'E',
        replace: true,
        template: '<span>' +
            '<input type="text" ng-model="model[property.alias]" properties-generator-validate />' +
        '</span>',
        scope: {
            model: '=',
            property: '=',
            validations: '='
        },
        link: function (scope, element, attrs) {

            scope.property.validate.typeFunction = function (val, model) {

                if (!val)
                    return null;

                val = parseFloat(val);

                if (isNaN(val))
                    return 'Invalid number';

                model[scope.property.alias] = val;

                var min = parseFloat(scope.property.validate.min);
                var max = parseFloat(scope.property.validate.max);

                if (!isNaN(min) && val < min)
                    return 'Minimum value is ' + min;

                if (!isNaN(max) && val > max)
                    return 'Maximum value is ' + max;

                return null;
            };

            $(element).find('input').keypress(function (event) {
                var keyCode = event.charCode || event.keyCode;
                if ((keyCode >= 48 && keyCode <= 57)
                    || keyCode == 8
                    || keyCode == 37
                    || keyCode == 39
                    || keyCode == '-'.charCodeAt(0)
                    || keyCode == '.'.charCodeAt(0))
                    return true;

                return false;
            });

        }
    }
});

angular.module("umbraco.directives").directive('propertiesGeneratorFieldInteger', function () {
    return {
        restrict: 'E',
        replace: true,
        template: '<span>' +
            '<input type="text" ng-model="model[property.alias]" properties-generator-validate />' +
        '</span>',
        scope: {
            model: '=',
            property: '=',
            validations: '='
        },
        link: function (scope, element, attrs) {

            scope.property.validate.typeFunction = function (val, model) {

                if (!val)
                    return null;

                val = parseInt(val, 10);

                if (isNaN(val))
                    return 'Invalid number';

                model[scope.property.alias] = val;

                var min = parseInt(scope.property.validate.min, 10);

                if (isNaN(min)) {
                    min = -9223372036854775808;
                }

                var max = parseInt(scope.property.validate.max, 10);

                if (isNaN(max)) {
                    max = 9223372036854775807;
                }

                if (val < min)
                    return 'Minimum value is ' + min;

                if (val > max)
                    return 'Maximum value is ' + max;

                return null;
            };

            $(element).find('input').keypress(function (event) {
                var keyCode = event.charCode || event.keyCode;
                if ((keyCode >= 48 && keyCode <= 57)
                    || keyCode == 8
                    || keyCode == 37
                    || keyCode == 39
                    || keyCode == '-'.charCodeAt(0))
                    return true;

                return false;
            });

        }
    }
});

angular.module("umbraco.directives").directive('propertiesGeneratorFieldDatepicker', function (assetsService, angularHelper, userService) {
    return {
        restrict: 'E',
        replace: true,
        template: '<span>' +
            //'<input type="text" ng-model="model[property.alias]" properties-generator-validate />' +
'<div class="umb-editor umb-datepicker">' +
    '<ng-form name="datePickerForm">' +
        '<div class="input-append date datepicker" style="position: relative;" id="datepicker_{{property.id}}">' +
            '<input name="datepicker" data-format="{{property.config.format}}" id="datepicker_input_{{property.id}}" type="text" ng-model="datetimePickerValue" class="datepickerinput" />' +
            '<span class="add-on">' +
                '<i class="icon-calendar"></i>' +
            '</span>' +
        '</div>' +
        '<p ng-show="hasDatetimePickerValue">' +
            '<a href ng-click="clearDate()"><i class="icon-delete"></i><small><localize key="content_removeDate">Clear date</localize></small></a>' +
        '</p>' +
    '</ng-form>' +
'</div>' +
        '</span>',
        scope: {
            model: '=',
            property: '=',
            validations: '='
        },
        link: function (scope, element, attrs) {

            //setup the default config
            var config = {
                pickDate: true,
                pickTime: true,
                useSeconds: true,
                format: "YYYY-MM-DD HH:mm:ss",
                icons: {
                    time: "icon-time",
                    date: "icon-calendar",
                    up: "icon-chevron-up",
                    down: "icon-chevron-down"
                }

            };

            //map the user config
            scope.property.config = angular.extend(config, scope.property.config);
            //ensure the format doesn't get overwritten with an empty string
            if (scope.property.config.format === "" || scope.property.config.format === undefined || scope.property.config.format === null) {
                scope.property.config.format = scope.property.config.pickTime ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD";
            }

            scope.hasDatetimePickerValue = scope.model[scope.property.alias] ? true : false;
            scope.datetimePickerValue = null;

            //hide picker if clicking on the document 
            scope.hidePicker = function () {
                // Sometimes the statement above fails and generates errors in the browser console. The following statements fix that.
                var dtp = element.find(".datepicker");
                if (dtp && dtp.datetimepicker) {
                    dtp.datetimepicker("hide");
                }
            };
            $(document).bind("click", scope.hidePicker);

            //handles the date changing via the api
            function applyDate(e) {
                angularHelper.safeApply(scope, function () {
                    // when a date is changed, update the model
                    if (e.date && e.date.isValid()) {
                        scope.datePickerForm.datepicker.$setValidity("pickerError", true);
                        scope.hasDatetimePickerValue = true;
                        scope.datetimePickerValue = e.date.format(scope.property.config.format);
                        scope.model[scope.property.alias] = scope.datetimePickerValue;
                    }
                    else {
                        scope.hasDatetimePickerValue = false;
                        scope.datetimePickerValue = null;
                    }

                    if (!scope.property.config.pickTime) {
                        element.find(".datepicker").datetimepicker("hide", 0);
                    }
                });
            }

            var picker = null;

            scope.clearDate = function () {
                scope.hasDatetimePickerValue = false;
                scope.datetimePickerValue = null;
                scope.model[scope.property.alias] = null;
                scope.datePickerForm.datepicker.$setValidity("pickerError", true);
            }

            //get the current user to see if we can localize this picker
            userService.getCurrentUser().then(function (user) {

                assetsService.loadCss('lib/datetimepicker/bootstrap-datetimepicker.min.css').then(function () {

                    var filesToLoad = ["lib/moment/moment-with-locales.js",
                                       "lib/datetimepicker/bootstrap-datetimepicker.js"];


                    scope.property.config.language = user.locale;


                    assetsService.load(filesToLoad, scope).then(
                        function () {
                            //The Datepicker js and css files are available and all components are ready to use.

                            // Get the id of the datepicker button that was clicked
                            var pickerId = scope.model.alias;

                            var datepickerElement = element.find(".datepicker");

                            // Open the datepicker and add a changeDate eventlistener
                            datepickerElement
                                .datetimepicker(angular.extend({ useCurrent: true }, scope.property.config))
                                .on("dp.change", applyDate)
                                .on("dp.error", function (a, b, c) {
                                    scope.hasDatetimePickerValue = false;
                                    scope.datePickerForm.datepicker.$setValidity("pickerError", false);
                                });

                            if (scope.hasDatetimePickerValue) {
                                //assign value to plugin/picker
                                var dateVal = scope.model[scope.property.alias] ? moment(scope.model[scope.property.alias], "YYYY-MM-DD HH:mm:ss") : moment();

                                datepickerElement.datetimepicker("setValue", dateVal);
                                scope.datetimePickerValue = dateVal.format(scope.property.config.format);
                            }

                            datepickerElement.find("input").bind("blur", function () {
                                var elementData = element.find(".datepicker").data().DateTimePicker;
                                applyDate(elementData);

                                //we need to force an apply here
                                scope.$apply();
                            });

                            //Ensure to remove the event handler when this instance is destroyted
                            scope.$on('$destroy', function () {
                                datepickerElement.find("input").unbind("blur");
                                datepickerElement.datetimepicker("destroy");
                            });


                            //var unsubscribe = function () {
                            //    if (scope.hasDatetimePickerValue) {
                            //        var elementData = element.find(".datepicker").data().DateTimePicker;
                            //        if (scope.property.config.pickTime) {
                            //            scope.model[scope.property.alias] = elementData.getDate().format("YYYY-MM-DD HH:mm:ss");
                            //        }
                            //        else {
                            //            scope.model[scope.property.alias] = elementData.getDate().format("YYYY-MM-DD");
                            //        }
                            //    }
                            //    else {
                            //        scope.model[scope.property.alias] = null;
                            //    }
                            //};

                            ////unbind doc click event!
                            //scope.$on('$destroy', function () {
                            //    unsubscribe();
                            //});


                        });
                });

            });

            //var unsubscribe = function () {
            //    if (scope.hasDatetimePickerValue) {
            //        if (scope.property.config.pickTime) {
            //            scope.model[scope.property.alias] = element.find(".datepicker").data().DateTimePicker.getDate().format("YYYY-MM-DD HH:mm:ss");
            //        }
            //        else {
            //            scope.model[scope.property.alias] = element.find(".datepicker").data().DateTimePicker.getDate().format("YYYY-MM-DD");
            //        }
            //    }
            //    else {
            //        scope.model[scope.property.alias] = null;
            //    }
            //};

            ////unbind doc click event!
            //scope.$on('$destroy', function () {
            //    $(document).unbind("click", scope.hidePicker);
            //    unsubscribe();
            //});

        }
    }
});

angular.module("umbraco.directives").directive('propertiesGeneratorFieldDate', function () {
    return {
        restrict: 'E',
        replace: true,
        template: '<span>' +
            '<input type="text" ng-model="model[property.alias]" properties-generator-validate />' +
        '</span>',
        scope: {
            model: '=',
            property: '=',
            validations: '='
        },
        link: function (scope, element, attrs) {

            var getFormat = function () {
                if (scope.property.validate.format)
                    return scope.property.validate.format;

                return 'dd/MM/yyyy';
            }

            var tryParseDate = function (datetime, format) {

                var errorResponse = {
                    success: false,
                    date: null,
                    formatedDate: null
                }

                var fillNumber = function (number, digits) {
                    number = String(number);

                    while (number.length < digits) {
                        number = '0' + number;
                    }

                    return number;
                }

                datetime = $.trim(datetime).replace(new RegExp(' +', 'g'), ' ');
                var year, month, date, hours, minutes, seconds;

                var index = format.indexOf('yyyy');
                if (index >= 0) {
                    year = parseInt(datetime.substr(index, 4), 10);
                    if (isNaN(year) || year < 1900 || year > 2050)
                        return errorResponse;
                }
                else {
                    index = format.indexOf('yy');
                    if (index >= 0) {
                        year = parseInt(datetime.substr(index, 2), 10);
                        if (isNaN(year))
                            return errorResponse;
                    }
                    else {
                        return errorResponse;
                    }
                }

                var index = format.indexOf('MM');
                if (index >= 0) {
                    month = parseInt(datetime.substr(index, 2), 10);
                    if (isNaN(month) || month < 1 || month > 12)
                        return errorResponse;
                }
                else {
                    return errorResponse;
                }

                var index = format.indexOf('dd');
                if (index >= 0) {
                    date = parseInt(datetime.substr(index, 2), 10);
                    if (isNaN(date) || date < 1 || date > 31)
                        return errorResponse;
                }
                else {
                    return errorResponse;
                }

                var index = format.indexOf('hh');
                if (index >= 0) {
                    if (index + 2 < datetime.length) {
                        hours = parseInt(datetime.substr(index, 2), 10);
                        if (isNaN(hours) || hours < 0 || hours > 23)
                            return errorResponse;
                    }
                    else {
                        hours = 0;
                    }
                }

                var index = format.indexOf('mm');
                if (index >= 0) {
                    if (index + 2 < datetime.length) {
                        minutes = parseInt(datetime.substr(index, 2), 10);
                        if (isNaN(minutes) || minutes < 0 || minutes > 59)
                            return errorResponse;
                    }
                    else {
                        minutes = 0;
                    }
                }

                var index = format.indexOf('ss');
                if (index >= 0) {
                    if (index + 2 < datetime.length) {
                        seconds = parseInt(datetime.substr(index, 2), 10);
                        if (isNaN(seconds) || seconds < 0 || seconds > 59)
                            return errorResponse;
                    }
                    else {
                        seconds = 0;
                    }
                }

                var dateObj = new Date(year, month - 1, date);

                if (hours != undefined || minutes != undefined || seconds != undefined) {
                    hours = hours || 0;
                    minutes = minutes || 0;
                    seconds = seconds || 0;

                    dateObj = new Date(year, month - 1, date, hours, minutes, seconds);
                }

                var dateStr = format.replace('yyyy', fillNumber(dateObj.getFullYear(), 4));
                dateStr = dateStr.replace('yy', fillNumber(dateObj.getYear(), 2));
                dateStr = dateStr.replace('MM', fillNumber(dateObj.getMonth() + 1, 2));
                dateStr = dateStr.replace('dd', fillNumber(dateObj.getDate(), 2));
                dateStr = dateStr.replace('hh', fillNumber(dateObj.getHours(), 2));
                dateStr = dateStr.replace('mm', fillNumber(dateObj.getMinutes(), 2));
                dateStr = dateStr.replace('ss', fillNumber(dateObj.getSeconds(), 2));

                return {
                    success: true,
                    date: dateObj,
                    formatedDate: dateStr
                }
            }

            scope.property.validate.typeFunction = function (val, model) {

                if (!val)
                    return null;

                var format = getFormat();
                var response = tryParseDate(val, getFormat());

                if (!response.success)
                    return 'Invalid date or format (' + format + ')';

                model[scope.property.alias] = response.formatedDate;

                return null;
            };

            $(element).find('input').keypress(function (event) {
                var keyCode = event.charCode || event.keyCode;
                if ((keyCode >= 48 && keyCode <= 57)
                    || keyCode == 8
                    || keyCode == 37
                    || keyCode == 39)
                    return true;

                var format = getFormat();
                var allowedChars = format.replace('yyyy', '').replace('yy', '').replace('MM', '').replace('dd', '').replace('hh', '').replace('mm', '').replace('ss', '');

                if (allowedChars.indexOf(String.fromCharCode(keyCode)) >= 0)
                    return true;

                return false;
            });

        }
    }
});

angular.module("umbraco.directives").directive('propertiesGeneratorFieldDropdown', function (propertiesGeneratorResource) {
    return {
        restrict: 'E',
        replace: true,
        template: '<span class="field-dropdown">' +
                    '<select ng-options="item as item.label for item in items track by item.value" ng-model="selectedItem" ng-change="onChanged()" properties-generator-validate></select>' +
                '</span>',
        scope: {
            property: '=',
            model: '=',
            validations: '='
        },
        link: function (scope, element, attrs) {

            scope.selectedItem = null;
            scope.items = [];

            scope.init = function () {

                var onitemsRetrieve = function () {

                    if (scope.items && scope.items.length) {

                        for (var i = 0; i < scope.items.length; i++) {
                            var item = scope.items[i];

                            if (item.value == scope.model[scope.property.alias]) {
                                scope.selectedItem = item;
                                break;
                            }
                        }

                        if (!scope.selectedItem) {
                            scope.selectedItem = scope.items[0];
                            scope.model[scope.property.alias] = scope.selectedItem.value;
                        }

                    }
                }

                if (Array.isArray(scope.property.datasource)) {
                    scope.items = scope.property.datasource;
                    onitemsRetrieve();
                }
                else {

                    propertiesGeneratorResource.getDropdown(scope.property.datasource, scope.property, function (data) {
                        scope.items = data;
                        onitemsRetrieve();
                    });
                }

            }

            scope.onChanged = function () {
                scope.model[scope.property.alias] = scope.selectedItem.value;
            }

            scope.init();
        }
    }
});

angular.module("umbraco.directives").directive('propertiesGeneratorFieldRadio', function () {
    return {
        restrict: 'E',
        replace: true,
        template: '<span class="field-radio">' +
                    '<div ng-repeat="prevalue in property.prevalues track by $index">' +
                        '<input type="radio" ng-value="prevalue.alias" ng-model="model[property.alias]" /><label>{{ prevalue.name }}</label>' +
                    '</div>' +
                '</span>',
        scope: {
            property: '=',
            model: '='
        },
        link: function (scope, element, attrs) {

            if (!scope.model[scope.property.alias] && scope.property.prevalues && scope.property.prevalues.length)
                scope.model[scope.property.alias] = scope.property.prevalues[0].alias;
        }
    }
});

angular.module("umbraco.directives").directive('propertiesGeneratorFieldRte', function (dialogService, contentResource, propertiesGeneratorResource, tinyMceService) {
    return {
        restrict: 'E',
        replace: true,
        template: '<span class="field-rte">' +
                    '<div ' +
		                'grid-rte ' +
                        'configuration="configuration" ' +
                        'value="model[property.alias]" ' +
                        'unique-id="$id" ' +
                        'on-link-picker-click="openLinkPicker" ' + // TODO
                        'on-media-picker-click="openMediaPicker" ' + // TODO
                        'on-embed-click="openEmbed" ' + // TODO
                        'on-macro-picker-click="openMacroPicker">' + // TODO
                    '</div>' +
                    '<umb-overlay ' +
	                    'ng-if="mediaPickerOverlay.show" ' +
	                    'model="mediaPickerOverlay" ' +
                        'position="right" ' +
                        'view="mediaPickerOverlay.view">' +
                    '</umb-overlay> ' +
                        '<umb-overlay ' +
                        'ng-if="embedOverlay.show" ' +
                        'model="embedOverlay" ' +
                        'position="right" ' +
                        'view="embedOverlay.view">' +
                        '</umb-overlay>' +
                  '</span>',
        scope: {
            property: '=',
            model: '='
        },
        link: function (scope, element, attrs) {
            if (scope.property.config && propertiesGeneratorResource.rteConfig[scope.property.config])
                scope.configuration = propertiesGeneratorResource.rteConfig[scope.property.config];
            else
                scope.configuration = propertiesGeneratorResource.rteConfig.general;

            scope.openMediaPicker = function (editor, currentTarget, userData) {

                scope.mediaPickerOverlay = {
                    currentTarget: currentTarget,
                    onlyImages: true,
                    showDetails: true,
                    startNodeId: userData.startMediaId,
                    view: "mediapicker",
                    show: true,
                    submit: function (model) {
                        tinyMceService.insertMediaInEditor(editor, model.selectedImages[0]);
                        scope.mediaPickerOverlay.show = false;
                        scope.mediaPickerOverlay = null;
                    }
                };
            }

            scope.openEmbed = function (editor) {
                scope.embedOverlay = {
                    view: "embed",
                    show: true,
                    submit: function (model) {
                        tinyMceService.insertEmbeddedMediaInEditor(editor, model.embed.preview);
                        scope.embedOverlay.show = false;
                        scope.embedOverlay = null;
                    }
                };
            };

        }
    }
});

angular.module("umbraco.directives").directive('propertiesGeneratorFieldList', function () {
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="fieldList"><ul ui-sortable="sortableOptions" ng-model="model[property.alias]">' +
            '<li ng-repeat="item in model[property.alias] track by $index" class="fieldListItem">' +
                '<span ng-click="selectItem(item)">{{ getListItemHeader(item, $index) }}' +
                '<i class="icon right icon-navigation ui-sortable-handle"></i>' +
                '<i ng-if="isRemove()" ng-click="removeItem($index, $event)" class="icon right icon-delete"></i>' +
                '</span>' +
                '<div ng-show="item == selectedItem">' +
                    '<properties-generator-field ng-repeat="subProperty in getItemProperties($index)" property="subProperty" model="item" validations="validations"></properties-generator-field>' +
                '</div>' +
            '</li>' +
            '</ul><i ng-click="addItem($event)" class="icon right icon-add" ng-if="isAdd()"></i><div class="clear"></div></div>',
        scope: {
            property: '=',
            model: '=',
            validations: '='
        },
        link: function (scope, element, attrs) {

            scope.itemProperties = [];

            scope.init = function () {

                if (!scope.model[scope.property.alias])
                    scope.model[scope.property.alias] = [];

                if (scope.property.validate && scope.property.validate.min) {
                    while (scope.model[scope.property.alias].length < scope.property.validate.min.value)
                        scope.model[scope.property.alias].push({});
                }
            }

            scope.getItemProperties = function (index) {
                if (!scope.itemProperties[index])
                    scope.itemProperties[index] = angular.copy(scope.property.properties);

                return scope.itemProperties[index]
            }

            scope.getListItemHeader = function (item, index) {

                if (scope.property.headerProperty) {
                    try {
                        var header = eval('item.' + scope.property.headerProperty)
                        if (header)
                            return header;
                    }
                    catch (e) { }
                }

                return 'item' + (index + 1);
            }

            scope.addItem = function (event) {
                event.preventDefault();
                event.stopPropagation();
                scope.model[scope.property.alias].push({});
                scope.selectedItem = scope.model[scope.property.alias][scope.model[scope.property.alias].length - 1];
            }

            scope.selectItem = function (item) {
                if (scope.selectedItem != item)
                    scope.selectedItem = item;
                else
                    scope.selectedItem = null;
            }

            scope.removeItem = function (index, event) {
                event.preventDefault();
                event.stopPropagation();
                scope.model[scope.property.alias].splice(index, 1);
            }

            scope.isAdd = function () {
                if (scope.property.validate && scope.property.validate.max)
                    return scope.model[scope.property.alias].length < scope.property.validate.max.value;

                return true;
            }

            scope.isRemove = function () {
                if (scope.property.validate && scope.property.validate.min) {
                    return scope.model[scope.property.alias].length > scope.property.validate.min.value;
                }

                return true;
            }

            scope.sortableOptions = {
                handle: ".icon-navigation",
                axis: "y",
                delay: 150,
                distance: 5
            };

            scope.init();
        }
    }
});

angular.module("umbraco.directives").directive('propertiesGeneratorFieldVideo', function (dialogService, mediaHelper, mediaResource) {
    return {
        restrict: 'E',
        replace: true,
        template: '<span class="field-video">' +
                    '<div>' +
                        '<label>Mp4:</label>' +
                        '<a href="#" prevent-default ng-click="pickVideo(\'mp4\')" ng-if="!getVideo(\'mp4\')">Choose...</a>' +
                        '<span ng-if="getVideo(\'mp4\')">' +
                            '<a href="#" prevent-default ng-click="pickVideo(\'mp4\')">{{ getVideo(\'mp4\').name }}</a>' +
                            '<i class="icon icon-delete red" ng-click="removeVideo($event, \'mp4\')"></i>' +
                        '</span>' +
                    '<div>' +
                    '<div>' +
                        '<label>Ogg:</label>' +
                        '<a href="#" prevent-default ng-click="pickVideo(\'ogg\')" ng-if="!getVideo(\'ogg\')">Choose...</a>' +
                        '<span ng-if="getVideo(\'ogg\')">' +
                            '<a href="#" prevent-default ng-click="pickVideo(\'ogg\')">{{ getVideo(\'ogg\').name }}</a>' +
                            '<i class="icon icon-delete red" ng-click="removeVideo($event, \'ogg\')"></i>' +
                        '</span>' +
                    '<div>' +

                    '<div>' +
                        '<label>Webm:</label>' +
                        '<a href="#" prevent-default ng-click="pickVideo(\'webm\')" ng-if="!getVideo(\'webm\')">Choose...</a>' +
                        '<span ng-if="getVideo(\'webm\')">' +
                            '<a href="#" prevent-default ng-click="pickVideo(\'webm\')">{{ getVideo(\'webm\').name }}</a>' +
                            '<i class="icon icon-delete red" ng-click="removeVideo($event, \'webm\')"></i>' +
                        '</span>' +
                    '<div>' +
                  '</span>',
        scope: {
            property: '=',
            model: '='
        },
        link: function (scope, element, attrs) {

            var setStartNodeId = function (aliases, nodeId) {
                if (!aliases || !aliases.length)
                    return;

                var alias = aliases.splice(0, 1);

                mediaResource.getChildren(nodeId).then(function (response) {
                    if (!response.items)
                        return;

                    for (var i = 0; i < response.items.length; i++) {
                        var item = response.items[i];

                        if (item.contentTypeAlias == 'Folder' && item.name.toLowerCase() == alias) {
                            scope.property.startNodeId = item.id;
                            setStartNodeId(aliases, item.id);
                            break;
                        }
                    }
                })
            }

            var init = function () {
                if (!scope.model[scope.property.alias])
                    scope.model[scope.property.alias] = { src: [] };

                if (!scope.property.startNodeId)
                    scope.property.startNodeId = -1;

                if (scope.property.folder) {
                    var folder = scope.property.folder.replace('//', '/').replace(/^\//, '').replace(/\/$/, '');
                    var aliases = folder.toLowerCase().split('/');

                    setStartNodeId(aliases, -1);
                }
            }

            scope.getVideo = function (type) {
                for (var i = 0; i < scope.model[scope.property.alias].src.length; i++) {
                    var src = scope.model[scope.property.alias].src[i];

                    if (src.type == type)
                        return src;
                }

                return null;
            }

            scope.pickVideo = function (type) {
                dialogService.mediaPicker({
                    startNodeId: scope.property.startNodeId,
                    callback: function (data) {
                        var regex = new RegExp('.' + type + '$', 'i');

                        if (!regex.test(data.name))
                            return;

                        for (var i = 0; i < scope.model[scope.property.alias].src.length; i++) {
                            var src = scope.model[scope.property.alias].src[i];

                            if (src.type == type) {
                                src.id = data.id;
                                src.url = data.image;
                                src.name = data.name;
                                return;
                            }
                        }

                        scope.model[scope.property.alias].src.push({
                            type: type,
                            id: data.id,
                            url: data.image,
                            name: data.name
                        });
                    }
                });
            }

            scope.removeVideo = function (event, type) {
                event.preventDefault();
                event.stopPropagation();

                for (var i = 0; i < scope.model[scope.property.alias].src.length; i++) {
                    var src = scope.model[scope.property.alias].src[i];

                    if (src.type == type) {
                        scope.model[scope.property.alias].src.splice(i, 1);
                    }
                }
            }

            init();
        }
    }
});

angular.module("umbraco.directives").directive('propertiesGeneratorFieldContent', function (dialogService, contentResource) {
    return {
        restrict: 'E',
        replace: true,
        template: '<span class="field-content">' +
                    '<a href="#" prevent-default ng-click="pickContent()" ng-if="!model[property.alias].id">Choose...</a>' +
                    '<span ng-if="model[property.alias].id">' +
                            '<a href="#" prevent-default ng-click="pickContent()">{{ model[property.alias].name }}</a>' +
                            '<i class="icon icon-delete red" ng-click="removeContent($event)"></i>' +
                        '</span>' +
                  '</span>',
        scope: {
            property: '=',
            model: '='
        },
        link: function (scope, element, attrs) {

            var setStartNodeId = function (aliases, nodeId) {
                if (!aliases || !aliases.length)
                    return;

                var alias = aliases.splice(0, 1);

                contentResource.getChildren(nodeId).then(function (response) {
                    if (!response.items)
                        return;

                    for (var i = 0; i < response.items.length; i++) {
                        var item = response.items[i];

                        if (item.name.toLowerCase() == alias) {
                            scope.property.startNodeId = item.id;
                            setStartNodeId(aliases, item.id);
                            break;
                        }
                    }
                })
            }

            var init = function () {

                if (!scope.model[scope.property.alias])
                    scope.model[scope.property.alias] = {};

                if (!scope.property.startNodeId)
                    scope.property.startNodeId = -1;

                if (scope.property.route) {
                    var route = scope.property.route.replace('//', '/').replace(/^\//, '').replace(/\/$/, '');
                    var aliases = route.toLowerCase().split('/');

                    setStartNodeId(aliases, -1);
                }
            }

            scope.pickContent = function () {
                dialogService.contentPicker({
                    startNodeId: scope.property.startNodeId,
                    filter: scope.property.filter,
                    filterCssClass: scope.property.filter ? "not-allowed not-published" : undefined,
                    callback: function (data) {
                        scope.model[scope.property.alias] = {
                            id: data.id,
                            name: data.name
                        }
                    }
                });
            }

            scope.removeContent = function (event) {
                event.preventDefault();
                event.stopPropagation();
                scope.model[scope.property.alias] = {};
            }

            init();
        }
    }
});

angular.module("umbraco.directives").directive('propertiesGeneratorFieldImage', function (dialogService, mediaHelper, mediaResource) {
    return {
        restrict: 'E',
        replace: true,
        template: '<span class="field-image">' +
                    '<span class="picker" ng-click="pickImage()">' +
                        '<span ng-if="!model[property.alias].image"><i class="icon icon-add large"></i><br/>Choose...</span>' +
                        '<span ng-if="model[property.alias].image" class="imageContainer">' +
                            '<img ng-src="{{ model[property.alias].thumbnail }}" /><i class="icon right icon-delete" ng-click="removeImage($event)"></i>' +
                        '</span>' +
                    '</span>' +
                    '<div ng-if="model[property.alias].image"><input type="text" placeholder="Alternative text" ng-model="model[property.alias].alt" auto-align /></div>' +
                  '</span>',
        scope: {
            property: '=',
            model: '='
        },
        link: function (scope, element, attrs) {

            var setStartNodeId = function (aliases, nodeId) {
                if (!aliases || !aliases.length)
                    return;

                var alias = aliases.splice(0, 1);

                mediaResource.getChildren(nodeId).then(function (response) {
                    if (!response.items)
                        return;

                    for (var i = 0; i < response.items.length; i++) {
                        var item = response.items[i];

                        if (item.contentTypeAlias == 'Folder' && item.name.toLowerCase() == alias) {
                            scope.property.startNodeId = item.id;
                            setStartNodeId(aliases, item.id);
                            break;
                        }
                    }
                })
            }

            var init = function () {

                if (!scope.model[scope.property.alias])
                    scope.model[scope.property.alias] = {};

                if (!scope.property.startNodeId)
                    scope.property.startNodeId = -1;

                if (scope.property.folder) {
                    var folder = scope.property.folder.replace('//', '/').replace(/^\//, '').replace(/\/$/, '');
                    var aliases = folder.toLowerCase().split('/');

                    setStartNodeId(aliases, -1);
                }
            }

            scope.pickImage = function () {

                dialogService.mediaPicker({
                    onlyImages: true,
                    startNodeId: scope.property.startNodeId,
                    callback: function (data) {
                        scope.model[scope.property.alias] = {
                            id: data.id,
                            thumbnail: data.thumbnail,
                            image: data.image
                        }
                    }
                });
            }

            scope.removeImage = function (event) {
                event.preventDefault();
                event.stopPropagation();
                scope.model[scope.property.alias] = {};
            }

            init();
        }
    }
});

angular.module("umbraco.directives").directive('propertiesGeneratorFieldLink', function (dialogService, contentResource) {
    return {
        restrict: 'E',
        replace: true,
        template: '<span class="field-link">' +
                    '<input type="checkbox" ng-model="model[property.alias].isInternal" /><label>Internal</label>' +
                    '<div><input type="checkbox" ng-model="model[property.alias].isNewWindow" /><label>New window</label></div>' +
                    '<div><input type="text" ng-model="model[property.alias].caption" placeholder="Caption" auto-align /></div>' +
                    '<div ng-if="!model[property.alias].isInternal"><input type="text" ng-model="model[property.alias].link" placeholder="Link" /></div>' +
                    '<div ng-if="model[property.alias].isInternal">' +
                        '<div ng-show="!model[property.alias].id"><i class="icon icon-add blue" ng-click="pickContent()"></i><a href="#" ng-click="pickContent()" prevent-default>link</a></div>' +
                        '<div ng-show="model[property.alias].id"><i class="icon icon-delete red" ng-click="deleteLink()"></i><a href="#" ng-click="deleteLink()" prevent-default>{{ model[property.alias].name }}</a></div>' +
                    '</div>' +
                  '</span>',
        scope: {
            property: '=',
            model: '='
        },
        link: function (scope, element, attrs) {

            if (!scope.model[scope.property.alias])
                scope.model[scope.property.alias] = { link: 'http://', isNewWindow: false };
            else {
                scope.model[scope.property.alias].link = scope.model[scope.property.alias].link;
            }

            scope.pickContent = function () {
                dialogService.treePicker({
                    multiPicker: false,
                    section: "content",
                    treeAlias: "content",
                    callback: function (data) {
                        scope.model[scope.property.alias].id = data.id;
                        scope.model[scope.property.alias].name = data.name;

                        contentResource.getById(data.id).then(function (content) {
                            scope.model[scope.property.alias].link = content.urls[0];
                        });
                    }
                });
            }

            scope.deleteLink = function () {
                delete scope.model[scope.property.alias].id;
                delete scope.model[scope.property.alias].name;
                delete scope.model[scope.property.alias].link;
            }
        }
    }
});

angular.module("umbraco.directives").directive('propertiesGeneratorFieldCheckbox', function () {
    return {
        restrict: 'E',
        replace: true,
        template: '<span class="field-checkbox"><input type="checkbox" ng-model="model[property.alias]" properties-generator-validate /></span>',
        scope: {
            property: '=',
            model: '=',
            validations: '='
        },
        link: function (scope, element, attrs) {

            if (typeof scope.model[scope.property.alias] != 'boolean')
                scope.model[scope.property.alias] = !!scope.property.default;
        }
    }
});

angular.module("umbraco.directives").directive('propertiesGeneratorFieldTextarea', function () {
    return {
        restrict: 'E',
        replace: true,
        template: '<span class="field-textarea"><textarea ng-model="model[property.alias]" properties-generator-validate auto-align></textarea></span>',
        scope: {
            property: '=',
            model: '=',
            validations: '='
        },
        link: function (scope, element, attrs) {


        }
    }
});

angular.module("umbraco.directives").directive('propertiesGeneratorFieldTextbox', function () {
    return {
        restrict: 'E',
        replace: true,
        template: '<span class="field-text"><input type="text" ng-model="model[property.alias]" properties-generator-validate auto-align /></span>',
        scope: {
            property: '=',
            model: '=',
            validations: '='
        },
        link: function (scope, element, attrs) {


        }
    }
});

angular.module("umbraco.directives").directive('propertiesGeneratorFieldHeader', function () {
    return {
        restrict: 'E',
        replace: true,
        template: '<h5>{{ property.name }}</h5>',
        scope: {
            property: '='
        }
    }
});

angular.module("umbraco.directives").directive('autoAlign', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            $(element).keydown(function () {
                var val = $.trim($(element).val());

                if (val) {
                    if (val.charAt(0) >= 'א' && val.charAt(0) <= 'ת') {
                        $(element).addClass('rtl');
                    }
                    else {
                        $(element).removeClass('rtl');
                    }
                }
            });

            setTimeout(function () {
                $(element).keydown();
            }, 500);
        }
    }
});

angular.module("umbraco.directives").directive('propertiesGeneratorField', function ($compile, propertiesGeneratorResource) {
    return {
        restrict: 'E',
        replace: true,
        template: '<div id="propertyGenerator{{property.id}}" class="field {{ property.css }}" ng-show="isShow()" ng-class="{ invalid: validations[property.id] }">' +
                    '<label ng-if="isShowLabel()">{{ property.name }}:</label>' +
                    '<span class="error">{{ validations[property.id] }}</span>' +
                  '</div>',
        scope: {
            property: '=',
            model: '=',
            validations: '='
        },
        link: function (scope, element, attrs) {

            if (scope.property) {
                //if (scope.property.id == 13)
                //    debugger

                propertiesGeneratorResource.setItemId(scope.property);
                if (!scope.property.validate)
                    scope.property.validate = {};

                var newElement = angular.element('<properties-generator-field-' + scope.property.type + ' property="property" model="model" validations="validations"></properties-generator-field-' + scope.property.type + '>');
                $compile(newElement)(scope);

                $(element).find('span').before(newElement);
            }

            scope.isShowLabel = function () {
                return scope.property.type != "header";
            }

            scope.isShow = function () {

                if (!scope.property.show || typeof scope.property.show != 'string')
                    return true;

                try {
                    return eval(scope.property.show);
                }
                catch (e) {
                    console.error(e);
                    return true;
                }
            }
        }
    }
});

angular.module("umbraco.directives").directive('propertiesGeneratorValidate', function ($compile) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            var validate = scope.property.validate;

            var getValue = function () {
                return $(element).val();
            }

            var sync = function () {
                if (scope.$root.$$phase != '$apply' && scope.$root.$$phase != '$digest')
                    scope.$apply();
            }

            var onValidate = function (isDirty) {
                if (isDirty)
                    $(element).closest('.field').addClass('dirty');

                var val = getValue();

                delete scope.validations[scope.property.id];

                if (validate.required && !$.trim(val)) {
                    scope.validations[scope.property.id] = validate.requiredMessage || 'Required';
                    sync();
                    return;
                }

                if (val) {

                    if (validate.typeFunction) {
                        var message = validate.typeFunction(scope.model[scope.property.alias], scope.model);

                        if (message) {
                            scope.validations[scope.property.id] = message;
                            sync();
                            return;
                        }
                    }

                    if ($.trim(validate.regex)) {
                        var regex = new RegExp(validate.regex);

                        if (!regex.test(val)) {
                            scope.validations[scope.property.id] = validate.regexMessage || 'Invalid';
                            sync();
                            return;
                        }
                    }

                    if ($.trim(validate.customFunction)) {

                        try {
                            var func = null;
                            eval('func = ' + validate.customFunction);
                            var message = func(scope.model[scope.property.alias], scope.model);

                            if (message) {
                                scope.validations[scope.property.id] = message;
                                sync();
                                return;
                            }

                        }
                        catch (e) {
                            console.error(e);
                        }
                    }

                }

            }

            $(element).blur(function () {
                onValidate(true);
            });
            $(element).on('validate', function () {
                onValidate();
            });
        }
    }
});

angular.module("umbraco").controller("PropertiesGeneratorCtrl",
    function ($scope, assetsService, $http, dialogService, mediaHelper, propertiesGeneratorResource, $timeout) {

        var self = $scope;

        self.generator = null;
        self.currentSection = null;
        self.validations = {};
        self.isValid = true;
        self.mainElementId = 'PropertiesGenerator' + self.$id;

        self.init = function () {

            assetsService.loadCss("~/App_Plugins/PropertiesGenerator/assets/PropertiesGenerator.css");

            propertiesGeneratorResource.getProperties(self.model.alias).then(function (response) {
                self.generator = response.data;

                if (self.generator && self.generator.sections && self.generator.sections.length) {
                    self.currentSection = self.generator.sections[0];
                }

                if (!self.model.value)
                    self.model.value = {};

                for (var i = 0; i < self.generator.sections.length; i++) {
                    var section = self.generator.sections[i];

                    if (!self.model.value[section.alias])
                        self.model.value[section.alias] = {};
                }

                $timeout(function () {
                    $('#' + self.mainElementId + ' :input').trigger('validate');
                }, 1000);
            });

        }

        self.$watch(function () { return JSON.stringify(self.validations); }, function () {
            for (var field in self.validations) {
                if (self.validations[field] && $('#propertyGenerator' + field).length) {
                    self.isValid = false;
                    return;
                }  
            }

            self.isValid = true;
        });

        self.init();
    });