import dayjs from "dayjs";

const currencyFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatCurrency = (
  value: string | number | null | undefined,
): string => {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "";
  }

  return currencyFormatter.format(numericValue);
};

export const formatDate = (
  value: string | null | undefined,
): string => {
  if (!value) {
    return "";
  }

  const date = dayjs(value);

  return date.isValid() ? date.format("DD.MM.YYYY") : "";
};