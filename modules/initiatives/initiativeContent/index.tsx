import { Grid } from "@mui/material";
import { useState, useEffect } from "react";
import ImpactCard from "../../posi/action/card";
import { Content } from "../../posi/content";
import SocialProofCard from "../../posi/socialProofCard";
import { useCurrentActions, useCurrentTestimonials } from "../context";
import moment from "moment";

const InitiativeContent = () => {
  const [actions] = useCurrentActions();
  const [socialProofs] = useCurrentTestimonials();
  const [actionsContent, setActionsContent] = useState<Content[]>([]);
  const [socialProofsContent, setSocialProofsContent] = useState<Content[]>([]);
  const [content, setContent] = useState<Content[]>([]);

  useEffect(() => {
    if (actions && actions.length > 0) {
      setActionsContent(
        actions.map((action) => ({
          type: "action",
          data: action,
          createdAt: action.createdAt ? action.createdAt : moment().toDate(),
        }))
      );
    }
  }, [actions, setActionsContent]);
  useEffect(() => {
    if (socialProofs && socialProofs.length > 0) {
      setSocialProofsContent(
        socialProofs.map((socialProof) => ({
          type: "testimonial",
          data: socialProof,
          createdAt: socialProof.createdAt
            ? socialProof.createdAt
            : moment().toDate(),
        }))
      );
    }
  }, [socialProofs, setSocialProofsContent]);

  useEffect(() => {
    setContent(
      [...actionsContent, ...socialProofsContent].sort(
        (a, b) => b.createdAt!.getTime() - a.createdAt!.getTime()
      )
    );
  }, [actionsContent, socialProofsContent, setContent]);

  return (
    <Grid container spacing={1}>
      {content.map((c, idx) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          key={c.data.path ? c.data.path : idx}
        >
          {c.type == "action" ? (
            <ImpactCard posiData={c.data} />
          ) : (
            <SocialProofCard socialProof={c.data} showInitiative={false} />
          )}
        </Grid>
      ))}
    </Grid>
  );
};

export default InitiativeContent;
