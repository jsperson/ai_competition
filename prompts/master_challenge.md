# AI PROMPT CHAMPIONSHIP - UNIVERSAL MVP BUILDER

## CONTEXT
You are building a working MVP demo for The Architect track competition. You have **2.5 hours**. The demo must be publicly accessible and fully functional. Judges evaluate: working demo quality, visual polish, feature completeness, technical depth, and speed of execution.

## CONTEXT7 INTEGRATION
This project has **Context7 MCP** configured for real-time documentation access.

**When to use Context7:**
- ✅ **Domain-specific customizations** - "Show me a ride-sharing checkout flow with shadcn/ui"
- ✅ **Beyond the 8 patterns** - Need something not in pre-built patterns
- ✅ **Troubleshooting** - Debug errors or API issues
- ✅ **Latest features** - Check if new components/APIs are available

**When to use Pre-built Patterns (FASTER):**
- ⚡ **Standard layouts** - Navigation, Hero, Cards, Forms, Modals
- ⚡ **Proven speed** - Copy-paste patterns save 5-10 minutes each
- ⚡ **Time pressure** - Under 60 minutes left, stick to patterns

**Strategy:** Start with patterns, use Context7 for challenge-specific features.

## CRITICAL RULES
1. **Deploy first, deploy often** - Get a live URL within 15 minutes
2. **Production over perfection** - Working demo on live URL beats perfect localhost
3. **Visual polish matters** - Make it look professional (judges see UI first)
4. **Use shadcn/ui** - Pre-built professional components save 20-30 minutes
5. **Mock data + localStorage** - Fast, reliable, demo-ready
6. **Test on live URL** - If it doesn't work on Vercel, it doesn't count

## TECH STACK
- **Framework**: React 18
- **Build Tool**: Vite
- **UI Components**: shadcn/ui (Radix UI + Tailwind)
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Icons**: Lucide React (included with shadcn)
- **State**: React hooks + localStorage
- **Deployment**: Vercel

---

## PHASE 1: RAPID SETUP & DEPLOY (0-15 minutes)

### **Complete Setup Script:**

```bash
# Create Vite project
npm create vite@latest [project-name] -- --template react
cd [project-name]

# Install base dependencies
npm install

# Install Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install shadcn/ui dependencies
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-slot
npm install -D tailwindcss-animate

# Initialize shadcn/ui (ACCEPT ALL DEFAULTS - 30 seconds)
npx shadcn-ui@latest init
# When prompted, press Enter 3 times to accept defaults:
#   ✓ Style: Default (professional, proven)
#   ✓ Base color: Slate (neutral, versatile)
#   ✓ CSS variables: Yes (flexibility)
# Do NOT spend time customizing - defaults are production-quality

# Add essential components (30 seconds total)
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add separator

# Install routing
npm install react-router-dom
```

### **Configuration Files:**

**vite.config.js:**
```javascript
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

**vercel.json:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

> **⚡ COMPETITION TIP:** shadcn defaults (Default style + Slate color) are used by production apps like Vercel and Linear. They look professional immediately. Don't waste time customizing unless the challenge explicitly requires specific brand colors.

### **Test Deployment:**

**src/App.jsx:**
```jsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-center text-3xl">
            ✓ Deployment Working
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            shadcn/ui components loaded successfully
          </p>
          <Button className="w-full" size="lg">
            Building app now...
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
```

```bash
git init
git add .
git commit -m "Initial deployment test with shadcn/ui"
git push -u origin main

