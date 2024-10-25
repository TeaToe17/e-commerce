from django.urls import path

from .views import CustomerRegisterView, CustomerOrderHistoryView, CustomerDetailsView

urlpatterns = [
    path("register/", CustomerRegisterView.as_view(), name = "register"),
    path("profile/", CustomerDetailsView.as_view(), name = "profile"),
    path("history/", CustomerOrderHistoryView.as_view(), name = "history"),
]