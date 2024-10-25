from django.urls import path

from products.views import ProductCreate, ProductUpdate,  ProductDelete
from .views import ListVendorOrders, ListVendor, CreateVendor, CreateAccountSession


urlpatterns = [
    path("product/create/", ProductCreate.as_view(), name="product-create"),
    path("product/update/<int:id>/", ProductUpdate.as_view(), name="product-update"),
    path("product/delete/<int:id>/", ProductDelete.as_view(), name="product-list"),
    path("orders/list/", ListVendorOrders.as_view(),name="vendor-incoming-orders"),
    path("list/",ListVendor.as_view(),name="list-vendors"),
    path("account/",CreateVendor.as_view(),name="create-vendors"),
    # path("account/",CreateConnectedAccount.as_view(),name="create-connected-account"),
    path("account_session/",CreateAccountSession.as_view(),name="create-account-session"),
]