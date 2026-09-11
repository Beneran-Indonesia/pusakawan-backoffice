// Yuri

import { Input } from "@/components/ui/input";
import { GameDetails } from "@/types/app/app-game-details-type";
import {
  EssayQuestion,
  MultipleChoiceQuestion,
  Question,
} from "@/types/app/app-questions-type";
import { TabsContent } from "@radix-ui/react-tabs";
import { useTranslate } from "@refinedev/core";
import {
  AlertTriangle,
  Check,
  ClipboardList,
  GripVertical,
  Lightbulb,
  PenSquare,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
  useFieldArray,
} from "react-hook-form";
import { DndProvider, useDrag, useDrop, XYCoord } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ErrorLabel from "@/components/ErrorLabel";

// Drag-and-drop item type used to reorder questions in the list. Only
// exists in this file, so a plain string constant is enough — no need to
// share it anywhere else.
const QUESTION_DND_TYPE = "question-card";

type QuestionDragItem = {
  index: number;
  id: string;
};

type QuestionType = "multiple_choice" | "essay";

type Translate = ReturnType<typeof useTranslate>;

// Options/correct_answer/correct_answers/hints fields only exist on one side
// of the Question discriminated union, so react-hook-form's `Path<T>` can't
// resolve them cleanly for a `questions.${index}.*` template string. We cast
// those specific field names to `any` rather than fighting the union typing
// — `question`, `pusaka_points`, `media`, `correct_validation`, and
// `incorrect_validation` are shared by both variants so they stay fully
// typed and don't need the cast.
type QuestionsFormProps = {
  control: Control<GameDetails>;
  register: UseFormRegister<GameDetails>;
  watch: UseFormWatch<GameDetails>;
  setValue: UseFormSetValue<GameDetails>;
  trigger: UseFormTrigger<GameDetails>;
  errors?: FieldErrors<GameDetails>["questions"];
};

function createEmptyQuestion(type: QuestionType): Question {
  const id = `question-${Date.now()}`;

  const baseQuestion = {
    id,
    question: "",
    pusaka_points: 1,
  };

  if (type === "multiple_choice") {
    return {
      ...baseQuestion,
      is_essay_question: false,
      options: { a: "", b: "", c: "", d: "" },
      correct_answer: "a",
    };
  }

  return {
    ...baseQuestion,
    is_essay_question: true,
    // correct answers and hints have minimum 1 and maximum 3
    correct_answers: ["", "", ""],
    hints: ["", "", ""],
    correct_validation: "",
    incorrect_validation: "",
  };
}

