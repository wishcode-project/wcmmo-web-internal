// Item database for the public guide (EN + TH). Real items only, from the registry in
// wcmmo-specs/docs/README.md and specs 006, 008, 011, 012, 013, 015, 020, 021.
// There are no named gear items with stats yet, so gear appears by type; the one item with
// numbers (sampleItem) is an illustration of the tooltip and is labelled as such on the page.
import type { Dict } from '../../shared/i18n'
import type { IconName } from '../config'

type T = Dict<string>

export type ItemCategory = 'gear' | 'consumable' | 'material' | 'orb' | 'farming' | 'furniture'

export interface Item {
  id: string
  name: T
  icon: IconName
  category: ItemCategory
  type: T
  text: T
  source?: T
}

export const categories: Record<ItemCategory, { name: T; color: string }> = {
  gear: { name: { en: 'Gear', th: 'อุปกรณ์' }, color: '#fff7cf' },
  consumable: { name: { en: 'Consumables', th: 'ของใช้' }, color: '#8fd14f' },
  material: { name: { en: 'Materials', th: 'วัตถุดิบ' }, color: '#5fb4ea' },
  orb: { name: { en: 'Skill Orbs', th: 'Skill Orb' }, color: '#c77dd9' },
  farming: { name: { en: 'Farming', th: 'การฟาร์ม' }, color: '#f08a3a' },
  furniture: { name: { en: 'Furniture', th: 'เฟอร์นิเจอร์' }, color: '#ffc94b' },
}

const weapon = (id: string, en: string, th: string, icon: IconName, family: [string, string], req: string): Item => ({
  id: `weapon-${id}`,
  name: { en, th },
  icon,
  category: 'gear',
  type: { en: `Weapon · ${family[0]}`, th: `อาวุธ · ${family[1]}` },
  text: { en: `Main requirement: ${req}. Five skills and an ultimate, unlocked by Mastery.`, th: `ต้องการหลัก: ${req} มี 5 สกิลและท่าไม้ตาย ปลดล็อกด้วยความชำนาญ` },
  source: { en: 'monster drops (unidentified), crafting, quests', th: 'ดรอปจากมอนสเตอร์ (ยังไม่ระบุค่า), คราฟต์, เควสต์' },
})

const accessory = (id: string, en: string, th: string): Item => ({
  id: `acc-${id}`,
  name: { en, th },
  icon: 'ring',
  category: 'gear',
  type: { en: 'Accessory', th: 'เครื่องประดับ' },
  text: { en: 'One slot each. Stats apply while worn. Enhances from I to V.', th: 'ใส่ได้ช่องละ 1 ชิ้น สเตตัสมีผลขณะสวมใส่ ตีบวกได้ตั้งแต่ I ถึง V' },
  source: { en: 'monster drops, dungeons', th: 'ดรอปจากมอนสเตอร์, ดันเจียน' },
})

