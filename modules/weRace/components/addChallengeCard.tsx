import React, { MouseEvent, ChangeEvent, useState } from "react";
import weraceStyles from "../../../styles/werace.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { challenge } from "../../sofia/schemas";
import { challengeData, ChallengeData } from "../../db/schemas";

const AddChallengeCard: React.FC<{
  addNewChallenge: (challenge: ChallengeData) => void;
}> = (props) => {
  const [inputState, setInputState] = useState<
    "closed" | "editing" | "waiting"
  >("closed");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [title, setTitle] = useState<string>("");
  const [inputHashtag, setInputHashtag] = useState<string>("");
  const [hashtags, setHashtags] = useState<Array<string>>([]);
  const incNumHashtags = (e: MouseEvent) => {
    e.preventDefault();

    setHashtags([...hashtags, inputHashtag]);
  };

  const decNumHashtags = (e: MouseEvent) => {
    e.preventDefault();

    if (hashtags.length > 0) {
      hashtags.pop();
      setHashtags([...hashtags]);
    }
  };

  const processAddChallenge = async (e: MouseEvent) => {
    e.preventDefault();

    if (title == "") {
      alert("The title of the challenge cannot be empty!");
      return;
    }
    for (const i in hashtags) {
      if (hashtags[i] == "") {
        alert("Hashtags must be specified");
        return;
      }
    }

    const newChallenge = challenge.parse({
      // TODO(jimenez1917): find some check.
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      title: title,
      hashtags: hashtags,
    });

    setInputState("waiting");
    setStartDate(new Date());
    setEndDate(new Date());
    setTitle("");
    setInputHashtag("");
    setHashtags([]);

    fetch("/api/weRace", {
      method: "POST",
      body: JSON.stringify(newChallenge),
    }).then((response) => {
      if (!response.ok) {
        response.text().then((text) => alert(text));
      }
      response.json().then((json) => {
        setInputState("closed");
        props.addNewChallenge(
          challengeData.parse({ ...newChallenge, id: json.challengeId })
        );
      });
    });

    return true;
  };

  const handleHashtagChange = (e: ChangeEvent, input: string, i: number) => {
    e.preventDefault();

    const element = document.getElementById(`hashtag${i}`) as HTMLInputElement;

    const isInvalid = (() => {
      const re = /^\w+$/; // ReGex for aZ09 and '_' in line
      return !re.test(input) && input != "";
    })();
    if (isInvalid) {
      element.value = inputHashtag;
      return;
    }

    setInputHashtag(input);
    hashtags[i] = input;
  };
  const filterEndDatePassedTime = (time: any) => {
    const selectedDate = new Date(time);
    return startDate.getTime() < selectedDate.getTime();
  };
  return (
    <>
      {inputState == "closed" ? (
        <>
          <button onClick={() => setInputState("editing")}>Add New Race</button>
        </>
      ) : (
        <>
          {inputState == "waiting" ? (
            <>
              <button disabled={true}>Wait to add new race</button>
            </>
          ) : (
            <div className={weraceStyles.addChallenge}>
              <br />
              <div className={weraceStyles.datePicker}>
                <h3>Start: </h3>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => {
                    if (date) {
                      setStartDate(date);
                    }
                  }}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  showTimeSelect
                  dateFormat="MMMM d, yyyy h:mm aa"
                />
              </div>
              <hr />
              <div className={weraceStyles.datePicker}>
                <h3>End: </h3>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => {
                    if (date) {
                      setEndDate(date);
                    }
                  }}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
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
                onChange={(event) => setTitle(event.target.value)}
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
              {hashtags.map((hashtag, i) => (
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
                    ={" "}
                    {`"#${hashtags[
                      i
                    ].toLowerCase()}" in all searches and rankings`}
                  </p>
                </div>
              ))}
              <br />
              <button onClick={processAddChallenge}>Guardar</button>
              <button onClick={() => setInputState("closed")}>Cancelar</button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default AddChallengeCard;
