from rest_framework import serializers


from .models import Customer
from my_auth.serializers import UserSeriaizer
from orders.models import Order

class CustomerDetailsSerializer(serializers.ModelSerializer):
    user = UserSeriaizer()
    class Meta:
        model = Customer
        fields = ["user", "id", "image", "order_history"]
        extra_kwargs = {"order_history":{"read_only":True}}

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ["id", "product", "quantity", "status", "created_at"]