export const items: Item[] = [
  weapon('sword', 'Sword', 'ดาบ', 'sword', ['Melee', 'ประชิด'], 'STR + AGI'),
  weapon('hammer', 'Hammer', 'ค้อน', 'hammer', ['Melee', 'ประชิด'], 'STR'),
  weapon('bow', 'Bow', 'ธนู', 'bow', ['Ranged', 'ระยะไกล'], 'DEX'),
  weapon('staff', 'Staff', 'คทา', 'staff', ['Magic', 'เวทมนตร์'], 'INT'),
  {
    id: 'armour',
    name: { en: 'Armour (4 pieces)', th: 'เกราะ (4 ชิ้น)' },
    icon: 'shield',
    category: 'gear',
    type: { en: 'Armour · helmet, chest, legs, boots', th: 'เกราะ · หมวก เสื้อ กางเกง รองเท้า' },
    text: {
      en: 'Heavy armour asks for DEF (and STR at the top tiers). Enhances on the same ladder as weapons: +1 to +15, then I to V.',
      th: 'เกราะหนักต้องการ DEF (และ STR ในระดับสูง) ตีบวกบันไดเดียวกับอาวุธ: +1 ถึง +15 แล้วต่อด้วย I ถึง V',
    },
    source: { en: 'monster drops, crafting, quests', th: 'ดรอปจากมอนสเตอร์, คราฟต์, เควสต์' },
  },
  {
    id: 'wings',
    name: { en: 'Wings', th: 'ปีก' },
    icon: 'wings',
    category: 'gear',
    type: { en: 'Wings · one slot', th: 'ปีก · 1 ช่อง' },
    text: {
      en: 'Folded in town, spread wide in the wilds, and they slow your fall. No real flight. Their look follows your Bloodline, and better wings give a small, honest power boost. The store only ever sells wing skins, never stats.',
      th: 'หุบอยู่ในเมือง กางออกเมื่อออกไปข้างนอก และช่วยให้ตกช้าลง บินจริงไม่ได้ หน้าตาเปลี่ยนตามสายเลือดของคุณ ปีกที่ดีกว่าให้พลังเพิ่มเล็กน้อยอย่างตรงไปตรงมา ร้านค้าจะขายแค่สกินปีก ไม่ขายค่าสเตตัส',
    },
    source: { en: 'three tiers, earned in game', th: 'มี 3 ระดับ ได้จากการเล่นในเกม' },
  },
  accessory('necklace', 'Necklace', 'สร้อยคอ'),
  accessory('earring', 'Earring', 'ต่างหู'),
  accessory('ring', 'Ring', 'แหวน'),
  accessory('belt', 'Belt', 'เข็มขัด'),

  {
    id: 'identify-scroll',
    name: { en: 'Identify Scroll', th: 'ม้วนประเมินค่า' },
    icon: 'scroll',
    category: 'consumable',
    type: { en: 'Consumable', th: 'ของใช้' },
    text: { en: 'Reveals the random stats of an unidentified item. The Identify NPC can do it for gold instead.', th: 'เปิดเผยสเตตัสสุ่มของไอเทมที่ยังไม่ระบุค่า หรือจะจ่ายทองให้ NPC ประเมินแทนก็ได้' },
    source: { en: 'NPC shops, drops', th: 'ร้านค้า NPC, ดรอป' },
  },
  {
    id: 'respec-scroll',
    name: { en: 'Respec Scroll', th: 'ม้วนรีเซ็ตแต้ม' },
    icon: 'scroll',
    category: 'consumable',
    type: { en: 'Consumable', th: 'ของใช้' },
    text: { en: 'Returns all your stat points so you can spend them again.', th: 'คืนแต้มสเตตัสทั้งหมด เพื่อให้คุณลงใหม่ได้' },
    source: { en: 'NPC shop, quest rewards', th: 'ร้านค้า NPC, รางวัลเควสต์' },
  },
  {
    id: 'bloodline-extractor',
    name: { en: 'Bloodline Extractor', th: 'Bloodline Extractor' },
    icon: 'blood',
    category: 'consumable',
    type: { en: 'Rare consumable', th: 'ของใช้หายาก' },
    text: {
      en: 'Removes your current Bloodline so you can bind another. Your progress in the old one is kept, so switching back later costs nothing.',
      th: 'ถอดสายเลือดปัจจุบันออกเพื่อผูกสายเลือดใหม่ ความก้าวหน้าของสายเลือดเดิมยังเก็บไว้ ถ้ากลับมาใช้ภายหลังก็ไม่เสียอะไร',
    },
    source: { en: 'rare boss drops, high-cost NPC trade', th: 'ดรอปหายากจากบอส, แลกกับ NPC ราคาสูง' },
  },

  ...(
    [
      ['weapon', 'Weapon', 'อาวุธ'],
      ['armour', 'Armour', 'เกราะ'],
      ['accessory', 'Accessory', 'เครื่องประดับ'],
    ] as const
  ).map(
    ([id, en, th]): Item => ({
      id: `stone-${id}`,
      name: { en: `${en} Enhancement Stone`, th: `หินตีบวก${th}` },
      icon: 'gem',
      category: 'material',
      type: { en: 'Enhancement material', th: 'วัตถุดิบตีบวก' },
      text: { en: `Used by the Enhancer to raise the level of your ${en.toLowerCase()} gear.`, th: `ใช้กับช่างตีบวกเพื่อเพิ่มระดับ${th}ของคุณ` },
      source: { en: 'monster drops in the zones', th: 'ดรอปจากมอนสเตอร์ในโซนต่าง ๆ' },
    }),
  ),
  {
    id: 'bloodline-seal',
    name: { en: 'Bloodline Seals', th: 'ตราผนึกสายเลือด' },
    icon: 'rune',
    category: 'material',
    type: { en: 'Stage unlock material', th: 'วัตถุดิบปลดล็อกขั้น' },
    text: { en: 'Needed with your level to unlock Bloodline stages 2 to 5. Final names to come.', th: 'ใช้ร่วมกับเลเวลเพื่อปลดล็อกสายเลือดขั้นที่ 2 ถึง 5 ชื่อจริงจะตามมา' },
    source: { en: 'dungeons, lifeskills', th: 'ดันเจียน, ทักษะชีวิต' },
  },

  ...(
    [
      ['gale-lance', 'Gale Lance', 'any melee weapon', 'อาวุธประชิดทุกแบบ'],
      ['earthsplitter', 'Earthsplitter', 'any melee weapon', 'อาวุธประชิดทุกแบบ'],
      ['fanfire', 'Fanfire', 'any ranged weapon', 'อาวุธระยะไกลทุกแบบ'],
      ['whirl-cut', 'Whirl Cut', 'Sword only', 'ดาบเท่านั้น'],
    ] as const
  ).map(
    ([id, name, en, th]): Item => ({
      id: `orb-${id}`,
      name: { en: `Skill Orb: ${name}`, th: `Skill Orb: ${name}` },
      icon: 'orb',
      category: 'orb',
      type: { en: 'Skill Orb', th: 'Skill Orb' },
      text: { en: `Use it to learn ${name} once. Usable with ${en}.`, th: `ใช้เพื่อเรียนสกิล ${name} (ใช้ครั้งเดียว) ใช้ได้กับ${th}` },
      source: { en: 'Orb Merchant in the first city, monster drops', th: 'Orb Merchant ในนครแห่งแรก, ดรอปจากมอนสเตอร์' },
    }),
  ),

  ...(
    [
      ['low', 'Low', 'ระดับต่ำ'],
      ['mid', 'Mid', 'ระดับกลาง'],
      ['high', 'High', 'ระดับสูง'],
    ] as const
  ).map(
    ([id, en, th]): Item => ({
      id: `totem-${id}`,
      name: { en: `${en} Totem`, th: `โทเท็ม${th}` },
      icon: 'totem',
      category: 'farming',
      type: { en: 'Consumable · stationary farming', th: 'ของใช้ · ฟาร์มแบบอยู่กับที่' },
      text: {
        en: `Light it at a totem spot in a ${en.toLowerCase()} zone and hold your ground: waves of monsters come to you for 10 minutes. One totem per spot, solo or with your party.`,
        th: `จุดที่จุดโทเท็มในโซน${th} แล้วยืนสู้ มอนสเตอร์จะบุกเข้ามาเป็นระลอกนาน 10 นาที 1 จุดใช้ได้ 1 โทเท็ม เล่นคนเดียวหรือกับปาร์ตี้ก็ได้`,
      },
      source: { en: 'NPC shops, drops', th: 'ร้านค้า NPC, ดรอป' },
    }),
  ),

  ...(
    [
      ['bed', 'Starter Bed', 'เตียงเริ่มต้น'],
      ['table', 'Starter Table', 'โต๊ะเริ่มต้น'],
      ['chair', 'Starter Chair', 'เก้าอี้เริ่มต้น'],
      ['lamp', 'Starter Lamp', 'โคมไฟเริ่มต้น'],
    ] as const
  ).map(
    ([id, en, th]): Item => ({
      id: `furn-${id}`,
      name: { en, th },
      icon: 'house',
      category: 'furniture',
      type: { en: 'Furniture', th: 'เฟอร์นิเจอร์' },
      text: { en: 'Place it in your Lifezone house.', th: 'วางในบ้านของคุณใน Lifezone' },
      source: { en: 'furniture merchant, crafting', th: 'พ่อค้าเฟอร์นิเจอร์, คราฟต์' },
    }),
  ),
]

