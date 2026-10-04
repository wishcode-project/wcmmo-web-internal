import type { Dict } from '../../shared/i18n'

/** UI text for the game guide pages. */
export const guideUi: Dict<{
  kicker: string
  title: string
  intro: string
  tabs: { bloodlines: string; skills: string; runes: string; items: string; stats: string }
  draft: string
  bl: {
    of: (name: string) => string
    choose: string
    difficulty: string
    ratings: { difficulty: string; damage: string; defence: string; recovery: string; support: string }
    ratingsNote: string
    playsLike: string
    best: string
    weakness: string
    tree: string
    treeIntro: string
    stage: (n: number) => string
    path: (p: string) => string
    fixed: string
    active: string
    pick: string
    howGet: string
    howGetText: string
  }
  sk: {
    controls: string
    weapons: string
    later: string
    laterNote: string
    family: { melee: string; ranged: string; magic: string }
    resource: { stamina: string; mana: string }
    mastery: (n: number) => string
    tags: { 'guard-break': string; heavy: string; charge: string; ultimate: string }
    remnantTitle: string
    remnantText: string
    general: string
    generalText: string
    orbs: string
    orbsText: string
    usableWith: string
    slotsTitle: string
    slotsText: string
    hotbarTitle: string
    hotbarText: string
    skillSlot: string
    freeSlot: string
    stancesTitle: string
    stancesText: string
    tiersTitle: string
    tiersText: string
    tiers: string[]
  }
  rn: {
    slots: string
    slotsSteps: { label: string; value: string }[]
    all: string
    tiers: string
    firstVersion: string
    caps: string
    capsText: string
    capStat: string
    cap: string
    sharedWith: string
    sources: string
    sourceRows: { tier: string; where: string }[]
    rules: string[]
  }
  it: {
    search: string
    all: string
    count: (n: number) => string
    none: string
    source: string
    rarity: string
    rarityText: string
    rName: string
    lines: string
    roll: string
    element: string
    weight: string
    identify: string
    identifyText: string
    unidentified: string
    identifyBtn: string
    reset: string
    example: string
    pages: [string, string, string]
    nextPage: (n: number) => string
    requires: string
    enhance: string
    enhanceText: string
    stage: string
    success: string
    onFail: string
    neverBreaks: string
  }
  st: {
    sources: string
    sourcesText: string
    attributes: string
    gates: string
    bonus: string
    never: string
    points: string
    pointsRows: { label: string; value: string }[]
    ladder: string
    ladderText: string
    gear: string
    low: string
    mid: string
    high: string
  }
}> = {
  en: {
    kicker: 'Game guide',
    title: 'How WC-MMO plays',
    intro: 'Bloodlines, weapons, skills, runes and stats, straight from our design docs.',
    tabs: { bloodlines: 'Bloodlines', skills: 'Weapons & skills', runes: 'Runes', items: 'Items', stats: 'Stats' },
    draft: 'Early design: names, effects and values will change as we test.',
    bl: {
      of: (n) => `Bloodline of ${n}`,
      choose: 'Bloodlines',
      difficulty: 'Difficulty',
      ratings: { difficulty: 'Difficulty', damage: 'Damage', defence: 'Defence', recovery: 'Recovery', support: 'Party support' },
      ratingsNote: 'Our reading of the early design, not final numbers.',
      playsLike: 'Plays like',
      best: 'Best at',
      weakness: 'Watch out',
      tree: 'Stage tree',
      treeIntro: 'Five stages as you level. Stages 1 and 4 are fixed; at stages 2, 3 and 5 you choose path A (survival) or B (damage). Click a node.',
      stage: (n) => `Stage ${n}`,
      path: (p) => `Path ${p}`,
      fixed: 'Fixed',
      active: 'Active skill',
      pick: 'Select a node to see what it does.',
      howGet: 'How you get one',
      howGetText: 'You never pick a Bloodline from a menu. The Awakening, the tutorial, decides which base Bloodline is in tune with you. New Bloodlines arrive later with the story.',
    },
    sk: {
      controls: 'Controls',
      weapons: 'Weapons',
      later: 'Coming later',
      laterNote: 'Full skill lists for these arrive after the first playable version.',
      family: { melee: 'Melee', ranged: 'Ranged', magic: 'Magic' },
      resource: { stamina: 'Stamina', mana: 'Mana' },
      mastery: (n) => `Mastery ${n}`,
      tags: { 'guard-break': 'Breaks guard', heavy: 'Heavy', charge: 'Charge', ultimate: 'Ultimate' },
      remnantTitle: 'The Remnant gauge',
      remnantText: 'Ultimates have no cooldown. They use the Remnant, a gauge that fills while you fight: hits, skills that land, and blows you take all push it up, and it never drains while you wait. At 100, press Shift + Q. You cannot be knocked around while an ultimate plays out.',
      general: 'General skills',
      generalText: 'Work with any weapon. Learned in the tutorial, from level-ups and from trainers in the cities.',
      orbs: 'Orb skills',
      orbsText: 'Use a Skill Orb, bought from the Orb Merchant or dropped by monsters, to learn an extra skill. About as strong as a mid-tier weapon skill, never stronger than a weapon’s best.',
      usableWith: 'Usable with',
      slotsTitle: 'Your skills, your loadout',
      slotsText: 'Skills belong to you, not to the weapon. Pick ten of the skills you own: set 1 sits on keys 1–5, set 2 swaps in with Shift + right click. A skill that needs another weapon’s moves shows greyed out until you wear that weapon.',
      hotbarTitle: 'The hotbar',
      hotbarText: 'Slots 1–5 always hold your skill icons, never items, so nothing of yours can get lost. Slots 6–9 are yours for potions and food. Weapons aren’t held at all: you wear them.',
      skillSlot: 'skill',
      freeSlot: 'free',
      stancesTitle: 'Weapons you wear',
      stancesText: 'Weapons go in two slots on your equipment screen, a right hand and a left hand, and hang on your back until you tap Shift. What you wear in the two slots decides your stance and its moves. Two-handed weapons need the left hand empty.',
      tiersTitle: 'Tiers and skins',
      tiersText: 'Every weapon comes in three looks as it gets better. A skin swaps the look and nothing else.',
      tiers: ['Wood', 'Iron', 'Master-crafted'],
    },
    rn: {
      slots: 'Rune slots',
      slotsSteps: [
        { label: 'Start', value: '2 slots' },
        { label: 'Level 30', value: '3rd slot' },
        { label: 'Level 50', value: '4th slot' },
      ],
      all: 'All',
      tiers: 'Tier I / II / III',
      firstVersion: 'In the first version',
      caps: 'Shared caps',
      capsText: 'Some bonuses share a limit with other systems, so no single stack can break the game.',
      capStat: 'Bonus',
      cap: 'Cap',
      sharedWith: 'Shared with',
      sources: 'Where runes come from',
      sourceRows: [
        { tier: 'I', where: 'monsters in the low zones' },
        { tier: 'II', where: 'monsters in harder zones, Alchemy' },
        { tier: 'III', where: 'dungeon rewards, high-level Alchemy' },
      ],
      rules: ['Passives only: new mechanics belong to Bloodlines.', 'The same rune can’t be slotted twice.', 'Swap freely whenever you’re out of combat.'],
    },
    it: {
      search: 'Search items…',
      all: 'All',
      count: (n) => `${n} items`,
      none: 'No item matches.',
      source: 'Source',
      rarity: 'Rarity',
      rarityText: 'Gear drops in five rarities. Rarer gear rolls more stat lines, rolls them higher, and is more likely to carry an element.',
      rName: 'Rarity',
      lines: 'Stat lines',
      roll: 'Stat roll',
      element: 'Element chance',
      weight: 'How common',
      identify: 'Identify and inspect',
      identifyText: 'Good gear drops unidentified: you only see what you really got after an Identify Scroll or the Identify NPC. In your inventory, press F over an item to flip its tooltip between pages. Try it on the card.',
      unidentified: 'Unidentified',
      identifyBtn: 'Identify',
      reset: 'Reset',
      example: 'Example only: this item and its numbers are made up to show the tooltip.',
      pages: ['Stats', 'Upgrades', 'Lore'],
      nextPage: (n) => `F ▸ next page (${n}/3)`,
      requires: 'Requires',
      enhance: 'Enhancement',
      enhanceText: 'Enhancement is where raw power comes from. Weapons and armour go +1 to +15, then I to V; accessories go I to V. Each failed try raises your next chance (pity).',
      stage: 'Stage',
      success: 'Success',
      onFail: 'If it fails',
      neverBreaks: 'Items are never destroyed.',
    },
    st: {
      sources: 'Where your power comes from',
      sourcesText: 'Every system has one job, so no single grind makes you unbeatable.',
      attributes: 'The five attributes',
      gates: 'Unlocks',
      bonus: 'Small bonus',
      never: 'Never gives',
      points: 'Stat points',
      pointsRows: [
        { label: 'Per level', value: '2 points' },
        { label: 'Level cap', value: '60' },
        { label: 'Max per attribute', value: '80' },
        { label: 'Respec', value: 'a respec scroll from an NPC or a quest' },
      ],
      ladder: 'What gear asks for',
      ladderText: 'Example requirements by weapon weight. Gear also has a soft level floor per tier.',
      gear: 'Gear',
      low: 'Low tier',
      mid: 'Mid tier',
      high: 'High tier',
    },
  },
  th: {
    kicker: 'คู่มือเกม',
    title: 'WC-MMO เล่นยังไง',
    intro: 'สายเลือด อาวุธ สกิล รูน และสเตตัส ตรงจากเอกสารดีไซน์ของเรา',
    tabs: { bloodlines: 'สายเลือด', skills: 'อาวุธและสกิล', runes: 'รูน', items: 'ไอเทม', stats: 'สเตตัส' },
    draft: 'ดีไซน์ช่วงแรก: ชื่อ ผล และตัวเลขจะเปลี่ยนเมื่อเราได้ทดสอบ',
    bl: {
      of: (n) => `สายเลือดแห่ง ${n}`,
      choose: 'สายเลือด',
      difficulty: 'ความยาก',
      ratings: { difficulty: 'ความยาก', damage: 'ดาเมจ', defence: 'การป้องกัน', recovery: 'การฟื้นฟู', support: 'ช่วยทีม' },
      ratingsNote: 'ประเมินจากดีไซน์ช่วงแรก ไม่ใช่ตัวเลขสุดท้าย',
      playsLike: 'สไตล์',
      best: 'เก่งที่สุดเรื่อง',
      weakness: 'ระวัง',
      tree: 'ต้นไม้ขั้นพลัง',
      treeIntro: 'เติบโต 5 ขั้นตามเลเวล ขั้นที่ 1 และ 4 ตายตัว ส่วนขั้นที่ 2, 3 และ 5 เลือกเส้นทาง A (เอาตัวรอด) หรือ B (ดาเมจ) คลิกที่ช่องเพื่อดูรายละเอียด',
      stage: (n) => `ขั้นที่ ${n}`,
      path: (p) => `เส้นทาง ${p}`,
      fixed: 'ตายตัว',
      active: 'สกิลกดใช้',
      pick: 'เลือกช่องเพื่อดูว่ามันทำอะไร',
      howGet: 'ได้สายเลือดมายังไง',
      howGetText: 'คุณไม่ได้เลือกสายเลือดจากเมนู The Awakening หรือ tutorial จะเป็นผู้ตัดสินว่าสายเลือดพื้นฐานไหนสอดคล้องกับคุณ ส่วนสายเลือดใหม่จะมากับเนื้อเรื่องภายหลัง',
    },
    sk: {
      controls: 'การควบคุม',
      weapons: 'อาวุธ',
      later: 'เร็ว ๆ นี้',
      laterNote: 'รายชื่อสกิลของอาวุธเหล่านี้จะมาหลังเวอร์ชันแรกที่เล่นได้',
      family: { melee: 'ประชิด', ranged: 'ระยะไกล', magic: 'เวทมนตร์' },
      resource: { stamina: 'สแตมินา', mana: 'มานา' },
      mastery: (n) => `ความชำนาญ ${n}`,
      tags: { 'guard-break': 'ทำลายการป้องกัน', heavy: 'หนัก', charge: 'พุ่งชน', ultimate: 'ท่าไม้ตาย' },
      remnantTitle: 'เกจ Remnant',
      remnantText: 'ท่าไม้ตายไม่มีคูลดาวน์ แต่ใช้ Remnant เกจที่เต็มขึ้นระหว่างต่อสู้ ทั้งการโจมตีที่โดน สกิลที่เข้าเป้า และการโดนตี จะเพิ่มเกจขึ้น และเกจไม่ลดลงเองระหว่างรอ พอเต็ม 100 กด Shift + Q ระหว่างใช้ท่าไม้ตายคุณจะไม่ถูกผลักหรือสตัน',
      general: 'สกิลทั่วไป',
      generalText: 'ใช้ได้กับทุกอาวุธ เรียนได้จาก tutorial การเลเวลอัป และครูฝึกในเมือง',
      orbs: 'สกิลจาก Orb',
      orbsText: 'ใช้ Skill Orb ที่ซื้อจาก Orb Merchant หรือดรอปจากมอนสเตอร์ เพื่อเรียนสกิลเพิ่ม ความแรงประมาณสกิลอาวุธระดับกลาง และไม่มีทางแรงกว่าสกิลที่ดีที่สุดของอาวุธ',
      usableWith: 'ใช้ได้กับ',
      slotsTitle: 'สกิลของคุณ จัดชุดเองได้',
      slotsText: 'สกิลเป็นของคุณ ไม่ได้ผูกกับอาวุธ เลือกสกิลที่มีได้ 10 ตัว ชุดที่ 1 อยู่ที่ปุ่ม 1–5 ชุดที่ 2 สลับเข้ามาด้วย Shift + คลิกขวา สกิลที่ต้องใช้ท่าของอาวุธอื่นจะเป็นสีเทาจนกว่าคุณจะสวมอาวุธนั้น',
      hotbarTitle: 'Hotbar',
      hotbarText: 'ช่อง 1–5 เป็นไอคอนสกิลเสมอ ไม่ใช่ไอเทม ของของคุณจึงไม่มีทางหาย ช่อง 6–9 ใช้ใส่ยาและอาหารได้ตามใจ ส่วนอาวุธไม่ต้องถือ เพราะคุณสวมมันไว้',
      skillSlot: 'สกิล',
      freeSlot: 'ว่าง',
      stancesTitle: 'อาวุธที่สวมใส่',
      stancesText: 'อาวุธใส่ไว้ในสองช่องบนหน้าจออุปกรณ์ คือมือขวาและมือซ้าย และสะพายอยู่บนหลังจนกว่าคุณจะแตะ Shift อาวุธที่สวมในสองช่องนี้กำหนดท่าทางการต่อสู้และท่าที่ใช้ได้ อาวุธสองมือต้องเว้นมือซ้ายให้ว่าง',
      tiersTitle: 'ระดับและสกิน',
      tiersText: 'อาวุธทุกชิ้นมี 3 หน้าตาตามความดีขึ้นของมัน สกินเปลี่ยนแค่หน้าตา ไม่เปลี่ยนอย่างอื่น',
      tiers: ['ไม้', 'เหล็ก', 'ช่างฝีมือ'],
    },
    rn: {
      slots: 'ช่องรูน',
      slotsSteps: [
        { label: 'เริ่มต้น', value: '2 ช่อง' },
        { label: 'เลเวล 30', value: 'ช่องที่ 3' },
        { label: 'เลเวล 50', value: 'ช่องที่ 4' },
      ],
      all: 'ทั้งหมด',
      tiers: 'ระดับ I / II / III',
      firstVersion: 'มีในเวอร์ชันแรก',
      caps: 'เพดานร่วม',
      capsText: 'โบนัสบางอย่างใช้เพดานร่วมกับระบบอื่น จึงไม่มีการซ้อนโบนัสแบบไหนที่ทำให้เกมพัง',
      capStat: 'โบนัส',
      cap: 'เพดาน',
      sharedWith: 'ใช้ร่วมกับ',
      sources: 'รูนได้มาจากไหน',
      sourceRows: [
        { tier: 'I', where: 'มอนสเตอร์ในโซนต่ำ' },
        { tier: 'II', where: 'มอนสเตอร์ในโซนที่ยากขึ้น, การปรุงยา' },
        { tier: 'III', where: 'รางวัลดันเจียน, การปรุงยาระดับสูง' },
      ],
      rules: ['เป็นพาสซีฟเท่านั้น กลไกใหม่เป็นของสายเลือด', 'ใส่รูนเดียวกันซ้ำสองช่องไม่ได้', 'เปลี่ยนได้อิสระเมื่อไม่ได้อยู่ในการต่อสู้'],
    },
    it: {
      search: 'ค้นหาไอเทม…',
      all: 'ทั้งหมด',
      count: (n) => `${n} ไอเทม`,
      none: 'ไม่มีไอเทมที่ตรงกัน',
      source: 'ได้จาก',
      rarity: 'ความหายาก',
      rarityText: 'อุปกรณ์ดรอปมาใน 5 ระดับความหายาก ยิ่งหายาก ยิ่งได้บรรทัดสเตตัสมากขึ้น สุ่มได้ค่าสูงขึ้น และมีโอกาสได้ธาตุมากขึ้น',
      rName: 'ความหายาก',
      lines: 'บรรทัดสเตตัส',
      roll: 'ช่วงสุ่มค่า',
      element: 'โอกาสได้ธาตุ',
      weight: 'ความถี่',
      identify: 'ประเมินค่าและดูรายละเอียด',
      identifyText: 'อุปกรณ์ดี ๆ จะดรอปมาแบบยังไม่ระบุค่า คุณจะรู้ว่าได้อะไรจริง ๆ ก็ต่อเมื่อใช้ม้วนประเมินค่าหรือให้ NPC ประเมินให้ และในช่องเก็บของ กด F ที่ไอเทมเพื่อพลิกหน้าคำอธิบาย ลองกดบนการ์ดนี้ดูได้',
      unidentified: 'ยังไม่ระบุค่า',
      identifyBtn: 'ประเมินค่า',
      reset: 'เริ่มใหม่',
      example: 'ตัวอย่างเท่านั้น: ไอเทมนี้และตัวเลขเป็นของสมมติ เพื่อให้เห็นหน้าตาคำอธิบาย',
      pages: ['สเตตัส', 'การอัปเกรด', 'เรื่องราว'],
      nextPage: (n) => `F ▸ หน้าถัดไป (${n}/3)`,
      requires: 'ต้องการ',
      enhance: 'การตีบวก',
      enhanceText: 'การตีบวกคือแหล่งพลังดิบ อาวุธและเกราะตีได้ +1 ถึง +15 แล้วต่อด้วย I ถึง V ส่วนเครื่องประดับตีได้ I ถึง V ทุกครั้งที่ล้มเหลว โอกาสสำเร็จครั้งถัดไปจะสูงขึ้น (pity)',
      stage: 'ขั้น',
      success: 'โอกาสสำเร็จ',
      onFail: 'ถ้าล้มเหลว',
      neverBreaks: 'ไอเทมไม่มีวันแตกหรือหายไป',
    },
    st: {
      sources: 'พลังของคุณมาจากไหน',
      sourcesText: 'ทุกระบบมีหน้าที่ของตัวเอง จึงไม่มีการฟาร์มอย่างเดียวที่ทำให้คุณเก่งเกินใคร',
      attributes: 'ค่าสเตตัสทั้ง 5',
      gates: 'ปลดล็อก',
      bonus: 'โบนัสเล็กน้อย',
      never: 'ไม่มีทางให้',
      points: 'แต้มสเตตัส',
      pointsRows: [
        { label: 'ต่อเลเวล', value: '2 แต้ม' },
        { label: 'เลเวลสูงสุด', value: '60' },
        { label: 'สูงสุดต่อค่าสเตตัส', value: '80' },
        { label: 'รีเซ็ตแต้ม', value: 'ใช้ม้วนรีเซ็ตจาก NPC หรือรางวัลเควสต์' },
      ],
      ladder: 'อุปกรณ์ต้องการอะไร',
      ladderText: 'ตัวอย่างค่าที่ต้องมีตามน้ำหนักอาวุธ และอุปกรณ์แต่ละระดับยังมีเลเวลขั้นต่ำแบบผ่อนปรนด้วย',
      gear: 'อุปกรณ์',
      low: 'ระดับต่ำ',
      mid: 'ระดับกลาง',
      high: 'ระดับสูง',
    },
  },
}
