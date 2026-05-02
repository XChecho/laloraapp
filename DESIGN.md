# La Lora — Design System

> Single source of truth for the visual design language of the La Lora mobile app. All UI components must follow these tokens, patterns, and conventions.

---

## 1. Design Tokens

### 1.1 Color Palette

#### Brand Colors (Tailwind config)

| Token | Hex | Usage |
|---|---|---|
| `lora-bg` | `#F6F7F7` | Screen backgrounds, input backgrounds |
| `lora-primary` | `#0A873A` | Primary actions, active states, accents |
| `lora-dark` | `#173E35` | Dark accents (rarely used) |
| `lora-text` | `#1B2332` | Primary text, headings |
| `lora-text-muted` | `#94A3B8` | Secondary text, labels, placeholders |
| `lora-border` | `#E0E6ED` | Borders, dividers |

#### Semantic Colors

| Purpose | Background | Text | Border |
|---|---|---|---|
| **Success** | `bg-emerald-50` | `text-emerald-600` | `border-emerald-100` |
| **Warning** | `bg-amber-100` | `text-amber-600` | `border-amber-100` |
| **Danger** | `bg-red-50` | `text-red-500` | `border-red-100` |
| **Neutral** | `bg-slate-50` | `text-slate-400` | `border-slate-200` |
| **Info** | `bg-lora-primary/10` | `text-lora-primary` | `border-lora-primary/20` |

#### Overlay Colors

| Usage | Value |
|---|---|
| Modal backdrop (light) | `bg-black/40` |
| Modal backdrop (standard) | `bg-black/50` |
| Bottom sheet backdrop | `bg-black/60` |

### 1.2 Typography

**Font Family**: Inter (5 weights loaded as NativeWind classes).

| Class | Weight | Usage |
|---|---|---|
| `font-InterBold` | 700 | Headings, labels, button text, values |
| `font-InterSemiBold` | 600 | Input text, secondary emphasis |
| `font-InterMedium` | 500 | Body text, descriptions, subtitles |
| `font-InterRegular` | 400 | Long-form text, alert descriptions |
| `font-InterLight` | 300 | Rarely used |
| `font-InterExtraBold` | 800 | Badges, tracking labels, counters |

#### Type Scale

| Size Class | Approx px | Usage |
|---|---|---|
| `text-2xl` | 24px | Screen titles, modal titles, card values |
| `text-xl` | 20px | Section headers, modal titles (secondary) |
| `text-lg` | 18px | Card titles, button text (large) |
| `text-base` | 16px | Button text (standard), body text |
| `text-sm` | 14px | Supporting text, item prices |
| `text-xs` | 12px | Labels (uppercase), badges, tracking |
| `text-[10px]` | 10px | Status badges, counters |

#### Label Convention
- **Uppercase labels**: `uppercase tracking-widest` for section labels and tracking headers.
- **Color**: `text-lora-text-muted` for labels, `text-lora-primary` for brand subtitles.

### 1.3 Border Radius Scale

| Value | Usage |
|---|---|
| `rounded-lg` (8px) | Small interactive elements (qty buttons) |
| `rounded-xl` (12px) | Tags, small cards, icon containers |
| `rounded-2xl` (16px) | Buttons, inputs, small cards, modal action buttons |
| `rounded-[24px]` | Admin summary cards |
| `rounded-[28px]` | **Standard card radius** (reservation cards, order cards) |
| `rounded-[32px]` | **Modal cards** (center modals) |
| `rounded-[40px]` | Bottom sheet top radius, date modal |
| `rounded-full` | Pills, badges, avatar containers, icon circles |

### 1.4 Spacing

| Context | Pattern |
|---|---|
| Screen horizontal padding | `px-6` (24px) |
| Section vertical gap | `mb-4` (16px) between cards |
| Intra-section gap | `mb-6` (24px) between groups |
| Large gap | `mb-8` (32px) before action areas |
| Modal internal padding | `p-8` (32px) for center modals, `p-6` for bottom sheets |
| Input padding | `p-4` (16px) |
| Button vertical padding | `py-3` (small), `py-4` (standard), `py-5` (large) |

