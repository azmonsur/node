
'use strict'

//------- Left Tabs and contents ------------------------
let leftTabHeaders = document.querySelectorAll('.left-tab-header'),
    leftTabContents = document.querySelectorAll('.left-tab-content');

leftTabHeaders.forEach(header => header.addEventListener('click', () => {
    let contentId = header.id.replace('header', 'content');
    deactivateAllLeft();
    header.classList.add('active');
    document.getElementById(contentId).classList.add('active')
}))
//------------------------------------------------------------


// -----------Right Tabs and contents ---------------------
let rightTabHeaders = document.querySelectorAll('.right-tab-header'),
    rightTabContents = document.querySelectorAll('.right-tab-content');

rightTabHeaders.forEach(header => header.addEventListener('click', () => {
    let contentId = header.id.replace('header', 'content');
    deactivateAllRight();
    header.classList.add('active');
    document.getElementById(contentId).classList.add('active')
}))
//----------------------------------------------------------

function deactivateAllLeft() {
    for (let i = 0; i < leftTabHeaders.length; i++) {
        leftTabHeaders[i].className = leftTabHeaders[i].className.replace('active', '');
        leftTabContents[i].className = leftTabContents[i].className.replace('active', '');
    }
}

function deactivateAllRight() {
    for (let i = 0; i < rightTabHeaders.length; i++) {
        rightTabHeaders[i].className = rightTabHeaders[i].className.replace('active', '');
        rightTabContents[i].className = rightTabContents[i].className.replace('active', '');
    }
}

function title(str) {
    return str.split(' ').map(each => each.slice(0, 1).toUpperCase() + each.slice(1)).join(' ')
}

// ----Make Ajax Request to server to get all stories----
function getStories(url, method, reqType, preload = true) {
    $.ajax({
        url: url,
        type: method,
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({ preload: preload, reqType: reqType }),
        success: (data) => {

            let pullRequests, posts, actionBtn, actionText, showBtn;
            if (reqType == 'pull') {

                // Select right tab content 2
                pullRequests = document.querySelector('#right-tab-content-2 ol');

                // Filter story
                posts = data.stories.filter(story => story.status == 'public' && story.frontPagePost == 'true' && story.archivePost == 'false');

                // Sort story 
                posts = posts.sort((a, b) => (a.publishedAt < b.publishedAt) ? 1 : -1);

                // Action buttons
                actionBtn = 'red';
                actionText = 'Pull From FP';
                showBtn = '';
            } else if (reqType == 'push') {

                // Select right tab content 3
                pullRequests = document.querySelector('#right-tab-content-3 ol');

                // Filter story
                posts = data.stories.filter(story => story.status == 'public' && story.frontPagePost == 'false' && story.archivePost == 'false');

                // Sort story 
                posts = posts.sort((a, b) => (a.createdAt < b.createdAt) ? 1 : -1);

                // Action buttons
                actionBtn = 'green';
                actionText = 'Push To FP';
                showBtn = '';
            } else if (reqType == 'private') {

                // Select right tab content 3
                pullRequests = document.querySelector('#right-tab-content-4 ol');

                // Filter story
                posts = data.stories.filter(story => story.status == 'private' && story.archivePost == 'false');

                // Sort story 
                posts = posts.sort((a, b) => (a.createdAt < b.createdAt) ? 1 : -1);

                // Action buttons
                actionBtn = 'green';
                actionText = '';
                showBtn = 'hide-btn'
            }
            // Clear inner content
            pullRequests.innerHTML = ''

            // If post is available
            if (posts.length > 0) {

                // Iterate through post
                posts.forEach(fpa => {
                    let date = new Date(fpa.createdAt)
                    date = `${date.toDateString()}, ${date.toLocaleTimeString()}`
                    pullRequests.innerHTML += `
                        <li class="rounded-4 article-title">
                            <a class="white-text" href="/stories/${fpa._id}">
                                ${title(fpa.title)}
                            </a><br />
                            <small>
                                ${date} | ${title(fpa.user.lastName)} ${title(fpa.user.firstName)}
                            </small>
                            <button onclick="getStories('/admin/cpanel/push/${fpa._id}', 'PUT', '${reqType}', ${false})" class="btn ${actionBtn} ${showBtn} darken-2 white-text fa-x-small" type="submit">
                                ${actionText}
                            </button>
                        </li>`
                });
            } else { // If no post available
                pullRequests.innerHTML = `
                    <div class="card-local">
                        <p class="padding-4 black-text white">
                            No article to display
                        </p>
                    </div>`
            }
        }
    });
}

$(document).ready(() => {
    // snippets
});