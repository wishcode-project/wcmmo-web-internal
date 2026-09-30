// Game guide data (public, EN + TH). Written from the specs, teaser-level:
// Bloodlines: gdd/bloodlines.md + spec 021 · Skills: specs 007, 008, 025 · Runes: spec 022 · Stats: spec 006.
// No lore here (the Bloodlines' body-part theme and what the Remnant really is stay team-only).
import type { Dict } from '../../shared/i18n'
import type { IconName } from '../config'

type T = Dict<string>

// ── Bloodlines ──────────────────────────────────────────────────────────────

export interface StageNode {
  stage: 1 | 2 | 3 | 4 | 5
  path: 'fixed' | 'A' | 'B'
  name: string
  active?: boolean
  text: T
}

export interface Bloodline {
  id: 'fury' | 'ward' | 'pulse'
  name: string
  icon: IconName
  color: string
  /** darker shade of `color`, readable as text on parchment */
  ink: string
  tagline: T
  about: T
  playsLike: T
  best: T
  weakness: T
  /** 1–5, our reading of the early design (gdd/bloodlines.md §2), not spec numbers */
  ratings: { difficulty: number; damage: number; defence: number; recovery: number; support: number }
  nodes: StageNode[]
}

export const stageUnlock: Record<number, T> = {
  1: { en: 'on binding', th: 'เมื่อได้รับสายเลือด' },
  2: { en: 'level 20', th: 'เลเวล 20' },
  3: { en: 'level 40', th: 'เลเวล 40' },
  4: { en: 'level 60', th: 'เลเวล 60' },
  5: { en: 'level 60 + awakening quest', th: 'เลเวล 60 + เควสต์ปลุกพลัง' },
}

