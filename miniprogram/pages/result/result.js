const results = require('../../data/results.js');

Page({
  data: {
    level: null,
    score: 0,
    maxScore: 60,
  },

  onLoad() {
    const app = getApp();
    const score = app.globalData.score;
    const levels = results.levels;

    let matched = levels[0];
    for (const lvl of levels) {
      if (score >= lvl.range[0] && score <= lvl.range[1]) {
        matched = lvl;
        break;
      }
    }

    this.setData({ level: matched, score });
  },

  goToPoster() {
    wx.navigateTo({ url: '/pages/poster/poster' });
  },

  retake() {
    const app = getApp();
    app.globalData.score = 0;
    app.globalData.answers = [];
    wx.redirectTo({ url: '/pages/quiz/quiz' });
  },

  onShareAppMessage() {
    const lvl = this.data.level;
    return {
      title: lvl ? lvl.share_text : '测测你的文化DNA偏好,结果太准了',
      path: '/pages/index/index',
    };
  },
  onShareTimeline() {
    const lvl = this.data.level;
    return { title: lvl ? lvl.share_text : '文化DNA检测 · 你的生活习惯说明了一切' };
  },
});
