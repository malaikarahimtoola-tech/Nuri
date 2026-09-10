const SUPA_URL = 'https://zgjtibyhuhpibrxcormd.supabase.co';
  const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnanRpYnlodWhwaWJyeGNvcm1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2MDUxNTAsImV4cCI6MjA5NDE4MTE1MH0.DdIKgmbfkdmUnjrvE2jK4q5DP6bdkOYak3CNzU18pEo';
  window._supa = supabase.createClient(SUPA_URL, SUPA_KEY);

// PostHog analytics
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.people.toString()+" (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
  posthog.init('phc_n6e5Ezs3YtWXgzEvMekGbudN5E8jw8gjRR7WZqqjjYYU', {
    api_host: 'https://eu.i.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: true,
    capture_pageleave: true,
    session_recording: { maskAllInputs: true },
  });
  window._ph = window.posthog;

window._stripe = Stripe('pk_live_51TVzua1L75noll9TUIewhk4HPEpg41ebI34F2d2i5JZetin7d8h1nlzPGSZ2Jbh0rz08xdgzl1adXICA6EZSqGim00VCzmDUPQ');

const { useState, useMemo, useEffect } = React;

// ── DATA ─────────────────────────────────────────────────────
const HEALTH_GOALS = [
  { id: 'pcos', label: 'PCOS / PMOS', icon: '🌸', description: 'Recipes to support hormone balance and reduce inflammation', color: '#F2C4CE' },
  { id: 'fertility', label: 'Fertility & Conception', icon: '🌱', description: 'Nourish your body for conception', color: '#C8E6C4' },
  { id: 'hormones', label: 'Hormone Balance', icon: '⚖️', description: 'Regulate mood, energy & cycle', color: '#F5E6A3' },
  { id: 'energy', label: 'Low Energy & Fatigue', icon: '✨', description: 'Fuel your body from the inside out', color: '#FFD9B3' },
  { id: 'gut', label: 'Gut Health', icon: '🌿', description: 'Heal your gut, heal your health', color: '#C4DEB8' },
  { id: 'thyroid', label: 'Thyroid Support', icon: '🦋', description: 'Recipes to support thyroid health', color: '#B8D4E8' },
  { id: 'menopause', label: 'Menopause', icon: '🌙', description: 'Ease the transition with nutrition', color: '#D4B8E8' },
  { id: 'endometriosis', label: 'Endometriosis', icon: '🩷', description: 'Anti-inflammatory, pain-reducing foods', color: '#F2C4CE' },
  { id: 'insulin-resistance', label: 'Insulin Resistance', icon: '🩸', description: 'Stabilise blood sugar & improve insulin sensitivity', color: '#FFD9B3' },
  { id: 'immune', label: 'Immune Health', icon: '🛡️', description: 'Strengthen your immune system through nutrition', color: '#C4DEB8' },
  { id: 'anti-inflammatory', label: 'Anti-Inflammatory', icon: '🌾', description: 'Calm inflammation and support long-term health', color: '#C4DEB8' },
];

// Shared across onboarding, the Feed's "Cooking style" filter, and the You tab
// preference toggle — one source of truth for these two lifestyle tags.
const COOKING_STYLE_OPTIONS = [
  { id: 'meal-prep', label: 'Meal Prep', icon: '🥡', description: 'Batch-cook and set your week up in advance', color: '#E8D5A8' },
  { id: 'quick-easy', label: 'Quick & Easy', icon: '⚡', description: 'Recipes ready in 25 minutes or less', color: '#FFE8B8' },
];

const LABEL_MAP = {
  pcos: { label: 'PCOS / PMOS', color: '#F2C4CE', text: '#8B3A52' },
  fertility: { label: 'Fertility', color: '#C8E6C4', text: '#2E6B3E' },
  hormones: { label: 'Hormones', color: '#F5E6A3', text: '#7A6000' },
  energy: { label: 'Energy', color: '#FFD9B3', text: '#8B4A00' },
  gut: { label: 'Gut Health', color: '#C4DEB8', text: '#2E5E1E' },
  thyroid: { label: 'Thyroid', color: '#B8D4E8', text: '#1E4E6E' },
  menopause: { label: 'Menopause', color: '#D4B8E8', text: '#4A2E6E' },
  endometriosis: { label: 'Endo', color: '#F2C4CE', text: '#6E1E3A' },
  'insulin-resistance': { label: 'Insulin Resistance', color: '#FFD9B3', text: '#7A4000' },
  immune: { label: 'Immune Health', color: '#C4DEB8', text: '#2E5E1E' },
  vegetarian: { label: 'Vegetarian', color: '#D4EAC8', text: '#2E6B2E' },
  vegan: { label: 'Vegan', color: '#C8E6C4', text: '#1E5E1E' },
  'high-protein': { label: 'High Protein', color: '#D4C4B0', text: '#4A3020' },
  'anti-inflammatory': { label: 'Anti-Inflam.', color: '#C4DEB8', text: '#2E5E1E' },
  'gut-friendly': { label: 'Gut-Friendly', color: '#C8E6C4', text: '#2E6B3E' },
  'gluten-free': { label: 'Gluten-Free', color: '#EDE0A0', text: '#6E5000' },
  'dairy-free': { label: 'Dairy-Free', color: '#D8E8EE', text: '#265A66' },
  'high-fiber': { label: 'High-Fiber', color: '#D9E8C4', text: '#3C5E1E' },
  'quick-easy': { label: 'Quick & Easy', color: '#FFE8B8', text: '#8A5A00' },
  'meal-prep': { label: 'Meal Prep', color: '#E8D5A8', text: '#6E5300' },
};

const DIETICIANS = [
  { id:1, name:'Emily', credentials:'Co-founder', specialty:'Women\'s Health Nutrition', bio:'Co-founder of nuri. Building a recipe platform for women managing chronic conditions.', initials:'EY', avatarColor:'#C4A882', followers:0, following:0, tags:['pcos','gut','hormones'], recipeIds:[] },
  { id:2, name:'Malaika', credentials:'Co-founder', specialty:'Women\'s Health Nutrition', bio:'Co-founder of nuri. Building a recipe platform for women managing chronic conditions.', initials:'MR', avatarColor:'#8FA888', followers:0, following:0, tags:['pcos','hormones','endometriosis'], recipeIds:[] },
  { id:3, name:'Claire Pettitt', credentials:'PhD, RD', specialty:'PCOS & Women\'s Health', bio:'🇬🇧 PhD Registered Dietitian with 13 years of clinical experience across the NHS and private practice. Specialises in PCOS, endometriosis, fertility and gut health.', photo:null, initials:'CP', avatarColor:'#7A9E7E', followers:0, following:0, tags:['pcos','hormones','period','gut','fertility','endometriosis'], recipeIds:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21] },
  { id:4, name:'Alysse Vocca', credentials:'RD', specialty:'Eating Disorders & Women\'s Health', bio:'Hi, I\'m Alysse — a Registered Dietitian specializing in women\'s health, eating disorders, and sustainable nutrition for chronic conditions, including PCOS. My approach focuses on helping women build a healthier relationship with food while supporting hormone balance, blood sugar stability, energy levels, and overall well-being without restriction or rigid dieting. I believe nutrition should feel realistic, nourishing, and supportive of your lifestyle. My specialties include PCOS nutrition, hormone health, and eating disorder recovery.', initials:'AV', avatarColor:'#C47A7A', followers:0, following:0, tags:['pcos','hormones','period','endometriosis'], recipeIds:[22,23,24,25,26,27,28,29,30,31] },
  { id:5, name:'Alice March', credentials:'RD', specialty:'Women\'s Health & Hormonal Nutrition', bio:'Registered Dietitian specialising in women\'s hormonal health, PCOS, and condition-specific nutrition.', initials:'AM', avatarColor:'#A8BBD4', followers:0, following:0, tags:['pcos','hormones','fertility'], recipeIds:[] },
];

const PHOTO_IDS = [
  'eeqbbemH9-c','y4ct7bLijkQ','jUPOXXRNdcA','IGfIGP5ONV0','R0y_bEoeiMk',
  '1SPu0KT-Ejg','9rYfG8sWRVo','OfdDiqx8Cz8','SqYmTDQYMjo','wMzx2nBdeng',
  'p0j-mE6mGo4','lp4y3GEV9bg','4_jhDO54BYg','bpPTlXWTOvg','MAbDy9lF5Ms',
];

// Claire's Squarespace image base URL
const CP = 'https://images.squarespace-cdn.com/content/v1/5f6dcaff3971e61f55a10122/5f6f182a4ca040062e7a8003/';

// ── AI MACRO ESTIMATION ───────────────────────────────────────
// Cache lives in localStorage under 'nuri_macros_v1'
function getMacroCache() {
  try { return JSON.parse(localStorage.getItem('nuri_macros_v1') || '{}'); } catch { return {}; }
}
function setMacroCache(id, data) {
  try {
    const c = getMacroCache();
    c[id] = data;
    localStorage.setItem('nuri_macros_v1', JSON.stringify(c));
  } catch {}
}

async function estimateMacros(recipe) {
  const cached = getMacroCache()[recipe.id];
  if (cached) return cached;
  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 200,
        system: 'You are a nutrition expert. Respond ONLY with a JSON object, no markdown, no explanation.',
        messages: [{
          role: 'user',
          content: `Estimate nutrition per serving for this recipe.\nTitle: ${recipe.title}\nServings: ${recipe.servings}\nIngredients:\n${recipe.ingredients.join('\n')}\n\nRespond with ONLY this JSON (integers only): {"kcal":0,"protein":0,"carbs":0,"fat":0}`
        }]
      })
    });
    const data = await resp.json();
    const text = data.content?.[0]?.text || '';
    const clean = text.replace(/```json|```/g, '').trim();
    const macros = JSON.parse(clean);
    // Validate shape
    if (typeof macros.kcal === 'number') {
      setMacroCache(recipe.id, macros);
      return macros;
    }
  } catch (e) {
    console.warn('Macro estimation failed for recipe', recipe.id, e);
  }
  return null;
}

// Hook: returns { macros, loading } for a given recipe
function useMacros(recipe) {
  const [macros, setMacros] = React.useState(() => getMacroCache()[recipe?.id] || null);
  const [loading, setLoading] = React.useState(!getMacroCache()[recipe?.id]);
  useEffect(() => {
    if (!recipe) return;
    if (getMacroCache()[recipe.id]) { setMacros(getMacroCache()[recipe.id]); setLoading(false); return; }
    setLoading(true);
    estimateMacros(recipe).then(m => { setMacros(m); setLoading(false); });
  }, [recipe?.id]);
  return { macros, loading };
}

const RECIPES = [
  { id:1,  dieticianId:3, title:'Pumpkin, Orange & Zaatar Soup', subtitle:'Middle Eastern twist on a winter warmer', emoji:'🎃', photo:`${CP}6955a58e920e3020578746fb/1770821699612/soup+2.jpg?format=800w`, healthLabels:['pcos'], prepTime:'15 min', cookTime:'75 min', servings:4, ingredients:['1 pumpkin, cut into large chunks','2 tbsp zaatar','1 white onion, peeled and diced','1 tsp sumac','Juice of 2 oranges','500 ml vegetable stock','2 tbsp cream or crème fraîche','Olive oil, salt & pepper'], instructions:['Preheat oven to 185°C.','Cut pumpkin into roughly 8 large pieces. Lay on a baking tray, drizzle with olive oil, zaatar, salt and pepper.','Roast for 45–60 minutes until flesh is soft.','Remove seeds and peel from the pumpkin.','Heat oil in a pan and fry the onion until soft. Add sumac and a pinch of salt.','Add pumpkin and 500 ml stock. Pour in orange juice and mix.','Bring to the boil, then simmer for 10 minutes.','Blend with a hand blender. Stir in cream or crème fraîche.'], note:'Keeps in the fridge for 2 days or freeze for up to 2 months. Reheat well before serving.' },
  { id:2,  dieticianId:3, title:'Soft & Chewy Oatmeal Chocolate Chip Cookies', subtitle:'Blood sugar-friendly bake with beta-glucan oats', emoji:'🍪', photo:`${CP}682624cad29e5148a3cdf047/1750963301821/13cc14cf-97c3-44ee-9645-6dd73ca26231.jpg?format=800w`, healthLabels:['pcos'], prepTime:'10 min', cookTime:'25 min', servings:12, ingredients:['¼ cup vanilla protein powder (plant-based)','2 eggs','1 ripe banana, mashed','1 tsp baking powder','1 tsp ground cinnamon','1 tbsp vanilla extract','1 cup rolled oats','½ cup brown sugar','½ cup softened butter','½ cup chocolate chips','Pinch of salt'], instructions:['Preheat oven to 175°C. Line a baking tray with parchment.','Beat softened butter and brown sugar until light and fluffy.','Mix in vanilla extract and eggs until well combined.','In a separate bowl, whisk together oats, protein powder, baking powder, cinnamon and salt.','Gradually add dry ingredients to wet mixture and stir.','Fold in chocolate chips.','Add mashed banana and mix until just combined.','Scoop 1.5 tablespoons of dough per cookie onto the tray, spacing 5 cm apart.','Bake 12–15 minutes until edges are golden. Cool before serving.'], note:'Oats are rich in beta-glucan fibre which helps stabilise blood sugar — ideal for PCOS management.' },
  { id:3,  dieticianId:3, title:'Citrus Roasted Salmon', subtitle:'Omega-3 rich with Middle Eastern spices', emoji:'🐟', photo:`${CP}66bdab540360b04c1e129d61/1723795250313/Feature+image.jpeg?format=800w`, healthLabels:['pcos','endometriosis'], prepTime:'15 min', cookTime:'40 min', servings:2, ingredients:['2 salmon fillets (or 1 large fillet)','1 orange, zested & juiced, then sliced into rounds','1 lemon, zested & juiced, then sliced into rounds','1 tsp sumac','1 tsp zaatar','Small bunch fresh parsley, chopped','1 red chilli, finely chopped','1 tbsp pomegranate molasses','2 tbsp olive oil','Salt & black pepper'], instructions:['Preheat oven to 180°C.','Zest and juice the orange and lemon. Slice remaining fruit into 2–3 cm rounds.','Mix citrus juice and zest, sumac, zaatar, parsley, chilli, pomegranate molasses and olive oil in a bowl. Season.','Line a baking sheet with parchment. Arrange citrus slices to form a bed.','Place salmon over the citrus. Pour marinade over the top.','Bake for 20–40 minutes depending on fillet size, checking every 10 minutes after the 20-minute mark.','Serve with rice, quinoa, or grains alongside vegetables.'], note:'Salmon is rich in omega-3 fatty acids, particularly beneficial for PCOS and endometriosis.' },
  { id:4,  dieticianId:3, title:'Moroccan Inspired Traybake', subtitle:'Cinnamon-spiced veg with tahini drizzle', emoji:'🥕', photo:`${CP}654fb1f084fd254ec1e6c616/1706264040640/Blog+Feature+Image.jpeg?format=800w`, healthLabels:['pcos'], prepTime:'15 min', cookTime:'40 min', servings:4, ingredients:['1 sweet potato, cubed','2 carrots, chopped','1 beetroot, chopped','1 courgette, chopped','1 red pepper, chopped','2 tsp cinnamon','1 tsp cumin','1 tsp paprika','Olive oil, salt & pepper','For tahini drizzle: 3 tbsp tahini, juice of ½ lemon, 1–2 tbsp water, pinch of salt'], instructions:['Preheat oven to 200°C.','Place sweet potato, carrots and beetroot in one bowl; courgette and peppers in another.','Drizzle both with olive oil and toss to coat.','Sprinkle cinnamon, cumin and paprika over all vegetables. Season with salt and pepper.','Spread on a large baking tray and roast for 35–40 minutes until golden and tender.','While roasting, whisk tahini, lemon juice, water and salt until smooth.','Allow vegetables to cool slightly before drizzling with tahini sauce.'], note:'Cinnamon has shown benefits in improving insulin sensitivity in PCOS. Great for meal prep — leftovers work well in salads and wraps.' },
  { id:5,  dieticianId:3, title:'Protein Pancakes', subtitle:'High-protein breakfast — 3 simple ingredients', emoji:'🥞', photo:`${CP}64d5fb2c2d8da932d1d8ca75/1695730700022/Blog+feature+image+Protein+pancakes.jpeg?format=800w`, healthLabels:['pcos'], prepTime:'5 min', cookTime:'15 min', servings:2, ingredients:['¼ cup vanilla protein powder (plant-based pea protein)','2 eggs','1 ripe banana, mashed','1 tsp baking powder','1 tsp ground cinnamon','1 tbsp vanilla extract'], instructions:['In a medium bowl, whisk together eggs and protein powder until smooth and creamy.','Add mashed banana, baking powder, cinnamon and vanilla extract. Whisk until combined.','Leave batter for 5–10 minutes until bubbles form on the surface.','Heat a non-stick pan over medium-low heat with a little oil.','Use a ¼ cup measure to pour pancakes onto the pan.','Cook 3–5 minutes until bubbles form on the surface, then flip.','Cook the other side for 2–3 minutes until golden.'], note:'Can be made with any protein powder. If batter is too thick, loosen with 2–4 tbsp milk. Best eaten fresh but keeps 3 days in the fridge.' },
  { id:6,  dieticianId:3, title:'Chickpea & Aubergine Stew', subtitle:'Lebanese-inspired maghmour — fibre-packed & versatile', emoji:'🍆', photo:null, healthLabels:['pcos'], prepTime:'15 min', cookTime:'30 min', servings:4, ingredients:['2 aubergines, chopped into medium pieces','1 x 400g tin chickpeas, drained','2 bell peppers, chopped','1 red chilli (optional)','2 tbsp red pepper paste','2 tbsp tomato paste','1 x 400g tin chopped tomatoes','2 cups water','Olive oil, salt & pepper'], instructions:['Preheat oven to 180°C. Toss aubergine with olive oil and roast for 7–10 minutes until golden.','In a large saucepan, sauté the peppers (and optional chilli) in olive oil for 5 minutes. Season.','Add red pepper paste and tomato paste. Cook for 2–3 minutes.','Pour in chopped tomatoes and 2 cups of water. Stir to combine.','Add chickpeas. Cover and simmer for 10 minutes.','Add roasted aubergine and simmer a final 10 minutes until sauce thickens.','Garnish with parsley and pomegranate seeds.'], note:'Serve warm with rice or cold with bread as a dip. Perfect for meal prep.' },
  { id:7,  dieticianId:3, title:'Veggie & Cheese Frittata', subtitle:'High-protein bites — great for breakfast or lunchbox', emoji:'🥚', photo:`${CP}60ec43136e267257945cbf62/1695730794461/IMG_6587-2.jpg?format=800w`, healthLabels:['pcos','fertility'], prepTime:'10 min', cookTime:'20 min', servings:6, ingredients:['6 eggs','Handful of mixed vegetables (courgette, pepper, spinach, tomatoes)','50g feta or goat\'s cheese, crumbled','30g cheddar, grated','Small chunk pecorino (optional)','Salt & pepper','Oil spray'], instructions:['Preheat oven to 180°C. Spray a 12-hole muffin tray with oil.','Whisk together eggs, salt and pepper until combined.','Stir through chopped vegetables and cheeses.','Pour evenly into the muffin tray.','Bake for 18–20 minutes until set and golden on top.','Cool slightly before removing from tray.'], note:'Claire says eggs are a nutritional powerhouse especially for those trying to conceive. Store in the fridge for up to 3 days.' },
  { id:8,  dieticianId:3, title:'Roasted Beetroot', subtitle:'Anti-inflammatory polyphenols, simple & versatile', emoji:'🔴', photo:`${CP}68dfb6d77be4bb063728f4d6/1765443955429/main.jpg?format=800w`, healthLabels:['pcos'], prepTime:'10 min', cookTime:'45 min', servings:4, ingredients:['4–6 beetroots (mixed colours if possible)','2 tbsp olive oil','Salt to taste'], instructions:['Preheat oven to 200°C.','Scrub beetroots well with a brush. Slice off both ends.','Cut each beetroot into wedges (halves, then quarters, then eighths).','Lay on a parchment-lined roasting tin. Drizzle with olive oil and salt.','Toss to coat, then lay flat.','Roast for about 45 minutes, turning a couple of times throughout, until tender and caramelised.'], note:'Roasting with the skin on maximises fibre content. Serve as a side or add to salads with feta, rocket and tomatoes.' },
  { id:9,  dieticianId:3, title:'Squash Soup', subtitle:'Warming & creamy with minimal ingredients', emoji:'🍵', photo:null, healthLabels:['pcos'], prepTime:'10 min', cookTime:'35 min', servings:4, ingredients:['1 large butternut squash, peeled & cubed','1 onion, roughly chopped','2 garlic cloves','500 ml vegetable stock','1 tbsp olive oil','½ tsp smoked paprika','Salt & pepper','Optional: splash of coconut milk or cream'], instructions:['Heat olive oil in a large pot. Sauté onion for 5 minutes until softened.','Add garlic and paprika, cook for 1 minute.','Add squash and stock. Bring to a boil, then reduce heat and simmer for 20–25 minutes until squash is very tender.','Blend until smooth using a hand blender or in batches.','Stir in coconut milk if using. Season well.','Serve with crusty bread or a swirl of cream.'], note:'Freezes well for up to 3 months — a great batch cook option.' },
  { id:10, dieticianId:3, title:'Coconut & Butternut Squash Curry', subtitle:'Mild, creamy & family-friendly with turmeric', emoji:'🍛', photo:`${CP}5f90f84f585dd565cc3432fb/1710293434680/2024-02-19%2B09.55.17.jpg?format=800w`, healthLabels:['pcos'], prepTime:'15 min', cookTime:'35 min', servings:4, ingredients:['1 butternut squash, peeled & cubed','1 onion, diced','2 garlic cloves, minced','1 cm fresh ginger, grated','1 x 400ml tin coconut milk','300 ml vegetable stock','2 tsp turmeric','1 tsp cumin','1 tsp coriander','1 tbsp olive oil','Salt to taste'], instructions:['Heat oil in a large pan. Add onion with a pinch of salt and cook for 8–10 minutes until softened.','Add garlic and ginger, cook for 2 minutes.','Add turmeric, cumin and coriander, stir and cook for 1 minute.','Add squash and coat in the spices.','Pour in coconut milk and stock. Bring to a boil.','Reduce heat, cover and simmer for 20–25 minutes until squash is tender.','Taste and adjust seasoning. Serve with rice or naan.'], note:'Claire notes turmeric is associated with many health benefits especially for those with PCOS.' },
  { id:11, dieticianId:3, title:'Homemade Oreo Cookies', subtitle:'A nourishing take on the classic treat', emoji:'🖤', photo:null, healthLabels:['pcos'], prepTime:'20 min', cookTime:'15 min', servings:20, ingredients:['For the cookies: 1 cup plain flour, ½ cup raw cacao powder, ½ cup butter (softened), ½ cup icing sugar, 1 egg, 1 tsp vanilla extract, pinch of salt','For the filling: 100g cream cheese, 3 tbsp icing sugar, ½ tsp vanilla extract'], instructions:['Preheat oven to 180°C. Line a baking tray with parchment.','Beat butter and icing sugar until creamy. Mix in egg and vanilla.','Sift in flour, cacao and salt. Mix to form a dough.','Roll out dough to 3mm thick. Cut into circles using a small cookie cutter.','Bake for 12–15 minutes. Cool completely.','Beat cream cheese, icing sugar and vanilla until smooth.','Sandwich pairs of cookies with the cream cheese filling.'], note:'Cacao is rich in magnesium, which can support hormonal balance and reduce inflammation.' },
  { id:12, dieticianId:3, title:'Aubergine with Green Beans & Freekeh', subtitle:'Fibre-rich grain salad with Middle Eastern flavours', emoji:'🥗', photo:null, healthLabels:['pcos'], prepTime:'15 min', cookTime:'30 min', servings:4, ingredients:['200g freekeh','2 aubergines, sliced','200g fine green beans, trimmed','3 tbsp olive oil','Juice of 1 lemon','2 tbsp tahini','1 garlic clove, minced','Fresh parsley or mint, chopped','Salt, pepper & chilli flakes'], instructions:['Cook freekeh in salted water for 20–25 minutes until tender but with a little bite. Drain and cool.','Roast or grill aubergine slices with olive oil and seasoning until golden.','Blanch green beans in boiling salted water for 3–4 minutes. Drain and refresh in cold water.','Whisk together tahini, lemon juice, garlic, olive oil and a pinch of salt to make the dressing.','Combine freekeh, aubergine and green beans in a bowl.','Drizzle with tahini dressing and toss gently.','Scatter with fresh herbs and chilli flakes.'], note:'Freekeh is a high-fibre whole grain that supports slow blood sugar release — ideal for PCOS.' },
  { id:13, dieticianId:3, title:'Cauliflower, Pomegranate & Pistachio Salad', subtitle:'Fibre-packed with anti-inflammatory pomegranate', emoji:'🥦', photo:`${CP}60b5a7ced093263ad54f68d6/1695730872701/IMG_5471.jpg?format=800w`, healthLabels:['pcos'], prepTime:'10 min', cookTime:'25 min', servings:4, ingredients:['1 large cauliflower, broken into florets (⅓ grated raw)','1 small onion, sliced','3 tbsp olive oil','Seeds of ½ pomegranate','40g shelled pistachios','Fresh parsley and mint, chopped','1 tsp ground cumin','1½ tbsp lemon juice','Salt & pepper'], instructions:['Preheat oven to 220°C.','Toss cauliflower florets and onion with 2 tbsp olive oil and ½ tsp salt. Spread on a baking sheet.','Roast for 20–25 minutes until golden at the edges. Cool.','Grate the remaining ⅓ of raw cauliflower into a large bowl.','Add roasted cauliflower and onion to the bowl.','Add pomegranate seeds, pistachios, herbs, cumin, lemon juice and remaining olive oil.','Toss gently. Season to taste and serve.'], note:'Pomegranate seeds are rich in antioxidants and have shown benefits in reducing androgen levels relevant to PCOS.' },
  { id:14, dieticianId:3, title:'Chocolate Date Cake', subtitle:'Naturally sweetened with dates — rich & fudgy', emoji:'🍰', photo:`${CP}611912332d65e7269d934c8d/1695730777376/IMG_7259.jpg?format=800w`, healthLabels:['pcos'], prepTime:'20 min', cookTime:'35 min', servings:10, ingredients:['200g medjool dates, pitted','150 ml boiling water','2 eggs','100g butter, melted','4 tbsp raw cacao powder','1 tsp baking powder','½ tsp bicarbonate of soda','150g plain or spelt flour','1 tsp vanilla extract','Pinch of salt'], instructions:['Preheat oven to 180°C. Grease and line a 20 cm round tin.','Pour boiling water over dates and leave to soak for 10 minutes, then blend to a smooth paste.','Whisk eggs, melted butter and vanilla together.','Add the date paste to the egg mixture and stir to combine.','Sift in cacao, flour, baking powder, bicarb and salt. Fold gently until just combined.','Pour into the prepared tin.','Bake for 30–35 minutes until a skewer comes out clean.','Cool before slicing.'], note:'Dates are a natural source of fibre, magnesium and iron — a more nutrient-dense treat option.' },
  { id:15, dieticianId:3, title:'Squash with Chilli Yoghurt & Coriander Sauce', subtitle:'Low GI — serve as a side or main', emoji:'🌶️', photo:`${CP}608bac351625d50fe195eb57/1619766340907/IMG_4988_2.jpg?format=800w`, healthLabels:['pcos'], prepTime:'15 min', cookTime:'40 min', servings:4, ingredients:['1 butternut squash, cut into thick wedges','2 tbsp olive oil','1 tsp cumin, 1 tsp coriander, ½ tsp smoked paprika','For chilli yoghurt: 200g natural yoghurt, 1–2 tsp harissa or chilli sauce, juice of ½ lemon','For coriander sauce: large bunch fresh coriander, 1 garlic clove, juice of ½ lemon, 3 tbsp olive oil, pinch of salt'], instructions:['Preheat oven to 200°C.','Toss squash wedges in olive oil, cumin, coriander, paprika and seasoning.','Roast for 35–40 minutes until tender and caramelised.','Mix yoghurt, harissa and lemon juice together for the chilli yoghurt.','Blend coriander, garlic, lemon juice, olive oil and salt to make the coriander sauce.','Spread chilli yoghurt on a serving plate.','Arrange squash on top and drizzle with coriander sauce.'], note:'A low GI dish — butternut squash helps stabilise blood sugar, important for PCOS management.' },
  { id:16, dieticianId:3, title:'Wintery Parsnip Soup', subtitle:'Naturally sweet & creamy, perfect for cold days', emoji:'🍂', photo:null, healthLabels:['pcos'], prepTime:'10 min', cookTime:'35 min', servings:4, ingredients:['4 parsnips, peeled & roughly chopped','1 onion, diced','2 garlic cloves','1 tsp ground ginger','1 tsp cumin','1 litre vegetable stock','2 tbsp olive oil','100 ml cream or coconut milk','Salt & pepper','Fresh parsley to serve'], instructions:['Heat olive oil in a large pot. Sauté onion for 5 minutes until softened.','Add garlic, ginger and cumin. Cook for 1 minute.','Add parsnips and stock. Bring to a boil.','Reduce heat and simmer for 25–30 minutes until parsnips are very tender.','Blend until smooth. Stir in cream or coconut milk.','Season well. Serve with a swirl of cream and fresh parsley.'], note:'Parsnips are a great source of prebiotic fibre — a nourishing option for PCOS.' },
  { id:17, dieticianId:3, title:'Spinach & Sweet Potato Dahl', subtitle:'Iron-rich & warming with coconut and red lentils', emoji:'🌿', photo:null, healthLabels:['pcos'], prepTime:'10 min', cookTime:'30 min', servings:4, ingredients:['2 sweet potatoes, peeled & cubed','1 cup red lentils, rinsed','1 onion, diced','2 garlic cloves, minced','1 cm ginger, grated','1 x 400ml tin coconut milk','400 ml vegetable stock','2 tbsp tomato paste','2 tsp curry powder','1 tsp turmeric','2 large handfuls spinach','Juice of ½ lemon','Olive oil, salt & pepper'], instructions:['Heat oil in a large pan. Sauté onion for 5 minutes.','Add garlic, ginger, curry powder and turmeric. Cook for 1 minute.','Add tomato paste and stir. Add sweet potato and coat in spices.','Pour in lentils, coconut milk and stock. Stir and bring to a boil.','Reduce heat and simmer for 20–25 minutes until lentils and sweet potato are tender.','Stir in spinach until wilted. Add lemon juice and season.','Serve with rice, naan or flatbread.'], note:'Red lentils and spinach provide iron and folate — key nutrients for women managing PCOS.' },
  { id:18, dieticianId:3, title:'Chickpea, Mango & Cauliflower Salad', subtitle:'Bright, tropical & packed with plant-based protein', emoji:'🥭', photo:null, healthLabels:['pcos'], prepTime:'15 min', cookTime:'25 min', servings:4, ingredients:['1 head cauliflower, broken into florets','1 x 400g tin chickpeas, drained','1 ripe mango, diced','Fresh coriander, chopped','Juice of 1 lime','2 tbsp olive oil','1 tsp cumin','½ tsp chilli flakes','Salt & pepper'], instructions:['Preheat oven to 200°C.','Toss cauliflower and chickpeas with olive oil, cumin, chilli flakes and seasoning.','Spread on a baking tray and roast for 20–25 minutes until golden.','Cool slightly, then transfer to a large bowl.','Add diced mango and coriander.','Squeeze over lime juice, toss gently and serve.'], note:'Chickpeas are a PCOS-friendly source of plant-based protein and low-GI carbohydrates.' },
  { id:19, dieticianId:3, title:'Peanut Butter Balls', subtitle:'No-bake protein snack for blood sugar balance', emoji:'🥜', photo:null, healthLabels:['pcos'], prepTime:'15 min', cookTime:'0 min', servings:12, ingredients:['1 cup natural peanut butter','½ cup oats','3 tbsp honey or maple syrup','2 tbsp chia seeds','1 tsp vanilla extract','Pinch of salt','Optional: dark chocolate chips or cacao powder to roll'], instructions:['Mix peanut butter, oats, honey, chia seeds, vanilla and salt in a bowl until combined.','If the mixture is too soft, refrigerate for 15–20 minutes.','Roll into bite-sized balls (approximately 12).','Optional: roll in cacao powder or dark chocolate chips.','Place on a lined tray and refrigerate for at least 30 minutes to set.'], note:'Peanut butter provides healthy fats and protein to support blood sugar stability — key for managing PCOS symptoms.' },
  { id:20, dieticianId:3, title:'Roasted Mixed Veg with Yoghurt & Chilli Oil', subtitle:'Ottolenghi-inspired weeknight veggie plate', emoji:'🌈', photo:`${CP}5ff7dc13b2c4ae564e1104c6/1695730989420/IMG_0873.jpg?format=800w`, healthLabels:['pcos'], prepTime:'15 min', cookTime:'35 min', servings:4, ingredients:['Selection of mixed veg: courgette, aubergine, peppers, sweet potato','3 tbsp olive oil','1 tsp cumin, 1 tsp coriander','For yoghurt: 200g natural yoghurt, 1 garlic clove (minced), pinch of salt','For chilli oil: 3 tbsp olive oil, 1–2 tsp chilli flakes, 1 garlic clove (sliced)'], instructions:['Preheat oven to 200°C.','Chop all veg into similar-sized pieces.','Toss with olive oil, cumin, coriander and seasoning.','Spread on baking trays (do not crowd) and roast for 30–35 minutes until caramelised.','While roasting, mix yoghurt with garlic and salt.','Warm olive oil in a small pan and gently heat chilli flakes and sliced garlic for 2–3 minutes.','Spread yoghurt on a plate, pile roasted veg on top, drizzle with chilli oil.'], note:'A PCOS-friendly colourful plate — the variety of vegetables provides diverse fibre and antioxidants.' },
  { id:21, dieticianId:3, title:'Lentil Bolognese', subtitle:'Plant-based comfort food packed with fibre & protein', emoji:'🍝', photo:`${CP}66e6aaecf767460e0590c6f5/1726560029569/IMG_2410.jpeg?format=800w`, healthLabels:['pcos'], prepTime:'15 min', cookTime:'30 min', servings:5, ingredients:['1 tbsp olive oil','1 carrot, finely diced','1 celery stalk, finely diced','300g mushrooms, chopped','¾ cup brown lentils, washed','3 tbsp tomato paste','2 x 400g tins chopped tomatoes','2 cups vegetable stock','1 bay leaf','½ tsp chilli flakes','¼ tsp smoked paprika','2 tsp dried oregano','1 tsp dried thyme','1 tsp dried basil','1 tbsp balsamic vinegar','Salt & pepper'], instructions:['Heat olive oil in a saucepan. Add carrots and celery and sauté for 5 minutes.','Add mushrooms and cook for 3–5 minutes until water has evaporated.','Add tomato paste and cook until it deepens in colour.','Add lentils, chopped tomatoes and stock. Bring to a boil.','Add bay leaf, chilli flakes, paprika, oregano, thyme, basil and balsamic vinegar. Season.','Reduce to a simmer and cook for 30 minutes until lentils are tender.','Serve over pasta. Store sauce separately from pasta when meal prepping.'], note:'A plant-based take on a classic — lentils provide gut-loving fibre and plant-based protein, key for PCOS management.' },
  // ── Alysse Vocca (id:4) ──────────────────────────────────────
  { id:22, dieticianId:4, title:'Cauliflower Shrimp Fried Rice', subtitle:'Low-carb, blood sugar-friendly weeknight dinner', emoji:'🦐', photo:null, healthLabels:['pcos','hormones'], prepTime:'10 min', cookTime:'15 min', servings:1, ingredients:['3 cups cauliflower rice','½ lb shrimp, peeled','1 egg','½ cup peas + carrots','2 tbsp soy sauce','1 tbsp sesame oil','2 cloves garlic'], instructions:['Heat sesame oil in pan.','Cook shrimp until pink (2–3 min), remove.','Add garlic + veggies; cook 3–4 min.','Add cauliflower rice; cook 5 min.','Push aside and scramble egg.','Add shrimp back + soy sauce; mix well.'], note:'Cauliflower rice is lower-carb and blood sugar friendly, making it ideal for managing insulin resistance in PCOS. Shrimp provides lean protein that supports insulin balance and reduces blood sugar spikes. Veggies increase fibre and nutrient density, keeping you fuller for longer. Much lower glycaemic load than traditional fried rice.' },
  { id:23, dieticianId:4, title:'Berry Chia Pudding', subtitle:'Overnight prep, omega-3 rich & hormone-balancing', emoji:'🫐', photo:null, healthLabels:['pcos','hormones','energy'], prepTime:'5 min', cookTime:'0 min', servings:1, ingredients:['3 tbsp chia seeds','¾ cup unsweetened almond milk','½ tsp vanilla','½ cup mixed berries'], instructions:['Mix chia seeds, almond milk, vanilla.','Refrigerate at least 4 hours or overnight.','Stir and top with berries.'], note:'Chia seeds are rich in soluble fibre, which slows glucose absorption and blunts blood sugar spikes. Low glycaemic berries support insulin balance without spiking cortisol. The omega-3 fats in chia seeds are essential for hormone regulation and reducing inflammation. This breakfast helps reduce sugar cravings naturally throughout the day.' },
  { id:24, dieticianId:4, title:'Egg Muffins', subtitle:'High-protein grab-and-go for hormone-stabilising mornings', emoji:'🥚', photo:null, healthLabels:['pcos','energy','hormones'], prepTime:'10 min', cookTime:'25 min', servings:6, ingredients:['6 eggs','1 cup spinach, chopped','½ cup mushrooms, diced','½ cup cooked turkey sausage','¼ cup shredded cheese (optional)','Salt + pepper'], instructions:['Preheat oven to 375°F (190°C).','Whisk eggs in a bowl.','Stir in all ingredients.','Pour into greased muffin tin.','Bake 18–22 minutes.'], note:'A high-protein breakfast helps reduce morning insulin spikes, a key concern in PCOS. Easy grab-and-go format prevents skipped meals, which cause blood sugar dips and cravings later. Balanced fat and protein work together to improve satiety and reduce cortisol. Great for hormone-stabilising meal prep throughout the week.' },
  { id:25, dieticianId:4, title:'Spicy Peanut Tofu Stir-Fry', subtitle:'Plant-based protein with hormone-balancing fats', emoji:'🥜', photo:null, healthLabels:['pcos','hormones','anti-inflammatory'], prepTime:'10 min', cookTime:'15 min', servings:2, ingredients:['14 oz firm tofu, cubed','2 cups broccoli florets','1 bell pepper, sliced','2 tbsp peanut butter','2 tbsp soy sauce','1 tsp chili flakes','1 tbsp olive oil'], instructions:['Heat oil and pan-fry tofu until golden (8–10 min).','Remove tofu and sauté vegetables 5–6 min.','Mix peanut butter, soy sauce, chili flakes + 2 tbsp water.','Return tofu to pan and add sauce.','Stir until coated and warm.'], note:'Tofu provides plant-based protein that supports insulin sensitivity without taxing the digestive system. Peanut butter adds healthy monounsaturated fats that are essential for hormone production. High-fibre broccoli and peppers slow glucose absorption and feed beneficial gut bacteria. Anti-inflammatory soy consumed in moderation may actually support oestrogen balance.' },
  { id:26, dieticianId:4, title:'Mediterranean Quinoa Bowl', subtitle:'High-protein, low-GI with anti-inflammatory olive oil', emoji:'🥗', photo:null, healthLabels:['pcos','hormones','anti-inflammatory'], prepTime:'10 min', cookTime:'15 min', servings:2, ingredients:['1 cup cooked quinoa','½ cup chickpeas','½ cucumber, diced','½ cup cherry tomatoes, halved','¼ cup feta cheese','1 tbsp olive oil','1 tbsp lemon juice'], instructions:['Cook quinoa according to package.','Mix quinoa, chickpeas, cucumber, tomatoes.','Add olive oil + lemon juice.','Top with feta.'], note:'Quinoa is a complete protein with a low glycaemic index, making it ideal for PCOS blood sugar management. Extra virgin olive oil is rich in oleocanthal, a natural anti-inflammatory compound. Chickpeas combined with veggies add resistant starch and fibre for sustained glucose control. Balanced macros in this bowl help reduce afternoon cravings and energy crashes.' },
  { id:27, dieticianId:4, title:'Salmon Avocado Cucumber Boats', subtitle:'Omega-3 rich, lower-carb & hormone-supportive', emoji:'🥑', photo:null, healthLabels:['pcos','hormones','anti-inflammatory'], prepTime:'10 min', cookTime:'10 min', servings:2, ingredients:['1 can salmon (5 oz)','1 avocado','1 large cucumber','1 tbsp lemon juice','½ tsp dill','Salt + pepper'], instructions:['Slice cucumber lengthwise and scoop centre slightly.','Mix salmon, avocado, lemon juice, dill, salt, pepper.','Spoon mixture into cucumber halves.'], note:'Omega-3 fatty acids from salmon are among the most powerful natural tools for reducing PCOS-related inflammation. Healthy fats from avocado directly support progesterone and oestrogen production. The low-carb cucumber base keeps this blood sugar friendly without sacrificing fullness. High protein content keeps appetite stable for hours after eating.' },
  { id:28, dieticianId:4, title:'Sweet Potato Egg Hash', subtitle:'Slow-digesting carbs with protein for insulin support', emoji:'🍳', photo:null, healthLabels:['pcos','energy','hormones'], prepTime:'10 min', cookTime:'20 min', servings:2, ingredients:['1 medium sweet potato, diced small','1 tbsp olive oil','½ bell pepper, diced','2 cups spinach','4 eggs','Salt + pepper'], instructions:['Heat oil in skillet.','Cook sweet potato 10–12 min until soft.','Add bell pepper and cook 3–4 min.','Stir in spinach until wilted.','Push veggies aside and cook eggs in same pan (scramble or fry).','Combine and season.'], note:'Protein and fat from eggs prevent the glucose spikes that worsen PCOS symptoms and fatigue. Sweet potato is a slower-digesting complex carb that provides energy without the insulin crash of refined carbs. High fibre content supports gut microbiome health, which is directly linked to hormone metabolism. This dish is particularly beneficial for managing insulin resistance.' },
  { id:29, dieticianId:4, title:'Zucchini Turkey Taco Skillet', subtitle:'Lean protein, low-carb taco night done right', emoji:'🌮', photo:null, healthLabels:['pcos','hormones','high-protein'], prepTime:'10 min', cookTime:'15 min', servings:3, ingredients:['1 lb ground turkey','2 medium zucchini, diced','½ onion, chopped','2 cloves garlic, minced','2 tbsp taco seasoning','1 tbsp olive oil','1 avocado (for topping)'], instructions:['Heat oil in skillet over medium heat.','Cook turkey until browned (5–7 min).','Add onion + garlic; cook 2–3 min.','Add zucchini and taco seasoning.','Cook until zucchini softens (5–6 min).','Top with sliced avocado.'], note:'Lean turkey protein supports stable blood sugar and provides the amino acids needed for hormone synthesis. Zucchini is low-carb and high in fibre, helping you feel full without a glycaemic spike. Avocado adds hormone-supportive healthy fats and potassium for adrenal health. A significantly lower glycaemic alternative to traditional taco bowls or wraps.' },
  { id:30, dieticianId:4, title:'Cinnamon Almond Yogurt Bowl', subtitle:'5-minute breakfast for insulin sensitivity & cravings', emoji:'🍓', photo:null, healthLabels:['pcos','energy','hormones'], prepTime:'5 min', cookTime:'0 min', servings:1, ingredients:['¾ cup plain Greek yogurt','1 tbsp almond butter','1 tbsp chia seeds','½ tsp cinnamon','½ cup blueberries'], instructions:['Add yogurt to a bowl.','Stir in cinnamon.','Top with blueberries and chia seeds.','Swirl almond butter on top.'], note:'High-protein Greek yogurt stabilises blood sugar by slowing carbohydrate digestion and reducing insulin spikes. Cinnamon contains cinnamaldehyde, shown in studies to improve insulin sensitivity in women with PCOS. Chia seeds add soluble fibre and omega-3s essential for hormone balance and inflammation reduction. Healthy fats from almond butter keep cravings stable for hours.' },
  { id:31, dieticianId:4, title:'Turmeric Coconut Chickpea Curry', subtitle:'Anti-inflammatory, gut-friendly one-pan curry', emoji:'🍛', photo:null, healthLabels:['pcos','anti-inflammatory','gut','hormones'], prepTime:'5 min', cookTime:'15 min', servings:2, ingredients:['1 can chickpeas (15 oz), drained/rinsed','1 tbsp olive oil','2 cloves garlic, minced','1 tsp turmeric','½ tsp cumin','¼ tsp black pepper','½ can (7 oz) coconut milk','2 cups spinach'], instructions:['Heat olive oil in a skillet over medium heat.','Add garlic and sauté 1 minute.','Stir in turmeric, cumin, and black pepper.','Add chickpeas and stir to coat.','Pour in coconut milk and simmer 5–7 minutes.','Add spinach and cook until wilted (1–2 min).'], note:'High-fibre chickpeas are a cornerstone PCOS food — they stabilise blood sugar and feed beneficial gut bacteria. Turmeric combined with black pepper is one of the most potent natural anti-inflammatory combinations available. Coconut milk provides medium-chain triglycerides that support hormone regulation and reduce inflammation. Plant-based protein from chickpeas improves satiety without spiking insulin.' },
];

