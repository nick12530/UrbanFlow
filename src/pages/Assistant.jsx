import { useState, useRef, useEffect } from 'react';
import { FiSend, FiMessageCircle, FiUser, FiMessageSquare } from 'react-icons/fi';

// Mockup responses for transport queries when API fails
const transportMockupResponses = {
  // Matatu routes and information
  'matatu': [
    "🚌 **Matatu Routes in Nairobi:**\n\n**CBD to Westlands:** Route 111, 112, 113 (Ksh 50-80)\n**CBD to Karen:** Route 24, 25 (Ksh 80-120)\n**CBD to Eastlands:** Route 32, 33, 34 (Ksh 30-50)\n**CBD to South B/C:** Route 15, 16 (Ksh 40-60)\n\n**Operating Hours:** 5:00 AM - 11:00 PM\n**Peak Hours:** 7:00-9:00 AM, 5:00-7:00 PM\n\n💡 **Tips:** Always confirm the fare before boarding and have exact change ready.",
    "🚐 **Popular Matatu Routes:**\n\n**Westlands Route:**\n- 111: CBD → Westlands (via Waiyaki Way)\n- 112: CBD → Westlands (via Muthaiga)\n- 113: CBD → Westlands (via Parklands)\n\n**Eastlands Route:**\n- 32: CBD → Buru Buru\n- 33: CBD → Donholm\n- 34: CBD → Embakasi\n\n**Fares:** Ksh 30-120 depending on distance\n**Frequency:** Every 2-5 minutes during peak hours"
  ],
  
  // Bus information
  'bus': [
    "🚌 **Nairobi Bus Services:**\n\n**KBS (Kenya Bus Service):**\n- Route 1: CBD → Westlands\n- Route 2: CBD → Eastlands\n- Route 3: CBD → South B\n- Route 4: CBD → Karen\n\n**Fares:** Ksh 40-100\n**Operating Hours:** 6:00 AM - 10:00 PM\n**Payment:** Cash or M-Pesa\n\n**Modern Buses:**\n- Double-decker buses on major routes\n- Air-conditioned coaches available\n- Real-time tracking on some routes",
    "🚌 **City Bus Routes:**\n\n**Major Routes:**\n- CBD ↔ Westlands (Ksh 50-80)\n- CBD ↔ Eastlands (Ksh 30-50)\n- CBD ↔ South B/C (Ksh 40-60)\n- CBD ↔ Karen (Ksh 80-120)\n\n**Bus Companies:**\n- KBS (Kenya Bus Service)\n- Double M\n- City Hoppa\n- Metro Trans\n\n**Advantages:**\n- More comfortable than matatus\n- Fixed schedules\n- Better safety record"
  ],
  
  // Taxi services
  'taxi': [
    "🚕 **Nairobi Taxi Services:**\n\n**Uber:**\n- Base fare: Ksh 100\n- Per km: Ksh 25-35\n- Available 24/7\n- App-based booking\n\n**Bolt:**\n- Base fare: Ksh 80\n- Per km: Ksh 20-30\n- Often cheaper than Uber\n- Multiple vehicle options\n\n**Little Cab:**\n- Local taxi service\n- Competitive pricing\n- Cash and card payments\n\n**Traditional Taxis:**\n- Found at taxi stands\n- Negotiate fare before trip\n- Average: Ksh 500-1500 for city trips",
    "🚗 **Taxi Options in Nairobi:**\n\n**Ride-Hailing Apps:**\n- Uber (most popular)\n- Bolt (often cheaper)\n- Little Cab (local)\n- Yego (Rwanda-based)\n\n**Traditional Taxis:**\n- Yellow taxis at stands\n- Hotel taxis (more expensive)\n- Airport taxis\n\n**Fare Estimates:**\n- CBD to Westlands: Ksh 400-800\n- CBD to Karen: Ksh 600-1200\n- CBD to Airport: Ksh 1500-2500\n\n**Safety Tips:**\n- Use official apps when possible\n- Share trip details with friends\n- Avoid unmarked vehicles"
  ],
  
  // Train services
  'train': [
    "🚆 **Nairobi Commuter Rail:**\n\n**Routes:**\n- CBD ↔ Embakasi Village\n- CBD ↔ Syokimau\n- CBD ↔ Ruiru\n- CBD ↔ Limuru\n\n**Fares:** Ksh 50-200\n**Frequency:** Every 30-60 minutes\n**Operating Hours:** 6:00 AM - 8:00 PM\n\n**Advantages:**\n- Avoids traffic congestion\n- Affordable\n- Reliable schedule\n- Comfortable seating\n\n**Stations:**\n- Nairobi Central Station\n- Embakasi Village\n- Syokimau\n- Ruiru\n- Limuru",
    "🚂 **Commuter Train Services:**\n\n**Main Routes:**\n- **CBD → Embakasi:** Ksh 50-100\n- **CBD → Syokimau:** Ksh 80-150\n- **CBD → Ruiru:** Ksh 60-120\n- **CBD → Limuru:** Ksh 100-200\n\n**Schedule:**\n- Morning: 6:00, 7:00, 8:00 AM\n- Evening: 5:00, 6:00, 7:00 PM\n- Midday: Every 2 hours\n\n**Payment:**\n- Cash at stations\n- M-Pesa\n- Smart cards (some routes)\n\n**Tips:**\n- Arrive 15 minutes early\n- Buy tickets in advance during peak hours\n- Check schedule changes on holidays"
  ],
  
  // Boda boda (motorcycle taxis)
  'boda': [
    "🏍️ **Boda Boda Services:**\n\n**Short Distance:**\n- CBD to nearby areas: Ksh 50-150\n- Within neighborhoods: Ksh 30-100\n- Airport to nearby: Ksh 200-500\n\n**Safety Tips:**\n- Always wear a helmet\n- Negotiate fare before trip\n- Use registered boda boda stands\n- Avoid riding at night\n\n**Popular Routes:**\n- CBD to Westlands\n- CBD to Eastlands\n- CBD to South B\n- Airport to CBD\n\n**Operating Hours:** 6:00 AM - 10:00 PM\n**Payment:** Cash only",
    "🏍️ **Motorcycle Taxis (Boda Boda):**\n\n**Fare Structure:**\n- Short trips (1-3 km): Ksh 30-80\n- Medium trips (3-8 km): Ksh 80-150\n- Long trips (8+ km): Ksh 150-300\n\n**Where to Find:**\n- Designated boda boda stands\n- Shopping centers\n- Bus stations\n- Hotels\n\n**Safety Guidelines:**\n- Wear helmet (mandatory)\n- Check bike condition\n- Use licensed operators\n- Avoid rush hour for long trips\n\n**Best For:**\n- Quick short trips\n- Avoiding traffic\n- Last-mile connectivity\n- Emergency rides"
  ],
  
  // General transport advice
  'transport': [
    "🚗 **Nairobi Transport Overview:**\n\n**Best Options by Distance:**\n- **Short (1-3 km):** Walking, Boda boda\n- **Medium (3-10 km):** Matatu, Bus, Boda boda\n- **Long (10+ km):** Matatu, Bus, Train, Taxi\n\n**Peak Hours:**\n- Morning: 7:00-9:00 AM\n- Evening: 5:00-7:00 PM\n\n**Cost Comparison:**\n- Walking: Free\n- Boda boda: Ksh 30-300\n- Matatu: Ksh 30-120\n- Bus: Ksh 40-100\n- Train: Ksh 50-200\n- Taxi: Ksh 400-1500\n\n**Tips:**\n- Use multiple apps for comparison\n- Have cash and M-Pesa ready\n- Plan routes during off-peak hours",
    "🚌 **Getting Around Nairobi:**\n\n**Transport Hierarchy:**\n1. **Walking** - Best for short distances\n2. **Boda boda** - Quick short trips\n3. **Matatu** - Most popular, affordable\n4. **Bus** - Comfortable, reliable\n5. **Train** - Avoids traffic, limited routes\n6. **Taxi** - Convenient, expensive\n\n**Money-Saving Tips:**\n- Use matatus for daily commute\n- Buy monthly passes where available\n- Walk short distances\n- Share taxis with others\n- Use train for long distances\n\n**Safety:**\n- Avoid unmarked vehicles\n- Use official taxi stands\n- Keep valuables secure\n- Travel in groups at night"
  ],
  
  // Education and schools
  'education': [
    "🎓 **Nairobi Education Institutions:**\n\n**Universities:**\n- **University of Nairobi:** CBD, Engineering, Medicine, Law\n- **Kenyatta University:** Thika Road, Education, Medicine\n- **Jomo Kenyatta University:** Juja, Engineering, Technology\n- **Strathmore University:** Karen, Business, IT, Law\n- **USIU:** Karen, International programs\n- **Daystar University:** Karen, Communication, Theology\n\n**Top Schools:**\n- **Alliance High School:** Karen, National school\n- **Starehe Boys Centre:** CBD, Leadership focus\n- **Kenya High School:** Westlands, Girls' school\n- **Brookhouse School:** Karen, International curriculum\n- **Braeburn School:** Karen, British curriculum\n\n**Transport to Schools:**\n- Most schools have dedicated bus routes\n- Matatus serve major school areas\n- Private shuttles available for international schools",
    "🏫 **Educational Transport Services:**\n\n**University Routes:**\n- **UoN:** Routes 111, 112, 15, 16 (CBD)\n- **KU:** Routes 1, 2, 32, 33 (Thika Road)\n- **JKUAT:** Routes 3, 4, 34, 35 (Juja)\n- **Strathmore:** Routes 111, 112, 24, 25 (Karen)\n\n**School Transport:**\n- **Alliance:** Routes 111, 112, 24, 25\n- **Starehe:** Routes 111, 112, 15, 16\n- **Kenya High:** Routes 111, 112, 24, 25\n- **International Schools:** Private shuttles, Routes 111, 112\n\n**Admission Requirements:**\n- Universities: KCSE B+, Application, Interview\n- National Schools: KCPE 350+, Application\n- International Schools: Previous records, Interview\n\n**Student Life:**\n- Clubs and societies\n- Sports facilities\n- Cultural events\n- Career services"
  ],
  
  // Entertainment and malls
  'entertainment': [
    "🎭 **Nairobi Entertainment Hubs:**\n\n**Major Malls:**\n- **Two Rivers:** Largest mall, Ice rink, Cinema\n- **Westgate:** Westlands, Cinema, Restaurants\n- **The Hub Karen:** Karen area, Family-friendly\n- **Village Market:** Karen, Swimming pool, Gym\n- **Sarit Centre:** Westlands, Business district\n- **Galleria:** Karen, Modern facilities\n- **Buru Buru Mall:** Eastlands, Community mall\n\n**Entertainment Features:**\n- Cinemas and theaters\n- Ice skating (Two Rivers)\n- Swimming pools (Village Market)\n- Adventure parks\n- Live music venues\n- Food courts\n\n**Transport to Malls:**\n- All malls accessible by matatu\n- Dedicated parking available\n- Some offer shuttle services\n- Walking distance from major areas",
    "🛍️ **Shopping & Entertainment:**\n\n**Popular Stores:**\n- **Carrefour:** Two Rivers, Village Market, The Hub\n- **Nakumatt:** Westgate, Sarit, Galleria\n- **Java House:** All major malls\n- **Artcaffe:** The Hub, Village Market\n- **KFC/Pizza Hut:** Most malls\n\n**Events & Activities:**\n- **Two Rivers:** Ice skating shows, Food festivals\n- **Westgate:** Fashion shows, Live performances\n- **Village Market:** Swimming competitions\n- **The Hub:** Live music, Kids activities\n\n**Parking:**\n- **Two Rivers:** Ksh 150/2hrs\n- **Westgate:** Ksh 200/3hrs\n- **The Hub:** Ksh 200/3hrs\n- **Village Market:** Ksh 250/3hrs\n- **Sarit:** Ksh 100/2hrs\n\n**Operating Hours:**\n- Most malls: 9:00 AM - 10:00 PM\n- Some open earlier (8:00 AM)\n- Extended hours on weekends"
  ],
  
  // Airport transport
  'airport': [
    "✈️ **Jomo Kenyatta International Airport Transport:**\n\n**Taxi Options:**\n- Uber: Ksh 1500-2500\n- Bolt: Ksh 1200-2000\n- Airport taxis: Ksh 2000-3000\n- Hotel shuttles: Varies\n\n**Public Transport:**\n- Bus 34: CBD to Airport (Ksh 100-150)\n- Train: CBD to Embakasi, then boda boda\n- Matatu: Route 34 to Airport Road\n\n**Travel Time:**\n- Taxi: 30-60 minutes (traffic dependent)\n- Public transport: 60-90 minutes\n\n**Tips:**\n- Book taxis in advance\n- Allow extra time for traffic\n- Have cash ready for public transport\n- Consider hotel shuttle if available",
    "🛬 **Airport Transportation:**\n\n**From Airport to City:**\n- **Uber/Bolt:** Ksh 1200-2500 (30-60 min)\n- **Airport Taxi:** Ksh 2000-3000 (30-60 min)\n- **Bus 34:** Ksh 100-150 (60-90 min)\n- **Hotel Shuttle:** Free with booking\n\n**From City to Airport:**\n- **Uber/Bolt:** Ksh 1200-2500\n- **Airport Express:** Ksh 500-800\n- **Public Bus:** Ksh 100-150\n\n**Best Times:**\n- Early morning (5-7 AM): Less traffic\n- Late evening (9-11 PM): Less traffic\n- Avoid: 7-9 AM, 5-7 PM\n\n**Booking Tips:**\n- Reserve taxis 2-3 hours in advance\n- Confirm pickup location\n- Have flight details ready"
  ],
  
  // Traffic information
  'traffic': [
    "🚦 **Nairobi Traffic Patterns:**\n\n**Peak Hours:**\n- **Morning:** 7:00-9:00 AM\n- **Evening:** 5:00-7:00 PM\n\n**Heavy Traffic Areas:**\n- Mombasa Road (Airport to CBD)\n- Thika Road (CBD to Thika)\n- Waiyaki Way (CBD to Westlands)\n- Jogoo Road (CBD to Eastlands)\n- Mbagathi Road (CBD to Karen)\n\n**Best Travel Times:**\n- **Morning:** Before 7:00 AM or after 9:00 AM\n- **Evening:** Before 5:00 PM or after 7:00 PM\n- **Weekends:** Generally lighter traffic\n\n**Tips:**\n- Use traffic apps (Google Maps, Waze)\n- Consider alternative routes\n- Use public transport during peak hours",
    "🚗 **Traffic Information:**\n\n**Congestion Hotspots:**\n- **CBD:** All major roads during peak hours\n- **Westlands:** Waiyaki Way, Ring Road\n- **Eastlands:** Jogoo Road, Outer Ring\n- **South B/C:** Mbagathi Road, Langata Road\n- **Airport:** Mombasa Road\n\n**Alternative Routes:**\n- Use bypass roads when possible\n- Consider train for long distances\n- Use boda boda for short trips\n- Walk short distances\n\n**Real-time Updates:**\n- Google Maps Traffic\n- Waze Navigation\n- Radio traffic reports\n- Social media updates\n\n**Planning Tips:**\n- Add 30-60 minutes buffer time\n- Check traffic before leaving\n- Have backup transport options"
  ],
  
  // Parking information
  'parking': [
    "🅿️ **Nairobi Parking Information:**\n\n**CBD Parking:**\n- **Street Parking:** Ksh 50-100/hour\n- **Shopping Centers:** Ksh 100-200/hour\n- **Hotels:** Ksh 200-500/hour\n- **Office Buildings:** Ksh 150-300/hour\n\n**Popular Areas:**\n- **Westlands:** Sarit Centre, Westgate\n- **CBD:** Two Rivers, The Hub\n- **Karen:** Village Market, Galleria\n- **Eastlands:** Buru Buru Mall\n\n**Free Parking:**\n- Some residential areas\n- Church compounds (Sundays)\n- Some office buildings (after hours)\n\n**Tips:**\n- Arrive early for street parking\n- Use shopping center parking\n- Consider public transport\n- Have exact change ready",
    "🚗 **Parking Options:**\n\n**Paid Parking:**\n- **Street:** Ksh 50-100/hour\n- **Malls:** Ksh 100-200/hour\n- **Hotels:** Ksh 200-500/hour\n- **Airport:** Ksh 200-500/day\n\n**Shopping Center Parking:**\n- **Two Rivers:** Ksh 100/hour\n- **Westgate:** Ksh 150/hour\n- **Sarit Centre:** Ksh 100/hour\n- **Village Market:** Ksh 120/hour\n\n**Parking Apps:**\n- Some areas have mobile payment\n- M-Pesa payments accepted\n- Receipt required for validation\n\n**Security:**\n- Use well-lit areas\n- Don't leave valuables visible\n- Lock doors properly\n- Consider valet parking at hotels"
  ]
};

