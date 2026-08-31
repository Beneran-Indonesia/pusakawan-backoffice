import { FieldError } from "react-hook-form";

export default function ErrorLabel({ errors }: { errors?: FieldError }) {
  if (!errors) return null;
  if (!errors.message) return null;
  return <p className="text-xs text-red-600 mt-2"> {errors.message} </p>;
}