export const bloodlines: Bloodline[] = [
  {
    id: 'fury',
    name: 'Fury',
    icon: 'fury',
    color: '#d64a3a',
    ink: '#a8321f',
    tagline: { en: 'The harder you are hit, the harder you hit.', th: 'ยิ่งโดนหนัก ยิ่งตีหนัก' },
    about: {
      en: 'Fury turns your health into a resource. The lower it drops, the faster and more dangerous you become, and at its peak Fury pays with its own blood to reset every cooldown. The fastest Bloodline at clearing, and the easiest to lose with a single mistake.',
      th: 'Fury เปลี่ยนพลังชีวิตของคุณให้เป็นทรัพยากร ยิ่งเลือดลด ยิ่งเร็วและยิ่งอันตราย และในขั้นสูงสุด Fury จ่ายด้วยเลือดของตัวเองเพื่อรีเซ็ตคูลดาวน์ทุกสกิล เคลียร์มอนได้เร็วที่สุด แต่ก็พลาดครั้งเดียวแล้วจบง่ายที่สุดเช่นกัน',
    },
    playsLike: { en: 'push forward, never back off', th: 'บุกไปข้างหน้า ไม่ถอย' },
    best: { en: 'fastest clears', th: 'เคลียร์มอนเร็วที่สุด' },
    weakness: { en: 'fragile: one mistake can end the fight', th: 'บาง พลาดครั้งเดียวอาจจบการต่อสู้' },
    ratings: { difficulty: 4, damage: 5, defence: 1, recovery: 3, support: 2 },
    nodes: [
      { stage: 1, path: 'fixed', name: 'Adrenaline', text: { en: 'Attack faster while your health is low.', th: 'โจมตีเร็วขึ้นเมื่อเลือดเหลือน้อย' } },
      { stage: 2, path: 'A', name: 'Pain is Power', text: { en: 'Taking damage restores stamina.', th: 'โดนดาเมจแล้วได้สแตมินาคืน' } },
      { stage: 2, path: 'B', name: 'Bloodthirst', text: { en: 'Every kill heals you.', th: 'ฆ่าศัตรูแต่ละตัวแล้วฟื้นเลือด' } },
      { stage: 3, path: 'A', name: 'Unstoppable', text: { en: 'Charge and heavy skills give Super Armour while they play out.', th: 'สกิลพุ่งชนและสกิลหนักได้ Super Armour ระหว่างใช้' } },
      { stage: 3, path: 'B', name: 'Frenzy', text: { en: 'Below half health, each hit stacks extra damage.', th: 'เมื่อเลือดต่ำกว่าครึ่ง ทุกการโจมตีจะซ้อนดาเมจเพิ่มขึ้น' } },
      { stage: 4, path: 'fixed', name: 'Blood Rage', active: true, text: { en: 'Active skill: pay part of your health to reset every skill cooldown.', th: 'สกิลกดใช้: จ่ายเลือดบางส่วนเพื่อรีเซ็ตคูลดาวน์ทุกสกิล' } },
      { stage: 5, path: 'A', name: 'Death Defying', text: { en: 'A fatal hit leaves you at 1 HP, then you fight on with Super Armour and a fast heal.', th: 'โดนท่าที่ควรตายจะเหลือ 1 HP แล้วสู้ต่อด้วย Super Armour และฟื้นเลือดเร็ว' } },
      { stage: 5, path: 'B', name: 'Last Rampage', text: { en: 'Deep in danger you turn into a monster: much more damage and lifesteal.', th: 'เมื่อใกล้ตาย คุณจะกลายเป็นอสูร ดาเมจสูงขึ้นมากและดูดเลือดได้' } },
    ],
  },
  {
    id: 'ward',
    name: 'Ward',
    icon: 'ward',
    color: '#8fb4d9',
    ink: '#2f5f8f',
    tagline: { en: 'Guard, store, release.', th: 'ป้องกัน สะสม ปลดปล่อย' },
    about: {
      en: 'Ward rewards patience. Every hit you block from the front builds Bulwark, and a guard timed at the last moment staggers the attacker. Spend that stored power to stand immovable or to land one crushing blow. The best survivor of the three, with a slow start.',
      th: 'Ward ให้รางวัลกับความใจเย็น ทุกการโจมตีที่คุณกันจากด้านหน้าจะสะสม Bulwark และการกันในจังหวะสุดท้ายพอดีจะทำให้ศัตรูเสียหลัก ใช้พลังที่สะสมไว้เพื่อยืนหยัดไม่ขยับ หรือปล่อยการโจมตีหนักครั้งเดียว เอาตัวรอดเก่งที่สุดในสามสาย แต่เริ่มต้นช้า',
    },
    playsLike: { en: 'stay calm and read the enemy', th: 'ใจเย็น อ่านจังหวะศัตรู' },
    best: { en: 'survival', th: 'การเอาตัวรอด' },
    weakness: { en: 'low early damage: you have to let them swing first', th: 'ดาเมจช่วงแรกน้อย ต้องปล่อยให้ศัตรูโจมตีก่อน' },
    ratings: { difficulty: 3, damage: 2, defence: 5, recovery: 3, support: 3 },
    nodes: [
      { stage: 1, path: 'fixed', name: 'Unbroken', text: { en: 'Each frontal block adds a Bulwark stack; each stack reduces damage taken.', th: 'ทุกครั้งที่กันจากด้านหน้าได้ Bulwark 1 ชั้น แต่ละชั้นลดดาเมจที่ได้รับ' } },
      { stage: 2, path: 'A', name: 'Counterweight', text: { en: 'A perfect guard staggers the attacker and restores stamina.', th: 'การกันแบบเพอร์เฟกต์ทำให้ศัตรูเสียหลักและได้สแตมินาคืน' } },
      { stage: 2, path: 'B', name: 'Thornhide', text: { en: 'Blocked hits reflect part of their damage.', th: 'การโจมตีที่กันได้จะสะท้อนดาเมจบางส่วนกลับ' } },
      { stage: 3, path: 'A', name: 'Iron Stance', text: { en: 'At full Bulwark, become immovable for a moment.', th: 'เมื่อ Bulwark เต็ม จะยืนหยัดไม่ขยับได้ชั่วครู่' } },
      { stage: 3, path: 'B', name: 'Marrow Break', text: { en: 'At full Bulwark, your next skill spends it for a heavy blow.', th: 'เมื่อ Bulwark เต็ม สกิลถัดไปจะใช้มันเป็นการโจมตีหนัก' } },
      { stage: 4, path: 'fixed', name: 'Bone Bastion', active: true, text: { en: 'Active skill: armour that absorbs damage, raises your max health and hurts attackers. In a party, allies get a health bonus too.', th: 'สกิลกดใช้: เกราะที่ดูดซับดาเมจ เพิ่มเลือดสูงสุด และทำร้ายผู้โจมตี ถ้าอยู่ในปาร์ตี้ เพื่อนก็ได้เลือดสูงสุดเพิ่มด้วย' } },
      { stage: 5, path: 'A', name: 'Last Stand', text: { en: 'A single huge hit is halved and fills your Bulwark.', th: 'การโจมตีหนักมากครั้งเดียวจะลดลงครึ่งหนึ่งและเติม Bulwark จนเต็ม' } },
      { stage: 5, path: 'B', name: 'Retribution', text: { en: 'Every third perfect guard fires an automatic counter-strike.', th: 'ทุกการกันแบบเพอร์เฟกต์ครั้งที่สามจะสวนกลับอัตโนมัติ' } },
    ],
  },
  {
    id: 'pulse',
    name: 'Pulse',
    icon: 'pulse',
    color: '#c77dd9',
    ink: '#86379a',
    tagline: { en: 'Keep the rhythm.', th: 'รักษาจังหวะ' },
    about: {
      en: 'Pulse is about flow. Chain different skills one after another and every third one releases a pulse that heals you and hurts everything around you. Repeat a skill and the rhythm breaks. Not a healer class: Pulse links to enemies and drains them; helping allies is an option.',
      th: 'Pulse คือเรื่องของความลื่นไหล ใช้สกิลที่ต่างกันต่อเนื่อง ทุกสกิลที่สามจะปล่อยคลื่นพลังที่ฟื้นฟูคุณและทำร้ายทุกอย่างรอบตัว ใช้สกิลเดิมซ้ำ จังหวะจะขาด ไม่ใช่คลาสฮีลเลอร์: Pulse ผูกกับศัตรูแล้วดูดพลัง การช่วยเพื่อนเป็นทางเลือก',
    },
    playsLike: { en: 'a steady, clean rotation', th: 'กดสกิลเป็นจังหวะสม่ำเสมอ' },
    best: { en: 'long fights', th: 'การต่อสู้ที่ยาวนาน' },
    weakness: { en: 'no big burst; spamming one skill breaks the rhythm', th: 'ไม่มีดาเมจระเบิด และกดสกิลเดียวรัว ๆ จะทำให้จังหวะพัง' },
    ratings: { difficulty: 3, damage: 3, defence: 3, recovery: 5, support: 4 },
    nodes: [
      { stage: 1, path: 'fixed', name: 'Rhythm', text: { en: 'Every three different skills in a row release a Pulse: it heals you and hurts nearby enemies.', th: 'ใช้สกิลต่างกัน 3 สกิลติดกัน จะปล่อย Pulse ที่ฟื้นฟูคุณและทำร้ายศัตรูรอบตัว' } },
      { stage: 2, path: 'A', name: 'Shared Breath', text: { en: 'Your healing also restores stamina and mana; overhealing turns into a shield.', th: 'การฟื้นฟูของคุณคืนสแตมินาและมานาด้วย ส่วนที่ฮีลเกินจะกลายเป็นโล่' } },
      { stage: 2, path: 'B', name: 'Crescendo', text: { en: 'Each Pulse raises your damage for a few seconds, stacking.', th: 'ทุก Pulse เพิ่มดาเมจของคุณชั่วครู่ และซ้อนกันได้' } },
      { stage: 3, path: 'A', name: 'Bond', text: { en: 'Link to an enemy: damage you deal it heals you. You can link to an ally instead.', th: 'ผูกกับศัตรู: ดาเมจที่คุณทำใส่มันจะฟื้นเลือดคุณ หรือจะผูกกับเพื่อนแทนก็ได้' } },
      { stage: 3, path: 'B', name: 'Echo', text: { en: 'Every Pulse repeats once, a moment later.', th: 'ทุก Pulse จะเกิดซ้ำอีกครั้งในอีกครู่ต่อมา' } },
      { stage: 4, path: 'fixed', name: 'Heartbeat Surge', active: true, text: { en: 'Active skill: for a few seconds, every skill releases a Pulse.', th: 'สกิลกดใช้: ช่วงเวลาสั้น ๆ ทุกสกิลจะปล่อย Pulse' } },
      { stage: 5, path: 'A', name: 'Resonance', text: { en: 'Pulses cleanse a debuff and shield you; your linked target is pulsed again.', th: 'Pulse ล้างดีบัฟและสร้างโล่ และเป้าหมายที่ผูกไว้จะโดน Pulse อีกครั้ง' } },
      { stage: 5, path: 'B', name: 'Symphony', text: { en: 'Five different skills in a row make your next skill free of cooldown.', th: 'ใช้สกิลต่างกัน 5 สกิลติดกัน สกิลถัดไปจะไม่ติดคูลดาวน์' } },
    ],
  },
]

