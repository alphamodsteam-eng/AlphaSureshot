import { useState, useEffect } from "react";
import { Menu, Clock, Timer, Activity, Disc, Crown, RotateCw, ShieldCheck, Trophy, X, ChevronRight, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface GameResult {
  periodSuffix: string;
  number: number;
  color: "green" | "red" | "violet";
}

interface WingoBox {
  id: string;
  name: string;
  duration: number; // in seconds
  colorAccent: string;
  tag: string;
  multiplier: string;
  shortDesc: string;
}

const WINGO_BOXES: WingoBox[] = [
  { id: "30s", name: "Wingo 30s", duration: 30, colorAccent: "from-red-500 to-rose-500", tag: "RAPID", multiplier: "9.8x", shortDesc: "Rapid Round" },
  { id: "1m", name: "Wingo 1m", duration: 60, colorAccent: "from-rose-500 to-red-600", tag: "FAST", multiplier: "9.8x", shortDesc: "Classic Tick" },
  { id: "3m", name: "Wingo 3m", duration: 180, colorAccent: "from-red-500 via-rose-400 to-red-600", tag: "TACTIC", multiplier: "9.8x", shortDesc: "Trend Analysis" },
  { id: "5m", name: "Wingo 5m", duration: 300, colorAccent: "from-red-600 to-rose-600", tag: "JACKPOT", multiplier: "9.9x", shortDesc: "Heavy Yield" },
];

/**
 * Calculates India time elements accurately for period generation
 */
function getIndiaDateDetails() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();
  let hour = now.getHours();
  let minute = now.getMinutes();
  let second = now.getSeconds();

  for (const p of parts) {
    if (p.type === "year") year = parseInt(p.value, 10);
    if (p.type === "month") month = parseInt(p.value, 10);
    if (p.type === "day") day = parseInt(p.value, 10);
    if (p.type === "hour") hour = parseInt(p.value, 10);
    if (p.type === "minute") minute = parseInt(p.value, 10);
    if (p.type === "second") second = parseInt(p.value, 10);
  }

  return { year, month, day, hour, minute, second };
}

/**
 * Calculates period suffix and code for Wingo 30s specifically
 */
function getPeriodFor30s() {
  const { year, month, day } = getIndiaDateDetails();
  const startOfDayUTC = Date.UTC(year, month - 1, day, 0, 0, 0, 0);
  const nowUTC = Date.now();
  let elapsedSeconds = Math.floor((nowUTC - startOfDayUTC) / 1000);
  if (elapsedSeconds < 0) elapsedSeconds = 0;

  const durationSeconds = 30;
  const totalPeriods = Math.floor(elapsedSeconds / durationSeconds);
  const upcomingPeriod = totalPeriods + 1;

  const yearStr = year.toString();
  const monthStr = month.toString().padStart(2, "0");
  const dayStr = day.toString().padStart(2, "0");
  const datePrefix = `${yearStr}${monthStr}${dayStr}`;

  const periodSuffix = upcomingPeriod.toString().padStart(4, "0");
  const fullPeriod = `${datePrefix}100005${periodSuffix}`;
  const shortPeriod = fullPeriod.slice(-6); // Slices last 6 numbers

  return {
    full: fullPeriod,
    short: shortPeriod,
    suffix: periodSuffix,
    totalPeriods,
  };
}

/**
 * Calculates period suffix and code for Wingo 1m specifically
 */
function getPeriodFor1m() {
  const { year, month, day, hour, minute } = getIndiaDateDetails();
  
  // Total minutes elapsed since 5:29 AM IST
  const startHour = 5;
  const startMinute = 29;
  let elapsedMinutes = (hour * 60 + minute) - (startHour * 60 + startMinute);
  if (elapsedMinutes < 0) elapsedMinutes = 0;

  const yearStr = year.toString();
  const monthStr = month.toString().padStart(2, "0");
  const dayStr = day.toString().padStart(2, "0");
  const datePrefix = `${yearStr}${monthStr}${dayStr}`;

  const periodSuffix = elapsedMinutes.toString().padStart(4, "0");
  const fullPeriod = `${datePrefix}100001${periodSuffix}`;
  const shortPeriod = fullPeriod.slice(-6); // Slices last 6 numbers

  return {
    full: fullPeriod,
    short: shortPeriod,
    suffix: periodSuffix,
    totalPeriods: elapsedMinutes,
  };
}

