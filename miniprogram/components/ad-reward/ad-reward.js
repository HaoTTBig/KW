Component({
  properties: {
    show: { type: Boolean, value: false }
  },
  data: {
    videoAd: null
  },
  lifetimes: {
    attached() {
      // 开通流量主后取消注释,替换 adunit-id
      // if (wx.createRewardedVideoAd) {
      //   this.data.videoAd = wx.createRewardedVideoAd({
      //     adUnitId: 'adunit-xxxxxxxxxx'
      //   });
      //   this.data.videoAd.onClose((res) => {
      //     if (res && res.isEnded) {
      //       this.triggerEvent('rewarded');
      //     }
      //   });
      // }
    }
  },
  methods: {
    onTapReward() {
      if (this.data.videoAd) {
        this.data.videoAd.show().catch(() => {
          this.data.videoAd.load().then(() => this.data.videoAd.show());
        });
      } else {
        wx.showToast({ title: '广告加载中', icon: 'none' });
      }
    }
  }
});
