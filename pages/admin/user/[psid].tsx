import type { GetServerSideProps, NextPage } from "next";
import styles from "../../../styles/Home.module.css";
import ownStyles from "../../../styles/admin.module.css";
import { getUserSnapshot } from "../../../common/db";
import {userData,UserData,ChangesInResources, resourceEnum} from "../../../modules/db/schemas";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { Resource } from "../../../modules/sofia/schemas";
import {z} from 'zod';

export const getServerSideProps : GetServerSideProps = (context) => {
    return getUserSnapshot(String(context.params?.psid)).then(async (usersSnapshot) => {
      return {
        props: {
          userDatas: userData.parse(usersSnapshot.data()),
        },
      };
    });
  }

const User: NextPage<{
    userDatas: UserData;
  }> = (props) => {
    const [target,setTarget]=useState<"Notify" | "Response">("Notify")
    const [inputMessage,setInputMessage]=useState<String>('')
    const [resourcesChange, setResourcesChange] = useState<ChangesInResources>();
    const [selectedResource, setSelectedResource] = useState<Resource | undefined>(undefined);
    const signSchema = z.enum(['+', '-']);
    const [sign, setSign] = useState<z.infer<typeof signSchema>>('+');
    const [inputAmount,setInputAmount] = useState<number>(0)

    const resourceLabels = Object.values(Resource).map((resource) => ({label: resource, value: resource}));
    const resourceNotPickedLabel = {label:"resource", value:undefined};
    const [possibleResourceLabels, setPossibleResourceLabels] = useState([
      resourceNotPickedLabel,
      ...resourceLabels
    ]);
    
    const getNotifyRadio = () => document.getElementById('Notify') as HTMLInputElement;
    const getResponseRadio = () => document.getElementById('Response',) as HTMLInputElement;
    useEffect(() => {
      getNotifyRadio().checked=true;
    },[])

    const notifyRadioClicked = (event: ChangeEvent<HTMLInputElement>) => {
      getResponseRadio().checked = false;
      setTarget('Notify');
    }
    const responseRadioClicked = (event: ChangeEvent<HTMLInputElement>) => {
      getNotifyRadio().checked = false;
      setTarget('Response');
    }

    const handleResourceSelected = (e: ChangeEvent<HTMLSelectElement>) => {
      if (e.target.value == resourceNotPickedLabel.label) {
        return;
      }

      setSelectedResource(resourceEnum.parse(e.target.value));
    }

    const handleAssignedResource = (event: MouseEvent) => {
      event.preventDefault();

      if(selectedResource == null){
        return;
      }

      const changeAmount = sign == "+" ? inputAmount : -inputAmount;
      setResourcesChange({...resourcesChange, [selectedResource as Resource] : changeAmount})

      const newPossibleResourceLabels = possibleResourceLabels.filter((label) => label.label != selectedResource);
      setPossibleResourceLabels(newPossibleResourceLabels);
    }

    const handleDeleteResourceChange = (e: MouseEvent) => {
      const resourceToDelete = resourceEnum.parse(e.currentTarget.id);

      if (resourcesChange) {
        delete resourcesChange[resourceToDelete];
        setResourcesChange(resourcesChange);
      }

      setPossibleResourceLabels([...possibleResourceLabels, {label: resourceToDelete, value: resourceToDelete}]);
    }

   return (
    <div className={styles.container}>
      <main className={styles.main}>
            <div>
                <h1>{props.userDatas.name}</h1>
                <h2>Resources</h2><hr/>
                {Object.entries(props.userDatas.gameInfo.resources).map(([resource, amount]) =>(
                    <div><p>{resource}:{amount}</p><hr/></div>
                ))}
            </div>
            <div>
              <hr/>
                {resourcesChange ? <>
                  {Object.entries(resourcesChange).map((resource)=>(
                    <div className={ownStyles.resource}>
                      <p>{resource}</p>
                      <button className={ownStyles.negativeButton} onClick={handleDeleteResourceChange} id={resource[0]}>-</button>
                    </div>
                  ))}
                </>:<><p>Assign resources in +/-.</p></>}
                <select onChange={handleResourceSelected}>
                  {possibleResourceLabels.map(possibleResource => (
                      <option
                        key={possibleResource.value}
                        value={possibleResource.value}
                        >
                            {possibleResource.label}
                      </option>
                  ))}
                </select>
                <select onChange={(e)=>setSign(signSchema.parse(e.target.value))}>
                      <option value='+' >+</option>
                      <option value='-' >-</option>
                </select>
                <input type="number" id="amount" placeholder={`${inputAmount}`} onChange={(e)=>setInputAmount(Number(e.target.value))}/>
                <button onClick={handleAssignedResource}>↑</button>
                <br/>
            </div>
            <div>
              <hr/>
              <label htmlFor='Notify'>NOTIFY</label>
              <input type="radio" id='Notify' onChange={notifyRadioClicked} />
              <label htmlFor='Response'>RESPONSE</label>
              <input type="radio" id='Response' onChange={responseRadioClicked}/><br/><br/>
              <textarea className={styles.textInput} id="inputMessage" placeholder="message..." onChange={(e)=> setInputMessage(e.target.value)} />
            </div>
       </main>
    </div>
  );
};

export default User;
