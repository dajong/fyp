/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
// const stripe = Stripe('pk_test_51GrJBzJVE08BDnB5pr3Cor6WmbscSqBuCIrPj3Lrk0HDb7C7rvJEJnoJdwewN5MYicslFPThh1Xt44aUhi3BU5SS00qDioB7R8');

// export const bookTourWithStripe = async tourId => {
//   try {
//     // 1) Get checkout session from API
//     const session = await axios(
//       `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`
//     );
//     console.log(session);

//     // 2) Create checkout form + chanre credit card
//     await stripe.redirectToCheckout({
//       sessionId: session.data.session.id
//     });
//   } catch (err) {
//     console.log(err);
//     showAlert('error', err);
//   }
// };

export const bookTourWithStripe = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);

    // 2) Create checkout form + chanre credit card
    
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
