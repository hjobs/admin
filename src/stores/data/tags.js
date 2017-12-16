export const jobTags = [
  {
    group: "industry",
    codes: [
      {id: 1000, code: "hotel"},
      {id: 1002, code: "restaurant"},
      {id: 1003, code: "bar"},
      {id: 1004, code: "clubnight"},
      {id: 1005, code: "clubmembers"},
      {id: 1006, code: "tourism"},
      {id: 1007, code: "academic"}
    ]
  },
  // {
  //   group: "role",
  //   codes: ["barista", "bartender", "housekeeper"]
  // },
  {
    group: "commitment",
    codes: [
      {id: 3000, code: "parttime"},
      {id: 3001, code: "fulltime"},
      {id: 3002, code: "casual"}, 
      {id: 3003, code: "freelance"}
    ] 
  }
];

export const jobTagTranslations = {
  group: {
    industry: {
      "en": "Industry",
      "zh-HK": "行業"
    },
    // role: {
    //   "en": "Role",
    //   "zh-HK": "崗位"
    // },
    commitment: {
      "en": "Commitment",
      "zh-HK": "工作時間"
    }
  },
  code: {
    hotel: {
      "en": "Hotel",
      "zh-HK": "酒迨"
    },
    restaurant: {
      "en": "Restaurant",
      "zh-HK": "餐廳"
    },
    bar: {
      "en": "Bar",
      "zh-HK": "酒吧"
    },
    clubnight: {
      "en": "Night club",
      "zh-HK": "夜總會"
    },
    clubmembers: {
      "en": "Members club",
      "zh-HK": "會員俱樂部"
    },
    "tourism": {
      "en": "Tourism",
      "zh-HK": "旅遊"
    },
    "academic": {
      "en": "Academic",
      "zh-HK": "學術研究"
    },
    "fulltime": {
      "en": "FullTime",
      "zh-HK": "全職"
    },
    "parttime": {
      "en": "PartTime",
      "zh-HK": "兼職"
    },
    "casual": {
      "en": "Casual",
      "zh-HK": "欺工"
    },
    "freelance": {
      "en": "FreeLance",
      "zh-HK": "FreeLance"
    }
  }
};