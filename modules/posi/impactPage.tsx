import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Paper,
  Tab,
  Typography,
} from "@mui/material";
import { Footer } from "../../common/components/footer";
import { z } from "zod";
import { ReactNode } from "react";

export enum PageTypes {
  about,
  testimonial,
  evidence,
  comments,
}

const Types = z.nativeEnum(PageTypes);
export type Types = z.infer<typeof Types>;

interface LinkTabProps {
  label: string;
  href: string;
  emoji: string;
}

function EmojiTab(props: LinkTabProps) {
  return <Tab icon={<Typography>{props.emoji}</Typography>} {...props} />;
}

const NavigationFooter = (props: { value: number }) => {
  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation showLabels value={props.value}>
        <BottomNavigationAction
          icon={<Typography>{"ℹ️"}</Typography>}
          href="/posi/about"
          label="Sobre"
        />
        <BottomNavigationAction
          icon={<Typography>{"🤳"}</Typography>}
          href="/posi/testimonials"
          label="Testimoniales"
        />
        <BottomNavigationAction
          icon={<Typography>{"👁️‍🗨️"}</Typography>}
          href="/posi/evidence"
          label="Evidencia"
        />
        <BottomNavigationAction
          icon={<Typography>{"💬"}</Typography>}
          href="/posi/comments"
          label="Comentarios"
        />
      </BottomNavigation>
    </Paper>
  );
};

const ImpactPage = (props: { type: Types; children: ReactNode }) => {
  return (
    <Box sx={{ pb: 7 }}>
      {props.children}
      <NavigationFooter value={props.type} />
    </Box>
  );
};

export default ImpactPage;
