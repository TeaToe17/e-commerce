from django.db import models
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

class Vendor(models.Model):
    customer = models.OneToOneField(    
        'customers.Customer', 
        on_delete=models.CASCADE
    )
    store_name = models.CharField(max_length=200, unique=True, blank=True, null=True)
    contact = models.CharField(max_length=50, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    stripe_account_id = models.CharField(max_length=255, blank=True, null=True)

    def clean(self):
        if len(str(self.contact)) < 10:  
            raise ValidationError(_('Contact number should be at least 10 digits long.'))

        if not self.email.endswith('@gmail.com'):
            raise ValidationError(_('Email must be a Gmail address.'))

    def __str__(self):
        return f"{self.store_name} ({self.customer.user.username})"