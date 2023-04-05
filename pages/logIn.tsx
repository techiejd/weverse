import { useState } from "react";
import AuthDialog from "../modules/auth/AuthDialog";

const Login = () => {
  // Inputs
  const [authDialogOpen, setAuthDialogOpen] = useState(true);
  return (
    <div style={{ marginTop: "200px" }}>
      <AuthDialog open={authDialogOpen} setOpen={setAuthDialogOpen} />
    </div>
  );
};

export default Login;
