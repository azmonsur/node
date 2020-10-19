'use strict'

//dynamism, server a page dynamically
var fortunes = [
    'Conquer your fears or they will conquer you.',
    'Rivers need Springs.',
    'Do not fear what you do not know.',
    'You will have a pleasant surprise.',
    'Whenever possible, keep it simple.'
];

//export self defined module
exports.getFortune = function() {
    var idx = Math.floor(Math.random() * fortunes.length);
    return fortunes[idx]
};