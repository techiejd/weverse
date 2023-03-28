import { Box, Tab, Typography } from "@mui/material";
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
    <Footer value={props.value}>
      <EmojiTab emoji="ℹ️" href="/posi/about" label="Sobre" />
      <EmojiTab emoji="🤳" href="/posi/testimonials" label="Testimoniales" />
      <EmojiTab emoji="👁️‍🗨️" href="/posi/evidence" label="Evidencia" />
      <EmojiTab emoji="💬" href="/posi/comments" label="Comentarios" />
    </Footer>
  );
};

const ImpactPage = (props: { type: Types; children: ReactNode }) => {
  return (
    <Box>
      {props.children}
      <NavigationFooter value={props.type} />
    </Box>
  );
};

export default ImpactPage;
