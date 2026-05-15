// ===== 题目数据 =====
const QUESTIONS = [
  { id:1, text:"早上起床第一件事?", options:[
    {label:"A",text:"喝一杯温开水",score:4},
    {label:"B",text:"看手机消息",score:3},
    {label:"C",text:"来杯冰美式",score:1},
    {label:"D",text:"继续睡",score:2}
  ]},
  { id:2, text:"你的保温杯里装着?", options:[
    {label:"A",text:"枸杞红枣水",score:4},
    {label:"B",text:"白开水(凉了也喝)",score:3},
    {label:"C",text:"咖啡",score:1},
    {label:"D",text:"我没有保温杯",score:0}
  ]},
  { id:3, text:"聚餐买单时你的第一反应?", options:[
    {label:"A",text:"先抢着扫码,被拦下来再说",score:4},
    {label:"B",text:"假装上厕所等别人付",score:3},
    {label:"C",text:"AA 制,精确到分",score:1},
    {label:"D",text:"看谁先动我就动",score:2}
  ]},
  { id:4, text:"收到60秒微信语音消息,你?", options:[
    {label:"A",text:"老老实实从头听完",score:4},
    {label:"B",text:"转文字",score:3},
    {label:"C",text:"回一条\"在忙,打字说\"",score:2},
    {label:"D",text:"已读不回",score:1}
  ]},
  { id:5, text:"你进别人家门第一个动作?", options:[
    {label:"A",text:"换拖鞋(没有也要脱鞋)",score:4},
    {label:"B",text:"先喊一声\"到了\"",score:3},
    {label:"C",text:"直接走进去",score:1},
    {label:"D",text:"先问WiFi密码",score:2}
  ]},
  { id:6, text:"快递到了,你多久拆?", options:[
    {label:"A",text:"当场拆,盒子叠好留着",score:3},
    {label:"B",text:"攒3天一起拆(仪式感)",score:4},
    {label:"C",text:"直接拆,盒子扔了",score:2},
    {label:"D",text:"还在快递柜里放着",score:1}
  ]},
  { id:7, text:"你妈最近转发的链接是?", options:[
    {label:"A",text:"\"这种水果千万不能空腹吃\"",score:4},
    {label:"B",text:"\"公安部紧急通知\"",score:3},
    {label:"C",text:"广场舞教学",score:3},
    {label:"D",text:"我妈不用微信",score:0}
  ]},
  { id:8, text:"菜上齐了,你的反应?", options:[
    {label:"A",text:"先拍照,全方位360度",score:4},
    {label:"B",text:"先转盘把好菜转到我面前",score:3},
    {label:"C",text:"等主人动筷子我再动",score:3},
    {label:"D",text:"直接吃",score:1}
  ]},
  { id:9, text:"别人夸你\"瘦了\",你?", options:[
    {label:"A",text:"\"哪有哪有,胖死了\"(心里开花)",score:4},
    {label:"B",text:"\"谢谢!最近确实在控制\"",score:2},
    {label:"C",text:"\"你也是!\"(无论对方胖没胖)",score:3},
    {label:"D",text:"照单全收不回应",score:1}
  ]},
  { id:10, text:"路过水果摊,你?", options:[
    {label:"A",text:"先问价,说\"太贵了\",走两步回来买",score:4},
    {label:"B",text:"不问价直接买",score:1},
    {label:"C",text:"扫码下单等配送",score:2},
    {label:"D",text:"偷偷尝一个再决定",score:3}
  ]},
  { id:11, text:"有人问你月薪多少?", options:[
    {label:"A",text:"\"还行吧,够吃饭\"",score:4},
    {label:"B",text:"反问\"你呢\"",score:3},
    {label:"C",text:"如实告知",score:1},
    {label:"D",text:"转移话题",score:2}
  ]},
  { id:12, text:"春节回家最怕什么?", options:[
    {label:"A",text:"\"有对象了吗\"",score:4},
    {label:"B",text:"\"工资多少\"",score:3},
    {label:"C",text:"\"什么时候要孩子\"",score:3},
    {label:"D",text:"我不怕",score:0}
  ]},
  { id:13, text:"你出门前你妈会说?", options:[
    {label:"A",text:"\"多喝热水\"",score:4},
    {label:"B",text:"\"早点回来\"",score:3},
    {label:"C",text:"\"钱够不够\"",score:3},
    {label:"D",text:"我妈不管我",score:0}
  ]},
  { id:14, text:"晚上11点,你在?", options:[
    {label:"A",text:"泡脚 + 刷手机",score:4},
    {label:"B",text:"加班",score:3},
    {label:"C",text:"夜店/酒吧",score:1},
    {label:"D",text:"已经睡了",score:2}
  ]},
  { id:15, text:"\"多喝热水\"对你来说是?", options:[
    {label:"A",text:"万能良药 + 终极关心",score:4},
    {label:"B",text:"敷衍的关心",score:2},
    {label:"C",text:"中国文化精髓",score:4},
    {label:"D",text:"没什么特别的",score:1}
  ]}
];

