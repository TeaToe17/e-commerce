from django.shortcuts import render
from django.http import Http404

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny 

from .models import Customer
from orders.models import Order
from my_auth.serializers import UserSeriaizer
from .serializers import CustomerDetailsSerializer, OrderSerializer

class CustomerRegisterView(generics.CreateAPIView):    
    queryset = Customer.objects.all()
    serializer_class = UserSeriaizer
    permission_classes = [AllowAny]

class CustomerDetailsView(generics.RetrieveAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerDetailsSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        try:
            customer = Customer.objects.get(user=self.request.user)
            return customer
        except Customer.DoesNotExist:
            raise Http404("Customer not found")
    
class CustomerOrderHistoryView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(customer = self.request.user)