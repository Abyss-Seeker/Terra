
import { Mood } from './types';

export const STORY_DATA = [
  {
    id: 0,
    text: "当你经历漫长黑暗，终于浮出海面，睁开眼的刹那，灿烂的星空滴落眼眶，无垠波浪拂过面颊，眼泪和家的味道，都是咸的。",
    source: "斯卡蒂 / 003",
    mood: Mood.WAKE,
    choices: [
      { label: "连接神经", nextId: 1 }
    ]
  },
  {
    id: 1,
    text: "这也是工作的一部分。每天清晨六点，汽笛唤醒的不是梦想，而是城市的齿轮。\n我们是齿轮上的铁锈，在摩擦中消耗殆尽。",
    source: "切尔诺伯格 / 感染者区",
    mood: Mood.ROUTINE,
    choices: [
      { label: "接受命运", nextId: 2 },
      { label: "审视世界", nextId: 3 }
    ]
  },
  {
    id: 2,
    text: "只要低下头，看着脚尖，日子就能过下去。\n不要看天空，不要看高塔，只看传送带上流过的源石。一遍，又一遍。",
    source: "无名氏 / 工厂记录",
    mood: Mood.MYOPIC,
    choices: [
      { label: "直到崩溃", nextId: 4 }
    ]
  },
  {
    id: 3,
    text: "移动城市在荒原上爬行，巨大的履带碾碎了感染者的骨头。\n霓虹灯光把黑夜照成白昼，却照不亮下层区的阴沟。",
    source: "爱国者 / 游击队",
    mood: Mood.DYSTOPIA,
    choices: [
      { label: "点燃火把", nextId: 4 },
      { label: "冷眼旁观", nextId: 5 }
    ]
  },
  {
    id: 4,
    text: "流言会摧毁他人。流言出现以后，就没人是清白的了。\n塔露拉留下了火径，她背后的一切，都在烈火中消失殆尽。",
    source: "塔露拉 / 怒号光明",
    mood: Mood.CONFLICT,
    choices: [
      { label: "目睹毁灭", nextId: 5 }
    ]
  },
  {
    id: 5,
    text: "看啊，那高高在上的贵族塔楼塌了。\n他们尖叫的声音，和我们在矿场里被压断腿时的声音，原来是一样的。",
    source: "整合运动 / 士兵",
    mood: Mood.SCHADENFREUDE,
    choices: [
      { label: "虚无", nextId: 6 },
      { label: "反思", nextId: 7 }
    ]
  },
  {
    id: 6,
    text: "生者们歌舞升平地扮演幽灵，真正的亡者却在墓地里无人问津。",
    source: "莫斯提马 / 喧闹法则",
    mood: Mood.VOID,
    choices: [
      { label: "寻找乐土", nextId: 8 }
    ]
  },
  {
    id: 7,
    text: "我救不了所有人。但我必须救这一个。\n在这面镜子里，我看到的不是圣人，只是一个不想放手的凡人。",
    source: "阿米娅 / 升变",
    mood: Mood.NARCISSISM,
    choices: [
      { label: "打破镜象", nextId: 9 }
    ]
  },
  {
    id: 8,
    text: "这里没有痛苦，没有饥饿，没有争吵。\n律法规定了一切幸福的配额。只要你奉献出自由，就能获得完美的宁静。",
    source: "拉特兰 / 教宗厅",
    mood: Mood.UTOPIA,
    choices: [
      { label: "这不真实", nextId: 9 },
      { label: "沉溺其中", nextId: 10 }
    ]
  },
  {
    id: 9,
    text: "各国传说，名著，典籍，神话，有多少是假的？\n难道我们就因为一个“假”字，否了他们的意义？\n雕刻，我们在死物的形体之中构建意义。",
    source: "幽灵鲨 & 嵯峨",
    mood: Mood.PHILOSOPHY,
    choices: [
      { label: "构建信仰", nextId: 10 }
    ]
  },
  {
    id: 10,
    text: "经书上说，审判官的提灯释放出来的，是我们心中的信仰之光。\n我们依仗自己坚信的事物行路，这是唯一有尊严的生活。",
    source: "安多恩 / 吾导先路",
    mood: Mood.SANCTUARY,
    choices: [
      { label: "黎明将至", nextId: 11 }
    ]
  },
  {
    id: 11,
    text: "无论这片大地上发生了什么，天还是会亮。\n让所有人都站起来。让一切归于寂静。\n文明欣欣向荣，城市轰鸣前进。",
    source: "Outcast / 临光",
    mood: Mood.HOPE,
    choices: [
      { label: "春天会来", nextId: 12 }
    ]
  },
  {
    id: 12,
    text: "我们牵手唱啊跳，踩在开始变软的泥土地上，即使是冻土，到时也会开出小小的花。\n在这座城市，春天会照常来。",
    source: "苦艾 / 乌萨斯",
    mood: Mood.END,
    choices: [
      { label: "再次轮回", nextId: 0 }
    ]
  }
];

