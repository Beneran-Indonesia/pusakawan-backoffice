import QuestionsForm from "./questions-form";
import {
  GameDetails,
  GameDetailsSchema,
} from "@/types/app/app-game-details-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslate } from "@refinedev/core";
import { useForm } from "react-hook-form";
import { useState } from "react";

type TabKey = "details" | "questions" | "leaderboard";

export default function AppGamesForm() {
  // 1. URL /app/games/create = new
  // URL /app/games/edit/:id

  // if pathname includes "edit", get the id.

  // once we got the ID, useOne to get all of the form values.

  // form:
  const {
    control,
    // handleSubmit, errors, isSubmitting: not wired up yet — this file is
    // still a WIP stub for the Game Details / submit flow (Yuri's part is
    // the Questions tab only, wired in below).
  } = useForm<GameDetails>({
    resolver: zodResolver(GameDetailsSchema),
    defaultValues: {
      questions: [],
    },
    // defaultValues,
  });

  const t = useTranslate();

  // Yuri: TEMPORARY tab wiring so the Questions tab can be tested in
  // isolation while the Game Details / Leaderboard tabs are still WIP.
  // Remove/replace this block once those tabs are implemented for real.
  const [activeTab, setActiveTab] = useState<TabKey>("questions");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "details", label: "Game Details" },
    { key: "questions", label: "Questions" },
    { key: "leaderboard", label: "Leaderboard" },
  ];

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex bg-white rounded-xl border border-slate-200 overflow-hidden">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-3 font-semibold text-sm transition-colors cursor-pointer ${
              activeTab === tab.key
                ? "bg-red-700 text-white"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "details" && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-slate-500">
          {t("under_development")}
        </div>
      )}

      {activeTab === "questions" && <QuestionsForm control={control} />}

      {activeTab === "leaderboard" && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-slate-500">
          {t("under_development")}
        </div>
      )}
    </div>
  );
}
