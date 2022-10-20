import adminStyles from "../../../../styles/admin.module.css";
import { ChangesInResources, resourceEnum } from "../../../db/schemas";
import {
  ChangeEvent,
  MouseEvent,
  useState,
  FC,
  SetStateAction,
  Dispatch,
} from "react";
import { Resource } from "../../../sofia/schemas";
import { z } from "zod";

export const Assign: FC<{
  resourcesChange: ChangesInResources;
  setResourcesChange: Dispatch<SetStateAction<ChangesInResources>>;
}> = (props) => {
  const [selectedResource, setSelectedResource] = useState<
    Resource | undefined
  >(undefined);

  const signSchema = z.enum(["+", "-"]);
  const [sign, setSign] = useState<z.infer<typeof signSchema>>("+");
  const [inputAmount, setInputAmount] = useState<number>(0);

  const resourceLabels = Object.values(Resource).map((resource) => ({
    label: resource,
    value: resource,
  }));
  const resourceNotPickedLabel = { label: "resource", value: undefined };
  const [possibleResourceLabels, setPossibleResourceLabels] = useState([
    resourceNotPickedLabel,
    ...resourceLabels,
  ]);
  const handleResourceSelected = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value == resourceNotPickedLabel.label) {
      return;
    }

    setSelectedResource(resourceEnum.parse(e.target.value));
  };

  const handleAssignedResource = (event: MouseEvent) => {
    event.preventDefault();

    if (selectedResource == null) {
      return;
    }

    const changeAmount = sign == "+" ? inputAmount : -inputAmount;
    props.setResourcesChange({
      ...props.resourcesChange,
      [selectedResource as Resource]: changeAmount,
    });

    const newPossibleResourceLabels = possibleResourceLabels.filter(
      (label) => label.label != selectedResource
    );
    setPossibleResourceLabels(newPossibleResourceLabels);
  };

  const handleDeleteResourceChange = (e: MouseEvent) => {
    const resourceToDelete = resourceEnum.parse(e.currentTarget.id);

    if (props.resourcesChange) {
      delete props.resourcesChange[resourceToDelete];
      props.setResourcesChange(props.resourcesChange);
    }

    setPossibleResourceLabels([
      ...possibleResourceLabels,
      { label: resourceToDelete, value: resourceToDelete },
    ]);
  };

  return (
    <div>
      <hr />
      {props.resourcesChange ? (
        <>
          {Object.entries(props.resourcesChange).map((resource, i) => (
            <div className={adminStyles.resource} key={i}>
              <p>{resource}</p>
              <button
                className={adminStyles.negativeButton}
                onClick={handleDeleteResourceChange}
                id={resource[0]}
              >
                -
              </button>
            </div>
          ))}
        </>
      ) : (
        <>
          <p>Assign resources in +/-.</p>
        </>
      )}
      <select onChange={handleResourceSelected}>
        {possibleResourceLabels.map((possibleResource) => (
          <option key={possibleResource.value} value={possibleResource.value}>
            {possibleResource.label}
          </option>
        ))}
      </select>
      <select onChange={(e) => setSign(signSchema.parse(e.target.value))}>
        <option value="+">+</option>
        <option value="-">-</option>
      </select>
      <input
        type="number"
        id="amount"
        placeholder={`${inputAmount}`}
        onChange={(e) => setInputAmount(Number(e.target.value))}
      />
      <button onClick={handleAssignedResource}>↑</button>
      <br />
    </div>
  );
};
