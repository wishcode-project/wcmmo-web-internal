// Public site copy, in English and Thai. Everything here is shown to players, so keep it
// teaser-level: no balance numbers, no plugin names, no open decisions, no story spoilers.
import type { Dict } from '../shared/i18n'

export const site = {
  name: 'WC-MMO',
  /** Server address players copy. `null` shows "Opening soon" instead. */
  serverIp: null as string | null,
  /** Discord invite. `null` hides the button. */
  discordUrl: null as string | null,
}

export const copy: Dict<{ tagline: string; pitch: string; edition: string }> = {
  en: {
    tagline: 'A classless action MMORPG, built in Minecraft.',
    pitch:
      'No classes. No fixed paths. Your Bloodline shapes how you fight, the weapons you master decide what you can do, and every hit you dodge is on you.',
    edition: 'Java Edition',
  },
  th: {
    tagline: 'เกม Action MMORPG ไร้คลาส สร้างบน Minecraft',
    pitch: 'ไม่มีคลาส ไม่มีเส้นทางตายตัว สายเลือดของคุณกำหนดวิธีต่อสู้ อาวุธที่คุณชำนาญกำหนดสิ่งที่คุณทำได้ และทุกการหลบคือฝีมือของคุณเอง',
    edition: 'Java Edition',
  },
}

export type IconName = 'blood' | 'rune' | 'sword' | 'shield' | 'gem' | 'skull' | 'scroll' | 'house' | 'pickaxe'

interface FeatureText {
  title: string
  short: string
  body: string
  tag?: string
}

export interface Feature {
  slug: string
  icon: IconName
  text: Dict<FeatureText>
}

