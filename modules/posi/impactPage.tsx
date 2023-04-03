import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Paper,
  Typography,
} from "@mui/material";
import { z } from "zod";
import { ReactNode } from "react";
import ImpactPageProvider from "./impactPage/context";

export enum PageTypes {
  about,
  testimonial,
  evidence,
  comments,
}

const Types = z.nativeEnum(PageTypes);
export type Types = z.infer<typeof Types>;

interface EmojiNavigationActionProps {
  label: string;
  href: string;
  emoji: string;
}

function EmojiNavigationAction(props: EmojiNavigationActionProps) {
  return (
    <BottomNavigationAction
      icon={<Typography>{props.emoji}</Typography>}
      {...props}
    />
  );
}

const NavigationFooter = (props: { value: number; id: string }) => {
  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation showLabels value={props.value}>
        <EmojiNavigationAction
          emoji={"ℹ️"}
          href={`/posi/${props.id}/about`}
          label="Sobre"
        />
        <EmojiNavigationAction
          emoji={"🤳"}
          href={`/posi/${props.id}/testimonials`}
          label="Testimoniales"
        />
        <EmojiNavigationAction
          emoji={"👁️‍🗨️"}
          href={`/posi/${props.id}/evidence`}
          label="Evidencia"
        />
        <EmojiNavigationAction
          emoji={"💬"}
          href={`/posi/${props.id}/comments`}
          label="Comentarios"
        />
      </BottomNavigation>
    </Paper>
  );
};

const ImpactPage = (props: {
  id: string;
  type: Types;
  path: string;
  description?: string;
  title?: string;
  children: ReactNode;
}) => {
  return (
    <Box sx={{ pb: 7 }}>
      <ImpactPageProvider
        text={props.description}
        url={props.path}
        title={props.title ? props.title : "OneWe - Proof of Social Impact"}
      >
        {props.children}
        <NavigationFooter value={props.type} id={props.id} />
      </ImpactPageProvider>
    </Box>
  );
};

export default ImpactPage;