# Deploy to Vercel (vercel.com/new)
# Import repo, click Deploy
# Verify live URL loads within 15 minutes
```

**🎯 Checkpoint: Live URL showing shadcn components = SUCCESS**

---

## PHASE 2: PROJECT STRUCTURE (15-30 minutes)

### **Create Utilities:**

**src/lib/utils.js:** (shadcn creates this automatically)
```javascript
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
```

**src/utils/storage.js:**
```javascript
// Universal localStorage wrapper for any domain
export const storage = {
  // Generic save/get for any data type
  save: (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  },
  
  get: (key, defaultValue = null) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  },
  
  remove: (key) => {
    localStorage.removeItem(key);
  },
  
  clear: () => {
    localStorage.clear();
  },
  
  // Common patterns for typical app needs:
  
  // Cart/collection management
  saveCollection: (name, items) => {
    localStorage.setItem(name, JSON.stringify(items));
  },
  
  getCollection: (name) => {
    return JSON.parse(localStorage.getItem(name) || '[]');
  },
  
  // User session
  saveUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  getUser: () => {
    return JSON.parse(localStorage.getItem('user') || 'null');
  },
  
  // Current workflow state
  saveCurrentItem: (name, item) => {
    localStorage.setItem(`current_${name}`, JSON.stringify(item));
  },
  
  getCurrentItem: (name) => {
    return JSON.parse(localStorage.getItem(`current_${name}`) || 'null');
  }
};
```

### **Create Custom Hook Template:**

**src/hooks/useCollection.jsx:**
```jsx
import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';

// Generic hook for managing collections (cart, favorites, selections, etc.)
export default function useCollection(collectionName) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(storage.getCollection(collectionName));
  }, [collectionName]);

  const addItem = (item) => {
    const existingItem = items.find(i => i.id === item.id);
    const newItems = existingItem
      ? items.map(i => i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i)
      : [...items, { ...item, quantity: 1 }];
    
    setItems(newItems);
    storage.saveCollection(collectionName, newItems);
  };

  const removeItem = (itemId) => {
    const newItems = items.filter(i => i.id !== itemId);
    setItems(newItems);
    storage.saveCollection(collectionName, newItems);
  };

  const updateItem = (itemId, updates) => {
    const newItems = items.map(i => i.id === itemId ? { ...i, ...updates } : i);
    setItems(newItems);
    storage.saveCollection(collectionName, newItems);
  };

  const clearItems = () => {
    setItems([]);
    storage.remove(collectionName);
  };

  return {
    items,
    addItem,
    removeItem,
    updateItem,
    clearItems,
    itemCount: items.length
  };
}
```

### **Set Up Routing Structure:**

**src/App.jsx:**
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
// Import other pages as you create them

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Add routes as you build pages */}
      </Routes>
    </BrowserRouter>
  );
}
```

### **Create Mock Data Structure:**

**src/data/mockData.json:**
```javascript
// Structure your data based on the challenge
// Common patterns:

// List of items (products, properties, events, tasks, etc.)
{
  "items": [
    {
      "id": 1,
      "title": "Item Name",
      "description": "Description",
      "category": "Category",
      "status": "active",
      "image": "https://images.unsplash.com/photo-[id]?w=400",
      "metadata": {
        // Domain-specific fields
      }
    }
  ],
  
  // Users or profiles
  "users": [
    {
      "id": 1,
      "name": "User Name",
      "role": "admin",
      "avatar": "https://images.unsplash.com/photo-[id]?w=100"
    }
  ],
  
  // Workflow states or statuses
  "statuses": [
    { "key": "pending", "label": "Pending", "color": "yellow" },
    { "key": "active", "label": "Active", "color": "blue" },
    { "key": "complete", "label": "Complete", "color": "green" }
  ]
}
```

**Pro tip:** Use Unsplash URLs for images: `https://images.unsplash.com/photo-[random]?w=400`

```bash
git add .
git commit -m "feat: project structure and utilities"
git push
# Deploy #2 - verify routing works
```

---

## PHASE 3: SHADCN COMPONENT PATTERNS (Reference Guide)

### **Pattern Library - Copy these patterns as needed:**

#### **Pattern 1: Navigation Header**
```jsx
import { Button } from "@/components/ui/button"

export default function Navigation() {
  return (
    <nav className="bg-card shadow-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">App Name</h1>
        <div className="flex gap-4">
          <Button variant="ghost">Menu Item</Button>
          <Button>Primary Action</Button>
        </div>
      </div>
    </nav>
  );
}
```