// Function to get mockup response based on user query
function getMockupResponse(userMessage) {
  const message = userMessage.toLowerCase();
  
  // Check for transport-related keywords
  if (message.includes('matatu') || message.includes('matatus')) {
    return transportMockupResponses.matatu[Math.floor(Math.random() * transportMockupResponses.matatu.length)];
  }
  if (message.includes('bus') || message.includes('buses')) {
    return transportMockupResponses.bus[Math.floor(Math.random() * transportMockupResponses.bus.length)];
  }
  if (message.includes('taxi') || message.includes('uber') || message.includes('bolt')) {
    return transportMockupResponses.taxi[Math.floor(Math.random() * transportMockupResponses.taxi.length)];
  }
  if (message.includes('train') || message.includes('rail')) {
    return transportMockupResponses.train[Math.floor(Math.random() * transportMockupResponses.train.length)];
  }
  if (message.includes('boda') || message.includes('motorcycle')) {
    return transportMockupResponses.boda[Math.floor(Math.random() * transportMockupResponses.boda.length)];
  }
  if (message.includes('airport') || message.includes('jomo kenyatta')) {
    return transportMockupResponses.airport[Math.floor(Math.random() * transportMockupResponses.airport.length)];
  }
  if (message.includes('traffic') || message.includes('congestion')) {
    return transportMockupResponses.traffic[Math.floor(Math.random() * transportMockupResponses.traffic.length)];
  }
  if (message.includes('parking') || message.includes('park')) {
    return transportMockupResponses.parking[Math.floor(Math.random() * transportMockupResponses.parking.length)];
  }
  if (message.includes('transport') || message.includes('transportation') || message.includes('commute')) {
    return transportMockupResponses.transport[Math.floor(Math.random() * transportMockupResponses.transport.length)];
  }
  if (message.includes('education') || message.includes('university') || message.includes('school') || message.includes('college')) {
    return transportMockupResponses.education[Math.floor(Math.random() * transportMockupResponses.education.length)];
  }
  if (message.includes('entertainment') || message.includes('mall') || message.includes('shopping') || message.includes('cinema') || message.includes('restaurant') || message.includes('theater')) {
    return transportMockupResponses.entertainment[Math.floor(Math.random() * transportMockupResponses.entertainment.length)];
  }
  
  // Default response for transport-related queries
  return "🚗 **Nairobi Transport & Services Information:**\n\nI can help you with:\n- **Matatu routes and fares**\n- **Bus services and schedules**\n- **Taxi and ride-hailing options**\n- **Train commuter services**\n- **Boda boda (motorcycle taxis)**\n- **Airport transportation**\n- **Traffic patterns and tips**\n- **Parking information**\n- **Education institutions**\n- **Entertainment hubs and malls**\n\nPlease ask about any specific service you need information about!";
}