export default function QuestionsFormTab({
  control,
  register,
  errors,
  watch,
  setValue,
  trigger,
}: QuestionsFormProps) {
  const t = useTranslate();

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "questions",
    keyName: "fieldId",
  });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [questionBeforeEditing, setQuestionBeforeEditing] =
    useState<Question | null>(null);

  // Dragging is only enabled while no card is being edited — reordering
  // mid-edit would leave `editingIndex` pointing at the wrong row.
  const isReorderingDisabled = editingIndex !== null;

  const moveQuestion = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      move(dragIndex, hoverIndex);
    },
    [move],
  );

  const handleAddQuestion = (type: QuestionType) => {
    const newIndex = fields.length;
    append(createEmptyQuestion(type));
    setEditingIndex(newIndex);
    // Force a full-form re-validation right away. Without this, isValid
    // (which gates the Publish button in games-form.tsx) can lag a beat
    // behind an append/remove, letting Publish stay enabled for a moment
    // even though the newly added question is empty and invalid.
    // void trigger();
  };

  const handleDelete = (index: number) => {
    remove(index);
    setEditingIndex((current) => {
      if (current === null || current === index) return null;
      return current > index ? current - 1 : current;
    });
  };

  const handleCancelEdit = (index: number) => {
    if (questionBeforeEditing) {
      setValue(`questions.${index}`, questionBeforeEditing, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
    setQuestionBeforeEditing(null);
    setEditingIndex(null);
  };

  return (
    <TabsContent value="questions" className="mt-6 space-y-6">
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
            className="flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/30 transition-colors text-left cursor-pointer"
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
            className="flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-purple-300 hover:bg-purple-50/30 transition-colors text-left cursor-pointer"
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
          <DndProvider backend={HTML5Backend}>
            <div className="space-y-4">
              {fields.map((field, index) =>
                editingIndex === index ? (
                  <QuestionEditForm
                    key={field.fieldId}
                    register={register}
                    errors={
                      errors?.[index] as NonNullable<
                        FieldErrors<GameDetails>["questions"]
                      >[number]
                    }
                    watch={watch}
                    setValue={setValue}
                    trigger={trigger}
                    index={index}
                    t={t}
                    onDone={() => {
                      setQuestionBeforeEditing(null);
                      setEditingIndex(null);
                    }}
                    onCancel={() => handleCancelEdit(index)}
                    onDelete={() => handleDelete(index)}
                  />
                ) : (
                  <DraggableQuestionCard
                    key={field.fieldId}
                    id={field.fieldId}
                    question={field}
                    index={index}
                    t={t}
                    hasError={Boolean(errors?.[index])}
                    onEdit={() => setEditingIndex(index)}
                    onDelete={() => handleDelete(index)}
                    moveQuestion={moveQuestion}
                    isDragDisabled={isReorderingDisabled}
                  />
                ),
              )}
            </div>
          </DndProvider>
        )}
      </div>
    </TabsContent>
  );
}

type QuestionCardProps = {
  question: Question;
  index: number;
  t: Translate;
  hasError: boolean;
  onEdit: () => void;
  onDelete: () => void;
  dragHandleRef?: (node: HTMLButtonElement | null) => void;
  isDragDisabled?: boolean;
};