/**
 * Calculates period suffix and code for Wingo 3m specifically
 */
function getPeriodFor3m() {
  const { year, month, day, hour, minute } = getIndiaDateDetails();
  
  // Cumulative rounds of 3 minutes from start of day
  const totalMinutes = hour * 60 + minute;
  const elapsedRounds = Math.floor(totalMinutes / 3);

  const yearStr = year.toString();
  const monthStr = month.toString().padStart(2, "0");
  const dayStr = day.toString().padStart(2, "0");
  const datePrefix = `${yearStr}${monthStr}${dayStr}`;

  const periodSuffix = elapsedRounds.toString().padStart(4, "0");
  const fullPeriod = `${datePrefix}100003${periodSuffix}`;
  const shortPeriod = fullPeriod.slice(-6);

  return {
    full: fullPeriod,
    short: shortPeriod,
    suffix: periodSuffix,
    totalPeriods: elapsedRounds,
  };
}

/**
 * Calculates period suffix and code for Wingo 5m specifically
 */
function getPeriodFor5m() {
  const { year, month, day, hour, minute } = getIndiaDateDetails();
  
  // Cumulative rounds of 5 minutes from start of day
  const totalMinutes = hour * 60 + minute;
  const elapsedRounds = Math.floor(totalMinutes / 5);

  const yearStr = year.toString();
  const monthStr = month.toString().padStart(2, "0");
  const dayStr = day.toString().padStart(2, "0");
  const datePrefix = `${yearStr}${monthStr}${dayStr}`;

  const periodSuffix = elapsedRounds.toString().padStart(4, "0");
  const fullPeriod = `${datePrefix}100005${periodSuffix}`;
  const shortPeriod = fullPeriod.slice(-6);

  return {
    full: fullPeriod,
    short: shortPeriod,
    suffix: periodSuffix,
    totalPeriods: elapsedRounds,
  };
}

/**
 * Generates realistic initial results for Wingo 30s
 */
function getInitialResults(count = 5): GameResult[] {
  const list: GameResult[] = [];
  const { totalPeriods } = getPeriodFor30s();

  for (let i = 1; i <= count; i++) {
    const historicalPeriod = totalPeriods - i;
    const suffixVal = Math.max(0, historicalPeriod).toString().padStart(4, "0");
    const num = [3, 7, 2, 8, 0, 5, 1, 9, 4, 6, 2, 7, 5, 8, 9][Math.abs(historicalPeriod) % 15];
    
    let col: "green" | "red" | "violet" = "green";
    if (num === 0 || num === 5) {
      col = "violet";
    } else if (num % 2 === 0) {
      col = "red";
    } else {
      col = "green";
    }

    list.push({
      periodSuffix: suffixVal.slice(-6),
      number: num,
      color: col,
    });
  }
  return list;
}

/**
 * Generates realistic initial results for Wingo 1m
 */
function getInitialResults1m(count = 5): GameResult[] {
  const list: GameResult[] = [];
  const { totalPeriods } = getPeriodFor1m();

  for (let i = 1; i <= count; i++) {
    const historicalPeriod = totalPeriods - i;
    const suffixVal = Math.max(0, historicalPeriod).toString().padStart(4, "0");
    const num = [7, 2, 8, 0, 5, 1, 9, 4, 6, 3, 5, 8, 2, 7, 9][Math.abs(historicalPeriod) % 15];
    
    let col: "green" | "red" | "violet" = "green";
    if (num === 0 || num === 5) {
      col = "violet";
    } else if (num % 2 === 0) {
      col = "red";
    } else {
      col = "green";
    }

    list.push({
      periodSuffix: suffixVal.slice(-6),
      number: num,
      color: col,
    });
  }
  return list;
}

/**
 * Generates realistic initial results for Wingo 3m
 */
