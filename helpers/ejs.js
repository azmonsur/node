const moment = require('moment');     

module.exports = {
    formatDate: function (date, format) {
        return moment(date).format(format)
    },
    title: function (str) {
        return str.split(' ').map(each => each.slice(0, 1).toUpperCase() + each.slice(1)).join(' ')
    },
    capitalize: function (str) {
        return str.slice(0, 1).toUpperCase() + str.slice(1)
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
    formatFigure: function (figure) {
        let figures = figure.toString();
        let [index, count, formatted] = [figures.length - 1, 1, []]

        for (const fig of figures) {
            formatted.push(figures[index]);
            if (count === 3 && index != 0) {
                formatted.push(',')
                count = 0
            }
            index--; count++;
        }
        return formatted.reverse().join('')
    },
    paginate: function (numberPerPage, totalNumber) {
        return Math.ceil(totalNumber/numberPerPage)
    }
}