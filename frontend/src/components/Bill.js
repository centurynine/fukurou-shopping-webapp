import React from 'react'
import '../css/bill.css'
function Bill() {
  const customerEmail = sessionStorage.getItem('userEmail');
 
  return (
    <>
    <div className='p-40 '> </div>
    <div class="bill  "> 
    <div class="bill receipt">
    <div class="receipt-header">
      <img class="logo" src="https://fukuroutomo.com/static/media/fukuroutomo.1c6ca8b3d760c432b6c2.png" alt="Logo"/>
      <h2>ใบเสร็จชำระเงิน</h2>
    </div>
    <div class="receipt-details">
      <div class="item">
        <span>อีเมลสั่งซื้อ:</span><span>{customerEmail}</span>
      </div>
      <div class="item">
        {/* <span>ยอดรวมสินค้า:</span><span>${total} บาท</span> */}
      </div>
      <div class="item">
        {/* <span>ค่าจัดส่ง:</span><span>${shippingCost} บาท</span> */}
      </div>
      <div class="item">
        <span>รายการสินค้าที่สั่ง:</span>
      </div>
      <ul class="product-list">
        {/* ${products.map(product => `
          <li class="product-item">- ${product.name} (จำนวน: ${product.qty}, ราคา: ${product.price})</li>
        `).join('')} */}
      </ul>
    </div>
    <div class="receipt-total">
      {/* <span>ยอดรวมทั้งหมด:</span><span>${totalWithShipping} บาท</span> */}
    </div>
    </div>  
    </div>
  </>
  )
}

export default Bill