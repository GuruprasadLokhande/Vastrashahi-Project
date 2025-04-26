import store from "@/redux/store";
import { Provider } from "react-redux";
import ReactModal from "react-modal";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import '../styles/index.scss';
import '../styles/mobile-fixes.css';
import { GoogleOAuthProvider } from "@react-oauth/google";
import FixCategoryImages from "@/components/common/fix-category-images";

if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap");
}

if (typeof window !== "undefined") {
  ReactModal.setAppElement("body");
}

// stripePromise
const NEXT_PUBLIC_STRIPE_KEY = 'pk_test_51RGWxsRK9jjlQkjc4CjcTYAunSVwhZDEbIANlTYuwaZEAd1AodWVF3B4hWstBxTmjpL5HuU7KXJCQAGdb7vUbjge00trf3HjSu';
const stripePromise = loadStripe(NEXT_PUBLIC_STRIPE_KEY, {
  apiVersion: '2023-10-16',
  stripeAccount: undefined,
  locale: 'en',
  betas: [],
  appearance: {
    theme: 'stripe',
    variables: {
      colorPrimary: '#0570de',
      colorBackground: '#ffffff',
      colorText: '#30313d',
      colorDanger: '#df1b41',
      fontFamily: 'Ideal Sans, system-ui, sans-serif',
      spacingUnit: '2px',
      borderRadius: '4px',
    },
  },
});
const NEXT_PUBLIC_GOOGLE_CLIENT_ID = '903081644488-n60j77h2s46n2anpau0p5krrjrpi8aae.apps.googleusercontent.com'
export default function App({ Component, pageProps }) {
  return (
    <GoogleOAuthProvider clientId={NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <Elements stripe={stripePromise}>
          <div id="root">
            <Component {...pageProps} />
            <FixCategoryImages />
          </div>
        </Elements>
      </Provider>
    </GoogleOAuthProvider>
  )
}
