// Yuri

import { GameDetails } from "@/types/app/app-game-details-type";
import { Question } from "@/types/app/app-questions-type";
import { useTranslate } from "@refinedev/core";
import {
  Check,
  ClipboardList,
  Lightbulb,
  PenSquare,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useState } from "react";
import { Control, Controller, useFieldArray, useWatch } from "react-hook-form";

type QuestionType = "multiple_choice" | "essay";

type Translate = ReturnType<typeof useTranslate>;

// Options/correct_answer/correct_answers/hints/validation fields only exist on
// one side of the Question discriminated union, so react-hook-form's `Path<T>`
// can't resolve them cleanly for a `questions.${index}.*` template string.
// We cast those specific field names to `any` rather than fighting the union
// typing — `question`, `pusaka_points`, and `is_essay_question` are shared by
// both variants so they stay fully typed.
type QuestionsFormProps = {
  control: Control<GameDetails>;
};

function createEmptyQuestion(type: QuestionType): Question {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `question-${Date.now()}`;

  if (type === "multiple_choice") {
    return {
      id,
      question: "",
      pusaka_points: 10,
      is_essay_question: false,
      options: { a: "", b: "", c: "", d: "" },
      correct_answer: "a",
    };
  }

  return {
    id,
    question: "",
    pusaka_points: 10,
    is_essay_question: true,
    // Yuri: 3 fixed slots for the UI; empty entries should be filtered out
    // (or validated) before this is actually submitted to the backend.
    correct_answers: ["", "", ""],
    hints: ["", "", ""],
    correct_validation: "",
    incorrect_validation: "",
  };
}