### 1.5 Shadows

| Class | Usage |
|---|---|
| `shadow-sm` | Cards, buttons, header elements |
| `shadow-lg` | Primary action buttons, floating bars |
| `shadow-xl` / `shadow-2xl` | Modal cards |
| Colored shadows | `shadow-lora-primary/30`, `shadow-red-500/30`, `shadow-emerald-600/30` |

---

## 2. Layout Patterns

### 2.1 Screen Structure

```
<SafeAreaView className="flex-1 bg-lora-bg" edges={['top', 'left', 'right']}>
  <View style={{ backgroundColor: '#F8FAFC' }}>     ← Header area (lighter bg)
    <ScreenHeader ... />
    <FeatureTabs ... />
  </View>

  <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 120 : 40 }}>
    <View className="px-6 mt-4">
      ← Content here
    </View>
  </ScrollView>

  ← Modals at the bottom
</SafeAreaView>
```

### 2.2 SafeAreaView
- Always use `edges={['top', 'left', 'right']}`.
- Bottom padding handled by ScrollView `contentContainerStyle`.

### 2.3 ScrollView
- `showsVerticalScrollIndicator={false}` always.
- Bottom padding: `Platform.OS === 'ios' ? 120 : 40` to account for floating action bars.

---

## 3. Component Patterns

### 3.1 ScreenHeader

**Location**: `src/components/ui/ScreenHeader.tsx`

```
┌─────────────────────────────────────────────┐
│  Title (text-2xl font-InterBold)     [👤][🔔]│
│  SUBTITLE (text-xs uppercase tracking)      │
└─────────────────────────────────────────────┘
```

**Structure**:
- Background: `bg-lora-bg`
- Padding: `px-6 pt-4 pb-4`
- Title: `text-2xl font-InterBold text-lora-text`
- Subtitle: `text-xs font-InterMedium text-lora-primary uppercase tracking-widest`
- Action buttons: `bg-white w-11 h-11 rounded-2xl items-center justify-center border border-gray-100 shadow-sm active:opacity-70`
- Icon size: 22px, color: `#1B2332`

### 3.2 Cards

**Standard Card** (reservations, orders):
```
<View className="bg-white rounded-[28px] p-5 mb-4 border border-lora-border/20 shadow-sm">
  ← Header row (icon + title + badge)
  ← Content
  ← Action row (buttons)
</View>
```

**Admin Summary Card**:
```
<Pressable className="bg-white rounded-[24px] p-5 mb-4 shadow-sm border border-lora-border/30 active:opacity-70">
  ← Icon container (w-10 h-10 rounded-xl)
  ← Trend indicator
  ← Label (text-lora-text-muted text-[13px])
  ← Value (text-2xl font-InterBold)
</Pressable>
```

### 3.3 Buttons

#### Primary Button
```
<Pressable className="bg-lora-primary py-4 rounded-2xl items-center shadow-sm active:opacity-80">
  <Text className="font-InterBold text-white">Label</Text>
</Pressable>
```
- Add `shadow-lg shadow-lora-primary/30` for emphasis.
- Icon: `Ionicons` 18-20px, color white, `marginRight: 8`.

#### Secondary Button
```
<Pressable className="bg-slate-100 py-4 rounded-2xl items-center active:opacity-70">
  <Text className="font-InterBold text-slate-500">Label</Text>
</Pressable>
```

#### Danger Button
```
<Pressable className="bg-red-500 py-4 rounded-2xl items-center shadow-lg shadow-red-500/30 active:opacity-80">
  <Text className="font-InterBold text-white">Label</Text>
</Pressable>
```

#### Success Button
```
<Pressable className="bg-emerald-600 py-4 rounded-2xl items-center shadow-lg shadow-emerald-600/30">
  <Text className="font-InterBold text-white">Label</Text>
</Pressable>
```