#### **Pattern 2: Hero/Landing Section**
```jsx
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Hero() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="container mx-auto px-4 pt-20 pb-32 text-center text-white">
        <h1 className="text-6xl font-bold mb-6">Your Main Headline</h1>
        <p className="text-2xl mb-8 text-white/90">Compelling subheadline</p>
        <Button size="lg" className="bg-white text-purple-600">
          Call to Action
        </Button>
      </div>
      
      {/* Feature Cards */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2">Feature Title</h3>
              <p className="text-muted-foreground">Feature description</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
```

#### **Pattern 3: Search & Filter Interface**
```jsx
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SearchFilter({ data, onFilter }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...new Set(data.map(item => item.category))];
  
  const filteredData = data.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 h-14 text-lg"
        />
      </div>

      {/* Category Filters */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>
    </div>
  );
}
```

#### **Pattern 4: Card Grid/List**
```jsx
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function ItemGrid({ items }) {
  const navigate = useNavigate();

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map(item => (
        <Card
          key={item.id}
          className="cursor-pointer hover:shadow-xl transition-shadow"
          onClick={() => navigate(`/item/${item.id}`)}
        >
          <CardHeader className="p-0">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold">{item.title}</h3>
              <Badge variant="secondary">{item.status}</Badge>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              {item.description}
            </p>
            <Button className="w-full">View Details</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

#### **Pattern 5: Detail View**
```jsx
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function DetailView({ data }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = data.find(d => d.id === parseInt(id));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm sticky top-0 z-50 border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2" size={20} />
            Back
          </Button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative">
        <img src={item.image} alt={item.title} className="w-full h-64 object-cover" />
      </div>

      {/* Details */}
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl">{item.title}</CardTitle>
              <Badge variant="secondary">{item.status}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">{item.description}</p>
            <Separator className="my-6" />
            
            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button size="lg">Primary Action</Button>
              <Button variant="outline" size="lg">Secondary Action</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

#### **Pattern 6: Form/Input Page**
```jsx
import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export default function FormPage() {
  const [formData, setFormData] = useState({});

  const handleSubmit = () => {
    // Save to localStorage or process
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Form Title</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Section Title</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input 
                  placeholder="Field 1"
                  onChange={(e) => setFormData({...formData, field1: e.target.value})}
                />
                <Input 
                  placeholder="Field 2"
                  onChange={(e) => setFormData({...formData, field2: e.target.value})}
                />
                <Input 
                  placeholder="Field 3"
                  onChange={(e) => setFormData({...formData, field3: e.target.value})}
                />
              </CardContent>
            </Card>
          </div>

          {/* Summary/Preview */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Label</span>
                    <span className="font-semibold">Value</span>
                  </div>
                  <Separator />
                </div>
                
                <Button onClick={handleSubmit} className="w-full" size="lg">
                  Submit
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
```

#### **Pattern 7: Status/Progress Tracking**
```jsx
import { CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function StatusTracker({ currentStatus, statusSteps }) {
  const currentStepIndex = statusSteps.findIndex(s => s.key === currentStatus);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {statusSteps.map((step, index) => {
          const isComplete = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div key={step.key} className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                isComplete 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {step.icon}
              </div>
              <div className="flex-1">
                <p className={`font-semibold ${isCurrent ? 'text-primary' : ''}`}>
                  {step.label}
                </p>
                {isCurrent && (
                  <p className="text-sm text-muted-foreground">In progress...</p>
                )}
              </div>
              {isComplete && <CheckCircle className="text-primary" size={24} />}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
```

#### **Pattern 8: Dialog/Modal**
```jsx
import { useState } from 'react';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"

export default function ConfirmDialog({ onConfirm }) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogDescription>
            Are you sure you want to proceed with this action?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {/* Dialog content */}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

## PHASE 3B: BUILD YOUR CHALLENGE (30-110 minutes)

### **📋 PASTE YOUR ACTUAL CHALLENGE HERE:**

```
???[COMPETITION CHALLENGE GOES HERE]???
```

---

### **Implementation Strategy:**

**Step 1: Analyze the Challenge (5 min)**
Read the challenge carefully and identify:
- [ ] What is the core user need?
- [ ] What pages are required?
- [ ] What data entities exist?
- [ ] What is the main user flow?
- [ ] What are the "must-have" vs "nice-to-have" features?

**Step 2: Design Data Structure (5 min)**
Based on the challenge, create your mock data:
```javascript
// In src/data/mockData.json
{
  "mainEntities": [
    {
      "id": 1,
      "title": "...",
      "description": "...",
      "status": "...",
      "image": "https://images.unsplash.com/photo-...?w=400",
      // Add fields specific to your domain
    }
  ],
  "supportingData": [
    // Categories, users, statuses, etc.
  ]
}
```

**Step 3: Map Pages to Patterns (5 min)**
For each required page, choose a pattern:
- Landing/Home → Pattern 1 + 2 (Navigation + Hero)
- Browse/List → Pattern 3 + 4 (Search + Grid)
- Detail View → Pattern 5
- Form/Checkout → Pattern 6
- Status/Tracking → Pattern 7

**Step 4: Build Pages (60-80 min)**

Build in this order (most visible first):
1. **Landing page** (10 min)
   - Use Pattern 1 + 2
   - Make it visually impressive
   - Clear call-to-action

2. **Main browse/list page** (20 min)
   - Use Pattern 3 + 4
   - Implement search/filter
   - Connect to mock data
   - Make cards clickable

3. **Detail page** (15 min)
   - Use Pattern 5
   - Show full item details
   - Add action buttons
   - Connect to useCollection hook if needed

4. **Form/Input page** (20 min)
   - Use Pattern 6
   - Collect necessary data
   - Validate inputs
   - Save to localStorage

5. **Status/Result page** (15 min)
   - Use Pattern 7
   - Show outcome/progress
   - Provide next actions

**Deploy after each major page:**
```bash
git add .
git commit -m "feat: [page name] complete"
git push
# Test on live URL
```

**Step 5: Implement Challenge-Specific Feature (15 min)**

If the challenge has a special requirement (like "surge pricing" or "real-time notifications"):
- Make it visually prominent
- Use a Card with distinctive styling
- Add a toggle or demo button
- Document it clearly in your README

**💡 Context7 Tip:** For domain-specific features, ask: "use context7 - Show me how to implement [specific feature] with React and shadcn/ui" to get tailored examples beyond the standard patterns.

Example:
```jsx
<Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
  <div className="flex items-center justify-between">
    <div>
      <h3 className="text-lg font-bold">Special Feature Name</h3>
      <p className="text-sm text-muted-foreground">
        Description of what it does
      </p>
    </div>
    <Button
      variant={featureActive ? "default" : "outline"}
      onClick={() => setFeatureActive(!featureActive)}
    >
      {featureActive ? 'Active' : 'Activate'}
    </Button>
  </div>
</Card>
```

---

## PHASE 4: POLISH & TESTING (110-135 minutes)

### **Visual Polish Checklist:**

- [ ] **Loading states**: Add skeleton screens or spinners
```jsx
{loading ? (
  <div className="animate-pulse space-y-4">
    <div className="h-48 bg-muted rounded-lg"></div>
    <div className="h-4 bg-muted rounded w-3/4"></div>
  </div>
) : (
  // actual content
)}
```

- [ ] **Empty states**: Show helpful messages when no data
```jsx
{items.length === 0 && (
  <Card className="p-12 text-center">
    <p className="text-xl text-muted-foreground mb-4">
      No items found
    </p>
    <Button onClick={() => navigate('/create')}>
      Create New Item
    </Button>
  </Card>
)}
```

- [ ] **Hover effects**: All cards and buttons have transitions
```jsx
className="hover:shadow-xl transition-shadow duration-200"
className="hover:scale-105 transition-transform duration-200"
```

- [ ] **Mobile responsive**: Test all pages on mobile viewport
```jsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
className="text-sm md:text-base lg:text-lg"
```

- [ ] **Error handling**: Handle missing data gracefully
```jsx
if (!item) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="p-8 text-center">
        <p className="text-xl">Item not found</p>
        <Button onClick={() => navigate('/')} className="mt-4">
          Go Home
        </Button>
      </Card>
    </div>
  );
}
```

### **Testing on Live URL:**

```bash
# Final deployment
git add .
git commit -m "feat: final polish complete"
git push

