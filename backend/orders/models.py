from django.db import models

class Order(models.Model):
    products = models.ManyToManyField(
        'products.Product',
        related_name="product_orders",
    )
    contact = models.CharField(max_length=15, null=True, blank=True)
    address = models.TextField(blank=True, null=True)
    customer = models.ForeignKey(
        'customers.Customer',
        related_name="customer_orders",
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )
    status = models.CharField(max_length=100, default="pending")
    cost = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    payment_intent_id = models.CharField(max_length=255, null=True, blank=True)

    def save(self, *args, **kwargs):
        # Save the order first to ensure it gets an ID
        super().save(*args, **kwargs)

        # Calculate the total cost after the order is created
        total = 0
        for product in self.products.all():
            total += product.price * product.quantity  # Ensure quantity is accessible in product

        self.cost = total
        # Update the cost without calling save again to avoid recursion
        self.__class__.objects.filter(id=self.id).update(cost=self.cost)
