$(document).ready(function () {
    $('#add-bookmark').click(function (e) {
        e.preventDefault();
        $('#bookmarks-list').hide();
        $('#add-bookmark-form').show();
    });

    $('#view-bookmarks').click(function (e) {
        e.preventDefault();
        fetchBookmarks();
        $('#add-bookmark-form').hide();
        $('#bookmarks-list').show();
    });

    $('#bookmark-form').submit(function (e) {
        e.preventDefault();

        const url = $('#url').val();
        const title = $('#title').val();
        const category = $('#category').val() || null;

        $.ajax({
            type: 'POST',
            url: 'http://127.0.0.1:8000/api/bookmarks/',
            data: JSON.stringify({ url, title, category }),
            contentType: 'application/json',
            success: function () {
                alert('Bookmark added successfully!');
                $('#bookmark-form')[0].reset();
                fetchBookmarks();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Error adding bookmark:', textStatus, errorThrown);
                alert('Error adding bookmark: ' + (jqXHR.responseText || errorThrown));
            }
        });
    });

    function fetchBookmarks() {
        $.ajax({
            type: 'GET',
            url: 'http://127.0.0.1:8000/api/bookmarks/',
            success: function (data) {
                $('#bookmarks').empty();

                const favoriteBookmarks = data.filter(bookmark => bookmark.is_favorite);
                const otherBookmarks = data.filter(bookmark => !bookmark.is_favorite);

                if (favoriteBookmarks.length > 0) {
                    $('#bookmarks').append('<h3>Favorites</h3>');
                    appendBookmarkList(favoriteBookmarks);
                }

                const categories = {};
                otherBookmarks.forEach(bookmark => {
                    const category = bookmark.category || 'Без категорії';
                    if (!categories[category]) {
                        categories[category] = [];
                    }
                    categories[category].push(bookmark);
                });

                for (const category in categories) {
                    $('#bookmarks').append(`<h3>${category}</h3>`);
                    appendBookmarkList(categories[category]);
                }

                attachEventHandlers();
            },
            error: function () {
                alert('Error fetching bookmarks');
            }
        });
    }

    function appendBookmarkList(bookmarks) {
        const bookmarkList = $('<ul></ul>');
        bookmarks.forEach(bookmark => {
            bookmarkList.append(`
                <li>
                    ${bookmark.title} - <a href="${bookmark.url}" target="_blank">${bookmark.url}</a>
                    <button class="delete-bookmark" data-id="${bookmark.id}">Delete</button>
                    <button class="favorite-bookmark" data-id="${bookmark.id}" data-favorite="${bookmark.is_favorite}">
                        ${bookmark.is_favorite ? 'Unfavorite' : 'Favorite'}
                    </button>
                    <button class="edit-bookmark" data-id="${bookmark.id}">Edit</button>
                </li>
            `);
        });
        $('#bookmarks').append(bookmarkList);
    }

    function attachEventHandlers() {
        $('.delete-bookmark').click(function () {
            const id = $(this).data('id');
            deleteBookmark(id);
        });

        $('.favorite-bookmark').click(function () {
            const id = $(this).data('id');
            toggleFavorite(id);
        });

        $('.edit-bookmark').click(function () {
            const id = $(this).data('id');
            fetchBookmark(id);
        });
    }

    function deleteBookmark(id) {
        $.ajax({
            type: 'DELETE',
            url: `http://127.0.0.1:8000/api/bookmarks/${id}/`,
            success: function () {
                alert('Bookmark deleted successfully!');
                fetchBookmarks();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Error deleting bookmark:', textStatus, errorThrown);
                alert('Error deleting bookmark: ' + (jqXHR.responseText || errorThrown));
            }
        });
    }

    function toggleFavorite(id) {
        $.ajax({
            type: 'PATCH',
            url: `http://127.0.0.1:8000/api/bookmarks/${id}/favorite/`,
            success: function (data) {
                alert(`Bookmark marked as ${data.favorite ? 'favorite' : 'not favorite'}`);
                fetchBookmarks();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Error toggling favorite:', textStatus, errorThrown);
                alert('Error toggling favorite: ' + (jqXHR.responseText || errorThrown));
            }
        });
    }

    function fetchBookmark(id) {
        $.ajax({
            type: 'GET',
            url: `http://127.0.0.1:8000/api/bookmarks/${id}/`,
            success: function (bookmark) {
                $('#url').val(bookmark.url);
                $('#title').val(bookmark.title);
                $('#category').val(bookmark.category);

                $('#bookmarks-list').hide();
                $('#add-bookmark-form').show();

                $('#bookmark-form').off('submit').submit(function (e) {
                    e.preventDefault();
                    updateBookmark(id);
                });
            },
            error: function () {
                alert('Error fetching bookmark details');
            }
        });
    }

    function updateBookmark(id) {
        const url = $('#url').val();
        const title = $('#title').val();
        const category = $('#category').val() || null;

        $.ajax({
            type: 'PATCH',
            url: `http://127.0.0.1:8000/api/bookmarks/${id}/`,
            data: JSON.stringify({ url, title, category }),
            contentType: 'application/json',
            success: function () {
                alert('Bookmark updated successfully!');
                $('#bookmark-form')[0].reset();
                fetchBookmarks();
                $('#add-bookmark-form').hide();
                $('#bookmarks-list').show();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Error updating bookmark:', textStatus, errorThrown);
                alert('Error updating bookmark: ' + (jqXHR.responseText || errorThrown));
            }
        });
    }

    $('#cancel-add').click(function () {
        $('#add-bookmark-form').hide();
    });

    $('#back-to-main').click(function () {
        $('#bookmarks-list').hide();
        $('#add-bookmark-form').hide();
    });

    // Search functionality for bookmark by ID
    $('#search-bookmark-btn').click(function(e) {
    e.preventDefault();
    const bookmarkId = $('#bookmark-id').val();

    if (bookmarkId) {
        $.ajax({
            url: `http://127.0.0.1:8000/api/bookmarks/${bookmarkId}/`,
            type: 'GET',
            success: function(data) {
                $('#result-content').html(`
                    <p>ID: ${data.id}</p>
                    <p>Title: ${data.title}</p>
                    <p>Category: ${data.category || 'Без категорії'}</p>
                    <p>Is Favorite: ${data.is_favorite ? 'Так' : 'Ні'}</p>
                `);
                $('#search-result').show();
            },
            error: function(xhr) {
                if (xhr.status === 404) {
                    $('#result-content').html(`<p style="color:red;">Закладка не знайдена (404).</p>`);
                } else {
                    $('#result-content').html(`<p style="color:red;">Сталася помилка: ${xhr.statusText}</p>`);
                }
                $('#search-result').show();
            }
        });
    } else {
        alert("Будь ласка, введіть дійсний ID закладки");
    }
});
});