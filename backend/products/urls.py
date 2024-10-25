from django.urls import path, include

from .views import ProductList, ProductCreate, ProductUpdate, ProductDelete

urlpatterns = [
    path("list/", ProductList.as_view(), name="product-list"),
]