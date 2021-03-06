$('.program-forum h6').text(`Forum - ${loggedInUser.job}`);
$('select').formSelect();

function fetchPosts() {
    fetch(`http://${endpoint}/jsfour-core/${sessionToken}/database/fetchForumPosts`, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({
            '@job': loggedInUser.job
        })
    })
    .then( response => response.json() )
    .then( data => {
        if ( data != 'false' ) {
            $('#forum-posts').html('');

            Object.keys(data).forEach(( k ) => {
                let icon = ''; 
                let forumDelete = '';

                if ( data[k].category != 'message' ) {
                    let forumIcon = 'fiber_new';

                    if ( data[k].category === 'important' ) {
                        forumIcon = 'warning';
                    } else if ( data[k].category === 'info') {
                        forumIcon = 'info';
                    }

                    icon = `<i class="material-icons">${forumIcon}</i>`;
                }

                if ( data[k].username === loggedInUser.username || loggedInUser.job === 'all' || loggedInUser.group === 'admin' ) {
                    forumDelete = `<i class="material-icons forum-delete">delete</i>`;
                }

                forumDiv = `<div class="forum-post ${data[k].category} col s12" post="${data[k].id}">
                        <div class="forum-post-details">
                            ${forumDelete}
                            <img class="forum-post-avatar" src="${data[k].avatar}" draggable="false"/>
                            <p class="forum-post-username">${data[k].username}</p>
                            ${icon}
                            <p>${data[k].date}</p>
                        </div>
                        <p class="forum-post-text">${data[k].text}</p>
                    </div>`;
    
                $('#forum-posts').prepend(forumDiv);
            });
        }
    });
}

fetchPosts();

function refreshforum() {
    fetchPosts();
}

$('.program-forum form').submit( () => {
    let forumCategory = $('.program-forum .selected').text().toLowerCase();
    let forumText = $('#forum-textarea').val();
    let today = new Date();
    let date = `${today.getDate()}/${today.getMonth() + 1}`;

    fetch(`http://${endpoint}/jsfour-core/${sessionToken}/database/addForumPost`, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({
            '@category': forumCategory,
            '@text': forumText,
            '@username': loggedInUser.username,
            '@avatar': loggedInUser.avatar,
            '@date': date,
            '@job': loggedInUser.job
        })
    })
    .then(() => {
        setTimeout(() => {
            fetchPosts();
        }, 100);   
    });

    $('#forum-textarea').val('');

    return false;
});

$('body').on('click', '.forum-delete', function () {
    fetch(`http://${endpoint}/jsfour-core/${sessionToken}/database/deleteForumPost`, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({
            '@id': $(this).closest('.forum-post').attr('post')
        })
    });

    $(this).closest('.forum-post').remove();
});