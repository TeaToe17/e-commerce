from rest_framework import serializers

from .models import Order
from products.models import Product
from customers.serializers import CustomerDetailsSerializer

class OrderSerializer(serializers.ModelSerializer):
    products = serializers.PrimaryKeyRelatedField(many=True, queryset=Product.objects.all())
    # customer = CustomerDetailsSerializer()
    class Meta:
        model = Order
        fields = [ "products", "contact", "address", "status", "cost", "created_at", "payment_intent_id"]
        extra_kwargs = {"status":{"read_only":True}, "cost":{"read_only":True},}