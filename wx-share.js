/**
 * 微信 JS-SDK 分享配置
 * 
 * === 使用前提 ===
 * 1. 你需要一个已认证的微信公众号(服务号)
 * 2. 在公众号后台「设置与开发 → 公众号设置 → 功能设置」填写 JS 安全域名
 *    (就是你部署 H5 的域名,比如 haottbig.github.io)
 * 3. 在「设置与开发 → 基本配置」拿到 AppID 和 AppSecret
 * 4. 你的服务器需要有一个签名接口(见下方说明)
 * 
 * === 如果你没有认证公众号 ===
 * 不影响!微信内分享链接时,会自动读取 <meta og:title/description/image>,
 * 只是不能自定义分享卡片的缩略图尺寸。对 MVP 来说完全够用。
 * 你可以先跳过 JS-SDK,等有认证公众号时再接入。
 * 
 * === 快速接入流程(有认证公众号时) ===
 * 1. 部署一个签名接口(后端生成 signature)
 * 2. 前端调用签名接口拿到配置
 * 3. 调用 wx.config + wx.ready
 */

// ====== 配置项(替换成你自己的) ======
const WX_SHARE_CONFIG = {
  // 你的签名接口地址(后端生成,见下方 Node.js 示例)
  signatureApi: '', // 例如: 'https://yourdomain.com/api/wx-signature'
  
  // 分享内容
  shareTitle: '我的 Chinese Level 出来了!你敢测吗?',
  shareDesc: '全球都在 Chinamaxxing,15 道灵魂拷问测出你有多 Chinese',
  shareLink: window.location.href.split('#')[0],
  shareImg: window.location.origin + '/share-cover.png',
};

// ====== 初始化 ======
function initWxShare() {
  // 如果没配置签名接口,跳过(依赖 og:meta 标签的默认分享)
  if (!WX_SHARE_CONFIG.signatureApi) {
    console.log('[wx-share] 未配置签名接口,使用默认 og:meta 分享');
    return;
  }

  // 检测是否在微信环境
  const isWechat = /MicroMessenger/i.test(navigator.userAgent);
  if (!isWechat) {
    console.log('[wx-share] 非微信环境,跳过');
    return;
  }

  // 请求签名
  fetch(WX_SHARE_CONFIG.signatureApi + '?url=' + encodeURIComponent(location.href.split('#')[0]))
    .then(r => r.json())
    .then(data => {
      wx.config({
        debug: false,
        appId: data.appId,
        timestamp: data.timestamp,
        nonceStr: data.nonceStr,
        signature: data.signature,
        jsApiList: [
          'updateAppMessageShareData',
          'updateTimelineShareData'
        ]
      });

      wx.ready(function () {
        const shareData = {
          title: WX_SHARE_CONFIG.shareTitle,
          desc: WX_SHARE_CONFIG.shareDesc,
          link: WX_SHARE_CONFIG.shareLink,
          imgUrl: WX_SHARE_CONFIG.shareImg,
        };

        // 分享给朋友
        wx.updateAppMessageShareData(shareData);
        // 分享到朋友圈
        wx.updateTimelineShareData({
          title: WX_SHARE_CONFIG.shareTitle,
          link: WX_SHARE_CONFIG.shareLink,
          imgUrl: WX_SHARE_CONFIG.shareImg,
        });

        console.log('[wx-share] 分享配置成功');
      });

      wx.error(function (res) {
        console.warn('[wx-share] config 失败:', res);
      });
    })
    .catch(err => {
      console.warn('[wx-share] 签名请求失败:', err);
    });
}

// 动态更新分享内容(结果出来后调用)
function updateWxShare(title, desc) {
  if (typeof wx === 'undefined' || !wx.updateAppMessageShareData) return;
  const shareData = {
    title: title || WX_SHARE_CONFIG.shareTitle,
    desc: desc || WX_SHARE_CONFIG.shareDesc,
    link: WX_SHARE_CONFIG.shareLink,
    imgUrl: WX_SHARE_CONFIG.shareImg,
  };
  try {
    wx.updateAppMessageShareData(shareData);
    wx.updateTimelineShareData({
      title: title || WX_SHARE_CONFIG.shareTitle,
      link: WX_SHARE_CONFIG.shareLink,
      imgUrl: WX_SHARE_CONFIG.shareImg,
    });
  } catch (e) { /* 非微信环境忽略 */ }
}

// 页面加载后初始化
document.addEventListener('DOMContentLoaded', initWxShare);
