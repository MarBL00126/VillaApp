import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedLayout } from "./components/ProtectedLayout";
import { LoginScreen } from "./screens/LoginScreen";
import { RegisterScreen } from "./screens/RegisterScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { PlayersScreen } from "./screens/PlayersScreen";
import { PlayerDetailScreen } from "./screens/PlayerDetailScreen";
import { FixtureScreen } from "./screens/FixtureScreen";
import { StatsScreen } from "./screens/StatsScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import TicketScreen from "./screens/TicketScreen";
import OrderScreen from "./screens/OrderScreen";
import PaymentSuccessScreen from "./screens/PaymentSuccessScreen";
import PaymentFailureScreen from "./screens/PaymentFailureScreen";
import QrValidatorScreen from "./screens/QrValidatorScreen";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas publicas */}
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />

          {/* Rutas protegidas con navbar */}
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/players" element={<PlayersScreen />} />
            <Route path="/players/:id" element={<PlayerDetailScreen />} />
            <Route path="/fixture" element={<FixtureScreen />} />
            <Route path="/stats" element={<StatsScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/matches/:id/tickets" element={<TicketScreen />}/>
            <Route path="/orders/:id" element={<OrderScreen />}/>
            <Route path="/payment/success" element={<PaymentSuccessScreen />}/>
            <Route path="/payment/failure" element={<PaymentFailureScreen />}/>
            <Route path="/admin/validate" element={<QrValidatorScreen />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