// ── COMMUNITY DATA (from portal) ─────────────────────────────
// Community recipes now loaded from Supabase dynamically in App
const communityDieticians = [];
const communityRecipes    = [];
const adminRecipes        = (() => { try { return JSON.parse(localStorage.getItem('nuri_custom_recipes')      || '[]'); } catch { return []; } })();
const adminDieticians     = (() => { try { return JSON.parse(localStorage.getItem('nuri_custom_dieticians')   || '[]'); } catch { return []; } })();
// Deduplicate: only add community/admin dieticians whose id isn't already in DIETICIANS
const hardcodedIds = new Set(DIETICIANS.map(d => d.id));
const filteredCommunity = communityDieticians.filter(d => !hardcodedIds.has(d.id));
const filteredAdmin = adminDieticians.filter(d => !hardcodedIds.has(d.id));
const ALL_DIETICIANS = [...DIETICIANS, ...filteredCommunity, ...filteredAdmin];
const ALL_RECIPES    = [...RECIPES,    ...communityRecipes,    ...adminRecipes];

const getD = (id) => ALL_DIETICIANS.find(d => d.id === parseInt(id, 10));
const getRecipesByD = (id) => ALL_RECIPES.filter(r => r.dieticianId === id);

// Returns the gingham style for a recipe — community recipes carry their own bg/s
function getRecipeGingham(recipe) {
  if (recipe.ginghamBg) {
    const sz = 26;
    return {
      backgroundColor: recipe.ginghamBg,
      backgroundImage: [
        `repeating-linear-gradient(transparent 0px,transparent ${sz}px,${recipe.ginghamS} ${sz}px,${recipe.ginghamS} ${sz*2}px)`,
        `repeating-linear-gradient(90deg,transparent 0px,transparent ${sz}px,${recipe.ginghamS} ${sz}px,${recipe.ginghamS} ${sz*2}px)`,
      ].join(','),
    };
  }
  // Use grid index if available to ensure adjacent tiles never share same color
  if (recipe._gridIndex !== undefined) {
    const idx = recipe._gridIndex;
    // In a 3-col grid, positions 0,1,2 are in same row — ensure all 3 differ
    const p = GINGHAM[idx % GINGHAM.length];
    const sz = 26;
    return {
      backgroundColor: p.bg,
      backgroundImage: [
        `repeating-linear-gradient(transparent 0px,transparent ${sz}px,${p.s} ${sz}px,${p.s} ${sz*2}px)`,
        `repeating-linear-gradient(90deg,transparent 0px,transparent ${sz}px,${p.s} ${sz}px,${p.s} ${sz*2}px)`,
      ].join(','),
    };
  }
  return getGingham(recipe.id, recipe.dieticianId || recipe.dietitian_id || 0);
}
const fmt = (n) => n >= 1000 ? `${(n/1000).toFixed(1)}k` : String(n);

// ── GINGHAM ───────────────────────────────────────────────────
const GINGHAM = [
  { bg:'#A8C4A8', s:'rgba(58,107,74,0.32)' },    // sage
  { bg:'#D9A0A0', s:'rgba(160,60,60,0.30)' },    // rose
  { bg:'#A8BBD4', s:'rgba(40,80,140,0.28)' },    // blue
  { bg:'#D4B87A', s:'rgba(140,95,20,0.34)' },    // tan
  { bg:'#BBA8CC', s:'rgba(90,50,130,0.28)' },    // plum
  { bg:'#C8A080', s:'rgba(140,80,30,0.32)' },    // clay
  { bg:'#A8C4B8', s:'rgba(40,107,80,0.28)' },    // teal
  { bg:'#D4A8A8', s:'rgba(140,60,60,0.28)' },    // dusty rose
];
function getGingham(id, dieticianId) {
  const offset = (dieticianId || 0) * 3;
  const p = GINGHAM[(id - 1 + offset) % GINGHAM.length];
  const sz = 26;
  return {
    backgroundColor: p.bg,
    backgroundImage: [
      `repeating-linear-gradient(transparent 0px,transparent ${sz}px,${p.s} ${sz}px,${p.s} ${sz*2}px)`,
      `repeating-linear-gradient(90deg,transparent 0px,transparent ${sz}px,${p.s} ${sz}px,${p.s} ${sz*2}px)`,
    ].join(','),
  };
}
function photoUrl(id, supaPhoto) {
  if (supaPhoto) return supaPhoto;
  const pid = PHOTO_IDS[id-1];
  if (!pid) return null;
  return `https://images.unsplash.com/photo-${pid}?w=800&q=70&auto=format&fit=crop`;
}
const SUPA_STORAGE_URL = 'https://zgjtibyhuhpibrxcormd.supabase.co/storage/v1/object/public';
function recipePhotoUrl(r) { return r.supaPhoto || r.photo || null; }
function dietitianAvatarUrl(d) { return d.supaAvatar || d.photo || null; }
function ls(k, fb) { try { const v = localStorage.getItem(k); return v !== null ? JSON.parse(v) : fb; } catch { return fb; } }
function lsSave(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }

// ── ONE-TIME MIGRATION: clear stale localStorage from old builds ──
(function() {
  const CURRENT_VERSION = '2';
  if (localStorage.getItem('nuri_build_version') !== CURRENT_VERSION) {
    ['tee_onboarded','tee_goals','tee_followed','tee_saved','tee_tried',
     'tee_triedphotos','tee_comments','tee_rdmode','tee_rdid',
     'tee_community_dieticians','tee_community_recipes',
     'nuri_custom_recipes','nuri_custom_dieticians'].forEach(k => localStorage.removeItem(k));
    localStorage.setItem('nuri_build_version', CURRENT_VERSION);
  }
})();

// ── SMALL COMPONENTS ──────────────────────────────────────────
function HealthTag({ label }) {
  const info = LABEL_MAP[label];
  if (!info) return null;
  return <span className="health-tag" style={{ background: info.color, color: info.text }}>{info.label}</span>;
}