export default function QuestionsForm({ control }: QuestionsFormProps) {
  const t = useTranslate();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
    keyName: "fieldId",
  });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddQuestion = (type: QuestionType) => {
    const newIndex = fields.length;
    append(createEmptyQuestion(type));
    setEditingIndex(newIndex);
  };

  const handleDelete = (index: number) => {
    remove(index);
    setEditingIndex((current) => (current === index ? null : current));
  };

  return (
    <div className="space-y-6">
      {/* Add New Question */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800">
          {t("app.games.questions.add_new.title")}
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          {t("app.games.questions.add_new.subtitle")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleAddQuestion("multiple_choice")}
            className="flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-red-300 hover:bg-red-50/30 transition-colors text-left cursor-pointer"
          >
            <span className="shrink-0 w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </span>
            <span>
              <span className="block font-semibold text-slate-800">
                {t("app.games.questions.add_new.multiple_choice.title")}
              </span>
              <span className="block text-sm text-slate-500">
                {t("app.games.questions.add_new.multiple_choice.description")}
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleAddQuestion("essay")}
            className="flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-red-300 hover:bg-red-50/30 transition-colors text-left cursor-pointer"
          >
            <span className="shrink-0 w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
              <PenSquare className="w-5 h-5" />
            </span>
            <span>
              <span className="block font-semibold text-slate-800">
                {t("app.games.questions.add_new.essay.title")}
              </span>
              <span className="block text-sm text-slate-500">
                {t("app.games.questions.add_new.essay.description")}
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4">
          {t("app.games.questions.list_title")} ({fields.length})
        </h3>

        {fields.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 py-12 text-center text-slate-500">
            {t("app.games.questions.empty_state")}
          </div>
        ) : (
          <div className="space-y-4">
            {fields.map((field, index) =>
              editingIndex === index ? (
                <QuestionEditForm
                  key={field.fieldId}
                  control={control}
                  index={index}
                  t={t}
                  onDone={() => setEditingIndex(null)}
                  onDelete={() => handleDelete(index)}
                />
              ) : (
                <QuestionCard
                  key={field.fieldId}
                  question={field}
                  index={index}
                  t={t}
                  onEdit={() => setEditingIndex(index)}
                  onDelete={() => handleDelete(index)}
                />
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}

type QuestionCardProps = {
  question: Question;
  index: number;
  t: Translate;
  onEdit: () => void;
  onDelete: () => void;
};

function QuestionCard({
  question,
  index,
  t,
  onEdit,
  onDelete,
}: QuestionCardProps) {
  const isEssay = question.is_essay_question;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h4 className="font-semibold text-slate-800">
            {t("app.games.questions.question_label", { number: index + 1 })}
          </h4>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isEssay
                ? "bg-purple-100 text-purple-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {isEssay
              ? t("app.games.questions.add_new.essay.title")
              : t("app.games.questions.add_new.multiple_choice.title")}
          </span>
        </div>
        <p className="text-sm text-slate-500 truncate">
          {question.question || t("app.games.questions.no_question_text")}
        </p>
        <p className="text-xs text-slate-400 mt-2">
          {t("app.games.questions.points_label", {
            points: question.pusaka_points,
          })}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onEdit}
          className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors text-sm font-medium cursor-pointer"
        >
          {t("app.games.questions.edit")}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="p-2 border border-red-200 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
          aria-label={t("app.games.questions.delete")}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

type QuestionEditFormProps = {
  control: Control<GameDetails>;
  index: number;
  t: Translate;
  onDone: () => void;
  onDelete: () => void;
};

function QuestionEditForm({
  control,
  index,
  t,
  onDone,
  onDelete,
}: QuestionEditFormProps) {
  const isEssay: boolean = useWatch({
    control,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    name: `questions.${index}.is_essay_question` as any,
  });

  const [mediaFileName, setMediaFileName] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-xl border-2 border-red-200 p-5 shadow-sm space-y-5">
      {/* Add Media */}
      <div>
        <label className="block text-sm font-semibold text-slate-800 mb-2">
          {t("app.games.questions.media.title")}
        </label>
        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-xl py-6 cursor-pointer hover:border-red-300 hover:bg-red-50/20 transition-colors text-slate-500 text-sm text-center px-4">
          <Upload className="w-5 h-5" />
          <span className="truncate max-w-full">
            {mediaFileName ?? t("app.games.questions.media.upload_hint")}
          </span>
          <input
            type="file"
            accept="image/jpeg,image/png,video/mp4,audio/mpeg"
            className="hidden"
            onChange={(e) =>
              setMediaFileName(e.target.files?.[0]?.name ?? null)
            }
          />
        </label>
      </div>

      {/* Question */}
      <div>
        <label className="block text-sm font-semibold text-slate-800 mb-2">
          {t("app.games.questions.question_field.label")}
        </label>
        <Controller
          control={control}
          name={`questions.${index}.question`}
          render={({ field }) => (
            <>
              <textarea
                {...field}
                maxLength={300}
                rows={3}
                placeholder={t(
                  "app.games.questions.question_field.placeholder",
                )}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none"
              />
              <p className="text-xs text-slate-400 text-right mt-1">
                {field.value?.length ?? 0}/300{" "}
                {t("app.games.questions.characters_suffix")}
              </p>
            </>
          )}
        />
      </div>

      {isEssay ? (
        <EssayFields control={control} index={index} t={t} />
      ) : (
        <MultipleChoiceFields control={control} index={index} t={t} />
      )}

      {/* Pusaka Point */}
      <div>
        <label className="block text-sm font-semibold text-slate-800 mb-2">
          {t("app.games.questions.pusaka_point")}
        </label>
        <Controller
          control={control}
          name={`questions.${index}.pusaka_points`}
          render={({ field }) => (
            <input
              type="number"
              min={0}
              value={field.value ?? 0}
              onChange={(e) => field.onChange(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
            />
          )}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={onDone}
          className="flex-1 bg-green-600 text-white rounded-lg py-2.5 font-semibold hover:bg-green-700 transition-colors cursor-pointer"
        >
          {t("app.games.questions.done_editing")}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="p-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
          aria-label={t("app.games.questions.delete")}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

type QuestionTypeFieldsProps = {
  control: Control<GameDetails>;
  index: number;
  t: Translate;
};

function MultipleChoiceFields({ control, index, t }: QuestionTypeFieldsProps) {
  const letters: Array<"a" | "b" | "c" | "d"> = ["a", "b", "c", "d"];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-800 mb-2">
          {t("app.games.questions.options.label")}
        </label>
        <div className="space-y-3">
          {letters.map((letter) => (
            <div key={letter} className="flex items-start gap-2">
              <span className="mt-2 text-sm font-semibold text-slate-600 uppercase">
                {letter}.
              </span>
              <div className="flex-1">
                <Controller
                  control={control}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  name={`questions.${index}.options.${letter}` as any}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        value={field.value ?? ""}
                        maxLength={100}
                        placeholder={t(
                          "app.games.questions.options.placeholder",
                          { letter: letter.toUpperCase() },
                        )}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                      />
                      <p className="text-xs text-slate-400 text-right mt-1">
                        {field.value?.length ?? 0}/100{" "}
                        {t("app.games.questions.characters_suffix")}
                      </p>
                    </>
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-800 mb-2">
          {t("app.games.questions.correct_answer")}
        </label>
        <Controller
          control={control}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          name={`questions.${index}.correct_answer` as any}
          render={({ field }) => (
            <select
              {...field}
              value={field.value ?? "a"}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
            >
              {letters.map((letter) => (
                <option key={letter} value={letter}>
                  {letter.toUpperCase()}
                </option>
              ))}
            </select>
          )}
        />
      </div>
    </div>
  );
}

function EssayFields({ control, index, t }: QuestionTypeFieldsProps) {
  const slots = [0, 1, 2] as const;

  return (
    <div className="space-y-5">
      {/* Correct Answers */}
      <div>
        <label className="block text-sm font-semibold text-slate-800 mb-2">
          {t("app.games.questions.correct_answers.label")}
        </label>
        <div className="space-y-3">
          {slots.map((slot) => (
            <Controller
              key={slot}
              control={control}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              name={`questions.${index}.correct_answers.${slot}` as any}
              render={({ field }) => (
                <div>
                  <input
                    {...field}
                    value={field.value ?? ""}
                    maxLength={300}
                    placeholder={t(
                      "app.games.questions.correct_answers.placeholder",
                      { number: slot + 1 },
                    )}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  />
                  <p className="text-xs text-slate-400 text-right mt-1">
                    {field.value?.length ?? 0}/300{" "}
                    {t("app.games.questions.characters_suffix")}
                  </p>
                </div>
              )}
            />
          ))}
        </div>
      </div>

      {/* Hints */}
      <div>
        <label className="flex items-center gap-1.5 text-sm font-semibold text-amber-600 mb-1">
          <Lightbulb className="w-4 h-4" />
          {t("app.games.questions.hints.label")}
        </label>
        <p className="text-xs text-slate-500 mb-2">
          {t("app.games.questions.hints.subtitle")}
        </p>
        <div className="space-y-3">
          {slots.map((slot) => (
            <Controller
              key={slot}
              control={control}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              name={`questions.${index}.hints.${slot}` as any}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <span className="shrink-0 w-8 h-8 rounded-lg bg-amber-100 text-amber-500 flex items-center justify-center">
                    <Lightbulb className="w-4 h-4" />
                  </span>
                  <input
                    {...field}
                    value={field.value ?? ""}
                    maxLength={100}
                    placeholder={t("app.games.questions.hints.placeholder", {
                      number: slot + 1,
                    })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  />
                </div>
              )}
            />
          ))}
        </div>
      </div>

      {/* Validation messages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-1.5 text-sm font-semibold text-green-600 mb-2">
            <Check className="w-4 h-4" />
            {t("app.games.questions.validation.correct_label")}
          </label>
          <Controller
            control={control}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            name={`questions.${index}.correct_validation` as any}
            render={({ field }) => (
              <>
                <textarea
                  {...field}
                  value={field.value ?? ""}
                  maxLength={500}
                  rows={3}
                  placeholder={t(
                    "app.games.questions.validation.correct_placeholder",
                  )}
                  className="w-full px-3 py-2 bg-slate-50 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all resize-none"
                />
                <p className="text-xs text-slate-400 text-right mt-1">
                  {field.value?.length ?? 0}/500{" "}
                  {t("app.games.questions.characters_suffix")}
                </p>
              </>
            )}
          />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-sm font-semibold text-red-600 mb-2">
            <X className="w-4 h-4" />
            {t("app.games.questions.validation.incorrect_label")}
          </label>
          <Controller
            control={control}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            name={`questions.${index}.incorrect_validation` as any}
            render={({ field }) => (
              <>
                <textarea
                  {...field}
                  value={field.value ?? ""}
                  maxLength={500}
                  rows={3}
                  placeholder={t(
                    "app.games.questions.validation.incorrect_placeholder",
                  )}
                  className="w-full px-3 py-2 bg-slate-50 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none"
                />
                <p className="text-xs text-slate-400 text-right mt-1">
                  {field.value?.length ?? 0}/500{" "}
                  {t("app.games.questions.characters_suffix")}
                </p>
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
}