# Wait for Vercel deploy (2-3 min)
# Test checklist on live URL:
```

**Live Testing Checklist:**
- [ ] All pages load without errors
- [ ] Navigation works between all pages
- [ ] Search and filters function
- [ ] Data persists after page refresh (localStorage)
- [ ] Forms submit successfully
- [ ] Images load properly
- [ ] Mobile responsive (test on phone or DevTools)
- [ ] No console errors (F12 → Console)
- [ ] Loads in <3 seconds
- [ ] Challenge-specific feature works and is visible

---

## PHASE 5: DOCUMENTATION (135-150 minutes)

### **Technical Walkthrough Template:**

**README.md:**

```markdown
# [Project Name] - Technical Documentation

**Live Demo:** [your-vercel-url]
**Competition:** AI Prompt Championship - Wichita Regional
**Track:** The Architect
**Team:** [Your team name]

## Challenge Summary

[2-3 sentence description of the challenge you were given]

## Solution Overview

Built a fully functional MVP that demonstrates:
- [Key feature 1]
- [Key feature 2]
- [Key feature 3]
- [Challenge-specific feature]

## Tech Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite (chosen for speed - 10x faster than alternatives)
- **UI Components:** shadcn/ui (Radix UI + Tailwind CSS)
- **State Management:** React hooks + localStorage
- **Routing:** React Router v6
- **Deployment:** Vercel
- **Icons:** Lucide React