// ── Weapons & skills ────────────────────────────────────────────────────────

export interface Skill {
  name: string
  mastery?: number
  tags?: ('guard-break' | 'heavy' | 'charge' | 'ultimate')[]
  text: T
}

export interface Weapon {
  id: string
  name: T
  icon: IconName
  family: 'melee' | 'ranged' | 'magic'
  resource: 'stamina' | 'mana'
  feel: T
  slice: boolean
  skills: Skill[]
}

export const weapons: Weapon[] = [
  {
    id: 'sword',
    name: { en: 'Sword', th: 'ดาบ' },
    icon: 'sword',
    family: 'melee',
    resource: 'stamina',
    feel: { en: 'Fast, combos and counters.', th: 'เร็ว ต่อคอมโบ และสวนกลับ' },
    slice: true,
    skills: [
      { name: 'Blade Flurry', mastery: 0, text: { en: 'Three quick slashes in front of you.', th: 'ฟันเร็ว 3 ครั้งไปข้างหน้า' } },
      { name: 'Piercing Thrust', mastery: 5, tags: ['guard-break', 'charge'], text: { en: 'Lunge forward and pierce through a guard.', th: 'พุ่งแทงไปข้างหน้า ทะลุการป้องกัน' } },
      { name: 'Rising Slash', mastery: 10, text: { en: 'An upward slash that knocks enemies into the air.', th: 'ฟันเสยขึ้น ทำให้ศัตรูลอยขึ้น' } },
      { name: 'Riposte', mastery: 15, text: { en: 'A short stance: a frontal hit triggers a counter and a stagger.', th: 'ตั้งท่าชั่วครู่: ถ้าโดนตีจากด้านหน้าจะสวนกลับและทำให้ศัตรูเสียหลัก' } },
      { name: 'Thousand Cuts', mastery: 20, text: { en: 'A flurry of slashes with Super Armour.', th: 'ฟันรัวต่อเนื่องพร้อม Super Armour' } },
      { name: 'Blade Storm', mastery: 25, tags: ['ultimate'], text: { en: 'Ultimate: a spinning storm of blades around you.', th: 'ท่าไม้ตาย: พายุใบดาบหมุนรอบตัว' } },
    ],
  },
  {
    id: 'hammer',
    name: { en: 'Hammer', th: 'ค้อน' },
    icon: 'hammer',
    family: 'melee',
    resource: 'stamina',
    feel: { en: 'Slow and heavy. Breaks guards and Super Armour.', th: 'ช้าแต่หนัก ทุบทั้งการป้องกันและ Super Armour' },
    slice: true,
    skills: [
      { name: 'Ground Smash', mastery: 0, tags: ['heavy'], text: { en: 'Slam the ground around you.', th: 'ทุบพื้นรอบตัว' } },
      { name: 'Wide Swing', mastery: 5, tags: ['heavy'], text: { en: 'A half-circle sweep that knocks enemies back.', th: 'เหวี่ยงครึ่งวงกลม ผลักศัตรูกระเด็น' } },
      { name: 'Quake', mastery: 10, tags: ['heavy'], text: { en: 'A shockwave in a line that slows everything it hits.', th: 'คลื่นกระแทกเป็นแนวยาว ทำให้ทุกอย่างที่โดนช้าลง' } },
      { name: 'Unmovable', mastery: 15, text: { en: 'Super Armour and less damage taken for a few seconds.', th: 'Super Armour และลดดาเมจที่ได้รับชั่วครู่' } },
      { name: 'Titan Fall', mastery: 20, tags: ['heavy', 'charge'], text: { en: 'Leap into the air and crash down, stunning enemies.', th: 'กระโดดขึ้นแล้วทุบลงมา สตันศัตรู' } },
      { name: 'Earthbreaker', mastery: 25, tags: ['ultimate', 'heavy'], text: { en: 'Ultimate: a giant slam that throws and stuns everything nearby.', th: 'ท่าไม้ตาย: ทุบครั้งใหญ่ ทำให้ทุกอย่างรอบตัวลอยและสตัน' } },
    ],
  },
  {
    id: 'bow',
    name: { en: 'Bow', th: 'ธนู' },
    icon: 'bow',
    family: 'ranged',
    resource: 'stamina',
    feel: { en: 'Long range. Shots fire instantly, so keep moving.', th: 'ระยะไกล ยิงออกทันที เคลื่อนที่ตลอด' },
    slice: true,
    skills: [
      { name: 'Rapid Volley', mastery: 0, text: { en: 'Three fast arrows.', th: 'ยิงลูกธนูเร็ว 3 ดอก' } },
      { name: 'Tumble Shot', mastery: 5, text: { en: 'Backflip away while shooting.', th: 'ตีลังกาถอยหลังพร้อมยิง' } },
      { name: 'Arrow Rain', mastery: 10, text: { en: 'Arrows rain down on the spot you aim at.', th: 'ฝนลูกธนูตกลงตรงจุดที่เล็ง' } },
      { name: 'Snare Arrow', mastery: 15, text: { en: 'Roots the target in place.', th: 'ตรึงเป้าหมายไว้กับที่' } },
      { name: 'Piercing Gale', mastery: 20, tags: ['guard-break'], text: { en: 'A wind arrow that flies through a long line and pushes enemies back.', th: 'ลูกธนูลมพุ่งเป็นแนวยาว ผลักศัตรูถอยหลัง' } },
      { name: "Heaven's Barrage", mastery: 25, tags: ['ultimate'], text: { en: 'Ultimate: a storm of arrows over a wide area.', th: 'ท่าไม้ตาย: พายุลูกธนูเป็นวงกว้าง' } },
    ],
  },
  {
    id: 'staff',
    name: { en: 'Staff', th: 'คทา' },
    icon: 'staff',
    family: 'magic',
    resource: 'mana',
    feel: { en: 'Big area spells, limited by mana.', th: 'เวทวงกว้าง จำกัดด้วยมานา' },
    slice: true,
    skills: [
      { name: 'Fireball', mastery: 0, text: { en: 'A fireball that sets the target burning.', th: 'ลูกไฟที่ทำให้เป้าหมายติดไฟ' } },
      { name: 'Frost Nova', mastery: 5, text: { en: 'An ice ring around you that roots enemies: your escape tool.', th: 'วงน้ำแข็งรอบตัวที่ตรึงศัตรู ใช้หนีเอาตัวรอด' } },
      { name: 'Chain Lightning', mastery: 10, text: { en: 'Lightning that bounces between several targets.', th: 'สายฟ้าที่กระโดดไปหาหลายเป้าหมาย' } },
      { name: 'Blink', mastery: 15, text: { en: 'Teleport a short distance forward.', th: 'วาร์ปไปข้างหน้าระยะสั้น' } },
      { name: 'Meteor', mastery: 20, tags: ['guard-break'], text: { en: 'A short cast, then a meteor crashes down and burns.', th: 'ร่ายชั่วครู่ แล้วอุกกาบาตตกลงมาพร้อมเผาไหม้' } },
      { name: 'Cataclysm', mastery: 25, tags: ['ultimate'], text: { en: 'Ultimate: meteors fall across a huge area.', th: 'ท่าไม้ตาย: อุกกาบาตตกลงมาทั่วบริเวณกว้าง' } },
    ],
  },
]