function QuestionCard({
  question,
  index,
  t,
  hasError,
  onEdit,
  onDelete,
  dragHandleRef,
  isDragDisabled,
}: QuestionCardProps) {
  const isEssay = question.is_essay_question;

  return (
    <div
      className={`bg-white rounded-xl border p-5 shadow-sm flex items-start justify-between gap-4 ${
        hasError ? "border-red-300" : "border-slate-200"
      }`}
    >
      <div className="flex items-start gap-3 min-w-0">
        {dragHandleRef && (
          <button
            type="button"
            ref={dragHandleRef}
            disabled={isDragDisabled}
            aria-label={
              isDragDisabled
                ? t("app.games.questions.drag_handle_disabled_label")
                : t("app.games.questions.drag_handle_label", {
                    number: index + 1,
                  })
            }
            title={
              isDragDisabled
                ? t("app.games.questions.drag_handle_disabled_label")
                : undefined
            }
            className={`shrink-0 mt-1 p-1 rounded-md text-slate-400 transition-colors ${
              isDragDisabled
                ? "cursor-not-allowed opacity-40"
                : "cursor-grab hover:bg-slate-100 hover:text-slate-600 active:cursor-grabbing"
            }`}
          >
            <GripVertical className="w-4 h-4" />
          </button>
        )}

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
          {hasError && (
            <p className="flex items-center gap-1.5 text-xs font-medium text-red-600 mt-2">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              {t("app.games.questions.has_errors_warning")}
            </p>
          )}
        </div>
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

type DraggableQuestionCardProps = Omit<QuestionCardProps, "dragHandleRef"> & {
  id: string;
  moveQuestion: (dragIndex: number, hoverIndex: number) => void;
  isDragDisabled: boolean;
};

// Wraps QuestionCard with react-dnd's drag source + drop target, following
// the "sortable list with a drag handle" pattern from the react-dnd docs
// (https://react-dnd.github.io/react-dnd/examples/sortable/simple). The
// outer div is the drop target (it measures hover position to decide when
// to swap), while only the grip handle inside QuestionCard is the drag
// source, so clicking Edit/Delete never accidentally starts a drag.
function DraggableQuestionCard({
  id,
  index,
  moveQuestion,
  isDragDisabled,
  ...questionCardProps
}: DraggableQuestionCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop<QuestionDragItem>({
    accept: QUESTION_DND_TYPE,
    hover(item, monitor) {
      if (!containerRef.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      // Only swap once the dragged card has crossed the midpoint of the
      // hovered card, so the list doesn't flicker back and forth.
      const hoverBoundingRect = containerRef.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveQuestion(dragIndex, hoverIndex);
      // Mutate the monitor item directly to avoid stale-index flicker
      // while the drag is still in progress (standard react-dnd pattern).
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: QUESTION_DND_TYPE,
    item: (): QuestionDragItem => ({ id, index }),
    canDrag: !isDragDisabled,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  drop(containerRef);

  return (
    <div
      ref={containerRef}
      className={isDragging ? "opacity-40" : undefined}
      data-question-index={index}
    >
      <QuestionCard
        index={index}
        isDragDisabled={isDragDisabled}
        dragHandleRef={drag}
        {...questionCardProps}
      />
    </div>
  );
}

type QuestionEditFormProps = Omit<QuestionsFormProps, "control" | "errors"> & {
  errors?: FieldErrors<Question>;
  index: number;
  t: Translate;
  onDone: () => void;
  onCancel: () => void;
  onDelete: () => void;
};

function QuestionEditForm({
  register,
  errors,
  watch,
  setValue,
  trigger,
  index,
  t,
  onDone,
  onCancel,
  onDelete,
}: QuestionEditFormProps) {
  const [attemptedDone, setAttemptedDone] = useState(false);

  // "Done Editing" force-validates every field of this question — including
  // ones the user never touched — rather than just closing the card. Fields
  // left blank (e.g. a never-clicked answer option) don't have an error yet
  // under mode: "onChange" because nothing has changed them; trigger() runs
  // the zod schema against them regardless, so every required-but-empty
  // field surfaces its error immediately instead of silently being accepted.
  const handleDone = async () => {
    setAttemptedDone(true);
    const isRowValid = await trigger(`questions.${index}`);
    if (isRowValid) {
      onDone();
    }
  };
  const isEssay: boolean = watch(`questions.${index}.is_essay_question`);
  const question = watch(`questions.${index}.question`) ?? "";
  const media = watch(`questions.${index}.media`) as
    | Question["media"]
    | undefined;

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const mediaType = file.type.startsWith("video/")
      ? "video"
      : file.type.startsWith("audio/")
      ? "audio"
      : "image";

    setValue(
      `questions.${index}.media`,
      {
        id:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `media-${Date.now()}`,
        type: mediaType,
        url: URL.createObjectURL(file),
        file_name: file.name,
        file_size: file.size,
      },
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const removeMedia = () => {
    setValue(`questions.${index}.media`, undefined, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <div className="bg-white rounded-xl border-2 border-red-200 p-5 shadow-sm space-y-5">
      {/* Add Media */}
      <div>
        <label className="block text-sm font-semibold text-slate-800 mb-2">
          {t("app.games.questions.media.title")}
        </label>
        {media ? (
          <div className="flex items-center justify-between gap-3 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50">
            <div className="flex min-w-0 items-center gap-3">
              {media.type === "image" && (
                <img
                  src={media.url}
                  alt={media.file_name}
                  className="h-16 w-16 shrink-0 rounded-lg border border-slate-200 object-cover"
                />
              )}
              <span className="truncate text-sm text-slate-600">
                {media.file_name}
              </span>
            </div>
            <button
              type="button"
              onClick={removeMedia}
              className="shrink-0 p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              aria-label={t("app.games.questions.media.remove")}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-xl py-6 cursor-pointer hover:border-red-300 hover:bg-red-50/20 transition-colors text-slate-500 text-sm text-center px-4">
            <Upload className="w-5 h-5" />
            <span className="truncate max-w-full">
              {t("app.games.questions.media.upload_hint")}
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,video/mp4,audio/mpeg"
              className="hidden"
              onChange={handleMediaUpload}
            />
          </label>
        )}
      </div>

      {/* Question */}
      <div>
        <label className="block text-sm font-semibold text-slate-800 mb-2">
          {t("app.games.questions.question_field.label")}
        </label>
        <textarea
          {...register(`questions.${index}.question`)}
          maxLength={300}
          rows={3}
          placeholder={t("app.games.questions.question_field.placeholder")}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none"
        />
        <div className="flex items-center justify-between mt-1">
          <ErrorLabel errors={errors?.question} />
          <p className="text-xs text-slate-400 ml-auto">
            {question.length}/300 {t("app.games.questions.characters_suffix")}
          </p>
        </div>
      </div>

      {isEssay ? (
        <EssayFields
          register={register}
          errors={errors}
          watch={watch}
          index={index}
          t={t}
        />
      ) : (
        <MultipleChoiceFields
          register={register}
          errors={errors}
          watch={watch}
          index={index}
          t={t}
        />
      )}

      {/* Pusaka Point */}
      <div className="relative">
        <label className="block text-sm font-semibold text-slate-800 mb-2">
          {t("app.games.questions.pusaka_point")}
        </label>
        {/* TODO: put the pusaka points logo here, make it absolute and translate - */}
        {(() => {
          const pointsField = register(`questions.${index}.pusaka_points`, {
            valueAsNumber: true,
          });
          return (
            <Input
              type="number"
              min={0}
              {...pointsField}
              onBlur={(e) => {
                // Keep react-hook-form's own onBlur (touched state, etc.)
                // running as normal...
                pointsField.onBlur(e);
                // ...then, since `min={0}` only blocks the spinner buttons
                // and users can still type or paste a negative number, snap
                // it back to 0 once they leave the field. This is on top of
                // the zod `nonnegative()` check that already flags negative
                // values live while typing (mode: "onChange").
                const value = Number(e.target.value);
                if (!Number.isNaN(value) && value < 0) {
                  setValue(`questions.${index}.pusaka_points`, 0, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }
              }}
              className="w-full py-4"
            />
          );
        })()}
        <ErrorLabel errors={errors?.pusaka_points} />
      </div>
      {attemptedDone && Boolean(errors) && (
        <p className="flex items-center gap-1.5 text-sm font-medium text-red-600">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {t("app.games.questions.has_errors_warning")}
        </p>
      )}
      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 border-slate-100">
        <button onClick={onCancel}>Cancel</button>
        <button
          type="button"
          onClick={handleDone}
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
  register: UseFormRegister<GameDetails>;
  watch: UseFormWatch<GameDetails>;
  index: number;
  t: Translate;
};

type MultipleChoiceFieldsProps = QuestionTypeFieldsProps & {
  errors?: FieldErrors<MultipleChoiceQuestion>;
};

function MultipleChoiceFields({
  register,
  errors,
  watch,
  index,
  t,
}: MultipleChoiceFieldsProps) {
  const letters = ["a", "b", "c", "d"] as const;
  const optionErrors = errors?.options;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-800 mb-2">
          {t("app.games.questions.options.label")}
        </label>
        <div className="space-y-3">
          {letters.map((letter) => {
            const value = watch(`questions.${index}.options.${letter}`) ?? "";

            return (
              <div key={letter} className="flex items-start gap-2">
                <span className="mt-2 text-sm font-semibold text-slate-600 uppercase">
                  {letter}.
                </span>
                <div className="flex-1">
                  <input
                    {...register(`questions.${index}.options.${letter}`)}
                    maxLength={100}
                    placeholder={t("app.games.questions.options.placeholder", {
                      letter: letter.toUpperCase(),
                    })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  />
                  <div className="flex items-center justify-between mt-1">
                    <ErrorLabel errors={optionErrors?.[letter]} />
                    <p className="text-xs text-slate-400 text-right ml-auto">
                      {value.length}/100{" "}
                      {t("app.games.questions.characters_suffix")}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-800 mb-2">
          {t("app.games.questions.correct_answer")}
        </label>
        <select
          {...register(`questions.${index}.correct_answer`)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
        >
          {letters.map((letter) => (
            <option key={letter} value={letter}>
              {letter.toUpperCase()}
            </option>
          ))}
        </select>
        <ErrorLabel errors={errors?.correct_answer} />
      </div>
    </div>
  );
}

type EssayFieldsProps = QuestionTypeFieldsProps & {
  errors?: FieldErrors<EssayQuestion>;
};

function EssayFields({ register, errors, watch, index, t }: EssayFieldsProps) {
  const slots = [0, 1, 2] as const;
  const correctAnswerErrors = errors?.correct_answers;
  const hintErrors = errors?.hints;

  return (
    <div className="space-y-5">
      {/* Correct Answers */}
      <div>
        <label className="block text-sm font-semibold text-slate-800 mb-2">
          {t("app.games.questions.correct_answers.label")}
        </label>
        {/* Array-level error, e.g. "at least one correct answer is
            required" — this isn't tied to any single slot, so it renders
            once above the list rather than per-input. */}
        {correctAnswerErrors?.message && (
          <p className="text-xs text-red-600 mb-2">
            {correctAnswerErrors.message}
          </p>
        )}
        <div className="space-y-3">
          {slots.map((slot) => {
            const value =
              watch(`questions.${index}.correct_answers.${slot}`) ?? "";

            return (
              <div key={slot}>
                <input
                  {...register(`questions.${index}.correct_answers.${slot}`)}
                  maxLength={300}
                  placeholder={t(
                    "app.games.questions.correct_answers.placeholder",
                    { number: slot + 1 },
                  )}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                />
                <div className="flex items-center justify-between mt-1">
                  {correctAnswerErrors?.[slot] && (
                    <p className="text-xs text-red-600">
                      {correctAnswerErrors[slot].message}
                    </p>
                  )}
                  <p className="text-xs text-slate-400 text-right ml-auto">
                    {value.length}/300{" "}
                    {t("app.games.questions.characters_suffix")}
                  </p>
                </div>
              </div>
            );
          })}
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
            <div key={slot} className="flex items-center gap-2">
              <span className="shrink-0 w-8 h-8 rounded-lg bg-amber-100 text-amber-500 flex items-center justify-center">
                <Lightbulb className="w-4 h-4" />
              </span>
              <div className="flex-1">
                <input
                  {...register(`questions.${index}.hints.${slot}`)}
                  maxLength={100}
                  placeholder={t("app.games.questions.hints.placeholder", {
                    number: slot + 1,
                  })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                />
                {hintErrors?.[slot] && (
                  <p className="text-xs text-red-600 mt-1">
                    {hintErrors[slot].message}
                  </p>
                )}
              </div>
            </div>
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
          <textarea
            {...register(`questions.${index}.correct_validation`)}
            maxLength={500}
            rows={3}
            placeholder={t(
              "app.games.questions.validation.correct_placeholder",
            )}
            className="w-full px-3 py-2 bg-slate-50 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all resize-none"
          />
          <div className="flex items-center justify-between mt-1">
            <ErrorLabel errors={errors?.correct_validation} />
            <p className="text-xs text-slate-400 ml-auto">
              {(watch(`questions.${index}.correct_validation`) ?? "").length}
              /500 {t("app.games.questions.characters_suffix")}
            </p>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-sm font-semibold text-red-600 mb-2">
            <X className="w-4 h-4" />
            {t("app.games.questions.validation.incorrect_label")}
          </label>
          <textarea
            {...register(`questions.${index}.incorrect_validation`)}
            maxLength={500}
            rows={3}
            placeholder={t(
              "app.games.questions.validation.incorrect_placeholder",
            )}
            className="w-full px-3 py-2 bg-slate-50 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none"
          />
          <div className="flex items-center justify-between mt-1">
            <ErrorLabel errors={errors?.incorrect_validation} />
            <p className="text-xs text-slate-400 ml-auto">
              {(watch(`questions.${index}.incorrect_validation`) ?? "").length}
              /500 {t("app.games.questions.characters_suffix")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