#### Icon Button (square)
```
<Pressable className="w-11 h-11 bg-slate-50 rounded-2xl items-center justify-center border border-lora-border/10">
  <Ionicons name="..." size={18} color="#64748B" />
</Pressable>
```

#### Tertiary / Ghost
- Used in headers: `bg-white w-11 h-11 rounded-2xl border border-gray-100 shadow-sm active:opacity-70`.

### 3.4 Badges / Status Pills

```
<View className="bg-emerald-50 px-3 py-1 rounded-full">
  <Text className="text-[10px] font-InterExtraBold text-emerald-600 uppercase">CONFIRMADA</Text>
</View>
```

| Status | Background | Text |
|---|---|---|
| PENDIENTE | `bg-amber-100` | `text-amber-600` |
| CONFIRMADA | `bg-emerald-50` | `text-emerald-600` |
| EN CURSO | `bg-lora-primary/10` | `text-lora-primary` |
| CANCELADA | `bg-red-50` | `text-red-500` |
| FINALIZADA | `bg-slate-100` | `text-slate-500` |
| Available | `bg-slate-50` | `text-slate-400` |

### 3.5 Inputs

```
<TextInput
  className="bg-lora-bg rounded-2xl p-4 font-InterSemiBold text-lora-text"
  placeholder="Ej. Juan"
/>
```

**With icon prefix**:
```
<View className="flex-row items-center bg-lora-bg rounded-2xl p-4 border border-lora-border/10">
  <Ionicons name="..." size={20} color="#94A3B8" className="mr-3" />
  <TextInput className="flex-1 font-InterMedium text-lora-text" placeholderTextColor="#94A3B8" />
</View>
```

**Search input**:
```
<View className="flex-row items-center bg-lora-bg px-4 py-3 rounded-2xl border border-lora-border/10">
  <Ionicons name="search" size={20} color="#94A3B8" className="mr-3" />
  <TextInput className="flex-1 font-InterMedium text-lora-text" placeholderTextColor="#94A3B8" />
  {hasQuery && <Ionicons name="close-circle" size={18} color="#CBD5E1" />}
</View>
```

### 3.6 Tabs (Segmented Control)

```
<View className="bg-white/80 p-1.5 rounded-2xl flex-row border border-black/8">
  <Pressable className={`flex-1 py-3 rounded-xl items-center ${active ? 'bg-lora-primary' : 'bg-transparent'}`}>
    <Text className={`font-InterBold text-sm ${active ? 'text-white' : 'text-slate-400'}`}>Tab 1</Text>
  </Pressable>
  <Pressable className={`flex-1 py-3 rounded-xl items-center ${active ? 'bg-lora-primary' : 'bg-transparent'}`}>
    <Text className={`font-InterBold text-sm ${active ? 'text-white' : 'text-slate-400'}`}>Tab 2</Text>
  </Pressable>
</View>
```

### 3.7 Tags / Filter Chips

```
<Pressable className={`px-6 py-2.5 rounded-xl border ${active ? 'bg-lora-primary border-lora-primary' : 'bg-white border-lora-border/20'}`}>
  <Text className={`font-InterBold text-xs ${active ? 'text-white' : 'text-slate-500'}`}>Label</Text>
</Pressable>
```

### 3.8 Icon Containers

| Size | Classes | Icon Size | Usage |
|---|---|---|---|
| Small | `w-10 h-10 rounded-xl` | 20px | Card headers, summary cards |
| Medium | `w-11 h-11 rounded-2xl` | 18-22px | Header buttons, action icons |
| Large | `w-16 h-16 rounded-full` | 32-40px | Modal icon headers |

---

## 4. Modal Patterns

### 4.1 Center Modal (Confirmation / Alert)

