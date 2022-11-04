import type { GetServerSideProps, NextPage } from "next";
import styles from "../../../styles/Home.module.css";
import { getChallenge, getDraftTxById } from "../../../common/db";
import cardStyles from "../../../styles/card.module.css";

import { count, CountInfo } from "../../../modules/weRace/vote/utils/count";
import Link from "next/link";
import { challenge } from "../../../modules/sofia/schemas";
import {
  DraftTransaction,
  draftTransactionExtended,
} from "../../../modules/db/schemas";
import adminStyles from "../../../styles/admin.module.css";
import {
  getDataByType,
  getMessage,
  getResourcesChange,
} from "../../../modules/admin/utils";

export const getServerSideProps: GetServerSideProps = (context) => {
  const draftTransaction = String(context.params?.id);
  return getDraftTxById(draftTransaction).then(async (draftTxSnapshot) => {
    return {
      props: {
        draftTx: draftTransactionExtended.parse(draftTxSnapshot.data()),
      },
    };
  });
};

const User: NextPage<{ draftTx: DraftTransaction }> = (props) => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>DraftTransaction</h1>
        <div className={adminStyles.boxTransactions}>
          {getDataByType(props.draftTx, "message") == undefined ? (
            <></>
          ) : (
            <div>
              <h2>Message</h2>
              <p>Type: {getMessage(props.draftTx).type} </p>
              <p>{getMessage(props.draftTx).text}</p>
              {getMessage(props.draftTx).buttons?.map((buttonInfo, i) => (
                <div key={i}>
                  <h3>Button {i}</h3>
                  <p>{buttonInfo.title}</p>
                  <p>{buttonInfo.url ? buttonInfo.url : buttonInfo.payload}</p>
                </div>
              ))}
            </div>
          )}
          {getDataByType(props.draftTx, "resourcesChange") == undefined ? (
            <></>
          ) : (
            <ul>
              {Object.entries(getResourcesChange(props.draftTx)).map(
                (resource, i) => (
                  <li key={i}>
                    <div>
                      {resource}
                      <hr />
                    </div>
                  </li>
                )
              )}
            </ul>
          )}
          <p>
            <b>Created At: </b>
            {props.draftTx.createdAt}
          </p>
          <p>
            <b>Route: </b> {props.draftTx.route}
          </p>
        </div>
        <br />
        <Link href={`/admin/draftTransactions`}>
          <button>ALL DRAFT TRANSACTIONS</button>
        </Link>
      </main>
    </div>
  );
};

export default User;
