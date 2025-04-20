import '../styles/globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  // Check if the current page is an auth page (login, register, etc.)
  const isAuthPage = router.pathname === '/login' || 
                    router.pathname === '/register' || 
                    router.pathname.startsWith('/auth/');

  // Use the layout defined at the page level, if available
  // Otherwise, use the default layout (except for auth pages)
  const getLayout = Component.getLayout || 
                   (page => isAuthPage ? page : <Layout>{page}</Layout>);

  return (
    <AuthProvider>
      {getLayout(<Component {...pageProps} />)}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </AuthProvider>
  );
}

export default MyApp; 