```
<Modal visible={visible} transparent animationType="fade">
  <Pressable className="flex-1 bg-black/40 justify-center items-center px-6" onPress={onClose}>
    <View className="bg-white rounded-[32px] p-8 w-full shadow-2xl" onStartShouldSetResponder={() => true}>
      ← Icon container (w-16 h-16 rounded-full)
      ← Title (text-xl or text-2xl font-InterBold text-center)
      ← Description (text-sm font-InterMedium text-center)
      ← Action buttons (flex-row gap-3)
    </View>
  </Pressable>
</Modal>
```

### 4.2 Bottom Sheet

```
<Modal visible={visible} transparent animationType="slide">
  <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
    <Pressable className="flex-1 justify-end bg-black/60" onPress={onClose}>
      <View className="bg-white rounded-t-[40px] p-8 pb-10 max-h-[90%]" onStartShouldSetResponder={() => true}>
        ← Handle indicator (w-12 h-1.5 bg-gray-200 rounded-full self-center mb-6)
        ← Title
        ← Content
        ← Action buttons
      </View>
    </Pressable>
  </KeyboardAvoidingView>
</Modal>
```

### 4.3 Full-Screen Bottom Sheet (Menu)

```
<Modal visible={visible} transparent animationType="slide">
  <View className="flex-1 bg-black/60 justify-end">
    <View className="bg-lora-bg h-[90%] rounded-t-[40px] overflow-hidden">
      ← Header (px-6 pt-8 pb-4 bg-white shadow-sm)
      ← Scrollable content
      ← Floating action bar (absolute bottom-10 left-6 right-6)
    </View>
  </View>
</Modal>
```

### 4.4 Modal Action Buttons Layout

**Standard (2 buttons)**:
```
<View className="flex-row gap-3">
  <Pressable className="flex-1 py-4 bg-slate-100 rounded-2xl items-center">
    <Text className="font-InterBold text-slate-500">Cancel</Text>
  </Pressable>
  <Pressable className="flex-1 py-4 bg-lora-primary rounded-2xl items-center shadow-sm">
    <Text className="font-InterBold text-white">Confirm</Text>
  </Pressable>
</View>
```

**Weighted (1:2 ratio)**:
```
<View className="flex-row gap-4">
  <Pressable className="flex-1 py-4 bg-slate-100 rounded-2xl items-center">
    <Text className="font-InterBold text-slate-500">Cancel</Text>
  </Pressable>
  <Pressable className="flex-[2] py-4 bg-lora-primary rounded-2xl items-center shadow-lg">
    <Text className="font-InterBold text-white">Action</Text>
  </Pressable>
</View>
```

### 4.5 Alert Toast (Top)

```
<View className="w-full rounded-2xl p-4 bg-green-800 border border-green-300 border-2">
  <View className="flex-row items-start justify-between">
    ← Icon + title + description
    ← Close button
  </View>
</View>
```
- Auto-dismiss after 5 seconds.
- Positioned below safe area top: `paddingTop: insets.top + 16`.

---

## 5. States & Interactions

### 5.1 Active / Pressed States

| Element | Pattern |
|---|---|
| Icon buttons | `active:opacity-70` |
| Cards, buttons | `active:opacity-80` |
| Menu items | `active:opacity-70` |

### 5.2 Disabled States

| Pattern | Usage |
|---|---|
| `opacity-50` + neutral bg | Disabled buttons |
| `bg-slate-300` | Disabled primary buttons (missing required data) |
| `disabled={true}` prop | React Native disabled |

### 5.3 Empty States

```
<View className="items-center justify-center py-20 bg-white/40 rounded-[40px] border border-dashed border-slate-300">
  <Ionicons name="..." size={48} color="#CBD5E1" className="mb-4" />
  <Text className="text-lg font-InterBold text-slate-400">No hay datos</Text>
  <Text className="text-sm font-InterMedium text-slate-300 mt-1">Presiona "..." para empezar</Text>
</View>
```

### 5.4 Loading States
- Use skeleton or spinner patterns consistent with the app's loading indicators.

