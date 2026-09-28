if (import.meta.env.MODE === 'mobile') {
  void import('./mobile/bootstrap');
} else {
  void import('./web/bootstrap');
}