export default function Assistant() {
  const [messages, setMessages] = useState([
    { 
      role: 'model', 
      content: "Hello! I'm your UrbanFlow Assistant. I can help you with:\n\n🚌 Transport planning and routes\n🍔 Food recommendations and delivery\n🏥 Healthcare services\n🎓 Educational institutions\n🎭 Entertainment and events\n\nWhat would you like to know about?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function send() {
    if (!input.trim() || loading) return;
    
    const userMessage = input.trim();
    setError('');
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const apiBase = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3001';
      const res = await fetch(`${apiBase}/api/gemini/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: userMessage, 
          history: newMessages.slice(0, -1),
          systemInstruction: `You are UrbanFlow Assistant, a helpful AI for urban living in Nairobi, Kenya. 
          
          You help users with:
          - Transport planning (buses, taxis, trains, bike hire)
          - Food delivery and restaurant recommendations
          - Healthcare services and clinics
          - Educational institutions
          - Entertainment and events
          
          Keep responses concise, practical, and focused on Nairobi. Use Ksh for prices, mention specific areas like Westlands, CBD, Karen, etc.
          
          If asked about features you don't know, suggest they check the relevant section of the app.`
        }),
      });
      
      const data = await res.json();

      if (!res.ok) {
        const serverMsg = data?.details || data?.error || `Server error: ${res.status}`;
        setError(serverMsg);
        throw new Error(serverMsg);
      }

      setMessages([...newMessages, { role: 'model', content: data.text }]);
    } catch (e) {
      console.error('Assistant error:', e);
      const errorMessage = e.message === 'Failed to fetch' 
        ? 'Unable to connect to the assistant. Please check your internet connection and try again.'
        : e.message || 'Something went wrong. Please try again.';
      
      setError(errorMessage);
      
      // Check if the query is transport-related and provide mockup response
      const userMessageLower = userMessage.toLowerCase();
      const isTransportQuery = userMessageLower.includes('transport') || 
                              userMessageLower.includes('matatu') || 
                              userMessageLower.includes('bus') || 
                              userMessageLower.includes('taxi') || 
                              userMessageLower.includes('train') || 
                              userMessageLower.includes('boda') || 
                              userMessageLower.includes('airport') || 
                              userMessageLower.includes('traffic') || 
                              userMessageLower.includes('parking') ||
                              userMessageLower.includes('commute') ||
                              userMessageLower.includes('route') ||
                              userMessageLower.includes('fare') ||
                              userMessageLower.includes('uber') ||
                              userMessageLower.includes('bolt') ||
                              userMessageLower.includes('education') ||
                              userMessageLower.includes('university') ||
                              userMessageLower.includes('school') ||
                              userMessageLower.includes('college') ||
                              userMessageLower.includes('entertainment') ||
                              userMessageLower.includes('mall') ||
                              userMessageLower.includes('shopping') ||
                              userMessageLower.includes('cinema') ||
                              userMessageLower.includes('restaurant') ||
                              userMessageLower.includes('theater');
      
      if (isTransportQuery) {
        const mockupResponse = getMockupResponse(userMessage);
        setMessages([...newMessages, { 
          role: 'model', 
          content: mockupResponse 
        }]);
      } else {
        setMessages([...newMessages, { 
          role: 'model', 
          content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment or check your internet connection." 
        }]);
      }
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const styles = {
    container: {
      maxWidth: 800,
      margin: '40px auto',
      padding: 16,
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    },
    header: {
      textAlign: 'center',
      marginBottom: 24,
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: 12,
      color: 'white',
    },
    title: {
      margin: 0,
      fontSize: '28px',
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
    },
    subtitle: {
      margin: '8px 0 0 0',
      opacity: 0.9,
      fontSize: '16px',
    },
    chatContainer: {
      border: '1px solid #e2e8f0',
      borderRadius: 12,
      background: '#fff',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden',
      height: '500px',
      display: 'flex',
      flexDirection: 'column',
    },
    messagesArea: {
      flex: 1,
      padding: 16,
      overflowY: 'auto',
      background: '#f8fafc',
    },
    message: {
      marginBottom: 16,
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
    },
    userMessage: {
      flexDirection: 'row-reverse',
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 14,
      fontWeight: 600,
      flexShrink: 0,
    },
    userAvatar: {
      background: '#3b82f6',
      color: 'white',
    },
    botAvatar: {
      background: '#10b981',
      color: 'white',
    },
    messageContent: {
      maxWidth: '70%',
      padding: 12,
      borderRadius: 12,
      fontSize: 14,
      lineHeight: 1.5,
    },
    userContent: {
      background: '#3b82f6',
      color: 'white',
      borderBottomRightRadius: 4,
    },
    botContent: {
      background: 'white',
      color: '#1f2937',
      border: '1px solid #e5e7eb',
      borderBottomLeftRadius: 4,
    },
    inputArea: {
      padding: 16,
      borderTop: '1px solid #e2e8f0',
      background: 'white',
      display: 'flex',
      gap: 12,
      alignItems: 'flex-end',
    },
    textarea: {
      flex: 1,
      padding: 12,
      border: '1px solid #d1d5db',
      borderRadius: 8,
      fontSize: 14,
      resize: 'none',
      fontFamily: 'inherit',
      outline: 'none',
      transition: 'border-color 0.2s',
    },
    textareaFocus: {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    },
    sendButton: {
      padding: '12px 16px',
      background: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: 8,
      cursor: 'pointer',
      fontSize: 14,
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      transition: 'background-color 0.2s',
    },
    sendButtonHover: {
      background: '#2563eb',
    },
    sendButtonDisabled: {
      background: '#9ca3af',
      cursor: 'not-allowed',
    },
    error: {
      color: '#dc2626',
      fontSize: 14,
      textAlign: 'center',
      padding: 8,
      background: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: 8,
      marginBottom: 16,
    },
    loading: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      color: '#6b7280',
      fontSize: 14,
    },
    typingIndicator: {
      display: 'flex',
      gap: 4,
      padding: '8px 0',
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: '#9ca3af',
      animation: 'typing 1.4s infinite ease-in-out',
    },
    dot1: { animationDelay: '-0.32s' },
    dot2: { animationDelay: '-0.16s' },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          <FiMessageCircle size={28} />
          UrbanFlow Assistant
        </h1>
        <p style={styles.subtitle}>Your AI companion for urban living in Nairobi</p>
      </div>

      <div style={styles.chatContainer}>
        <div style={styles.messagesArea}>
          {messages.map((m, idx) => (
            <div 
              key={idx} 
              style={{
                ...styles.message,
                ...(m.role === 'user' ? styles.userMessage : {})
              }}
            >
              <div style={{
                ...styles.avatar,
                ...(m.role === 'user' ? styles.userAvatar : styles.botAvatar)
              }}>
                {m.role === 'user' ? <FiUser size={16} /> : <FiMessageSquare size={16} />}
              </div>
              <div style={{
                ...styles.messageContent,
                ...(m.role === 'user' ? styles.userContent : styles.botContent)
              }}>
                <div style={{ whiteSpace: 'pre-wrap' }}>{m.content}</div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div style={styles.message}>
              <div style={{...styles.avatar, ...styles.botAvatar}}>
                <FiMessageSquare size={16} />
              </div>
              <div style={{...styles.messageContent, ...styles.botContent}}>
                <div style={styles.loading}>
                  <span>Assistant is typing</span>
                  <div style={styles.typingIndicator}>
                    <div style={{...styles.dot, ...styles.dot1}}></div>
                    <div style={{...styles.dot, ...styles.dot2}}></div>
                    <div style={styles.dot}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {error && <div style={styles.error}>{error}</div>}
          <div ref={messagesEndRef} />
        </div>

        <div style={styles.inputArea}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask about transport, food, healthcare, education, or entertainment in Nairobi..."
            rows={1}
            style={{
              ...styles.textarea,
              ...(input ? styles.textareaFocus : {})
            }}
            disabled={loading}
          />
          <button 
            onClick={send} 
            disabled={loading || !input.trim()}
            style={{
              ...styles.sendButton,
              ...(loading || !input.trim() ? styles.sendButtonDisabled : {})
            }}
          >
            <FiSend size={16} />
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes typing {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}