export const features: Feature[] = [
  {
    slug: 'bloodlines',
    icon: 'blood',
    text: {
      en: {
        title: 'Bloodlines, not classes',
        short: 'One Bloodline defines who you are, and it evolves as you do.',
        body: 'Forget picking a class at the start. You carry a single Bloodline that changes how you play, not just how big your numbers are. It awakens in stages as you grow, unlocking new mechanics along the way. The first one we are building: the Berserker, who gets more dangerous the closer they are to death.',
        tag: 'First look',
      },
      th: {
        title: 'สายเลือด แทนคลาส',
        short: 'สายเลือดเดียวที่บอกว่าคุณเป็นใคร และเติบโตไปพร้อมกับคุณ',
        body: 'ไม่ต้องเลือกคลาสตั้งแต่เริ่ม คุณมีสายเลือด (Bloodline) เพียงหนึ่งเดียวที่เปลี่ยนวิธีเล่นของคุณ ไม่ใช่แค่เพิ่มตัวเลข สายเลือดจะตื่นขึ้นทีละขั้นเมื่อคุณเติบโต และปลดล็อกกลไกใหม่ไปเรื่อย ๆ สายเลือดแรกที่เรากำลังสร้างคือ Berserker ยิ่งใกล้ตาย ยิ่งอันตราย',
        tag: 'เผยโฉมครั้งแรก',
      },
    },
  },
  {
    slug: 'runes',
    icon: 'rune',
    text: {
      en: {
        title: 'Runes',
        short: 'Small passives that tune your build.',
        body: 'Slot Runes to fine-tune your character: more staying power, faster recovery, shorter cooldowns. The same Bloodline can become a wall or a glass cannon depending on what you socket.',
      },
      th: {
        title: 'รูน',
        short: 'พาสซีฟเล็ก ๆ ที่ช่วยปรับบิลด์ของคุณ',
        body: 'ใส่รูนเพื่อปรับแต่งตัวละครอย่างละเอียด ทั้งความอึด การฟื้นตัว และคูลดาวน์ที่สั้นลง สายเลือดเดียวกันอาจกลายเป็นแทงก์หรือสายดาเมจก็ได้ ขึ้นอยู่กับรูนที่คุณเลือก',
      },
    },
  },
  {
    slug: 'weapons',
    icon: 'sword',
    text: {
      en: {
        title: 'Weapon freedom & Mastery',
        short: 'Pick up any weapon you can handle. Master it to unlock its secrets.',
        body: 'Any player can wield any weapon, as long as they have the stats for it. Every weapon type has its own unique skills, unlocked by mastering it in battle. The more you fight with it, the faster and smoother it gets.',
      },
      th: {
        title: 'อิสระในการใช้อาวุธ & ความชำนาญ',
        short: 'ถืออาวุธไหนก็ได้ที่คุณรับไหว ฝึกให้ชำนาญเพื่อปลดล็อกความลับ',
        body: 'ผู้เล่นทุกคนใช้อาวุธได้ทุกชนิด ขอแค่มีสเตตัสถึง อาวุธแต่ละประเภทมีสกิลเฉพาะของตัวเอง ซึ่งปลดล็อกได้ด้วยการฝึกความชำนาญในการต่อสู้ ยิ่งใช้บ่อย ยิ่งเร็วและลื่นไหล',
      },
    },
  },
  {
    slug: 'combat',
    icon: 'shield',
    text: {
      en: {
        title: 'Action combat',
        short: 'Dodge, guard and power through. Timing beats stats.',
        body: 'Roll through attacks with invincibility frames, block hits from the front, and push through crowd control with super armour. Two skill bars and a quick swap let you chain combos mid-fight. We are also experimenting with first-person weapon animations.',
        tag: 'In prototyping',
      },
      th: {
        title: 'ระบบต่อสู้แบบแอคชัน',
        short: 'หลบ กัน และฝ่าไปข้างหน้า จังหวะสำคัญกว่าสเตตัส',
        body: 'กลิ้งหลบการโจมตีด้วยจังหวะอมตะ (I-frame) ป้องกันการโจมตีจากด้านหน้า และฝ่าการควบคุมด้วย Super Armour มีแถบสกิลสองแถวที่สลับได้ทันทีเพื่อต่อคอมโบกลางการต่อสู้ และเรากำลังทดลองแอนิเมชันอาวุธมุมมองบุคคลที่หนึ่งด้วย',
        tag: 'กำลังทดสอบต้นแบบ',
      },
    },
  },
  {
    slug: 'gear',
    icon: 'gem',
    text: {
      en: {
        title: 'Gear worth hunting',
        short: 'Unidentified drops, rolled stats and enhancement.',
        body: 'Rare gear drops unidentified. Identify it to find out what you really got. Enhance weapons and armour to push your power further.',
      },
      th: {
        title: 'อุปกรณ์ที่คุ้มค่าแก่การล่า',
        short: 'ของดรอปปริศนา สเตตัสสุ่ม และการตีบวก',
        body: 'อุปกรณ์หายากจะดรอปมาแบบยังไม่ระบุค่า ต้องประเมิน (Identify) ก่อนถึงจะรู้ว่าได้อะไร แล้วตีบวกอาวุธและเกราะเพื่อเพิ่มพลังให้สูงขึ้นไปอีก',
      },
    },
  },
  {
    slug: 'world',
    icon: 'skull',
    text: {
      en: {
        title: 'Zones, bosses & dungeons',
        short: 'Earn your way into harder zones. Fight world bosses together.',
        body: 'Every zone has a power level you need to match. Farm in the open world or hold a spot and call waves of monsters to you. World bosses reward everyone who fought, not just the last hit. Solo and party dungeons wait for the brave.',
      },
      th: {
        title: 'โซน บอส & ดันเจียน',
        short: 'ไต่ระดับสู่โซนที่ยากขึ้น ร่วมกันล้มเวิลด์บอส',
        body: 'ทุกโซนมีระดับพลังที่คุณต้องไปให้ถึง ฟาร์มในโลกเปิด หรือยึดจุดแล้วเรียกมอนสเตอร์มาเป็นระลอก เวิลด์บอสให้รางวัลทุกคนที่ร่วมสู้ ไม่ใช่แค่คนตีดาบสุดท้าย และยังมีดันเจียนทั้งแบบเดี่ยวและปาร์ตี้รอผู้กล้าอยู่',
      },
    },
  },
  {
    slug: 'story',
    icon: 'scroll',
    text: {
      en: {
        title: 'A story told city to city',
        short: 'A regional main story you can finish solo.',
        body: 'The main story travels from city to city, region by region, told through NPC dialogue along the way. You can finish all of it on your own; story bosses are fought in your own instance.',
      },
      th: {
        title: 'เรื่องราวจากเมืองสู่เมือง',
        short: 'เนื้อเรื่องหลักตามภูมิภาค เล่นคนเดียวจบได้',
        body: 'เนื้อเรื่องหลักพาคุณเดินทางจากเมืองสู่เมือง ภูมิภาคสู่ภูมิภาค ผ่านบทสนทนากับ NPC ตลอดทาง คุณเล่นจบได้ด้วยตัวเองทั้งหมด บอสในเนื้อเรื่องจะสู้ในพื้นที่ส่วนตัวของคุณ',
      },
    },
  },
  {
    slug: 'lifezone',
    icon: 'house',
    text: {
      en: {
        title: 'Lifezone housing',
        short: 'A home of your own in a shared, peaceful world.',
        body: 'Step into a Lifezone, a calm world shared with a handful of other players, and your house appears on your plot, furniture and all. Decorate it, show it off, and come back to it wherever you enter.',
      },
      th: {
        title: 'บ้านใน Lifezone',
        short: 'บ้านของคุณเองในโลกที่สงบและแชร์กับผู้เล่นอื่น',
        body: 'เข้าสู่ Lifezone โลกที่สงบซึ่งคุณแชร์กับผู้เล่นอีกไม่กี่คน แล้วบ้านของคุณจะปรากฏบนที่ดินพร้อมเฟอร์นิเจอร์ครบ ตกแต่ง อวดเพื่อน และกลับมาได้ทุกครั้งไม่ว่าจะเข้าโซนไหน',
      },
    },
  },
  {
    slug: 'lifeskills',
    icon: 'pickaxe',
    text: {
      en: {
        title: 'Lifeskills',
        short: 'Mining, gathering, fishing, cooking and alchemy.',
        body: 'Level five lifeskills. Safe resources grow in the Lifezones; the rarest ones only appear in monster zones, so crafters will need to be brave or hire an escort.',
      },
      th: {
        title: 'ทักษะชีวิต',
        short: 'ขุดแร่ เก็บของ ตกปลา ทำอาหาร และปรุงยา',
        body: 'ฝึกทักษะชีวิตทั้งห้า ทรัพยากรทั่วไปหาได้อย่างปลอดภัยใน Lifezone แต่ของหายากที่สุดมีแค่ในโซนมอนสเตอร์ สายคราฟต์จึงต้องกล้า หรือจ้างคนคุ้มกัน',
      },
    },
  },
]

