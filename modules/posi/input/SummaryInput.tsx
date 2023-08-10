import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  List,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import { useFormData } from "./context";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useTranslations } from "next-intl";

const SummaryInput = () => {
  const [formData, setFormData] = useFormData();
  const setSummaryInput = (summary: string) => {
    if (setFormData) {
      setFormData((fD) => {
        return { ...fD, summary: summary };
      });
    }
  };
  const inputTranslations = useTranslations("input");
  const summaryTranslations = useTranslations(
    "actions.upload.sections.summary"
  );
  const maxLength = 180;
  return (
    <Box>
      <Typography>
        {inputTranslations("numChars", { numChars: maxLength })}
      </Typography>
      <Accordion sx={{ mt: 1, mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>{summaryTranslations("examples.title")}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List
            sx={{
              listStyleType: "disc",
              pl: 2,
              "& .MuiListItem-root": {
                display: "list-item",
              },
            }}
          >
            <ListItem>{summaryTranslations("examples.1")}</ListItem>
            <ListItem>{summaryTranslations("examples.2")}</ListItem>
            <ListItem>{summaryTranslations("examples.3")}</ListItem>
          </List>
        </AccordionDetails>
      </Accordion>
      <TextField
        required
        fullWidth
        label={summaryTranslations("prompt")}
        inputProps={{ maxLength }}
        value={formData.summary ? formData.summary : ""}
        onChange={(e) => {
          setSummaryInput(e.target.value);
        }}
      />
    </Box>
  );
};

export default SummaryInput;