export const laterWeapons: { name: T; family: Weapon['family']; feel: T }[] = [
  { name: { en: 'Greatsword', th: 'ดาบใหญ่' }, family: 'melee', feel: { en: 'wide arcs, Super Armour on swings, breaks guard', th: 'ฟันวงกว้าง มี Super Armour ระหว่างเหวี่ยง ทำลายการป้องกัน' } },
  { name: { en: 'Spear', th: 'หอก' }, family: 'melee', feel: { en: 'longest reach, a guard-counter stance', th: 'ระยะเอื้อมไกลที่สุด มีท่าตั้งรับแล้วสวน' } },
  { name: { en: 'Crossbow', th: 'หน้าไม้' }, family: 'ranged', feel: { en: 'burst bolts, shooting on the move', th: 'ยิงหนักเป็นชุด ยิงระหว่างเคลื่อนที่ได้' } },
  { name: { en: 'Tome', th: 'ตำราเวท' }, family: 'magic', feel: { en: 'fast casts, control, buffs and debuffs', th: 'ร่ายเร็ว ควบคุมศัตรู บัฟและดีบัฟ' } },
]

export const generalSkills: Skill[] = [
  { name: 'Dash', text: { en: 'Dash forward.', th: 'พุ่งไปข้างหน้า' } },
  { name: 'Backstep', text: { en: 'Hop back.', th: 'กระโดดถอยหลัง' } },
  { name: 'Sidestep', text: { en: 'Hop sideways in the direction you move.', th: 'กระโดดไปด้านข้างตามทิศที่เดิน' } },
  { name: 'Kick', text: { en: 'A front kick that knocks back and interrupts.', th: 'เตะไปข้างหน้า ผลักและขัดจังหวะศัตรู' } },
  { name: 'Shoulder Charge', tags: ['charge'], text: { en: 'Charge with Super Armour, knocking down small enemies.', th: 'พุ่งชนพร้อม Super Armour ล้มศัตรูตัวเล็ก' } },
  { name: 'Leap', text: { en: 'A high jump forward over obstacles.', th: 'กระโดดสูงข้ามสิ่งกีดขวาง' } },
  { name: 'Second Wind', text: { en: 'Restore stamina over a few seconds.', th: 'ฟื้นสแตมินาในไม่กี่วินาที' } },
  { name: 'Battle Cry', text: { en: 'More damage for a short time.', th: 'เพิ่มดาเมจชั่วครู่' } },
  { name: 'Iron Skin', text: { en: 'Take less damage for a few seconds, but you cannot sprint.', th: 'ลดดาเมจที่ได้รับชั่วครู่ แต่วิ่งเร็วไม่ได้' } },
  { name: 'Focus', text: { en: 'Cleanse a debuff and heal a little.', th: 'ล้างดีบัฟและฟื้นเลือดเล็กน้อย' } },
]

