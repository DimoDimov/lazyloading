'use strict';

angular.module('perfTest').controller('bigFormController', [
        '$scope', 'bigFormModelService', '$timeout',
        function ($scope, bigFormModelService, $timeout) {

            var self = this;

            /*
             Bound Models
             */
            self.variants = bigFormModelService.variants;
            self.variant = null;
            self.Model = null;
            self.visible_fields = null;
            self.lastOperation = {
                dependency: {
                    start: null,
                    end: null,
                    display: null
                },
                variant: {
                    start: null,
                    end: null,
                    display: null
                }
            };

            self.loadedSections = [];

            /*
             Watches
             */

            // Watch for variant changes and update dependencies
            self.changeVariant = function () {
                self.lastOperation.variant.start = moment();
                $timeout(function () {
                    self.updateDependencies();
                    self.updateLastOpTime('variant');
                }, 0);
            };

            // Get model field by name
            var _getModelField = function (name) {
                for (var section_idx = 0; section_idx < self.Model.sections.length; section_idx++) {
                    for (var field_name in self.Model.sections[section_idx]) {
                        if (name === field_name) {
                            return {
                                section_idx: section_idx,
                                Field: self.Model.sections[section_idx][field_name]
                            };
                        }
                    }
                }
                return null;
            };

            // Get model fields by type
            var _getModelFieldsByType = function (type) {
                var fields = [];
                for (var section_idx = 0; section_idx < self.Model.sections.length; section_idx++) {
                    for (var field_name in self.Model.sections[section_idx]) {
                        var Field = self.Model.sections[section_idx][field_name];
                        if (Field.type === type) {
                            fields.push(Field);
                        }
                    }
                }
                return fields;
            };

            /*
             Public Methods
             */

            // Update last/current operation
            self.updateLastOpTime = function (type) {
                self.lastOperation[type].end = moment();
                self.lastOperation[type].display = self.lastOperation[type].end.diff(
                        self.lastOperation[type].start
                    ) + 'ms';
                self.lastOperation[type].start = null;
            };

            // Update the count of visible fields
            self.updateVisibleFieldCount = function () {

                // Bit un-angularesque.. :)
                self.visible_fields = jQuery('form[name="BigBoyForm"] :input:visible').length;

            };

            // Update dependencies
            self.updateDependencies = function () {

                self.lastOperation.dependency.start = moment();

                // Find list fields
                var lists = _getModelFieldsByType('list');

                // Filter for fields with dependencies
                var deps = _.filter(lists, function (field) {
                    return (field.hasOwnProperty('dependencies') && _.isArray(field.dependencies) && field.dependencies.length > 0);
                });

                // Process each dependency
                _.each(deps, function (DepField) {

                    // Each dep
                    for (var i = 0; i < DepField.dependencies.length; i++) {

                        var DepFieldResult = DepField.dependencies[i];

                        // Get the dependency by its name
                        var Field = self.Model.sections[DepFieldResult.section_idx][DepFieldResult.field_name];

                        // Toggle its visibility
                        Field.visible = !Field.visible;

                    }

                });

                $timeout(function () {
                    self.updateLastOpTime('dependency');
                    self.updateVisibleFieldCount();
                }, 0);

            };

            // Controller init
            self.init = function () {

                // Grab types
                bigFormModelService.buildModel()
                    .then(function (Model) {

                        console.log('Form Model: ', Model);

                        $scope.$apply(function () {
                            self.Model = Model;
                            self.updateVisibleFieldCount();
                            console.log('[INIT] Big Form Model loaded.');
                        });

                    })
                    .catch(function (err) {
                        console.error(err);
                    })
                    .finally(function () {
                        console.log('[INIT] Big Form Controller initialised.');
                    });

            };

            /*
             Init
             */
            self.init();

        }
    ])
    .directive('scrollLoad', [
        '$compile', '$window', '$timeout',
        function ($compile, $window, $timeout) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var to = scope[attrs.scrollLoadTo]; //$scope.loadedSections
                    var from = scope[attrs.scrollLoadFrom]; //$scope.sections
                    console.log(attrs);
                    console.log(from);

                    $window = angular.element(window);
                    $window.bind('scroll', scrollHandler);

                    function scrollHandler (event) {
                        var scrollPos = document.body.scrollTop + document.documentElement.clientHeight;
                        var elemBottom = element[0].offsetTop + element.height();
                        if (scrollPos >= elemBottom) { //scrolled to bottom of scrollLoad element
                            $window.unbind(event); //this listener is no longer needed.
                            console.log('great success2');
                            $timeout(function () {
                                $window.bind('scroll', scrollHandler);
                            }, 400);
                        }
                    }
                }
            };
        }]);
;
