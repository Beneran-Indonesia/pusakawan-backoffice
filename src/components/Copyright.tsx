export default function Copyright({ className }: { className?: string }) {
  const outYear = 2026;
  const currentYear = new Date().getFullYear();
  const year =
    currentYear === outYear ? `${outYear}` : `${outYear} - ${currentYear}`;
  return (
    <p className={`text-center text-xs md:text-sm text-gray-500 my-2 ${className}`}>
      Copyrights © {year} Pusakawan
    </p>
  );
}