export const orbSkills: (Skill & { who: T })[] = [
  { name: 'Gale Lance', who: { en: 'any melee weapon', th: 'อาวุธประชิดทุกแบบ' }, text: { en: 'Gather power, then a lunging wind thrust that carries on through the enemies behind.', th: 'รวบรวมพลังแล้วพุ่งแทงด้วยลม ทะลุไปถึงศัตรูที่อยู่ข้างหลัง' } },
  { name: 'Earthsplitter', who: { en: 'any melee weapon', th: 'อาวุธประชิดทุกแบบ' }, text: { en: 'Strike the ground: three expanding shockwave rings around you.', th: 'ทุบพื้น ปล่อยคลื่นกระแทก 3 วงขยายออกรอบตัว' } },
  { name: 'Fanfire', who: { en: 'any ranged weapon', th: 'อาวุธระยะไกลทุกแบบ' }, text: { en: 'Five arrows in a fan that pierce through enemies.', th: 'ยิงลูกธนู 5 ดอกเป็นรูปพัด ทะลุศัตรู' } },
  { name: 'Whirl Cut', who: { en: 'Sword only', th: 'ดาบเท่านั้น' }, text: { en: 'A wide sweep in front of you that hits everything around: your answer to being surrounded.', th: 'ฟันกวาดวงกว้างด้านหน้า โดนทุกอย่างรอบ ๆ ใช้ตอนโดนล้อม' } },
]

