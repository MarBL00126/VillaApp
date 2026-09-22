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
import { AdminRoute } from "./components/AdminRoute";
import { AdminScreen } from "./screens/AdminScreen";

import { ShopScreen } from "./screens/ShopScreen";
import { ProductDetailScreen } from "./screens/ProductDetailScreen";
import { CartScreen } from "./screens/CartScreen";
import { ShopOrderHistoryScreen } from "./screens/ShopOrderHistoryScreen";
import { ShopOrderScreen } from "./screens/ShopOrderScreen";
import { FavoriteProductsScreen } from "./screens/FavoriteProductsScreen";

import { NewsScreen } from "./screens/NewsScreen";
import { NewsDetailScreen } from "./screens/NewsDetailScreen";
import { FavoriteNewsScreen } from "./screens/FavoriteNewsScreen";
import { MediaScreen } from "./screens/MediaScreen";
import { GalleryScreen } from "./screens/GalleryScreen";
import { VideoPlayerScreen } from "./screens/VideoPlayerScreen";

import { CantinaScreen } from "./screens/CantinaScreen";
import { CantinaMenuScreen } from "./screens/CantinaMenuScreen";
import { CantinaCartScreen } from "./screens/CantinaCartScreen";
import { CantinaOrderStatusScreen } from "./screens/CantinaOrderStatusScreen";
import { Layout } from "./components/Layout";

import { MembershipScreen } from './screens/MembershipScreen';
import { MembershipSignupScreen } from './screens/MembershipSignupScreen';
import { FeeHistoryScreen } from './screens/FeeHistoryScreen';
import { DigitalCardScreen } from './screens/DigitalCardScreen';
import { BenefitsScreen } from './screens/BenefitsScreen';
import { TeamProfileScreen } from './screens/TeamProfileScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { PreferencesScreen } from './screens/PreferencesScreen';
import { GameScreen } from './screens/GameScreen';
import { PredictorScreen } from './screens/PredictorScreen';
import { TriviaScreen } from './screens/TriviaScreen';
import { PollScreen } from './screens/PollScreen';
import { MvpVoteScreen } from './screens/MvpVoteScreen';
import { RewardsScreen } from './screens/RewardsScreen';
import { RewardCatalogScreen } from './screens/RewardCatalogScreen';
import { LeaderboardScreen } from './screens/LeaderboardScreen';
import { FanWallScreen } from './screens/FanWallScreen';
import { MatchChatScreen } from './screens/MatchChatScreen';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas publicas (sin Layout o con uno diferente, pero segun requerimientos pueden ir solas) */}
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          
          {/* Public routes that use the navbar */}
          <Route element={<Layout />}>
            <Route path="/cantina" element={<CantinaScreen />} />
            <Route path="/cantina/menu" element={<CantinaMenuScreen />} />
            <Route path="/cantina/cart" element={<CantinaCartScreen />} />
            <Route path="/cantina/orders/:orderNumber" element={<CantinaOrderStatusScreen />} />
            <Route path="/cantina/orders/:orderNumber/track" element={<CantinaOrderStatusScreen />} />
            <Route path="/players" element={<PlayersScreen />} />
            <Route path="/players/:id" element={<PlayerDetailScreen />} />
            <Route path="/news" element={<NewsScreen />} />
            <Route path="/news/:id" element={<NewsDetailScreen />} />
            <Route path="/media" element={<MediaScreen />} />
            <Route path="/media/galleries/:id" element={<GalleryScreen />} />
            <Route path="/media/videos/:id" element={<VideoPlayerScreen />} />
          </Route>

          {/* Rutas protegidas con navbar */}
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/fixture" element={<FixtureScreen />} />
            <Route path="/stats" element={<StatsScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/matches/:id/tickets" element={<TicketScreen />}/>
            <Route path="/orders/:id" element={<OrderScreen />}/>
            <Route path="/payment/success" element={<PaymentSuccessScreen />}/>
            <Route path="/payment/failure" element={<PaymentFailureScreen />}/>
            <Route path="/admin" element={<AdminRoute><AdminScreen /></AdminRoute>} />
            <Route path="/admin/validate" element={<QrValidatorScreen />} />
            
            <Route path="/shop" element={<ShopScreen />} />
            <Route path="/shop/products/:id" element={<ProductDetailScreen />} />
            <Route path="/shop/cart" element={<CartScreen />} />
            <Route path="/shop/favorites" element={<FavoriteProductsScreen />} />
            <Route path="/shop/orders" element={<ShopOrderHistoryScreen />} />
            <Route path="/shop/orders/:id" element={<ShopOrderScreen />} />
            <Route path="/news/favorites" element={<FavoriteNewsScreen />} />
            
            <Route path="/membership" element={<MembershipScreen />} />
            <Route path="/membership/signup" element={<MembershipSignupScreen />} />
            <Route path="/membership/card" element={<DigitalCardScreen />} />
            <Route path="/fees" element={<FeeHistoryScreen />} />
            <Route path="/benefits" element={<BenefitsScreen />} />
            <Route path="/team" element={<TeamProfileScreen />} />
            <Route path="/notifications" element={<NotificationsScreen />} />
            <Route path="/preferences" element={<PreferencesScreen />} />
            <Route path="/game" element={<GameScreen />} />
            <Route path="/game/predictor" element={<PredictorScreen />} />
            <Route path="/game/trivia/:id" element={<TriviaScreen />} />
            <Route path="/game/polls/:id" element={<PollScreen />} />
            <Route path="/game/mvp/:matchId" element={<MvpVoteScreen />} />
            <Route path="/rewards" element={<RewardsScreen />} />
            <Route path="/rewards/catalog" element={<RewardCatalogScreen />} />
            <Route path="/rewards/leaderboard" element={<LeaderboardScreen />} />
            <Route path="/community" element={<FanWallScreen />} />
            <Route path="/matches/:id/chat" element={<MatchChatScreen />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
