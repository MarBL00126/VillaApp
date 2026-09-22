import api from './api';

export const fanService = {
  getPoints: () => api.get('/points').then(r => r.data),
  getTransactions: () => api.get('/points/transactions').then(r => r.data),
  getLeaderboard: () => api.get('/points/leaderboard').then(r => r.data),
  getBadges: () => api.get('/badges/my').then(r => r.data),
  getRewards: () => api.get('/rewards').then(r => r.data),
  getRedemptions: () => api.get('/rewards/my').then(r => r.data),
  redeemReward: (id: number) => api.post(`/rewards/${id}/redeem`).then(r => r.data),
  predict: (payload: { matchId: number; predictedHomeScore: number; predictedAwayScore: number }) =>
    api.post('/predictions', payload).then(r => r.data),
  getPredictions: (matchId: number) => api.get(`/predictions/match/${matchId}`).then(r => r.data),
  getTrivia: () => api.get('/trivia').then(r => r.data),
  getTriviaDetail: (id: number) => api.get(`/trivia/${id}`).then(r => r.data),
  submitTrivia: (id: number, selectedOptionIds: number[]) =>
    api.post(`/trivia/${id}/submit`, { selectedOptionIds }).then(r => r.data),
  getPolls: () => api.get('/polls').then(r => r.data),
  getPollDetail: (id: number) => api.get(`/polls/${id}`).then(r => r.data),
  votePoll: (id: number, optionId: number) => api.post(`/polls/${id}/vote`, { optionId }).then(r => r.data),
  getMvpPolls: (matchId: number) => api.get(`/mvp/match/${matchId}`).then(r => r.data),
  voteMvp: (pollId: number, optionId: number) => api.post('/mvp/vote', { pollId, optionId }).then(r => r.data),
  getComments: (targetType: string, targetId: number) =>
    api.get('/comments', { params: { targetType, targetId } }).then(r => r.data),
  getFanWall: () => api.get('/comments/fan-wall').then(r => r.data),
  addComment: (targetType: string, targetId: number, content: string) =>
    api.post('/comments', { targetType, targetId, content }).then(r => r.data),
  react: (targetType: string, targetId: number, type: string) =>
    api.post('/reactions', { targetType, targetId, type }).then(r => r.data),
  getReactions: (targetType: string, targetId: number) =>
    api.get('/reactions', { params: { targetType, targetId } }).then(r => r.data),
};
