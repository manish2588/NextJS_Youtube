"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { IoIosMic } from "react-icons/io";
import { useDispatch } from "react-redux";
import { setQuery as setQueryRedux } from "../redux/slices/querySlice";
import { useRouter } from "next/navigation";
import { RxCross1 } from "react-icons/rx";
import { motion, AnimatePresence } from "framer-motion";
import { FaMicrophoneSlash } from "react-icons/fa";
import { closeSidebar } from "../redux/slices/layoutSlice";
// TypeScript interfaces for Speech Recognition
interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export default function Search() {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState<string>(""); // 👈 live transcript
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const inputRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  // Navigate to search page - memoized with useCallback
  const triggerSearch = useCallback(
    (q: string) => {
      if (!q.trim()) return;
      dispatch(setQueryRedux(q));
      setShowSuggestions(false);
      router.push("/search");
      setTimeout(() => dispatch(closeSidebar()), 300);
    },
    [dispatch, router]
  );

  // Setup SpeechRecognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true; // 👈 show live words
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          let interimTranscript = "";
          let finalTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          if (interimTranscript) {
            setLiveTranscript(interimTranscript); // show live
          }

          if (finalTranscript) {
            setQuery(finalTranscript);
            triggerSearch(finalTranscript);
            setIsListening(false);
            setLiveTranscript(""); // reset after final
          }
        };

        recognitionRef.current.onerror = () => {
          setIsListening(false);
          setLiveTranscript("");
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          setLiveTranscript("");
        };
      }
    }
  }, [triggerSearch]); // Now triggerSearch is included in dependencies

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
      setLiveTranscript("Listening..."); // default placeholder
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current.abort();
    }
    setIsListening(false);
    setLiveTranscript("");
  };

  // Fetch suggestions with debounce
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await fetch(`/api/suggest?q=${encodeURIComponent(query)}`);
        const data: [string, string[]] = await res.json();
        setSuggestions(data[1]);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions", error);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 200);
    return () => clearTimeout(debounce);
  }, [query]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionClick = (s: string) => {
    setQuery(s);
    triggerSearch(s);
  };

  const handleSearchClick = () => {
    triggerSearch(query);
  };

  return (
    <div
      className="flex-1 flex items-center ml-3 max-w-xl relative"
      ref={inputRef}
    >
      <div className="flex w-full relative">
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 3 && setShowSuggestions(true)}
          className="flex-1 w-1/2 h-10 px-3 pr-10 border border-gray-300 rounded-l-full focus:outline-none focus:ring-0 focus:ring-blue-500 text-sm"
        />

        {/* Clear (X) button */}
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <RxCross1 className="text-xl" />
          </button>
        )}

        {/* Search button */}
        <button
          onClick={handleSearchClick}
          className="h-10 px-4 bg-gray-100 border border-l-0 rounded-r-full border-gray-300 hover:bg-gray-200 transition-colors flex items-center justify-center"
        >
          <IoSearchOutline className="text-gray-600 text-lg" />
        </button>

        {/* Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-10 left-0 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 overflow-hidden">
            {suggestions.map((s, i) => (
              <div
                key={i}
                onClick={() => handleSuggestionClick(s)}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer transition-colors text-sm"
              >
                {s}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mic Button */}
      <button
        onClick={startListening}
        className="ml-2 md:ml-3 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
      >
        <IoIosMic className="text-gray-700 text-2xl" />
      </button>

     <AnimatePresence>
  {isListening && (
    <>
      {/* Overlay */}
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        onClick={stopListening} // Clicking outside closes the dialog
        className="fixed inset-0 bg-black z-40"
      />

      {/* Dialog below navbar */}
      <motion.div
        key="mic-dialog"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed w-72 lg:w-[500px] h-72 top-20 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center justify-between space-y-4 border z-50"
      >
        {/* Live transcript */}
        <div className="flex items-center space-x-2">
          <p className="text-2xl font-medium text-gray-900">
            {liveTranscript || "Listening..."}
          </p>
        </div>

        {/* Stop button */}
        <button
          onClick={stopListening}
          className="flex items-center justify-center h-14 w-14 bg-red-500 text-white rounded-full hover:bg-red-600"
        >
          <FaMicrophoneSlash className="w-6 h-6" />
        </button>
      </motion.div>
    </>
  )}
</AnimatePresence>

    </div>
  );
}
