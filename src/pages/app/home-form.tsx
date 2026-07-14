import { Post, PostSchema } from "@/types/app/app-home-type";
import { zodResolver } from "@hookform/resolvers/zod";
// import { zodResolver } from "@hookform/resolvers/zod";
import { HttpError, useTranslate } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";

export default function AppHomeForm() {
  const t = useTranslate();

  // form:
  const {
    refineCore: { onFinish, query },
    control,
    handleSubmit,
    register,
  } = useForm<Post, HttpError, Post>({
    resolver: zodResolver(PostSchema),
  });

  const submit = handleSubmit(async (values) => {
    await onFinish(values);
  });

  return <></>;
}