export const controls: { key: string; text: T }[] = [
  { key: 'LMB', text: { en: 'basic attack (melee, magic bolt)', th: 'โจมตีพื้นฐาน (ประชิด, ลูกเวท)' } },
  { key: 'RMB', text: { en: 'basic shot: bows fire instantly', th: 'ยิงพื้นฐาน: ธนูยิงออกทันที' } },
  { key: '1–5', text: { en: 'cast the skills on the active bar', th: 'ใช้สกิลในแถบที่เลือกอยู่' } },
  { key: 'F', text: { en: 'swap skill bar 1 ↔ 2', th: 'สลับแถบสกิล 1 ↔ 2' } },
  { key: 'Shift', text: { en: 'guard (hold)', th: 'ป้องกัน (กดค้าง)' } },
  { key: 'Q', text: { en: 'ultimate, when the Remnant gauge is full', th: 'ท่าไม้ตาย เมื่อเกจ Remnant เต็ม' } },
]

// ── Runes ───────────────────────────────────────────────────────────────────

export type RuneGroup = 'defence' | 'offence' | 'sustain' | 'utility'

export const runeGroups: Record<RuneGroup, { name: T; color: string; icon: IconName }> = {
  defence: { name: { en: 'Defence', th: 'ป้องกัน' }, color: '#5fb4ea', icon: 'rune-defence' },
  offence: { name: { en: 'Offence', th: 'โจมตี' }, color: '#e0604c', icon: 'rune-offence' },
  sustain: { name: { en: 'Sustain', th: 'ฟื้นฟู' }, color: '#88cc42', icon: 'rune-sustain' },
  utility: { name: { en: 'Utility', th: 'สนับสนุน' }, color: '#ffc94b', icon: 'rune-utility' },
}

export interface Rune {
  name: string
  group: RuneGroup
  stat: T
  /** tier I / II / III, starting values from spec 022 */
  tiers: [string, string, string]
  slice?: boolean
}