export const THEMES = {
  [Mood.WAKE]: {
    primary: '#00C2FF', // Cyan
    secondary: '#1A1A1A',
    accent: '#FFFFFF',
    fog: '#050510',
    intensity: 1,
    particleSpeed: 0.5
  },
  [Mood.ROUTINE]: {
    primary: '#4A5568', // Slate Grey
    secondary: '#2D3748',
    accent: '#A0AEC0',
    fog: '#101015',
    intensity: 0.6,
    particleSpeed: 0.1
  },
  [Mood.MYOPIC]: {
    primary: '#63B3ED', // Soft Blue
    secondary: '#000000',
    accent: '#FFFFFF',
    fog: '#000000',
    intensity: 2.0, // High bloom for blur effect
    particleSpeed: 0.05
  },
  [Mood.DYSTOPIA]: {
    primary: '#FF6B00', // Rust Orange
    secondary: '#1A1000',
    accent: '#553300',
    fog: '#150A00', // Smoggy
    intensity: 1.2,
    particleSpeed: 1.0
  },
  [Mood.CONFLICT]: {
    primary: '#FF2A00', 
    secondary: '#000000',
    accent: '#FF0000',
    fog: '#1a0505',
    intensity: 3,
    particleSpeed: 2.0
  },
  [Mood.SCHADENFREUDE]: {
    primary: '#76FF03', // Acid Green
    secondary: '#102005',
    accent: '#CCFF90',
    fog: '#051000',
    intensity: 2.5,
    particleSpeed: 3.0
  },
  [Mood.VOID]: {
    primary: '#800080', 
    secondary: '#000000',
    accent: '#FF00FF', 
    fog: '#000000',
    intensity: 0.5,
    particleSpeed: 0.1
  },
  [Mood.NARCISSISM]: {
    primary: '#F687B3', // Pink
    secondary: '#2D0F18',
    accent: '#FBB6CE',
    fog: '#15050A',
    intensity: 1.5,
    particleSpeed: 0.2
  },
  [Mood.UTOPIA]: {
    primary: '#E2E8F0', // Sterile White/Blueish
    secondary: '#FFFFFF',
    accent: '#00FFFF',
    fog: '#F7FAFC', // Very bright fog
    intensity: 0.8,
    particleSpeed: 0.1
  },
  [Mood.PHILOSOPHY]: {
    primary: '#A0A0A0', 
    secondary: '#111111',
    accent: '#FFFFFF', 
    fog: '#000000',
    intensity: 0.8,
    particleSpeed: 0.2
  },
  [Mood.SANCTUARY]: {
    primary: '#FFD700', 
    secondary: '#FFFFFF', 
    accent: '#FFA500', 
    fog: '#1a1005', 
    intensity: 1.5,
    particleSpeed: 0.3
  },
  [Mood.HOPE]: {
    primary: '#00FFAA', 
    secondary: '#FFFFFF',
    accent: '#FFF0A0',
    fog: '#0A1A1A',
    intensity: 1.2,
    particleSpeed: 0.6
  },
  [Mood.END]: {
    primary: '#FFFFFF',
    secondary: '#FFFFFF',
    accent: '#FFFFFF',
    fog: '#FFFFFF',
    intensity: 0.5,
    particleSpeed: 0
  }
};
