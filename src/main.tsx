import { createRoot } from "react-dom/client";
import { Providers } from "./providers";

const container = document.getElementById("root") as HTMLDivElement;

createRoot(container).render(<Providers container={container} />);
