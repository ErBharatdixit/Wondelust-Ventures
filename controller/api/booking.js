const Booking = require("../../models/booking");
const Listing = require("../../models/listing");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const notificationController = require("./notification");

const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
});

module.exports.createBookingOrder = async (req, res) => {
      try {
            const { listingId, checkIn, checkOut, totalPrice } = req.body;

            const options = {
                  amount: totalPrice * 100, // amount in smallest currency unit (paise)
                  currency: "INR",
                  receipt: `receipt_${Date.now()}`
            };

            const order = await razorpay.orders.create(options);

            res.status(200).json({
                  orderId: order.id,
                  amount: order.amount,
                  currency: order.currency,
                  keyId: process.env.RAZORPAY_KEY_ID
            });
      } catch (err) {
            console.error("Error creating Razorpay order:", err);
            res.status(500).json({ error: err.message });
      }
};

module.exports.verifyPayment = async (req, res) => {
      try {
            const {
                  razorpay_order_id,
                  razorpay_payment_id,
                  razorpay_signature,
                  bookingDetails
            } = req.body;

            const sign = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSign = crypto
                  .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                  .update(sign.toString())
                  .digest("hex");

            if (razorpay_signature === expectedSign) {
                  const { listingId, checkIn, checkOut, totalPrice } = bookingDetails;

                  const newBooking = new Booking({
                        user: req.user._id,
                        listing: listingId,
                        checkIn,
                        checkOut,
                        totalPrice,
                        status: 'Confirmed',
                        paymentId: razorpay_payment_id,
                        orderId: razorpay_order_id
                  });

                  await newBooking.save();

                  // Create notification for host
                  const listing = await Listing.findById(listingId).populate('owner');
                  if (listing && listing.owner) {
                        await notificationController.createNotification(
                              listing.owner._id,
                              req.user._id,
                              'booking_confirmed',
                              `New booking confirmed for ${listing.title}`,
                              newBooking._id
                        );
                  }

                  res.status(200).json({ message: "Payment verified and booking created", booking: newBooking });
            } else {
                  res.status(400).json({ message: "Invalid signature sent!" });
            }
      } catch (err) {
            console.error("Error verifying payment:", err);
            res.status(500).json({ error: err.message });
      }
};

module.exports.getUserBookings = async (req, res) => {
      try {
            const bookings = await Booking.find({ user: req.user._id })
                  .populate('listing')
                  .sort({ createdAt: -1 });
            res.status(200).json(bookings);
      } catch (err) {
            res.status(500).json({ error: err.message });
      }
};
