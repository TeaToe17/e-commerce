from rest_framework import serializers

from .models import Product
from vendors.serializers import VendorSerializer
from vendors.models import Vendor

class ProductSerializer(serializers.ModelSerializer):
    vendor = serializers.PrimaryKeyRelatedField(queryset=Vendor.objects.all())
    class Meta:
        model = Product
        fields = ["id", "name", "description", "price", "stock", "image", "vendor"]
        extra_kwargs = {"vendor":{"read_only":True}}