export const runes: Rune[] = [
  { name: 'Vitality', group: 'defence', stat: { en: 'Max health', th: 'พลังชีวิตสูงสุด' }, tiers: ['+5%', '+8%', '+12%'], slice: true },
  { name: 'Stoneskin', group: 'defence', stat: { en: 'Damage taken', th: 'ดาเมจที่ได้รับ' }, tiers: ['−2%', '−3%', '−5%'], slice: true },
  { name: 'Steadfast', group: 'defence', stat: { en: 'Guard stamina drain', th: 'สแตมินาที่เสียตอนป้องกัน' }, tiers: ['−5%', '−8%', '−12%'] },
  { name: 'Warding', group: 'defence', stat: { en: 'Elemental defence', th: 'ป้องกันธาตุ' }, tiers: ['+5%', '+8%', '+12%'] },
  { name: 'Edge', group: 'offence', stat: { en: 'Physical damage', th: 'ดาเมจกายภาพ' }, tiers: ['+3%', '+5%', '+8%'], slice: true },
  { name: 'Arcana', group: 'offence', stat: { en: 'Magic damage', th: 'ดาเมจเวท' }, tiers: ['+3%', '+5%', '+8%'], slice: true },
  { name: 'Fletch', group: 'offence', stat: { en: 'Bow and crossbow damage', th: 'ดาเมจธนูและหน้าไม้' }, tiers: ['+3%', '+5%', '+8%'], slice: true },
  { name: 'Precision', group: 'offence', stat: { en: 'Critical chance', th: 'โอกาสคริติคอล' }, tiers: ['+3%', '+5%', '+8%'] },
  { name: 'Ruin', group: 'offence', stat: { en: 'Critical damage', th: 'ดาเมจคริติคอล' }, tiers: ['+10%', '+15%', '+25%'] },
  { name: 'Haste', group: 'offence', stat: { en: 'Cooldown reduction', th: 'ลดคูลดาวน์' }, tiers: ['3%', '5%', '8%'], slice: true },
  { name: 'Tempo', group: 'offence', stat: { en: 'Basic attack speed', th: 'ความเร็วโจมตีพื้นฐาน' }, tiers: ['+3%', '+5%', '+8%'] },
  { name: 'Slayer', group: 'offence', stat: { en: 'Damage to bosses and elites', th: 'ดาเมจใส่บอสและอีลิต' }, tiers: ['+3%', '+5%', '+8%'] },
  { name: 'Leech', group: 'sustain', stat: { en: 'Lifesteal', th: 'ดูดเลือด' }, tiers: ['1%', '2%', '3%'], slice: true },
  { name: 'Breath', group: 'sustain', stat: { en: 'Stamina regeneration', th: 'ฟื้นสแตมินา' }, tiers: ['+10%', '+15%', '+25%'], slice: true },
  { name: 'Clarity', group: 'sustain', stat: { en: 'Mana regeneration', th: 'ฟื้นมานา' }, tiers: ['+10%', '+15%', '+25%'] },
  { name: 'Echo', group: 'utility', stat: { en: 'Remnant gain', th: 'เกจ Remnant เพิ่มเร็วขึ้น' }, tiers: ['+5%', '+10%', '+15%'] },
  { name: 'Swiftness', group: 'utility', stat: { en: 'Movement speed', th: 'ความเร็วเคลื่อนที่' }, tiers: ['+3%', '+5%', '+8%'] },
]

export const runeCaps: { stat: T; cap: string; with: T }[] = [
  { stat: { en: 'Cooldown reduction', th: 'ลดคูลดาวน์' }, cap: '30%', with: { en: 'Haste + weapon Mastery', th: 'Haste + ความชำนาญอาวุธ' } },
  { stat: { en: 'Basic attack speed', th: 'ความเร็วโจมตีพื้นฐาน' }, cap: '30%', with: { en: 'Tempo + Agility', th: 'Tempo + Agility' } },
  { stat: { en: 'Critical chance', th: 'โอกาสคริติคอล' }, cap: '60%', with: { en: 'Precision + gear', th: 'Precision + อุปกรณ์' } },
]

// ── Stats ───────────────────────────────────────────────────────────────────

export interface Attribute {
  id: 'str' | 'agi' | 'int' | 'dex' | 'def'
  name: T
  color: string
  gates: T
  bonus: T
  never: T
}

