import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  
import api from '../api';
import { ProductContext } from '../ProductContext';

function VendorLogin() {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [vendors, setVendors] = useState([]);
    const [isVendor, setIsVendor] = useState(false);
    const { vendor, setVendor } = useContext(ProductContext); 
    const [storeName, setStoreName] = useState("");
    const [contact, setContact] = useState("");
    const [email, setEmail] = useState("");
    const [customer, setCustomer] = useState();
    
    const navigate = useNavigate();  

    const manageLogin = (e) => {
        e.preventDefault();  
        api.post("/vendor/create/", {
            "store_name": storeName,
            "contact": contact,
            "email": email,
            "customer": customer.id,
        })
        .then(() => {
            navigate("/vendorproducts");  // Navigate to vendor products on success
        })
        .catch((err) => console.log(err));
    };

    useEffect(() => {
        api.get('/customer/profile/')
            .then((res) => {
                setLoggedInUser(res.data.user);
                setCustomer(res.data);
                console.log(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    useEffect(() => {
        if (loggedInUser) {
            api.get("/vendor/list/")
                .then((res) => {
                    setVendors(res.data);
                    console.log(res.data);
                    const foundVendor = res.data.find(vendor => vendor.customer.user.id === loggedInUser.id);
                    if (foundVendor) {
                        setIsVendor(true); 
                        setVendor(foundVendor); 
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [loggedInUser]);

    if (isVendor) {
        navigate("/vendorproducts");
    }

    return (
        <div>
            <h1>Vendor Login</h1>
            {loggedInUser && (
                <div>
                    Hi
                    <button onClick={() => navigate('/vendorproducts')}>
                        Go to Vendor Products
                    </button>
                    <form onSubmit={manageLogin}>
                        <h3>Welcome, {loggedInUser.username}</h3>
                        <input
                            type="text"
                            placeholder="store name"
                            value={storeName}
                            onChange={(e) => setStoreName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="contact"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button type="submit">Submit</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default VendorLogin;
