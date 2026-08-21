import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Post, PostSchema } from "@/types/app/app-home-type";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  HttpError,
  useGetIdentity,
  useResourceParams,
  useTranslate,
} from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Send,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";

import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { useNavigate } from "react-router";
import { cn, getInitials } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const MAX_PICTURES = 10;
const MIN_PICTURES = 1;

function SortableThumbnail({
  id,
  src,
  index,
  currentSlide,
  onClick,
}: {
  id: string;
  src: string;
  index: number;
  currentSlide: number;
  onClick: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <button
      ref={setNodeRef}
      type="button"
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`
        w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2
        transition-colors touch-none cursor-grab active:cursor-grabbing
        ${index === currentSlide ? "border-red-500" : "border-transparent"}
        ${isDragging ? "opacity-50 scale-105" : ""}
      `}
    >
      <img
        src={src}
        alt=""
        draggable={false}
        className="w-full h-full object-cover pointer-events-none"
      />
    </button>
  );
}

export default function AppHomeForm() {
  const t = useTranslate();
  const navigate = useNavigate();
  const { id } = useResourceParams();
  const isEditing = !!id;

  const { data: user, isLoading: userIsLoading } = useGetIdentity();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [saveAsDraft, setSaveAsDraft] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  const {
    refineCore: { onFinish, query, formLoading },
    handleSubmit,
    register,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<Post, HttpError, Post>({
    resolver: zodResolver(PostSchema),
    refineCoreProps: {
      action: isEditing ? "edit" : "create",
      resource: "app-home",
      id,
    },
    defaultValues: {
      status: "draft",
      pictures: [],
      description: "",
    },
  });

  // Once the record loads (edit mode), sync the draft checkbox with its status.
  useEffect(() => {
    const status = query?.data?.data?.status;
    if (status) setSaveAsDraft(status === "draft");
  }, [query?.data?.data?.status]);

  useEffect(() => {
    if (!carouselApi) return;
    setCurrentSlide(carouselApi.selectedScrollSnap());
    carouselApi.on("select", () =>
      setCurrentSlide(carouselApi.selectedScrollSnap()),
    );
  }, [carouselApi]);

  if (userIsLoading) {
    return <Skeleton className={cn("h-10", "w-10", "rounded-full")} />;
  }

  const { name, avatar } = user.user;

  const pictures = watch("pictures") ?? [];
  const description = watch("description") ?? "";
  // we are using id because if id exists; we know it's editing.
  const authorName = id ? query?.data?.data.author.name : name;
  const authorAvatar = id ? query?.data?.data.author.avatar : avatar;
  const createdAt = id ? query?.data?.data.created_at : "";

  const addPictures = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = MAX_PICTURES - pictures.length;
    if (remainingSlots <= 0) return;

    const newUrls = Array.from(files)
      .slice(0, remainingSlots)
      .map((file) => URL.createObjectURL(file));

    const next = [...pictures, ...newUrls];
    setValue("pictures", next, { shouldDirty: true, shouldValidate: true });
    clearErrors("pictures");
  };

  const removePicture = (index: number) => {
    const next = pictures.filter((_, i) => i !== index);
    setValue("pictures", next, { shouldDirty: true, shouldValidate: true });
  };

  const handlePictureDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = pictures.findIndex((picture) => picture === active.id);

    const newIndex = pictures.findIndex((picture) => picture === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(pictures, oldIndex, newIndex);

    setValue("pictures", reordered, {
      shouldDirty: true,
      shouldValidate: true,
    });

    // Keep the carousel focused on the moved picture.
    carouselApi?.scrollTo(newIndex);
  };

  const submit = (status: "draft" | "published") =>
    handleSubmit(async (values) => {
      if (values.pictures.length < MIN_PICTURES) {
        setError("pictures", {
          message: t("app.home.new.picture_min_error"),
        });
        return;
      }

      await onFinish({
        ...values,
        author: { name, avatar },
        status,
      });

      navigate(-1);
    })();

  const onSubmitClick = () => submit(saveAsDraft ? "draft" : "published");

  return (
    <LoadingOverlay loading={formLoading}>
      <form
        className="max-w-3xl mx-auto pb-16"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* Header */}
        <div className="flex items-start gap-3 mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-1 p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">
              {isEditing ? t("app.home.edit.title") : t("app.home.new.title")}
            </h1>
            <p className="text-slate-500 mt-1">
              {isEditing
                ? t("app.home.edit.subtitle")
                : t("app.home.new.subtitle")}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          {/* Author */}
          <div className="flex items-center gap-3">
            <Avatar className="w-9 h-9 bg-red-100">
              {authorAvatar && <AvatarImage src={authorAvatar} alt={name} />}
              <AvatarFallback className="bg-red-100 text-red-700 text-xs font-semibold">
                {getInitials(authorName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-slate-800">{authorName}</p>
              <p className="text-sm text-slate-500">
                {isEditing
                  ? `Created at: ${createdAt}`
                  : t("app.home.new.creating_content")}
              </p>
            </div>
          </div>

          {/* Pictures Carousel */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-slate-700">
                {t("app.home.new.pictures.title")}
              </label>
              <span className="text-xs text-slate-500">
                {pictures.length}/{MAX_PICTURES}
              </span>
            </div>

            {pictures.length > 0 ? (
              <div className="relative rounded-xl overflow-hidden bg-slate-100 aspect-video group">
                <Carousel setApi={setCarouselApi} className="w-full h-full">
                  <CarouselContent className="ml-0 h-full">
                    {pictures.map((picture, index) => (
                      <CarouselItem
                        key={`${picture}-${index}`}
                        className="pl-0 h-full"
                      >
                        <div className="relative w-full h-full">
                          <img
                            src={picture}
                            alt={`Picture ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removePicture(index)}
                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  {pictures.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => carouselApi?.scrollPrev()}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => carouselApi?.scrollNext()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {pictures.map((_, index) => (
                          <span
                            key={index}
                            className={`h-1.5 rounded-full transition-all ${
                              index === currentSlide
                                ? "w-4 bg-white"
                                : "w-1.5 bg-white/60"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </Carousel>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-video rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center gap-2 text-slate-500 hover:border-red-400 hover:text-red-500 transition-colors"
              >
                <ImagePlus className="w-8 h-8" />
                <span className="text-sm font-medium">
                  {t("app.home.new.pictures.upload_cta")}
                </span>
              </button>
            )}

            {/* Thumbnails / add more */}
            {(pictures.length > 0 || pictures.length < MAX_PICTURES) && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handlePictureDragEnd}
                modifiers={[restrictToHorizontalAxis]}
              >
                <SortableContext
                  items={pictures}
                  strategy={horizontalListSortingStrategy}
                >
                  <div className="flex gap-2 mt-3 overflow-x-auto overflow-y-hidden pb-2 h-fit">
                    {pictures.map((picture, index) => (
                      <SortableThumbnail
                        key={picture}
                        id={picture}
                        src={picture}
                        index={index}
                        currentSlide={currentSlide}
                        onClick={() => carouselApi?.scrollTo(index)}
                      />
                    ))}

                    {pictures.length < MAX_PICTURES && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                          "w-16 h-16 shrink-0",
                          "rounded-lg border-2 border-dashed border-slate-300",
                          "flex items-center justify-center",
                          "text-slate-400",
                          "hover:border-red-400 hover:text-red-500",
                          "transition-colors",
                        )}
                      >
                        <ImagePlus className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </SortableContext>
              </DndContext>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => {
                addPictures(e.target.files);
                e.target.value = "";
              }}
            />

            {errors.pictures && (
              <p className="text-sm text-red-600 mt-2">
                {errors.pictures.message as string}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-2">
              {t("app.home.new.description.title")}
            </label>
            <Textarea
              {...register("description")}
              rows={12}
              placeholder={t("app.home.new.description.hint")}
              className="bg-slate-50"
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">
                {errors.description.message as string}
              </p>
            )}
          </div>

          {/* Save as draft */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <Checkbox
              checked={saveAsDraft}
              onCheckedChange={(checked) => setSaveAsDraft(checked === true)}
            />
            <span className="text-sm text-slate-700">
              {t("app.home.new.description.save_as_draft")}
            </span>
          </label>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              {t("app.home.new.description.buttons.cancel")}
            </Button>
            <Button
              type="button"
              onClick={onSubmitClick}
              disabled={isSubmitting || !description}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              <Send className="w-4 h-4" />
              {saveAsDraft
                ? t("app.home.new.description.buttons.draft")
                : t("app.home.new.description.buttons.publish")}
            </Button>
          </div>
        </div>
      </form>
    </LoadingOverlay>
  );
}