export const attributes: Attribute[] = [
  {
    id: 'str',
    name: { en: 'Strength', th: 'ความแข็งแกร่ง' },
    color: '#e0604c',
    gates: { en: 'heavy weapons (Greatsword, Hammer) and heavy armour', th: 'อาวุธหนัก (ดาบใหญ่ ค้อน) และเกราะหนัก' },
    bonus: { en: 'knockback resistance (later)', th: 'ต้านการกระเด็น (ภายหลัง)' },
    never: { en: 'damage', th: 'ดาเมจ' },
  },
  {
    id: 'agi',
    name: { en: 'Agility', th: 'ความว่องไว' },
    color: '#88cc42',
    gates: { en: 'swords and spears, top-tier bows', th: 'ดาบและหอก รวมถึงธนูระดับสูง' },
    bonus: { en: 'more max stamina, faster basic attacks (capped)', th: 'สแตมินาสูงสุดเพิ่มขึ้น โจมตีพื้นฐานเร็วขึ้น (มีเพดาน)' },
    never: { en: 'skill cooldowns', th: 'คูลดาวน์สกิล' },
  },
  {
    id: 'int',
    name: { en: 'Intelligence', th: 'สติปัญญา' },
    color: '#5fb4ea',
    gates: { en: 'staffs and tomes', th: 'คทาและตำราเวท' },
    bonus: { en: 'more max mana', th: 'มานาสูงสุดเพิ่มขึ้น' },
    never: { en: 'damage', th: 'ดาเมจ' },
  },
  {
    id: 'dex',
    name: { en: 'Dexterity', th: 'ความแม่นยำ' },
    color: '#ffc94b',
    gates: { en: 'bows and crossbows', th: 'ธนูและหน้าไม้' },
    bonus: { en: 'faster projectiles', th: 'กระสุนพุ่งเร็วขึ้น' },
    never: { en: 'damage', th: 'ดาเมจ' },
  },
  {
    id: 'def',
    name: { en: 'Defence', th: 'การป้องกัน' },
    color: '#c9d1d9',
    gates: { en: 'heavy armour, top-tier staffs and heavy weapons', th: 'เกราะหนัก รวมถึงคทาและอาวุธหนักระดับสูง' },
    bonus: { en: 'more max health', th: 'พลังชีวิตสูงสุดเพิ่มขึ้น' },
    never: { en: 'flat damage reduction (that comes from your gear)', th: 'ลดดาเมจแบบคงที่ (มาจากอุปกรณ์)' },
  },
]

/** Requirement ladder by weapon weight (spec 006, example values). */
export const requirementLadder: { gear: T; low: string; mid: string; high: string }[] = [
  { gear: { en: 'Greatsword / Hammer', th: 'ดาบใหญ่ / ค้อน' }, low: 'STR 15', mid: 'STR 40', high: 'STR 70 · DEF 20' },
  { gear: { en: 'Sword / Spear', th: 'ดาบ / หอก' }, low: 'STR 10 · AGI 10', mid: 'STR 25 · AGI 25', high: 'STR 40 · AGI 40' },
  { gear: { en: 'Bow / Crossbow', th: 'ธนู / หน้าไม้' }, low: 'DEX 15', mid: 'DEX 40', high: 'DEX 70 · AGI 20' },
  { gear: { en: 'Staff / Tome', th: 'คทา / ตำราเวท' }, low: 'INT 15', mid: 'INT 40', high: 'INT 70 · DEF 10' },
  { gear: { en: 'Heavy armour', th: 'เกราะหนัก' }, low: 'DEF 10', mid: 'DEF 35', high: 'DEF 60 · STR 20' },
]

/** Where each kind of power comes from: the "compartments" of the design. */
export const powerSources: { system: T; gives: T; icon: IconName }[] = [
  { system: { en: 'Level & stats', th: 'เลเวลและสเตตัส' }, gives: { en: 'the right to equip gear', th: 'สิทธิ์ในการสวมใส่อุปกรณ์' }, icon: 'scroll' },
  { system: { en: 'Enhancement', th: 'การตีบวก' }, gives: { en: 'raw power (attack and defence)', th: 'พลังดิบ (โจมตีและป้องกัน)' }, icon: 'gem' },
  { system: { en: 'Weapon Mastery', th: 'ความชำนาญอาวุธ' }, gives: { en: 'skills, faster casting, shorter cooldowns', th: 'สกิล ร่ายเร็วขึ้น คูลดาวน์สั้นลง' }, icon: 'sword' },
  { system: { en: 'Bloodline', th: 'สายเลือด' }, gives: { en: 'how you play', th: 'วิธีที่คุณเล่น' }, icon: 'blood' },
  { system: { en: 'Runes', th: 'รูน' }, gives: { en: 'fine-tuning', th: 'การปรับละเอียด' }, icon: 'rune' },
]
