from django.urls import path
from .views import BookmarkList, BookmarkDetail, BookmarkFavorite

urlpatterns = [
    path('', BookmarkList.as_view(), name='bookmark-list'),
    path('<int:pk>/', BookmarkDetail.as_view(), name='bookmark-detail'),
    path('<int:pk>/favorite/', BookmarkFavorite.as_view(), name='toggle-favorite'),
]
