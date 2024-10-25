import React from 'react'

function VendorOrders() {
    const [vendorOrders, setVendorOrders] = useState(()=>{
        const  data = localStorage.getItem("selectedProducts");
        return data ? JSON.parse(data) : [];
    })

  return (
    <div className="">
        {
            vendorOrders.map(()=>{

            })
        }
    </div>
  )
}

export default VendorOrders

