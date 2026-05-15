const results = require('../../data/results.js');

Page({
  data: {
    level: null,
    saving: false,
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
    this.setData({ level: matched });
    setTimeout(() => this.drawPoster(), 150);
  },

  drawPoster() {
    const lvl = this.data.level;
    if (!lvl) return;

    const query = this.createSelectorQuery();
    query.select('#posterCanvas').fields({ node: true, size: true }).exec((res) => {
      if (!res || !res[0]) return;
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');
      const dpr = wx.getWindowInfo().pixelRatio || 2;
      const W = 750;
      const H = 1200;

      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);

      // === 背景:中国红渐变 ===
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#CC0000');
      grad.addColorStop(1, '#6B0000');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // === 顶部金色装饰线 ===
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(40, 60, W - 80, 4);
      ctx.fillRect(40, H - 64, W - 80, 4);

      // === 顶部标题 ===
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('中 国 人 含 量 检 测 报 告', W / 2, 120);

      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '16px sans-serif';
      ctx.fillText('CHINESE LEVEL DETECTION REPORT', W / 2, 155);

      // === 大百分比 ===
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 120px sans-serif';
      ctx.fillText(lvl.percentage, W / 2, 320);

      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = '18px sans-serif';
      ctx.fillText('中国人含量', W / 2, 360);

      // === 等级 ===
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 40px sans-serif';
      ctx.fillText(lvl.badge + ' ' + lvl.title, W / 2, 430);

      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = '18px sans-serif';
      ctx.fillText(lvl.subtitle, W / 2, 470);

      // === 正文 ===
      ctx.fillStyle = '#FFF';
      ctx.font = '20px sans-serif';
      ctx.textAlign = 'left';
      const lines = lvl.main_text.split('\n');
      let y = 530;
      lines.forEach((line) => {
        ctx.fillText(line, 80, y);
        y += 36;
      });

      // === Roast 金句 ===
      y += 20;
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('「' + lvl.roast + '」', W / 2, y);

      // === Chinamaxxing Tip ===
      y += 50;
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = 'italic 16px sans-serif';
      ctx.fillText(lvl.chinamaxxing_tip, W / 2, y);

      // === 底部 ===
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('🇨🇳 中国人含量检测器', 80, H - 130);

      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '14px sans-serif';
      ctx.fillText('长按识别 · 测测你的 Chinese Level', 80, H - 100);

      // 二维码占位
      ctx.strokeStyle = 'rgba(255,215,0,0.5)';
      ctx.lineWidth = 2;
      ctx.strokeRect(W - 180, H - 180, 110, 110);
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('小程序码', W - 125, H - 120);

      // 免责
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('本测试纯属娱乐,与国籍、民族、身份认同无关', W / 2, H - 30);
    });
  },

  async onSave() {
    this.setData({ saving: true });
    try {
      const query = this.createSelectorQuery();
      const res = await new Promise((resolve, reject) => {
        query.select('#posterCanvas').fields({ node: true }).exec((r) => {
          if (r && r[0]) resolve(r[0]);
          else reject(new Error('canvas not found'));
        });
      });
      const filePath = await new Promise((resolve, reject) => {
        wx.canvasToTempFilePath({
          canvas: res.node,
          success: (r) => resolve(r.tempFilePath),
          fail: reject,
        });
      });
      await wx.saveImageToPhotosAlbum({ filePath });
      wx.showToast({ title: '已保存到相册', icon: 'success' });
    } catch (e) {
      if (String(e?.errMsg || '').includes('auth')) {
        wx.showModal({
          title: '需要权限',
          content: '授权"保存到相册"后才能下载海报',
          confirmText: '去设置',
          success: (r) => { if (r.confirm) wx.openSetting(); },
        });
      } else {
        wx.showToast({ title: '保存失败', icon: 'none' });
      }
    } finally {
      this.setData({ saving: false });
    }
  },

  onShareAppMessage() {
    const lvl = this.data.level;
    return {
      title: lvl ? lvl.share_text : '你的中国人含量有多高?',
      path: '/pages/index/index',
    };
  },
});