// ===== 结果等级 =====
const LEVELS = [
  {
    id:"foreigner", range:[0,15], badge:"🛂",
    title:"签证待办", subtitle:"Chinese Level: Loading...", percentage:"12%",
    mainText:"你连保温杯都没有。\n你的中国人含量像你的余额——\n约等于零。\n建议:先买个保温杯,泡点枸杞,\n然后把冰美式倒掉。",
    roast:"连你妈都觉得你不像中国人。",
    tip:"你需要的不是 Chinamaxxing,是 China 入门。",
    shareText:"我的 Chinese Level 只有 12%... 连保温杯都没有",
    color:"#6C757D"
  },
  {
    id:"tourist", range:[16,25], badge:"📸",
    title:"观光客", subtitle:"Chinese Level: 体验装", percentage:"38%",
    mainText:"你正处于 Chinamaxxing 入门阶段。\n会喝热水了,但拖鞋还没买。\n聚餐的时候还在 AA,\n你妈转的链接你还没点开。\n有进步空间。",
    roast:"你在中国待了三天,就这?",
    tip:"建议:关注你妈的朋友圈,从\"收到\"开始回复。",
    shareText:"我的 Chinese Level 38%,刚学会喝热水的观光客",
    color:"#4A90D9"
  },
  {
    id:"resident", range:[26,35], badge:"🪪",
    title:"编内人员", subtitle:"Chinese Level: 有点东西", percentage:"58%",
    mainText:"你已掌握核心技能:\n会假装上厕所逃买单、\n会说\"哪有哪有\"、\n会在群里抢红包。\n但广场舞还没学,\n和你妈之间还差 10 条语音消息。",
    roast:"你在第五层,你妈在大气层。",
    tip:"建议:学会不拆快递攒着、水果先砍价再买。",
    shareText:"我的 Chinese Level 58%,会抢红包但还不会砍价",
    color:"#5C8C2D"
  },
  {
    id:"native", range:[36,45], badge:"🏮",
    title:"老中人", subtitle:"Chinese Level: 炉火纯青", percentage:"79%",
    mainText:"泡脚、保温杯、语音消息全听完。\n聚餐抢买单抢得真诚,\n别人夸你瘦你谦虚得体,\n你妈的养生链接你全部已读。\n你已经是一个合格的中国人了。\n但你妈觉得你还差一个对象。",
    roast:"你什么都好,就是没结婚。",
    tip:"你不需要 Chinamaxxing,你本来就是。",
    shareText:"我的 Chinese Level 79%!老中人实锤,就差结婚了",
    color:"#CC0000"
  },
  {
    id:"ultimate", range:[46,60], badge:"🐉",
    title:"非遗传承人", subtitle:"Chinese Level: 已超越99%人类", percentage:"97%",
    mainText:"你不是中国人,你是中国人的标准。\n你的热水能治百病,\n你的砍价让摊主怀疑人生,\n你春节能扛住所有灵魂拷问,\n你聚餐永远第一个抢买单——\n但从来没真正付过钱。\n\n你已超越 99% 的 Chinamaxxer。\n全球都应该向你学习。",
    roast:"NASA 应该研究你的保温杯。",
    tip:"你不是在 Chinamaxxing,Chinamaxxing 在模仿你。",
    shareText:"我的 Chinese Level 97%!!! 非遗传承人! Chinamaxxer 都在模仿我!",
    color:"#FFD700"
  }
];
