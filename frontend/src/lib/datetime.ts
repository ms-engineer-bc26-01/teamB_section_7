const JST_TIME_ZONE = "Asia/Tokyo";
const FALLBACK_DATETIME_TEXT = "日時未設定";

const pad2 = (value: number): string => String(value).padStart(2, "0");

const getDateTimePartsInJst = (
  iso: string,
): {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
} => {
  const parts = new Intl.DateTimeFormat("ja-JP", {
    timeZone: JST_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date(iso));

  const find = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    year: find("year"),
    month: find("month"),
    day: find("day"),
    hour: find("hour"),
    minute: find("minute"),
  };
};

export const formatDateTimeInJst = (iso: string): string =>
  (() => {
    if (!iso) {
      return FALLBACK_DATETIME_TEXT;
    }

    const parsed = new Date(iso);
    if (Number.isNaN(parsed.getTime())) {
      return FALLBACK_DATETIME_TEXT;
    }

    return new Intl.DateTimeFormat("ja-JP", {
      timeZone: JST_TIME_ZONE,
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(parsed);
  })();

export const toIsoFromJstDateTime = (
  dateValue: string,
  timeValue: string,
): string => {
  const [year, month, day] = dateValue.split("-").map(Number);
  const [hour, minute] = timeValue.split(":").map(Number);

  // Build UTC instant from a JST date/time value.
  const utcTimestamp = Date.UTC(year, month - 1, day, hour - 9, minute, 0);
  return new Date(utcTimestamp).toISOString();
};

export const splitIsoToJstDateTime = (
  iso: string,
): { date: string; time: string } => {
  const { year, month, day, hour, minute } = getDateTimePartsInJst(iso);
  return {
    date: `${year}-${month}-${day}`,
    time: `${hour}:${minute}`,
  };
};

export const getTodayDateInJst = (): string => {
  const now = new Date();
  const jstNow = new Date(
    now.toLocaleString("en-US", {
      timeZone: JST_TIME_ZONE,
    }),
  );

  return `${jstNow.getFullYear()}-${pad2(jstNow.getMonth() + 1)}-${pad2(jstNow.getDate())}`;
};