## Architecture Decisions

### 1. shadcn/ui over custom components
**Time saved:** 20-30 minutes
**Rationale:** Pre-built, accessible components allowed focus on functionality over UI development. Components are owned by our codebase (not a library), making customization trivial.

### 2. localStorage over database
**Time saved:** 45-60 minutes
**Rationale:** For MVP demo, localStorage provides:
- Zero configuration time
- Reliable persistence for single-user flows
- Identical data patterns to backend integration
- No deployment configuration needed

**Production path:** Data models are designed for direct backend integration with Supabase, Firebase, or any REST/GraphQL API.

### 3. Vite over Next.js
**Time saved:** 10-15 minutes per build cycle
**Rationale:** 
- Dev server starts in 390ms vs 4.5s (Next.js)
- Build time: 15s vs 30-60s
- Simpler deployment (static files)
- No SSR overhead for SPA requirements

## Data Architecture

[Show your main data structures]

```json
{
  "entity": {
    "id": number,
    "title": string,
    "description": string,
    "status": string,
    // ... domain-specific fields
  }
}
```

**Design philosophy:** Data structures mirror backend schemas. localStorage acts as a mock database layer that can be swapped with real API calls by changing a single import.

## Key Features Implemented

### 1. [Feature Name]
- Description of functionality
- User flow
- Technical implementation highlights

### 2. [Challenge-Specific Feature]
- Why this approach was chosen
- How it meets requirements
- Visual prominence in UI

[Continue for all features...]

## Time Breakdown

- Setup & initial deploy: 15 minutes
- Core feature development: 80 minutes
- Polish & responsive design: 25 minutes
- Challenge-specific feature: 15 minutes
- Testing & documentation: 15 minutes

**Total:** 150 minutes

## Deployment Process

1. Git push triggers Vercel build
2. Vite builds optimized static assets (~20 seconds)
3. Deploy to global CDN
4. Automatic HTTPS and routing

