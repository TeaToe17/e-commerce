from django.db import models
from django.contrib.auth.models import User

class Customer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name="customer")  # Allow null and blank
    image = models.ImageField(upload_to="profile/", default="media/products/DP.jpeg")
    order_history = models.ManyToManyField(
        'orders.Order', 
        related_name="customersorder", 
        blank=True
    )
    def __str__(self):
        return self.user.username if self.user else "No User Assigned"