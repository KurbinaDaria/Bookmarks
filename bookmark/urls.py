from django.urls import path
from .views import BookmarkList, BookmarkDetail, BookmarkFavorite, BookmarkSearchById

urlpatterns = [
    path('', BookmarkList.as_view(), name='bookmark-list'),
    path('<int:pk>/', BookmarkDetail.as_view(), name='bookmark-detail'),
    path('<int:pk>/favorite/', BookmarkFavorite.as_view(), name='toggle-favorite'),
    path('api/bookmarks/search/', BookmarkSearchById.as_view(), name='bookmark-search-by-id'),
]
