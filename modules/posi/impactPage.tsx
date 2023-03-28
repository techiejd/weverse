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

const NavigationFooter = (props: { value: number }) => {
  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation showLabels value={props.value}>
        <EmojiNavigationAction emoji={"ℹ️"} href="/posi/about" label="Sobre" />
        <EmojiNavigationAction
          emoji={"🤳"}
          href="/posi/testimonials"
          label="Testimoniales"
        />
        <EmojiNavigationAction
          emoji={"👁️‍🗨️"}
          href="/posi/evidence"
          label="Evidencia"
        />
        <EmojiNavigationAction
          emoji={"💬"}
          href="/posi/comments"
          label="Comentarios"
        />
      </BottomNavigation>
    </Paper>
  );
};

const ImpactPage = (props: {
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
        title={props.title ? props.title : "OneWe Share Link."}
      >
        {props.children}
        <NavigationFooter value={props.type} />
      </ImpactPageProvider>
    </Box>
  );
};

export default ImpactPage;