function Avatar({ initials, color, cls = 'avatar-sm', photo }) {
  if (photo) return <div className={cls} style={{ background: color, backgroundImage: `url(${photo})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />;
  return <div className={cls} style={{ background: color }}>{initials}</div>;
}

// ── RESTORE PURCHASE BUTTON ─────────────────────────────────
function RestorePurchaseButton({ user, onSuccess }) {
  const [loading, setLoading] = React.useState(false);
  const [msg, setMsg] = React.useState('');
  const db = window._supa;
  const handleRestore = async () => {
    setLoading(true); setMsg('');
    try {
      const { data } = await db.from('subscriptions').select('status, updated_at').eq('user_id', user.id).maybeSingle();
      if (data?.status === 'active') {
        onSuccess();
        setMsg('✅ Premium access restored!');
      } else if (data?.status === 'pending') {
        await db.from('subscriptions').upsert(
          { user_id: user.id, stripe_price_id: NURI_PREMIUM_PRICE_ID, status: 'active', updated_at: new Date().toISOString() },
          { onConflict: 'user_id' }
        );
        onSuccess();
        setMsg('✅ Purchase restored successfully!');
      } else {
        setMsg('No purchase found. Contact support if you believe this is an error.');
      }
    } catch(e) {
      setMsg('Something went wrong. Please try again.');
    }
    setLoading(false);
  };
  return (
    <div style={{ textAlign: 'center', marginTop: 8 }}>
      <button onClick={handleRestore} disabled={loading} style={{ background: 'none', border: 'none', color: 'var(--text-light)', fontSize: 12, cursor: 'pointer', textDecoration: 'underline', fontFamily: 'var(--font-body)' }}>
        {loading ? 'Checking…' : 'Already paid? Restore purchase'}
      </button>
      {msg && <div style={{ fontSize: 12, marginTop: 4, color: msg.startsWith('✅') ? '#2E7D32' : '#8B2020' }}>{msg}</div>}
    </div>
  );
}

// ── SUBSCRIPTION MODAL ───────────────────────────────────────
function SubscriptionModal({ onClose, onSuccess, user, onSignIn }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const handleSubscribe = async () => {
    if (!user) { onClose(); onSignIn('signup'); return; }
    setLoading(true); setError('');
    try {
      await window._supa.from('subscriptions').upsert(
        { user_id: user.id, stripe_price_id: NURI_PREMIUM_PRICE_ID, status: 'pending', updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      );
      // Store where to redirect after payment
      if (window._postPayRedirect) {
        sessionStorage.setItem('nuri_post_pay', JSON.stringify(window._postPayRedirect));
      }
      const base = billingPeriod === 'annual' ? STRIPE_PAYMENT_LINK_ANNUAL : STRIPE_PAYMENT_LINK_MONTHLY;
      const params = new URLSearchParams({
        prefilled_email: user.email || '',
        client_reference_id: user.id,
      });
      window.location.href = base + '?' + params.toString();
    } catch(e) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="sub-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="sub-modal">
        <div className="sub-modal-banner">
          <button className="sub-modal-close" onClick={onClose}>✕</button>
          <div className="sub-modal-inner">
            <div className="sub-modal-eyebrow">nuri. Premium</div>
            <div className="sub-modal-rd-name">Unlock everything</div>
            <div className="sub-modal-rd-creds">All current & future exclusive dietitians included</div>
          </div>
        </div>
        <div className="sub-modal-body">
          <div className="sub-modal-title">One subscription, all the experts</div>
          <p className="sub-modal-text">Get full access to every nuri. exclusive dietitian — now and as we grow. Cancel anytime.</p>
          <div style={{ display:'flex', gap:8, marginBottom:20, background:'var(--warm-beige)', padding:4, borderRadius:50 }}>
            <button onClick={() => setBillingPeriod('monthly')} style={{ flex:1, padding:'8px 0', borderRadius:50, border:'none', fontFamily:'var(--font-body)', fontSize:13, fontWeight:600, cursor:'pointer', background: billingPeriod==='monthly' ? 'var(--brown)' : 'transparent', color: billingPeriod==='monthly' ? 'white' : 'var(--text-mid)', transition:'all 0.18s' }}>Monthly</button>
            <button onClick={() => setBillingPeriod('annual')} style={{ flex:1, padding:'8px 0', borderRadius:50, border:'none', fontFamily:'var(--font-body)', fontSize:13, fontWeight:600, cursor:'pointer', background: billingPeriod==='annual' ? 'var(--brown)' : 'transparent', color: billingPeriod==='annual' ? 'white' : 'var(--text-mid)', transition:'all 0.18s', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
              Annual <span style={{ fontSize:10, background:'#C8E6C9', color:'#2E7D32', padding:'2px 6px', borderRadius:50 }}>Save $20</span>
            </button>
          </div>
          <div className="sub-modal-price">
            <span className="sub-modal-price-num">{billingPeriod === 'annual' ? '$99.99' : '$9.99'}</span>
            <span className="sub-modal-price-period">{billingPeriod === 'annual' ? '/ year' : '/ month'}</span>
          </div>
          {billingPeriod === 'annual' && <div style={{ fontSize:12, color:'var(--text-light)', marginTop:-16, marginBottom:16 }}>That's just $8.33/month</div>}
          <div className="sub-modal-perks">
            {[
              { icon:'🔓', text:'Unlock all exclusive recipes' },
              { icon:'🩺', text:'Access every nuri. premium dietitian' },
              { icon:'✨', text:'New dietitians automatically included' },
              { icon:'❌', text:'Cancel anytime, no commitment' },
            ].map(p => (
              <div key={p.text} className="sub-modal-perk">
                <span style={{fontSize:16,flexShrink:0}}>{p.icon}</span>
                <span>{p.text}</span>
              </div>
            ))}
          </div>
          {error && <div style={{color:'#8B2020',fontSize:13,marginBottom:12}}>{error}</div>}
          <button className="sub-modal-cta" onClick={handleSubscribe} disabled={loading}>
            {loading ? 'Redirecting to checkout…' : user ? `Subscribe for ${billingPeriod === 'annual' ? '$99.99/year' : '$9.99/month'} →` : 'Sign up to subscribe →'}
          </button>
          <div className="sub-modal-note">Secure payment via Stripe · Cancel anytime</div>
          {user && <RestorePurchaseButton user={user} onSuccess={onSuccess} />}
        </div>
      </div>
    </div>
  );
}

function UnlockModal({ recipe, onClose, onSignIn }) {
  return (
    <div className="unlock-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="unlock-modal">
        <div className="unlock-modal-banner">
          <button className="unlock-modal-close" onClick={onClose}>✕</button>
          <div className="unlock-modal-recipe">
            <div className="unlock-modal-recipe-emoji">{recipe.emoji}</div>
            <div className="unlock-modal-recipe-title">{recipe.title}</div>
            <div className="unlock-modal-recipe-sub">{recipe.subtitle}</div>
          </div>
        </div>
        <div className="unlock-modal-body">
          <div className="unlock-modal-heading">Create a free account to unlock this recipe</div>
          <p className="unlock-modal-text">nuri. is free to join. Sign up to get full access to every recipe, save your favourites, and build your grocery list.</p>
          <div className="unlock-modal-perks">
            {[
              { icon:'🩺', text:'Recipes by verified registered dietitians' },
              { icon:'🔬', text:'Condition-specific: PCOS / PMOS, endo, hormones & more' },
              { icon:'🛒', text:'Auto grocery lists from your saved recipes' },
              { icon:'❤️', text:'Save recipes and build your personal recipe book' },
            ].map(p => (
              <div key={p.text} className="unlock-perk">
                <span className="unlock-perk-icon">{p.icon}</span>
                <span>{p.text}</span>
              </div>
            ))}
          </div>
          <button className="unlock-modal-cta" onClick={() => { onClose(); onSignIn('signup'); }}>Create free account →</button>
          <div className="unlock-modal-signin">
            Already have an account?{' '}
            <button className="unlock-modal-signin-btn" onClick={() => { onClose(); onSignIn('signin'); }}>Sign in</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RecipeCard({ recipe, onRecipeClick, onDieticianClick, isSaved, onToggleSave, isLocked, onSignIn, isPremiumLocked, onSubscribe, supaDietitians, supaAllDietitians }) {
  const _dId = parseInt(recipe.dieticianId, 10);
  const baseD = getD(_dId) || (supaAllDietitians || []).find(d => d.id === _dId) || { id: _dId, name:'Unknown', credentials:'RD', initials:'?', avatarColor:'#C4A882', photo:null };
  const d = { ...baseD, ...(supaDietitians?.[_dId] || {}) };
  const [imgFailed, setImgFailed] = useState(false);
  const [showUnlock, setShowUnlock] = useState(false);

  const handleClick = () => { if (isPremiumLocked) { window._postPayRedirect = { recipe }; onSubscribe(); } else if (isLocked) { setShowUnlock(true); } else { onRecipeClick(recipe); } };
  const photoSrc = recipePhotoUrl(recipe);
  const hasPhoto = photoSrc && !imgFailed;
  const avatarSrc = dietitianAvatarUrl(d);

  return (
    <>
      {showUnlock && <UnlockModal recipe={recipe} onClose={() => setShowUnlock(false)} onSignIn={(mode) => { setShowUnlock(false); onSignIn(mode); }} />}
      <div className={`recipe-card fade-up ${isLocked ? 'locked' : ''}`} onClick={handleClick} style={{ position:'relative' }}>
        <div className="recipe-card-img" style={hasPhoto ? { background: 'var(--warm-beige)' } : getRecipeGingham(recipe)}>
          {isPremiumLocked && (
            <div className="exclusive-badge">nuri. exclusive</div>
          )}
          {recipe.illusSvg ? (
            <div className="recipe-card-fallback">
              <div style={{ width: 80, height: 80 }} dangerouslySetInnerHTML={{ __html: recipe.illusSvg }} />
              <div className="fallback-title">{recipe.title}</div>
            </div>
          ) : hasPhoto ? (
            <div className="recipe-card-fallback" style={{ padding:0, overflow:'hidden', width:'85%', height:'85%', margin:'auto' }}>
              <img style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', borderRadius:10 }} src={photoSrc} alt={recipe.title} onError={() => setImgFailed(true)} />
            </div>
          ) : (
            <div className="recipe-card-fallback">
              <div className="fallback-emoji">{recipe.emoji}</div>
              <div className="fallback-title">{recipe.title}</div>
            </div>
          )}
          {!isLocked && (
            <>
            <button className="card-share-btn" onClick={e => {
              e.stopPropagation();
              const msg = recipe.title + ' on Nuri - recipes by registered dietitians: https://www.nurirecipes.com';
              if (navigator.share) { navigator.share({ title: recipe.title, text: msg, url: 'https://www.nurirecipes.com' }); }
              else { window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank'); }
            }}>↗</button>
            <button className="card-save-btn" onClick={e => { e.stopPropagation(); onToggleSave(recipe.id); }}>
              {isSaved ? '❤️' : '🤍'}
            </button>
            </>
          )}
        </div>
        <div className="recipe-card-body">
          <div className="card-dietician" onClick={e => { e.stopPropagation(); if (!isLocked) onDieticianClick(d); }}>
            <Avatar initials={d.initials} color={d.avatarColor} photo={avatarSrc} cls="avatar-sm" />
            <div>
              <div className="dietician-name-sm">{d.name}</div>
              <div className="dietician-creds-sm">{d.credentials}</div>
            </div>
          </div>
          <div className="card-title">{hasPhoto ? `${recipe.emoji} ${recipe.title}` : recipe.title}</div>
          <div className="card-subtitle">{recipe.subtitle}</div>
          <div className="health-tags">{recipe.healthLabels.slice(0,3).map(l => <HealthTag key={l} label={l} />)}</div>
          <div className="card-meta">
            <span className="meta-item">⏱ {recipe.prepTime}</span>
            <span className="meta-item">🔥 {recipe.cookTime}</span>
            <span className="meta-item">🍽 {recipe.servings} servings</span>
          </div>
          {(() => {
            const m = getMacroCache()[recipe.id];
            if (!m) return null;
            return (
              <div className="macro-card-row">
                <span className="macro-pill-sm" style={{ background:'#7A9E7E22', color:'#3A6B4A' }}>{m.kcal} kcal</span>
                <span className="macro-pill-sm" style={{ background:'#7A9E7E22', color:'#3A6B4A' }}>{m.protein}g protein</span>
                <span className="macro-pill-sm" style={{ background:'#C4A26522', color:'#5C3D2E' }}>{m.carbs}g carbs</span>
              </div>
            );
          })()}
        </div>
      </div>
    </>
  );
}

function TopNav({ current, onChange, user, onSignIn, onSignOut }) {
  const links = [
    { id:'feed',    label:'Feed',    icon:'🏠' },
    { id:'explore', label:'Explore', icon:'🔍' },
    { id:'plan',    label:'Plan',    icon:'📅' },
    { id:'saved',   label:'Saved',   icon:'🤍' },
    { id:'about',   label:'About',   icon:'✦'  },
    { id:'you',     label:'You',     icon:'👤' },
  ];
  return (
    <header className="top-nav">
      <div className="top-nav-inner">
        <div className="top-nav-brand" onClick={() => onChange('feed')}>
          <span className="top-nav-sub">food that works for your body</span>
          <span className="top-nav-logo">nuri<span className="logo-dot" /></span>
        </div>
        <nav className="top-nav-links">
          {links.map(l => (
            <button key={l.id} className={`top-nav-link ${current === l.id ? 'active' : ''}`} onClick={() => onChange(l.id)}>
              <span className="nav-icon">{l.id === 'saved' ? (current === 'saved' ? '❤️' : '🤍') : l.icon}</span>
              <span className="nav-label">{l.id === 'saved' ? 'Saved' : l.label}</span>
            </button>
          ))}
          {user ? (
            <button className="top-nav-link" style={{ background:'var(--warm-beige)', color:'var(--brown)', fontWeight:600, marginLeft:4 }} onClick={onSignOut}>
              <span className="nav-label">{(user.name || user.email || '').split(/[@\s]/)[0]} · Sign out</span>
              <span className="nav-icon">👤</span>
            </button>
          ) : (
            <button className="top-nav-link" style={{ background:'var(--brown)', color:'white', fontWeight:600, marginLeft:4 }} onClick={onSignIn}>
              <span className="nav-label">Sign in</span>
              <span className="nav-icon">→</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}


// ── PAGES ─────────────────────────────────────────────────────
function ResetPasswordScreen({ onDone }) {
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const db = window._supa;

  const handleReset = async () => {
    setError('');
    if (!password || password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    const { error: e } = await db.auth.updateUser({ password });
    setLoading(false);
    if (e) { setError(e.message); return; }
    setDone(true);
    setTimeout(onDone, 2000);
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--cream)'}}>
      <div style={{background:'var(--white)',borderRadius:'var(--radius)',padding:'40px 36px',maxWidth:400,width:'100%',boxShadow:'var(--shadow)'}}>
        <div style={{fontFamily:'var(--font-logo)',fontSize:28,fontStyle:'italic',fontWeight:600,color:'var(--green-dark)',marginBottom:24}}>
          nuri<span style={{display:'inline-block',width:7,height:7,borderRadius:'50%',background:'var(--rose)',marginLeft:2,marginBottom:2}} />
        </div>
        <h2 style={{fontFamily:'var(--font-serif)',fontSize:24,fontStyle:'italic',fontWeight:600,marginBottom:8,color:'var(--text)'}}>Set new password</h2>
        {done ? (
          <p style={{color:'var(--green-dark)',fontSize:14}}>✅ Password updated! Signing you in…</p>
        ) : (
          <>
            {error && <div className="auth-error">{error}</div>}
            <div className="auth-field" style={{marginTop:16}}>
              <label className="auth-label">New password</label>
              <input className="auth-input" type="password" placeholder="At least 6 characters" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div className="auth-field">
              <label className="auth-label">Confirm password</label>
              <input className="auth-input" type="password" placeholder="Repeat your password" value={confirm} onChange={e => setConfirm(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleReset()} />
            </div>
            <button className="auth-btn" onClick={handleReset} disabled={loading} style={{marginTop:8}}>
              {loading ? 'Saving…' : 'Set new password'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const WELCOME_CONDITIONS = [
  { key:'pcos', slug:'pcos', label:'PCOS / PMOS', blurb:"Recipes built to lower inflammation and support hormone balance — without cutting out real food." },
  { key:'hormones', slug:'hormones', label:'Hormones', blurb:"Recipes designed around how your hormones actually work — not generic wellness advice." },
  { key:'insulin-resistance', slug:'insulin-resistance', label:'Insulin Resistance', blurb:"Blood sugar-friendly meals that don't feel like restriction." },
  { key:'gut', slug:'gut-health', label:'Gut Health', blurb:"Gut-friendly meals that actually taste like food, not a protocol." },
  { key:'endometriosis', slug:'endometriosis', label:'Endometriosis', blurb:"Anti-inflammatory recipes designed around flare days and everything in between." },
  { key:'immune', slug:'immune-health', label:'Immune Health', blurb:"Recipes built to support your immune system, day to day." },
  { key:'menopause', slug:'menopause', label:'Menopause', blurb:"Food for the transition — hormone-aware, symptom-aware, judgment-free." },
  { key:'thyroid', slug:'thyroid', label:'Thyroid', blurb:"Recipes built around the nutrients your thyroid actually needs." },
  { key:'fertility', slug:'fertility', label:'Fertility', blurb:"Recipes designed to support your body through trying to conceive." },
];

const WELCOME_OCCASIONS = ['15-minute weeknights', 'Sunday meal prep', 'A busy night out', 'When you have nothing left tonight'];

/* Lightweight teaser dataset for the marketing landing page — kept separate from the
   in-app RECIPES catalog so this page never depends on auth state or the full recipe payload. */
const WELCOME_TEASER_RECIPES = [
  {id:1,title:'Pumpkin, Orange & Zaatar Soup',emoji:'🎃',photo:'https://images.squarespace-cdn.com/content/v1/5f6dcaff3971e61f55a10122/6955a58e920e3020578746fb/1770821699612/soup+2.jpg?format=800w',healthLabels:['pcos','hormones','gut','vegetarian'],prepTime:'15 min',cookTime:'75 min'},
  {id:2,title:'Soft & Chewy Oatmeal Chocolate Chip Cookies',emoji:'🍪',photo:'https://images.squarespace-cdn.com/content/v1/5f6dcaff3971e61f55a10122/682624cad29e5148a3cdf047/1750963301821/13cc14cf-97c3-44ee-9645-6dd73ca26231.jpg?format=800w',healthLabels:['pcos','hormones','vegetarian'],prepTime:'10 min',cookTime:'25 min'},
  {id:3,title:'Citrus Roasted Salmon',emoji:'🐟',photo:'https://images.squarespace-cdn.com/content/v1/5f6dcaff3971e61f55a10122/66bdab540360b04c1e129d61/1723795250313/Feature+image.jpeg?format=800w',healthLabels:['pcos','endometriosis','anti-inflammatory','gluten-free','dairy-free','high-protein'],prepTime:'15 min',cookTime:'40 min'},
  {id:4,title:'Moroccan Inspired Traybake',emoji:'🥕',photo:'https://images.squarespace-cdn.com/content/v1/5f6dcaff3971e61f55a10122/654fb1f084fd254ec1e6c616/1706264040640/Blog+Feature+Image.jpeg?format=800w',healthLabels:['pcos','hormones','anti-inflammatory','vegetarian','vegan','gluten-free','dairy-free'],prepTime:'15 min',cookTime:'40 min'},
  {id:5,title:'Protein Pancakes',emoji:'🥞',photo:'https://images.squarespace-cdn.com/content/v1/5f6dcaff3971e61f55a10122/64d5fb2c2d8da932d1d8ca75/1695730700022/Blog+feature+image+Protein+pancakes.jpeg?format=800w',healthLabels:['pcos','hormones','vegetarian','gluten-free','dairy-free'],prepTime:'5 min',cookTime:'15 min'},
  {id:6,title:'Chickpea & Aubergine Stew',emoji:'🍆',photo:'',healthLabels:['pcos','gut','anti-inflammatory','vegetarian','vegan','gluten-free','dairy-free'],prepTime:'15 min',cookTime:'30 min'},
  {id:7,title:'Veggie & Cheese Frittata',emoji:'🥚',photo:'https://images.squarespace-cdn.com/content/v1/5f6dcaff3971e61f55a10122/60ec43136e267257945cbf62/1695730794461/IMG_6587-2.jpg?format=800w',healthLabels:['pcos','fertility','hormones','vegetarian','gluten-free'],prepTime:'10 min',cookTime:'20 min'},
  {id:8,title:'Roasted Beetroot',emoji:'🔴',photo:'https://images.squarespace-cdn.com/content/v1/5f6dcaff3971e61f55a10122/68dfb6d77be4bb063728f4d6/1765443955429/main.jpg?format=800w',healthLabels:['pcos','anti-inflammatory','vegetarian','vegan','gluten-free','dairy-free'],prepTime:'10 min',cookTime:'45 min'},
  {id:9,title:'Squash Soup',emoji:'🍵',photo:'',healthLabels:['pcos','gut','vegetarian','gluten-free'],prepTime:'10 min',cookTime:'35 min'},
  {id:10,title:'Coconut & Butternut Squash Curry',emoji:'🍛',photo:'https://images.squarespace-cdn.com/content/v1/5f6dcaff3971e61f55a10122/5f90f84f585dd565cc3432fb/1710293434680/2024-02-19%2B09.55.17.jpg?format=800w',healthLabels:['pcos','anti-inflammatory','vegetarian','vegan','gluten-free','dairy-free'],prepTime:'15 min',cookTime:'35 min'},
  {id:11,title:'Homemade Oreo Cookies',emoji:'🖤',photo:'',healthLabels:['pcos','hormones','vegetarian'],prepTime:'20 min',cookTime:'15 min'},
  {id:12,title:'Aubergine with Green Beans & Freekeh',emoji:'🥗',photo:'',healthLabels:['pcos','gut','anti-inflammatory','vegetarian','vegan','dairy-free'],prepTime:'15 min',cookTime:'30 min'},
  {id:13,title:'Cauliflower, Pomegranate & Pistachio Salad',emoji:'🥦',photo:'https://images.squarespace-cdn.com/content/v1/5f6dcaff3971e61f55a10122/60b5a7ced093263ad54f68d6/1695730872701/IMG_5471.jpg?format=800w',healthLabels:['pcos','anti-inflammatory','vegetarian','vegan','gluten-free','dairy-free'],prepTime:'10 min',cookTime:'25 min'},
  {id:14,title:'Chocolate Date Cake',emoji:'🍰',photo:'https://images.squarespace-cdn.com/content/v1/5f6dcaff3971e61f55a10122/611912332d65e7269d934c8d/1695730777376/IMG_7259.jpg?format=800w',healthLabels:['pcos','hormones','vegetarian'],prepTime:'20 min',cookTime:'35 min'},
  {id:15,title:'Squash with Chilli Yoghurt & Coriander Sauce',emoji:'🌶',photo:'https://images.squarespace-cdn.com/content/v1/5f6dcaff3971e61f55a10122/608bac351625d50fe195eb57/1619766340907/IMG_4988_2.jpg?format=800w',healthLabels:['pcos','hormones','vegetarian','gluten-free'],prepTime:'15 min',cookTime:'40 min'},
  {id:16,title:'Wintery Parsnip Soup',emoji:'🍂',photo:'',healthLabels:['pcos','gut','vegetarian','gluten-free'],prepTime:'10 min',cookTime:'35 min'},
  {id:17,title:'Spinach & Sweet Potato Dahl',emoji:'🌿',photo:'',healthLabels:['pcos','hormones','anti-inflammatory','vegetarian','vegan','gluten-free','dairy-free'],prepTime:'10 min',cookTime:'30 min'},
  {id:18,title:'Chickpea, Mango & Cauliflower Salad',emoji:'🥭',photo:'',healthLabels:['pcos','gut','anti-inflammatory','vegetarian','vegan','gluten-free','dairy-free'],prepTime:'15 min',cookTime:'25 min'},
  {id:19,title:'Peanut Butter Balls',emoji:'🥜',photo:'',healthLabels:['pcos','hormones','energy','vegetarian','gluten-free'],prepTime:'15 min',cookTime:'0 min'},
  {id:20,title:'Roasted Mixed Veg with Yoghurt & Chilli Oil',emoji:'🌈',photo:'https://images.squarespace-cdn.com/content/v1/5f6dcaff3971e61f55a10122/5ff7dc13b2c4ae564e1104c6/1695730989420/IMG_0873.jpg?format=800w',healthLabels:['pcos','hormones','vegetarian','gluten-free'],prepTime:'15 min',cookTime:'35 min'},
  {id:21,title:'Lentil Bolognese',emoji:'🍝',photo:'https://images.squarespace-cdn.com/content/v1/5f6dcaff3971e61f55a10122/66e6aaecf767460e0590c6f5/1726560029569/IMG_2410.jpeg?format=800w',healthLabels:['pcos','gut','anti-inflammatory','vegetarian','vegan','gluten-free','dairy-free'],prepTime:'15 min',cookTime:'30 min'},
  {id:22,title:'Cauliflower Shrimp Fried Rice',emoji:'🦐',photo:'https://zgjtibyhuhpibrxcormd.supabase.co/storage/v1/object/public/recipe-images/recipe-22-1778772290962',healthLabels:['pcos','hormones','insulin-resistance','gluten-free'],prepTime:'10 min',cookTime:'15 min'},
  {id:23,title:'Berry Chia Pudding',emoji:'🫐',photo:'https://zgjtibyhuhpibrxcormd.supabase.co/storage/v1/object/public/recipe-images/recipe-23-1778807281758',healthLabels:['pcos','hormones','energy','insulin-resistance','vegan','gluten-free','dairy-free'],prepTime:'5 min',cookTime:'0 min'},
  {id:24,title:'Egg Muffins',emoji:'🥚',photo:'https://zgjtibyhuhpibrxcormd.supabase.co/storage/v1/object/public/recipe-images/recipe-24-1778807124046',healthLabels:['pcos','energy','hormones','vegetarian','gluten-free'],prepTime:'10 min',cookTime:'25 min'},
  {id:25,title:'Spicy Peanut Tofu Stir-Fry',emoji:'🥜',photo:'https://zgjtibyhuhpibrxcormd.supabase.co/storage/v1/object/public/recipe-images/recipe-25-1778807142926',healthLabels:['pcos','hormones','anti-inflammatory','vegan','insulin-resistance','high-protein'],prepTime:'10 min',cookTime:'15 min'},
  {id:26,title:'Mediterranean Quinoa Bowl',emoji:'🥗',photo:'https://zgjtibyhuhpibrxcormd.supabase.co/storage/v1/object/public/recipe-images/recipe-26-1778807153850',healthLabels:['pcos','hormones','anti-inflammatory','vegetarian','gluten-free','insulin-resistance'],prepTime:'10 min',cookTime:'15 min'},
  {id:27,title:'Salmon Avocado Cucumber Boats',emoji:'🥑',photo:'https://zgjtibyhuhpibrxcormd.supabase.co/storage/v1/object/public/recipe-images/recipe-27-1778807162526',healthLabels:['pcos','hormones','anti-inflammatory','gluten-free','dairy-free','insulin-resistance','high-protein'],prepTime:'10 min',cookTime:'10 min'},
  {id:28,title:'Sweet Potato Egg Hash',emoji:'🍳',photo:'https://zgjtibyhuhpibrxcormd.supabase.co/storage/v1/object/public/recipe-images/recipe-28-1778807172760',healthLabels:['pcos','energy','hormones','vegetarian','gluten-free','dairy-free','insulin-resistance','high-protein'],prepTime:'10 min',cookTime:'20 min'},
  {id:29,title:'Zucchini Turkey Taco Skillet',emoji:'🌮',photo:'https://zgjtibyhuhpibrxcormd.supabase.co/storage/v1/object/public/recipe-images/recipe-29-1778807182307',healthLabels:['pcos','hormones','high-protein','gluten-free','dairy-free','insulin-resistance'],prepTime:'10 min',cookTime:'15 min'},
  {id:30,title:'Cinnamon Almond Yogurt Bowl',emoji:'🍓',photo:'https://zgjtibyhuhpibrxcormd.supabase.co/storage/v1/object/public/recipe-images/recipe-30-1778807199192',healthLabels:['pcos','energy','hormones','vegetarian','gluten-free','insulin-resistance'],prepTime:'5 min',cookTime:'0 min'},
  {id:31,title:'Turmeric Coconut Chickpea Curry',emoji:'🍛',photo:'https://zgjtibyhuhpibrxcormd.supabase.co/storage/v1/object/public/recipe-images/recipe-31-1778807270530',healthLabels:['pcos','anti-inflammatory','gut','hormones','vegan','gluten-free','dairy-free','insulin-resistance'],prepTime:'5 min',cookTime:'15 min'},
  {id:52,title:'Peanut Butter Energy Oat Bites',emoji:'🍽',photo:'https://zgjtibyhuhpibrxcormd.supabase.co/storage/v1/object/public/recipe-images/recipe-52-1780422121888',healthLabels:['pcos','insulin-resistance','vegetarian'],prepTime:'10',cookTime:''},
  {id:53,title:'Fresh Quinoa and Salmon Salad',emoji:'🥗',photo:'',healthLabels:['pcos','endometriosis','thyroid','insulin-resistance','high-protein'],prepTime:'',cookTime:''},
  {id:54,title:'Low FODMAP Immunity Smoothie',emoji:'🥤',photo:'',healthLabels:['gut','anti-inflammatory','immune','vegetarian'],prepTime:'5',cookTime:''},
  {id:55,title:'Protein packed egg bites',emoji:'🥚',photo:'',healthLabels:['pcos','endometriosis','thyroid','vegetarian','high-protein','fertility'],prepTime:'10',cookTime:'20'},
  {id:56,title:'Rich and Creamy Chocolate Peanut Butter Fruit Dip',emoji:'🍫',photo:'',healthLabels:['pcos','hormones','anti-inflammatory','insulin-resistance','vegetarian'],prepTime:'5',cookTime:''},
  {id:57,title:'Double Chocolate Banana Bread',emoji:'🍌',photo:'https://zgjtibyhuhpibrxcormd.supabase.co/storage/v1/object/public/recipe-images/recipe-57-1780663176270',healthLabels:['pcos','hormones','anti-inflammatory','vegetarian'],prepTime:'20',cookTime:'55'},
  {id:58,title:'Lentil & Walnut Bolognese',emoji:'🍽',photo:'https://zgjtibyhuhpibrxcormd.supabase.co/storage/v1/object/public/recipe-images/recipe-58-1780663538596',healthLabels:['gut','anti-inflammatory'],prepTime:'10',cookTime:'35'},
  {id:59,title:'Mediterranean Turkey Bowls',emoji:'🥙',photo:'',healthLabels:['pcos','high-protein','endometriosis','insulin-resistance'],prepTime:'15',cookTime:''},
  {id:60,title:'4 Ingredient Overnight Creamy Chia Pudding',emoji:'🫐',photo:'https://zgjtibyhuhpibrxcormd.supabase.co/storage/v1/object/public/recipe-images/recipe-60-1780670125707',healthLabels:['pcos','gut','endometriosis','vegetarian','gluten-free'],prepTime:'10',cookTime:'0'},
  {id:61,title:'Strawberry Kiwi Immunity Pops',emoji:'🍓',photo:'',healthLabels:['anti-inflammatory','gut','immune','vegetarian','gluten-free'],prepTime:'5',cookTime:'0'},
  {id:62,title:'Split Pea Soup',emoji:'🍲',photo:'',healthLabels:['dairy-free','hormones','energy','budget-friendly','high-protein','pcos','gut','meal-prep','high-fiber','insulin-resistance','menopause'],prepTime:'15 min',cookTime:'75 min'},
  {id:63,title:'2-Ingredient High-Protein Bagels',emoji:'🥯',photo:'',healthLabels:['hormones','energy','freezer-friendly','vegetarian','high-protein','pcos','meal-prep','insulin-resistance','menopause'],prepTime:'10 minutes',cookTime:'25 minutes'},
  {id:64,title:'Spring Vegetable Cream Cheese Spread',emoji:'🥒',photo:'',healthLabels:['snack','energy','hormones','quick-easy','immune','vegetarian','gut','meal-prep'],prepTime:'10 minutes',cookTime:'0 minutes'},
  {id:65,title:'Cherry Chocolate High-Protein Pudding',emoji:'🍒',photo:'',healthLabels:['snack','energy','hormones','no-bake','dessert','vegetarian','high-protein','pcos','gluten-free','insulin-resistance'],prepTime:'10 minutes',cookTime:'0 minutes'},
  {id:66,title:'Mediterranean Chicken Power Bowl',emoji:'🥗',photo:'',healthLabels:['energy','hormones','high-protein','pcos','gluten-free','meal-prep','high-fiber','insulin-resistance','menopause'],prepTime:'15 minutes',cookTime:'20 minutes'},
  {id:67,title:'Southwest Cottage Cheese Taco Bowl',emoji:'🌮',photo:'',healthLabels:['hormones','energy','high-protein','pcos','meal-prep','gluten-free','high-fiber','insulin-resistance'],prepTime:'10 minutes',cookTime:'20 minutes'},
  {id:68,title:'Lemon Blueberry Baked Oatmeal',emoji:'🫐',photo:'',healthLabels:['hormones','energy','breakfast','vegetarian','high-protein','pcos','meal-prep','high-fiber','insulin-resistance'],prepTime:'10 minutes',cookTime:'35 minutes'},
  {id:69,title:'Sheet Pan Maple Dijon Salmon & Brussels Sprouts',emoji:'🐟',photo:'',healthLabels:['menopause','thyroid','dairy-free','energy','hormones','immune','high-protein','meal-prep','gluten-free'],prepTime:'10 minutes',cookTime:'25 minutes'},
  {id:86,title:'Mediterranean Turmeric Salmon & Lentil Power Bowl',emoji:'🍽',photo:'',healthLabels:['pcos','insulin-resistance','anti-inflammatory'],prepTime:'15 min',cookTime:'20 min'},
  {id:87,title:'Dark Chocolate Tahini Fudge Squares',emoji:'🍽',photo:'',healthLabels:['pcos','insulin-resistance','anti-inflammatory'],prepTime:'15 minutes',cookTime:'2 hours'},
  {id:88,title:'Chocolate Almond Cottage Cheese Truffles',emoji:'🍽',photo:'',healthLabels:['pcos','anti-inflammatory','insulin-resistance'],prepTime:'10 minutes',cookTime:'1 hour'},
  {id:89,title:'Crispy Parmesan Zucchini Chips with Herbed Greek Yogurt Dip',emoji:'🍽',photo:'',healthLabels:['pcos','insulin-resistance','anti-inflammatory'],prepTime:'10 minutes',cookTime:'25 minutes'},
  {id:90,title:'Cinnamon Almond Pancakes',emoji:'🍽',photo:'',healthLabels:['pcos','high-protein','anti-inflammatory','insulin-resistance'],prepTime:'5 minutes',cookTime:'10 minutes'},
  {id:91,title:'Buffalo Chicken Stuffed Bell Peppers',emoji:'🍽',photo:'',healthLabels:['pcos','anti-inflammatory','high-protein','insulin-resistance'],prepTime:'15 minutes',cookTime:'25 minutes'},
  {id:92,title:'25 Minute Peanut Butter Noodles',emoji:'🍽',photo:'https://zgjtibyhuhpibrxcormd.supabase.co/storage/v1/object/public/recipe-images/recipe-92-1783611689523',healthLabels:['pcos','endometriosis','hormones','gut','vegetarian','anti-inflammatory','dairy-free','quick-easy','high-fiber','gluten-free','vegan','high-protein'],prepTime:'10 min',cookTime:'15 min'},
];

function Welcome({ onSignIn, onSignUp }) {
  const previewRecipes = WELCOME_TEASER_RECIPES.slice(0, 3);
  const [activeCondition, setActiveCondition] = useState('pcos');
  const activeInfo = WELCOME_CONDITIONS.find(c => c.key === activeCondition);
  const conditionRecipes = WELCOME_TEASER_RECIPES.filter(r => r.healthLabels.includes(activeCondition)).slice(0, 6);

  return (
    <div className="welcome-page">
      <a className="chronically-launch-bar" href="./chronically.html" aria-label="Read Chronically, the newsletter by Nuri">
        <span className="chronically-launch-kicker">New from Nuri</span>
        <span className="chronically-launch-title">Chronically ♡ The newsletter by Nuri</span>
        <span className="chronically-launch-link">Read it →</span>
      </a>
      <div className="welcome-hero">
        <div className="welcome-left">
          <div className="welcome-brand-line">nutrition made by registered dietitians</div>
          <h1 className="welcome-headline">Food that works for your body.</h1>
          <p className="welcome-sub">
            Nutrition made entirely by registered dietitians — for women managing hormonal and chronic health. Real, delicious food with clinical expertise, right in your kitchen.
          </p>
          <div className="wl-left-actions" style={{display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
            <button className="welcome-cta" onClick={onSignUp}>Create your account</button>
            <button className="welcome-cta-ghost" onClick={onSignIn}>Already have an account? Sign in</button>
          </div>
          <p className="welcome-note">Every recipe is written and reviewed by a registered dietitian — no one else touches it.</p>
        </div>
        <div className="welcome-right">
          <div className="welcome-recipe-stack">
            {previewRecipes.map(r => (
              <div key={r.id} className="welcome-mini-card">
                {r.photo ? (
                  <img className="welcome-mini-photo" src={r.photo} alt={r.title} onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                ) : null}
                <div className="welcome-mini-fallback" style={{ display: r.photo ? 'none' : 'flex' }}>{r.emoji}</div>
                <div className="welcome-mini-overlay">
                  <div className="welcome-mini-title">{r.title}</div>
                  <div className="welcome-mini-tag">{r.healthLabels.slice(0,2).map(l => LABEL_MAP[l]?.label).filter(Boolean).join(' · ')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="wl-section wl-picker">
        <div className="wl-eyebrow">no explaining required</div>
        <h2 className="wl-section-title">What are you managing?</h2>
        <p className="wl-section-sub">Just tell us — we'll show you what's built for it.</p>
        <div className="wl-pill-row">
          {WELCOME_CONDITIONS.map(c => (
            <button key={c.key} className={`wl-pill ${activeCondition === c.key ? 'active' : ''}`} onClick={() => setActiveCondition(c.key)}>{c.label}</button>
          ))}
        </div>
        <p style={{fontSize:14,color:'var(--text-mid)',marginBottom:20,maxWidth:520}}>{activeInfo?.blurb}</p>
        {conditionRecipes.length > 0 ? (
          <div className="wl-teaser-grid">
            {conditionRecipes.map(r => (
              <div key={r.id} className="wl-teaser-card">
                <div className="wl-teaser-emoji">{r.emoji}</div>
                <div className="wl-teaser-title">{r.title}</div>
                <div className="wl-teaser-meta">{[r.prepTime && `${r.prepTime} prep`, r.cookTime && `${r.cookTime} cook`].filter(Boolean).join(' · ') || 'Dietitian-reviewed'}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="wl-teaser-empty">More {activeInfo?.label} recipes are added every week — sign up to be first to see them.</p>
        )}
      </div>

      <div className="wl-section wl-lifestyle">
        <div className="wl-eyebrow">built for your actual week</div>
        <h2 className="wl-section-title">Not just your condition. Your life, too.</h2>
        <div className="wl-chip-row">
          {WELCOME_OCCASIONS.map(o => <div key={o} className="wl-chip">{o}</div>)}
        </div>
      </div>

      <div className="wl-section wl-trust">
        <div className="wl-eyebrow">built by women, for women</div>
        <h2 className="wl-section-title">Built by women, for women.</h2>
        <p className="wl-trust-text">
          We got tired of finding out the hard way what most wellness content actually is — someone else's guess, dressed up as certainty. Every recipe on nuri. is written and reviewed by a registered dietitian.
        </p>
        <button className="welcome-cta" onClick={onSignUp}>Create your account</button>
      </div>
    </div>
  );
}

function WelcomeBack({ userName, onContinue }) {
  const firstName = userName ? userName.split(/[@\s]/)[0] : null;
  return (
    <div className="onboarding-wrap" style={{ textAlign:'center', maxWidth:500 }}>
      <div style={{ fontFamily:'var(--font-logo)', fontSize:48, fontStyle:'italic', fontWeight:600, color:'var(--green-dark)', display:'inline-flex', alignItems:'flex-end', marginBottom:24 }}>
        nuri<span style={{ display:'inline-block', width:10, height:10, borderRadius:'50%', background:'var(--rose)', marginLeft:2, marginBottom:3 }} />
      </div>
      <h1 style={{ fontFamily:'var(--font-serif)', fontSize:36, fontStyle:'italic', fontWeight:600, color:'var(--text)', lineHeight:1.2, marginBottom:16 }}>
        {firstName ? `Welcome back, ${firstName}.` : 'Welcome back.'}
      </h1>
      <p style={{ fontSize:15, color:'var(--text-mid)', lineHeight:1.7, marginBottom:36, maxWidth:400, margin:'0 auto 36px' }}>
        Your recipes are ready for you.
      </p>
      <button className="onboarding-btn" onClick={onContinue}>
        Take me in →
      </button>
    </div>
  );
}

function ShareNuriScreen({ userName, onContinue }) {
  const firstName = userName ? userName.split('@')[0].split(' ')[0] : 'there';
  const shareUrl = 'https://www.nurirecipes.com';
  const shareMsg = 'I found Nuri — recipes built by registered dietitians for PCOS, endo and hormonal conditions. You need to try it: ' + shareUrl;

  const doShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'Nuri', text: shareMsg, url: shareUrl });
    } else {
      window.open('https://wa.me/?text=' + encodeURIComponent(shareMsg), '_blank');
    }
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--cream)',padding:'24px'}}>
      <div style={{maxWidth:480,width:'100%',textAlign:'center'}}>
        <div style={{fontFamily:'var(--font-logo)',fontSize:40,fontStyle:'italic',fontWeight:600,color:'var(--green-dark)',display:'inline-flex',alignItems:'flex-end',marginBottom:32}}>
          nuri<span style={{display:'inline-block',width:9,height:9,borderRadius:'50%',background:'var(--rose)',marginLeft:2,marginBottom:3}} />
        </div>
        <h1 style={{fontFamily:'var(--font-serif)',fontSize:32,fontStyle:'italic',fontWeight:600,color:'var(--text)',lineHeight:1.2,marginBottom:12}}>
          Welcome, {firstName} 🌿
        </h1>
        <p style={{fontSize:15,color:'var(--text-mid)',lineHeight:1.7,marginBottom:32,maxWidth:380,margin:'0 auto 32px'}}>
          Your recipes are ready. Know someone who would love food built for their hormones?
        </p>
        <button onClick={doShare} style={{display:'block',width:'100%',maxWidth:340,margin:'0 auto 12px',padding:'14px 0',background:'var(--brown)',color:'white',border:'none',borderRadius:50,fontFamily:'var(--font-body)',fontSize:15,fontWeight:600,cursor:'pointer'}}>
          Share Nuri with a friend 🌿
        </button>
        <button onClick={onContinue} style={{background:'none',border:'none',color:'var(--text-light)',fontSize:13,cursor:'pointer',fontFamily:'var(--font-body)',textDecoration:'underline'}}>
          Skip for now
        </button>
      </div>
    </div>
  );
}

function WelcomeSlide({ userName, healthGoals, onContinue }) {
  const firstName = userName ? userName.split(/[@\s]/)[0] : null;
  const matchedGoals = HEALTH_GOALS.filter(g => healthGoals?.includes(g.id));
  return (
    <div className="onboarding-wrap" style={{ textAlign:'center', maxWidth:600 }}>
      <div style={{ fontFamily:'var(--font-logo)', fontSize:48, fontStyle:'italic', fontWeight:600, color:'var(--green-dark)', display:'inline-flex', alignItems:'flex-end', marginBottom:24 }}>
        nuri<span style={{ display:'inline-block', width:10, height:10, borderRadius:'50%', background:'var(--rose)', marginLeft:2, marginBottom:3 }} />
      </div>

      <h1 style={{ fontFamily:'var(--font-serif)', fontSize:36, fontStyle:'italic', fontWeight:600, color:'var(--text)', lineHeight:1.2, marginBottom:12 }}>
        {firstName ? `Welcome, ${firstName}.` : 'Welcome.'}
      </h1>
      <p style={{ fontSize:16, color:'var(--text-mid)', lineHeight:1.7, marginBottom:32, maxWidth:460, margin:'0 auto 32px' }}>
        nuri. is a recipe platform built specifically for women managing hormonal and digestive conditions — every recipe created by a registered dietitian who specialises in your condition.
      </p>

      {matchedGoals.length > 0 && (
        <div style={{ background:'var(--warm-beige)', borderRadius:'var(--radius)', padding:'20px 24px', marginBottom:32, display:'inline-block', textAlign:'left', maxWidth:400 }}>
          <div style={{ fontSize:11, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--tan)', marginBottom:12 }}>Your feed is personalised for</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {matchedGoals.map(g => (
              <span key={g.id} style={{ padding:'6px 14px', borderRadius:50, background:g.color, fontSize:13, fontWeight:500, color:'var(--text)' }}>
                {g.icon} {g.label}
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:14, maxWidth:380, margin:'0 auto 36px' }}>
        {[
          { icon:'🩺', text:'Every recipe written by a verified registered dietitian' },
          { icon:'🌸', text:'Condition-specific — not generic "healthy eating"' },
          { icon:'📅', text:'Build your weekly meal plan and track how food makes you feel' },
        ].map(({ icon, text }) => (
          <div key={text} style={{ display:'flex', alignItems:'center', gap:12, textAlign:'left' }}>
            <span style={{ fontSize:20, flexShrink:0 }}>{icon}</span>
            <span style={{ fontSize:14, color:'var(--text-mid)', lineHeight:1.5 }}>{text}</span>
          </div>
        ))}
      </div>

      <button className="onboarding-btn" onClick={onContinue}>
        Explore my recipes →
      </button>
    </div>
  );
}

function Onboarding({ onComplete, userName }) {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState([]);
  const [cookingPrefs, setCookingPrefs] = useState([]);
  const toggle = id => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleCooking = id => setCookingPrefs(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const renderGoal = g => (
    <div key={g.id} className={`goal-card ${selected.includes(g.id) ? 'selected' : ''}`} onClick={() => toggle(g.id)}>
      <div className="goal-card-bg" style={{ background: g.color }} />
      <div className="goal-icon">{g.icon}</div>
      <div className="goal-label">{g.label}</div>
      <div className="goal-desc">{g.description}</div>
      <div className="goal-check">✓</div>
    </div>
  );

  if (step === 2) {
    return (
      <div className="onboarding-wrap">
        <div className="onboarding-head">
          <div className="onboarding-step">Personalise your feed</div>
          <h1 className="onboarding-title">How do you like to cook?</h1>
          <p className="onboarding-sub">Optional — pick as many as apply, or skip this for now.</p>
        </div>
        <div className="onboarding-grid-two">
          {COOKING_STYLE_OPTIONS.map(g => (
            <div key={g.id} className={`goal-card ${cookingPrefs.includes(g.id) ? 'selected' : ''}`} onClick={() => toggleCooking(g.id)}>
              <div className="goal-card-bg" style={{ background: g.color }} />
              <div className="goal-icon">{g.icon}</div>
              <div className="goal-label">{g.label}</div>
              <div className="goal-desc">{g.description}</div>
              <div className="goal-check">✓</div>
            </div>
          ))}
        </div>
        <div className="onboarding-actions">
          <button className="onboarding-btn" onClick={() => onComplete(selected, cookingPrefs)}>
            {cookingPrefs.length === 0 ? 'Show my feed' : `Show my feed (${cookingPrefs.length} selected)`}
          </button>
          <button className="onboarding-skip" onClick={() => onComplete(selected, [])}>Skip this step</button>
          <button className="onboarding-skip" style={{marginTop:4}} onClick={() => setStep(1)}>← Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="onboarding-wrap">
      <div className="onboarding-head">
        <div className="onboarding-step">Personalise your feed</div>
        <h1 className="onboarding-title">What are you managing?</h1>
        <p className="onboarding-sub">Select all that feel relevant — we'll tailor your recipe feed to your condition.</p>
      </div>
      <div className="onboarding-grid-top">
        {HEALTH_GOALS.slice(0, 3).map(renderGoal)}
      </div>
      <div className="onboarding-grid">
        {HEALTH_GOALS.slice(3, 7).map(renderGoal)}
      </div>
      <div className="onboarding-grid">
        {HEALTH_GOALS.slice(7, 11).map(renderGoal)}
      </div>
      <div className="onboarding-actions">
        <button className="onboarding-btn" onClick={() => setStep(2)} disabled={selected.length === 0}>
          {selected.length === 0 ? 'Select at least one' : `Continue (${selected.length} selected)`}
        </button>
        <button className="onboarding-skip" onClick={() => onComplete([], [])}>Browse all recipes</button>
      </div>
    </div>
  );
}

function interleaveByAuthor(recipes) {
  // Group by dieticianId, then round-robin interleave so no author clumps
  const groups = {};
  recipes.forEach(r => { (groups[r.dieticianId] = groups[r.dieticianId] || []).push(r); });
  const queues = Object.values(groups);
  const result = [];
  let i = 0;
  while (queues.some(q => q.length > 0)) {
    const q = queues[i % queues.length];
    if (q.length > 0) result.push(q.shift());
    i++;
  }
  return result;
}

const FREE_PREVIEW_COUNT = 3;

// ── STRIPE CONFIG ─────────────────────────────────────────────
const NURI_PREMIUM_PRICE_ID = 'price_1TWUKf1strcTxBlboRSq9F53';
const STRIPE_PAYMENT_LINK_MONTHLY = 'https://buy.stripe.com/cNibIT6mWbB58Xbecl7wA02';
const STRIPE_PAYMENT_LINK_ANNUAL  = 'https://buy.stripe.com/9B6bITaDcfRlc9nd8h7wA03';
// Premium settings loaded from Supabase (is_premium, free_recipe_count per dietitian)
const FALLBACK_FREE_DIETITIANS = [1, 2, 3];
const FALLBACK_FREE_RECIPE_COUNT = 3;

function FeedTab({ healthGoals, onRecipeClick, onDieticianClick, saved, onToggleSave, user, onSignIn, isPremium, onSubscribe, supaRecipes, supaDietitians, premiumSettings, newSupaRecipes, supaAllDietitians, dietaryPreferences, onDietaryChange, showShareBanner, setShowShareBanner }) {
  const [active, setActive] = useState(healthGoals?.length > 0 ? healthGoals[0] : 'all');
  const [showDietaryDropdown, setShowDietaryDropdown] = useState(false);
  const [showCookingDropdown, setShowCookingDropdown] = useState(false);
  const activeDietary = dietaryPreferences || [];
  const getLocalD = (id) => { const nid = parseInt(id, 10); return ALL_DIETICIANS.find(d => d.id === nid) || (supaAllDietitians || []).find(d => d.id === nid) || { id: nid, name:'Unknown', credentials:'RD', initials:'?', avatarColor:'#C4A882', photo:null }; };

  const DIETARY_FILTERS = [
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'gluten-free', label: 'Gluten-free' },
    { id: 'dairy-free', label: 'Dairy-free' },
    { id: 'high-protein', label: 'High Protein' },
    { id: 'high-fiber', label: 'High Fiber' },
  ];

  // Cooking-style is a second, separate dropdown in the UI (how you cook, not
  // what's in it) but shares the same underlying tag array/Supabase field as
  // Dietary — both are just tags checked against a recipe's healthLabels.
  // Uses the shared COOKING_STYLE_OPTIONS constant (also used by onboarding and the You tab).
  const COOKING_STYLE_FILTERS = COOKING_STYLE_OPTIONS;

  const activeDietaryCount = activeDietary.filter(id => DIETARY_FILTERS.some(f => f.id === id)).length;
  const activeCookingCount = activeDietary.filter(id => COOKING_STYLE_FILTERS.some(f => f.id === id)).length;

  const toggleDietary = (id) => {
    const next = activeDietary.includes(id) ? activeDietary.filter(x => x !== id) : [...activeDietary, id];
    onDietaryChange(next);
  };
  const clearGroup = (group) => {
    onDietaryChange(activeDietary.filter(id => !group.some(f => f.id === id)));
  };

  const mergedRecipes = useMemo(() => {
    const hardcoded = ALL_RECIPES.map(r => ({ ...r, ...(supaRecipes?.[r.id] || {}) }));
    const newOnes = (newSupaRecipes || []).filter(r => !ALL_RECIPES.find(x => x.id === r.id));
    return [...hardcoded, ...newOnes];
  }, [supaRecipes, newSupaRecipes]);
  const mergedDietitians = useMemo(() => ALL_DIETICIANS.map(d => ({
    ...d, ...(supaDietitians?.[d.id] || {}),
  })), [supaDietitians]);
  const filtered = useMemo(() => {
    let base = active === 'all' ? mergedRecipes : mergedRecipes.filter(r => r.healthLabels.includes(active));
    if (activeDietary.length > 0) {
      base = base.filter(r => activeDietary.every(tag => (r.healthLabels || []).includes(tag)));
    }
    return interleaveByAuthor(base);
  }, [active, activeDietary, mergedRecipes]);
  const goalLabel = HEALTH_GOALS.find(g => g.id === active);
  const ALL = [{ id:'all', label:'All Recipes' }, ...HEALTH_GOALS.map(g => ({ id:g.id, label:g.label }))];
  return (
    <div className="page-wrap">
      <div className="feed-page-header">
        <h1 className="feed-page-title">
          {active === 'all' ? 'All Recipes' : `${goalLabel?.icon} ${goalLabel?.label}`}
        </h1>
        <p className="feed-page-sub">
          {active === 'all' ? 'Condition-specific recipes, built by registered dietitians' : goalLabel?.description}
        </p>
      </div>
      {!user && (
        <div className="signin-gate">
          <div>
            <div className="signin-gate-text">🔒 Sign in to unlock all recipes</div>
            <div className="signin-gate-sub">Previewing {FREE_PREVIEW_COUNT} of {filtered.length} recipes — create a free account or subscribe for full access.</div>
          </div>
          <button className="signin-gate-btn" onClick={onSignIn}>Sign in / Sign up →</button>
        </div>
      )}
      {showShareBanner && (
        <div style={{background:'var(--warm-beige)',borderRadius:12,padding:'12px 16px',marginBottom:16,display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
          <span style={{fontSize:13,color:'var(--text-mid)'}}>Loving Nuri? Share it with a friend 🌿</span>
          <div style={{display:'flex',gap:8,flexShrink:0}}>
            <button onClick={() => {
              const msg = 'Recipes built by registered dietitians for PCOS, endo and hormonal conditions: https://www.nurirecipes.com';
              if (navigator.share) { navigator.share({ title:'Nuri', text: msg, url:'https://www.nurirecipes.com' }); }
              else { window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank'); }
            }} style={{padding:'7px 16px',background:'var(--brown)',color:'white',border:'none',borderRadius:50,fontFamily:'var(--font-body)',fontSize:12,fontWeight:600,cursor:'pointer'}}>Share</button>
            <button onClick={() => setShowShareBanner(false)} style={{padding:'7px 12px',background:'none',border:'1.5px solid var(--border)',borderRadius:50,fontFamily:'var(--font-body)',fontSize:12,color:'var(--text-light)',cursor:'pointer'}}>x</button>
          </div>
        </div>
      )}
      <div className="filter-row" style={{alignItems:'center'}}>
        {ALL.map(f => (
          <button key={f.id} className={`filter-chip ${active === f.id ? 'active' : ''}`} onClick={() => setActive(f.id)}>{f.label}</button>
        ))}
        <div style={{width:'1px',height:'22px',background:'var(--border)',flexShrink:0,margin:'0 4px'}} />
        <div style={{position:'relative',flexShrink:0}}>
          <button
            className={`filter-chip ${activeDietaryCount > 0 ? 'dietary-active' : ''}`}
            onClick={() => setShowDietaryDropdown(p => !p)}
            style={{display:'flex',alignItems:'center',gap:6}}
          >
            <span>Dietary</span>
            {activeDietaryCount > 0 && (
              <span style={{background:'var(--sage)',color:'white',borderRadius:'50%',width:16,height:16,fontSize:10,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',lineHeight:1}}>{activeDietaryCount}</span>
            )}
            <span style={{fontSize:10,opacity:0.5,marginLeft:2}}>{showDietaryDropdown ? '▲' : '▾'}</span>
          </button>
          {showDietaryDropdown && (
            <div style={{position:'absolute',top:'calc(100% + 6px)',right:0,background:'var(--white)',border:'1.5px solid var(--border)',borderRadius:12,padding:6,minWidth:160,boxShadow:'0 4px 20px rgba(44,24,16,0.10)',zIndex:50}}>
              {DIETARY_FILTERS.map(f => {
                const on = activeDietary.includes(f.id);
                return (
                  <button key={f.id} onClick={() => toggleDietary(f.id)}
                    style={{display:'flex',alignItems:'center',gap:10,width:'100%',padding:'8px 10px',borderRadius:8,border:'none',background: on ? 'var(--warm-beige)' : 'transparent',cursor:'pointer',fontFamily:'var(--font-body)',fontSize:13,color: on ? 'var(--brown)' : 'var(--text-mid)',fontWeight: on ? 600 : 400,textAlign:'left'}}>
                    <span style={{width:16,height:16,borderRadius:4,border:`1.5px solid ${on ? 'var(--sage)' : 'var(--border)'}`,background: on ? 'var(--sage)' : 'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:10,color:'white'}}>{on ? '✓' : ''}</span>
                    {f.label}
                  </button>
                );
              })}
              {activeDietaryCount > 0 && (
                <button onClick={() => clearGroup(DIETARY_FILTERS)} style={{width:'100%',padding:'6px 10px',border:'none',background:'none',cursor:'pointer',fontFamily:'var(--font-body)',fontSize:11,color:'var(--text-light)',textAlign:'left',marginTop:2}}>
                  Clear all
                </button>
              )}
            </div>
          )}
        </div>
        <div style={{position:'relative',flexShrink:0}}>
          <button
            className={`filter-chip ${activeCookingCount > 0 ? 'dietary-active' : ''}`}
            onClick={() => setShowCookingDropdown(p => !p)}
            style={{display:'flex',alignItems:'center',gap:6}}
          >
            <span>Cooking style</span>
            {activeCookingCount > 0 && (
              <span style={{background:'var(--sage)',color:'white',borderRadius:'50%',width:16,height:16,fontSize:10,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',lineHeight:1}}>{activeCookingCount}</span>
            )}
            <span style={{fontSize:10,opacity:0.5,marginLeft:2}}>{showCookingDropdown ? '▲' : '▾'}</span>
          </button>
          {showCookingDropdown && (
            <div style={{position:'absolute',top:'calc(100% + 6px)',right:0,background:'var(--white)',border:'1.5px solid var(--border)',borderRadius:12,padding:6,minWidth:160,boxShadow:'0 4px 20px rgba(44,24,16,0.10)',zIndex:50}}>
              {COOKING_STYLE_FILTERS.map(f => {
                const on = activeDietary.includes(f.id);
                return (
                  <button key={f.id} onClick={() => toggleDietary(f.id)}
                    style={{display:'flex',alignItems:'center',gap:10,width:'100%',padding:'8px 10px',borderRadius:8,border:'none',background: on ? 'var(--warm-beige)' : 'transparent',cursor:'pointer',fontFamily:'var(--font-body)',fontSize:13,color: on ? 'var(--brown)' : 'var(--text-mid)',fontWeight: on ? 600 : 400,textAlign:'left'}}>
                    <span style={{width:16,height:16,borderRadius:4,border:`1.5px solid ${on ? 'var(--sage)' : 'var(--border)'}`,background: on ? 'var(--sage)' : 'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:10,color:'white'}}>{on ? '✓' : ''}</span>
                    {f.label}
                  </button>
                );
              })}
              {activeCookingCount > 0 && (
                <button onClick={() => clearGroup(COOKING_STYLE_FILTERS)} style={{width:'100%',padding:'6px 10px',border:'none',background:'none',cursor:'pointer',fontFamily:'var(--font-body)',fontSize:11,color:'var(--text-light)',textAlign:'left',marginTop:2}}>
                  Clear all
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">🌱</div><div className="empty-title">No recipes yet</div><div className="empty-text">Our dietitians are working on recipes for this condition. Check back soon!</div></div>
      ) : (
        <div className="recipe-grid">
          {filtered.map((r, i) => {
            const rdSettings = premiumSettings?.[r.dieticianId] || {};
            const isFreeDietitian = !rdSettings.is_premium;
            const freeCount = rdSettings.free_recipe_count ?? FALLBACK_FREE_RECIPE_COUNT;
            const rdRecipes = filtered.filter(x => x.dieticianId === r.dieticianId);
            const rdIndex = rdRecipes.indexOf(r);
            const isPremiumRecipe = !isFreeDietitian && rdIndex >= freeCount;
            const locked = !user && i >= FREE_PREVIEW_COUNT;
            const premiumLocked = isPremiumRecipe && !isPremium;
            return <RecipeCard key={r.id} recipe={{...r, _gridIndex: i}} onRecipeClick={onRecipeClick} onDieticianClick={onDieticianClick} isSaved={saved.has(r.id)} onToggleSave={onToggleSave} isLocked={locked} onSignIn={onSignIn} isPremiumLocked={premiumLocked && !locked} onSubscribe={onSubscribe} supaDietitians={supaDietitians} supaAllDietitians={supaAllDietitians} />;
          })}
        </div>
      )}
    </div>
  );
}

function MadeItModal({ recipe, onConfirm, onClose }) {
  const [photo, setPhoto] = useState(null);
  const fileRef = React.useRef();
  const handleFile = e => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => setPhoto(ev.target.result);
    reader.readAsDataURL(f);
  };
  return (
    <div className="made-it-modal-overlay" onClick={onClose}>
      <div className="made-it-modal" onClick={e => e.stopPropagation()}>
        <div className="made-it-modal-title">You made it! 🎉</div>
        <div className="made-it-modal-sub">Share a photo of your {recipe.title} — it'll appear in your personal kitchen gallery.</div>
        {photo ? (
          <img src={photo} className="photo-preview" alt="your creation" />
        ) : (
          <div className="photo-upload-area" onClick={() => fileRef.current.click()}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📸</div>
            <div style={{ fontSize: 13, color: 'var(--text-light)' }}>Tap to add a photo (optional)</div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
          </div>
        )}
        <div className="made-it-actions">
          <button className="made-it-skip" onClick={() => onConfirm(null)}>Skip photo</button>
          <button className="made-it-confirm" onClick={() => onConfirm(photo)}>
            {photo ? 'Save & add to gallery ✓' : 'Mark as made ✓'}
          </button>
        </div>
      </div>
    </div>
  );
}

function CommentsSection({ recipeId, dieticianId, comments, onAddComment }) {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const recipeComments = comments[recipeId] || [];
  const d = getD(dieticianId);

  const submit = () => {
    if (!name.trim() || !text.trim()) return;
    onAddComment(recipeId, { name: name.trim(), text: text.trim(), date: Date.now() });
    setName(''); setText('');
  };

  return (
    <div className="comments-section">
      <div className="comments-head">Questions & feedback</div>

      {/* Pinned RD note */}
      {d && (
        <div className="comment-item" style={{ marginBottom: 20 }}>
          <div className="comment-avatar" style={{ background: d.avatarColor }}>{d.initials}</div>
          <div className="comment-bubble" style={{ borderLeft: '3px solid var(--tan)' }}>
            <div className="comment-meta">
              <span className="comment-name">{d.name}</span>
              <span className="comment-rd-badge">RD</span>
              <span className="comment-date">Recipe author</span>
            </div>
            <div className="comment-text">Feel free to ask me any questions about this recipe — substitutions, dietary adaptations, or anything else! I read every comment. 💛</div>
          </div>
        </div>
      )}

      {/* Comment form */}
      <div className="comment-form">
        <div className="comment-form-row">
          <input className="comment-input" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} style={{ maxWidth: 200 }} />
        </div>
        <textarea className="comment-textarea" placeholder="Ask a question or share your feedback…" value={text} onChange={e => setText(e.target.value)} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
          <button className="comment-submit" onClick={submit}>Post comment →</button>
        </div>
      </div>

      {/* Comments */}
      {recipeComments.length > 0 && (
        <div className="comment-list">
          {recipeComments.map((c, i) => (
            <div key={i} className="comment-item">
              <div className="comment-avatar" style={{ background: 'var(--tan)' }}>
                {c.name.charAt(0).toUpperCase()}
              </div>
              <div className="comment-bubble">
                <div className="comment-meta">
                  <span className="comment-name">{c.name}</span>
                  <span className="comment-date">{new Date(c.date).toLocaleDateString('en-GB', { day:'numeric', month:'short' })}</span>
                </div>
                <div className="comment-text">{c.text}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NutritionNote({ note }) {
  if (!note) return null;
  // Robust splitter: handles all formats RDs might use:
  // 1. Dash-prefixed inline: "-peanut butter provides... -cinnamon is..."
  // 2. Dash-prefixed with newlines: "\n-peanut butter..."
  // 3. Sentence split: "Chia seeds are rich... Low glycaemic berries..."
  // 4. Em-dash separated: "note — note"
  let sentences = [];
  const hasDashes = /(?:^|[\n\r])\s*-/.test(note) || /\s+-[A-Z]/.test(note) || note.trimStart().startsWith('-');
  if (hasDashes) {
    // Split on dash that starts a new point (preceded by space, newline, or start)
    sentences = note.split(/(?:^|\n|\r)\s*-+\s*|(?<=\w[^-])\s+-(?=[A-Za-z])/).map(s => s.trim()).filter(s => s.length > 10);
  } else {
    sentences = note.split(/(?<=[.!?])\s+(?=[A-Z])|(?:\s+—\s+)/).map(s => s.trim()).filter(s => s.length > 10);
  }
  if (sentences.length <= 1) {
    // Last resort: try splitting on capital letter after lowercase + period
    const fallback = note.split(/\.\s+/).map(s => s.trim()).filter(s => s.length > 10);
    if (fallback.length > 1) sentences = fallback;
  }
  if (sentences.length <= 1) {
    return <div className="nutrition-note-plain">💡 {note}</div>;
  }
  const dots = ['#7A9E7E','#C47A7A','#C4A265','#B8845A','#9B7BAA'];
  return (
    <div className="nutrition-section">
      <div className="nutrition-header">
        <div className="nutrition-icon">🌿</div>
        <div>
          <div className="nutrition-title">Nutrition Note</div>
          <div className="nutrition-subtitle">Why this recipe works for you</div>
        </div>
      </div>
      <div className="nutrition-cards">
        {sentences.map((s, i) => (
          <div key={i} className="nutrition-card">
            <div className="nutrition-card-dot" style={{background: dots[i % dots.length]}} />
            <div className="nutrition-card-text">{s}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecipeDetail({ recipe, onBack, onDieticianClick, followed, onToggleFollow, isSaved, onToggleSave, tried, onToggleTried, triedPhotos, comments, onAddComment, user, supaAllDietitians }) {
  const d = getD(parseInt(recipe.dieticianId,10)) || (supaAllDietitians || []).find(x => x.id === parseInt(recipe.dieticianId,10)) || { id: recipe.dieticianId, name:'Unknown', credentials:'RD', initials:'?', avatarColor:'#C4A882', photo:null, bio:'' };
  const isTried = tried.has(recipe.id);
  const [showMadeIt, setShowMadeIt] = useState(false);
  const [communityPhotos, setCommunityPhotos] = useState([]);
  const isAdmin = user?.email === 'nuriteam@nuri.com' || user?.role === 'admin';
  const { macros, loading: macrosLoading } = useMacros(recipe);

  useEffect(() => {
    // Load all community photos for this recipe from Supabase
    window._supa.from('tried').select('user_id, photo_url').eq('recipe_id', recipe.id).not('photo_url', 'is', null)
      .then(({ data }) => { if (data) setCommunityPhotos(data); });
  }, [recipe.id]);

  const handleDeleteCommunityPhoto = async (userId) => {
    await window._supa.from('tried').update({ photo_url: null }).eq('recipe_id', recipe.id).eq('user_id', userId);
    setCommunityPhotos(p => p.filter(x => x.user_id !== userId));
  };

  const handleMadeIt = () => {
    if (isTried) return;
    setShowMadeIt(true);
  };
  const confirmMadeIt = (photo) => {
    onToggleTried(recipe.id, photo);
    setShowMadeIt(false);
    // Refresh community photos after adding
    if (photo && user) setCommunityPhotos(p => [...p.filter(x => x.user_id !== user.id), { user_id: user.id, photo_url: photo }]);
  };

  return (
    <div>
      {showMadeIt && <MadeItModal recipe={recipe} onConfirm={confirmMadeIt} onClose={() => setShowMadeIt(false)} />}
      <div className="detail-hero" style={getRecipeGingham(recipe)}>
        <button className="back-btn" onClick={onBack}>← Back</button>
        <button className="detail-save-btn" onClick={() => onToggleSave(recipe.id)}>{isSaved ? '❤️' : '🤍'}</button>
        <span className="detail-emoji">{recipe.emoji}</span>
      </div>
      <div className="detail-layout">
        <div className="detail-left">
          <div className="detail-script">Recipe</div>
          <h1 className="detail-title">{recipe.title}</h1>
          <p className="detail-subtitle">{recipe.subtitle}</p>
          <div className="health-tags" style={{ marginBottom: 16 }}>
            {recipe.healthLabels.map(l => <HealthTag key={l} label={l} />)}
          </div>
          <div className="detail-meta">
            {[['⏱', recipe.prepTime, 'Prep'], ['🔥', recipe.cookTime, 'Cook'], ['🍽', recipe.servings, 'Servings']].map(([icon, val, lbl]) => (
              <div key={lbl} className="detail-meta-item">
                <span className="detail-meta-val">{icon} {val}</span>
                <span className="detail-meta-label">{lbl}</span>
              </div>
            ))}
          </div>
          {(() => {
            const m = macros;
            if (macrosLoading) return (
              <div style={{ margin:'12px 0', padding:'12px 14px', background:'var(--warm-beige)', borderRadius:'var(--radius-sm)', display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:16, height:16, border:'2px solid var(--tan)', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite', flexShrink:0 }} />
                <span style={{ fontSize:12, color:'var(--text-light)' }}>Calculating nutrition…</span>
              </div>
            );
            if (!m) return null;
            const total = m.protein * 4 + m.carbs * 4 + m.fat * 9;
            const pp = Math.round((m.protein * 4 / total) * 100);
            const cp = Math.round((m.carbs * 4 / total) * 100);
            const fp = 100 - pp - cp;
            return (
              <div style={{ marginBottom:16 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                  <div style={{ fontSize:11, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--tan)' }}>Nutrition per serving</div>
                  <div style={{ fontSize:10, color:'var(--text-light)', fontStyle:'italic' }}>AI-estimated</div>
                </div>
                <div className="macro-grid">
                  {[{val:m.kcal,lbl:'kcal'},{val:`${m.protein}g`,lbl:'protein'},{val:`${m.carbs}g`,lbl:'carbs'},{val:`${m.fat}g`,lbl:'fat'}].map(({val,lbl}) => (
                    <div key={lbl} className="macro-cell"><span className="macro-cell-val">{val}</span><span className="macro-cell-label">{lbl}</span></div>
                  ))}
                </div>
                <div className="macro-bar">
                  <div className="macro-seg" style={{ width:`${pp}%`, background:'#7A9E7E' }} title={`Protein ${pp}%`} />
                  <div className="macro-seg" style={{ width:`${cp}%`, background:'#C4A265' }} title={`Carbs ${cp}%`} />
                  <div className="macro-seg" style={{ width:`${fp}%`, background:'#C47A7A' }} title={`Fat ${fp}%`} />
                </div>
                <div className="macro-legend">
                  {[{color:'#7A9E7E',label:'Protein'},{color:'#C4A265',label:'Carbs'},{color:'#C47A7A',label:'Fat'}].map(({color,label}) => (
                    <div key={label} className="macro-item"><div className="macro-dot" style={{background:color}} />{label}</div>
                  ))}
                </div>
              </div>
            );
          })()}
          <div className="detail-section">
            <div className="section-script">Ingredients</div>
            <ul className="ingredient-list">
              {recipe.ingredients.map((ing, i) => ing.startsWith('## ')
                ? <li key={i} className="ingredient-heading">{ing.slice(3)}</li>
                : <li key={i} className="ingredient-item">{ing}</li>
              )}
            </ul>
          </div>
          <div className="dietician-card-strip" style={{ marginTop: 16 }} onClick={() => onDieticianClick(d)}>
            <Avatar initials={d.initials} color={d.avatarColor} cls="avatar-lg" photo={d.photo} />
            <div style={{ flex: 1 }}>
              <div className="strip-name">{d.name}</div>
              <div className="strip-creds">{d.credentials} · {d.specialty}</div>
            </div>
            <button className={`follow-btn ${followed ? 'following' : ''}`} onClick={e => { e.stopPropagation(); onToggleFollow(d.id); }}>
              {followed ? 'Following' : 'Follow'}
            </button>
          </div>
        </div>
        <div>
          <div className="section-script">Instructions</div>
          <ol className="instruction-list">
            {recipe.instructions.map((step, i) => (
              <li key={i} className="instruction-item">
                <span className="instruction-num">{i+1}</span>
                <span className="instruction-text">{step}</span>
              </li>
            ))}
          </ol>
          {recipe.note && <NutritionNote note={recipe.note} />}
        </div>
      </div>
      {/* Tried + community photos */}
      <div className="tried-section">
        <div className="tried-banner">
          <div>
            <div className="tried-banner-text">Have you made this recipe?</div>
            <div className="tried-banner-sub">Mark it as made to track your progress and earn badges in My Recipe Journey.</div>
          </div>
          <button className={`tried-check ${isTried ? 'done' : ''}`} onClick={handleMadeIt}>
            <div className="tried-check-box">{isTried ? '✓' : ''}</div>
            {isTried ? 'I made this!' : 'Mark as made'}
          </button>
        </div>

        {(communityPhotos.length > 0 || user) && (
        <div className="community-photos-section">
          <div className="community-photos-head">📸 Community dishes</div>
          <div className="community-photos-grid">
            {communityPhotos.map(cp => (
              <div key={cp.user_id} className="community-photo-slot" style={{ position: 'relative' }}>
                <img src={cp.photo_url} alt="community dish" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                {cp.user_id === user?.id && (
                  <div style={{ position:'absolute', top:4, right:4, fontSize:10, background:'rgba(255,255,255,0.9)', borderRadius:50, padding:'2px 8px', color:'var(--tan)', fontWeight:600 }}>You</div>
                )}
                {isAdmin && (
                  <button onClick={() => handleDeleteCommunityPhoto(cp.user_id)} style={{ position:'absolute', top:4, left:4, background:'rgba(139,32,32,0.85)', border:'none', borderRadius:50, color:'white', fontSize:10, padding:'3px 8px', cursor:'pointer', fontWeight:600 }}>✕ Delete</button>
                )}
              </div>
            ))}
            {communityPhotos.length === 0 && !isTried && (
              <div className="community-photo-slot">
                <div className="community-photo-placeholder" onClick={handleMadeIt}>
                  <div className="community-photo-placeholder-icon">📷</div>
                  <div className="community-photo-placeholder-label">Be the first to share your dish</div>
                </div>
              </div>
            )}
            {communityPhotos.length < 6 && Array.from({ length: Math.max(0, (isTried ? 5 : 5) - communityPhotos.length) }).map((_, i) => (
              <div key={i} className="community-photo-slot">
                <div className="community-photo-placeholder">
                  <div className="community-photo-placeholder-icon">📷</div>
                  <div className="community-photo-placeholder-label">Waiting for dishes…</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}
      </div>

      <CommentsSection recipeId={recipe.id} dieticianId={recipe.dieticianId} comments={comments} onAddComment={onAddComment} />
    </div>
  );
}

function ProfilePage({ dietician: d, onBack, onRecipeClick, followed, onToggleFollow, saved, onToggleSave, user, onSignIn, isPremium, onSubscribe, supaRecipes, supaDietitians, premiumSettings, supaAllDietitians, newSupaRecipes }) {
  const allRecipesForD = useMemo(() => {
    const hardcoded = getRecipesByD(d.id).map(r => ({ ...r, ...(supaRecipes?.[r.id] || {}) }));
    const newOnes = (newSupaRecipes || []).filter(r => r.dieticianId === d.id);
    return [...hardcoded, ...newOnes];
  }, [d.id, supaRecipes, newSupaRecipes]);
  const dRecipes = allRecipesForD;
  const mergedD = { ...d, ...(supaDietitians?.[d.id] || {}) };

  // Track time spent on profile
  useEffect(() => {
    if (window._ph) window._ph.capture('dietitian_profile_opened', { dietitian_name: d.name, dietitian_id: d.id });
    const start = Date.now();
    return () => {
      const seconds = Math.round((Date.now() - start) / 1000);
      if (window._ph) window._ph.capture('dietitian_profile_time_spent', { dietitian_name: d.name, dietitian_id: d.id, seconds_spent: seconds });
    };
  }, [d.id]);
  const focusGoals = d.tags.map(t => HEALTH_GOALS.find(g => g.id === t)).filter(Boolean);
  return (
    <div>
      <div className="profile-hero" style={{ background: `linear-gradient(135deg, ${d.avatarColor}88, ${d.avatarColor}33)` }}>
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="profile-hero-inner">
          <Avatar initials={mergedD.initials} color={mergedD.avatarColor} photo={dietitianAvatarUrl(mergedD)} cls="avatar-xl" />
        </div>
      </div>
      <div className="profile-body">
        <div className="profile-sidebar">
          <h1 className="profile-name">{d.name}</h1>
          <div className="profile-creds-tag">{d.credentials}</div>
          <div className="profile-specialty">{d.specialty}</div>
          <p className="profile-bio">{d.bio}</p>
          <div className="profile-stats">
            <div><span className="stat-num">{fmt((mergedD.supaFollowers || mergedD.followers || 0) + (followed ? 1 : 0))}</span><span className="stat-label">Followers</span></div>
            <div><span className="stat-num">{dRecipes.length}</span><span className="stat-label">Recipes</span></div>
          </div>
          <div className="focus-tags">
            {focusGoals.map(g => <span key={g.id} className="focus-tag">{g.icon} {g.label}</span>)}
          </div>
          <button className={`profile-follow-btn ${followed ? 'following' : ''}`} onClick={() => onToggleFollow(d.id)}>
            {followed ? '✓ Following' : '+ Follow'}
          </button>
        </div>
        <div>
          <div className="profile-recipes-title">Recipes</div>
          {!user && (
            <div className="signin-gate" style={{ marginBottom: 24 }}>
              <div>
                <div className="signin-gate-text">🔒 Sign in to unlock all recipes</div>
                <div className="signin-gate-sub">Previewing {FREE_PREVIEW_COUNT} of {dRecipes.length} recipes.</div>
              </div>
              <button className="signin-gate-btn" onClick={onSignIn}>Sign in →</button>
            </div>
          )}
          <div className="recipe-grid">
            {dRecipes.map((r, i) => {
              const rdSettings = premiumSettings?.[parseInt(d.id, 10)] || {};
              const isFreeDietitian = !rdSettings.is_premium;
              const freeCount = rdSettings.free_recipe_count ?? FALLBACK_FREE_RECIPE_COUNT;
              const rdIndex = dRecipes.indexOf(r);
              const isPremiumRecipe = !isFreeDietitian && rdIndex >= freeCount;
              const locked = !user && i >= FREE_PREVIEW_COUNT;
              const premiumLocked = isPremiumRecipe && !isPremium;
              return <RecipeCard key={r.id} recipe={r} onRecipeClick={onRecipeClick} onDieticianClick={() => {}} isSaved={saved.has(r.id)} onToggleSave={onToggleSave} isLocked={locked} onSignIn={onSignIn} isPremiumLocked={premiumLocked && !locked} onSubscribe={onSubscribe} supaDietitians={supaDietitians} supaAllDietitians={supaAllDietitians} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function ExploreTab({ onDieticianClick, followed, onToggleFollow, supaDietitians }) {
  const [supaRDs, setSupaRDs] = useState([]);
  useEffect(() => {
    const fetchRDs = async () => {
      // Try with sort_order first (once you've added that column in Supabase this
      // takes effect automatically). If the column doesn't exist yet, this query
      // errors, so we retry without it rather than showing nothing.
      let { data, error } = await window._supa.from('dietitians').select('id, name, credentials, specialty, bio, photo, tags, sort_order').eq('is_active', true);
      if (error) {
        ({ data, error } = await window._supa.from('dietitians').select('id, name, credentials, specialty, bio, photo, tags').eq('is_active', true));
      }
      if (data) setSupaRDs(data);
    };
    fetchRDs();
  }, []);

  // Merge hardcoded + Supabase RDs (Supabase wins for new ones, hardcoded provides fallback data)
  const exploreDieticians = supaRDs.length > 0
    ? supaRDs
        .filter(d => parseInt(d.id, 10) !== 1 && parseInt(d.id, 10) !== 2)
        .map(d => {
          const numId = parseInt(d.id, 10);
          const hardcoded = ALL_DIETICIANS.find(x => x.id === numId) || {};
          const supaOverride = supaDietitians?.[numId] || {};
          return {
            ...hardcoded,
            ...d,
            id: numId,
            photo: supaOverride.supaAvatar || d.photo || hardcoded.photo || null,
            bio: supaOverride.supaBio || d.bio || hardcoded.bio,
            supaFollowers: supaOverride.supaFollowers || 0,
            avatarColor: hardcoded.avatarColor || '#C4A882',
            initials: hardcoded.initials || d.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase(),
            tags: d.tags || hardcoded.tags || [],
            recipeIds: hardcoded.recipeIds || [],
          };
        })
    : ALL_DIETICIANS.filter(d => d.id !== 1 && d.id !== 2).map(d => ({ ...d, ...(supaDietitians?.[d.id] || {}) }));
  // Order comes from the Supabase `sort_order` column when set (manage it directly
  // in the dietitians table). Falls back to this name list for anyone without one yet.
  const explorOrder = ['alysse', 'lynd', 'nanda', 'mercy', 'kelsey', 'meredith', 'pettitt', 'march'];
  const explorePriority = (d) => {
    if (typeof d.sort_order === 'number') return d.sort_order;
    const n = (d.name || '').toLowerCase();
    const idx = explorOrder.findIndex(p => n.includes(p));
    return idx === -1 ? 999 : 900 + idx;
  };
  exploreDieticians.sort((a, b) => explorePriority(a) - explorePriority(b));
  return (
    <div className="page-wrap">
      <div className="page-hero">
        <div className="page-hero-script">discover</div>
        <h1 className="page-hero-title">Our Dieticians</h1>
        <p className="page-hero-sub">Every recipe is posted by a registered & verified RD.</p>
      </div>
      <div className="explore-grid">
        {exploreDieticians.map(d => {
          const goals = d.tags.map(t => HEALTH_GOALS.find(g => g.id === t)).filter(Boolean);
          return (
            <div key={d.id} className="rd-card" onClick={() => onDieticianClick(d)}>
              <div className="rd-card-top" style={{ background: `linear-gradient(135deg, ${d.avatarColor}66, ${d.avatarColor}22)` }}>
                {d.photo
                  ? <img src={d.photo} className="rd-avatar" style={{ objectFit:'cover', padding:0 }} alt={d.name} />
                  : <div className="rd-avatar" style={{ background: d.avatarColor }}>{d.initials}</div>
                }
              </div>
              <div className="rd-card-body">
                <div className="rd-name">{d.name}</div>
                <div className="rd-creds">{d.credentials}</div>
                <div className="rd-specialty">{d.specialty}</div>
                <p className="rd-bio">{d.bio}</p>
                <div className="focus-tags" style={{ marginBottom: 12 }}>
                  {goals.map(g => <span key={g.id} className="focus-tag" style={{ background: g.color + '55' }}>{g.icon} {g.label}</span>)}
                </div>
                <div className="rd-footer">
                  <span className="rd-stats">{((d.supaFollowers || d.followers || 0)).toLocaleString()} followers</span>
                  <button className={`follow-btn ${followed.has(d.id) ? 'following' : ''}`} onClick={e => { e.stopPropagation(); onToggleFollow(d.id); }}>
                    {followed.has(d.id) ? 'Following' : 'Follow'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function downloadBook(savedRecipes) {
  const ginghamCss = (bg, s) => {
    const sz = 36;
    return `background-color:${bg};background-image:repeating-linear-gradient(transparent 0,transparent ${sz}px,${s} ${sz}px,${s} ${sz*2}px),repeating-linear-gradient(90deg,transparent 0,transparent ${sz}px,${s} ${sz}px,${s} ${sz*2}px);`;
  };
  const coverG = ginghamCss('#EDD9A3','rgba(140,95,20,0.30)');

  const recipePages = savedRecipes.map((r, i) => {
    const d = getD(r.dieticianId);
    const g = GINGHAM[(r.id - 1) % GINGHAM.length];
    const headerG = ginghamCss(g.bg, g.s);
    return `
    <div class="page recipe-page">
      <div class="recipe-header" style="${headerG}">
        <div class="recipe-num">Recipe ${i + 1} of ${savedRecipes.length}</div>
        <div class="recipe-emoji-big">${r.emoji}</div>
      </div>
      <div class="recipe-body">
        <div class="recipe-rd-line">${d ? `${d.name} · ${d.credentials}` : ''}</div>
        <h1 class="recipe-title">${r.title}</h1>
        ${r.subtitle ? `<p class="recipe-sub">${r.subtitle}</p>` : ''}
        <div class="recipe-meta-row">
          ${r.prepTime ? `<span class="meta-pill">⏱ Prep ${r.prepTime}</span>` : ''}
          ${r.cookTime ? `<span class="meta-pill">🔥 Cook ${r.cookTime}</span>` : ''}
          ${r.servings ? `<span class="meta-pill">🍽 Serves ${r.servings}</span>` : ''}
        </div>
        <div class="two-col">
          <div class="col-left">
            <h2 class="section-head">Ingredients</h2>
            <ul class="ingredient-list">
              ${(r.ingredients || []).map(ing => ing.startsWith('## ') ? `<li class="ingredient-heading-print">${ing.slice(3)}</li>` : `<li>${ing}</li>`).join('')}
            </ul>
          </div>
          <div class="col-right">
            <h2 class="section-head">Method</h2>
            <ol class="method-list">
              ${(r.instructions || []).map(step => `<li>${step}</li>`).join('')}
            </ol>
            ${r.note ? `<div class="recipe-note"><span class="note-label">Note</span>${r.note}</div>` : ''}
          </div>
        </div>
      </div>
    </div>`;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>My Recipe Book — nuri.</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet"/>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'DM Sans',sans-serif;background:#fff;color:#2C1810;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .page{width:210mm;min-height:297mm;page-break-after:always;overflow:hidden;position:relative}
  /* ── COVER ── */
  .cover{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:60px 48px}
  .cover-gingham{position:absolute;inset:0;z-index:0}
  .cover-card{position:relative;z-index:1;background:rgba(250,246,240,0.96);border-radius:24px;padding:56px 64px;max-width:480px;box-shadow:0 8px 48px rgba(44,24,16,0.18)}
  .cover-eyebrow{font-family:'DM Sans',sans-serif;font-size:11px;font-weight:300;letter-spacing:0.12em;text-transform:uppercase;color:#C4A882;margin-bottom:8px;display:block}
  .cover-title{font-family:'Cormorant Garamond',serif;font-size:52px;font-style:italic;font-weight:600;color:#2C1810;line-height:1.1;margin-bottom:8px}
  .cover-brand{font-family:'Cormorant Garamond',serif;font-size:18px;font-style:italic;color:#9C7B6A;margin-top:20px;letter-spacing:0.05em}
  .cover-count{font-size:13px;color:#9C7B6A;margin-top:10px}
  .cover-divider{width:48px;height:2px;background:#C4A882;border-radius:2px;margin:20px auto}
  /* ── RECIPE PAGES ── */
  .recipe-page{display:flex;flex-direction:column}
  .recipe-header{height:130px;display:flex;align-items:center;justify-content:center;position:relative;flex-shrink:0}
  .recipe-emoji-big{font-size:72px;filter:drop-shadow(0 4px 12px rgba(0,0,0,0.15));z-index:1}
  .recipe-num{position:absolute;top:14px;right:18px;font-size:11px;font-weight:600;color:rgba(44,24,16,0.5);letter-spacing:0.06em;text-transform:uppercase}
  .recipe-body{padding:32px 40px 40px;flex:1}
  .recipe-rd-line{font-size:12px;color:#9C7B6A;font-weight:500;margin-bottom:8px;letter-spacing:0.03em}
  .recipe-title{font-family:'Cormorant Garamond',serif;font-size:36px;font-style:italic;font-weight:600;color:#2C1810;line-height:1.15;margin-bottom:6px}
  .recipe-sub{font-family:'Cormorant Garamond',serif;font-size:16px;color:#9C7B6A;font-style:italic;margin-bottom:16px}
  .recipe-meta-row{display:flex;gap:8px;margin-bottom:28px;flex-wrap:wrap}
  .meta-pill{padding:4px 12px;background:#F0E8DC;border-radius:50px;font-size:12px;color:#6B4D3C;font-weight:500}
  .two-col{display:grid;grid-template-columns:1fr 1.4fr;gap:32px}
  .section-head{font-family:'Cormorant Garamond',serif;font-size:15px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#C4A882;margin-bottom:12px;padding-bottom:6px;border-bottom:1.5px solid #E4D9CC}
  .ingredient-list{list-style:none;padding:0}
  .ingredient-list li{font-size:13px;color:#2C1810;padding:5px 0;border-bottom:1px solid #F0E8DC;line-height:1.4}
  .ingredient-list li:last-child{border-bottom:none}
  .ingredient-heading-print{font-style:italic;font-weight:600;color:#6B4D3C;border-bottom:none!important;padding-top:12px!important}
  .method-list{padding-left:0;list-style:none;counter-reset:step}
  .method-list li{font-size:13px;color:#2C1810;padding:6px 0 6px 28px;border-bottom:1px solid #F0E8DC;line-height:1.5;counter-increment:step;position:relative}
  .method-list li:last-child{border-bottom:none}
  .method-list li::before{content:counter(step);position:absolute;left:0;top:7px;width:18px;height:18px;background:#C4A882;color:white;border-radius:50%;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;line-height:18px;text-align:center}
  .recipe-note{margin-top:20px;padding:12px 14px;background:#FAF6F0;border-left:3px solid #C4A882;border-radius:4px;font-size:12px;color:#6B4D3C;font-style:italic;line-height:1.6}
  .note-label{font-style:normal;font-weight:700;color:#5C3D2E;display:block;margin-bottom:4px;font-size:11px;letter-spacing:0.05em;text-transform:uppercase}
  @media print{
    body{margin:0}
    .page{margin:0;border-radius:0}
    @page{size:A4;margin:0}
  }
</style>
</head>
<body>
  <div class="page cover">
    <div class="cover-gingham" style="${coverG}"></div>
    <div class="cover-card">
      <span class="cover-eyebrow">a personal collection from</span>
      <div class="cover-title">My Recipe<br/>Book</div>
      <div class="cover-divider"></div>
      <div class="cover-brand">nuri.</div>
      <div class="cover-count">${savedRecipes.length} recipe${savedRecipes.length !== 1 ? 's' : ''} curated for you</div>
    </div>
  </div>
  ${recipePages}
  <script>window.onload=()=>window.print()<\/script>
</body>
</html>`;

  const w = window.open('', '_blank');
  w.document.write(html);
  w.document.close();
}

// Strip leading quantity/measurement from an ingredient string, keep the rest as one item
function parseGroceryItems(ingredient) {
  let item = ingredient.trim();

  // Normalise unicode fractions to ascii so regex works reliably
  item = item
    .replace(/½/g, '1/2').replace(/¼/g, '1/4').replace(/¾/g, '3/4')
    .replace(/⅓/g, '1/3').replace(/⅔/g, '2/3').replace(/⅛/g, '1/8')
    .replace(/⅜/g, '3/8').replace(/⅝/g, '5/8').replace(/⅞/g, '7/8');

  // Strip leading quantity + optional unit
  // e.g. "3 cups", "1/2 lb", "2 tbsp", "1 x 400g tin", "40g", "500 ml"
  item = item
    .replace(/^[\d\s\/]+\s*(x\s*)?(tbsp|tsp|cups?|ml|l\b|g\b|kg|lb|oz|litres?|liters?|fl\s*oz|pints?|cloves?|slices?|handfuls?|bunch(?:es)?|sprigs?|pieces?|heads?|cans?|tins?|packets?|bags?)\.?\s*/i, '')
    // Bare numbers at the start with no unit: "2 salmon fillets" → "salmon fillets"
    .replace(/^[\d\s\/]+\s+/, '')
    .trim();

  if (!item) return [];
  return [item.charAt(0).toUpperCase() + item.slice(1)];
}

function GroceryList({ savedRecipes, user }) {
  const db = window._supa;
  const [checked, setChecked] = useState([]);
  const [extras, setExtras] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(true);

  // Load from Supabase on mount
  useEffect(() => {
    if (!user) { setLoading(false); return; }
    Promise.all([
      db.from('grocery_extras').select('*').eq('user_id', user.id).order('created_at'),
      db.from('grocery_checked').select('checked_keys').eq('user_id', user.id).maybeSingle(),
    ]).then(([{ data: extData }, { data: chkData }]) => {
      if (extData) setExtras(extData.map(e => ({ id: e.id, item: e.item, checked: e.checked })));
      if (chkData?.checked_keys) setChecked(chkData.checked_keys);
      setLoading(false);
    });
  }, [user?.id]);

  // Persist checked state to Supabase (debounced)
  const checkedRef = React.useRef(checked);
  checkedRef.current = checked;
  useEffect(() => {
    if (!user || loading) return;
    const t = setTimeout(() => {
      db.from('grocery_checked').upsert({ user_id: user.id, checked_keys: checkedRef.current, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
    }, 600);
    return () => clearTimeout(t);
  }, [checked, user?.id]);

  const recipeItems = useMemo(() =>
    savedRecipes.map(r => ({
      ...r,
      parsedItems: r.ingredients.flatMap((ing, i) =>
        parseGroceryItems(ing).map((item, j) => ({ key: `${r.id}:${i}:${j}`, item }))
      )
    })),
  [savedRecipes]);

  const toggle = key => setChecked(p => p.includes(key) ? p.filter(x => x !== key) : [...p, key]);
  const clearChecked = () => setChecked([]);
  const checkAll = () => setChecked([
    ...recipeItems.flatMap(r => r.parsedItems.map(i => i.key)),
    ...extras.map(e => `extra:${e.id}`),
  ]);

  const addExtra = async () => {
    const val = newItem.trim();
    if (!val || !user) return;
    const { data } = await db.from('grocery_extras').insert({ user_id: user.id, item: val, checked: false }).select().single();
    if (data) setExtras(p => [...p, { id: data.id, item: data.item }]);
    setNewItem('');
  };

  const removeExtra = async (id) => {
    setExtras(p => p.filter(e => e.id !== id));
    setChecked(p => p.filter(k => k !== `extra:${id}`));
    await db.from('grocery_extras').delete().eq('id', id).eq('user_id', user.id);
  };

  const totalItems = recipeItems.reduce((n, r) => n + r.parsedItems.length, 0) + extras.length;
  const doneCount = checked.length;

  const copyList = () => {
    const lines = [
      ...recipeItems.flatMap(r => [`\n${r.title}`, ...r.parsedItems.map(i => `  • ${i.item}`)]),
      ...(extras.length ? ['\nMiscellaneous', ...extras.map(e => `  • ${e.item}`)] : []),
    ];
    navigator.clipboard.writeText(lines.join('\n').trim()).catch(() => {});
  };

  if (savedRecipes.length === 0) {
    return <div className="empty-state"><div className="empty-icon">🛒</div><div className="empty-title">No recipes saved</div><div className="empty-text">Save recipes to automatically generate a grocery list.</div></div>;
  }

  if (loading) return <div style={{ padding:'32px 0', textAlign:'center', color:'var(--text-light)', fontSize:14 }}>Loading your list…</div>;

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:'var(--font-body)', fontSize:11, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--tan)', marginBottom:4 }}>
            {doneCount} of {totalItems} items checked
          </div>
          <div style={{ height:6, background:'var(--warm-beige)', borderRadius:50, overflow:'hidden', maxWidth:280 }}>
            <div style={{ height:'100%', width:`${totalItems ? (doneCount/totalItems)*100 : 0}%`, background:'linear-gradient(90deg, var(--tan), var(--brown))', borderRadius:50, transition:'width 0.4s ease' }} />
          </div>
        </div>
      </div>
      <div className="grocery-actions">
        <button className="grocery-action-btn primary" onClick={copyList}>📋 Copy list</button>
        <button className="grocery-action-btn" onClick={checkAll}>✓ Check all</button>
        <button className="grocery-action-btn" onClick={clearChecked}>↺ Uncheck all</button>
      </div>
      {recipeItems.map(r => (
        <div key={r.id} className="grocery-section">
          <div className="grocery-section-title">
            {r.emoji} {r.title}
            <span className="grocery-recipe-badge">{r.parsedItems.length} items</span>
          </div>
          <div style={{ background:'var(--white)', borderRadius:'var(--radius)', overflow:'hidden', boxShadow:'var(--shadow)' }}>
            {r.parsedItems.map(({ key, item }) => {
              const done = checked.includes(key);
              return (
                <div key={key} className={`grocery-item ${done ? 'checked' : ''}`} onClick={() => toggle(key)}>
                  <div className={`grocery-check ${done ? 'done' : ''}`}>{done ? '✓' : ''}</div>
                  <span className="grocery-item-text">{item}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <div className="grocery-section">
        <div className="grocery-section-title">
          ✏️ Miscellaneous
          <span className="grocery-recipe-badge">{extras.length} items</span>
        </div>
        <div style={{ background:'var(--white)', borderRadius:'var(--radius)', overflow:'hidden', boxShadow:'var(--shadow)' }}>
          {extras.map(e => {
            const key = `extra:${e.id}`;
            const done = checked.includes(key);
            return (
              <div key={e.id} className={`grocery-item ${done ? 'checked' : ''}`} style={{ display:'flex', alignItems:'center' }}>
                <div className={`grocery-check ${done ? 'done' : ''}`} onClick={() => toggle(key)}>{done ? '✓' : ''}</div>
                <span className="grocery-item-text" style={{ flex:1 }} onClick={() => toggle(key)}>{e.item}</span>
                <button onClick={() => removeExtra(e.id)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:14, color:'var(--text-light)', padding:'0 12px', lineHeight:1, flexShrink:0 }}>✕</button>
              </div>
            );
          })}
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', borderTop: extras.length ? '1px solid var(--border)' : 'none' }}>
            <input
              style={{ flex:1, border:'none', outline:'none', fontSize:14, fontFamily:'var(--font-body)', background:'transparent', color:'var(--text)' }}
              placeholder="Add an item…"
              value={newItem}
              onChange={e => setNewItem(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addExtra(); }}
            />
            <button onClick={addExtra} disabled={!newItem.trim()} style={{ padding:'5px 14px', background:'var(--brown)', color:'white', border:'none', borderRadius:50, fontSize:13, fontFamily:'var(--font-body)', fontWeight:600, cursor:'pointer', opacity: newItem.trim() ? 1 : 0.4, flexShrink:0 }}>Add</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PLAN TAB ──────────────────────────────────────────────────
const DAYS_OF_WEEK = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const PLAN_MEAL_TYPES = ['Breakfast','Lunch','Dinner','Snack'];

// Rough meal-type tagging based on recipe characteristics
function guessMealType(recipe) {
  const t = (recipe.title + ' ' + (recipe.subtitle || '')).toLowerCase();
  if (/pancake|oat|porridge|egg|breakfast|yoghurt|smoothie|chia|granola|frittata/.test(t)) return 'Breakfast';
  if (/cookie|ball|bite|snack|bar|energy/.test(t)) return 'Snack';
  if (/soup|salad|wrap|dahl|stew|curry|traybake|bowl/.test(t)) return ['Lunch','Dinner'][Math.floor(recipe.id % 2)];
  return recipe.id % 3 === 0 ? 'Lunch' : 'Dinner';
}

function buildWeekPlan(recipeCount, mealTypes, healthGoals) {
  const pool = ALL_RECIPES.filter(r =>
    (!healthGoals?.length || r.healthLabels.some(l => healthGoals.includes(l)))
  );
  const src = pool.length >= recipeCount ? pool : ALL_RECIPES;

  // Shuffle by today's date so regenerate gives new results
  const seed = new Date().toDateString();
  const shuffled = [...src].sort((a, b) => ((a.id * seed.length) % 97) - ((b.id * seed.length) % 97));
  const picked = shuffled.slice(0, recipeCount);

  // Build empty full week — every day has all 4 meal type slots
  const plan = {};
  DAYS_OF_WEEK.forEach(d => {
    plan[d] = {};
    PLAN_MEAL_TYPES.forEach(t => { plan[d][t] = null; });
  });

  // Spread picked recipes across the week, one per day where possible
  // Prefer to put them in the meal type that matches the recipe, falling back to any slot
  const activeMealTypes = mealTypes.length > 0 ? mealTypes : PLAN_MEAL_TYPES;
  picked.forEach((r, i) => {
    const day = DAYS_OF_WEEK[i % 7];
    const preferred = guessMealType(r);
    const type = activeMealTypes.includes(preferred) ? preferred : activeMealTypes[i % activeMealTypes.length];
    // If slot taken, find next free slot on the same day
    if (!plan[day][type]) {
      plan[day][type] = r;
    } else {
      const free = activeMealTypes.find(t => !plan[day][t]);
      if (free) plan[day][free] = r;
    }
  });

  return plan;
}

// Grocery list from plan
function buildGroceryFromPlan(plan) {
  const recipes = [];
  DAYS_OF_WEEK.forEach(day => {
    PLAN_MEAL_TYPES.forEach(type => {
      const r = plan[day]?.[type];
      if (r && !recipes.find(x => x.id === r.id)) recipes.push(r);
    });
  });
  return recipes;
}

// Recipe picker sheet
function RecipePickerSheet({ slot, pool, onPick, onClose }) {
  const [filter, setFilter] = useState('All');
  const filters = ['All', ...PLAN_MEAL_TYPES];
  const filtered = filter === 'All' ? pool : pool.filter(r => guessMealType(r) === filter);
  return (
    <div className="picker-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="picker-sheet" onClick={e => e.stopPropagation()}>
        <div className="picker-header">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
            <div className="picker-title">
              {slot ? `Swap ${slot.type} · ${slot.day}` : 'Choose a recipe'}
            </div>
            <button style={{ background:'none', border:'none', cursor:'pointer', fontSize:20, color:'var(--text-light)', lineHeight:1 }} onClick={onClose}>✕</button>
          </div>
          <div className="picker-filter-row">
            {filters.map(f => (
              <button key={f} className={`picker-filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
        </div>
        <div className="picker-body">
          <div className="picker-recipe-list">
            {filtered.map(r => (
              <div key={r.id} className="picker-recipe-row" onClick={() => onPick(r)}>
                <div className="picker-recipe-emoji">{r.emoji}</div>
                <div className="picker-recipe-info">
                  <div className="picker-recipe-title">{r.title}</div>
                  <div className="picker-recipe-meta">{guessMealType(r)} · ⏱ {r.prepTime} · 🍽 {r.servings} servings</div>
                  <div className="picker-recipe-tags">
                    {r.healthLabels.slice(0,3).map(l => {
                      const lm = LABEL_MAP[l];
                      return lm ? <span key={l} style={{ fontSize:10, padding:'2px 7px', borderRadius:50, background:lm.color, color:lm.text, fontWeight:600 }}>{lm.label}</span> : null;
                    })}
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div style={{ textAlign:'center', padding:'32px 0', color:'var(--text-light)', fontSize:14 }}>No recipes for this filter yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

// Food log tags
const FOOD_LOG_TAGS = [
  'High protein','Low GI','Anti-inflammatory','Gut-friendly','Hormone-supporting',
  'Iron-rich','Omega-3','High fibre','Fermented','Plant-based','Dairy-free','Gluten-free',
];
const FEEL_OPTIONS = [
  { label:'Energised', emoji:'⚡' },
  { label:'Good', emoji:'🌿' },
  { label:'Okay', emoji:'😐' },
  { label:'Bloated', emoji:'😮‍💨' },
  { label:'Tired', emoji:'😴' },
  { label:'Unsettled', emoji:'🤢' },
];
const SYMPTOM_TAGS = ['No symptoms','Bloating','Cravings','Brain fog','Cramps','Fatigue','Mood dip','Skin flare'];

function FoodLogSection({ user }) {
  const db = window._supa;
  const [mealName, setMealName] = useState('');
  const [mealType, setMealType] = useState('');
  const [feel, setFeel] = useState('');
  const [tags, setTags] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [note, setNote] = useState('');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    db.from('food_log').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(50)
      .then(({ data }) => { if (data) setEntries(data); setLoading(false); });
  }, [user?.id]);

  const toggleTag = t => setTags(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);
  const toggleSymptom = s => setSymptoms(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  const save = async () => {
    if (!mealName.trim() || !user) return;
    const row = {
      user_id: user.id,
      meal: mealName.trim(),
      meal_type: mealType || null,
      feel: feel || null,
      tags,
      symptoms,
      note: note.trim() || null,
    };
    const { data } = await db.from('food_log').insert(row).select().single();
    if (data) setEntries(p => [data, ...p]);
    setMealName(''); setMealType(''); setFeel(''); setTags([]); setSymptoms([]); setNote('');
  };

  const feelOpt = FEEL_OPTIONS.find(f => f.label === feel);

  return (
    <div>
      <div className="log-entry-form">
        <div className="log-form-title">Log a meal</div>
        <div className="log-form-row">
          <label className="log-form-label">What did you eat?</label>
          <input className="log-text-input" placeholder="e.g. Salmon tray bake, homemade lentil soup…" value={mealName} onChange={e => setMealName(e.target.value)} />
        </div>
        <div className="log-form-row">
          <label className="log-form-label">Meal type</label>
          <div className="log-feel-row">
            {PLAN_MEAL_TYPES.map(t => (
              <button key={t} className={`log-feel-btn ${mealType === t ? 'selected' : ''}`} onClick={() => setMealType(t)}>{t}</button>
            ))}
          </div>
        </div>
        <div className="log-form-row">
          <label className="log-form-label">How did you feel?</label>
          <div className="log-feel-row">
            {FEEL_OPTIONS.map(f => (
              <button key={f.label} className={`log-feel-btn ${feel === f.label ? 'selected' : ''}`} onClick={() => setFeel(f.label)}>
                {f.emoji} {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="log-form-row">
          <label className="log-form-label">Tag this meal</label>
          <div className="log-tag-chips">
            {FOOD_LOG_TAGS.map(t => (
              <button key={t} className={`log-tag-chip ${tags.includes(t) ? 'selected' : ''}`} onClick={() => toggleTag(t)}>{t}</button>
            ))}
          </div>
        </div>
        <div className="log-form-row">
          <label className="log-form-label">Any symptoms?</label>
          <div className="log-tag-chips">
            {SYMPTOM_TAGS.map(s => (
              <button key={s} className={`log-tag-chip ${symptoms.includes(s) ? 'selected' : ''}`} onClick={() => toggleSymptom(s)}>{s}</button>
            ))}
          </div>
        </div>
        <div className="log-form-row">
          <label className="log-form-label">Notes (optional)</label>
          <input className="log-text-input" placeholder="Anything else worth noting…" value={note} onChange={e => setNote(e.target.value)} />
        </div>
        <button className="log-save-btn" onClick={save} disabled={!mealName.trim()}>Save entry →</button>
      </div>

      {loading ? (
        <div style={{ padding:'32px 0', textAlign:'center', color:'var(--text-light)', fontSize:14 }}>Loading your log…</div>
      ) : entries.length === 0 ? (
        <div className="log-empty">
          <div style={{ fontSize:36, marginBottom:12 }}>🌿</div>
          <div style={{ fontFamily:'var(--font-serif)', fontSize:18, fontStyle:'italic', color:'var(--text-mid)' }}>No entries yet</div>
          <div style={{ fontSize:13, color:'var(--text-light)', marginTop:6 }}>Start logging to build your personal food diary.</div>
        </div>
      ) : (
        <div className="log-entries">
          <div style={{ fontSize:11, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-light)', marginBottom:12 }}>Recent entries</div>
          {entries.map(e => {
            const fOpt = FEEL_OPTIONS.find(f => f.label === e.feel);
            const feelColor = { 'Energised':'#C8E6C4','Good':'#C4DEB8','Okay':'#F5E6A3','Bloated':'#FFD9B3','Tired':'#D4B8E8','Unsettled':'#F4C4C4' }[e.feel] || 'var(--warm-beige)';
            const feelText = { 'Energised':'#2E6B3E','Good':'#2E5E1E','Okay':'#7A6000','Bloated':'#8B4A00','Tired':'#4A2E6E','Unsettled':'#8B2020' }[e.feel] || 'var(--text-mid)';
            return (
              <div key={e.id} className="log-entry-card">
                <div className="log-entry-top">
                  <div>
                    <div className="log-entry-meal">{e.meal}</div>
                    <div className="log-entry-meta">
                      {e.meal_type && <span style={{ marginRight:8 }}>{e.meal_type}</span>}
                      {new Date(e.created_at).toLocaleDateString('en-GB', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}
                    </div>
                  </div>
                  {e.feel && (
                    <div className="log-entry-feel" style={{ background:feelColor, color:feelText }}>
                      {fOpt?.emoji} {e.feel}
                    </div>
                  )}
                </div>
                {e.tags?.length > 0 && (
                  <div className="log-entry-tags">
                    {e.tags.map(t => <span key={t} className="log-entry-tag">{t}</span>)}
                  </div>
                )}
                {e.symptoms?.length > 0 && (
                  <div className="log-entry-tags" style={{ marginTop:4 }}>
                    {e.symptoms.map(s => <span key={s} style={{ fontSize:11, padding:'3px 9px', borderRadius:50, background:'#F2C4CE44', color:'#8B3A52', border:'1px solid #F2C4CE' }}>{s}</span>)}
                  </div>
                )}
                {e.note && <div className="log-entry-note">"{e.note}"</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MealPlanTab({ user, onSignIn, isPremium, onSubscribe, healthGoals, onRecipeClick }) {
  const [section, setSection] = useState('plan');

  // Plan setup state — default 5 recipes, all meal types
  const [recipeCount, setRecipeCount] = useState(5);
  const [mealTypes, setMealTypes] = useState(['Breakfast','Lunch','Dinner']);
  const [plan, setPlan] = useState(null);
  const [showPicker, setShowPicker] = useState(null);
  const [showSetup, setShowSetup] = useState(false);
  const [planLoaded, setPlanLoaded] = useState(false);

  // Load plan from Supabase
  useEffect(() => {
    if (!user || !isPremium) return;
    window._supa.from('meal_plans').select('*').eq('user_id', user.id).maybeSingle()
      .then(({ data }) => {
        if (data) {
          setPlan(data.plan && Object.keys(data.plan).length ? data.plan : null);
          setRecipeCount(data.recipe_count || 5);
          setMealTypes(data.meal_types || ['Breakfast','Lunch','Dinner']);
        }
        setPlanLoaded(true);
      });
  }, [user?.id, isPremium]);

  // Auto-generate on first load if no plan exists
  const hasAutoGenerated = React.useRef(false);
  useEffect(() => {
    if (isPremium && user && planLoaded && !plan && !hasAutoGenerated.current) {
      hasAutoGenerated.current = true;
      const newPlan = buildWeekPlan(recipeCount, mealTypes, healthGoals);
      savePlan(newPlan, recipeCount, mealTypes);
    }
  }, [isPremium, user, planLoaded]);

  const savePlan = (newPlan, count, types) => {
    setPlan(newPlan);
    if (user) {
      window._supa.from('meal_plans').upsert(
        { user_id: user.id, plan: newPlan, recipe_count: count, meal_types: types, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      );
    }
  };

  const toggleMealType = t => setMealTypes(p => p.includes(t) ? (p.length > 1 ? p.filter(x => x !== t) : p) : [...p, t]);

  const conditionPool = useMemo(() => {
    const pool = ALL_RECIPES.filter(r => !healthGoals?.length || r.healthLabels.some(l => healthGoals.includes(l)));
    return pool.length >= 4 ? pool : ALL_RECIPES;
  }, [healthGoals]);

  const generate = () => {
    const newPlan = buildWeekPlan(recipeCount, mealTypes, healthGoals);
    savePlan(newPlan, recipeCount, mealTypes);
    setShowSetup(false);
  };

  const swapRecipe = (recipe) => {
    if (!showPicker) return;
    const newPlan = { ...plan, [showPicker.day]: { ...plan[showPicker.day], [showPicker.type]: recipe } };
    savePlan(newPlan, recipeCount, mealTypes);
    setShowPicker(null);
  };

  const groceryRecipes = useMemo(() => plan ? buildGroceryFromPlan(plan) : [], [plan]);

  // Gate: not logged in
  if (!user) return (
    <div className="page-wrap">
      <div className="page-hero">
        <div className="page-hero-script">plan ahead</div>
        <h1 className="page-hero-title">My Plan</h1>
      </div>
      <div className="plan-premium-gate">
        <div style={{ fontSize:40, marginBottom:16 }}>📅</div>
        <div style={{ fontFamily:'var(--font-serif)', fontSize:24, fontStyle:'italic', color:'var(--text)', marginBottom:8 }}>Sign in to unlock Plan</div>
        <p style={{ fontSize:15, color:'var(--text-mid)', maxWidth:400, margin:'0 auto 24px', lineHeight:1.6 }}>
          Build your weekly meal plan, generate a grocery list, and log how food makes you feel — all in one place.
        </p>
        <button className="welcome-cta" onClick={onSignIn}>Sign in / Sign up →</button>
      </div>
    </div>
  );

  // Gate: not premium
  if (!isPremium) return (
    <div className="page-wrap">
      <div className="page-hero">
        <div className="page-hero-script">plan ahead</div>
        <h1 className="page-hero-title">My Plan</h1>
      </div>
      <div className="plan-premium-gate">
        <div style={{ fontSize:40, marginBottom:16 }}>✨</div>
        <div style={{ fontFamily:'var(--font-serif)', fontSize:24, fontStyle:'italic', color:'var(--text)', marginBottom:8 }}>Premium feature</div>
        <p style={{ fontSize:15, color:'var(--text-mid)', maxWidth:400, margin:'0 auto 24px', lineHeight:1.6 }}>
          My Plan includes your weekly meal planner, auto-generated grocery list, and food & wellness log. Upgrade to unlock.
        </p>
        <div style={{ display:'flex', flexDirection:'column', gap:10, maxWidth:320, margin:'0 auto 28px', textAlign:'left' }}>
          {['📅 Weekly meal plan — 3, 5 or 7 recipes','🛒 Auto grocery list from your plan','📓 Food & wellness log with mood tags','📖 Downloadable recipe book'].map(f => (
            <div key={f} style={{ fontSize:14, color:'var(--text-mid)', display:'flex', gap:8 }}>{f}</div>
          ))}
        </div>
        <button className="welcome-cta" onClick={onSubscribe}>Upgrade to Premium →</button>
      </div>
    </div>
  );

  const weekStart = (() => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(new Date().setDate(diff));
  })();
  const weekLabel = weekStart.toLocaleDateString('en-GB', { day:'numeric', month:'short' }) + ' – ' +
    new Date(weekStart.getTime() + 6*86400000).toLocaleDateString('en-GB', { day:'numeric', month:'short' });

  const conditionLabel = healthGoals?.length
    ? healthGoals.map(id => HEALTH_GOALS.find(g => g.id === id)?.icon).filter(Boolean).join(' ')
    : '🌿';

  return (
    <div className="page-wrap">
      {showPicker && (
        <RecipePickerSheet slot={showPicker} pool={conditionPool} onPick={swapRecipe} onClose={() => setShowPicker(null)} />
      )}

      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:12 }}>
        <div>
          <div style={{ fontFamily:'var(--font-body)', fontSize:11, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--tan)', marginBottom:4 }}>plan ahead</div>
          <h1 style={{ fontFamily:'var(--font-serif)', fontSize:36, fontStyle:'italic', fontWeight:600, color:'var(--text)' }}>My Plan</h1>
          <div style={{ fontSize:13, color:'var(--text-light)', marginTop:2 }}>
            {conditionLabel} Week of {weekLabel}
          </div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button
            onClick={() => setShowSetup(s => !s)}
            style={{ padding:'9px 18px', border:'1.5px solid var(--border)', borderRadius:50, background:'var(--white)', color:'var(--text-mid)', fontSize:13, fontFamily:'var(--font-body)', cursor:'pointer', fontWeight:500 }}
          >
            ⚙ Customise
          </button>
          <button
            onClick={generate}
            style={{ padding:'9px 18px', border:'1.5px solid var(--tan)', borderRadius:50, background:'var(--warm-beige)', color:'var(--brown)', fontSize:13, fontFamily:'var(--font-body)', cursor:'pointer', fontWeight:600 }}
          >
            ↺ Regenerate
          </button>
        </div>
      </div>

      {/* Customise panel — collapsed by default */}
      {showSetup && (
        <div className="plan-setup-card" style={{ marginBottom:20 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
            <div>
              <span className="plan-setup-label">Recipes per week</span>
              <div className="plan-count-btns">
                {[3,5,7].map(n => (
                  <div key={n} className={`plan-count-btn ${recipeCount===n?'selected':''}`} onClick={() => setRecipeCount(n)}>
                    {n}
                    <span className="plan-count-sub">{n===3?'Light':n===5?'Regular':'Full week'}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <span className="plan-setup-label">Meal types</span>
              <div className="plan-type-chips">
                {PLAN_MEAL_TYPES.map(t => (
                  <button key={t} className={`plan-type-chip ${mealTypes.includes(t)?'selected':''}`} onClick={() => toggleMealType(t)}>{t}</button>
                ))}
              </div>
            </div>
          </div>
          <button className="plan-generate-btn" onClick={generate}>Apply & regenerate</button>
        </div>
      )}

      <div className="plan-section-tabs">
        <button className={`plan-section-tab ${section==='plan'?'active':''}`} onClick={() => setSection('plan')}>📅 Meal Plan</button>
        <button className={`plan-section-tab ${section==='grocery'?'active':''}`} onClick={() => setSection('grocery')}>🛒 Grocery List</button>
        <button className={`plan-section-tab ${section==='log'?'active':''}`} onClick={() => setSection('log')}>📓 Food Log</button>
      </div>

      {/* ── MEAL PLAN SECTION ── */}
      {section === 'plan' && (
        <div>
          {plan ? (
            <>
              <div style={{ fontSize:11, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-light)', marginBottom:14 }}>
                {recipeCount} recipes · {healthGoals?.length ? healthGoals.map(id => HEALTH_GOALS.find(g=>g.id===id)?.label).filter(Boolean).join(', ') : 'All recipes'}
              </div>
              <div className="plan-week-grid">
                {DAYS_OF_WEEK.map(day => {
                  const dayMeals = plan[day] || {};
                  return (
                    <div key={day} className="plan-week-card">
                      <div className="plan-week-card-day">{day}</div>
                      {PLAN_MEAL_TYPES.filter(t => mealTypes.includes(t) || mealTypes.length === 0 || true).map(type => {
                        const r = dayMeals[type];
                        return (
                          <div key={type} className="plan-week-meal-row">
                            <div className="plan-week-meal-type">{type}</div>
                            {r ? (
                              <>
                                <div className="plan-week-meal-name" onClick={() => onRecipeClick(r)}>{r.emoji} {r.title}</div>
                                <button className="plan-week-swap" onClick={() => setShowPicker({ day, type })}>swap</button>
                              </>
                            ) : (
                              <>
                                <div style={{ flex:1, fontSize:12, color:'var(--text-light)', fontStyle:'italic' }}>Add your own</div>
                                <button className="plan-week-swap" onClick={() => setShowPicker({ day, type })}>+ add</button>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div style={{ textAlign:'center', padding:'48px 0', color:'var(--text-light)' }}>
              <div style={{ fontSize:40, marginBottom:12 }}>🥗</div>
              <div style={{ fontFamily:'var(--font-serif)', fontSize:18, fontStyle:'italic', color:'var(--text-mid)' }}>Building your plan…</div>
            </div>
          )}
        </div>
      )}

      {/* ── GROCERY LIST SECTION ── */}
      {section === 'grocery' && (
        groceryRecipes.length === 0 ? (
          <div style={{ textAlign:'center', padding:'48px 0' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🛒</div>
            <div style={{ fontFamily:'var(--font-serif)', fontSize:18, fontStyle:'italic', color:'var(--text-mid)' }}>No plan yet</div>
            <div style={{ fontSize:13, color:'var(--text-light)', marginTop:6, marginBottom:20 }}>Build your meal plan first, then your grocery list generates automatically.</div>
            <button className="welcome-cta" style={{ fontSize:14, padding:'12px 28px' }} onClick={() => setSection('plan')}>Go to Meal Plan →</button>
          </div>
        ) : (
          <GroceryList savedRecipes={groceryRecipes} user={user} />
        )
      )}

      {/* ── FOOD LOG SECTION ── */}
      {section === 'log' && <FoodLogSection user={user} />}
    </div>
  );
}

function SavedTab({ saved, onRecipeClick, onDieticianClick, onToggleSave, isPremium, onSubscribe, user }) {
  const savedRecipes = ALL_RECIPES.filter(r => saved.has(r.id));

  if (savedRecipes.length === 0) {
    return (
      <div className="page-wrap">
        <div className="page-hero">
          <div className="page-hero-script">your collection</div>
          <h1 className="page-hero-title">Saved Recipes</h1>
        </div>
        <div className="empty-state"><div className="empty-icon">🤍</div><div className="empty-title">Nothing saved yet</div><div className="empty-text">Tap 🤍 on any recipe to save it here.</div></div>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom: 24, flexWrap:'wrap', gap:16 }}>
        <div className="page-hero" style={{ marginBottom:0 }}>
          <div className="page-hero-script">your collection</div>
          <h1 className="page-hero-title">Recipe Book</h1>
          <p className="page-hero-sub">{savedRecipes.length} recipe{savedRecipes.length !== 1 ? 's' : ''} saved</p>
        </div>
        <button
          onClick={() => {
            if (!isPremium) { onSubscribe(); return; }
            downloadBook(savedRecipes);
          }}
          style={{
            display:'flex', alignItems:'center', gap:8,
            padding:'12px 24px', background: isPremium ? 'var(--brown)' : 'var(--warm-beige)',
            color: isPremium ? 'white' : 'var(--brown)',
            border: isPremium ? 'none' : '1.5px solid var(--tan)',
            borderRadius:50, fontSize:14, fontWeight:600,
            cursor:'pointer', fontFamily:'var(--font-body)', flexShrink:0,
            boxShadow:'var(--shadow-md)', transition:'opacity 0.15s',
          }}
          onMouseEnter={e=>e.currentTarget.style.opacity='0.85'}
          onMouseLeave={e=>e.currentTarget.style.opacity='1'}
        >
          {isPremium ? '↓ Download Recipe Book' : '🔒 Premium — Download Recipe Book'}
        </button>
      </div>
          <div style={{
            borderRadius:20, overflow:'hidden', marginBottom:40,
            boxShadow:'0 8px 40px rgba(44,24,16,0.18)',
            display:'flex', maxWidth:900,
          }}>
            <div style={{
              width:32, flexShrink:0,
              background:'var(--brown)',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <span style={{
                fontFamily:'var(--font-serif)', fontSize:11, fontStyle:'italic', color:'rgba(255,255,255,0.7)',
                writingMode:'vertical-rl', textOrientation:'mixed', letterSpacing:'0.12em',
              }}>nuri.</span>
            </div>
            <div style={{
              flex:1, padding:'48px 56px',
              ...getGingham(1),
              display:'flex', alignItems:'center',
            }}>
              <div style={{
                background:'rgba(250,246,240,0.95)', borderRadius:16,
                padding:'40px 48px', maxWidth:480,
                boxShadow:'0 4px 24px rgba(44,24,16,0.14)',
              }}>
                <div style={{ fontFamily:'var(--font-body)', fontSize:11, fontWeight:300, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--tan)', marginBottom:6 }}>a personal collection</div>
                <div style={{ fontFamily:'var(--font-serif)', fontSize:44, fontStyle:'italic', fontWeight:600, color:'var(--text)', lineHeight:1.1, marginBottom:8 }}>
                  My Recipe<br/>Book
                </div>
                <div style={{ width:40, height:2, background:'var(--tan)', borderRadius:2, margin:'16px 0' }}></div>
                <div style={{ fontSize:13, color:'var(--text-light)' }}>
                  {savedRecipes.length} recipe{savedRecipes.length !== 1 ? 's' : ''} · nuri.
                </div>
              </div>
            </div>
          </div>

          <div style={{ maxWidth:640 }}>
            <div style={{ fontSize:11, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-light)', marginBottom:16 }}>
              Contents
            </div>
            {savedRecipes.map((r, i) => {
              const d = getD(r.dieticianId);
              return (
                <div
                  key={r.id}
                  onClick={() => onRecipeClick(r)}
                  style={{
                    display:'flex', alignItems:'center', gap:16,
                    padding:'14px 0', borderBottom:'1px solid var(--border)',
                    cursor:'pointer',
                  }}
                  onMouseEnter={e=>e.currentTarget.style.background='var(--warm-beige)'}
                  onMouseLeave={e=>e.currentTarget.style.background=''}
                >
                  <div style={{
                    width:32, height:32, borderRadius:'50%', flexShrink:0,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontFamily:'var(--font-serif)', fontWeight:600, fontSize:13,
                    background:'var(--warm-beige)', color:'var(--tan)', border:'1.5px solid var(--border)',
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:'var(--font-serif)', fontSize:18, fontStyle:'italic', fontWeight:600, color:'var(--text)' }}>
                      {r.title}
                    </div>
                    {d && <div style={{ fontSize:12, color:'var(--text-light)', marginTop:2 }}>{d.name} · {d.credentials}</div>}
                  </div>
                  <div style={{ fontSize:22, flexShrink:0 }}>{r.emoji}</div>
                  <button
                    onClick={e => { e.stopPropagation(); onToggleSave(r.id); }}
                    style={{ background:'none', border:'none', cursor:'pointer', fontSize:16, flexShrink:0, padding:4 }}
                    title="Remove from saved"
                  >❤️</button>
                </div>
              );
            })}
          </div>
    </div>
  );
}

const CHALLENGE_GOALS = [
  { id:'pcos',          target:4, badges:[{at:1,icon:'🌸',label:'PCOS Starter'},{at:3,icon:'🌺',label:'PCOS Explorer'},{at:4,icon:'👑',label:'PCOS Champion'}] },
  { id:'fertility',     target:3, badges:[{at:1,icon:'🌱',label:'Seed Planted'},{at:3,icon:'🌿',label:'Fertility Nourisher'}] },
  { id:'hormones',      target:4, badges:[{at:1,icon:'⚖️',label:'In Balance'},{at:3,icon:'✨',label:'Hormone Harmony'},{at:4,icon:'🌟',label:'Cycle Queen'}] },
  { id:'energy',        target:3, badges:[{at:1,icon:'⚡',label:'Spark'},{at:3,icon:'🔋',label:'Fully Charged'}] },
  { id:'period',        target:3, badges:[{at:1,icon:'🔴',label:'Flow Starter'},{at:3,icon:'🌙',label:'Cycle Synced'}] },
  { id:'gut',           target:4, badges:[{at:1,icon:'🌿',label:'Gut Curious'},{at:3,icon:'🦠',label:'Gut Guardian'},{at:4,icon:'💚',label:'Gut Healed'}] },
  { id:'thyroid',       target:3, badges:[{at:1,icon:'🦋',label:'Thyroid Aware'},{at:3,icon:'💙',label:'Thyroid Warrior'}] },
  { id:'endometriosis', target:3, badges:[{at:1,icon:'🩷',label:'Endo Fighter'},{at:3,icon:'💜',label:'Endo Strong'}] },

  { id:'menopause',     target:3, badges:[{at:1,icon:'🌙',label:'Transition Guide'},{at:3,icon:'🌕',label:'Menopause Maven'}] },
];


// ── MY SUBSCRIPTION ──────────────────────────────────────────
const MONTHLY_PRICE_ID = 'price_1TeJRT1L75noll9TSVxVWbPt';
const ANNUAL_PRICE_ID  = 'price_1TeJRW1L75noll9Toqnw83Ob';
const STRIPE_PORTAL_URL = 'https://billing.stripe.com/p/login/7sYcMXcLkax1c9n7NX7wA00';

function MySubscription({ user, isPremium, onSubscribe }) {
  const [subData, setSubData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const db = window._supa;

  React.useEffect(() => {
    if (!user) { setLoading(false); return; }
    db.rpc('get_my_subscription').maybeSingle()
      .then(({ data }) => { setSubData(data); setLoading(false); });
  }, [user]);

  const isMonthly = subData?.stripe_price_id === MONTHLY_PRICE_ID;
  const isAnnual  = subData?.stripe_price_id === ANNUAL_PRICE_ID;
  const planLabel = isAnnual ? 'Annual Plan' : isMonthly ? 'Monthly Plan' : 'Nuri Premium';
  const planPrice = isAnnual ? '$99.99 / year' : '$9.99 / month';
  const nextBilling = subData?.current_period_end
    ? new Date(subData.current_period_end).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })
    : null;

  const openPortal = () => {
    const url = user?.email
      ? `${STRIPE_PORTAL_URL}?prefilled_email=${encodeURIComponent(user.email)}`
      : STRIPE_PORTAL_URL;
    window.open(url, '_blank');
  };

  if (loading) return null;

  if (!isPremium || !subData) {
    return (
      <div className="card-block">
        <div className="card-block-title"><span>✨ My Subscription</span></div>
        <p style={{fontSize:13,color:'var(--text-light)',fontStyle:'italic',fontFamily:'var(--font-serif)',marginBottom:16}}>
          You're on the free plan. Upgrade to unlock all recipes, the meal planner and more.
        </p>
        <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
          <button onClick={() => { window._postPayRedirect = { tab: 'you' }; onSubscribe(); }}
            style={{padding:'10px 22px',background:'var(--brown)',color:'white',border:'none',borderRadius:50,fontFamily:'var(--font-body)',fontSize:13,fontWeight:600,cursor:'pointer'}}>
            Monthly · $9.99/mo
          </button>
          <button onClick={() => { window._postPayRedirect = { tab: 'you' }; onSubscribe(); }}
            style={{padding:'10px 22px',background:'var(--warm-beige)',color:'var(--brown)',border:'1.5px solid var(--brown)',borderRadius:50,fontFamily:'var(--font-body)',fontSize:13,fontWeight:600,cursor:'pointer'}}>
            Annual · $99.99/yr · Save 17%
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card-block">
      <div className="card-block-title"><span>✨ My Subscription</span></div>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
        <div style={{background:'var(--sage)',color:'white',borderRadius:50,padding:'3px 12px',fontSize:11,fontWeight:700,letterSpacing:'0.04em'}}>ACTIVE</div>
        <div style={{fontFamily:'var(--font-serif)',fontSize:16,fontStyle:'italic',fontWeight:600,color:'var(--text)'}}>{planLabel}</div>
        <div style={{fontSize:13,color:'var(--text-light)',marginLeft:'auto'}}>{planPrice}</div>
      </div>
      {nextBilling && (
        <p style={{fontSize:13,color:'var(--text-mid)',marginBottom:12}}>
          Next billing date: <strong>{nextBilling}</strong>
        </p>
      )}
      {isMonthly && (
        <div style={{background:'var(--warm-beige)',borderRadius:10,padding:'10px 14px',marginBottom:14,fontSize:13,color:'var(--text-mid)'}}>
          💡 Switch to annual and save 17% — just <strong>$99.99/year</strong> instead of $119.88
          <button onClick={() => { window._postPayRedirect = { tab: 'you' }; onSubscribe(); }}
            style={{display:'block',marginTop:8,padding:'7px 16px',background:'var(--brown)',color:'white',border:'none',borderRadius:50,fontFamily:'var(--font-body)',fontSize:12,fontWeight:600,cursor:'pointer'}}>
            Switch to Annual
          </button>
        </div>
      )}
      <button onClick={openPortal}
        style={{padding:'9px 20px',background:'transparent',color:'var(--text-light)',border:'1.5px solid var(--border)',borderRadius:50,fontFamily:'var(--font-body)',fontSize:12,fontWeight:500,cursor:'pointer'}}>
        Manage or cancel subscription ↗
      </button>
    </div>
  );
}

function ReferralCard({ user }) {
  const [code, setCode] = React.useState(null);
  const [copied, setCopied] = React.useState(false);
  const db = window._supa;

  React.useEffect(() => {
    if (!user) return;
    db.from('profiles').select('referral_code').eq('id', user.id).single().then(({ data }) => {
      if (data?.referral_code) {
        setCode(data.referral_code);
      } else {
        // Generate a new code
        const newCode = user.id.split('-')[0].toUpperCase();
        db.from('profiles').update({ referral_code: newCode }).eq('id', user.id).then(() => setCode(newCode));
      }
    });
  }, [user]);

  const referralLink = code ? 'https://www.nurirecipes.com?ref=' + code : null;

  const handleShare = () => {
    const msg = 'I found Nuri - recipes built by registered dietitians for PCOS, endo and hormonal conditions. Use my link to sign up and we both get a free month: ' + referralLink;
    if (navigator.share) {
      navigator.share({ title: 'Nuri', text: msg, url: referralLink });
    } else {
      navigator.clipboard?.writeText(referralLink).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
    }
  };

  if (!referralLink) return null;

  return (
    <div className="card-block" style={{background:'linear-gradient(135deg, var(--warm-beige), var(--cream))'}}>
      <div className="card-block-title"><span>🌿 Refer a Friend</span></div>
      <p style={{fontSize:13,color:'var(--text-mid)',lineHeight:1.6,marginBottom:12}}>
        Share Nuri with a friend and you both get <strong>1 month free</strong>. No catch.
      </p>
      <div style={{background:'var(--white)',borderRadius:10,padding:'10px 14px',fontSize:12,color:'var(--text-light)',fontFamily:'var(--font-body)',marginBottom:12,wordBreak:'break-all',border:'1px solid var(--border)'}}>
        {referralLink}
      </div>
      <div style={{display:'flex',gap:8}}>
        <button onClick={handleShare} style={{flex:1,padding:'10px 0',background:'var(--brown)',color:'white',border:'none',borderRadius:50,fontFamily:'var(--font-body)',fontSize:13,fontWeight:600,cursor:'pointer'}}>
          Share link 🌿
        </button>
        <button onClick={() => { navigator.clipboard?.writeText(referralLink); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{padding:'10px 16px',background:'transparent',color:'var(--brown)',border:'1.5px solid var(--brown)',borderRadius:50,fontFamily:'var(--font-body)',fontSize:12,fontWeight:600,cursor:'pointer'}}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}

function CookingPreferenceCard({ dietaryPreferences, onDietaryChange, style }) {
  const active = dietaryPreferences || [];
  const toggle = id => {
    const next = active.includes(id) ? active.filter(x => x !== id) : [...active, id];
    onDietaryChange(next);
  };
  return (
    <div className="card-block" style={{ boxSizing: 'border-box', ...style }}>
      <div className="card-block-title"><span>🍳 How you like to cook</span></div>
      <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
        {COOKING_STYLE_OPTIONS.map(o => {
          const on = active.includes(o.id);
          return (
            <button key={o.id} onClick={() => toggle(o.id)} style={{
              display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:50,
              border: on ? '1.5px solid var(--brown)' : '1.5px solid var(--border)',
              background: on ? 'var(--warm-beige)' : '#fff',
              color: on ? 'var(--brown)' : 'var(--text-mid)',
              fontFamily:'var(--font-body)', fontSize:13, fontWeight: on ? 600 : 400, cursor:'pointer',
            }}>
              <span>{o.icon}</span>{o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ChangePasswordLink({ onOpen }) {
  return (
    <div className="card-block" style={{cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between'}} onClick={onOpen}>
      <span style={{fontSize:14, fontWeight:600, color:'var(--text)', fontFamily:'var(--font-body)'}}>🔒 Change Password</span>
      <span style={{color:'var(--text-light)', fontSize:16}}>→</span>
    </div>
  );
}

function ChangePasswordPage({ user, onBack }) {
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const db = window._supa;

  const handleChangePassword = async () => {
    setError('');
    setSuccess(false);
    if (!currentPassword || !newPassword || !confirmPassword) { setError('Please fill in all fields.'); return; }
    if (newPassword.length < 6) { setError('New password must be at least 6 characters.'); return; }
    if (newPassword !== confirmPassword) { setError('New passwords do not match.'); return; }
    setLoading(true);
    // Re-authenticate with the current password first so someone with an
    // unattended logged-in session can't silently change it without knowing it.
    const { error: signInError } = await db.auth.signInWithPassword({ email: user.email, password: currentPassword });
    if (signInError) {
      setLoading(false);
      setError('Current password is incorrect.');
      return;
    }
    const { error: updateError } = await db.auth.updateUser({ password: newPassword });
    setLoading(false);
    if (updateError) { setError(updateError.message); return; }
    setSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  if (!user) return null;

  return (
    <div className="page-wrap">
      <div className="page-hero" style={{position:'relative'}}>
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="page-hero-script">account security</div>
        <h1 className="page-hero-title">Change Password</h1>
      </div>
      <div style={{maxWidth:420, margin:'0 auto'}}>
        <div className="card-block">
          {success ? (
            <>
              <p style={{color:'var(--green-dark)',fontSize:14,marginBottom:16}}>✅ Password updated successfully.</p>
              <button className="auth-btn" onClick={onBack}>Back to your profile</button>
            </>
          ) : (
            <>
              {error && <div className="auth-error">{error}</div>}
              <div className="auth-field">
                <label className="auth-label">Current password</label>
                <input className="auth-input" type="password" placeholder="••••••••" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
              </div>
              <div className="auth-field">
                <label className="auth-label">New password</label>
                <input className="auth-input" type="password" placeholder="At least 6 characters" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              </div>
              <div className="auth-field">
                <label className="auth-label">Confirm new password</label>
                <input className="auth-input" type="password" placeholder="Repeat new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleChangePassword()} />
              </div>
              <button className="auth-btn" onClick={handleChangePassword} disabled={loading} style={{marginTop:8}}>
                {loading ? 'Updating…' : 'Update password'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function YouTab({ healthGoals, followed, saved, tried, triedPhotos, onEditGoals, onDieticianClick, onApply, onRecipeClick, isRD, onToggleRD, rdDieticianId, onSetRDDietician, supaDietitians, user, isPremium, onSubscribe, supaAllDietitians, onChangePassword, dietaryPreferences, onDietaryChange }) {
  const goals = HEALTH_GOALS.filter(g => healthGoals.includes(g.id));
  const allKnownDs = [
    ...ALL_DIETICIANS,
    ...(supaAllDietitians || []).filter(d => !ALL_DIETICIANS.find(x => x.id === parseInt(d.id, 10)))
  ];
  const followedDs = allKnownDs.filter(d => followed.has(parseInt(d.id, 10)));
  const triedPhotosArr = Object.entries(triedPhotos).filter(([,v]) => v);
  const triedArr = [...tried];

  return (
    <div className="page-wrap">
      <div className="page-hero">
        <div className="page-hero-script">your space</div>
        <h1 className="page-hero-title">Your Profile</h1>
      </div>
      <div className="you-grid">
        <div>
          <div className="you-stats">
            {[{num: followed.size, lbl:'Following'}, {num: saved.size, lbl:'Saved'}, {num: tried.size, lbl:'Made'}, {num: goals.length, lbl:'Goals'}].map((s,i) => (
              <div key={i} className="you-stat">
                <span className="stat-num">{s.num}</span>
                <span className="stat-label">{s.lbl}</span>
              </div>
            ))}
          </div>

          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, alignItems:'stretch', marginBottom:16}} className="you-focus-row">
            <div className="card-block" style={{marginBottom:0, boxSizing:'border-box', height:'100%'}}>
              <div className="card-block-title">
                <span>Your health focus</span>
                <button className="edit-link" onClick={onEditGoals}>Edit</button>
              </div>
              {goals.length > 0 ? (
                <div className="focus-tags">
                  {goals.map(g => <span key={g.id} className="focus-tag" style={{ background: g.color + '66' }}>{g.icon} {g.label}</span>)}
                </div>
              ) : (
                <p style={{ fontSize: 13, color: 'var(--text-light)', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>No goals set yet — tap Edit to personalise.</p>
              )}
            </div>
            <CookingPreferenceCard dietaryPreferences={dietaryPreferences} onDietaryChange={onDietaryChange} style={{marginBottom:0, height:'100%'}} />
          </div>

          {healthGoals.length > 0 && (
            <div className="card-block">
              <div className="card-block-title"><span>🏅 My Recipe Journey</span></div>
              <p style={{ fontSize: 13, color: 'var(--text-light)', fontStyle: 'italic', fontFamily: 'var(--font-serif)', marginBottom: 16 }}>Try recipes for your health conditions and earn badges along the way.</p>
              {healthGoals.map(goalId => {
                const goal = HEALTH_GOALS.find(g => g.id === goalId);
                const challenge = CHALLENGE_GOALS.find(c => c.id === goalId);
                if (!goal || !challenge) return null;
                const goalRecipes = ALL_RECIPES.filter(r => r.healthLabels.includes(goalId));
                const triedForGoal = goalRecipes.filter(r => tried.has(r.id)).length;
                const pct = Math.min(100, Math.round((triedForGoal / challenge.target) * 100));
                const earnedBadges = challenge.badges.filter(b => triedForGoal >= b.at);
                const nextBadge = challenge.badges.find(b => triedForGoal < b.at);
                return (
                  <div key={goalId} className="challenge-card">
                    <div className="challenge-header">
                      <span className="challenge-icon">{goal.icon}</span>
                      <div>
                        <div className="challenge-title">{goal.label} Challenge</div>
                        <div className="challenge-sub">{triedForGoal} of {challenge.target} recipes tried · {goalRecipes.length} available</div>
                      </div>
                    </div>
                    <div className="progress-bar-track">
                      <div className="progress-bar-fill" style={{ width: pct + '%' }} />
                    </div>
                    <div className="progress-label">
                      <span>{pct}% complete</span>
                      {nextBadge && <span>Next: {nextBadge.icon} {nextBadge.label}</span>}
                    </div>
                    {earnedBadges.length > 0 && (
                      <div className="badge-row">
                        {challenge.badges.map(b => (
                          <span key={b.label} className={`badge ${triedForGoal >= b.at ? 'badge-earned' : 'badge-locked'}`}>
                            {b.icon} {b.label}
                          </span>
                        ))}
                      </div>
                    )}
                    {triedForGoal < challenge.target && (
                      <div style={{ marginTop: 14 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: 8 }}>Try next →</div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {goalRecipes.filter(r => !tried.has(r.id)).slice(0, 3).map(r => (
                            <button key={r.id} onClick={() => onRecipeClick(r)} style={{
                              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
                              background: goal.color + '55', border: 'none', borderRadius: 50,
                              fontSize: 12, color: 'var(--text-mid)', cursor: 'pointer', fontFamily: 'var(--font-body)',
                            }}>
                              {r.emoji} {r.title.length > 24 ? r.title.slice(0, 24) + '…' : r.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {triedForGoal >= challenge.target && (
                      <div style={{ marginTop: 10, fontSize: 13, color: 'var(--brown)', fontWeight: 600 }}>🎉 Challenge complete!</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {triedArr.length > 0 && (
            <div className="card-block">
              <div className="card-block-title"><span>📸 My Kitchen Gallery</span></div>
              <p style={{ fontSize: 13, color: 'var(--text-light)', fontStyle: 'italic', fontFamily: 'var(--font-serif)', marginBottom: 12 }}>Recipes you've made yourself.</p>
              <div className="kitchen-grid">
                {triedArr.map(id => {
                  const r = ALL_RECIPES.find(rec => rec.id === id);
                  const photo = triedPhotos[id];
                  return photo ? (
                    <div key={id} style={{ position: 'relative' }} title={r?.title}>
                      <img src={photo} className="kitchen-photo" alt={r?.title} onClick={() => r && onRecipeClick(r)} style={{ cursor: 'pointer' }} />
                    </div>
                  ) : (
                    <div key={id} onClick={() => r && onRecipeClick(r)} style={{
                      aspect: '1', background: 'var(--warm-beige)', borderRadius: 'var(--radius-sm)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', padding: 8, gap: 4,
                    }}>
                      <span style={{ fontSize: 28 }}>{r?.emoji}</span>
                      <span style={{ fontSize: 10, color: 'var(--text-light)', textAlign: 'center', lineHeight: 1.3 }}>{r?.title.slice(0, 22)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {followedDs.length > 0 && (
            <div className="card-block">
              <div className="card-block-title"><span>Following</span></div>
              {followedDs.map(d => (
                <div key={d.id} className="rd-row" onClick={() => onDieticianClick(d)}>
                  <Avatar initials={d.initials} color={d.avatarColor} cls="avatar-sm" />
                  <div>
                    <div className="rd-row-name">{d.name}</div>
                    <div className="rd-row-creds">{d.credentials} · {d.specialty}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', color: 'var(--text-light)' }}>›</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          {isRD ? (
            <div className="card-block">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontStyle: 'italic', fontWeight: 600, color: 'var(--text)' }}>🩺 Dietitian Portal</div>
                <button className="rd-dash-toggle" onClick={onToggleRD}>Exit RD mode</button>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-mid)', lineHeight: 1.6, marginBottom: 20 }}>Manage your recipes, view your stats, and update your profile in the dietitian portal.</p>
              <a href="dietician-portal.html" target="_blank" className="rd-portal-btn">
                Go to Dietitian Portal →
              </a>
            </div>
          ) : (
            <div className="apply-block">
              <div className="apply-text">🩺 Are you a registered dietitian? Apply to share your recipes on nuri.</div>
              <button className="apply-btn" onClick={onApply}>Apply as a founding RD ✨</button>
              <a href="dietician-portal.html" target="_blank" style={{ marginTop: 10, display: 'inline-block', fontSize: 12, color: 'var(--text-light)', fontFamily: 'var(--font-body)', textDecoration: 'underline', cursor: 'pointer' }}>
                I'm already an approved RD →
              </a>
            </div>
          )}
          <MySubscription user={user} isPremium={isPremium} onSubscribe={onSubscribe} />
          <ReferralCard user={user} />
          <ChangePasswordLink onOpen={onChangePassword} />
        </div>
      </div>
    </div>
  );
}

// ── RD APPLICATION MODAL ─────────────────────────────────────
const SPECIALTIES = [
  'PCOS / PMOS', 'Fertility & Conception', 'Hormone Balance',
  'Low Energy & Fatigue', 'Gut Health',
  'Thyroid Support', 'Menopause', 'Endometriosis',
  'Insulin Resistance', 'Immune Health',
];

function RDApplicationModal({ onClose }) {
  const [fields, setFields] = useState({
    'full-name': '', email: '', credentials: '', 'license-number': '',
    country: '', institution: '', 'years-of-practice': '', 'profile-link': '', bio: '',
  });
  const [specialties, setSpecialties] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setFields(p => ({ ...p, [k]: v }));
  const toggleSpec = s => setSpecialties(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const { error: dbError } = await window._supa.from('rd_applications').insert({
        full_name: fields['full-name'],
        email: fields['email'],
        credentials: fields['credentials'],
        license_number: fields['license-number'],
        country: fields['country'],
        institution: fields['institution'],
        years_of_practice: fields['years-of-practice'],
        specialties: specialties.join(', '),
        bio: fields['bio'],
        website: fields['website'],
        instagram: fields['instagram'],
      });
      if (dbError) throw dbError;
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please email us directly at hello@nuri.com');
    }
    setSubmitting(false);
  };

  const required = ['full-name', 'email', 'credentials', 'license-number', 'country'];
  const canSubmit = required.every(k => fields[k].trim()) && specialties.length > 0;

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-panel">
        <div className="modal-header">
          <div>
            <div className="modal-title-script">join us</div>
            <div className="modal-title">Apply to Post Recipes</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {submitted ? (
            <div className="success-state">
              <div className="success-icon">🌿</div>
              <div className="success-title">Application received!</div>
              <p className="success-text">
                Thank you for applying to nuri. We review every application carefully to verify credentials. We'll be in touch within 5–7 business days.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p className="modal-intro">
                We verify every dietitian before they can post. Please fill in your details below and we'll be in touch within 5–7 business days.
              </p>

              <div className="form-section">
                <div className="form-section-title">Personal Details</div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full name <span>*</span></label>
                    <input className="form-input" type="text" value={fields['full-name']} onChange={e => set('full-name', e.target.value)} placeholder="Dr. Jane Smith" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email <span>*</span></label>
                    <input className="form-input" type="email" value={fields.email} onChange={e => set('email', e.target.value)} placeholder="jane@clinic.com" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Country / State <span>*</span></label>
                    <input className="form-input" type="text" value={fields.country} onChange={e => set('country', e.target.value)} placeholder="e.g. United States, CA" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Current employer / institution</label>
                    <input className="form-input" type="text" value={fields.institution} onChange={e => set('institution', e.target.value)} placeholder="e.g. NYU Langone Health" />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="form-section-title">Professional Credentials</div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Credentials / designations <span>*</span></label>
                    <input className="form-input" type="text" value={fields.credentials} onChange={e => set('credentials', e.target.value)} placeholder="e.g. RD, RDN, CDN, MSc" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">License / registration number <span>*</span></label>
                    <input className="form-input" type="text" value={fields['license-number']} onChange={e => set('license-number', e.target.value)} placeholder="e.g. 12345678" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Years of practice</label>
                    <select className="form-select" value={fields['years-of-practice']} onChange={e => set('years-of-practice', e.target.value)}>
                      <option value="">Select</option>
                      <option>Less than 1 year</option>
                      <option>1–3 years</option>
                      <option>3–5 years</option>
                      <option>5–10 years</option>
                      <option>10+ years</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Website or LinkedIn URL</label>
                    <input className="form-input" type="url" value={fields['profile-link']} onChange={e => set('profile-link', e.target.value)} placeholder="https://" />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="form-section-title">Your Specialties <span style={{color:'#C0392B',fontWeight:400}}>* select at least one</span></div>
                <div className="specialties-grid">
                  {SPECIALTIES.map(s => (
                    <label key={s} className={`specialty-check ${specialties.includes(s) ? 'checked' : ''}`} onClick={() => toggleSpec(s)}>
                      <div className="specialty-check-box">{specialties.includes(s) ? '✓' : ''}</div>
                      <span className="specialty-label">{s}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <div className="form-section-title">A little about you</div>
                <div className="form-group">
                  <label className="form-label">Why do you want to join nuri.?</label>
                  <textarea className="form-textarea" value={fields.bio} onChange={e => set('bio', e.target.value)} placeholder="Tell us about your approach to nutrition, who you work with, and what you'd like to share with our community..." />
                </div>
              </div>

              {error && <p style={{ color: '#C0392B', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>{error}</p>}

              <button className="modal-submit-btn" type="submit" disabled={!canSubmit || submitting}>
                {submitting ? 'Submitting…' : 'Submit Application'}
              </button>
              <p className="form-note">
                Fields marked <span style={{color:'#C0392B'}}>*</span> are required. We verify all credentials before approving accounts. Your information is kept confidential.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ── AUTH MODAL (Supabase Auth) ────────────────────────────────
function LegalModal({ type, onClose }) {
  return (
    <div className="auth-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }} style={{zIndex:2000}}>
      <div style={{background:'var(--white)',borderRadius:'var(--radius)',width:'min(680px,95vw)',maxHeight:'85vh',overflow:'hidden',display:'flex',flexDirection:'column',boxShadow:'0 20px 60px rgba(44,24,16,0.18)'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'20px 28px',borderBottom:'1px solid var(--border)',flexShrink:0}}>
          <div style={{fontFamily:'var(--font-serif)',fontSize:18,fontStyle:'italic',fontWeight:600,color:'var(--text)'}}>
            {type === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
          </div>
          <button onClick={onClose} style={{background:'none',border:'none',fontSize:20,cursor:'pointer',color:'var(--text-light)',lineHeight:1}}>×</button>
        </div>
        <div style={{overflowY:'auto',padding:'24px 28px',fontSize:13,color:'var(--text-mid)',lineHeight:1.8}}>
          {type === 'privacy' ? <PrivacyPolicyContent /> : <TermsOfServiceContent />}
        </div>
      </div>
    </div>
  );
}

function PrivacyPolicyContent() {
  return (
    <div>
      <p style={{fontSize:11,color:'var(--text-light)',marginBottom:16}}>Last updated: July 2026</p>
      <p>This Privacy Policy explains how Nuri App Ltd ("Nuri," "we," "us") collects, uses, shares, and protects personal data when you use our website, mobile applications, and related services (the "Platform").</p>
      <p style={{marginTop:8}}>This policy is designed to comply with the EU General Data Protection Regulation (GDPR), the UK GDPR and Data Protection Act 2018, and applicable data protection laws in jurisdictions where we operate. Specific notices for residents of California, Brazil, Canada, and other regions appear below.</p>
      <p style={{marginTop:8,background:'var(--warm-beige)',padding:'10px 14px',borderRadius:8,fontSize:12}}><strong>Special category data.</strong> Because the Platform serves women managing health conditions, you may share information about your health (including diagnoses, allergies, medications, pregnancy status, or symptoms). This is "special category" personal data under GDPR/UK GDPR and is treated with additional safeguards. We process this data only with your explicit consent or another lawful basis, and you may withdraw consent at any time.</p>
      <h3 style={{fontFamily:'var(--font-serif)',fontStyle:'italic',fontSize:15,margin:'16px 0 8px',color:'var(--text)'}}>1. Data Controller</h3>
      <p>The data controller is Nuri App Ltd, registered at <strong>167-169 Great Portland Street, London, England, W1W 5PF</strong>, company number <strong>17351532</strong>. You can contact us at <strong>join@nurirecipes.com</strong>.</p>
      <h3 style={{fontFamily:'var(--font-serif)',fontStyle:'italic',fontSize:15,margin:'16px 0 8px',color:'var(--text)'}}>2. Personal Data We Collect</h3>
      <p><strong>Account data:</strong> name, email address, password (hashed), profile photo, country.</p>
      <p style={{marginTop:6}}><strong>Health & dietary data (special category):</strong> health conditions, allergies, intolerances, dietary preferences, food restrictions, weight (if voluntarily entered), symptoms, pregnancy status, medications you mention. Only collected with your explicit consent.</p>
      <p style={{marginTop:6}}><strong>Usage data:</strong> pages viewed, recipes saved or rated, time on Platform, search queries, device type, browser, IP address, approximate location.</p>
      <p style={{marginTop:6}}><strong>Payment data:</strong> billing name, address, last four digits of card. Full payment card details are processed directly by Stripe and not stored by us.</p>
      <p style={{marginTop:6}}><strong>Communications data:</strong> messages you send to support, survey responses, content of reviews and comments.</p>
      <p style={{marginTop:6}}><strong>Cookies and similar technologies:</strong> we use strictly necessary cookies to run the Platform (e.g., keeping you logged in, security) and, with your consent, analytics cookies to understand how the Platform is used. You can manage your preferences at any time via the cookie banner.</p>
      <h3 style={{fontFamily:'var(--font-serif)',fontStyle:'italic',fontSize:15,margin:'16px 0 8px',color:'var(--text)'}}>3. How We Use Your Data and Lawful Bases</h3>
      <p><strong>Provide the service</strong> (legal basis: contract, Art. 6(1)(b)) — create and manage your account, deliver content, process payments.</p>
      <p style={{marginTop:6}}><strong>Personalize recipe recommendations</strong> based on your health profile (legal basis: explicit consent, Art. 6(1)(a) and Art. 9(2)(a) for health data). You may withdraw consent at any time in your settings.</p>
      <p style={{marginTop:6}}><strong>Improve and secure the Platform</strong> (legal basis: legitimate interests, Art. 6(1)(f)) — analytics, debugging, abuse prevention. We balance these interests against your rights.</p>
      <p style={{marginTop:6}}><strong>Marketing communications</strong> (legal basis: consent or, where permitted, soft opt-in legitimate interests). You can unsubscribe anytime.</p>
      <p style={{marginTop:6}}><strong>Comply with legal obligations</strong> (legal basis: legal obligation, Art. 6(1)(c)) — tax, accounting, regulatory requests.</p>
      <p style={{marginTop:6}}><strong>Establish, exercise, or defend legal claims</strong> (legal basis: legitimate interests; for health data, Art. 9(2)(f)).</p>
      <h3 style={{fontFamily:'var(--font-serif)',fontStyle:'italic',fontSize:15,margin:'16px 0 8px',color:'var(--text)'}}>4. Automated Decision-Making</h3>
      <p>We may use automated systems to suggest recipes based on your stated preferences and health data. These suggestions do not have legal or similarly significant effects on you, and you can always ignore or override them. You can disable personalization in your settings.</p>
      <h3 style={{fontFamily:'var(--font-serif)',fontStyle:'italic',fontSize:15,margin:'16px 0 8px',color:'var(--text)'}}>5. How We Share Your Data</h3>
      <p>We do not sell your personal data. We share data only with: service providers (hosting, payments, email delivery, analytics) acting as our processors under contract; Registered Dietitians or Contributors, only if you specifically request a one-to-one interaction or post publicly; authorities, when required by law, court order, or to protect rights and safety; and successors in a merger, acquisition, or asset sale, subject to equivalent privacy commitments.</p>
      <p style={{marginTop:6}}>A current list of key sub-processors is available on request by emailing <strong>join@nurirecipes.com</strong>.</p>
      <h3 style={{fontFamily:'var(--font-serif)',fontStyle:'italic',fontSize:15,margin:'16px 0 8px',color:'var(--text)'}}>6. International Data Transfers</h3>
      <p>Your data may be transferred to and processed in countries outside your country of residence, including the United States, the United Kingdom, and the EU. Where we transfer personal data out of the EEA, UK, or other regulated regions, we use appropriate safeguards including the European Commission's Standard Contractual Clauses (SCCs), the UK International Data Transfer Addendum, adequacy decisions, or equivalent mechanisms. You may request a copy of the relevant safeguards by writing to <strong>join@nurirecipes.com</strong>.</p>
      <h3 style={{fontFamily:'var(--font-serif)',fontStyle:'italic',fontSize:15,margin:'16px 0 8px',color:'var(--text)'}}>7. Data Retention</h3>
      <p><strong>Account data:</strong> while your account is active and for 12 months after closure, then deleted or anonymized.</p>
      <p style={{marginTop:6}}><strong>Health and dietary data:</strong> deleted within 30 days of account closure or withdrawal of consent, except where retention is required by law.</p>
      <p style={{marginTop:6}}><strong>Payment and tax records:</strong> 7 years to meet tax and accounting obligations.</p>
      <p style={{marginTop:6}}><strong>Marketing data:</strong> until you unsubscribe, plus a short suppression record to honour your opt-out.</p>
      <p style={{marginTop:6}}><strong>Backups:</strong> rotated out within 90 days.</p>
      <h3 style={{fontFamily:'var(--font-serif)',fontStyle:'italic',fontSize:15,margin:'16px 0 8px',color:'var(--text)'}}>8. Your Rights</h3>
      <p>Subject to applicable law, you have the right to: access your personal data; rectification of inaccurate or incomplete data; erasure ("right to be forgotten"); restriction of processing; data portability; object to processing based on legitimate interests or for direct marketing; and withdraw consent at any time, without affecting the lawfulness of prior processing.</p>
      <p style={{marginTop:6}}>To exercise any right, email <strong>join@nurirecipes.com</strong>. We will respond within one month, extendable by two months for complex requests. You may also lodge a complaint with the ICO (UK) or your national Data Protection Authority — we'd appreciate the chance to address your concerns first.</p>
      <h3 style={{fontFamily:'var(--font-serif)',fontStyle:'italic',fontSize:15,margin:'16px 0 8px',color:'var(--text)'}}>9. Security</h3>
      <p>We use technical and organizational measures appropriate to the sensitivity of the data, including encryption in transit (TLS) and at rest, role-based access controls, periodic security reviews, and vendor due diligence. No system is 100% secure; if we suffer a breach affecting your data, we will notify you and the relevant authority where required by law.</p>
      <h3 style={{fontFamily:'var(--font-serif)',fontStyle:'italic',fontSize:15,margin:'16px 0 8px',color:'var(--text)'}}>10. Children</h3>
      <p>The Platform is not intended for individuals under 18. We do not knowingly collect data from minors. If you believe a minor has provided us with personal data, contact join@nurirecipes.com and we will delete it.</p>
      <h3 style={{fontFamily:'var(--font-serif)',fontStyle:'italic',fontSize:15,margin:'16px 0 8px',color:'var(--text)'}}>11. Cookies</h3>
      <p>We use strictly necessary cookies to operate the Platform. With your consent (via our cookie banner), we also use analytics and marketing cookies. You can manage your preferences at any time by adjusting your cookie settings in-app or in your browser.</p>
      <h3 style={{fontFamily:'var(--font-serif)',fontStyle:'italic',fontSize:15,margin:'16px 0 8px',color:'var(--text)'}}>12. Region-Specific Notices</h3>
      <p><strong>California (CCPA/CPRA):</strong> you have the right to know what personal information we collect, to delete it, to correct it, to limit use of sensitive personal information, and to opt out of any "sale" or "sharing" for cross-context advertising. We do not sell personal information. To exercise these rights, email <strong>join@nurirecipes.com</strong>.</p>
      <p style={{marginTop:6}}><strong>Brazil (LGPD):</strong> you have rights of confirmation, access, correction, anonymization, portability, deletion, information about sharing, and revocation of consent. Contact us at <strong>join@nurirecipes.com</strong>.</p>
      <p style={{marginTop:6}}><strong>Canada (PIPEDA / Quebec Law 25):</strong> you may access and correct your personal information and file a complaint with the Office of the Privacy Commissioner of Canada or the CAI in Quebec.</p>
      <p style={{marginTop:6}}><strong>Other regions:</strong> additional rights may apply under your local law. Contact <strong>join@nurirecipes.com</strong> to learn more.</p>
      <h3 style={{fontFamily:'var(--font-serif)',fontStyle:'italic',fontSize:15,margin:'16px 0 8px',color:'var(--text)'}}>13. Health Data Specific Notice</h3>
      <p>Nuri is not a healthcare provider and is not a HIPAA "covered entity" in the United States. The health-related data you share with us is treated as sensitive personal data under GDPR/UK GDPR and equivalent regimes. We never use it to decide insurance eligibility, employment, or credit. We will not share it with third parties for marketing purposes.</p>
      <h3 style={{fontFamily:'var(--font-serif)',fontStyle:'italic',fontSize:15,margin:'16px 0 8px',color:'var(--text)'}}>14. Changes to This Policy</h3>
      <p>We may update this Privacy Policy. If changes are material, we will notify you by email or in-app at least 14 days before they take effect. The "Last updated" date at the top reflects the most recent revision.</p>
      <h3 style={{fontFamily:'var(--font-serif)',fontStyle:'italic',fontSize:15,margin:'16px 0 8px',color:'var(--text)'}}>15. Contact Us</h3>
      <p>Questions, requests, or complaints? Email <strong>join@nurirecipes.com</strong> or write to <strong>167-169 Great Portland Street, London, England, W1W 5PF</strong>, attention: Privacy. This address is our registered office for statutory purposes only — for all correspondence, please use email.</p>
      <p style={{marginTop:8,fontSize:11,color:'var(--text-light)'}}>&copy; 2026 Nuri App Ltd. All rights reserved.</p>
    </div>
  );
}

function TermsOfServiceContent() {
  return (
    <div>
      <p style={{fontSize:11,color:'var(--text-light)',marginBottom:16}}>Last updated: July 2026</p>
      <p>These Terms of Service (the "Terms") form a legally binding agreement between you and Nuri App Ltd, a company registered in England and Wales under company number 17351532, governing your access to and use of the Nuri platform at nurirecipes.com.</p>
      <p style={{marginTop:6}}>By creating an account or using the Platform, you confirm that you have read, understood, and agreed to be bound by these Terms and our Privacy Policy. If you do not agree, you must not use the Platform.</p>
      <p style={{marginTop:8,background:'var(--warm-beige)',padding:'10px 14px',borderRadius:8,fontSize:12}}><strong>Important — Not medical advice.</strong> Recipes, articles, and other materials on Nuri are provided for general informational purposes only and are not a substitute for professional medical, nutritional, or healthcare advice, diagnosis, or treatment. Always seek the advice of your physician or qualified healthcare provider before starting any new diet or making changes to an existing one.</p>
      <h3 style={{fontFamily:'var(--font-serif)',fontStyle:'italic',fontSize:15,margin:'16px 0 8px',color:'var(--text)'}}>1. Who Can Use Nuri</h3>
      <p>You must be at least 18 years old (or the age of majority in your jurisdiction, whichever is greater) to create an account. By using the Platform, you represent that you have the legal capacity to enter into a binding contract. The Platform is designed primarily for women managing or interested in nutrition for various health conditions. If you have a serious, complex, or acute medical condition (including active eating disorders, severe allergies, organ failure, cancer treatment, pregnancy complications, or any condition requiring close medical supervision), please consult a qualified healthcare professional in person before relying on any content from the Platform.</p>
      <h3 style={{fontFamily:'var(--font-serif)',fontStyle:'italic',fontSize:15,margin:'16px 0 8px',color:'var(--text)'}}>2. Your Account</h3>
      <p>You agree to provide accurate, current, and complete information and to keep it updated. You are responsible for safeguarding your account credentials and for all activity that occurs under your account. Notify us immediately at join@nurirecipes.com if you suspect unauthorised access. We may suspend or terminate your account if we reasonably believe you have violated these Terms or that your use poses a risk to Nuri, our contributors, or other users.</p>
      <h3 style={{fontFamily:'var(--font-serif)',fontStyle:'italic',fontSize:15,margin:'16px 0 8px',color:'var(--text)'}}>3. Description of the Service</h3>
      <p>Nuri provides curated recipes, meal ideas, and educational content created by Registered Dietitians ("RDs") and other qualified professionals ("Contributors"). Nuri is a platform — we are not a healthcare provider, dietetic clinic, or medical practice. No doctor-patient or dietitian-client relationship is formed by your use of the Platform. Content is general in nature and may not be appropriate for your specific health profile; you are solely responsible for evaluating whether any recipe or recommendation is suitable for you and for confirming that ingredients are safe given your allergies, medications, and conditions.</p>
      <h3 style={{fontFamily:'var(--font-serif)',fontStyle:'italic',fontSize:15,margin:'16px 0 8px',color:'var(--text)'}}>4. Subscriptions, Fees, and Payments</h3>
      <p>Some Platform features require payment of a subscription fee or one-time fee, as displayed at the point of purchase. All fees are stated in US Dollars (USD) unless otherwise indicated and may be subject to applicable taxes. Subscriptions automatically renew at the end of each billing period at the then-current rate, unless cancelled before renewal. You may cancel at any time through your account settings; cancellation takes effect at the end of the current billing period. Except where required by applicable consumer protection law (including the EU/UK 14-day right of withdrawal for digital services not yet performed), fees are non-refundable, including for partial or unused subscription periods. We use the third-party payment processor Stripe; your use of payment services is subject to Stripe's terms and privacy policy.</p>
      <h3 style={{fontFamily:'var(--font-serif)',fontStyle:'italic',fontSize:15,margin:'16px 0 8px',color:'var(--text)'}}>5. Acceptable Use</h3>
      <p>You agree not to: use the Platform for any unlawful, harmful, or fraudulent purpose; provide false information about yourself or your health status; copy, scrape, redistribute, or commercially exploit any recipe, image, or other content without our express written permission; reverse-engineer, decompile, or attempt to extract the source code of the Platform; upload viruses, malware, or any code intended to interfere with the Platform; harass, abuse, or impersonate any user, RD, or Nuri staff member; use the Platform to provide medical or nutritional advice to others; or circumvent any access controls, rate limits, or security features.</p>
      <h3 style={{fontFamily:'var(--font-serif)',fontStyle:'italic',fontSize:15,margin:'16px 0 8px',color:'var(--text)'}}>6. User Content</h3>
      <p>You may have the opportunity to post reviews, comments, ratings, photos, or other content ("User Content"). You retain ownership of your User Content. By submitting User Content, you grant Nuri a worldwide, non-exclusive, royalty-free, sublicensable, and transferable licence to host, store, reproduce, modify, display, and distribute that content for the purpose of operating, promoting, and improving the Platform. You represent that your User Content is accurate, does not infringe any third-party rights, and does not contain any defamatory, harassing, sexually explicit, or unlawful material. We reserve the right (but have no obligation) to review, moderate, or remove any User Content at our sole discretion.</p>
      <h3 style={{fontFamily:'var(--font-serif)',fontStyle:'italic',fontSize:15,margin:'16px 0 8px',color:'var(--text)'}}>7. Intellectual Property</h3>
      <p>The Platform, including all recipes, articles, designs, logos, software, and other materials (excluding User Content), is owned by or licensed to Nuri and is protected by copyright, trademark, and other intellectual property laws. We grant you a limited, personal, non-transferable, non-exclusive, revocable licence to access and use the Platform for your own personal, non-commercial use. You may save, print, or share individual recipes for your personal household use. Any other use — including republication, public posting, training of AI/ML systems, or commercial distribution — is prohibited without our prior written consent.</p>
      <h3 style={{fontFamily:'var(--font-serif)',fontStyle:'italic',fontSize:15,margin:'16px 0 8px',color:'var(--text)'}}>8. Health Disclaimer and Allergy Warning</h3>
      <p>Recipes and content are provided "as is." Ingredient lists, nutritional information, and dietary tags (e.g., "gluten-free," "low-FODMAP") are estimates and may contain errors. You must independently verify all ingredients against product labels and your personal medical needs. Cross-contamination, manufacturer reformulations, regional ingredient variations, and individual sensitivities are outside our control. Nuri is not liable for any allergic reaction or adverse health event resulting from your use of any recipe.</p>
      <p style={{marginTop:6}}>If you have, or are at risk of developing, an eating disorder, please be aware that some Platform content discusses food, calories, or body composition. Please use the Platform in consultation with a qualified clinician, and contact a local crisis support service if needed.</p>
      <h3 style={{fontFamily:'var(--font-serif)',fontStyle:'italic',fontSize:15,margin:'16px 0 8px',color:'var(--text)'}}>9. Disclaimer of Warranties</h3>
      <p>To the maximum extent permitted by applicable law, the Platform is provided on an "as is" and "as available" basis without warranties of any kind, whether express, implied, statutory, or otherwise. We do not warrant that the Platform will be error-free, secure, or available at any particular time, or that any content will be accurate, complete, or current. Nothing in these Terms excludes or limits any warranty, right, or remedy that cannot lawfully be excluded or limited under the law of your country of residence.</p>
      <h3 style={{fontFamily:'var(--font-serif)',fontStyle:'italic',fontSize:15,margin:'16px 0 8px',color:'var(--text)'}}>10. Limitation of Liability</h3>
      <p>To the maximum extent permitted by applicable law, in no event shall Nuri, its directors, officers, employees, Contributors, or affiliates be liable for any indirect, incidental, special, consequential, exemplary, or punitive damages, including loss of profits, data, goodwill, or any other intangible loss, arising out of or relating to your use of (or inability to use) the Platform. Our aggregate liability for all claims shall not exceed the greater of (a) the total amount you paid to Nuri in the twelve (12) months preceding the event giving rise to the claim, or (b) USD 100. Nothing in these Terms excludes liability for death or personal injury caused by our negligence, fraud, or any other liability that cannot lawfully be excluded.</p>
      <h3 style={{fontFamily:'var(--font-serif)',fontStyle:'italic',fontSize:15,margin:'16px 0 8px',color:'var(--text)'}}>11. Indemnification</h3>
      <p>You agree to defend, indemnify, and hold harmless Nuri, its affiliates, and its and their respective officers, directors, employees, and Contributors from and against any claims, damages, losses, liabilities, and expenses (including reasonable legal fees) arising out of or related to: (a) your use of the Platform; (b) your User Content; (c) your violation of these Terms; or (d) your violation of any law or third-party right.</p>
      <h3 style={{fontFamily:'var(--font-serif)',fontStyle:'italic',fontSize:15,margin:'16px 0 8px',color:'var(--text)'}}>12. Third-Party Links and Services</h3>
      <p>The Platform may contain links to third-party websites, products, or services (e.g., grocery delivery, supplement vendors). We do not control and are not responsible for those third parties. Your use of any third-party service is at your own risk and subject to that third party's terms.</p>
      <h3 style={{fontFamily:'var(--font-serif)',fontStyle:'italic',fontSize:15,margin:'16px 0 8px',color:'var(--text)'}}>13. Termination</h3>
      <p>You may stop using the Platform and delete your account at any time. We may suspend or terminate your access at any time, with or without cause or notice, including for breach of these Terms. Sections that by their nature should survive termination (including IP, disclaimers, limitation of liability, indemnification, and dispute resolution) will survive.</p>
      <h3 style={{fontFamily:'var(--font-serif)',fontStyle:'italic',fontSize:15,margin:'16px 0 8px',color:'var(--text)'}}>14. Changes to These Terms</h3>
      <p>We may update these Terms from time to time. If we make material changes, we will notify you by email or through the Platform at least 14 days before the changes take effect. Your continued use of the Platform after the effective date constitutes acceptance of the updated Terms.</p>
      <h3 style={{fontFamily:'var(--font-serif)',fontStyle:'italic',fontSize:15,margin:'16px 0 8px',color:'var(--text)'}}>15. Governing Law and Disputes</h3>
      <p>These Terms are governed by the laws of England and Wales, without regard to conflict-of-laws principles. Any dispute arising out of or relating to these Terms or the Platform shall be resolved exclusively in the courts of England and Wales, except that you may bring claims in your country of residence where required by mandatory local consumer protection law.</p>
      <h3 style={{fontFamily:'var(--font-serif)',fontStyle:'italic',fontSize:15,margin:'16px 0 8px',color:'var(--text)'}}>16. EU / UK Consumer Rights</h3>
      <p>If you are a consumer resident in the European Economic Area or the United Kingdom, nothing in these Terms affects your statutory rights, including your right of withdrawal for digital content under the Consumer Rights Directive / UK Consumer Rights Act, where applicable. You may also access the European Commission's Online Dispute Resolution platform at https://ec.europa.eu/consumers/odr.</p>
      <h3 style={{fontFamily:'var(--font-serif)',fontStyle:'italic',fontSize:15,margin:'16px 0 8px',color:'var(--text)'}}>17. Contact</h3>
      <p>Questions about these Terms? Email <strong>join@nurirecipes.com</strong></p>
      <p style={{marginTop:8,fontSize:11,color:'var(--text-light)'}}>&copy; 2026 Nuri App Ltd. All rights reserved.</p>
    </div>
  );
}

function AuthModal({ onClose, onAuth, defaultMode = 'signin' }) {
  const [mode, setMode] = useState(defaultMode === 'signup' ? 'signup' : 'signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const db = window._supa;

  const handleSubmit = async () => {
    setError('');
    if (mode === 'forgot') {
      if (!email.trim()) { setError('Please enter your email.'); return; }
      setLoading(true);
      const { error: e } = await db.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: window.location.origin + '?reset=true',
      });
      setLoading(false);
      if (e) { setError(e.message); return; }
      setResetSent(true);
      return;
    }
    if (!email.trim() || !password.trim()) { setError('Please fill in all fields.'); return; }
    if (mode === 'signup' && !name.trim()) { setError('Please enter your name.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      if (mode === 'signup') {
        const { data, error: e } = await db.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: { data: { name: name.trim() } }
        });
        if (e) { setError(e.message); return; }
        const user = data.user;
        onAuth({ id: user.id, email: user.email, name: name.trim() });
      } else {
        const { data, error: e } = await db.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password
        });
        if (e) { setError('Incorrect email or password.'); return; }
        const user = data.user;
        const { data: profile } = await db.from('profiles').select('name').eq('id', user.id).single();
        onAuth({ id: user.id, email: user.email, name: profile?.name || email.split('@')[0] });
      }
    } catch(err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = e => { if (e.key === 'Enter') handleSubmit(); };

  return (
    <div className="auth-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="auth-modal">
        <div className="auth-gingham" />
        <div className="auth-modal-inner">
          <div className="auth-logo">nuri<span className="auth-logo-dot" /></div>
          <div className="auth-tagline">food that works for your body</div>
          <div className="auth-title">
            {mode === 'signup' ? 'Create your account' : mode === 'forgot' ? 'Reset your password' : 'Sign in'}
          </div>
          {error && <div className="auth-error">{error}</div>}
          {mode === 'forgot' ? (
            resetSent ? (
              <div style={{textAlign:'center',padding:'16px 0'}}>
                <div style={{fontSize:32,marginBottom:12}}>📬</div>
                <p style={{fontSize:14,color:'var(--text-mid)',lineHeight:1.6}}>Check your inbox — we've sent a password reset link to <strong>{email}</strong>.</p>
                <button className="auth-switch-btn" style={{marginTop:16}} onClick={() => { setMode('signin'); setResetSent(false); }}>Back to sign in</button>
              </div>
            ) : (
              <>
                <div className="auth-field">
                  <label className="auth-label">Email</label>
                  <input className="auth-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={handleKey} autoFocus />
                </div>
                <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Sending…' : 'Send reset link'}
                </button>
                <div className="auth-switch">
                  <button className="auth-switch-btn" onClick={() => { setMode('signin'); setError(''); }}>← Back to sign in</button>
                </div>
              </>
            )
          ) : (
            <>
              {mode === 'signup' && (
                <div className="auth-field">
                  <label className="auth-label">Name</label>
                  <input className="auth-input" type="text" placeholder="Your first name" value={name} onChange={e => setName(e.target.value)} onKeyDown={handleKey} autoFocus />
                </div>
              )}
              <div className="auth-field">
                <label className="auth-label">Email</label>
                <input className="auth-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={handleKey} autoFocus={mode === 'signin'} />
              </div>
              <div className="auth-field">
                <label className="auth-label" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  Password
                  {mode === 'signin' && <button className="auth-switch-btn" style={{fontSize:11}} onClick={() => { setMode('forgot'); setError(''); }}>Forgot password?</button>}
                </label>
                <input className="auth-input" type="password" placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'} value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKey} />
              </div>
              <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}
              </button>
              <div className="auth-divider"><div className="auth-divider-line"/><span className="auth-divider-text">or</span><div className="auth-divider-line"/></div>
              <button className="auth-google-btn" onClick={async () => {
                setLoading(true);
                const { error } = await db.auth.signInWithOAuth({
                  provider: 'google',
                  options: { redirectTo: window.location.origin }
                });
                if (error) { setError(error.message); setLoading(false); }
              }} disabled={loading}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{flexShrink:0}}>
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
                  <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.548 0 9s.348 2.825.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
              <div className="auth-switch">
                {mode === 'signin' ? (
                  <>Don't have an account? <button className="auth-switch-btn" onClick={() => { setMode('signup'); setError(''); }}>Sign up</button></>
                ) : (
                  <>Already have an account? <button className="auth-switch-btn" onClick={() => { setMode('signin'); setError(''); }}>Sign in</button></>
                )}
              </div>
              {mode === 'signup' && (
                <p style={{fontSize:12,color:'var(--text-mid)',textAlign:'center',marginTop:8,lineHeight:1.5}}>
                  By creating an account you agree to our{' '}
                  <button onClick={() => window._showLegal('terms')} style={{background:'none',border:'none',color:'var(--brown)',fontSize:12,cursor:'pointer',textDecoration:'underline',padding:0,fontWeight:500}}>Terms of Service</button>
                  {' '}and{' '}
                  <button onClick={() => window._showLegal('privacy')} style={{background:'none',border:'none',color:'var(--brown)',fontSize:12,cursor:'pointer',textDecoration:'underline',padding:0,fontWeight:500}}>Privacy Policy</button>
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── ABOUT TAB ─────────────────────────────────────────────────
function AboutTab({ onApply, supaDietitians }) {
  // Emily = id:1, Malaika = id:2
  const emily = { name:'Emily', role:'Co-founder', initials:'EY', color:'#C4A882', bio:'Passionate about making clinical nutrition accessible to every woman, regardless of budget or background. Building nuri. to close the gap between dietitian expertise and everyday kitchens.' };
  const malaika = { name:'Malaika', role:'Co-founder', initials:'MR', color:'#8FA888', bio:'Believes nutrition is one of the most powerful tools women have — and that it should feel empowering, not restrictive. Focused on community, content and the science of eating well.' };
  const founderData = [
    { ...emily, ...(supaDietitians?.[1] ? { bio: supaDietitians[1].supaBio || emily.bio, photo: supaDietitians[1].supaAvatar } : {}) },
    { ...malaika, ...(supaDietitians?.[2] ? { bio: supaDietitians[2].supaBio || malaika.bio, photo: supaDietitians[2].supaAvatar } : {}) },
  ];
  return (
    <div>
      <div className="about-hero">
        <div className="about-hero-inner">
          <div className="about-hero-logo">nuri<span className="about-hero-dot" /></div>
          <p className="about-hero-sub">Recipes built by registered dietitians — for the conditions that matter most to women.</p>
        </div>
      </div>
      <div className="about-body">
        <div className="about-section">
          <div className="about-section-eyebrow">our mission</div>
          <h2 className="about-section-title">Good food, grounded in real science.</h2>
          <p className="about-section-text">nuri. was born from a simple frustration: the internet is flooded with wellness noise, but genuinely useful, condition-specific nutrition advice is buried behind expensive consultations or buried in jargon.</p>
          <p className="about-section-text">We believe every woman deserves access to recipes that are designed for her body — not just generic "healthy eating" content. Every recipe on nuri. is created and reviewed by a registered dietitian with specialist expertise in women's health.</p>
          <div className="about-pillars">
            {[
              { icon:'🩺', title:'Clinically grounded', text:'Every recipe comes from a verified registered dietitian. No influencers, no wellness gurus — just qualified clinicians.' },
              { icon:'🌸', title:'Condition-specific', text:'From PCOS to endometriosis, insulin resistance to immune health — recipes designed around your actual diagnosis, not a vague wellness goal.' },
              { icon:'🍽', title:'Actually delicious', text:'Therapeutic nutrition doesn\'t mean bland. Our RDs create recipes that are as good to eat as they are good for you.' },
            ].map(p => (
              <div key={p.title} className="about-pillar">
                <div className="about-pillar-icon">{p.icon}</div>
                <div className="about-pillar-title">{p.title}</div>
                <p className="about-pillar-text">{p.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="about-divider" />

        <div className="about-section">
          <div className="about-section-eyebrow">who we are</div>
          <h2 className="about-section-title">Built by women, for women.</h2>
          <p className="about-section-text">nuri. was co-founded by Emily and Malaika — two women who experienced first-hand how hard it is to find reliable, actionable nutrition guidance for chronic conditions.</p>
          <div className="about-team">
            {founderData.map(m => (
              <div key={m.name} className="about-team-card">
                <div className="about-team-banner" style={{ background:`linear-gradient(135deg, ${m.color}88, ${m.color}33)` }}>
                  {m.photo ? (
                    <div className="about-team-avatar" style={{ overflow:'hidden', padding:0 }}>
                      <img src={m.photo} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                    </div>
                  ) : (
                    <div className="about-team-avatar" style={{ background: m.color }}>{m.initials}</div>
                  )}
                </div>
                <div className="about-team-body">
                  <div className="about-team-name">{m.name}</div>
                  <div className="about-team-role">{m.role}</div>
                  <p className="about-team-bio">{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="about-divider" />

        <div className="about-cta">
          <div className="about-cta-title">Are you a registered dietitian?</div>
          <p className="about-cta-text">We're always looking for specialist RDs to join our founding team. Apply to share your recipes with thousands of women managing chronic conditions.</p>
          <button className="welcome-cta" onClick={onApply}>Apply as a founding RD ✨</button>
        </div>
      </div>
    </div>
  );
}

// ── FEEDBACK MODAL ───────────────────────────────────────────
function FeedbackModal({ onClose, user }) {
  const [type, setType] = useState(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setSubmitting(true);
    await window._supa.from('feedback').insert({
      type, message: message.trim(),
      user_id: user?.id || null,
      user_email: user?.email || null,
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="feedback-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="feedback-modal">
        <div className="feedback-header">
          <button className="feedback-close" onClick={onClose}>✕</button>
          <div className="feedback-inner">
            <div style={{ fontFamily:'var(--font-logo)', fontSize:28, fontStyle:'italic', fontWeight:600, color:'white', display:'inline-flex', alignItems:'flex-end', marginBottom:4 }}>
              nuri<span style={{ display:'inline-block', width:7, height:7, borderRadius:'50%', background:'var(--rose)', marginLeft:2, marginBottom:2 }}/>
            </div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.75)' }}>We'd love to hear from you</div>
          </div>
        </div>
        <div className="feedback-body">
          {submitted ? (
            <div style={{ textAlign:'center', padding:'12px 0' }}>
              <div style={{ fontSize:40, marginBottom:12 }}>{type === 'love' ? '💌' : '🙏'}</div>
              <div style={{ fontFamily:'var(--font-serif)', fontSize:22, fontStyle:'italic', color:'var(--text)', marginBottom:8 }}>
                {type === 'love' ? 'Thank you!' : 'We hear you.'}
              </div>
              <p style={{ fontSize:14, color:'var(--text-light)', lineHeight:1.6 }}>
                {type === 'love' ? "Your kind words mean everything to us. We're so glad nuri. is making a difference." : "Thank you for helping us grow. We read every single note and take it seriously."}
              </p>
            </div>
          ) : (
            <>
              <div className="feedback-type-row">
                <div className={`feedback-type-btn ${type==='love'?'active':''}`} onClick={() => setType('love')}>
                  <div style={{ fontSize:24, marginBottom:6 }}>💌</div>
                  <div style={{ fontSize:12, fontWeight:600, color:'var(--text)' }}>Write us a love note</div>
                  <div style={{ fontSize:11, color:'var(--text-light)', marginTop:2 }}>Share what you love</div>
                </div>
                <div className={`feedback-type-btn ${type==='improve'?'active':''}`} onClick={() => setType('improve')}>
                  <div style={{ fontSize:24, marginBottom:6 }}>💡</div>
                  <div style={{ fontSize:12, fontWeight:600, color:'var(--text)' }}>Tell us what to improve</div>
                  <div style={{ fontSize:11, color:'var(--text-light)', marginTop:2 }}>Help us do better</div>
                </div>
              </div>
              {type && (
                <>
                  <textarea className="feedback-textarea" rows={5}
                    placeholder={type==='love' ? "Tell us what you love about nuri. — a recipe that helped, something that made your day..." : "What could we do better? Features you'd love, recipes you wish we had..."}
                    value={message} onChange={e => setMessage(e.target.value)} autoFocus />
                  <button className="feedback-submit" onClick={handleSubmit} disabled={submitting || !message.trim()}>
                    {submitting ? 'Sending…' : 'Send →'}
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────
function App() {
  const db = window._supa;
  const [screen, setScreen] = useState('loading');
  const [tab, setTab] = useState('feed');
  const [healthGoals, setHealthGoals] = useState([]);
  const [followed, setFollowed] = useState(() => new Set());
  const [saved, setSaved] = useState(() => new Set());
  const [view, setView] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showShareBanner, setShowShareBanner] = useState(true);
  const [showLegalModal, setShowLegalModal] = useState(false);
  useEffect(() => { window._showLegal = (type) => setShowLegalModal(type); }, []);


  const [isPremium, setIsPremium] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [user, setUser] = useState(null);
  const [tried, setTried] = useState(() => new Set());
  const [supaRecipes, setSupaRecipes] = useState({});
  const [supaDietitians, setSupaDietitians] = useState({});
  const [supaSaves, setSupaSaves] = useState({});
  const [premiumSettings, setPremiumSettings] = useState({});
  const [newSupaRecipes, setNewSupaRecipes] = useState([]);
  const [supaAllDietitians, setSupaAllDietitians] = useState([]); // all dietitians from Supabase // recipe_id -> save count
  const [triedPhotos, setTriedPhotos] = useState({});
  const [comments, setComments] = useState(() => ls('tee_comments', {}));
  const [isRD, setIsRD] = useState(false);
  const [rdDieticianId, setRdDieticianId] = useState(null);
  const [dietaryPreferences, setDietaryPreferences] = useState([]);

  const loadUserData = async (uid) => {
    const [{ data: profile }, { data: savesData }, { data: followsData }, { data: triedData }, { data: subData }] = await Promise.all([
      db.from('profiles').select('name, health_goals, rd_mode, rd_dietitian_id, dietary_preferences, referral_code').eq('id', uid).single(),
      db.from('saves').select('recipe_id').eq('user_id', uid),
      db.from('follows').select('dietitian_id').eq('user_id', uid),
      db.from('tried').select('recipe_id, photo_url').eq('user_id', uid),
      db.rpc('get_my_subscription').maybeSingle(),
    ]);
    if (subData?.status === 'active') {
      setIsPremium(true);
    } else if (subData?.status === 'pending') {
      // Pending means they started checkout but we haven't confirmed yet.
      // Check if it was updated recently (within last 2 hours) — if so, upgrade to active.
      // This handles the case where Stripe redirected back but ?subscribed=true was lost.
      const updatedAt = subData.updated_at ? new Date(subData.updated_at) : null;
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      if (updatedAt && updatedAt > twoHoursAgo) {
        await db.from('subscriptions').upsert(
          { user_id: uid, stripe_price_id: NURI_PREMIUM_PRICE_ID, status: 'active' },
          { onConflict: 'user_id' }
        );
        setIsPremium(true);
      }
    }
    if (profile?.health_goals?.length) setHealthGoals(profile.health_goals);
    if (profile?.dietary_preferences?.length) setDietaryPreferences(profile.dietary_preferences);

    // Generate referral code if user doesn't have one
    if (profile && !profile.referral_code) {
      const code = uid.split('-')[0].toUpperCase();
      await db.from('profiles').update({ referral_code: code }).eq('id', uid);
    }
    if (profile?.rd_mode != null) setIsRD(profile.rd_mode);
    if (profile?.rd_dietitian_id) setRdDieticianId(profile.rd_dietitian_id);
    if (savesData) setSaved(new Set(savesData.map(r => r.recipe_id)));
    if (followsData) setFollowed(new Set(followsData.map(r => r.dietitian_id)));
    if (triedData) {
      setTried(new Set(triedData.map(r => r.recipe_id)));
      const photos = {};
      triedData.forEach(r => { if (r.photo_url) photos[r.recipe_id] = r.photo_url; });
      setTriedPhotos(photos);
    }
    return profile;
  };

  useEffect(() => {
    const init = async () => {
      // Handle return from Stripe — must complete BEFORE loadUserData so the active status is there
      const params = new URLSearchParams(window.location.search);
      const justSubscribed = params.get('subscribed') === 'true';
      if (justSubscribed) {
        window.history.replaceState({}, '', window.location.pathname);
      }

      // Detect referral code in URL and store it for use on signup
      const refCode = params.get('ref');
      if (refCode) {
        localStorage.setItem('nuri_ref_code', refCode);
        window.history.replaceState({}, '', window.location.pathname);
      }

      // Detect landing source (e.g. a condition SEO page) for attribution, and
      // auto-open the signup modal when a marketing page deep-links with ?signup=1
      const landingSrc = params.get('src');
      if (landingSrc) {
        localStorage.setItem('nuri_landing_source', landingSrc);
      }
      if (params.get('signup') === '1') {
        setShowAuthModal('signup');
        window.history.replaceState({}, '', window.location.pathname);
      }

      // Handle OAuth hash callback (Google auth returns #access_token=...)
      const hash = window.location.hash;
      if (hash && hash.includes('access_token')) {
        try {
          const hashParams = new URLSearchParams(hash.replace(/^#/, ''));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          const type = hashParams.get('type');
          if (accessToken && refreshToken) {
            await db.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
            // If this is a password recovery link, show reset password UI
            if (type === 'recovery') {
              window.history.replaceState({}, '', window.location.pathname);
              setScreen('reset_password');
              return;
            }
          }
        } catch(e) { console.error('Hash parse error:', e); }
        window.history.replaceState({}, '', window.location.pathname);
        await new Promise(r => setTimeout(r, 200));
      }

      const { data: { session } } = await db.auth.getSession();
      if (session?.user) {
        const u = session.user;

        // If returning from Stripe, write active status first, then load
        if (justSubscribed) {
          const periodEnd = new Date();
          periodEnd.setMonth(periodEnd.getMonth() + 1); // default monthly; webhook will correct for annual
          await db.from('subscriptions').upsert(
            { user_id: u.id, stripe_price_id: NURI_PREMIUM_PRICE_ID, status: 'active', updated_at: new Date().toISOString(), current_period_end: periodEnd.toISOString() },
            { onConflict: 'user_id' }
          );
          setIsPremium(true);
          // Redirect back to recipe/tab if user was mid-flow
          try {
            const postPay = sessionStorage.getItem('nuri_post_pay');
            if (postPay) {
              sessionStorage.removeItem('nuri_post_pay');
              const dest = JSON.parse(postPay);
              if (dest.recipe) setTimeout(() => navigate('recipe', dest.recipe), 800);
              else if (dest.tab) setTimeout(() => setTab(dest.tab), 800);
            }
          } catch(e) {}
        }

        const profile = await loadUserData(u.id);
        setUser({ id: u.id, email: u.email, name: profile?.name || u.email.split('@')[0] });
        if (window._ph) window._ph.capture('app_opened', { source: 'session_restore' });
        setScreen(profile?.health_goals?.length ? 'app' : 'onboarding');
      } else {
        setScreen('welcome');
      }
    };
    init();
    // Load recipe photos and dietitian data from Supabase
    const loadSupaData = async () => {
      const hardcodedIds = ALL_RECIPES.map(r => r.id);
      const [{ data: rData }, { data: dData }, { data: followsData }, { data: savesData }, { data: newRData }, { data: allDData }] = await Promise.all([
        db.from('recipes').select('id, photo, health_labels'),
        db.from('dietitians').select('id, photo, bio, is_premium, free_recipe_count'),
        db.from('follows').select('dietitian_id'),
        db.from('saves').select('recipe_id'),
        db.from('recipes').select('*').eq('is_published', true).not('id', 'in', `(${ALL_RECIPES.map(r=>r.id).join(',')})`),
        db.from('dietitians').select('id, name, credentials, specialty, bio, photo, tags, is_premium, free_recipe_count').eq('is_active', true),
      ]);
      if (rData) {
        const rm = {};
        rData.forEach(r => {
          rm[r.id] = {
            ...(r.photo ? { supaPhoto: r.photo, photo: r.photo } : {}),
            ...(r.health_labels?.length ? { healthLabels: r.health_labels } : {}),
          };
        });
        setSupaRecipes(rm);
      }
      if (allDData) {
        const COLORS = ['#C4A882','#8FA888','#7A9E7E','#C47A7A','#A8BBD4','#BBA8CC','#D4B87A','#C8A080'];
        const mapped = allDData.map((d, i) => ({
          id: parseInt(d.id, 10),
          name: d.name || 'Dietitian',
          credentials: d.credentials || 'RD',
          specialty: d.specialty || '',
          bio: d.bio || '',
          photo: d.photo || null,
          initials: (d.name || 'RD').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase(),
          avatarColor: COLORS[i % COLORS.length],
          followers: 0,
          following: 0,
          tags: d.tags || [],
          recipeIds: [],
        }));
        setSupaAllDietitians(mapped);
      }

      if (newRData && newRData.length > 0) {
        const mapped = newRData.map(r => ({
          id: r.id,
          title: r.title || '',
          subtitle: r.subtitle || '',
          dieticianId: parseInt(r.dietitian_id, 10),
          healthLabels: r.health_labels || [],
          prepTime: r.prep_time || '—',
          cookTime: r.cook_time || '—',
          servings: r.servings || 0,
          ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
          instructions: Array.isArray(r.instructions) ? r.instructions : [],
          note: r.note || '',
          emoji: r.emoji || '🍽',
          supaPhoto: r.photo || null,
          photo: r.photo || null,
          ginghamBg: null,
          ginghamS: null,
          illusSvg: null,
          tags: r.health_labels || [],
          isNew: true,
        }));
        setNewSupaRecipes(mapped);
      }

      if (dData) {
        const dm = {};
        // Count followers per dietitian
        const followerCounts = {};
        if (followsData) followsData.forEach(f => { const k = parseInt(f.dietitian_id, 10); followerCounts[k] = (followerCounts[k] || 0) + 1; });
        // Count saves per recipe
        const saveCounts = {};
        if (savesData) savesData.forEach(s => { saveCounts[s.recipe_id] = (saveCounts[s.recipe_id] || 0) + 1; });
        const pm = {};
        dData.forEach(d => {
          const did = parseInt(d.id,10);
          dm[did] = { supaAvatar: d.photo, supaBio: d.bio, supaFollowers: followerCounts[did] || 0 };
          pm[did] = { is_premium: d.is_premium || false, free_recipe_count: d.free_recipe_count ?? FALLBACK_FREE_RECIPE_COUNT };
        });
        setSupaDietitians(dm);
        setPremiumSettings(pm);
        setSupaSaves(saveCounts);
      }
    };
    loadSupaData();
    // Store loadSupaData globally so tabs can refresh
    window._loadSupaData = loadSupaData;

    // Reload photo data whenever user returns to this tab (e.g. after uploading in portal)
    const handleVisibility = () => { if (document.visibilityState === 'visible') loadSupaData(); };
    const handleFocus = () => loadSupaData();
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleFocus);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleFocus);
    };

    const { data: { subscription } } = db.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') { 
        setUser(null); setSaved(new Set()); setFollowed(new Set()); setTried(new Set()); setScreen('welcome'); 
      } else if (event === 'SIGNED_IN' && session?.user) {
        const u = session.user;
        const profile = await loadUserData(u.id);
        setUser({ id: u.id, email: u.email, name: profile?.name || u.email.split('@')[0] });
        if (window._ph) window._ph.capture('app_opened', { source: 'sign_in' });
        setScreen(profile?.health_goals?.length ? 'app' : 'onboarding');
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => { if (user) db.from('profiles').update({ rd_mode: isRD }).eq('id', user.id); }, [isRD]);
  useEffect(() => { if (user) db.from('profiles').update({ dietary_preferences: dietaryPreferences }).eq('id', user.id); }, [dietaryPreferences]);
  useEffect(() => { if (user) db.from('profiles').update({ rd_dietitian_id: rdDieticianId }).eq('id', user.id); }, [rdDieticianId]);
  useEffect(() => { lsSave('tee_comments', comments); }, [comments]);

  const handleAuth = async (u) => {
    setUser(u);
    setShowAuthModal(false);
    if (window._ph) {
      window._ph.identify(u.id, { email: u.email, name: u.name });
      window._ph.capture('signed_in');
    }

    // Process referral if this is a new signup
    const refCode = localStorage.getItem('nuri_ref_code');
    if (refCode) {
      localStorage.removeItem('nuri_ref_code');
      try {
        await fetch('https://zgjtibyhuhpibrxcormd.supabase.co/functions/v1/process-referral', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refCode, userId: u.id, userEmail: u.email }),
        });
      } catch(e) { console.error('Referral error:', e); }
    }

    const profile = await loadUserData(u.id);
    // If user already went through onboarding before signing up, persist those goals
    if (window._pendingGoals?.length) {
      const goals = window._pendingGoals;
      const cookingPrefs = window._pendingCookingPrefs || [];
      window._pendingGoals = null;
      window._pendingCookingPrefs = null;
      setHealthGoals(goals);
      setDietaryPreferences(cookingPrefs);
      await db.from('profiles').update({ health_goals: goals, dietary_preferences: cookingPrefs }).eq('id', u.id);
      setScreen('welcome_new');
    } else if (!profile?.health_goals?.length) {
      // Brand new user who skipped pre-auth onboarding — show condition picker then welcome
      setScreen('onboarding');
    } else {
      setScreen('app');
    }
  };

  const handleSignOut = async () => { await db.auth.signOut(); setUser(null); setSaved(new Set()); setFollowed(new Set()); setTried(new Set()); setScreen('welcome'); };

  // Refresh Supabase photo data whenever user navigates back to feed
  useEffect(() => {
    if (tab === 'feed' && window._loadSupaData) window._loadSupaData();
  }, [tab]);

  const navigate = (type, data) => {
    if (type === 'recipe' && !user) { setShowAuthModal('signup'); return; }
    if (type === 'recipe' && window._ph) window._ph.capture('recipe_viewed', {
      recipe_id: data.id, recipe_title: data.title,
      dietitian: ALL_DIETICIANS.find(d => d.id === data.dieticianId)?.name,
      conditions: data.healthLabels,
    });
    if (type === 'profile' && window._ph) window._ph.capture('dietitian_profile_viewed', {
      dietitian_id: data.id, dietitian_name: data.name,
    });
    // Log view to Supabase
    if (type === 'recipe') {
      window._supa.from('views').insert({ entity_type: 'recipe', entity_id: parseInt(data.id, 10), user_id: user?.id || null })
        .then(({ error }) => { if (error) console.error('View log error:', error); else console.log('View logged for recipe', data.id); });
    }
    if (type === 'profile') {
      window._supa.from('views').insert({ entity_type: 'dietitian', entity_id: parseInt(data.id, 10), user_id: user?.id || null })
        .then(({ error }) => { if (error) console.error('Profile view log error:', error); });
    }
    setView({ type, data }); window.scrollTo(0, 0);
  };
  const goBack = () => { setView(null); window.scrollTo(0, 0); };

  const toggleFollow = async (id) => {
    const has = followed.has(id);
    setFollowed(p => { const n = new Set(p); has ? n.delete(id) : n.add(id); return n; });
    if (user) {
      if (has) await db.from('follows').delete().eq('user_id', user.id).eq('dietitian_id', id);
      else await db.from('follows').upsert({ user_id: user.id, dietitian_id: id }, { onConflict: 'user_id,dietitian_id' });
    }
  };

  const toggleSave = async (id) => {
    if (!user) { setShowAuthModal('signup'); return; }
    const has = saved.has(id);
    setSaved(p => { const n = new Set(p); has ? n.delete(id) : n.add(id); return n; });
    const recipe = ALL_RECIPES.find(r => r.id === id);
    if (!has && window._ph) window._ph.capture('recipe_saved', {
      recipe_id: id, recipe_title: recipe?.title,
      dietitian: ALL_DIETICIANS.find(d => d.id === recipe?.dieticianId)?.name,
      conditions: recipe?.healthLabels,
    });
    if (user) {
      if (has) await db.from('saves').delete().eq('user_id', user.id).eq('recipe_id', id);
      else await db.from('saves').upsert({ user_id: user.id, recipe_id: id }, { onConflict: 'user_id,recipe_id' });
    }
  };

  const toggleTried = async (id, photo) => {
    const has = tried.has(id);
    setTried(p => { const n = new Set(p); has ? n.delete(id) : n.add(id); return n; });
    if (photo) setTriedPhotos(p => ({ ...p, [id]: photo }));
    if (!has && window._ph) window._ph.capture('recipe_tried', { recipe_id: id });
    if (user) {
      if (has) await db.from('tried').delete().eq('user_id', user.id).eq('recipe_id', id);
      else await db.from('tried').upsert({ user_id: user.id, recipe_id: id, photo_url: photo || null }, { onConflict: 'user_id,recipe_id' });
    }
  };

  const addComment = async (recipeId, comment) => {
    setComments(p => ({ ...p, [recipeId]: [...(p[recipeId] || []), comment] }));
    if (user) await db.from('comments').insert({ recipe_id: recipeId, user_id: user.id, name: comment.name, text: comment.text });
  };

  const completeOnboarding = async (goals, cookingPrefs = []) => {
    setHealthGoals(goals);
    setDietaryPreferences(cookingPrefs);
    if (window._ph) window._ph.capture('onboarding_completed', { conditions: goals, cooking_prefs: cookingPrefs });
    if (user) {
      await db.from('profiles').update({ health_goals: goals, dietary_preferences: cookingPrefs }).eq('id', user.id);
      setScreen('welcome_new');
    } else {
      // Store goals + cooking prefs temporarily so handleAuth can persist them after signup
      window._pendingGoals = goals;
      window._pendingCookingPrefs = cookingPrefs;
      setScreen('app');
    }
  };

  if (screen === 'loading') return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', flexDirection:'column', gap:16 }}>
      <div style={{ fontFamily:'var(--font-logo)', fontSize:56, fontStyle:'italic', fontWeight:600, color:'var(--green-dark)', display:'inline-flex', alignItems:'flex-end' }}>
        nuri<span style={{ display:'inline-block', width:13, height:13, borderRadius:'50%', background:'var(--rose)', marginLeft:3, marginBottom:4 }} />
      </div>
      <div style={{ fontSize:13, color:'var(--text-light)', letterSpacing:'0.05em' }}>Loading…</div>
    </div>
  );

  if (screen === 'reset_password') return <ResetPasswordScreen onDone={() => setScreen('app')} />;
  if (screen === 'welcome') return (
    <>
      <Welcome onSignUp={() => setShowAuthModal('signup')} onSignIn={() => setShowAuthModal('signin')} />
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onAuth={handleAuth} defaultMode={showAuthModal} />}
      {showLegalModal && <LegalModal type={showLegalModal} onClose={() => setShowLegalModal(false)} />}
    </>
  );
  if (screen === 'onboarding') return <Onboarding onComplete={completeOnboarding} userName={user?.name || user?.email} />;
  if (screen === 'welcome_new') return <ShareNuriScreen userName={user?.name || user?.email} onContinue={() => setScreen('app')} />;


  const navProps = { user, onSignIn: () => setShowAuthModal('signin'), onSignOut: handleSignOut };
  const sharedProps = {
    onRecipeClick: r => navigate('recipe', r),
    onDieticianClick: d => navigate('profile', d),
    saved, onToggleSave: toggleSave,
    user, onSignIn: (mode = 'signup') => setShowAuthModal(mode),
    isPremium, onSubscribe: () => { if (!user) { setShowAuthModal('signup'); } else { setShowSubModal(true); } },
    supaRecipes, supaDietitians, supaSaves, premiumSettings, newSupaRecipes, supaAllDietitians,
  };

  if (view?.type === 'recipe') return (
    <>
      <TopNav current={tab} onChange={t => { setView(null); setTab(t); }} {...navProps} />
      <RecipeDetail recipe={view.data} onBack={goBack} onDieticianClick={d => navigate('profile', d)} followed={followed.has(view.data.dieticianId)} onToggleFollow={toggleFollow} isSaved={saved.has(view.data.id)} onToggleSave={toggleSave} tried={tried} onToggleTried={toggleTried} triedPhotos={triedPhotos} comments={comments} onAddComment={addComment} user={user} supaAllDietitians={supaAllDietitians} />
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onAuth={handleAuth} defaultMode={showAuthModal} />}
      {showSubModal && <SubscriptionModal onClose={() => setShowSubModal(false)} user={user} onSignIn={m => { setShowSubModal(false); setShowAuthModal(m); }} onSuccess={() => { setIsPremium(true); if (window._ph) window._ph.capture('subscription_completed'); }} />}
    </>
  );

  if (view?.type === 'profile') return (
    <>
      <TopNav current={tab} onChange={t => { setView(null); setTab(t); }} {...navProps} />
      <ProfilePage dietician={view.data} onBack={goBack} onRecipeClick={r => navigate('recipe', r)} followed={followed.has(view.data.id)} onToggleFollow={toggleFollow} saved={saved} onToggleSave={toggleSave} user={user} onSignIn={(mode='signup') => setShowAuthModal(mode)} isPremium={isPremium} onSubscribe={() => setShowSubModal(true)} supaRecipes={supaRecipes} supaDietitians={supaDietitians} premiumSettings={premiumSettings} supaAllDietitians={supaAllDietitians} newSupaRecipes={newSupaRecipes} />
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onAuth={handleAuth} defaultMode={showAuthModal} />}
      {showSubModal && <SubscriptionModal onClose={() => setShowSubModal(false)} user={user} onSignIn={m => { setShowSubModal(false); setShowAuthModal(m); }} onSuccess={() => { setIsPremium(true); if (window._ph) window._ph.capture('subscription_completed'); }} />}
    </>
  );

  if (view?.type === 'change_password') return (
    <>
      <TopNav current={tab} onChange={t => { setView(null); setTab(t); }} {...navProps} />
      <ChangePasswordPage user={user} onBack={goBack} />
    </>
  );

  return (
    <>
      <TopNav current={tab} onChange={setTab} {...navProps} />
      {tab === 'feed'    && <FeedTab healthGoals={healthGoals} {...sharedProps} dietaryPreferences={dietaryPreferences} onDietaryChange={setDietaryPreferences} showShareBanner={showShareBanner} setShowShareBanner={setShowShareBanner} />}
      {tab === 'explore' && <ExploreTab followed={followed} onToggleFollow={toggleFollow} onDieticianClick={d => navigate('profile', d)} supaDietitians={supaDietitians} />}
      {tab === 'plan'    && <MealPlanTab user={user} onSignIn={() => setShowAuthModal('signup')} isPremium={isPremium} onSubscribe={() => { window._postPayRedirect = { tab: 'plan' }; setShowSubModal(true); }} healthGoals={healthGoals} onRecipeClick={r => navigate('recipe', r)} />}
      {tab === 'saved'   && <SavedTab {...sharedProps} isPremium={isPremium} onSubscribe={() => { if (!user) { setShowAuthModal('signup'); } else { setShowSubModal(true); } }} user={user} />}
      {tab === 'about'   && <AboutTab onApply={() => setShowApplyModal(true)} supaDietitians={supaDietitians} />}
      {tab === 'you'     && <YouTab healthGoals={healthGoals} followed={followed} saved={saved} tried={tried} triedPhotos={triedPhotos} onEditGoals={() => setScreen('onboarding')} onDieticianClick={d => navigate('profile', d)} onApply={() => setShowApplyModal(true)} onRecipeClick={r => navigate('recipe', r)} isRD={isRD} onToggleRD={() => setIsRD(p => !p)} rdDieticianId={rdDieticianId} onSetRDDietician={setRdDieticianId} supaDietitians={supaDietitians} user={user} isPremium={isPremium} onSubscribe={() => setShowSubModal(true)} supaAllDietitians={supaAllDietitians} onChangePassword={() => navigate('change_password')} dietaryPreferences={dietaryPreferences} onDietaryChange={setDietaryPreferences} />}
      {showApplyModal && <RDApplicationModal onClose={() => setShowApplyModal(false)} />}
      <button className="feedback-btn" onClick={() => setShowFeedback(true)}>✉️ Feedback</button>
      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} user={user} />}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onAuth={handleAuth} defaultMode={showAuthModal} />}
      {showSubModal && <SubscriptionModal onClose={() => setShowSubModal(false)} user={user} onSignIn={m => { setShowSubModal(false); setShowAuthModal(m); }} onSuccess={() => { setIsPremium(true); if (window._ph) window._ph.capture('subscription_completed'); }} />}
      {showLegalModal && <LegalModal type={showLegalModal} onClose={() => setShowLegalModal(false)} />}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