// ── Rarity (spec 012) ───────────────────────────────────────────────────────

export const rarities: { id: string; name: T; color: string; lines: number; roll: string; element: string; weight: number }[] = [
  { id: 'common', name: { en: 'Common', th: 'ธรรมดา' }, color: '#e8e6ee', lines: 1, roll: '70–100%', element: '0%', weight: 60 },
  { id: 'uncommon', name: { en: 'Uncommon', th: 'ไม่ธรรมดา' }, color: '#8fd14f', lines: 2, roll: '75–105%', element: '10%', weight: 25 },
  { id: 'rare', name: { en: 'Rare', th: 'หายาก' }, color: '#5fb4ea', lines: 3, roll: '80–110%', element: '30%', weight: 10 },
  { id: 'epic', name: { en: 'Epic', th: 'มหากาพย์' }, color: '#c77dd9', lines: 4, roll: '85–115%', element: '60%', weight: 4 },
  { id: 'legendary', name: { en: 'Legendary', th: 'ตำนาน' }, color: '#ffc94b', lines: 5, roll: '90–120%', element: '100%', weight: 1 },
]

// ── Enhancement ladder (spec 013) ───────────────────────────────────────────

export const enhanceLadder: { stage: string; success: number; label: string; fail: T }[] = [
  { stage: '+1 … +7', success: 100, label: '100%', fail: { en: '—', th: '—' } },
  { stage: '+8', success: 90, label: '90%', fail: { en: 'stays', th: 'คงเดิม' } },
  { stage: '+9 … +12', success: 80, label: '80 → 50%', fail: { en: 'stays', th: 'คงเดิม' } },
  { stage: '+13 … +15', success: 40, label: '40 → 25%', fail: { en: 'stays', th: 'คงเดิม' } },
  { stage: 'I', success: 40, label: '40%', fail: { en: 'stays', th: 'คงเดิม' } },
  { stage: 'II', success: 25, label: '25%', fail: { en: 'drops to I', th: 'ลดเหลือ I' } },
  { stage: 'III', success: 15, label: '15%', fail: { en: 'drops 1', th: 'ลด 1 ขั้น' } },
  { stage: 'IV', success: 8, label: '8%', fail: { en: 'drops 1', th: 'ลด 1 ขั้น' } },
  { stage: 'V', success: 5, label: '5%', fail: { en: 'drops 1', th: 'ลด 1 ขั้น' } },
]

