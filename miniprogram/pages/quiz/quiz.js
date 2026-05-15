const questions = require('../../data/questions.json').questions;

Page({
  data: {
    currentIndex: 0,
    total: questions.length,
    currentQ: questions[0],
    selectedIdx: -1,
    progressPercent: 0,
    isLast: false,
  },

  onLoad() {
    this.setData({
      currentQ: questions[0],
      progressPercent: (1 / questions.length) * 100,
      isLast: questions.length === 1,
    });
  },

  selectOption(e) {
    const idx = e.currentTarget.dataset.idx;
    this.setData({ selectedIdx: idx });
  },

  nextQuestion() {
    if (this.data.selectedIdx === -1) return;

    const app = getApp();
    const q = this.data.currentQ;
    const chosen = q.options[this.data.selectedIdx];

    // 累计分数
    app.globalData.score += chosen.score;
    app.globalData.answers.push({
      qId: q.id,
      chosen: chosen.label,
      score: chosen.score,
    });

    const nextIdx = this.data.currentIndex + 1;

    if (nextIdx >= questions.length) {
      // 跳到结果页
      wx.redirectTo({ url: '/pages/result/result' });
      return;
    }

    this.setData({
      currentIndex: nextIdx,
      currentQ: questions[nextIdx],
      selectedIdx: -1,
      progressPercent: ((nextIdx + 1) / questions.length) * 100,
      isLast: nextIdx === questions.length - 1,
    });
  },
});
