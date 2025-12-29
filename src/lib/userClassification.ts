import type { NormalizedBridgeTransaction } from '@/types';

export type UserClass =
  | 'crosschain-noob'
  | 'working-elf'
  | 'calculated-whale'
  | 'farmer-whale'
  | 'standard-joe';

export interface UserClassInfo {
  class: UserClass;
  title: string;
  description: string;
  image: string;
  rarity: number; // 1-5 dots representing tier/rarity
}

const USER_CLASS_DATA: Record<UserClass, Omit<UserClassInfo, 'class'>> = {
  'crosschain-noob': {
    title: 'The Cross-chain Noob',
    description: "You're new to the game, aren't you? You haven't done much bridging, and your on-chain volume is practically invisible. We have to ask: Are you actually a degen, or just a tourist?",
    image: '/img/crosschain-noob.png',
    rarity: 1,
  },
   'standard-joe': {
    title: 'The Standard Joe',
    description: "You have an average number of bridges with decent volume. You aren't a legend, and you aren't a noob. You're just like the rest of us: aggressively mid.",
    image: '/img/standard-joe.png',
    rarity: 2,
  },
  'working-elf': {
    title: 'The Working Elf',
    description: "You bridge constantly, but your bags are light. You're a tireless laborer in a world of whales—the kind of person who seemingly enjoys the pain of a thousand tiny transactions. A true glutton for punishment.",
    image: '/img/the-working-elf.png',
    rarity: 3,
  },
  'calculated-whale': {
    title: 'The Calculated Whale',
    description: "You have a clear history of moving weight, but only when the time is right. Every bridge you cross is a strategic play, not a random hop. A surgical strategist, eh? We see you.",
    image: '/img/calculated-whale.png',
    rarity: 4,
  },
  'farmer-whale': {
    title: 'The Farmer Whale',
    description: "You move massive volume, and you do it often. You're a rare breed of high-velocity capital, constantly chasing the best yields across every chain. If there's a harvest to be had, you're already there.",
    image: '/img/farmer-whale.png',
    rarity: 5,
  },
};

export function classifyUser(
  transactions: NormalizedBridgeTransaction[],
  totalVolumeUSD: number
): UserClassInfo {
  const txCount = transactions.length;

  // Calculate average transaction volume
  const avgTxVolume = txCount > 0 ? totalVolumeUSD / txCount : 0;

  // Crosschain noob: < 10 txns, each txn volume is < $10,000, and cumulative volume is < $20,000
  if (txCount < 10 && avgTxVolume < 10000 && totalVolumeUSD < 20000) {
    return {
      class: 'crosschain-noob',
      ...USER_CLASS_DATA['crosschain-noob'],
    };
  }

  // Working Elf: > 50 txns, each txn volume is < $10,000, and cumulative volume is < $20,000
  if (txCount > 50 && avgTxVolume < 10000 && totalVolumeUSD < 20000) {
    return {
      class: 'working-elf',
      ...USER_CLASS_DATA['working-elf'],
    };
  }

  // Calculated Whale: < 20 txns, each txn volume is > $10,000, and cumulative volume is > $20,000
  if (txCount < 20 && avgTxVolume > 10000 && totalVolumeUSD > 20000) {
    return {
      class: 'calculated-whale',
      ...USER_CLASS_DATA['calculated-whale'],
    };
  }

  // The Farmer Whale: > 20 txns, each txn volume is > $10,000, and cumulative volume is > $20,000
  if (txCount > 20 && avgTxVolume > 10000 && totalVolumeUSD > 20000) {
    return {
      class: 'farmer-whale',
      ...USER_CLASS_DATA['farmer-whale'],
    };
  }

  // The Standard Joe: > 10 txns, each txn volume is < $10,000, and cumulative volume is < $20,000,
  // or does not fit in the other categories
  return {
    class: 'standard-joe',
    ...USER_CLASS_DATA['standard-joe'],
  };
}