function getInitialResults3m(count = 5): GameResult[] {
  const list: GameResult[] = [];
  const { totalPeriods } = getPeriodFor3m();

  for (let i = 1; i <= count; i++) {
    const historicalPeriod = totalPeriods - i;
    const suffixVal = Math.max(0, historicalPeriod).toString().padStart(4, "0");
    const num = [2, 7, 5, 8, 9, 3, 0, 4, 1, 6, 8, 2, 5, 7, 9][Math.abs(historicalPeriod) % 15];
    
    let col: "green" | "red" | "violet" = "green";
    if (num === 0 || num === 5) {
      col = "violet";
    } else if (num % 2 === 0) {
      col = "red";
    } else {
      col = "green";
    }

    list.push({
      periodSuffix: suffixVal.slice(-6),
      number: num,
      color: col,
    });
  }
  return list;
}

/**
 * Generates realistic initial results for Wingo 5m
 */
function getInitialResults5m(count = 5): GameResult[] {
  const list: GameResult[] = [];
  const { totalPeriods } = getPeriodFor5m();

  for (let i = 1; i <= count; i++) {
    const historicalPeriod = totalPeriods - i;
    const suffixVal = Math.max(0, historicalPeriod).toString().padStart(4, "0");
    const num = [8, 3, 0, 5, 2, 9, 4, 1, 7, 6, 5, 2, 8, 0, 3][Math.abs(historicalPeriod) % 15];
    
    let col: "green" | "red" | "violet" = "green";
    if (num === 0 || num === 5) {
      col = "violet";
    } else if (num % 2 === 0) {
      col = "red";
    } else {
      col = "green";
    }

    list.push({
      periodSuffix: suffixVal.slice(-6),
      number: num,
      color: col,
    });
  }
  return list;
}

