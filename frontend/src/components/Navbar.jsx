import React, { useContext, useEffect, useState } from "react";
import logo from "../assets/DP.jpeg";
import cart_icon from "../assets/cart_icon.png";
import { ProductContext } from "../ProductContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Navbar() {
  const [search, setSearch] = useState("");
  const { orders, setOrders } = useContext(ProductContext);
  const [cartNumber, setCartNumber] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(orders);
    setCartNumber(orders.length);
  }, [orders]);

  return (
    <nav className="bg-white shadow-md ">
      <div className="w-full bg-gray-100 p-2 text-gray-600">
        <a href="/vendor_register">Sell on E-commerce</a>
      </div>
      <div className="flex justify-between items-center px-4 py-4 h-[100px]">
        <div className="flex items-center space-x-4">
          <p className="text-4xl font-semibold text-gray-800">E-commerce</p>
          <img
            src={logo}
            alt="logo"
            className="w-[40px] h-[40px] rounded-full"
          />
        </div>

        <input
          placeholder="Search"
          value={search}
          className="w-1/4 h-[60px] p-1 rounded-md text-gray-50 border-2 "
        />
        <button
          onClick={() => performSearch}
          className="text-gray-50 text-3xl bg-orange-500 px-2 h-[57px] w-[120px] rounded-md"
        >
          Search
        </button>

        <div className="flex items-center space-x-6">
          <button className="text-gray-400 hover:text-blue-500 cursor-pointer text-2xl">
            <Link to="/register" style={{ textDecoration: "none" }}>
              Register
            </Link>
          </button>
          <button className="text-gray-400 hover:text-blue-500 cursor-pointer text-2xl">
            <Link to="/login" style={{ textDecoration: "none" }}>
              Login
            </Link>
          </button>
          <button className="text-gray-400 hover:text-blue-500 cursor-pointer text-2xl">
            <Link to="/logout" style={{ textDecoration: "none" }}>
              Logout
            </Link>
          </button>
          <div className="relative">
            <img
              src={cart_icon}
              alt="cart-icon"
              className="w-[50px] h-[50px]"
              onClick={() => navigate("/user_orders")}
            />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {" "}
              {cartNumber > 0 ? cartNumber : 0}{" "}
            </span>
          </div>
        </div>
      </div>
      <ul className="flex space-x-8 text-gray-600 font-medium justify-center gap-10 py-2 border-2">
        <li className="hover:text-blue-500 cursor-pointer bg-orange-300 px-4 py-2 rounded-md text-gray-600">
          LG
        </li>
        <li className="hover:text-blue-500 cursor-pointer bg-orange-300 px-4 py-2 rounded-md text-gray-600">
          SAMSUNG
        </li>
        <li className="hover:text-blue-500 cursor-pointer bg-orange-300 px-4 py-2 rounded-md text-gray-600">
          SONY
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
