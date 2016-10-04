'use strict';

/*

 Group (User) service

 */
angular.module('perfTest')
    .factory('bigFormModelService', [
        '$rootScope',
        function ($rootScope) {

            // Random data lib
            var chance = new Chance(Math.random());

            var bigFormModelService = {
                fields_per_section: 750,
                max_list_items: 500,
                variants: [
                    { id: 1, name: 'Variant 1' },
                    { id: 2, name: 'Variant 2' },
                    { id: 3, name: 'Variant 3' }
                ]
            };

            // Build a BIG form model!
            bigFormModelService.buildModel = function () {
                return new Promise(function (resolve, reject) {

                    // Create three layout sections
                    var Model = {
                        sections: [
                            {}, {}, {}
                        ],
                        renderedSections: [
                            {}, {}, {}
                        ]
                    };

                    // Generate the names first
                    var name_list = [], name;
                    for (var idx = 0; idx < bigFormModelService.fields_per_section; idx++) {
                        name = 'big_' + chance.guid();
                        name_list.push(name);
                        Model.sections[0][name] = {};
                        name = 'big_' + chance.guid();
                        name_list.push(name);
                        Model.sections[1][name] = {};
                        name = 'big_' + chance.guid();
                        name_list.push(name);
                        Model.sections[2][name] = {};
                    }

                    // Log which fields we assign a dependency too - lets avoid circular refs!
                    var section_dep_keys = [];

                    // Populate each section
                    _.each(Model.sections, function (section) {

                        var i = 0;

                        // Create the fields for each section
                        _.each(section, function (dummy, field_name) {

                            var Field = {
                                idx: i++,
                                name: field_name,
                                type: ['text', 'number', 'date', 'list'][chance.integer({ min: 0, max: 3 })],
                                label: chance.word({ syllables: 3 }),
                                variants: _.map(chance.pickset(
                                    bigFormModelService.variants,
                                    chance.integer({ min: 1, max: 3 })
                                ), 'id'),
                                dependencies: [],
                                visible: true
                            };

                            // Random field value
                            switch (Field.type) {
                                case 'text':
                                    Field.value = chance.sentence();
                                    break;
                                case 'number':
                                    Field.value = chance.integer({ min: 0, max: 100 });
                                    break;
                                case 'date':
                                    Field.value = chance.date();
                                    break;
                                case 'list':
                                    Field.items = [];
                                    for (var j = 0; j < chance.integer({
                                        min: 20,
                                        max: bigFormModelService.max_list_items
                                    }); j++) {
                                        Field.items.push({
                                            id: j + 1,
                                            name: chance.word({ syllables: chance.integer({ min: 3, max: 6 }) })
                                        });
                                    }
                            }

                            // Generate a dependency?
                            if (Field.type === 'list') {

                                section_dep_keys.push(field_name);

                                // Pick a few dependencies per section
                                for (var section_idx = 0; section_idx < 2; section_idx++) {

                                    var how_many = chance.integer({ min: 1, max: 10 });

                                    // Get a list of suitable keys - avoiding circ. refs
                                    var keys = _.filter(Object.keys(Model.sections[section_idx]), function (key) {
                                        return section_dep_keys.indexOf(key) === -1;
                                    });
                                    var dependency_keys = chance.pickset(keys, how_many);

                                    // Create the deps
                                    for (var dep_key in dependency_keys) {

                                        Field.dependencies.push({
                                            section_idx: section_idx,
                                            field_name: dependency_keys[dep_key]
                                        });

                                    }

                                }

                            }

                            section[field_name] = Field;

                        });

                    });

                    Model.keys = [
                        Object.keys(Model.sections[0]),
                        Object.keys(Model.sections[1]),
                        Object.keys(Model.sections[2])
                    ];

                    return resolve(Model);

                });
            };

            return bigFormModelService;
        }
    ]);