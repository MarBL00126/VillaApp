import { lazy, Suspense, type ComponentType } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedLayout } from './components/ProtectedLayout';
import { AdminRoute } from './components/AdminRoute';
import { Layout } from './components/Layout';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorBoundary } from './components/ErrorBoundary';

const lazyNamed = <T extends Record<string, unknown>, K extends keyof T>(
  loader: () => Promise<T>,
  name: K,
) => lazy(() => loader().then((module) => ({ default: module[name] as ComponentType })));

const LoginScreen = lazyNamed(() => import('./screens/LoginScreen'), 'LoginScreen');
const RegisterScreen = lazyNamed(() => import('./screens/RegisterScreen'), 'RegisterScreen');
const HomeScreen = lazyNamed(() => import('./screens/HomeScreen'), 'HomeScreen');
const PlayersScreen = lazyNamed(() => import('./screens/PlayersScreen'), 'PlayersScreen');
const PlayerDetailScreen = lazyNamed(() => import('./screens/PlayerDetailScreen'), 'PlayerDetailScreen');
const FixtureScreen = lazyNamed(() => import('./screens/FixtureScreen'), 'FixtureScreen');
const StatsScreen = lazyNamed(() => import('./screens/StatsScreen'), 'StatsScreen');
const ProfileScreen = lazyNamed(() => import('./screens/ProfileScreen'), 'ProfileScreen');
const TicketScreen = lazy(() => import('./screens/TicketScreen'));
const OrderScreen = lazy(() => import('./screens/OrderScreen'));
const PaymentSuccessScreen = lazy(() => import('./screens/PaymentSuccessScreen'));
const PaymentFailureScreen = lazy(() => import('./screens/PaymentFailureScreen'));
const QrValidatorScreen = lazy(() => import('./screens/QrValidatorScreen'));
const AdminScreen = lazyNamed(() => import('./screens/AdminScreen'), 'AdminScreen');
const ShopScreen = lazyNamed(() => import('./screens/ShopScreen'), 'ShopScreen');
const ProductDetailScreen = lazyNamed(() => import('./screens/ProductDetailScreen'), 'ProductDetailScreen');
const CartScreen = lazyNamed(() => import('./screens/CartScreen'), 'CartScreen');
const ShopOrderHistoryScreen = lazyNamed(() => import('./screens/ShopOrderHistoryScreen'), 'ShopOrderHistoryScreen');
const ShopOrderScreen = lazyNamed(() => import('./screens/ShopOrderScreen'), 'ShopOrderScreen');
const FavoriteProductsScreen = lazyNamed(() => import('./screens/FavoriteProductsScreen'), 'FavoriteProductsScreen');
const NewsScreen = lazyNamed(() => import('./screens/NewsScreen'), 'NewsScreen');
const NewsDetailScreen = lazyNamed(() => import('./screens/NewsDetailScreen'), 'NewsDetailScreen');
const FavoriteNewsScreen = lazyNamed(() => import('./screens/FavoriteNewsScreen'), 'FavoriteNewsScreen');
const MediaScreen = lazyNamed(() => import('./screens/MediaScreen'), 'MediaScreen');
const GalleryScreen = lazyNamed(() => import('./screens/GalleryScreen'), 'GalleryScreen');
const VideoPlayerScreen = lazyNamed(() => import('./screens/VideoPlayerScreen'), 'VideoPlayerScreen');
const CantinaScreen = lazyNamed(() => import('./screens/CantinaScreen'), 'CantinaScreen');
const CantinaMenuScreen = lazyNamed(() => import('./screens/CantinaMenuScreen'), 'CantinaMenuScreen');
const CantinaCartScreen = lazyNamed(() => import('./screens/CantinaCartScreen'), 'CantinaCartScreen');
const CantinaOrderStatusScreen = lazyNamed(() => import('./screens/CantinaOrderStatusScreen'), 'CantinaOrderStatusScreen');
const MembershipScreen = lazyNamed(() => import('./screens/MembershipScreen'), 'MembershipScreen');
const MembershipSignupScreen = lazyNamed(() => import('./screens/MembershipSignupScreen'), 'MembershipSignupScreen');
const FeeHistoryScreen = lazyNamed(() => import('./screens/FeeHistoryScreen'), 'FeeHistoryScreen');
const DigitalCardScreen = lazyNamed(() => import('./screens/DigitalCardScreen'), 'DigitalCardScreen');
const BenefitsScreen = lazyNamed(() => import('./screens/BenefitsScreen'), 'BenefitsScreen');
const TeamProfileScreen = lazyNamed(() => import('./screens/TeamProfileScreen'), 'TeamProfileScreen');
const NotificationsScreen = lazyNamed(() => import('./screens/NotificationsScreen'), 'NotificationsScreen');
const PreferencesScreen = lazyNamed(() => import('./screens/PreferencesScreen'), 'PreferencesScreen');
const GameScreen = lazyNamed(() => import('./screens/GameScreen'), 'GameScreen');
const PredictorScreen = lazyNamed(() => import('./screens/PredictorScreen'), 'PredictorScreen');
const TriviaScreen = lazyNamed(() => import('./screens/TriviaScreen'), 'TriviaScreen');
const PollScreen = lazyNamed(() => import('./screens/PollScreen'), 'PollScreen');
const MvpVoteScreen = lazyNamed(() => import('./screens/MvpVoteScreen'), 'MvpVoteScreen');
const RewardsScreen = lazyNamed(() => import('./screens/RewardsScreen'), 'RewardsScreen');
const RewardCatalogScreen = lazyNamed(() => import('./screens/RewardCatalogScreen'), 'RewardCatalogScreen');
const LeaderboardScreen = lazyNamed(() => import('./screens/LeaderboardScreen'), 'LeaderboardScreen');
const FanWallScreen = lazyNamed(() => import('./screens/FanWallScreen'), 'FanWallScreen');
const MatchChatScreen = lazyNamed(() => import('./screens/MatchChatScreen'), 'MatchChatScreen');
const AdminGameCenterScreen = lazyNamed(() => import('./screens/AdminGameCenterScreen'), 'AdminGameCenterScreen');
const BoxScoreScreen = lazyNamed(() => import('./screens/BoxScoreScreen'), 'BoxScoreScreen');
const GameCenterScreen = lazyNamed(() => import('./screens/GameCenterScreen'), 'GameCenterScreen');
const PlayByPlayScreen = lazyNamed(() => import('./screens/PlayByPlayScreen'), 'PlayByPlayScreen');
const SeasonLeadersScreen = lazyNamed(() => import('./screens/SeasonLeadersScreen'), 'SeasonLeadersScreen');
const ShotChartScreen = lazyNamed(() => import('./screens/ShotChartScreen'), 'ShotChartScreen');
const StandingsScreen = lazyNamed(() => import('./screens/StandingsScreen'), 'StandingsScreen');
const ConfigScreen = lazyNamed(() => import('./screens/ConfigScreen'), 'ConfigScreen');
const StadiumAdminScreen = lazyNamed(() => import('./screens/StadiumAdminScreen'), 'StadiumAdminScreen');
const StadiumScreen = lazyNamed(() => import('./screens/StadiumScreen'), 'StadiumScreen');
const AccessScanScreen = lazyNamed(() => import('./screens/AccessScanScreen'), 'AccessScanScreen');
const AccessLogsScreen = lazyNamed(() => import('./screens/AccessLogsScreen'), 'AccessLogsScreen');
const PressRequestScreen = lazyNamed(() => import('./screens/PressRequestScreen'), 'PressRequestScreen');
const MyAccreditationsScreen = lazyNamed(() => import('./screens/MyAccreditationsScreen'), 'MyAccreditationsScreen');
const PressCardScreen = lazyNamed(() => import('./screens/PressCardScreen'), 'PressCardScreen');
const PressAdminScreen = lazyNamed(() => import('./screens/PressAdminScreen'), 'PressAdminScreen');


