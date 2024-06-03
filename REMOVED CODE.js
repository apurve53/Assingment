app.post('/order', async (req, res) => {
  const { buyer, qty, price } = req.body;
  const transaction = await sequelize.transaction();
  try {
    const pendingOrders = await PendingOrder.findAll({ lock: true, transaction });
    let remainingQty = qty;
    for (let order of pendingOrders) {
      //Move matched order to completed order
      if (buyer && price >= order.sellerPrice) {
        const matchedQty = Math.min(remainingQty, order.sellerQty);
        await CompletedOrder.create({
          price: order.sellerPrice,
          qty: matchedQty
        }, { transaction });

        if (order.sellerQty > remainingQty) {
          await order.update({ sellerQty: order.sellerQty - remainingQty }, { transaction });
          remainingQty = 0;
          break; // All buyer quantity is matched
        } else {
          remainingQty -= order.sellerQty;
          await order.destroy({ transaction });
        }
      }
    }

    //if there is remaining quantity add it to the Panding order table.
    if (remainingQty > 0) {
      await PendingOrder.create({
        buyerQty: remainingQty,
        buyerPrice: price,
        sellerPrice: price + 1, // Placeholder price, adjust as necessary
        sellerQty: 0
      }, { transaction });
    }
    await transaction.commit();
    res.status(200).send('Order processed successfully');

  } catch (e) {
    await transaction.rollback();
    res.status(500).send('Error processing order: ' + error.message);
  }
})