**Deployment count:** 5 deployments over 2.5 hours
**Build success rate:** 100%
**Average build time:** 18 seconds

## Performance Metrics

- **Bundle size:** <500KB
- **Load time:** <2 seconds
- **Lighthouse score:** 95+ (estimated)
- **Mobile responsive:** Yes
- **Accessibility:** WCAG 2.1 AA (via shadcn/Radix)

## Future Enhancements

If given more time, we would add:

1. **Backend Integration (2-4 hours)**
   - Supabase for database
   - Real-time subscriptions
   - User authentication

2. **Advanced Features (4-8 hours)**
   - [Domain-specific enhancement]
   - [Another enhancement]
   - Push notifications

3. **Production Hardening (8+ hours)**
   - Comprehensive error handling
   - Analytics integration
   - SEO optimization
   - Automated testing

## Lessons Learned

1. **Deploy early:** Having live URL within 15 minutes caught routing issues immediately
2. **shadcn pays off:** Saved significant time while maintaining professional polish
3. **Mock data FTW:** Zero database setup time, zero deployment issues
4. **Test production:** Found 2 issues on live URL that didn't appear in localhost

## Team Contributions

- **[Name]:** Architecture, deployment, integration
- **[Name]:** UI development, component implementation
- **[Name]:** Documentation, strategy, testing

---

Built in 2.5 hours for the AI Prompt Championship 🚀
```

---

## FINAL PRE-SUBMISSION CHECKLIST

**Before you submit:**

### **Functionality:**
- [ ] Live URL is accessible
- [ ] All required features from challenge work
- [ ] User flow is complete (can go from start to finish)
- [ ] Data persists (test page refresh)
- [ ] No broken links or 404s

### **Visual Quality:**
- [ ] Professional appearance (shadcn components properly styled)
- [ ] Mobile responsive
- [ ] Images load correctly
- [ ] Consistent spacing and alignment
- [ ] Smooth transitions and hover effects

### **Technical:**
- [ ] No console errors
- [ ] Fast load time (<3 seconds)
- [ ] All pages in /pages folder
- [ ] Mock data is realistic and complete
- [ ] Challenge-specific feature is prominent

### **Documentation:**
- [ ] README.md is complete
- [ ] Live URL is in README
- [ ] Technical decisions are explained
- [ ] Architecture is documented
- [ ] Clear and professional

### **Deployment:**
- [ ] GitHub repo is organized
- [ ] Commit messages are clear
- [ ] vercel.json is configured
- [ ] No sensitive data committed

---

## COMPETITION DAY CHECKLIST

**Morning of competition:**

1. [ ] Test your laptop, internet, and development setup
2. [ ] Verify you can deploy to Vercel (test with dummy project)
3. [ ] Verify Context7 MCP is working: `claude mcp list` (should show ✓ Connected)
4. [ ] Have this prompt ready to paste into Claude
5. [ ] Create GitHub repo in advance (save 2 minutes)
6. [ ] Connect Vercel to GitHub (save 3 minutes)
7. [ ] Open VS Code, terminal, browser tabs
8. [ ] Log into Vercel, GitHub
9. [ ] Have Unsplash open for images

**When challenge drops:**

1. [ ] Read challenge twice carefully (5 min)
2. [ ] Paste challenge into this prompt
3. [ ] Feed complete prompt to Claude
4. [ ] Follow the phases exactly
5. [ ] Deploy every 20-30 minutes
6. [ ] Test on live URL constantly
7. [ ] Submit with 5 minutes to spare

---

## REMEMBER

- **Judges see the demo first** - make it look professional
- **shadcn gives you polish** - don't build custom components
- **Deploy early and often** - catch issues when you have time to fix
- **Mock data is fine** - explain architecture in README
- **Feature completeness > code quality** - make it work, make it pretty, then optimize
- **The live URL is everything** - localhost perfection means nothing

**Good luck! 🚀**