export const comingLater: Dict<string[]> = {
  en: ['Player economy & trading', 'Guilds & node wars', 'Pets & mounts'],
  th: ['ระบบเศรษฐกิจ & การซื้อขาย', 'กิลด์ & สงครามแย่งพื้นที่', 'สัตว์เลี้ยง & พาหนะ'],
}

export interface Stage {
  key: 'foundation' | 0 | 1 | 2 | 3 | 4
  text: Dict<{ title: string; blurb: string }>
}

export const stages: Stage[] = [
  {
    key: 'foundation',
    text: {
      en: { title: 'Laying the foundation', blurb: 'Server, core plugins and the base world are up and running.' },
      th: { title: 'วางรากฐาน', blurb: 'เซิร์ฟเวอร์ ปลั๊กอินหลัก และโลกพื้นฐานพร้อมใช้งานแล้ว' },
    },
  },
  {
    key: 0,
    text: {
      en: { title: 'Proving the tech', blurb: 'Prototyping the risky parts first: first-person combat, dodging and guarding, the skill-bar swap, Bloodline powers and housing.' },
      th: { title: 'พิสูจน์เทคโนโลยี', blurb: 'ทดสอบต้นแบบส่วนที่เสี่ยงที่สุดก่อน: การต่อสู้มุมมองบุคคลที่หนึ่ง การหลบและการป้องกัน การสลับแถบสกิล พลังสายเลือด และระบบบ้าน' },
    },
  },
  {
    key: 1,
    text: {
      en: { title: 'First playable slice', blurb: 'A tutorial and the first region, the first Bloodline, four weapons to master and a solo dungeon.' },
      th: { title: 'เวอร์ชันแรกที่เล่นได้', blurb: 'บทสอนเล่นและภูมิภาคแรก สายเลือดแรก อาวุธสี่แบบให้ฝึก และดันเจียนเดี่ยวหนึ่งแห่ง' },
    },
  },
  {
    key: 2,
    text: {
      en: { title: 'Core MMO', blurb: 'More Bloodlines, every weapon, higher zones, farming totems, a world boss and party dungeons.' },
      th: { title: 'แกนหลัก MMO', blurb: 'สายเลือดเพิ่มเติม อาวุธครบทุกแบบ โซนระดับสูง โทเท็มฟาร์ม เวิลด์บอส และดันเจียนปาร์ตี้' },
    },
  },
  {
    key: 3,
    text: {
      en: { title: 'Lifezone', blurb: 'Housing worlds, lifeskills and furniture.' },
      th: { title: 'Lifezone', blurb: 'โลกสำหรับบ้าน ทักษะชีวิต และเฟอร์นิเจอร์' },
    },
  },
  {
    key: 4,
    text: {
      en: { title: 'Social', blurb: 'Economy, guilds & node wars, pets & mounts.' },
      th: { title: 'สังคม', blurb: 'ระบบเศรษฐกิจ กิลด์ & สงครามแย่งพื้นที่ สัตว์เลี้ยง & พาหนะ' },
    },
  },
]

