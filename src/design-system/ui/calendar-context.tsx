"use client";

import * as React from "react";

interface CalendarContextValue {
  disabledDayTooltip?: string;
}

const CalendarContext = React.createContext<CalendarContextValue>({});

export { CalendarContext, type CalendarContextValue };
