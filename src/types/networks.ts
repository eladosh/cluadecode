// Supported ad networks from @smoud/playable-scripts
export type AdNetwork =
  | 'preview'
  | 'applovin'
  | 'unity'
  | 'google'
  | 'ironsource'
  | 'facebook'
  | 'moloco'
  | 'adcolony'
  | 'mintegral'
  | 'vungle'
  | 'tapjoy'
  | 'snapchat'
  | 'tiktok'
  | 'appreciate'
  | 'chartboost'
  | 'pangle'
  | 'mytarget'
  | 'liftoff'
  | 'smadex'
  | 'adikteev'
  | 'bigabid'
  | 'inmobiadcolony';

export type AdProtocol = 'none' | 'mraid' | 'dapi';

export interface NetworkConfig {
  id: AdNetwork;
  name: string;
  description: string;
  defaultProtocol: AdProtocol;
  supportsZip: boolean;
  icon?: string;
  category: 'major' | 'standard' | 'other';
}

export interface BuildConfig {
  network: AdNetwork;
  protocol?: AdProtocol;
  version?: string;
  app?: string;
  name?: string;
  googlePlayUrl?: string;
  appStoreUrl?: string;
  language?: string;
  createZip?: boolean;
}

export const AD_NETWORKS: NetworkConfig[] = [
  {
    id: 'preview',
    name: 'Preview/Test',
    description: 'Local preview without network-specific optimizations',
    defaultProtocol: 'none',
    supportsZip: false,
    category: 'major'
  },
  {
    id: 'google',
    name: 'Google Ads',
    description: 'Google Ads (AdMob, Google Ad Manager)',
    defaultProtocol: 'none',
    supportsZip: true,
    category: 'major'
  },
  {
    id: 'facebook',
    name: 'Meta (Facebook)',
    description: 'Facebook Audience Network',
    defaultProtocol: 'none',
    supportsZip: true,
    category: 'major'
  },
  {
    id: 'unity',
    name: 'Unity Ads',
    description: 'Unity Ads Network',
    defaultProtocol: 'mraid',
    supportsZip: true,
    category: 'major'
  },
  {
    id: 'applovin',
    name: 'AppLovin',
    description: 'AppLovin MAX',
    defaultProtocol: 'mraid',
    supportsZip: true,
    category: 'major'
  },
  {
    id: 'ironsource',
    name: 'ironSource',
    description: 'ironSource (Unity LevelPlay)',
    defaultProtocol: 'mraid',
    supportsZip: true,
    category: 'major'
  },
  {
    id: 'vungle',
    name: 'Vungle',
    description: 'Vungle (Liftoff)',
    defaultProtocol: 'mraid',
    supportsZip: true,
    category: 'standard'
  },
  {
    id: 'mintegral',
    name: 'Mintegral',
    description: 'Mintegral (Mobvista)',
    defaultProtocol: 'mraid',
    supportsZip: true,
    category: 'standard'
  },
  {
    id: 'moloco',
    name: 'Moloco',
    description: 'Moloco Ads',
    defaultProtocol: 'mraid',
    supportsZip: true,
    category: 'standard'
  },
  {
    id: 'chartboost',
    name: 'Chartboost',
    description: 'Chartboost',
    defaultProtocol: 'mraid',
    supportsZip: true,
    category: 'standard'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    description: 'TikTok For Business',
    defaultProtocol: 'none',
    supportsZip: true,
    category: 'standard'
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    description: 'Snapchat Ads',
    defaultProtocol: 'none',
    supportsZip: true,
    category: 'standard'
  },
  {
    id: 'pangle',
    name: 'Pangle',
    description: 'Pangle (ByteDance)',
    defaultProtocol: 'none',
    supportsZip: true,
    category: 'other'
  },
  {
    id: 'tapjoy',
    name: 'Tapjoy',
    description: 'Tapjoy',
    defaultProtocol: 'mraid',
    supportsZip: true,
    category: 'other'
  },
  {
    id: 'adcolony',
    name: 'AdColony',
    description: 'AdColony (Digital Turbine)',
    defaultProtocol: 'mraid',
    supportsZip: true,
    category: 'other'
  }
];
