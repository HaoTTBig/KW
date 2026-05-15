/**
 * ===== 微信 JS-SDK 签名后端示例(Node.js) =====
 * 
 * 这个文件是给你参考的,不需要部署到 GitHub Pages。
 * 只有当你有认证公众号、想自定义分享卡片时才需要。
 * 
 * 部署到你自己的服务器上,提供签名接口。
 * 
 * 安装依赖:npm install express axios crypto
 */

const express = require('express');
const axios = require('axios');
const crypto = require('crypto');

const app = express();

// ====== 替换成你的公众号配置 ======
const APPID = 'YOUR_APPID';
const APPSECRET = 'YOUR_APPSECRET';

// ====== 缓存 access_token 和 jsapi_ticket ======
let tokenCache = { token: '', expiresAt: 0 };
let ticketCache = { ticket: '', expiresAt: 0 };

async function getAccessToken() {
  if (tokenCache.token && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }
  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`;
  const { data } = await axios.get(url);
  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 300) * 1000,
  };
  return tokenCache.token;
}

async function getJsApiTicket() {
  if (ticketCache.ticket && Date.now() < ticketCache.expiresAt) {
    return ticketCache.ticket;
  }
  const token = await getAccessToken();
  const url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${token}&type=jsapi`;
  const { data } = await axios.get(url);
  ticketCache = {
    ticket: data.ticket,
    expiresAt: Date.now() + (data.expires_in - 300) * 1000,
  };
  return ticketCache.ticket;
}

function sign(ticket, nonceStr, timestamp, url) {
  const str = `jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`;
  return crypto.createHash('sha1').update(str).digest('hex');
}

// ====== 签名接口 ======
app.get('/api/wx-signature', async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: 'missing url param' });

    const ticket = await getJsApiTicket();
    const nonceStr = Math.random().toString(36).slice(2, 15);
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = sign(ticket, nonceStr, timestamp, url);

    res.json({
      appId: APPID,
      timestamp,
      nonceStr,
      signature,
    });
  } catch (e) {
    console.error('签名失败:', e);
    res.status(500).json({ error: 'sign failed' });
  }
});

app.listen(3001, () => {
  console.log('微信签名服务运行在 http://localhost:3001');
});