/** UI strings for the public site. */
export const ui: Dict<{
  nav: { home: string; features: string; roadmap: string; devlog: string; team: string }
  menu: string
  skip: string
  explore: string
  community: string
  discordSoon: string
  joinDiscord: string
  notAffiliated: string
  serverStatus: string
  openingSoon: string
  clickToCopy: string
  copied: string
  discover: string
  readDevlog: string
  progress: {
    design: string
    designSub: (done: number, total: number) => string
    build: string
    buildSub: (done: number, total: number) => string
    prototypes: string
    live: (ago: string) => string
  }
  game: { kicker: string; title: string; all: string }
  road: { kicker: string; title: string; intro: string; full: string; fullTitle: string; fullIntro: string; footer: (date: string) => string }
  stage: (n: number) => string
  state: { complete: string; current: string; planned: string }
  units: { systems: string; prototypes: string }
  designLater: string
  devlog: { kicker: string; latest: string; title: string; intro: string; readMore: string; all: string; more: string; englishOnly: string }
  later: { kicker: string; title: string }
  featuresPage: { kicker: string; title: string; intro: string; horizon: (list: string) => string }
  notFound: { title: string; body: string; back: string }
}> = {
  en: {
    nav: { home: 'Home', features: 'Features', roadmap: 'Roadmap', devlog: 'Devlog', team: 'Team' },
    menu: 'Menu',
    skip: 'Skip to content',
    explore: 'Explore',
    community: 'Community',
    discordSoon: 'Discord opening soon.',
    joinDiscord: 'Join our Discord',
    notAffiliated: 'Not affiliated with Mojang or Microsoft.',
    serverStatus: 'Server status',
    openingSoon: 'Opening soon',
    clickToCopy: 'Click to copy',
    copied: 'Copied!',
    discover: 'Discover the game',
    readDevlog: 'Read the devlog',
    progress: {
      design: 'Design',
      designSub: (d, t) => `${d} of ${t} design decisions locked in`,
      build: 'Built',
      buildSub: (d, t) => `${d} of ${t} planned systems built and tested`,
      prototypes: 'tech prototypes proven',
      live: (ago) => `Live from our design docs · updated ${ago}`,
    },
    game: { kicker: 'The game', title: 'Forge your own legend', all: 'See all features' },
    road: {
      kicker: 'Roadmap',
      title: 'The road so far',
      intro: 'We build the risky parts first, then the world on top of them. The bars fill as systems are finished.',
      full: 'Full roadmap',
      fullTitle: 'Road to launch',
      fullIntro: 'We prove the hardest tech first, then build the world on top of it. Progress updates straight from our design docs.',
      footer: (date) => `Last updated ${date}. No release date yet: we'll announce it in the devlog.`,
    },
    stage: (n) => `Stage ${n}`,
    state: { complete: 'Complete', current: 'In progress', planned: 'Planned' },
    units: { systems: 'systems built', prototypes: 'prototypes proven' },
    designLater: 'Design coming later',
    devlog: {
      kicker: 'Devlog',
      latest: 'Latest from the forge',
      title: 'Notes from the forge',
      intro: "What we built, what broke, and what's next.",
      readMore: 'Read more',
      all: 'All posts',
      more: 'More posts',
      englishOnly: '',
    },
    later: { kicker: 'Coming later', title: 'The world keeps growing' },
    featuresPage: {
      kicker: 'Features',
      title: "What you'll find in the world",
      intro: 'Everything below is in design or development. Details can change before release.',
      horizon: (list) => `Also on the horizon: ${list}.`,
    },
    notFound: { title: 'You wandered off the map', body: "This page doesn't exist (yet).", back: 'Back to town' },
  },
  th: {
    nav: { home: 'หน้าแรก', features: 'ฟีเจอร์', roadmap: 'โรดแมป', devlog: 'บันทึกการพัฒนา', team: 'ทีมงาน' },
    menu: 'เมนู',
    skip: 'ข้ามไปยังเนื้อหา',
    explore: 'สำรวจ',
    community: 'คอมมูนิตี้',
    discordSoon: 'Discord เร็ว ๆ นี้',
    joinDiscord: 'เข้าร่วม Discord',
    notAffiliated: 'ไม่มีส่วนเกี่ยวข้องกับ Mojang หรือ Microsoft',
    serverStatus: 'สถานะเซิร์ฟเวอร์',
    openingSoon: 'เปิดเร็ว ๆ นี้',
    clickToCopy: 'คลิกเพื่อคัดลอก',
    copied: 'คัดลอกแล้ว!',
    discover: 'ทำความรู้จักเกม',
    readDevlog: 'อ่านบันทึกการพัฒนา',
    progress: {
      design: 'ออกแบบ',
      designSub: (d, t) => `ล็อกการตัดสินใจด้านดีไซน์แล้ว ${d} จาก ${t}`,
      build: 'สร้างแล้ว',
      buildSub: (d, t) => `สร้างและทดสอบระบบแล้ว ${d} จาก ${t}`,
      prototypes: 'ต้นแบบเทคโนโลยีที่พิสูจน์แล้ว',
      live: (ago) => `อัปเดตสดจากเอกสารดีไซน์ · ล่าสุด ${ago}`,
    },
    game: { kicker: 'ตัวเกม', title: 'สร้างตำนานในแบบของคุณ', all: 'ดูฟีเจอร์ทั้งหมด' },
    road: {
      kicker: 'โรดแมป',
      title: 'เส้นทางที่ผ่านมา',
      intro: 'เราสร้างส่วนที่เสี่ยงที่สุดก่อน แล้วค่อยสร้างโลกบนรากฐานนั้น แถบความคืบหน้าจะเต็มขึ้นเมื่อแต่ละระบบเสร็จ',
      full: 'ดูโรดแมปทั้งหมด',
      fullTitle: 'เส้นทางสู่วันเปิดตัว',
      fullIntro: 'เราพิสูจน์เทคโนโลยีที่ยากที่สุดก่อน แล้วค่อยสร้างโลกบนรากฐานนั้น ความคืบหน้าอัปเดตตรงจากเอกสารดีไซน์ของเรา',
      footer: (date) => `อัปเดตล่าสุด ${date} ยังไม่มีวันเปิดตัว เราจะประกาศในบันทึกการพัฒนา`,
    },
    stage: (n) => `ขั้นที่ ${n}`,
    state: { complete: 'เสร็จแล้ว', current: 'กำลังทำ', planned: 'วางแผนไว้' },
    units: { systems: 'ระบบที่สร้างเสร็จ', prototypes: 'ต้นแบบที่พิสูจน์แล้ว' },
    designLater: 'ดีไซน์จะตามมาภายหลัง',
    devlog: {
      kicker: 'บันทึกการพัฒนา',
      latest: 'ข่าวล่าสุดจากโรงตีเหล็ก',
      title: 'บันทึกจากโรงตีเหล็ก',
      intro: 'เราสร้างอะไร อะไรพัง และอะไรกำลังจะมา',
      readMore: 'อ่านต่อ',
      all: 'โพสต์ทั้งหมด',
      more: 'โพสต์อื่น',
      englishOnly: 'โพสต์นี้ยังไม่มีฉบับภาษาไทย',
    },
    later: { kicker: 'เร็ว ๆ นี้', title: 'โลกที่เติบโตไม่หยุด' },
    featuresPage: {
      kicker: 'ฟีเจอร์',
      title: 'สิ่งที่คุณจะได้พบในโลกนี้',
      intro: 'ทุกอย่างด้านล่างอยู่ระหว่างการออกแบบหรือพัฒนา รายละเอียดอาจเปลี่ยนก่อนเปิดตัว',
      horizon: (list) => `สิ่งที่กำลังจะตามมา: ${list}`,
    },
    notFound: { title: 'คุณหลงออกนอกแผนที่แล้ว', body: 'หน้านี้ยังไม่มีอยู่ (ในตอนนี้)', back: 'กลับเข้าเมือง' },
  },
}
