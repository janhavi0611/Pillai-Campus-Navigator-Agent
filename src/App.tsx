import React, { useState, useEffect, useRef } from "react";
import {
  Compass,
  MapPin,
  Send,
  HelpCircle,
  Accessibility,
  Clock,
  Layers,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  User,
  Activity,
  Coffee,
  Briefcase,
  BookOpen,
  PhoneCall,
  Menu,
  X,
  Copy,
  Volume2,
  VolumeX,
  CheckCircle,
  Building,
  ArrowUpRight
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

interface FloorDetails {
  floor: string;
  purpose: string;
  landmarks: string[];
  offices: { name: string; room?: string; icon: string }[];
  labs: { name: string; room?: string; icon: string }[];
  rules?: string;
}

const PCE_FLOORS: FloorDetails[] = [
  {
    floor: "Ground Floor",
    purpose: "Administration + Student Services + Workshops + Sports",
    landmarks: ["Quad Area", "Library", "Canteen", "Placement Cell", "First Aid Room", "Gymkhana", "Football Ground"],
    offices: [
      { name: "Principal Office", room: "S003", icon: "briefcase" },
      { name: "Placement Cell", room: "S004", icon: "award" },
      { name: "Admission Enquiry", room: "S008, S009", icon: "info" },
      { name: "Engineering Office", room: "S011", icon: "settings" },
      { name: "First Aid Room", room: "S001A", icon: "heart" },
      { name: "Fees Counter", room: "Counter 1, 2, 3", icon: "credit-card" }
    ],
    labs: [
      { name: "Machine Shop", room: "J001", icon: "wrench" },
      { name: "Hydraulic Machinery Lab", room: "J002, J003", icon: "droplet" },
      { name: "Strength of Materials Lab", room: "R003", icon: "hammer" },
      { name: "Department of IT Labs", room: "R001, R002", icon: "cpu" }
    ]
  },
  {
    floor: "1st Floor",
    purpose: "Computer Engineering + IT + Architecture + Research",
    landmarks: ["Architecture Library", "Central Computer Labs", "Dr Daphne Pillai Office", "Physics & Chemistry Labs"],
    offices: [
      { name: "Dr Daphne Pillai Office", room: "P104 & P105", icon: "user" },
      { name: "Dr Marcarenhas Cabin", room: "O105", icon: "user" },
      { name: "IT & Computer Eng Staff Room", room: "O101 & O102", icon: "users" }
    ],
    labs: [
      { name: "Central Computer Labs", room: "P100, P101, P103", icon: "monitor" },
      { name: "Material Tech Lab", room: "J101", icon: "layers" },
      { name: "Mechanotronics Lab", room: "J102", icon: "settings" },
      { name: "PCB Design & Power Electronics", room: "J104 & J105", icon: "zap" },
      { name: "Physics Lab", room: "T101", icon: "activity" },
      { name: "Applied Chemistry Lab", room: "T102", icon: "flask" }
    ]
  },
  {
    floor: "2nd Floor",
    purpose: "Administration + Architecture + Engineering Sciences",
    landmarks: ["FY & SY Seminar Hall", "Architecture Admin Office", "PCACS Exam Cell"],
    offices: [
      { name: "Architecture Admin Office", room: "G201", icon: "building" },
      { name: "Principal Gajanan Wadkar Sir Office", room: "Admin block", icon: "user" },
      { name: "Vice Principal Deepika Sharma Office", room: "Admin block", icon: "user" },
      { name: "PCACS Exam Cell", room: "P202 & P203", icon: "file-text" }
    ],
    labs: [
      { name: "Large Computer Lab", room: "P204", icon: "monitor" },
      { name: "CAD FEA Lab", room: "J201", icon: "box" },
      { name: "Engineering Tech & Mechanics Labs", room: "T201, T202, T203", icon: "sliders" },
      { name: "Business Simulation Lab", room: "G205", icon: "trending-up" }
    ],
    rules: "Full access to the Second Floor is available through the staircase from the 1st Floor Admission Area."
  },
  {
    floor: "3rd Floor",
    purpose: "Knowledge Centre + Management + Biotechnology",
    landmarks: ["Knowledge Centre", "PIMSR Conclave", "Biotech Lab", "Networking Lab"],
    offices: [
      { name: "PIMSR Admin Office", room: "G304 block", icon: "briefcase" },
      { name: "Director PIMSR Office", room: "Director suite", icon: "user" },
      { name: "National Service Scheme (NSS)", room: "O305", icon: "users" }
    ],
    labs: [
      { name: "Knowledge Centre Library", room: "S302", icon: "book" },
      { name: "Biotechnology Lab", room: "J304 & J305", icon: "dna" },
      { name: "Analog & Networking Labs", room: "T302, T303", icon: "network" },
      { name: "CAD FEA Lab", room: "J301", icon: "box" }
    ]
  },
  {
    floor: "4th Floor",
    purpose: "Mechanical Engineering + Electronics + Examination",
    landmarks: ["AI & ML Lab", "Robotics Lab", "Department of Mechanical Engineering", "Exam Centre"],
    offices: [
      { name: "Department of Mechanical Engineering", room: "O401", icon: "settings" },
      { name: "Exam Center & Verification", room: "P401", icon: "check-square" },
      { name: "Academic Advisor Cabin", room: "L401", icon: "help-circle" },
      { name: "Railway Concession Counter", room: "Counter 4", icon: "subway" }
    ],
    labs: [
      { name: "AI & ML Lab / Robotics Lab", room: "P409", icon: "cpu" },
      { name: "Industry 4.0 Lab", room: "P409", icon: "factory" },
      { name: "Microprocessor & Microcontroller Lab", room: "T401, T402", icon: "pocket" },
      { name: "Advanced Communication Lab", room: "T403", icon: "radio" },
      { name: "Chemical Lab 1", room: "J404 & J405", icon: "flask" }
    ]
  },
  {
    floor: "5th Floor",
    purpose: "Engineering Laboratories + Training",
    landmarks: ["SAP Academy", "Business Scenario Training Centre", "Engineering Seminar Hall"],
    offices: [
      { name: "SAP Academy Classroom", room: "J501, J502, J503", icon: "graduation-cap" },
      { name: "Business Scenario Training", room: "Exec Suite", icon: "presentation" }
    ],
    labs: [
      { name: "Digital Signal Processing Lab", room: "T502", icon: "activity" },
      { name: "Digital Communication Lab", room: "T501", icon: "wifi" },
      { name: "Engineering Project Lab", room: "T503", icon: "rocket" }
    ],
    rules: "⚠️ CRITICAL ROUTING: A closed gate divides this floor. To reach the Engineering Labs or Seminar Hall, you MUST enter through the Fourth Floor Engineering Building and climb up."
  },
  {
    floor: "6th Floor",
    purpose: "Skill Development + Sports Management",
    landmarks: ["Skill Development Cell", "Sports Management Room", "Conclave 2"],
    offices: [
      { name: "Skill Development Cell (Fashion)", room: "Fashion room", icon: "scissors" },
      { name: "Sports Management Room", room: "P603", icon: "trophy" },
      { name: "Wifi Assemblance Room", room: "P604", icon: "wifi" }
    ],
    labs: [],
    rules: "⚠️ ROUTING: Some areas require access through the Auditorium side or via the PICA Exam Cell route. To reach the Skill Development Room, come down to the 4th Floor and go upstairs through PICA Exam Cell (P401)."
  }
];

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: `👋 Hello! Welcome to Pillai Navigator AI.

I'm your smart campus navigation assistant for Pillai College of Engineering.

I can help you:
📍 Find classrooms
🧪 Locate laboratories
🏢 Find departments
👨‍🏫 Locate faculty offices
🍽 Find the canteen
📚 Locate the library
🏥 Find the First Aid Room
🚻 Find washrooms
🛗 Find lifts and staircases
🚗 Find parking
🧭 Navigate anywhere inside the campus

Just tell me where you are and where you'd like to go.`,
      timestamp: new Date()
    }
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("Unknown");
  const [selectedFloor, setSelectedFloor] = useState<number>(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  
  // Custom states for user roles and accessibility modes
  const [userRole, setUserRole] = useState<"Student" | "Parent" | "Visitor" | "Faculty" | "Staff">("Student");
  const [navigationMode, setNavigationMode] = useState<"Standard" | "Accessible" | "Fastest">("Standard");

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const rawMessageText = textToSend || input;
    if (!rawMessageText.trim()) return;

    // Clear input
    if (!textToSend) setInput("");

    // Build the user message text with context if available
    let processedText = rawMessageText;
    const isNavigationRequest = 
      /take|guide|navigate|find|where|how to|reach|lost|route/i.test(rawMessageText);

    // If navigation request and current location is known, append it to user query
    if (isNavigationRequest && currentLocation !== "Unknown" && !rawMessageText.toLowerCase().includes("at") && !rawMessageText.toLowerCase().includes("from")) {
      processedText += ` (I am currently at ${currentLocation})`;
    }

    // Add role and accessibility contexts to the request
    const contextAddons = [];
    if (userRole !== "Student") contextAddons.push(`Role: ${userRole}`);
    if (navigationMode === "Accessible") contextAddons.push("Mode: Accessible (Wheelchair/Heavy luggage - avoid stairs, use lifts)");
    if (navigationMode === "Fastest") contextAddons.push("Mode: Fastest Route (In a hurry - recommend staircases for 1-2 floors)");

    if (contextAddons.length > 0) {
      processedText += `\n[Context - ${contextAddons.join(", ")}]`;
    }

    const userMessage: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: rawMessageText, // Display clean text to user
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Map entire state-based conversation history
      const historyPayload = [...messages, userMessage].map((msg) => ({
        sender: msg.sender,
        text: msg.id === userMessage.id ? processedText : msg.text
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: historyPayload })
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with navigation engine");
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: Math.random().toString(),
        sender: "ai",
        text: data.text,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Automatically update current location if the AI successfully responds and we started with a location or asked
      // We can also extract location from query if needed.
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: Math.random().toString(),
        sender: "ai",
        text: "❌ **System Error**: I encountered an issue connecting to the Pillai Navigation Server. Please make sure the server is fully started and try again.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestClick = (promptText: string) => {
    handleSend(promptText);
  };

  const handleCopyText = (text: string, messageId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleSpeakText = (text: string) => {
    if ("speechSynthesis" in window) {
      // Stop any existing speech
      window.speechSynthesis.cancel();

      // Clean text from markdown characters for natural speech
      const cleanedSpeechText = text
        .replace(/[*#_📍📌🧭⏱🏢💡]/g, "")
        .replace(/\n/g, " ");

      const utterance = new SpeechSynthesisUtterance(cleanedSpeechText);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in this browser.");
    }
  };

  const formatText = (text: string) => {
    // Basic Markdown formatting helper for the React UI
    return text.split("\n").map((line, index) => {
      let content = line;
      
      // Handle bold texts
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(content)) !== null) {
        if (match.index > lastIndex) {
          parts.push(content.substring(lastIndex, match.index));
        }
        parts.push(
          <strong key={match.index} className="font-bold text-slate-900">
            {match[1]}
          </strong>
        );
        lastIndex = boldRegex.lastIndex;
      }
      
      if (lastIndex < content.length) {
        parts.push(content.substring(lastIndex));
      }

      // Render line with appropriate breaks or list style
      const renderedLine = parts.length > 0 ? parts : content;
      
      return (
        <span key={index} className="block min-h-[1.2rem]">
          {renderedLine}
        </span>
      );
    });
  };

  return (
    <div id="pce-app-container" className="flex h-screen w-screen bg-[#F8FAFC] font-sans text-slate-800 overflow-hidden">
      
      {/* SIDEBAR: Brand, Configuration & Modes */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-80 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1E3A8A] rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
              <Compass className="h-6 w-6 text-white animate-spin-slow" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-tight">Pillai University</h1>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Navigator AI</p>
            </div>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden p-2 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Configurations Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* User Location Setter */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-1">📍 Your Current Location</label>
            <div className="relative">
              <select
                value={currentLocation}
                onChange={(e) => setCurrentLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium appearance-none cursor-pointer"
              >
                <option value="Unknown">❓ Unknown (Ask AI or specify)</option>
                <option value="Gate 1 (Main Entrance)">🚪 Gate 1 (Main Entry)</option>
                <option value="Gate 2 (Side Entrance)">🚪 Gate 2 (Side Entry)</option>
                <option value="Gate 3 (Rear Entrance)">🚪 Gate 3 (Rear Entry)</option>
                <option value="Quad Area">🌿 Quad Area (Central Green)</option>
                <option value="Ground Floor Library">📚 Ground Floor Library</option>
                <option value="Ground Floor Canteen">🍽 Ground Floor Canteen</option>
                <option value="Central Lift (Ground Floor)">🛗 Central Lift (Ground)</option>
                <option value="Central Staircase">🪜 Central Staircase</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                ▼
              </div>
            </div>
            <p className="text-[10px] text-slate-400 px-1">Setting this skips the location prompt during requests.</p>
          </div>

          {/* User Role Selection */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-1">👤 Identify Your Role</label>
            <div className="grid grid-cols-2 gap-2">
              {(["Student", "Parent", "Visitor", "Faculty"] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setUserRole(role)}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                    userRole === role
                      ? "bg-blue-50 border-blue-300 text-blue-700 shadow-sm"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Modes */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-1 font-mono">⚡ Navigation Mode</label>
            <div className="space-y-2">
              <button
                onClick={() => setNavigationMode("Standard")}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  navigationMode === "Standard"
                    ? "bg-blue-50 border-blue-200 text-blue-800"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Compass className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-xs font-bold">Standard Route</p>
                    <p className="text-[10px] opacity-80">Default optimal pathing</p>
                  </div>
                </div>
                {navigationMode === "Standard" && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
              </button>

              <button
                onClick={() => setNavigationMode("Accessible")}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  navigationMode === "Accessible"
                    ? "bg-orange-50 border-orange-200 text-orange-800"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Accessibility className="w-4 h-4 text-orange-600" />
                  <div>
                    <p className="text-xs font-bold">Accessible Route</p>
                    <p className="text-[10px] opacity-80">No stairs, lift primary</p>
                  </div>
                </div>
                {navigationMode === "Accessible" && <div className="w-2 h-2 bg-orange-600 rounded-full" />}
              </button>

              <button
                onClick={() => setNavigationMode("Fastest")}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  navigationMode === "Fastest"
                    ? "bg-green-50 border-green-200 text-green-800"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-xs font-bold">Fastest Route</p>
                    <p className="text-[10px] opacity-80">Climb stairs for speed</p>
                  </div>
                </div>
                {navigationMode === "Fastest" && <div className="w-2 h-2 bg-green-600 rounded-full" />}
              </button>
            </div>
          </div>

          {/* Quick Contacts */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-blue-600" /> Emergency Help
            </h4>
            <div className="text-[11px] text-slate-500 space-y-1">
              <p>🚑 First Aid Room: Room S001A (Ground Floor)</p>
              <p>🛡 Campus Security: Admission Desk</p>
              <p>🏥 Primary Contact: PCE Main Office S011</p>
            </div>
          </div>

        </div>

        {/* Campus Status Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <div className="p-3 bg-slate-900 rounded-xl text-white">
            <p className="text-xs font-medium opacity-70 mb-1">PCE Campus Status</p>
            <p className="text-xs font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Open • Main Campus Active
            </p>
          </div>
        </div>
      </aside>

      {/* MAIN CHAT & FLOOR PLAN SELECTOR WRAPPER */}
      <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden">
        
        {/* LEFT COLUMN: Modern Chat Interface */}
        <main className="flex-1 flex flex-col border-r border-slate-200 min-w-0">
          
          {/* Header */}
          <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 z-10 shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 py-1 px-2.5 rounded-full uppercase tracking-wider">
                Pillai College of Engineering
              </span>
              <span className="text-slate-300 hidden sm:inline">|</span>
              <span className="text-sm font-semibold text-slate-700 hidden sm:inline">Campus Assistant</span>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <Activity className="w-4 h-4 text-green-500" />
              <span>AI Engine Active</span>
            </div>
          </header>

          {/* Chat Messages viewport */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* If there's only the greeting message, display suggested prompts beautifully */}
            {messages.length === 1 && (
              <div className="max-w-2xl mx-auto w-full mt-4 mb-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-100 text-[#1E3A8A] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">Pillai Campus Assistant</h2>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto">
                    I have full verified knowledge of PCE's Ground Floor to 6th Floor maps. Let's find your destination!
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { text: "Take me to the AI & ML Lab", desc: "4th Floor - Room P409", emoji: "📍", color: "text-blue-600" },
                    { text: "Where is the canteen?", desc: "Ground Floor, next to Xerox", emoji: "🍽", color: "text-orange-600" },
                    { text: "Guide me to the Placement Cell", desc: "Ground Floor - Room S004", emoji: "🏢", color: "text-green-600" },
                    { text: "Find the nearest washroom", desc: "Available on all floors", emoji: "🚻", color: "text-red-600" },
                    { text: "Where is the Library?", desc: "Ground Floor central entrance", emoji: "📚", color: "text-indigo-600" },
                    { text: "I'm lost. Help me find my way.", desc: "Lost mode navigation help", emoji: "🆘", color: "text-rose-600" }
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestClick(p.text)}
                      className="text-left p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all group flex items-start gap-3.5"
                    >
                      <span className={`text-xl ${p.color} group-hover:scale-110 origin-left transition-transform shrink-0`}>
                        {p.emoji}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{p.text}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{p.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Conversation Messages */}
            <div className="max-w-3xl mx-auto w-full space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* AI Logo Avatar */}
                  {message.sender === "ai" && (
                    <div className="w-8 h-8 rounded-lg bg-blue-800 text-white flex items-center justify-center shrink-0 shadow-sm text-xs font-bold font-mono">
                      P
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 shadow-sm text-sm relative group ${
                      message.sender === "user"
                        ? "bg-[#1E3A8A] text-white rounded-tr-none"
                        : "bg-white border border-slate-100 text-slate-800 rounded-tl-none"
                    }`}
                  >
                    {/* Render message formatting */}
                    <div className="space-y-1 leading-relaxed whitespace-pre-wrap">
                      {formatText(message.text)}
                    </div>

                    {/* Speech / Action Controls for AI navigation output */}
                    {message.sender === "ai" && (
                      <div className="mt-3.5 pt-2 border-t border-slate-100 flex items-center gap-3 text-slate-400 text-xs">
                        <button
                          onClick={() => handleCopyText(message.text, message.id)}
                          className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                          title="Copy text route instructions"
                        >
                          {copiedMessageId === message.id ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                              <span className="text-green-500 text-[10px] font-bold">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span className="text-[10px]">Copy Route</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleSpeakText(message.text)}
                          className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                          title="Read route details aloud"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span className="text-[10px]">Speak Route</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* User Profile Avatar */}
                  {message.sender === "user" && (
                    <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 text-xs font-bold">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Loader Indicator */}
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-lg bg-blue-800 text-white flex items-center justify-center shrink-0 shadow-sm text-xs font-bold font-mono">
                    P
                  </div>
                  <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-4 max-w-[85%] shadow-sm">
                    <div className="flex items-center gap-1.5 animate-pulse">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      <span className="text-xs font-medium text-slate-400 ml-1">Pillai Navigator is calculating shortest path...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          </div>

          {/* BOTTOM: Input and send area */}
          <div className="p-4 bg-white border-t border-slate-200 shrink-0">
            <div className="max-w-3xl mx-auto">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="relative"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask for directions (e.g., 'Take me from Gate 1 to AI & ML Lab')"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-6 pr-14 shadow-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm text-slate-800"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-11 h-11 bg-[#1E3A8A] text-white rounded-xl flex items-center justify-center hover:bg-blue-800 disabled:opacity-50 disabled:hover:bg-[#1E3A8A] transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-widest px-1">
                <span>Campus Maps Knowledge Source</span>
                <span>Pillai College of Engineering Official Database</span>
              </div>
            </div>
          </div>
        </main>

        {/* RIGHT COLUMN: Interactive PCE Floor Directory Map Explorer */}
        <section className="w-full md:w-80 lg:w-96 bg-white flex flex-col shrink-0">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-800 text-sm">PCE Campus Explorer</h3>
            </div>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Floor Directory</span>
          </div>

          {/* Selector Tabs */}
          <div className="grid grid-cols-7 gap-1 border-b border-slate-100 p-2 shrink-0 bg-slate-50/50">
            {PCE_FLOORS.map((f, index) => (
              <button
                key={index}
                onClick={() => setSelectedFloor(index)}
                className={`py-2 px-1 text-center text-xs font-bold rounded-lg transition-all ${
                  selectedFloor === index
                    ? "bg-blue-800 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {index === 0 ? "GF" : `${index}F`}
              </button>
            ))}
          </div>

          {/* Selected Floor Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* Visual Floor Summary Card */}
            <div className="p-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl shadow-sm relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
                <Building className="w-32 h-32" />
              </div>
              <p className="text-blue-400 font-mono text-[10px] font-bold tracking-widest uppercase">PCE Active Floor Level</p>
              <h4 className="text-xl font-bold mt-1">{PCE_FLOORS[selectedFloor].floor}</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{PCE_FLOORS[selectedFloor].purpose}</p>
            </div>

            {/* Warning rules if any */}
            {PCE_FLOORS[selectedFloor].rules && (
              <div className="p-3 bg-rose-50 border border-rose-100 text-rose-800 text-xs rounded-xl flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <p className="leading-normal font-semibold text-[11px]">{PCE_FLOORS[selectedFloor].rules}</p>
              </div>
            )}

            {/* Quick Navigation Trigger Actions */}
            <div className="space-y-4 pt-1">
              
              {/* Offices Group */}
              {PCE_FLOORS[selectedFloor].offices.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">🏢 Offices & Services</h5>
                  <div className="grid grid-cols-1 gap-2">
                    {PCE_FLOORS[selectedFloor].offices.map((off, index) => (
                      <div
                        key={index}
                        className="p-3 bg-white border border-slate-100 rounded-xl hover:border-slate-200 transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center font-bold">
                            {off.room ? off.room[0] : "S"}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">{off.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{off.room || "Admin Area"}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleSuggestClick(`Take me to the ${off.name} ${off.room ? `(${off.room})` : ""}`)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title={`Navigate to ${off.name}`}
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Labs Group */}
              {PCE_FLOORS[selectedFloor].labs.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">🧪 Academic Labs</h5>
                  <div className="grid grid-cols-1 gap-2">
                    {PCE_FLOORS[selectedFloor].labs.map((lab, index) => (
                      <div
                        key={index}
                        className="p-3 bg-white border border-slate-100 rounded-xl hover:border-slate-200 transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold font-mono">
                            {lab.room ? lab.room[0] : "L"}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">{lab.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{lab.room || "Lab wing"}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleSuggestClick(`Take me to the ${lab.name} ${lab.room ? `(${lab.room})` : ""}`)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title={`Navigate to ${lab.name}`}
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Landmarks / Quick References */}
              <div className="space-y-2">
                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">🌟 Floor Landmarks</h5>
                <div className="flex flex-wrap gap-1.5">
                  {PCE_FLOORS[selectedFloor].landmarks.map((lm, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestClick(`Guide me to the ${lm}`)}
                      className="text-[10px] font-semibold bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-600 px-2.5 py-1.5 rounded-lg border border-slate-200/60 transition-colors"
                    >
                      📍 {lm}
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Quick FAQ info panel */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 space-y-1 block shrink-0">
            <p className="font-bold text-slate-700 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" /> PCE Navigation Helper
            </p>
            <p className="leading-relaxed">Click any floor above to view major office & lab landmarks, or tap the arrow icon next to a location to instantly chart a path from your current position!</p>
          </div>

        </section>

      </div>
    </div>
  );
}
