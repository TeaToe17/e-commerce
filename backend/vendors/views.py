from django.shortcuts import render
from rest_framework import generics,status
from rest_framework.response import Response

from rest_framework.permissions import IsAuthenticated, AllowAny

from .serializers import VendorOrderSerializer, VendorSerializer, CreateVendorSerializer
from .models import Vendor
from orders.models import Order
from django.conf import settings

import stripe
from dotenv import load_dotenv
import os

load_dotenv()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

class ListVendorOrders(generics.ListAPIView):
    serializer_class = VendorOrderSerializer  
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        vendor = Vendor.objects.filter(user=user)
        if vendor:
            return Order.objects.filter(product__vendor=vendor)
        else:
            return Order.objects.none()

class ListVendor(generics.ListAPIView):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
    permission_classes = [AllowAny]
        
    def get_queryset(self):
        return Vendor.objects.all()
    
class CreateVendor(generics.CreateAPIView): 
    queryset = Vendor.objects.all()
    serializer_class = CreateVendorSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Extract the email from validated data
            email = serializer.validated_data['email']
            
            try:
                # Create a Stripe connected account
                account = stripe.Account.create(
                    type='express',  # 'express' or 'standard'
                    country='US',  # Adjust the country based on your requirements
                    email=email,
                )

                # Save Stripe account ID to the validated data
                serializer.validated_data['stripe_account_id'] = account.id

                # Perform the creation of the vendor
                self.perform_create(serializer)
                
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            except stripe.error.StripeError as e:
                # Handle Stripe errors and return a response
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class CreateAccountSession(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            connected_account_id = request.data.get('account')

            # Ensure that the connected_account_id is provided
            if not connected_account_id:
                return Response({'error': 'Account ID is required'}, status=status.HTTP_400_BAD_REQUEST)

            # Create an account session to allow the vendor to onboard via Stripe
            account_session = stripe.AccountSession.create(
                account=connected_account_id,
                components={
                    "account_onboarding": {"enabled": True},
                },
            )

            return Response({
                'client_secret': account_session.client_secret,
            }, status=status.HTTP_200_OK)

        except stripe.error.StripeError as e:
            # Handle Stripe API errors
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': 'An internal error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