export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/register" element={<RegisterScreen />} />

              <Route element={<Layout />}>
                
                <Route path="/stadium" element={<StadiumScreen />} />
                <Route path="/press/request" element={<PressRequestScreen />} />
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
                <Route path="/game-center/:matchId" element={<GameCenterScreen />} />
                <Route path="/game-center/:matchId/plays" element={<PlayByPlayScreen />} />
                <Route path="/game-center/:matchId/box-score" element={<BoxScoreScreen />} />
                <Route path="/game-center/:matchId/shot-chart" element={<ShotChartScreen />} />
                <Route path="/standings" element={<StandingsScreen />} />
                <Route path="/stats/leaders" element={<SeasonLeadersScreen />} />
              </Route>

              <Route element={<ProtectedLayout />}>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/fixture" element={<FixtureScreen />} />
                <Route path="/stats" element={<StatsScreen />} />
                <Route path="/profile" element={<ProfileScreen />} />
                <Route path="/matches/:id/tickets" element={<TicketScreen />} />
                <Route path="/orders/:id" element={<OrderScreen />} />
                <Route path="/payment/success" element={<PaymentSuccessScreen />} />
                <Route path="/payment/failure" element={<PaymentFailureScreen />} />
                <Route path="/admin" element={<AdminRoute><AdminScreen /></AdminRoute>} />
                <Route path="/admin/validate" element={<QrValidatorScreen />} />
                <Route path="/admin/game-center/:matchId" element={<AdminRoute><AdminGameCenterScreen /></AdminRoute>} />
                <Route path="/admin/config" element={<AdminRoute><ConfigScreen /></AdminRoute>} />
                <Route path="/admin/stadium" element={<AdminRoute><StadiumAdminScreen /></AdminRoute>} />
                <Route path="/admin/access/scan" element={<AdminRoute><AccessScanScreen /></AdminRoute>} />
                <Route path="/admin/access/logs/:matchId" element={<AdminRoute><AccessLogsScreen /></AdminRoute>} />
                <Route path="/admin/press" element={<AdminRoute><PressAdminScreen /></AdminRoute>} />


                <Route path="/shop" element={<ShopScreen />} />
                <Route path="/shop/products/:id" element={<ProductDetailScreen />} />
                <Route path="/shop/cart" element={<CartScreen />} />
                <Route path="/shop/favorites" element={<FavoriteProductsScreen />} />
                <Route path="/shop/orders" element={<ShopOrderHistoryScreen />} />
                <Route path="/shop/orders/:id" element={<ShopOrderScreen />} />
                <Route path="/news/favorites" element={<FavoriteNewsScreen />} />
                <Route path="/press/my" element={<MyAccreditationsScreen />} />
                <Route path="/press/:id/card" element={<PressCardScreen />} />


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
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

