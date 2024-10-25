from django.urls import path

from .views import OrderCreate, OrderDelete, CreatePaymentIntentView

urlpatterns = [ 
    path("create/", OrderCreate.as_view(), name="order-create"),
    path("delete/<int:id>/", OrderDelete.as_view(), name="order-delete"),
    path("createpaymentintent/", CreatePaymentIntentView.as_view(), name="create-intent"),
]