---

## 6. Iconography

**Source**: `@expo/vector-icons` (Ionicons family).

| Context | Size | Color |
|---|---|---|
| Input prefix | 18-20px | `#94A3B8` |
| Card header icon | 20px | Context-dependent (brand, semantic) |
| Header action | 22px | `#1B2332` |
| Button icon | 18-20px | Matches button text |
| Modal icon header | 32-40px | Semantic (red for danger, green for success) |
| Empty state | 48px | `#CBD5E1` |
| Badge / counter | 16px | Context-dependent |

---

## 7. Product Cards (Menu Grid)

Used in CanchaMenuModal for product selection.

```
<Pressable className="w-[48%] mb-4 active:opacity-70">
  <View className="bg-white rounded-3xl overflow-hidden border border-lora-border/10 shadow-sm relative">
    ← Optional badge (absolute top-8 right-8)
    <Image source={{ uri }} className="w-full h-32" />
    <View className="p-4">
      <Text className="font-InterBold text-lora-text text-sm" numberOfLines={2}>Name</Text>
      <Text className="font-InterBold text-lora-primary">Price</Text>
    </View>
  </View>
</Pressable>
```

---

## 8. Floating Action Bar

Used at the bottom of full-screen modals (e.g., CanchaMenuModal).

```
<View className="absolute bottom-10 left-6 right-6">
  <Pressable className="bg-[#111A2C] py-5 rounded-[24px] items-center justify-between px-8 flex-row shadow-xl">
    ← Left: Label + Total
    ← Right: CTA with chevron
  </Pressable>
</View>
```

---

## 9. Quantity Controls

```
<View className="flex-row items-center bg-slate-50 rounded-xl p-1 border border-lora-border/10">
  <Pressable className="w-8 h-8 items-center justify-center rounded-lg active:bg-slate-200">
    <Ionicons name="remove" size={18} color={qty > 1 ? primary : "#94A3B8"} />
  </Pressable>
  <Text className="w-8 text-center font-InterExtraBold text-lora-text text-base">{qty}</Text>
  <Pressable className="w-8 h-8 items-center justify-center rounded-lg active:bg-slate-200">
    <Ionicons name="add" size={18} color={primary} />
  </Pressable>
</View>
```

---

## 10. Rules & Conventions

### 10.1 Mandatory
- **ALWAYS** use NativeWind classes for styling.
- **ALWAYS** use `Pressable` (not `TouchableOpacity` or `TouchableWithoutFeedback`).
- **ALWAYS** include `active:` states for interactive elements.
- **ALWAYS** use `numberOfLines` for text that may overflow.
- **ALWAYS** use `KeyboardAvoidingView` in modals with inputs.
- **ALWAYS** use `onStartShouldSetResponder={() => true}` on modal content to prevent backdrop close propagation.

### 10.2 Prohibitions
- ❌ NO inline `style={{}}` for layout (only for dynamic values like `backgroundColor`).
- ❌ NO sharp corners — everything uses rounded borders.
- ❌ NO hard shadows — use `shadow-sm` or colored shadows with opacity.
- ❌ NO `console.log` in UI code.
- ❌ NO `any` types in component props.

### 10.3 Naming Conventions
- **Components**: PascalCase (`ReservationCard`, `CanchaModal`).
- **Files**: PascalCase matching component name.
- **Feature folders**: lowercase (`cancha/`, `admin/`, `modals/`).
- **UI shared components**: `src/components/ui/`.

---

## 11. Responsive Considerations

### Small Screens (< 380px)
```
const { width } = useWindowDimensions();
const isSmallScreen = width < 380;
```

- Reduce padding: `p-3` instead of `px-4 py-2.5`.
- Shorten button text: "Detalles" instead of "Detalles/Agregar".
- Hide non-essential labels.
- Use `adjustsFontSizeToFit` + `numberOfLines={1}` for titles.

---

**Última actualización**: 2026-04-28
