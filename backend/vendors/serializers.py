from rest_framework import serializers

from .models import Vendor
from customers.serializers import CustomerDetailsSerializer
from orders.models import Order
from customers.models import Customer

class VendorOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ["id", "product", "quantity", "customer", "status", "cost", "created_at"]
        extra_kwargs = {"status":{"read_only":True}, "customer":{"read_only":True}, "cost":{"read_only":True},}

class VendorSerializer(serializers.ModelSerializer):
    customer = CustomerDetailsSerializer()
    class Meta:
        model = Vendor
        fields = ["id", "customer", "store_name", "contact", "email"]

class CreateVendorSerializer(serializers.ModelSerializer):
    customer = serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all())  # Ensure this is included

    class Meta:
        model = Vendor
        fields = ["store_name", "contact", "email", "customer", "stripe_account_id"]
        extra_kwargs = {"stripe_account_id":{"read_only":True}}

    def create(self, validated_data):
        print("before",validated_data)
        print("after",validated_data)
        vendor = Vendor.objects.create(**validated_data)
        return vendor

