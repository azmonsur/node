const moment = require('moment');                 // For formatting date
const { mapReduce } = require('../models/User');

module.exports = {
    formatDate: function (date, format) {
        return moment(date).format(format)
    },
    capitalize: function (str) {
        return str.slice(0, 1).toUpperCase() + str.slice(1)
    },
    titleFormat: function (str) {
        return str.split(' ').map(each => each.slice(0, 1).toUpperCase() + each.slice(1)).join(' ')
    },
    truncateWithLetters: function (str, len) {
        if (str.length > len && str.length > 0) {
            let newStr = str + ' ';
            newStr = str.substr(0, len);
            newStr = str.substr(0, newStr.lastIndexOf(' '));
            newStr = newStr.length > 0 ? newStr : str.substr(0, len);
            return newStr + '...'
        }
        return str;
    },
    truncateWithWords: function (str, len) {
        if (str.split(' ').length > len && str.split(' ').length > 0) {
            return str.split(' ').splice(0, len + 1).join(' ') + '...'
        }
        return str;
    },
    stripTags: function (input) {
        return input.replace(/<(?:.|\n)*?>/gm, '').replace(/&(.){4};/gm, ' ')
    },
    editIcon: function (storyUser, loggedUser, storyId, floating = true) {
        if (storyUser._id.toString() == loggedUser._id.toString()) {
            if (floating) {
                return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
            } else {
                return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit fa-small"></i></a>`
            }
        } else {
            return ""
        }
    },
    select: function (selected, options) {
        return options.fn(this).replace(new RegExp(' value="' + selected + '"'),
            '$& selected="selected"').replace(new RegExp('>' + selected + '</option>'),
                'selected="selected"$&')
    },
    compare: function (condition, a, b, resolve, reject) {
        switch (condition) {
            case ('gt'):
                return a > b ? resolve : reject;
                break;
            case ('gte'):
                return a >= b ? resolve : reject;
                break;
            case ('eq'):
                return a == b ? resolve : reject;
                break;
            case ('bothTrue'):
                return a && b ? resolve : reject;
                break;
            case ('either'):
                return a || b ? resolve : reject;
                break;
            case ('true'):
                return a ? resolve : reject;
                break;
            default:
                break;
        }
    },
    compareAll: function (resolve, ...args) {
        args.forEach(arg => {
            if (arg) return resolve
        })
    },
    sumAll: function (objects, property) {
        let total = 0;
        objects.forEach(object => total += Number(object[property]));
        return total
    },
    userDetails: function (object, property) {
        return object[property]
    },
}
