Page({
  data: {
    testCount: 0,
  },
  onLoad() {
    const base = 8426;
    const daysSinceLaunch = Math.floor((Date.now() - new Date('2026-05-15').getTime()) / 86400000);
    const count = base + Math.max(0, daysSinceLaunch) * 137 + Math.floor(Math.random() * 50);
    this.setData({ testCount: count });
  },
  startTest() {
    const app = getApp();
    app.globalData.score = 0;
    app.globalData.answers = [];
    wx.navigateTo({ url: '/pages/quiz/quiz' });
  },
  goPrivacy() {
    wx.navigateTo({ url: '/pages/privacy/privacy' });
  },
  onShareAppMessage() {
    return {
      title: '测测你的文化DNA偏好,结果太准了',
      path: '/pages/index/index',
    };
  },
  onShareTimeline() {
    return { title: '文化DNA检测 · 你的生活习惯说明了一切' };
  },
});
