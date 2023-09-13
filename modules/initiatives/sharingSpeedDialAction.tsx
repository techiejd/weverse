import { SpeedDialActionProps, SpeedDialAction } from "@mui/material";
import ShareActionArea, {
  ShareProps,
} from "../../common/components/shareActionArea";

export type SharingSpeedDialActionProps = ShareProps & SpeedDialActionProps;

const SharingSpeedDialAction = (props: SharingSpeedDialActionProps) => {
  const { ref, title, text, path, ...others } = props;
  return (
    <ShareActionArea shareProps={{ title, text, path }}>
      <SpeedDialAction {...others} ref={ref} />
    </ShareActionArea>
  );
};

export default SharingSpeedDialAction;
