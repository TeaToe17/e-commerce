import requests
from django.shortcuts import render
from django.conf import settings

from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView 
from django.urls import reverse
import stripe

from .serializers import OrderSerializer
from .models import Order
from products.models import Product
from customers.models import Customer
# from vendors.serializers import VendorOrderSerializer
stripe.api_key = settings.STRIPE_SECRET_KEY


from rest_framework.response import Response
from rest_framework import status

class OrderCreate(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        user = request.user
        try:
            customer = Customer.objects.get(user=user)  # Get the customer based on the authenticated user
            
            # Extract products from the request data
            products = request.data.get('products', {})
            
            # Ensure products is a dictionary
            if not isinstance(products, dict):
                return Response({"error": "Products must be provided as a dictionary."}, status=status.HTTP_400_BAD_REQUEST)

            # Initialize the serializer with `customer` and `status`
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            order = serializer.save(customer=customer, status="ordered")

            # Add products to the order if it saved successfully
            for product_id, quantity in products.items():
                product = Product.objects.get(id=product_id)
                order.products.add(product, through_defaults={'quantity': quantity})

            # Return order ID after creation
            return Response({
                "message": "Order created successfully!",
                "order_id": order.id
            }, status=status.HTTP_201_CREATED)
        except Customer.DoesNotExist:
            return Response({"error": "Customer not found."}, status=status.HTTP_404_NOT_FOUND)
        except Product.DoesNotExist:
            return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)


class OrderDelete(generics.DestroyAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        customer = Customer.objects.filter(user=self.request.user).first()
        if customer:
            return Order.objects.filter(customer=customer)
        return Order.objects.none()

    def destroy(self, request, *args, **kwargs):
        order = self.get_object()
        order.delete()
        return Response({"message": "Order deleted successfully!"}, status=204)
    
class CreatePaymentIntentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        order_id = request.data.get('order_id')
        try:
            order = Order.objects.get(id=order_id)
            if order.cost < 50:  # Stripe's minimum charge is around $0.50 in USD
                intent = stripe.SetupIntent.create(
                    metadata={'order_id': order.id}
                )
                return Response({
                    'clientSecret': intent.client_secret,
                    'setupIntent': True,
                    'message': 'Setup Intent created for order below minimum amount.'
                })
            else:
                intent = stripe.PaymentIntent.create(
                    amount=int(order.cost * 100),  # amount in cents
                    currency='usd',
                    metadata={'order_id': order.id}
                )
                return Response({'clientSecret': intent.client_secret})
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)