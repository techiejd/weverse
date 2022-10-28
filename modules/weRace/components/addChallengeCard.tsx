import React, { MouseEvent, ChangeEvent } from "react";
import weraceStyles from "../../../styles/werace.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const AddChallengeCard: React.FC<{
  setDisableAddChallenge: React.Dispatch<React.SetStateAction<boolean>>;
  setStartDate: React.Dispatch<React.SetStateAction<Date>>;
  startDate: Date;
  setEndDate: React.Dispatch<React.SetStateAction<Date>>;
  endDate: Date;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setInputHashtag: React.Dispatch<React.SetStateAction<string>>;
  inputHashtag: string;
  setHashtags: React.Dispatch<React.SetStateAction<Array<string>>>;
  hashtags: Array<string>;
  processAddChallenge: React.MouseEventHandler<HTMLButtonElement>;
}> = (props) => {
  const incNumHashtags = (e: MouseEvent) => {
    e.preventDefault();

    props.setHashtags([...props.hashtags, props.inputHashtag]);
  };

  const decNumHashtags = (e: MouseEvent) => {
    e.preventDefault();

    if (props.hashtags.length > 0) {
      props.hashtags.pop();
      props.setHashtags([...props.hashtags]);
    }
  };

  const handleHashtagChange = (e: ChangeEvent, input: string, i: number) => {
    e.preventDefault();

    const element = document.getElementById(`hashtag${i}`) as HTMLInputElement;

    const isInvalid = (() => {
      const re = /^\w+$/; // ReGex for aZ09 and '_' in line
      return !re.test(input) && input != "";
    })();
    if (isInvalid) {
      element.value = props.inputHashtag;
      return;
    }

    props.setInputHashtag(input);
    props.hashtags[i] = input;
  };
  const filterEndDatePassedTime = (time: any) => {
    const selectedDate = new Date(time);
    return props.startDate.getTime() < selectedDate.getTime();
  };
  return (
    <div className={weraceStyles.addChallenge}>
      <br />
      <div className={weraceStyles.datePicker}>
        <h3>Start: </h3>
        <DatePicker
          selected={props.startDate}
          onChange={(date) => {
            if (date) {
              props.setStartDate(date);
            }
          }}
          selectsStart
          startDate={props.startDate}
          endDate={props.endDate}
          showTimeSelect
          dateFormat="MMMM d, yyyy h:mm aa"
        />
      </div>
      <hr />
      <div className={weraceStyles.datePicker}>
        <h3>End: </h3>
        <DatePicker
          selected={props.endDate}
          onChange={(date) => {
            if (date) {
              props.setEndDate(date);
            }
          }}
          selectsEnd
          startDate={props.startDate}
          endDate={props.endDate}
          minDate={props.startDate}
          filterTime={filterEndDatePassedTime}
          showTimeSelect
          dateFormat="MMMM d, yyyy h:mm aa"
        />
      </div>
      <hr />
      <label htmlFor="title">Title: </label>
      <input
        type="text"
        placeholder="Title"
        id="title"
        name="title"
        onChange={(event) => props.setTitle(event.target.value)}
      />
      <hr />
      <div className={weraceStyles.count}>
        <button onClick={decNumHashtags}>
          <RemoveIcon color="action" />
        </button>
        <div>
          <h2>Add hash tags</h2>
          <p>Only Letter,Numbers,Underscore</p>
        </div>
        <button onClick={incNumHashtags}>
          <AddIcon color="action" />
        </button>
      </div>
      {props.hashtags.map((hashtag, i) => (
        <div className={weraceStyles.hashtags} key={i}>
          <label htmlFor={`hashtag${i}`}>{i + 1} #: </label>
          <input
            type="text"
            placeholder="Enter hashtag here."
            id={`hashtag${i}`}
            name="hashtags"
            onChange={(e) => handleHashtagChange(e, e.target.value, i)}
          />
          <p>
            = "#{props.hashtags[i].toLowerCase()}" in all searches and rankings
          </p>
        </div>
      ))}
      <br />
      <button onClick={props.processAddChallenge}>Guardar</button>
      <button onClick={() => props.setDisableAddChallenge(true)}>
        Cancelar
      </button>
    </div>
  );
};

export default AddChallengeCard;
