import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './components/Home';
import ListingList from './components/ListingList';
import ListingDetail from './components/ListingDetail';
import ListingForm from './components/ListingForm';
import Login from './components/Login';
import Signup from './components/Signup';
import UserProfile from './components/UserProfile';
import Favorites from './components/Favorites';
import VerificationPending from './components/VerificationPending';
import OTPVerification from './components/OTPVerification';
import Chat from './components/Chat';
import Inbox from './components/Inbox';
import MyBookings from './components/MyBookings';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{
        duration: 3000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }} />
      <Router>
        <div className="App min-h-screen bg-gray-50 flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/listings" element={<ListingList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verification-pending" element={<VerificationPending />} />
            <Route path="/verify-otp" element={<OTPVerification />} />
            <Route path="/listings/new" element={<ListingForm />} />
            <Route path="/listings/:id" element={<ListingDetail />} />
            <Route path="/listings/:id/edit" element={<ListingForm />} />
            <Route path="/profile/:id" element={<UserProfile />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/chat/:userId" element={<Chat />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/my-bookings" element={<MyBookings />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
