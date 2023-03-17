import { Box, Tab, Typography } from "@mui/material";
import { Footer } from "../common/components/footer";
import { useState } from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const ImpactContent = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Box>
      <TabPanel value={value} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
      <TabPanel value={value} index={3}>
        Item Four
      </TabPanel>
      <Footer value={0} handleChange={handleChange}>
        <Tab icon={<Typography>ℹ️</Typography>} label="Sobre" />
        <Tab icon={<Typography>🤳</Typography>} label="Testimoniales" />
        <Tab icon={<Typography>👁️‍🗨️</Typography>} label="Evidencia" />
        <Tab icon={<Typography>💬</Typography>} label="Comentarios" />
      </Footer>
    </Box>
  );
};

const Impact = () => {
  return (
    <Box>
      <Typography variant="h1">Empowered 20 Women Through Boxing.</Typography>
      <ImpactContent />
    </Box>
  );
};

export default Impact;
