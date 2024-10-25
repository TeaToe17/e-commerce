from django.db import models
from vendors.models import Vendor


class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.IntegerField()
    stock = models.IntegerField()
    quantity = models.IntegerField(default=1)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    vendor = models.ForeignKey(Vendor, on_delete = models.CASCADE, related_name = "products")

    def __str__(self):
        return self.name