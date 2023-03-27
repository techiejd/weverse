import React, { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import {
  Box,
  TextField,
  Popover,
  InputAdornment,
  IconButton,
} from "@mui/material";
import DateRangeIcon from "@mui/icons-material/DateRange";
import moment, { now } from "moment";
import { DateRange, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { useFormData } from "./context";

const DateRangeInput = () => {
  const [formData, setFormData] = useFormData();
  const dateFormat = "DD/MM/YYYY";
  const [state, setState] = useState<{
    displayCalendar: boolean;
    inputValue: string;
    anchorEl: HTMLDivElement | HTMLButtonElement | null;
    fromDate: Date | undefined;
    toDate: Date | undefined;
  }>({
    displayCalendar: false,
    inputValue: "",
    anchorEl: null,
    fromDate: moment().toDate(),
    toDate: moment().toDate(),
  });

  useEffect(() => {
    if (
      formData.dates &&
      (formData.dates.start != state.fromDate ||
        formData.dates.end != state.toDate)
    ) {
      setState((s) => {
        return {
          ...s,
          fromDate: formData.dates!.start,
          toDate: formData.dates!.end,
        };
      });
    }
  }, [state.fromDate, state.toDate, setState, formData.dates]); // For when form data kicks in

  const onAdornmentClick = (e: MouseEvent<HTMLButtonElement>) => {
    setState((s) => ({
      ...s,
      displayCalendar: true,
      anchorEl: e.currentTarget,
    }));
  };

  const processInputValue = (value: string) => {
    const [fromDateString, toDateString] = value
      .split("-")
      .map((elm) => elm.trim());

    const fromDateMoment = moment(fromDateString, dateFormat);
    const fromDate = fromDateMoment.isValid()
      ? fromDateMoment.toDate()
      : undefined;

    const toDateMoment = moment(toDateString, dateFormat);
    const toDate = toDateMoment.isValid() ? toDateMoment.toDate() : undefined;

    return { fromDate, toDate };
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const { fromDate, toDate } = processInputValue(inputValue);

    setState((s) => ({ ...s, inputValue, fromDate, toDate }));
  };

  const onPopoverClose = () => {
    setState((s) => ({ ...s, displayCalendar: false, anchorEl: null }));
  };

  const onSelectDateRanges = ({ selection }: RangeKeyDict) => {
    console.log("AYOOO");
    const { startDate: startDateSelection, endDate: endDateSelection } =
      selection;

    const startDateMoment = moment(startDateSelection);
    const startDate = startDateMoment.isValid()
      ? startDateMoment.toDate()
      : undefined;

    const endDateMoment = moment(endDateSelection);
    const endDate = endDateMoment.isValid()
      ? endDateMoment.toDate()
      : undefined;

    let inputValue = "";
    if (startDate) inputValue += moment(startDate).format(dateFormat);
    if (endDate) inputValue += " - " + moment(endDate).format(dateFormat);

    setState((s) => ({
      ...s,
      fromDate: startDate,
      toDate: endDate,
      inputValue,
    }));

    if (setFormData)
      setFormData((s) => ({
        ...s,
        dates: {
          start: startDate,
          end: endDate,
        },
      }));
  };

  return (
    <div>
      <TextField
        label={`${dateFormat} - ${dateFormat}`}
        fullWidth={true}
        value={state.inputValue}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={onAdornmentClick}>
                <DateRangeIcon />
              </IconButton>
            </InputAdornment>
          ),
          readOnly: true,
        }}
        onChange={onInputChange}
        onClick={(e) => {
          setState((s) => ({
            ...s,
            displayCalendar: true,
            anchorEl: e.currentTarget,
          }));
        }}
      />
      <Popover
        open={state.displayCalendar}
        anchorEl={state.anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={onPopoverClose}
      >
        <Box>
          <DateRange
            ranges={[
              {
                startDate: state.fromDate,
                endDate: state.toDate,
                key: "selection",
              },
            ]}
            onChange={onSelectDateRanges}
            maxDate={new Date()}
            minDate={
              new Date(new Date().setFullYear(new Date().getFullYear() - 1))
            }
            showMonthAndYearPickers={true}
          />
        </Box>
      </Popover>
    </div>
  );
};

export default DateRangeInput;
