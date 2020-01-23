import http from "k6/http";
import { sleep } from "k6";

export let options = {
  vus: 5,
  iterations: 10000
};

export default function() {
    var url = "http://localhost:8000/order/create";
    var payload = JSON.stringify({
        bid: 1,
        user_id: 1,
        dev_id: 1,
        dev_serial: 1,
        chid: 1,
        order_info: {
            invoice_number: 1,
            chid: "123",
            seller_name: "seller_name",
            seller_id: "seller_id",
            customer_id: "customer_id",
            customer_name: "customer_name",
            customer_address: "customer_address",
            customer_phone: "customer_phone",
            total_tax_inc: 0,
            total_tax_exc: 0,
            tax: 0,
            tax_label: "tax_label",
            total_discount: 0,
            total_no_disc: 0,
            invoice_type: "normal",
            products: [
                {
                    gid: 123
                },
                {
                    gid: 456
                },
                {
                    gid: 789
                }
            ]
        }
    });
    var params =  { headers: { "Content-Type": "application/json" } }
    http.post(url, payload, params);
    // sleep(1);
};