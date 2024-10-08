from django.db import models


class Bookmark(models.Model):
    url = models.CharField(max_length=500)
    title = models.CharField(max_length=100)
    category = models.CharField(max_length=100, blank=True, null=True)
    is_favorite = models.BooleanField(default=False)

    def __str__(self):
        return self.title
