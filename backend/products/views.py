from django.shortcuts import render

from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated

from .serializers import ProductSerializer 
from .models import Product
from vendors.models import Vendor 

class ProductList(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        try:
            user = self.request.user
            vendor = Vendor.objects.filter(user=user)
            return Product.objects.filter(vendor=vendor)
        # except Vendor.DoesNotExist:
        except:
            products = Product.objects.all()
            return products
        

class ProductCreate(generics.CreateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    # def perform_create(self, serializer):
    #     user = self.request.user
    #     vendor = Vendor.objects.filter(user=user)
    #     if vendor:
    #         if serializer.is_valid():
    #             serializer.save(vendor=vendor)
    #         else:
    #             print(serializer.errors)

class ProductUpdate(generics.UpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    lookup_field="id"
 
class ProductDelete(generics.DestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    lookup_field="id"