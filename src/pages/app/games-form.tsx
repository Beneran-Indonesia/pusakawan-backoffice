import {
  GameDetails,
  GameDetailsSchema,
} from "@/types/app/app-game-details-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { HttpError, useTranslate } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";

export default function AppGamesForm() {
  const t = useTranslate();

  // form:
  const {
    refineCore: { onFinish, query },
    control,
    handleSubmit,
    register,
  } = useForm<GameDetails, HttpError, GameDetails>({
    resolver: zodResolver(GameDetailsSchema),
  });

  const submit = handleSubmit(async (values) => {
    await onFinish(values);
  });
  return <></>;
}
