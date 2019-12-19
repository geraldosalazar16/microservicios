const Authorization = require('../libs/Authorization');
const IdGenerator = require('../libs/IdGenerator');
const QuantityStorage = require('../libs/QuantityStorage');
const { sendMessages } = require('../kafka');
const orderDb = require('../schemas/orderSchema');
const { success, failure } = require('../utils/response');

exports.create = async ({ bid, user_id, dev_id, dev_serial, order_info }) => {
  const {
    invoice_number,
    chid,
    seller_name,
    seller_id,
    customer_id,
    customer_name,
    customer_address,
    customer_phone,
    total_tax_inc,
    total_tax_exc,
    tax,
    tax_label,
    total_discount,
    total_no_disc,
    products,
    created_at,
    invoice_type
  } = order_info;
  try {
    // Authorize
    const authorized = await Authorization.authorize('/order/create', {
      user_id,
      dev_id,
      dev_serial,
      bid,
      invoice_type
    });
    if (authorized.status === 'success') {
      const order_id = await IdGenerator.getNextId();
      const order = {
        order_id,
        bid,
        user_id,
        dev_id,
        dev_serial,
        invoice_number,
        chid,
        seller_name,
        seller_id,
        customer_id,
        customer_name,
        customer_address,
        customer_phone,
        total_tax_inc,
        total_tax_exc,
        tax,
        tax_label,
        total_discount,
        total_no_disc,
        products,
        created_at: new Date(),
        invoice_type
      };
      const result = await orderDb.createOrder(order);
      if (result.status === 'success') {
        // Push event on kafka
        const message = JSON.stringify({
          bid,
          user_id,
          dev_id,
          dev_serial,
          order_info,
          created_at: new Date(),
          created_by: user_id
        });
        await sendMessages('order_created', message);

        const items = [];
        order_info.products.forEach(product => {
          let reference;
          if (order_info.chid) {
            reference = `${order_info.chid}.${product.gid}`;
          } else {
            reference = product.gid;
          };
          items.push({
            bid,
            reference,
            amount: product.quantity
          });
        });
        await QuantityStorage.updateBatches(items);
        return success('Record created');
      } else {
        return failure(result.message);
      }
    } else {
      return failure('Not authorized');
    }
  } catch (error) {
    return failure(error.message);
  }
}

exports.list = async ({ user_id, bid }) => {
  try {
    // Authorize
    const authorized = await Authorization.authorize('/order/list', {
      user_id,
      bid
    });
    if (authorized.status === 'success') {
      // Get list of orders with same bid
      const result = await orderDb.listOrders({bid});
      if (result.status === 'success') {
        return {
          status: 'success',
          message: 'Orders listed succesfully',
          orders: result.docs
        }
      } else {
        return failure(result.message);
      }
    } else {
      return failure('Not authorized');
    }
  } catch (error) {
    return {
      status: 'failed',
      message: error.message
    };
  }
}

exports.listByChannel = async ({ user_id, bid, chid }) => {
  try {
    // Authorize
    const authorized = await Authorization.authorize('/order/:byChannel', {
      user_id,
      bid,
      chid
    });
    if (authorized.status === 'success') {
      // Get list of orders with same bid
      const result = await orderDb.listOrdersByChannel({bid, chid});
      if (result.status === 'success') {
        return {
          status: 'success',
          message: 'Orders listed succesfully',
          orders: result.docs
        }
      } else {
        return failure(result.message);
      }
    } else {
      return failure('Not authorized');
    }
  } catch (error) {
    return {
      status: 'failed',
      message: error.message
    };
  }
}