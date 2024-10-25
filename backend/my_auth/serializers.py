from rest_framework import serializers
from django.contrib.auth.models import User

from customers.models import Customer

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ["contact", "address", "order_history"]
        extra_kwargs = {"order_history":{"read_only":True}}

class UserSeriaizer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password":{"write_only":True}}

    def create(self,validated_data):
        user = User.objects.create_user(**validated_data)
        Customer.objects.create(user=user)
        return user