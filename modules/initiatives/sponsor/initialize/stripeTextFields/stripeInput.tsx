// modified from https://github.com/mui/material-ui/issues/16037

import React from "react";
import { InputBaseComponentProps } from "@mui/material/InputBase";

type Props = InputBaseComponentProps & {
  component: React.FunctionComponent<InputBaseComponentProps>;
  options: Record<string, unknown>;
};

const StripeInputComponent = React.forwardRef(
  (props: Props, ref): JSX.Element => {
    const { component: Component, options, ...other } = props;
    const [mountNode, setMountNode] = React.useState<HTMLInputElement | null>(
      null
    );

    React.useImperativeHandle(
      ref,
      () => ({
        focus: () => {
          if (mountNode === null) {
            return;
          }

          mountNode.focus();
        },
      }),
      [mountNode]
    );

    return (
      <Component
        onReady={setMountNode}
        options={{
          ...options,
        }}
        {...other}
      />
    );
  }
);
StripeInputComponent.displayName = "StripeInputComponent";

export default StripeInputComponent;
