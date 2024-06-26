import { LOCALE } from "@config";

interface DatetimesProps {
  pubDatetime: string | Date;
  modDatetime?: string | Date | undefined | null;
}

interface Props extends DatetimesProps {
  size?: "sm" | "lg";
  className?: string;
}

export default function Datetime({
  pubDatetime,
  modDatetime,
  size = "sm",
  className,
}: Props) {
  const isUpdated = modDatetime && modDatetime > pubDatetime;

  return (
    <div className={`flex items-center space-x-1 opacity-80 ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`${
          size === "sm" ? "scale-90" : "scale-100"
        } inline-block h-6 w-6 min-w-[1.375rem] fill-skin-base`}
        aria-hidden="true"
      >
        <path d="M7 11h2v2H7zm0 4h2v2H7zm4-4h2v2h-2zm0 4h2v2h-2zm4-4h2v2h-2zm0 4h2v2h-2z"></path>
        <path d="M5 22h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2zM19 8l.001 12H5V8h14z"></path>
      </svg>
      {isUpdated ? (
        <>
          <span className={`italic ${size === "sm" ? "text-xs" : "text-sm"}`}>
            <FormattedDatetime pubDatetime={pubDatetime} />
          </span>
          <span
            className={`italic ${size === "sm" ? "text-xs" : "text-sm"} pl-2`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`${
                size === "sm" ? "scale-90" : "scale-100"
              } inline-block h-6 w-6 min-w-[1.375rem] fill-transparent opacity-90 stroke-current stroke-2`}
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
              <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
            </svg>
          </span>
          <span className={`italic ${size === "sm" ? "text-xs" : "text-sm"}`}>
            <FormattedDatetime pubDatetime={modDatetime} />
          </span>
        </>
      ) : (
        <>
          <span className={`italic ${size === "sm" ? "text-xs" : "text-sm"}`}>
            <FormattedDatetime pubDatetime={pubDatetime} />
          </span>
        </>
      )}
    </div>
  );
}

const FormattedDatetime = ({ pubDatetime, modDatetime }: DatetimesProps) => {
  const myDatetime = new Date(
    modDatetime && modDatetime > pubDatetime ? modDatetime : pubDatetime
  );

  const date = myDatetime.toLocaleDateString(LOCALE.langTag, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      <time dateTime={myDatetime.toISOString()}>{date}</time>
    </>
  );
};