// ── Illustration of the in-game tooltip (spec 026 pages). NOT a real item. ──

export const sampleItem = {
  name: 'Sample Longsword',
  rarity: 'rare',
  enhance: '+7',
  pages: {
    stats: [
      { k: { en: 'Attack Power', th: 'พลังโจมตี (AP)' }, v: '48' },
      { k: { en: 'Critical chance', th: 'โอกาสคริติคอล' }, v: '+4%' },
      { k: { en: 'Stamina regen', th: 'ฟื้นสแตมินา' }, v: '+12%' },
      { k: { en: 'Attack speed', th: 'ความเร็วโจมตี' }, v: '+3%' },
    ],
    requires: 'STR 25 · AGI 25 · Lv 20',
    upgrades: [
      { k: { en: 'Enhancement', th: 'การตีบวก' }, v: '+7 / +15' },
      { k: { en: 'Element', th: 'ธาตุ' }, v: '🔥 Fire +6%' },
      { k: { en: 'Identified', th: 'ประเมินค่าแล้ว' }, v: '3 / 3' },
    ],
    lore: {
      en: 'A plain soldier’s blade from the river city, balanced for quick hands.',
      th: 'ดาบทหารธรรมดาจากนครริมน้ำ สมดุลพอดีสำหรับมือที่ว่องไว',
    },
    source: { en: 'Drop · Low zones', th: 'ดรอป · โซนต่ำ' },
  },
}
