// src/pages/learning/Quiz.jsx
import React, { useEffect, useMemo, useState } from "react";
import decodeHtml from "../../utils/decodeHtml";
import { useNavigate } from "react-router-dom";

/**
 * Quiz page that fetches questions from OpenTDB (Computers category)
 * - Fetches N questions (default 10)
 * - Presents one question at a time with shuffled options
 * - Per-question timer (configurable)
 * - Shows progress, score summary, and detailed review at the end
 *
 * API used: https://opentdb.com/api.php
 * Category 18 = Science: Computers. (OpenTDB: free & no API key). :contentReference[oaicite:1]{index=1}
 */

const API_URL =
  "https://opentdb.com/api.php?amount=10&category=18&type=multiple";

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Quiz() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // quiz state
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]); // { questionIndex, selected, correct }
  const [score, setScore] = useState(0);

  // timer config
  const QUESTION_TIME = 30; // seconds per question
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const timerRef = React.useRef(null);

  // fetch questions
  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Network response not ok");
      const data = await res.json();
      if (data.response_code !== 0) throw new Error("API returned no data");
      // normalize questions
      const normalized = data.results.map((q) => {
        const question = decodeHtml(q.question);
        const correct_answer = decodeHtml(q.correct_answer);
        const incorrect_answers = q.incorrect_answers.map((a) => decodeHtml(a));
        const options = shuffle([correct_answer, ...incorrect_answers]);
        return {
          raw: q,
          question,
          options,
          correct_answer,
          difficulty: q.difficulty,
          type: q.type,
        };
      });
      setQuestions(normalized);
      setIndex(0);
      setSelected(null);
      setAnswers([]);
      setScore(0);
      setTimeLeft(QUESTION_TIME);
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    // cleanup timer on unmount
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Start/resume timer whenever index changes or questions loaded
  useEffect(() => {
    clearInterval(timerRef.current);
    setTimeLeft(QUESTION_TIME);
    if (!questions) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          // auto submit as 'no answer' and move on
          clearInterval(timerRef.current);
          handleSubmit(null, true);
          return QUESTION_TIME;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, questions]);

  if (loading || !questions) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Quiz — Computer Science</h2>
        <p className="text-sm text-gray-400">Loading questions…</p>
        {loading && (
          <div className="mt-4 text-gray-300">
            Fetching from Open Trivia Database...
          </div>
        )}
        {error && <div className="text-sm text-red-400">{error}</div>}
      </div>
    );
  }

  // finished state
  if (index >= questions.length) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Quiz Results</h2>
        <p className="text-sm text-gray-400">
          You scored {score} / {questions.length}
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {answers.map((a, i) => {
            const q = questions[a.questionIndex];
            return (
              <div
                key={i}
                className="p-4 rounded-lg bg-[#071226] border border-gray-800"
              >
                <div className="text-sm text-gray-300 mb-2">{q.question}</div>
                <div className="text-xs text-gray-400 mb-2">
                  Correct: {q.correct_answer}
                </div>
                <div
                  className={`text-sm ${
                    a.selected === q.correct_answer
                      ? "text-green-300"
                      : "text-red-300"
                  }`}
                >
                  Your answer:{" "}
                  {a.selected ?? <em className="text-gray-400">No answer</em>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={() => {
              fetchQuestions();
            }}
            className="px-4 py-2 bg-blue-600 rounded-md text-white"
          >
            Retry
          </button>
          <button
            onClick={() => navigate("/dashboard/learning")}
            className="px-4 py-2 rounded-md border border-gray-700 text-gray-200"
          >
            Back to Learning
          </button>
        </div>
      </div>
    );
  }

  const q = questions[index];

  function handleSelect(option) {
    setSelected(option);
  }

  function handleSubmit(option = selected, timedOut = false) {
    // evaluate
    const isCorrect = option === q.correct_answer;
    if (isCorrect) setScore((s) => s + 1);

    setAnswers((prev) => [
      ...prev,
      {
        questionIndex: index,
        selected: option,
        correct: q.correct_answer,
        timedOut,
      },
    ]);
    setSelected(null);
    clearInterval(timerRef.current);
    // small delay before advancing for UX
    setTimeout(() => {
      setIndex((i) => i + 1);
    }, 350);
  }

  const progressPct = Math.round((index / questions.length) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Quiz — Computer Science</h2>
          <p className="text-sm text-gray-400">
            Question {index + 1} of {questions.length} • Difficulty:{" "}
            {q.difficulty}
          </p>
        </div>

        <div className="text-sm text-gray-400">
          Time left:{" "}
          <span className="font-semibold text-white">{timeLeft}s</span>
        </div>
      </div>

      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="bg-[#071226] p-6 rounded-xl border border-gray-800">
        <div className="text-lg font-medium text-gray-100 mb-4">
          {q.question}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {q.options.map((opt, i) => {
            const isSelected = selected === opt;
            return (
              <button
                key={i}
                onClick={() => handleSelect(opt)}
                className={`text-left p-4 rounded-lg border ${
                  isSelected
                    ? "border-blue-500 bg-white/5"
                    : "border-gray-800 bg-transparent"
                } hover:border-blue-500 transition`}
              >
                <div className="text-sm text-gray-200">{opt}</div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => handleSubmit(selected)}
            disabled={selected === null}
            className={`px-4 py-2 rounded-md font-semibold ${
              selected
                ? "bg-blue-600 text-white"
                : "bg-white/5 text-gray-400 cursor-not-allowed"
            }`}
          >
            Submit Answer
          </button>

          <button
            onClick={() => {
              // skip question (record as no answer)
              handleSubmit(null, true);
            }}
            className="px-3 py-2 rounded-md border border-gray-700 text-gray-200"
          >
            Skip
          </button>

          <div className="ml-auto text-sm text-gray-400">
            Score: <span className="text-white font-semibold">{score}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
