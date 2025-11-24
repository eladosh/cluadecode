# 🎮 Playable Ad Builder

A powerful visual builder specifically designed for creating playable ad game mechanics and layouts. Design interactive game experiences with an intuitive drag-and-drop interface, professional animations, and export them as **network-optimized playable ads** for 15+ major ad platforms.

## ✨ Key Features

### 🌐 Multi-Network Export (NEW!)
**Build for 15+ Ad Networks with One Click!**

Powered by [@smoud/playable-scripts](https://github.com/smoudjs/playable-scripts), export optimized playable ads for:

**Major Networks:**
- Google Ads (AdMob, Google Ad Manager)
- Meta (Facebook Audience Network)
- Unity Ads
- AppLovin MAX
- ironSource (Unity LevelPlay)

**Standard Networks:**
- Vungle, Mintegral, Moloco, Chartboost
- TikTok For Business, Snapchat Ads

**More Networks:**
- Pangle, Tapjoy, AdColony, and more!

**Features:**
- ✅ Automatic network-specific optimizations
- ✅ MRAID/DAPI protocol injection
- ✅ File size optimization & minification
- ✅ ZIP archive generation
- ✅ Build metadata & configuration

### 📱 Pre-Built Templates
- **5 Professional Templates** for common ad mechanics
- Tap to Collect, Avoid & Reach, Puzzle Match, Endless Runner, Blank Mobile
- One-click loading with full customization

### 🎨 Visual Design Tools
- Drag-and-drop interface
- Real-time canvas editing with zoom/pan
- **Snap-to-grid** for perfect alignment
- Multiple element types (buttons, CTA, targets, obstacles, shapes, text, images)
- Layer ordering system

### 🎬 Professional Animations
- 6 CSS animations: Bounce, Pulse, Shake, Float, Spin, Glow
- Per-element configuration
- Adjustable duration (0.5-10 seconds)

### 🔗 CTA Integration
- Dedicated CTA button element
- App Store/Play Store URL linking
- Pre-configured glow animation
- Touch-optimized

### 📱 Mobile-First Design
- Mobile device preview frame
- Common ad size presets
- Touch-optimized export

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## 📖 Usage Guide

### Building for Ad Networks

1. **Design Your Ad** - Use templates or create from scratch
2. **Add Elements** - Drag and drop game elements
3. **Add Animations** - Make it engaging!
4. **Configure CTA** - Set your app store URL in Canvas Settings
5. **Click "Build for Networks"** - Purple button (bottom-left)
6. **Select Network** - Choose your target ad platform
7. **Build & Download** - Get optimized ZIP file

### Supported Build Configurations

Each network build includes:
- Network-specific HTML optimizations
- Protocol injection (MRAID/DAPI if needed)
- Automatic minification
- Metadata files
- ZIP packaging (when supported)

### Network-Specific Notes

**Google Ads:**
- Supports ZIP export
- No protocol needed
- Auto-adds ad.size meta tag

**Facebook/Meta:**
- Supports ZIP export
- Includes fbapp-config.json
- og:type meta tag added

**Unity Ads / AppLovin / ironSource:**
- MRAID protocol injected
- ZIP export supported
- Network-specific meta tags

**TikTok / Snapchat:**
- Direct HTML export
- No protocol needed
- Platform-specific optimizations

## 📦 Export Options

### 1. Standard HTML Export
Click the green HTML button in toolbar for standalone playable HTML.

### 2. Network-Specific Build
Click "Build for Networks" for optimized, network-ready packages:
- Minified & optimized HTML
- Network-specific adaptations
- Protocol injection (MRAID/DAPI)
- ZIP archive with metadata
- File size warnings

## 🛠️ Technology Stack

- React 18 + TypeScript
- Vite + Tailwind CSS
- Zustand (state management)
- [@smoud/playable-scripts](https://github.com/smoudjs/playable-scripts) - Network builds
- JSZip - Archive generation
- Lucide Icons

## 💡 Pro Tips

### For Network Builds

1. **Keep File Size Low** - Most networks limit to 2-5MB
   - Monitor size warnings
   - Optimize images before importing
   - Use solid colors when possible

2. **Test Multiple Networks** - Build for your target platforms
   - Each network has specific requirements
   - Test in preview mode first
   - Download network-specific builds

3. **Set Store URLs** - Configure in Canvas Settings
   - Used for CTA buttons
   - Included in network builds
   - Required for some platforms

4. **Use Correct Canvas Size**
   - 800x600 - Standard desktop
   - 320x480 - Mobile portrait
   - 640x960 - Large mobile
   - 750x1334 - iPhone standard

5. **MRAID Support** - Auto-injected for:
   - Unity Ads
   - AppLovin
   - ironSource
   - Vungle
   - Most standard networks

## 📋 Supported Networks Reference

| Network | Protocol | ZIP | Category |
|---------|----------|-----|----------|
| Google Ads | none | ✅ | Major |
| Facebook | none | ✅ | Major |
| Unity Ads | MRAID | ✅ | Major |
| AppLovin | MRAID | ✅ | Major |
| ironSource | MRAID | ✅ | Major |
| Vungle | MRAID | ✅ | Standard |
| Mintegral | MRAID | ✅ | Standard |
| Moloco | MRAID | ✅ | Standard |
| Chartboost | MRAID | ✅ | Standard |
| TikTok | none | ✅ | Standard |
| Snapchat | none | ✅ | Standard |
| Pangle | none | ✅ | Other |
| Tapjoy | MRAID | ✅ | Other |
| AdColony | MRAID | ✅ | Other |
| Preview | none | ❌ | Test |

## 🔧 File Structure

```
playable-ad-builder/
├── src/
│   ├── components/
│   │   ├── Canvas.tsx           # Main workspace
│   │   ├── Toolbar.tsx          # Tools & controls
│   │   ├── NetworkSelector.tsx  # Network build UI ⭐
│   │   ├── TemplatesPanel.tsx   # Template browser
│   │   └── ...
│   ├── types/
│   │   └── networks.ts          # Network configurations ⭐
│   ├── utils/
│   │   ├── export.ts            # HTML generation
│   │   └── networkBuilder.ts    # Network-specific builds ⭐
│   └── data/
│       └── templates.ts         # Pre-built templates
└── package.json                  # Includes @smoud/playable-scripts
```

## 🎯 Perfect for Playable Ads

This builder is production-ready with everything you need:
- ✅ Multi-network export (15+ platforms)
- ✅ Network-specific optimizations
- ✅ MRAID/DAPI support
- ✅ File size monitoring
- ✅ Professional templates
- ✅ Animation system
- ✅ CTA integration
- ✅ Mobile-optimized

## 📚 Resources

- **smoudjs/playable-scripts:** [GitHub](https://github.com/smoudjs/playable-scripts) | [npm](https://www.npmjs.com/package/@smoud/playable-scripts)
- **smoudjs/playable-sdk:** [GitHub](https://github.com/smoudjs/playable-sdk) | [npm](https://www.npmjs.com/package/@smoud/playable-sdk)
- **MRAID Specification:** [IAB Tech Lab](https://www.iab.com/guidelines/mraid/)

## 📄 License

MIT License - Free for commercial and personal use!

---

**Built for game marketers and playable ad creators** 🎯

Create professional, network-ready playable ads in minutes!
