from django.db import models

class SearchHistory(models.Model):
    city = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)
    count = models.IntegerField(default=1)