export default function App() {
  const [activeId, setActiveId] = useState<string>("30s");
  const [currentPage, setCurrentPage] = useState<'home' | 'wingo'>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<{ [key: string]: number }>({
    "30s": 30,
    "1m": 60,
    "3m": 180,
    "5m": 300,
  });

  const [history, setHistory] = useState<GameResult[]>([]);
  const [history1m, setHistory1m] = useState<GameResult[]>([]);
  const [history3m, setHistory3m] = useState<GameResult[]>([]);
  const [history5m, setHistory5m] = useState<GameResult[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>("Just now");

  // Setup initial elegant histories on component mount
  useEffect(() => {
    setHistory(getInitialResults(5));
    setHistory1m(getInitialResults1m(5));
    setHistory3m(getInitialResults3m(5));
    setHistory5m(getInitialResults5m(5));
  }, []);

  // Live countdown timer execution for all boxes
  useEffect(() => {
    const updateTick = () => {
      const epochSec = Math.floor(Date.now() / 1000);
      
      setSecondsLeft({
        "30s": 30 - (epochSec % 30),
        "1m": 60 - (epochSec % 60),
        "3m": 180 - (epochSec % 180),
        "5m": 300 - (epochSec % 300),
      });

      // Synchronize results instantly when the 30-second window completes
      if (epochSec % 30 === 0) {
        setHistory((prevList) => {
          const { suffix } = getPeriodFor30s();
          if (prevList.length === 0 || prevList[0].periodSuffix !== suffix.slice(-6)) {
            const num = Math.floor(Math.random() * 10);
            let col: "green" | "red" | "violet" = "green";
            if (num === 0 || num === 5) {
              col = "violet";
            } else if (num % 2 === 0) {
              col = "red";
            } else {
              col = "green";
            }

            const newRecord: GameResult = {
              periodSuffix: suffix.slice(-6),
              number: num,
              color: col,
            };

            return [newRecord, ...prevList].slice(0, 5);
          }
          return prevList;
        });
      }

      // Synchronize results instantly when the 60-second window completes
      if (epochSec % 60 === 0) {
        setHistory1m((prevList) => {
          const { suffix } = getPeriodFor1m();
          if (prevList.length === 0 || prevList[0].periodSuffix !== suffix.slice(-6)) {
            const num = Math.floor(Math.random() * 10);
            let col: "green" | "red" | "violet" = "green";
            if (num === 0 || num === 5) {
              col = "violet";
            } else if (num % 2 === 0) {
              col = "red";
            } else {
              col = "green";
            }

            const newRecord: GameResult = {
              periodSuffix: suffix.slice(-6),
              number: num,
              color: col,
            };

            return [newRecord, ...prevList].slice(0, 5);
          }
          return prevList;
        });
      }

      // Synchronize results instantly when the 3-minute window completes
      if (epochSec % 180 === 0) {
        setHistory3m((prevList) => {
          const { suffix } = getPeriodFor3m();
          if (prevList.length === 0 || prevList[0].periodSuffix !== suffix.slice(-6)) {
            const num = Math.floor(Math.random() * 10);
            let col: "green" | "red" | "violet" = "green";
            if (num === 0 || num === 5) {
              col = "violet";
            } else if (num % 2 === 0) {
              col = "red";
            } else {
              col = "green";
            }

            const newRecord: GameResult = {
              periodSuffix: suffix.slice(-6),
              number: num,
              color: col,
            };

            return [newRecord, ...prevList].slice(0, 5);
          }
          return prevList;
        });
      }

      // Synchronize results instantly when the 5-minute window completes
      if (epochSec % 300 === 0) {
        setHistory5m((prevList) => {
          const { suffix } = getPeriodFor5m();
          if (prevList.length === 0 || prevList[0].periodSuffix !== suffix.slice(-6)) {
            const num = Math.floor(Math.random() * 10);
            let col: "green" | "red" | "violet" = "green";
            if (num === 0 || num === 5) {
              col = "violet";
            } else if (num % 2 === 0) {
              col = "red";
            } else {
              col = "green";
            }

            const newRecord: GameResult = {
              periodSuffix: suffix.slice(-6),
              number: num,
              color: col,
            };

            return [newRecord, ...prevList].slice(0, 5);
          }
          return prevList;
        });
      }
    };

    updateTick();
    const interval = setInterval(updateTick, 1000);
    return () => clearInterval(interval);
  }, []);

  // Background fetch logic for BOTH Wingo 30S and Wingo 1M API Results
  const fetchLiveHistory = async () => {
    setIsSyncing(true);
    // Fetch 30S Feed
    try {
      const response = await fetch(
        `https://draw.ar-lottery01.com/WinGo/WinGo_30S/GetHistoryIssuePage.json?_=${Date.now()}`
      );
      if (response.ok) {
        const json = await response.json();
        if (json.code === 0 && json.data && Array.isArray(json.data.list)) {
          const freshList = json.data.list.slice(0, 5);
          const parsed: GameResult[] = freshList.map((item: any) => {
            const issue = String(item.issueNumber || "");
            const displaySuffix = issue.slice(-6) || "000000";
            const num = item.number !== undefined ? Number(item.number) : 0;

            let col: "green" | "red" | "violet" = "green";
            if (item.color) {
              const colorsList = String(item.color).split(",");
              if (colorsList.includes("red")) col = "red";
              else if (colorsList.includes("green")) col = "green";
              else if (colorsList.includes("violet")) col = "violet";
            } else {
              if (num === 0 || num === 5) col = "violet";
              else if (num % 2 === 0) col = "red";
              else col = "green";
            }

            return {
              periodSuffix: displaySuffix,
              number: num,
              color: col,
            };
          });

          if (parsed.length > 0) {
            setHistory(parsed);
          }
        }
      }
    } catch (err) {
      console.log("30S fetch error:", err);
    }

    // Fetch 1M Feed
    try {
      const response = await fetch(
        `https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json?_=${Date.now()}`
      );
      if (response.ok) {
        const json = await response.json();
        if (json.code === 0 && json.data && Array.isArray(json.data.list)) {
          const freshList = json.data.list.slice(0, 5);
          const parsed: GameResult[] = freshList.map((item: any) => {
            const issue = String(item.issueNumber || "");
            const displaySuffix = issue.slice(-6) || "000000";
            const num = item.number !== undefined ? Number(item.number) : 0;

            let col: "green" | "red" | "violet" = "green";
            if (item.color) {
              const colorsList = String(item.color).split(",");
              if (colorsList.includes("red")) col = "red";
              else if (colorsList.includes("green")) col = "green";
              else if (colorsList.includes("violet")) col = "violet";
            } else {
              if (num === 0 || num === 5) col = "violet";
              else if (num % 2 === 0) col = "red";
              else col = "green";
            }

            return {
              periodSuffix: displaySuffix,
              number: num,
              color: col,
            };
          });

          if (parsed.length > 0) {
            setHistory1m(parsed);
          }
        }
      }
    } catch (err) {
      console.log("1M fetch error:", err);
    }

    // Fetch 3M Feed
    try {
      const response = await fetch(
        `https://draw.ar-lottery01.com/WinGo/WinGo_3M/GetHistoryIssuePage.json?ts=${Date.now()}`
      );
      if (response.ok) {
        const json = await response.json();
        if (json.code === 0 && json.data && Array.isArray(json.data.list)) {
          const freshList = json.data.list.slice(0, 5);
          const parsed: GameResult[] = freshList.map((item: any) => {
            const issue = String(item.issueNumber || "");
            const displaySuffix = issue.slice(-6) || "000000";
            const num = item.number !== undefined ? Number(item.number) : 0;

            let col: "green" | "red" | "violet" = "green";
            if (item.color) {
              const colorsList = String(item.color).split(",");
              if (colorsList.includes("red")) col = "red";
              else if (colorsList.includes("green")) col = "green";
              else if (colorsList.includes("violet")) col = "violet";
            } else {
              if (num === 0 || num === 5) col = "violet";
              else if (num % 2 === 0) col = "red";
              else col = "green";
            }

            return {
              periodSuffix: displaySuffix,
              number: num,
              color: col,
            };
          });

          if (parsed.length > 0) {
            setHistory3m(parsed);
          }
        }
      }
    } catch (err) {
      console.log("3M fetch error:", err);
    }

    // Fetch 5M Feed
    try {
      const response = await fetch(
        `https://draw.ar-lottery01.com/WinGo/WinGo_5M/GetHistoryIssuePage.json?ts=${Date.now()}`
      );
      if (response.ok) {
        const json = await response.json();
        if (json.code === 0 && json.data && Array.isArray(json.data.list)) {
          const freshList = json.data.list.slice(0, 5);
          const parsed: GameResult[] = freshList.map((item: any) => {
            const issue = String(item.issueNumber || "");
            const displaySuffix = issue.slice(-6) || "000000";
            const num = item.number !== undefined ? Number(item.number) : 0;

            let col: "green" | "red" | "violet" = "green";
            if (item.color) {
              const colorsList = String(item.color).split(",");
              if (colorsList.includes("red")) col = "red";
              else if (colorsList.includes("green")) col = "green";
              else if (colorsList.includes("violet")) col = "violet";
            } else {
              if (num === 0 || num === 5) col = "violet";
              else if (num % 2 === 0) col = "red";
              else col = "green";
            }

            return {
              periodSuffix: displaySuffix,
              number: num,
              color: col,
            };
          });

          if (parsed.length > 0) {
            setHistory5m(parsed);
          }
        }
      }
    } catch (err) {
      console.log("5M fetch error:", err);
    }

    const now = new Date();
    setLastSyncTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    setTimeout(() => setIsSyncing(false), 500);
  };

  useEffect(() => {
    fetchLiveHistory();
    const apiInterval = setInterval(fetchLiveHistory, 4000);
    return () => clearInterval(apiInterval);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const periodFor30s = getPeriodFor30s();
  const periodFor1m = getPeriodFor1m();
  const periodFor3s = getPeriodFor3m();
  const periodFor5s = getPeriodFor5m();

  return (
    <div id="app-container" className={`min-h-screen bg-slate-50/70 selection:bg-red-100 selection:text-red-600 font-sans antialiased flex flex-col justify-start relative overflow-x-hidden ${currentPage === 'wingo' ? '' : 'pb-16'}`}>
      
      {/* Visual Accent Ambient Lighting Backgrounds */}
      <div id="bg-spotlight" className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-red-100/30 via-rose-50/10 to-transparent -z-10 pointer-events-none" />
      <div id="bg-grid-mesh" className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#ef4444_1.5px,transparent_1.5px)] [background-size:24px_24px] -z-20"></div>

      {/* 
        ======================== FLOATING PRESTIGE GLASS HEADER ========================
      */}
      <div className={`fixed top-0 left-0 right-0 z-50 px-4 py-3 md:px-8 max-w-4xl mx-auto w-full ${currentPage === 'wingo' ? 'hidden' : ''}`}>
        <motion.header
          id="top-header"
          initial={{ y: -35, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="w-full h-16 bg-white/95 backdrop-blur-xl border border-red-100/85 rounded-2xl md:rounded-3xl px-4 md:px-8 flex items-center justify-between gap-4 shadow-[0_12px_45px_rgba(239,68,68,0.14)] relative"
        >
          <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-red-400 to-transparent opacity-80 animate-pulse"></div>
          
          <div id="left-header-section" className="flex items-center gap-3 shrink-0">
            <motion.div
              id="server-shield-badge"
              whileHover={{ scale: 1.08, y: -1 }}
              whileTap={{ scale: 0.94 }}
              className="p-2.5 md:p-3 bg-white border border-slate-100/95 rounded-xl md:rounded-2xl text-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_25px_rgba(239,68,68,0.12)] hover:border-red-300/60 cursor-pointer relative overflow-hidden group flex items-center justify-center transition-all duration-300"
            >
              <div className="absolute inset-0 bg-red-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Crown id="sureshot-crown-icon" className="w-5 h-5 md:w-5.5 md:h-5.5 text-red-500 fill-red-500/10 stroke-[2.2] relative z-10" />
            </motion.div>
            
            <div className="hidden xs:flex flex-col">
              <div className="flex items-center gap-1.5 bg-red-50/80 border border-red-100/60 px-2.5 py-1 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-black text-red-600/90 tracking-widest font-mono select-none">NODE_S1.LIVE</span>
              </div>
            </div>
          </div>

          <div id="middle-header-section" className="flex-1 flex justify-center text-center overflow-hidden px-4">
            <h1
              id="header-title"
              className="font-display text-base sm:text-xl md:text-2xl lg:text-3xl font-black tracking-tight select-none uppercase whitespace-nowrap flex items-center gap-1 sm:gap-1.5 md:gap-2 leading-none"
            >
              <span className="bg-gradient-to-r from-red-500 via-red-600 to-rose-500 bg-clip-text text-transparent font-extrabold pr-0.5 drop-shadow-[0_1.5px_3px_rgba(239,68,68,0.12)]">Sureshot</span>
              <span className="text-slate-800 font-bold">Server</span>
              <span className="hidden md:inline-flex text-[9px] font-black tracking-widest bg-red-50 border border-red-200 text-red-500 px-1.5 py-0.5 rounded-md align-middle leading-none">30S_GRID</span>
            </h1>
          </div>

          <div id="right-header-section" className="flex items-center gap-2.5 md:gap-3 shrink-0">
            <div className="hidden md:flex items-center gap-1.5 bg-slate-50 border border-slate-100/80 px-3 py-1 rounded-xl shadow-xs">
              <Activity className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span className="text-[9px] font-mono font-bold text-slate-500">DELAY: 14ms</span>
            </div>

            <motion.button
              id="menu-bar-button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.90, rotate: 90 }}
              transition={{ type: "spring", stiffness: 450, damping: 15 }}
              onClick={() => setIsMenuOpen(true)}
              className="p-2.5 text-red-500 bg-red-50/60 hover:bg-red-100/95 hover:text-red-600 rounded-xl md:rounded-2xl border border-red-100/45 transition-all duration-300 cursor-pointer shadow-xs"
              aria-label="Open Menu"
            >
              <Menu id="menu-icon" className="w-4.5 h-4.5 md:w-5 md:h-5 stroke-[2.5]" />
            </motion.button>
          </div>
        </motion.header>
      </div>

      {/* Top action trigger dropdown removed for standard design scope */}

      {/* Right Side Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60] pointer-events-auto"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%", borderTopLeftRadius: 100, borderBottomLeftRadius: 100 }}
              animate={{ x: 0, borderTopLeftRadius: 24, borderBottomLeftRadius: 24 }}
              exit={{ x: "100%", borderTopLeftRadius: 100, borderBottomLeftRadius: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white/95 backdrop-blur-xl z-[70] shadow-[auto_-20px_50px_rgba(239,68,68,0.15)] flex flex-col pointer-events-auto border-l border-red-100/70"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center border border-red-100/50">
                    <Trophy className="w-4.5 h-4.5 text-red-500" />
                  </div>
                  <h3 className="font-display font-black text-slate-800 tracking-tight text-lg">Control Center</h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-colors border border-slate-200"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3">
                {[
                  { icon: Activity, label: "Wingo Server", desc: "Real-time stream" },
                  { icon: ShieldCheck, label: "Mines Predictor", desc: "With best Server" },
                  { icon: Crown, label: "Server Connection", desc: "Users Usage" },
                  { icon: Disc, label: "Settings", desc: "Preferences" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="group flex flex-col bg-white border border-slate-100 shadow-xs hover:border-red-200/60 p-4 rounded-2xl cursor-pointer transition-all duration-300"
                    onClick={() => {
                        if (item.label === "Wingo Server") {
                            setCurrentPage("wingo");
                        }
                        setIsMenuOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 group-hover:text-red-500 transition-colors">
                         <item.icon className="w-5 h-5" />
                       </div>
                       <div className="flex-1">
                         <h4 className="font-bold text-slate-700 text-sm group-hover:text-slate-900 transition-colors">{item.label}</h4>
                         <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5">{item.desc}</p>
                       </div>
                       <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-red-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Drawer Footer */}
              <div className="p-6 bg-slate-50/50 border-t border-slate-100 mt-auto">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    // Add Telegram link logic here if needed, for example:
                    // window.open('https://t.me/yourchannel', '_blank');
                  }}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 outline-none text-white rounded-xl text-sm font-bold transition-transform active:scale-95 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Join Telegram Channel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Layout Area */}
      <main id="app-main-content" className={`flex-1 w-full flex flex-col ${currentPage === 'wingo' ? '' : 'items-center justify-center pt-20 px-4 max-w-4xl mx-auto'}`}>
        
        {currentPage === 'home' ? (
          <>
            {/* 
              RESTORED OLD DESIGN: STRICT 2-COLUMN SYMMETRICAL COMPACT GRID on ALL screen sizes! 
              This forces "1/2 3/4" with beautiful small visual footprint layout!
            */}
            <div id="wingo-modes-grid" className="grid grid-cols-2 gap-2.5 sm:gap-4 md:gap-5 w-full">
              {WINGO_BOXES.filter(box => currentPage === 'home' || box.id === activeId).map((box, idx) => {
                const currentSeconds = secondsLeft[box.id] || box.duration;
                const progressRatio = currentSeconds / box.duration;
                const isActive = activeId === box.id;

                // All Wingo boxes support periods, timer, and last 5 results beautifully.
                const isCustomBox = true;

                return (
                  <motion.div
                    key={box.id}
                    id={`wingo-box-${box.id}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: idx * 0.05, ease: "easeOut" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveId(box.id)}
                    className={`group relative bg-white rounded-2xl md:rounded-3xl p-3 sm:p-5 flex flex-col justify-between overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.01)] border-[1.5px] transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "border-red-500 shadow-[0_10px_25px_rgba(239,68,68,0.12)] scale-[1.01]"
                        : "border-slate-100/80 hover:border-red-200 hover:shadow-[0_8px_20px_rgba(239,68,68,0.04)]"
                    }`}
                  >
                    {/* Side Color Laser Bar */}
                    <div className={`absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b ${box.colorAccent} transition-opacity`}></div>

                    {/* Main Content Body */}
                    <div className="flex flex-col h-full justify-between gap-3 sm:gap-4">
                      
                      {/* Top Header: Title & Icon */}
                      <div className="flex items-center justify-between gap-1 pl-1">
                        <div className="overflow-hidden">
                          <h2 className={`font-display text-[11px] xs:text-xs sm:text-base font-black tracking-tight leading-none transition-colors duration-200 ${
                            isActive ? "text-red-600" : "text-slate-800 group-hover:text-red-500"
                          }`}>
                            {box.name}
                          </h2>
                        </div>

                        {/* Clock Icon container badge - Compact Size */}
                        <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center border transition-all duration-300 shrink-0 ${
                          isActive 
                            ? "bg-red-500 text-white border-red-400 shadow-xs" 
                            : "bg-red-50/50 text-red-500 border-red-100/40 group-hover:bg-red-100 group-hover:text-red-600"
                        }`}>
                          <Timer className={`w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 stroke-[2.2]`} />
                        </div>
                      </div>

                      {/* 
                         =================== WINGO ALL SPECIFIC PARTS ===================
                         Wingo modes support full period, timer and last 5 results.
                         Compactized beautifully to fit the old grid sizes perfectly!
                      */}
                      <div className="flex flex-col gap-2.5 pl-1">
                        
                        {/* PERIOD Display */}
                        <div className="flex items-center justify-between bg-slate-50 border border-slate-100/60 p-1.5 rounded-lg">
                          <span className="text-[7.5px] font-extrabold text-slate-450 uppercase tracking-wider font-sans">PERIOD</span>
                          <span className="font-mono text-[9px] sm:text-[10px] font-black text-red-600 bg-white border border-red-100/40 px-1.5 py-0.5 rounded select-all leading-none">
                            {box.id === "30s" ? periodFor30s.short :
                             box.id === "1m" ? periodFor1m.short :
                             box.id === "3m" ? periodFor3s.short :
                             periodFor5s.short}
                          </span>
                        </div>

                        {/* TIMER Display */}
                        <div className="flex items-center justify-between gap-1 bg-red-50/20 border border-red-100/10 p-1.5 rounded-lg">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-red-500 animate-pulse" />
                            <span className="text-[7.5px] font-extrabold text-slate-450 uppercase">TIMER</span>
                          </div>
                          <span className="font-mono text-[9.5px] sm:text-xs font-black text-slate-800 bg-white border border-slate-100 px-1.5 py-0.5 rounded leading-none">
                            {formatTime(currentSeconds)}
                          </span>
                        </div>

                        {/* Direct 5 game result outcome view without headers to maximize vertical compactness */}
                        <div className="grid grid-cols-5 gap-1 bg-slate-50/60 p-1 rounded-xl border border-slate-100/40">
                          {(box.id === "30s" ? history :
                            box.id === "1m" ? history1m :
                            box.id === "3m" ? history3m :
                            history5m).length > 0 ? (
                            (box.id === "30s" ? history :
                             box.id === "1m" ? history1m :
                             box.id === "3m" ? history3m :
                             history5m).map((result, rIdx) => {
                              const isGreen = result.color === "green";
                              const isViolet = result.color === "violet";
                              
                              let bgBall = "bg-gradient-to-br from-rose-500 to-red-600 shadow-xs";
                              if (isGreen) {
                                bgBall = "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xs";
                              } else if (isViolet) {
                                bgBall = "bg-gradient-to-br from-purple-500 to-indigo-600 shadow-xs";
                              }

                              return (
                                <div key={rIdx} className="flex items-center justify-center">
                                  <div className={`w-5.5 h-5.5 xs:w-6 xs:h-6 rounded-full flex items-center justify-center text-[9px] xs:text-[10px] font-black text-white ${bgBall} transition-transform`}>
                                    {result.number}
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="col-span-5 py-1 text-center text-[7px] font-semibold text-slate-400">
                              SYNCING...
                            </div>
                          )}
                        </div>

                      </div>

                    </div>

                    {/* Micro Bottom Progress Strip */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-slate-50">
                      <div 
                        className={`h-full bg-gradient-to-r ${box.colorAccent} transition-all duration-350`} 
                        style={{ width: `${progressRatio * 100}%` }}
                      ></div>
                    </div>

                  </motion.div>
                );
              })}
            </div>
          </>
        ) : (
          <iframe 
            src="https://lively-pie-9755ed.netlify.app/" 
            className="w-full h-screen border-none"
            title="Wingo Page"
            referrerPolicy="no-referrer"
          />
        )}
      </main>
    </div>
  );
}
