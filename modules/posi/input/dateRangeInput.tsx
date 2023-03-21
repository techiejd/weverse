import React from "react";
import {
  Box,
  TextField,
  Popover,
  InputAdornment,
  IconButton,
} from "@mui/material";
import DateRangeIcon from "@mui/icons-material/DateRange";
import moment from "moment";
import { DateRange, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

export default class DateRangeInput extends React.Component {
  dateFormat = "DD/MM/YYYY";

  state = {
    displayCalendar: false,
    inputValue: "",
    anchorEl: null,
    fromDate: undefined,
    toDate: undefined,
  };

  onAdornmentClick = (e) => {
    this.setState({ displayCalendar: true, anchorEl: e.currentTarget });
  };

  onInputChange = (e) => {
    const inputValue = e.target.value;
    const { fromDate, toDate } = this.processInputValue(inputValue);

    this.setState({ inputValue, fromDate, toDate });
  };

  onPopoverClose = (e, reason) => {
    this.setState({ displayCalendar: false, anchorEl: null });
  };

  onSelectDateRanges: (rangesByKey: RangeKeyDict) => void = ({ selection }) => {
    let { startDate, endDate } = selection;

    startDate = moment(startDate);
    startDate = startDate.isValid() ? startDate.toDate() : undefined;

    endDate = moment(endDate);
    endDate = endDate.isValid() ? endDate.toDate() : undefined;

    let inputValue = "";
    if (startDate) inputValue += moment(startDate).format(this.dateFormat);
    if (endDate) inputValue += " - " + moment(endDate).format(this.dateFormat);

    this.setState({ fromDate: startDate, toDate: endDate, inputValue });
  };

  processInputValue(value) {
    let [fromDate, toDate] = value.split("-").map((elm) => elm.trim());

    fromDate = moment(fromDate, this.dateFormat);
    fromDate = fromDate.isValid() ? fromDate.toDate() : undefined;

    toDate = moment(toDate, this.dateFormat);
    toDate = toDate.isValid() ? toDate.toDate() : undefined;

    return { fromDate, toDate };
  }

  render() {
    return (
      <div>
        <TextField
          label={`${this.dateFormat} - ${this.dateFormat}`}
          fullWidth={true}
          value={this.state.inputValue}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={this.onAdornmentClick}>
                  <DateRangeIcon />
                </IconButton>
              </InputAdornment>
            ),
            readOnly: true,
          }}
          onChange={this.onInputChange}
          onClick={(e) => {
            this.setState({ displayCalendar: true, anchorEl: e.currentTarget });
          }}
        />
        <Popover
          open={this.state.displayCalendar}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          onClose={this.onPopoverClose}
        >
          <Box>
            <DateRange
              ranges={[
                {
                  startDate: this.state.fromDate,
                  endDate: this.state.toDate,
                  key: "selection",
                },
              ]}
              onChange={this.onSelectDateRanges}
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
  }
}
