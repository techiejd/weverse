import { FunctionComponent } from "react";
import { Menu, Dropdown, Button, Input } from "antd";
import { DownOutlined } from "@ant-design/icons";
import styles from "../modules/misc.module.css";

const Div: FunctionComponent = () => {
  return (
    <div className={styles.div}>
      <h2 className={styles.div1}>
        <b className={styles.whatKindOf}>
          What kind of impact projects would you like to support?
        </b>
      </h2>
      <Dropdown
        className={styles.span}
        overlay={
          <Menu>
            {([{ value: "World Wide" }] as any).map(
              (option: any, index: number) => (
                <Menu.Item key={index}>
                  <a onClick={(e) => e.preventDefault()}>
                    {option.value || ""}
                  </a>
                </Menu.Item>
              )
            )}
          </Menu>
        }
        placement="bottomLeft"
        trigger={["hover"]}
      >
        <Button onClick={(e) => e.preventDefault()}>
          {`World Wide `}
          <DownOutlined />
        </Button>
      </Dropdown>
      <label className={styles.location}>Location:</label>
      <div className={styles.label}>
        <Input
          className={styles.input}
          type="text"
          style={{ width: "329px" }}
          size="middle"
          placeholder="Education, Sustainability, Gender equality"
          bordered={false}
        />
      </div>
      <a className={styles.seeMore}>See more</a>
      <a className={styles.educationWrapper}>
        <div className={styles.education}>Education</div>
      </a>
      <a className={styles.sustainabilityWrapper}>
        <div className={styles.education}>Sustainability</div>
      </a>
      <div className={styles.hungerWrapper}>
        <div className={styles.education}>Hunger</div>
      </div>
    </div>
  );
};

export default Div;
